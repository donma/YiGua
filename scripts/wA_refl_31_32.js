// Hex 31 (咸) and Hex 32 (恆) reflection questions
// 12 categories x 2 hexagrams x 3 questions = 72 total
// qualityLevel: "refined", reviewed: false, needsHumanReview: true

const fs = require('fs');

const hex31Imagery = {
  general: ['山上有澤', '憧憧往來', '咸其拇'],
  career: ['咸其腓', '執其隨', '憧憧往來'],
  love: ['咸其拇', '咸其股', '咸其輔頰舌'],
  money: ['執其隨', '憧憧往來', '咸其腓'],
  people: ['憧憧往來', '咸其輔頰舌', '山上有澤'],
  family: ['咸其拇', '咸其脢', '執其隨'],
  study: ['咸其股', '憧憧往來', '山上有澤'],
  health: ['咸其脢', '執其隨', '咸其拇'],
  decision: ['憧憧往來', '執其隨', '咸其輔頰舌'],
  business: ['山上有澤', '咸其股', '憧憧往來'],
  legal: ['執其隨', '咸其輔頰舌', '咸其腓'],
  spiritual: ['咸其脢', '山上有澤', '憧憧往來']
};

const hex32Imagery = {
  general: ['雷風恆', '君子以立不易方', '恆其德'],
  career: ['不恆其德', '田無禽', '君子以立不易方'],
  love: ['浚恆', '恆其德', '悔亡'],
  money: ['振恆', '不恆其德', '田無禽'],
  people: ['君子以立不易方', '不恆其德', '振恆'],
  family: ['恆其德', '悔亡', '浚恆'],
  study: ['田無禽', '君子以立不易方', '雷風恆'],
  health: ['悔亡', '振恆', '浚恆'],
  decision: ['浚恆', '振恆', '不恆其德'],
  business: ['雷風恆', '田無禽', '恆其德'],
  legal: ['不恆其德', '君子以立不易方', '振恆'],
  spiritual: ['君子以立不易方', '雷風恆', '恆其德']
};

// Q1=state, Q2=choice, Q3=risk/boundary/timing
// Each must: 38-105 chars, end with ？, open-ended
// At least 2 of 3 per group use hex imagery
// Hex+category specific, genuinely distinct per category

