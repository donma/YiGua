// Wave 05 Data Builder - Generates apply-wave05.js with all 288 gold entries
const fs = require("fs");
const path = require("path");
const dest = path.join(__dirname, "apply-wave05.js");
const today = "2026-07-14";

let entries = [];
let entryCount = 0;

function E(hId, line, cat, m, a, w, basis, sa) {
  entryCount++;
  entries.push([hId, line, cat, m, a, w, basis, sa]);
}

// Load all hex data builders
require("./_w05_hex17.js")(E);
console.log("H17 entries:", entryCount);
require("./_w05_hex18.js")(E);
console.log("H18 entries:", entryCount);
require("./_w05_hex19.js")(E);
console.log("H19 entries:", entryCount);
require("./_w05_hex20.js")(E);
console.log("H20 total entries:", entryCount);

if (entryCount !== 288) {
  console.error("Expected 288 entries, got", entryCount);
  process.exit(1);
}

console.log("All 288 entries generated. Building apply-wave05.js...");

// Build the output script
let out = [];
out.push(`// Wave 05 Apply Script - Hex 17-20 (288 gold entries)`);
out.push(`// Loads data file via VM, replaces hex 17-20 entries, preserves all others`);
out.push(`const fs = require("fs"), vm = require("vm"), path = require("path");`);
out.push(`const root = path.resolve(__dirname, "..");`);
out.push(`const dataPath = path.join(root, "src", "data", "lineCategoryInterpretations.data.js");`);
out.push(`const today = "2026-07-14";`);
out.push(``);
out.push(`function loadModule(fp) {`);
out.push(`  const c = fs.readFileSync(fp, "utf8");`);
out.push(`  const s = { window: { Zero1MatrixData: {} }, console };`);
out.push(`  vm.createContext(s);`);
out.push(`  vm.runInContext(c, s);`);
out.push(`  return s.window.Zero1MatrixData;`);
out.push(`}`);
out.push(``);
out.push(`const catCN = {`);
out.push(`  general:"一般", career:"工作事業", love:"感情關係", money:"財務金錢",`);
out.push(`  people:"人際合作", family:"家庭親人", study:"學習考試", health:"身心狀態",`);
out.push(`  decision:"重大決策", business:"創業經營", legal:"官非合約", spiritual:"心境修行"`);
out.push(`};`);
out.push(`const disclaimerTexts = { health:"本欄不做醫療診斷。", business:"本欄不做獲利保證。", legal:"本欄不做法律結果判定。", money:"本欄不做獲利保證。" };`);
out.push(``);
out.push(`function E(hId, line, cat, m, a, w, basis, sa) {`);
out.push(`  const id = "hex-"+String(hId).padStart(3,"0")+"-line-"+line+"-"+cat;`);
out.push(`  let meaning = m;`);
out.push(`  if (disclaimerTexts[cat]) meaning = m + disclaimerTexts[cat];`);
out.push(`  return {`);
out.push(`    id, hexagramId:hId, line, category:cat, categoryName:catCN[cat],`);
out.push(`    meaning, advice:a, warning:w, basis,`);
out.push(`    scoreAdjust:{clarity:sa[0],action:sa[1],risk:sa[2],change:sa[3],support:sa[4],timing:sa[5]},`);
out.push(`    qualityLevel:"gold", needsExpansion:false, needsHumanReview:false,`);
out.push(`    version:"2.0.0-w05", reviewed:true,`);
out.push(`    reviewedBy:"line-category-gold-wave-05", reviewedAt:today`);
out.push(`  };`);
out.push(`}`);
out.push(``);
out.push(`console.log("Applying " + ${entryCount} + " Wave 05 entries...");`);
out.push(`const wave05entries = [];`);
out.push(``);

// Generate entry calls
for (const e of entries) {
  const [hId, line, cat, m, a, w, basis, sa] = e;
  out.push(`wave05entries.push(E(${hId},${line},${JSON.stringify(cat)},${JSON.stringify(m)},${JSON.stringify(a)},${JSON.stringify(w)},${JSON.stringify(basis)},${JSON.stringify(sa)}));`);
}

out.push(``);
out.push(`// Quick quality checks`);
out.push(`for (const e of wave05entries) {`);
out.push(`  if (!e.id || !e.meaning || !e.advice || !e.warning) { console.error("MISSING FIELD:", e.id); process.exit(1); }`);
out.push(`  if (e.meaning.length < 90) { console.error("MEANING TOO SHORT:", e.id, e.meaning.length); process.exit(1); }`);
out.push(`  if (e.advice.length < 75) { console.error("ADVICE TOO SHORT:", e.id, e.advice.length); process.exit(1); }`);
out.push(`  if (e.warning.length < 55) { console.error("WARNING TOO SHORT:", e.id, e.warning.length); process.exit(1); }`);
out.push(`  if (!e.basis || e.basis.length < 4) { console.error("BASIS TOO SHORT:", e.id); process.exit(1); }`);
out.push(`  for (const b of e.basis) { if (!b || typeof b !== "string" || b.trim().length === 0) { console.error("EMPTY BASIS ITEM:", e.id); process.exit(1); } }`);
out.push(`  const sa = e.scoreAdjust;`);
out.push(`  for (const d of ["clarity","action","risk","change","support","timing"]) { if (typeof sa[d] !== "number") { console.error("MISSING scoreAdjust."+d, e.id); process.exit(1); } }`);
out.push(`  if (e.qualityLevel !== "gold") { console.error("NOT GOLD:", e.id); process.exit(1); }`);
out.push(`  if (e.version !== "2.0.0-w05") { console.error("BAD VERSION:", e.id); process.exit(1); }`);
out.push(`  if (e.reviewed !== true) { console.error("NOT REVIEWED:", e.id); process.exit(1); }`);
out.push(`}`);
out.push(`console.log("All quality checks passed!");`);
out.push(``);
out.push(`// Load data file, replace entries, write back`);
out.push(`console.log("Loading data file...");`);
out.push(`const lcD = loadModule(dataPath);`);
out.push(`const arr = lcD.lineCategoryInterpretations;`);
out.push(``);
out.push(`const filtered = arr.filter(x => x.hexagramId < 17 || x.hexagramId > 20);`);
out.push(`console.log("Preserved entries (non-w05):", filtered.length);`);
out.push(``);
out.push(`const newArr = [...filtered, ...wave05entries];`);
out.push(`console.log("New total entries:", newArr.length);`);
out.push(``);
out.push(`for (let h = 17; h <= 20; h++) {`);
out.push(`  const hexEntries = newArr.filter(x => x.hexagramId === h);`);
out.push(`  console.log("Hex " + h + ": " + hexEntries.length + " entries");`);
out.push(`}`);
out.push(``);
out.push(`const jsonEntries = JSON.stringify(newArr);`);
out.push(`const output = "window.Zero1MatrixData = window.Zero1MatrixData || {};\\nwindow.Zero1MatrixData.lineCategoryInterpretations = " + jsonEntries + ";";`);
out.push(`fs.writeFileSync(dataPath, output, "utf8");`);
out.push(`console.log("Data file written successfully!");`);
out.push(``);
out.push(`const verify = loadModule(dataPath);`);
out.push(`const w05verify = verify.lineCategoryInterpretations.filter(x => x.hexagramId >= 17 && x.hexagramId <= 20);`);
out.push(`console.log("Verification:", w05verify.length, "wave 05 entries in file");`);
out.push(`console.log("Wave 05 complete!");`);

fs.writeFileSync(dest, out.join("\n"), "utf8");
console.log("apply-wave05.js written:", fs.statSync(dest).size, "bytes");
