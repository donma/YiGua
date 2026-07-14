'use strict';
/**
 * Stage 3: Generate unique, hex-specific + category-specific reflection questions
 * for Hexagram 23 (剝) and Hexagram 24 (復).
 */
const vm = require('vm');
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

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

// ---------------------------------------------------------------------------
// HEX 23 剝 imagery assignments (Q1 state, Q2 choice, Q3 risk/boundary/timing)
// ---------------------------------------------------------------------------
const HEX23 = {
  hexagramId: 23,
  hexagramName: '剝',
  full: '山地剝',
  data: {
    general: {
      imgs: ['不利有攸往', '山附于地', '碩果不食'],
      q1: '在山地剝「不利有攸往」的格局中，你目前的整體處境比較像結構開始鬆動的初期，還是核心已經被迫收縮的後期？',
      q2: '面對整體局勢的剝落，你會選擇像山附于地那樣先穩住根基，還是像碩果不食那樣把核心資源完全保留不動？',
      q3: '哪個具體訊號會讓你意識到整體情勢正從輕微損耗轉為結構性崩壞，需要提前準備收縮？',
    },
    career: {
      imgs: ['剝床以辨', '剝之無咎', '君子得輿小人剝廬'],
      q1: '你目前的職場處境像是「剝床以辨」那樣連接處已受損，還是仍停留在可以「剝之無咎」的低風險階段？',
      q2: '面對職位或部門的削弱，你比較傾向像君子那樣退守核心崗位保住根本，還是繼續留在原本的架構裡硬撐？',
      q3: '在職場結構鬆動時，哪個跡象代表你即將從「無咎」的階段跨進真正危及自身的範圍？',
    },
    love: {
      imgs: ['剝床以膚', '貫魚以宮人寵', '剝床以足'],
      q1: '這段感情目前的狀態，比較像「剝床以足」那種基礎剛開始動搖，還是已經到了「剝床以膚」貼身切膚的地步？',
      q2: '面對關係中逐漸浮現的裂痕，你會選擇像貫魚以宮人寵那樣按部就班修復秩序，還是先收回情感保護自己？',
      q3: '這段感情中哪個細微的變化一旦出現，會是從單純摩擦轉為傷及根本信任的關鍵界線？',
    },
    money: {
      imgs: ['剝床以足', '剝床以辨', '碩果不食'],
      q1: '你的財務狀況目前是「剝床以足」那種基礎收入開始減少，還是已到「剝床以辨」關鍵資金環節受損的程度？',
      q2: '面對收入或資產的收縮，你會選擇像碩果不食那樣保留最後一筆核心儲備，還是持續投入希望撐過這一波？',
      q3: '在財務上，哪個具體訊號會代表風險正從局部虧損擴大為侵蝕根本本金的高度危險階段？',
    },
    people: {
      imgs: ['貫魚以宮人寵', '剝之無咎', '君子得輿小人剝廬'],
      q1: '你目前的人際處境，是像貫魚以宮人寵那樣還能按序維持關係，還是已經出現「君子得輿小人剝廬」的分裂徵兆？',
      q2: '面對團體或關係圈逐漸瓦解，你會選擇像君子那樣退守核心的幾個人，還是嘗試維繫整個原本的圈子？',
      q3: '在人際關係中，哪個具體行為一旦出現，會代表對方已經從單純疏遠轉為真正的背離？',
    },
    family: {
      imgs: ['剝床以膚', '剝床以足', '上以厚下安宅'],
      q1: '家庭目前的狀態，是「剝床以足」那種外圍瑣事開始動盪，還是已經深入到「剝床以膚」影響核心成員的地步？',
      q2: '面對家庭結構的鬆動，你會依循「上以厚下安宅」的原則先穩固基本生活，還是先處理表面的爭執？',
      q3: '家中哪個具體徵兆出現時，會提醒你問題已經從日常摩擦演變成動搖家庭根基的危機？',
    },
    study: {
      imgs: ['剝床以辨', '剝之無咎', '碩果不食'],
      q1: '你目前的學習狀態，是「剝之無咎」那種進度稍微落後仍可補救，還是已經到「剝床以辨」關鍵基礎科目鬆動的地步？',
      q2: '面對學習進度的流失，你會選擇像碩果不食那樣保留最核心的幾個科目全力鞏固，還是分散心力全面追趕？',
      q3: '學習上哪個具體信號會代表落後已經從可以補救，轉變為根本觀念嚴重缺失的危險程度？',
    },
    health: {
      imgs: ['剝床以膚', '不利有攸往', '山附于地'],
      q1: '你目前的身心狀態，是「不利有攸往」那種還適合休養觀察，還是已經進入「剝床以膚」直接影響身體核心的階段？',
      q2: '面對體力或精神的耗損，你會選擇像山附于地那樣完全停下來休息，還是維持基本活動邊調整邊觀察？',
      q3: '身體或情緒上哪個具體變化一旦出現，會是從單純疲累轉為需要正視根本問題的警訊？',
    },
    decision: {
      imgs: ['剝之無咎', '剝床以辨', '君子得輿小人剝廬'],
      q1: '你面前的這個決策情境，是還處在「剝之無咎」可以從容選擇的階段，還是已經到了「剝床以辨」必須立刻分辨方向的時刻？',
      q2: '在這個決策上，你會選擇像君子那樣捨棄部分利益保留核心目標，還是想辦法保住整體不做取捨？',
      q3: '在猶豫的過程中，哪個時間點一旦錯過，就會讓原本可以無咎的選擇變成必須承擔後果？',
    },
    business: {
      imgs: ['君子得輿小人剝廬', '剝床以足', '貫魚以宮人寵'],
      q1: '你的事業目前處於「剝床以足」那種周邊業務開始萎縮，還是已經到「君子得輿小人剝廬」核心與外圍明顯分裂的地步？',
      q2: '面對經營規模的收縮，你會選擇像貫魚以宮人寵那樣按優先順序保留核心團隊，還是嘗試維持原本的整體規模？',
      q3: '經營上哪個具體財務或人事訊號，會代表危機已經從局部虧損擴大到動搖整體根基層面？',
    },
    legal: {
      imgs: ['剝之無咎', '上以厚下安宅', '剝床以辨'],
      q1: '你目前面對的合約或糾紛，是「剝之無咎」還能協商化解的階段，還是已到「剝床以辨」條款關鍵處已經受損的程度？',
      q2: '面對這個爭議，你會依循「上以厚下安宅」的原則先確保基本權益不失，還是先爭取整體條件的完整？',
      q3: '在這類事務中，哪個時間點或動作一旦跨過，就會讓原本無咎的協商轉為難以挽回的對立？',
    },
    spiritual: {
      imgs: ['碩果不食', '山附于地', '上以厚下安宅'],
      q1: '你目前的心境，是「山附于地」那種需要沉靜收斂的階段，還是已經進入「碩果不食」守護內在核心信念的時刻？',
      q2: '面對外在事物的不斷剝落，你會選擇像上以厚下安宅那樣先安頓內心根基，還是持續向外尋找答案？',
      q3: '在修行或內省的路上，哪個念頭一旦出現，代表你正從單純的低潮滑向真正的信念動搖？',
    },
  },
};

