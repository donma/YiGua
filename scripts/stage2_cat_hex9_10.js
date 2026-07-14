// stage2_cat_hex9_10.js
// Generates per-hex-per-category UNIQUE content for hexagrams 9 (小畜) and 10 (履)
// Rewrites meaning, advice, warning, timing for 8 categories each
// v2: length-constrained version

const vm = require('vm');
const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, '..', 'src', 'data', 'categoryInterpretations.data.js');
const NODE_EXE = path.join(__dirname, '..', '.nodejs', 'node-v22.14.0-win-x64', 'node.exe');

// ─── Load existing data ───
global.window = {};
const rawCode = fs.readFileSync(DATA_FILE, 'utf8');
vm.runInThisContext(rawCode);
const allEntries = global.window.Zero1MatrixData.categoryInterpretations;

// ─── Hex 9 (小畜 風天小畜) entries ───
// Core: 積蓄未成, 小幅控制, 密雲不雨
// Field constraints: meaning 120-190, advice 100-160, warning 80-125, timing 60-105

const hex9 = [
  {
    id: "hex-009-general",
    hexagramId: 9,
    category: "general",
    categoryName: "一般",
    meaning: "風天小畜的整體局勢是「密雲不雨自我西郊」——力量已聚集如滿天烏雲，但突破的臨界點尚未到達。核心矛盾在於外界期待與內在準備之間的落差無法硬跨，硬跨就會讓小畜變成小敗。復自道揭示唯一的出路：退回去重新校準累積的品質，確認每一步基礎是否踩實。此時優先級不是推進，是辨認哪些準備只是表面功夫，哪些才是真正能支撐下一階段的底層結構。",
    advice: "列出已完成的三大項目與三大缺口，不做美化直接對照。用復自道的方法回到被跳過的基礎步驟，每天補強一項。有人催促行動時，給出具體完成日期而非空泛承諾。若連續兩週未見準備有實質提升，立即請外部專家審視你的累積方向是否正確。",
    warning: "最大誤判是把密雲當成已下雨——將即將具備當作已經具備，在人前表現超出實際水準的自信。這會在關鍵時刻被拆穿，信用一旦破產比暫時不推進更難挽回。復自道的反向濫用同樣致命：不斷退回修正卻從不離開起點，把準備變成永不前進的藉口。",
    timing: "密雲增厚但未達降雨條件時繼續收縮校準。三個信號同時出現——外部壓力鬆動、內部準備量化達標、曾拒絕你的人回頭詢問——才是突破窗口。若密雲不增反散，立即停止等待，重新評估積累方向是否錯了。",
    basis: ["密雲不雨自我西郊","復自道","牽復","輿說輻","夫妻反目","一般"],
    scoreAdjust: {"clarity":0,"action":0,"risk":0,"change":5,"support":0,"timing":0},
    qualityLevel: "gold",
    reviewed: true,
    reviewedBy: "stage2-cat-hex9-10",
    reviewedAt: "2026-07-12",
    needsHumanReview: false,
    version: "1.7.2-gold-cat-stage2"
  },
  {
    id: "hex-009-career",
    hexagramId: 9,
    category: "career",
    categoryName: "工作事業",
    meaning: "職場中的小畜卦以「輿說輻」揭示核心困境——車輪與軸的連接鬆脫了，你的努力無法傳導為組織的實際產出。這可能是制度流程卡住你的方案，或是上級與你之間的授權鏈條出現了斷點。復自道要求回到原先被跳過的環節重新鋪路，而牽復則警告：當整個團隊進度不一時，你回頭拉人沒錯，但別拉到自己忘了前進。",
    advice: "檢視過去三個月受阻的項目，找出哪一個卡在上層未簽核而非你未完成。帶著這個清單與直屬主管約十五分鐘校準會議，只問一件事：這個項目往前走的下一步是什麼。會後二十四小時內補上對方要求的文件。期間不自行擴大權限推動未授權事務。",
    warning: "輿說輻的危險在於你以為自己在全力前進，實際動能卻在原地空轉。歸咎環境而停止修正自己的工作方式，你就從被卡住變成了卡住自己的人。復自道過程中因不耐煩而繞過正式流程，短期看似加速，長期會讓合規紀錄留下難以清除的傷痕。",
    timing: "在與主管完成授權校準之前不提交跨部門大型方案。當上級主動追問「怎麼停了」而非你追問對方時才是重啟信號。若超過一個月流程依然卡在同一節點，申請調換對接窗口而非繼續等待。",
    basis: ["復自道","輿說輻","牽復","密雲不雨自我西郊","工作事業"],
    scoreAdjust: {"clarity":0,"action":0,"risk":0,"change":5,"support":0,"timing":0},
    qualityLevel: "gold",
    reviewed: true,
    reviewedBy: "stage2-cat-hex9-10",
    reviewedAt: "2026-07-12",
    needsHumanReview: false,
    version: "1.7.2-gold-cat-stage2"
  },
  {
    id: "hex-009-love",
    hexagramId: 9,
    category: "love",
    categoryName: "感情關係",
    meaning: "感情中小畜卦的核心意象是「夫妻反目」——不是突然不愛，而是長期微小不滿像被蓄積的雲層，終於在一個不相干的觸發點上傾瀉而出。有孚血去惕出則指出修復的路徑：信任若經歷傷害後還能被重新確認，反而比虛假的和平更堅固。有孚攣如提醒，兩人的情緒像被繩索綁在一起，一方的波動未經過濾就直接傳導為另一方的防禦。",
    advice: "各自寫出最近三個月最不滿的三件事，交換紙條後輪流只說「我那時的感受是___」，禁止辯解反駁也不准打斷對方。這不是和解會，是情緒地圖繪製作業。完成後約定三天再討論，中間各自沉澱冷靜，不傳訊息不試探對方。",
    warning: "有孚攣如的陷阱是把共生依賴當成深情——一方的情緒波動立即綁架另一方的行動自由，最終雙方都失去獨立判斷。真正的夫妻反目不是大吵一架後分開，是和解後都選擇了不再表達真實感受，沉默到連架都懶得吵。",
    timing: "情緒高峰時立即喊停，冷靜期至少四小時內不做任何關係決定。當雙方能在不帶指責語氣下說出「我自己的那部分責任是___」時才重啟對話。連續三次對話都在二十分鐘內進入攻擊模式，暫停所有重大關係決定一個月。",
    basis: ["夫妻反目","有孚攣如","有孚血去惕出","密雲不雨自我西郊","感情關係"],
    scoreAdjust: {"clarity":0,"action":0,"risk":0,"change":5,"support":0,"timing":0},
    qualityLevel: "gold",
    reviewed: true,
    reviewedBy: "stage2-cat-hex9-10",
    reviewedAt: "2026-07-12",
    needsHumanReview: false,
    version: "1.7.2-gold-cat-stage2"
  },
  {
    id: "hex-009-people",
    hexagramId: 9,
    category: "people",
    categoryName: "人際合作",
    meaning: "人際場域中小畜卦以「牽復」為運作機制——合作關係不是自動向前的，而是需要有人不斷回頭拉住進度落後的一方。有孚攣如進一步指出過度緊密的聯盟像繩索連成的隊伍，一個人倒下其他人也無法獨行。輿說輻則意味著表面上的分工共識已經鬆動，合約或口頭協議的執行力正在瓦解，但你還在靠習慣維繫運作。",
    advice: "將所有合作項目列在白板上，標註每項的負責人與進度狀態。找到延遲最嚴重的環節，私下問對方一句：你現在最需要什麼資源才能趕上？不指責不追究也不威脅換人。暫停簽署新合作協議，直到現有三個以上項目恢復正常進度。",
    warning: "牽復的最大錯誤是你一直回頭拉人，拉到最後忘了自己也要前進。當你變成團隊中唯一記得所有人進度的人，那不是能力強，是在替別人的不負責任買單。對輿說輻視而不見——架構已鬆脫卻繼續運作，斷裂發生時各方會互相指責對方先違約。",
    timing: "掌握所有現有項目進度落差之前不接受新夥伴加入。當被你協助過的那方開始主動回報進度而非被你追問時，表示牽復階段可收尾。同一合作對象連續三次需要你回頭拉他，就該重組責任分配而非繼續補救。",
    basis: ["牽復","有孚有孚攣如","輿說輻","密雲不雨自我西郊","人際合作"],
    scoreAdjust: {"clarity":0,"action":0,"risk":0,"change":5,"support":0,"timing":0},
    qualityLevel: "gold",
    reviewed: true,
    reviewedBy: "stage2-cat-hex9-10",
    reviewedAt: "2026-07-12",
    needsHumanReview: false,
    version: "1.7.2-gold-cat-stage2"
  },
  {
    id: "hex-009-family",
    hexagramId: 9,
    category: "family",
    categoryName: "家庭親人",
    meaning: "家庭中小畜卦的核心衝突是「夫妻反目」所象徵的角色僵化——成員被固定在長期不變的分工中，例如某人永遠是照顧者、某人永遠是經濟支柱、某人永遠被期待聽話。懿文德提供了化解之道不在權力重分配，而在家庭文化的重塑：用日常的小儀式讓每個角色感受到自己被看見。有孚攣如則警告，家族中的情緒連鎖比職場更難切斷。",
    advice: "召開一次家庭會議，每個成員寫下一件「我在這個家最累的事」和一件「最被需要的事」。貼在冰箱上一週讓所有人看見。從中挑出可立即微調的三件事來改變，比如洗碗分配或誰需要週末獨處時間。每次只動一個螺絲釘，不要試圖一次解決所有結構問題。",
    warning: "夫妻反目在家庭中最具破壞性的不是爭吵本身，而是把未解決的夫妻矛盾延燒到教養子女的決策上——你反對我，所以你也反對我對小孩的教育方式。懿文德被過度理想化時，試圖用說教壓制真實情緒，結果全家都學會了不說話而不是沒有問題。",
    timing: "家庭會議須在無重大事件的平靜時期召開，否則會變成抱怨大會。當「最累的事」中三人以上重複同一個問題時必須立即介入。每次調整後給兩週觀察期，期間不追加新規則。",
    basis: ["夫妻反目","懿文德","有孚攣如","密雲不雨自我西郊","家庭親人"],
    scoreAdjust: {"clarity":0,"action":0,"risk":0,"change":5,"support":0,"timing":0},
    qualityLevel: "gold",
    reviewed: true,
    reviewedBy: "stage2-cat-hex9-10",
    reviewedAt: "2026-07-12",
    needsHumanReview: false,
    version: "1.7.2-gold-cat-stage2"
  },
  {
    id: "hex-009-study",
    hexagramId: 9,
    category: "study",
    categoryName: "學習考試",
    meaning: "學業中的小畜卦以「輿說輻」為精準診斷——你投入的時間與實際吸收的知識之間發生了斷裂，踩著油門但輪子不咬路面。這通常是因為你重複練習已會的內容來獲得安全感，卻避開了真正的薄弱環節。懿文德指出一個解法：先建立學習的意義感，知道你為什麼學，比你怎麼學更能解決動機空轉。復自道要求退回基礎概念重新建立理解框架。",
    advice: "拿出一張沒看過的習題在無參考書下作答，用紅筆標出所有不確定的環節。這些紅筆標記才是你該花時間的地方。每解決一個就用自己話寫一段解釋確認真的懂了。每週只處理三到五個紅筆標記，不貪多，但每個都要做到能教別人的程度。",
    warning: "輿說輻的致命模式是盲目刷題——做一百題其實只在重複熟悉的路徑，對真正的知識漏洞毫無幫助。另一個陷阱是把懿文德誤解為有興趣就不用練基本功，美感不能取代基礎訓練，兩條軸線必須同時轉動。",
    timing: "連續三天無法完成學習目標時不要增加時間，退回復自道檢查方法哪裡出錯。考試前三週停止學新內容，全力轉向錯題回顧。同一類型錯誤在錯題本出現超過五次，那不是懶是不理解，必須找人請教。",
    basis: ["輿說輻","懿文德","復自道","密雲不雨自我西郊","學習考試"],
    scoreAdjust: {"clarity":0,"action":0,"risk":0,"change":5,"support":0,"timing":0},
    qualityLevel: "gold",
    reviewed: true,
    reviewedBy: "stage2-cat-hex9-10",
    reviewedAt: "2026-07-12",
    needsHumanReview: false,
    version: "1.7.2-gold-cat-stage2"
  },
  {
    id: "hex-009-decision",
    hexagramId: 9,
    category: "decision",
    categoryName: "重大決策",
    meaning: "做重大決定時遇到小畜卦，「既雨既處月幾望」是核心意象——雨已下過，月快滿但尚未完全圓。這是一個極微妙的節點：再多一步可能越界，現在收手又像前功盡棄。密雲不雨自我西郊在此處意味著決定所需關鍵資訊還掌握在他人手中，你等資訊的同時也在被消耗。有孚血去惕出則點出：剔除內心恐懼後剩下的選項，通常就是該走的方向。",
    advice: "建立四象限決策地圖：橫軸證據充足與否，縱軸可逆與否。優先處理證據充足且可逆的選項，最後處理證據不足且不可逆的。對後者列出獲取關鍵資訊的具體人名與時間底線，逐一去問。給自己一個硬性期限，逾期資訊不到就視為否定信號。",
    warning: "既雨既處月幾望最危險的陷阱是對圓滿的貪戀——因為離目標只差一步，不顧所有警訊也要走完。把沉沒成本當成「再做一點就會賺回來」的證據時，你已不是在決策，是在為過去的自己辯護。輕率剔除恐懼時順手也清掉了該有的謹慎，不怕過頭就是魯莽。",
    timing: "月幾望的狀態——感覺快完成但總差那一點——不是行動信號是檢討信號。可逆選項設一週試行期收集真實數據。不可逆選項在獲得三個獨立來源確認前不啟動。期限到而資訊缺口仍在，暫停處理轉向其他事項。",
    basis: ["既雨既處月幾望","密雲不雨自我西郊","有孚血去惕出","牽復","重大決策"],
    scoreAdjust: {"clarity":0,"action":0,"risk":0,"change":5,"support":0,"timing":0},
    qualityLevel: "gold",
    reviewed: true,
    reviewedBy: "stage2-cat-hex9-10",
    reviewedAt: "2026-07-12",
    needsHumanReview: false,
    version: "1.7.2-gold-cat-stage2"
  },
  {
    id: "hex-009-spiritual",
    hexagramId: 9,
    category: "spiritual",
    categoryName: "心境修行",
    meaning: "小畜卦在修行上以「懿文德」為核心命題——不是學更多道理，而是誠實面對你內心真正敬重的是什麼，以及每日行為是否與那個敬重對齊。復自道揭示修行者最難的一步：發現偏離初衷後，能不能不帶羞恥地走回原路重新開始。有孚血去惕出指向一個痛苦但必要的過程：把那些因恐懼而做的偽裝一一認出來，讓它們出血離開，這才是真正的誠實。",
    advice: "一週內每天睡前寫一句話：今天哪件事與我真正相信的價值一致，哪件是為了討好或害怕而做的。不批判只記錄。週末回顧找出那個「害怕驅動」的模式，下週設計一個微小的對策，比如下次答應前先說「我需要想一想再回覆你」。",
    warning: "懿文德最容易被偽裝成自我感動——讀了很多道理、參加很多成長活動，但回到日常生活中依然用同樣方式傷害身邊的人。有孚血去惕出的危險是在清理內心恐懼的過程中把自己剝得太光，把誠實變成不考慮他人感受的殘忍。",
    timing: "連續三天不再需要刻意提醒就做出符合內心價值的選擇時，表示某個模式的肌肉記憶正在養成。對抗一個舊有恐懼超過二十一天仍無進展時不要自責，去找能分享類似經驗的人交談——不是意志力問題，是孤獨讓你無法校準。",
    basis: ["懿文德","復自道","有孚血去惕出","密雲不雨自我西郊","心境修行"],
    scoreAdjust: {"clarity":0,"action":0,"risk":0,"change":5,"support":0,"timing":0},
    qualityLevel: "gold",
    reviewed: true,
    reviewedBy: "stage2-cat-hex9-10",
    reviewedAt: "2026-07-12",
    needsHumanReview: false,
    version: "1.7.2-gold-cat-stage2"
  }
];

