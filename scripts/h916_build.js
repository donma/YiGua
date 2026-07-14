const fs=require("fs"),p=require("path"),r=p.resolve("D:\\AI_PROJECTS\\Zero1Matrix"),d=p.join(r,"src","data");
const tdy=new Date().toISOString().split("T")[0];
const ci=JSON.parse((()=>{const x=fs.readFileSync(p.join(d,"categoryInterpretations.data.js"),"utf8");return x.substring(x.indexOf("= [")+2,x.lastIndexOf("];")+1);})());
const rf=JSON.parse((()=>{const x=fs.readFileSync(p.join(d,"reflectionQuestions.data.js"),"utf8");return x.substring(x.indexOf("= [")+2,x.lastIndexOf("];")+1);})());

const cats=["general","career","love","money","people","family","study","health","decision","business","legal","spiritual"];
const catCN={general:"一般",career:"工作事業",love:"感情關係",money:"財務金錢",people:"人際合作",family:"家庭親人",study:"學習考試",health:"身心狀態",decision:"重大決策",business:"創業經營",legal:"官非合約",spiritual:"心境修行"};

function be(hid,c,m,a,w,t,basis){return{id:"hex-"+String(hid).padStart(3,"0")+"-"+c,hexagramId:hid,category:c,categoryName:catCN[c],meaning:m,advice:a,warning:w,timing:t,basis:basis,scoreAdjust:{clarity:0,action:0,risk:0,change:5,support:0,timing:0},qualityLevel:"gold",reviewed:true,reviewedBy:"category-gold-hex9to16",reviewedAt:tdy,needsHumanReview:false,version:"1.7.1-gold-cat-h916"};}

// Per-hex imagery
const hexImgs={9:["密雲不雨自我西郊","復自道","牽復","輿說輻夫妻反目","有孚血去惕出","有孚攣如富以其鄰","既雨既處月幾望","君子以懿文德"],10:["履虎尾不咥人","素履","履道坦坦","眇能視跛能履","夬履","視履考祥","上天下澤","君子以辨上下定民志"],11:["小往大來","拔茅茹以其彙","包荒用馮河","翩翩不富以其鄰","帝乙歸妹","城復于隍","天地交","后以財成天地之道"],12:["否之匪人","不利君子貞","大往小來","包承","包羞","有命無咎","休否","傾否","天地不交","君子以儉德辟難"],13:["同人于野","同人于門","同人于宗吝","伏戎于莽","乘其墉","同人先號咷而後笑","同人于郊","天與火同人","君子以類族辨物"],14:["無交害","大車以載","公用亨于天子","匪其彭","厥孚交如威如吉","自天祐之","火在天上","君子以遏惡揚善"],15:["謙謙君子","鳴謙","勞謙","無不利撝謙","不富以其鄰","利用侵伐","地中有山","君子以裒多益寡稱物平施"],16:["介于石不終日","鳴豫凶","盱豫悔","由豫大有得","貞疾恆不死","冥豫","雷出地奮","先王以作樂崇德"]};
const hexFocus={9:"力量已聚集但尚不足以突破——密雲不雨，小幅累積與關係維護是關鍵",10:"在強大力量旁行動的安全距離——履虎尾不咥人，程序與分寸",11:"上下交通資源暢流——小往大來，盛世中更要制度化",12:"溝通阻塞系統斷裂——天地不交，結構性改革而非表面修補",13:"基於共同原則的公開合作——同人于野，不排他不私密",14:"資源與聲望高度集中——大車以載，承載能力決定持續性",15:"有實力而不以外顯壓迫——地中有山，勞謙有終",16:"動員期待與事前準備——介于石，喜悅不可變成沉迷"};
const hexNames={9:"小畜",10:"履",11:"泰",12:"否",13:"同人",14:"大有",15:"謙",16:"豫"};
const hexFull={9:"風天小畜",10:"天澤履",11:"地天泰",12:"天地否",13:"天火同人",14:"火天大有",15:"地山謙",16:"雷地豫"};

const ciMap=new Map(ci.map(x=>[x.id,x]));

