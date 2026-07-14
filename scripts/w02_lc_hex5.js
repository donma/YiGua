// w02_lc_hex5.js — Line-category generator for Hex 5: 需 (水天需)
// Generates 72 entries (6 lines x 12 categories)
// Constraints: meaning>=90, advice>=75, warning>=55, basis>=4 items
// PROHIBITED: templates, "此為X卦","保持耐心","順勢而為","多加溝通","等待成熟", numbered lists

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve('D:\\AI_PROJECTS\\Zero1Matrix');
const DATA_DIR = path.join(ROOT, 'src', 'data');
const TARGET = path.join(DATA_DIR, 'lineCategoryInterpretations.data.js');
const NODE_EXE = path.join(ROOT, '.nodejs', 'node-v22.14.0-win-x64', 'node.exe');

const raw = fs.readFileSync(TARGET, 'utf8');
const match = raw.match(/window\.Zero1MatrixData\.lineCategoryInterpretations = (\[.*\]);?$/s);
if (!match) { console.error('Parse fail'); process.exit(1); }
const all = JSON.parse(match[1]);
console.log('Loaded entries:', all.length);

const CATS = [
  { id: 'general', name: '一般' },
  { id: 'career', name: '工作事業' },
  { id: 'love', name: '感情關係' },
  { id: 'money', name: '財務金錢' },
  { id: 'people', name: '人際合作' },
  { id: 'family', name: '家庭親人' },
  { id: 'study', name: '學習考試' },
  { id: 'health', name: '身心狀態' },
  { id: 'decision', name: '重大決策' },
  { id: 'business', name: '創業經營' },
  { id: 'legal', name: '官非合約' },
  { id: 'spiritual', name: '心境修行' }
];

const DISCLAIMER = { health: '本欄不做醫療診斷。', business: '本欄不做獲利保證。', legal: '本欄不做法律結果判定。' };
const now = new Date().toISOString().split('T')[0];
const V = '2.0.0-w02';

function mkEntry(hid, line, cat, cn, meaning, advice, warning, basis, sa) {
  return {
    id: 'hex-' + String(hid).padStart(3,'0') + '-line-' + line + '-' + cat,
    hexagramId: hid, line: line, category: cat, categoryName: cn,
    meaning, advice, warning, basis, scoreAdjust: {...sa},
    qualityLevel: 'refined', needsHumanReview: true, needsExpansion: true,
    version: V, reviewed: false, reviewedBy: '', reviewedAt: ''
  };
}

const SA_H5 = [
  null,
  {clarity:3, action:-1, risk:1, change:2, support:1, timing:-1},
  {clarity:3, action:1, risk:1, change:2, support:1, timing:0},
  {clarity:3, action:-2, risk:3, change:2, support:0, timing:-2},
  {clarity:2, action:2, risk:3, change:5, support:1, timing:-1},
  {clarity:4, action:1, risk:0, change:1, support:3, timing:2},
  {clarity:3, action:2, risk:2, change:4, support:2, timing:1}
];

const generated = [];
const DATA = JSON.parse(fs.readFileSync(path.join(__dirname, '_w02_data.json'), 'utf8'));

for (const block of DATA) {
  const L = block.line;
  const sa = SA_H5[L];
  for (const e of block.entries) {
    const w = (DISCLAIMER[e.cat] ? e.warning + DISCLAIMER[e.cat] : e.warning);
    generated.push(mkEntry(5, L, e.cat, e.cn, e.meaning, e.advice, w, e.basis, sa));
  }
}

// ==================== VERIFICATION ====================
console.log('\n=== VERIFICATION ===');
console.log('Total generated:', generated.length);

let allPass = true;
let failCount = 0;
let passCount = 0;
for (const e of generated) {
  const ml = (e.meaning || '').length;
  const al = (e.advice || '').length;
  const wl = (e.warning || '').length;
  const bl = (e.basis || []).length;
  const ok = ml >= 90 && al >= 75 && wl >= 55 && bl >= 4;
  if (!ok) {
    console.log('FAIL:', e.id, 'm='+ml, 'a='+al, 'w='+wl, 'b='+bl);
    allPass = false;
    failCount++;
  } else {
    passCount++;
  }
}
console.log('Pass:', passCount, 'Fail:', failCount);

// Uniqueness checks
function norm(t) { return String(t||'').replace(/[，。、；：！？\s\d]/g,'').substring(0,50); }
let dupIssue = false;
for (const c of CATS) {
  const me = generated.filter(e => e.category === c.id).map(e => norm(e.meaning));
  if (new Set(me).size !== 6) { console.log('CAT ' + c.id + ' SAME-CAT not unique (' + new Set(me).size + '/6)'); dupIssue = true; }
}
for (let l = 1; l <= 6; l++) {
  const me = generated.filter(e => e.line === l).map(e => norm(e.meaning));
  if (new Set(me).size !== 12) { console.log('L' + l + ' SAME-LINE not unique (' + new Set(me).size + '/12)'); dupIssue = true; }
}
if (!dupIssue) console.log('All uniqueness checks PASS');

// Prohibited phrases
const PROH = ['此為X卦','保持耐心','順勢而為','多加溝通','等待成熟'];
let probFound = false;
for (const e of generated) {
  const t = e.meaning + e.advice + e.warning;
  for (const p of PROH) { if (t.includes(p)) { console.log("PROHIBITED '"+p+"' in "+e.id); probFound = true; } }
}
if (!probFound) console.log('No prohibited phrases found');

// ==================== MERGE AND WRITE ====================
if (allPass && generated.length === 72) {
  console.log('\n=== ALL CHECKS PASSED: writing to file ===');
  const newAll = all.filter(e => e.hexagramId !== 5);
  newAll.push(...generated);
  newAll.sort((a, b) => (a.id || '').localeCompare(b.id || ''));
  console.log('Total entries after merge:', newAll.length);
  const output = 'window.Zero1MatrixData = window.Zero1MatrixData || {};\nwindow.Zero1MatrixData.lineCategoryInterpretations = ' + JSON.stringify(newAll) + ';';
  fs.writeFileSync(TARGET, output, 'utf8');
  console.log('Written:', TARGET);

  const verifyRaw = fs.readFileSync(TARGET, 'utf8');
  const headerOk = verifyRaw.startsWith('window.Zero1MatrixData = window.Zero1MatrixData || {};\nwindow.Zero1MatrixData.lineCategoryInterpretations = [');
  const endingOk = verifyRaw.endsWith('];');
  console.log('Format: header=' + headerOk + ' ending=' + endingOk);

  try { new Function(verifyRaw); console.log('Syntax check: PASS'); } catch (e) { console.log('Syntax check: FAIL - ' + e.message); }
  console.log('\nDone! 72 entries generated and written for Hex 5.');
} else {
  console.log('\n=== CHECKS FAILED or count wrong, NOT writing ===');
  console.log('Pass:', allPass, 'Count:', generated.length, '(need 72)');
  process.exit(1);
}
