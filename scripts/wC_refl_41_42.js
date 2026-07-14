'use strict';

const fs = require('fs');
const path = require('path');

// ── Categories ──
const CATEGORIES = [
  { key: 'general', name: '整體運勢' },
  { key: 'career', name: '工作事業' },
  { key: 'love', name: '感情婚姻' },
  { key: 'money', name: '金錢財運' },
  { key: 'people', name: '人際關係' },
  { key: 'family', name: '家庭親子' },
  { key: 'study', name: '學習考試' },
  { key: 'health', name: '身體健康' },
  { key: 'decision', name: '決策判斷' },
  { key: 'business', name: '創業經營' },
  { key: 'legal', name: '法律爭訟' },
  { key: 'spiritual', name: '心靈成長' },
];

// ── HEX 41 損: imagery per category ──
const HEX41_IMAGERY = {
  general:    ['山下有澤', '酌損之', '弗損益之'],
  career:     ['已事遄往', '三人行則損一人', '損其疾'],
  love:       ['三人行則損一人', '酌損之', '十朋之龜'],
  money:      ['酌損之', '損其疾', '已事遄往'],
  people:     ['三人行則損一人', '已事遄往', '山下有澤'],
  family:     ['損其疾', '十朋之龜', '酌損之'],
  study:      ['弗損益之', '已事遄往', '酌損之'],
  health:     ['損其疾', '山下有澤', '酌損之'],
  decision:   ['酌損之', '三人行則損一人', '弗損益之'],
  business:   ['弗損益之', '已事遄往', '三人行則損一人'],
  legal:      ['損其疾', '酌損之', '已事遄往'],
  spiritual:  ['山下有澤', '十朋之龜', '弗損益之'],
};

// ── HEX 42 益: imagery per category ──
const HEX42_IMAGERY = {
  general:    ['風雷益', '利用為大作', '有孚惠心'],
  career:     ['利用為大作', '中行告公從', '益之用凶事'],
  love:       ['有孚惠心', '十朋之龜', '利用為大作'],
  money:      ['益之用凶事', '莫益之或擊之', '十朋之龜'],
  people:     ['中行告公從', '有孚惠心', '利用為大作'],
  family:     ['十朋之龜', '利用為大作', '益之用凶事'],
  study:      ['風雷益', '利用為大作', '十朋之龜'],
  health:     ['益之用凶事', '有孚惠心', '風雷益'],
  decision:   ['莫益之或擊之', '利用為大作', '中行告公從'],
  business:   ['風雷益', '利用為大作', '益之用凶事'],
  legal:      ['有孚惠心', '十朋之龜', '中行告公從'],
  spiritual:  ['風雷益', '有孚惠心', '十朋之龜'],
};

// ── GENUINELY DISTINCT QUESTIONS ──
// Each category: Q1 = current state, Q2 = action & choice (compare 2 real options), Q3 = risk/boundary/timing
// Genuinely different sentence structures per category — NO template rotation.

