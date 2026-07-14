'use strict';
const vm = require('vm');
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const DATA_PATH = path.join(__dirname, '..', 'src', 'data', 'reflectionQuestions.data.js');
const NODE_EXE = path.join(__dirname, '..', '.nodejs', 'node-v22.14.0-win-x64', 'node.exe');

const CATEGORIES = [
  ['general', '一般'],
  ['career', '工作事業'],
  ['love', '感情關係'],
  ['money', '財務金錢'],
  ['people', '人際合作'],
  ['family', '家庭親人'],
  ['study', '學習考試'],
  ['health', '身心狀態'],
  ['decision', '重大決策'],
  ['business', '創業經營'],
  ['legal', '官非合約'],
  ['spiritual', '心境修行'],
];

// ===== HEX 57 巽 questions =====
const HEX57 = { hexagramId: 57, hexagramName: '巽', full: '隨風巽', data: {} };
HEX57.data.general = {
  imgs: ['隨風巽', '進退利武人之貞', '頻巽'],
  q1: '隨風巽象徵人生如風順勢而行需柔軟也需方向，你覺得自己整體是像柔風般跟隨環境節奏自然流動不費力氣，還是像被風吹散的落葉雖在移動但方向全由外力決定缺乏自主的掌控感？',
  q2: '面對進退利武人之貞般需用紀律與果斷決定人生的進或退時，你傾向像軍人般嚴格審視每一步確保守合時機，還是相信生命自有流動讓直覺與風向引導你的節奏放鬆控制？',
  q3: '在頻巽般反覆在順從與堅持間搖擺的狀態中，哪個生活訊號一旦出現三次以上卻仍被你再觀察看看來合理化，代表頻繁猶豫已從謹慎變為慢性癱瘓你正用考慮周全的名義逃避那個早該做出的決定？',
};
HEX57.data.career = {
  imgs: ['進退利武人之貞', '巽在床下', '用史巫紛若'],
  q1: '進退利武人之貞暗示職涯需以軍人紀律審視每個前進與後退決策，你覺得目前是在職涯進擊階段需要果斷出擊不容猶豫，還是該戰略性撤退整頓卻因不甘心已投入的成本而遲遲不願後退？',
  q2: '當職場中遇到巽在床下般需低調隱藏實力在暗處觀察等待時機時，你會選擇暫時收起鋒芒像伏在床下般耐心等局勢轉變，還是用史巫紛若般頻繁溝通多方斡旋主動改變局勢不被動困在暗處？',
  q3: '在用史巫紛若般大量溝通多方協調推動職涯進展的過程中，哪個人際或組織訊號一旦出現，代表溝通已從建設斡旋變為消耗紛擾你正以忙碌協調來掩蓋核心問題根本無法透過溝通解決？',
};
HEX57.data.love = {
  imgs: ['巽在床下', '用史巫紛若', '頻巽'],
  q1: '巽在床下暗示感情中你可能正隱藏真實感受像伏在床下般不敢讓對方看到完整的自己，你覺得這種隱藏是出於保護關係的謹慎暫時不宜攤開所有牌，還是已成習慣性壓抑你甚至不確定對方愛的是真實的還是你展現的那個版本？',
  q2: '當感情中需用史巫紛若般反覆溝通協調才能維持表面和諧時，你會選擇繼續用溫柔溝通一點點化解分歧相信誠意終究能讓彼此靠近，還是意識到過度溝通已是本質不匹配的訊號與其紛擾不如勇敢面對是否各自尋找更適合的人？',
  q3: '在頻巽般同樣衝突模式反覆重演溝通完看似解決但不久又回到原點的循環中，哪個互動節點一旦再次以相同方式重演，代表循環已無法用同樣溝通打破你必須做出完全不同的回應才能終止這個重複劇本？',
};
HEX57.data.money = {
  imgs: ['喪其資斧', '進退利武人之貞', '頻巽'],
  q1: '喪其資斧暗示你可能在不知不覺中失去了重要財務工具或資源如旅人遺失砍伐荊棘的斧頭，你覺得這損失是暫時的可以靠努力重新積累回來，還是代表核心收入或資產結構已出現你還未正視的根本裂縫？',
  q2: '當財務需進退利武人之貞般以軍人紀律判斷該進場或退場時，你會選擇制定嚴格財務規則設明確止損與進場條件強制遵守，還是頻巽般認為市場變幻莫測僵化規則反會錯失靈活應變寧可保持彈性依情況調整策略？',
  q3: '在頻巽般財務策略反覆在保守與積極間搖擺的過程中，哪個財務數字一旦連續數月偏離你設定的基準線，代表搖擺不定已從靈活風控變為無方向感的漂移你正用隨機應變掩蓋自己根本沒形成經得起考驗的財務哲學？',
};
HEX57.data.people = {
  imgs: ['用史巫紛若', '進退利武人之貞', '巽在床下'],
  q1: '用史巫紛若暗示你的人際圈正處於需大量溝通協調的紛忙階段各種關係都需你花時間維繫，你覺得這溝通量是短期人際旺季過了就會回歸平穩，還是你的人際模式本身就是以過度溝通來維持關係長期處於社交能量透支的狀態？',
  q2: '當人際中遇到進退利武人之貞般需果斷決定靠近或疏遠某人時，你會像軍人般用明確標準評估每段關係不符合就果斷放手，還是巽在床下般對每個人保持柔軟善意即使非最理想夥伴也不輕易切斷留著日後或許有用？',
  q3: '在巽在床下般長期在人際中保持低調柔軟不主動彰顯立場後，哪個具體互動場景一旦發生，代表你的低調已從智慧謙讓變為自我消失旁人已習慣你的退讓不再把你的意見當成需要認真對待的聲音？',
};
HEX57.data.family = {
  imgs: ['巽在床下', '頻巽', '田獲三品'],
  q1: '巽在床下暗示家中可能有些成員的真實感受被壓抑在表面和諧下像伏在床底不敢浮現，你覺得這壓抑是家中為維持大局穩定的暫時性妥協等適當時機再溝通，還是已累積成全家人心照不宣但無人願先碰觸的那個房間裡的床下之物？',
  q2: '當家庭中頻巽般反覆出現同樣摩擦如對某成員的相同不滿一再重演時，你會用田獲三品般的具體成果轉移焦點讓家人看到正向進展而非糾結重複問題，還是下定決心這一次不再讓它過去用一次坦誠但可能引發衝突的對話徹底解決根源？',
  q3: '在田獲三品般家庭在某領域獲得實質成果如經濟改善或成員成就後，哪個家庭互動模式一旦隨之消失，代表成果光環正掩蓋關係中某些原本就不健康但被慶祝暫時蓋過的暗流？',
};
HEX57.data.study = {
  imgs: ['頻巽', '進退利武人之貞', '田獲三品'],
  q1: '頻巽暗示你的學習狀態正處於反覆搖擺的不穩定階段時而充滿動力時而完全提不起勁，你覺得這搖擺是因學習內容對你來說難度忽高忽低導致的自然反應，還是你對這學習方向的內在承諾本就不夠堅定外在干擾都能輕易打斷你的節奏？',
  q2: '當學習需進退利武人之貞般以軍人紀律強制每天推進進度時，你會建立嚴格時間表像軍隊操練般不給藉口每日完成目標，還是田獲三品般用階段性成果獎勵激勵自己達成每個小目標後給實質回饋用正向增強取代紀律壓力？',
  q3: '在田獲三品般學習獲得階段性成果如通過考試或完成專案後，哪個學習習慣一旦隨之鬆懈，代表你正以這份成就當成停下腳步的許可證把終點線錯誤畫在一個其實只是中繼站的位置？',
};
HEX57.data.health = {
  imgs: ['巽在床下', '喪其資斧', '隨風巽'],
  q1: '巽在床下暗示身體可能有些隱藏訊號伏在床底般沒被你正視你用日常忙碌掩蓋了它們，你覺得這些訊號是偶發小毛病不需過度解讀自然會消失，還是直覺告訴你有些不對勁但因害怕檢查結果而選擇性把注意力轉移他處？',
  q2: '當察覺到喪其資斧般身體失去某項重要功能或活力如斧頭鈍了不再能砍伐日常荊棘，你會積極尋求醫療與調整生活方式試圖把失去的資源找回，還是隨風巽般接受身體隨年齡與歷程自然起落學會與現狀和平共處不強求巔峰？',
  q3: '在隨風巽般順應身體節奏不勉強不抗拒以柔軟態度與身體共處的過程中，哪個身體訊號一旦被用順其自然合理化超過某個時間長度，代表順應已從健康接納變為消極放棄你正用隨緣來包裝對明顯惡化趨勢的不作為？',
};
HEX57.data.decision = {
  imgs: ['頻巽', '進退利武人之貞', '喪其資斧'],
  q1: '頻巽顯示你在重大決策上正反覆猶豫今天覺得A方案對明天又覺得B方案好始終無法下定決心，你覺得這猶豫是因兩選項各有優劣需更完整資訊才能判斷，還是內心其實對兩個選項都不滿意你在等一個根本不存在第三選項？',
  q2: '當決策需進退利武人之貞般以果斷紀律做出選擇時，你會設定明確決策期限期限一到無論資訊是否完美都須做出決定並承擔後果，還是寧可承擔延遲成本繼續等待直到某關鍵資訊出現讓天平明確倒向一邊？',
  q3: '在喪其資斧般做決策時發現失去了某個原本依賴的判斷工具或框架後，哪個心理訊號一旦出現，代表你對失去工具的恐慌已超過對決策本身的理性評估你正在因沒有斧頭而拒絕走入森林而非想辦法用別的工具穿越？',
};
HEX57.data.business = {
  imgs: ['隨風巽', '進退利武人之貞', '田獲三品'],
  q1: '隨風巽象徵創業如風需敏銳感知市場風向並靈活調整方向，你覺得事業目前像順風般市場反饋與你產品方向一致成長只是時間問題，還是像逆風般已感受到市場風向在變化但你還在猶豫是否調整航向擔心轉向成本過高？',
  q2: '當企業面臨進退利武人之貞般需果斷決定擴張或收縮時，你會用嚴格數據與紀律判斷只要關鍵指標未達門檻就執行收縮，還是田獲三品般先看有無階段性成果可收割用實際市場回饋驗證擴張是否值得繼續？',
  q3: '在田獲三品般企業獲得某領域階段性成功如產品上線或營收達標後，哪個營運指標一旦在你慶祝同時開始惡化，代表這成功可能只是甜蜜陷阱你正被短期勝利蒙蔽而忽略商業模式中那個一直未被解決的根本缺陷？',
};
HEX57.data.legal = {
  imgs: ['用史巫紛若', '進退利武人之貞', '巽在床下'],
  q1: '用史巫紛若暗示法律事務正處於需大量溝通與文件往返的紛忙階段雙方在程序細節上反覆交鋒，你覺得這些紛擾是法律程序中正常消耗按部就班就能進入實質解決，還是對方正利用程序複雜性來消耗你資源與耐心以達不戰而屈人之兵？',
  q2: '當法律事務需進退利武人之貞般果斷決定堅持訴訟或接受和解時，你會用軍人務實思維計算繼續訴訟總成本與勝率只要數字不划算就果斷止損，還是巽在床下般暫時低調不公開立場先觀察對方下一步再決定進退？',
  q3: '在巽在床下般選擇低調處理法律事務不張揚不激化矛盾的策略下，哪個程序節點一旦逼近，代表低調已從策略耐心變為危險被動你正以不激怒對方為由錯過法律上須在期限內行動否則權利永久喪失的關鍵時機？',
};
HEX57.data.spiritual = {
  imgs: ['隨風巽', '巽在床下', '用史巫紛若'],
  q1: '隨風巽象徵內在修行需像風一樣柔軟通透既不抗拒生命流動也不失去自我本質，你覺得目前修行狀態是像微風般輕柔穿透日常不知不覺中持續轉化內在，還是像狂風般充滿快速突破的急切但風過後水面又迅速恢復原來的模樣？',
  q2: '當內在修行中遇到巽在床下般有些深層陰影伏在意識的床底不願浮現時，你會用史巫紛若般透過各種方法反覆觸碰攪動讓它們不得不浮出接受清理，還是尊重這些陰影的節奏相信它們會在適當時機自然浮現不強行挖掘？',
  q3: '在用史巫紛若般嘗試各種不同修行路徑與方法後，哪個心念一旦反覆出現，代表方法多元化已從探索變為逃避你正用不斷更換修行方式來避免面對那個無論用什麼方法都繞不開的核心課題？',
};

