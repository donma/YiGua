// stage3_refl_hex9_10.js
// Generates per-hex-per-category UNIQUE reflection questions for hexagrams 9 (小畜) and 10 (履)
// 12 categories × 3 questions × 2 hexagrams = 72 total questions
// Three question roles per category:
//   Q1: Current State Recognition
//   Q2: Action & Choice
//   Q3: Risk, Boundary, or Timing

const vm = require('vm');
const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, '..', 'src', 'data', 'reflectionQuestions.data.js');
const NODE_EXE = path.join(__dirname, '..', '.nodejs', 'node-v22.14.0-win-x64', 'node.exe');

// ─── Load existing data ───
global.window = {};
const rawCode = fs.readFileSync(DATA_FILE, 'utf8');
vm.runInThisContext(rawCode);
const allQuestions = global.window.Zero1MatrixData.reflectionQuestions;

// ─── All 12 categories ───
const ALL_CATEGORIES = [
  { id: 'general',    name: '一般' },
  { id: 'career',     name: '工作事業' },
  { id: 'love',       name: '感情關係' },
  { id: 'money',      name: '財務金錢' },
  { id: 'people',     name: '人際合作' },
  { id: 'family',     name: '家庭親人' },
  { id: 'study',      name: '學習考試' },
  { id: 'health',     name: '身心狀態' },
  { id: 'decision',   name: '重大決策' },
  { id: 'business',   name: '創業經營' },
  { id: 'legal',      name: '官非合約' },
  { id: 'spiritual',  name: '心境修行' }
];

const NOW = '2026-07-13';
const REVIEWER = 'stage3-refl-hex9-10';
const VERSION = '1.7.3-refined-refl-stage3';

function makeEntry(hexagramId, hexagramName, catId, catName, questionNum, question, basisImagery) {
  return {
    id: `rf-${String(hexagramId).padStart(3, '0')}-${catId}-${questionNum}`,
    hexagramId,
    hexagramName,
    category: catId,
    categoryName: catName,
    question,
    basis: [hexagramName, ...basisImagery, catName],
    qualityLevel: 'refined',
    reviewed: false,
    reviewedBy: REVIEWER,
    reviewedAt: NOW,
    needsHumanReview: true,
    version: VERSION
  };
}

// ═══════════════════════════════════════════════════════════════
// HEX 9 小畜 (風天小畜) — 72 questions, 12 cats × 3
// Imagery per category:
// general:   密雲不雨自我西郊, 復自道, 懿文德
// career:    復自道, 牽復, 輿說輻
// love:      夫妻反目, 有孚攣如, 有孚血去惕出
// money:     密雲不雨, 既雨既處, 有孚攣如
// people:    牽復, 有孚攣如, 輿說輻
// family:    夫妻反目, 懿文德, 有孚攣如
// study:     輿說輻, 懿文德, 復自道
// health:    有孚血去惕出, 密雲不雨, 既雨既處
// decision:  既雨既處月幾望, 密雲不雨自我西郊, 有孚血去惕出
// business:  密雲不雨, 有孚攣如, 既雨既處
// legal:     有孚血去惕出, 密雲不雨, 既雨既處
// spiritual: 懿文德, 復自道, 有孚血去惕出
// ═══════════════════════════════════════════════════════════════

