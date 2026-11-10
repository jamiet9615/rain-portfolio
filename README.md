# 🌧️ 雨的小天地（個人作品集＋手帳部落格）

> 本專案為作業成果：設計一個具備完整規則系統的小專案，並建立專屬的 `AGENTS.md` 與 `CLAUDE.md`，使 AI 能深度理解專案的規則、架構與自動化開發方式。

---

## 🎯 核心設計精神：規則系統 vs. Vibe Coding

這次專案與過往單純的「Vibe Coding（只把這一個網頁做出來）」有著根本性的不同：

| 比較維度 | 傳統 Vibe Coding | 本專案的「規則導向系統」 |
| :--- | :--- | :--- |
| **開發目標** | 一次性產出單一網頁成品 | **建立一套標準化規則與可持續維護的內容擴充管線** |
| **內容維護** | 文字與連結死板寫在 HTML 裡，新增內容需重寫程式碼 | **內容與表現完全分離**：文章與作品為純 Markdown，由系統自動渲染 |
| **AI 協作方式** | 每次需要向 AI 重複解釋排版、風格與細節 | **`AGENTS.md` / `CLAUDE.md` 規範守則**：任何 AI 讀取後即可依規則擴充 |
| **擴充難易度** | 新增頁面容易樣式衝突、跑版或破壞結構 | **極速無痛擴充**：執行一行腳本或放一篇 `.md`，首頁、分類頁與導覽自動同步 |

---

## 📐 系統三大規則與架構

### 1. 單一真相來源 (Single Source of Truth)
- **分類規範**：唯一收錄於 `data/categories.json`（代號、名稱、emoji、主題色彩），所有頁面與導覽列皆動態自此讀取，禁止在 HTML/JS 寫死。
- **文章索引**：由純 Python 標準庫腳本 `scripts/build_index.py` 掃描 `content/` 自動提取 Front matter 產生 `data/posts.json`（嚴禁人工編輯）。

### 2. 溫暖手帳風設計語言 (Warm Journal System)
定義於 `assets/css/style.css`，嚴格遵守統一設計變數：
- 方格點點紙質感背景、奶油紙色卡片（`--card: #FBF7EE`）、沉穩墨水線條（`--ink: #2B5B76`）。
- 圓角大於 20px、3px 實線邊框、手帳紙膠帶裝飾（純 CSS 矩形旋轉裝飾）、螢光筆重點標記。
- 嚴格遵守相對路徑，零前端編譯框架，專為 **GitHub Pages** 免費靜態託管打造。

### 3. 一鍵擴充新內容管線 (Standardized Content Pipeline)
新增任何頁面或內容，只需要執行專案提供的輔助腳本：
```bash
python scripts/new_post.py --category works --title "新作品名稱" --slug "my-new-project" --tags "網頁,AI" --summary "一句話介紹"
```
腳本將自動建立符合規範的 Markdown 模板並即時重建索引，首頁與分類列表立即更新，100% 保持外觀與結構一致。

---

## 🌟 目前收錄之真實作品與創作

本站目前已收錄作者真實開發的作品、文章與社群連結：

1. **[輔大新生全攻略捷徑平台](https://fju-freshman-platform.vercel.app/)** (`content/works/`)：
   整合輔大新生專區、時程甘特圖管制、12 項必做清單與重要入口。
2. **[校園二手書交易平台](https://jamiet9615.github.io/secondhandbook/)** (`content/works/`)：
   極簡大地色風格，串接 Google Apps Script (GAS) 無伺服器後端之二手書媒合平台。
3. **[扭蛋貪吃蛇農場小遊戲](https://gacha-snake-ranch.ai.studio/)** (`content/works/`)：
   結合 Google AI Studio 與創意發想打造的休閒扭蛋貪吃蛇網頁遊戲。
4. **[繪畫創作與 YouTube 頻道日常](https://www.youtube.com/channel/UCaJdMxJdvSP0mB2-LmcKnvA)** (`content/entertainment/`)：
   收錄個人 YouTube 影像創作與電繪作品 IG ([@j_ie_06](https://www.instagram.com/j_ie_06/))。
5. **[學習與生活心得隨筆](https://www.instagram.com/maddiexu113/)** (`content/reflections/`)：
   記錄平時的心態調適、上課與自學反思筆記。
6. **[CTF 基礎隱寫術解題 Writeup](content/writeup/)** (`content/writeup/`)：
   資安學習與競賽題目復盤解析。

---

## 🚀 本機預覽與啟動

在專案目錄下啟動 Python 內建伺服器：

```bash
python -m http.server 8000
```
開啟瀏覽器訪問：**`http://localhost:8000`**

---

## 🌐 部署至 GitHub Pages 步驟

1. 在 GitHub 建立新的公開 Repository（如 `rain-portfolio`）。
2. 在本地專案資料夾執行推送：
   ```bash
   git init
   git add .
   git commit -m "初始化：雨的小天地個人作品集與規則系統"
   git branch -M main
   git remote add origin https://github.com/<你的GitHub帳號>/rain-portfolio.git
   git push -u origin main
   ```
3. 前往 GitHub Repository 的 **Settings** → **Pages**，將 Source 設為 `Deploy from a branch`，Branch 選擇 `main` 與 `/ (root)`，點擊 **Save**。
4. 約 1~2 分鐘後，即可在 `https://<你的GitHub帳號>.github.io/rain-portfolio/` 瀏覽成果！