const HEX41_QUESTIONS = {
  general: [
    '損卦山下有澤的意象中，你當前的整體狀態是水澤浸潤山基逐漸消減，還是山體穩固不為所動，哪一端更貼近你此刻的處境？',
    '酌損之提醒適度減損，面對當前局面你是選擇主動割捨不必要的負擔，還是先守住現狀等待更合適的時機再動手，兩條路各有什麼利弊？',
    '弗損益之警示過度減損反而傷及根本，你目前的減損策略中哪一個部分最容易踩過界，變成連核心價值也一起削掉的風險？',
  ],
  career: [
    '已事遄往描繪事情完成就快速前行，你目前在職場上有哪件懸而未決的事如果果斷收尾，能立刻讓你的工作狀態輕盈起來？',
    '三人行則損一人意味團隊中需有人讓步，你是選擇主動調整自己的角色定位來成全團隊，還是堅持原有分工讓他人來適應，兩者的長期後果有何不同？',
    '損其疾說的是剝除頑疾必須果斷，你職場上有什麼積習或低效模式像慢性病一樣正在消耗你，如果再拖下去會產生什麼難以逆轉的後果？',
  ],
  love: [
    '三人行則損一人在感情關係中暗示三角張力，你目前的情感格局裡是否存在某個多餘的角色或隱藏的競爭，這種張力對你的影響是什麼？',
    '酌損之講究分寸感，在親密關係中你是選擇適度收縮自己的期待來減少摩擦，還是坦誠溝通讓對方理解你的真實需求，你更傾向哪種方式？',
    '十朋之龜代表極其珍貴的東西，你在感情中最不該輕易減損的核心品質是什麼，一旦為了遷就關係而放棄它，後果會嚴重到什麼程度？',
  ],
  money: [
    '酌損之應用在財務上意味精打細算，你目前的收支結構中哪個支出項目最值得你重新審視，把它減掉能帶來多大的長期財務改善？',
    '損其疾指向快速切除財務病灶，你面前有兩筆資金用途——一筆用於消除一項持續虧損的開銷，另一筆用於投資一個有潛力的機會，你會優先動用哪一筆？',
    '已事遄往告誡資金周轉不宜戀戰，你目前有沒有某項投資或借貸正在超時運轉，錯過最佳退出窗口的風險有多大？',
  ],
  people: [
    '三人行則損一人在人際交往中提醒關係的減法，你目前的社交圈中是否存在一段讓你持續消耗卻回報稀薄的關係，它的存在對你的精神狀態產生了什麼影響？',
    '已事遄往在人際層面講的是該翻篇時不猶豫，你和某人之間的舊帳是選擇一筆勾銷從頭來過，還是把話說清楚再做決定，哪種處理更有利於你當前的處境？',
    '山下有澤描繪澤水蝕山的緩慢過程，你的人際關係中有沒有什麼看似無害的小摩擦正在悄悄侵蝕某段重要關係的根基？',
  ],
  family: [
    '損其疾用在家庭中指向積累已久的矛盾，你家庭內部最需要被直面的隱疾是什麼，為什麼它一直被迴避？',
    '十朋之龜提醒家庭中有不可損害的寶貴之物，你面臨家庭資源分配時，是優先把資源投在修復關係裂痕上，還是投在改善物質條件上，這兩種取捨的長遠影響有何不同？',
    '酌損之要求家人之間懂得適度退讓，你在家庭互動中最容易過度付出的那個點是什麼，如果不設邊界會給自己帶來什麼樣的消耗？',
  ],
  study: [
    '弗損益之在學習中強調不可減損基礎，你目前的知識體系中哪個基礎模塊你一直想跳過或簡化，但實際上它才是後面所有進階內容的關鍵支撐？',
    '已事遄往提示學完一章就果斷推進，你面前有兩種學習策略——把當前的難點徹底攻克再前進，還是先標記難點繼續往後學用後面的內容反哺理解，你怎麼選？',
    '酌損之告誡學習不宜貪多，你目前的學習計劃中有沒有哪個領域或課程其實超出了你當前真正需要掌握的範圍，繼續硬撐會怎樣影響你的學習效率？',
  ],
  health: [
    '損其疾直接對應身體的病痛信號，你最近身體發出的哪個警告你一直選擇忽視或拖延，這個信號如果持續被忽略可能演變成什麼問題？',
    '山下有澤的意象中水澤象徵體液代謝，你當前的作息或飲食習慣裡哪一項最像那汪不斷侵蝕山體的澤水，正在緩慢但穩定地削弱你的健康基礎？',
    '酌損之在健康管理上要求精準減負，你目前的養生方式是否存在矯枉過正的風險，比如過度節食或過量運動反而讓身體承受了不該有的壓力？',
  ],
  decision: [
    '酌損之應用在決策場景中是對選項做減法，你眼下最重要的決策中如果必須砍掉一個選項來降低複雜度，你會最先砍哪個，為什麼是它？',
    '三人行則損一人轉化為決策困境——三條路只能走兩條，你當前的三個主要方向中哪一條最像可以暫時擱置或讓他人分擔的，放棄它對全局的影響有多大？',
    '弗損益之警示決策時有些底線不可觸碰，你目前的決策框架中有沒有哪條核心原則是你無論如何都不會讓步的，挑戰這條原則的人或事可能來自什麼方向？',
  ],
  business: [
    '弗損益之在創業中意味有些投入絕不能省，你目前為了控製成本正在削減的開支裡，有沒有哪一項其實關乎產品核心競爭力，砍掉後會傷及品牌根基？',
    '已事遄往講的是創業節奏該快則快，你面前有兩個推進方案——快速推出最小可行版本搶佔先機，還是打磨到相對成熟再上市避免口碑風險，你更傾向哪個？',
    '三人行則損一人對應合夥關係的取捨，你的創業團隊中是否存在一個貢獻與消耗不對等的角色，如果必須請這個人離開，團隊的穩定性和業務連續性能承受嗎？',
  ],
  legal: [
    '損其疾在法律事務中強調快速止損，你目前涉及的法律糾紛或合約隱患中，哪個問題像一顆需要立刻切除的毒瘤，拖延只會讓後果成倍放大？',
    '酌損之要求法律策略中懂得讓步，你在當前的爭議中是選擇部分妥協換取快速結案，還是堅持全部訴求走完整個程序，兩種路線的時間成本和精神成本各有多大？',
    '已事遄往提醒法律事務不宜拖泥帶水，你手上有沒有某份該簽未簽或該續未續的合約文件，錯過關鍵時點可能引發什麼連鎖法律風險？',
  ],
  spiritual: [
    '山下有澤的意象在心靈層面描繪內在的沉澱與消解，你目前的精神狀態中哪部分正在自然消融——是某種執念、某段記憶、還是某個對自己的舊定義？',
    '十朋之龜代表心靈中不可交易的部分，你面對一個可能違背內心價值但極具誘惑的選擇時，你用來守護那隻「寶龜」的力量來自哪裡？',
    '弗損益之在心靈成長中意味有些核心信念不能動搖，你內心深處最堅定的那個信念是什麼，在什麼樣的情境下它最容易被動搖，你又如何讓它重新穩固？',
  ],
};