const HEX9_QUESTIONS = [
  // ── general ──
  makeEntry(9, '小畜', 'general', '一般', 1,
    '密雲不雨自我西郊描述的是條件已累積但尚未釋放的狀態——在你目前的整體處境中，哪一個領域的條件已經接近成熟、只差最後一步？這一步卡住的原因是你內在的準備不足，還是外部的窗口尚未打開？',
    ['密雲不雨自我西郊', '復自道']),
  makeEntry(9, '小畜', 'general', '一般', 2,
    '小畜卦的復自道提醒你回到自己的主軸——如果你發現自己為了等待某個條件而偏離了原本的方向，你選擇繼續等待那個條件，還是先回到主軸上重新累積？兩條路徑各自的代價是什麼？',
    ['復自道', '密雲不雨自我西郊']),
  makeEntry(9, '小畜', 'general', '一般', 3,
    '既雨既處月幾望是積蓄釋放的轉折點——在你目前的處境中，哪個具體的訊號出現時你會知道「密雲期」已經結束、可以開始行動了？如果你誤判了這個訊號而提前行動，最難修復的後果會是什麼？',
    ['既雨既處', '密雲不雨自我西郊']),

  // ── career ──
  makeEntry(9, '小畜', 'career', '工作事業', 1,
    '輿說輻的意象是車輪與軸的連接鬆脫——在你目前的工作中，哪一個環節是你投入了最多努力卻無法傳導為實際成果的？這個斷點是在制度流程上、上級授權上，還是你自己的專業能力邊界上？',
    ['輿說輻', '復自道']),
  makeEntry(9, '小畜', 'career', '工作事業', 2,
    '牽復意味著你需要回頭拉住進度落後的人——但如果你發現自己一直在回頭拉人而自己的進度也開始落後，你選擇先確保自己的部分完成再回來協助，還是堅持團隊同步前進即使整體速度更慢？',
    ['牽復', '輿說輻']),
  makeEntry(9, '小畜', 'career', '工作事業', 3,
    '復自道要求回到被跳過的基礎步驟——在你的職場中，哪一個被你認為「已經過關」的環節其實尚未真正完成、隨時可能反噬？如果你繼續前進而不回頭補強，這個環節崩塌時會先擊中你的哪個弱點？',
    ['復自道', '輿說輻']),

  // ── love ──
  makeEntry(9, '小畜', 'love', '感情關係', 1,
    '夫妻反目描述的往往不是一次大吵，而是長期微小不滿如密雲累積後的突然傾瀉——你目前的關係中，哪一種情緒已經被壓抑了很久但尚未被對方真正聽見？這個情緒如果不被表達，會在哪個不相干的觸發點上失控？',
    ['夫妻反目', '有孚攣如']),
  makeEntry(9, '小畜', 'love', '感情關係', 2,
    '有孚攣如揭示兩人的情緒像被繩索綁在一起——當你察覺伴侶的情緒波動正在牽動你的判斷時，你選擇暫時拉開距離讓彼此冷靜，還是主動靠近去理解對方的波動源頭？哪種方式更可能避免情緒連鎖導致的錯誤決定？',
    ['有孚攣如', '夫妻反目']),
  makeEntry(9, '小畜', 'love', '感情關係', 3,
    '有孚血去惕出指出誠信需要經歷傷害的考驗才能被重新確認——如果你們的信任曾因某件事受損，你怎麼判斷自己已經「惕出」、不再被過去的恐懼支配，而不是假裝痊癒卻仍在暗中防備？',
    ['有孚血去惕出', '有孚攣如']),

  // ── money ──
  makeEntry(9, '小畜', 'money', '財務金錢', 1,
    '密雲不雨在財務上意味著資源正在聚集但尚未形成可動用的流動性——你目前的財務結構中，哪一筆資金或資產最接近「只差一步就能釋放」，但那一條路徑的風險你真的評估清楚了嗎？',
    ['密雲不雨', '既雨既處']),
  makeEntry(9, '小畜', 'money', '財務金錢', 2,
    '既雨既處描述積蓄終於釋放的時刻——如果你現在有一筆資金即將到位或一個財務決定即將定案，你會選擇立即運用這筆資源去擴大佈局，還是先讓它「處」下來沉澱一陣子再決定用途？兩者的機會成本各是什麼？',
    ['既雨既處', '密雲不雨']),
  makeEntry(9, '小畜', 'money', '財務金錢', 3,
    '有孚攣如的繩索意象在財務上指向過度緊密的資金連鎖——你的財務安排中，哪一條鏈接一旦斷裂就會連鎖拖垮其他部分？這個風險你目前是用什麼方式在控管，還是因為尚未發生而選擇忽略？',
    ['有孚攣如', '既雨既處']),

  // ── people ──
  makeEntry(9, '小畜', 'people', '人際合作', 1,
    '牽復在人際合作中的核心是有人需要回頭拉住進度落後的一方——在你目前的合作關係中，哪一個人正在拖慢整體節奏，而你之所以還沒有處理這個問題，是因為顧及情面、擔心衝突，還是你尚未找到替代方案？',
    ['牽復', '輿說輻']),
  makeEntry(9, '小畜', 'people', '人際合作', 2,
    '有孚攣如揭示過度緊密的聯盟會讓一人的困境變成所有人的枷鎖——當你發現自己因為某個合作夥伴的失誤而被連累時，你選擇繼續支撐這段關係以求長遠信任，還是果斷切割保護自己的信用？切割的代價與不切割的代價哪個更難承受？',
    ['有孚攣如', '牽復']),
  makeEntry(9, '小畜', 'people', '人際合作', 3,
    '輿說輻在合作中意味著表面共識已經鬆動、但雙方仍在靠習慣維繫——你目前哪一段合作關係正處於這種「協議還在但執行力已瓦解」的狀態？你打算等到哪個具體訊號出現才承認這段合作需要重組？',
    ['輿說輻', '牽復']),

  // ── family ──
  makeEntry(9, '小畜', 'family', '家庭親人', 1,
    '夫妻反目在家庭中不僅指夫妻，也象徵任何因長期角色僵化而產生的對立——在你的家庭中，哪一個成員被固定在一個角色裡太久（如永遠的照顧者、永遠的經濟支柱、永遠聽話的孩子），而這個角色已經開始讓他/她感到不被看見？',
    ['夫妻反目', '懿文德']),
  makeEntry(9, '小畜', 'family', '家庭親人', 2,
    '懿文德揭示化解之道在於家庭文化的重塑而非權力重分配——如果你要為你的家庭設計一個新的小儀式（如每週一次不帶手機的共餐、輪流說一件感謝的事），你會先從哪個成員的需求出發，還是從自己願意先改變的行為開始？',
    ['懿文德', '夫妻反目']),
  makeEntry(9, '小畜', 'family', '家庭親人', 3,
    '有孚攣如在家庭中意味著情緒連鎖比任何場合都更難切斷——當一個成員的低落情緒開始像病毒一樣感染整個家庭氣氛時，你通常會用什麼方式去「拉住」這個情緒不讓它擴散？這種方式是否只是暫時壓制而非真正化解？',
    ['有孚攣如', '懿文德']),

  // ── study ──
  makeEntry(9, '小畜', 'study', '學習考試', 1,
    '輿說輻在學習中的精準診斷是你踩著油門但輪子不咬路面——你目前投入最多時間練習的科目或技能中，哪一個是你其實在用「重複已會的內容」來獲得安全感，而非真正挑戰薄弱環節？',
    ['輿說輻', '復自道']),
  makeEntry(9, '小畜', 'study', '學習考試', 2,
    '懿文德要求你先建立學習的意義感——如果你對目前正在學的某個科目感到倦怠，你選擇回頭重新理解「為什麼要學這個」來找回動機，還是用紀律強迫自己繼續前進直到突破瓶頸？兩種策略分別在什麼條件下有效？',
    ['懿文德', '輿說輻']),
  makeEntry(9, '小畜', 'study', '學習考試', 3,
    '復自道要求退回基礎重新建立理解框架——當你發現自己在某個科目上一直卡關，你願意退回到哪一層基礎去重新來過？退回之後，你給自己多少時間來判斷這個方向是對的，而不是在浪費時間？',
    ['復自道', '輿說輻']),

  // ── health ──
  makeEntry(9, '小畜', 'health', '身心狀態', 1,
    '有孚血去惕出描述的是讓恐懼與傷痛「出血離開」的過程——你目前的身心狀態中，哪一個長期累積的壓力或情緒正在以身體症狀的方式向你發出信號，而你仍在用「再撐一下就會好」的方式回應它？',
    ['有孚血去惕出', '密雲不雨']),
  makeEntry(9, '小畜', 'health', '身心狀態', 2,
    '密雲不雨在身體上象徵能量蓄積卻無法釋放——當你感到疲憊積壓卻睡不著、或壓力堆疊卻無處宣洩時，你選擇用運動或創作去「人工降雨」，還是繼續等待環境自然解除壓力？等待的過程中你的身體正在承受什麼代價？',
    ['密雲不雨', '既雨既處']),
  makeEntry(9, '小畜', 'health', '身心狀態', 3,
    '既雨既處是能量釋放後的恢復期——你通常怎麼判斷自己已經從一段高壓或耗損中「處」下來、可以重新出發，而不是在尚未恢復時就急著回到原本的節奏？你上一次誤判這個時機時，身體給了你什麼警告？',
    ['既雨既處', '有孚血去惕出']),

  // ── decision ──
  makeEntry(9, '小畜', 'decision', '重大決策', 1,
    '既雨既處月幾望描述的是雨已下過、月快滿但尚未完全圓的微妙節點——你目前正在面對的重大決定中，哪一個條件已經「下雨了」（證據到位），哪一個條件還只是「月幾望」（看似快到位但仍有缺口）？你對這兩者的區分標準是什麼？',
    ['既雨既處月幾望', '密雲不雨自我西郊']),
  makeEntry(9, '小畜', 'decision', '重大決策', 2,
    '密雲不雨自我西郊意味著關鍵資訊還掌握在他人手中——如果你正在等某個人給答案才能做決定而對方遲遲不回應，你給自己設定的等待期限是多久？期限到資訊仍不出現時，你視為否定信號另尋路徑，還是延長期限繼續等？',
    ['密雲不雨自我西郊', '有孚血去惕出']),
  makeEntry(9, '小畜', 'decision', '重大決策', 3,
    '有孚血去惕出要求剔除內心恐懼後再檢視剩下的選項——如果你把目前這個決定中所有出於「害怕失去」、「害怕丟臉」、「害怕後悔」的因素全部移除，剩下的那個選項是什麼？這個選項為什麼之前被你的恐懼遮蔽了？',
    ['有孚血去惕出', '既雨既處月幾望']),

  // ── business ──
  makeEntry(9, '小畜', 'business', '創業經營', 1,
    '密雲不雨在創業中意味著產品或服務已經準備好但市場尚未回應——你的項目目前卡在哪一層雲裡：是產品本身還不夠成熟，是客戶尚未意識到需求，還是你的推廣路徑根本沒打到對的人？',
    ['密雲不雨', '有孚攣如']),
  makeEntry(9, '小畜', 'business', '創業經營', 2,
    '有孚攣如的繩索在經營中指向過度依賴單一客戶、單一通路或單一合作夥伴——如果你目前的營收中有一個來源占比過高，你選擇在既有關係上深耕擴大份額，還是優先分散風險開拓新來源？哪一條路在你目前資源下更可行？',
    ['有孚攣如', '密雲不雨']),
  makeEntry(9, '小畜', 'business', '創業經營', 3,
    '既雨既處意味著第一波成果釋放後的盤整期——當你的業務終於突破某個門檻後，你如何判斷接下來該「處」下來鞏固基礎，還是趁勢繼續擴張？如果你選錯了時機，最難挽回的是資金耗盡還是團隊信心瓦解？',
    ['既雨既處', '密雲不雨']),

  // ── legal ──
  makeEntry(9, '小畜', 'legal', '官非合約', 1,
    '有孚血去惕出在官非合約中的核心是信任經過傷害考驗後的重新確認——你目前正在處理的合約或法律事務中，哪一個條款或對方的承諾是你「想要相信」但尚未經過實際驗證的？你手上握有什麼機制可以在對方失信時保護自己？',
    ['有孚血去惕出', '密雲不雨']),
  makeEntry(9, '小畜', 'legal', '官非合約', 2,
    '密雲不雨在合約事務中表示雙方條件已談得差不多、但關鍵共識尚未落地——當對方在最後階段提出新的要求或修改時，你選擇接受讓步以促成簽約，還是堅持原條件即使可能讓談判回到原點？你的底線是寫在合約裡的還是寫在心裡的？',
    ['密雲不雨', '既雨既處']),
  makeEntry(9, '小畜', 'legal', '官非合約', 3,
    '既雨既處在合約簽訂後代表執行階段才剛剛開始——你過去簽過的合約中，哪一個是「簽完就放在抽屜裡」沒有持續追蹤執行的？現在回頭看，那個疏忽的代價是什麼？下一個合約你要設立什麼機制確保不再犯同樣錯誤？',
    ['既雨既處', '有孚血去惕出']),

  // ── spiritual ──
  makeEntry(9, '小畜', 'spiritual', '心境修行', 1,
    '懿文德的核心命題是誠實面對你內心真正敬重的是什麼——在過去一個月中，你的每日行為有多少比例是出於對某個價值的真正敬重，又有多少是出於害怕不被認同、害怕孤獨或害怕失敗？兩者的比例讓你對自己有什麼新的認識？',
    ['懿文德', '復自道']),
  makeEntry(9, '小畜', 'spiritual', '心境修行', 2,
    '復自道揭示修行者最難的一步是發現偏離初衷後不帶羞恥地走回原路——如果你發現自己正在追求曾發誓不碰的目標（如追逐名聲、討好他人），你繼續走下去還是承認偏離重新校準？校準帶來的羞恥感如何面對而不自我攻擊？',
    ['復自道', '有孚血去惕出']),
  makeEntry(9, '小畜', 'spiritual', '心境修行', 3,
    '有孚血去惕出指向一個痛苦但必要的過程：把因恐懼而做的偽裝一一認出來讓它們出血離開——你目前生活中哪一個「人設」或「形象」是你最害怕被拆穿的？這個偽裝是從什麼時候開始的，維持它正在消耗你什麼能量？',
    ['有孚血去惕出', '懿文德'])
];

