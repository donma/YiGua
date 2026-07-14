const fs = require('fs');
const vm = require('vm');
const path = require('path');

const filePath = path.join(__dirname, '..', 'src', 'data', 'categoryInterpretations.data.js');
const code = fs.readFileSync(filePath, 'utf8');

const ctx = { window: {} };
vm.createContext(ctx);
vm.runInContext(code, ctx);
const data = ctx.window.Zero1MatrixData.categoryInterpretations;

const pools = {
  17: ['元亨利貞無咎', '官有渝貞吉', '出門交有功', '係小子失丈夫', '係丈夫失小子', '隨有求得', '隨有獲貞凶', '孚于嘉吉', '拘係之乃從維之', '王用亨于西山', '澤中有雷', '君子以嚮晦入宴息'],
  18: ['元亨利涉大川', '先甲三日後甲三日', '幹父之蠱', '幹母之蠱', '幹父之蠱小有悔', '裕父之蠱', '幹父之蠱用譽', '不事王侯高尚其事', '山下有風', '君子以振民育德'],
};

let fixedCount = 0;
const lengthDist = {};

for (const entry of data) {
  if (entry.hexagramId === 17 || entry.hexagramId === 18) {
    const basis = entry.basis;
    if (!Array.isArray(basis)) continue;

    if (basis.length < 4) {
      const pool = pools[entry.hexagramId];
      const textBlob = [entry.meaning, entry.advice, entry.warning, entry.timing].join(' ');

      // Find candidate imagery terms from pool that appear in text but not already in basis
      const candidates = pool.filter(term => !basis.includes(term) && textBlob.includes(term));

      // Fallback: any pool term not already in basis
      const fallbackCandidates = pool.filter(term => !basis.includes(term));

      const needed = 4 - basis.length;
      const toAdd = [];
      for (const c of candidates) {
        if (toAdd.length >= needed) break;
        toAdd.push(c);
      }
      if (toAdd.length < needed) {
        for (const c of fallbackCandidates) {
          if (toAdd.includes(c)) continue;
          if (toAdd.length >= needed) break;
          toAdd.push(c);
        }
      }

      basis.push(...toAdd);
      fixedCount++;
    }

    lengthDist[basis.length] = (lengthDist[basis.length] || 0) + 1;
  }
}

// Serialize back preserving the window.Zero1MatrixData pattern
const output = `window.Zero1MatrixData = window.Zero1MatrixData || {};\nwindow.Zero1MatrixData.categoryInterpretations = ${JSON.stringify(data, null, 2)};\n`;

fs.writeFileSync(filePath, output, 'utf8');

console.log('Entries fixed (basis was < 4):', fixedCount);
console.log('Basis length distribution (hex 17/18 entries):', lengthDist);

// Verify all hex17/18 entries have basis.length >= 4
const stillBad = data.filter(e => (e.hexagramId === 17 || e.hexagramId === 18) && (!Array.isArray(e.basis) || e.basis.length < 4));
console.log('Entries still with basis.length < 4:', stillBad.length);
