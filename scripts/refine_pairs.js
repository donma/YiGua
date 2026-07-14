// refine_pairs.js - Generates refined pair interpretation entries
// Reads hexagram data and pairExpansionTop300Todo to generate refined content
// Outputs JSON snippets to be merged into pairInterpretations.data.js

const fs = require('fs');
const path = require('path');

// Read hexagram data for tone/name info
const hexDataRaw = fs.readFileSync(
  'D:/AI_PROJECTS/ZERO1MATRIX/src/data/hexagrams.data.js', 'utf8'
);

// Extract hexagram info using regex
const hexMap = {};
const hexRegex = /"id":\s*(\d+)[\s\S]*?"name":\s*"([^"]+)"[\s\S]*?"fullName":\s*"([^"]+)"[\s\S]*?"tone":\s*"([^"]+)"[\s\S]*?"judgement":\s*"([^"]+)"/g;
let m;
while ((m = hexRegex.exec(hexDataRaw)) !== null) {
  hexMap[parseInt(m[1])] = {
    name: m[2],
    fullName: m[3],
    tone: m[4],
    judgement: m[5]
  };
}

// Read TODO list
const todoRaw = fs.readFileSync(
  'D:/AI_PROJECTS/ZERO1MATRIX/src/data/pairExpansionTop300.todo.data.js', 'utf8'
);

const pairs = [];
const pairRegex = /"id":\s*"([^"]+)"[\s\S]*?"from":\s*(\d+)[\s\S]*?"to":\s*(\d+)[\s\S]*?"priority":\s*"([^"]+)"/g;
while ((m = pairRegex.exec(todoRaw)) !== null) {
  pairs.push({ id: m[1], from: parseInt(m[2]), to: parseInt(m[3]), priority: m[4] });
}

// Generate refined content for each pair
const toneMap = {
  '剛健開創': '由進轉守',
  '厚載承順': '由守轉進',
  '開局艱難': '由亂入合',
  '啟蒙養正': '由閉轉通',
  '等待時機': '由動轉止',
  '爭訟對立': '由爭轉和',
  '統帥用兵': '由爭轉和',
  '親附和合': '由散轉聚',
  '小有積蓄': '由未成轉既成',
  '謹慎前行': '由進轉守',
  '通泰安和': '由盛轉衰',
  '閉塞不通': '由閉轉通',
  '與人和同': '由散轉聚',
  '大有收穫': '由既成轉未穩',
  '謙遜退讓': '由進轉守',
  '愉悅安樂': '由盛轉衰',
  '追隨順應': '由止轉動',
  '整治積弊': '由衰轉復',
  '臨近督導': '由內修轉外放',
  '觀察省思': '由外求轉內修',
  '決斷刑獄': '由爭轉和',
  '文飾修飾': '由內修轉外放',
  '剝落衰敗': '由衰轉復',
  '回歸復始': '由衰轉復',
  '真實無妄': '由亂入合',
  '大有積蓄': '由既成轉未穩',
  '頤養生息': '由止轉動',
  '過度失衡': '由盛轉衰',
  '重險深陷': '由險轉順',
  '附麗光明': '由閉轉通',
  '感應互動': '由止轉動',
  '恆常持久': '由既成轉未穩',
  '退避隱藏': '由進轉守',
  '強盛壯大': '由盛轉衰',
  '前進上升': '由止轉動',
  '光明受阻': '由順入險',
  '家人相處': '由內修轉外放',
  '乖離對立': '由和轉爭',
  '艱難險阻': '由險轉順',
  '解除困難': '由險轉順',
  '減損節制': '由進轉守',
  '增益助長': '由衰轉復',
  '決斷果敢': '由爭轉和',
  '相遇遇合': '由散轉聚',
  '會聚集結': '由散轉聚',
  '上升進取': '由止轉動',
  '困厄受制': '由險轉順',
  '井養不窮': '由閉轉通',
  '變革改革': '由衰轉復',
  '鼎立更新': '由衰轉復',
  '震動驚變': '由順入險',
  '靜止安守': '由動轉止',
  '漸進累積': '由未成轉既成',
  '歸屬婚嫁': '由散轉聚',
  '豐盛充盈': '由既成轉未穩',
  '旅居在外': '由順入險',
  '巽順深入': '由外求轉內修',
  '喜悅和樂': '由散轉聚',
  '渙散離析': '由分裂轉凝聚',
  '節制有度': '由進轉守',
  '中道誠信': '由散轉聚',
  '小有過度': '由進轉守',
  '事已成就': '由既成轉未穩',
  '事未成就': '由亂入合'
};

const defaultTone = '由進轉守';

function generateSummary(from, to) {
  const f = hexMap[from] || { name: '?', fullName: '?', tone: '?' };
  const t = hexMap[to] || { name: '?', fullName: '?', tone: '?' };
  return `本卦${f.fullName}代表當前局勢呈現「${f.tone}」的特質，變為${t.fullName}則表示後勢逐步轉向「${t.tone}」。此變化不是立刻轉換，而是提醒你：看清本卦指出的當前限制，順著變卦給出的方向調整，才能讓局勢往好的方向發展。`;
}

function generateAdvice(from, to) {
  const f = hexMap[from] || { name: '?' };
  const t = hexMap[to] || { name: '?' };
  return `不要只看本卦的現況就急著下判斷。先理解${f.name}卦當前給你的提醒是什麼，再用${t}卦的方向來調整下一步。若問工作，宜先穩住基礎，再看後勢機會；若問關係，宜先處理當前矛盾，再考慮未來走向。`;
}

function generateRisk(from, to) {
  const f = hexMap[from] || { name: '?' };
  const t = hexMap[to] || { name: '?' };
  return `最大的風險是只看變卦的結果，卻不處理本卦${f.name}的問題。另一風險是把${t}卦的趨勢當成必然，忽略了中間需要你主動調整的過程。`;
}

function generateTiming(from, to) {
  const t = hexMap[to] || { name: '?' };
  return `先安頓，再轉向；先觀察${t.name}卦的訊號出現，再順勢而行。不宜在本卦問題未解時急著轉變。`;
}

function getTransitionTone(from, to) {
  const f = hexMap[from] || { tone: '' };
  const t = hexMap[to] || { tone: '' };
  return toneMap[t.tone] || defaultTone;
}

function getScoreAdjust(from, to) {
  const base = { clarity: 4, action: 3, risk: -2, change: 8, support: 5, timing: 2 };
  const fTone = (hexMap[from] || {}).tone || '';
  const tTone = (hexMap[to] || {}).tone || '';
  if (fTone.includes('險') || fTone.includes('困')) { base.risk -= 3; base.clarity -= 1; }
  if (tTone.includes('順') || tTone.includes('通')) { base.clarity += 2; base.support += 3; }
  if (fTone.includes('開創') || fTone.includes('進')) { base.action += 2; base.change += 2; }
  if (tTone.includes('守') || tTone.includes('止')) { base.action -= 2; base.timing -= 1; }
  return base;
}

const results = [];
for (const p of pairs) {
  const f = hexMap[p.from] || { name: '?' };
  const t = hexMap[p.to] || { name: '?' };
  results.push({
    id: p.id,
    from: p.from,
    to: p.to,
    transitionTone: getTransitionTone(p.from, p.to),
    summary: generateSummary(p.from, p.to),
    advice: generateAdvice(p.from, p.to),
    risk: generateRisk(p.from, p.to),
    timing: generateTiming(p.from, p.to),
    basis: [f.name, t.name, '卦辭', '象辭'],
    scoreAdjust: getScoreAdjust(p.from, p.to),
    needsExpansion: false,
    needsHumanReview: true
  });
}

fs.writeFileSync(
  'D:/AI_PROJECTS/ZERO1MATRIX/scripts/pair_refined_data.json',
  JSON.stringify(results, null, 2),
  'utf8'
);
console.log(`Generated ${results.length} refined pair entries.`);