// ═══════════════════════════════════════════════════════════════
// HEX 10 履 (天澤履) — 72 questions, 12 cats × 3
// Imagery per category:
// general:   履虎尾不咥人, 素履, 視履考祥
// career:    辨上下定民志, 素履, 眇能視跛能履
// love:      履虎尾不咥人, 素履, 履道坦坦
// money:     素履, 履道坦坦, 視履考祥
// people:    辨上下定民志, 素履, 武人為于大君
// family:    辨上下定民志, 素履, 履道坦坦
// study:     素履, 眇能視跛能履, 視履考祥
// health:    素履, 眇能視跛能履, 履道坦坦
// decision:  視履考祥, 夬履, 素履
// business:  素履, 辨上下定民志, 夬履
// legal:     履虎尾, 素履, 視履考祥
// spiritual: 素履, 履虎尾不咥人, 視履考祥
// ═══════════════════════════════════════════════════════════════

const HEX10_QUESTIONS = [
  // ── general ──
  makeEntry(10, '履', 'general', '一般', 1,
    '履虎尾不咥人描述的是你正踩在老虎尾巴上、險到極致反而安全的狀態——在你目前的整體處境中，哪一個對象、制度或權力結構是你明知靠近會有風險、但此刻不得不與之共處的？你對這隻「老虎」的底線了解多少？',
    ['履虎尾不咥人', '素履']),
  makeEntry(10, '履', 'general', '一般', 2,
    '素履告訴你越樸素不張揚越不會被誤判為威脅——當你面對一個有力量的存在時，你選擇低調行事等待局勢明朗，還是主動表態以爭取主導權？如果你選擇低調，你如何確保這不是退縮而是策略？',
    ['素履', '履虎尾不咥人']),
  makeEntry(10, '履', 'general', '一般', 3,
    '視履考祥提醒風險管理是持續的自我審計而非一次性的測驗——你上一次安全過關後，有沒有因為「沒事」而降低了對下一個風險的敏感度？你如何防止每次安全過關都讓自己更接近下一次真正的危險？',
    ['視履考祥', '履虎尾不咥人']),

  // ── career ──
  makeEntry(10, '履', 'career', '工作事業', 1,
    '辨上下定民志在職場中的核心是清楚辨認組織內的層級與權限——你目前的工作中，哪一個決策或行動你正在執行但其實超出了你的正式權限？這個越界是你的主管默許的、你自己判斷必要的，還是你根本沒意識到已越線？',
    ['辨上下定民志', '眇能視跛能履']),
  makeEntry(10, '履', 'career', '工作事業', 2,
    '眇能視跛能履是嚴厲的提醒：你自以為看清全局卻有一眼半盲——當你發現自己在某個職場決策上可能誤判了局勢，你選擇繼續堅持原判來維護專業形象，還是承認視野有限並尋求他人補足盲區？哪種選擇長期對你的職涯信用更有利？',
    ['眇能視跛能履', '素履']),
  makeEntry(10, '履', 'career', '工作事業', 3,
    '素履要求依循角色本分做事讓每個行動都有制度背書——當你被要求執行一件沒有明確制度依據的任務時，你要求先補上書面授權再行動的底線在哪裡？如果上級催促你先做再說，你願意承擔的個人風險上限是什麼？',
    ['素履', '辨上下定民志']),

  // ── love ──
  makeEntry(10, '履', 'love', '感情關係', 1,
    '履虎尾不咥人在感情中意味著親密本身就是走在危險邊緣的藝術——你目前的關係中，哪一個話題或底線是你明知踩到會引發衝突、但仍然需要去面對的？你之所以還沒開口，是因為時機不對、害怕後果，還是你不確定對方會如何反應？',
    ['履虎尾不咥人', '履道坦坦']),
  makeEntry(10, '履', 'love', '感情關係', 2,
    '素履在關係初期或敏感階段要求樸素真誠不加修飾——如果你發現自己在伴侶面前刻意隱藏某個真實面向（如經濟狀況、家庭背景、真實情緒），你選擇繼續維持這個形象直到關係更穩定再坦誠，還是現在就冒著失去對方的風險揭露？',
    ['素履', '履虎尾不咥人']),
  makeEntry(10, '履', 'love', '感情關係', 3,
    '履道坦坦表示走過初期的試探與風險後有機會進入彼此看得見的穩定階段——你如何區分你們的關係是真正進入了坦途，還是只是雙方都累了、不再願意為關係中的問題爭吵？沉默的穩定和真正的穩定差別在哪裡？',
    ['履道坦坦', '素履']),

  // ── money ──
  makeEntry(10, '履', 'money', '財務金錢', 1,
    '素履在財務上要求最樸素的理財原則——你目前的財務習慣中，哪一個看似無害的小支出或小決策其實正在累積成一個你不敢直視的漏洞？這個漏洞如果再持續三個月，會對你的財務安全線造成多大的侵蝕？',
    ['素履', '履道坦坦']),
  makeEntry(10, '履', 'money', '財務金錢', 2,
    '履道坦坦在財務上暗示一條穩定可預期的路徑——當你面前出現一個高報酬但高風險的機會和一條穩定但緩慢的累積路徑時，你如何衡量自己目前能承受的波動幅度？如果高風險那條路失敗，你的最低生活品質會下降到什麼程度？',
    ['履道坦坦', '視履考祥']),
  makeEntry(10, '履', 'money', '財務金錢', 3,
    '視履考祥要求回頭檢視每一筆重大財務決定的路徑——你過去一年中最大的一筆支出或投資，如果現在回頭用同樣的邏輯重新評估，你會做出不同的決定嗎？那個決定的失誤點是在資訊不足、情緒驅動，還是被他人影響？',
    ['視履考祥', '素履']),

  // ── people ──
  makeEntry(10, '履', 'people', '人際合作', 1,
    '辨上下定民志在人際合作中的基石是對彼此角色、權限與責任的清楚界定——你目前的合作關係中，哪一段的責任邊界最模糊、最容易在出事時互相推諉？為什麼你還沒有把這條線畫清楚——是怕傷感情，還是你自己也不確定該怎麼分？',
    ['辨上下定民志', '武人為于大君']),
  makeEntry(10, '履', 'people', '人際合作', 2,
    '武人為于大君亮起紅燈：當你需要用強勢手段處理人際時，該考慮的不是如何贏而是如何安全撤退——如果你發現某段合作關係已經惡化到需要「武力」解決，你是選擇繼續對抗直到分出勝負，還是承認這條路已走不通並啟動退出機制？',
    ['武人為于大君', '素履']),
  makeEntry(10, '履', 'people', '人際合作', 3,
    '素履強調結盟基礎不是利益最大化而是雙方坦誠說出底線——在下一段合作關係開始前，你打算先坦白自己的哪一個限制或弱點，來測試對方是否值得信任？如果你先亮出底牌對方卻趁機壓價，你要如何保護自己？',
    ['素履', '辨上下定民志']),

  // ── family ──
  makeEntry(10, '履', 'family', '家庭親人', 1,
    '辨上下定民志在家庭中提醒血緣關係不能模糊角色邊界——你的家庭中，哪一個成員正在做「不該由他/她做」的事（如子女承擔父母的情緒、父母控制成年子女的決定、兄弟間責任分配嚴重不均），而全家都在假裝這很正常？',
    ['辨上下定民志', '素履']),
  makeEntry(10, '履', 'family', '家庭親人', 2,
    '素履點出回歸秩序的方法不是嚴厲家規而是每個成員回歸自己角色本分——如果你要從自己開始調整，你會先停止做哪一件「不是你該做的事」來示範角色歸位？停止之後，你預期誰會第一個感到不適應？',
    ['素履', '履道坦坦']),
  makeEntry(10, '履', 'family', '家庭親人', 3,
    '履道坦坦是規則對所有人公平適用後的平靜狀態——在你的家庭中，目前有沒有一條規則是只適用於某些成員、對另一些成員卻寬鬆的？這條不公平的規則如果被挑戰，第一個跳出來捍衛它的人會是誰？',
    ['履道坦坦', '辨上下定民志']),

  // ── study ──
  makeEntry(10, '履', 'study', '學習考試', 1,
    '眇能視跛能履在學習中挑戰你的學力盲點——那些「覺得自己會了但其實卡住」的知識像半盲的眼睛讓你誤以為看得很清楚：你最近一次考試或測驗中，哪一題是你「考前覺得很簡單」卻意外答錯的？那個盲點現在還在嗎？',
    ['眇能視跛能履', '視履考祥']),
  makeEntry(10, '履', 'study', '學習考試', 2,
    '素履提醒最有效的學習方法通常最樸素——當你被各種花俏的學習法（筆記系統、記憶術、速讀技巧）吸引時，你願不願意放棄這些輔助工具，回到每天固定時間坐下來不受干擾地專注練習？你上一次樸素地學習超過兩小時是什麼時候？',
    ['素履', '眇能視跛能履']),
  makeEntry(10, '履', 'study', '學習考試', 3,
    '視履考祥是學習週期的收尾：考完或完成單元後回頭檢驗答題路徑——你通常花多少時間在回顧錯誤上，相較於花在練習新題目的時間？如果你發現回顧時間遠少於練習時間，你願意犧牲多少新進度來補強回顧？',
    ['視履考祥', '素履']),

  // ── health ──
  makeEntry(10, '履', 'health', '身心狀態', 1,
    '眇能視跛能履在身體上的隱喻是你覺得自己還撐得住但其實某個系統已經在透支——你目前的身心狀態中，哪一個警訊（如長期失眠、不明疼痛、情緒低落）已經出現但你仍在用「還好啦大家都這樣」來合理化？',
    ['眇能視跛能履', '素履']),
  makeEntry(10, '履', 'health', '身心狀態', 2,
    '素履在健康上要求回到最基本的照顧方式——當你面對一個健康問題時，你傾向於尋求快速解決方案（藥物、補品、偏方）還是願意從最基礎的睡眠、飲食、運動開始調整？如果基礎方案需要三個月才見效，你能堅持到那時候嗎？',
    ['素履', '履道坦坦']),
  makeEntry(10, '履', 'health', '身心狀態', 3,
    '履道坦坦是身體恢復平穩後的穩定階段——你如何判斷自己已經真正康復而非只是症狀消失？你上一次因為急著回到正常生活而導致舊傷復發或病情反覆，是哪一個「太快回來」的決定造成的？',
    ['履道坦坦', '眇能視跛能履']),

  // ── decision ──
  makeEntry(10, '履', 'decision', '重大決策', 1,
    '視履考祥要求在做重大決定前先完整回顧過去類似決定的軌跡——你上一次做類似決定時，用的是哪套邏輯？那套邏輯中你忽略了哪些後來被證明是關鍵的信號？這一次，你打算用什麼不同的方式來捕捉那些容易被忽略的信號？',
    ['視履考祥', '夬履']),
  makeEntry(10, '履', 'decision', '重大決策', 2,
    '夬履是警訊：當你發現自己帶著「不管了就衝吧」的決絕心態下決定時，你很可能正在用果斷掩蓋對資訊不足的焦慮——你目前面對的決定中，有沒有哪一個已經讓你想說出「算了就賭這一次」？如果真的賭輸，你準備的退場方案是什麼？',
    ['夬履', '素履']),
  makeEntry(10, '履', 'decision', '重大決策', 3,
    '素履提醒最樸素的評估框架往往比精緻的決策模型更可靠——如果你只能問自己三個最簡單的問題來判斷這個決定該不該做，你會問哪三個問題？這三個問題的答案中，哪一個是你目前最不想面對的？',
    ['素履', '視履考祥']),

  // ── business ──
  makeEntry(10, '履', 'business', '創業經營', 1,
    '素履在創業中要求先確認自己最基本的競爭優勢而非追逐風口——你目前的項目中，哪一個核心能力是你真正比別人強的，哪一個只是你「希望自己比別人強」但實際上並無優勢？這兩者的混淆正在如何影響你的資源分配？',
    ['素履', '辨上下定民志']),
  makeEntry(10, '履', 'business', '創業經營', 2,
    '辨上下定民志在經營中要求清楚界定誰有最終決定權——你與合夥人或投資人之間，是否存在一個重大決策的權限歸屬尚未明確？當這個決策必須在二十四小時內做出而雙方意見分歧時，你認為最終決定權應該在誰手上、依據是什麼？',
    ['辨上下定民志', '夬履']),
  makeEntry(10, '履', 'business', '創業經營', 3,
    '夬履在經營決策中是最危險的信號——你上一次在經營上做出「不管了就衝」的決定是什麼時候？那個決定的結果如何？如果結果是好的，你是否開始合理化「衝動等於果斷」？如果結果是壞的，你從中學到的教訓現在還在遵守嗎？',
    ['夬履', '素履']),

  // ── legal ──
  makeEntry(10, '履', 'legal', '官非合約', 1,
    '履虎尾在官非合約中是最直接的警告：你正在靠近一個有反擊能力的對象——你目前涉及的事務中，對方的哪一個條款或立場是你覺得不合理但你仍在配合的？你之所以沒有提出異議，是因為評估對方實力太強，還是你手上沒有足夠證據？',
    ['履虎尾', '視履考祥']),
  makeEntry(10, '履', 'legal', '官非合約', 2,
    '素履在法律事務中要求一切以書面為憑不靠口頭承諾——你過去是否有過因為信任對方而沒有留下書面紀錄、事後卻吃虧的經驗？在下一個合約或協議中，你打算設立什麼具體機制來確保所有承諾都有可查證的紀錄？',
    ['素履', '履虎尾']),
  makeEntry(10, '履', 'legal', '官非合約', 3,
    '視履考祥在合約糾紛中要求回頭檢視整個過程的每一步——如果你現在正在處理的合約爭議可以重來一次，你在哪一個時間點會做出不同的決定？那個時間點的失誤是資訊不對稱、過度信任，還是你根本沒有意識到風險正在累積？',
    ['視履考祥', '素履']),

  // ── spiritual ──
  makeEntry(10, '履', 'spiritual', '心境修行', 1,
    '素履在修行上凝結於放下想顯得深刻或特別的慾望——你目前在修行或自我成長的路上，有沒有哪個行為其實更多是為了讓自己「看起來像個修行者」而非真正在修？當你獨處無人看見時，你還會做那件事嗎？',
    ['素履', '履虎尾不咥人']),
  makeEntry(10, '履', 'spiritual', '心境修行', 2,
    '履虎尾不咥人揭示修行本質是與恐懼共存而不被控制——你內心那隻「老虎」（最深層的恐懼或陰影）最近一次出現是在什麼情境下？那次你是怎麼反應的——是驚慌對抗、假裝沒看見，還是安靜觀察牠而不被牠驅動？',
    ['履虎尾不咥人', '視履考祥']),
  makeEntry(10, '履', 'spiritual', '心境修行', 3,
    '視履考祥給出驗證：回頭看那些曾讓你夜不能寐的煩惱是否真的值得那樣的恐懼——你一年前最讓你焦慮的那件事，現在回頭看，它對你的實際影響有多大？這個「時間驗證法」能否應用到你此刻最焦慮的事情上？',
    ['視履考祥', '素履'])
];

