# 🌧️ 雨的小天地（個人作品集＋部落格）

這是一個為作者「雨」量身打造的溫暖手帳風格個人作品集與學習部落格，專門記錄解題 Writeup、網站專案作品、學習心得與日常生活創作。

---

## 📖 特色與技術亮點

- **溫暖手帳風設計**：奶油紙質卡片、手帳方格底紋、純 CSS 紙膠帶裝飾與螢光筆效果。
- **純靜態架構**：不依賴後端伺服器與資料庫，專為 **GitHub Pages** 免費無痛託管而設計。
- **無前端繁複建置流程**：不需 npm / webpack / vite，開箱即用。
- **安全高效的 Markdown 渲染**：文章直接撰寫 Markdown，透過 CDN 引入的 `marked` 渲染，並經過 `DOMPurify` 嚴格消毒防禦 XSS。
- **純 Python 標準庫索引**：透過 `build_index.py` 即可自動產出分類與文章清單。

---

## 🚀 本機預覽方式

在專案根目錄下，開啟終端機（PowerShell 或 CMD）執行：

```bash
python -m http.server 8000
```

接著在瀏覽器打開：`http://localhost:8000` 即可預覽網站。

*(註：因瀏覽器安全限制直接以 file:// 開啟會阻擋 fetch 讀取 JSON/Markdown，因此需使用上述 Python 伺服器預覽)*

---

## 📝 新增文章流程

1. 在 `content/<分類代號>/` 新增 Markdown 檔案，檔名規則：`YYYY-MM-DD-<slug>.md`。
2. 填寫 Front matter 欄位（`title`, `date`, `category`, `tags`, `summary`）。
3. 執行索引更新指令：
   ```bash
   python scripts/build_index.py
   ```
4. 重新整理網頁即可看見新文章！

---

## 🌐 部署到 GitHub Pages

1. 在 GitHub 上建立一個新的公開 Repository（例如 `rain-portfolio`）。
2. 在本專案資料夾內將代碼推送到該 Repository：
   ```bash
   git init
   git add .
   git commit -m "初始化：雨的小天地個人作品集部落格"
   git branch -M main
   git remote add origin https://github.com/<你的GitHub帳號>/rain-portfolio.git
   git push -u origin main
   ```
3. 前往 GitHub Repository 的 **Settings** → **Pages**，將 Branch 設定為 `main` 分支與 `/ (root)`。
4. 等候約 1~2 分鐘，即可透過 `https://<你的GitHub帳號>.github.io/rain-portfolio/` 訪問網站！
