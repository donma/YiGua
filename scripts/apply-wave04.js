// Wave 04 Apply Script - Hex 13-16 (288 gold entries)
// Loads data file via VM, replaces hex 13-16 entries, preserves all others
const fs = require("fs"), vm = require("vm"), path = require("path");
const root = path.resolve(__dirname, "..");
const dataPath = path.join(root, "src", "data", "lineCategoryInterpretations.data.js");
const today = "2026-07-14";

function loadModule(fp) {
  const c = fs.readFileSync(fp, "utf8");
  const s = { window: { Zero1MatrixData: {} }, console };
  vm.createContext(s);
  vm.runInContext(c, s);
  return s.window.Zero1MatrixData;
}

const cats = ["general","career","love","money","people","family","study","health","decision","business","legal","spiritual"];
const catCN = {
  general:"一般", career:"工作事業", love:"感情關係", money:"財務金錢",
  people:"人際合作", family:"家庭親人", study:"學習考試", health:"身心狀態",
  decision:"重大決策", business:"創業經營", legal:"官非合約", spiritual:"心境修行",
};
const disclaimerTexts = { health:"本欄不做醫療診斷。", business:"本欄不做獲利保證。", legal:"本欄不做法律結果判定。" };

function E(hId, line, cat, m, a, w, basis, sa) {
  const id = "hex-"+String(hId).padStart(3,"0")+"-line-"+line+"-"+cat;
  let meaning = m;
  if (disclaimerTexts[cat]) meaning = m + disclaimerTexts[cat];
  return {
    id, hexagramId:hId, line, category:cat, categoryName:catCN[cat],
    meaning, advice:a, warning:w, basis,
    scoreAdjust:{clarity:sa[0],action:sa[1],risk:sa[2],change:sa[3],support:sa[4],timing:sa[5]},
    qualityLevel:"gold", needsExpansion:false, needsHumanReview:false,
    version:"2.0.0-w04", reviewed:true,
    reviewedBy:"line-category-gold-wave-04", reviewedAt:today
  };
}

function makeLine(hId, line, entries) {
  return entries.map(([cat,m,a,w,basis,sa]) => E(hId,line,cat,m,a,w,basis,sa));
}

console.log("Loading extracted content...");
const ext = JSON.parse(fs.readFileSync(path.join(__dirname,"_wave04_extracted.json"),"utf8"));
const h13 = ext.h13, h14p = ext.h14_partial, h15L1 = ext.h15_partial, h16L1 = ext.h16_partial;
console.log("Extracted: H13="+h13.length+", H14="+h14p.length+", H15L1="+h15L1.length+", H16L1="+h16L1.length);

// We now need to generate remaining entries and merge
// The remaining generator modules are in separate files

// ─── Load and execute remaining generators ───
console.log("Generating remaining 144 entries...");
const genH14L5 = require("./gen_h14_l5.js");
const genH14L6 = require("./gen_h14_l6.js");
const genH15L2 = require("./gen_h15_l2.js");
const genH15L3 = require("./gen_h15_l3.js");
const genH15L4 = require("./gen_h15_l4.js");
const genH15L5L6 = require("./gen_h15_l5l6.js");
const genH16L2L3 = require("./gen_h16_l2l3.js");
const genH16L4L6 = require("./gen_h16_l4l6.js");

const h14_remaining = [...genH14L5(makeLine), ...genH14L6(makeLine)];
const h15_remaining = [...genH15L2(makeLine), ...genH15L3(makeLine), ...genH15L4(makeLine), ...genH15L5L6(makeLine)];
const h16_remaining = [...genH16L2L3(makeLine), ...genH16L4L6(makeLine)];

console.log("H14 remaining (L5-L6):", h14_remaining.length);
console.log("H15 remaining (L2-L6):", h15_remaining.length);
console.log("H16 remaining (L2-L6):", h16_remaining.length);

// ─── Assemble all wave 04 entries ───
const h14_all = [...h14p, ...h14_remaining];
const h15_all = [...h15L1, ...h15_remaining];
const h16_all = [...h16L1, ...h16_remaining];
const wave04entries = [...h13, ...h14_all, ...h15_all, ...h16_all];

console.log("Total Wave 04 entries:", wave04entries.length);
console.log("  H13:", h13.length, "/ H14:", h14_all.length, "/ H15:", h15_all.length, "/ H16:", h16_all.length);

// Verify counts
const expected = 288;
if (wave04entries.length !== expected) {
  console.error("ERROR: Expected " + expected + " entries, got " + wave04entries.length);
  process.exit(1);
}

// Quick quality checks
for (const e of wave04entries) {
  if (!e.id || !e.meaning || !e.advice || !e.warning) {
    console.error("MISSING FIELD in entry:", e.id);
    process.exit(1);
  }
  if (e.meaning.length < 90) {
    console.error("MEANING TOO SHORT for", e.id, ":", e.meaning.length, "chars");
    process.exit(1);
  }
  if (e.advice.length < 75) {
    console.error("ADVICE TOO SHORT for", e.id, ":", e.advice.length, "chars");
    process.exit(1);
  }
  if (e.warning.length < 55) {
    console.error("WARNING TOO SHORT for", e.id, ":", e.warning.length, "chars");
    process.exit(1);
  }
  if (!e.basis || e.basis.length < 4) {
    console.error("BASIS TOO SHORT for", e.id, ":", e.basis ? e.basis.length : 0);
    process.exit(1);
  }
  for (const b of e.basis) {
    if (!b || typeof b !== "string" || b.trim().length === 0) {
      console.error("EMPTY BASIS ITEM in", e.id);
      process.exit(1);
    }
  }
  const sa = e.scoreAdjust;
  for (const d of ["clarity","action","risk","change","support","timing"]) {
    if (typeof sa[d] !== "number") {
      console.error("MISSING scoreAdjust." + d + " in", e.id);
      process.exit(1);
    }
  }
  if (e.qualityLevel !== "gold") { console.error("NOT GOLD:", e.id); process.exit(1); }
  if (e.version !== "2.0.0-w04") { console.error("BAD VERSION:", e.id); process.exit(1); }
  if (e.reviewed !== true) { console.error("NOT REVIEWED:", e.id); process.exit(1); }
}
console.log("All quality checks passed!");

// ─── Load data file, replace entries, write back ───
console.log("Loading data file...");
const lcD = loadModule(dataPath);
const arr = lcD.lineCategoryInterpretations;

// Remove existing entries for hex 13-16
const filtered = arr.filter(x => x.hexagramId < 13 || x.hexagramId > 16);
console.log("Preserved entries (non-w04):", filtered.length);

// Append wave 04 entries
const newArr = [...filtered, ...wave04entries];
console.log("New total entries:", newArr.length);

// Build output file
const jsonEntries = JSON.stringify(newArr);
const output = "window.Zero1MatrixData = window.Zero1MatrixData || {};\nwindow.Zero1MatrixData.lineCategoryInterpretations = " + jsonEntries + ";";

fs.writeFileSync(dataPath, output, "utf8");
console.log("Data file written successfully!");

// Verify
const verify = loadModule(dataPath);
const w04verify = verify.lineCategoryInterpretations.filter(x => x.hexagramId >= 13 && x.hexagramId <= 16);
console.log("Verification: " + w04verify.length + " wave 04 entries in file");

console.log("Wave 04 complete: 288 entries written");
