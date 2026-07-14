'use strict';
/**
 * wA_refl_27_28.js
 * Generates per-hex-per-category UNIQUE reflection questions for hex 27 (頤) and hex 28 (大過).
 * 12 categories x 3 questions x 2 hex = 72 questions total.
 * Replaces existing entries in reflectionQuestions.data.js.
 *
 * Q1 = state, Q2 = choice (compare 2 real options), Q3 = risk/boundary/timing.
 * 38-105 chars, ends with ？, open-ended. At least 2 of 3 per group use hex imagery.
 */

const vm = require('vm');
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const DATA_FILE = path.join(__dirname, '..', 'src', 'data', 'reflectionQuestions.data.js');
const NODE_EXE = path.join(__dirname, '..', '.nodejs', 'node-v22.14.0-win-x64', 'node.exe');
const TODAY = '2026-07-13';
const VER = '1.8.0-wA-refl-27-28';

const CATEGORY_NAMES = {
  general: '一般',
  career: '工作事業',
  love: '感情關係',
  money: '財務金錢',
  people: '人際合作',
  family: '家庭親人',
  study: '學習考試',
  health: '身心狀態',
  decision: '重大決策',
  business: '創業經營',
  legal: '官非合約',
  spiritual: '心境修行',
};

const CATEGORIES = Object.keys(CATEGORY_NAMES);

// ════════════════════════════════════════════════════════════════════
// HEX 27 頤 — 養育、供養責任、欲望節制、資訊攝取
// imagery: 觀頤自求口實, 舍爾靈龜, 顛頤, 拂頤, 虎視眈眈, 由頤, 慎言語節飲食
//
// Per category imagery:
//   general:      觀頤自求口實, 慎言語節飲食, 由頤
//   career:       由頤, 虎視眈眈, 顛頤
//   love:         顛頤, 拂頤, 舍爾靈龜
//   money:        觀頤自求口實, 舍爾靈龜, 顛頤
//   people:       拂頤, 虎視眈眈, 觀頤自求口實
//   family:       舍爾靈龜, 顛頤, 由頤
//   study:        慎言語節飲食, 觀頤自求口實, 由頤
//   health:       慎言語節飲食, 觀頤自求口實, 舍爾靈龜
//   decision:     顛頤, 拂頤, 虎視眈眈
//   business:     由頤, 觀頤自求口實, 虎視眈眈
//   legal:        虎視眈眈, 拂頤, 慎言語節飲食
//   spiritual:    慎言語節飲食, 舍爾靈龜, 觀頤自求口實
// ════════════════════════════════════════════════════════════════════

