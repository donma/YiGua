'use strict';
/**
 * wC_refl_41_42_redo.js — Replace hex 41 (損) & hex 42 (益) reflection questions
 * with genuinely distinct questions. The existing entries use a 3-template
 * rotation with category name swapped (normU=3/36 for BOTH) and wrong
 * generic "兌的推力與艮的節制" language instead of actual hex imagery.
 *
 * MANDATORY before writeFileSync:
 *   1) ALL 72 questions 38-105 chars, end with ？
 *   2) normU per hex >= 32/36. Fix if fail, do NOT write until BOTH pass.
 */
const vm = require('vm');
const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, '..', 'src', 'data', 'reflectionQuestions.data.js');
const NODE_EXE = path.join(__dirname, '..', '.nodejs', 'node-v22.14.0-win-x64', 'node.exe');

// ============================================================================
// CATEGORIES
// ============================================================================
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

// ============================================================================
// HEX 41 損 (山下有澤) — Reduction, decrease, pruning for renewal
// ============================================================================
const HEX41 = {
  hexagramId: 41,
  hexagramName: '損',
  gua: '山下有澤',
  questions: {
    general: [
      '山下有澤象徵減損之後才有空間承載新水——你目前整體處境中，哪個部分其實已經過度膨脹、該主動削減釋放空間？',
      '酌損之提醒減損需要拿捏分寸而非一律砍掉——你現在面對的取捨，是該先減掉耗能最大的項目，還是先從最容易割捨的開始？',
      '弗損益之說明有些東西減到一個程度後反而不能再減——在目前的精簡過程中，哪條底線一旦被觸及就要立即停止、轉為保護？',
    ],
    career: [
      '已事遄往要求處理完舊事才能向前——你在職場上有哪個未了結的責任正在拖住你、讓新機會無法進來？',
      '三人行則損一人隱喻團隊中需精簡角色來提升效率——你的團隊現在該裁減人力還是重新分配任務而非砍人？',
      '損其疾強調速戰速決才能減少損失——你職場上有哪個拖延已久的問題再拖下去會從可處理變成無法收拾？',
    ],
    love: [
      '三人行則損一人放在感情裡提醒三角或多角關係終須取捨——你目前的感情處境是否有人在多個選項之間猶豫不決？',
      '酌損之說關係中有些付出需要節制而非一味給予——你現在該先削減對對方的過度付出，還是先削減自己對回報的期待？',
      '十朋之龜代表極珍貴的價值——你為了這段關係是否有放棄過什麼你事後才發現其實非常寶貴的東西？',
    ],
    money: [
      '酌損之講究財務上的精準削減——你目前的開支結構中，有哪筆花費是你知道該刪但一直拖延沒動手？',
      '損其疾在金錢上強調快速止血——你的投資或消費中有沒有一個正在持續虧損、你卻還抱著僥倖心態不願認賠的項目？',
      '已事遄往提醒舊債不清無法開始新計劃——你有沒有尚未結清的財務責任，正在阻擋你進入下一個階段的資金安排？',
    ],
    people: [
      '三人行則損一人暗示人多未必好辦事——你的合作關係中，有沒有一個人的存在實際上降低了整體效率？',
      '已事遄往要求先清舊帳再建新盟——你和某個合作對象之間有沒有還沒說清楚的舊帳，正在妨礙新的合作展開？',
      '山下有澤形容減損後騰出的空間能承接新的流入——你的社交圈中，哪些關係是你該放掉才能讓更有價值的人進來的？',
    ],
    family: [
      '損其疾要求對家庭中的病灶快速切除——你們家中有沒有某個長期惡性循環是全家人都知道、卻沒人願意第一個去打破的？',
      '十朋之龜代表家庭中最核心的價值——在你為了維持家庭運作而做的各種犧牲中，哪個才是真正不能放棄的底線？',
      '酌損之提醒家庭中的付出也要有節制——你對家人的付出，有沒有已經到了透支自己、對方卻未必領情的程度？',
    ],
    study: [
      '弗損益之說有些基礎不能減——你在學習上有沒有哪個核心觀念你一直想跳過去、卻發現什麼都學不扎實？',
      '已事遄往強調舊課業未完成前不宜開新章——你是該先把卡住的科目徹底搞懂再前進，還是換個方法從新角度切入？',
      '酌損之提醒學習方法也需要精簡——你目前的學習方式中，哪個環節花的時間最多卻產生的效果最少？',
    ],
    health: [
      '損其疾說身體的小毛病不該拖延——你身體上有哪個反覆出現的症狀，你一直覺得「還好」就沒去正視處理？',
      '山下有澤提醒適度減壓才能讓新能量進來——你的生活作息中，該先砍掉熬夜還是先砍掉過量的工作負擔？',
      '酌損之強調減損要有分寸不宜過度——你為了健康所做的節制，有沒有已經變成一種新的壓力和焦慮來源？',
    ],
    decision: [
      '酌損之在決策上要求精準拿捏——你眼前這個決定需要削減什麼才能讓剩下的選項變得清楚？',
      '三人行則損一人意味著選項太多反而無法決定——你現在該先刪掉最不可能的選項縮小範圍，還是該先收集更多資訊再刪？',
      '弗損益之提醒核心價值不能為了方便而刪除——你的選項中有沒有一個是你為了「省事」而打算放棄、但那其實是你最在意的？',
    ],
    business: [
      '弗損益之說明核心業務砍不得——你的商業模式中，哪些看似不賺錢的部分其實是維持客戶信任的基石？',
      '已事遄往強調處理完舊問題才能擴張——你是該先清完現有的客戶糾紛再開發新市場，還是邊清邊擴張同步進行？',
      '三人行則損一人提醒團隊規模需要精簡——你的團隊或合作夥伴中，誰的產出跟你付給他的資源最不成比例？',
    ],
    legal: [
      '損其疾要求法律事務速戰速決——你目前有沒有哪個法律程序已經拖到證據或時效都快出問題了？',
      '酌損之提醒談判中讓步要有分寸——你現在該先讓出哪個條件來促成和解，還是堅持全部訴求等到最後一刻？',
      '已事遄往說舊案未結不宜攬新案——你是否有舊的法律爭議尚未處理完、卻又急著啟動新的法律行動？',
    ],
    spiritual: [
      '山下有澤象徵內在減損後才有空間沉澱——你最近最該從生活中刪除的雜音是什麼，才能聽見自己真正在意的聲音？',
      '十朋之龜代表最珍貴的核心價值——你現在所做的各種取捨中，有哪個堅持是你無論如何都不能放手的？',
      '弗損益之說有些價值減到一定程度就不能再減——你對自己的要求，是否已經精簡到連最基本的方向感都快消失了？',
    ],
  },
};