// ---------------------------------------------------------------------------
// HEX 24 復 imagery assignments
// ---------------------------------------------------------------------------
const HEX24 = {
  hexagramId: 24,
  hexagramName: '復',
  full: '地雷復',
  data: {
    general: {
      imgs: ['亨', '雷在地中', '反復其道七日來復'],
      q1: '你目前的整體狀況，是「雷在地中」那種陽氣才剛開始回升，還是已接近「反復其道七日來復」完整回歸正軌的階段？',
      q2: '面對整體局勢的轉機，你會選擇立刻著手修正方向，還是先觀察七日這樣的週期再決定是否行動？',
      q3: '哪個具體訊號會提醒你，這次回升其實只是短暫的波動，而不是真正「亨」的轉折點？',
    },
    career: {
      imgs: ['不遠復', '中行獨復', '敦復'],
      q1: '你的職場處境，是「不遠復」那種偏離不久馬上能修正，還是已經需要「敦復」以厚實態度徹底調整方向？',
      q2: '面對職涯上的偏差，你會選擇立刻回頭修正原本的路線，還是像中行獨復那樣獨自開闢新的方向？',
      q3: '在職場上，哪個時間點一旦錯過，會讓原本「不遠」就能修正的偏差變成難以挽回的方向錯誤？',
    },
    love: {
      imgs: ['頻復', '休復', '朋來無咎'],
      q1: '這段感情目前的狀態，是「頻復」那種反覆分合尚未穩定，還是已經到「休復」真心和好的階段？',
      q2: '面對關係中反覆出現的問題，你會選擇這次徹底修復重新開始，還是先觀察對方是否也有同樣的意願再決定？',
      q3: '在這段感情中，哪個反覆的跡象會提醒你，這已經不是單純磨合，而是需要正視的模式？',
    },
    money: {
      imgs: ['迷復', '出入無疾', '頻復'],
      q1: '你的財務狀況，是「出入無疾」那種收支還算平穩，還是已經出現「迷復」找不到回正軌道的跡象？',
      q2: '面對財務上反覆出現的問題，你會選擇立刻停下重新規劃，還是先觀察這是否只是短期的頻復波動？',
      q3: '財務上哪個訊號會顯示，這已經不是單純的頻復調整，而是接近迷復回不了頭的狀態？',
    },
    people: {
      imgs: ['中行獨復', '朋來無咎', '出入無疾'],
      q1: '你目前的人際狀況，是「出入無疾」那種來往還算順暢，還是需要「中行獨復」獨自調整立場的階段？',
      q2: '面對關係中的分歧，你會選擇等待「朋來無咎」自然和解，還是主動獨自先修正自己的態度？',
      q3: '哪個具體的互動訊號會提醒你，對方其實可能還在等你先主動跨出修復關係的第一步呢？',
    },
    family: {
      imgs: ['休復', '敦復', '朋來無咎'],
      q1: '你的家庭狀況，是「休復」那種關係剛開始緩和，還是已經到「敦復」需要以厚實態度長期經營的階段？',
      q2: '面對家人之間的隔閡，你會選擇主動先修復關係，還是等待像朋來無咎那樣自然而然地和解？',
      q3: '家庭中哪個反覆出現的相處模式，會是需要真正正視而不是再次拖延下去的重要信號呢？',
    },
    study: {
      imgs: ['不遠復', '頻復', '中行獨復'],
      q1: '你目前的學習狀況，是「不遠復」那種剛偏離進度還能追上，還是已經「頻復」多次反覆難以穩定？',
      q2: '面對學習上的落後，你會選擇立刻回頭補強基礎，還是像中行獨復那樣獨立摸索新的學習方法？',
      q3: '在學習節奏上，哪個具體訊號會提醒你，落後程度已經超出「不遠」能夠追回的範圍呢？',
    },
    health: {
      imgs: ['出入無疾', '休復', '反復其道七日來復'],
      q1: '你的身心狀態，是「出入無疾」那種作息還算平穩，還是已經需要像七日來復那樣完整的休養週期？',
      q2: '面對身心狀況的反覆，你會選擇立刻調整生活作息，還是先觀察是否只是短暫的休復現象？',
      q3: '身體上哪個反覆出現的具體訊號，會是提醒你該正視而不是再次拖延下去的重要警示呢？',
    },
    decision: {
      imgs: ['不遠復', '迷復', '中行獨復'],
      q1: '你面前的決策，是「不遠復」那種還能及時修正方向，還是已接近「迷復」找不到回頭路的困境？',
      q2: '在這個決策上，你會選擇立刻修正原本的方向，還是像中行獨復那樣獨自堅持走一條新的路？',
      q3: '哪個具體時間點一旦錯過，會讓這個決策從「不遠」能修正變成真正無法挽回的迷復？',
    },
    business: {
      imgs: ['敦復', '出入無疾', '不遠復'],
      q1: '你的事業目前是「出入無疾」那種營運還算穩定，還是需要「敦復」以厚實態度重新調整經營方向？',
      q2: '面對經營上出現的偏差，你會選擇立刻修正策略，還是先觀察市場反應再決定是否調整？',
      q3: '經營上哪個訊號會顯示，問題已經從「不遠」可修正的偏差擴大為需要敦復的根本調整？',
    },
    legal: {
      imgs: ['迷復', '先王以至日閉關商旅不行', '中行獨復'],
      q1: '你目前面對的合約或糾紛，是還能「中行獨復」自行調整立場解決，還是已經接近「迷復」難以挽回的地步？',
      q2: '面對這個爭議，你會選擇立刻採取行動修正，還是像先王閉關那樣先暫停等待更合適的時機？',
      q3: '在這類事務中，哪個訊號會提醒你拖延的時間已經超過合理範圍，正接近迷復的風險？',
    },
    spiritual: {
      imgs: ['敦復', '迷復', '反復其道七日來復'],
      q1: '你目前的心境，是「反復其道七日來復」那種正處在週期性回歸的過程，還是已經出現「迷復」偏離內心方向的跡象？',
      q2: '面對內心的反覆動搖，你會選擇以敦復的厚實態度持續修正，還是先停下來重新確認自己的方向？',
      q3: '在內省的過程中，哪個念頭反覆出現時，會是提醒你正逐漸迷失而非單純波動的信號？',
    },
  },
};

