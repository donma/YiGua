// run-score-calibration.js - Real score engine calibration via Node.js vm
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const rootDir = path.resolve(__dirname, "..");
const dataDir = path.join(rootDir, "src", "data");

// ---- Build VM context with window ----
const sandbox = { window: {}, console };
sandbox.window.window = sandbox.window;
vm.createContext(sandbox);

// Load data files in browser order
const loadOrder = [
  "hexagrams.data.js",
  "lines.data.js",
  "pairInterpretations.data.js",
  "lineCategoryInterpretations.data.js",
  "categoryInterpretations.data.js",
  "reflectionQuestions.data.js",
  "actionSuggestions.data.js",
  "riskWarnings.data.js"
];

for (const fn of loadOrder) {
  const code = fs.readFileSync(path.join(dataDir, fn), "utf8");
  vm.runInContext(code, sandbox);
}

// Load core.js
const coreCode = fs.readFileSync(path.join(rootDir, "src", "js", "core.js"), "utf8");
vm.runInContext(coreCode, sandbox);

const D = sandbox.window.Zero1MatrixData;
const Z = sandbox.window.Zero1Matrix;

if (!D || !Z || !Z.scoreReadingDetailed) {
  console.error("FATAL: Failed to load score engine");
  process.exit(1);
}

console.log("Score engine loaded: Zero1Matrix.scoreReadingDetailed");

// Index data
const hexByLines = {};
const hexById = {};
for (const h of D.hexagrams) {
  hexByLines[h.lines.join(",")] = h;
  hexById[h.id] = h;
}

const catIndex = {};
for (const c of (D.categoryInterpretations || D.category || [])) {
  catIndex[`${c.hexagramId}-${c.category}`] = c;
}

const pairIndex = {};
for (const p of (D.pairInterpretations || D.pair || [])) {
  pairIndex[`${p.from}-${p.to}`] = p;
}

const catIds = ["general","career","love","money","people","family","study","health","decision","business","legal","spiritual"];
const dims = ["clarity","action","risk","change","support","timing"];
const stats = {}; for (const d of dims) stats[d] = [];
let nanCount = 0, undefinedCount = 0, outOfRange = 0, missingCatCount = 0, missingPairCount = 0;

// ---- Reproducibility: 100 fixed inputs, run twice ----
function seededRandom(seed) {
  let s = seed;
  return () => { s = (s * 1664525 + 1013904223) & 0x7FFFFFFF; return (s >>> 16) / 32768; };
}

const repRng = seededRandom(42);
const repCases = [];
for (let i = 0; i < 100; i++) {
  const casts = [];
  for (let j = 0; j < 6; j++) casts.push([6,7,8,9][Math.floor(repRng() * 4)]);
  const orig = casts.map(v => (v === 6 || v === 8) ? 0 : 1);
  const chg = casts.map(v => v === 6 ? 1 : v === 9 ? 0 : (v === 6 || v === 8) ? 0 : 1);
  const oh = hexByLines[orig.join(",")];
  const ch = hexByLines[chg.join(",")];
  if (!oh || !ch) continue;
  repCases.push({ casts, catId: catIds[i % 12], oh, ch });
}

const repResults1 = [];
const repResults2 = [];
for (const c of repCases) {
  const cat = catIndex[`${c.oh.id}-${c.catId}`];
  const pair = pairIndex[`${c.oh.id}-${c.ch.id}`];
  const r = Z.scoreReadingDetailed(c.oh, c.ch, c.casts, cat || null, pair || null);
  repResults1.push(r.scoreTrace);
}
for (const c of repCases) {
  const cat = catIndex[`${c.oh.id}-${c.catId}`];
  const pair = pairIndex[`${c.oh.id}-${c.ch.id}`];
  const r = Z.scoreReadingDetailed(c.oh, c.ch, c.casts, cat || null, pair || null);
  repResults2.push(r.scoreTrace);
}

let reproFailures = 0;
for (let i = 0; i < repResults1.length; i++) {
  for (const d of dims) {
    if (repResults1[i][d].final !== repResults2[i][d].final) { reproFailures++; break; }
  }
}

console.log(`Reproducibility: ${reproFailures}/${repCases.length} failures`);