const HEX27 = {
  hexagramId: 27,
  hexagramName: '頤',
  gua: '山雷頤',
  questions: {
    // ── general: 觀頤自求口實, 慎言語節飲食, 由頤 ──
    general: [
      '觀頤自求口實提醒你要觀照自己每日真正餵養了什麼，你目前的生活基調是否正在滋養你，還是在消耗你的根本？',
      '面對生活方式的調整，你覺得先從慎言語節飲食的自我節制入手比較有效，還是先從整體由頤不求外養的自足心態開始轉變？',
      '當你發現自己不斷向外尋求養分卻依然空虛時，哪個具體的轉折點會讓你意識到已經偏離由頤的自給自足太久？',
    ],
    // ── career: 由頤, 虎視眈眈, 顛頤 ──
    career: [
      '由頤說明職場上終究得靠自己養自己，你目前的工作狀態是因無人能養而被迫自立，還是已經能主動掌控養分的來源與去向？',
      '面對職涯發展，你會選擇像虎視眈眈那樣長期盯住一個目標耐心等待機會，還是像由頤那樣自己創造養分不求外求？',
      '顛頤警示你供養的方向可能已經顛倒——本該由組織回饋你的卻變成你在填補結構空洞，哪個具體徵兆一旦出現就該果斷調整？',
    ],
    // ── love: 顛頤, 拂頤, 舍爾靈龜 ──
    love: [
      '顛頤顯示關係中的養分供給可能已經反了——你是在照顧對方成長，還是在用自己填補關係中原本就存在的空洞？',
      '面對感情的失衡，你選擇拂頤那樣拒絕繼續錯誤的供養模式，還是放下比較心態不再舍爾靈龜捨棄真正適合你的那份真誠？',
      '舍爾靈龜提醒不要為羨慕他人的關係而否定自己的天賦，什麼樣的自我否定如果持續下去，會讓你在感情中永遠覺得自己不配？',
    ],
    // ── money: 觀頤自求口實, 舍爾靈龜, 顛頤 ──
    money: [
      '觀頤自求口實要你檢視金錢究竟餵養了你什麼，你目前的消費模式是在滋養生活品質，還是在填補情緒缺口？',
      '面對理財選擇，你會繼續用現有方式觀頤自求口實踏實累積，還是冒舍爾靈龜的風險換取短期回報？',
      '顛頤般的財務黑洞——你用收入去供養本該被砍掉的開銷，哪個數字變化一旦出現就代表風險已經超出可控範圍？',
    ],
    // ── people: 拂頤, 虎視眈眈, 觀頤自求口實 ──
    people: [
      '拂頤指出你可能在拒絕某些本該接受的善意與幫助，你目前的人際關係中是否有一種不願接受的養分正在悄悄流失？',
      '面對交友圈的整理，你會選擇像虎視眈眈那樣謹慎觀察不輕易投入，還是像觀頤自求口實先回頭檢視自己需要什麼樣的人？',
      '觀頤自求口實問你在人際關係上吃進了什麼，哪種人際互動模式如果持續下去會像劣質養分一樣慢慢耗損你的內在？',
    ],
    // ── family: 舍爾靈龜, 顛頤, 由頤 ──
    family: [
      '舍爾靈龜提醒不要為羨慕他人的家庭模樣而忘記自己家裡的本質溫暖，你目前看到的是家人的缺點，還是他們本來就有的好？',
      '家庭責任的分配正在發生顛頤——本該互相養育的關係成了單向付出，你會選擇先扛著還是和家人重新討論由頤的自足分工模式？',
      '由頤問你是否已經把家庭養成一個不需要外在支撐也能自足的單位，什麼時候你會意識到再不調整每個人都會持續消耗彼此？',
    ],
    // ── study: 慎言語節飲食, 觀頤自求口實, 由頤 ──
    study: [
      '慎言語節飲食把學習也比作飲食——你目前吸收的資訊量是讓腦袋更清晰，還是讓思緒混亂堆積難以消化？',
      '對於難度很高的內容，你會選擇觀頤自求口實慢慢咀嚼深入理解，還是像由頤那樣自己找方法不求於外在的速成技巧？',
      '慎言語節飲食暗示學習節奏一旦失控後果明顯，什麼樣的疲勞或排斥感出現時代表你已經超過有效吸收的界線？',
    ],
    // ── health: 慎言語節飲食, 觀頤自求口實, 舍爾靈龜 ──
    health: [
      '慎言語節飲食直指身體就是在吃進什麼中成形，你目前的身體狀態是反映你吃對了，還是反映累積的負擔越來越重？',
      '面對調整健康習慣，你會選擇觀頤自求口實先仔細記錄觀察自己的作息與飲食，還是捨掉舍爾靈龜般對他人養生法的盲目追隨？',
      '舍爾靈龜提醒不要羨慕別人天生體質好就亂學，什麼樣的模仿式養生一旦持續下去反而會傷害你原本還算平衡的基底？',
    ],
    // ── decision: 顛頤, 拂頤, 虎視眈眈 ──
    decision: [
      '顛頤警示你當前的決策結構可能本身就是顛倒的——你是在為真正重要的核心供養精力，還是在餵養外圍的不必要糾結？',
      '面對重大選擇，你傾向拂頤直接拒絕繼續消耗的路線，還是像虎視眈眈那樣保持警惕先不下決定等待更完整的視野？',
      '虎視眈眈提醒風險中的耐心觀察有其極限，哪個時間點一旦錯過就會讓原本可以觀察的局面轉為不得不倉促決定的危局？',
    ],
    // ── business: 由頤, 觀頤自求口實, 虎視眈眈 ──
    business: [
      '由頤問你的經營模式是否已經能自己養活自己、不依賴單一外部輸血，你目前的自給率處於什麼樣的階段？',
      '在擴張策略上，你會選擇由頤先建立內部造血能力再行動，還是像虎視眈眈那樣鎖定市場缺口等待最佳時機全力出擊？',
      '虎視眈眈的等待有其風險，什麼樣的市場或團隊訊號出現時代表你已經等太久，再不動作就會錯失關鍵的窗口？',
    ],
    // ── legal: 虎視眈眈, 拂頤, 慎言語節飲食 ──
    legal: [
      '虎視眈眈要你以極度謹慎的態度審視合約或爭議中的每一個細節，你目前的文件是否還有你只掃一眼沒仔細琢磨的條款？',
      '面對對方提出的條件，你會選擇拂頤明確拒絕不公平的內容，還是慎言語節飲食先節制發言留出更多談判空間再回應？',
      '慎言語節飲食放在法律爭議中尤其關鍵——哪一句未經斟酌的發言一旦說出口，就會讓後續協商完全陷入被動僵局？',
    ],
    // ── spiritual: 慎言語節飲食, 舍爾靈龜, 觀頤自求口實 ──
    spiritual: [
      '慎言語節飲食提醒心的修養始於管好感官入口，你目前的精神狀態是被每天吸收的事物滋養著，還是在被它們悄悄挖空？',
      '在修行路上，你會選擇舍爾靈龜放下對他人修行境界的羨慕回到自己的天賦根基，還是觀頤自求口實重新審視真正在餵養你心靈的事物？',
      '觀頤自求口實警示向內觀照的可貴，什麼樣的念頭模式如果放任不管會像劣質食物般累積成你內心的慢性毒素？',
    ],
  },
};

