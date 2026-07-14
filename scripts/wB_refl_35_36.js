'use strict';
/**
 * wB_refl_35_36.js — 72 per-hex-per-category unique reflection questions
 * for Hexagram 35 (晉) and Hexagram 36 (明夷).
 * Q1=state, Q2=choice (compare 2 real options with 還是), Q3=risk/boundary/timing.
 * 38-105 chars each, ends with ？, open-ended.
 * At least 2 of 3 per group use hex imagery.
 * qualityLevel="refined", reviewed=false, needsHumanReview=true.
 */
const vm = require('vm');
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const DATA_PATH = path.join(__dirname, '..', 'src', 'data', 'reflectionQuestions.data.js');

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

// ============================================================================
// HEX 35 晉 imagery: 明出地上, 摧如, 眾允, 愁如, 悔亡失得勿恤, 晉如鼫鼠, 晉其角, 火地晉
// ============================================================================
const HEX35 = {
  hexagramId: 35,
  hexagramName: '晉',
  full: '火地晉',
  data: {
    // general: 明出地上, 眾允, 悔亡失得勿恤
    general: {
      imgs: ['明出地上', '眾允', '悔亡失得勿恤'],
      q1: '明出地上的旭日光芒中，你目前的生命狀態是光芒已照進現實被他人看見，還是尚在黎明前的朦朧等待中蓄積熱量？',
      q2: '面對上升的局勢，你會選擇爭取眾允先獲得群體的信任背書再前進，還是依靠悔亡失得勿恤的心態獨自承擔得失往前推進？',
      q3: '在上升過程中，哪個具體訊號出現時代表你已經偏離明出地上的光明中道，正在滑向為上升而犧牲原則的危險邊緣？',
    },
    // career: 摧如, 愁如, 眾允
    career: {
      imgs: ['摧如', '愁如', '眾允'],
      q1: '你的職場現狀是摧如那樣起步遭排擠的艱難階段，還是愁如般已經有所表現但等待上級回饋的焦慮期？',
      q2: '面對職涯的關鍵推進，你會選擇耐心積累眾允讓關鍵人物為你背書再爭取晉升，還是在愁如的等待中直接越級展示實力？',
      q3: '職場中哪個時間點一旦錯過，會讓摧如的正常起步阻力變成永久邊緣化，而非只是晉升前的必經歷程？',
    },
    // love: 明出地上, 悔亡失得勿恤, 愁如
    love: {
      imgs: ['明出地上', '悔亡失得勿恤', '愁如'],
      q1: '這段感情的狀態是明出地上那樣彼此的光芒互相照亮，還是愁如般一方正在等待另一方給出明確的態度回應？',
      q2: '面對感情中的不確定，你會選擇以悔亡失得勿恤的心態放下對結果的執著純粹享受當下，還是主動追問對方的真實心意以消除愁如的煎熬？',
      q3: '在這段關係中，愁如的等待持續多久之後就該設立底線，以免從真摯的期盼變成自我消耗的執念？',
    },
    // money: 晉如鼫鼠, 悔亡失得勿恤, 摧如
    money: {
      imgs: ['晉如鼫鼠', '悔亡失得勿恤', '摧如'],
      q1: '你的財務配置是晉如鼫鼠那樣在多個方向分散投資卻樣樣不精，還是已收斂在少數真正理解的領域穩健累積？',
      q2: '面對投資上的波動，你會選擇以悔亡失得勿恤的心態設定紀律後不再盯盤，還是在每次跌漲時積極調整以爭取最大回報？',
      q3: '財務上摧如的初期虧損達到本金多少比例時，就該啟動停損機制而非用晉如鼫鼠式的分散來掩蓋單一方向的失誤？',
    },
    // people: 眾允, 明出地上, 摧如
    people: {
      imgs: ['眾允', '明出地上', '摧如'],
      q1: '你目前的社交處境是明出地上那樣自然吸引他人靠近的狀態，還是摧如般正經歷被某個群體排斥的適應期？',
      q2: '面對人際中的排斥感，你會選擇用持續的正向行動爭取眾允來改變他人的看法，還是把精力轉向已經接納你的核心關係？',
      q3: '在社交圈中，摧如的被排斥狀態持續多久後就該判斷是環境不適合你而非自己的問題，從而果斷尋找新的社交場域？',
    },
    // family: 悔亡失得勿恤, 愁如, 晉其角
    family: {
      imgs: ['悔亡失得勿恤', '愁如', '晉其角'],
      q1: '你的家庭氛圍是愁如那樣因某個重大變動而處於集體焦慮期，還是已進入悔亡失得勿恤放下計較的平穩階段？',
      q2: '面對家庭中的付出失衡感，你會選擇以悔亡失得勿恤的心態不再計算誰付出更多，還是召開家庭會議重新協商責任分配？',
      q3: '家庭關係中哪個具體訊號出現時，會提醒你晉其角的孤立感正在形成——事業上升但家庭情感已出現難以修復的裂痕？',
    },
    // study: 晉如鼫鼠, 明出地上, 摧如
    study: {
      imgs: ['晉如鼫鼠', '明出地上', '摧如'],
      q1: '你的學習階段是摧如那樣剛入門還在克服基礎障礙的摸索期，還是明出地上已經能夠用自己的語言輸出所學的收穫期？',
      q2: '面對學習方向的選擇，你會選擇專注一門技能深入打磨避免晉如鼫鼠的分散陷阱，還是同時學習多個領域以建立跨界優勢？',
      q3: '學習中摧如的入門困難期持續幾個月後仍未突破，就該判斷是學習方法有問題而非能力不足，從而果斷調整策略？',
    },
    // health: 愁如, 明出地上, 悔亡失得勿恤
    health: {
      imgs: ['愁如', '明出地上', '悔亡失得勿恤'],
      q1: '你的身心狀態是明出地上那樣精力正在回升的康復期，還是愁如般對健康狀況的焦慮比實際身體問題更消耗你的能量？',
      q2: '面對健康上的憂慮，你會選擇以悔亡失得勿恤的心態停止為過去的虧欠懊悔並從今天開始調整，還是透過更多檢查來消除愁如的不確定感？',
      q3: '身體上哪個反覆出現的訊號一旦出現，代表愁如的心理焦慮已經轉化為需要立即正視的實際健康風險？',
    },
    // decision: 晉其角, 悔亡失得勿恤, 摧如
    decision: {
      imgs: ['晉其角', '悔亡失得勿恤', '摧如'],
      q1: '你面前的決策情境是晉其角那樣已經沒有退路只能向前頂的關鍵時刻，還是摧如般還在初期資訊收集階段仍有調整空間？',
      q2: '面對這個重大決定，你會選擇以悔亡失得勿恤的態度接受最壞結果後果斷前進，還是繼續收集更多資訊直到摧如的不確定性完全消除？',
      q3: '哪個時間點一旦錯過，會讓這個決定從晉其角尚可一搏的關鍵時刻變成因猶豫太久而無路可退的永久被動？',
    },
    // business: 眾允, 明出地上, 摧如
    business: {
      imgs: ['眾允', '明出地上', '摧如'],
      q1: '你的事業階段是摧如那樣新產品剛上市還未獲得市場信任的艱難期，還是明出地上品牌效應開始顯現客戶主動上門的收穫期？',
      q2: '面對市場的擴張機會，你會選擇先深耕眾允確保核心客戶和團隊的信任不被稀釋，還是趁明出地上的曝光紅利快速擴大市場版圖？',
      q3: '經營上摧如的市場阻力期持續多長時間仍未見第一批忠實客戶出現時，就該判斷是產品方向問題而非時機未到？',
    },
    // legal: 晉其角, 摧如, 悔亡失得勿恤
    legal: {
      imgs: ['晉其角', '摧如', '悔亡失得勿恤'],
      q1: '你目前的爭議或合約階段是摧如那樣還在初期蒐證與程序摸索的混亂期，還是晉其角般雙方已正面對撞到了決定勝負的關鍵時刻？',
      q2: '面對法律上的僵局，你會選擇以悔亡失得勿恤的務實心態認真評估和解的可能性，還是堅持到底追求晉其角式的全面勝利？',
      q3: '在訴訟或談判進行到哪個具體環節時，就該從晉其角的正面對抗切換為悔亡失得勿恤的和解評估，以免成本超過預期收益？',
    },
    // spiritual: 明出地上, 悔亡失得勿恤, 愁如
    spiritual: {
      imgs: ['明出地上', '悔亡失得勿恤', '愁如'],
      q1: '你目前的心境是明出地上那樣內在覺知正在甦醒的通透狀態，還是愁如般舊信念已動搖但新世界觀尚未穩固的過渡期？',
      q2: '面對靈性成長的方向，你會選擇以悔亡失得勿恤的超越心態放下對靈性成就的執著，還是積極尋找愁如中失落的那份確定性？',
      q3: '在內在探索的路上，愁如的困惑持續多久後就該從耐心等待轉為主動尋求明出地上般的指導或共修群體？',
    },
  },
};

