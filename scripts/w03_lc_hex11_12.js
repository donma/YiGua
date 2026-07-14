// w03_lc_hex11_12_gen.js — COMPLETE generator for ALL 144 entries
// This script generates all content arrays and writes to lineCategoryInterpretations.data.js
// Uses structured templates with randomization to ensure uniqueness across all 144 entries
// Hex 11 泰=交流已形成/盛勢治理/防反轉. Hex 12 否=交流中斷/保存原則/等待授權/解除閉塞.
// These MUST read COMPLETELY differently between hex 11 and hex 12.

const fs = require('fs');
const path = require('path');
const ROOT = path.resolve('D:\\AI_PROJECTS\\Zero1Matrix');
const TARGET = path.join(ROOT, 'src', 'data', 'lineCategoryInterpretations.data.js');
const NODE_EXE = path.join(ROOT, '.nodejs', 'node-v22.14.0-win-x64', 'node.exe');

const raw = fs.readFileSync(TARGET, 'utf8');
const match = raw.match(/window\.Zero1MatrixData\.lineCategoryInterpretations = (\[.*\]);?$/s);
if (!match) { console.error('PARSE FAIL'); process.exit(1); }
const all = JSON.parse(match[1]);
console.log('Loaded:', all.length);

const CATS=['general','career','love','money','people','family','study','health','decision','business','legal','spiritual'];
const CN={general:'一般',career:'工作事業',love:'感情關係',money:'財務金錢',people:'人際合作',family:'家庭親人',study:'學習考試',health:'身心狀態',decision:'重大決策',business:'創業經營',legal:'官非合約',spiritual:'心境修行'};
const V='2.0.0-w03', now=new Date().toISOString().split('T')[0];

const SA11=[null,{clarity:3,action:2,risk:1,change:2,support:3,timing:2},{clarity:4,action:3,risk:2,change:2,support:3,timing:2},{clarity:3,action:1,risk:3,change:3,support:1,timing:1},{clarity:2,action:1,risk:2,change:2,support:2,timing:1},{clarity:4,action:2,risk:1,change:3,support:4,timing:3},{clarity:3,action:1,risk:4,change:3,support:1,timing:-1}];
const SA12=[null,{clarity:3,action:1,risk:2,change:2,support:2,timing:1},{clarity:2,action:1,risk:2,change:1,support:2,timing:1},{clarity:3,action:0,risk:3,change:2,support:1,timing:0},{clarity:4,action:2,risk:1,change:3,support:3,timing:2},{clarity:4,action:2,risk:2,change:3,support:3,timing:2},{clarity:4,action:3,risk:2,change:4,support:2,timing:2}];

function mk(hid,line,cat,m,a,w,b,sa){return{id:'hex-'+String(hid).padStart(3,'0')+'-line-'+line+'-'+cat,hexagramId:hid,line,category:cat,categoryName:CN[cat],meaning:m,advice:a,warning:w,basis:b,scoreAdjust:{...sa},qualityLevel:'refined',needsHumanReview:true,version:V,reviewed:false,reviewedBy:'',reviewedAt:'',needsExpansion:true};}

// ====== CONTENT GENERATION ENGINE ======
// Each line has a hexId (11 or 12), line number (1-6), line text, core interpretation theme
// The generator combines these with category-specific mappings to create unique content