// ============================================================================
// HEX 42 益 (風雷益) — Increase, benefit, growth, mutual strengthening
// ============================================================================
const HEX42 = {
  hexagramId: 42,
  hexagramName: '益',
  gua: '風雷益',
  questions: {
    general: [
      '風雷益的風雷相輔象徵增長來自互相配合——你目前整體處境中，哪兩個條件的配合正在讓局勢快速增長？',
      '利用為大作說增長的能量要用在大事上——你手中的增長動能現在該投入哪個最大目標才能產生槓桿效果？',
      '有孚惠心提醒增長必須以誠信和善意為根基——你的擴張過程中，有沒有哪一步是為了速度而犧牲了該有的透明？',
    ],
    career: [
      '利用為大作說職場增長要聚焦大案——你現在的工作中，哪個任務如果全力投入、最有可能帶來顯著的職涯突破？',
      '中行告公從強調增長要溝通取得授權——你現在該先說服主管支持你的方向擴大資源，還是先用現有資源做出小成果再爭取更多？',
      '益之用凶事說危機中也有增長的機會——你目前的職場困境中，哪個看似麻煩的局面其實藏著對你最有利的轉機？',
    ],
    love: [
      '有孚惠心說關係增長來自雙向的誠意——你對這段感情的付出和對方對你的付出，目前處於什麼樣的平衡狀態？',
      '十朋之龜代表關係中最珍貴的價值——這段感情中，哪個特質是它不同於你過去所有經驗、真正值得珍惜的？',
      '利用為大作提醒感情的增長要用在關鍵處——你們現在的關係能量，該用來深化彼此的信任還是用來共同規劃未來？',
    ],
    money: [
      '益之用凶事說危機中藏著財務增長的轉機——你最近的財務壓力中，有哪個困境如果解決了反而會打開新的收入機會？',
      '莫益之或擊之警告獨占利益會招來反擊——你的財務安排中，有沒有哪個決定可能會損害他人而引來後續麻煩？',
      '十朋之龜提醒資金要優先保護最有價值的部分——你的資產中，哪個是即使其他都虧損也不能動的？',
    ],
    people: [
      '中行告公從說合作增長需要公開溝通——你和合作夥伴之間，最近有沒有什麼事是你該主動告知而不是等他來問的？',
      '有孚惠心強調關係增長靠真誠而非權謀——你現在的社交策略是該多花時間經營深度關係，還是繼續廣結善緣？',
      '利用為大作提醒合作的能量要用在重大目標上——你和哪個人的合作如果全力投入、最有可能產生你一個人做不到的成果？',
    ],
    family: [
      '十朋之龜代表家庭中最不能動的價值——在你的家庭關係中，什麼是你即使付出其他代價也要守護的？',
      '利用為大作說家庭資源要用在重要處——你的時間和精力現在該優先給家裡的哪個成員或哪件事？',
      '益之用凶事說家庭危機可以轉化成緊密連結的契機——最近家裡有沒有哪件不順的事，反而讓你們比平常更團結？',
    ],
    study: [
      '風雷益的風雷相輔象徵學習需要多種方法配合——你目前是用單一學習方式還是有把閱讀和實作互相搭配？',
      '利用為大作說增長的能量該用在大主題上——你現在該深入一個主題還是廣泛涉獵多個不同領域？',
      '十朋之龜提醒學習要保護最核心的理解——你學了這麼多東西，哪個核心概念是你覺得真正內化、不會忘記的？',
    ],
    health: [
      '益之用凶事說健康危機可以變成調整的轉機——你最近的疲勞或不舒服，是不是身體在告訴你某個習慣需要改了？',
      '有孚惠心提醒對待自己的身體也要有誠信——你對自己的健康承諾（如早睡、運動）有多少是說了但從未真正做到的？',
      '風雷益象徵需要兩種力量配合——你現在的身體狀況是多休息就會好轉，還是需要休息加上主動調整飲食作息才有用？',
    ],
    decision: [
      '莫益之或擊之警告獨占決策權會招來反擊——你這個決定有沒有該諮詢的人你卻跳過了、直接自己拍板？',
      '利用為大作說決定要集中力量做最重要的事——你現在這個決定如果做對了，影響力可以擴散到哪些其他領域？',
      '中行告公從強調重大決定需要公開透明——你這個決定的理由和邏輯，能不能清楚地對所有受影響的人說明？',
    ],
    business: [
      '風雷益象徵商業增長來自多個要素同步配合——你的商業模式中，目前哪兩個環節的配合最順暢、正在帶動成長？',
      '利用為大作說增長的動能要用在最大市場機會上——你現在的資源該優先投入現有核心業務，還是用在新市場的試驗？',
      '益之用凶事說市場危機中藏著轉機——你的行業最近有沒有什麼變動是你覺得麻煩、但競爭對手可能更難應付的？',
    ],
    legal: [
      '有孚惠心說法律事務中的真誠態度本身就是一種資產——你在處理的法律爭議中，有沒有什麼是你該坦承而非隱瞞的？',
      '十朋之龜提醒法律事務中要優先保護最核心的權利——你的案件中哪個權益是你最不能失去、其他都可以協商的？',
      '中行告公從強調程序透明才能獲得支持——你的法律策略是否已經對所有相關方清楚溝通、而不是只靠私下運作？',
    ],
    spiritual: [
      '風雷益象徵內在成長來自理性與情感的配合——你最近的自我成長是偏向理性分析還是情感體悟比較多？',
      '有孚惠心說真誠地面對自己是增長的第一步——你對自己有沒有哪個真相是你一直知道、卻始終沒有勇氣去承認的？',
      '十朋之龜代表內在最珍貴不可失的價值——在你追求成長的過程中，有哪個核心信念是你絕對不能為了進步而放棄的？',
    ],
  },
};