const hex31 = {
  general: [
    '當山上的澤水浸潤著山體，你感受到哪些無形的影響正悄然滲透進你當前的生命狀態？',
    '咸其拇之道始於足下——你是選擇先邁出那謹慎的第一步感應，還是寧可原地不動等待更清晰的信號？',
    '憧憧往來的眾多念頭在人際感應中翻騰時，你在哪個時間點該切斷共情以免迷失自我邊界？'
  ],
  career: [
    '咸其腓暗示小腿的感應——你的職業生涯目前處於哪個起步未穩的階段，小腿的肌肉在告訴你什麼？',
    '當你必須執其隨、跟從團隊的方向前進，你是選擇追隨那個技術深厚但溝通生硬的領導，還是那個親和力強但方向模糊的上司？',
    '憧憧往來的職業機會像潮水般湧來退去，你該在多少次反覆考慮後果斷出手才不至於錯過窗口期？'
  ],
  love: [
    '咸其拇的初動感應在關係中像腳趾輕觸——你目前對某人的好感狀態是來自真實共振，還是寂寞驅動的投射？',
    '咸其股讓你坐立不安難以自持：你是選擇直面表白那份悸動並承擔被拒風險，還是繼續保持現有關係的安穩舒適？',
    '咸其輔頰舌的言語感應一旦過度就成了花言巧語——你在哪個界限處該停止甜言蜜語以避免模糊了真誠的邊界？'
  ],
  money: [
    '執其隨的跟從心態讓你在財務上處於被動——你目前的理財狀態是否在盲目跟隨他人而非根據自身需求自主規劃？',
    '憧憧往來如市場上無數買賣信號交錯，你是選擇穩健的長期儲蓄讓錢慢慢累積如山，還是把握短期波動機會快速進出？',
    '咸其腓的小腿感應提示財路已起步但根基未穩——你該在投資虧損達到哪個百分比時就立即止損退出？'
  ],
  people: [
    '憧憧往來的人際關係像穿梭不息的潮水，你當前的社交狀態是熱絡互動後的充實感還是無意義的社交疲憊？',
    '咸其輔頰舌的言辭感應讓你在人群中善於表達，你是選擇用真誠直率的話語建立深度信任，還是用圓融得體的話術維持表面和諧？',
    '山上有澤的感通格局提醒山澤相融卻各守其位——你在人際往來中何時該從包容接納轉為設立邊界？'
  ],
  family: [
    '咸其拇的家庭感應始於最小的觸碰——你對家人目前的情感連結是敏感而溫暖的初動，還是已經麻木得幾乎無感？',
    '咸其脢的背部感應意味著你背負著家庭期待卻無法看到全貌——你是選擇默默承擔無言的家族責任前行，還是坐下來把背後的負擔攤開來與家人坦誠溝通？',
    '執其隨的家庭角色讓你在代際之間被動跟從——你在哪個人生階段該從遵從父母意願轉為獨立主導自己的人生決策？'
  ],
  study: [
    '咸其股的坐姿感應反映你的學習狀態——你是否像久坐不動的學子那樣知識積累停滯而缺乏行動轉化？',
    '憧憧往來如同腦海中無數知識碎片交錯碰撞，你是選擇深入鑽研一門核心技能直到精通如山，還是廣泛涉獵多個領域保持靈活的知識廣度？',
    '山上有澤的格局讓學習需要感通與沉澱的平衡——你該在積累幾個月的理論後就從書本中抬頭，何時才是進入實踐驗證的關鍵時機？'
  ],
  health: [
    '咸其脢的背部感應提示身體的無聲訊號——你目前是否像背脊的緊繃那樣積壓了許多未被察覺的慢性壓力？',
    '執其隨的跟從模式讓你的健康習慣依附於他人——你是選擇遵循專業教練設計的嚴格訓練計劃，還是依循自己身體直覺的節奏來調理？',
    '咸其拇的腳趾感應是最細微的身體警訊——你在哪個身體不適的早期徵兆出現時就該立即就醫而非拖延？'
  ],
  decision: [
    '憧憧往來的思緒在你做決定時像無數條岔路交錯——你當前的決策狀態是被過多選項癱瘓了還是清晰而堅定？',
    '執其隨意味著你要麼跟從內心的感應要麼聽從外在的聲音：你是選擇憑直覺迅速拍板然後承擔後果，還是收集更多數據反覆權衡直到最後一刻？',
    '咸其輔頰舌提醒言語決策的後果不可逆——你在說出那句可能改變一切的話之前，需要給自己多長的冷靜緩衝時間以免說出無法挽回的話？'
  ],
  business: [
    '山上有澤的感通格局在你的商業中象徵著資源與根基的呼應——你當前的商業模式是否實現了流動資本與固定資產之間的良好感應？',
    '咸其股暗示商業行動中坐立不安的張力：你是選擇穩守現有市場份額深耕細作，還是冒險投入新產品線開拓未知領域？',
    '憧憧往來的商業合作訊息讓人眼花繚亂——你在洽談多少個潛在合作方後就該鎖定一兩個深入推進而不致分散精力？'
  ],
  legal: [
    '執其隨的法律處境讓你必須跟從程序與規範——你目前的案件或合約是否處於被對方主導節奏的被動局面？',
    '咸其輔頰舌的口頭承諾在法理上模糊不清：你是選擇堅持以書面契約逐條明確保護自己的權益，還是基於信任先以口頭約定推進合作？',
    '咸其腓的小腿感應意味著法律行動已起步但尚未站穩——你在訴訟或仲裁進行到哪個階段時該考慮和解而非繼續消耗？'
  ],
  spiritual: [
    '咸其脢的背部感應指向無法直視內在深層——你當前的心靈狀態是否背負著某種難以言說卻深刻影響你的無形力量？',
    '山上有澤的天地感通之道——你是選擇在山頂靜觀澤水映照天地以獲得頓悟，還是涉入澤中親身感受流動以體驗漸修？',
    '憧憧往來的萬念紛飛讓你難以入定——你在冥想或靈修時該在第幾個念頭浮現時就重新拉回專注才不致完全散亂？'
  ]
};

