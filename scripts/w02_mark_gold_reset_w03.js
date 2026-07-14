const fs = require("fs"), vm = require("vm"), path = require("path");
function loadData(fp) { let c = fs.readFileSync(fp,"utf8"); const s = { window: { Zero1MatrixData: {} }, console }; vm.createContext(s); vm.runInContext(c,s); return s.window.Zero1MatrixData; }
const dataDir = path.resolve("D:\\AI_PROJECTS\\Zero1Matrix\\src\\data");
const lc = loadData(path.join(dataDir, "lineCategoryInterpretations.data.js"));
const arr = lc.lineCategoryInterpretations;

// Mark Wave 02 gold
let c=0;
for (const e of arr) { if (e.hexagramId >= 5 && e.hexagramId <= 8) { e.qualityLevel="gold"; e.reviewed=true; e.needsHumanReview=false; e.needsExpansion=false; e.reviewedBy="line-category-gold-wave-02"; e.reviewedAt="2026-07-14"; c++; } }
console.log("Marked Wave 02 gold:", c);

// Reset Wave 03
let c2=0;
for (const e of arr) { if (e.hexagramId >= 9 && e.hexagramId <= 12) { e.qualityLevel="refined"; e.reviewed=false; e.needsHumanReview=true; e.needsExpansion=true; e.reviewedBy=""; e.reviewedAt=""; c2++; } }
console.log("Reset Wave 03:", c2);

const prefix = "window.Zero1MatrixData = window.Zero1MatrixData || {};\n";
fs.writeFileSync(path.join(dataDir, "lineCategoryInterpretations.data.js"), prefix + "window.Zero1MatrixData.lineCategoryInterpretations = " + JSON.stringify(arr) + ";", "utf8");
