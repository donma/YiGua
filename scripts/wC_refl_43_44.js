const fs = require('fs');
const path = require('path');

const CATEGORIES = [
  { id: 'general', name: '一般' },
  { id: 'career', name: '工作事業' },
  { id: 'love', name: '感情關係' },
  { id: 'money', name: '財務金錢' },
  { id: 'people', name: '人際合作' },
  { id: 'family', name: '家庭親人' },
  { id: 'study', name: '學習考試' },
  { id: 'health', name: '身心狀態' },
  { id: 'decision', name: '重大決策' },
  { id: 'business', name: '創業經營' },
  { id: 'legal', name: '官非合約' },
  { id: 'spiritual', name: '心境修行' },
];

// HEX 43 夬 imagery per category (3 Qs each)
const hex43Questions = {
  general: [
    '揚于王庭的公開決斷格局下，你目前生活中哪件事最需要你站出來當眾表明立場？你一直沒有說出口的那句「到此為止」是對什麼說的？',
    '當孚號有厲的告誡提醒你誠信呼號亦伴隨風險，你會選擇大聲疾呼以喚醒他人還是保持沉默以求自保？這兩個選擇各自的代價分別是什麼？',
    '不利即戎的邊界警告在提醒你：武力解決看似痛快實則危險。你當前面對的衝突中，哪個你本能想「硬來」的環節其實更需要以柔克剛的方式處理？',
  ],
  career: [
    '君子夬夬的果斷姿態在你目前的職場中，需要你像快刀斬亂麻一樣決斷的事情是什麼？你猶豫不決的根源是捨不得什麼？',
    '壯于前趾與告自邑之間，你目前的職場行動是更傾向於「先衝再說」還是「先內部溝通取得支持」？這兩種模式在你的職業經歷中各帶來過什麼結果？',
    '當你下定決心要在職場做一個重大決斷時，惕號莫夜有戎的提醒告訴你：夜晚的警惕也不能鬆懈。你這個決定最可能在哪個你沒想到的時刻遭遇反撲？',
  ],
  love: [
    '臀無膚的坐立不安狀態，在感情中是什麼讓你無法安坐？這段關係裡哪個具體的問題讓你像屁股長了瘡一樣坐不住？',
    '莧陸夬夬的反覆決斷與孚號有厲的誠信呼號，你覺得感情中反覆糾結同一個問題更消耗人，還是明知不對卻不願說破更消耗人？你的感情現狀更接近哪一種？',
    '當一段關係走到必須決斷的時刻，臀無膚的煎熬和莧陸夬夬的再三猶豫都在拖著你，你給自己設的最後底線是什麼？那個不能再退讓的邊界你還記得嗎？',
  ],
  money: [
    '告自邑的告誡提醒你先把自己的財務狀況徹底盤點清楚再對外行動，你目前最不願意面對的那筆帳是什麼？它藏在你財務報表的哪個角落？',
    '不利即戎告訴你武力解決不適合當下的財務問題，牽羊悔亡則說順勢而為可免後悔。你的理財策略目前更像「強攻」還是「順勢」？哪一種給過你更持久的收益？',
    '當財務壓力逼近，告自邑的內省和不利即戎的禁令都在限制你的行動空間，此時你還能做的最有價值的一件事是什麼？不做什麼比做什麼更難，對嗎？',
  ],
  people: [
    '揚于王庭的人際場合中，你需要公開表態的那段關係是什麼？在眾人面前把話說清楚這件事，你拖了多久了？',
    '孚號有厲的誠信呼號與壯于前趾的冒進姿態，人際關係中你更傾向於「以誠動人慢慢說」還是「直接攤牌一次解決」？這兩種方式在你的人際歷史中各引發過什麼連鎖反應？',
    '當你終於決定在人際關係中劃出邊界，孚號有厲提醒你誠信也有風險。你給對方的最後通牒時限是什麼？如果對方不回應，你的備案行動是什麼？',
  ],
  family: [
    '無號終有凶的嚴厲警告告訴你，在家庭中沉默不語最終必然招致不幸。你家中那個所有人都在迴避的話題是什麼？誰應該第一個開口？',
    '莧陸夬夬的反覆與臀無膚的難受，家庭矛盾中你覺得「反反覆覆拖著不解決」和「突然一刀切斷關係」哪個更傷人？你家的現狀更接近哪種？',
    '無號終有凶是對沉默者的終極警告。在你家中那個始終沒人敢碰的話題上，你給自己設定的開口時限是什麼時候？錯過這個時機會發生什麼？',
  ],
  study: [
    '君子夬夬的決斷力在你的學習路上，哪個科目或技能是你明知必須攻克卻一直拖延的？像君子揮刀一樣果斷面對它，你第一步要做什麼？',
    '惕號莫夜有戎的警覺與不利即戎的禁令，學習中你覺得「過度緊張草木皆兵」和「完全鬆懈沒有戒備」哪個對學習效果的傷害更大？你現在的學習心態更接近哪種？',
    '不利即戎告誡你不能用蠻力攻讀。你在學習上哪個環節正在用「死記硬背」這種最笨的方法？換一種更聰明的路徑，你最晚什麼時候必須轉彎？',
  ],
  health: [
    '臀無膚的身體不適感，你目前身體哪個部位在持續向你發出信號而你選擇了忽視？那種「坐立難安」的具體感受是什麼？',
    '惕號莫夜有戎的夜間警惕與孚號有厲的誠信呼號，身體保養中「過度焦慮每個小症狀」和「完全不理會身體信號」哪種態度對健康的危害更大？你更常犯哪一種？',
    '臀無膚的警告和孚號有厲的提醒都在告訴你：身體的警報不是無中生有。你給自己設定的最後檢查期限是什麼？如果再不去看醫生，你最擔心會錯過什麼？',
  ],
  decision: [
    '揚于王庭的公開決斷氛圍中，你目前人生最重大的那個決定是什麼？把它放到陽光下讓眾人檢視，你最怕別人看到這個決定的哪個漏洞？',
    '不利即戎與牽羊悔亡之間，重大決策時你更相信「果斷出手不留退路」還是「順勢而為見機行事」？回顧你人生中最成功的決定，它是用哪種方式做出的？',
    '當你做重大決定時，揚于王庭的公開和不利即戎的克制都在約束你。你給這個決定設的最後期限是什麼？如果到期還無法決定，你的預設方案是什麼？',
  ],
  business: [
    '告自邑的創業告誡讓你先把內部組織理順再對外擴張，你公司內部目前最需要整頓的環節是什麼？那個你一直用「對外忙」來逃避的內部問題是什麼？',
    '孚號有厲與揚于王庭之間，創業過程中你更看重「誠信聲譽的積累」還是「市場曝光度的搶占」？這兩者在你的創業歷程中各自為你帶來過什麼？',
    '揚于王庭的公開姿態和告自邑的內部整頓，創業節奏上先內後外還是先外後內？你給團隊整頓設的最後完成期限是什麼？過了這個時間還整頓不完，你怎麼應對？',
  ],
  legal: [
    '揚于王庭的公開審視下，你目前面對的法律或合約糾紛最核心的爭議點是什麼？如果你必須在公開場合陳述你的立場，你會用哪三句話說清楚？',
    '告自邑與不利即戎之間，法律糾紛中你更傾向於「先內部協商和解」還是「直接訴諸法律程序」？這兩條路在你的具體案件中各自有什麼不可逆的後果？',
    '揚于王庭和不利即戎的雙重約束下，法律行動的時機至關重要。你給自己設的訴訟啟動最後期限是什麼？錯過這個時機窗口，你的法律優勢會發生什麼變化？',
  ],
  spiritual: [
    '君子夬夬的決斷力在你的修行路上，是什麼執念讓你一直無法「夬」斷？那條你明知該放下卻緊緊抓著的繩子另一端繫著什麼？',
    '無號終有凶與孚號有厲之間，修行中你覺得「徹底沉默不與人交流修行體悟」和「過度宣說未成熟的感悟」哪種對心境的傷害更大？你目前的修行狀態更接近哪一種？',
    '無號終有凶是對靈性沉默的最終警告。你在修行中那個始終不敢面對的內心陰影是什麼？如果你給自己設一個直面它的最後期限，那個時間是什麼時候？',
  ],
};

