# CLAUDE.md｜雨的小天地（個人作品集＋部落格）

> 給 Claude Code 與 AI 代理的專案開發與協作指南。
> 本專案的核心不是單次刻板網頁（Vibe Coding），而是建立一套標準化規則系統，讓 AI 與作者能持續以一致的品質與結構新增文章、專案與頁面。

---

## 1. 專案核心理念（規則系統 vs Vibe Coding）

- **內容與表現完全分離**：所有文章與作品一律撰寫為 Markdown，放置於 `content/<分類代號>/`；前端頁面（`index.html`、`category.html`、`post.html`）僅作模板渲染，不寫死任何文章內容。
- **單一真相來源 (Single Source of Truth)**：
  - 分類設定唯一來源：`data/categories.json`。
  - 文章索引唯一來源：由 `scripts/build_index.py` 自動掃描產生的 `data/posts.json`（**嚴禁手動編輯**）。
- **零依賴與純靜態**：專為 **GitHub Pages** 打造，全站使用原生 HTML/CSS/JS，路徑一律使用**相對路徑**（禁止以 `/` 開頭）。

---

## 2. 常用操作與指令

### 🚀 新增一篇內容（兩種方式）
1. **指令自動化新增**（推薦，自動建立模板並重構索引）：
   ```bash
   python scripts/new_post.py --category works --title "專案名稱" --slug "project-slug" --tags "網頁開發,AI" --summary "專案一句話摘要"
   ```
2. **手動建立**：
   在 `content/<分類代號>/` 建立 `YYYY-MM-DD-<slug>.md`，填妥 Front matter，隨後執行：
   ```bash
   python scripts/build_index.py
   ```

### 💻 本機預覽
```bash
python -m http.server 8000
# 瀏覽器開啟 http://localhost:8000
```

---

## 3. 文章 Front matter 規範

每篇 Markdown 開頭必須具備標準 YAML 格式：

```markdown
---
title: 文章或作品標題（40字內）
date: YYYY-MM-DD
category: works       # 必須與所在資料夾完全一致：writeup | works | reflections | learning | entertainment
tags: [網頁開發, 輔大] # 1~4 個標籤
summary: 一句話摘要，顯示於卡片列表（60字內）
cover: ""            # 可選封面圖片路徑
draft: false         # true 則不發布
---
```

若為音樂或影音分享（主要於 `entertainment`），可選填 `music` 區塊：
```markdown
music:
  title: 歌名或頻道名
  artist: 創作者
  url: https://www.youtube.com/watch?v=...
```

---

## 4. 視覺風格與設計限制（溫暖手帳風）

全站樣式定義於 `assets/css/style.css`，嚴格遵守以下設計規範：
- **調色盤（Design Tokens）**：
  - `--bg: #E4DCCC`（柔和方格紙底色）
  - `--card: #FBF7EE`（奶油卡片底色）
  - `--ink: #2B5B76`（主要字體與 3px 實線邊框）
  - `--ink-soft: #5C7A8C`（次要文字）
  - `--pink: #F4B3C2`、`--blue: #8ECFE3`、`--mint: #7FCDC5`（分類主題色與裝飾）
  - `--yellow: #F7E5A8`（螢光筆標記與紙膠帶）
- **外觀特徵**：卡片圓角 20px 以上、3px ink 邊框、柔和偏移陰影、CSS 斜角半透明紙膠帶裝飾。
- **程式碼字體**：等寬字體（JetBrains Mono / Consolas）；內文字體：Google Fonts Noto Sans TC。
- **手機適配**：響應式設計，確保 375px 小螢幕版面舒適無橫向捲軸。

---

## 5. AI 開發行為準則

1. **不可做**：
   - 嚴禁手動修改 `data/posts.json`。
   - 嚴禁在 HTML 寫死分類或文章連結。
   - 嚴禁使用 `/` 開頭的絕對路徑。
   - 嚴禁引入需 npm build 的前端框架（React/Vue/Tailwind 等）。
2. **一定要做**：
   - 新增文章後一律執行 `python scripts/build_index.py`。
   - 修改完成後同步更新 `NOTES.md`。
   - 保持友善、正向、嚴謹的工程風格。