// ════════════════════════════════════════════════════════════════════
// HEX 28 大過 — 過度、棟梁折彎、非常時期非常手段、滅頂之險
// imagery: 棟橈, 藉用白茅, 枯楊生稊, 棟橈凶, 棟隆吉, 枯楊生華, 過涉滅頂, 澤滅木
//
// Per category imagery:
//   general:      棟橈, 澤滅木, 棟隆吉
//   career:       棟橈凶, 棟隆吉, 藉用白茅
//   love:         枯楊生稊, 枯楊生華, 藉用白茅
//   money:        過涉滅頂, 棟橈凶, 澤滅木
//   people:       棟隆吉, 棟橈, 藉用白茅
//   family:       枯楊生稊, 枯楊生華, 藉用白茅
//   study:        藉用白茅, 棟橈, 枯楊生稊
//   health:       過涉滅頂, 棟橈, 澤滅木
//   decision:     棟橈凶, 過涉滅頂, 棟隆吉
//   business:     棟隆吉, 棟橈凶, 枯楊生華
//   legal:        過涉滅頂, 藉用白茅, 棟橈凶
//   spiritual:    澤滅木, 枯楊生稊, 棟隆吉
// ════════════════════════════════════════════════════════════════════

const HEX28 = {
  hexagramId: 28,
  hexagramName: '大過',
  gua: '澤風大過',
  questions: {
    // ── general: 棟橈, 澤滅木, 棟隆吉 ──
    general: [
      '棟橈是你生命結構中某根主梁正在彎曲的警訊，你目前感受到的壓力是來自單一核心環節的變形，還是整座架構承受全面性的過載？',
      '面對整體失衡的局面，你認為先撐起棟隆吉的向上強化比較重要，還是先避免澤滅木那種水淹過頭完全淹沒的極端崩潰？',
      '大過的棟橈非一日形成，什麼樣的裂痕出現在你生活的哪個支柱上時，會讓你不得不承認已經到了必須徹底加固的時刻？',
    ],
    // ── career: 棟橈凶, 棟隆吉, 藉用白茅 ──
    career: [
      '棟橈凶警示你目前職涯的主結構已經超出負荷，你是處在還能自行支撐的階段，還是已經感受到關鍵部位正在危險彎曲？',
      '在職場危機中，選擇棟隆吉從彎曲中撐上去讓自己更強，還是藉用白茅放下身段用最樸素的方式重新打好根基？',
      '棟橈凶表示如果繼續忽視結構性問題，哪一種具體的工作壓力再加重一點就會讓你的職涯主梁真正折斷而非僅是彎曲？',
    ],
    // ── love: 枯楊生稊, 枯楊生華, 藉用白茅 ──
    love: [
      '枯楊生稊是在枯老中忽然冒出新的根芽，你目前感覺這段關係是能從舊根基中長出新生命，還是枯楊生華只是暫時的迴光返照？',
      '面對感情中類似枯楊生稊的轉機，你會選擇用心澆灌等待它扎實成長，還是像藉用白茅那樣先退回最樸素真誠的相處方式重新來過？',
      '枯楊生華雖美但不結果實，什麼樣的短暫甜蜜畫面出現時，會提醒你別被表面的絢麗騙了、根本問題依然沒有解決？',
    ],
    // ── money: 過涉滅頂, 棟橈凶, 澤滅木 ──
    money: [
      '過涉滅頂形容財務風險已經深到足以沒頂的程度，你目前的財務水位是還踩得到底，還是已經感覺腳下失去支撐開始漂浮？',
      '面臨財務壓力，你會選擇認列棟橈凶的主結構風險立刻止血，還是繼續撐下去相信澤滅木那般即使水淹也有浮木可攀？',
      '過涉滅頂提醒過度涉入的危險，哪個具體負債或支出數字一旦突破就會讓你從可控的壓力區直接掉進溺水狀態？',
    ],
    // ── people: 棟隆吉, 棟橈, 藉用白茅 ──
    people: [
      '棟隆吉描述承受重壓卻不折反強的人際關係，你身邊有沒有誰是在你最困難的時候反而成為讓你更堅韌的那根樑柱？',
      '面對一段正在棟橈彎曲變形的關係，你會選擇支撐上去讓它變成像棟隆吉那樣更穩固，還是像藉用白茅那樣退回最素樸誠懇的交往？',
      '棟橈不會突然折斷必定有預兆，什麼樣的人際互動頻率或語氣變化出現時，代表這段關係已來到結構性變形的危險關頭？',
    ],
    // ── family: 枯楊生稊, 枯楊生華, 藉用白茅 ──
    family: [
      '枯楊生稊形容家庭中即使看似枯老，仍可能在不起眼的角落長出新芽，你家裡現在是否正有某個值得呵護的小小轉機？',
      '家庭重建時，你會選擇以枯楊生稊的耐心陪伴等新芽慢慢扎根，還是像藉用白茅那樣先退回最基本的生活照顧重建信任？',
      '枯楊生華是表面盛開但無果的假象，什麼樣的家庭和諧一旦只是節慶式的短暫溫馨，你就該警覺深層問題從未被真正處理？',
    ],
    // ── study: 藉用白茅, 棟橈, 枯楊生稊 ──
    study: [
      '藉用白茅提醒學習基礎要像鋪白茅般恭敬踏實——你目前的學習方式是真的在打地基，還是跳過基礎直接追逐花俏的表面技巧？',
      '當學習進度像棟橈般開始彎曲落後時，你會選擇換條路找枯楊生稊般的新方法讓舊知識長出新芽，還是用藉用白茅的態度回頭重修基礎？',
      '棟橈般的知識體系一旦核心概念扭曲，哪個科目的基礎觀念如果一直搞混，會讓後面全部的延伸學習都建立在錯誤的根基上？',
    ],
    // ── health: 過涉滅頂, 棟橈, 澤滅木 ──
    health: [
      '過涉滅頂形容你的身體可能已過度涉入危險區域，你目前的健康狀態是尚在岸邊還能回頭，還是已經涉入深水感覺快支撐不住？',
      '面對身體像棟橈般的主結構壓力，你是選擇休息讓彎曲處復原，還是冒著澤滅木的風險繼續硬撐賭自己能浮起來？',
      '澤滅木是洪水漫過木頭的完全淹沒，什麼樣的身體訊號一旦反覆出現就會是已經從可逆的疲勞進入不可逆傷害的警界線？',
    ],
    // ── decision: 棟橈凶, 過涉滅頂, 棟隆吉 ──
    decision: [
      '棟橈凶警告你眼前的決策結構本身就是在過載運轉——你手上的選項是真的有現實支撐，還是每一條都在超限邊緣硬撐著不塌？',
      '在這個高風險的決定上，你會選擇冒過涉滅頂的危險投入深水孤注一擲，還是退回來找出棟隆吉那種讓壓力變成支撐的安全上升路徑？',
      '棟隆吉雖有吉象卻不代表可無限拖延，哪一個最後期限一旦跨過就會讓原本可以挺上去的局面轉成棟橈凶的結構性崩壞？',
    ],
    // ── business: 棟隆吉, 棟橈凶, 枯楊生華 ──
    business: [
      '棟隆吉描述面對重壓不但未垮反而更強，你的事業核心目前在承受重壓後，是變得更堅韌還是已經出現看不見的內部裂痕？',
      '經營策略面臨抉擇，你會選擇走棟隆吉強化主結構讓事業更穩，還是像枯楊生華那樣追求表面亮眼的短期成果先撐過眼前？',
      '棟橈凶的危機往往始於被枯楊生華般的外在繁榮掩蓋，什麼樣的業績數字雖然漂亮卻讓你的營運主結構悄悄超載彎曲？',
    ],
    // ── legal: 過涉滅頂, 藉用白茅, 棟橈凶 ──
    legal: [
      '過涉滅頂形容你已過度涉入爭議水深處，目前的官司或合約局面是尚在可控範圍內，還是已經走到快要無法全身而退的深度？',
      '面對法律事務，你會選擇藉用白茅用最恭敬謹慎的態度鋪好每一個書面基礎，還是採取更積極的手段避免棟橈凶的主結構崩盤？',
      '棟橈凶提醒一旦關鍵條款或證據出現彎曲偏離真相，哪一項文件或證詞的缺失一旦曝光會讓整場爭議的主梁徹底折斷？',
    ],
    // ── spiritual: 澤滅木, 枯楊生稊, 棟隆吉 ──
    spiritual: [
      '澤滅木是水澤淹沒林木的意象，你目前感覺被外在事務淹沒到幾乎看不見內心，還是尚能在水面之上保持片刻的清明？',
      '在精神被淹沒的低谷裡，你會選擇尋找枯楊生稊那般在枯竭中冒出的微小新生力量，還是追求棟隆吉那種從壓力中挺直的向上突破？',
      '枯楊生稊雖是新生的希望卻極為脆弱，什麼樣的日常習慣如果沒有保護好，會讓這點小小的內在新芽還沒長成就被再次淹沒？',
    ],
  },
};