function buildQuestions(hexDef) {
  const out = [];
  for (const [catKey, catName] of CATEGORIES) {
    const d = hexDef.data[catKey];
    if (!d) throw new Error(`Missing data for hex ${hexDef.hexagramId} cat ${catKey}`);
    const entries = [d.q1, d.q2, d.q3];
    entries.forEach((question, idx) => {
      out.push({
        id: `rf-${String(hexDef.hexagramId).padStart(3, '0')}-${catKey}-${idx + 1}`,
        hexagramId: hexDef.hexagramId,
        hexagramName: hexDef.hexagramName,
        category: catKey,
        categoryName: catName,
        question,
        basis: [hexDef.hexagramName, d.imgs[idx] || d.imgs[0], catName],
        qualityLevel: 'refined',
        reviewed: false,
        reviewedBy: 'reflection-gold-review-stage3',
        reviewedAt: '2026-07-13',
        needsHumanReview: true,
        version: '1.8.0-stage3-hex23-24',
      });
    });
  }
  return out;
}

function normalize(s) {
  return s.replace(/[？?，,。.！!、\s]/g, '');
}

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

function main() {
  const newH23 = buildQuestions(HEX23);
  const newH24 = buildQuestions(HEX24);

  validateLengths(newH23, 'HEX23');
  validateLengths(newH24, 'HEX24');
  validateEndsWithQuestionMark(newH23, 'HEX23');
  validateEndsWithQuestionMark(newH24, 'HEX24');
  validateUniqueness(newH23, 'HEX23');
  validateUniqueness(newH24, 'HEX24');
  validateUniqueness([...newH23, ...newH24], 'HEX23+24 combined');

  // Load current data file via vm
  const code = fs.readFileSync(DATA_PATH, 'utf8');
  const sandbox = { window: {} };
  vm.createContext(sandbox);
  vm.runInContext(code, sandbox, { filename: DATA_PATH });
  const data = sandbox.window.Zero1MatrixData.reflectionQuestions;
  if (!Array.isArray(data)) throw new Error('Failed to load existing reflectionQuestions array');

  console.log(`Loaded existing data: ${data.length} questions total.`);

  const before23 = data.filter((d) => d.hexagramId === 23).length;
  const before24 = data.filter((d) => d.hexagramId === 24).length;
  console.log(`Existing hex23=${before23}, hex24=${before24}`);

  const filtered = data.filter((d) => d.hexagramId !== 23 && d.hexagramId !== 24);
  const merged = [...filtered, ...newH23, ...newH24];

  // Sort by hexagramId to keep file organized (stable sort preserves relative order otherwise)
  merged.sort((a, b) => a.hexagramId - b.hexagramId);

  console.log(`New total: ${merged.length} (expected ${data.length - before23 - before24 + newH23.length + newH24.length})`);

  const output =
    "window.Zero1MatrixData = window.Zero1MatrixData || {};\n" +
    "window.Zero1MatrixData.reflectionQuestions = " +
    JSON.stringify(merged) +
    ";\n";

  fs.writeFileSync(DATA_PATH, output, 'utf8');
  console.log(`Written to ${DATA_PATH}`);

  // Verify with node --check
  try {
    execFileSync(process.execPath, ['--check', DATA_PATH], { stdio: 'inherit' });
    console.log('node --check PASSED.');
  } catch (e) {
    console.error('node --check FAILED.');
    throw e;
  }

  // Re-load to double check parse correctness
  const verifyCode = fs.readFileSync(DATA_PATH, 'utf8');
  const verifySandbox = { window: {} };
  vm.createContext(verifySandbox);
  vm.runInContext(verifyCode, verifySandbox, { filename: DATA_PATH });
  const verifyData = verifySandbox.window.Zero1MatrixData.reflectionQuestions;
  console.log(`Verification reload: ${verifyData.length} total questions.`);
  const v23 = verifyData.filter((d) => d.hexagramId === 23);
  const v24 = verifyData.filter((d) => d.hexagramId === 24);
  console.log(`Verification hex23=${v23.length}, hex24=${v24.length}`);
  if (v23.length !== 36 || v24.length !== 36) {
    throw new Error('Verification failed: expected 36 questions each for hex23 and hex24');
  }

  console.log('Stage 3 hex23/24 reflection question generation COMPLETE.');
}

main();
