const fs = require("fs"), crypto = require("crypto"), vm = require("vm"), path = require("path");
const root = process.argv[2] ? path.resolve(process.argv[2]) : path.resolve(__dirname, "..");
const wave = process.argv[3];
const force = process.argv.includes("--force");
if (!wave || !/^\d{2}$/.test(wave)) {
    console.log("Usage: node scripts/create-line-category-frozen-hash.js <root> <wave> [--force]");
    console.log("  wave: 01, 02, ... 16");
    process.exitCode = 1; return;
}
const lo = (parseInt(wave) - 1) * 4 + 1;
const hi = lo + 3;
const frozenPath = path.join(root, "scripts", "frozen_linecat_wave_" + wave + ".json");
if (fs.existsSync(frozenPath) && !force) {
    console.log("ERROR: " + frozenPath + " already exists. Use --force to overwrite.");
    process.exitCode = 1; return;
}
function loadData(fp) { let c = fs.readFileSync(fp,"utf8"); const s = { window: { Zero1MatrixData: {} }, console }; vm.createContext(s); vm.runInContext(c,s); return s.window.Zero1MatrixData; }
function hs(d) { return crypto.createHash("sha256").update(JSON.stringify(d)).digest("hex"); }
const dataDir = path.join(root, "src", "data");
const lc = loadData(path.join(dataDir, "lineCategoryInterpretations.data.js"));
const arr = lc.lineCategoryInterpretations.filter(x => x.hexagramId >= lo && x.hexagramId <= hi);
const frozen = { wave: wave, scope: "hex " + lo + "-" + hi, hash: hs(arr) };
fs.writeFileSync(frozenPath, JSON.stringify(frozen, null, 2));
console.log("Frozen hash created: " + frozenPath);
console.log("  Wave " + wave + " (" + lo + "-" + hi + "): " + arr.length + " entries");
console.log("  Hash: " + frozen.hash);