// ─── Merge: replace hex 9 and hex 10 entries, keep all others ───
const newEntriesMap = new Map();
for (const q of [...HEX9_QUESTIONS, ...HEX10_QUESTIONS]) {
  newEntriesMap.set(q.id, q);
}

const merged = [];
let replacedCount = 0;

for (const q of allQuestions) {
  const replacement = newEntriesMap.get(q.id);
  if (replacement) {
    merged.push(replacement);
    replacedCount++;
  } else {
    merged.push(q);
  }
}

// Also add any new entries that didn't exist before (if schema expanded)
for (const [id, q] of newEntriesMap) {
  if (!allQuestions.some(existing => existing.id === id)) {
    merged.push(q);
    replacedCount++;
    console.log(`  NEW: ${id}`);
  }
}

console.log(`Total entries: ${merged.length}`);
console.log(`Replaced/Added entries: ${replacedCount}`);

// ─── Verification ───
const hex9Merged = merged.filter(q => q.hexagramId === 9);
const hex10Merged = merged.filter(q => q.hexagramId === 10);

console.log(`\nHex 9 questions: ${hex9Merged.length} (expected 36)`);
console.log(`Hex 10 questions: ${hex10Merged.length} (expected 36)`);

// Verify all 12 categories present for each hex
for (const [label, questions] of [['Hex 9', hex9Merged], ['Hex 10', hex10Merged]]) {
  const cats = [...new Set(questions.map(q => q.category))];
  const missing = ALL_CATEGORIES.filter(c => !cats.includes(c.id));
  console.log(`\n${label} categories: ${cats.length}/12`);
  if (missing.length > 0) console.log(`  MISSING: ${missing.map(c => c.id).join(', ')}`);
  for (const cat of ALL_CATEGORIES) {
    const qs = questions.filter(q => q.category === cat.id);
    if (qs.length !== 3) console.log(`  ${cat.id}: ${qs.length} questions (expected 3)`);
  }
}