const HEX42_QUESTIONS = {
  general: [
    '風雷益的卦象中風與雷相互激盪增益，你當前的人生整體狀態是像風一樣在尋找可推動的方向，還是像雷一樣已經蓄積了足夠的能量等待釋放的時機？',
    '利用為大作提示可以啟動大規模行動，面對當前局面你是選擇集中資源在一個大方向上全力推進，還是分散佈局先試探幾個小方向再決定主攻，兩種策略的風險輪廓有何不同？',
    '有孚惠心強調增益須以誠信為根基，你目前正在推進的某個重要計劃中，有沒有什麼環節的誠信基礎其實不夠牢固，一旦這條裂縫擴大會怎樣顛覆整個計劃？',
  ],
  career: [
    '利用為大作在職場中意味可以爭取大項目，你目前的職業賽道上哪個方向如果全力投入，最有可能讓你的職場價值產生一次明顯的躍升？',
    '中行告公從說的是以中道行事並報告上位者，你在推進一個重要項目時面臨兩種溝通策略——先做出階段性成果再向上匯報爭取支持，還是提前充分溝通獲取授權再行動，哪種更適合你當前的職場環境？',
    '益之用凶事警示增益也可能用在危難時刻，你目前的職位或項目中有沒有什麼潛在危機如果突然爆發，反而會成為你證明自己能力的轉折點？',
  ],
  love: [
    '有孚惠心在感情中強調真心與恩惠，你目前的親密關係裡對方最需要你「增益」的究竟是什麼——是更多的時間陪伴、更深的情感表達，還是更具體的實際支持？',
    '十朋之龜提醒感情中有極其珍貴的東西，你面對一段關係的十字路口時，是選擇用更多付出去加固現有的聯結，還是選擇給彼此空間讓關係自然生長，你覺得哪條路更接近真愛的本質？',
    '利用為大作在感情中暗示大動作可能改變格局，你準備在關係中做一個重大舉動時，有沒有想過如果對方的回應遠低於預期，你的心理承受底線在哪裡？',
  ],
  money: [
    '益之用凶事意味資金在危機時刻的增益價值，你目前的財務儲備中是否有專門為突發狀況預留的應急部分，它的規模真的夠應對一次真正的財務衝擊嗎？',
    '莫益之或擊之告誡不當增益反遭打擊，你面前有兩個理財方向——把閒置資金投入一個高回報但信息不透明的機會，還是穩健配置接受較低但確定的收益，你如何權衡貪婪與恐懼？',
    '十朋之龜代表不可輕易動用的財富儲備，你目前有沒有某筆錢是你發誓無論如何都不會動用的，在什麼樣的極端情況下這道底線才可能被突破？',
  ],
  people: [
    '中行告公從在人際關係中強調中道溝通，你和某個重要關係人之間是否存在信息不對稱的問題，如果現在主動做一次坦誠的信息同步，可能帶來什麼改變？',
    '有孚惠心要求以誠待人並施以恩惠，你在處理一段緊張關係時有兩個選項——主動釋放善意先付出不計回報，還是等對方先邁出第一步再回應，你更傾向哪個，為什麼？',
    '利用為大作提醒大的人際行動需審慎，你正考慮對某段關係做一個重大舉措時，是否充分評估了這個舉動可能引發的連鎖反應，尤其是對那些你未曾想到會受影響的人？',
  ],
  family: [
    '十朋之龜在家庭中代表最珍貴的傳承，你的家庭中有什麼無形的資產——比如某種價值觀、某項傳統手藝、某段家族記憶——你認為最值得傳給下一代？',
    '利用為大作暗示家庭中可以做大的決定，你在家庭規劃上面臨兩個方向——把資源集中投入到子女教育這個長期回報的項目上，還是改善當下的家庭生活品質讓每個人現在就受益，你如何取捨？',
    '益之用凶事警示家庭增益也要防備不測，你的家庭在經濟或情感上的增益過程中，有沒有忽視了某個潛在的脆弱點——比如健康保障、家庭成員的心理狀態或外部環境的變化？',
  ],
  study: [
    '風雷益在學習中象徵知識的相互激發，你目前學習的不同領域之間是否存在可以產生交叉啟發的連接點，你發現了哪個意想不到的知識遷移機會？',
    '利用為大作提示學習應該有大格局，你面臨兩個學習路徑——深入鑽研一個專業方向成為領域專家，還是廣泛涉獵多個領域建立跨界優勢，你認為當下哪條路對你的長期發展更有利？',
    '十朋之龜提醒學習中最寶貴的是根基，你目前的知識體系中有沒有哪個核心概念你其實理解得並不扎實，但一直依賴它來推導其他結論，這個薄弱環節可能在什麼情況下讓你出錯？',
  ],
  health: [
    '益之用凶事在健康中轉化為把危機當作增益的契機，你過去是否經歷過一次健康問題反而讓你重新審視生活方式並因此受益，這段經歷給了你什麼持續至今的教訓？',
    '有孚惠心提示身心健康需要誠實面對，你目前有兩個選擇——繼續維持表面看起來正常但內心疲憊的生活節奏，還是誠實承認自己需要休息並做出實質調整，你更可能選擇哪個？',
    '風雷益的健康隱喻是能量過盛也可能傷身，你當前的精力狀態是風雷激盪般的亢奮還是穩健的充沛，如果是前者，過度燃燒的風險體現在哪些身體信號上？',
  ],
  decision: [
    '莫益之或擊之直接警示錯誤的增益會招致打擊，你眼下最重要的決策中，有沒有哪個看似有利的選項其實暗藏反噬的風險，它的陷阱藏在哪個細節裡？',
    '利用為大作建議決策時可以有大手筆，你面對兩個方向——選擇穩妥的保守方案確保不犯大錯，還是選擇激進方案賭一個大的回報，你評估這兩個方案時用的是什麼框架？',
    '中行告公從強調決策後要能向相關方交代，你準備做一個重大決定時，有沒有設想過如果這個決定需要向最重要的那個人解釋，你的理由是否站得住腳？',
  ],
  business: [
    '風雷益在商業中象徵市場的風向與行動的雷霆，你當前的創業項目所處的市場風口是真實的長期趨勢，還是短暫的熱潮即將消散，你用什麼指標來判斷？',
    '利用為大作提示可以啟動大型商業行動，你面前有兩個增長策略——深耕現有客戶群提升複購率和客單價，還是大規模拓展新市場追求用戶數量增長，你更傾向哪條路？',
    '益之用凶事提醒商業增益中要為危機留餘地，你目前的業務增長模型中對外部衝擊的脆弱性有多大，如果核心供應鏈突然中斷或關鍵人員離職，應急方案是否真的可行？',
  ],
  legal: [
    '有孚惠心在法律事務中強調誠信是最好的防護，你目前涉及的法律文件或合約中，有沒有什麼條款你雖然簽了但內心並不完全認同，這種不一致可能在什麼情況下被放大成糾紛？',
    '十朋之龜提醒法律事務中有些權利極其珍貴不可輕易放棄，你在談判中面臨兩個選擇——為了達成協議而在某個關鍵條款上讓步，還是堅持底線寧可延長談判週期，你如何評估讓步的代價？',
    '中行告公從強調法律程序中的中道與透明，你正在處理的法律事項中是否存在信息不透明或程序不規範的環節，如果這些環節被對手方抓住，可能造成什麼樣的法律後果？',
  ],
  spiritual: [
    '風雷益在心靈層面象徵內在能量的覺醒與流動，你最近有沒有某個瞬間感覺到自己內在有一股新的力量正在生成，它指向什麼方向？',
    '有孚惠心要求心靈增益始於真誠，你目前的精神追求中有沒有什麼是你為了讓自己看起來更好而假裝在修的，如果放下這層偽裝真實面對自己，你真正需要的成長是什麼？',
    '十朋之龜代表靈魂中最不可讓渡的部分，你的心靈深處有什麼東西是你寧可失去很多外在的東西也不願交換的，這個東西在你的日常生活中得到了多少滋養和守護？',
  ],
};