// ─── Hex 10 (履 天澤履) entries ───
// Core: 規則權限, 風險距離, 謹慎前行
// Field constraints: meaning 120-190, advice 100-160, warning 80-125, timing 60-105

const hex10 = [
  {
    id: "hex-010-general",
    hexagramId: 10,
    category: "general",
    categoryName: "一般",
    meaning: "天澤履卦的整體格局是「履虎尾不咥人」——你正踩在老虎尾巴上，險到極致反而安全。這不是風平浪靜，而是你已靠近一個有力量的對象或制度，任何越界舉動都可能觸發反擊。素履是你的保護層：越樸素、不張揚、不試探底線，越不會被誤判為威脅。視履考祥則提醒，這條路走過之後要回頭檢視每一步，風險管理不是一次性的測驗，是持續的自我審計。",
    advice: "將接下來一個月需要對外互動的重要事項列出，每項後標註「對方的權力邊界」和「越界的後果」。對邊界最模糊的三件事主動請求書面溝通，留下可查證紀錄。完成這三件事之前暫緩任何需要冒險曝光的公開表態或立場宣告。",
    warning: "履虎尾最大誤判是第一次踩到尾巴沒被咬就開始覺得老虎不過如此——輕慢是這個卦最危險的副產品。每次安全過關都讓敏感度下降一級，危險堆積在最後那一步「沒事的啦」。素履被拋棄的信號是你在危險面前開始想展示聰明，認為技巧可取代謹慎，而老虎咬合力從未變弱。",
    timing: "當你感到一切都在掌控中時反而應收縮行動範圍——老虎沒咬不表示牠在睡覺。不確定因素從三個以上降至一個以下時可逐步推進。關鍵人物突然採取與之前相反的態度時，不追問不修正，先觀察一週再決定。",
    basis: ["履虎尾不咥人","素履","視履考祥","履道坦坦","一般"],
    scoreAdjust: {"clarity":0,"action":0,"risk":0,"change":5,"support":0,"timing":0},
    qualityLevel: "gold",
    reviewed: true,
    reviewedBy: "stage2-cat-hex9-10",
    reviewedAt: "2026-07-12",
    needsHumanReview: false,
    version: "1.7.2-gold-cat-stage2"
  },
  {
    id: "hex-010-career",
    hexagramId: 10,
    category: "career",
    categoryName: "工作事業",
    meaning: "履卦在職場的核心是「辨上下定民志」——組織內的層級與權限必須被清楚辨認且遵守，任何對這套秩序的模糊或僭越都會引發系統性反彈。素履告訴你此時最好的生存策略不是力爭出頭，而是依循角色本分做事，讓每個行動都有制度背書。眇能視跛能履則是嚴厲提醒：自以為看清全局卻有一眼半盲，自以為能走穩卻有一腿是瘸的，不先承認視野與能力有限，跌倒只是時間問題。",
    advice: "拿出職務說明書對照過去一個月的實際工作，用螢光筆標出三種情況：超出職權的事、低於職權的事、模糊地帶的事。超出職權的部分補寫簡短報備紀錄給上級重新校準權限。模糊地帶先確認該領域正式負責人是誰，在下次會議中公開確認歸屬。不越位也不空位。",
    warning: "辨上下定民志的失敗是典型辦公室政治災難——跳過中間階層直接向高層匯報，或替同事決定了不在你權限內的事。短期看似有效率，長期會失去所有中層信賴。眇能視的另一陷阱是：在資訊不對稱下做出看似明智卻錯誤的判斷，然後為維護自尊死不承認視野有盲區。",
    timing: "角色越界行為必須在一週內主動修正，不要等別人來糾正。未獲得書面授權前不要代表團隊做任何對外承諾。當上級開始主動向你確認某類決策的權限歸屬時，表示你的角色邊界正在被重新審視，保持低調等待。",
    basis: ["辨上下定民志","素履","眇能視跛能履","履虎尾不咥人","工作事業"],
    scoreAdjust: {"clarity":0,"action":0,"risk":0,"change":5,"support":0,"timing":0},
    qualityLevel: "gold",
    reviewed: true,
    reviewedBy: "stage2-cat-hex9-10",
    reviewedAt: "2026-07-12",
    needsHumanReview: false,
    version: "1.7.2-gold-cat-stage2"
  },
  {
    id: "hex-010-love",
    hexagramId: 10,
    category: "love",
    categoryName: "感情關係",
    meaning: "感情中的履卦以「履虎尾不咥人」為核心隱喻——親密本身就是走在危險邊緣的藝術，靠近另一個人的內心深處如同踩老虎尾巴，但真正的親密需要這種冒險。素履提供了最基本守則：在關係初期或敏感階段，樸素真誠不加修飾的態度比任何浪漫策略更能建立真實安全感。履道坦坦則表示若你們已走過初期的試探與風險，現在有機會進入彼此看得見的穩定階段。",
    advice: "針對關係中目前最敏感的一件事，主動提出一次不帶結論的討論——只分享各自的感受與底線，不要求對方承諾或改變。使用「我」開頭的表述，禁止「你總是」的指責句式。結束時確認：今天沒解決任何事，但我們標出了一條對方不該踩的線。",
    warning: "履虎尾在感情中最自毀的是明知對方底線在哪，卻為了測試自己的重要性故意踩上去。被咬一次可被諒解，第二次對方開始計算，第三次就會失去所有信任資本。履道坦坦被破壞的場景是：關係平穩後一方以為穩了就不再維護規則，道路突然崩裂時連回去的路都找不到。",
    timing: "剛經歷衝突和解後至少兩週平穩期才能引入新的敏感話題。不在同一個月內處理超過一個重大關係議題。若重複對伴侶說同樣的抱怨但對方毫無動靜，連續三次就該放棄說服式溝通，轉而尋求關係諮詢或第三方結構性協助。",
    basis: ["履虎尾不咥人","素履","履道坦坦","眇能視跛能履","感情關係"],
    scoreAdjust: {"clarity":0,"action":0,"risk":0,"change":5,"support":0,"timing":0},
    qualityLevel: "gold",
    reviewed: true,
    reviewedBy: "stage2-cat-hex9-10",
    reviewedAt: "2026-07-12",
    needsHumanReview: false,
    version: "1.7.2-gold-cat-stage2"
  },
  {
    id: "hex-010-people",
    hexagramId: 10,
    category: "people",
    categoryName: "人際合作",
    meaning: "人際中的履卦以「辨上下定民志」為基石——任何有效合作都始於對彼此角色、權限與責任的清楚界定。混亂的關係往往不是人不對，而是沒人說清楚誰有最終決定權。素履強調結盟基礎不是利益最大化，是雙方坦誠說出底線而不美化意圖。武人為于大君亮起紅燈：當你需要用強勢手段處理人際時，該考慮的不是如何贏，而是如何安全撤退。",
    advice: "對每段重要合作單獨約對方進行角色會議：各自列出自己負責的三件事和對方負責的三件事然後對照。重疊或遺漏處現場調整並記錄在共享文件中。結束時雙方說同一句話：我們約定的事我一週內開始執行，有困難三天內通知你。這不是信任問題，是合作基礎建設。",
    warning: "辨上下定民志在人際中最毒的毒藥是表面和氣但私下越界——公開裝作尊重對方權限，背後卻繞過他執行你要的決定。一旦曝光，失去的不是一個合作對象，是整個圈子對你誠信的評價。武人為于大君的另一陷阱是把每次分歧當成需要碾壓的對抗，最終所有人都在等你倒下。",
    timing: "設立角色協議後一個月仍無法正常運轉的合作關係，不該繼續投入妥協，應啟動退出討論。發現討論合作時情緒反應強過理性分析，暫停對話二十四小時後再回來。不把商業合作與私人友誼放在同一籃子裡評估，那是兩條不同的素履之路。",
    basis: ["辨上下定民志","素履","武人為于大君","履虎尾不咥人","人際合作"],
    scoreAdjust: {"clarity":0,"action":0,"risk":0,"change":5,"support":0,"timing":0},
    qualityLevel: "gold",
    reviewed: true,
    reviewedBy: "stage2-cat-hex9-10",
    reviewedAt: "2026-07-12",
    needsHumanReview: false,
    version: "1.7.2-gold-cat-stage2"
  },
  {
    id: "hex-010-family",
    hexagramId: 10,
    category: "family",
    categoryName: "家庭親人",
    meaning: "家庭中的履卦以「辨上下定民志」為核心——血緣關係中人們常因「一家人」就模糊了角色邊界：父母干涉成年子女的決定、子女用情感控制年邁父母、兄弟間沒有明確責任分工。素履點出回歸秩序的方法不是嚴厲家規，而是每個成員回歸自己角色本分，先做好自己該做的再期待別人配合。履道坦坦則是規則對所有人公平適用後的平靜狀態。",
    advice: "畫一張家庭角色圖：每個名字旁寫三件事——目前在做、該做但沒做、不該做卻在做的事。從中挑一件影響最大的「不該做卻在做」的事，單獨找當事人談，只談這件事的重新分配，給一個替代方案，不翻舊帳不擴散到其他家務。",
    warning: "辨上下定民志在家庭崩塌的劇本是父母用權威壓制成年子女的獨立意志，然後困惑孩子長大後為什麼什麼決定都不說。用權力而非尊重定義自己地位時，贏了一時控制輸掉一輩子連結。履道坦坦被毀的起點是有人說出「你是家人所以該懂我」——這是拒絕溝通的遮羞布。",
    timing: "節日聚會或重大家庭事件前兩週不啟動角色調整討論。選普通週末下午全家平穩時，先針對最小家務分工做調整示範，成功後逐步放大。某成員連續三次答應調整卻無行動，不再責備施壓，以外部資源填補該角色來保護家庭運作。",
    basis: ["辨上下定民志","素履","履道坦坦","履虎尾不咥人","家庭親人"],
    scoreAdjust: {"clarity":0,"action":0,"risk":0,"change":5,"support":0,"timing":0},
    qualityLevel: "gold",
    reviewed: true,
    reviewedBy: "stage2-cat-hex9-10",
    reviewedAt: "2026-07-12",
    needsHumanReview: false,
    version: "1.7.2-gold-cat-stage2"
  },
  {
    id: "hex-010-study",
    hexagramId: 10,
    category: "study",
    categoryName: "學習考試",
    meaning: "學習領域的履卦以「素履」為出發點——最有效的學習方法通常最樸素，不是花俏的筆記系統或記憶術，而是每天固定時間坐下來進行不受干擾的專注練習。眇能視跛能履挑戰你的學力盲點：那些「覺得自己會了但其實卡住」的知識像半盲的眼睛，讓你誤以為自己看得很清楚。視履考祥是學習週期的收尾：考完或完成單元後回頭檢驗答題路徑，在哪一步開始偏離就是真正弱點。",
    advice: "建立三層練習系統：基礎層每天三十分鐘只做基本功；挑戰層每週三次專攻一個之前錯過的題型直到連續三次全對；回顧層每週日拿出本週所有錯題重做，只做錯題。三層順序不可顛倒——跳過基礎層直接挑戰會強化錯誤路徑，跳過回顧層會讓錯誤沉澱為永久盲點。",
    warning: "眇能視在學習中最典型的災難發生在考前兩週——快速瀏覽後產生「我都懂了」的虛假安全感，實際上只是認得出答案的樣子而非能自己推導。壓力下這種假性理解會瞬間崩解。視履考祥的另一陷阱是用回顧取代練習：花太多時間分析錯誤而非實際修正，反思變成拖延的藉口。",
    timing: "第一層基礎練習不可中斷超過連續三天，否則挑戰層效果歸零。每完成一個單元給兩天緩衝再進入下一個。某難題在挑戰層連續五次無法攻克，停止挑戰轉向老師或同儕尋求示範演示——你要的不是更多努力，是一個正確解法的視覺範本。",
    basis: ["素履","眇能視跛能履","視履考祥","履虎尾不咥人","學習考試"],
    scoreAdjust: {"clarity":0,"action":0,"risk":0,"change":5,"support":0,"timing":0},
    qualityLevel: "gold",
    reviewed: true,
    reviewedBy: "stage2-cat-hex9-10",
    reviewedAt: "2026-07-12",
    needsHumanReview: false,
    version: "1.7.2-gold-cat-stage2"
  },
  {
    id: "hex-010-decision",
    hexagramId: 10,
    category: "decision",
    categoryName: "重大決策",
    meaning: "決策中的履卦標誌著需要極高精確度的判斷節點。「視履考祥」要求先完整回顧過去類似決定的軌跡——不是看結果好壞，是看你做決定時用了哪套邏輯、忽略了哪些信號。「夬履」是警訊：當你發現自己帶著「不管了就衝吧」的決絕心態下決定時，你很可能正在用果斷掩蓋對資訊不足的焦慮。素履再提醒：最樸素的評估框架往往比精緻的決策模型更可靠。",
    advice: "把眼前的重大決定拆成三個獨立子決定（如換工作拆成：離開現公司、接受新領域、搬遷居住地）。針對每個子決定單獨列出支持與反對的可驗證事實，只保留可證實或證偽的客觀資訊。三個子決定各自獨立評估後只推進得分最明確的那個，其餘保留。此拆解法可防止在全有或全無框架下做綁定式錯誤決策。",
    warning: "夬履式決策是所有失敗中最難挽回的——不是因資訊不足犯錯，是無法忍受懸而未決的模糊而選了隨便的答案。比做錯決定更糟的是知道自己在焦慮驅動下做的決定卻仍騙自己這是果斷。視履考祥被誤用時，一直在回顧分析過去卻從未進入當下決策，回顧成了不作為的包裝。",
    timing: "在拆解三個子決定並完成事實清單前不對任何人透露決策傾向，避免被外部期待綁架。子決定的事實支持反對比達三比一以上時可在四十八小時內行動。若三比一比例連續兩週無法達成，資訊條件尚未成熟，選擇維持現狀而非強行決定。",
    basis: ["視履考祥","夬履","素履","履虎尾不咥人","重大決策"],
    scoreAdjust: {"clarity":0,"action":0,"risk":0,"change":5,"support":0,"timing":0},
    qualityLevel: "gold",
    reviewed: true,
    reviewedBy: "stage2-cat-hex9-10",
    reviewedAt: "2026-07-12",
    needsHumanReview: false,
    version: "1.7.2-gold-cat-stage2"
  },
  {
    id: "hex-010-spiritual",
    hexagramId: 10,
    category: "spiritual",
    categoryName: "心境修行",
    meaning: "履卦在修行上凝結於「素履」二字——放下想顯得深刻或特別的慾望，回到最不加修飾的真實腳步。你不是因懂得很多道理才成為更好的人，而是在每個具體選擇中走了那條樸素但也更難的路。履虎尾不咥人意味著修行本質是與恐懼共存而不被控制：老虎是你的陰影與創傷，踩在牠尾巴上卻不被咬的秘訣不是比老虎強，是不驚慌失措去挑釁牠。視履考祥給出驗證：回頭看那些曾讓你夜不能寐的煩惱，是否真的值得那樣的恐懼。",
    advice: "選一個長期迴避的內在議題，三十天內每三天花十五分鐘只做一件事：觀察這個議題在腦中浮現時身體哪個部位最先有反應（胸口緊、胃收縮、肩膀僵硬）。不做詮釋不分析不試圖消除，只重複說「我注意到我的胃在收縮」。目的不是消滅恐懼，是讓你看清你害怕的不是老虎，是你對老虎反應的反應。",
    warning: "素履最常被誤解為什麼都不追求——這是懶惰借用樸素的外衣。真正的素履需在日常做具體且乏味的修行功課；拒絕紀律不是灑脫是自我放縱。另一陷阱是被咬後憎恨老虎，把陰影當外在敵人對抗，結果對抗中讓陰影更大。你終其一生無法殺死老虎，只能學會與祂一起走路而不被咬。",
    timing: "第一個月是危險期——你可能感到無聊與不耐煩，此時絕不增加新項目或跳學進階技巧。當能觀察身體反應而不產生第二層批判時，基本功已養成。三十天後舊有恐懼鬆動時不要急著測試邊界，讓它自然消散。",
    basis: ["素履","履虎尾不咥人","視履考祥","履道坦坦","心境修行"],
    scoreAdjust: {"clarity":0,"action":0,"risk":0,"change":5,"support":0,"timing":0},
    qualityLevel: "gold",
    reviewed: true,
    reviewedBy: "stage2-cat-hex9-10",
    reviewedAt: "2026-07-12",
    needsHumanReview: false,
    version: "1.7.2-gold-cat-stage2"
  }
];

