const fs=require("fs"),p=require("path"),root=p.resolve("D:\\AI_PROJECTS\\Zero1Matrix"),d=p.join(root,"src","data");
const ci=JSON.parse((()=>{const x=fs.readFileSync(p.join(d,"categoryInterpretations.data.js"),"utf8");return x.substring(x.indexOf("= [")+2,x.lastIndexOf("];")+1);})());

const replace={
"在資訊最少的時刻做出的決定往往最難逆轉——這是所有決策者最應該警惕的陷阱。":{2:"坤卦的決策智慧：含章可貞——你已經有足夠的判斷力，不一定是現在就要用——在資訊最少的時刻，等待比決定更需要勇氣。",3:"屯卦的決策智慧：即鹿無虞——沒有足夠的資訊與嚮導，任何決定都是賭博——在磐桓期，不做決定就是最好的決定。",4:"蒙卦的決策智慧：困蒙——因為不了解而做出的決定，是所有決策中最危險的一種。",},
"市場上最危險的時刻不是虧損的時候，而是賺錢之後的過度自信——亢龍有悔式的擴張是創業的頭號殺手。":{2:"坤卦的經營智慧：履霜堅冰至——市場的轉折往往從最微小的訊號開始——賺錢之後的第一件事不是擴張，是觀察。",3:"屯卦的經營智慧：屯其膏——資源才剛開始到位，此時的過度擴張是最經典的創業死亡模式。",4:"蒙卦的經營智慧：困蒙——對市場的無知不會因為賺了錢就消失——持續學習是唯一的保護。",},
"修行路上最難的不是精進，而是在看似沒有進步的時候仍然相信自己在路上——磐桓不是退步，是必經的沉潛。":{2:"坤卦的修行智慧：履霜堅冰至——修行中最細微的內在變化往往是最重要的——不要因為表面沒有進步就放棄。",3:"屯卦的修行智慧：磐桓——修行初期最無奈的感受是原地踏步，但這不是退步，是根基正在形成。",4:"蒙卦的修行智慧：童蒙吉——修行不是為了成為大師，是為了永遠保持初學者的心——那才是最接近道的狀態。",},
};

for(const [old,hexMap] of Object.entries(replace)){
  for(const x of ci){
    if(x.hexagramId<2||x.hexagramId>4)continue;
    const r=hexMap[x.hexagramId];
    if(r&&(x.meaning||"").includes(old))x.meaning=x.meaning.replace(old,r);
  }
}

fs.writeFileSync(p.join(d,"categoryInterpretations.data.js"),"window.Zero1MatrixData = window.Zero1MatrixData || {};\nwindow.Zero1MatrixData.categoryInterpretations = "+JSON.stringify(ci)+";");

// Re-scan
function splitSentences(text){return (text||"").split(/[。！？；!?;]/).map(s=>s.trim()).filter(s=>s.length>=8);}
const ci14=ci.filter(x=>x.hexagramId>=1&&x.hexagramId<=4);
const sentMap={};
for(const x of ci14){for(const field of ["meaning","advice","warning","timing"]){const sents=splitSentences(x[field]||"");for(const s of sents){if(!sentMap[s])sentMap[s]={count:0};sentMap[s].count++;}}}
const contentDups=Object.entries(sentMap).filter(([s,v])=>v.count>2&&!s.includes("本欄不做"));
console.log("Content duplicates (>2, excl safety): "+contentDups.length);
if(contentDups.length===0)console.log("ALL CONTENT DUPLICATES RESOLVED!");
else{for(const [s,v] of contentDups)console.log("COUNT="+v.count+": \""+s.substring(0,50)+"...\"");}