// Verify question lengths (38-105 characters)
console.log('\n--- Question length check (38-105 chars) ---');
let lengthIssues = 0;
for (const q of [...HEX9_QUESTIONS, ...HEX10_QUESTIONS]) {
  const len = q.question.length;
  if (len < 38 || len > 105) {
    console.log(`  LENGTH: ${q.id} = ${len} chars`);
    lengthIssues++;
  }
}
if (lengthIssues === 0) console.log('  All questions within 38-105 character range');

// Verify all end with ?
console.log('\n--- Question ending check ---');
let endingIssues = 0;
for (const q of [...HEX9_QUESTIONS, ...HEX10_QUESTIONS]) {
  if (!q.question.trim().endsWith('？') && !q.question.trim().endsWith('?')) {
    console.log(`  NO_QUESTION_MARK: ${q.id}`);
    endingIssues++;
  }
}
if (endingIssues === 0) console.log('  All questions end with ？');

// Verify hex-specific imagery in at least 2 of 3 per category group
console.log('\n--- Imagery presence check (≥2/3 per group) ---');
const hex9ImageryByCat = {
  general:  ['密雲不雨', '復自道', '懿文德'],
  career:   ['復自道', '牽復', '輿說輻'],
  love:     ['夫妻反目', '有孚攣如', '有孚血去惕出'],
  money:    ['密雲不雨', '既雨既處', '有孚攣如'],
  people:   ['牽復', '有孚攣如', '輿說輻'],
  family:   ['夫妻反目', '懿文德', '有孚攣如'],
  study:    ['輿說輻', '懿文德', '復自道'],
  health:   ['有孚血去惕出', '密雲不雨', '既雨既處'],
  decision: ['既雨既處', '密雲不雨', '有孚血去惕出'],
  business: ['密雲不雨', '有孚攣如', '既雨既處'],
  legal:    ['有孚血去惕出', '密雲不雨', '既雨既處'],
  spiritual: ['懿文德', '復自道', '有孚血去惕出']
};

