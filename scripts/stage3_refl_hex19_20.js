// Stage3 reflection question regeneration for hex 19 (臨) and hex 20 (觀)
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const DATA_PATH = path.join(__dirname, '..', 'src', 'data', 'reflectionQuestions.data.js');

const CATS = [
  ['general', '一般'],
  ['career', '工作事業'],
  ['love', '感情關係'],
  ['money', '財務金錢'],
  ['people', '人際合作'],
  ['family', '家庭親人'],
  ['study', '學習考試'],
  ['health', '身心狀態'],
  ['decision', '重大決策'],
  ['business', '創業經營'],
  ['legal', '官非合約'],
  ['spiritual', '心境修行'],
];

// Imagery assignment per category (3 images each)
const IMG19 = {
  general: ['元亨利貞', '澤上有地', '至于八月有凶'],
  career: ['咸臨吉無不利', '至臨', '知臨'],
  love: ['咸臨', '甘臨', '敦臨'],
  money: ['至于八月有凶', '甘臨', '敦臨'],
  people: ['咸臨', '咸臨吉無不利', '至臨'],
  family: ['敦臨', '咸臨', '君子以教思無窮容保民無疆'],
  study: ['知臨', '至臨', '咸臨吉無不利'],
  health: ['敦臨', '至于八月有凶', '甘臨'],
  decision: ['知臨', '至于八月有凶', '至臨'],
  business: ['至臨', '知臨', '至于八月有凶'],
  legal: ['甘臨', '知臨', '元亨利貞'],
  spiritual: ['君子以教思無窮容保民無疆', '敦臨', '知臨'],
};

const IMG20 = {
  general: ['盥而不薦有孚顒若', '風行地上', '觀我生'],
  career: ['觀國之光', '觀其生', '闚觀'],
  love: ['觀我生', '觀其生', '童觀'],
  money: ['闚觀', '童觀', '觀國之光'],
  people: ['觀其生', '觀國之光', '風行地上'],
  family: ['觀我生', '童觀', '觀其生'],
  study: ['童觀', '闚觀', '觀我生君子無咎'],
  health: ['觀我生', '盥而不薦有孚顒若', '觀其生'],
  decision: ['闚觀', '觀我生君子無咎', '觀國之光'],
  business: ['觀國之光', '先王以省方觀民設教', '闚觀'],
  legal: ['觀我生君子無咎', '觀國之光', '盥而不薦有孚顒若'],
  spiritual: ['盥而不薦有孚顒若', '觀我生', '觀其生'],
};

// ---------- Hex 19 question builders ----------
function q19_1(catName, img1, img2) {
  // Current state recognition
  const templates = [
    `臨卦講的是靠近與逐步治理，在${catName}這件事上，你現在的狀態比較像${img1}的哪個階段，是剛開始靠近，還是已經深入其中？`,
    `從咸臨到敦臨，臨卦描述的是一步步接近與承擔，你在${catName}上目前走到哪一步，哪些條件已經成熟、哪些還沒？`,
    `${img1}與${img2}分別代表不同的靠近方式，你在${catName}裡目前最依賴的是哪一種靠近的姿態？`,
    `臨卦提醒盛極必有隱憂，在${catName}這件事上，你覺得目前是接近八月有凶的轉折點，還是仍在上升期？`,
  ];
  return templates;
}
function q19_2(catName, img1) {
  const templates = [
    `面對${catName}的處境，你比較傾向主動靠近、親自介入，還是先保持一點距離、觀望等待？兩者你怎麼權衡？`,
    `如果要在${catName}上做出選擇，你會選擇像${img1}那樣更貼近現場，還是選擇暫時退一步、等時機更成熟再靠近？`,
    `在${catName}這件事上，你現在是該加深投入、擴大參與，還是該先修補既有的關係與基礎再前進？`,
    `面對${catName}的下一步，你會選擇獨自承擔靠近的責任，還是找人一起分擔這個治理的過程？`,
  ];
  return templates;
}
function q19_3(catName, img1) {
  const templates = [
    `臨卦說至于八月有凶，在${catName}這件事上，什麼訊號會讓你察覺情勢正從順利轉向風險？`,
    `在${catName}的靠近過程中，有哪一條界線是你知道不該用討好或勉強的方式跨過去的？`,
    `如果只是用甘臨那種討好的方式維持${catName}的表面和諧，你覺得長期下來會付出什麼被忽略的代價？`,
    `在${catName}上，什麼時候是你該從靠近轉為停下來、重新以敦厚厚實的態度收尾的時機？`,
  ];
  return templates;
}

