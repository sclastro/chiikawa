# 吉伊卡哇圖鑑

一個以繁體中文（香港用語）撰寫的《ちいかわ》非官方資料站。除了角色與故事整理，還有一個其他資料站較少做的部分：把作品裡的行為模式，整理成可以應用在交友、讀書、工作與情緒上的具體參照。

## 網站內容

| 頁面 | 內容 |
|---|---|
| `index.html` | 首頁。全站搜尋、目錄磚、主角三人、名場面橫向帶、三篇可展開的導讀 |
| `characters.html` | 角色圖鑑。16 個角色，支援關鍵字搜尋與陣營／性格／篇章三維篩選 |
| `character.html` | 角色詳情。以 `?id=` 參數載入，分「檔案／性格／名場面／關係／參照」五個分頁，底部有角色切換帶 |
| `relations.html` | 互動 SVG 關係圖。點選角色突顯其所有關係線，可鍵盤操作 |
| `stories.html` | 分「長篇章／名場面／時間軸」三個分頁；長篇章為摺疊清單 |
| `movie.html` | 劇場版《映画ちいかわ 人魚の島のひみつ》專頁 |
| `world.html` | 世界觀設定，6 個分類各佔一個分頁，共 20 項條目 |
| `reference.html` | 人生參照專區。4 個領域各佔一個分頁，22 條參照以摺疊清單列出，每條按「具體場景 → 背後道理 → 可行做法」撰寫 |
| `quiz.html` | 性格測驗。10 題，結果連到對應的人生參照建議 |
| `about.html` | 編寫原則、資料處理方式、版權聲明 |

## 網站結構與導航

- **手機底部分頁列**：首頁、角色、故事、參照、目錄五格，任何位置都可一按轉頁，毋須捲回頂部。桌面版改為釘頂的頂欄。
- **目錄與搜尋面板**：按底部「目錄」、頂欄放大鏡或鍵盤「/」開啟。未輸入時顯示全站目錄（有分頁的頁面另列「本頁」捷徑）；輸入後即時搜尋角色、長篇章、名場面、世界觀條目與人生參照，結果直達該條目。搜尋所需的資料檔只在首次開啟面板時才補載。
- **頁內分頁**：內容多的頁面一次只顯示一個分頁，分頁列捲動時釘頂。網址的 `#` 會同步更新，可直接分享，例如 `reference.html#study`、`stories.html#arc-seiren`、`world.html#food-2`。
- **摺疊清單**：長篇章與人生參照先列標題，點開才讀全文；每個分頁設「全部展開」。

站點結構集中在 `assets/js/app.js` 的 `SITE`（目錄、首頁目錄磚、頁尾共用）與 `TABS`（底部分頁列）。新增頁面時在這兩處加一筆即可。

## 本機預覽

純靜態網站，沒有任何建置步驟或依賴。

```cmd
cd /d 你的資料夾路徑
python -m http.server 8000
```

然後用瀏覽器開啟 <http://localhost:8000>。

直接雙擊 `index.html` 亦可瀏覽——資料檔刻意存成 `.js`（而非 `.json`）就是為了避開本機開檔時的 CORS 限制。

## 修改內容

所有內容集中在 `data/` 目錄，改資料即可，毋須改動頁面：

| 檔案 | 內容 |
|---|---|
| `data/characters.js` | 角色資料。新增角色只需加一筆，圖鑑、關係圖、篩選選項都會自動反映 |
| `data/stories.js` | 長篇章、名場面、時間軸、劇場版資料 |
| `data/world.js` | 世界觀設定條目 |
| `data/reference.js` | 人生參照的四個領域與內容 |
| `data/quiz.js` | 測驗題目、計分與結果描述 |

新增角色時，`relations` 欄位中的 `id` 必須對應到實際存在的角色；若要在關係圖上顯示，還需要在 `assets/js/relations.js` 的 `POS` 表加上座標。

## 換圖片

十六張角色圖與劇場版海報已經放入。要更換時，把同名檔案放入 `images/characters/` 或 `images/stories/` 覆蓋即可，毋須改程式碼；圖片缺失時該位置會以角色代表色填滿。完整清單與尺寸建議見 [`images/IMAGE_LIST.md`](images/IMAGE_LIST.md)。

## 設計系統

風格定位為「ちいかわ 貼紙簿」。設計 token 集中在 `assets/css/tokens.css`，改一處即全站生效。

- 配色：奶油底 `#FFF9F1` 加淡粉波點；正文暖啡 `#4A3A33`；連結與強調用士多啤梨粉 `#A33A50`；粉紅、八割藍、兔兔黃、草地綠、淡紫、蜜桃六組粉彩只作填色與裝飾
- 字體：標題、按鈕、標籤用粉圓體（Huninn，jf open 粉圓）；正文用 Noto Sans TC，拉丁字配 Nunito；日文名用 Zen Maru Gothic
- 貼紙語言：啡色描邊 `#6B5447`、手繪感不規則圓角、實色落影；按鈕按下時「壓扁」；卡片微微傾斜、頂部貼紙膠帶；頁首底邊為扇形花邊
- 角色圖：圖片本身不是透明底，`app.js` 會讀取每張圖左上角的顏色填滿相框，令草地底、粉紅底的圖與框融為一體（以本機檔案開啟時讀不到像素，相框維持白色）
- 裝飾：閃星、心心、小花、音符、泡泡由 `App.deco()` 以固定種子排位，只放在邊緣地帶，不疊在文字上；各內頁頁首有一位吉祥物角色（`data-mascot`、`data-say`）
- 正文對比度達 WCAG AA：正文 10.3:1，次級文字在粉彩底上最低 4.8:1，連結最低 4.96:1
- 動效以彈性曲線為主；全部尊重 `prefers-reduced-motion`，開啟後所有飄浮、閃爍、點擊閃星一律停用
- 響應式：手機優先；1000px 以上改用頂欄導航並隱藏底部分頁列；支援 iPhone 底部安全區域

## 部署到 GitHub Pages

專案已附 `.github/workflows/pages.yml`，無建置步驟，直接部署整個 repo 根目錄。

**必要的一步**（只需做一次，而且只能由 repo 擁有者做）：
到 <https://github.com/sclastro/chiikawa/settings/pages>，將 **Source** 設為 **GitHub Actions**。

這一步無法由 workflow 代勞：`actions/configure-pages` 雖有 `enablement` 參數，
但 workflow 的 `GITHUB_TOKEN` 沒有建立 Pages 站點的權限，實測會得到
`Create Pages site failed: Resource not accessible by integration`。

完成後網址是 <https://sclastro.github.io/chiikawa/>，其後每次 push 都會自動更新。

**建議但非必要**：到 **Settings → General → Default branch** 把預設分支改為 `main`。
workflow 同時接受 `main` 與 `claude/stoic-brahmagupta-8tdo0u` 兩條分支，是因為 GitHub Pages 的
`github-pages` environment 預設只准從**預設分支**部署——兩條都綁上，無論預設分支是哪一條都部署得到。

若要手動觸發一次部署：Actions → Deploy to GitHub Pages → Run workflow。

## 版權

《ちいかわ》原作及所有角色之著作權屬 **ナガノ** 老師及其相關權利人所有。本站為非官方、非商業之愛好者資料站，與版權方並無任何關聯。站內文字為原創撰寫之介紹與評析，屬合理引用與評論性質；站內圖片之著作權屬原權利人所有，只用作辨認角色與介紹作品。
