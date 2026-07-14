'use strict';
/**
 * wB_refl_37_38.js — Generate 72 TRULY DISTINCT reflection questions
 * for Hex 37 (家人) and Hex 38 (睽), 36 per hexagram × 3 per category.
 * Writes to src/data/reflectionQuestions.data.js with all mandatory checks.
 */
const vm = require('vm');
const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, '..', 'src', 'data', 'reflectionQuestions.data.js');
const NODE_EXE = path.join(__dirname, '..', '.nodejs', 'node-v22.14.0-win-x64', 'node.exe');

// ============================================================================
// CATEGORIES
// ============================================================================
const CATEGORY_NAMES = {
  general: '一般',
  career: '工作事業',
  love: '感情關係',
  money: '財務金錢',
  people: '人際合作',
  family: '家庭親人',
  study: '學習考試',
  health: '身心狀態',
  decision: '重大決策',
  business: '創業經營',
  legal: '官非合約',
  spiritual: '心境修行',
};
const CATEGORIES = Object.keys(CATEGORY_NAMES);

// ============================================================================
// HEX 37 家人 (風火家人) — True family order, inner authority, discipline vs oppression
// Q1=state, Q2=choice (還是), Q3=risk/boundary/timing
// ============================================================================
const HEX37 = {
  hexagramId: 37,
  hexagramName: '家人',
  gua: '風火家人',
  questions: {
    general: [
      '風自火出的家人格局中，風從火生象徵一切外在影響皆源於內部秩序——你目前的內部狀態是穩定輸出的澄明之火，還是忽強忽弱的搖曳燭光？',
      '王假有家提醒君王尚且以家為根基，你是選擇先整頓內部秩序建立穩固後盾，還是趁外在風勢正盛繼續向外衝刺？',
      '閑有家強調門戶之內須有守護與規矩，哪個邊界一旦失守會讓外在風雨直接灌入你的核心、從根部開始侵蝕？'
    ],
    career: [
      '有孚威如在職場語境中是威信來自誠信而非頭銜——你目前在團隊中的權威是基於身體力行的信服，還是僅憑職位賦予的表面服從？',
      '閑有家要求明確的責任邊界與工作規範，家人嗃嗃代表適度的嚴格：你是選擇先建立清晰的制度框架再放手授權，還是維持靈活但模糊的默契式分工？',
      '富家大吉說明秩序完善後團隊產出自然豐盛，你在團隊規範尚未穩固時推動大型專案，到了什麼程度就該喊停先回頭補好內部基礎？'
    ],
    love: [
      '有孚威如在感情中意味著吸引力來自內在誠信——你目前在關係中的對待模式是讓對方因你的真實而敬重，還是習慣用討好來換取安全感？',
      '家人嗃嗃與婦子嘻嘻是關係中嚴肅與歡愉的兩端：你是選擇先坐下來認真討論未來方向與底線，還是繼續用輕鬆嬉鬧迴避那些難以啟齒的話題？',
      '婦子嘻嘻若完全取代了有孚威如，關係就會只剩嬉鬧而無尊重——哪種輕鬆過了頭的互動模式正在悄悄稀釋你們之間本該有的基本敬重？'
    ],
    money: [
      '閑有家在理財語境中是建立預算紀律與支出邊界——你目前的財務框架是滴水不漏的穩固狀態，還是連基本的收支記錄都還存在模糊地帶？',
      '無攸遂在中饋強調穩妥管理日常基本開支遠勝追逐高報酬：你是選擇先把每月收支的控管做到無懈可擊，還是分出心力嘗試更高風險的投資標的？',
      '富家大吉的累積需要閑有家的框架在先，你在連續幾個月都沒有建立明確財務紀律的情況下持續投入資金，到了什麼程度的虧損就該強制設立止損底線？'
    ],
    people: [
      '風自火出在人際合作中說明外部成果取決於內部互信品質——你與目前合作對象之間的信任是雙向流動的穩定火源，還是單方面輸出後已感到被掏空？',
      '家人嗃嗃的明確規範與婦子嘻嘻的輕鬆互動缺一不可：你是選擇先建立清楚的責任歸屬讓合作有跡可循，還是先培養關係溫度讓合作有彈性緩衝？',
      '有孚威如的威信靠每一次說到做到的累積，哪種反覆出現的失信行為一旦被對方察覺，會從根本上瓦解你辛苦建立起來的合作信譽？'
    ],
    family: [
      '閑有家要求家門之內須有守護——你家庭的邊界目前是穩固地把外界風雨擋在門外的狀態，還是工作壓力與外部紛擾已經毫無屏障地灌入了家庭空間？',
      '王假有家說明外在成就最終要回到家庭來獲得歸屬：你是選擇現在就調整工作與家庭的時間分配比例，還是等事業達到目標後再回頭經營家庭關係？',
      '無攸遂在中饋的日常照料是家庭穩定的根基，哪種看似微不足道的日常忽略連續發生到了一定次數後，會讓家庭成員開始感覺被冷落而產生實質裂痕？'
    ],
    study: [
      '風自火出在學習中象徵外表現取決於內在知識架構的穩固——你目前對所學領域的基礎掌握是清晰可支撐進階探索的狀態，還是存在尚未填補的模糊地帶？',
      '閑有家的學習紀律要求系統化的知識管理：你是選擇先花數週建立固定的學習節奏與筆記體系，還是保持隨興吸收的模式以追求更快的表面進度？',
      '有孚威如的學習誠實要求直面自己真正懂了多少，哪種長期被你跳過的模糊概念正在累積成為後續高階學習中反覆出現的瓶頸？'
    ],
    health: [
      '無攸遂在中饋把日常三餐與規律作息放在健康的核心——你目前的基本飲食與睡眠是否還維持著穩定的節奏，還是已被忙碌打亂到需要重新建立秩序？',
      '家人嗃嗃的運動自律與婦子嘻嘻的適度放鬆需要平衡：你是選擇用嚴格紀律強制建立每日運動習慣，還是先從提升日常活動量與放鬆品質自然調整？',
      '風自火出說明身體外在疲態根源於內部失衡，哪種持續超過特定天數的身體訊號一旦出現，就代表內部秩序的紊亂已經到了必須專業介入的程度？'
    ],
    decision: [
      '王假有家在決策中要求回到核心價值來檢驗——你面前的這個重大選擇，是否已經通過了你內心最深處那關的根本校準，還是仍有隱約的不協調感？',
      '閑有家的決策框架要求列出關鍵條件與底線：你是選擇用紙筆把選項與風險寫下來做透明比較，還是繼續憑腦中模糊的感覺在猶豫中消耗時間？',
      '有孚威如在決策中要求對自己誠實，哪種自我合理化的說辭一旦被你自己識破，就代表這個決定其實與你的核心價值存在根本衝突？'
    ],
    business: [
      '富家大吉說明內部秩序穩固後財富會自然累積——你目前企業的內部流程與制度是穩健到足以支撐規模化的階段，還是仍在用創始人個人意志填補制度缺口？',
      '風自火出提醒市場表現根源於組織穩定性：你是選擇先投入資源完善內部管理系統與人才梯隊，還是把資金優先集中在外部市場擴張與品牌曝光？',
      '王假有家警示戰略若偏離核心能力將兩頭落空，哪條產品線或市場方向一旦發現已與你團隊的真正實力脫節，就該果斷收縮而非繼續分散資源？'
    ],
    legal: [
      '有孚威如強調在法律事務中信譽是最重要的資產——你目前在案件或合約中的陳述與文件是否每一項都經得起對方仔細檢驗，還是存在經不起推敲的模糊之處？',
      '閑有家在法律事務中是建立清晰的防護機制：你是選擇把所有文件妥善歸檔並提前設定關鍵時效提醒，還是等到需要時才匆忙翻找拼湊證據？',
      '婦子嘻嘻提醒在嚴肅程序中仍需保留溝通彈性，哪個時間窗口一旦錯過就會讓和解的可能性徹底關閉，只能走向漫長而不可控的訴訟程序？'
    ],
    spiritual: [
      '風自火出在靈性層面說明向外散發的一切氣質都源於內心穩定度——你最近的內在狀態是一池靜水能清晰映照，還是波瀾不斷難以看清真正的自己？',
      '有孚威如的自我誠信要求不自我欺騙：你是選擇每天留一段安靜時間誠實感受那些被日常壓抑的真實情緒，還是繼續用忙碌填滿所有空隙避免面對內心？',
      '王假有家提醒最終要回到內心之家安頓，哪種外在角色的包袱一旦你長期無法卸下，就會讓你離真正的自己越來越遠，直到完全認不出內在的本來面貌？'
    ],
  },
};