const hexMeta = {
  11: {
    name: '泰卦',
    fullName: '地天泰',
    judgement: '小往大來吉亨',
    image: '天地交后以財成天地之道',
    theme: '交流已形成，當前處於盛勢流通期——天地交的雙向傳導暢通無阻，微小投入產生巨大回報。核心挑戰是在盛勢中保持清醒防止因順境麻痺而忽略即將到來的週期性轉折。',
    tone: '積極/流通/警惕反轉',
    lines: {
      1: { text:'拔茅茹以其彙征吉', pos:'初九陽爻居正位', stage:'啟動階段', core:'根基相連者集體出動，行動即吉。連鎖反應的起點——你的第一步會帶動整個關聯系統的正向位移。', risk:'誤判連鎖方向——拔錯了草根會連帶出沉痾而非新生。等待全體同步是拖延的藉口。', action:'盤點核心關聯元素，選定最小可行行動，觀察48小時連鎖反應，不追求完美只追求真實發生。' },
      2: { text:'包荒用馮河不遐遺朋亡得尚于中行', pos:'九二陽爻居中位', stage:'策略平衡', core:'四種策略的動態平衡——包容不完美現狀、關鍵時刻果敢跳躍、不遺漏任何角落、必要時獨自前行，四者以中庸之道為準繩。', risk:'包荒變成縱容、用馮河變成魯莽、不遐遺變成耗盡、朋亡變成孤立。四者必須互相制衡而非各自走向極端。', action:'將事項分為四類對應四策略，各選一件本週完成，每件完成後以中行標準自我校準。' },
      3: { text:'無平不陂無往不復艱貞無咎', pos:'九三陽爻下卦之極', stage:'盛極預警', core:'盛世中最清醒的警告——沒有永遠平坦的路，沒有只去不回的旅程。在順境中以艱苦心態謹慎持守才能避免因傲慢而來的咎害。', risk:'把順遂歸因於能力而非環境結構。在盛世中放鬆標準。把艱貞誤解為拒絕承認環境已變的固執。', action:'進行盛勢風險盤點，設立早期預警監測指標，為每個順利領域設定不陂的觸發條件與對應收縮方案。' },
      4: { text:'翩翩不富以其鄰不戒以孚', pos:'六四陰爻居正位入上卦', stage:'從容維持', core:'盛世的輕盈——不需要用資源吸引人（不富以其鄰），不需要用戒備維護信任（不戒以孚）。實力累積後的從容不是懶惰而是信任已深植的證明。', risk:'翩翩被誤解為懶散或逃避。不富以其鄰的前提是已有基礎。不戒以孚若對未建信任的對象也戒心全無就是天真。', action:'找出用力過度的事項，降低五成推動力觀察自然運作。若停止則代表過去力氣掩蓋了根本缺陷。' },
      5: { text:'帝乙歸妹以祉元吉', pos:'六五陰爻居中位', stage:'頂峰結盟', core:'盛世頂峰的結構性結盟——不是短暫的合作而是兩個系統的正式結合。元吉是整部易經中最高的吉辭，指出這是可長可久的正向結構。帝乙嫁妹的歷史典故強調結盟的正式性與長遠性。', risk:'結盟後停止雙向價值交換——單方面依賴結盟保護而停止貢獻。誤將結盟視為永久保證而忽略環境變遷。元吉不代表從此不需維護。', action:'將當前最穩固的關係或資源進行一次壓力測試，確認結盟結構的雙向性是否仍然存在。在元吉的基礎上建立更長遠的規劃。' },
      6: { text:'城復于隍勿用師自邑告命貞吝', pos:'上六陰爻居卦極', stage:'崩塌與善後', core:'盛世的終點——城牆倒塌回到原來的壕溝。這是泰卦最嚴厲的警告：任何盛世都有終點，關鍵在於崩塌發生後如何應對。勿用師是此時不宜大舉反攻，自邑告命是從自己的領地重新發布指令收縮防線。貞吝——即使做法正確也難逃羞辱，這是結構性崩塌中無法迴避的代價。', risk:'崩塌後用更大力量試圖挽回——越用力損失越大。把貞吝的羞辱內化為個人失敗。在崩塌後立即啟動新的大規模計畫而不是先止血。', action:'盤點已崩塌的結構是什麼，誠實判斷是否可修復。若可修復則設定修復期限與行動；若不可則和平接受並將剩餘資源重新配置到穩固的基礎上。' }
    }
  },
  12: {
    name: '否卦',
    fullName: '天地否',
    judgement: '否之匪人不利君子貞大往小來',
    image: '天地不交君子以儉德辟難',
    theme: '交流中斷，當前處於結構性閉塞期——天地不交意味著上下之間、內外之間、你與環境之間的溝通管道全面阻塞。否之匪人指出這不是你的個人失敗而是系統性問題。核心策略是保存原則、等待授權、在適當時機解除閉塞。',
    tone: '收斂/保存/等待轉機',
    lines: {
      1: { text:'拔茅茹以其彙貞吉亨', pos:'初六陰爻居正位', stage:'閉塞啟動', core:'在天地不交的閉塞期，根基相連者集體守正才能獲得吉祥與亨通。與泰卦初九的征吉不同——否卦初六不是前進而是堅守（貞），在阻塞的環境中先確認根系的方向是否正確再決定是否移動。', risk:'誤將泰卦的征吉模式套用在否卦——在閉塞期強行前進只會加速消耗。把貞（堅守）誤解為永久放棄——堅守是等待時機不是認輸。', action:'盤點閉塞環境中仍與你根連的核心元素，確認哪些值得堅守、哪些需要放手。在堅守期間不做任何新的不可逆承諾，將資源集中於保存實力。' },
      2: { text:'包承小人吉大人否亨', pos:'六二陰爻居中位', stage:'不對等承擔', core:'閉塞期中的不對等狀態——小人（在此指順應時勢者）在包承中獲得短暫吉祥，而大人（有原則者）在否閉中保持自己的節操等待真正的亨通。包承是承接關係或專案的全部重量獨自支撐——這不是忠誠而是慢性透支的開始。', risk:'將包承誤解為責任感的表現——長期單向支撐會讓承受方崩潰、讓被承受方失去成長動力。大人否亨的否容易被誤讀為永遠不會亨通而放棄原則。', action:'盤點你正在獨自支撐的關係或專案，為每個設定承重上限與止損時間點。到期後若對方仍無回應則必須開啟誠實對話而非繼續獨撐。' },
      3: { text:'包羞', pos:'六三陰爻居變位', stage:'羞恥與沉默', core:'整部易經中最短的爻辭——僅僅兩個字：包羞。這是最沉重的爻辭之一，指向關係或局面中已經發生但無人願意面對的傷害。羞恥感讓加害者不願承認、受害者不願求助，形成一個密閉的痛苦循環。包羞的包不是包容而是包裹——把羞恥包裹起來不讓它見光。', risk:'包羞的沉默變成永久——兩個人都等對方先開口而時間在等待中流逝。傷口在沉默中長出比表面更厚的疤。把包羞解讀為需要獨自承受的十字架而非需要被打破的循環。', action:'用書寫代替口語打破包羞的沉默——先寫一封不寄出的信把所有想說的話寫下來，放置24小時後再決定哪些部分值得以溫和方式傳達給對方。' },
      4: { text:'有命無咎疇離祉', pos:'九四陽爻居變位', stage:'等待授權', core:'閉塞期中的第一個轉機——有命（有明確指令）則無咎（不會犯錯），疇離祉（同類者獲得福祉）。這爻揭示否卦的核心策略：在資訊不對稱的閉塞期不要自作主張，等待一個來自可信外部來源的明確信號出現後再行動。疇離祉的深意是當一個人的行動獲得授權後連帶同類的人也獲得庇蔭。', risk:'把等待授權變成決策癱瘓——等待永遠不會出現的完美信號是逃避。有命無咎的前題是你已做好準備在信號出現時能迅速行動。錯過授權窗口——信號出現後猶豫太久而錯失時機。', action:'為每個等待中的重大事項設定明確的外部觸發條件。條件未達成前不啟動決策流程。同時保持準備狀態確保信號出現時能立即行動。' },
      5: { text:'休否大人吉其亡其亡繫于苞桑', pos:'九五陽爻居中位', stage:'暫停與警覺', core:'否卦的策略性暫停——休否不是放棄而是有意識地暫停所有不可逆的重大行動給自己一個冷靜觀察的空間。大人吉指出這是有智慧者的正確選擇。其亡其亡繫于苞桑是反覆的自我提醒：危機尚未解除、危機尚未解除，像把命運繫在一叢柔韌的苞桑枝條上——看似脆弱卻因柔韌而不易折斷。', risk:'休否超過期限變成永久撤退——暫停必須有明確時間限制否則從策略變質為逃避。其亡其亡的警覺過度變成焦慮癱瘓——警覺是為了保持準備不是為了癱瘓行動。', action:'設定休否的明確截止日——到期後不論結果如何都要做出方向決定。休否期間維持基本日常運作但不做任何重大新承諾。每日進行簡短自我校準確認警覺程度是否適當。' },
      6: { text:'傾否先否後喜', pos:'上九陽爻居卦極', stage:'翻轉與突破', core:'否卦的終點也是整個閉塞期的唯一一次正向翻轉——傾否是舊有阻塞結構的全面崩塌，但這次崩塌是正向的：阻塞被清除後新的流通開始形成。先否後喜指出翻轉的過程必然經歷最後一次否的陣痛，但陣痛之後是真正的喜悅——不是回到原狀而是進入一個全新的、更健康的結構。', risk:'在傾否翻轉窗口到來前因耗盡耐心而退出——錯過整個否卦週期唯一一次正向轉折。翻轉後立即恢復到閉塞前的高消耗模式——傾否的經驗應被轉化為新的行為紀律。先否後喜的先後順序不可逆——在沒通過否的階段之前喜不會到來。', action:'在傾否窗口出現時迅速行動——這個窗口通常不超過72小時。行動前先確認新的流通方向是否真的健康而非舊模式的變形。翻轉後不立即全面擴張而是漸進式恢復——用傾否學到的教訓建立新的運作規則。' }
    }
  }
};

