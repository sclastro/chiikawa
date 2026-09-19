# 吉伊卡哇圖鑑

一個以繁體中文（香港用語）撰寫的《ちいかわ》非官方資料站。除了角色與故事整理，還有一個其他資料站較少做的部分：把作品裡的行為模式，整理成可以應用在交友、讀書、工作與情緒上的具體參照。

## 網站內容

| 頁面 | 內容 |
|---|---|
| `index.html` | 首頁。敘事式長頁滾動，中段設有四大系列入口 |
| `characters.html` | 角色圖鑑。17 個角色，支援關鍵字搜尋與陣營／性格／篇章三維篩選 |
| `character.html` | 角色詳情。以 `?id=` 參數載入，含基本檔案、性格深度剖析、名場面、關係網絡與參照 |
| `relations.html` | 互動 SVG 關係圖。點選角色突顯其所有關係線，可鍵盤操作 |
| `stories.html` | 6 個長篇章完整整理、8 個名場面精選、橫向時間軸 |
| `movie.html` | 劇場版《映画ちいかわ 人魚の島のひみつ》專頁 |
| `world.html` | 世界觀設定，6 個分類、20 項條目 |
| `reference.html` | 人生參照專區。4 個領域、22 條參照，每條按「具體場景 → 背後道理 → 可行做法」撰寫 |
| `quiz.html` | 性格測驗。10 題，結果連到對應的人生參照建議 |
| `about.html` | 編寫原則、資料處理方式、版權聲明 |

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

站內圖片全部是佔位圖。把同名的 `.png` 檔案放入 `images/characters/` 或 `images/stories/` 覆蓋即可，毋須改程式碼。完整清單與尺寸建議見 [`images/IMAGE_LIST.md`](images/IMAGE_LIST.md)。

## 設計系統

設計 token 集中在 `assets/css/tokens.css`，改一處即全站生效。

- 配色：米白 `#FAF6EE` 打底、暖深褐 `#4A3B31` 正文、赤陶 `#A05027` 強調，另有六組柔和粉彩作角色主題色
- 字體：標題 Varela Round／Zen Maru Gothic，正文 Nunito Sans + Noto Sans TC
- 正文對比度達 WCAG AA（9.2:1）；粉彩色只用於底色與裝飾，不用作正文字色
- 動效統一為 150ms／250ms 兩檔，全部尊重 `prefers-reduced-motion`
- 響應式斷點：375 / 768 / 1000 / 1200 px，手機優先

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

《ちいかわ》原作及所有角色之著作權屬 **ナガノ** 老師及其相關權利人所有。本站為非官方、非商業之愛好者資料站，與版權方並無任何關聯。站內文字為原創撰寫之介紹與評析，屬合理引用與評論性質；站內不含任何官方圖片。
