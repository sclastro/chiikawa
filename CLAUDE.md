# CLAUDE.md

《ちいかわ》繁體中文（香港）非官方資料站。純靜態網站：HTML + CSS + 原生 JavaScript，沒有框架、沒有建置步驟、沒有 npm 依賴。功能與內容總覽見 `README.md`；本檔記錄修改時要知道的架構、慣例與已踩過的坑。

## 語言與文字

- 站內文字、程式註解、commit 訊息一律用繁體中文（香港用語），標點用全形；技術名詞與程式碼保留英文。
- 介紹與評析用書面語；只有互動位置刻意用口語（例如「你係邊隻？」「搵唔到」），不要統一改掉。
- 事實與粉絲推測要分開標示（`data/stories.js` 的 `caveat` 欄位即為此用）。

## 架構

```
*.html          10 個頁面，各自只載入需要的資料檔與頁面腳本
data/*.js       全部內容，以 window.CHIIKAWA_* 全域變數輸出（刻意用 .js 而非 .json，雙擊開檔亦不受 CORS 限制）
assets/js/app.js        全站共用：頂欄、底部分頁列、目錄與搜尋面板、頁內分頁、裝飾、工具函數
assets/js/<頁面>.js     各頁渲染，監聽 app:ready 之後才注入內容
assets/css/tokens.css   設計 token（顏色、字體、間距、圓角、描邊），改這裏即全站生效
assets/css/base.css     reset、版面、頂欄、底部分頁列、搜尋面板、頁尾、裝飾層、浮現動效
assets/css/components.css  按鈕、標籤、卡片、目錄磚、分頁列、摺疊清單、時間軸等
assets/css/pages.css    各頁專用版面
```

- **載入次序**：資料檔 → `app.js` → 頁面腳本。`app.js` 在 DOMContentLoaded 時注入導航，派發 `app:ready`；頁面腳本在該事件內同步渲染；之後 `app.js` 才處理錨點跳轉與 scroll-padding。新頁面要沿用同一模式。
- **站點結構**集中在 `app.js` 的 `SITE`（目錄面板、首頁目錄磚、頁尾共用）與 `TABS`（手機底部分頁列）。新增頁面要在這兩處加一筆，否則導航不會出現。
- **頁內分頁**：用 `App.tabbarHTML(items)` 產生分頁列，渲染完成後呼叫 `App.initTabs(bar)`。分頁 id 即 `#hash`，舊連結（`reference.html#study`、`stories.html#arc-seiren`、`world.html#food-2` 等）都依賴這些 id，改名會令站內連結與搜尋結果失效。
- **`App.goTo(id)`** 會先切換到目標所屬分頁、展開所屬 `<details>`，再捲動。任何「跳到頁內某處」都經它處理，不要直接 `scrollIntoView`。
- **全站搜尋**的索引在 `app.js` 的 `buildIndex()`；首次開啟面板時才以 `ensureData()` 補載其他頁面的資料檔。新增資料類型要在這裏加索引，並確保目標元素有對應 id。
- **新增角色**：在 `data/characters.js` 加一筆；`relations` 的 `id` 必須是已存在的角色；要在關係圖顯示，還要在 `assets/js/relations.js` 的 `POS` 加座標（viewBox 1000×740）。

## 程式慣例

- 原生 ES5 風格（`var`、`function`、IIFE 包裹、`'use strict'`），與現有程式一致；不要引入框架、打包工具或 npm 依賴。
- **所有由資料寫入 DOM 的文字都要經 `App.esc()`**。HTML 以字串拼接產生，漏了就是 XSS。
- 角色圖一律用 `App.avatar(c)` 或 `App.face(c, size)`：它們帶 `data-tint`，供「相框填色」與「載入失敗後備色」使用。
- 顏色只用 `tokens.css` 的變數，不要在元件內寫死新色值。

## 設計系統（「ちいかわ 貼紙簿」）