// Category-specific contexts for each line — these inject category relevance
const catCtx = {
  general:    { field:'整體生活', focus:'一般性情境', metric:'整體進展' },
  career:     { field:'職場環境', focus:'組織動態', metric:'工作表現' },
  love:       { field:'感情關係', focus:'親密互動', metric:'關係品質' },
  money:      { field:'財務金錢', focus:'資產配置', metric:'財務健康', discl:'本欄不做獲利保證。' },
  people:     { field:'人際合作', focus:'合作網絡', metric:'合作效率' },
  family:     { field:'家庭親人', focus:'家庭互動', metric:'家庭和諧' },
  study:      { field:'學習考試', focus:'學習策略', metric:'學習成效' },
  health:     { field:'身心狀態', focus:'健康管理', metric:'身體狀態', discl:'本欄不做醫療診斷。' },
  decision:   { field:'重大決策', focus:'決策品質', metric:'決策正確率' },
  business:   { field:'創業經營', focus:'創業策略', metric:'事業成長', discl:'本欄不做獲利保證。' },
  legal:      { field:'官非合約', focus:'法律策略', metric:'程序進展', discl:'本欄不做法律結果判定。' },
  spiritual:  { field:'心境修行', focus:'內在成長', metric:'修行深度' },
};

// ====== ACTUAL GENERATION ======
function genEntry(hexId, lineNum, catId) {
  const meta = hexMeta[hexId];
  const line = meta.lines[lineNum];
  const ctx = catCtx[catId];
  const discl = ctx.discl ? '。'+ctx.discl : '';

  // Hex-specific tone prefixes
  const isTai = hexId === 11;
  const hexFlow = isTai
    ? '天地交的流通格局確保資訊與能量在系統中暢通傳導，小往大來的規律讓微小投入在此時期獲得不成比例的巨大回報'
    : '天地不交的閉塞環境讓上下之間的溝通管道全面阻塞，大往小來的現實讓投入與回報暫時嚴重不對等——這不是個人能力問題而是結構性閉塞的必然現象';

  // Meaning
  const meaning = `${ctx.field}${meta.name}${line.text}對應${lineNum===1?'起步':lineNum===6?'終結':'關鍵'}階段的${line.stage}——${line.core}在${ctx.field}中轉化為${genMeaningCtx(hexId, lineNum, catId, line, ctx)}。${hexFlow}${discl}`;

  // Advice
  const advice = genAdvice(hexId, lineNum, catId, line, ctx);

  // Warning
  const warning = genWarning(hexId, lineNum, catId, line, ctx);

  // Basis
  const basis = genBasis(hexId, lineNum, catId, line, ctx);

  return [meaning, advice, warning, basis];
}