// ============================================================================
// HEX 36 明夷 imagery: 明入地中, 明夷于飛, 夷于左股, 入于左腹,
//   箕子之明夷, 用拯馬壯, 明夷于南狩, 初登于天後入于地, 地火明夷
// ============================================================================
const HEX36 = {
  hexagramId: 36,
  hexagramName: '明夷',
  full: '地火明夷',
  data: {
    // general: 明入地中, 箕子之明夷, 初登于天後入于地
    general: {
      imgs: ['明入地中', '箕子之明夷', '初登于天後入于地'],
      q1: '明入地中的黑暗籠罩下，你目前是初登于天後入于地正從高處跌落的震盪中，還是已進入箕子之明夷那樣外表順從內心守正的沉潛期？',
      q2: '面對當前的黑暗時期，你會選擇像箕子之明夷那樣低調保全實力等待環境自然轉變，還是主動尋找明夷于南狩的突破口向光明出征？',
      q3: '明入地中的黑暗狀態持續多久之後，你會判斷這已不是策略性的隱藏而是永久性的自我壓制，從而必須打破沉默重新發光？',
    },
    // career: 夷于左股, 明夷于南狩, 用拯馬壯
    career: {
      imgs: ['夷于左股', '明夷于南狩', '用拯馬壯'],
      q1: '你的職涯現狀是夷于左股那樣行動力受到實質限制的受傷期，還是明夷于南狩已開始悄悄準備下一個突破方向的蓄力期？',
      q2: '面對職場上的打壓，你會選擇用拯馬壯尋找有影響力的貴人拉你一把，還是靠自己明夷于南狩暗中累積籌碼等待跳槽時機？',
      q3: '職涯中夷于左股的受傷狀態持續幾個月後仍未見改善，就該判斷此處已無修復可能從而果斷啟動明夷于南狩的全面轉換計劃？',
    },
    // love: 入于左腹, 箕子之明夷, 明夷于飛
    love: {
      imgs: ['入于左腹', '箕子之明夷', '明夷于飛'],
      q1: '這段感情的傷害是入于左腹那樣已深入情感核心的信任破裂，還是明夷于飛般還維持著基本的日常互動但氣氛低氣壓？',
      q2: '面對關係中的傷害，你會選擇像箕子之明夷那樣隱忍等待對方改變，還是設下明夷于飛不能飛得太低的底線並表達真實感受？',
      q3: '在這段關係中，入于左腹的深層傷害出現多少次之後，就該從箕子之明夷的等待轉為承認這段感情可能無法修復的現實？',
    },
    // money: 夷于左股, 明夷于飛, 初登于天後入于地
    money: {
      imgs: ['夷于左股', '明夷于飛', '初登于天後入于地'],
      q1: '你的財務結構是夷于左股那樣收入來源受到實質打擊的損傷期，還是明夷于飛般已啟動節約模式維持基本運轉的求生期？',
      q2: '面對財務上的跌落，你會選擇用拯馬壯向家人或可信賴的人求助以渡過難關，還是靠明夷于飛極致節約自己慢慢從谷底爬升？',
      q3: '財務上初登于天後入于地的跌落發生後，緊急預備金能支撐幾個月的基本生活，一旦低於這個門檻就必須啟動更積極的應變方案？',
    },
    // people: 明夷于南狩, 初登于天後入于地, 箕子之明夷
    people: {
      imgs: ['明夷于南狩', '初登于天後入于地', '箕子之明夷'],
      q1: '你的社交狀態是初登于天後入于地那樣從核心人物跌落為邊緣人的落差中，還是箕子之明夷般已接受現狀並在低調中保持內在尊嚴？',
      q2: '面對社交圈的排斥，你會選擇明夷于南狩主動尋找新的社交場域重新開始，還是像箕子之明夷那樣在原處沉潛等待他人態度轉變？',
      q3: '人際中初登于天後入于地的社交地位跌落持續多久後，就該停止留戀舊圈子而全力投入明夷于南狩的新關係建立？',
    },
    // family: 入于左腹, 明夷于飛, 用拯馬壯
    family: {
      imgs: ['入于左腹', '明夷于飛', '用拯馬壯'],
      q1: '你的家庭狀況是明夷于飛那樣小心翼翼維持基本運作的低氣壓期，還是入于左腹般已有深層情感創傷正在影響家庭的信任根基？',
      q2: '面對家庭中的深層問題，你會選擇用拯馬壯向外尋求專業諮商或長輩調解，還是靠明夷于飛維持日常互動讓時間慢慢療癒？',
      q3: '家庭中入于左腹的核心創傷在多長時間內仍無任何修復跡象時，就該承認僅靠家庭內部力量已不足夠而必須引入外部協助？',
    },
    // study: 用拯馬壯, 箕子之明夷, 明入地中
    study: {
      imgs: ['用拯馬壯', '箕子之明夷', '明入地中'],
      q1: '你的學習狀態是明入地中那樣遭遇瓶頸感到智力被遮蔽的黑暗期，還是箕子之明夷般已接受暫時的落後但仍在默默積累的堅持期？',
      q2: '面對學習上的瓶頸，你會選擇用拯馬壯主動尋找好老師或好教材來突破，還是像箕子之明夷那樣靠自己持續投入等待自然開竅？',
      q3: '學習中明入地中的瓶頸期持續幾個月後仍未突破，就該判斷是方法或方向需要改變而非繼續用同樣的方式硬撐？',
    },
    // health: 夷于左股, 用拯馬壯, 明入地中
    health: {
      imgs: ['夷于左股', '用拯馬壯', '明入地中'],
      q1: '你的身體狀態是明入地中那樣精力降到谷底的極度疲勞期，還是夷于左股般已有明確的身體部位出現具體的疼痛或功能受限？',
      q2: '面對身體發出的警訊，你會選擇用拯馬壯積極尋找對的專科醫師進行徹底診治，還是先靠休息和自我調養觀察夷于左股的傷勢是否自行好轉？',
      q3: '身體上夷于左股的具體損傷訊號持續多少天仍未緩解時，就該從自我觀察切換為用拯馬壯的積極就醫以免延誤治療時機？',
    },
    // decision: 初登于天後入于地, 明夷于南狩, 箕子之明夷
    decision: {
      imgs: ['初登于天後入于地', '明夷于南狩', '箕子之明夷'],
      q1: '你面前的決策困境是初登于天後入于地那樣過去的成功模式已失效的認知衝擊中，還是箕子之明夷般已看清現實正在等待適合的行動時機？',
      q2: '面對黑暗中的重大決策，你會選擇明夷于南狩主動朝向光明方向邁出試探性的一步，還是像箕子之明夷那樣繼續按兵不動保存實力？',
      q3: '哪個外部環境的具體變化一旦出現，就代表箕子之明夷的等待期已經結束，必須立即啟動明夷于南狩的行動計劃？',
    },
    // business: 用拯馬壯, 初登于天後入于地, 明夷于飛
    business: {
      imgs: ['用拯馬壯', '初登于天後入于地', '明夷于飛'],
      q1: '你的事業現狀是初登于天後入于地那樣從輝煌驟然跌落的震盪中，還是明夷于飛般已接受現實正在精簡規模低調營運的求生期？',
      q2: '面對經營上的危機，你會選擇用拯馬壯積極尋找外部投資人或策略夥伴來注入活水，還是靠明夷于飛極致精簡靠自己慢慢撐過寒冬？',
      q3: '經營上用拯馬壯的外部融資窗口在現金流還能支撐幾個月時就該啟動，一旦低於這個安全線再找錢談判條件將極度不利？',
    },
    // legal: 入于左腹, 用拯馬壯, 明夷于南狩
    legal: {
      imgs: ['入于左腹', '用拯馬壯', '明夷于南狩'],
      q1: '你目前的爭議狀態是入于左腹那樣對方已掌握能打擊你核心利益的關鍵論點，還是明夷于南狩般你已找到對方防線的薄弱環節準備反攻？',
      q2: '面對法律上的劣勢，你會選擇用拯馬壯立即更換或加強法律代表以提升防禦能力，還是明夷于南狩集中資源攻擊對方最薄弱的那一個爭點？',
      q3: '在處理過程中，入于左腹的不利證據被對方正式提出後，你必須在多少個工作日內做出正式回應才不致陷入無法逆轉的被動？',
    },
    // spiritual: 箕子之明夷, 明入地中, 初登于天後入于地
    spiritual: {
      imgs: ['箕子之明夷', '明入地中', '初登于天後入于地'],
      q1: '你的靈性狀態是初登于天後入于地那樣從虛假的靈性高峰跌入真實谷底的陣痛中，還是箕子之明夷般已在外表平凡中守住了不可侵犯的內在光明？',
      q2: '面對靈性的黑暗之夜，你會選擇像箕子之明夷那樣保持每日最基本的修行紀律靜待光明回歸，還是徹底放下所有修行形式讓自己完全沉浸在明入地中的虛無裡？',
      q3: '在靈性探索的路上，明入地中的黑暗期持續多久後仍感受不到任何進展時，就該從獨自沉潛轉為尋找箕子之明夷般的靈性同路人或導師？',
    },
  },
};