// ============================================================================
// BUILD ENTRIES
// ============================================================================
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
        basis: [hex.hexagramName],
        qualityLevel: 'reviewed',
        reviewed: true,
        needsHumanReview: false,
        version: '1.0.0-wC-refl-41-42-redo',
        reviewedBy: 'reflection-reviewed-hex25to64',
      });
    });
  }
  return entries;
}

const newEntries41 = buildEntries(HEX41);
const newEntries42 = buildEntries(HEX42);
const allNewEntries = [...newEntries41, ...newEntries42];

console.log(`Generated ${newEntries41.length} entries for hex 41 + ${newEntries42.length} entries for hex 42 = ${allNewEntries.length} total.`);

// ============================================================================
// CHECK 1: Total count = 72
// ============================================================================
if (allNewEntries.length !== 72) {
  console.error(`COUNT ERROR: expected 72, got ${allNewEntries.length}`);
  process.exit(1);
}
console.log('CHECK 1 PASSED: 72 total entries.');

// ============================================================================
// CHECK 2: Length 38-105 and ends with ？
// ============================================================================
console.log('\n=== LENGTH & FORMAT CHECK ===');
let lengthFailures = 0;
for (const entry of allNewEntries) {
  const q = entry.question;
  const len = q.length;
  if (len < 38 || len > 105) {
    console.error(`  FAIL: ${entry.id} length=${len}`);
    lengthFailures++;
  }
  if (!q.endsWith('？')) {
    console.error(`  FAIL: ${entry.id} does not end with ？`);
    lengthFailures++;
  }
}
if (lengthFailures > 0) {
  console.error(`\n${lengthFailures} length/format failures — ABORTING. Fix questions and re-run.`);
  process.exit(1);
}
console.log(`  All ${allNewEntries.length} entries pass length (38-105) and trailing ？ checks.`);

