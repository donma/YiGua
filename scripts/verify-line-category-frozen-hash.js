const fs = require("fs"), crypto = require("crypto"), vm = require("vm"), path = require("path");
const root = process.argv[2] ? path.resolve(process.argv[2]) : path.resolve(__dirname, "..");
const wave = process.argv[3];
const start = parseInt(process.argv[4]);
const end = parseInt(process.argv[5]);
if (!wave || isNaN(start) || isNaN(end)) {
    console.log("Usage: node scripts/verify-line-category-frozen-hash.js <root> <wave> <startHex> <endHex>");
    console.log("  wave: 01, 02, ... 16");
    console.log("  startHex/endHex: e.g. 1 4 for wave 01");
    process.exitCode = 1;
} else {
    const frozenPath = path.join(root, "scripts", "frozen_linecat_wave_" + wave + ".json");
    if (!fs.existsSync(frozenPath)) { console.log("FAIL: frozen file not found: " + frozenPath); process.exitCode = 1; }
    else {
        const frozen = JSON.parse(fs.readFileSync(frozenPath, "utf8"));
        function loadData(fp) { let c = fs.readFileSync(fp,"utf8"); const s = { window: { Zero1MatrixData: {} }, console }; vm.createContext(s); vm.runInContext(c,s); return s.window.Zero1MatrixData; }
        const lc = loadData(path.join(root, "src", "data", "lineCategoryInterpretations.data.js"));
        const arr = lc.lineCategoryInterpretations.filter(x => x.hexagramId >= start && x.hexagramId <= end);
        const curr = crypto.createHash("sha256").update(JSON.stringify(arr)).digest("hex");
        if (curr === frozen.hash) { console.log("Wave " + wave + " (" + start + "-" + end + "): VERIFIED (" + arr.length + " entries)"); }
        else { console.log("Wave " + wave + " (" + start + "-" + end + "): CHANGED! Frozen hash does not match current data."); process.exitCode = 1; }
    }
}