// ============================================================================
// HEX 38 睽 (火澤睽) — Division, misunderstanding, differing stances, limited cooperation
// ============================================================================
const HEX38 = {
  hexagramId: 38,
  hexagramName: '睽',
  gua: '火澤睽',
  questions: {
    general: [
      '上火下澤的火炎上而澤潤下注定方向相反——你目前與某個對象或群體之間的分歧，是結構性的本質差異，還是只是溝通方式不同造成的誤解？',
      '先張之弧後說之弧描繪對立從劍拔弩張到重新認識的轉折：你是選擇先退一步給彼此一段冷卻期等待敵意消退，還是堅持在情緒高點就把話說清楚？',
      '喪馬勿逐提醒有些失去不必強行追回，哪個關係或機會一旦已經明確遠離超過了你設定的合理等待底線，就該把能量轉向前方而非回頭消耗自己？'
    ],
    career: [
      '見輿曳描繪團隊被不同方向拉扯前進困難——你目前所在的組織內部，各方的分歧是已經到了互相抵消動能的嚴重程度，還是仍處於可以協調的溫和階段？',
      '厥宗噬膚暗示在最意想不到的內部環節存在有限合作突破口：你是選擇先尋找一個雙方都能接受的小範圍合作切入點重建信任，還是繼續在全面共識的前提下推進？',
      '睽孤的孤立感若持續超過合理時間且看不到改善跡象，你到了第幾個月仍無法融入核心或被持續邊緣化時，就該認真評估轉換環境而非繼續在孤立中消耗？'
    ],
    love: [
      '見豕負塗提醒在衝突中你看到的只是對方被放大的缺點——在最近的一次爭執裡，你是否還能記起污泥之下那個最初吸引你的真實本質是什麼？',
      '先張之弧後說之弧揭示關係衝突的典型轉折：你是選擇在冷靜後主動放下弓箭成為先示好的一方，還是繼續等待對方先承認錯誤才願意重新對話？',
      '睽孤的疏離感若讓雙方都習慣了沒有彼此的生活，哪種持續出現的冷淡訊號達到多少次後，就代表這段關係已經名存實亡而非只是暫時的冷戰？'
    ],
    money: [
      '喪馬勿逐在財務上要求認賠出場保護剩餘資本——你目前是否有某項虧損部位正因為不甘心沉沒成本，而讓你持續投入更多資源試圖攤平？',
      '睽孤的獨立判斷在市場主流之外：你是選擇相信自己的扎實分析堅持逆向配置等待市場驗證，還是跟隨大眾資金流向以避免獨自判斷的壓力？',
      '其人天且劓警示過度冒進的財務行為可能導致不可逆傷害，你在使用槓桿或投入無法承受損失的資金時，本金虧損達到什麼比例就該觸發強制出場機制？'
    ],
    people: [
      '見惡人要求正視而非逃避讓你本能排斥的對象——你目前人際圈中那個最讓你想逃避的人，他背後所代表的問題是否正是你一直不願面對的自身盲點？',
      '先張之弧後說之弧用於人際衝突的轉折：你是選擇等雙方情緒都冷卻後主動創造一個非正式的對話契機，還是堅持對方必須先為自己的言行道歉？',
      '睽孤的孤立狀態若被你不自覺地用拒絕善意邀約來維持，你在第幾次收到善意卻下意識拒絕後，就該意識到這份孤獨可能已經變成了自己的選擇？'
    ],
    family: [
      '厥宗噬膚說明最親近的宗族衝突往往從表面小事引爆——你家中最近一次爭執的目前僵局，底下埋藏的長期未解癥結究竟是什麼？',
      '見豕負塗提醒家人正在氣頭上展現的只是被情緒放大的缺點：你是選擇給彼此一段冷靜期後再以不翻舊帳的態度重新溝通，還是趁這次把多年累積的不滿一次說清？',
      '先張之弧後說之弧的和解窗口若被錯過就可能無限延長，你們已經持續冷戰了多少天，再拖超過什麼期限就會讓雙方都習慣了這種疏遠而難以回頭？'
    ],
    study: [
      '見輿曳描繪學習被多方拉扯難以專注——你目前的注意力是被興趣與現實需求、廣度與深度、自學與體制之間的反覆搖擺消耗掉了多少？',
      '喪馬勿逐提醒發現不適合的學習方向要果斷放手：你是選擇繼續硬撐這個已經證明不適合你的學科不動，還是設定一個明確的期限到期後就果斷轉向？',
      '其人天且劓警示錯誤的學習方法可能讓錯誤觀念根深蒂固，哪個基礎科目如果繼續用你目前的錯誤方法硬學幾個月後，將變得極難修正？'
    ],
    health: [
      '睽孤在健康層面代表身體與心靈之間的分離感——你最近是否感覺身體在運作但心不在現場，或是心理充滿動力但身體已經發出明確的疲勞警訊？',
      '上火下澤描繪頭腦過熱而下半身虛寒的失衡：你是選擇先從規律運動讓氣血下行開始調整，還是先減少夜間思慮讓頭腦降溫作為起點？',
      '見惡人象徵壓力源需要正確辨識而非歸咎於表面對象，哪個你一直認為是外在壓力來源的人或事，其實根源是你自己不願放下的完美主義或過度責任感正悄悄累積成什麼程度的內在耗損？'
    ],
    decision: [
      '先張之弧後說之弧提醒在決策初期情緒張力最高時不宜倉促下決定——你面前這個決策是否正因為焦慮而被你推向過早鎖定，還是你有給自己足夠的沉澱時間？',
      '喪馬勿逐要求以沉沒成本作為決策紀律：你是選擇繼續走目前已投入大量資源但前景不明的路，還是誠實承認前期投入不該綁架未來方向而果斷轉向？',
      '睽孤的孤立判斷若長期與眾人的意見對立，你在第幾次獨立判斷被市場或事實驗證為錯誤之後，就該重新檢視自己的判斷基礎而非堅持逆勢而行？'
    ],
    business: [
      '厥宗噬膚暗示在既有核心客戶中往往存在小而具體的突破口——你目前的既有市場中，是否有一個近在咫尺但尚未被滿足的客戶需求？',
      '喪馬勿逐要求對已明顯衰退的產品線果斷取捨：你是選擇繼續投入資源挽救這個趨勢不可逆的品項，還是把同樣的資源集中到更有前景的核心業務上？',
      '見輿曳的內部方向拉扯若長期不解決會讓優秀人才在內耗中流失，你到了第幾個部門之間出現資源互相抵消卻仍未做明確策略選擇時，就該強制裁決？'
    ],
    legal: [
      '見惡人在法律事務中要求正視對造而非逃避對方的存在——你目前對訴訟或爭議對手的實力評估，是客觀冷靜的分析還是被情緒渲染的誇大或低估？',
      '其人天且劓警示某些法律結果會留下永久紀錄：你是選擇在律師建議下積極評估和解可能性以降低不可逆風險，還是堅持訴訟到底追求全贏？',
      '先張之弧後說之弧的和解窗口在法律程序中通常只在特定階段開啟，你在案件進行到哪個程序節點之前若仍未達成和解，就代表對話窗口已基本關閉？'
    ],
    spiritual: [
      '上火下澤的內在分裂讓你理性與感性互相矛盾——你最近是否感受到心中有一個聲音想往東、身體卻不自覺地往西，形成了一種持續的內在拉扯？',
      '先張之弧後說之弧用於自我整合：你是選擇面對那個讓你羞愧或憤怒的內在面向先理解它為何存在，還是繼續壓抑否定試圖把這個部分從自我中切割出去？',
      '見豕負塗提醒你最嫌棄自己的那個部分可能正是最需要接納的，哪種長期自我否定的模式已經到了如果不開始與之和解，就會演變為自我厭棄的程度？'
    ],
  },
};