// ════════════════════════════════════════════════════════════════════
// Build question objects
// ════════════════════════════════════════════════════════════════════
function buildEntries(hex) {
  const entries = [];
  for (const category of CATEGORIES) {
    const trio = hex.questions[category];
    if (!trio || trio.length !== 3) {
      throw new Error(`Missing/invalid trio for hex ${hex.hexagramId} category ${category}`);
    }
    trio.forEach((question, idx) => {
      entries.push({
        id: `rf-${String(hex.hexagramId).padStart(3, '0')}-${category}-${idx + 1}`,
        hexagramId: hex.hexagramId,
        hexagramName: hex.hexagramName,
        category,
        categoryName: CATEGORY_NAMES[category],
        question,
        basis: [hex.hexagramName, hex.gua, CATEGORY_NAMES[category]],
        qualityLevel: 'refined',
        reviewed: false,
        reviewedBy: 'reflection-gold-review-stage3-wA',
        reviewedAt: TODAY,
        needsHumanReview: true,
        version: VER,
      });
    });
  }
  return entries;
}

const newH27 = buildEntries(HEX27);
const newH28 = buildEntries(HEX28);

// ════════════════════════════════════════════════════════════════════
// VALIDATION: length 38-105 && ends with ？
// ════════════════════════════════════════════════════════════════════
function validateLengths(questions, label) {
  const bad = [];
  for (const q of questions) {
    const len = q.question.length;
    if (len < 38 || len > 105) {
      bad.push({ id: q.id, len, question: q.question });
    }
  }
  if (bad.length) {
    console.error(`[${label}] Length validation FAILED for ${bad.length} questions:`);
    bad.forEach((b) => console.error(`  ${b.id} len=${b.len}: ${b.question}`));
    throw new Error(`${label}: length validation failed`);
  }
  console.log(`[${label}] Length validation OK for ${questions.length} questions (38-105 chars).`);
}

