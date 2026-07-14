const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const root = process.argv[2] ? path.resolve(process.argv[2]) : path.resolve(__dirname, '..');
const dataDir = path.join(root, 'src', 'data');
const hashes = JSON.parse(fs.readFileSync(path.join(root, 'scripts', 'r916_hashes.json'), 'utf8'));

// ========== NORMALIZATION ==========
const hexNames = ['小畜', '履', '泰', '否', '同人', '大有', '謙', '豫'];
const hexImagery = [
    '密雲不雨', '復自道', '牽復', '輿說輻', '夫妻反目', '有孚血去惕出', '有孚攣如', '既雨既處', '月幾望', '懿文德', '自我西郊', '密雲',
    '履虎尾', '不咥人', '素履', '履道坦坦', '眇能視', '跛能履', '夬履', '視履考祥', '武人為于大君', '辨上下定民志',
    '小往大來', '拔茅茹', '包荒', '用馮河', '翩翩', '帝乙歸妹', '城復于隍', '天地交', '財成天地', '無平不陂', '無往不復',
    '否之匪人', '不利君子貞', '大往小來', '包承', '包羞', '有命無咎', '休否', '傾否', '天地不交', '儉德辟難',
    '同人于野', '同人于門', '同人于宗', '伏戎于莽', '乘其墉', '先號咷而後笑', '同人于郊', '類族辨物',
    '無交害', '大車以載', '公用亨于天子', '匪其彭', '厥孚交如', '威如吉', '自天祐之', '火在天上', '遏惡揚善',
    '謙謙君子', '鳴謙', '勞謙', '撝謙', '不富以其鄰', '利用侵伐', '利用行師', '地中有山', '裒多益寡', '稱物平施',
    '介于石', '鳴豫凶', '鳴豫', '盱豫悔', '由豫', '貞疾恆不死', '冥豫', '雷出地奮', '作樂崇德',
];
const catNames = ['一般', '工作事業', '感情關係', '財務金錢', '人際合作', '家庭親人', '學習考試', '身心狀態', '重大決策', '創業經營', '官非合約', '心境修行'];
const commonTerms = ['建議', '可以', '可先', '應該', '必須', '風險', '隱患', '需要注意', '危險', '目前', '現在', '眼前', '當前', '階段', '時期', '過程', '調整', '改變', '修正', '最重要', '當下', '最近', '當前的'];