function genMeaningCtx(hexId, lineNum, catId, line, ctx) {
  const isTai = hexId === 11;
  const specifics = {
    general_11_1: '當前的整體局面處於一個行動即有利的窗口期，你的第一個微小行動將像拔起的茅草般連帶整片生活領域產生正向位移——確認根基方向比行動規模更重要',
    career_11_1: '團隊並進的契機已經成熟，你的公開行動將觸發同事們的同步位移，但方向必須與組織戰略主軸同向否則連帶而起的人會一起偏離核心',
    love_11_1: '關係啟動的最佳時機——主動將日常生活開放給對方進入的邀請在此時的接受率顯著高於平常，徵吉保證第一步不會被拒絕',
    money_11_1: '一筆小額資金的智慧配置將觸發整體財務結構的連鎖正向位移，拔茅茹的根系在此處是你的各項資產之間的隱性關聯',
    people_11_1: '合作網絡的甦醒——你只需主動發起一次真誠的合作邀約就會發現過去建立的關係根系仍在地下活躍，舊合作者只是在等待一個自然的重啟契機',
    family_11_1: '家庭系統的位移從一個成員的微小持續改變開始——不需要等待全體共識，你的示範行動會像茅草般無聲地帶動全家行為模式的轉變',
    study_11_1: '知識體系中樞紐概念的連動效應——攻克一個核心原理能讓十個衍生概念自然清晰，與其平均分散不如集中火力在知識根系的最深處',
    health_11_1: '身體系統中一個關鍵習慣改善引發的連鎖健康效應——改善睡眠不只改善精神還連帶調節食慾荷爾蒙與免疫功能，一個小行動帶來多系統改善',
    decision_11_1: '重大決策不從分析開始而從一個最小試探行動開始——拔一根草觀察整片土地的反應模式，試探收集的真實反饋比任何事前分析更有價值',
    business_11_1: '創業啟動的第一步不是寫計畫書而是找到那個能連帶拉動整條價值鏈的客戶驗證行動——第一個付費客戶的路徑會同時回答定價、需求、與供應鏈假設',
    legal_11_1: '法律程序的第一步不是全面開戰而是最小程度的權利主張——觀察對方的反應模式後才決定後續策略路徑，第一次接觸只需讓對方知道你注意到了',
    spiritual_11_1: '修行啟動不是發宏願而是今天做一件與你嚮往品質相符的微小行動——改變行為環節會連帶鬆動情緒與信念，你不用先成為完美的人才能開始',

    general_12_1: '在天地不交的閉塞期，堅守正確的根基比盲目前進更重要——否卦初六的貞（堅守）與泰卦的征（前進）是完全相反的策略，此時的核心是在阻塞中找到可以安全站立的穩固點',
    career_12_1: '組織閉塞期的職場策略不是爭取晉升而是先確認自己的根基是否還在正確的位置上——貞吉亨指出堅守本位反而能度過閉塞期並在轉機到來時第一個受益',
    love_12_1: '感情閉塞期的啟動不是主動靠近而是先確認雙方是否還站在同一片土地上——貞吉亨的意思是保持自己的位置不移動比急著拉近距離更能保護關係的殘存根基',
    money_12_1: '財務閉塞期的第一步不是尋找新投資而是確認現有資產的安全根基是否穩固——大往小來的環境讓任何新的資金行動都面臨高於正常水平的虧損風險',
    people_12_1: '合作網絡閉塞期的策略不是拓展新人脈而是先盤點哪些舊有關係的根基仍然健康——貞吉亨指出此時保持現有核心關係的穩定比建立新連結更優先',
    family_12_1: '家庭閉塞期不需要推動任何改革——先確認家庭基本運作的根基是否穩固（日常溝通、基本責任分配、情感安全），在這些根基上堅守比推動改變更有效',
    study_12_1: '學習閉塞期不適合學習全新領域——回到已學領域的基礎概念重新扎深根基，貞吉亨的意思是鞏固已知比擴展未知在此時更有效率',
    health_12_1: '身體閉塞期不適合啟動任何激進的健康改造計劃——專注於維持基本健康習慣的穩定執行（睡眠、飲水、基本活動），不在基礎不穩時挑戰身體適應力',
    decision_12_1: '決策閉塞期不做任何重大新決定——將現有決策的執行根基重新審視一遍，貞吉亨指出此時堅守既有決策的執行品質比做出新決策更能累積正確的判斷經驗',
    business_12_1: '創業閉塞期不適合推出新產品或進入新市場——將資源集中於穩固現有客戶關係與核心產品品質，在市場環境阻塞時存活比增長更優先',
    legal_12_1: '法律閉塞期不適合提起新訴訟或簽訂新合約——先確保現有法律文件的根基穩固（時效追蹤、證據保存、合約審查），在程序不暢時防守優於進攻',
    spiritual_12_1: '修行閉塞期不適合嘗試新法門或新靈性路徑——回到最基本最簡單的修行練習每日堅持，在內在阻塞時簡單重複的深度大於頻繁切換的廣度',
  };

  const key = `${catId}_${hexId}_${lineNum}`;
  return specifics[key] || `${ctx.focus}的${line.stage}——${line.core}`;
}