// ===== HEX 58 兌 questions =====
const HEX58 = { hexagramId: 58, hexagramName: '兌', full: '麗澤兌', data: {} };
HEX58.data.general = {
  imgs: ['麗澤兌', '和兌', '孚兌'],
  q1: '麗澤兌象徵人生如兩澤相連喜悅在相互滋潤中流動，你覺得整體狀態是像滿溢湖水般內心有充沛喜悅能量自然流向周遭人事物，還是像乾涸澤地雖知喜悅的重要但內心深處已很久未感受不依賴外在成就的單純快樂？',
  q2: '面對和兌般以溫和開放態度與世界互動所帶來的喜悅時，你會保持這種不強求不執著的柔和喜悅讓它像湖面漣漪自然擴散消退，還是孚兌般追求以真誠信用為基礎的深層喜悅即使需承擔信任被辜負的風險？',
  q3: '在孚兌般以真誠信任為基礎與人分享喜悅的過程中，哪個人際訊號一旦出現，代表你的真誠正被消耗而非滋養你分享的喜悅沒像兩澤相連般回流而是單向流向一個不會回饋的黑洞？',
};
HEX58.data.career = {
  imgs: ['和兌', '商兌未寧', '引兌'],
  q1: '和兌暗示職涯需以溫和開放態度與同事合作才能帶來真正進展，你覺得工作氛圍是和諧互利每人都在用專長滋潤團隊澤地，還是表面和氣下暗藏未說出口的競爭與比較大家把不滿藏在笑容背後？',
  q2: '當職涯處於商兌未寧般在喜悅與利益間反覆衡量無法獲得平靜時，你會重新審視對這份工作的核心動機問自己若無薪資頭銜是否還能從中感受真正喜悅，還是引兌般尋找能重新點燃熱情的外部契機如新專案或導師來帶領你走出不安？',
  q3: '在引兌般等待外部契機來重新點燃職涯熱情的過程中，哪個時間節點一旦過去而契機未現，代表等待已從合理耐心變為被動停滯你正把改變責任外包給運氣而非自己主動創造轉變的條件？',
};
HEX58.data.love = {
  imgs: ['孚兌', '來兌', '引兌'],
  q1: '孚兌象徵感情中喜悅需建立在真誠信任基礎上方有持久深度，你覺得這段關係的喜悅來自彼此的真誠信任即使困難時刻也感受對方心意沒動搖，還是喜悅更多來自愉快氛圍但一旦觸及需深度信任的議題氣氛就迅速冷卻？',
  q2: '當感情中出現來兌般對方帶著某種目的或期待來接近你所帶來的喜悅時，你會選擇享受這份被需要被追求的美好不著急分析對方動機是否純粹，還是引兌般謹慎觀察來兌背後真正動機不讓一時喜悅蒙蔽對關係本質的判斷？',
  q3: '在引兌般感情中需刻意引導或創造喜悅才能維持關係熱度時，哪個互動模式一旦成為維繫關係的主要方式，代表你們已不是在相愛而是在共同經營名為幸福的專案真誠喜悅已被排程與計畫所取代？',
};
HEX58.data.money = {
  imgs: ['商兌未寧', '孚于剝', '來兌'],
  q1: '商兌未寧暗示財務狀態正處於在利益與內心平靜間搖擺難以安寧的階段，你覺得這不安是來自對未來收入不確定性的正常焦慮只要現金流穩定就消失，還是你從事的創收方式與價值觀存在根本衝突金錢累積以犧牲內心平靜為代價？',
  q2: '當察覺到孚于剝般你信任的投資對象或理財工具正悄悄剝蝕你的資產時，你會立即收回信任果斷停損不再對已證明不可靠的對象抱持期待，還是來兌般先觀察對方是否會主動解釋或補救給對方挽回信任的機會再決定？',
  q3: '在來兌般某個看似誘人的財務機會主動來敲門時，哪個數字或條件一旦在機會包裝下被你選擇性忽略，代表你正被來兌的喜悅沖昏頭把一個包裝精美的陷阱當成天上掉下來的禮物？',
};
HEX58.data.people = {
  imgs: ['和兌', '孚兌', '引兌'],
  q1: '和兌暗示人際互動以溫和友善基調為主大家相處融洽氣氛輕鬆愉快，你覺得這種和諧是建立在彼此真正理解尊重的基礎上具實質深度，還是大家為維持表面愉快刻意避開所有可能引發不快的話題和諧本身已變成一種集體默契的表演？',
  q2: '當人際需在孚兌般以真誠信任為基礎的深度關係與和兌般輕鬆愉快的淺層社交間取捨時，你會把有限時間精力集中在少數能承受真誠脆弱的深度關係上，還是引兌般保持對各種關係的開放性相信深淺各有其價值不需刻意取捨？',
  q3: '在引兌般積極拓展新的人際連結為社交圈注入新能量時，哪個互動品質一旦在舊有關係中開始明顯下降，代表你正以新關係的新鮮感逃避舊關係需面對的深度課題喜新不是為了成長而是為了不必面對舊的未解問題？',
};
HEX58.data.family = {
  imgs: ['來兌', '孚于剝', '和兌'],
  q1: '來兌暗示家中可能有成員帶著某種期待或需求來靠近你尋求你的關注或資源，你覺得這些來兌是家人間正常相互依賴與支持是家庭溫暖的具體表現，還是某個家人正用親情名義長期單向從你這裡汲取資源而你因愛無法拒絕正被悄悄消耗？',
  q2: '當察覺到孚于剝般某個你長期信任的家庭模式或成員正悄悄剝蝕家庭整體幸福時，你會選擇和兌般用溫和方式逐步引導家庭調整不讓任何人被指責，還是認為有些問題需一次坦誠甚至引發衝突的家庭會議才能讓所有人正視剝蝕的嚴重性？',
  q3: '在和兌般以溫和方式逐步引導家庭改變的過程中，哪個家庭互動訊號一旦長期沒改善，代表溫和引導已變為無效姑息你正為了不破壞和諧而允許那個剝蝕家庭幸福的模式繼續在溫和表面下悄悄運作？',
};
HEX58.data.study = {
  imgs: ['麗澤兌', '和兌', '孚兌'],
  q1: '麗澤兌象徵學習中知識的喜悅如兩澤相連般在交流分享中不斷增長，你覺得目前的學習是充滿與人討論分享後知識互相滋養的喜悅感，還是處於孤獨吸收資訊的階段雖也在學但缺少與他人交流帶來的那份讓知識活起來的喜悅？',
  q2: '當學習面臨和兌般輕鬆愉快的淺層學習與孚兌般需真誠投入與承諾的深度學習間的選擇時，你會維持輕鬆節奏把學習當生活調劑不給自己太大壓力，還是願對某領域做真誠深度承諾即使須犧牲其他休閒時間並承受學習高原期的挫折感？',
  q3: '在孚兌般對某學習領域做真誠深度承諾後，哪個學習訊號一旦出現，代表你的承諾已從自我驅動變為自我強迫你正用我已承諾的責任感壓抑對這領域其實已失真誠熱情只在機械式完成進度？',
};
HEX58.data.health = {
  imgs: ['引兌', '孚于剝', '麗澤兌'],
  q1: '引兌暗示身體可能需刻意引入某些喜悅活動或習慣來重新激活健康能量，你覺得目前是處在知道該運動早睡但缺乏引動那股初始能量的倦怠期，還是已開始引入新健康習慣但身體仍在適應中效果尚未顯現的轉型陣痛期？',
  q2: '當察覺到孚于剝般某個你長期信任的生活習慣如熬夜或飲食正悄悄剝蝕健康基礎時，你會立即用新習慣取代這些已證明有害的舊模式不給緩衝期，還是麗澤兌般先從增加對身體有益的喜悅活動開始用正向滋養自然排擠掉有害習慣？',
  q3: '在麗澤兌般用喜悅滋養方式調理身體的過程中，哪個身體訊號一旦被你用我正在用正向方式調理來合理化而未正視其警示意義，代表你正用喜悅養生的名義迴避某個需醫療介入而非僅靠生活方式就能解決的健康問題？',
};
HEX58.data.decision = {
  imgs: ['商兌未寧', '孚于剝', '引兌'],
  q1: '商兌未寧表示你在做重大決定時正處於在利弊間反覆衡量導致內心不安的狀態，你覺得這不安是因決定牽涉重大需更周全評估不該倉促，還是已把所有能分析的因素都分析過了不安根源其實是你對任何選擇都缺乏承擔後果的信心？',
  q2: '當察覺到孚于剝般你原本信任的決策依據或參考框架正悄悄失去可靠性時，你會立即停止依賴這已出現裂縫的框架重新回到最基礎事實層面從零評估，還是引兌般尋找新外部視角或顧問來補充原有框架相信修補後它仍堪用？',
  q3: '在引兌般尋找外部意見協助決策的過程中，哪個心理訊號一旦出現，代表你對外部意見的依賴已從補充視角變為責任轉嫁你正以徵詢意見的名義分散萬一決策失敗時需獨自承擔的心理壓力？',
};
HEX58.data.business = {
  imgs: ['麗澤兌', '商兌未寧', '和兌'],
  q1: '麗澤兌象徵創業成功來自企業與市場間像兩澤相連般的相互滋養與喜悅交換，你覺得目前與市場關係是健康雙向滋養客戶因你產品受益你也因客戶回饋成長，還是處於單向輸出一直在給予但市場回饋與營收未形成讓你感到滋養的正向循環？',
  q2: '當企業處於商兌未寧般在商業利益與核心價值間反覆衡量無法獲得安寧時，你會回歸創業初心重確認這事業除了賺錢還有什麼讓你真正喜悅滿足的核心意義，還是和兌般與團隊坦誠討論這不安看能否找到兼顧利益又不違初心的折衷方案？',
  q3: '在和兌般以溫和溝通與團隊共同面對企業不安的過程中，哪個組織訊號一旦出現，代表團隊和諧已從健康共識變為集體逃避沒有人願成為那個指出國王沒穿衣服的人？',
};
HEX58.data.legal = {
  imgs: ['孚于剝', '來兌', '引兌'],
  q1: '孚于剝暗示法律事務中你原本信任的合約條款或合作對象可能正悄悄侵蝕你的權益，你覺得這剝蝕是合約中當初沒留意的模糊地帶被人利用屬可修正技術性問題，還是你從一開始就對對方誠信有所保留但因利益吸引而選擇性忽略那些紅旗？',
  q2: '當法律糾紛中出現來兌般對方主動帶著看似善意的和解方案接近你時，你會引兌般謹慎檢視方案每個細節不被表面善意迷惑相信魔鬼藏細節裡，還是認為在對抗中任何和解契機都值得把握與其繼續消耗不如務實評估方案可行性？',
  q3: '在引兌般謹慎引導法律事務走向對你最有利方向時，哪個法律程序或時效節點一旦逼近，代表謹慎已從必要審慎變為危險拖延你正用還要再確認一下來錯過法律上不容猶豫的最後行動期限？',
};
HEX58.data.spiritual = {
  imgs: ['麗澤兌', '和兌', '孚兌'],
  q1: '麗澤兌象徵內在修行中真正喜悅來自與天地萬物間像兩澤相連般的能量交換與滋養，你覺得目前修行是充滿與世界連結的流動喜悅每天在簡單事物中感受滋養，還是修行對你來說仍較多是責任或紀律喜悅成分還沒成為這路上的主要風景？',
  q2: '當修行面臨和兌般輕鬆自在的態度與孚兌般需真誠投入嚴格自律的深度修行間的選擇時，你會保持和兌的輕鬆感相信修行不該是沉重負擔真正轉化發生在放鬆與接納中，還是認為孚兌般真誠承諾與紀律才是通往深度轉化的必經之路？',
  q3: '在孚兌般以真誠承諾投入深度修行後，哪個心念一旦反覆出現，代表你對修行成果的執著本身已變為新障礙你正用修行的紀律與真誠包裝對某種特殊體驗或境界的貪求？',
};