const hex32 = {
  general: [
    '雷風恆的天地常道在你生命中持續運行——你當前的生命狀態有哪些恆常不變的節奏在支撐著你度過變動時期？',
    '君子以立不易方的恆守之道：你是選擇在變幻世界中堅守一個不變的核心價值觀如雷如山，還是隨境調整立場以風的柔韌適應每一個當下？',
    '恆其德的持久修養需要時間的淬煉——你在培養一項品德到何種穩定程度時才可以說它已成為無需刻意堅守就不可動搖的一部分？'
  ],
  career: [
    '不恆其德暗示你在職場中可能頻繁變換方向——你目前的職業狀態是因為缺乏恆心而一事無成，還是策略性地多方試探？',
    '田無禽如耕耘卻無收穫：你是選擇堅持在當前的職業領域繼續深耕等待轉機，還是果斷轉行去一個更有前景但完全陌生的行業？',
    '君子以立不易方提醒職業立場的恆守——你在一個職位上待了多久仍無晉升或成長時就該考慮離開而非無限期等待？'
  ],
  love: [
    '浚恆的過度深求讓你在感情中刨根問底——你當前的愛情狀態是否因為過分追求對方的心意而攪渾了本該清澈的關係？',
    '恆其德的情感恆守：你是選擇在一段日漸平淡但穩固可靠的關係中堅守承諾，還是追隨內心的悸動去尋找新的激情與共鳴？',
    '悔亡意味著悔恨的消散——你在一段感情結束後需要設定多久的緩衝療癒期才算足夠，才不會讓悔亡未盡影響下一段關係？'
  ],
  money: [
    '振恆的財務震盪讓你無法保持穩定——你目前的財務狀態是否像地震中的建築一樣搖搖欲墜而缺乏恆定的基礎？',
    '不恆其德的理財態度：你是選擇堅持一種紀律嚴明的預算制度哪怕生活品質受限，還是保持靈活的消費方式讓自己在當下活得舒適？',
    '田無禽的投入無果警告你在財務冒險中的風險——你該在連續幾個月投資都無正回報時就認清形勢果斷收手而不再繼續虧損？'
  ],
  people: [
    '君子以立不易方的交友原則——你當前的社交狀態是建立在幾個不變的核心朋友之上，還是像流水一樣不斷更替新面孔？',
    '不恆其德的人際關係因缺乏恆心而脆弱：你是選擇深耕幾段老友關係投入真誠時間如雷般堅定，還是廣泛結交新人保持社交網絡的活力與新鮮感？',
    '振恆的人際震盪讓舊有關係格局瓦解——你在察覺一段友誼開始動搖時該在幾次修復嘗試失敗後就接受它自然終結？'
  ],
  family: [
    '恆其德的家庭倫常是你安定的基石——你目前對家庭責任的堅守是發自內心的恆定，還是迫於社會期待的無奈？',
    '悔亡的家庭過往陰影：你是選擇直面家族中那些未曾化解的舊怨進行一次徹底的坦誠對話，還是保持現狀讓時間自然撫平一切痕跡？',
    '浚恆提醒你對家人的深究可能適得其反——你在追問家人某個敏感話題到什麼深度時就該停下來給彼此留出緩衝的空間？'
  ],
  study: [
    '田無禽的學習困境讓你感到投入時間卻無成果——你目前的學習狀態是否在錯誤的方法上反覆耕耘而收穫甚微？',
    '君子以立不易方的治學態度：你是選擇鎖定一個學術方向終身鑽研以立不變之根基，還是跨學科融合多個領域在交叉處尋找創見？',
    '雷風恆的學習節奏需要恆常與變化共存——你該在每日固定學習幾個小時後就切換模式讓大腦休息才不至於效率持續衰減？'
  ],
  health: [
    '悔亡的消逝感讓舊疾看似遠去——你當前的健康狀態是否真的已經擺脫了過去那些反覆出現的隱患，還是只在間歇期而未根除？',
    '振恆的身體震盪打亂了你的健康節奏：你是選擇回歸最基本的作息規律從根源重建身體的恆定，還是用更強力的藥物或補劑迅速鎮壓當前的症狀？',
    '浚恆的過度深求對身體是一種消耗——你在追求某項健康目標如減重或增肌時該在身體發出何種明確警訊時就立即放緩節奏停止過度消耗？'
  ],
  decision: [
    '浚恆讓你在決策時過度深挖細節而無法行動——你當前的決策狀態是否陷入了無休止的分析而遲遲無法做出最終判斷？',
    '振恆的震盪帶來打破僵局的契機：你是選擇在動盪中果斷推翻原有方案另起爐灶如雷破空，還是穩住現有框架小幅調整如風徐行？',
    '不恆其德提醒反覆無常的決策代價極高——你在一個重大決定上允許自己最多推翻幾次就必須鎖定方向不再回頭以免付出更大的代價？'
  ],
  business: [
    '雷風恆的商業恆常之道——你目前的經營狀態是否找到了那些不因市場風向而改變的核心競爭力與恆定價值？',
    '田無禽如投入資源卻未見商業回報：你是選擇堅持當前的商業模式繼續培育市場等待成熟時機，還是迅速調整策略轉向更有利可圖的業務方向？',
    '恆其德的商業信譽積累需要時間——你在一個新市場堅持多久仍未盈利時就該判斷是策略有誤還是時機未到而及時調整方向？'
  ],
  legal: [
    '不恆其德的法律立場搖擺讓你在糾紛中失去優勢——你當前的法律處境是否因為立場反覆而削弱了自己的可信度？',
    '君子以立不易方的法律原則：你是選擇在每一個案件中嚴格堅守程序正義哪怕結果不利，還是靈活運用法律空間追求最有利的實質結果？',
    '振恆的震盪預示法律糾紛可能突然升級——你在收到對方第一次強硬的法律行動通知後該在多少天內做出回應才不致陷入被動？'
  ],
  spiritual: [
    '君子以立不易方的靈性修為——你當前的靈性狀態是否找到了那個無論外在環境如何變化都不動搖的內在定錨點？',
    '雷風恆的宇宙常道——你是選擇以雷的剛健之力突破自我限制追求靈性躍升，還是以風的柔順之德順應自然節奏等待水到渠成？',
    '恆其德的靈性修養最忌半途而廢——你在每日的修行或靜心練習中該設定什麼樣的底線時間長度才能確保不退轉的恆定而不會中途放棄？'
  ]
};