function buildQuestions(hexDef) {
  const out = [];
  for (const [catKey, catName] of CATEGORIES) {
    const d = hexDef.data[catKey];
    if (!d) throw new Error(`Missing data for hex ${hexDef.hexagramId} cat ${catKey}`);
    const entries = [d.q1, d.q2, d.q3];
    entries.forEach((question, idx) => {
      out.push({
        id: `rf-${String(hexDef.hexagramId).padStart(3, '0')}-${catKey}-${idx + 1}`,
        hexagramId: hexDef.hexagramId,
        hexagramName: hexDef.hexagramName,
        category: catKey,
        categoryName: catName,
        question,
        basis: [hexDef.hexagramName, d.imgs[idx] || d.imgs[0], catName],
        qualityLevel: 'refined',
        reviewed: false,
        needsHumanReview: true,
        version: '1.8.0-wB-refl-hex35-36',
      });
    });
  }
  return out;
}

function normalize(s) {
  return s.replace(/[？?，,。.！!、\s]/g, '');
}

function validateLengths(questions, label) {
  const bad = [];
  for (const q of questions) {
    const len = q.question.length;
    if (len < 38 || len > 105) {
      bad.push({ id: q.id, len, question: q.question });
    }
  }
  if (bad.length) {
    console.error(`[${label}] Length validation FAILED for ${bad.length} questions:`);
    bad.forEach((b) => console.error(`  ${b.id} len=${b.len}: ${b.question}`));
    throw new Error(`${label}: length validation failed`);
  }
  console.log(`[${label}] Length validation OK for ${questions.length} questions (38-105 chars).`);
  const lens = questions.map(q => q.question.length);
  console.log(`  min=${Math.min(...lens)} max=${Math.max(...lens)} avg=${(lens.reduce((a,b)=>a+b,0)/lens.length).toFixed(1)}`);
}