// ===== HEX 59 渙 questions =====
const HEX59 = { hexagramId: 59, hexagramName: '渙', full: '風水渙', data: {} };
HEX59.data.general = {
  imgs: ['風行水上', '渙其群', '渙有丘'],
  q1: '風行水上象徵生命正處渙散狀態風吹過水面原有結構與秩序正被打散重組，你覺得這渙散像水面被風吹皺後會自然恢復平靜的暫時波動，還是原結構本身有問題風只是加速本該發生的瓦解你需接受並善用這渙散而非試圖回到原狀？',
  q2: '當生命中出現渙其群般需解散舊有人際圈或生活模式才能釋放能量重新出發時，你會主動清理不再滋養你的群體與習慣讓渙散成有意識的選擇，還是渙有丘般在渙散中先建立新核心支點確保不迷失方向再處理該解散什麼？',
  q3: '在渙有丘般於渙散混亂中努力建立新穩固核心的過程中，哪個生活訊號一旦出現，代表你正建立的這個新丘不是真正核心而只是你在渙散中因恐慌隨手抓住的浮木它無法承載你長期的重量？',
};
HEX59.data.career = {
  imgs: ['用拯馬壯', '渙奔其机', '渙其躬'],
  q1: '用拯馬壯暗示職涯需藉助強而有力的外部資源或貴人來拯救困境如用壯馬脫離泥沼，你覺得已辨識出那匹可助你脫困的壯馬只是還在想如何接近牠，還是你其實還不清楚能成為你壯馬的是什麼正盲目在泥沼中獨自掙扎？',
  q2: '當職涯中有機會渙奔其机般在渙散中快速奔向新平台或機會時，你會立即抓住機會像奔向几案般迅速轉換跑道不讓渙散狀態持續太久，還是渙其躬般先檢視自己本身有哪些需調整處認為不先處理自身問題即使換了平台困境遲早重演？',
  q3: '在渙其躬般回頭檢視並調整自身職業能力與心態的過程中，哪個自我認知一旦被你反覆迴避，代表自我檢視已從誠實反思變為另種逃避你正用自我檢討的名義延遲那個需勇氣才能做出的職涯跳躍？',
};
HEX59.data.love = {
  imgs: ['渙其躬', '渙其血', '渙奔其机'],
  q1: '渙其躬暗示感情中你可能需先解散自身的舊模式或執著才能讓關係有新可能，你覺得已清楚辨識出哪個自身模式在阻礙關係進展並準備好要改變，還是知自己有問題但不確定具體是什麼一直在模糊自我感覺中徘徊？',
  q2: '當感情經歷渙其血般需釋放深層傷痛與情緒積累才能讓關係重新流動時，你會選擇坦誠讓這些血淚流出即使痛苦但信清理後雙方能更輕盈前進，還是渙奔其机般認為與其處理沉重創傷不如先轉移到新相處模式用新正向體驗覆蓋舊傷口？',
  q3: '在渙奔其机般感情轉移到新相處模式或階段後，哪個互動訊號一旦重新出現，代表你們只是在用新模式包裝舊問題那些未被渙其血般真正清理的傷口正於新包裝下悄悄繼續發炎？',
};
HEX59.data.money = {
  imgs: ['渙奔其机', '渙其群', '用拯馬壯'],
  q1: '渙奔其机暗示你的財務可能需在渙散中快速奔向新平台或策略才能穩住局面，你覺得目前財務渙散是暫時現金流波動只要撐過這月就能回正軌，還是財務結構本身就建在不穩固基礎上渙散不是意外而是遲早會發生的必然結果？',
  q2: '當財務需渙其群般解散舊的消費習慣或投資配置釋放被綁住的資金時，你會一次性大刀闊斧清理所有不健康財務習慣從零建立新紀律，還是用拯馬壯般先找強而有力的外部理財工具或顧問助你在不過度震盪生活下逐步調整財務結構？',
  q3: '在用拯馬壯般藉助外部資源如理財顧問或投資工具拯救財務困境時，哪個財務行為一旦出現，代表你對外部資源的依賴已從借力變為卸責你正把理財主動權完全交給別人而自己連最基本的收支追蹤都不再關心？',
};
HEX59.data.people = {
  imgs: ['渙其群', '風行水上', '渙有丘'],
  q1: '渙其群暗示人際圈正經歷一場自然的渙散與重組舊群體正在解散新連結正在形成，你覺得這波人際渙散是你主動選擇的結果刻意疏遠了不再適合的圈子，還是被動發現自己正被某些群體邊緣化而你還沒準備好接受這種被渙散的感覺？',
  q2: '當人際面臨風行水上般自然流動的社交狀態與渙有丘般需刻意建立穩固核心圈間的選擇時，你會順應風行水上的流動讓關係自然來去不強求留下也不抗拒離開，還是認為在渙散環境中更需主動建立少數但極穩固的核心關係作為社交錨點？',
  q3: '在渙有丘般努力建立少數但穩固的核心人際關係時，哪個互動訊號一旦出現，代表你對穩固的執著已從健康歸屬需求變為對孤獨的恐懼你正把任何願留下的人都當核心而沒真正篩選這些人是否值得那個位置？',
};
HEX59.data.family = {
  imgs: ['渙其躬', '渙其血', '用拯馬壯'],
  q1: '渙其躬暗示家庭中需某成員先從自身開始解散舊有模式才能帶動全家轉變，你覺得自己是那個需先改變的人並已準備好承擔這先行責任，還是你一直認為問題出在其他家人身上自己在家庭中角色是無辜受害者而非需要改變的參與者？',
  q2: '當家庭需渙其血般釋放長年累積傷痛與未說出口的話才能讓關係重新流動時，你會用拯馬壯般先找強而有力的外部支持如治療師協助確保不失控，還是認為有些血只能家人自己釋放外人介入只會讓問題更複雜選擇在內部自行面對？',
  q3: '在用拯馬壯般藉助外部支持處理家庭創傷後，哪個家庭互動模式一旦在治療後仍無改變，代表外部支持效果已到極限剩下的轉變需某成員做出外部力量無法代勞的根本性選擇？',
};
HEX59.data.study = {
  imgs: ['用拯馬壯', '渙奔其机', '渙其群'],
  q1: '用拯馬壯暗示學習需藉助強而有力的外部資源如好老師教材或環境才能突破瓶頸，你覺得已找到那匹壯馬只是還在猶豫是否投入相應的時間金錢，還是根本還沒知道什麼資源能幫你正用漫無目的的自行摸索取代系統性學習策略？',
  q2: '當學習有機會渙奔其机般快速轉換到新平台或領域時，你會立即抓住契機像奔向几案般果斷投入新方向不讓猶豫消耗初始動能，還是渙其群般先清理目前學習清單中佔據時間但效益不高的項目為新方向騰出足夠專注空間再出發？',
  q3: '在渙其群般清理學習清單篩選哪些該繼續哪些該放手時，哪個學習項目一旦被你反覆保留卻從未真正投入時間，代表你對它的留戀已非基於學習需求而是基於沉沒成本執著捨不得的是你曾為它花掉的時間而非那個領域？',
};
HEX59.data.health = {
  imgs: ['渙其血', '用拯馬壯', '風行水上'],
  q1: '渙其血暗示身體可能需要釋放某些積累已久的毒素或壓力如排毒發汗或情緒釋放讓氣血重新流通，你覺得目前身體已累積到需一次較大釋放才能恢復輕盈的臨界點，還是仍在累積過程雖有些不適但還在可以用休息勉強維持的範圍內？',
  q2: '當健康需用拯馬壯般藉助強而有力的醫療或養生資源拯救身體困境時，你會積極尋求專業醫療不拖延不自行診斷把身體交給信賴的專業人士，還是風行水上般先從調整作息飲食開始用最自然方式讓身體自癒力成為最終壯馬？',
  q3: '在風行水上般以自然溫和方式讓身體自行恢復時，哪個身體訊號一旦持續惡化超過某個時間門檻，代表自然療法已不足應對問題你正用順其自然的理念合理化對醫療介入的逃避？',
};
HEX59.data.decision = {
  imgs: ['渙汗其大號', '渙其群', '渙奔其机'],
  q1: '渙汗其大號象徵做重大決定時需像發出大汗般做出清晰響亮的宣告讓所有相關人知道你的立場，你覺得自己已準備好發這大號只是在等待最佳時機場合，還是內心其實還未真正下定決心只是在外界壓力下覺得應該要做出了？',
  q2: '當決策需渙其群般先解散干擾你判斷的多餘選項與意見時，你會果斷篩選只保留最核心幾個選項讓決策空間清晰不讓過多可能性癱瘓判斷，還是渙奔其机般認為與其在原地篩選不如先快速嘗試最有潛力方向用行動獲真實回饋取代紙上分析？',
  q3: '在渙奔其机般快速做決定奔向新方向後，哪個訊號一旦出現，代表這快速決定其實是在逃避而非前進你正用行動的忙碌掩蓋自己根本沒解決那個讓你最初需做決定的核心問題？',
};
HEX59.data.business = {
  imgs: ['風行水上', '渙有丘', '渙其群'],
  q1: '風行水上象徵創業環境正處渙散流動狀態市場風向讓水面不再平靜原有商業模式可能瓦解重組，你覺得這渙散對事業是威脅因你沒建立足以抵禦風浪的穩固基礎，還是機會因渙散意味舊壁壘瓦解新參與者有機會在重整中找到自己的位置？',
  q2: '當企業在渙散市場需在渙有丘般建新核心業務與渙其群般解散不再有競爭力的舊業務間選擇時，你會先建新核心確保有穩固的丘可站立再回頭處理舊業務解散，還是先清理拖累資源的舊業務讓組織變輕後再全力衝刺新方向？',
  q3: '在渙其群般解散舊業務釋放資源時，哪個業務或產品線一旦被你反覆保留卻持續虧損，代表你對它的堅持已非基於商業判斷而是情感或自尊這是你親手創建的所以無法親手結束它？',
};
HEX59.data.legal = {
  imgs: ['渙汗其大號', '用拯馬壯', '渙其躬'],
  q1: '渙汗其大號暗示法律事務需你做出清晰正式宣告或立場聲明不能模稜兩可，你覺得自己對這宣告內容已準備充分只是在選擇最有利的發布時機與方式，還是對該宣告什麼內容本身還沒明確定見正讓律師幫你決定本該自己決定的立場？',
  q2: '當法律事務需用拯馬壯般尋找強而有力的法律資源扭轉局勢時，你會投入更多預算聘更有經驗的律師團隊相信專業壯馬能幫你跑贏這法律賽局，還是渙其躬般先檢視自己在此糾紛中的責任在哪因最強的壯馬也無法在你站不穩下幫你贏？',
  q3: '在渙其躬般誠實檢視自己在法律糾紛中責任後，哪個法律策略一旦因自責心態被你放棄，代表自我檢視已從誠實負責變為過度自責你正用一切都是我的錯來放棄法律上本該屬於你的合理防禦權利？',
};
HEX59.data.spiritual = {
  imgs: ['風行水上', '渙其躬', '渙其血'],
  q1: '風行水上象徵修行需經歷渙散過程舊自我結構被風吹散才能讓新覺知在水面下成形，你覺得目前處於剛感受風起但水面未真正被吹皺的醞釀期，還是已在渙散過程感到舊信念認同正瓦解雖不安但隱約感受一股解放的可能性？',
  q2: '當修行需在渙其躬般解散自我執著與渙其血般釋放深層情緒創傷間選擇優先順序時，你會先從渙其躬鬆動對我是誰的僵固認知讓更寬廣理解成為可能，還是先從渙其血釋放壓抑在身體情緒深處的創傷因不先清理淤血自我結構也難鬆動？',
  q3: '在渙其血般釋放深層情緒創傷的過程中，哪個心念一旦反覆出現，代表釋放已從健康療癒變為對痛苦的上癮你正用不斷回溯傷痛來逃避當下生活中需你實際面對處理的現實課題？',
};

