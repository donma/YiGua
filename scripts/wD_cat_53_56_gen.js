// Content generator for hex 53-56 category interpretations
// This script generates the wD_cat_53_56_content.json file
const fs = require('fs');
const path = require('path');

const hex53 = require('./wD_cat_53_content.js');
const hex54 = require('./wD_cat_54_content.js');
const hex55 = require('./wD_cat_55_content.js');
const hex56 = require('./wD_cat_56_content.js');

const content = { hex53, hex54, hex55, hex56 };
const outPath = path.join(__dirname, 'wD_cat_53_56_content.json');
fs.writeFileSync(outPath, JSON.stringify(content, null, 2), 'utf8');
console.log('Content JSON written to:', outPath);