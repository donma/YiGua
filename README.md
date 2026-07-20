# 易卦

> 不問天命，只觀時勢。

易卦是一套繁體中文的《易經》起卦、六爻判讀與決策反思工具。專案以「經典忠實為底、現代應用為第二層」為核心原則：先呈現卦辭、象辭、爻辭與多動爻主判讀，再提供分類解讀、行動建議、風險提醒和反思問題，避免把古典原文與現代詮釋混成同一種權威。

線上版本：[https://donma.github.io/YiGua/](https://donma.github.io/YiGua/)

## 主要功能

- 三枚銅錢起卦、快速起卦、每日一卦與手動排卦
- 本卦、之卦、動爻、互卦、錯卦與綜卦
- 64 卦、384 爻的繁體中文經典層資料
- 依動爻數自動產生經典判讀主軸
- 一般、工作、感情、財務、合作、家庭、學習、健康、決策、創業、合約與修行等 12 類現代應用
- 768 筆卦分類解讀與 4,608 筆爻分類解讀
- 4,096 筆有方向性的本卦至之卦轉化內容
- 768 筆行動建議、768 筆風險提醒與 2,304 筆反思問題
- 本機歷史紀錄、HTML／JSON 匯出與安全 JSON 匯入
- PWA 安裝、離線快取、更新提示與 `file://` 核心模式
- 不需帳號、後端、資料庫、第三方 API、追蹤程式或 CDN

## 三枚銅錢機率

一般起卦與每日一卦都採三枚公平銅錢的標準組合機率。每爻分布如下：

| 爻值 | 名稱 | 組合機率 | 是否變爻 |
|---:|---|---:|---|
| 6 | 老陰 | 1/8 | 是 |
| 7 | 少陽 | 3/8 | 否 |
| 8 | 少陰 | 3/8 | 否 |
| 9 | 老陽 | 1/8 | 是 |

每日一卦使用本機日曆日期作為固定種子，確保同一天結果可重現；日期只決定亂數序列，不改變 1:3:3:1 的銅錢機率。演算法版本為 `3`，舊快取不會沿用到新版結果。

## 經典層與多動爻判讀

經典資料分成獨立底本與異文表：

- `classicCanon.data.js`：64 卦、384 爻、乾坤用九／用六、來源修訂號與逐筆驗證狀態
- `classicTextVariants.data.js`：正規化字形、標點差異、舊資料缺文及待人工裁定的不同讀法
- `hexagrams.data.js`／`lines.data.js`：產品執行時使用的完整卦辭、象辭、爻辭與正確爻位

本版已完成 64 卦／384 爻的全量機器交叉核對、六爻覆蓋、爻位陰陽、繁體正規化與來源修訂號固定。可機器驗證的部分均已通過；依掃描底本逐葉核校及版本學異文裁定仍保留為具名人工工作，不宣稱已由學者完成。

多動爻採明示的《易學啟蒙》系統規則：

| 動爻數 | 主判讀依據 |
|---:|---|
| 0 | 本卦卦辭 |
| 1 | 本卦動爻爻辭 |
| 2 | 本卦兩動爻，以上爻為主 |
| 3 | 本卦與之卦卦辭，本卦為貞、之卦為悔 |
| 4 | 之卦兩個不變爻，以下爻為主 |
| 5 | 之卦唯一不變爻 |
| 6 | 乾坤取用九／用六，其餘取之卦卦辭 |

此方法是專案選定且公開的判讀系統，不宣稱為所有易學流派的唯一規則。

## 資料可信狀態

過去資料中的 Gold／Reviewed 標記缺少可公開驗證的具名人工審校證據，因此本版已撤銷其人工審定含義。新版狀態定義如下：

| 狀態 | 必要條件 | 可否代表人工審定 |
|---|---|---|
| `machine-validated` | schema、筆數、唯一鍵、引用完整性與規則式內容檢查通過 | 否 |
| `reviewed` | 具名審校者、日期、範圍與審校證據齊全 | 是 |
| `gold` | Reviewed、獨立第二次審校、阻斷問題歸零且版本雜湊凍結 | 是 |

目前經典資料標為 `machine-crosschecked`，現代應用資料標為 `machine-validated`；兩者都保留 `needsHumanReview: true`，目前沒有任何資料冒稱 Reviewed 或 Gold。

## 目前完成進度

準確性版本 `2.0.0-accuracy` 已完成下列機器工程：

- 每日一卦修正為三枚銅錢 1:3:3:1 機率
- 建立經典底本、來源階層、修訂號與 252 筆異文／舊文差異
- 全查 64 卦、384 爻的覆蓋、正文同步、爻位與繁體正規化
- 重定義 Gold／Reviewed，撤銷無證據的舊人工審定標記
- 實作 0 至 6 動爻的《易學啟蒙》判讀規則並呈現在結果頁
- 重新驗證 768 Category 與 4,608 LineCategory 的唯一鍵、引用、必要欄位、依據與分數修正
- 最後重新驗證 4,096 Pair、768 Action、768 Risk 與 2,304 Reflection
- 4,096 種六爻值組合全部能建立完整解讀
- 300 筆 golden case、JavaScript 語法、PWA、資料安全與效能檢查通過
- 建立可公開驗證的 `data-release-manifest.json`
- 補齊 SEO 標題、摘要、canonical、Open Graph、結構化資料、robots、sitemap 與 favicon

完整自動驗證狀態為 `COMPLETE`。仍需真人介入的工作會持續明列，不納入已完成的人工審校宣稱。

## 公開驗證資料版本

[`data-release-manifest.json`](./data-release-manifest.json) 公開以下資訊：

- 發布版本、時間與驗證狀態
- 經典來源政策與人工作業缺口
- 銅錢機率與每日演算法版本
- 每個資料集的筆數、檔案大小與 SHA-256
- 核心執行檔的 SHA-256
- 自動驗證階段與執行結果

PowerShell 驗證單一檔案：

```powershell
Get-FileHash -Algorithm SHA256 src/data/lines.data.js
```

Linux 或 macOS：

```bash
sha256sum src/data/lines.data.js
```

將輸出轉為小寫後，與 manifest 內相同路徑的 `sha256` 逐字比對即可。

## 使用方式

直接開啟 `index.html` 即可使用核心起卦、解讀、歷史與匯出功能。若要啟用 PWA、Service Worker 與完整離線快取，請透過 localhost 或 HTTPS：

```bash
python -m http.server 8080
```

然後開啟 `http://localhost:8080/`。

專案沒有建置步驟，也不需要安裝套件。

## 專案結構

```text
index.html                         起卦與解讀主頁
history.html                       本機歷史紀錄
report-viewer.html                 匯出報告檢視
manifest.webmanifest               PWA 設定
sw.js                              離線快取與更新策略
favicon.svg                        網站與 PWA 圖示
robots.txt / sitemap.xml           搜尋引擎索引資訊
data-release-manifest.json         公開資料版本與 SHA-256
src/js/core.js                     起卦、卦象、分數與多動爻核心
src/js/app.js                      主頁流程與每日一卦
src/data/classicCanon.data.js      經典底本
src/data/classicTextVariants.data.js 異文表
src/data/verificationPolicy.data.js 可信狀態規則
src/data/interpretationMethod.data.js 多動爻判讀規則
src/data/*.data.js                 產品資料集
```

## 經典來源政策

- 權威底本參照：[中國哲學書電子化計劃《周易》](https://ctext.org/book-of-changes/zh)，其頁面列示《武英殿十三經注疏》本《周易正義》等底本
- 可固定修訂號的全量機器見證本：[維基文庫《周易》](https://zh.wikisource.org/zh-hant/周易)
- 多動爻規則：[維基文庫《易學象數論・占法》所錄啓蒙占法](https://zh.wikisource.org/zh-hant/易學象數論/占法)

字形政策採 Unicode NFC 與繁體顯示；`于`、表示君主的 `后` 等古籍通行字依文義保留。不同見證本的 `無／无`、`群／羣`、標點與實質文字差異會留在異文表，不以無痕覆寫處理。

## 隱私與安全

- 歷史紀錄只存於瀏覽器 `localStorage`
- 不登入、不上傳、不追蹤
- JSON 匯入限制 schema、檔案大小、筆數與欄位
- 歷史及報告頁不把匯入文字直接當成 HTML 執行
- 不提供醫療診斷、具體投資指令、法律結論或恐嚇式斷語