// ===== HEX 60 節 questions =====
const HEX60 = { hexagramId: 60, hexagramName: '節', full: '水澤節', data: {} };
HEX60.data.general = {
  imgs: ['澤上有水', '安節', '甘節'],
  q1: '澤上有水象徵人生需節制如澤地承接天水過多則溢過少則乾必須有適度調節才保平衡，你覺得整體生活是節制過度澤地正乾涸缺滋養與樂趣，還是節制不足各方面都在溢出精力資源正被過度消耗而你還沒設下有效邊界？',
  q2: '面對安節般以安穩平和心態遵守生命必要的節制與紀律時，你會選擇安於有秩序的生活節奏相信節制本身就是深層自由，還是甘節般追求更高層次的節制不是因必須而是因從中感受甘甜與喜悅的自主性節制？',
  q3: '在甘節般從節制中感受甘甜與自主喜悅後，哪個生活訊號一旦出現，代表甘節已從健康自律變為另種形式的執著你正用節制的美德合理化對生活中正常享樂與放鬆的罪惡感？',
};
HEX60.data.career = {
  imgs: ['不出戶庭', '不出門庭', '安節'],
  q1: '不出戶庭暗示職涯中你可能需謹守崗位不宜冒進像守在戶庭內不宜遠行，你覺得這守在戶庭是基於對時局的正確判斷知現在出擊風險大於收益，還是你其實想出去闖但被恐懼困在戶庭內用時機未到合理化自己的停滯？',
  q2: '當職涯面臨不出門庭般連門庭外較大範圍都不宜涉足的嚴格節制時，你會遵守警示暫時不對外擴張把精力用在鞏固內部基礎，還是安節般在安穩中保持對外界的適度關注與準備不讓完全封閉錯失觀察外部機會的窗口？',
  q3: '在安節般以安穩節奏於現有崗位持續深耕的過程中，哪個職涯訊號一旦出現，代表安穩已從策略耐心變為舒適區停滯你正以穩定薪資與熟悉環境逃避自己早已對這工作失去熱情與成長空間的事實？',
};
HEX60.data.love = {
  imgs: ['甘節', '苦節', '安節'],
  q1: '甘節象徵感情中健康節制是出於自願且能感受甘甜不是被強迫的限制，你覺得這段關係的界限規範是雙方甘願遵守且因此讓關係更穩固的甘節，還是其中一方或雙方在苦節般勉強自己遵守讓自己痛苦的規則只是沒勇氣說出來？',
  q2: '當感情中發現相處模式已變苦節般節制帶來不是成長而是痛苦時，你會坦誠與對方重協商關係界限找能讓雙方從節制中感受甘甜的平衡點，還是安節般先安於現狀不挑起衝突對話相信時間會讓彼此磨合自然找到出路？',
  q3: '在安節般安於現狀不對關係中苦節提出挑戰的過程中，哪個互動訊號一旦被你長期忽略，代表安於現狀已從維穩智慧變為慢性自欺你正用一切都還好掩蓋一段在苦節中慢慢窒息而雙方都假裝還能呼吸的關係？',
};
HEX60.data.money = {
  imgs: ['不出戶庭', '不節若', '安節'],
  q1: '不出戶庭暗示財務正處於不宜輕舉妄動的階段像守在戶庭內不宜大額投資或消費，你覺得這謹守是基於對市場風險的清醒評估知現在不是出手時機，還是因過去吃過虧變得過度保守連合理投資機會也被你以風險為由一概拒絕？',
  q2: '當察覺不節若般若不節制消費或投資後果將是嚴重損失時，你會立即制定嚴格預算與節制計畫強制改變現有消費模式，還是安節般先建穩定可持續的節制習慣不追求一步到位極端節約避免因太嚴格而反彈性放棄？',
  q3: '在安節般以穩定可持續方式建立財務節制習慣時，哪個財務數字一旦連續數月沒改善，代表安節力度根本不足應對你的財務問題你正用慢慢來當藉口延遲那個需更大幅度改變才能解決的結構性問題？',
};
HEX60.data.people = {
  imgs: ['安節', '甘節', '不出門庭'],
  q1: '安節暗示人際互動正處安穩有節階段不卑不亢保持適當距離與節奏，你覺得這安節基於你對人際邊界的清楚認知知什麼距離對彼此最舒適，還是你其實渴望更親密連結但因怕受傷或被拒絕而用安節的距離感來保護自己？',
  q2: '當人際需在甘節般自願愉快遵守人際界限與不出門庭般完全封閉不與外界接觸間選擇時，你會保持對外界開放但清楚設立界限讓進入你生命的人知你規則，還是經歷傷害後傾向不出門庭暫時關閉社交給自己完整獨處與療傷時間？',
  q3: '在不出門庭般選擇暫時封閉社交大門獨處療傷時，哪個時間長度一旦超過，代表獨處已從健康自我修復變為對社交的逃避你正用我需要一個人靜一靜來合理化日益加深的社交孤立？',
};
HEX60.data.family = {
  imgs: ['不出門庭', '甘節', '苦節'],
  q1: '不出門庭暗示家庭可能需對外封閉對內凝聚的階段減少外部活動把注意力收回家庭內部，你覺得這封閉期是家庭需要的沉澱重整時光每人能在保護性空間中休息修復，還是封閉正讓家庭變孤島成員因過度緊密相處開始產生摩擦與窒息感？',
  q2: '當家庭需建立甘節般讓每個成員都甘願遵守的規範時，你會透過家庭會議讓每人表達對規範的想法感受共同制定大家願遵守的規則，還是認為有些規範不需討論家長責任就是設界限成員的責任就是遵守討論太多反削弱執行力？',
  q3: '在甘節般建立全家都甘願遵守的規範後，哪個家庭互動訊號一旦出現，代表甘節已從健康家庭秩序變為僵化家庭法律規範不再為保護家人而變成一種不允許任何彈性與例外的新型家庭壓迫？',
};
HEX60.data.study = {
  imgs: ['澤上有水', '安節', '不出戶庭'],
  q1: '澤上有水象徵學習需節制調節如澤地承接天水過猶不及都需智慧平衡，你覺得目前學習是資訊攝取過多但消化吸收不足的過溢狀態，還是攝取不足處於學習乾涸期需重新找到讓澤地再次充盈的動力來源？',
  q2: '當學習需安節般建立穩定有節奏的習慣時，你會每天固定時間學習讓學習像呼吸般成為生活自然的節奏，還是不出戶庭般先把自己與外界干擾隔離給自己完整閉關時間集中火力突破某個關鍵瓶頸？',
  q3: '在不出戶庭般閉關式集中學習時，哪個學習訊號一旦出現，代表閉關已從高效集中學習變為低效自我隔離你正用我在閉關讀書來逃避那些需與人交流討論才能真正理解的學習內容？',
};
HEX60.data.health = {
  imgs: ['苦節', '甘節', '澤上有水'],
  q1: '苦節暗示身體可能正承受過於嚴苛的節制如過度飲食控制或運動強度節制已從養生變為另種自虐，你覺得對身體的嚴格要求是出於健康目標且有科學依據的合理節制，還是已意識到某些節制超出健康範圍但怕一旦放鬆會失去對身體的控制？',
  q2: '當健康管理需從苦節轉向甘節般找能維持健康又感受甘甜喜悅的平衡點時，你會立即停止讓身體痛苦的節制方式重新尋更溫和可持續的策略，還是澤上有水般先觀察身體反應逐步調整不急著全盤否定因某些苦澀過程可能是適應期必經階段？',
  q3: '在澤上有水般逐步調整健康策略尋找過與不及間最佳平衡時，哪個身體訊號一旦被你用還在調整期中合理化超過某時間長度，代表調整已從謹慎漸進變為不做決定的藉口你正以微調避免承認某問題需的不是微調而是徹底生活方式革命？',
};
HEX60.data.decision = {
  imgs: ['不節若', '苦節', '安節'],
  q1: '不節若提醒做重大決定時若不懂節制收斂後果將是痛苦嗟嘆，你覺得目前對這決定的思考是節制不足想太多變數與可能性反讓自己陷入分析癱瘓，還是處於苦節般過度節制對自己要求太嚴苛設不切實際完美標準導致任何選項都無法過關？',
  q2: '當決策需在苦節般過於嚴苛的自我要求與安節般安穩有節的務實評估間選擇時，你會放下不切實際完美標準以安節態度接受夠好但不完美的方案，還是認為事關重大不能降低標準即使苦節般嚴格篩選讓過程更痛苦但最終結果值得？',
  q3: '在安節般以安穩有節態度做決定後，哪個心理訊號一旦出現，代表安節已從務實接受變為消極妥協你正用夠好就好的心態合理化自己其實在逃避那個需更多勇氣與努力才能達成的更好方案？',
};
HEX60.data.business = {
  imgs: ['澤上有水', '安節', '不出門庭'],
  q1: '澤上有水象徵創業需如澤地調節水位般精準控制資源流入流出過與不及都帶來問題，你覺得事業目前是資金燃燒過快資源正溢出的警戒狀態，還是過於保守資金都留帳上不敢投入導致成長停滯的資源乾涸狀態？',
  q2: '當企業需在安節般建穩定可持續營運節奏與不出門庭般暫停對外擴張全力鞏固內部間選擇時，你會安節般維持現有業務穩定運轉同時保留適度對外探索動能，還是認為市場不容資源分散選擇不出門庭把百分百精力資源用在內部強化？',
  q3: '在不出門庭般企業全力鞏固內部停止對外擴張時，哪個市場或競爭訊號一旦出現，代表閉關已從策略性的內部強化變為危險的自我封閉你正用練內功來錯過市場上稍縱即逝的關鍵機會窗口？',
};
HEX60.data.legal = {
  imgs: ['不出戶庭', '安節', '苦節'],
  q1: '不出戶庭暗示法律事務正處不宜輕舉妄動階段任何不謹慎言行都可能被對方利用，你覺得對這法律局勢的謹守分寸是經律師建議的理性策略，還是因對程序不熟悉而過度恐懼連正常法律權益都不敢主張？',
  q2: '當法律事務需在安節般以平穩有節態度進行程序與苦節般承受痛苦煎熬間選擇時，你會安節般把程序當需耐心紀律的長期過程保持情緒穩定不被挑釁影響，還是認為法律戰本是苦澀與其壓抑不如正視痛苦本質讓自己有心理準備承受煎熬？',
  q3: '在苦節般承受法律程序長期痛苦煎熬後，哪個訊號一旦出現，代表你對痛苦的耐受已從堅毅變為麻木你正用我已經習慣了合理化對一個早該尋求和解或止損的案件持續投入已不成比例的時間金錢？',
};
HEX60.data.spiritual = {
  imgs: ['澤上有水', '甘節', '苦節'],
  q1: '澤上有水象徵內在修行需像澤地調節水位般在紀律與彈性間找到智慧平衡，你覺得目前修行是紀律過嚴以致變為另種壓迫與苦節，還是彈性過大致修行已變可有可無的點綴失去轉化生命的力量？',
  q2: '當修行需在甘節般從自律感受甘甜自由與苦節般靠意志力硬撐的苦行間選擇時，你會甘節般重調修行方式找能真心享受而非勉強自己的節奏，還是認為某些修行階段本就是苦澀的甘甜只有穿越苦澀後才會到來不該因暫時不舒服就降標準？',
  q3: '在苦節般以意志力硬撐度過修行艱難階段後，哪個心念一旦反覆出現，代表你對苦行的認同已從必經過程變為自我懲罰的偽裝你正用修行本來就是苦的合理化對自己施加不必要嚴苛並以此為傲？',
};