function validateEndsWithQuestionMark(questions, label) {
  const bad = questions.filter((q) => !q.question.endsWith('？'));
  if (bad.length) {
    console.error(`[${label}] Missing terminal '？' for:`, bad.map((b) => b.id));
    throw new Error(`${label}: terminal punctuation validation failed`);
  }
  console.log(`[${label}] Terminal '？' validation OK.`);
}

function validateUniqueness(questions, label) {
  const seen = new Map();
  let dupCount = 0;
  for (const q of questions) {
    const norm = normalize(q.question);
    if (seen.has(norm)) {
      dupCount++;
      console.error(`[${label}] Duplicate (normalized) between ${seen.get(norm)} and ${q.id}`);
    } else {
      seen.set(norm, q.id);
    }
  }
  const uniqueCount = questions.length - dupCount;
  console.log(`[${label}] Uniqueness: ${uniqueCount}/${questions.length} unique after normalization.`);
  if (dupCount > 0) {
    throw new Error(`${label}: uniqueness validation failed (${dupCount} duplicates)`);
  }
}

function validateOpenEnded(questions, label) {
  const openMarkers = ['哪', '什麼', '何', '多少', '如何', '怎', '是否', '還是', '多久', '多長', '多深', '幾', '几'];
  const bad = questions.filter(q => !openMarkers.some(m => q.question.includes(m)));
  if (bad.length) {
    console.error(`[${label}] Not open-ended for:`, bad.map(b => b.id));
    throw new Error(`${label}: open-ended validation failed`);
  }
  console.log(`[${label}] Open-ended validation OK.`);
}