// ============================================================================
// BUILD ENTRIES
// ============================================================================
function buildEntries(hex) {
  const entries = [];
  for (const category of CATEGORIES) {
    const trio = hex.questions[category];
    if (!trio || trio.length !== 3) {
      throw new Error(`Missing/invalid trio for hex ${hex.hexagramId} category ${category}`);
    }
    trio.forEach((question, idx) => {
      entries.push({
        id: `rf-${String(hex.hexagramId).padStart(3, '0')}-${category}-${idx + 1}`,
        hexagramId: hex.hexagramId,
        hexagramName: hex.hexagramName,
        category,
        categoryName: CATEGORY_NAMES[category],
        question,
        basis: [hex.hexagramName, hex.gua, CATEGORY_NAMES[category]],
        qualityLevel: 'refined',
        reviewed: false,
        reviewedBy: 'reflection-wB-refl-37-38',
        reviewedAt: '2026-07-13',
        needsHumanReview: true,
        version: '1.8.0-stage3-hex37-38',
      });
    });
  }
  return entries;
}

const newEntries37 = buildEntries(HEX37);
const newEntries38 = buildEntries(HEX38);
const allNewEntries = [...newEntries37, ...newEntries38];

console.log(`Generated ${newEntries37.length} entries for hex 37 + ${newEntries38.length} entries for hex 38 = ${allNewEntries.length} total.`);

