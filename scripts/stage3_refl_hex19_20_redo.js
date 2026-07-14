// stage3_refl_hex19_20_redo.js
// Regenerates all 72 reflection questions (hex 19 臨, hex 20 觀) with genuinely
// distinct sentence structures per category to fix the "template + noun swap"
// fake-uniqueness bug.

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const DATA_PATH = path.join(__dirname, '..', 'src', 'data', 'reflectionQuestions.data.js');

// ---------------------------------------------------------------------------
// 1. Load current data file via vm (window.Zero1MatrixData pattern)
// ---------------------------------------------------------------------------
const code = fs.readFileSync(DATA_PATH, 'utf8');
const sandbox = { window: {} };
vm.createContext(sandbox);
vm.runInContext(code, sandbox);
const allData = sandbox.window.Zero1MatrixData.reflectionQuestions;

const categoryNames = {
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

const categoryOrder = Object.keys(categoryNames);

// ---------------------------------------------------------------------------
// 2. New question content — hand-composed, unique structures per category
// ---------------------------------------------------------------------------

const HEX19 = {
  general: {
    basis: ['元亨利貞', '澤上有地', '至于八月有凶'],
    q: [
      '從元亨利貞四種德性來看，你目前的整體處境比較缺乏哪一項，是還沒開始的通達，還是尚未站穩的堅持？',
      '澤上有地描繪的是逐漸靠近與覆蓋，你現在面對的整體局面，是主動往前貼近問題核心，還是先讓局勢穩定再說？',
      '若情勢真的走到至于八月有凶所暗示的轉折點，你目前最沒把握守住的整體防線會是哪一塊？',
    ],
  },
  career: {
    basis: ['咸臨吉無不利', '至臨', '知臨'],
    q: [
      '咸臨吉無不利講的是上下齊心才能無往不利，你和主管之間，目前是彼此感應順暢，還是還在互相試探？',
      '若晉升或授權的時機像至臨一樣需要親自到場才算數，你現在的職位讓你有多少機會真正站上第一線？',
      '知臨強調用智慧治理而非事必躬親，你目前管理團隊或被管理的方式，是不是還太依賴自己盯著每個細節？',
    ],
  },
  love: {
    basis: ['咸臨', '甘臨', '敦臨'],
    q: [
      '咸臨說的是彼此有感應才靠近，你和對方之間，這份親密感目前是自然生成，還是有一方在勉強配合？',
      '甘臨提醒用討好換來的和睦難以持久，你們這段關係裡，有沒有誰正在用遷就掩蓋真正的分歧？',
      '敦臨代表用厚實穩固的態度陪伴到最後，你覺得這段感情現在需要的是更多熱度，還是更扎實的承諾？',
    ],
  },
  money: {
    basis: ['至于八月有凶', '甘臨', '敦臨'],
    q: [
      '至于八月有凶提醒盛況背後藏著風險，你目前的現金流狀況，是穩健成長，還是其實已經出現警訊卻被忽略？',
      '如果甘臨式的討好消費只換來短暫寬心，你的預算分配裡，有哪一項支出其實禁不起長期檢視？',
      '敦臨講求厚實穩固，面對這筆資金的運用，你會選擇加碼投入，還是先鞏固既有的基礎再說？',
    ],
  },
  people: {
    basis: ['咸臨', '咸臨吉無不利', '至臨'],
    q: [
      '咸臨吉無不利說的是合作雙方都主動靠近才會順利，你目前和夥伴之間，這份主動性是對等的嗎？',
      '咸臨強調彼此感應，在這次合作裡，你比較依賴默契，還是需要更明確的溝通機制才能推進？',
      '至臨要求親自到場才算數，這段合作關係中，有沒有哪個環節你其實一直讓別人代替你出面處理？',
    ],
  },
  family: {
    basis: ['敦臨', '咸臨', '君子以教思無窮容保民無疆'],
    q: [
      '敦臨代表用穩固厚實的方式陪伴，你在家庭裡目前扮演的角色，是不是已經承擔了超過自己負荷的責任？',
      '咸臨講彼此感應而非單方付出，你和家人之間的照顧安排，是雙向的體諒，還是變成了單向的犧牲？',
      '君子以教思無窮容保民無疆說的是包容與長遠教養，面對家中晚輩或長輩，你目前欠缺的是耐心還是方法？',
    ],
  },
  study: {
    basis: ['知臨', '至臨', '咸臨吉無不利'],
    q: [
      '知臨強調用智慧掌握重點而非死記硬背，你目前的讀書方法，是不是還停留在花時間卻抓不到核心？',
      '至臨要求親自到場、實際演練，你的準備進度裡，有多少是紙上談兵、還沒真正動手練過？',
      '咸臨吉無不利說的是與老師或同伴同步用心才會順利，你現在的學習狀態，是自己埋頭苦讀，還是有請教別人？',
    ],
  },
  health: {
    basis: ['敦臨', '至于八月有凶', '甘臨'],
    q: [
      '敦臨提醒要用穩定持久的節奏對待自己，你目前的作息安排，是規律扎實，還是三天打魚兩天曬網？',
      '至于八月有凶暗示盛極必有轉折，你身體發出的哪些小訊號，其實已經提醒你該調整步調了？',
      '如果甘臨式的短暫舒緩只是暫時掩蓋不適，你覺得現在是該自己調養，還是該尋求專業協助？',
    ],
  },
  decision: {
    basis: ['知臨', '至于八月有凶', '至臨'],
    q: [
      '知臨講究用智慧判斷而非衝動行事，這個重大決定擺在你面前的兩個選項，你分別掌握了多少實際資訊？',
      '至于八月有凶提醒盛況可能反轉，這個決定一旦做下去，你覺得還有多少空間可以回頭修正？',
      '至臨要求親自查證才能定案，你目前手上的判斷依據，是自己實際確認過，還是聽別人轉述？',
    ],
  },
  business: {
    basis: ['至臨', '知臨', '至于八月有凶'],
    q: [
      '至臨強調創業初期要親自站上第一線，你目前對市場的了解，是自己實地驗證過，還是仍憑推測？',
      '知臨講的是用智慧治理團隊而非事必躬親，你現在的團隊分工，能不能撐起你不在場時的運作？',
      '至于八月有凶提醒擴張過快容易埋下風險，你目前的營運步調，是穩健推進，還是已經有點透支？',
    ],
  },
  legal: {
    basis: ['甘臨', '知臨', '元亨利貞'],
    q: [
      '甘臨提醒討好式的私下協調難以真正解決問題，你目前手上的合約或協議，有沒有條款其實模糊不清？',
      '知臨要求用清楚的判斷處理事務，面對這件官非或糾紛，你掌握的證據是否足以支撐你的立場？',
      '元亨利貞代表程序需要正當且完整，你目前的法律程序走到哪一步，還缺少哪些正式文件？',
    ],
  },
  spiritual: {
    basis: ['君子以教思無窮容保民無疆', '敦臨', '知臨'],
    q: [
      '君子以教思無窮容保民無疆說的是包容眾生的胸懷，你目前修行或自省的動機，是出於真心，還是想證明什麼？',
      '敦臨代表用穩固的內在支撐外在行動，你現在的心境，是踏實安定，還是還在尋找依靠？',
      '知臨強調向內覺察而非外求，你有沒有誠實面對過，自己目前最抗拒承認的一個念頭？',
    ],
  },
};

const HEX20 = {
  general: {
    basis: ['盥而不薦有孚顒若', '風行地上', '觀我生'],
    q: [
      '盥而不薦有孚顒若說的是莊重而不必多做表演就能取信於人，你目前的整體處境，靠的是實質內容，還是還在依賴形式？',
      '風行地上描繪影響力自然擴散的畫面，你現在面對的整體局勢，是你主動去了解全貌，還是只看到眼前這一塊？',
      '觀我生提醒要先回頭檢視自己，你覺得目前整體處境卡住的原因，有多少其實來自你尚未看清的自己？',
    ],
  },
  career: {
    basis: ['觀國之光', '觀其生', '闚觀'],
    q: [
      '觀國之光講的是被賦予機會去見識更大格局，你目前在職場上，是已經站上能看見全局的位置，還是還被侷限在局部任務？',
      '觀其生要求觀察他人的作為來判斷方向，你對主管或組織下一步的動向，掌握到的資訊是充分還是片面？',
      '闚觀形容從門縫窺看、視野狹窄，你目前對自己職涯發展的判斷，是不是其實只看到了一小部分就下了結論？',
    ],
  },
  love: {
    basis: ['觀我生', '觀其生', '童觀'],
    q: [
      '觀我生提醒感情裡要先看清自己而非只盯著對方，你目前對這段關係的期待，有多少是真正屬於你自己的需求？',
      '觀其生要求觀察對方實際的行為而非言語，對方最近的作為，和他說出口的承諾，兩者對得上嗎？',
      '童觀形容像孩子一樣只看表面就下判斷，你對這段感情目前的理解，會不會其實還停留在很淺的印象裡？',
    ],
  },
  money: {
    basis: ['闚觀', '童觀', '觀國之光'],
    q: [
      '闚觀形容視野被侷限在一個小縫隙裡，你對目前財務狀況的掌握，是看到完整的收支全貌，還是只盯著單一項目？',
      '童觀提醒別用膚淺的眼光看待理財，你現在的資源分配，是經過通盤考量，還是憑一時的表面判斷？',
      '觀國之光講的是看見更大格局的機會，面對眼前這筆資金，你會選擇放眼長遠布局，還是先顧好眼前周轉？',
    ],
  },
  people: {
    basis: ['觀其生', '觀國之光', '風行地上'],
    q: [
      '觀其生強調透過行為而非說法來認識一個人，你合作的對象，實際做出來的事和承諾的內容一致嗎？',
      '觀國之光形容被邀請見識更寬廣的視野，這次合作機會，是讓你接觸到更大的格局，還是只是表面的頭銜？',
      '風行地上比喻影響力如風般自然吹拂各處，你在這群人之中建立起來的信任，是靠時間累積，還是還很單薄？',
    ],
  },
  family: {
    basis: ['觀我生', '童觀', '觀其生'],
    q: [
      '觀我生提醒先檢視自己在家中的角色，你覺得目前家人對你的期待，和你真正想扮演的角色一致嗎？',
      '童觀形容用孩子般單純的眼光看待家務，你對家中長輩或晚輩目前的需求，是不是理解得還太表面？',
      '觀其生要求觀察家人實際的狀態而非表面言語，家裡最近有誰的行為變化，其實透露了你還沒注意到的訊號？',
    ],
  },
  study: {
    basis: ['童觀', '闚觀', '觀我生君子無咎'],
    q: [
      '童觀提醒用單純表淺的方式學習容易流於形式，你目前準備考試的方法，是真正理解，還是只求背誦過關？',
      '闚觀形容視野狹窄如從門縫窺看，你對這次考試範圍的掌握，是看過完整架構，還是只熟悉部分章節？',
      '觀我生君子無咎說的是自我檢視才能問心無愧，你有沒有誠實評估過，自己目前的讀書進度到底夠不夠？',
    ],
  },
  health: {
    basis: ['觀我生', '盥而不薦有孚顒若', '觀其生'],
    q: [
      '觀我生提醒健康問題要先回頭看自己的生活方式，你覺得目前的身體狀況，和你近期的作息習慣有多大關聯？',
      '盥而不薦有孚顒若講究內在的莊重勝過外在表演，你照顧身心的方式，是真正落實日常習慣，還是偶爾做做樣子？',
      '觀其生提醒觀察身體實際發出的反應，你最近有沒有留意到某個徵兆，其實已經提醒你該找專業人士看看？',
    ],
  },
  decision: {
    basis: ['闚觀', '觀我生君子無咎', '觀國之光'],
    q: [
      '闚觀提醒視野狹窄容易誤判全局，這個決定擺在眼前，你目前掌握的資訊，是否足以看清所有選項的全貌？',
      '觀我生君子無咎講的是先檢視自己的動機再行動，你做這個決定，是出於清楚的判斷，還是還帶著一點僥倖？',
      '觀國之光形容看見更大格局才能把握機會，這個決定如果放眼長遠來看，和只看眼前得失，答案會不會不一樣？',
    ],
  },
  business: {
    basis: ['觀國之光', '先王以省方觀民設教', '闚觀'],
    q: [
      '觀國之光講的是見識更廣闊的市場格局，你目前對這個市場的了解，是實地調查過，還是仍停留在表面資料？',
      '先王以省方觀民設教強調要深入了解對象的真實需求才能設計方案，你的產品或服務，真的貼近顧客的實際痛點嗎？',
      '闚觀形容從狹窄的角度看世界，你目前的團隊組建，是不是還沒看清這個產業真正需要的能力組合？',
    ],
  },
  legal: {
    basis: ['觀我生君子無咎', '觀國之光', '盥而不薦有孚顒若'],
    q: [
      '觀我生君子無咎提醒先檢視自己是否站得住腳，面對這件合約或糾紛，你手上的證據足以支撐你的立場嗎？',
      '觀國之光形容看清全局才能做出對的判斷，你對這個法律程序目前走到哪個階段，掌握的資訊是完整的嗎？',
      '盥而不薦有孚顒若講究莊重的態度自然取信於人，你在處理這件事的過程中，靠的是完整的文件，還是口頭的默契？',
    ],
  },
  spiritual: {
    basis: ['盥而不薦有孚顒若', '觀我生', '觀其生'],
    q: [
      '盥而不薦有孚顒若說的是內心的誠敬勝過外在儀式，你目前修行或自省的方式，有多少其實只是形式上的堅持？',
      '觀我生提醒向內觀照自己的生命狀態，你有沒有誠實面對過，自己目前真正在意的到底是什麼？',
      '觀其生要求觀察自己言行的一致性，你最近的所作所為，和你心裡認定的價值觀，彼此吻合嗎？',
    ],
  },
};

const HEX_CONTENT = { 19: { name: '臨', data: HEX19 }, 20: { name: '觀', data: HEX20 } };

// ---------------------------------------------------------------------------
// 3. Normalize function for uniqueness verification
// ---------------------------------------------------------------------------
const HEX_NAMES = ['臨', '觀'];
const CATEGORY_NAME_LIST = Object.values(categoryNames);
const IMAGERY_TERMS = [
  '元亨利貞', '至于八月有凶', '咸臨吉無不利', '咸臨', '甘臨', '至臨', '知臨', '敦臨',
  '澤上有地', '君子以教思無窮容保民無疆',
  '盥而不薦有孚顒若', '觀我生君子無咎', '觀我生', '觀國之光', '觀其生', '童觀', '闚觀',
  '風行地上', '先王以省方觀民設教',
];

function normalize(str) {
  let s = str;
  // strip longer imagery terms first to avoid partial collisions
  const terms = [...IMAGERY_TERMS].sort((a, b) => b.length - a.length);
  for (const t of terms) s = s.split(t).join('');
  for (const n of HEX_NAMES) s = s.split(n).join('');
  for (const c of CATEGORY_NAME_LIST) s = s.split(c).join('');
  // strip whitespace/punctuation variance
  s = s.replace(/[，。？！、\s]/g, '');
  return s;
}

// ---------------------------------------------------------------------------
// 4. Build new records, preserving id/hexagramId/hexagramName/category/categoryName
// ---------------------------------------------------------------------------
const today = '2026-07-13';
let newRecordsByKey = new Map();

for (const hexId of [19, 20]) {
  const { name: hexName, data } = HEX_CONTENT[hexId];
  for (const cat of categoryOrder) {
    const entry = data[cat];
    if (!entry) throw new Error(`Missing category ${cat} for hex ${hexId}`);
    if (entry.q.length !== 3) throw new Error(`Category ${cat} hex ${hexId} does not have 3 questions`);
    entry.q.forEach((question, idx) => {
      const id = `rf-0${hexId}-${cat}-${idx + 1}`;
      newRecordsByKey.set(id, {
        id,
        hexagramId: hexId,
        hexagramName: hexName,
        category: cat,
        categoryName: categoryNames[cat],
        question,
        basis: [hexName, entry.basis[idx], categoryNames[cat]],
        qualityLevel: 'refined',
        reviewed: false,
        reviewedBy: 'reflection-gold-review-stage3-redo',
        reviewedAt: today,
        needsHumanReview: true,
        version: '1.7.3-stage3-refl-19-20-redo',
      });
    });
  }
}

// ---------------------------------------------------------------------------
// 5. MANDATORY assertions before writing
// ---------------------------------------------------------------------------

// 5a. Length assertion 38-105 chars
const lengthErrors = [];
for (const rec of newRecordsByKey.values()) {
  const len = rec.question.length;
  if (len < 38 || len > 105) {
    lengthErrors.push(`${rec.id}: length ${len} -> "${rec.question}"`);
  }
  if (!rec.question.endsWith('？')) {
    lengthErrors.push(`${rec.id}: does not end with ？`);
  }
}
if (lengthErrors.length > 0) {
  console.error('LENGTH ASSERTION FAILED:');
  lengthErrors.forEach(e => console.error(' - ' + e));
  process.exit(1);
}
console.log(`Length assertion passed for ${newRecordsByKey.size} questions.`);

// 5b. Normalized uniqueness assertion, per hex, >= 32/36
function checkHexUniqueness(hexId) {
  const recs = [...newRecordsByKey.values()].filter(r => r.hexagramId === hexId);
  const normed = recs.map(r => normalize(r.question));
  const seen = new Map();
  const dupGroups = [];
  normed.forEach((n, i) => {
    if (!seen.has(n)) seen.set(n, []);
    seen.get(n).push(recs[i].id);
  });
  let uniqueCount = 0;
  for (const [n, ids] of seen.entries()) {
    if (ids.length === 1) {
      uniqueCount += 1;
    } else {
      dupGroups.push(ids);
    }
  }
  return { total: recs.length, uniqueCount, dupGroups };
}

const result19 = checkHexUniqueness(19);
const result20 = checkHexUniqueness(20);

console.log(`Hex 19 normU: ${result19.uniqueCount}/${result19.total}`);
if (result19.dupGroups.length > 0) {
  console.log('Hex 19 duplicate groups:', JSON.stringify(result19.dupGroups));
}
console.log(`Hex 20 normU: ${result20.uniqueCount}/${result20.total}`);
if (result20.dupGroups.length > 0) {
  console.log('Hex 20 duplicate groups:', JSON.stringify(result20.dupGroups));
}

const MIN_UNIQUE = 32;
if (result19.uniqueCount < MIN_UNIQUE || result20.uniqueCount < MIN_UNIQUE) {
  console.error(`UNIQUENESS ASSERTION FAILED: hex19=${result19.uniqueCount}/36, hex20=${result20.uniqueCount}/36 (need >= ${MIN_UNIQUE}/36)`);
  process.exit(1);
}
console.log('Uniqueness assertion passed for both hexagrams.');

// ---------------------------------------------------------------------------
// 6. Merge back into full dataset, preserving all other records untouched
// ---------------------------------------------------------------------------
const finalData = allData.map(rec => {
  if ((rec.hexagramId === 19 || rec.hexagramId === 20) && newRecordsByKey.has(rec.id)) {
    return newRecordsByKey.get(rec.id);
  }
  return rec;
});

// sanity: ensure all 72 new ids were actually present & replaced in original data
const replacedIds = new Set(
  finalData.filter(r => (r.hexagramId === 19 || r.hexagramId === 20)).map(r => r.id)
);
for (const id of newRecordsByKey.keys()) {
  if (!replacedIds.has(id)) {
    throw new Error(`New record id ${id} was not found/replaced in original dataset — id mismatch.`);
  }
}

// ---------------------------------------------------------------------------
// 7. Write file back
// ---------------------------------------------------------------------------
const output = `window.Zero1MatrixData = window.Zero1MatrixData || {};\nwindow.Zero1MatrixData.reflectionQuestions = ${JSON.stringify(finalData)};\n`;
fs.writeFileSync(DATA_PATH, output, 'utf8');
console.log(`Wrote ${finalData.length} total records to ${DATA_PATH}`);
console.log(`FINAL RESULT: hex19 normU=${result19.uniqueCount}/36, hex20 normU=${result20.uniqueCount}/36`);
