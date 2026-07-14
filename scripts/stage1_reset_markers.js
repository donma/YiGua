const fs = require('fs');
const vm = require('vm');

function loadData(filePath) {
    let code = fs.readFileSync(filePath, 'utf8');
    const sandbox = { window: { Zero1MatrixData: {} }, console };
    vm.createContext(sandbox);
    vm.runInContext(code, sandbox);
    return sandbox.window.Zero1MatrixData;
}

function getPrefix(filePath, arrayKey) {
    const content = fs.readFileSync(filePath, 'utf8');
    const marker = arrayKey + ' = [';
    const idx = content.indexOf(marker);
    if (idx === -1) throw new Error(`Could not find "${marker}" in ${filePath}`);
    return content.substring(0, idx + marker.length - 1);
}

const TARGET_CATEGORIES = ['general', 'career', 'love', 'people', 'family', 'study', 'decision', 'spiritual'];
const HEX_MIN = 9;
const HEX_MAX = 16;

const catPath = 'D:\\AI_PROJECTS\\Zero1Matrix\\src\\data\\categoryInterpretations.data.js';
const reflPath = 'D:\\AI_PROJECTS\\Zero1Matrix\\src\\data\\reflectionQuestions.data.js';

// ── Load data ──────────────────────────────────────────────
console.log('Loading catePoryInterpretations...');
const catData = loadData(catPath);
const catEntries = catData.categoryInterpretations;
console.log(`  Total entries: ${catEntries.length}`);

console.log('Loading reflectionQuestions...');
const reflData = loadData(reflPath);
const reflEntries = reflData.reflectionQuestions;
console.log(`  Total entries: ${reflEntries.length}`);

// ── Filter & reset category entries ────────────────────────
let catChanged = 0;
for (const entry of catEntries) {
    if (
        entry.hexagramId >= HEX_MIN && entry.hexagramId <= HEX_MAX &&
        TARGET_CATEGORIES.includes(entry.category)
    ) {
        entry.qualityLevel = 'refined';
        entry.reviewed = false;
        entry.needsHumanReview = true;
        catChanged++;
    }
}
console.log(`Category entries reset: ${catChanged}`);

// ── Filter & reset reflection entries ──────────────────────
let reflChanged = 0;
for (const entry of reflEntries) {
    if (entry.hexagramId >= HEX_MIN && entry.hexagramId <= HEX_MAX) {
        entry.qualityLevel = 'refined';
        entry.reviewed = false;
        entry.needsHumanReview = true;
        reflChanged++;
    }
}
console.log(`Reflection entries reset: ${reflChanged}`);

// ── Write files ────────────────────────────────────────────
const catPrefix = getPrefix(catPath, 'categoryInterpretations');
const catOut = catPrefix + ' = ' + JSON.stringify(catEntries) + ';';
fs.writeFileSync(catPath, catOut, 'utf8');
console.log(`Wrote: ${catPath}`);

const reflPrefix = getPrefix(reflPath, 'reflectionQuestions');
const reflOut = reflPrefix + ' = ' + JSON.stringify(reflEntries) + ';';
fs.writeFileSync(reflPath, reflOut, 'utf8');
console.log(`Wrote: ${reflPath}`);

console.log('Done.');