// ===== BUILD, VALIDATE, WRITE =====
function buildQuestions(hexDef) {
  const out = [];
  for (const [catKey, catName] of CATEGORIES) {
    const d = hexDef.data[catKey];
    if (!d) throw new Error('Missing data for hex ' + hexDef.hexagramId + ' cat ' + catKey);
    const entries = [d.q1, d.q2, d.q3];
    entries.forEach((question, idx) => {
      out.push({
        id: 'rf-' + String(hexDef.hexagramId).padStart(3, '0') + '-' + catKey + '-' + (idx + 1),
        hexagramId: hexDef.hexagramId,
        hexagramName: hexDef.hexagramName,
        category: catKey,
        categoryName: catName,
        question: question,
        basis: [hexDef.hexagramName, d.imgs[idx] || d.imgs[0], catName],
        qualityLevel: 'refined',
        reviewed: false,
        needsHumanReview: true,
        version: '1.9.0-wE-refl-hex57-60',
      });
    });
  }
  return out;
}

function normalize(s) {
  return s.replace(/[？，。！、\s]/g, '');
}

function validateLengths(questions, label) {
  const bad = [];
  for (const q of questions) {
    const len = q.question.length;
    if (len < 38 || len > 105) {
      bad.push({ id: q.id, len: len, question: q.question });
    }
  }
  if (bad.length) {
    console.error('[' + label + '] Length validation FAILED for ' + bad.length + ' questions:');
    bad.forEach(function(b) { console.error('  ' + b.id + ' len=' + b.len + ': ' + b.question); });
    return false;
  }
  console.log('[' + label + '] Length validation OK for ' + questions.length + ' questions (38-105 chars).');
  const lens = questions.map(function(q) { return q.question.length; });
  console.log('  min=' + Math.min.apply(null, lens) + ' max=' + Math.max.apply(null, lens) + ' avg=' + (lens.reduce(function(a,b){return a+b;},0)/lens.length).toFixed(1));
  return true;
}

