const fs = require("fs"), vm = require("vm"), path = require("path");
const dataDir = path.resolve("D:\\AI_PROJECTS\\Zero1Matrix\\src\\data");
function loadData(fp) { let c = fs.readFileSync(fp,"utf8"); const s = { window: { Zero1MatrixData: {} }, console }; vm.createContext(s); vm.runInContext(c,s); return s.window.Zero1MatrixData; }
const lc = loadData(path.join(dataDir, "lineCategoryInterpretations.data.js"));
const ciW = lc.lineCategoryInterpretations.filter(x => x.hexagramId >= 9 && x.hexagramId <= 12);
const sk = ["此為","結合","起步階段","力量尚未成熟","觀察準備","貿然行動","保持彈性","順勢而為","審慎評估","多加溝通","等待成熟","在此分類中","建議先理解"];
const tTxt = ciW.map(x => (x.meaning||"")+(x.advice||"")+(x.warning||"")).join(" ");
for (const s of sk) {
    const esc = s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const m = tTxt.match(new RegExp(esc, "g"));
    if (m && m.length > 0) {
        const hits = ciW.filter(x => ((x.meaning||"")+(x.advice||"")+(x.warning||"")).includes(s));
        console.log('"' + s + '" ' + m.length + "x, e.g.: " + (hits[0]?.id||"") + " [" + hits[0]?.categoryName + "]");
    }
}