// ── Validation ──

function validateQuestion(q) {
  const len = q.length;
  if (len < 38 || len > 105) {
    return { ok: false, reason: `length ${len} out of range [38,105]` };
  }
  if (!q.endsWith('？')) {
    return { ok: false, reason: 'does not end with ？' };
  }
  return { ok: true };
}

// Strip hex names, imagery phrases, category names, common words for normalized uniqueness check
function norm(str) {
  let s = str;
  // Strip hex names
  s = s.replace(/損卦|益卦|風雷益|山下有澤/g, '');
  // Strip imagery phrases
  s = s.replace(/酌損之|弗損益之|已事遄往|三人行則損一人|損其疾|十朋之龜|利用為大作|有孚惠心|中行告公從|益之用凶事|莫益之或擊之|風雷/g, '');
  // Strip category names
  s = s.replace(/整體|工作|事業|職場|感情|婚姻|金錢|財運|財務|人際|社交|家庭|親子|學習|考試|健康|身體|決策|判斷|創業|經營|法律|爭訟|心靈|成長|精神|靈性/g, '');
  // Strip common words
  s = s.replace(/[，。、？！；：——「」『』（）《》\s]/g, '');
  s = s.replace(/[的得了嗎呢啊吧哦呀哪麼著過會是]/g, '');
  return s;
}