// ---------- Hex 20 question builders ----------
function q20_1(catName, img1, img2) {
  const templates = [
    `觀卦談的是觀察與被觀察，在${catName}這件事上，你目前比較像${img1}描述的哪個視角，是還看得淺，還是已經看得比較深遠？`,
    `從童觀到觀國之光，觀卦描述的是視野逐漸展開的過程，你在${catName}上目前站在哪個觀察的位置？`,
    `${img1}與${img2}分別代表不同的觀察角度，你覺得自己在${catName}裡目前最欠缺的是哪一種視角？`,
    `觀卦重視盥而不薦的莊重態度，在${catName}這件事上，你覺得自己目前是被信任地觀察，還是仍需要建立公信力？`,
  ];
  return templates;
}
function q20_2(catName, img1) {
  const templates = [
    `面對${catName}的處境，你現在比較需要的是先靜下來多觀察，還是已經到了該採取行動的時候？`,
    `在${catName}這件事上，你會選擇像${img1}那樣先從自身處境回看，還是把視野拉遠去看整體格局？`,
    `如果要調整${catName}上的做法，你會選擇擴大觀察的範圍，還是先修補目前觀察角度裡的盲點？`,
    `在${catName}上，你傾向獨自觀察後再決定，還是想找人一起確認你看到的是不是全貌？`,
  ];
  return templates;
}
function q20_3(catName, img1) {
  const templates = [
    `觀卦提醒闚觀容易只見片面，在${catName}這件事上，什麼訊號會讓你察覺自己看到的只是表象？`,
    `在${catName}的觀察過程中，有哪一條界線是你知道不該只憑片面印象就跨過去下判斷的？`,
    `如果只停留在童觀那種幼稚淺薄的視角看待${catName}，你覺得長期下來會忽略什麼樣的代價？`,
    `在${catName}上，什麼時候是你該從單純觀察轉為深入觀我生、檢視自身影響力的時機？`,
  ];
  return templates;
}

function pick(arr, idx) { return arr[idx % arr.length]; }

function buildQuestion(hexId, hexName, cat, catName, role, imgs, variantIdx) {
  let q;
  if (hexId === 19) {
    if (role === 1) q = pick(q19_1(catName, imgs[0], imgs[1]), variantIdx);
    else if (role === 2) q = pick(q19_2(catName, imgs[1]), variantIdx);
    else q = pick(q19_3(catName, imgs[2]), variantIdx);
  } else {
    if (role === 1) q = pick(q20_1(catName, imgs[0], imgs[1]), variantIdx);
    else if (role === 2) q = pick(q20_2(catName, imgs[1]), variantIdx);
    else q = pick(q20_3(catName, imgs[2]), variantIdx);
  }
  return q;
}

function normalize(s) {
  return s.replace(/[，,。？?！!、\s]/g, '');
}

function generateForHex(hexId, hexName, imgMap) {
  const out = [];
  let variantCounter = 0;
  for (const [cat, catName] of CATS) {
    const imgs = imgMap[cat];
    for (let role = 1; role <= 3; role++) {
      const question = buildQuestion(hexId, hexName, cat, catName, role, imgs, variantCounter);
      variantCounter++;
      const idxLabel = String(hexId).padStart(3, '0');
      out.push({
        id: `rf-${idxLabel}-${cat}-${role}`,
        hexagramId: hexId,
        hexagramName: hexName,
        category: cat,
        categoryName: catName,
        question,
        basis: [hexName, imgs[role - 1], catName],
        qualityLevel: 'refined',
        reviewed: false,
        reviewedBy: 'reflection-gold-review-stage3',
        reviewedAt: '2026-07-13',
        needsHumanReview: true,
        version: '1.7.2-stage3-refl-19-20',
      });
    }
  }
  return out;
}

const newH19 = generateForHex(19, '臨', IMG19);
const newH20 = generateForHex(20, '觀', IMG20);
const allNew = [...newH19, ...newH20];

// ---- Length assertion 38-105 chars ----
let lengthErrors = [];
for (const item of allNew) {
  const len = item.question.length;
  if (len < 38 || len > 105) {
    lengthErrors.push(`${item.id}: len=${len} :: ${item.question}`);
  }
}
if (lengthErrors.length) {
  console.error('LENGTH ERRORS FOUND:');
  console.error(lengthErrors.join('\n'));
  throw new Error('Length assertion failed, fix templates before writing.');
}

// ---- Uniqueness check ----
function checkUniqueness(list, label) {
  const norms = list.map(x => normalize(x.question));
  const set = new Set(norms);
  console.log(`${label}: total=${list.length} unique=${set.size}`);
  return set.size;
}
checkUniqueness(newH19, 'hex19');
checkUniqueness(newH20, 'hex20');

// per-group uniqueness (3 per group)
function checkGroups(list, hexLabel) {
  for (const [cat] of CATS) {
    const group = list.filter(x => x.category === cat);
    const norms = new Set(group.map(x => normalize(x.question)));
    if (norms.size !== 3) {
      console.warn(`WARNING group not fully unique: ${hexLabel}-${cat} unique=${norms.size}/3`);
    }
  }
}
checkGroups(newH19, 'hex19');
checkGroups(newH20, 'hex20');

// ---------- Load existing data file ----------
const code = fs.readFileSync(DATA_PATH, 'utf8');
const ctx = { window: {} };
vm.createContext(ctx);
vm.runInContext(code, ctx);
const data = ctx.window.Zero1MatrixData.reflectionQuestions;

const filtered = data.filter(d => d.hexagramId !== 19 && d.hexagramId !== 20);

// Keep original ordering position: find first index of hex19 in original array to splice in same place
let insertIdx = data.findIndex(d => d.hexagramId === 19);
if (insertIdx === -1) insertIdx = filtered.length;

const finalData = [
  ...filtered.slice(0, insertIdx),
  ...allNew,
  ...filtered.slice(insertIdx),
];

const outContent = `window.Zero1MatrixData = window.Zero1MatrixData || {};\nwindow.Zero1MatrixData.reflectionQuestions = ${JSON.stringify(finalData)};\n`;

fs.writeFileSync(DATA_PATH, outContent, { encoding: 'utf8' });
console.log('Written', DATA_PATH, 'total records:', finalData.length);