// ─── Build id map ───
const newEntriesMap = new Map();
for (const e of [...hex9, ...hex10]) {
  newEntriesMap.set(e.id, e);
}

// ─── Update existing entries ───
const updated = [];
let updatedCount = 0;

for (const entry of allEntries) {
  const replacement = newEntriesMap.get(entry.id);
  if (replacement) {
    const merged = { ...entry, ...replacement };
    merged.meaning = replacement.meaning;
    merged.advice = replacement.advice;
    merged.warning = replacement.warning;
    merged.timing = replacement.timing;
    merged.basis = replacement.basis;
    merged.scoreAdjust = replacement.scoreAdjust;
    merged.qualityLevel = replacement.qualityLevel;
    merged.reviewed = replacement.reviewed;
    merged.reviewedBy = replacement.reviewedBy;
    merged.reviewedAt = replacement.reviewedAt;
    merged.needsHumanReview = replacement.needsHumanReview;
    merged.version = replacement.version;
    updated.push(merged);
    updatedCount++;
  } else {
    updated.push(entry);
  }
}

// ─── Verify completeness ───
const targetCategories = ['general','career','love','people','family','study','decision','spiritual'];
const hex9Updated = updated.filter(e => e.hexagramId === 9 && targetCategories.includes(e.category));
const hex10Updated = updated.filter(e => e.hexagramId === 10 && targetCategories.includes(e.category));

