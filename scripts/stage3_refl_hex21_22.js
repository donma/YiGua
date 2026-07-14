'use strict';
/**
 * Stage 3 reflection question refresh for Hex 21 (噬嗑) and Hex 22 (賁).
 * Generates 12 categories x 3 questions x 2 hexagrams = 72 unique, hex+category
 * specific reflection questions, replacing the existing entries in
 * src/data/reflectionQuestions.data.js.
 */
const vm = require('vm');
const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, '..', 'src', 'data', 'reflectionQuestions.data.js');

// ---------------------------------------------------------------------------
// Category display names (matches existing data file conventions)
// ---------------------------------------------------------------------------
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

// ---------------------------------------------------------------------------
// Hex 21 噬嗑 — content
// Q1 = 現況辨識 (imagery A) / Q2 = 行動與選擇 (imagery B) / Q3 = 風險與界線 (imagery C)
// ---------------------------------------------------------------------------
const HEX21 = {
  hexagramId: 21,
  hexagramName: '噬嗑',
  gua: '火雷噬嗑',
  questions: {
    general: [
      '從亨利用獄來看，你目前面對的阻礙是尚未釐清責任，還是已經進入需要正式裁決的階段？',
      '雷電噬嗑要求先看清事實再動作，你現在是該立刻執行既定規則，還是先多花時間蒐集證據？',
      '先王以明罰敕法提醒賞罰要有分寸，什麼跡象顯示你正在把一個小問題拖成需要重罰的大麻煩？',
    ],
    career: [
      '屨校滅趾提醒小懲能防止重犯，你目前的職場處境屬於初犯輕罰，還是已經累積成難以修復的硬傷？',
      '面對職場中最核心的那個障礙，噬乾胏得金矢暗示的堅持啃咬，跟直接繞過難題比起來哪個更適合你？',
      '何校滅耳警示的是拖到最後才受重罰，你在職場上有哪個警訊已經被你選擇性忽略了很久？',
    ],
    love: [
      '噬膚滅鼻描述的是處理表層問題相對容易見效，你和對方目前卡住的究竟是淺層還是深層問題？',
      '噬腊肉遇毒提醒關係裡可能藏著沒被發現的毒素，你願意先把話攤開講清楚，還是繼續先觀察？',
      '屨校滅趾的小懲分寸感放進感情裡，什麼樣的小摩擦如果現在不處理，日後會演變成難解的裂痕？',
    ],
    money: [
      '噬乾肉得黃金顯示財務上正在通過一段考驗，你目前的財務狀態具體走到了哪個階段？',
      '噬乾胏得金矢需要耐心咬開硬骨頭，你會選擇繼續啃這筆難處理的資產，還是評估後先放手？',
      '噬腊肉遇毒警示投入前要先驗證風險，你有沒有漏掉哪個看似安全、實則藏著毒性的環節？',
    ],
    people: [
      '噬膚滅鼻說明處理人際摩擦時，表面問題通常比想像中容易解開，你現在究竟卡在哪一層？',
      '何校滅耳警示長期忽視衝突終將招致更重的後果，你和對方之間拖延最久、最該解決的是什麼？',
      '屨校滅趾的小懲大戒放進人際關係裡，什麼樣的界線一旦被突破，就很難再重新拉回來？',
    ],
    family: [
      '噬腊肉遇毒提醒家庭裡可能存在未被察覺的舊傷，你目前感受到的隱藏癥結究竟是什麼？',
      '屨校滅趾建議及早處理小摩擦，你家中哪個看似微小的習慣，其實已經悄悄累積很久了？',
      '噬膚滅鼻顯示有些家庭問題其實不難解決，是什麼原因讓你一直沒有主動去談開這件事？',
    ],
    study: [
      '屨校滅趾提醒及早糾正小錯誤，你目前的學習卡關究竟是基礎不穩，還是方法本身出了問題？',
      '噬乾胏得金矢需要耐心啃下硬骨頭教材，你會選擇繼續苦讀鑽研，還是換個方式尋求突破？',
      '何校滅耳警示拖延到最後會付出更大的代價，哪個一直沒解決的弱點正在悄悄累積風險？',
    ],
    health: [
      '噬膚滅鼻顯示身體發出的訊號目前還算表淺，你感覺自己現在的狀況是輕微還是已經深層？',
      '噬腊肉遇毒提醒要留意隱藏在習以為常裡的風險，你有沒有忽略某個長期存在的小狀況？',
      '亨利用獄講的是該用規則約束自己，什麼樣的生活習慣是你一直該處理、卻始終沒有處理的？',
    ],
    decision: [
      '噬乾胏得金矢暗示這個決定需要耐心慢慢咬穿阻力，你現在面對的核心障礙具體是什麼？',
      '在噬乾肉得黃金與噬腊肉遇毒之間，你會選擇穩健持續推進，還是先徹底排查潛在的風險？',
      '什麼樣的訊號會讓你判斷這個決策已經到了必須立即裁定、不能再繼續拖延的時間點？',
    ],
    business: [
      '噬乾肉得黃金顯示目前的經營考驗正逐漸見到成果，你的事業具體走到哪個關鍵階段？',
      '噬乾胏得金矢代表堅持啃下難題，跟雷電噬嗑講求果斷裁決比起來，你更傾向選擇哪一種做法？',
      '什麼樣的違規或漏洞一旦被放任不管，可能會讓整個經營結構承受難以挽回的長期代價？',
    ],
    legal: [
      '亨利用獄指出目前的爭議適合透過明確規則來妥善處理，你的處境具體走到了哪個階段？',
      '何校滅耳警示拖延處理只會招致更重的後果，你目前最不能再繼續拖延的一件事究竟是什麼？',
      '先王以明罰敕法強調規則要清楚公正，什麼樣的界線一旦被跨越，就再也難以回頭挽救？',
    ],
    spiritual: [
      '何校滅耳提醒長期不聽勸最終會受到沉重的教訓，你內心哪個聲音一直被你選擇性忽視？',
      '噬腊肉遇毒暗示修行路上可能藏著看不見的執念，你願意先誠實面對，還是繼續先觀察？',
      '雷電噬嗑講的是果斷斬斷糾結，什麼樣的內在阻礙如果現在不處理，會越拖越沉重難解？',
    ],
  },
};