// ============================================================================
// CHECK 3: NORMALIZED UNIQUENESS — The critical check
// ============================================================================
console.log('\n=== NORMALIZED UNIQUENESS CHECK ===');

// Imagery terms to strip (longest first) for hex 41 and 42
const IMAGERY_41 = [
  '三人行則損一人', '山下有澤', '弗損益之', '已事遄往',
  '十朋之龜', '酌損之', '損其疾', '損',
];
const IMAGERY_42 = [
  '莫益之或擊之', '益之用凶事', '中行告公從', '利用為大作',
  '有孚惠心', '風雷益', '十朋之龜', '風雷', '益',
];
const ALL_IMAGERY = [...IMAGERY_41, ...IMAGERY_42].sort((a, b) => b.length - a.length);

const COMMON_WORDS = new Set([
  '的', '你', '我', '他', '她', '是', '在', '了', '有', '不', '這', '那', '著',
  '也', '都', '就', '會', '要', '能', '可以', '一個', '一種', '一些', '什麼',
  '目前', '當前', '此刻', '選擇', '狀態', '是否', '還是', '或者', '已經',
  '自己', '對方', '這個', '那個', '需要', '應該', '如果', '因為', '所以',
  '沒有', '可能', '覺得', '認為', '知道', '了解', '理解',
  '進行', '使用', '透過', '經過', '來自', '對於', '關於', '這樣', '那樣',
  '之間', '之中', '之後', '之前', '裡面', '外面', '時候', '什麼時候',
  '多少', '如何', '為什麼', '怎麼', '哪裡', '哪個', '怎樣', '做', '讓',
  '把', '被', '從', '對', '向', '到', '給', '和', '與', '或', '而', '但',
  '卻', '才', '便', '還', '又', '再', '更', '最', '很', '太', '非常',
  '比較', '相當', '特別', '完全', '根本', '確實', '也許', '大概', '一定',
  '必須', '當然', '終於', '曾經', '正在', '將會',
  '繼續', '開始', '結束', '完成', '實現', '發生', '出現', '存在', '變化',
  '改變', '發展', '成長', '進步', '改善', '提升', '降低', '增加', '減少',
  '機會', '問題', '方式', '方法', '方向', '目標', '結果', '過程', '關係',
  '影響', '作用', '功能', '意義', '價值', '基礎', '條件', '情況', '環境',
  '資源', '能力', '經驗', '知識', '技能', '態度', '觀念', '想法', '感受',
  '情緒', '心理', '行為', '習慣', '模式', '結構', '系統', '機制', '節奏',
  '時機', '時間', '空間', '壓力', '風險', '挑戰', '困難', '限制', '障礙',
  '平衡', '穩定', '持續', '長期', '短期', '正面', '負面', '積極', '消極',
  '主動', '被動', '明顯', '清楚', '模糊', '確定', '不確定', '安全', '危險',
  '成功', '失敗', '得失', '決定', '判斷', '評估', '分析', '考慮',
  '思考', '反思', '檢視', '觀察', '注意', '重視', '忽略', '堅持', '放棄',
  '接受', '拒絕', '面對', '逃避', '追求', '避開', '投入', '退出', '進入',
  '離開', '保持', '調整', '適應', '突破', '建立', '破壞', '維護',
  '修復', '創造', '消滅', '擴大', '縮小', '深入', '快', '慢',
  '多', '少', '大', '小', '高', '低', '強', '弱', '深', '淺', '遠', '近',
  '新', '舊', '好', '壞', '對', '錯', '真', '假', '實', '虛', '內', '外',
  '上', '下', '前', '後', '左', '右', '整體', '局部', '全局', '細節',
  '核心', '邊緣', '中心', '周圍', '生命', '生活', '工作', '學習', '健康',
  '愛情', '金錢', '家庭', '朋友', '社交', '事業', '商業', '法律', '心靈',
  '精神', '身體', '心理', '靈魂', '內心', '外在', '內在',
  '現在', '嘛', '呢', '嗎', '喔', '哦', '吶', '啊', '吧', '呀',
  '是否還', '究竟是', '而且', '因此', '但是', '然後', '所以',
]);