console.log(`Hex 9 target categories updated: ${hex9Updated.length}/8`);
hex9Updated.forEach(e => console.log(`  ${e.id}: m=${e.meaning.length} a=${e.advice.length} w=${e.warning.length} t=${e.timing.length}`));

console.log(`Hex 10 target categories updated: ${hex10Updated.length}/8`);
hex10Updated.forEach(e => console.log(`  ${e.id}: m=${e.meaning.length} a=${e.advice.length} w=${e.warning.length} t=${e.timing.length}`));

// ─── Verify field length ranges ───
let issues = [];
for (const e of [...hex9Updated, ...hex10Updated]) {
  if (e.meaning.length < 120 || e.meaning.length > 190) issues.push(`${e.id} meaning=${e.meaning.length} (need 120-190)`);
  if (e.advice.length < 100 || e.advice.length > 160) issues.push(`${e.id} advice=${e.advice.length} (need 100-160)`);
  if (e.warning.length < 80 || e.warning.length > 125) issues.push(`${e.id} warning=${e.warning.length} (need 80-125)`);
  if (e.timing.length < 60 || e.timing.length > 105) issues.push(`${e.id} timing=${e.timing.length} (need 60-105)`);
}

if (issues.length > 0) {
  console.log('\nLENGTH ISSUES:');
  issues.forEach(i => console.log('  ' + i));
  console.log('\nPlease fix the above entries and re-run.');
  process.exit(1);
} else {
  console.log('\nAll field lengths within range');
}