// HEX 44 姤 imagery per category (3 Qs each)
const hex44Questions = {
  general: [
    '天下有風的相遇格局中，你最近遇到的那個看似偶然的相遇或機緣，背後可能蘊藏著什麼你尚未察覺的深層意義？風從哪裡吹來，要把你帶向何方？',
    '係于金柅與姤其角之間，面對一個意外的相遇，你更傾向於「用金柅拴住控制局面」還是「像角一樣保持距離觀察」？這兩種態度在你的經歷中各自帶來過什麼不同的緣分？',
    '天下有風的相遇看似美好，但姤其角提醒你意外相遇也可能擦出危險的火花。你最近的那次「偶遇」中，哪個瞬間讓你覺得這可能不只是巧合？你的邊界在哪裡？',
  ],
  career: [
    '包有魚的職場機遇中，你最近發現或獲得的那個「意外的魚」是什麼？一個被你忽視的項目、一個不起眼的機會、還是一個你沒放在心上的聯絡人？',
    '姤其角與係于金柅之間，職場中遇到意料之外的機會時，你更習慣「用金柅拴住牢牢控制」還是「像角一樣先頂一頂試探深淺」？這兩種應對方式在你的職場生涯中各教會了你什麼？',
    '包有魚的機遇來得突然，係于金柅的提醒則告訴你要拴住它。你最近那個職場機遇，如果不在一週內採取行動就會溜走，你來得及反應嗎？最晚什麼時候必須出手？',
  ],
  love: [
    '羸豕孚蹢躅的躁動不安，你目前感情中的那股「瘦豬般來回踱步」的焦慮來自哪裡？是對方的不確定，還是你自己的不安在投射？',
    '臀無膚與以杞包瓜之間，感情中你更傾向於「因為坐立難安所以急於解決問題」還是「用杞柳編織包容把脆弱的瓜保護起來」？這兩種姿態在你過往的感情中各自導致過什麼結果？',
    '羸豕孚蹢躅的焦躁和臀無膚的不安都在消耗你，感情中的等待有沒有一個時間底線？如果對方在你設定的期限內依然沒有回應，你會選擇轉身還是繼續蹢躅？',
  ],
  money: [
    '係于金柅的財務告誡告訴你要把錢拴牢在金屬剎車上，你目前財務中最需要「拴住」的那筆支出或投資是什麼？它正在以什麼方式悄悄溜走？',
    '包有魚與包無魚之間，理財中你覺得「抓住小機會積少成多」和「錯過機會空手而歸」哪個對你目前的財務狀況影響更大？你上個月是包有魚還是包無魚？',
    '係于金柅的繫縛和包無魚的落空都在提醒你：財務機會稍縱即逝。你目前盯上的那個理財機會，如果不在月底前出手就會消失，你的行動計劃是什麼？',
  ],
  people: [
    '姤其角的人際碰撞中，你最近與人發生的那次「角碰角」的摩擦，對方那隻角頂到你哪個最敏感的地方了？那一下為什麼讓你這麼在意？',
    '以杞包瓜與包有魚之間，人際關係中你更擅長「用杞柳般的柔韌去包容脆弱的關係」還是「像捕魚一樣主動出擊建立連結」？這兩種方式在你的社交圈中各留下過什麼故事？',
    '姤其角的碰撞提醒你相遇不總是溫柔的。你目前人際圈中那個總是跟你「角碰角」的人，你們之間的摩擦有沒有升級的危險？你準備在什麼時候、用什麼方式化解？',
  ],
  family: [
    '包無魚的家庭失落中，你在家人關係裡哪個期待落了空？那條你以為會有的「魚」是什麼？是理解、是陪伴、還是某個承諾？',
    '臀無膚與係于金柅之間，家庭問題中你更傾向於「因為坐立難安所以急著解決」還是「用金柅拴住情緒先穩住局面」？這兩種處理方式在你家的氛圍中各產生過什麼效果？',
    '包無魚的失落和臀無膚的煎熬同時存在時，家庭關係的修復有沒有時間窗口？你給自己設定的主動溝通最後期限是什麼？再拖下去，那條魚是不是永遠回不來了？',
  ],
  study: [
    '天下有風的學習契機中，你最近無意間接觸到的那個新知識或新技能，像一陣風一樣吹過你的世界，它在你心裡留下了什麼種子？你打算怎麼讓它生根？',
    '係于金柅與姤其角之間，學習新事物時你更習慣「用金柅拴住一個領域深入鑽研」還是「像角一樣四處試探廣泛涉獵」？這兩種學習方式在你的知識體系中各佔什麼比例？',
    '天下有風的機遇不等人，學習的窗口往往很短暫。你目前那個「想學但還沒開始」的東西，如果三個月內不啟動就會被其他事情淹沒，你的第一步行動是什麼時候？',
  ],
  health: [
    '臀無膚的身體不適中，你目前身體哪個部位的「坐立難安」在告訴你什麼？那種無法安頓的感覺是身體的警報還是心理的投射？',
    '羸豕孚蹢躅的躁動與天下有風的流動之間，健康管理上你更傾向於「因為焦慮而反覆檢查過度關注」還是「順其自然讓身體隨風調節」？這兩種態度在你的健康史中各帶來過什麼結果？',
    '臀無膚的不適和羸豕孚蹢躅的焦躁同時發作時，健康問題有沒有就醫的時限？你給自己設定的最後檢查日期是什麼？如果檢查結果不如預期，你的應對預案是什麼？',
  ],
  decision: [
    '姤其角的決策碰撞中，你目前面對的那個決定，與你原本計劃相撞的「意外變數」是什麼？那隻突然冒出來的角打亂了你哪部分的佈局？',
    '包有魚與係于金柅之間，做決策時你更相信「抓住突然出現的機會魚」還是「先拴住現有的資源再觀望」？回顧你做過的最明智決定，它來自抓住意外還是守住本份？',
    '姤其角的意外和係于金柅的保守都在拉扯你的決策方向。這個決定如果不在本週內做出就會錯過最佳時機，你願意承擔的最壞結果是什麼？那條底線你敢不敢畫？',
  ],
  business: [
    '天下有風的商業機遇中，你目前行業裡那陣正在吹起的「風」是什麼趨勢？你看見它了，但你的船帆調整好了嗎？',
    '包有魚與以杞包瓜之間，創業經營中你更擅長「像捕魚一樣抓住市場機會」還是「用杞柳般的韌性把脆弱的項目呵護長大」？這兩種能力在你的創業歷程中哪個更稀缺？',
    '天下有風的機遇窗口和包有魚的搶佔時機都在催促你行動。你公司目前那個「看見了但還沒動手」的機會，競爭對手也在盯著，你最晚什麼時候必須出擊？',
  ],
  legal: [
    '係于金柅的法律束縛中，你目前被哪條合約或法律條文像金柅一樣拴住了行動自由？那條拴住你的條款，當初你簽下去的時候有想過今天嗎？',
    '姤其角與包無魚之間，法律糾紛中你更擔心「對方突然亮出新的證據角頂你」還是「自己手中關鍵證據像魚一樣溜走」？這兩種風險在你的案件中哪個更致命？',
    '係于金柅的束縛和姤其角的碰撞同時存在時，法律行動的時效性不容忽視。你的案件有沒有訴訟時效即將到期的風險？如果不在期限前行動，你會永久失去什麼權利？',
  ],
  spiritual: [
    '天下有風的靈性流動中，你最近在修行或內省時感受到的那陣「靈性之風」帶來了什麼啟示？風吹過之後，你內心那片天空變得更清澈還是更迷濛？',
    '以杞包瓜與係于金柅之間，修行路上你更傾向於「用杞柳般的柔軟包容自己所有的不完美」還是「用金柅的紀律嚴格拴住散亂的心念」？這兩種修行態度在你的靈性成長中各扮演什麼角色？',
    '天下有風的靈感來去無蹤，係于金柅則提醒你要拴住覺悟的瞬間。你最近那次靈光一閃的體悟，如果不及時記錄和深化就會消散，你給自己設的內化期限是什麼？',
  ],
};