let imageryFailures = 0;
for (const [cat, imgs] of Object.entries(hex9ImageryByCat)) {
  const group = HEX9_QUESTIONS.filter(q => q.category === cat);
  let imgCount = 0;
  for (const q of group) {
    const hasImg = imgs.some(img => q.question.includes(img));
    if (hasImg) imgCount++;
  }
  if (imgCount < 2) {
    console.log(`  HEX9 ${cat}: only ${imgCount}/3 questions use imagery (need ≥2)`);
    imageryFailures++;
  }
}

const hex10ImageryByCat = {
  general:   ['履虎尾', '素履', '視履考祥'],
  career:    ['辨上下定民志', '素履', '眇能視跛能履'],
  love:      ['履虎尾', '素履', '履道坦坦'],
  money:     ['素履', '履道坦坦', '視履考祥'],
  people:    ['辨上下定民志', '素履', '武人為于大君'],
  family:    ['辨上下定民志', '素履', '履道坦坦'],
  study:     ['素履', '眇能視跛能履', '視履考祥'],
  health:    ['素履', '眇能視跛能履', '履道坦坦'],
  decision:  ['視履考祥', '夬履', '素履'],
  business:  ['素履', '辨上下定民志', '夬履'],
  legal:     ['履虎尾', '素履', '視履考祥'],
  spiritual: ['素履', '履虎尾', '視履考祥']
};