// Validate all questions
function validate(questions, hexName) {
  const errors = [];
  const categories = Object.keys(questions);

  if (categories.length !== 12) {
    errors.push(`${hexName}: Expected 12 categories, got ${categories.length}`);
  }

  for (const cat of categories) {
    const qs = questions[cat];
    if (!Array.isArray(qs) || qs.length !== 3) {
      errors.push(`${hexName}/${cat}: Expected 3 questions, got ${qs ? qs.length : 0}`);
      continue;
    }

    // Count imagery usage
    const imagery = hexName === 'hex31' ? hex31Imagery[cat] : hex32Imagery[cat];
    let imageryCount = 0;
    for (const img of imagery) {
      for (const q of qs) {
        if (q.includes(img)) {
          imageryCount++;
          break;
        }
      }
    }

    if (imageryCount < 2) {
      errors.push(`${hexName}/${cat}: Only ${imageryCount}/3 imagery terms used (need >=2)`);
    }

    for (let i = 0; i < qs.length; i++) {
      const q = qs[i];
      const qType = i === 0 ? 'state' : i === 1 ? 'choice' : 'risk/boundary/timing';

      // Check length
      if (q.length < 38 || q.length > 105) {
        errors.push(`${hexName}/${cat}/Q${i + 1}: Length ${q.length} (need 38-105)`);
      }

      // Check ends with ？
      if (!q.endsWith('？')) {
        errors.push(`${hexName}/${cat}/Q${i + 1}: Does not end with ？`);
      }

      // Check open-ended
      const openMarkers = ['哪', '什麼', '什么', '何', '多少', '如何', '怎', '幾', '几', '是否', '還是', '还是', '多久', '多長', '怎樣的', '怎样的'];
      const hasOpenMarker = openMarkers.some(m => q.includes(m));
      if (!hasOpenMarker) {
        errors.push(`${hexName}/${cat}/Q${i + 1}: May not be open-ended`);
      }

      // Q1 = state check
      if (i === 0) {
        const stateMarkers = ['狀態', '處於', '階段', '是否', '目前', '當前', '当下', '是不是'];
        const hasStateMarker = stateMarkers.some(m => q.includes(m));
        if (!hasStateMarker) {
          errors.push(`${hexName}/${cat}/Q1: Should be state-oriented`);
        }
      }

      // Q2 = choice check (compare 2 real options)
      if (i === 1) {
        const choiceMarkers = ['還是', '还是', '要麼', '或是'];
        const hasChoiceMarker = choiceMarkers.some(m => q.includes(m));
        if (!hasChoiceMarker) {
          errors.push(`${hexName}/${cat}/Q2: Should be choice-oriented (compare 2 options)`);
        }
      }

      // Q3 = risk/boundary/timing check
      if (i === 2) {
        const riskMarkers = ['何時', '多少天', '多久', '幾個月', '哪個階段', '多少個', '第幾個', '哪個', '什麼信號', '信號', '界限', '邊界', '風險', '止損', '退出', '緩衝', '緩冲', '時機', '窗口', '何種', '多少次', '幾次', '什麼深度', '什麼程度', '天內', '多長', '幾個小時', '底線', '底線時間'];
        const hasRiskMarker = riskMarkers.some(m => q.includes(m));
        if (!hasRiskMarker) {
          errors.push(`${hexName}/${cat}/Q3: Should be risk/boundary/timing-oriented`);
        }
      }
    }
  }

  return errors;
}