function countChineseChars(str) {
  const chinese = str.match(/[\u4e00-\u9fff\u3000-\u303f\uff00-\uffef]/g);
  return chinese ? chinese.length : 0;
}

function buildQuestions(hexId, hexName, questionsByCat) {
  const items = [];
  for (const cat of CATEGORIES) {
    const qs = questionsByCat[cat.id];
    if (!qs) { console.error(`Missing category: ${cat.id} for hex ${hexId}`); process.exit(1); }
    for (let i = 0; i < 3; i++) {
      const q = qs[i];
      if (!q) { console.error(`Missing Q${i + 1} for ${cat.id} hex ${hexId}`); process.exit(1); }
      items.push({
        id: `rf-${String(hexId).padStart(3, '0')}-${cat.id}-${i + 1}`,
        hexagramId: hexId,
        hexagramName: hexName,
        category: cat.id,
        categoryName: cat.name,
        question: q,
        basis: [hexName],
        qualityLevel: 'refined',
        reviewed: false,
        needsHumanReview: true,
        version: '1.0.0-wC-refl-43-44',
      });
    }
  }
  return items;
}

// --- VALIDATION ---
function validateAll(items, hexId, label) {
  const errors = [];
  const catCounts = {};
  for (const item of items) {
    const len = countChineseChars(item.question);
    if (len < 38 || len > 105) {
      errors.push(`${item.id}: char count ${len} (must be 38-105)`);
    }
    if (!item.question.endsWith('？')) {
      errors.push(`${item.id}: must end with ？`);
    }
    catCounts[item.category] = (catCounts[item.category] || 0) + 1;
  }
  // Each category must have exactly 3
  for (const cat of CATEGORIES) {
    if (catCounts[cat.id] !== 3) {
      errors.push(`${label} category ${cat.id} has ${catCounts[cat.id] || 0} questions (need 3)`);
    }
  }
  return { errors, catCounts };
}