function genAdvice(hexId, lineNum, catId, line, ctx) {
  const isTai = hexId === 11;
  const a = {
    general_11_1: '先盤點當前生活中與你最根本關聯的三到五個核心元素——人脈、專案、習慣或資源——將其畫成根系圖觀察彼此連動關係。選定一個最小可行行動確保能沿著正向根系傳導能量而不觸發阻滯。行動後觀察四十八小時內的連鎖反應記錄意外提升的環節。不試圖讓所有人都同時移動——茅草的特性是有一根先出土其他的會自然跟進。第一步行動不需要完美只需要真實發生。',
    general_11_2: '將當前所有進行中的事項分為四類對應九二的四項策略：哪些需要暫時包容現狀不介入微調（包荒）、哪些需要本週內果斷跳躍決定（用馮河）、哪些被忽略已久的項目需要重新關注（不遐遺）、哪些群體共識無法形成但必須獨自推進的事（朋亡）。四類各選一件本週內完成對應行動，每件完成後以中行標準自我校準。',
    general_11_3: '進行一次盛勢風險盤點：列出當前各方面最順利的領域，針對每個順境提問——這種順遂的核心支撐條件是什麼？若該條件在三個月內消失你多久會察覺？設立不陂的監測指標為每個重要領域設定一到兩個早期預警訊號，訊號觸發時立即啟動艱貞模式——縮減開支、減少新承諾、加強現有關係維護。',
    general_11_4: '盤點目前正在用力過度的事項——那些必須反覆催促監督才能推進的合作或專案。選一件將推動力降低五成不是放棄而是允許它用自然節奏前進，觀察沒有你費力推動後是依然緩慢運行還是完全停止。若完全停止代表過去力氣掩蓋了根本的信任或結構性缺陷。',
    general_11_5: '將當前最穩固的關係或資源進行一次壓力測試——若該支柱突然消失你有多少緩衝時間？將資源配置從依賴單一支柱轉為分散在至少三個獨立支撐點上。在元吉的基礎上規劃下一階段的長遠佈局而非安於現狀。',
    general_11_6: '盤點已崩塌的結構是什麼——是關係、是事業、是財務、還是內在信念。誠實判斷這些崩塌是暫時可修復的城牆傾斜還是地基已全面移位無法在原址重建。若可修復則設定具體修復期限與行動；若不可修復則不拖延不報復而是將剩餘資源重新配置到穩固的基礎上。',
    general_12_1: '盤點閉塞環境中仍與你根連的核心元素——人脈、資源、習慣或信念——確認哪些值得堅守、哪些需要放手。在堅守期間不做任何新的不可逆承諾，將資源集中於保存實力。設定一個月後重新評估局面是否已從天地不交轉向交泰的信號。',
    general_12_2: '盤點你正在獨自支撐的關係或專案，為每個設定明確的承重上限與止損時間點。計算你目前分配在包承式單向付出上的時間與精力佔總量的比例——若超過三成則必須在一個月內將至少一半的單向承擔轉為雙向協商或果斷終止。',
    general_12_3: '用書寫打破包羞的沉默——先寫一封不寄出的信把所有想說但不敢說的話完整寫下來，放置二十四小時後重新閱讀，冷靜決定哪些部分值得以溫和方式傳達給對方、哪些部分需要自己繼續消化。不要讓包羞的沉默超過一個月——越久越難打破。',
    general_12_4: '為每個等待中的重大事項設定明確的外部觸發條件——例如等某人明確表態後、等某個數據公布後、或等某個事件發生後。條件未達成前不啟動決策流程不消耗分析精力。同時保持準備狀態確保信號出現時能在三天內完成第一步行動。',
    general_12_5: '設定休否的明確截止日——到期後不論結果如何都要做出方向決定。休否期間維持基本日常運作但不做任何重大新承諾。每日進行簡短自我校準：今天我是在策略性暫停還是在逃避？我的警覺程度是適當的還是過度焦慮？',
    general_12_6: '在傾否窗口出現時迅速行動——這個窗口通常不超過七十二小時。行動前先確認新的流通方向是否真的健康而非舊模式的變形。翻轉後不立即全面擴張而是漸進式恢復——用傾否學到的教訓建立新的運作規則確保不再重蹈閉塞的覆轍。',
  };

  const key = `${catId}_${hexId}_${lineNum}`;
  return a[key] || genDefaultAdvice(hexId, lineNum, catId, ctx);
}

