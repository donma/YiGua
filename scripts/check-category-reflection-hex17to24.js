const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const root = process.argv[2] ? path.resolve(process.argv[2]) : path.resolve(__dirname, '..');
const dataDir = path.join(root, 'src', 'data');
const hashes = JSON.parse(fs.readFileSync(path.join(root, 'scripts', 'r1724_hashes.json'), 'utf8'));

// ========== NORMALIZATION ==========
const hexNames = ['隨', '蠱', '臨', '觀', '噬嗑', '賁', '剝', '復'];
const catNames = ['一般', '工作事業', '感情關係', '財務金錢', '人際合作', '家庭親人', '學習考試', '身心狀態', '重大決策', '創業經營', '官非合約', '心境修行'];
const imagery = [
    '元亨利貞無咎', '官有渝貞吉', '出門交有功', '係小子失丈夫', '係丈夫失小子', '隨有求得', '隨有獲貞凶', '孚于嘉吉', '拘係之乃從維之', '王用亨于西山', '澤中有雷', '君子以嚮晦入宴息',
    '元亨利涉大川', '先甲三日後甲三日', '幹父之蠱用譽', '幹父之蠱小有悔', '幹父之蠱', '幹母之蠱', '裕父之蠱', '不事王侯高尚其事', '山下有風', '君子以振民育德',
    '元亨利貞', '至于八月有凶', '咸臨吉無不利', '咸臨', '甘臨', '至臨', '知臨', '敦臨', '澤上有地', '君子以教思無窮容保民無疆',
    '盥而不薦有孚顒若', '童觀', '闚觀', '觀我生君子無咎', '觀我生', '觀國之光', '觀其生', '風行地上', '先王以省方觀民設教',
    '亨利用獄', '屨校滅趾', '噬膚滅鼻', '噬腊肉遇毒', '噬乾胏得金矢', '噬乾肉得黃金', '何校滅耳', '雷電噬嗑', '先王以明罰敕法',
    '亨小利有攸往', '賁其趾', '賁其須', '賁如濡如', '白馬翰如', '賁于丘園', '束帛戔戔', '白賁無咎', '山下有火', '君子以明庶政無敢折獄',
    '不利有攸往', '剝床以足', '剝床以辨', '剝之無咎', '剝床以膚', '貫魚以宮人寵', '碩果不食', '君子得輿小人剝廬', '山附于地', '上以厚下安宅',
    '亨', '出入無疾', '朋來無咎', '反復其道七日來復', '不遠復', '休復', '頻復', '中行獨復', '敦復', '迷復', '雷在地中', '先王以至日閉關商旅不行',
];
const commonTerms = ['建議', '可以', '可先', '應該', '必須', '風險', '隱患', '需要注意', '危險', '目前', '現在', '眼前', '當前', '階段', '時期', '過程', '調整', '改變', '修正', '最重要', '當下', '最近'];

function norm(text) {
    let t = String(text || '');
    for (const h of hexNames) t = t.replace(new RegExp(h, 'g'), '');
    for (const i of imagery) t = t.replace(new RegExp(i.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), '');
    for (const c of catNames) t = t.replace(new RegExp(c, 'g'), '');
    for (const ct of commonTerms) t = t.replace(new RegExp(ct, 'g'), '');
    t = t.replace(/[\d]+|[，。、；：！？""''「」『』／\s]/g, '');
    return t;
}

// ========== LOAD DATA ==========
function loadModule(filePath) {
    let code = fs.readFileSync(filePath, 'utf8');
    const sandbox = { window: { Zero1MatrixData: {} }, console };
    require('vm').createContext(sandbox);
    require('vm').runInContext(code, sandbox);
    return sandbox.window.Zero1MatrixData;
}

const cat = loadModule(path.join(dataDir, 'categoryInterpretations.data.js'));
const refl = loadModule(path.join(dataDir, 'reflectionQuestions.data.js'));
const hex = loadModule(path.join(dataDir, 'hexagrams.data.js'));

const catArr = cat.categoryInterpretations;
const reflArr = refl.reflectionQuestions;
const hexArr = hex.hexagrams;

// ========== CATEGORY CHECKS ==========
const ci1724 = catArr.filter(x => x.hexagramId >= 17 && x.hexagramId <= 24);
console.log('=== CATEGORY HEX 17-24 ===');
console.log('total=' + ci1724.length + ' unique_ids=' + new Set(ci1724.map(x => x.id)).size + ' gold=' + ci1724.filter(x => x.qualityLevel === 'gold').length + ' reviewed=' + ci1724.filter(x => x.reviewed === true).length + ' needsHumanReview_false=' + ci1724.filter(x => x.needsHumanReview === false).length);