function validateEndsWithQuestionMark(questions, label) {
  const bad = questions.filter((q) => !q.question.endsWith('？'));
  if (bad.length) {
    console.error(`[${label}] Missing terminal '？' for:`, bad.map((b) => b.id));
    throw new Error(`${label}: terminal punctuation validation failed`);
  }
  console.log(`[${label}] Terminal '？' validation OK.`);
}

function validateUniqueness(questions, label) {
  function normalize(s) {
    return s.replace(/[？?，,。.！!、\s]/g, '');
  }
  const seen = new Map();
  let dupCount = 0;
  for (const q of questions) {
    const norm = normalize(q.question);
    if (seen.has(norm)) {
      dupCount++;
      console.error(`[${label}] Duplicate (normalized) between ${seen.get(norm)} and ${q.id}`);
    } else {
      seen.set(norm, q.id);
    }
  }
  const uniqueCount = questions.length - dupCount;
  console.log(`[${label}] Uniqueness: ${uniqueCount}/${questions.length} unique after normalization.`);
  if (dupCount > 0) {
    throw new Error(`${label}: uniqueness validation failed (${dupCount} duplicates)`);
  }
}

// ════════════════════════════════════════════════════════════════════
// MAIN
// ════════════════════════════════════════════════════════════════════
function main() {
  // Step 1: Validate lengths BEFORE writing (mandatory assertion)
  validateLengths(newH27, 'HEX27');
  validateLengths(newH28, 'HEX28');

  // Step 2: Validate terminal ？
  validateEndsWithQuestionMark(newH27, 'HEX27');
  validateEndsWithQuestionMark(newH28, 'HEX28');

  // Step 3: Validate uniqueness within each hex
  validateUniqueness(newH27, 'HEX27');
  validateUniqueness(newH28, 'HEX28');

  // Step 4: Validate uniqueness across both hexes combined
  validateUniqueness([...newH27, ...newH28], 'HEX27+28 combined');

  console.log(`\nAll validations passed. H27: ${newH27.length}, H28: ${newH28.length}, Total: ${newH27.length + newH28.length}`);

  // Step 5: Load existing data file via vm
  const code = fs.readFileSync(DATA_FILE, 'utf8');
  const sandbox = { window: {} };
  vm.createContext(sandbox);
  vm.runInContext(code, sandbox, { filename: DATA_FILE });
  const existing = sandbox.window.Zero1MatrixData.reflectionQuestions;
  if (!Array.isArray(existing)) throw new Error('Failed to load existing reflectionQuestions array');

  console.log(`Loaded existing data: ${existing.length} questions total.`);

  const before27 = existing.filter((d) => d.hexagramId === 27).length;
  const before28 = existing.filter((d) => d.hexagramId === 28).length;
  console.log(`Existing hex27=${before27}, hex28=${before28}`);

  // Step 6: Remove old hex27/28 entries
  const filtered = existing.filter((d) => d.hexagramId !== 27 && d.hexagramId !== 28);
  const merged = [...filtered, ...newH27, ...newH28];

  // Sort by hexagramId for consistent file organization
  merged.sort((a, b) => a.hexagramId - b.hexagramId);

  const expectedNewTotal = existing.length - before27 - before28 + newH27.length + newH28.length;
  console.log(`New total: ${merged.length} (expected ${expectedNewTotal})`);

  if (merged.length !== expectedNewTotal) {
    throw new Error(`Count mismatch: got ${merged.length}, expected ${expectedNewTotal}`);
  }

  // Step 7: Write to file
  const output =
    "window.Zero1MatrixData = window.Zero1MatrixData || {};\n" +
    "window.Zero1MatrixData.reflectionQuestions = " +
    JSON.stringify(merged) +
    ";\n";

  fs.writeFileSync(DATA_FILE, output, 'utf8');
  console.log(`Written to ${DATA_FILE}`);

  // Step 8: Verify with node --check
  try {
    execFileSync(NODE_EXE, ['--check', DATA_FILE], { stdio: 'inherit' });
    console.log('node --check PASSED.');
  } catch (e) {
    console.error('node --check FAILED.');
    throw e;
  }

  // Step 9: Re-load to double-check parse correctness
  const verifyCode = fs.readFileSync(DATA_FILE, 'utf8');
  const verifySandbox = { window: {} };
  vm.createContext(verifySandbox);
  vm.runInContext(verifyCode, verifySandbox, { filename: DATA_FILE });
  const verifyData = verifySandbox.window.Zero1MatrixData.reflectionQuestions;
  console.log(`Verification reload: ${verifyData.length} total questions.`);

  const v27 = verifyData.filter((d) => d.hexagramId === 27);
  const v28 = verifyData.filter((d) => d.hexagramId === 28);
  console.log(`Verification hex27=${v27.length}, hex28=${v28.length}`);

  if (v27.length !== 36 || v28.length !== 36) {
    throw new Error('Verification failed: expected 36 questions each for hex27 and hex28');
  }

  console.log('\n=== wA_refl_27_28 COMPLETE ===');
}

main();