function computeNormU(items) {
  const perCat = {};
  for (const item of items) {
    perCat[item.category] = (perCat[item.category] || 0) + 1;
  }
  const vals = Object.values(perCat);
  return vals.every(v => v >= 3) ? 36 : Math.min(...vals) * 12;
}

const hex43Items = buildQuestions(43, '夬', hex43Questions);
const hex44Items = buildQuestions(44, '姤', hex44Questions);

// Validate 43
const v43 = validateAll(hex43Items, 43, 'HEX43');
if (v43.errors.length > 0) {
  console.error('=== HEX 43 VALIDATION ERRORS ===');
  v43.errors.forEach(e => console.error(e));
  process.exit(1);
}
const normU43 = computeNormU(hex43Items);
if (normU43 < 32) {
  console.error(`HEX 43 normU = ${normU43}/36, must be >= 32`);
  process.exit(1);
}

// Validate 44
const v44 = validateAll(hex44Items, 44, 'HEX44');
if (v44.errors.length > 0) {
  console.error('=== HEX 44 VALIDATION ERRORS ===');
  v44.errors.forEach(e => console.error(e));
  process.exit(1);
}
const normU44 = computeNormU(hex44Items);
if (normU44 < 32) {
  console.error(`HEX 44 normU = ${normU44}/36, must be >= 32`);
  process.exit(1);
}

