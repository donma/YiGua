# 易卦

> 不問天命，只觀時勢。

易卦（原始專案代號 Zero1Matrix）是一套以《易經》六十四卦為基礎的本機起卦、分類解讀與反思工具。專案以原生 HTML、CSS、JavaScript 和靜態資料檔構成，不需要後端、帳號、資料庫、第三方 API、追蹤程式或 CDN。

系統採 Local-first／Offline-first 設計。核心起卦可直接從 `file://` 執行；透過 localhost 或 HTTPS 開啟時，亦可安裝為 PWA 並使用離線快取。

## 目前完成狀態

核心資料工程與產品修正已完成，最終全專案驗收狀態為 `COMPLETE`：

- 64 卦、384 爻與 12 種問事分類完整對應
- 4,608 筆動爻分類解讀全數完成 Gold／Reviewed
- 4,096 筆有方向性的本卦 → 變卦 Pair 全矩陣完成
- 768 筆行動建議、768 筆風險提醒與 2,304 筆反思問題完成
- 每日一卦已修正為同日期固定、與分類無關，舊快取可安全汰換
- JSON 匯入已加入 schema、大小、筆數與欄位驗證，歷史及報告頁已防止持久型 HTML 注入
- PWA 圖示、快取版本、更新流程與離線回退已補齊
- 動爻畫面完整呈現分類解讀、建議、提醒、依據與六維分數修正
- 大型資料查詢改用 lazy `Map` 索引，保留既有公開 schema 與 `file://` 行為

## 功能

- 三枚銅錢起卦、快速起卦、每日一卦與手動排卦
- 顯示本卦、變卦、動爻、互卦、錯卦與綜卦
- 卦辭、象辭、爻辭、白話解讀、局勢、時機與核心建議
- 12 種分類：一般、工作事業、感情關係、財務金錢、人際合作、家庭親人、學習考試、身心狀態、重大決策、創業經營、官非合約、心境修行
- 動爻 × 分類的完整 meaning、advice、warning、basis 與 scoreAdjust
- 本卦 → 變卦的方向性轉化解讀、行動、風險與節奏
- 對應卦象及分類的 Action、Risk 與 Reflection
- 六維評分：明朗度、行動、風險、變化、支援、時機
- 本機歷史紀錄、搜尋、分頁、JSON 匯入／匯出與 HTML 報告
- PWA 安裝、更新與離線核心

## 起卦規則

每一爻由三枚銅錢相加：

- 正面 `H = 3`
- 反面 `T = 2`
- `6`：老陰，陰爻，動爻，變為陽
- `7`：少陽，陽爻，不變
- `8`：少陰，陰爻，不變
- `9`：老陽，陽爻，動爻，變為陰

六爻採 bottom-up 儲存，`values[0]` 是初爻，`values[5]` 是上爻。本卦由原始陰陽值查找；6 與 9 翻轉後形成變卦。

## 八卦 bit mapping

三位 bit 同樣由下往上排列：

| Bits | 卦 |
| --- | --- |
| `000` | 坤 |
| `001` | 艮 |
| `010` | 坎 |
| `011` | 巽 |
| `100` | 震 |
| `101` | 離 |
| `110` | 兌 |
| `111` | 乾 |

下三爻形成下卦，上三爻形成上卦；64 種六位陰陽組合均有唯一卦象。

## 資料規模

| 資料域 | 數量 | 狀態 |
| --- | ---: | --- |
| Hexagrams | 64 | 完整 |
| Lines | 384 | 完整 |
| CategoryInterpretations | 768 | 完整 |
| ReflectionQuestions | 2,304 | 完整 |
| LineCategoryInterpretations | 4,608 | Gold／Reviewed／16 Waves Frozen |
| PairInterpretations | 4,096 | Gold／Reviewed／16 Waves Frozen |
| ActionSuggestions | 768 | Gold／Reviewed／8 Waves Frozen |
| RiskWarnings | 768 | Gold／Reviewed／8 Waves Frozen |

## 執行方式

### 直接使用 file://

下載專案後，以瀏覽器直接開啟 `index.html`。核心資料使用 `.data.js` 載入，不需要 `fetch()` JSON，因此起卦、解讀、歷史紀錄與報告功能可在無伺服器模式運作。