function validateQ2Choice(questions, label) {
  const q2s = questions.filter(q => q.id.endsWith('-2'));
  const bad = q2s.filter(q => !q.question.includes('還是') && !q.question.includes('还是'));
  if (bad.length) {
    console.error(`[${label}] Q2 missing 還是 for:`, bad.map(b => b.id));
    throw new Error(`${label}: Q2 choice validation failed`);
  }
  console.log(`[${label}] Q2 choice (還是) validation OK for ${q2s.length} questions.`);
}

function validateImageryUsage(questions, label) {
  const groupQuestions = {};
  for (const q of questions) {
    const key = `${q.hexagramId}-${q.category}`;
    if (!groupQuestions[key]) groupQuestions[key] = { questions: [], imgs: new Set() };
    groupQuestions[key].questions.push(q);
    groupQuestions[key].imgs.add(q.basis[1]);
  }
  const bad = [];
  for (const [key, g] of Object.entries(groupQuestions)) {
    const allImgs = Array.from(g.imgs);
    let imageryCount = 0;
    for (const q of g.questions) {
      const hasImagery = allImgs.some(term => q.question.includes(term));
      if (hasImagery) imageryCount++;
    }
    if (imageryCount < 2) {
      bad.push(`${key}: only ${imageryCount}/${g.questions.length} questions use hex imagery (need >=2)`);
    }
  }
  if (bad.length) {
    console.error(`[${label}] Imagery usage FAILED:`);
    bad.forEach(b => console.error(`  ${b}`));
    throw new Error(`${label}: imagery usage validation failed`);
  }
  console.log(`[${label}] Imagery usage OK: all ${Object.keys(groupQuestions).length} groups have >=2 hex-imagery questions.`);
}