// ============================================================================
// CHECK 1: Total count = 72
// ============================================================================
if (allNewEntries.length !== 72) {
  console.error(`COUNT ERROR: expected 72, got ${allNewEntries.length}`);
  process.exit(1);
}
console.log('CHECK 1 PASSED: 72 total entries.');

// ============================================================================
// CHECK 2: Length 38-105 and ends with ？
// ============================================================================
console.log('\n=== LENGTH & FORMAT CHECK ===');
let lengthFailures = 0;
for (const entry of allNewEntries) {
  const q = entry.question;
  const len = q.length;
  if (len < 38 || len > 105) {
    console.error(`  FAIL: ${entry.id} length=${len}`);
    lengthFailures++;
  }
  if (!q.endsWith('？')) {
    console.error(`  FAIL: ${entry.id} does not end with ？`);
    lengthFailures++;
  }
  // Q2 must have 還是
  if (entry.id.endsWith('-2') && !q.includes('還是')) {
    console.error(`  FAIL: ${entry.id} Q2 missing 還是`);
    lengthFailures++;
  }
}
if (lengthFailures > 0) {
  console.error(`\n${lengthFailures} length/format failures — ABORTING`);
  process.exit(1);
}
console.log(`  All ${allNewEntries.length} entries pass length (38-105), trailing ？, and Q2 還是 checks.`);