function validateEndsWithQuestionMark(questions, label) {
  const bad = questions.filter(function(q) { return !q.question.endsWith('？'); });
  if (bad.length) {
    console.error('[' + label + '] Missing terminal ？ for:', bad.map(function(b) { return b.id; }));
    return false;
  }
  console.log('[' + label + '] Terminal ？ validation OK.');
  return true;
}

function validateUniqueness(questions, label) {
  const seen = new Map();
  let dupCount = 0;
  for (const q of questions) {
    const norm = normalize(q.question);
    if (seen.has(norm)) {
      dupCount++;
      console.error('[' + label + '] Duplicate (normalized) between ' + seen.get(norm) + ' and ' + q.id);
    } else {
      seen.set(norm, q.id);
    }
  }
  const uniqueCount = questions.length - dupCount;
  console.log('[' + label + '] Uniqueness: ' + uniqueCount + '/' + questions.length + ' unique after normalization.');
  if (dupCount > 0) return false;
  return true;
}

function validateNormU(questions, label) {
  const seen = new Map();
  for (const q of questions) {
    const norm = normalize(q.question);
    seen.set(norm, (seen.get(norm) || 0) + 1);
  }
  const uniqueCount = seen.size;
  const total = questions.length;
  const ratio = (uniqueCount / total * 100).toFixed(1);
  console.log('[' + label + '] normU: ' + uniqueCount + '/' + total + ' (' + ratio + '%)');
  if (uniqueCount < 32) {
    console.error('[' + label + '] normU FAILED: ' + uniqueCount + ' < 32 required.');
    return false;
  }
  console.log('[' + label + '] normU >= 32/36 PASSED.');
  return true;
}