// ---------------------------------------------------------------------------
// Hex 22 賁 — content
// ---------------------------------------------------------------------------
const HEX22 = {
  hexagramId: 22,
  hexagramName: '賁',
  gua: '山火賁',
  questions: {
    general: [
      '亨小利有攸往顯示小處著手也能持續前進，你目前的狀態究竟適合修飾形式，還是先充實內容？',
      '山下有火照亮外在樣貌，你現在該把心力放在調整表達方式，還是回到本質先把根基打好？',
      '白賁無咎提醒最後仍要回歸樸實，什麼樣的過度修飾正在悄悄掩蓋你真正需要面對的問題？',
    ],
    career: [
      '賁其趾說的是整理自身行動不必依賴華麗工具，你目前的職涯基礎究竟打得夠不夠扎實？',
      '在賁于丘園與束帛戔戔之間，你會選擇低調深耕現有位置，還是投入更多資源包裝形象？',
      '什麼樣的職場門面如果撐得太用力，反而會讓你長期忽略真正該持續累積的實力與經驗？',
    ],
    love: [
      '賁如濡如顯示關係目前帶著滋潤有光澤的樣貌，你們兩人現在具體處在哪個相處階段？',
      '白馬翰如象徵誠意奔馳而來，你會選擇主動表達心意，還是繼續等對方先跨出那一步？',
      '賁其須提醒修飾附屬細節相對容易，什麼樣的表面用心正悄悄掩蓋你們沒有談開的核心？',
    ],
    money: [
      '束帛戔戔提醒即使用有限資源也能完成合宜呈現，你目前的財務規劃究竟是否量力而為？',
      '在賁于丘園與白賁無咎之間，你會選擇投資讓資產更有價值，還是保持簡單樸實的節奏？',
      '什麼樣的花費其實只是為了撐門面而非真正實際需要，正悄悄侵蝕你原本穩健的財務結構？',
    ],
    people: [
      '賁其須說明修飾附屬部分相對容易，你和對方之間目前實際處理的究竟是表面還是核心？',
      '白馬翰如象徵誠意奔赴而來，你會選擇主動釋出善意，還是先觀察對方接下來的態度？',
      '賁如濡如提醒表面融洽未必代表深層信任，什麼樣的跡象顯示你們的關係只是暫時的光澤？',
    ],
    family: [
      '賁其趾顯示整理自身行動不必依賴外在裝飾，你家中哪個基礎習慣目前最值得優先顧好？',
      '在賁于丘園與賁其須之間，你會選擇投入資源改善居家環境，還是先修補關係裡的細節？',
      '什麼樣的家庭排場如果做得太用力，反而會讓真正該溝通的話題一直被擱在一旁不談？',
    ],
    study: [
      '賁其趾提醒整理基本功不必依賴花俏方法，你目前的學習基礎究竟打得夠不夠踏實穩固？',
      '白賁無咎顯示回到樸素扎實最終無咎，你會選擇追求漂亮的技巧，還是先練好根本功夫？',
      '賁其須說明修飾枝節容易被誤認為進步，什麼樣的表面用功正悄悄掩蓋你的真實弱點？',
    ],
    health: [
      '白賁無咎提醒回到簡單樸實的作息最為穩妥，你目前的生活習慣是否已經悄悄過度包裝？',
      '山下有火照亮外在氣色，你會選擇調整外顯的作息表象，還是先處理更根本的體質問題？',
      '賁如濡如顯示狀態暫時看起來滋潤有光，什麼樣的具體徵兆提醒你這只是表面而非根本？',
    ],
    decision: [
      '在賁于丘園與束帛戔戔之間，你會選擇投入更多資源修飾方案，還是保持簡潔精省的做法？',
      '白賁無咎提醒最終仍要回歸樸實判斷，這個決定現在究竟是被形式還是本質牽著走的？',
      '什麼樣的表面包裝一旦占用太多資源，會讓你忽略決策裡真正該衡量的核心價值所在？',
    ],
    business: [
      '白馬翰如象徵誠意與行動力奔赴而來，你的事業目前該加強對外形象，還是內部實力？',
      '在賁于丘園與束帛戔戔之間，你會選擇低調深耕核心優勢，還是投入包裝爭取更多曝光？',
      '什麼樣的品牌門面一旦與實際內容嚴重脫節，會讓客戶對你的信任長期逐漸悄悄流失掉？',
    ],
    legal: [
      '君子以明庶政無敢折獄提醒審慎裁斷不可輕率，你目前的處境具體需要哪種謹慎態度？',
      '白賁無咎顯示回歸簡單誠實的說法最為穩妥，你會選擇如實陳述，還是繼續修飾包裝？',
      '賁其趾提醒基礎程序若沒事先打好，什麼樣的疏漏日後會演變成難以收拾的長期爭議？',
    ],
    spiritual: [
      '白賁無咎提醒修行最終要回到樸素無華的本心，你目前修的究竟是形式還是真正的內在？',
      '賁其趾顯示回歸最基本的自我整理不需外求，你願意先簡化生活方式，還是先簡化念頭？',
      '山下有火照見內在也照見表象，什麼樣的自我形象包袱正阻礙你看清真實內心的樣貌？',
    ],
  },
};