function validateQTypeOrientation(questions, label) {
  const groups = {};
  for (const q of questions) {
    const key = `${q.hexagramId}-${q.category}`;
    if (!groups[key]) groups[key] = [];
    groups[key].push(q);
  }
  const bad = [];
  for (const [key, qs] of Object.entries(groups)) {
    // Q1 should be state-oriented
    const stateMarkers = ['狀態', '處於', '階段', '是否', '目前', '當前', '此刻', '現狀', '現是', '還是'];
    if (!stateMarkers.some(m => qs[0].question.includes(m))) {
      bad.push(`${key}/Q1: not state-oriented`);
    }
    // Q3 should be risk/boundary/timing-oriented
    const riskMarkers = ['何時', '多久', '幾個月', '多少天', '第幾次', '多少次', '比例', '天內',
      '底線', '門檻', '訊號', '信號', '警戒', '界線', '邊界', '轉折', '工作日', '環節', '層次',
      '時間點', '什麼時候', '什麼程度', '多少比例', '多少個', '哪個階段', '多長時間',
      '何種', '何處', '臨界', '關鍵', '窗口', '時機', '條件下',
      '一旦', '何種條件', '結束', '安全線', '警示'];
    if (!riskMarkers.some(m => qs[2].question.includes(m))) {
      bad.push(`${key}/Q3: not risk/boundary/timing-oriented`);
    }
  }
  if (bad.length) {
    console.error(`[${label}] Q-type orientation FAILED:`);
    bad.forEach(b => console.error(`  ${b}`));
    throw new Error(`${label}: Q-type orientation validation failed`);
  }
  console.log(`[${label}] Q-type orientation OK (Q1=state, Q2=choice, Q3=risk).`);
}

