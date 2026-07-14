'use strict';
/**
 * wA_refl_29_30.js — 72 per-hex-per-category unique reflection questions
 * for Hexagram 29 (坎) and Hexagram 30 (離).
 * Q1=state, Q2=choice (compare 2 real options), Q3=risk/boundary/timing.
 * 38-105 chars each, ends with ？, open-ended.
 * At least 2 of 3 per group use hex imagery.
 * qualityLevel="refined", reviewed=false, needsHumanReview=true.
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

// ============================================================================
// HEX 29 坎 imagery: 習坎, 有孚維心亨, 行有尚, 坎窞, 求小得, 來之坎坎, 樽酒簋貳, 坎不盈, 係用徽纆, 水洊至
// ============================================================================
const HEX29 = {
  hexagramId: 29,
  hexagramName: '坎',
  full: '坎為水',
  data: {
    // general: 習坎, 水洊至, 有孚維心亨
    general: {
      imgs: ['習坎', '水洊至', '有孚維心亨'],
      q1: '在習坎的重複風險中，你目前感覺自己處在水洊至的第一波還是已到層層疊加的深水區？',
      q2: '面對水洊至般的連續考驗，你會選擇靠有孚維心亨保持內心通暢來應對，還是先設法繞開眼前的坎？',
      q3: '哪個具體訊號會提醒你，連續的坎已經超出你能單獨承受的範圍，必須向外求援或改變策略？',
    },
    // career: 坎窞, 求小得, 行有尚
    career: {
      imgs: ['坎窞', '求小得', '行有尚'],
      q1: '你目前的職場處境，是剛踏入坎窞陷阱的第一層，還是已經察覺到坑下還有坑的結構性風險？',
      q2: '面對職場中連續的坎窞，你會選擇求小得先守住一個可掌控的小成果，還是繼續往前推進期望更大的突破？',
      q3: '職場中哪個具體跡象一旦出現，代表你正從求小得的可控階段滑向行有尚卻無力回頭的深坑？',
    },
    // love: 來之坎坎, 樽酒簋貳, 有孚維心亨
    love: {
      imgs: ['來之坎坎', '樽酒簋貳', '有孚維心亨'],
      q1: '這段感情目前是來之坎坎處處碰壁的狀態，還是只有特定面向卡住但其他層面仍能順暢溝通？',
      q2: '面對感情中的僵局，你會選擇用樽酒簋貳最樸素真誠的方式重新連結，還是等對方先軟化再回應？',
      q3: '在這段關係中，哪個具體界線一旦被跨過，會代表來之坎坎已經從摩擦升級為信任根基的斷裂？',
    },
    // money: 坎不盈, 求小得, 習坎
    money: {
      imgs: ['坎不盈', '求小得', '習坎'],
      q1: '你的財務狀態是坎不盈那樣坑尚未填滿但已趨平，還是習坎般多重財務漏洞彼此連動尚未控制？',
      q2: '面對財務上的缺口，你會選擇求小得先穩住每月基本現金流為正，還是動用儲備一次填平坎不盈？',
      q3: '財務上哪個具體數字或訊號一旦觸及，會代表風險正從可控的坎不盈轉為習坎式的結構性危機？',
    },
    // people: 習坎, 來之坎坎, 有孚維心亨
    people: {
      imgs: ['習坎', '來之坎坎', '有孚維心亨'],
      q1: '你目前的人際處境，是習坎那樣多處關係同時出現摩擦，還是來之坎坎只有一兩個特定對象特別卡？',
      q2: '面對人際關係中的多重摩擦，你會選擇用有孚維心亨的坦誠逐一化解，還是先拉開距離避免進一步惡化？',
      q3: '在人際互動中，哪個具體行為一旦出現，會代表來之坎坎已經從可修復的摩擦轉為不可逆的決裂？',
    },
    // family: 樽酒簋貳, 坎窞, 係用徽纆
    family: {
      imgs: ['樽酒簋貳', '坎窞', '係用徽纆'],
      q1: '你的家庭狀況，是還能用樽酒簋貳那樣簡單真誠的陪伴來維繫，還是已陷入坎窞般的深層矛盾？',
      q2: '面對家庭中積累的問題，你會選擇樽酒簋貳式樸素地每天陪伴修復，還是找一次徹底的談話全部攤開？',
      q3: '家庭關係中哪個具體訊號，會提醒你問題已經從可修補的坎窞滑向係用徽纆般長期綁死的僵局？',
    },
    // study: 習坎, 求小得, 行有尚
    study: {
      imgs: ['習坎', '求小得', '行有尚'],
      q1: '你目前的學習狀態，是習坎那樣多個主題因為基礎盲點連續卡關，還是只有單一科目暫時遇到瓶頸？',
      q2: '面對學習上的連續卡關，你會選擇求小得先回頭補強最根本的那個基礎觀念，還是繼續追趕預定進度？',
      q3: '學習中哪個具體訊號會提醒你，落後的累積已經超出求小得能補救的範圍，需要重新規劃整個學習路徑？',
    },
    // health: 坎窞, 水洊至, 有孚維心亨
    health: {
      imgs: ['坎窞', '水洊至', '有孚維心亨'],
      q1: '你目前的身心狀態，是水洊至那樣壓力一波接一波但還能應對，還是已陷入坎窞身體訊號開始連鎖反應？',
      q2: '面對身體連續發出的訊號，你會選擇先停下來休息並尋求專業評估，還是靠有孚維心亨的心態撐過去？',
      q3: '身體上哪個具體變化一旦出現，會是從水洊至的階段性疲勞轉為坎窞式結構性健康風險的關鍵警訊？',
    },
    // decision: 求小得, 坎不盈, 來之坎坎
    decision: {
      imgs: ['求小得', '坎不盈', '來之坎坎'],
      q1: '你面前的決策情境，是來之坎坎每個選項都自帶風險，還是只有少數路徑存在明顯的不確定性？',
      q2: '面對每條路都有坑的決策，你會選擇求小得走那條風險鏈最短的路，還是選看似收益最大但坑更深的路？',
      q3: '哪個時間點一旦錯過，會讓這個決策從坎不盈尚可調整的狀態變成來之坎坎無路可退的困境？',
    },
    // business: 行有尚, 習坎, 求小得
    business: {
      imgs: ['行有尚', '習坎', '求小得'],
      q1: '你的事業目前是習坎那樣市場風險多重疊加，還是行有尚雖然有險但前進仍有明確價值可循？',
      q2: '面對經營中的連續風險，你會選擇求小得先守住核心業務的基本運轉，還是繼續投入資源追求行有尚的成長？',
      q3: '經營上哪個具體財務指標一旦觸及，會代表風險正從求小得可控的收縮期轉為習坎式的全面危機？',
    },
    // legal: 係用徽纆, 來之坎坎, 坎窞
    legal: {
      imgs: ['係用徽纆', '來之坎坎', '坎窞'],
      q1: '你目前面對的合約或爭議，是來之坎坎多方壓力同時湧來，還是只有單一條款或程序出現坎窞般的隱患？',
      q2: '面對潛在的法律風險，你會選擇先徹底盤點所有可能形成係用徽纆的條款再行動，還是先針對眼前的問題快速回應？',
      q3: '在處理這類事務時，哪個具體動作一旦做出，會讓自己從可控的坎窞滑入係用徽纆般長期難以脫身的綁定？',
    },
    // spiritual: 有孚維心亨, 習坎, 坎不盈
    spiritual: {
      imgs: ['有孚維心亨', '習坎', '坎不盈'],
      q1: '你目前的心境，是有孚維心亨還能對自己保持真誠通暢，還是習坎般內在不安一波接一波難以平復？',
      q2: '面對內心重複的動盪，你會選擇練習有孚維心亨對自己完全坦誠面對，還是用外在忙碌來轉移注意力？',
      q3: '在自我探索的路上，哪個念頭一旦反覆出現，會提醒你正從坎不盈可接受的缺憾滑向習坎般的迷失？',
    },
  },
};

// ============================================================================
// HEX 30 離 imagery: 履錯然, 黃離元吉, 日昃之離, 突如其來如, 出涕沱若, 王用出征, 明兩作, 大人以繼明照于四方
// ============================================================================
const HEX30 = {
  hexagramId: 30,
  hexagramName: '離',
  full: '離為火',
  data: {
    // general: 明兩作, 大人以繼明照于四方, 黃離元吉
    general: {
      imgs: ['明兩作', '大人以繼明照于四方', '黃離元吉'],
      q1: '在明兩作的光明疊加階段，你目前是被看見多於主動照亮他人，還是兩者已達平衡的雙向流動？',
      q2: '面對當前的整體局勢，你會選擇以大人以繼明照于四方的格局持續照亮周圍，還是先收斂光芒專注內在積累？',
      q3: '哪個具體訊號會提醒你，黃離元吉的中道光明正在偏離，變成過度張揚或過度隱藏其中一端？',
    },
    // career: 履錯然, 黃離元吉, 王用出征
    career: {
      imgs: ['履錯然', '黃離元吉', '王用出征'],
      q1: '你的職場階段，是履錯然那樣步伐還有些混亂的摸索期，還是已到黃離元吉能穩定展現專業光芒的時期？',
      q2: '面對職涯下一步，你會選擇王用出征精準鎖定一個關鍵目標全力出擊，還是繼續黃離元吉保持中道穩定發展？',
      q3: '職場上哪個時間點一旦錯過，會讓履錯然的摸索期變成無方向的徘徊，而非通往黃離元吉的必經過程？',
    },
    // love: 突如其來如, 出涕沱若, 日昃之離
    love: {
      imgs: ['突如其來如', '出涕沱若', '日昃之離'],
      q1: '這段感情目前的狀態，是突如其來如那樣情緒激烈起伏，還是日昃之離熱度正在自然趨緩但仍穩定？',
      q2: '面對感情中的悲傷或低潮，你會選擇像出涕沱若那樣坦然流淚讓情感真實流動，還是壓抑情緒維持表面的和諧？',
      q3: '在這段關係中，哪個具體變化一旦出現，會代表日昃之離的自然趨緩正在滑向突如其來如般的崩潰？',
    },
    // money: 日昃之離, 履錯然, 大人以繼明照于四方
    money: {
      imgs: ['日昃之離', '履錯然', '大人以繼明照于四方'],
      q1: '你的財務週期，是履錯然那樣還在摸索適合的配置節奏，還是日昃之離收益已從高峰期自然進入趨緩階段？',
      q2: '面對財務週期的轉折，你會選擇像大人以繼明照于四方那樣以長遠視野重新布局，還是維持原有配置等待反彈？',
      q3: '財務上哪個具體訊號會提醒你，日昃之離的趨緩已非正常週期波動，而是需要立即調整配置的關鍵轉折？',
    },
    // people: 突如其來如, 黃離元吉, 明兩作
    people: {
      imgs: ['突如其來如', '黃離元吉', '明兩作'],
      q1: '你目前的人際狀態，是明兩作那樣互動透明彼此都能被看見，還是突如其來如般某段關係正處於激烈震盪？',
      q2: '面對人際中的衝突，你會選擇以黃離元吉的中道態度溫和處理，還是讓情緒如突如其來如般直接爆發？',
      q3: '人際互動中哪個具體行為一旦出現，會代表明兩作的透明信任正在被突如其來如的衝動所破壞？',
    },
    // family: 出涕沱若, 日昃之離, 履錯然
    family: {
      imgs: ['出涕沱若', '日昃之離', '履錯然'],
      q1: '你的家庭氣氛，是履錯然那樣正在適應新的相處節奏，還是出涕沱若正共同經歷一段悲傷或困難的時期？',
      q2: '面對家庭中的困難時刻，你會選擇像出涕沱若那樣全家一起坦然面對悲傷，還是各自消化避免彼此加重負擔？',
      q3: '家庭中哪個具體徵兆出現時，會提醒你日昃之離的自然疏遠正在變成需要主動修復的危機信號？',
    },
    // study: 大人以繼明照于四方, 履錯然, 明兩作
    study: {
      imgs: ['大人以繼明照于四方', '履錯然', '明兩作'],
      q1: '你目前的學習階段，是履錯然那樣在新領域中步伐混亂地摸索，還是明兩作已經能用自己的語言教會他人？',
      q2: '面對學習中的瓶頸，你會選擇以大人以繼明照于四方的視野先理解整體架構再回頭補細節，還是繼續死磕履錯然卡住的那個點？',
      q3: '學習上哪個具體訊號會提醒你，履錯然的摸索期已經過長，需要改變學習方法而非繼續用同樣方式硬撐？',
    },
    // health: 日昃之離, 出涕沱若, 黃離元吉
    health: {
      imgs: ['日昃之離', '出涕沱若', '黃離元吉'],
      q1: '你的身心狀態，是黃離元吉那樣保持著中道的平衡，還是日昃之離體力或精神正隨著週期自然趨於衰減？',
      q2: '面對身心狀態的下滑，你會選擇像出涕沱若那樣坦然接受低潮並給自己休息空間，還是硬撐著維持原有的生活節奏？',
      q3: '身體上哪個反覆出現的訊號，會是日昃之離從正常週期波動轉為需要正視健康問題的關鍵警示？',
    },
    // decision: 王用出征, 履錯然, 明兩作
    decision: {
      imgs: ['王用出征', '履錯然', '明兩作'],
      q1: '你面前的決策，是履錯然那樣資訊尚不完整步伐混亂，還是明兩作各方資訊已透明到足以做出清晰判斷？',
      q2: '面對這個關鍵決策，你會選擇王用出征般精準鎖定核心目標果斷行動，還是繼續等待更多資訊讓明兩作更完整？',
      q3: '哪個時間點一旦錯過，會讓履錯然的正常摸索變成錯失王用出征最佳窗口的永久遺憾？',
    },
    // business: 明兩作, 黃離元吉, 大人以繼明照于四方
    business: {
      imgs: ['明兩作', '黃離元吉', '大人以繼明照于四方'],
      q1: '你的事業目前是明兩作那樣經營透明度高客戶信任穩固，還是黃離元吉正處於中道穩定發展的黃金期？',
      q2: '面對市場變化，你會選擇以大人以繼明照于四方的長遠視野提前布局新方向，還是先守住明兩作現有的透明信任基礎？',
      q3: '經營上哪個具體訊號會提醒你，黃離元吉的中道穩定正在變成保守停滯，而非真正的持續發展？',
    },
    // legal: 履錯然, 王用出征, 突如其來如
    legal: {
      imgs: ['履錯然', '王用出征', '突如其來如'],
      q1: '你目前面對的合約或爭議，是履錯然那樣條款或程序還處於可修正的初步階段，還是已到需要王用出征果斷出手的關鍵時刻？',
      q2: '面對這個爭議，你會選擇王用出征精準鎖定核心爭點果斷處理，還是先以履錯然的謹慎步伐逐步試探對方底線？',
      q3: '在處理過程中，哪個具體動作一旦做出，會讓局勢從可控的履錯然驟然升級為突如其來如的全面對抗？',
    },
    // spiritual: 大人以繼明照于四方, 黃離元吉, 明兩作
    spiritual: {
      imgs: ['大人以繼明照于四方', '黃離元吉', '明兩作'],
      q1: '你目前的心境，是明兩作那樣向內覺察與向外被看見兩者流動順暢，還是黃離元吉正處於平穩但略顯孤獨的內省期？',
      q2: '面對心靈成長的方向，你會選擇以大人以繼明照于四方的格局將所悟分享給更多人，還是先專注在自己的內在積累？',
      q3: '在修行或內省的路上，哪個念頭一旦反覆出現，會提醒你黃離元吉的中道正偏離為自我封閉或過度向外求認可？',
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
        needsHumanReview: true,
        version: '1.8.0-wA-refl-hex29-30',
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
  // Also print per-question lengths for verification
  console.log(`[${label}] Length validation OK for ${questions.length} questions (38-105 chars).`);
  const lens = questions.map(q => q.question.length);
  console.log(`  min=${Math.min(...lens)} max=${Math.max(...lens)} avg=${(lens.reduce((a,b)=>a+b,0)/lens.length).toFixed(1)}`);
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

function validateImageryUsage(questions, label, hexName) {
  // At least 2 of 3 per group use hex imagery — check by verifying question text
  // contains at least one hex-specific imagery term from ANY of the 3 group imgs
  const groups = {};
  for (const q of questions) {
    const key = `${q.hexagramId}-${q.category}`;
    if (!groups[key]) groups[key] = { count: 0, total: 0, questions: [] };
    groups[key].total++;
    // Get all 3 imagery terms for this group (the 2nd basis items of all 3 questions)
    // We need to find sibling questions — collect their basis[1] terms
  }
  // Rebuild with proper group-level imagery detection
  const groupQuestions = {};
  for (const q of questions) {
    const key = `${q.hexagramId}-${q.category}`;
    if (!groupQuestions[key]) groupQuestions[key] = { questions: [], imgs: new Set() };
    groupQuestions[key].questions.push(q);
    groupQuestions[key].imgs.add(q.basis[1]);
  }
  const bad = [];
  for (const [key, g] of Object.entries(groupQuestions)) {
    const allImgs = Array.from(g.imgs);
    let imageryCount = 0;
    for (const q of g.questions) {
      const hasImagery = allImgs.some(term => q.question.includes(term));
      if (hasImagery) imageryCount++;
    }
    if (imageryCount < 2) {
      bad.push(`${key}: only ${imageryCount}/${g.questions.length} questions use hex imagery (need >=2)`);
    }
  }
  if (bad.length) {
    console.error(`[${label}] Imagery usage FAILED:`);
    bad.forEach(b => console.error(`  ${b}`));
    throw new Error(`${label}: imagery usage validation failed`);
  }
  console.log(`[${label}] Imagery usage OK: all ${Object.keys(groupQuestions).length} groups have >=2 hex-imagery questions.`);
}

function main() {
  const newH29 = buildQuestions(HEX29);
  const newH30 = buildQuestions(HEX30);

  const allNew = [...newH29, ...newH30];
  console.log(`Built ${allNew.length} new questions (36 hex29 + 36 hex30).\n`);

  // =========================================================================
  // MANDATORY: All 72 must pass before writeFileSync
  // =========================================================================
  console.log('--- LENGTH VALIDATION ---');
  validateLengths(newH29, 'HEX29');
  validateLengths(newH30, 'HEX30');

  console.log('\n--- TERMINAL ？ VALIDATION ---');
  validateEndsWithQuestionMark(newH29, 'HEX29');
  validateEndsWithQuestionMark(newH30, 'HEX30');

  console.log('\n--- UNIQUENESS VALIDATION ---');
  validateUniqueness(newH29, 'HEX29');
  validateUniqueness(newH30, 'HEX30');
  validateUniqueness(allNew, 'HEX29+30 combined');

  console.log('\n--- IMAGERY USAGE VALIDATION ---');
  validateImageryUsage(newH29, 'HEX29', '坎');
  validateImageryUsage(newH30, 'HEX30', '離');

  // =========================================================================
  // ALL 72 PASSED — WRITE
  // =========================================================================
  console.log('\n=== ALL 72 QUESTIONS PASSED VALIDATION. Writing data file. ===\n');

  const code = fs.readFileSync(DATA_PATH, 'utf8');
  const sandbox = { window: {} };
  vm.createContext(sandbox);
  vm.runInContext(code, sandbox, { filename: DATA_PATH });
  const data = sandbox.window.Zero1MatrixData.reflectionQuestions;
  if (!Array.isArray(data)) throw new Error('Failed to load existing reflectionQuestions array');

  console.log(`Loaded existing data: ${data.length} questions total.`);

  const before29 = data.filter((d) => d.hexagramId === 29).length;
  const before30 = data.filter((d) => d.hexagramId === 30).length;
  console.log(`Existing hex29=${before29}, hex30=${before30}`);

  const filtered = data.filter((d) => d.hexagramId !== 29 && d.hexagramId !== 30);
  const merged = [...filtered, ...newH29, ...newH30];

  // Sort by hexagramId
  merged.sort((a, b) => a.hexagramId - b.hexagramId);

  console.log(`New total: ${merged.length} (expected ${data.length - before29 - before30 + 72})`);

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

  // Re-load to double check
  const verifyCode = fs.readFileSync(DATA_PATH, 'utf8');
  const verifySandbox = { window: {} };
  vm.createContext(verifySandbox);
  vm.runInContext(verifyCode, verifySandbox, { filename: DATA_PATH });
  const verifyData = verifySandbox.window.Zero1MatrixData.reflectionQuestions;
  console.log(`Verification reload: ${verifyData.length} total questions.`);
  const v29 = verifyData.filter((d) => d.hexagramId === 29);
  const v30 = verifyData.filter((d) => d.hexagramId === 30);
  console.log(`Verification hex29=${v29.length}, hex30=${v30.length}`);

  if (v29.length !== 36 || v30.length !== 36) {
    throw new Error('Verification failed: expected 36 questions each for hex29 and hex30');
  }

  // Final quality field check
  const allVerified = [...v29, ...v30];
  for (const q of allVerified) {
    if (q.qualityLevel !== 'refined') throw new Error(`${q.id}: qualityLevel=${q.qualityLevel}`);
    if (q.reviewed !== false) throw new Error(`${q.id}: reviewed=${q.reviewed}`);
    if (q.needsHumanReview !== true) throw new Error(`${q.id}: needsHumanReview=${q.needsHumanReview}`);
  }
  console.log('Quality field verification PASSED.');

  console.log('\nwA_refl_29_30.js generation COMPLETE — 72 questions written successfully.');
}

main();