- 標題、按鈕、標籤用粉圓體 Huninn，正文用 Noto Sans TC，拉丁字配 Nunito。**Huninn 只有一個字重**：標題保持 `font-weight: 400` 與 `font-synthesis: none`，不要設 700，否則瀏覽器會造假粗體。
- Huninn 用獨立的 `<link>` 載入，不要併入其他字體的網址：Google Fonts 合併網址中只要有一個字體出錯，整條網址會全部失效。
- 貼紙語言：啡色描邊 `--c-outline`、不規則圓角 `--r-wob`、實色落影。
- **對比度**：連結與強調字用 `--c-accent-deep`（任何粉彩底上 ≥ 4.96:1）；`--c-accent` 只作填色與圖形，不作文字色；粉彩色只作底色。改色前先計算對比度。
- 動效必須尊重 `prefers-reduced-motion`；`base.css` 末段已統一處理，新增動畫時沿用 CSS animation／transition 即可。

## 已踩過的坑（改動相關位置時要留意）

- **頂欄釘頂**：`position: sticky` 要設在 `[data-nav]` 容器，而不是內層 `<nav>`；否則黏性範圍只得容器本身的高度，等於沒有生效。
- **錨點被遮**：釘頂分頁列的高度由 `app.js` 的 `initScrollPadding()` 實時量度並寫入 `scroll-padding-top`，不要改回寫死數值。
- **浮現動畫 vs hover**：隱藏狀態只寫在 `.reveal:not(.is-in)`，浮現完成後 `app.js` 加上 `.reveal-done` 撤走規則。若把 transform 寫在 `.is-in` 狀態，特異度會蓋過 `:hover` 與卡片本身的傾斜。
- **角色圖不是透明底**：16 張都是不透明 PNG，部分有草地或粉紅色背景。`app.js` 讀取每張圖左上角的顏色填滿相框（`paintFrame`）。以 `file://` 開啟時 canvas 讀不到像素，相框維持白色，屬預期行為。圖片要放在有框的容器內，不要直接放在粉彩底上。
- **裝飾層**：`App.deco()` 以固定種子排位，只放在邊緣地帶；`.has-deco > :where(:not(.deco))` 刻意用 `:where()` 壓低特異度，避免覆蓋元件自己的絕對定位（例如首頁舞台的太陽、雲、草坡）。
- **首頁大標題**用容器單位（`cqi`）按文字欄闊度定字級，確保第二行 12 字不會剩「活。」孤字；改標題字數要同步調整除數 `12.6`。

## 本機預覽與驗證

```cmd
python -m http.server 8000
```

雲端環境已預裝 Chromium 與 Playwright（`/opt/node22/lib/node_modules/playwright`，瀏覽器在 `/opt/pw-browsers`，不要執行 `playwright install`）。改動後至少做這幾項：

- 每個頁面在 360px 與 1280px 闊度：沒有 `pageerror`、`scrollWidth` 不超過視窗闊度。
- 深層連結：例如 `reference.html#study-2` 開啟後，該條參照要已展開，且不被分頁列遮住。
- 搜尋面板：輸入關鍵字有結果，點擊後可跳轉（包括同頁跳轉）。
- 性格測驗：可以完整答完十題並出結果。

雲端環境經代理上網：Playwright 要設 `ignoreHTTPSErrors: true` 才載入得到 Google Fonts；字體下載間中很慢，只檢查錯誤時可用 `context.route()` 攔截 `fonts.googleapis.com`／`fonts.gstatic.com` 以加快速度。github.io 在雲端環境被代理攔截，無法直接開啟線上版確認。

## 部署

- `.github/workflows/pages.yml` 只從**預設分支**部署到 GitHub Pages：<https://sclastro.github.io/chiikawa/>。目前預設分支是 `claude/stoic-brahmagupta-8tdo0u`（workflow 亦接受 `main`）。
- 開發分支推送後不會上線；要上線須合併到預設分支，並先取得網站擁有者同意。
- 部署通常約 20 秒完成；用 GitHub Actions 的執行紀錄確認結果。