for (const [cat, imgs] of Object.entries(hex10ImageryByCat)) {
  const group = HEX10_QUESTIONS.filter(q => q.category === cat);
  let imgCount = 0;
  for (const q of group) {
    const hasImg = imgs.some(img => q.question.includes(img));
    if (hasImg) imgCount++;
  }
  if (imgCount < 2) {
    console.log(`  HEX10 ${cat}: only ${imgCount}/3 questions use imagery (need ≥2)`);
    imageryFailures++;
  }
}
if (imageryFailures === 0) console.log('  All category groups have ≥2/3 questions with imagery');

// Check prohibited skeletons
console.log('\n--- Prohibited skeleton check ---');
const prohibited = [
  '你比較接近某爻',
  '你最需要做出的調整是什麼',
  '哪條界線尚未準備好跨越',
  '現在哪一股力量更明顯',
  '下一步要前進還是停下',
  '最容易忽略的風險是什麼',
  '你是否已經準備好',
  '你可以如何調整',
  '目前最需要注意什麼',
  '什麼選擇最適合你',
  '你比較接近',
  '還是另一',
  '最貼近你目前的處境嗎',
  '如果是，它反映在',
  '如果不是，你感覺自己更接近',
  '不要停留在',
  '的表面含義',
  '最需要重新檢視的是什麼',
  '是方法、對象、節奏',
  '對面是什麼',
  '相反的狀態',
  '無論是過度還是不足',
  '這條界線在你目前的處境中是否已經被觸及'
];

