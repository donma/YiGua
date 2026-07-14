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

const h57 = require("./wE_cat_57_content.js");
const h58 = require("./wE_cat_58_content.js");
const h59 = require("./wE_cat_59_content.js");
const h60 = require("./wE_cat_60_content.js");

const SCORE_57 = {
  general: scoreAdj(5,0,5,10,5,5), career: scoreAdj(5,5,5,10,5,10), love: scoreAdj(10,0,5,10,5,5),
  money: scoreAdj(5,0,10,5,5,5), people: scoreAdj(10,0,5,5,5,5), family: scoreAdj(10,0,5,5,10,5),
  study: scoreAdj(5,0,5,10,5,5), health: scoreAdj(5,0,10,5,5,5), decision: scoreAdj(10,5,10,10,5,10),
  business: scoreAdj(5,5,5,10,5,5), legal: scoreAdj(5,0,10,5,5,10), spiritual: scoreAdj(10,0,5,10,5,5),
};
const SCORE_58 = {
  general: scoreAdj(5,0,10,5,5,5), career: scoreAdj(5,5,10,10,5,5), love: scoreAdj(10,0,10,5,10,5),
  money: scoreAdj(5,0,10,5,0,5), people: scoreAdj(10,0,5,5,10,5), family: scoreAdj(10,0,10,5,10,5),
  study: scoreAdj(5,0,5,10,5,5), health: scoreAdj(5,0,10,5,5,5), decision: scoreAdj(10,5,10,10,5,10),
  business: scoreAdj(5,5,10,10,5,5), legal: scoreAdj(5,0,10,5,5,10), spiritual: scoreAdj(10,0,5,10,5,5),
};
const SCORE_59 = {
  general: scoreAdj(5,5,5,10,5,5), career: scoreAdj(5,5,5,10,0,5), love: scoreAdj(10,0,10,10,5,5),
  money: scoreAdj(5,5,5,10,0,5), people: scoreAdj(10,5,5,10,5,5), family: scoreAdj(10,0,10,10,5,5),
  study: scoreAdj(5,0,5,10,5,5), health: scoreAdj(5,0,10,10,5,5), decision: scoreAdj(10,10,10,10,5,10),
  business: scoreAdj(5,5,5,10,0,5), legal: scoreAdj(5,0,10,5,5,10), spiritual: scoreAdj(10,0,5,10,5,5),
};
const SCORE_60 = {
  general: scoreAdj(5,0,5,0,5,5), career: scoreAdj(5,0,5,0,5,5), love: scoreAdj(10,0,10,5,10,5),
  money: scoreAdj(5,0,5,0,5,5), people: scoreAdj(10,0,5,0,10,5), family: scoreAdj(10,0,5,0,10,5),
  study: scoreAdj(5,0,5,0,5,5), health: scoreAdj(5,0,10,0,5,5), decision: scoreAdj(10,5,10,5,5,10),
  business: scoreAdj(5,5,5,0,5,5), legal: scoreAdj(5,0,10,0,5,10), spiritual: scoreAdj(10,0,5,5,5,5),
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
      reviewedBy: "category-hex57-60", reviewedAt: "2026-07-13",
      needsHumanReview: true, version: "1.7.3-refined-cat-hex57-60",
    };
  });
}

const allNew = [
  ...buildEntries(57, h57, SCORE_57),
  ...buildEntries(58, h58, SCORE_58),
  ...buildEntries(59, h59, SCORE_59),
  ...buildEntries(60, h60, SCORE_60),
];

// MANDATORY length assertions: meaning>=125, advice>=110, warning>=90, timing>=70
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

// ScoreAdjust completeness check
const DIMS = ["clarity","action","risk","change","support","timing"];
for (const e of allNew) {
  for (const d of DIMS) {
    if (typeof e.scoreAdjust[d] !== "number") { ok = false; console.error("FAIL: " + e.id + " missing " + d); }
  }
}
if (!ok) { console.error("\nScoreAdjust check FAILED."); process.exit(1); }
console.log("\nAll scoreAdjust checks passed.");

// Prohibited patterns (numbered lists, templates, generic filler)
const PROH = [
  /^\d+[\.\u3001\)]/m,
  /\u7B2C[\u4E00\u4E8C\u4E09\u56DB\u4E94][\u3001\uff0c\u3002\uff1a\)]/g,
  /\u9996\u5148.*\u5176\u6B21.*\u6700\u5F8C/g,
  /\u7B2C\u4E00[\u3001\uff0c].*\u7B2C\u4E8C[\u3001\uff0c]/g,
  /X\u5E36\u4F86\u63A8\u529B.*Y\u5E36\u4F86\u7BC0\u5236/g,
  /\u91CD\u9EDE\u5728\u65BC\u5224\u65B7\u9019\u5169\u80A1\u529B\u91CF/g,
];
for (const e of allNew) {
  for (const f of ["meaning","advice","warning","timing"]) {
    for (const p of PROH) {
      if (p.test(e[f])) { ok = false; console.error("FAIL: " + e.id + " " + f + " prohibited pattern matched: " + p); }
    }
  }
}
if (!ok) { console.error("\nProhibited pattern check FAILED."); process.exit(1); }
console.log("All prohibited pattern checks passed.\n");

// Safe statements check
const REQUIRED_SAFE = { health: "\u672C\u6B04\u4E0D\u505A\u91AB\u7642\u8A3A\u65B7", money: "\u672C\u6B04\u4E0D\u505A\u7372\u5229\u4FDD\u8B49", legal: "\u672C\u6B04\u4E0D\u505A\u6CD5\u5F8B\u7D50\u679C\u5224\u5B9A", business: "\u672C\u6B04\u4E0D\u505A\u7372\u5229\u4FDD\u8B49" };
for (const e of allNew) {
  if (REQUIRED_SAFE[e.category]) {
    const stmt = REQUIRED_SAFE[e.category];
    if (!e.meaning.includes(stmt) && !e.advice.includes(stmt) && !e.warning.includes(stmt) && !e.timing.includes(stmt)) {
      ok = false; console.error("FAIL: " + e.id + " missing safe statement: " + stmt);
    }
  }
}
if (!ok) { console.error("\nSafe statement check FAILED."); process.exit(1); }
console.log("All safe statement checks passed.\n");

// Load existing, filter out old 57-60 entries, merge new, write
const raw = fs.readFileSync(DATA_PATH, "utf8");
const sandbox = { window: {} };
vm.createContext(sandbox);
vm.runInContext(raw, sandbox);
const existing = sandbox.window.Zero1MatrixData.categoryInterpretations;
const filtered = existing.filter((e) => e.hexagramId < 57 || e.hexagramId > 60);
const merged = [...filtered, ...allNew].sort((a, b) => {
  if (a.hexagramId !== b.hexagramId) return a.hexagramId - b.hexagramId;
  const order = Object.keys(CATEGORY_NAMES);
  return order.indexOf(a.category) - order.indexOf(b.category);
});

const out = "window.Zero1MatrixData = window.Zero1MatrixData || {};\nwindow.Zero1MatrixData.categoryInterpretations = " + JSON.stringify(merged, null, 2) + ";\n";
fs.writeFileSync(DATA_PATH, out, "utf8");
console.log("Wrote " + merged.length + " total entries (" + allNew.length + " new/updated for hex 57-60)");

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
