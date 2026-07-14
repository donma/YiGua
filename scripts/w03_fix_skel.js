const fs = require("fs"), vm = require("vm"), path = require("path");
const dataDir = path.resolve("D:\\AI_PROJECTS\\Zero1Matrix\\src\\data");
function loadData(fp) { let c = fs.readFileSync(fp,"utf8"); const s = { window: { Zero1MatrixData: {} }, console }; vm.createContext(s); vm.runInContext(c,s); return s.window.Zero1MatrixData; }
const lc = loadData(path.join(dataDir, "lineCategoryInterpretations.data.js"));
const arr = lc.lineCategoryInterpretations;

const fixes = {};
// Find hex 11 entries with "結合"
const hex11 = arr.filter(x => x.hexagramId === 11);
for (const e of hex11) {
    for (const f of ["meaning","advice","warning"]) {
        if ((e[f]||"").includes("結合")) {
            e[f] = e[f].replace(/結合/g, "融合");
            if (!fixes[e.id]) fixes[e.id] = [];
            fixes[e.id].push(f + ": 結合→融合");
        }
    }
}
// Fix "保持彈性" and "審慎評估"
for (const e of arr) {
    if (e.hexagramId >= 9 && e.hexagramId <= 12) {
        for (const f of ["meaning","advice","warning"]) {
            if ((e[f]||"").includes("保持彈性")) {
                e[f] = e[f].replace("保持彈性", "保留調整餘地");
                if (!fixes[e.id]) fixes[e.id] = [];
                fixes[e.id].push(f + ": 保持彈性→保留調整餘地");
            }
            if ((e[f]||"").includes("審慎評估")) {
                e[f] = e[f].replace("審慎評估", "仔細核對");
                if (!fixes[e.id]) fixes[e.id] = [];
                fixes[e.id].push(f + ": 審慎評估→仔細核對");
            }
        }
    }
}

console.log("Fixed entries:", Object.keys(fixes).length);
for (const [id, changes] of Object.entries(fixes)) console.log("  " + id + ": " + changes.join(", "));

const prefix = "window.Zero1MatrixData = window.Zero1MatrixData || {};\n";
fs.writeFileSync(path.join(dataDir, "lineCategoryInterpretations.data.js"), prefix + "window.Zero1MatrixData.lineCategoryInterpretations = " + JSON.stringify(arr) + ";", "utf8");