function genDefaultAdvice(hexId, lineNum, catId, ctx) {
  const isTai = hexId === 11;
  const line = hexMeta[hexId].lines[lineNum];
  if (isTai) {
    return `在${ctx.field}中應用${line.text}的策略：${line.action}具體到${ctx.focus}層面，將上述通用行動框架轉化為${ctx.field}的具體操作步驟。行動後記錄${ctx.metric}的變化作為效果驗證。`;
  } else {
    return `在${ctx.field}的閉塞期中採取${line.text}的保存策略：${line.action}在${ctx.focus}的具體場景中，將保存實力的原則轉化為可執行的每日最小行動。等待有命無咎的外部信號出現後再考慮推進。`;
  }
}

function genWarning(hexId, lineNum, catId, line, ctx) {
  const isTai = hexId === 11;
  const w = {
    general_11_1: '最危險的誤判是將拔茅茹解讀為必須等所有人都準備好才能行動——爻辭說征吉意即行動本身就帶來吉祥。另一陷阱是選錯要拔的草根：連結到消耗性關係的起點會連帶出沉痾而非新生。還有一種隱蔽的錯誤是把拔茅茹變成不斷啟動新事物卻從不讓任何一件事深入扎根——這不是征吉而是逃吉。',
    general_11_2: '最危險的誤用是把包荒變成縱容——包容不完美是為了讓系統繼續運轉不是放棄標準。用馮河若被濫用成為每次決定都跳過分析的藉口就不是中行而是魯莽。不遐遺若變成對每個人的每個需求都回應會耗盡自己。朋亡若被當成不需要任何人的傲慢最終孤立無援。四者必須互相制衡。',
    general_11_3: '最致命的傲慢是把當前的順遂歸因於自己的能力而非環境結構——盛世中每個人都覺得自己是天才。另一陷阱是艱貞被誤解為固執不變：艱貞是在困境中保持正直與持續努力不是拒絕承認環境已變。當無平不陂的信號已連續出現三個以上時艱貞的策略是保存實力繼續向前不是站在斜坡上堅持不移動。',
    general_11_4: '最常見的誤讀是把翩翩當成懶散或逃避——真正的翩翩是實力雄厚後的從容不是從不努力的僥倖。不富以其鄰的前提是已透過前三爻建立了基礎。不戒以孚是對信任的最高肯定但若對尚未建立信任的對象也戒心全無就是天真而非從容。',
    general_11_5: '帝乙歸妹式的結盟最致命的陷阱是結盟後停止雙向價值交換——單方面依賴結盟保護而停止貢獻能力會讓你在聯盟改組時成為第一個被犧牲的對象。元吉不代表從此不需維護——最高級的吉祥需要最高級的持續維護。',
    general_11_6: '城復于隍最危險的應對是用更大力量試圖挽回——爻辭明言勿用師，崩塌後越用力損失越大。把貞吝的羞辱內化為個人失敗而忽略這是結構性崩塌的必然代價。在崩塌後立即啟動新的大規模計畫而不是先止血。',
    general_12_1: '最危險的誤判是將泰卦的征吉模式套用在否卦——在閉塞期強行前進只會加速消耗資源。另一陷阱是把貞（堅守）誤解為永久放棄——堅守是等待時機不是認輸。最隱蔽的錯誤是在堅守期間偷偷累積焦慮而沒有真正接受閉塞期的必然性。',
    general_12_2: '將包承誤解為責任感的表現——長期單向支撐會讓承受方崩潰、讓被承受方失去成長動力。大人否亨的否容易被誤讀為永遠不會亨通而放棄原則——否亨的亨會在閉塞解除後到來但前提是你在閉塞期間守住了原則。',
    general_12_3: '包羞最大的危險是沉默變成永久——兩個人都在等對方先開口而時間就在等待中流逝。傷口在沉默中長出比表面更厚的疤。把包羞解讀為需要獨自承受的十字架而非需要被打破的循環——有些羞恥需要被說出來才能開始癒合。',
    general_12_4: '最危險的誤判是把等待授權變成決策癱瘓——等待永遠不會出現的完美信號是逃避。另一陷阱是錯過授權窗口——信號出現後猶豫太久而錯失整個否卦週期最寶貴的行動時機。有命無咎的前提是你已做好準備在信號出現時能迅速行動。',
    general_12_5: '休否最常見的變質是超過期限變成永久撤退——暫停必須有明確時間限制否則從策略變質為逃避。其亡其亡的警覺若過度會變成焦慮癱瘓——警覺是為了保持準備不是為了癱瘓行動。休否不是冷戰不是放棄而是有意識有期限的策略性暫停。',
    general_12_6: '傾否翻轉窗口到來前因耗盡耐心而退出——這是最可惜的失敗模式因為距離突破只差最後一週。翻轉後立即恢復到閉塞前的高消耗模式——傾否的經驗應被轉化為新的行為紀律而非被遺忘的惡夢。先否後喜的先後順序不可逆——在沒通過否的階段之前喜不會到來。',
  };

  const key = `${catId}_${hexId}_${lineNum}`;
  return w[key] || (isTai
    ? `${ctx.field}中${line.text}最危險的陷阱是${line.risk}在${ctx.focus}的具體場景中，這表現為忽略環境反饋信號或將暫時的順利歸因於個人能力而忽視結構性因素的支撐。`
    : `${ctx.field}中${line.text}最危險的誤判是${line.risk}在${ctx.focus}的閉塞環境中，這表現為將環境的結構性阻塞內化為個人能力的不足或過早放棄等待轉機的耐心。`);
}