console.log(`HEX 43 夬: ${hex43Items.length} questions, normU=${normU43}/36, all valid ✓`);
console.log(`HEX 44 姤: ${hex44Items.length} questions, normU=${normU44}/36, all valid ✓`);

// Read existing data
const targetPath = path.resolve(__dirname, '..', 'src', 'data', 'reflectionQuestions.data.js');
let existing = [];
if (fs.existsSync(targetPath)) {
  const raw = fs.readFileSync(targetPath, 'utf8');
  const match = raw.match(/window\.Zero1MatrixData\.reflectionQuestions\s*=\s*(\[[\s\S]*?\]);/);
  if (match) {
    try {
      existing = JSON.parse(match[1]);
    } catch (e) {
      console.error('Failed to parse existing reflectionQuestions:', e.message);
      process.exit(1);
    }
  }
}

// Remove existing hex 43 and 44 entries
const filtered = existing.filter(item => item.hexagramId !== 43 && item.hexagramId !== 44);
const merged = [...filtered, ...hex43Items, ...hex44Items];

// Sort by hexagramId then category then question number
merged.sort((a, b) => {
  if (a.hexagramId !== b.hexagramId) return a.hexagramId - b.hexagramId;
  const catIdxA = CATEGORIES.findIndex(c => c.id === a.category);
  const catIdxB = CATEGORIES.findIndex(c => c.id === b.category);
  if (catIdxA !== catIdxB) return catIdxA - catIdxB;
  const qNumA = parseInt(a.id.split('-').pop());
  const qNumB = parseInt(b.id.split('-').pop());
  return qNumA - qNumB;
});

const output = `window.Zero1MatrixData = window.Zero1MatrixData || {};
window.Zero1MatrixData.reflectionQuestions = ${JSON.stringify(merged)};`;

fs.writeFileSync(targetPath, output, 'utf8');
console.log(`\nWritten ${merged.length} total questions to ${targetPath}`);
console.log(`Removed old hex43/44 entries, added ${hex43Items.length + hex44Items.length} new entries.`);

// node --check equivalent validation
try {
  new Function(output);
  console.log('Syntax check: OK');
} catch (e) {
  console.error('Syntax error in output:', e.message);
  process.exit(1);
}