// ---------------------------------------------------------------------------
// Build question objects
// ---------------------------------------------------------------------------
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
        reviewedBy: 'reflection-gold-review-stage3',
        reviewedAt: '2026-07-13',
        needsHumanReview: true,
        version: '1.7.2-stage3-refl',
      });
    });
  }
  return entries;
}

const newEntries = [...buildEntries(HEX21), ...buildEntries(HEX22)];

// ---------------------------------------------------------------------------
// Mandatory length assertion: 38-105 chars, ends with '？'
// ---------------------------------------------------------------------------
const lengthFailures = [];
for (const entry of newEntries) {
  const q = entry.question;
  const len = q.length;
  if (len < 38 || len > 105) {
    lengthFailures.push(`${entry.id}: length=${len} :: ${q}`);
  }
  if (!q.endsWith('？')) {
    lengthFailures.push(`${entry.id}: does not end with ？ :: ${q}`);
  }
}
if (lengthFailures.length > 0) {
  console.error('LENGTH/FORMAT ASSERTION FAILED:');
  lengthFailures.forEach((f) => console.error('  ' + f));
  process.exit(1);
}
console.log(`Length assertion passed for all ${newEntries.length} questions (38-105 chars).`);

// ---------------------------------------------------------------------------
// Uniqueness check (normalized)
// ---------------------------------------------------------------------------
function normalize(s) {
  return s.replace(/[，。？！、\s]/g, '');
}
const seen = new Set();
let dupCount = 0;
for (const entry of newEntries) {
  const norm = normalize(entry.question);
  if (seen.has(norm)) {
    dupCount++;
    console.error(`Duplicate (normalized) found for ${entry.id}`);
  }
  seen.add(norm);
}
if (dupCount > 0) {
  console.error(`Uniqueness check failed: ${dupCount} duplicates.`);
  process.exit(1);
}
console.log(`Uniqueness check passed: ${seen.size}/${newEntries.length} unique.`);

// ---------------------------------------------------------------------------
// Load existing data file via vm, replace hex 21/22 entries, write back
// ---------------------------------------------------------------------------
const code = fs.readFileSync(DATA_FILE, 'utf8');
const sandbox = { window: {} };
vm.createContext(sandbox);
vm.runInContext(code, sandbox);
const existing = sandbox.window.Zero1MatrixData.reflectionQuestions;

const filtered = existing.filter((e) => e.hexagramId !== 21 && e.hexagramId !== 22);

// Insert new entries at the position of the first removed hex21/hex22 entry
// to preserve overall ordering as much as possible.
let insertIndex = existing.findIndex((e) => e.hexagramId === 21);
if (insertIndex === -1) insertIndex = filtered.length;
else {
  // recompute insertIndex relative to filtered array
  let countBefore = 0;
  for (let i = 0; i < existing.length; i++) {
    if (existing[i].hexagramId === 21) break;
    if (existing[i].hexagramId !== 21 && existing[i].hexagramId !== 22) countBefore++;
  }
  insertIndex = countBefore;
}

const finalData = [...filtered.slice(0, insertIndex), ...newEntries, ...filtered.slice(insertIndex)];

console.log(`Original total: ${existing.length}, removed hex21/22: ${existing.length - filtered.length}, new entries: ${newEntries.length}, final total: ${finalData.length}`);

const output =
  "window.Zero1MatrixData = window.Zero1MatrixData || {};\n" +
  "window.Zero1MatrixData.reflectionQuestions = " + JSON.stringify(finalData) + ";\n";

fs.writeFileSync(DATA_FILE, output, { encoding: 'utf8' });
console.log(`Written to ${DATA_FILE}`);
