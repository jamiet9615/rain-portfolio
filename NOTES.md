# 專案進度日誌 (NOTES.md)

本檔案記錄網站建置與更新歷程，方便後續工作接軌。

---

## [2026-11-10] 規則系統強化與真實作品資料匯入

### 🎯 本次升級重點（呼應「規則系統 vs Vibe Coding」作業目標）
1. **建立雙規範手冊**：
   - 專案同時具備 `AGENTS.md` 與 `CLAUDE.md`，無論使用哪種 AI 輔助工具（Claude Code, Gemini, Copilot 等），AI 都能第一時間理解專案規範與工作流。
2. **新增內容自動化擴充腳本 (`scripts/new_post.py`)**：
   - 實現「依照同一套方式，很快地繼續製作新內容」之精神。使用者或 AI 僅需輸入一行指令，即可依照標準 Front matter 產生範本並自動觸發 `build_index.py` 重建索引。
3. **匯入作者真實專案與作品集**：
   - [輔大新生全攻略捷徑平台](content/works/2026-11-10-fju-freshman-platform.md)（串接 Vercel）
   - [校園二手書交易平台](content/works/2026-11-10-secondhand-book.md)（GitHub Pages + Google Apps Script）
   - [扭蛋貪吃蛇農場小遊戲](content/works/2026-11-10-gacha-snake-ranch.md)（Google AI Studio 協作開發）
   - [繪畫創作與 YouTube 頻道日常](content/entertainment/2026-11-10-art-and-youtube.md)（YouTube + IG @j_ie_06）
   - [學習與生活心得隨筆](content/reflections/2026-11-10-learning-notes-instagram.md)（IG @maddiexu113）
4. **全站索引更新**：
   - 執行 `scripts/build_index.py`，成功索引共 8 篇真實作品與文章。
5. **文件更新**：
   - [README.md](README.md) 增加「規則系統 vs Vibe Coding」的詳細對照分析，向批改者明確傳達架構設計思想。

---

## [2026-11-10] 初次專案建置與靜態網站架構完成

### 完成項目
1. **專案規格與規則確立**：依據 `AGENTS.md` 規範完成目錄結構規劃與技術限制設置。
2. **分類配置 (`data/categories.json`)**：設定五大分類及其主題色彩。
3. **手帳視覺系統 (`assets/css/style.css`)**：方格紙底紋、奶油卡片、純 CSS 斜角紙膠帶、螢光筆標記。
4. **共用前端邏輯 (`assets/js/app.js`)**：動態讀取分類與文章、DOMPurify 消毒、上一篇/下一篇導航。
5. **部署準備**：純靜態、相對路徑，零前端編譯框架，相容 GitHub Pages。