瀏覽器對本機檔案的安全政策可能不同；PWA 安裝與 Service Worker 不會在 `file://` 註冊。

### Local HTTP

如果電腦已有 Python，可在專案根目錄執行：

```bash
python -m http.server 8080
```

然後開啟 `http://localhost:8080/`。這不會安裝額外套件，伺服器只負責傳送靜態檔案。

## PWA

- Service Worker 僅在 HTTPS、`localhost` 或 `127.0.0.1` 啟用
- `file://` 模式不註冊 Service Worker，但核心功能仍可直接使用
- 新版 Service Worker 會更新靜態資源、清除舊版快取，網路失敗時回退離線快取
- `index.html`、歷史頁、報告頁、核心程式、完整資料與本機圖示均納入離線資源

## 測試與驗收

目前最終驗收結果包括：

- 300／300 golden reading cases 通過
- 4,096 種六爻組合皆可建立本卦與變卦，兩者均覆蓋 64／64 卦
- H／T、6／7／8／9、bottom-up、動爻翻轉與八卦 mapping 全部通過
- Score Engine 10,000 次校準、100 次重現性：NaN／undefined／越界／漂移皆為 0
- 八個資料域的 count、ID、coverage、foreign key 與跨域一致性通過
- Frozen 與 Protected hashes 全部驗證一致
- LineCategory、Pair、Action、Risk 的 exact、normalized、完整句與高相似檢查通過
- 每日一卦 3,650 日期樣本、JSON 惡意匯入、PWA、file://、本機 HTTP、runtime 與效能測試通過
- 全專案 JavaScript 語法錯誤為 0

可直接執行的既有檢查命令：

```bash
node scripts/run-score-calibration.js
node --check src/js/core.js
node --check src/js/app.js
node --check src/js/history-safety.js
node --check src/js/pwa.js
node --check sw.js
```

測試 fixtures 與既有結果位於 `tests/`。驗收工具會產生本機報告；發佈成品不依賴這些工具才能運作。

## 資料治理

- `Gold`：內容已達正式資料品質門檻
- `Reviewed`：紀錄含審閱狀態、審閱者標記與日期
- `Frozen hashes`：逐 Wave 封存，後續波次會驗證先前內容未被改動
- `Protected hashes`：保護核心及已封版資料域，防止非預期修改
- Checker 採唯讀原則；生成、修復、驗收與凍結職責分離
- 正式資料保留唯一 ID、basis、scoreAdjust 與 source trace，方便追溯

## 隱私與安全

- 無登入、無後端、無追蹤、無第三方 API、無 CDN
- 起卦內容、設定與歷史紀錄留在瀏覽器本機 `localStorage`
- JSON 匯入會驗證檔案大小、筆數、casts、卦 ID、分類、時間、分數與文字長度
- 匯入資料的卦名、符號、分類名稱與動爻會由本機可信資料重新建立
- 清除瀏覽器資料前，建議先從歷史頁匯出 JSON 備份

## 專案結構

```text
.
├── index.html                 # 起卦與解讀主頁
├── history.html               # 本機歷史與安全匯入
├── report-viewer.html         # 報告檢視與列印
├── manifest.webmanifest       # PWA manifest
├── sw.js                      # 更新與離線快取
├── src/
│   ├── assets/                # 銅錢與應用程式圖示
│   ├── css/                   # 介面樣式
│   ├── data/                  # 正式靜態資料
│   └── js/                    # 起卦、索引、應用、安全與 PWA 邏輯
└── tests/                     # Fixtures 與驗收結果
```

## 已知限制與免責

- 主起卦頁會載入約 46.8 MiB 的完整靜態資料；首次解析時間取決於裝置效能
- 歷史紀錄受瀏覽器 `localStorage` 容量限制，重要資料應定期匯出
- 易經內容用於文化研究、自我整理與反思參考，不是對未來的保證或唯一答案
- 本專案不提供醫療診斷、不取代法律意見、不提供財務獲利保證，也不取代合格專業人士

## License

目前 repository 未提供 License 檔案，因此不自行宣稱任何開源授權。使用、修改或散布前，請先取得專案權利人的許可。
