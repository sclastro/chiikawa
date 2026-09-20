# 圖片清單

站內圖片位置的對照表。要換圖，只需把**同名檔案**放入對應資料夾覆蓋即可，毋須改動任何程式碼。

## 換圖方法

1. 圖片命名為下表的檔案名。
2. 放入 `images/characters/` 或 `images/stories/` 覆蓋原檔。
3. 重新整理網頁即可。

### 用 PNG 以外的格式

不限 `.png`。若手上是 `.jpg`、`.webp` 或其他網頁支援的格式，毋須轉檔，只需同步修改 `data/characters.js` 中該角色的 `image` 欄位副檔名，例如：

```js
image: 'images/characters/chiikawa.jpg',
```

萬一圖片檔案缺失或路徑寫錯，網站會自動以該角色的代表色填滿該位置，不會出現破圖或版面塌陷。

## 規格建議

| 用途 | 建議尺寸 | 長寬比 | 備註 |
|---|---|---|---|
| 角色圖 | 600 × 600 px 或以上 | 1:1 正方形 | 同一張圖用於角色卡（4:3 框）與詳情頁大圖（1:1 框），兩者皆以 contain 完整顯示，不會裁走主體。橫向或直向構圖會在框內留白。 |
| 電影海報 | 600 × 900 px 或以上 | 2:3 直度 | 以 cover 填滿，滿版構圖最佳。 |

圖片區底色統一為白色，因此**白底圖效果最好**，會與卡片無縫融合；有色或場景背景會顯示為一塊色塊。建議檔案大小 200 KB 以內。

## 角色圖一覽（共 16 張）

### 主角三人組

| 檔案路徑 | 角色 | 日文原名 | 現況 |
|---|---|---|---|
| `images/characters/chiikawa.png` | 吉伊卡哇 | ちいかわ | 已有圖片 |
| `images/characters/hachiware.png` | 八割 | ハチワレ | 已有圖片 |
| `images/characters/usagi.png` | 兔兔 | うさぎ | 已有圖片 |

### 常駐配角

| 檔案路徑 | 角色 | 日文原名 | 現況 |
|---|---|---|---|
| `images/characters/momonga.png` | 鼯鼠 | モモンガ | 已有圖片 |
| `images/characters/kurimanju.png` | 栗子饅頭 | くりまんじゅう | 已有圖片 |
| `images/characters/rakko.png` | 海獺先生 | ラッコ | 已有圖片 |
| `images/characters/shisa.png` | 獅子狗 | シーサー | 已有圖片 |
| `images/characters/furuhonya.png` | 古書店（蟹仔） | 古本屋（カニちゃん） | 已有圖片 |

### 鎧甲先生

| 檔案路徑 | 角色 | 日文原名 | 現況 |
|---|---|---|---|
| `images/characters/rodo-yoroi.png` | 勞動鎧甲先生 | 労働の鎧さん | 已有圖片 |
| `images/characters/pochette-yoroi.png` | 腰包鎧甲先生 | ポシェットの鎧さん | 已有圖片 |
| `images/characters/ro-yoroi.png` | 郎的鎧甲先生 | 郎の鎧さん | 已有圖片 |

### 特殊與對立

| 檔案路徑 | 角色 | 日文原名 | 現況 |
|---|---|---|---|
| `images/characters/anoko.png` | 那孩子 | あのこ | 已有圖片 |
| `images/characters/dekatsuyo.png` | 巨大強者 | でかつよ | 已有圖片 |
| `images/characters/seiren.png` | 海妖 | セイレーン | 已有圖片 |
| `images/characters/shimajiro.png` | 島二郎 | 島二郎 | 已有圖片 |
| `images/characters/hitoha-futaba.png` | 一葉與二葉 | ヒトハとフタバ | 已有圖片 |

## 其他圖片

| 檔案路徑 | 用途 | 建議尺寸 | 現況 |
|---|---|---|---|
| `images/stories/movie-poster.png` | 劇場版《映画ちいかわ 人魚の島のひみつ》海報 | 600 × 900 px（2:3） | 佔位圖 |

## 版權提醒

本站不附帶任何官方圖片。放入的圖片請確保已合法取得使用權。官方插圖之著作權屬 ナガノ 老師及其相關權利人所有。