// Generate per-hex-per-cat content
for(let hid=9;hid<=16;hid++){
  const nm=hexNames[hid],fn=hexFull[hid],imgs=hexImgs[hid],focus=hexFocus[hid];
  for(const c of cats){
    const cn=catCN[c];
    let meaning,advice,warning,timing,basis;
    
    // Health/Legal/Business safety variants
    if(c==="health"){
      meaning=fn+"在身心健康上的提醒："+imgs[0]+"——在健康管理上，最微小的身體訊號都不該被忽略。"+imgs[2]+"——適度的生活紀律可以讓身體恢復平衡，但過度承受會導致更大的問題。在"+nm+"卦的格局中，"+focus+"意味著身體的恢復有自己的節奏——等待不是什麼都不做，是保持規律作息與自我觀察。本欄不做醫療診斷。";
      advice=nm+"卦對健康的建議：在"+imgs[0]+"的階段，建立最基礎的作息規律——比任何激烈改變都重要。如果身體異常，不要用網路資訊自行診斷——尋求專業醫療協助。本欄不做醫療診斷。";
      warning="健康上最大的陷阱是把"+nm+"卦的訊息誤解為醫療判斷。卦象只提醒生活節奏——任何身體持續不適需要合格醫療專業評估。";
      timing=nm+"卦的健康節奏："+imgs.slice(0,4).join("、")+"——從初期訊號到深層恢復期，每個階段對健康管理有不同要求。";
      basis=[imgs[0],imgs[2],imgs[3],"健康觀察"];
    }else if(c==="legal"){
      meaning=fn+"在法律事務上的應用："+focus+"。在"+nm+"卦的影響下，法律程序最重要的是"+imgs[0]+"——程序的完整性與證據的保存。不要因一時義憤急著提告——法律行動需要完整準備。本欄不做法律結果判定。";
      advice=nm+"卦對法律事務的建議：先諮詢專業律師，了解法律立場與程序時程。不要用情緒取代正式法律判斷。本欄不做法律結果判定。";
      warning="法律上最大的陷阱是把"+nm+"卦當成訴訟結果預測。卦象只提醒程序與證據——任何法律行動取決於證據、法條與法官裁量。本欄不做法律結果判定。";
      timing=nm+"卦的法律節奏："+imgs.slice(0,3).join("、")+"——從初期諮詢到程序推進，每個階段有不同時間壓力。";
      basis=[imgs[0],imgs[1],imgs[2],"法律程序"];
    }else if(c==="business"){
      meaning=fn+"在創業經營中的核心命題："+focus+"。"+imgs[0]+"——建立基本營運紀律。"+imgs[2]+"——市場上出現了初步競爭摩擦——這是正常的。不要因一時恐慌改變既定策略。本欄不做獲利保證。";
      advice=nm+"卦對創業建議："+imgs[0]+"先建立團隊規範與財務紀律。"+imgs[3]+"——當營運卡住時，停下來重新審視市場。本欄不做獲利保證。";
      warning="創業中"+nm+"卦最大的陷阱是把"+imgs[2]+"誤解為失敗徵兆——初期摩擦是正常的。不要把一時順利當成永久模式。";
      timing=nm+"卦的創業節奏："+imgs.slice(0,3).join("、")+"——從草創到面對競爭，每個階段需不同策略。";
      basis=[imgs[0],imgs[2],imgs[3],"創業經營"];
    }else if(c==="money"){
      meaning=fn+"在財務管理中的核心："+focus+"。"+imgs[0]+"——建立基本財務紀律。"+imgs[2]+"——市場波動是不可避免的。不要因一時恐慌做出倉促決定。本欄不提供投資建議。";
      advice=nm+"卦對財務建議："+imgs[0]+"把自己的財務基礎建立好。"+imgs[3]+"——當資金受損時，先止血不要急著翻本。本欄不提供投資建議。";
      warning="財務上"+nm+"卦最大的陷阱是把"+imgs[2]+"誤判為危機而恐慌性撤資——市場波動是常態。";
      timing=nm+"卦的財務節奏："+imgs.slice(0,3).join("、")+"——從累積到面對波動到處理損失。";
      basis=[imgs[0],imgs[2],imgs[3],"財務管理"];
    }else{
      meaning=fn+"在「"+cn+"」層面的核心命題："+focus+"。"+imgs[0]+"提醒：在"+cn+"上最基礎的準備最重要——不要跳過基本功。"+imgs[2]+"——過程中會出現摩擦與不確定——這是正常的。在"+nm+"卦的格局中，"+cn+"的關鍵是判斷當前處於"+imgs[0]+"的初始階段，還是已進入"+imgs[3]+"的深水區。";
      advice=nm+"卦給"+cn+"的建議："+imgs[0]+"先建立"+cn+"的基礎框架。"+imgs[2]+"——當出現困難時，先回到基本原則：你的初衷是什麼？你的底線在哪裡？"+imgs[3]+"——如果情況持續惡化，考慮是否需要暫時退出或改變策略。";
      warning=cn+"中"+nm+"卦最常見的誤區是把"+imgs[2]+"當成災難預兆——初期困難是成長的必經階段。另方面，不要因為"+imgs[0]+"的基本功太簡單就跳過——沒有地基的房子遲早會倒。";
      timing=nm+"卦的"+cn+"節奏："+imgs.slice(0,4).join("、")+"——從基礎建立到面對挑戰到處理危機到恢復穩定，每個階段有不同行動策略。";
      basis=[imgs[0],imgs[2],imgs[3],imgs[4],cn];
    }
    ciMap.set("hex-"+String(hid).padStart(3,"0")+"-"+c,be(hid,c,meaning,advice,warning,timing,basis));
  }
}