// ---- 10,000 calibration ----
const calRng = seededRandom(12345);
for (let i = 0; i < 10000; i++) {
  const casts = [];
  for (let j = 0; j < 6; j++) casts.push([6,7,8,9][Math.floor(calRng() * 4)]);
  const catId = catIds[i % 12];
  const orig = casts.map(v => (v === 6 || v === 8) ? 0 : 1);
  const chg = casts.map(v => v === 6 ? 1 : v === 9 ? 0 : (v === 6 || v === 8) ? 0 : 1);
  const oh = hexByLines[orig.join(",")];
  const ch = hexByLines[chg.join(",")];
  if (!oh || !ch) continue;

  const cat = catIndex[`${oh.id}-${catId}`];
  if (!cat) { missingCatCount++; continue; }
  
  const pair = pairIndex[`${oh.id}-${ch.id}`];
  if (!pair) { missingPairCount++; continue; }

  try {
    const result = Z.scoreReadingDetailed(oh, ch, casts, cat, pair);
    for (const d of dims) {
      const v = result.scoreTrace[d].final;
      if (v === undefined || v === null) { undefinedCount++; continue; }
      if (Number.isNaN(v)) { nanCount++; continue; }
      if (v < 0 || v > 100) { outOfRange++; continue; }
      stats[d].push(v);
    }
  } catch (e) {
    undefinedCount++;
  }
}

console.log(`NaN: ${nanCount}, Undefined: ${undefinedCount}, OutOfRange: ${outOfRange}, MissingCat: ${missingCatCount}, MissingPair: ${missingPairCount}`);

// ---- Build result ----
const dimResults = {};
for (const d of dims) {
  const vals = stats[d];
  const n = vals.length;
  if (n === 0) { dimResults[d] = { count: 0, mean: 0, standardDeviation: 0, min: 0, max: 0, under10Ratio: 0, over90Ratio: 0, largestTenPointBucketRatio: 0 }; continue; }
  const sorted = [...vals].sort((a,b)=>a-b);
  const min = sorted[0], max = sorted[n-1];
  const mean = vals.reduce((s,v)=>s+v,0)/n;
  const variance = vals.reduce((s,v)=>s+(v-mean)**2,0)/(n-1);
  const stdDev = Math.sqrt(variance);
  const under10 = vals.filter(v=>v<10).length/n;
  const over90 = vals.filter(v=>v>90).length/n;
  // Largest 10-point bucket
  const buckets = {};
  for (const v of vals) { const b = Math.floor(v/10)*10; buckets[b] = (buckets[b]||0)+1; }
  const maxBucket = Math.max(...Object.values(buckets));
  dimResults[d] = {
    count: n,
    mean: Math.round(mean*100)/100,
    standardDeviation: Math.round(stdDev*100)/100,
    min, max,
    under10Ratio: Math.round(under10*10000)/10000,
    over90Ratio: Math.round(over90*10000)/10000,
    largestTenPointBucketRatio: Math.round(maxBucket/n*10000)/10000
  };
}

const isFail = nanCount>0 || undefinedCount>0 || outOfRange>0 || missingCatCount>0 || missingPairCount>0 || reproFailures>0;
let isWarn = false;
for (const d of dims) { if (dimResults[d].standardDeviation < 5) isWarn = true; if (dimResults[d].largestTenPointBucketRatio > 0.7) isWarn = true; }
const status = isFail ? "FAIL" : isWarn ? "WARN" : "PASS";

const result = {
  engineSource: "src/js/core.js",
  engineFunction: "Zero1Matrix.scoreReadingDetailed",
  totalCasts: 10000,
  nanCount, undefinedCount, outOfRangeCount: outOfRange,
  missingCategoryRecords: missingCatCount,
  missingPairRecords: missingPairCount,
  reproducibilityCases: repCases.length,
  reproducibilityFailures: reproFailures,
  dimensions: dimResults,
  status,
  exitCode: isFail ? 1 : 0
};

const resultDir = path.join(rootDir, "tests", "results");
if (!fs.existsSync(resultDir)) fs.mkdirSync(resultDir, { recursive: true });
fs.writeFileSync(path.join(resultDir, "score-calibration-results.json"), JSON.stringify(result, null, 2));
fs.writeFileSync(path.join(resultDir, "score-calibration-results.data.js"), "window.Zero1MatrixScoreCalibration = " + JSON.stringify(result) + ";");

console.log(`\n=== Score Calibration Results ===`);
console.log(`Status: ${status}`);
console.log(`Reproducibility: ${reproFailures}/${repCases.length} failures`);
for (const d of dims) {
  const s = dimResults[d];
  console.log(`  ${d.padEnd(10)} n=${String(s.count).padStart(5)} mean=${String(s.mean).padStart(6)} std=${String(s.standardDeviation).padStart(5)} bucketMax=${String(Math.round(s.largestTenPointBucketRatio*100)).padStart(3)}%`);
}

process.exit(result.exitCode);