// ─── Verify hex-9 imagery assignments ───
console.log('\nImagery verification:');
const hex9ImageryMap = {
  general: ['密雲不雨自我西郊','復自道'],
  career: ['復自道','輿說輻','牽復'],
  love: ['夫妻反目','有孚攣如','有孚血去惕出'],
  people: ['牽復','有孚攣如','輿說輻'],
  family: ['夫妻反目','懿文德','有孚攣如'],
  study: ['輿說輻','懿文德','復自道'],
  decision: ['既雨既處月幾望','密雲不雨自我西郊','有孚血去惕出'],
  spiritual: ['懿文德','復自道','有孚血去惕出']
};
for (const [cat, imgs] of Object.entries(hex9ImageryMap)) {
  const entry = hex9Updated.find(e => e.category === cat);
  const text = entry.meaning + entry.advice + entry.warning + entry.timing;
  const found = imgs.filter(img => text.includes(img));
  const missing = imgs.filter(img => !text.includes(img));
  if (missing.length > 0) console.log(`  HEX9 ${cat}: MISSING imagery: ${missing.join(', ')}`);
  else console.log(`  HEX9 ${cat}: all imagery present (${found.join(', ')})`);
}

const hex10ImageryMap = {
  general: ['履虎尾不咥人','素履','視履考祥'],
  career: ['辨上下定民志','素履','眇能視跛能履'],
  love: ['履虎尾不咥人','素履','履道坦坦'],
  people: ['辨上下定民志','素履','武人為于大君'],
  family: ['辨上下定民志','素履','履道坦坦'],
  study: ['素履','眇能視跛能履','視履考祥'],
  decision: ['視履考祥','夬履','素履'],
  spiritual: ['素履','履虎尾不咥人','視履考祥']
};
for (const [cat, imgs] of Object.entries(hex10ImageryMap)) {
  const entry = hex10Updated.find(e => e.category === cat);
  const text = entry.meaning + entry.advice + entry.warning + entry.timing;
  const found = imgs.filter(img => text.includes(img));
  const missing = imgs.filter(img => !text.includes(img));
  if (missing.length > 0) console.log(`  HEX10 ${cat}: MISSING imagery: ${missing.join(', ')}`);
  else console.log(`  HEX10 ${cat}: all imagery present (${found.join(', ')})`);
}