// Cross-category distinctness check
function checkDistinctness(allQuestions, hexName) {
  const errors = [];
  const allQs = [];

  for (const cat of Object.keys(allQuestions)) {
    for (let i = 0; i < allQuestions[cat].length; i++) {
      allQs.push({ cat, idx: i, text: allQuestions[cat][i] });
    }
  }

  for (let i = 0; i < allQs.length; i++) {
    for (let j = i + 1; j < allQs.length; j++) {
      const a = allQs[i];
      const b = allQs[j];
      if (a.cat === b.cat) continue;

      const aCore = a.text.substring(0, Math.floor(a.text.length * 0.6));
      const bCore = b.text.substring(0, Math.floor(b.text.length * 0.6));

      if (aCore === bCore) {
        errors.push(`${hexName}: Q${a.idx + 1} in ${a.cat} similar to Q${b.idx + 1} in ${b.cat}`);
      }
    }
  }

  return errors;
}

// Run validation
console.log('=== VALIDATING HEX 31 ===');
const hex31Errors = validate(hex31, 'hex31');
const hex31Distinct = checkDistinctness(hex31, 'hex31');
const all31Errors = [...hex31Errors, ...hex31Distinct];

if (all31Errors.length > 0) {
  console.log('ERRORS FOUND:');
  all31Errors.forEach(e => console.log('  ' + e));
} else {
  console.log('All 36 hex31 questions PASS validation');
}

console.log('');
console.log('=== VALIDATING HEX 32 ===');
const hex32Errors = validate(hex32, 'hex32');
const hex32Distinct = checkDistinctness(hex32, 'hex32');
const all32Errors = [...hex32Errors, ...hex32Distinct];

if (all32Errors.length > 0) {
  console.log('ERRORS FOUND:');
  all32Errors.forEach(e => console.log('  ' + e));
} else {
  console.log('All 36 hex32 questions PASS validation');
}

const totalErrors = all31Errors.length + all32Errors.length;

if (totalErrors > 0) {
  console.log(`\n*** ${totalErrors} TOTAL ERRORS - NOT WRITING FILE ***`);
  process.exit(1);
}

// Build output data
const output = [];

const categories = Object.keys(hex31);

for (const cat of categories) {
  output.push({
    hexagram: 31,
    category: cat,
    questionType: 'state',
    question: hex31[cat][0],
    imagery: hex31Imagery[cat],
    qualityLevel: 'refined',
    reviewed: false,
    needsHumanReview: true
  });
  output.push({
    hexagram: 31,
    category: cat,
    questionType: 'choice',
    question: hex31[cat][1],
    imagery: hex31Imagery[cat],
    qualityLevel: 'refined',
    reviewed: false,
    needsHumanReview: true
  });
  output.push({
    hexagram: 31,
    category: cat,
    questionType: 'risk',
    question: hex31[cat][2],
    imagery: hex31Imagery[cat],
    qualityLevel: 'refined',
    reviewed: false,
    needsHumanReview: true
  });
}

for (const cat of categories) {
  output.push({
    hexagram: 32,
    category: cat,
    questionType: 'state',
    question: hex32[cat][0],
    imagery: hex32Imagery[cat],
    qualityLevel: 'refined',
    reviewed: false,
    needsHumanReview: true
  });
  output.push({
    hexagram: 32,
    category: cat,
    questionType: 'choice',
    question: hex32[cat][1],
    imagery: hex32Imagery[cat],
    qualityLevel: 'refined',
    reviewed: false,
    needsHumanReview: true
  });
  output.push({
    hexagram: 32,
    category: cat,
    questionType: 'risk',
    question: hex32[cat][2],
    imagery: hex32Imagery[cat],
    qualityLevel: 'refined',
    reviewed: false,
    needsHumanReview: true
  });
}

// Final length assertion
console.log(`\nTotal questions generated: ${output.length}`);
if (output.length !== 72) {
  console.log(`*** EXPECTED 72, GOT ${output.length} - NOT WRITING ***`);
  process.exit(1);
}

const filePath = 'D:\\AI_PROJECTS\\Zero1Matrix\\data\\wA_refl_31_32.json';

// Ensure data directory exists
const dir = 'D:\\AI_PROJECTS\\Zero1Matrix\\data';
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

fs.writeFileSync(filePath, JSON.stringify(output, null, 2), 'utf-8');
console.log(`\nWritten ${output.length} questions to ${filePath}`);