function normalize(str) {
  let s = str;
  // strip hex names and gua names
  s = s.split('損').join('').split('益').join('').split('山下有澤').join('').split('風雷益').join('');
  // strip imagery terms (longest first)
  for (const t of ALL_IMAGERY) s = s.split(t).join('');
  // strip category names
  for (const c of Object.values(CATEGORY_NAMES)) s = s.split(c).join('');
  // strip punctuation and whitespace
  s = s.replace(/[，。？！、：；「」『』（）…—\-—\s]/g, '');
  // strip common words
  const segments = [];
  let current = '';
  for (const ch of s) {
    current += ch;
    let matched = false;
    for (const cw of COMMON_WORDS) {
      if (current.endsWith(cw) && current.length >= cw.length) {
        const before = current.slice(0, -cw.length);
        if (before) segments.push(before);
        current = '';
        matched = true;
        break;
      }
    }
    if (matched) continue;
  }
  if (current) segments.push(current);
  return segments.join('');
}

function checkUniqueness(entries, hexLabel) {
  const normed = entries.map(e => ({ id: e.id, norm: normalize(e.question) }));
  const seen = new Map();
  normed.forEach(({ id, norm }) => {
    if (!seen.has(norm)) seen.set(norm, []);
    seen.get(norm).push(id);
  });
  let uniqueCount = 0;
  const dupGroups = [];
  for (const [norm, ids] of seen.entries()) {
    if (ids.length === 1) {
      uniqueCount++;
    } else {
      dupGroups.push(ids);
    }
  }
  return { total: entries.length, uniqueCount, dupGroups };
}

const uniq41 = checkUniqueness(newEntries41, 'Hex41');
const uniq42 = checkUniqueness(newEntries42, 'Hex42');
const uniqBoth = checkUniqueness(allNewEntries, 'Hex41+42');

console.log(`  Hex 41 (損) normU: ${uniq41.uniqueCount}/${uniq41.total}`);
if (uniq41.dupGroups.length > 0) {
  console.log('  Hex 41 duplicate groups:');
  uniq41.dupGroups.forEach(g => console.log('    ' + JSON.stringify(g)));
}
console.log(`  Hex 42 (益) normU: ${uniq42.uniqueCount}/${uniq42.total}`);
if (uniq42.dupGroups.length > 0) {
  console.log('  Hex 42 duplicate groups:');
  uniq42.dupGroups.forEach(g => console.log('    ' + JSON.stringify(g)));
}
console.log(`  Combined normU: ${uniqBoth.uniqueCount}/${uniqBoth.total}`);
if (uniqBoth.dupGroups.length > 0) {
  console.log('  Combined duplicate groups:');
  uniqBoth.dupGroups.forEach(g => console.log('    ' + JSON.stringify(g)));
}