// ============================================================================
// CHECK 3: Question type markers — Q1=state, Q2=choice, Q3=risk/boundary
// ============================================================================
console.log('\n=== QUESTION TYPE MARKER CHECK ===');
const stateMarkers = ['狀態', '處於', '階段', '是否', '目前', '當前', '此刻', '還在', '還記得', '已'];
const riskMarkers = ['何時', '多少天', '多久', '幾個月', '哪個階段', '多少個', '第幾個', '第幾次', '界限', '邊界', '風險', '止損', '退出', '緩衝', '時機', '窗口', '何種', '多少次', '什麼深度', '什麼程度', '天內', '底線', '比例', '層次', '層面', '環節', '訊號', '信號', '工作日', '轉折點', '哪種', '哪條', '哪道', '哪個時間', '哪個程序', '什麼期限'];
let markerFailures = 0;
for (const entry of allNewEntries) {
  if (entry.id.endsWith('-1')) {
    if (!stateMarkers.some(m => entry.question.includes(m))) {
      console.error(`  FAIL: ${entry.id} Q1 missing state marker`);
      markerFailures++;
    }
  }
  if (entry.id.endsWith('-3')) {
    if (!riskMarkers.some(m => entry.question.includes(m))) {
      console.error(`  FAIL: ${entry.id} Q3 missing risk/boundary marker`);
      markerFailures++;
    }
  }
}
if (markerFailures > 0) {
  console.error(`\n${markerFailures} marker failures — ABORTING`);
  process.exit(1);
}
console.log(`  All Q1/Q3 markers verified.`);