function norm(text) {
    let t = String(text || '');
    for (const h of hexNames) t = t.replace(new RegExp(h, 'g'), '');
    for (const i of hexImagery) t = t.replace(new RegExp(i.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), '');
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
const repairCats = ['general', 'career', 'love', 'people', 'family', 'study', 'decision', 'spiritual'];
const protectedCats = ['money', 'health', 'business', 'legal'];

// ========== CATEGORY CHECKS ==========
const ciR = catArr.filter(x => x.hexagramId >= 9 && x.hexagramId <= 16 && repairCats.includes(x.category));
console.log('=== CATEGORY REPAIR HEX 9-16 ===');
console.log('total=' + ciR.length + ' gold=' + ciR.filter(x => x.qualityLevel === 'gold').length);

const th = {
    m: ciR.filter(x => (x.meaning || '').length >= 110).length,
    a: ciR.filter(x => (x.advice || '').length >= 90).length,
    w: ciR.filter(x => (x.warning || '').length >= 70).length,
    t: ciR.filter(x => (x.timing || '').length >= 55).length,
    b: ciR.filter(x => x.basis && x.basis.length >= 4).length,
};
console.log('m>=110:' + th.m + ' a>=90:' + th.a + ' w>=70:' + th.w + ' t>=55:' + th.t + ' b>=4:' + th.b);

// Per-hex 8-cat normU
for (let hid = 9; hid <= 16; hid++) {
    const arr = ciR.filter(x => x.hexagramId === hid);
    const mu = new Set(arr.map(x => norm(x.meaning))).size;
    const au = new Set(arr.map(x => norm(x.advice))).size;
    const wu = new Set(arr.map(x => norm(x.warning))).size;
    const tu = new Set(arr.map(x => norm(x.timing))).size;
    console.log('hex ' + hid + ': mU=' + mu + ' aU=' + au + ' wU=' + wu + ' tU=' + tu + ' ' + (mu === 8 && au === 8 && wu >= 7 && tu >= 7 ? 'PASS' : 'FAIL'));
}

// Full 12-cat per-hex
const all916 = catArr.filter(x => x.hexagramId >= 9 && x.hexagramId <= 16);
for (let hid = 9; hid <= 16; hid++) {
    const arr = all916.filter(x => x.hexagramId === hid);
    const mu = new Set(arr.map(x => norm(x.meaning))).size;
    const au = new Set(arr.map(x => norm(x.advice))).size;
    const wu = new Set(arr.map(x => norm(x.warning))).size;
    const tu = new Set(arr.map(x => norm(x.timing))).size;
    console.log('full hex ' + hid + ': mU=' + mu + ' aU=' + au + ' wU=' + wu + ' tU=' + tu + ' ' + (mu >= 12 && au >= 11 && wu >= 10 && tu >= 10 ? 'PASS' : 'FAIL'));
}

// Batch 64 normU
const fmu = new Set(ciR.map(x => norm(x.meaning))).size;
const fau = new Set(ciR.map(x => norm(x.advice))).size;
const fwu = new Set(ciR.map(x => norm(x.warning))).size;
const ftu = new Set(ciR.map(x => norm(x.timing))).size;
console.log('64-batch: mU=' + fmu + ' aU=' + fau + ' wU=' + fwu + ' tU=' + ftu + ' ' + (fmu >= 60 && fau >= 58 && fwu >= 56 && ftu >= 56 ? 'PASS' : 'FAIL'));

// Dup sentences
function splitSentences(text) {
    return (text || '').split(/[。！？；!?;]/).map(s => s.trim()).filter(s => s.length >= 8);
}
const sentMap = {};
for (const x of ciR) {
    for (const f of ['meaning', 'advice', 'warning', 'timing']) {
        for (const s of splitSentences(x[f] || '')) {
            if (!sentMap[s]) sentMap[s] = { c: 0 };
            sentMap[s].c++;
        }
    }
}
const dups = Object.entries(sentMap).filter(([, v]) => v.c > 2);
console.log('dup sents >2: ' + dups.length + ' ' + (dups.length === 0 ? 'PASS' : 'FAIL'));

// Skeleton scan
const allTxtCat = ciR.map(x => (x.meaning || '') + (x.advice || '') + (x.warning || '')).join(' ');
const sk = ['最基礎的準備最重要', '不要跳過基本功', '兩股力量需要平衡', '保持彈性並等待時機', '不要太快也不要太慢', '先觀察再決定', '目前仍有調整空間', '這是一個需要耐心的階段', '需要在行動與等待之間找到平衡', '此分類最常見的誤判'];
let skh = 0;
for (const s of sk) {
    const escaped = s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const matches = allTxtCat.match(new RegExp(escaped, 'g'));
    if (matches) skh += matches.length;
}
console.log('skeleton hits: ' + skh + ' ' + (skh <= 4 ? 'PASS' : 'FAIL'));

// Forbidden
const forbiddenWords = ['必定成功', '保證獲利', '官司一定贏', '停止就醫', '必有災禍'];
let fh = 0;
for (const fw of forbiddenWords) {
    if (JSON.stringify(ciR).includes(fw)) fh++;
}
console.log('forbidden: ' + fh + ' ' + (fh === 0 ? 'PASS' : 'FAIL'));

// ========== REFLECTION CHECKS ==========
const rf916 = reflArr.filter(x => x.hexagramId >= 9 && x.hexagramId <= 16);
console.log('\n=== REFLECTION HEX 9-16 ===');
console.log('total=' + rf916.length + ' reviewed=' + rf916.filter(x => x.reviewed === true).length);

const grps = {};
for (const x of rf916) {
    const k = x.hexagramId + '-' + x.category;
    if (!grps[k]) grps[k] = [];
    grps[k].push(x);
}
const grpOk = Object.values(grps).filter(x => x.length === 3).length;
let grpFail = 0;
for (const a of Object.values(grps)) {
    if (new Set(a.map(x => norm(x.question))).size < 3) grpFail++;
}
const qu = new Set(rf916.map(x => norm(x.question))).size;
const qm = rf916.filter(x => (x.question || '').endsWith('？') || (x.question || '').endsWith('?')).length;
console.log('3q:' + grpOk + '/96 fail:' + grpFail + ' qM:' + qm + ' normU:' + qu + ' ' + (qu >= 260 ? 'PASS' : 'FAIL'));

for (let hid = 9; hid <= 16; hid++) {
    const arr = rf916.filter(x => x.hexagramId === hid);
    console.log('rf hex ' + hid + ': normU=' + new Set(arr.map(x => norm(x.question))).size + '/36');
}

// Dup full questions
const qDups = rf916.map(x => x.question).filter((q, i, arr) => arr.indexOf(q) !== i).length;
console.log('dup questions: ' + qDups + ' ' + (qDups === 0 ? 'PASS' : 'FAIL'));

// Reflection skeleton scan
const allTxtRefl = rf916.map(x => x.question || '').join('\n');
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
console.log('rf skeleton hits: ' + rfSkh + ' ' + (rfSkh === 0 ? 'PASS' : 'FAIL'));

// ========== HASH CHECKS ==========
function hashSection(data) { return crypto.createHash('sha256').update(JSON.stringify(data)).digest('hex'); }
function hashFile(filePath) { return crypto.createHash('sha256').update(fs.readFileSync(filePath, 'utf8')).digest('hex'); }

let hOk = true;
const check = (name, expected, actual) => {
    const pass = expected === actual;
    if (!pass) { console.log('HASH CHANGED: ' + name); hOk = false; }
    return pass;
};

check('cat_h1to8', hashes.cat_h1to8, hashSection(catArr.filter(x => x.hexagramId >= 1 && x.hexagramId <= 8)));
check('cat_h17to64', hashes.cat_h17to64, hashSection(catArr.filter(x => x.hexagramId >= 17 && x.hexagramId <= 64)));
check('cat_protected_916', hashes.cat_protected_916, hashSection(catArr.filter(x => x.hexagramId >= 9 && x.hexagramId <= 16 && protectedCats.includes(x.category))));
check('refl_h1to8', hashes.refl_h1to8, hashSection(reflArr.filter(x => x.hexagramId >= 1 && x.hexagramId <= 8)));
check('refl_h17to64', hashes.refl_h17to64, hashSection(reflArr.filter(x => x.hexagramId >= 17 && x.hexagramId <= 64)));
check('hexagrams', hashes.hexagrams, hashSection(hexArr));
check('lines_file', hashes.lines_file, hashFile(path.join(dataDir, 'lines.data.js')));
check('pairInterpretations_file', hashes.pairInterpretations_file, hashFile(path.join(dataDir, 'pairInterpretations.data.js')));
check('lineCategoryInterpretations_file', hashes.lineCategoryInterpretations_file, hashFile(path.join(dataDir, 'lineCategoryInterpretations.data.js')));
check('actionSuggestions_file', hashes.actionSuggestions_file, hashFile(path.join(dataDir, 'actionSuggestions.data.js')));
check('riskWarnings_file', hashes.riskWarnings_file, hashFile(path.join(dataDir, 'riskWarnings.data.js')));

console.log('\nprotected hashes: ' + (hOk ? 'ALL UNCHANGED' : 'CHANGED!'));