const MIN_UNIQUE = 32;
let uniquenessFailed = false;
if (uniq41.uniqueCount < MIN_UNIQUE) {
  console.error(`  *** UNIQUENESS FAILED for hex41: ${uniq41.uniqueCount}/36 < ${MIN_UNIQUE}/36 ***`);
  uniquenessFailed = true;
}
if (uniq42.uniqueCount < MIN_UNIQUE) {
  console.error(`  *** UNIQUENESS FAILED for hex42: ${uniq42.uniqueCount}/36 < ${MIN_UNIQUE}/36 ***`);
  uniquenessFailed = true;
}
if (uniqBoth.uniqueCount < 68) {
  console.error(`  *** CROSS-HEX UNIQUENESS FAILED: ${uniqBoth.uniqueCount}/72 < 68/72 ***`);
  uniquenessFailed = true;
}

if (uniquenessFailed) {
  console.error('\nNOT WRITING FILE — fix questions and re-run.');
  process.exit(1);
}
console.log('  Normalized uniqueness PASSED for all checks.');

// ============================================================================
// LOAD EXISTING DATA & MERGE
// ============================================================================
console.log('\n=== LOADING EXISTING DATA ===');
const rawCode = fs.readFileSync(DATA_FILE, 'utf8');
const sandbox = { window: {} };
vm.createContext(sandbox);
vm.runInContext(rawCode, sandbox);
const existingData = sandbox.window.Zero1MatrixData.reflectionQuestions;

if (!Array.isArray(existingData)) {
  throw new Error('Failed to load existing reflectionQuestions array');
}

console.log(`  Loaded existing data: ${existingData.length} questions total.`);
const before41 = existingData.filter(e => e.hexagramId === 41).length;
const before42 = existingData.filter(e => e.hexagramId === 42).length;
console.log(`  Existing hex41=${before41}, hex42=${before42}`);

const filtered = existingData.filter(e => e.hexagramId !== 41 && e.hexagramId !== 42);
const merged = [...filtered, ...allNewEntries];

merged.sort((a, b) => a.hexagramId - b.hexagramId);

console.log(`  New total: ${merged.length} (removed ${before41 + before42}, added 72)`);

// ============================================================================
// WRITE FILE
// ============================================================================
const output =
  "window.Zero1MatrixData = window.Zero1MatrixData || {};\n" +
  "window.Zero1MatrixData.reflectionQuestions = " + JSON.stringify(merged) + ";\n";

fs.writeFileSync(DATA_FILE, output, 'utf8');
console.log(`\n=== WRITTEN ===`);
console.log(`  ${merged.length} total entries written to ${DATA_FILE}`);

// ============================================================================
// VERIFY with node --check
// ============================================================================
const { execFileSync } = require('child_process');
try {
  execFileSync(NODE_EXE, ['--check', DATA_FILE], { stdio: 'pipe' });
  console.log('  node --check PASSED.');
} catch (e) {
  console.error('  node --check FAILED');
  console.error(e.stderr ? e.stderr.toString() : '');
  process.exit(1);
}

// ============================================================================
// VERIFY reload
// ============================================================================
const verifyCode = fs.readFileSync(DATA_FILE, 'utf8');
const verifySandbox = { window: {} };
vm.createContext(verifySandbox);
vm.runInContext(verifyCode, verifySandbox);
const verifyData = verifySandbox.window.Zero1MatrixData.reflectionQuestions;
console.log(`  Verification reload: ${verifyData.length} total questions.`);
const v41 = verifyData.filter(e => e.hexagramId === 41);
const v42 = verifyData.filter(e => e.hexagramId === 42);
console.log(`  Verification hex41=${v41.length}, hex42=${v42.length}`);

if (v41.length !== 36 || v42.length !== 36) {
  throw new Error('Verification failed: expected 36 questions each for hex41 and hex42');
}

console.log('\n=== wC_refl_41_42_redo COMPLETE ===');
console.log(`  Hex 41 normU: ${uniq41.uniqueCount}/36`);
console.log(`  Hex 42 normU: ${uniq42.uniqueCount}/36`);
console.log(`  Combined normU: ${uniqBoth.uniqueCount}/72`);