function validateImageryUsage(questions, label, hexName) {
  const groupQuestions = {};
  for (const q of questions) {
    const key = q.hexagramId + '-' + q.category;
    if (!groupQuestions[key]) groupQuestions[key] = { questions: [], imgs: new Set() };
    groupQuestions[key].questions.push(q);
    groupQuestions[key].imgs.add(q.basis[1]);
  }
  const bad = [];
  for (const key of Object.keys(groupQuestions)) {
    const g = groupQuestions[key];
    const allImgs = Array.from(g.imgs);
    let imageryCount = 0;
    for (const q of g.questions) {
      const hasImagery = allImgs.some(function(term) { return q.question.includes(term); });
      if (hasImagery) imageryCount++;
    }
    if (imageryCount < 2) {
      bad.push(key + ': only ' + imageryCount + '/' + g.questions.length + ' questions use hex imagery (need >=2)');
    }
  }
  if (bad.length) {
    console.error('[' + label + '] Imagery usage FAILED:');
    bad.forEach(function(b) { console.error('  ' + b); });
    return false;
  }
  console.log('[' + label + '] Imagery usage OK: all ' + Object.keys(groupQuestions).length + ' groups have >=2 hex-imagery questions.');
  return true;
}

function validateQStructure(questions, label) {
  const bad = [];
  for (const q of questions) {
    const qType = parseInt(q.id.split('-')[3]);
    if (qType === 1) {
      if (!q.question.includes('還是')) {
        bad.push(q.id + ': Q1 should contain 還是 (state comparison)');
      }
    } else if (qType === 2) {
      if (!q.question.includes('還是')) {
        bad.push(q.id + ': Q2 should contain 還是 (choice comparison)');
      }
    } else if (qType === 3) {
      if (q.question.includes('還是')) {
        bad.push(q.id + ': Q3 should NOT contain 還是 (risk/boundary/timing question)');
      }
    }
  }
  if (bad.length) {
    console.error('[' + label + '] Q-structure validation FAILED:');
    bad.forEach(function(b) { console.error('  ' + b); });
    return false;
  }
  console.log('[' + label + '] Q-structure validation OK: Q1/Q2 have 還是, Q3 do not.');
  return true;
}