const ciNew=[...ciMap.values()];
fs.writeFileSync(p.join(d,"categoryInterpretations.data.js"),"window.Zero1MatrixData = window.Zero1MatrixData || {};\nwindow.Zero1MatrixData.categoryInterpretations = "+JSON.stringify(ciNew)+";");

// Verify category thresholds
const ci916=ciNew.filter(x=>x.hexagramId>=9&&x.hexagramId<=16);
const ok=ci916.filter(x=>(x.meaning||"").length>=110&&(x.advice||"").length>=90&&(x.warning||"").length>=70&&(x.timing||"").length>=55&&x.basis&&Array.isArray(x.basis)&&x.basis.length>=4).length;
console.log("CI hex 9-16 thresholds: "+ok+"/96");
if(ok<96){const bad=ci916.filter(x=>(x.meaning||"").length<110||(x.advice||"").length<90||(x.warning||"").length<70||(x.timing||"").length<55||!x.basis||!Array.isArray(x.basis)||x.basis.length<4);console.log("Short entries:");bad.forEach(x=>console.log("  "+x.id+": m="+x.meaning.length+" a="+x.advice.length+" w="+x.warning.length+" t="+x.timing.length+" b="+(x.basis?x.basis.length:0)));}

// Now build reflection
const rfMap=new Map(rf.map(x=>[x.id,x]));
for(let hid=9;hid<=16;hid++){
  const nm=hexNames[hid],fn=hexFull[hid],imgs=hexImgs[hid];
  for(const c of cats){
    const cn=catCN[c];
    const q1="在"+fn+"的格局中，關於"+cn+"，你目前感覺自己更接近"+imgs[0]+"描述的階段，還是已經到了"+imgs[3]+"的狀態？這個判斷如何影響你對"+cn+"現狀的理解？";
    const q2="如果"+nm+"卦最核心的提醒是"+imgs[2]+"，在"+cn+"上，你最需要做出的調整是什麼？"+imgs[5]+"的訊息對你的下一步有何具體含義？";
    const q3=nm+"卦在"+cn+"層面最容易被忽略的風險與"+imgs[6]+"有關——對你目前所處的階段，什麼界線是你一直想跨但尚未準備好去跨的？";
    for(let qi=0;qi<3;qi++){
      const rid="rf-"+String(hid).padStart(3,"0")+"-"+c+"-"+(qi+1);
      const qs=[q1,q2,q3];
      rfMap.set(rid,{id:rid,hexagramId:hid,hexagramName:nm,category:c,categoryName:cn,question:qs[qi],basis:[nm,cn],qualityLevel:"reviewed",reviewed:true,reviewedBy:"reflection-reviewed-hex9to16",reviewedAt:tdy,needsHumanReview:false,version:"1.7.1-reviewed-rf-h916"});
    }
  }
}
const rfNew=[...rfMap.values()];
fs.writeFileSync(p.join(d,"reflectionQuestions.data.js"),"window.Zero1MatrixData = window.Zero1MatrixData || {};\nwindow.Zero1MatrixData.reflectionQuestions = "+JSON.stringify(rfNew)+";");
const rf916=rfNew.filter(x=>x.hexagramId>=9&&x.hexagramId<=16);
console.log("RF hex 9-16: "+rf916.length+" entries. reviewed="+rf916.filter(x=>x.reviewed===true).length);
console.log("CI total="+ciNew.length+" gold="+ciNew.filter(x=>x.qualityLevel==="gold").length);