// ============================================================================
// CHECK 4: NORMALIZED UNIQUENESS — The critical check
// ============================================================================
console.log('\n=== NORMALIZED UNIQUENESS CHECK ===');

// Imagery/core terms to strip (longest first)
const ALL_IMAGERY_37 = [
  '風自火出', '王假有家', '有孚威如', '閑有家', '富家大吉',
  '家人嗃嗃', '婦子嘻嘻', '無攸遂在中饋', '風火家人', '家人',
];
const ALL_IMAGERY_38 = [
  '上火下澤', '睽孤', '先張之弧後說之弧', '喪馬勿逐', '見輿曳',
  '厥宗噬膚', '見豕負塗', '見惡人', '其人天且劓', '火澤睽', '睽',
];
const ALL_IMAGERY = [...ALL_IMAGERY_37, ...ALL_IMAGERY_38].sort((a, b) => b.length - a.length);

const COMMON_WORDS = new Set([
  '的', '你', '我', '他', '她', '是', '在', '了', '有', '不', '這', '那', '著',
  '也', '都', '就', '會', '要', '能', '可以', '一個', '一種', '一些', '什麼',
  '目前', '當前', '此刻', '選擇', '狀態', '是否', '還是', '或者', '已經', '還是',
  '自己', '對方', '這個', '那個', '需要', '應該', '如果', '因為', '所以',
  '沒有', '可能', '覺得', '認為', '知道', '了解', '理解',
  '進行', '使用', '透過', '經過', '來自', '對於', '關於', '這樣', '那樣',
  '之間', '之中', '之後', '之前', '裡面', '外面', '時候', '什麼時候',
  '多少', '如何', '為什麼', '怎麼', '哪裡', '哪個', '怎樣', '做', '讓',
  '把', '被', '從', '對', '向', '到', '給', '和', '與', '或', '而', '但',
  '卻', '才', '便', '還', '又', '再', '更', '最', '很', '太', '非常',
  '比較', '相當', '特別', '完全', '根本', '確實', '也', '也許', '大概', '一定',
  '必須', '當然', '終於', '曾經', '正在', '將會',
  '繼續', '開始', '結束', '完成', '實現', '發生', '出現', '存在', '變化',
  '改變', '發展', '成長', '進步', '改善', '提升', '降低', '增加', '減少',
  '機會', '問題', '方式', '方法', '方向', '目標', '結果', '過程', '關係',
  '影響', '作用', '功能', '意義', '價值', '基礎', '條件', '情況', '環境',
  '資源', '能力', '經驗', '知識', '技能', '態度', '觀念', '想法', '感受',
  '情緒', '心理', '行為', '習慣', '模式', '結構', '系統', '機制', '節奏',
  '時機', '時間', '空間', '壓力', '風險', '挑戰', '困難', '限制', '障礙',
  '平衡', '穩定', '持續', '長期', '短期', '正面', '負面', '積極', '消極',
  '主動', '被動', '明顯', '清楚', '模糊', '確定', '不確定', '安全', '危險',
  '成功', '失敗', '得失', '決定', '判斷', '評估', '分析', '考慮',
  '思考', '反思', '檢視', '觀察', '注意', '重視', '忽略', '堅持', '放棄',
  '接受', '拒絕', '面對', '逃避', '追求', '避開', '投入', '退出', '進入',
  '離開', '保持', '調整', '適應', '突破', '建立', '破壞', '維護',
  '修復', '創造', '消滅', '擴大', '縮小', '深入', '快', '慢',
  '多', '少', '大', '小', '高', '低', '強', '弱', '深', '淺', '遠', '近',
  '新', '舊', '好', '壞', '對', '錯', '真', '假', '實', '虛', '內', '外',
  '上', '下', '前', '後', '左', '右', '整體', '局部', '全局', '細節',
  '核心', '邊緣', '中心', '周圍', '生命', '生活', '工作', '學習', '健康',
  '愛情', '金錢', '家庭', '朋友', '社交', '事業', '商業', '法律', '心靈',
  '精神', '身體', '心理', '靈魂', '內心', '外在', '內在',
  '現在', '還', '嘛', '呢', '嗎', '喔', '哦', '吶', '啊', '吧', '呀',
  '是否還', '究竟是', '而且', '因此', '但是', '然後', '所以',
]);