function main() {
  const newH57 = buildQuestions(HEX57);
  const newH58 = buildQuestions(HEX58);
  const newH59 = buildQuestions(HEX59);
  const newH60 = buildQuestions(HEX60);

  const allNew = newH57.concat(newH58).concat(newH59).concat(newH60);
  console.log('Built ' + allNew.length + ' new questions (36 each hex 57,58,59,60).\n');

  let allPassed = true;

  console.log('--- LENGTH VALIDATION (38-105) ---');
  if (!validateLengths(newH57, 'HEX57')) allPassed = false;
  if (!validateLengths(newH58, 'HEX58')) allPassed = false;
  if (!validateLengths(newH59, 'HEX59')) allPassed = false;
  if (!validateLengths(newH60, 'HEX60')) allPassed = false;

  console.log('\n--- TERMINAL ？ VALIDATION ---');
  if (!validateEndsWithQuestionMark(newH57, 'HEX57')) allPassed = false;
  if (!validateEndsWithQuestionMark(newH58, 'HEX58')) allPassed = false;
  if (!validateEndsWithQuestionMark(newH59, 'HEX59')) allPassed = false;
  if (!validateEndsWithQuestionMark(newH60, 'HEX60')) allPassed = false;

  console.log('\n--- UNIQUENESS VALIDATION ---');
  if (!validateUniqueness(newH57, 'HEX57')) allPassed = false;
  if (!validateUniqueness(newH58, 'HEX58')) allPassed = false;
  if (!validateUniqueness(newH59, 'HEX59')) allPassed = false;
  if (!validateUniqueness(newH60, 'HEX60')) allPassed = false;
  if (!validateUniqueness(allNew, 'HEX57+58+59+60 combined')) allPassed = false;

  console.log('\n--- normU VALIDATION (>= 32/36) ---');
  if (!validateNormU(newH57, 'HEX57')) allPassed = false;
  if (!validateNormU(newH58, 'HEX58')) allPassed = false;
  if (!validateNormU(newH59, 'HEX59')) allPassed = false;
  if (!validateNormU(newH60, 'HEX60')) allPassed = false;

  console.log('\n--- IMAGERY USAGE VALIDATION ---');
  if (!validateImageryUsage(newH57, 'HEX57', '巽')) allPassed = false;
  if (!validateImageryUsage(newH58, 'HEX58', '兌')) allPassed = false;
  if (!validateImageryUsage(newH59, 'HEX59', '渙')) allPassed = false;
  if (!validateImageryUsage(newH60, 'HEX60', '節')) allPassed = false;

  console.log('\n--- Q-STRUCTURE VALIDATION (Q1/Q2 還是, Q3 not) ---');
  if (!validateQStructure(newH57, 'HEX57')) allPassed = false;
  if (!validateQStructure(newH58, 'HEX58')) allPassed = false;
  if (!validateQStructure(newH59, 'HEX59')) allPassed = false;
  if (!validateQStructure(newH60, 'HEX60')) allPassed = false;

  if (!allPassed) {
    console.error('\n*** VALIDATION FAILED. NOT writing data file. ***');
    process.exit(1);
  }

  console.log('\n=== ALL 144 QUESTIONS PASSED VALIDATION. Writing data file. ===\n');

  const code = fs.readFileSync(DATA_PATH, 'utf8');
  const sandbox = { window: {} };
  vm.createContext(sandbox);
  vm.runInContext(code, sandbox, { filename: DATA_PATH });
  const data = sandbox.window.Zero1MatrixData.reflectionQuestions;
  if (!Array.isArray(data)) throw new Error('Failed to load existing reflectionQuestions array');

  console.log('Loaded existing data: ' + data.length + ' questions total.');

  const before57 = data.filter(function(d) { return d.hexagramId === 57; }).length;
  const before58 = data.filter(function(d) { return d.hexagramId === 58; }).length;
  const before59 = data.filter(function(d) { return d.hexagramId === 59; }).length;
  const before60 = data.filter(function(d) { return d.hexagramId === 60; }).length;
  console.log('Existing hex57=' + before57 + ', hex58=' + before58 + ', hex59=' + before59 + ', hex60=' + before60);

  const filtered = data.filter(function(d) {
    return d.hexagramId !== 57 && d.hexagramId !== 58 && d.hexagramId !== 59 && d.hexagramId !== 60;
  });
  const merged = filtered.concat(newH57).concat(newH58).concat(newH59).concat(newH60);

  merged.sort(function(a, b) { return a.hexagramId - b.hexagramId; });

  console.log('New total: ' + merged.length + ' (expected ' + (data.length - before57 - before58 - before59 - before60 + 144) + ')');

  const output =
    "window.Zero1MatrixData = window.Zero1MatrixData || {};\n" +
    "window.Zero1MatrixData.reflectionQuestions = " +
    JSON.stringify(merged) +
    ";\n";

  fs.writeFileSync(DATA_PATH, output, 'utf8');
  console.log('Written to ' + DATA_PATH);

  try {
    execFileSync(NODE_EXE, ['--check', DATA_PATH], { stdio: 'inherit' });
    console.log('node --check PASSED.');
  } catch (e) {
    console.error('node --check FAILED.');
    throw e;
  }

  const verifyCode = fs.readFileSync(DATA_PATH, 'utf8');
  const verifySandbox = { window: {} };
  vm.createContext(verifySandbox);
  vm.runInContext(verifyCode, verifySandbox, { filename: DATA_PATH });
  const verifyData = verifySandbox.window.Zero1MatrixData.reflectionQuestions;
  console.log('Verification reload: ' + verifyData.length + ' total questions.');
  for (const h of [57, 58, 59, 60]) {
    const vh = verifyData.filter(function(d) { return d.hexagramId === h; });
    console.log('Verification hex' + h + '=' + vh.length);
    if (vh.length !== 36) throw new Error('Verification failed: expected 36 questions for hex' + h);
  }

  const allVerified = verifyData.filter(function(d) { return [57,58,59,60].includes(d.hexagramId); });
  for (const q of allVerified) {
    if (q.qualityLevel !== 'refined') throw new Error(q.id + ': qualityLevel=' + q.qualityLevel);
    if (q.reviewed !== false) throw new Error(q.id + ': reviewed=' + q.reviewed);
    if (q.needsHumanReview !== true) throw new Error(q.id + ': needsHumanReview=' + q.needsHumanReview);
  }
  console.log('Quality field verification PASSED.');

  console.log('\nwE_refl_57_60.js generation COMPLETE - 144 questions written successfully.');
}

main();