// ─── Check for prohibited skeletons ───
console.log('\nProhibited pattern check:');
const prohibited = [
  '最基礎的準備最重要', '不要跳過基本功', '兩股力量需要平衡',
  '保持彈性並等待時機', '不要太快，也不要太慢', '先觀察，再決定',
  '目前仍有調整空間', '這是一個需要耐心的階段',
  '需要在行動與等待之間找到平衡', '此分類最常見的誤判'
];
let foundProhibited = false;
for (const e of [...hex9Updated, ...hex10Updated]) {
  const text = e.meaning + e.advice + e.warning + e.timing;
  for (const p of prohibited) {
    if (text.includes(p)) {
      console.log(`  FOUND prohibited "${p}" in ${e.id}`);
      foundProhibited = true;
    }
  }
}
if (!foundProhibited) console.log('  No prohibited patterns found');

// ─── Write output ───
const output = 'window.Zero1MatrixData = window.Zero1MatrixData || {};\nwindow.Zero1MatrixData.categoryInterpretations = ' + JSON.stringify(updated) + ';';
fs.writeFileSync(DATA_FILE, output, 'utf8');
console.log('\nWritten to: ' + DATA_FILE);
console.log('Total entries: ' + updated.length);
console.log('Updated entries: ' + updatedCount);

// ─── Verify with node --check ───
const { execSync } = require('child_process');
try {
  execSync(`"${NODE_EXE}" --check "${DATA_FILE}"`, { encoding: 'utf8', cwd: __dirname });
  console.log('node --check: PASSED');
} catch (err) {
  console.log('node --check: FAILED');
  console.log(err.stderr || err.message);
  process.exit(1);
}

console.log('\nstage2_cat_hex9_10.js completed successfully');