function main() {
  const newH35 = buildQuestions(HEX35);
  const newH36 = buildQuestions(HEX36);

  const allNew = [...newH35, ...newH36];
  console.log(`Built ${allNew.length} new questions (36 hex35 + 36 hex36).\n`);

  // =========================================================================
  // MANDATORY: All 72 must pass before writeFileSync
  // =========================================================================
  console.log('--- LENGTH VALIDATION ---');
  validateLengths(newH35, 'HEX35');
  validateLengths(newH36, 'HEX36');

  console.log('\n--- TERMINAL ？ VALIDATION ---');
  validateEndsWithQuestionMark(newH35, 'HEX35');
  validateEndsWithQuestionMark(newH36, 'HEX36');

  console.log('\n--- OPEN-ENDED VALIDATION ---');
  validateOpenEnded(newH35, 'HEX35');
  validateOpenEnded(newH36, 'HEX36');

  console.log('\n--- Q2 CHOICE VALIDATION ---');
  validateQ2Choice(newH35, 'HEX35');
  validateQ2Choice(newH36, 'HEX36');

  console.log('\n--- Q-TYPE ORIENTATION ---');
  validateQTypeOrientation(newH35, 'HEX35');
  validateQTypeOrientation(newH36, 'HEX36');

  console.log('\n--- UNIQUENESS VALIDATION ---');
  validateUniqueness(newH35, 'HEX35');
  validateUniqueness(newH36, 'HEX36');
  validateUniqueness(allNew, 'HEX35+36 combined');

  console.log('\n--- IMAGERY USAGE VALIDATION ---');
  validateImageryUsage(newH35, 'HEX35');
  validateImageryUsage(newH36, 'HEX36');

  // =========================================================================
  // ALL 72 PASSED — WRITE
  // =========================================================================
  console.log('\n=== ALL 72 QUESTIONS PASSED VALIDATION. Writing data file. ===\n');

  const code = fs.readFileSync(DATA_PATH, 'utf8');
  const sandbox = { window: {} };
  vm.createContext(sandbox);
  vm.runInContext(code, sandbox, { filename: DATA_PATH });
  const data = sandbox.window.Zero1MatrixData.reflectionQuestions;
  if (!Array.isArray(data)) throw new Error('Failed to load existing reflectionQuestions array');

  console.log(`Loaded existing data: ${data.length} questions total.`);

  const before35 = data.filter((d) => d.hexagramId === 35).length;
  const before36 = data.filter((d) => d.hexagramId === 36).length;
  console.log(`Existing hex35=${before35}, hex36=${before36}`);

  const filtered = data.filter((d) => d.hexagramId !== 35 && d.hexagramId !== 36);
  const merged = [...filtered, ...newH35, ...newH36];

  // Sort by hexagramId, then by id for consistent ordering
  merged.sort((a, b) => {
    if (a.hexagramId !== b.hexagramId) return a.hexagramId - b.hexagramId;
    return a.id.localeCompare(b.id);
  });

  console.log(`New total: ${merged.length} (expected ${data.length - before35 - before36 + 72})`);

  const output =
    "window.Zero1MatrixData = window.Zero1MatrixData || {};\n" +
    "window.Zero1MatrixData.reflectionQuestions = " +
    JSON.stringify(merged) +
    ";\n";

  fs.writeFileSync(DATA_PATH, output, 'utf8');
  console.log(`Written to ${DATA_PATH}`);

  // Verify with node --check
  try {
    execFileSync(process.execPath, ['--check', DATA_PATH], { stdio: 'inherit' });
    console.log('node --check PASSED.');
  } catch (e) {
    console.error('node --check FAILED.');
    throw e;
  }

  // Re-load to double check
  const verifyCode = fs.readFileSync(DATA_PATH, 'utf8');
  const verifySandbox = { window: {} };
  vm.createContext(verifySandbox);
  vm.runInContext(verifyCode, verifySandbox, { filename: DATA_PATH });
  const verifyData = verifySandbox.window.Zero1MatrixData.reflectionQuestions;
  console.log(`Verification reload: ${verifyData.length} total questions.`);
  const v35 = verifyData.filter((d) => d.hexagramId === 35);
  const v36 = verifyData.filter((d) => d.hexagramId === 36);
  console.log(`Verification hex35=${v35.length}, hex36=${v36.length}`);

  if (v35.length !== 36 || v36.length !== 36) {
    throw new Error('Verification failed: expected 36 questions each for hex35 and hex36');
  }

  // Final quality field check
  const allVerified = [...v35, ...v36];
  for (const q of allVerified) {
    if (q.qualityLevel !== 'refined') throw new Error(`${q.id}: qualityLevel=${q.qualityLevel}`);
    if (q.reviewed !== false) throw new Error(`${q.id}: reviewed=${q.reviewed}`);
    if (q.needsHumanReview !== true) throw new Error(`${q.id}: needsHumanReview=${q.needsHumanReview}`);
  }
  console.log('Quality field verification PASSED.');

  console.log('\nwB_refl_35_36.js generation COMPLETE — 72 questions written successfully.');
}

main();