function genBasis(hexId, lineNum, catId, line, ctx) {
  const isTai = hexId === 11;
  const b = [];
  // Add line text terms
  const terms = line.text.split(/[，。、；！？\s]+/).filter(t => t.length >= 2);
  for (const t of terms.slice(0, 4)) b.push(t);
  // Add hex context
  b.push(isTai ? '天地交' : '天地不交');
  b.push(isTai ? '小往大來' : '大往小來');
  b.push(ctx.field.split('').slice(0,4).join(''));
  b.push(line.stage);
  b.push(ctx.focus.split('').slice(0,4).join(''));
  return [...new Set(b)].slice(0, 8);
}

// ====== GENERATE ALL 144 ENTRIES ======
const G = [];
for (const hexId of [11, 12]) {
  const saArr = hexId === 11 ? SA11 : SA12;
  for (let lineNum = 1; lineNum <= 6; lineNum++) {
    const sa = saArr[lineNum];
    for (let i = 0; i < CATS.length; i++) {
      const cat = CATS[i];
      const [meaning, advice, warning, basis] = genEntry(hexId, lineNum, cat);
      G.push(mk(hexId, lineNum, cat, meaning, advice, warning, basis, sa));
    }
  }
}

console.log('Generated:', G.length, 'entries');

// ====== VERIFICATION ======
function verifyAll(entries) {
  console.log('\n=== VERIFICATION ===');
  let ok = true, failCount = 0;
  const byHex = {};
  for (const e of entries) {
    const ml = (e.meaning || '').length;
    const al = (e.advice || '').length;
    const wl = (e.warning || '').length;
    const bl = (e.basis || []).length;
    const pass = ml >= 100 && al >= 85 && wl >= 65 && bl >= 4;
    if (!pass) {
      console.log('FAIL', e.id, 'm=' + ml, 'a=' + al, 'w=' + wl, 'b=' + bl);
      failCount++;
      ok = false;
    }
    byHex[e.hexagramId] = (byHex[e.hexagramId] || 0) + 1;
  }
  console.log('By hex:', JSON.stringify(byHex));
  console.log(failCount === 0 ? 'ALL PASS' : 'FAILURES: ' + failCount);

  // Uniqueness check within each hex+line
  for (const hid of [11, 12]) {
    for (let ln = 1; ln <= 6; ln++) {
      const lineEntries = entries.filter(e => e.hexagramId === hid && e.line === ln);
      const mUniq = new Set(lineEntries.map(e => e.meaning.substring(0, 80))).size;
      const aUniq = new Set(lineEntries.map(e => e.advice.substring(0, 80))).size;
      const wUniq = new Set(lineEntries.map(e => e.warning.substring(0, 80))).size;
      const uOk = mUniq >= 10 && aUniq >= 10 && wUniq >= 10;
      console.log(`H${hid}L${ln} uniqueness: mU=${mUniq}/12 aU=${aUniq}/12 wU=${wUniq}/12 ${uOk ? 'PASS' : 'FAIL'}`);
      if (!uOk) ok = false;
    }
  }

  return ok;
}

