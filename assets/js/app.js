/**
 * 雨的小天地 - 共用前端腳本 (assets/js/app.js)
 * 嚴格使用原生 JavaScript，無額外依賴框架。
 */

const App = {
  categories: [],
  posts: [],

  // 初始化資料庫
  async init() {
    try {
      const [catRes, postRes] = await Promise.all([
        fetch('data/categories.json'),
        fetch('data/posts.json')
      ]);

      if (!catRes.ok || !postRes.ok) {
        throw new Error('無法載入網站資料');
      }

      this.categories = await catRes.json();
      this.categories.sort((a, b) => a.order - b.order);

      this.posts = await postRes.json();
      // 確保日期由新到舊
      this.posts.sort((a, b) => new Date(b.date) - new Date(a.date));

      // 渲染全站共用頂部導覽列
      this.renderNav();
    } catch (err) {
      console.error('初始化失敗:', err);
    }
  },

  // 頂部導覽列（動態從 categories.json 產生，不寫死）
  renderNav() {
    const navLinksContainer = document.getElementById('nav-links');
    if (!navLinksContainer) return;

    const currentUrl = new URLSearchParams(window.location.search);
    const activeCat = currentUrl.get('c');

    let html = `
      <li><a href="index.html" class="nav-pill ${!activeCat && window.location.pathname.endsWith('index.html') ? 'active' : ''}">🏠 首頁</a></li>
    `;

    this.categories.forEach(cat => {
      const isActive = activeCat === cat.id ? 'active' : '';
      html += `
        <li>
          <a href="category.html?c=${encodeURIComponent(cat.id)}" class="nav-pill ${isActive}" data-color="${cat.color}">
            <span>${cat.emoji}</span>
            <span>${cat.name}</span>
          </a>
        </li>
      `;
    });

    navLinksContainer.innerHTML = html;
  },

  // 取得分類資訊
  getCategory(id) {
    return this.categories.find(c => c.id === id);
  },

  // 渲染首頁 (index.html)
  async initHome() {
    await this.init();

    // 1. 讀取並渲染 content/about.md
    const aboutEl = document.getElementById('about-content');
    if (aboutEl) {
      try {
        const res = await fetch('content/about.md');
        if (res.ok) {
          const md = await res.text();
          aboutEl.innerHTML = this.renderMarkdown(md);
        } else {
          aboutEl.innerHTML = '<p>歡迎來到我的個人作品集與手帳記錄！</p>';
        }
      } catch (e) {
        aboutEl.innerHTML = '<p>歡迎來到我的個人作品集與手帳記錄！</p>';
      }
    }

    // 2. 渲染五個分類卡片
    const catGrid = document.getElementById('categories-grid');
    if (catGrid) {
      catGrid.innerHTML = this.categories.map(cat => {
        const count = this.posts.filter(p => p.category === cat.id).length;
        return `
          <a href="category.html?c=${encodeURIComponent(cat.id)}" class="category-card" data-color="${cat.color}">
            <div class="category-card-top">
              <span class="category-emoji">${cat.emoji}</span>
              <span class="category-name">${cat.name}</span>
            </div>
            <div class="category-desc">${cat.description}</div>
            <div class="category-card-bottom">
              <span>瀏覽分類 &rarr;</span>
              <span class="post-count-badge">${count} 篇</span>
            </div>
          </a>
        `;
      }).join('');
    }

    // 3. 渲染最新文章（最多 6 篇）
    const recentList = document.getElementById('recent-posts-list');
    if (recentList) {
      const recentPosts = this.posts.slice(0, 6);
      if (recentPosts.length === 0) {
        recentList.innerHTML = '<p>目前尚無文章。</p>';
      } else {
        recentList.innerHTML = recentPosts.map(post => this.createPostCardHtml(post)).join('');
      }
    }
  },

  // 渲染分類頁 (category.html)
  async initCategory() {
    await this.init();

    const params = new URLSearchParams(window.location.search);
    const catId = params.get('c');
    const category = this.getCategory(catId);

    const titleEl = document.getElementById('category-title');
    const descEl = document.getElementById('category-desc');
    const listEl = document.getElementById('category-posts-list');
    const filterEl = document.getElementById('tag-filter-bar');

    // 找不到分類時友善提示
    if (!category) {
      if (titleEl) titleEl.textContent = '找不到該分類';
      if (descEl) descEl.innerHTML = '這個分類似乎不存在。<br><br><a href="index.html" class="nav-pill">👈 回首頁</a>';
      if (listEl) listEl.innerHTML = '';
      if (filterEl) filterEl.innerHTML = '';
      return;
    }

    // 設定頁面標題與說明
    document.title = `${category.name}｜雨的小天地`;
    if (titleEl) titleEl.textContent = `${category.emoji} ${category.name}`;
    if (descEl) descEl.textContent = category.description;

    const catPosts = this.posts.filter(p => p.category === catId);

    // 收集所有標籤
    const tagsSet = new Set();
    catPosts.forEach(p => (p.tags || []).forEach(t => tagsSet.add(t)));
    const tags = Array.from(tagsSet);

    // 渲染標籤篩選按鈕
    if (filterEl && tags.length > 0) {
      filterEl.innerHTML = `
        <span style="font-weight: 700; margin-right: 4px;">🔖 標籤篩選：</span>
        <button class="filter-btn active" data-tag="all">全部 (${catPosts.length})</button>
        ${tags.map(t => `<button class="filter-btn" data-tag="${t}">#${t}</button>`).join('')}
      `;

      filterEl.addEventListener('click', (e) => {
        if (!e.target.classList.contains('filter-btn')) return;
        filterEl.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');

        const selectedTag = e.target.getAttribute('data-tag');
        const filtered = selectedTag === 'all'
          ? catPosts
          : catPosts.filter(p => (p.tags || []).includes(selectedTag));

        this.renderPostList(listEl, filtered);
      });
    }

    this.renderPostList(listEl, catPosts);
  },

  renderPostList(container, posts) {
    if (!container) return;
    if (posts.length === 0) {
      container.innerHTML = '<div class="journal-card"><p>這個分類目前還沒有文章喔！</p></div>';
      return;
    }
    container.innerHTML = posts.map(post => this.createPostCardHtml(post)).join('');
  },

  // 渲染文章頁 (post.html)
  async initPost() {
    await this.init();

    const params = new URLSearchParams(window.location.search);
    const postId = params.get('p'); // 例如: works/2026-11-10-fju-links-hub
    const post = this.posts.find(p => p.id === postId || p.slug === postId);

    const postContentEl = document.getElementById('post-content');
    if (!post || !postContentEl) {
      if (postContentEl) {
        postContentEl.innerHTML = `
          <div class="journal-card" style="text-align: center; padding: 50px 20px;">
            <h2>🍃 找不到這篇文章</h2>
            <p style="margin: 20px 0;">這篇文章可能已經移動或尚未發布。</p>
            <a href="index.html" class="nav-pill">👈 回首頁</a>
          </div>
        `;
      }
      return;
    }

    document.title = `${post.title}｜雨的小天地`;
    const cat = this.getCategory(post.category);

    // 取得同一分類的文章做上一篇 / 下一篇
    const catPosts = this.posts.filter(p => p.category === post.category);
    const currentIndex = catPosts.findIndex(p => p.id === post.id);
    const prevPost = currentIndex > 0 ? catPosts[currentIndex - 1] : null;
    const nextPost = currentIndex < catPosts.length - 1 ? catPosts[currentIndex + 1] : null;

    // 音樂區塊 HTML
    let musicHtml = '';
    if (post.music && post.music.title) {
      musicHtml = `
        <div class="music-card">
          <div class="music-info">
            <span class="music-icon">🎵</span>
            <div>
              <div class="music-title">${post.music.title}</div>
              <div class="music-artist">歌手 / 頻道：${post.music.artist || '未知'}</div>
            </div>
          </div>
          ${post.music.url ? `<a href="${post.music.url}" target="_blank" rel="noopener noreferrer" class="music-link-btn">▶️ 前往聆聽</a>` : ''}
        </div>
      `;
    }

    // 讀取 Markdown 內容並消毒渲染
    let bodyHtml = '<p>載入文章內容中...</p>';
    try {
      // 確保路徑正確對應 GitHub Pages 子目錄或相對路徑
      let cleanPath = post.path;
      if (cleanPath.startsWith('/')) {
        cleanPath = '.' + cleanPath; // 把開頭的 / 換成 ./
      } else if (!cleanPath.startsWith('./') && !cleanPath.startsWith('http')) {
        cleanPath = './' + cleanPath;
      }
      
      const res = await fetch(cleanPath);
      if (res.ok) {
        const rawMd = await res.text();
        // 移除 Front matter (開頭 --- ... ---)
        const cleanedMd = rawMd.replace(/^---[\s\S]*?---\s*/, '');
        bodyHtml = this.renderMarkdown(cleanedMd);
      } else {
        bodyHtml = '<p>無法讀取文章本體內容。</p>';
      }
    } catch (e) {
      bodyHtml = '<p>讀取文章檔案時發生錯誤。</p>';
    }

    const tagsHtml = (post.tags || []).map(t => `<span class="badge-tag badge-tag-item">#${t}</span>`).join(' ');

    postContentEl.innerHTML = `
      <article class="journal-card">
        <div class="washi-tape"></div>
        <div class="post-detail-header">
          <div class="post-meta">
            <span>📅 ${post.date}</span>
            ${cat ? `<a href="category.html?c=${encodeURIComponent(cat.id)}" class="badge-tag badge-category">${cat.emoji} ${cat.name}</a>` : ''}
          </div>
          <h1 class="post-detail-title">${post.title}</h1>
          <div class="post-footer-tags">${tagsHtml}</div>
        </div>

        ${musicHtml}

        <div class="markdown-body">
          ${bodyHtml}
        </div>

        <div class="post-navigation">
          ${prevPost ? `<a href="post.html?p=${encodeURIComponent(prevPost.id)}" class="nav-post-btn">👈 上一篇：${prevPost.title}</a>` : '<span></span>'}
          <a href="category.html?c=${encodeURIComponent(post.category)}" class="nav-post-btn">📂 回到 ${cat ? cat.name : '分類'}</a>
          ${nextPost ? `<a href="post.html?p=${encodeURIComponent(nextPost.id)}" class="nav-post-btn">下一篇：${nextPost.title} 👉</a>` : '<span></span>'}
        </div>
      </article>
    `;
  },

  // 渲染單篇卡片 HTML
  createPostCardHtml(post) {
    const cat = this.getCategory(post.category);
    const tagsHtml = (post.tags || []).map(t => `<span class="badge-tag badge-tag-item">#${t}</span>`).join(' ');

    return `
      <article class="post-item">
        <div class="post-meta">
          <span>📅 ${post.date}</span>
          ${cat ? `<a href="category.html?c=${encodeURIComponent(cat.id)}" class="badge-tag badge-category">${cat.emoji} ${cat.name}</a>` : ''}
        </div>
        <h3 class="post-title">
          <a href="post.html?p=${encodeURIComponent(post.id)}">${post.title}</a>
        </h3>
        <p class="post-summary">${post.summary || ''}</p>
        <div class="post-footer-tags">
          ${tagsHtml}
        </div>
      </article>
    `;
  },

  // Markdown 渲染與安全消毒 (marked + DOMPurify)
  renderMarkdown(md) {
    if (typeof marked !== 'undefined' && typeof DOMPurify !== 'undefined') {
      const rawHtml = marked.parse(md);
      return DOMPurify.sanitize(rawHtml);
    }
    // 後備方案
    return `<pre>${md}</pre>`;
  }
};
