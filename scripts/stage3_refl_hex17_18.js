// Stage 3: Generate per-hex-per-category unique reflection questions for hex 17 (隨) and 18 (蠱)
const vm = require('vm');
const fs = require('fs');
const path = require('path');

const DATA_PATH = path.join(__dirname, '..', 'src', 'data', 'reflectionQuestions.data.js');

const CATEGORIES = [
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

// ---------- HEX 17 隨 ----------
const H17_IMAGERY = {
  general: ['元亨利貞無咎', '澤中有雷', '拘係之乃從維之'],
  career: ['出門交有功', '官有渝貞吉', '隨有求得'],
  love: ['係小子失丈夫', '係丈夫失小子', '孚于嘉吉'],
  money: ['隨有求得', '隨有獲貞凶', '拘係之乃從維之'],
  people: ['出門交有功', '拘係之乃從維之', '官有渝貞吉'],
  family: ['係小子失丈夫', '係丈夫失小子', '君子以嚮晦入宴息'],
  study: ['官有渝貞吉', '出門交有功', '孚于嘉吉'],
  health: ['君子以嚮晦入宴息', '澤中有雷', '隨有獲貞凶'],
  decision: ['隨有獲貞凶', '係小子失丈夫', '王用亨于西山'],
  business: ['隨有求得', '出門交有功', '拘係之乃從維之'],
  legal: ['拘係之乃從維之', '王用亨于西山', '隨有獲貞凶'],
  spiritual: ['孚于嘉吉', '君子以嚮晦入宴息', '王用亨于西山'],
};

const H17_Q = {
  general: [
    '澤中有雷，隨卦的整體格局提醒你順勢而動；此刻你的處境最接近元亨利貞無咎的哪一種狀態？',
    '面對整體局勢，你會選擇像出門交有功那樣主動跟隨外界腳步，還是拘係之乃從維之般守住原則？',
    '當跟隨的關係逐漸綁定深化，什麼跡象會提醒你該檢查自己是否還保有應有的自主性？',
  ],
  career: [
    '官有渝貞吉揭示職位或職責可能出現變動，你目前的工作處境是否已進入這種轉折點？',
    '在職場選擇上，你比較傾向出門交有功般主動拓展人脈，還是守住現有崗位穩紮穩打？',
    '隨有求得提醒跟隨能帶來收穫，但什麼樣具體的職場代價是你容易在追求成果的過程中忽略掉的？',
  ],
  love: [
    '係小子失丈夫與係丈夫失小子都在講感情中的取捨，你目前的處境比較接近哪一種失去的類型？',
    '面對感情中的抉擇，你會選擇孚于嘉吉般真誠追隨對方的美善，還是先確認彼此方向是否一致？',
    '當關係中彼此的依附越來越深，什麼樣具體的界線是即使深情也不應該被跨越或犧牲的？',
  ],
  money: [
    '隨有求得說明跟隨市場或機會的腳步能有所得，你目前的財務判斷是否已看清方向再行動？',
    '面對投資或消費機會，你會選擇拘係之乃從維之般謹慎鎖定既有資源，還是隨有求得般主動出擊？',
    '隨有獲貞凶提醒過度追求眼前收穫恐藏有隱憂，什麼樣具體的財務訊號代表風險正在升高？',
  ],
  people: [
    '出門交有功說明主動走出去結交能有收穫，你目前的人際處境是否已到適合拓展的階段？',
    '面對人際互動，你會選擇官有渝貞吉般調整角色重新定位，還是拘係之乃從維之般穩固既有連結？',
    '當一段合作或人脈關係綁定越來越緊密，什麼樣具體的付出容易被你忽略而逐漸累積成負擔？',
  ],
  family: [
    '係小子失丈夫與係丈夫失小子都涉及家庭中的取捨，你目前的處境比較接近哪一種類型？',
    '面對家人關係的抉擇，你會選擇君子以嚮晦入宴息般退回安頓自己，還是主動介入調解爭端？',
    '當家庭成員間的依附與牽絆逐漸加深，什麼樣具體的界線是即使親情也需要被尊重和保留的？',
  ],
  study: [
    '官有渝貞吉提示學習方向可能需要適時調整，你目前的學習進度是否已到這樣的轉折時機？',
    '面對學習策略，你會選擇出門交有功般廣泛涉獵吸收，還是孚于嘉吉般專注深耕核心科目？',
    '什麼樣具體的學習訊號會提醒你目前所使用的方法已經不再適合，是時候該考慮轉換方式了？',
  ],
  health: [
    '君子以嚮晦入宴息提醒休養生息的重要性，你目前的身心狀態是否已到需要停下調整的階段？',
    '面對身心調養，你會選擇澤中有雷般順應自然節奏休息，還是繼續維持現有的作息安排？',
    '隨有獲貞凶提示過度追求成果恐傷身心，什麼樣具體的疲憊訊號是你平時容易忽略的警訊？',
  ],
  decision: [
    '隨有獲貞凶提醒盲目跟隨恐帶來凶險，你目前面臨的決策是否已經看清背後真正的方向？',
    '面對重大抉擇，你會選擇像係小子失丈夫般捨棄眼前的小利，還是堅持原有的長遠布局規劃？',
    '王用亨于西山象徵誠心奉獻能夠通達，什麼樣具體的時機才是你採取行動最合適的時候？',
  ],
  business: [
    '隨有求得說明跟隨市場趨勢能有收穫，你目前的經營方向是否已看準值得跟進的機會所在？',
    '面對經營策略，你會選擇出門交有功般積極對外拓展，還是拘係之乃從維之般鞏固核心客群？',
    '什麼樣具體的經營訊號會提醒你目前所跟隨的方向，其實已經開始偏離最初設定的初衷？',
  ],
  legal: [
    '拘係之乃從維之提醒約束與承諾需要被謹慎對待，你目前的合約處境是否已清楚條款界線？',
    '面對合約或糾紛，你會選擇王用亨于西山般以誠意化解，還是依循既定規則據理力爭到底？',
    '隨有獲貞凶提示急於求成恐生法律風險，什麼樣具體的細節是你容易在簽署前忽略掉的？',
  ],
  spiritual: [
    '孚于嘉吉提示誠信追隨美善之事會帶來吉祥，你目前的內心修行是否已朝這個方向前進了？',
    '面對修行路上的選擇，你會選擇君子以嚮晦入宴息般向內安頓自己，還是持續向外尋求指引？',
    '王用亨于西山象徵至誠可以通達山川，什麼樣具體的心境轉變會讓你更靠近這份誠意？',
  ],
};

// ---------- HEX 18 蠱 ----------
const H18_IMAGERY = {
  general: ['元亨利涉大川', '山下有風', '先甲三日後甲三日'],
  career: ['幹父之蠱用譽', '先甲三日後甲三日', '不事王侯高尚其事'],
  love: ['幹母之蠱', '裕父之蠱', '幹父之蠱小有悔'],
  money: ['裕父之蠱', '幹父之蠱', '先甲三日後甲三日'],
  people: ['幹父之蠱', '幹父之蠱小有悔', '君子以振民育德'],
  family: ['幹父之蠱', '幹母之蠱', '裕父之蠱'],
  study: ['先甲三日後甲三日', '幹父之蠱小有悔', '君子以振民育德'],
  health: ['山下有風', '裕父之蠱', '幹母之蠱'],
  decision: ['先甲三日後甲三日', '幹父之蠱小有悔', '元亨利涉大川'],
  business: ['元亨利涉大川', '幹父之蠱用譽', '裕父之蠱'],
  legal: ['幹父之蠱用譽', '先甲三日後甲三日', '不事王侯高尚其事'],
  spiritual: ['不事王侯高尚其事', '君子以振民育德', '山下有風'],
};

const H18_Q = {
  general: [
    '山下有風象徵長期累積的問題正在悄悄醞釀，你目前的整體處境是否已經浮現這種跡象？',
    '面對整體局勢中的積弊，你會選擇元亨利涉大川般勇於涉險整頓，還是先觀察等待時機成熟？',
    '先甲三日後甲三日提醒事前事後都需謹慎，什麼樣的時間點才是你著手處理問題最恰當的階段？',
  ],
  career: [
    '幹父之蠱用譽說明整頓舊有問題能建立聲譽，你目前的職場處境是否已到接手處理的階段？',
    '面對職場中承接的舊問題，你會選擇不事王侯高尚其事般保持超然立場，還是積極介入改革？',
    '先甲三日後甲三日提醒行動前後都要謀劃周全，什麼樣的準備是你容易在急於改革時省略的？',
  ],
  love: [
    '幹母之蠱提示處理感情中柔性糾結的問題需要細膩，你目前的感情處境是否正面臨這種局面？',
    '面對感情中承接的舊有問題，你會選擇裕父之蠱般寬容以待，還是幹父之蠱小有悔般積極介入？',
    '幹父之蠱小有悔提醒過於積極整頓感情問題恐留下遺憾，什麼樣具體的分寸是你需要拿捏的？',
  ],
  money: [
    '裕父之蠱提示對財務舊帳過於寬鬆恐讓問題延續，你目前的財務狀況是否已出現這種累積跡象？',
    '面對財務上的長期積弊，你會選擇幹父之蠱般積極整頓，還是先甲三日後甲三日般謀定而後動？',
    '什麼樣具體的財務訊號，會提醒你目前放任不管的舊帳問題已經開始逐漸擴大惡化了？',
  ],
  people: [
    '幹父之蠱提示接手處理人際間遺留的舊問題需要決心，你目前的人際處境是否已到這個階段？',
    '面對人際關係中的舊有矛盾，你會選擇君子以振民育德般以身作則感化，還是直接介入調解？',
    '幹父之蠱小有悔提醒處理過於急躁恐留下人情遺憾，什麼樣具體的分寸是你容易忽略的？',
  ],
  family: [
    '幹父之蠱與幹母之蠱都在講承接家中遺留的問題，你目前的家庭處境比較接近哪一種類型？',
    '面對家庭中累積已久的矛盾，你會選擇裕父之蠱般包容以待，還是主動承擔起整頓的責任？',
    '什麼樣具體的家庭訊號會提醒你，這個長期擱置的問題已經到了必須正視處理的臨界點？',
  ],
  study: [
    '先甲三日後甲三日提醒學習規劃需要前後周全，你目前的準備是否已涵蓋這種謹慎的節奏？',
    '面對學習上累積已久的弱點，你會選擇君子以振民育德般透過紀律逐步養成，還是集中衝刺補強？',
    '幹父之蠱小有悔提示補救舊有問題可能留下遺憾，什麼樣的方法能讓你把代價降到最低？',
  ],
  health: [
    '山下有風象徵長期累積的耗損正在悄悄形成，你目前的身心狀態是否已浮現出這種疲態？',
    '面對身心上累積已久的問題，你會選擇裕父之蠱般順其自然調養，還是幹母之蠱般細心介入處理？',
    '什麼樣具體的身心訊號，會提醒你目前長期放任不理的健康狀況已經需要正視面對了呢？',
  ],
  decision: [
    '先甲三日後甲三日提示決策前後都要謀劃周詳，你目前面臨的抉擇是否已做足這種準備？',
    '面對牽涉舊有問題的決策，你會選擇元亨利涉大川般勇於承擔風險，還是幹父之蠱小有悔般謹慎小幅推進？',
    '什麼樣具體的時機，才是你判斷該正式展開整頓行動，而非繼續拖延觀望的關鍵點呢？',
  ],
  business: [
    '元亨利涉大川說明整頓積弊後才適合大展拓展，你目前的經營處境是否已準備好這一步？',
    '面對經營中承接的舊有問題，你會選擇幹父之蠱用譽般積極整頓建立口碑，還是裕父之蠱般暫緩觀望？',
    '什麼樣具體的經營訊號，會提醒你目前長期姑息放任的問題正在悄悄侵蝕整體根基了？',
  ],
  legal: [
    '幹父之蠱用譽提示妥善處理遺留爭議能建立信譽，你目前的合約處境是否已到需要整頓的階段？',
    '面對法律或合約上的舊有糾紛，你會選擇先甲三日後甲三日般謀定而後動，還是不事王侯高尚其事般保持中立超然？',
    '什麼樣具體的細節，是你在處理這種遺留爭議時容易疏忽而衍生出更多風險的地方呢？',
  ],
  spiritual: [
    '不事王侯高尚其事提示超越世俗追求更高原則，你目前的內心修行是否已朝這個方向邁進？',
    '面對修行路上累積已久的內在課題，你會選擇君子以振民育德般透過利他實踐修養，還是山下有風般靜觀內省？',
    '什麼樣具體的心境轉變，會讓你察覺自己正在超越舊有框架，逐步走向更高的原則呢？',
  ],
};

function buildQuestions(hexId, hexName, imageryMap, qMap) {
  const out = [];
  for (const [cat, catName] of CATEGORIES) {
    const questions = qMap[cat];
    const imagery = imageryMap[cat];
    for (let i = 0; i < 3; i++) {
      out.push({
        id: `rf-${String(hexId).padStart(3, '0')}-${cat}-${i + 1}`,
        hexagramId: hexId,
        hexagramName: hexName,
        category: cat,
        categoryName: catName,
        question: questions[i],
        basis: [hexName, catName, imagery[i]],
        qualityLevel: 'refined',
        reviewed: false,
        reviewedBy: 'stage3-refl-hex17-18',
        reviewedAt: '2026-07-13',
        needsHumanReview: true,
        version: '1.8.0-stage3-hex17-18',
      });
    }
  }
  return out;
}

const newH17 = buildQuestions(17, '隨', H17_IMAGERY, H17_Q);
const newH18 = buildQuestions(18, '蠱', H18_IMAGERY, H18_Q);
const newAll = [...newH17, ...newH18];

// -------- Length assertion (38-105 chars) --------
let lengthErrors = [];
for (const q of newAll) {
  const len = q.question.length;
  if (len < 38 || len > 105) {
    lengthErrors.push(`${q.id}: length=${len} :: ${q.question}`);
  }
  if (!q.question.endsWith('？')) {
    lengthErrors.push(`${q.id}: does not end with ？`);
  }
}
if (lengthErrors.length > 0) {
  console.error('LENGTH/FORMAT ERRORS FOUND:');
  lengthErrors.forEach(e => console.error(e));
  throw new Error('Aborting: fix length/format errors before writing.');
}

// -------- Uniqueness check --------
function normalize(s) {
  return s.replace(/[，。？、；：「」『』！\s]/g, '');
}
const allNorm = newAll.map(q => normalize(q.question));
const uniqueSet = new Set(allNorm);
console.log(`Total questions: ${newAll.length}, unique normalized: ${uniqueSet.size}`);
if (uniqueSet.size !== newAll.length) {
  // find dupes
  const seen = new Map();
  newAll.forEach((q, idx) => {
    const n = allNorm[idx];
    if (seen.has(n)) {
      console.error(`Duplicate: ${q.id} == ${seen.get(n)}`);
    } else {
      seen.set(n, q.id);
    }
  });
  throw new Error('Aborting: duplicate questions found.');
}

// per-hex uniqueness (should already be full-set unique, but double check per hex >=32/36)
for (const hexId of [17, 18]) {
  const subset = newAll.filter(q => q.hexagramId === hexId).map(q => normalize(q.question));
  const uniq = new Set(subset).size;
  console.log(`Hex ${hexId}: ${subset.length} questions, ${uniq} unique`);
  if (uniq < 32) {
    throw new Error(`Aborting: hex ${hexId} unique count ${uniq} < 32`);
  }
}

// -------- Load existing data file and replace hex17/18 entries --------
const code = fs.readFileSync(DATA_PATH, 'utf8');
const sandbox = { window: {} };
vm.createContext(sandbox);
vm.runInContext(code, sandbox);
const existing = sandbox.window.Zero1MatrixData.reflectionQuestions;

const filtered = existing.filter(q => q.hexagramId !== 17 && q.hexagramId !== 18);

// Insert new hex17/18 entries at the position of the first removed hex17 entry to keep order sane
let insertIdx = existing.findIndex(q => q.hexagramId === 17);
if (insertIdx === -1) insertIdx = filtered.length;
else {
  // recompute insertIdx relative to filtered array: count entries before original insertIdx that are not hex17/18
  let count = 0;
  for (let i = 0; i < insertIdx; i++) {
    if (existing[i].hexagramId !== 17 && existing[i].hexagramId !== 18) count++;
  }
  insertIdx = count;
}

const finalData = [
  ...filtered.slice(0, insertIdx),
  ...newAll,
  ...filtered.slice(insertIdx),
];

console.log(`Final data length: ${finalData.length} (was ${existing.length})`);

const output =
  "window.Zero1MatrixData = window.Zero1MatrixData || {};\n" +
  "window.Zero1MatrixData.reflectionQuestions = " + JSON.stringify(finalData) + ";\n";

fs.writeFileSync(DATA_PATH, output, 'utf8');
console.log('File written successfully.');