let prohibitedFound = 0;
for (const q of [...HEX9_QUESTIONS, ...HEX10_QUESTIONS]) {
  for (const p of prohibited) {
    if (q.question.includes(p)) {
      console.log(`  PROHIBITED "${p}" in ${q.id}`);
      prohibitedFound++;
    }
  }
}
if (prohibitedFound === 0) console.log('  No prohibited skeletons found');

// ─── Uniqueness check (normalized) ───
console.log('\n--- Uniqueness check ---');
function normalizeQuestion(q) {
  // Remove hex name, category name, and imagery terms for comparison
  let n = q.question
    .replace(/小畜/g, '')
    .replace(/履/g, '')
    .replace(/一般|工作事業|感情關係|財務金錢|人際合作|家庭親人|學習考試|身心狀態|重大決策|創業經營|官非合約|心境修行/g, '')
    .replace(/密雲不雨自我西郊|密雲不雨|復自道|牽復|輿說輻|夫妻反目|有孚攣如|有孚血去惕出|懿文德|既雨既處月幾望|既雨既處/g, '')
    .replace(/履虎尾不咥人|履虎尾|素履|視履考祥|辨上下定民志|眇能視跛能履|履道坦坦|武人為于大君|夬履/g, '')
    .replace(/風天小畜|天澤履|卦/g, '')
    .replace(/\s+/g, '')
    .trim();
  return n;
}

function checkUniqueness(questions, label) {
  const normMap = new Map();
  for (const q of questions) {
    const norm = normalizeQuestion(q);
    if (normMap.has(norm)) {
      console.log(`  ${label} DUPLICATE: ${q.id} collides with ${normMap.get(norm)}`);
      console.log(`    Q1: ${q.question.substring(0, 80)}...`);
      return false;
    }
    normMap.set(norm, q.id);
  }

  // Per-group uniqueness
  let allUnique = true;
  for (const cat of ALL_CATEGORIES) {
    const group = questions.filter(q => q.category === cat.id);
    const groupNorms = new Set(group.map(q => normalizeQuestion(q)));
    if (groupNorms.size < 3) {
      console.log(`  ${label} ${cat.id}: normU = ${groupNorms.size}/3`);
      allUnique = false;
    }
  }

  // Per-hex uniqueness
  const allNorms = new Set(questions.map(q => normalizeQuestion(q)));
  const totalQuestions = questions.length;
  if (allNorms.size < totalQuestions) {
    console.log(`  ${label} per-hex normU = ${allNorms.size}/${totalQuestions}`);
    allUnique = false;
  } else {
    console.log(`  ${label} per-hex normU = ${allNorms.size}/${totalQuestions}`);
  }

  return allUnique;
}

const hex9Unique = checkUniqueness(HEX9_QUESTIONS, 'HEX9');
const hex10Unique = checkUniqueness(HEX10_QUESTIONS, 'HEX10');

// Cross-hex uniqueness
const allNewNorms = new Set([...HEX9_QUESTIONS, ...HEX10_QUESTIONS].map(q => normalizeQuestion(q)));
console.log(`  Cross-hex normU = ${allNewNorms.size}/${HEX9_QUESTIONS.length + HEX10_QUESTIONS.length}`);

// ─── Write output ───
const output = 'window.Zero1MatrixData = window.Zero1MatrixData || {};\nwindow.Zero1MatrixData.reflectionQuestions = ' + JSON.stringify(merged) + ';';
fs.writeFileSync(DATA_FILE, output, 'utf8');
console.log('\nWritten to: ' + DATA_FILE);

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

console.log('\nstage3_refl_hex9_10.js completed successfully');