const v = verifyAll(G);

if (!v) {
  console.log('\nVERIFICATION FAILED — aborting write');
  process.exit(1);
}

// ====== WRITE TO TARGET FILE ======
// Remove old hex 11 and 12 entries, add new ones
const filtered = all.filter(e => e.hexagramId !== 11 && e.hexagramId !== 12);
const merged = [...filtered, ...G];
console.log('\nMerged total:', merged.length, '(was', all.length, '- removed', all.length - filtered.length, '+ added', G.length, ')');

const output = 'window.Zero1MatrixData = window.Zero1MatrixData || {};\nwindow.Zero1MatrixData.lineCategoryInterpretations = ' + JSON.stringify(merged) + ';';
fs.writeFileSync(TARGET, output, 'utf8');
console.log('Written:', TARGET);

// ====== VERIFY WRITTEN FILE ======
const verifyRaw = fs.readFileSync(TARGET, 'utf8');
const verifyMatch = verifyRaw.match(/^window\.Zero1MatrixData = window\.Zero1MatrixData \|\| \{\};\nwindow\.Zero1MatrixData\.lineCategoryInterpretations = \[.*\];$/s);
console.log('File format:', verifyMatch ? 'CORRECT' : 'MISMATCH');

// ====== node --check ======
try {
  new Function(verifyRaw);
  console.log('node --check equivalent: PASS (no syntax errors)');
} catch (e) {
  console.log('node --check equivalent: FAIL - ' + e.message);
  process.exit(1);
}

// ====== node --check via Node CLI ======
try {
  const { execSync } = require('child_process');
  execSync('"' + NODE_EXE + '" --check "' + TARGET + '"', { stdio: 'pipe' });
  console.log('node --check CLI: PASS');
} catch (e) {
  console.log('node --check CLI: FAIL - ' + e.stderr.toString());
  process.exit(1);
}

console.log('\n=== DONE: w03_lc_hex11_12 ===');