function checkUniqueness(questions) {
  const normSet = new Set();
  const dupes = [];
  for (const q of questions) {
    const n = norm(q);
    if (normSet.has(n)) {
      dupes.push(q);
    } else {
      normSet.add(n);
    }
  }
  return { count: normSet.size, dupes };
}

// ── Build entries ──

function buildEntries(hexId, hexName, questionsMap) {
  const entries = [];
  for (const cat of CATEGORIES) {
    const qs = questionsMap[cat.key];
    for (let i = 0; i < 3; i++) {
      entries.push({
        id: `rf-${String(hexId).padStart(3, '0')}-${cat.key}-${i + 1}`,
        hexagramId: hexId,
        hexagramName: hexName,
        category: cat.key,
        categoryName: cat.name,
        question: qs[i],
        basis: [hexName, cat.name],
        qualityLevel: 'refined',
        reviewed: false,
        needsHumanReview: true,
        version: '1.7.1-reviewed-rf',
      });
    }
  }
  return entries;
}

// ── Main ──

function main() {
  const entries41 = buildEntries(41, '損', HEX41_QUESTIONS);
  const entries42 = buildEntries(42, '益', HEX42_QUESTIONS);
  const allEntries = [...entries41, ...entries42];

  // Step 1: Validate all questions
  const failures = [];
  for (const e of allEntries) {
    const r = validateQuestion(e.question);
    if (!r.ok) {
      failures.push({ id: e.id, reason: r.reason, q: e.question });
    }
  }
  if (failures.length > 0) {
    console.error('VALIDATION FAILURES:');
    for (const f of failures) {
      console.error(`  ${f.id}: ${f.reason}`);
      console.error(`    Q: ${f.q}`);
    }
    console.error(`\nTotal failures: ${failures.length}`);
    return;
  }
  console.log(`All ${allEntries.length} questions passed length and ending checks.`);

  // Step 2: Check normalized uniqueness per hex
  for (const [hexId, hexName, entries] of [[41, '損', entries41], [42, '益', entries42]]) {
    const qs = entries.map(e => e.question);
    const { count, dupes } = checkUniqueness(qs);
    console.log(`Hex ${hexId} ${hexName}: normalized unique = ${count} / 36`);
    if (count < 32) {
      console.error(`  FAIL: Hex ${hexId} ${hexName} has only ${count} normalized unique questions (need >= 32).`);
      if (dupes.length > 0) {
        console.error('  Duplicate samples:');
        for (let i = 0; i < Math.min(dupes.length, 5); i++) {
          console.error(`    [${norm(dupes[i])}] => "${dupes[i].substring(0, 60)}..."`);
        }
      }
      return;
    }
    if (dupes.length > 0) {
      console.warn(`  WARNING: ${dupes.length} duplicates found but normU >= 32/36, proceeding.`);
      for (const d of dupes) {
        console.warn(`    norm="${norm(d)}" => "${d.substring(0, 80)}..."`);
      }
    }
  }

  console.log('Both hexes passed normalized uniqueness check (>= 32/36).');

  // Step 3: Write the data file
  const json = JSON.stringify(allEntries);

  // Read existing file to append
  const dataPath = 'D:/AI_PROJECTS/Zero1Matrix/src/data/reflectionQuestions.data.js';
  const existing = fs.readFileSync(dataPath, 'utf8');

  // Remove trailing '];' and add new entries
  const trimmed = existing.trimEnd();
  const lastTwo = trimmed.substring(trimmed.length - 2);
  if (lastTwo !== '];') {
    console.error('ERROR: Data file does not end with ];');
    return;
  }

  const newContent = trimmed.substring(0, trimmed.length - 2) + ',' + json + '];';

  fs.writeFileSync(dataPath, newContent, 'utf8');
  console.log(`Written ${allEntries.length} entries to ${dataPath}`);

  // Step 4: node --check
  try {
    const vm = require('vm');
    const scriptContent = fs.readFileSync(dataPath, 'utf8');
    new vm.Script(scriptContent);
    console.log('node --check equivalent: PASSED (valid JS syntax)');
  } catch (err) {
    console.error('node --check FAILED:', err.message);
    return;
  }

  console.log('DONE. All checks passed, data written successfully.');
}

main();