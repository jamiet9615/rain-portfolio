# 專案進度日誌 (NOTES.md)

本檔案記錄網站建置與更新歷程，方便後續工作接軌。

---

## [2026-11-10] 初次專案建置與靜態網站架構完成

### 完成項目
1. **專案規格與規則確立**：依據 `AGENTS.md` 規範完成目錄結構規劃與技術限制設置。
2. **分類配置 (`data/categories.json`)**：設定五大分類（writeup, works, reflections, learning, entertainment）及其對應的主題色彩、圖示與說明。
3. **首頁自我介紹 (`content/about.md`)**：建立作者「雨」的 3 句話簡介，無洩漏個人隱私資訊。
4. **手帳視覺系統 (`assets/css/style.css`)**：
   - 實作手帳方格紙背景紋理（Dots pattern）。
   - 定義 8 組官方設計色彩變數（`--bg`, `--card`, `--ink`, `--pink`, `--blue`, `--mint`, `--yellow` 等）。
   - 手帳卡片、純 CSS 斜角紙膠帶裝飾、螢光筆重點樣式、圓角邊框與柔和陰影。
   - 響應式手機排版（支援 375px 小螢幕）與無障礙動態支援。
5. **共用前端交互邏輯 (`assets/js/app.js`)**：
   - 頁首導覽動態讀取分類配置，支援目前分類標註。
   - 首頁動態渲染：自介 Markdown 渲染、5 大分類卡片計數、最新 6 篇文章。
   - 分類頁動態過濾：依 URL 參數 `?c=` 載入，提供標籤（Tags）即時篩選。
   - 文章頁完整渲染：依 URL 參數 `?p=` 載入，整合 `marked` 解析、`DOMPurify` 消毒、音樂卡片、上一篇/下一篇導航。
6. **頁面模板**：建立 `index.html`、`category.html`、`post.html`，皆符合純相對路徑與純靜態部署標準。
7. **文章索引產生器 (`scripts/build_index.py`)**：使用純 Python 標準函式庫，自動掃描 `content/` 並產生 `data/posts.json`。
8. **初始示範文章**：
   - `content/works/2026-11-10-fju-links-hub.md`
   - `content/writeup/2026-11-10-ctf-first-flag.md`
   - `content/entertainment/2026-11-10-rainy-cafe-music.md`（包含音樂播放欄位）

### 目前狀態
- [x] 所有核心靜態頁面與手帳風格樣式完備。
- [x] 本機索引已執行並成功產出 `data/posts.json`（共 3 篇文章）。
- [x] 完全符合 GitHub Pages 部署要求（純靜態、相對路徑、無 Node 建置依賴）。

### 下次待辦 / 後續工作
- 協助使用者將專案推送到 GitHub Repository 並啟用 GitHub Pages。
- 依使用者需求匯入累積的 Writeup 或新作品文章。
