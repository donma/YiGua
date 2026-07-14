const fs = require("fs"), crypto = require("crypto"), vm = require("vm"), path = require("path");
const root = process.argv[2] ? path.resolve(process.argv[2]) : path.resolve(__dirname, "..");
const wave = process.argv[3];
const force = process.argv.includes("--force");
if (!wave || !["A","B","C","D","E"].includes(wave.toUpperCase())) {
    console.log("Usage: node scripts/create-wave-frozen-hash.js <root> <wave> [--force]");
    console.log("  wave: A, B, C, D, or E");
    process.exitCode = 1; return;
}
const w = wave.toUpperCase();
const lo = w === "A" ? 25 : w === "B" ? 33 : w === "C" ? 41 : w === "D" ? 49 : 57;
const hi = lo + 7;
const frozenPath = path.join(root, "scripts", "frozen_wave_" + w.toLowerCase() + ".json");
if (fs.existsSync(frozenPath) && !force) {
    console.log("ERROR: " + frozenPath + " already exists. Use --force to overwrite.");
    process.exitCode = 1; return;
}
function loadData(fp) { let c = fs.readFileSync(fp,"utf8"); const s = { window: { Zero1MatrixData: {} }, console }; vm.createContext(s); vm.runInContext(c,s); return s.window.Zero1MatrixData; }
function hs(d) { return crypto.createHash("sha256").update(JSON.stringify(d)).digest("hex"); }
const dataDir = path.join(root, "src", "data");
const cat = loadData(path.join(dataDir, "categoryInterpretations.data.js"));
const refl = loadData(path.join(dataDir, "reflectionQuestions.data.js"));
const catArr = cat.categoryInterpretations, reflArr = refl.reflectionQuestions;
const frozen = {
    wave: w, scope: "hex " + lo + "-" + hi,
    cat: hs(catArr.filter(x => x.hexagramId >= lo && x.hexagramId <= hi)),
    refl: hs(reflArr.filter(x => x.hexagramId >= lo && x.hexagramId <= hi)),
};
fs.writeFileSync(frozenPath, JSON.stringify(frozen, null, 2));
console.log("Frozen hash created: " + frozenPath);
console.log("  Cat:  " + frozen.cat);
console.log("  Refl: " + frozen.refl);