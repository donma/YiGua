const fs=require("fs"),p=require("path"),root=p.resolve("D:\\AI_PROJECTS\\Zero1Matrix"),d=p.join(root,"src","data");
const ci=JSON.parse((()=>{const x=fs.readFileSync(p.join(d,"categoryInterpretations.data.js"),"utf8");return x.substring(x.indexOf("= [")+2,x.lastIndexOf("];")+1);})());

// Replace shared per-category suffix sentences with hex-specific versions
const suffixReplace={
"在資金管理上，這個階段的核心守則是寧可保守也不要因恐慌而冒進。":{2:"坤卦的財務智慧是直方大——做你懂的投資，不懂的不要碰，這比任何高明的策略都更持久。",3:"屯卦的財務智慧是磐桓利居貞——資金在最緊張的時候，站穩比前進更重要。",4:"蒙卦的財務智慧是發蒙——先建立最基本的理財認識，再談投資。",},
"人際互動的品質不取決於你說了多少，而取決於你在關鍵時刻的沉默與包容。":{2:"坤卦的人際智慧是黃裳元吉——你在群體中的地位越高，姿態應該越低。",3:"屯卦的人際智慧是利建侯——新關係中最重要的不是說得多好，是找到對的人。",4:"蒙卦的人際智慧是童蒙吉——對每個人都保持初次見面的好奇與尊重。",},
"家庭的穩定不是來自完美的規劃，而是來自對微小變化的持續關注與及時調整。":{2:"坤卦的家庭智慧是履霜堅冰至——家庭中最微小的訊號往往預示著最大的趨勢。",3:"屯卦的家庭智慧是磐桓——新家庭的初期磨合是必然的，完美是一個過程而非起點。",4:"蒙卦的家庭智慧是發蒙——家庭中每個成員都在學習如何與彼此相處。",},
"學習的本質不是知識的堆積，而是認知的重新組織——每一次瓶頸都是一次重組的機會。":{2:"坤卦的學習智慧是含章可貞——知識不急著展現，讓它自然沉澱才能成為真正的智慧。",3:"屯卦的學習智慧是即鹿無虞——學習中最怕的不是學不會，而是沒有老師引導。",4:"蒙卦的學習智慧是匪我求童蒙——學習的動力必須來自你自己。",},
"它的恢復力來自規律與休息的平衡，而非更多的意志力——這是卦象在健康上最核心的提醒。":{2:"坤卦的健康智慧是履霜堅冰至——身體的微小不適是最重要的健康線索，不要等到堅冰形成才行動。",3:"屯卦的健康智慧是磐桓——身體在適應新節奏的初期最脆弱，給它時間而非壓力。",4:"蒙卦的健康智慧是困蒙——對自己身體的無知是健康最大的風險。",},
"精準的減損比盲目的增益更需要智慧——這是卦象對資金管理最核心的建議。":{2:"坤卦的資金建議：含章可貞——資金正在累積時不一定是全部進場的時機。",3:"屯卦的資金建議：屯其膏——資源開始到位但仍不足，此時保守比擴張更安全。",4:"蒙卦的資金建議：困蒙而不求教是財務上最危險的無知。",},
"真正的影響力不是來自你說了什麼，而是來自你傾聽與承載的能力。":{2:"坤卦的人際建議：括囊——在某些場合，最有力的發言是不發言。",3:"屯卦的人際建議：乘馬班如——當溝通卡住時，引入第三方來居中協調。",4:"蒙卦的人際建議：包蒙——包容他人溝通中的不成熟。",},
"家庭中最有力量的姿態不是指揮，而是陪伴——陪伴本身就是最深的承載。":{2:"坤卦的家庭建議：直方大——以正直寬厚的態度對待家人，不需要矯飾。",3:"屯卦的家庭建議：乘馬班如——家庭壓力太大時，開口求助比硬撐更有力量。",4:"蒙卦的家庭建議：童蒙吉——以孩子般的好奇心去理解家人。",},
"學習中最大的陷阱是以為自己已經懂了——童蒙吉，保持初學者的心態永遠是最好的學習方法。":{2:"坤卦的學習建議：直方大——學習方式本身要正直穩健，不要投機取巧。",3:"屯卦的學習建議：乘馬班如——當你卡在學習高原期，找同學一起討論。",4:"蒙卦的學習建議：發蒙——建立固定的學習時間與方法，這是最基本的紀律。",},
"身體給你的每一個訊號都是有原因的——不要用忙碌來壓過疲勞，不要用意志力來否認疼痛。":{2:"坤卦的健康建議：括囊——疲勞時減少社交與消耗，給自己完整的休息空間。",3:"屯卦的健康建議：泣血漣如——不要在身體最脆弱的時候再給它壓力。",4:"蒙卦的健康建議：發蒙——建立最基本的作息規律，這是健康管理的起點。",},
"猶豫不是懦弱——在資訊不足時不做決定，本身就是一個勇敢的決定。":{2:"坤卦的決策建議：括囊——在某些時刻，最好的決策是暫緩決策。",3:"屯卦的決策建議：磐桓利居貞——資訊最少時不決定，站穩比冒進更明智。",4:"蒙卦的決策建議：困蒙——因為無知做出的決定比延遲決定更危險。",},
"營運的安全感不在於規模，在於每天的現金流管理——終日乾乾用在經營上就是這個意思。":{2:"坤卦的經營建議：含章可貞——公司的核心競爭力不需要對外炫耀。",3:"屯卦的經營建議：利建侯——先建立初始團隊與種子用戶，規模是後面的事。",4:"蒙卦的經營建議：困蒙——最危險的創業者是對自己行業一知半解的。",},
"修行不是為了成為更好的自己——是為了放下那個一直想成為更好的自己的執著。":{2:"坤卦的修行建議：黃裳元吉——最高的修行者穿最素的衣服。",3:"屯卦的修行建議：磐桓——修行初期的原地踏步不是退步，是必經的沉潛。",4:"蒙卦的修行建議：匪我求童蒙——修行不是別人求你，是你自己主動求道。",},
};

for(const [oldSent,hexMap] of Object.entries(suffixReplace)){
  for(const x of ci){
    if(x.hexagramId<2||x.hexagramId>4)continue;
    const replacement=hexMap[x.hexagramId];
    if(replacement&&(x.meaning||"").includes(oldSent))x.meaning=x.meaning.replace(oldSent,replacement);
    if(replacement&&(x.advice||"").includes(oldSent))x.advice=x.advice.replace(oldSent,replacement);
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
if(contentDups.length>0){for(const [s,v] of contentDups)console.log("COUNT="+v.count+": \""+s.substring(0,50)+"...\"");}
else console.log("ALL CONTENT DUPLICATES RESOLVED!");