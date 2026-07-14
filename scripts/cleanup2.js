const fs=require("fs"),p=require("path"),root=p.resolve("D:\\AI_PROJECTS\\Zero1Matrix"),d=p.join(root,"src","data");
const ci=JSON.parse((()=>{const x=fs.readFileSync(p.join(d,"categoryInterpretations.data.js"),"utf8");return x.substring(x.indexOf("= [")+2,x.lastIndexOf("];")+1);})());

// Hex 3 non-core meaning: replace the shared intro sentences with per-category versions
const h3meaningStart={money:"水雷屯的開局艱難應用於財務金錢，代表資金正處於最初始的累積階段。",people:"水雷屯的開局艱難應用於人際合作，代表關係正處於最初始的建立階段。",family:"水雷屯的開局艱難應用於家庭親人，代表家庭模式正處於最初始的調整階段。",study:"水雷屯的開局艱難應用於學習考試，代表知識正處於最初始的建構階段。",health:"水雷屯的開局艱難應用於身心狀態，代表身體正處於最初始的適應階段。",decision:"水雷屯的開局艱難應用於重大決策，代表判斷力正處於最初始的資訊蒐集階段。",business:"水雷屯的開局艱難應用於創業經營，代表事業正處於最初始的草創階段。",spiritual:"水雷屯的開局艱難應用於心境修行，代表修行正處於最初始的摸索階段。"};

for(const c of ["money","people","family","study","health","decision","business","spiritual"]){
  const e=ci.find(x=>x.id==="hex-003-"+c);if(!e)continue;
  // Replace the shared first sentence with per-cat version
  e.meaning=h3meaningStart[c]+" "+e.meaning.replace(/^水雷屯的開局艱難應用於.+?階段。\s*/,"");
  // Replace any remaining shared "磐桓" + "乘馬班如" template
  e.meaning=e.meaning.replace(/磐桓——你可能感覺做什麼都不順，這不是因為能力不足，而是結構性的開局困境。/,"");
  e.meaning=e.meaning.replace(/乘馬班如——連馬都在原地打轉，在最僵滯的時刻尋求外部幫助是唯一的出路。/,"");
}

fs.writeFileSync(p.join(d,"categoryInterpretations.data.js"),"window.Zero1MatrixData = window.Zero1MatrixData || {};\nwindow.Zero1MatrixData.categoryInterpretations = "+JSON.stringify(ci)+";");

// Re-scan
function splitSentences(text){return (text||"").split(/[。！？；!?;]/).map(s=>s.trim()).filter(s=>s.length>=8);}
const ci14=ci.filter(x=>x.hexagramId>=1&&x.hexagramId<=4);
const sentMap={};
for(const x of ci14){for(const field of ["meaning","advice","warning","timing"]){const sents=splitSentences(x[field]||"");for(const s of sents){if(!sentMap[s])sentMap[s]={count:0};sentMap[s].count++;}}}
const contentDups=Object.entries(sentMap).filter(([s,v])=>v.count>2&&!s.includes("本欄不做"));
console.log("Content duplicate sentences (>2, excluding safety): "+contentDups.length);
if(contentDups.length>0){for(const [s,v] of contentDups.slice(0,5))console.log("COUNT="+v.count+": \""+s.substring(0,50)+"...\"");}
else console.log("ALL CONTENT DUPLICATES RESOLVED");