const th = {
    m: ci1724.filter(x => (x.meaning || '').length >= 110).length,
    a: ci1724.filter(x => (x.advice || '').length >= 90).length,
    w: ci1724.filter(x => (x.warning || '').length >= 70).length,
    t: ci1724.filter(x => (x.timing || '').length >= 55).length,
    b: ci1724.filter(x => x.basis && x.basis.length >= 4).length,
};
console.log('m>=110:' + th.m + '/96 a>=90:' + th.a + '/96 w>=70:' + th.w + '/96 t>=55:' + th.t + '/96 b>=4:' + th.b + '/96');

// Per-hex 12-cat normU
console.log('\n--- Per-hex normalized uniqueness ---');
for (let hid = 17; hid <= 24; hid++) {
    const arr = ci1724.filter(x => x.hexagramId === hid);
    const mu = new Set(arr.map(x => norm(x.meaning))).size;
    const au = new Set(arr.map(x => norm(x.advice))).size;
    const wu = new Set(arr.map(x => norm(x.warning))).size;
    const tu = new Set(arr.map(x => norm(x.timing))).size;
    console.log('hex ' + hid + ': meaning=' + mu + ' advice=' + au + ' warning=' + wu + ' timing=' + tu + ' ' + (mu === 12 && au >= 11 && wu >= 10 && tu >= 10 ? 'PASS' : 'FAIL'));
}

// Batch normU
const fmu = new Set(ci1724.map(x => norm(x.meaning))).size;
const fau = new Set(ci1724.map(x => norm(x.advice))).size;
const fwu = new Set(ci1724.map(x => norm(x.warning))).size;
const ftu = new Set(ci1724.map(x => norm(x.timing))).size;
console.log('\nfull-batch normU: meaning=' + fmu + ' advice=' + fau + ' warning=' + fwu + ' timing=' + ftu + ' ' + (fmu >= 92 && fau >= 88 && fwu >= 84 && ftu >= 84 ? 'PASS' : 'FAIL'));

// Dup sentences (excluding safety statements)
const SAFE = ['本欄不做醫療診斷', '本欄不做獲利保證', '本欄不做法律結果判定'];
function splitSentences(text) {
    return (text || '').split(/[。！？；!?;]/).map(s => s.trim()).filter(s => s.length >= 8 && !SAFE.includes(s));
}
const sentMap = {};
for (const x of ci1724) {
    for (const f of ['meaning', 'advice', 'warning', 'timing']) {
        for (const s of splitSentences(x[f] || '')) {
            if (!sentMap[s]) sentMap[s] = { c: 0 };
            sentMap[s].c++;
        }
    }
}
const dups = Object.entries(sentMap).filter(([, v]) => v.c > 2);
console.log('duplicate full sentences >2 (excluding safety statements): ' + dups.length + ' ' + (dups.length === 0 ? 'PASS' : 'FAIL'));

// Skeleton scan
const allTxtCat = ci1724.map(x => (x.meaning || '') + (x.advice || '') + (x.warning || '')).join(' ');
const sk = ['上卦帶來推力，下卦帶來節制', '兩股力量需要取得平衡', '保持彈性並等待時機', '不要太快，也不要太慢', '先觀察，再決定', '目前仍有調整空間', '這是一個需要耐心的階段', '每個階段都有不同挑戰', '最基礎的準備最重要', '此分類最常見的誤判是過度解讀單一面向'];
let skh = 0;
for (const s of sk) {
    const escaped = s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const matches = allTxtCat.match(new RegExp(escaped, 'g'));
    if (matches) skh += matches.length;
}
console.log('template skeleton overflow: ' + skh + ' ' + (skh <= 4 ? 'PASS' : 'FAIL'));

// Forbidden
const forbiddenWords = ['必定成功', '保證獲利', '官司一定贏', '停止就醫', '必有災禍'];
let fh = 0;
for (const fw of forbiddenWords) {
    if (JSON.stringify(ci1724).includes(fw)) fh++;
}
console.log('forbidden hits: ' + fh + ' ' + (fh === 0 ? 'PASS' : 'FAIL'));

// ========== REFLECTION CHECKS ==========
const rf1724 = reflArr.filter(x => x.hexagramId >= 17 && x.hexagramId <= 24);
console.log('\n=== REFLECTION HEX 17-24 ===');
console.log('total=' + rf1724.length + ' unique_ids=' + new Set(rf1724.map(x => x.id)).size + ' reviewed=' + rf1724.filter(x => x.reviewed === true).length + ' qualityLevel_reviewed=' + rf1724.filter(x => x.qualityLevel === 'reviewed').length + ' needsHumanReview_false=' + rf1724.filter(x => x.needsHumanReview === false).length);