function normalize(str) {
  let s = str;
  // strip hex names
  s = s.split('家人').join('').split('睽').join('').split('風火').join('').split('火澤').join('');
  // strip imagery terms (longest first)
  for (const t of ALL_IMAGERY) s = s.split(t).join('');
  // strip category names
  for (const c of Object.values(CATEGORY_NAMES)) s = s.split(c).join('');
  // strip punctuation and whitespace
  s = s.replace(/[，。？！、：；「」『』（）…—\-—\s]/g, '');
  // strip common words
  const segments = [];
  let current = '';
  for (const ch of s) {
    current += ch;
    let matched = false;
    for (const cw of COMMON_WORDS) {
      if (current.endsWith(cw) && current.length >= cw.length) {
        const before = current.slice(0, -cw.length);
        if (before) segments.push(before);
        current = '';
        matched = true;
        break;
      }
    }
    if (matched) continue;
  }
  if (current) segments.push(current);
  return segments.join('');
}

function checkUniqueness(entries, hexLabel) {
  const normed = entries.map(e => ({ id: e.id, norm: normalize(e.question) }));
  const seen = new Map();
  normed.forEach(({ id, norm }) => {
    if (!seen.has(norm)) seen.set(norm, []);
    seen.get(norm).push(id);
  });
  let uniqueCount = 0;
  const dupGroups = [];
  for (const [norm, ids] of seen.entries()) {
    if (ids.length === 1) {
      uniqueCount++;
    } else {
      dupGroups.push(ids);
    }
  }
  return { total: entries.length, uniqueCount, dupGroups };
}

const uniq37 = checkUniqueness(newEntries37, 'Hex37');
const uniq38 = checkUniqueness(newEntries38, 'Hex38');
const uniqBoth = checkUniqueness(allNewEntries, 'Hex37+38');

console.log(`  Hex 37 (家人) normU: ${uniq37.uniqueCount}/${uniq37.total}`);
if (uniq37.dupGroups.length > 0) {
  console.log('  Hex 37 duplicate groups:');
  uniq37.dupGroups.forEach(g => console.log('    ' + JSON.stringify(g)));
}
console.log(`  Hex 38 (睽) normU: ${uniq38.uniqueCount}/${uniq38.total}`);
if (uniq38.dupGroups.length > 0) {
  console.log('  Hex 38 duplicate groups:');
  uniq38.dupGroups.forEach(g => console.log('    ' + JSON.stringify(g)));
}
console.log(`  Combined normU: ${uniqBoth.uniqueCount}/${uniqBoth.total}`);
if (uniqBoth.dupGroups.length > 0) {
  console.log('  Combined duplicate groups:');
  uniqBoth.dupGroups.forEach(g => console.log('    ' + JSON.stringify(g)));
}

