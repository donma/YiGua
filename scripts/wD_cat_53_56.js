const vm = require("vm");
const fs = require("fs");
const path = require("path");

const DATA_PATH = path.join(__dirname, "..", "src", "data", "categoryInterpretations.data.js");
const NODE_EXE = path.join(__dirname, "..", ".nodejs", "node-v22.14.0-win-x64", "node.exe");

const CATEGORY_NAMES = {
  general: "一般", career: "工作事業", love: "感情關係", money: "財務金錢",
  people: "人際合作", family: "家庭親人", study: "學習考試", health: "身心狀態",
  decision: "重大決策", business: "創業經營", legal: "官非合約", spiritual: "心境修行",
};

function scoreAdj(cl, ac, ri, ch, su, ti) { return { clarity: cl, action: ac, risk: ri, change: ch, support: su, timing: ti }; }

// Build content from separate content modules
const h53 = require("./wD_cat_53_content.js");
const h54 = require("./wD_cat_54_content.js");
const h55 = require("./wD_cat_55_content.js");
const h56 = require("./wD_cat_56_content.js");

const SCORE_53 = {
  general: scoreAdj(5,-5,5,5,5,5), career: scoreAdj(5,0,5,5,5,10), love: scoreAdj(10,0,5,5,10,5),
  money: scoreAdj(5,0,5,5,5,5), people: scoreAdj(10,0,5,5,10,5), family: scoreAdj(10,0,5,5,10,5),
  study: scoreAdj(5,0,5,5,5,5), health: scoreAdj(5,0,5,5,5,5), decision: scoreAdj(10,0,5,5,5,10),
  business: scoreAdj(5,5,5,5,5,5), legal: scoreAdj(5,0,5,5,5,10), spiritual: scoreAdj(10,0,5,5,10,5),
};
const SCORE_54 = {
  general: scoreAdj(5,-5,10,5,0,5), career: scoreAdj(5,-5,10,5,0,5), love: scoreAdj(5,-5,10,5,5,5),
  money: scoreAdj(5,0,10,5,0,5), people: scoreAdj(5,0,5,5,5,5), family: scoreAdj(5,0,5,5,5,5),
  study: scoreAdj(5,0,5,5,5,5), health: scoreAdj(5,0,5,5,5,5), decision: scoreAdj(10,0,10,5,0,10),
  business: scoreAdj(5,5,10,5,0,5), legal: scoreAdj(5,0,10,5,0,10), spiritual: scoreAdj(10,0,5,5,5,5),
};
const SCORE_55 = {
  general: scoreAdj(5,0,10,10,0,5), career: scoreAdj(5,5,10,10,0,5), love: scoreAdj(10,0,5,5,5,5),
  money: scoreAdj(5,0,10,5,0,5), people: scoreAdj(5,0,5,10,5,5), family: scoreAdj(5,0,5,5,5,5),
  study: scoreAdj(5,0,5,10,5,5), health: scoreAdj(5,0,10,5,5,5), decision: scoreAdj(10,5,10,10,0,10),
  business: scoreAdj(5,5,10,10,0,5), legal: scoreAdj(5,0,10,5,0,10), spiritual: scoreAdj(10,0,5,10,5,5),
};
const SCORE_56 = {
  general: scoreAdj(5,5,10,10,0,5), career: scoreAdj(5,5,5,10,0,5), love: scoreAdj(5,0,10,10,5,5),
  money: scoreAdj(5,5,5,5,0,5), people: scoreAdj(5,0,5,10,5,5), family: scoreAdj(5,0,5,5,5,5),
  study: scoreAdj(5,0,5,10,5,5), health: scoreAdj(5,0,10,5,5,5), decision: scoreAdj(10,10,10,10,0,10),
  business: scoreAdj(5,5,5,10,0,5), legal: scoreAdj(5,0,10,5,0,10), spiritual: scoreAdj(10,0,5,10,5,5),
};

function buildEntries(hexId, contentMap, scoreMap) {
  return Object.keys(CATEGORY_NAMES).map((cat) => {
    const t = contentMap[cat];
    return {
      id: "hex-" + String(hexId).padStart(3, "0") + "-" + cat,
      hexagramId: hexId, category: cat, categoryName: CATEGORY_NAMES[cat],
      meaning: t.meaning, advice: t.advice, warning: t.warning, timing: t.timing,
      basis: t.basis, scoreAdjust: scoreMap[cat],
      qualityLevel: "refined", reviewed: false,
      reviewedBy: "category-hex53-56", reviewedAt: "2026-07-13",
      needsHumanReview: true, version: "1.7.3-refined-cat-hex53-56",
    };
  });
}