const grps = {};
for (const x of rf1724) {
    const k = x.hexagramId + '-' + x.category;
    if (!grps[k]) grps[k] = [];
    grps[k].push(x);
}
const grpOk = Object.values(grps).filter(x => x.length === 3).length;
let grpFail = 0;
for (const a of Object.values(grps)) {
    if (new Set(a.map(x => norm(x.question))).size < 3) grpFail++;
}
const qu = new Set(rf1724.map(x => norm(x.question))).size;
const qm = rf1724.filter(x => (x.question || '').endsWith('？') || (x.question || '').endsWith('?')).length;
const qLen = rf1724.filter(x => (x.question || '').length >= 38 && (x.question || '').length <= 105).length;
console.log('3-question groups complete: ' + grpOk + '/96, group fail: ' + grpFail);
console.log('length 38-105: ' + qLen + '/288, question marks: ' + qm + '/288');
console.log('full-batch normalized unique: ' + qu + '/288 ' + (qu >= 260 ? 'PASS' : 'FAIL'));

console.log('\n--- Per-hex normalized unique ---');
for (let hid = 17; hid <= 24; hid++) {
    const arr = rf1724.filter(x => x.hexagramId === hid);
    const u = new Set(arr.map(x => norm(x.question))).size;
    console.log('hex ' + hid + ': normU=' + u + '/36 ' + (u >= 32 ? 'PASS' : 'FAIL'));
}

// Dup full questions
const qDups = rf1724.map(x => x.question).filter((q, i, arr) => arr.indexOf(q) !== i).length;
console.log('\nduplicate full questions: ' + qDups + ' ' + (qDups === 0 ? 'PASS' : 'FAIL'));

// Reflection skeleton scan
const allTxtRefl = rf1724.map(x => x.question || '').join('\n');
const rfSk = [
    '你比較接近', '你最需要做出的調整', '哪條界線尚未準備好跨越', '現在哪一股力量更明顯',
    '下一步要前進還是停下', '最容易忽略的風險', '你是否已經準備好', '你可以如何調整',
    '目前最需要注意什麼', '什麼選擇最適合你'
];
let rfSkh = 0;
for (const s of rfSk) {
    const escaped = s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const matches = allTxtRefl.match(new RegExp(escaped, 'g'));
    if (matches) rfSkh += matches.length;
}
console.log('skeleton overflow: ' + rfSkh + ' ' + (rfSkh <= 4 ? 'PASS' : 'FAIL'));

// Forbidden reflection
const rfForbidden = ['必定成功', '保證獲利', '官司一定贏', '停止就醫', '必有災禍', '應立即'];
let rfFh = 0;
for (const w of rfForbidden) if (allTxtRefl.includes(w)) rfFh++;
console.log('forbidden hits: ' + rfFh + ' ' + (rfFh === 0 ? 'PASS' : 'FAIL'));

// ========== HASH CHECKS ==========
function hashSection(data) { return crypto.createHash('sha256').update(JSON.stringify(data)).digest('hex'); }
function hashFile(filePath) { return crypto.createHash('sha256').update(fs.readFileSync(filePath, 'utf8')).digest('hex'); }

console.log('\n=== PROTECTED HASHES ===');
let hOk = true;
const check = (name, expected, actual) => {
    const pass = expected === actual;
    console.log((pass ? 'OK' : 'CHANGED') + ': ' + name);
    if (!pass) hOk = false;
};

check('Category hex 1-16', hashes.cat_h1to16, hashSection(catArr.filter(x => x.hexagramId >= 1 && x.hexagramId <= 16)));
check('Category hex 25-64', hashes.cat_h25to64, hashSection(catArr.filter(x => x.hexagramId >= 25 && x.hexagramId <= 64)));
check('Reflection hex 1-16', hashes.refl_h1to16, hashSection(reflArr.filter(x => x.hexagramId >= 1 && x.hexagramId <= 16)));
check('Reflection hex 25-64', hashes.refl_h25to64, hashSection(reflArr.filter(x => x.hexagramId >= 25 && x.hexagramId <= 64)));
check('hexagrams', hashes.hexagrams, hashSection(hexArr));
check('lines', hashes.lines_file, hashFile(path.join(dataDir, 'lines.data.js')));
check('pairInterpretations', hashes.pairInterpretations_file, hashFile(path.join(dataDir, 'pairInterpretations.data.js')));
check('lineCategoryInterpretations', hashes.lineCategoryInterpretations_file, hashFile(path.join(dataDir, 'lineCategoryInterpretations.data.js')));
check('actionSuggestions', hashes.actionSuggestions_file, hashFile(path.join(dataDir, 'actionSuggestions.data.js')));
check('riskWarnings', hashes.riskWarnings_file, hashFile(path.join(dataDir, 'riskWarnings.data.js')));

console.log('\n=== FINAL STATUS ===');
console.log('Protected hashes: ' + (hOk ? 'PASS (ALL UNCHANGED)' : 'FAIL (CHANGED!)'));

if (!hOk) process.exitCode = 1;