const MIN_UNIQUE = 32;
let uniquenessFailed = false;
if (uniq37.uniqueCount < MIN_UNIQUE) {
  console.error(`  *** UNIQUENESS FAILED for hex37: ${uniq37.uniqueCount}/36 < ${MIN_UNIQUE}/36 ***`);
  uniquenessFailed = true;
}
if (uniq38.uniqueCount < MIN_UNIQUE) {
  console.error(`  *** UNIQUENESS FAILED for hex38: ${uniq38.uniqueCount}/36 < ${MIN_UNIQUE}/36 ***`);
  uniquenessFailed = true;
}
if (uniqBoth.uniqueCount < 68) {
  console.error(`  *** CROSS-HEX UNIQUENESS FAILED: ${uniqBoth.uniqueCount}/72 < 68/72 ***`);
  uniquenessFailed = true;
}

if (uniquenessFailed) {
  console.error('\nNOT WRITING FILE — fix questions and re-run.');
  process.exit(1);
}
console.log('  Normalized uniqueness PASSED for all checks.');

// ============================================================================
// LOAD EXISTING DATA & MERGE
// ============================================================================
console.log('\n=== LOADING EXISTING DATA ===');
const rawCode = fs.readFileSync(DATA_FILE, 'utf8');
const sandbox = { window: {} };
vm.createContext(sandbox);
vm.runInContext(rawCode, sandbox);
const existingData = sandbox.window.Zero1MatrixData.reflectionQuestions;

if (!Array.isArray(existingData)) {
  throw new Error('Failed to load existing reflectionQuestions array');
}

console.log(`  Loaded existing data: ${existingData.length} questions total.`);
const before37 = existingData.filter(e => e.hexagramId === 37).length;
const before38 = existingData.filter(e => e.hexagramId === 38).length;
console.log(`  Existing hex37=${before37}, hex38=${before38}`);

const filtered = existingData.filter(e => e.hexagramId !== 37 && e.hexagramId !== 38);
const merged = [...filtered, ...allNewEntries];

merged.sort((a, b) => a.hexagramId - b.hexagramId);

console.log(`  New total: ${merged.length} (removed ${before37 + before38}, added 72)`);

// ============================================================================
// WRITE FILE
// ============================================================================
const output =
  "window.Zero1MatrixData = window.Zero1MatrixData || {};\n" +
  "window.Zero1MatrixData.reflectionQuestions = " + JSON.stringify(merged) + ";\n";

fs.writeFileSync(DATA_FILE, output, 'utf8');
console.log(`\n=== WRITTEN ===`);
console.log(`  ${merged.length} total entries written to ${DATA_FILE}`);

// ============================================================================
// VERIFY with node --check
// ============================================================================
const { execFileSync } = require('child_process');
try {
  execFileSync(NODE_EXE, ['--check', DATA_FILE], { stdio: 'pipe' });
  console.log('  node --check PASSED.');
} catch (e) {
  console.error('  node --check FAILED');
  console.error(e.stderr ? e.stderr.toString() : '');
  process.exit(1);
}

// ============================================================================
// VERIFY reload
// ============================================================================
const verifyCode = fs.readFileSync(DATA_FILE, 'utf8');
const verifySandbox = { window: {} };
vm.createContext(verifySandbox);
vm.runInContext(verifyCode, verifySandbox);
const verifyData = verifySandbox.window.Zero1MatrixData.reflectionQuestions;
console.log(`  Verification reload: ${verifyData.length} total questions.`);
const v37 = verifyData.filter(e => e.hexagramId === 37);
const v38 = verifyData.filter(e => e.hexagramId === 38);
console.log(`  Verification hex37=${v37.length}, hex38=${v38.length}`);

if (v37.length !== 36 || v38.length !== 36) {
  throw new Error('Verification failed: expected 36 questions each for hex37 and hex38');
}

console.log('\n=== wB_refl_37_38 COMPLETE ===');
console.log(`  Hex 37 normU: ${uniq37.uniqueCount}/36`);
console.log(`  Hex 38 normU: ${uniq38.uniqueCount}/36`);
console.log(`  Combined normU: ${uniqBoth.uniqueCount}/72`);