const allNew = [
  ...buildEntries(53, h53, SCORE_53),
  ...buildEntries(54, h54, SCORE_54),
  ...buildEntries(55, h55, SCORE_55),
  ...buildEntries(56, h56, SCORE_56),
];

// Mandatory length assertions
const MIN = { meaning: 125, advice: 110, warning: 90, timing: 70 };
const MIN_BASIS = 4;
let ok = true;
const stats = { meaning: [], advice: [], warning: [], timing: [] };

for (const e of allNew) {
  for (const f of Object.keys(MIN)) {
    const len = e[f].length;
    stats[f].push(len);
    if (len < MIN[f]) { ok = false; console.error("FAIL: " + e.id + " " + f + "=" + len + " (min " + MIN[f] + ")"); }
  }
  if (e.basis.length < MIN_BASIS) { ok = false; console.error("FAIL: " + e.id + " basis=" + e.basis.length); }
}
if (!ok) { console.error("\nLength assertions FAILED. Abort."); process.exit(1); }
console.log("All 48 entries pass length assertions.\n");
for (const f of Object.keys(stats)) {
  const a = stats[f];
  console.log(f + ": min=" + Math.min(...a) + " max=" + Math.max(...a) + " avg=" + (a.reduce((x,y)=>x+y,0)/a.length).toFixed(1));
}

// ScoreAdjust check
const DIMS = ["clarity","action","risk","change","support","timing"];
for (const e of allNew) {
  for (const d of DIMS) {
    if (typeof e.scoreAdjust[d] !== "number") { ok = false; console.error("FAIL: " + e.id + " missing " + d); }
  }
}
if (!ok) { console.error("\nScoreAdjust check FAILED."); process.exit(1); }
console.log("\nAll scoreAdjust checks passed.");

// Prohibited patterns
const PROH = [
/^\d+[\.\u3001\)]/m, /\u7B2C[\u4E00\u4E8C\u4E09\u56DB\u4E94][\u3001\uff0c\u3002\uff1a\)]/g,
  /\u9996\u5148.*\u5176\u6B21.*\u6700\u5F8C/g, /\u7B2C\u4E00[\u3001\uff0c].*\u7B2C\u4E8C[\u3001\uff0c]/g,
];
for (const e of allNew) {
  for (const f of ["meaning","advice","warning","timing"]) {
    for (const p of PROH) {
      if (p.test(e[f])) { ok = false; console.error("FAIL: " + e.id + " " + f + " prohibited pattern"); }
    }
  }
}
if (!ok) { console.error("\nProhibited pattern check FAILED."); process.exit(1); }
console.log("All prohibited pattern checks passed.\n");

// Load existing, merge, write
const raw = fs.readFileSync(DATA_PATH, "utf8");
const sandbox = { window: {} };
vm.createContext(sandbox);
vm.runInContext(raw, sandbox);
const existing = sandbox.window.Zero1MatrixData.categoryInterpretations;
const filtered = existing.filter((e) => e.hexagramId < 53 || e.hexagramId > 56);
const merged = [...filtered, ...allNew].sort((a, b) => {
  if (a.hexagramId !== b.hexagramId) return a.hexagramId - b.hexagramId;
  const order = Object.keys(CATEGORY_NAMES);
  return order.indexOf(a.category) - order.indexOf(b.category);
});

const out = "window.Zero1MatrixData = window.Zero1MatrixData || {};\nwindow.Zero1MatrixData.categoryInterpretations = " + JSON.stringify(merged, null, 2) + ";\n";
fs.writeFileSync(DATA_PATH, out, "utf8");
console.log("Wrote " + merged.length + " total entries (" + allNew.length + " new/updated for hex 53-56)");

// node --check
const { execSync } = require("child_process");
try {
  execSync("\"" + NODE_EXE + "\" --check \"" + DATA_PATH + "\"", { stdio: "pipe" });
  console.log("node --check PASSED");
} catch (e) {
  console.error("node --check FAILED");
  console.error(e.stderr ? e.stderr.toString() : "");
  process.exit(1);
}
