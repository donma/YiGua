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

// ===== HEX 53 漸 questions =====
const HEX53 = {
  hexagramId: 53,
  hexagramName: '漸',
  full: '風山漸',
  data: {}
};
HEX53.data.general = {
  imgs: ['山上有木', '鴻漸于干', '鴻漸于磐'],
  q1: '漸卦山上有木象徵循序成長，你目前的人生整體進程中，覺得自己是處在樹木剛在山上扎根尚需耐心澆灌的初期階段，還是已經看到樹冠開始成形但離成材還有顯著距離的中途階段？',
  q2: '面對鴻漸于干般剛抵達水岸邊緣的新起點，你傾向先站穩腳跟把眼前的基礎打紮實再考慮下一步，還是趁著初抵新環境的新鮮感與動能立刻往更深的水域探索更大的可能性？',
  q3: '在鴻漸于磐般從岸邊推進到穩固磐石的過程中，哪個具體的生活信號一旦出現，代表循序漸進的耐心已從美德變成拖延，你正在用慢慢來的說詞合理化自己對關鍵躍進的逃避？',
};
HEX53.data.career = {
  imgs: ['鴻漸于干', '鴻漸于陸', '鴻漸于陵'],
  q1: '鴻漸于干顯示你的職涯正處於剛抵達某個新領域水岸的初階位置，你覺得目前是還在摸索這個領域的基本規則與人脈還沒站穩，還是已經熟悉了岸邊環境但還不敢往陸地深處移動？',
  q2: '當職涯從鴻漸于陸的平地階段面臨是否要往鴻漸于陵的高處攀登時，你會選擇留在目前已經適應的平地區域深耕專業成為該領域的穩定專家，還是承擔攀登的風險追求更高的視野與影響力？',
  q3: '在鴻漸于陵般向職業高峰逐步攀升的過程中，哪個具體的市場或個人訊號會提醒你攀登的速度已經超過了能力的積累，繼續加速不是邁向高峰而是正在透支根基走向遲早會發生的跌落？',
};
HEX53.data.love = {
  imgs: ['鴻漸于磐', '鴻漸于木', '鴻漸于陵'],
  q1: '鴻漸于磐暗示你們的感情已從最初的淺灘推進到較穩固的磐石階段，你覺得這段關係目前是磐石穩固但缺少樹木提供的遮蔽與溫暖，還是磐石本身也還沒完全穩固偶爾仍有鬆動的感覺？',
  q2: '當關係從鴻漸于木的相依階段要決定是否往鴻漸于陵的高處共同成長時，你會選擇先確保兩人在樹木階段的相互滋養足夠深厚再談更高的共同目標，還是相信往高處攀登的過程本身就會讓關係更緊密？',
  q3: '在鴻漸于陵的感情高度發展中，哪個具體的互動模式一旦出現，代表追求關係成長已變成對彼此的過度要求，你們正在用成長的名義讓感情從相互扶持變成相互考核與比較？',
};
HEX53.data.money = {
  imgs: ['鴻漸于干', '鴻漸于陸', '鴻漸于逵'],
  q1: '鴻漸于干象徵你的財務狀況處於剛接觸新收入來源的水岸邊緣，你覺得目前是新收入才剛起步還不穩定連基本替代原有收入都還做不到，還是已經能看到這條新路徑的潛力只是需要時間讓它從岸邊走向陸地？',
  q2: '當財務從鴻漸于陸的穩定平原階段面臨是否要追求鴻漸于逵般的高速通道時，你會選擇保持目前穩定可預期的收入結構不冒不必要的風險，還是願意拿出一部分資金嘗試更高回報但波動也更大的投資路徑？',
  q3: '在鴻漸于逵般追求財務快速通道的過程中，哪個具體的數字或行為變化會提醒你把加速當成了常態，從有紀律的漸進投資滑向了賭博式的心態，一次大波動就足以讓之前所有累積的成果歸零？',
};
HEX53.data.people = {
  imgs: ['鴻漸于磐', '鴻漸于木', '鴻漸于干'],
  q1: '鴻漸于磐表示你的人際圈正處於相對穩固的階段已有可靠的基石關係，你覺得這些磐石關係目前是能給你實質支持的穩定力量，還是穩固到有點僵化已經很久沒有新的視角或能量進入你的圈子？',
  q2: '當人際關係從鴻漸于木的彼此依靠階段需要評估是否該回到鴻漸于干般重新認識新的圈子時，你會選擇深耕現有的樹木關係讓少數幾段深度連結更加牢固，還是刻意走出去接觸完全不同背景的人為社交圈注入新的多樣性？',
  q3: '在鴻漸于干般重新拓展新人際圈的過程中，哪個具體的界線一旦被你為了融入而不斷退讓，會讓新關係從健康的拓展變成自我否定式的討好，你正在為了被新圈子接受而放棄原本讓你成為你的核心特質？',
};
HEX53.data.family = {
  imgs: ['鴻漸于陵', '鴻漸于逵', '鴻漸于磐'],
  q1: '鴻漸于陵象徵家庭正在往某種更高的目標或期望邁進，你覺得目前家庭對這個高度目標的追求是全家人共同認同的方向，還是某個成員的個人期望被包裝成全家的目標其他成員只是在被動配合？',
  q2: '當家庭生活節奏處於鴻漸于逵般的高速運轉每個人都有自己的忙碌軌道時，你會選擇刻意放慢全家的節奏創造共同停留的磐石時刻重新連結，還是相信只要大家都在各自的軌道上努力家庭就會自然往更好的方向前進？',
  q3: '在鴻漸于磐般刻意放慢回歸家庭穩固基礎的過程中，哪個具體的家庭互動訊號一旦持續缺席，代表放慢已經從健康的沉澱變成了停滯，家人之間的連結不是在加深而是在用安逸的表象掩蓋日益增加的疏離？',
};
HEX53.data.study = {
  imgs: ['山上有木', '鴻漸于干', '鴻漸于陸'],
  q1: '山上有木象徵學習如同樹木在山上循序成長，你覺得自己目前的學習狀態是處於剛播種還在等待發芽的基礎鋪墊期，還是樹苗已經破土但成長速度不如預期讓你開始懷疑這座山是否適合這棵樹？',
  q2: '當學習從鴻漸于干的初步接觸階段要決定是否往鴻漸于陸的系統化深入推進時，你會選擇先把當前這個入門領域學到足以實際應用的程度再拓展，還是同時涉獵多個相關領域用廣度來輔助你找到真正值得深耕的方向？',
  q3: '在鴻漸于陸般系統化學習的平穩推進中，哪個具體的學習訊號一旦出現，代表按部就班已經變成機械化地走流程，你正在用完成進度的假象掩蓋自己早已停止真正理解與思考的事實？',
};
HEX53.data.health = {
  imgs: ['鴻漸于干', '鴻漸于磐', '山上有木'],
  q1: '鴻漸于干暗示你的身體狀態剛從某個健康低谷回到水岸邊緣正在重新接觸正常的作息與活動，你覺得目前是恢復的初期身體還在適應正常節奏容易疲勞，還是已經度過最難的適應期正在穩定地往更好的狀態推進？',
  q2: '當身體恢復到鴻漸于磐的穩固階段後，你會選擇山上有木般持續用溫和漸進的方式讓身體像樹木一樣自然成長不給自己設定嚴格的恢復期限，還是給自己一個明確的體能目標用達成目標來確認身體已真正康復？',
  q3: '在山上有木般以自然節奏養護身體的過程中，哪個具體的身體訊號一旦被你反覆忽略，代表循序漸進已經變成對身體警訊的選擇性無視，你正在用慢慢調養的說詞合理化對明顯惡化趨勢的不作為？',
};
HEX53.data.decision = {
  imgs: ['鴻漸于陵', '鴻漸于逵', '鴻漸于磐'],
  q1: '鴻漸于陵表示你正面臨一個會顯著提升人生高度的重大決定，你覺得目前是已經看清了陵上的風景並準備好承受攀登的代價，還是被陵的高度吸引但對攀登過程中需要放棄的東西還沒有真正想清楚？',
  q2: '當決定涉及鴻漸于逵般的高速路徑與鴻漸于磐般的穩健路徑之間的取捨時，你會選擇走那條雖然慢但每一步都踩在磐石上的穩健路徑，還是接受高速通道的不確定性相信速度本身能幫助你更快穿越風險區域？',
  q3: '在鴻漸于磐般選擇穩健決策路徑後，哪個具體的外部變化或時間節點一旦到來，代表堅持穩健已經從理性的風險控管變成了對改變的恐懼，你正在用謹慎的名義錯過那些本該抓住的關鍵機會窗口？',
};
HEX53.data.business = {
  imgs: ['山上有木', '鴻漸于陵', '鴻漸于逵'],
  q1: '山上有木提醒創業者企業成長如同山上植樹需要耐心與合適的土壤，你覺得自己的事業目前是土壤與氣候條件都已具備但樹苗成長就是比預期慢，還是土壤本身可能就有問題你一直在不適合的土地上試圖種植？',
  q2: '當企業從基礎成長階段面臨是否要往鴻漸于陵的規模化高度躍進時，你會選擇先確保現有業務模式的單位經濟效益完全穩固再談擴張，還是認為在競爭激烈的市場中速度本身就是壁壘寧可在不完美時就開始攀登？',
  q3: '在鴻漸于逵般追求企業快速增長通道的過程中，哪個具體的營運指標一旦惡化到某個程度，代表增長已從健康的加速變成了失控的暴衝，繼續踩油門不是在追趕市場而是在加速駛向懸崖？',
};
HEX53.data.legal = {
  imgs: ['鴻漸于干', '鴻漸于磐', '鴻漸于陵'],
  q1: '鴻漸于干顯示你的法律事務正處於初步接觸階段剛開始了解相關規範與程序，你覺得目前是資訊蒐集還不完整很多關鍵細節尚未明朗的摸索期，還是基本框架已經清楚但對於如何推進還沒有形成明確的策略？',
  q2: '當法律事務從鴻漸于磐的基礎階段需決定是否往鴻漸于陵的更高層級推進時，你會選擇盡可能透過協商和解解決問題不輕易走向消耗資源的對抗，還是認為有些原則問題必須往上推進即使代價更高也不能在基礎階段妥協？',
  q3: '在鴻漸于陵般將法律事務升級到更高層級的過程中，哪個具體的程序節點或成本門檻一旦跨過，代表升級已從必要的法律手段變成了意氣之爭，繼續往上打的成本已經遠遠超過任何可能的勝訴收益？',
};
HEX53.data.spiritual = {
  imgs: ['山上有木', '鴻漸于逵', '鴻漸于干'],
  q1: '山上有木象徵內在修行需要如樹木般循序漸進不可揠苗助長，你覺得自己目前的心靈成長是處於根系還在土壤中默默延伸的看不見的積累期，還是已經感受到內在有些新的覺知正在萌芽但還很脆弱需要保護？',
  q2: '當內在修行出現鴻漸于逵般的快速領悟通道時，你會選擇跟隨這股加速的能量深入探索把握靈感湧現的窗口期，還是鴻漸于干般刻意放慢回到最基礎的日常練習不被一時的快速體驗沖昏了對基本功的重視？',
  q3: '在鴻漸于干般回到修行最基礎的起點重新練習時，哪個具體的心念一旦反覆出現，代表回到基礎已從謙卑的重新學習變成了對進步的放棄，你正在用回歸初心的說詞合理化自己對修行瓶頸的長期停滯？',
};

// ===== HEX 54 歸妹 questions =====
const HEX54 = {
  hexagramId: 54,
  hexagramName: '歸妹',
  full: '雷澤歸妹',
  data: {}
};
HEX54.data.general = {
  imgs: ['澤上有雷', '帝乙歸妹', '歸妹愆期'],
  q1: '歸妹卦澤上有雷象徵情感與行動的交會激盪，你目前的人生整體狀態中，覺得自己是處在雷聲剛響但澤水尚未起波瀾的初期感應階段，還是雷已擊中水面正在經歷震盪後的漣漪擴散與重新沉澱？',
  q2: '面對帝乙歸妹般以謙遜姿態將重要事物託付給他人的生命安排，你傾向主動選擇自己要走的路即使那條路看起來不如被安排的那條尊貴，還是接受命運或環境為你安排的看似退讓實則另有深意的位置？',
  q3: '在歸妹愆期般察覺某個重要的人生進程已經延遲時，哪個具體的生活變化一旦出現，代表延遲已從合理的等待變成了永久的錯過，繼續在原地等待不是在尊重時機而是在放任生命的某個章節永遠空白？',
};
HEX54.data.career = {
  imgs: ['歸妹以娣', '眇能視', '歸妹以須'],
  q1: '歸妹以娣暗示你在職場中可能處於輔助或次要的角色位置，你覺得目前是以娣的身分在學習與累積遲早會有自己的舞台，還是已經意識到這個輔助角色可能不是過渡而是這個環境給你的長期定位？',
  q2: '當處於眇能視般只有一隻眼睛能看清局勢的資訊不對稱狀態時，你會選擇用已知的部分視野先做出當下最好的判斷並在行動中持續修正，還是歸妹以須般暫緩決定耐心等待直到獲得更完整的資訊再採取行動？',
  q3: '在歸妹以須般職涯被迫等待與延遲的階段，哪個具體的市場或組織變化一旦發生，代表等待已從策略性的耐心變成了被動的停滯，你繼續留在原地不是在醞釀機會而是在消耗自己僅存的職場競爭力？',
};
HEX54.data.love = {
  imgs: ['歸妹愆期', '女承筐無實', '帝乙歸妹'],
  q1: '歸妹愆期暗示你的感情進程可能出現了延遲或錯位，你覺得這段延遲是因為雙方還沒有準備好需要更多時間各自成長，還是其中一方一直在用等待當藉口而根本沒有真正打算推進這段關係？',
  q2: '當關係出現女承筐無實般表面上有形式的承諾卻沒有實質內容的空洞狀態時，你會選擇坦誠地指出筐中無實的事實要求關係回到有實質互動的基礎上，還是帝乙歸妹般以謙讓的態度繼續維持表面的和諧期待對方自己察覺並改變？',
  q3: '在帝乙歸妹般以退讓與謙遜姿態經營感情的過程中，哪個具體的互動模式一旦成為常態，代表退讓已從愛的智慧變成了自我消失，你正在用配合對方的名義逐步放棄自己在關係中的基本話語權與存在感？',
};
HEX54.data.money = {
  imgs: ['歸妹以須', '歸妹愆期', '眇能視'],
  q1: '歸妹以須顯示你的財務計畫或收入進程正處於被迫等待的延遲狀態，你覺得這是一時的市場或環境因素導致的短期延宕只要撐過去就能回到正軌，還是核心的財務結構本身有問題延遲只是讓問題暴露得更明顯？',
  q2: '在眇能視般只能看到部分財務資訊無法掌握全貌的情況下，你會選擇依據現有的不完整資訊先做出保守的財務決策確保不犯大錯，還是歸妹愆期般寧可錯過眼前的機會也要等到資訊足夠透明之後再出手？',
  q3: '在歸妹愆期般財務目標不斷延後實現的過程中，哪個具體的財務數字或生活變化會提醒你延遲的根源不是外在環境而是你自己的消費或投資習慣，繼續歸咎於外部因素只是在延長自欺的時間？',
};
HEX54.data.people = {
  imgs: ['帝乙歸妹', '歸妹以娣', '女承筐無實'],
  q1: '帝乙歸妹暗示你在一段合作或人際關係中可能處於以退讓換取和諧的位置，你覺得這種退讓是基於對大局的清楚判斷知道退一步可以換來更重要的東西，還是出於習慣性地避免衝突已經不太確定自己真正想要的是什麼？',
  q2: '當合作關係呈現歸妹以娣般你總是居於次要配合角色時，你會選擇接受目前的輔助定位並把這個位置做到無可取代等待被看見的機會，還是女承筐無實般意識到這段關係的形式大於實質主動重新談判雙方角色的分配？',
  q3: '在女承筐無實般察覺某段合作關係只剩下形式而沒有實質內容後，哪個具體的互動訊號一旦出現，代表你對這段關係的留戀已經從務實的評估變成了純粹的情感依賴，繼續維持不是在合作而是在消耗自己？',
};
HEX54.data.family = {
  imgs: ['眇能視', '歸妹以須', '歸妹愆期'],
  q1: '眇能視暗示家庭中的某個重要問題你目前只能看到一部分真相還有盲區未被照亮，你覺得自己已經察覺到問題的核心只是有些細節還需要確認，還是直覺告訴你這件事的嚴重性遠超過你目前所看到的表象？',
  q2: '當家庭面臨歸妹以須般的被迫等待如某個成員的關鍵轉變遲遲不發生時，你會選擇在等待的同時積極準備各種可能的應對方案不讓自己只是被動地耗著，還是歸妹愆期般接受延遲本身就是家庭需要經歷的過程不強行加速？',
  q3: '在歸妹愆期般家庭重要進程不斷延後的過程中，哪個具體的家庭互動模式一旦固化，代表全家已經從等待變成了逃避，大家用等待時機成熟當作集體藉口來避免面對那個沒有人願意先開口的真正問題？',
};
HEX54.data.study = {
  imgs: ['澤上有雷', '歸妹以娣', '歸妹以須'],
  q1: '澤上有雷象徵學習中的靈感與行動正在交會激盪，你覺得自己目前是雷聲已響但還沒有轉化為實際學習行動的靈感充沛期，還是已經進入將靈感落地執行的階段但執行過程中遇到了比預期更多的阻力？',
  q2: '當學習過程中需要歸妹以娣般以輔助者或跟隨者的姿態向他人請教時，你會選擇放下自尊虛心跟隨比自己更專業的人從基礎重新學起，還是歸妹以須般認為自己可以透過自學與等待找到不需要依賴他人的學習路徑？',
  q3: '在歸妹以須般學習進度被迫延遲的階段，哪個具體的時間節點一旦錯過，代表暫時的休息已從大腦必需的消化期變成了永久性的放棄，之前累積的知識基礎也會因為荒廢太久而需要幾乎從頭來過？',
};
HEX54.data.health = {
  imgs: ['女承筐無實', '眇能視', '澤上有雷'],
  q1: '女承筐無實暗示你的身體可能處於外表看起來正常但內在能量空虛的狀態，你覺得這種空虛是近期過度勞累導致的暫時性能量透支只要休息就能補回來，還是長期忽略身體訊號已經形成了一種慢性能量流失的慣性模式？',
  q2: '在眇能視般對身體狀況只有部分了解如某些檢查還沒做或症狀不明顯時，你會選擇依據現有的身體訊號主動調整生活作息不等完整報告就先採取行動，還是澤上有雷般等待更明確的訊號或檢查結果出來後再做有針對性的調整？',
  q3: '在澤上有雷般身心處於震盪與重整的過程中，哪個具體的身體或情緒訊號一旦被你反覆用忍耐來回應，代表震盪已從必經的調整期變成了持續性的傷害，你正在用適應不良狀態的方式讓身體永久性地接受一個低於健康水準的新常態？',
};
HEX54.data.decision = {
  imgs: ['歸妹愆期', '歸妹以須', '帝乙歸妹'],
  q1: '歸妹愆期表示某個你一直在等待做出的決定已經明顯延遲，你覺得延遲是因為關鍵資訊或條件尚未到位需要更多時間讓局勢明朗，還是你內心其實已經知道該怎麼做只是在用等待作為不行動的合理藉口？',
  q2: '當重大決策涉及帝乙歸妹般以退讓換取更大格局的選項時，你會選擇表面上的退一步來換取長遠的戰略優勢即使短期內看起來像是吃虧，還是歸妹以須般認為在局勢不明時什麼都不做保持現狀才是最安全的選擇？',
  q3: '在歸妹以須般將重大決定持續擱置的過程中，哪個具體的外部事件或時間節點一旦到來，代表等待已從審慎的觀望變成了決策癱瘓，你繼續不決定本身就是一種最糟的決定因為選項正在你猶豫時一個一個地自動失效？',
};
HEX54.data.business = {
  imgs: ['澤上有雷', '帝乙歸妹', '歸妹以娣'],
  q1: '澤上有雷象徵創業環境中機會與行動正在碰撞產生能量，你覺得自己的事業目前是處於雷聲頻傳但還沒有找到能讓澤水真正起浪的正確行動的探索階段，還是已經找到方向但雷電的能量時強時弱讓執行節奏難以穩定？',
  q2: '當企業需要帝乙歸妹般以謙遜或退讓的姿態與更大的平台或合作夥伴結盟時，你會選擇接受一個表面上看似屈居次要但實際上能借力使力的戰略位置，還是歸妹以娣般寧可保持獨立運作的小規模也不願在任何形式上失去主導權？',
  q3: '在歸妹以娣般以輔助者或次要角色參與更大的商業生態系時，哪個具體的營運指標或合作條款一旦被觸及，代表輔助角色已從策略性的借力變成了實質性的依賴，你正在用合作的名義逐步交出企業的核心自主權？',
};
HEX54.data.legal = {
  imgs: ['歸妹以須', '歸妹愆期', '帝乙歸妹'],
  q1: '歸妹以須顯示你的法律事務正處於被迫等待的延遲狀態如程序卡關或對方拖延，你覺得這種延遲是正常的程序節奏只要按照流程走完就會有結果，還是對方正在利用程序的延遲來消耗你的資源與耐心達到以拖待變的目的？',
  q2: '當法律糾紛中出現帝乙歸妹般以退讓換取和解的契機時，你會選擇務實評估繼續對抗的總成本是否已超過和解帶來的利益並認真考慮讓步，還是認為一旦退讓就會被對方視為軟弱寧可承擔更長的延遲也要堅持立場？',
  q3: '在歸妹愆期般法律程序不斷延長的過程中，哪個具體的程序節點或時效門檻一旦逼近，代表延遲已從程序性的等待變成了實質性的權益流失，再不採取更積極的法律手段某些關鍵權利將會因為時效而永久喪失？',
};
HEX54.data.spiritual = {
  imgs: ['澤上有雷', '女承筐無實', '帝乙歸妹'],
  q1: '澤上有雷象徵你內在的情感與行動能量正在交會激盪可能帶來重要的心靈突破，你覺得這股能量目前是讓你感到興奮與充滿可能性的創造性張力，還是讓你感到焦慮與不安因為雷聲太大反而擾亂了澤水原有的平靜？',
  q2: '當察覺女承筐無實般某些一直在練習的方法其實沒有帶來真正的內在轉化時，你會選擇放下空筐去尋找新修行路徑即使那意味承認過去投入未產出預期成果，還是帝乙歸妹般以謙遜態度繼續堅持相信量的累積終究會在某刻引發質的飛躍？',
  q3: '在帝乙歸妹般以退讓與謙卑的態度走在心靈成長的路上時，哪個具體的心念一旦反覆出現，代表謙卑已從真實的自我覺察變成了另一種形式的自我否定，你正在用修行人的謙遜包裝對自己價值的根本性懷疑？',
};

// ===== HEX 55 豐 questions =====
const HEX55 = {
  hexagramId: 55,
  hexagramName: '豐',
  full: '雷火豐',
  data: {}
};
HEX55.data.general = {
  imgs: ['雷電皆至', '日中見斗', '來章有慶譽'],
  q1: '豐卦雷電皆至象徵生命正處於能量與光芒同時到達頂峰的豐盛時刻，你覺得自己目前是真的處在內外能量皆充沛的豐盛階段，還是雷聲很大閃電很亮但實際上能轉化為持續成果的基礎並不穩固只是看起來很壯觀？',
  q2: '當生命中出現日中見斗般在最光明的時刻卻窺見了暗影的警訊時，你會選擇正視這個暗影暫停前進的腳步先弄清楚黑暗的來源再繼續，還是認為在豐盛的陽光下小小的陰影不值得停下腳步繼續保持現有的節奏與動能？',
  q3: '在來章有慶譽般豐盛的成果開始顯現並獲得外界認可時，哪個具體的心態轉變一旦發生，代表豐盛已從滋養你的能量變成了定義你的枷鎖，你正在為了維持外界眼中的豐盛形象而不敢做出任何可能讓光芒暫時黯淡的正確決定？',
};
HEX55.data.career = {
  imgs: ['遇其配主', '豐其蔀', '來章有慶譽'],
  q1: '遇其配主暗示你的職涯中可能出現了與你能力匹配的上司或合作夥伴，你覺得這個配主是真正能看見你的價值並願意給你舞台的貴人，還是表面上看起來匹配但實際上你們對職涯方向的根本看法存在著你還未察覺的重大分歧？',
  q2: '當職涯處於豐其蔀般外在成果看似豐盛但內部已有遮蔽物在阻擋光線時，你會選擇揭開遮蔽物誠實面對組織發展中的暗區即使那會暫時破壞表面的豐盛景象，還是先把能展現的成果端出來鞏固位置再回頭處理內部問題？',
  q3: '在來章有慶譽般職涯成果獲得廣泛認可的高峰時刻，哪個具體的訊號一旦被你忽略，代表高峰已從成就的頂點變成了下滑的起點，你正在享受掌聲的同時錯過了該趁著高點布局下一階段轉型的最佳時機？',
};
HEX55.data.love = {
  imgs: ['日中見斗', '日中見沬', '遇其配主'],
  q1: '日中見斗暗示在最明亮的感情階段中你可能窺見了某些陰影或潛在的問題，你覺得這些陰影是關係進入更深層次後必然會浮現的磨合議題可以透過溝通處理，還是這些陰影觸及了雙方價值觀的根本差異不是靠溝通就能解決的？',
  q2: '當關係中出現日中見沬般在光明中看到了微小的遮蔽物時，你會選擇把這些小問題一個一個提出來在它們變大之前就處理乾淨，還是遇其配主般相信只要雙方本質上是匹配的這些小遮蔽自然會在時間中被彼此的溫暖融化？',
  q3: '在遇其配主般確認了彼此是對的人之後，哪個具體的相處模式一旦成為習慣，代表確認已從彼此珍惜變成了彼此視為理所當然，你們正在用已經找到對的人為由停止經營讓關係在不知不覺中從豐盛走向枯竭？',
};
HEX55.data.money = {
  imgs: ['豐其屋蔀其家', '豐其蔀', '雷電皆至'],
  q1: '豐其屋蔀其家暗示你的財務外表看起來很豐盛房子很大但內部已被遮蔽物佔據，你覺得目前是資產總額看似可觀但負債或隱性成本正在悄悄侵蝕淨值，還是現金流充裕但資產配置中存在你選擇性忽略的高風險部位？',
  q2: '當財務中出現豐其蔀般需要揭開遮蔽物誠實檢視財務暗區時，你會選擇雷電皆至般用一次徹底的財務大掃除把所有隱藏的問題攤在陽光下重新整理，還是先處理最緊急的部分其餘的繼續保持現狀避免一次性面對太多壓力？',
  q3: '在雷電皆至般經歷一次重大的財務整頓或市場波動後，哪個具體的消費或投資行為一旦故態復萌，代表整頓的效果只是暫時的你在危機感消退後又回到了原來的模式，下一次的雷電來襲時你將不再有同樣的緩衝空間？',
};
HEX55.data.people = {
  imgs: ['遇其配主', '來章有慶譽', '豐其沛'],
  q1: '遇其配主表示你在人際圈中可能遇到了與你頻率相合的夥伴或盟友，你覺得這段新關係是真正建立在相互理解與共同價值上的深度連結，還是因為對方剛好在你需要盟友的時機出現讓你高估了彼此的匹配程度？',
  q2: '當人際成果進入來章有慶譽般被周圍認可與讚賞的階段時，你會選擇把這份榮耀分享給一路上支持你的人讓他們也感受到被看見的喜悅，還是豐其沛般把光環所帶來的資源與人脈進一步擴大用來鋪設更大的合作網絡？',
  q3: '在豐其沛般人際網絡快速擴張的過程中，哪個具體的互動品質一旦開始下降，代表擴張已從健康的拓展變成了表面的繁榮，你正在用更多的聯繫人數來掩蓋每一段關係都在變得比之前更淺薄的事實？',
};
HEX55.data.family = {
  imgs: ['豐其屋蔀其家', '日中見斗', '遇其配主'],
  q1: '豐其屋蔀其家暗示家庭在外人眼中可能物質豐盛但內部有遮蔽物影響了真正的溫暖與交流，你覺得這些遮蔽物是近期忙碌導致的暫時性疏離只要刻意調整就能恢復，還是長年累積的未解決議題已在豐盛外殼下形成了結構性的冷漠？',
  q2: '當家庭中出現日中見斗般在看似和諧的日常中察覺到某個暗影時，你會選擇主動開啟那扇被遮蔽的門把暗影攤在全家人面前一起面對，還是遇其配主般先與家中最理解你的那個人私下討論再決定是否要擴大到全家人？',
  q3: '在遇其配主般依賴家庭中某個最能理解你的成員來處理家庭問題的過程中，哪個具體的互動模式一旦固化，代表依賴已從分工合作變成了責任轉嫁，那個被你依賴的家人正在獨自承擔本該全家人共同分擔的情感勞動？',
};
HEX55.data.study = {
  imgs: ['雷電皆至', '日中見沬', '來章有慶譽'],
  q1: '雷電皆至象徵你的學習正處於靈感與行動同時爆發的高能量階段，你覺得這股能量是來自於對所學領域真正的熱情與好奇所以能持續燃燒，還是因為考試或期限的壓力所驅動一旦外部壓力消失這股能量也會迅速消退？',
  q2: '當學習中出現日中見沬般在理解看似透徹的領域中發現了微小的盲點時，你會選擇停下來把這個盲點徹底弄懂即使那會拖慢整體進度，還是來章有慶譽般先完成整體的學習目標拿到可見的成果之後再回頭補強這些細節？',
  q3: '在來章有慶譽般學習成果獲得認可如考試通過或專案完成後，哪個具體的學習習慣一旦被放棄，代表成就已從繼續前進的動力變成了停下腳步的理由，你正在用已經達標了的心態讓自己的知識在不知不覺中開始過時？',
};
HEX55.data.health = {
  imgs: ['日中見斗', '豐其沛', '雷電皆至'],
  q1: '日中見斗暗示在你自覺身體狀態最好的時候可能隱藏著尚未被察覺的問題，你覺得自己目前的健康是經過檢驗確認沒有暗影的真正良好狀態，還是因為很久沒有做過全面檢查所以用沒有症狀等於沒問題的邏輯在說服自己？',
  q2: '當身體處於豐其沛般能量充沛活動力旺盛的階段時，你會選擇善用這股能量建立更穩固的運動與飲食習慣為未來的健康打下基礎，還是雷電皆至般趁著有體力的時候盡情投入工作與生活等到身體開始發出抗議再來調整？',
  q3: '在雷電皆至般身體經歷一次較大的健康震盪後，哪個具體的生活習慣一旦在康復後又重新出現，代表你從這次震盪中學到的教訓是有期限的，身體給你的第二次警告通常不會像第一次那樣還給你足夠的反應時間？',
};
HEX55.data.decision = {
  imgs: ['豐其蔀', '日中見斗', '遇其配主'],
  q1: '豐其蔀表示你在做重大決定時某些關鍵資訊可能被遮蔽了你看到的只是部分真相，你覺得這些遮蔽是暫時的只要多花時間蒐集資訊就能撥雲見日，還是某些遮蔽是結構性的來自於資訊來源本身的不透明短期內不可能完全看清？',
  q2: '當決定過程中出現日中見斗般在最應該清晰的環節反而看到了模糊與矛盾時，你會選擇暫緩決定回到更基礎的事實層面重新驗證每一個假設，還是遇其配主般尋找一個你信任且有經驗的人來幫你釐清這些模糊點借助外部視角來突破盲點？',
  q3: '在遇其配主般依賴外部顧問或信任對象協助決策的過程中，哪個具體的訊號一旦出現，代表諮詢已從補充視角變成了責任外包，你正在把本該由自己承擔的決策責任悄悄轉移給那個你信任的人？',
};
HEX55.data.business = {
  imgs: ['雷電皆至', '豐其沛', '來章有慶譽'],
  q1: '雷電皆至象徵你的創業正處於市場機會與執行能量同時爆發的階段，你覺得這波能量是來自於產品與市場的真正契合所以有持續增長的底氣，還是因為資本熱潮或短期紅利所推動一旦潮水退去基本面可能無法支撐目前的估值？',
  q2: '當企業處於豐其沛般資源充沛規模快速擴大的階段時，你會選擇把多餘的資源用來加固核心業務的護城河確保繁榮可以持續，還是來章有慶譽般趁著聲勢正盛的時候用品牌與影響力開拓全新的業務線追求更大的市場版圖？',
  q3: '在來章有慶譽般企業聲譽與品牌達到高峰的時刻，哪個具體的客戶或市場反饋一旦被你忽略，代表對讚譽的享受已讓你對負面訊號失去敏感度，你正在用消費者還很滿意的假象掩蓋產品品質或服務體驗正在悄悄下滑的事實？',
};
HEX55.data.legal = {
  imgs: ['豐其屋蔀其家', '日中見斗', '雷電皆至'],
  q1: '豐其屋蔀其家暗示你的法律合約或權益結構表面完備但內部存在被你忽略的遮蔽性條款，你覺得這些潛在風險是合約中的常見灰色地帶不至於引發重大問題，還是某些條款在特定情境下可能被對方用來對你造成實質損害？',
  q2: '當日中見斗般在最應該透明的法律環節發現了模糊或矛盾時，你會選擇雷電皆至般立即啟動全面的法律體檢把所有潛在風險一次性清查乾淨，還是先針對已經發現的具體問題進行補救其餘的等有更多資源或時間再逐步處理？',
  q3: '在雷電皆至般經歷一次法律糾紛的震盪後，哪個具體的合約管理或風險審查習慣一旦在事件平息後又被鬆懈，代表你從這次教訓中學到的警惕是有保鮮期的，下一次的法律雷電來襲時你將因為同樣的疏忽而付出更沉重的代價？',
};
HEX55.data.spiritual = {
  imgs: ['雷電皆至', '日中見沬', '來章有慶譽'],
  q1: '雷電皆至象徵你的內在正經歷一次強大的覺醒能量同時照亮了意識中的許多角落，你覺得這股覺醒是來自於長期修行積累的自然突破具有持久的轉化力，還是因為某個特殊事件或體驗所觸發的短暫高峰體驗不一定能轉化為日常的穩定狀態？',
  q2: '當內在修行中出現日中見沬般在最明亮的覺知中發現了微細的執著或盲點時，你會選擇停下腳步專注在這些微細遮蔽上不讓它們在光明中繼續潛伏，還是來章有慶譽般先享受並整合這份覺醒帶來的正面成果之後再回頭處理那些微細的殘留？',
  q3: '在來章有慶譽般修行成果獲得內在的確認與平靜後，哪個具體的心念或行為模式一旦重新浮現，代表你對修行成果的執著本身已經變成了新的遮蔽物，你正在用我已經開悟了或我已經放下了的自我認定來阻止自己看到更深的盲區？',
};

// ===== HEX 56 旅 questions =====
const HEX56 = {
  hexagramId: 56,
  hexagramName: '旅',
  full: '火山旅',
  data: {}
};
HEX56.data.general = {
  imgs: ['山上有火', '旅即次', '旅焚其次'],
  q1: '旅卦山上有火象徵人生如旅途中燃燒的營火既帶來光明也暗示著暫時性，你覺得自己目前是剛抵達新的生命階段正在搭建第一個營地還在摸索周遭環境，還是已在某個階段駐留許久營火燒得正旺但開始懷疑這裡是否真是該長期停留的地方？',
  q2: '當你在人生的旅途中有機會旅即次般找到一個可以暫時安頓的落腳處時，你會選擇好好利用這個安頓期沉澱與整理自己為下一段旅程做準備，還是擔心安頓會變成停滯寧可保持移動的狀態也不要在任何地方停留太久？',
  q3: '在旅焚其次般察覺到你賴以安頓的基地正在被火焰吞噬時，哪個具體的訊號一旦被你忽視，代表你對安全的留戀已經超過了對危險的判斷力，繼續堅守那個正在燃燒的營地不是在守護而是在讓自己與火焰一起化為灰燼？',
};
HEX56.data.career = {
  imgs: ['旅瑣瑣', '旅于處', '射雉一矢亡'],
  q1: '旅瑣瑣暗示你的職涯可能陷入了瑣碎事務的泥沼每天都在忙卻感覺不到真正的進展，你覺得這些瑣碎是必經的累積階段每一個小任務都在為未來鋪路，還是已經意識到自己正在用忙碌的表象來逃避對職涯方向的根本性質疑？',
  q2: '當職涯出現旅于處般可以在某個位置暫時安頓下來的機會時，你會選擇接受這個暫時的停留點把它當成觀察與學習的據點不著急做下一個跳躍，還是射雉一矢亡般願意用一次果斷的嘗試去爭取更高的目標即使那意味著可能失去目前的安穩？',
  q3: '在射雉一矢亡般為了追求一個高價值目標而投入重要資源的過程中，哪個具體的市場或個人訊號會提醒你這支箭已經偏離了目標而你還在說服自己再飛一會兒就會中，繼續不回收不是在堅持而是在把剩餘的資源也一併浪費？',
};
HEX56.data.love = {
  imgs: ['旅即次', '旅焚其次', '旅于處'],
  q1: '旅即次暗示你的感情可能正處於一個暫時性的安頓階段像旅人找到了可以歇腳的客棧，你覺得這個階段是關係發展過程中必要的沉澱期雙方都在調整與適應，還是你們在用暫時的安頓來避免討論這段關係到底要走向哪裡的根本問題？',
  q2: '當感情中出現旅焚其次般關係基礎正在被某種危機或衝突燃燒時，你會選擇立即撤離燃燒的爭執點先確保兩人連結不受永久性傷害再回頭處理，還是旅于處般堅持留在原地試圖在火焰中解決問題不讓任何未處理的議題被迴避？',
  q3: '在旅于處般感情進入一個相對平穩的停留階段後，哪個具體的互動模式一旦從偶爾變成常態，代表安穩已從健康的沉澱變成了關係的停滯，你們正在用歲月靜好的表象掩蓋彼此早已停止對這段關係投入真正的熱情與成長？',
};
HEX56.data.money = {
  imgs: ['旅瑣瑣', '旅即次', '射雉一矢亡'],
  q1: '旅瑣瑣暗示你的財務狀況可能被大量的小額支出與瑣碎消費消耗得不知不覺，你覺得這些瑣碎支出是可控的生活雜支只要稍微注意就能改善，還是已經形成了一種你不太願意去細算的消費習慣因為你知道總額可能比你想像的嚴重得多？',
  q2: '當財務有機會旅即次般在一個相對穩定的收入基礎上暫時安頓下來時，你會選擇利用這個穩定期建立更嚴謹的儲蓄與投資紀律為未來的移動做準備，還是射雉一矢亡般拿出一部分資金去嘗試一個你一直想做但風險較高的投資機會？',
  q3: '在射雉一矢亡般用一筆重要資金去追求一個高回報目標的過程中，哪個具體的數字或市場變化一旦出現，代表這筆投資已從理性的風險承擔變成了不願認賠的情感綁架，你繼續持有不是在等待回報而是在逃避承認自己看錯的事實？',
};
HEX56.data.people = {
  imgs: ['旅于處', '旅焚其次', '旅即次'],
  q1: '旅于處表示你的人際關係正處於一個暫時的穩定狀態有固定的社交圈與互動模式，你覺得這個狀態是經過篩選後留下的真正有品質的關係所以不需要頻繁變動，還是穩定到有點封閉已經很久沒有新的觀點或不同背景的人進入你的生活？',
  q2: '當人際圈中出現旅焚其次般某段重要關係正在經歷危機或衝突而燃燒時，你會選擇先暫時拉開距離讓雙方有冷靜空間避免在情緒高點做出傷害性發言，還是旅即次般主動靠近那團火試圖在最短時間內把問題攤開解決不讓誤解有發酵的機會？',
  q3: '在旅即次般主動修復或重新建立一段關係的過程中，哪個具體的訊號一旦出現，代表你對關係修復的執著已經超過了對關係本質的判斷，你正在試圖重建一個其實早已不適合你的連結只是因為不甘心或不習慣而無法放手？',
};
HEX56.data.family = {
  imgs: ['旅瑣瑣', '鳥焚其巢', '旅即次'],
  q1: '旅瑣瑣暗示家庭生活被大量的日常瑣事佔據以至於家人之間真正的交流被擠壓到邊緣，你覺得這些瑣事是家庭運轉的必要部分只要刻意保留交流時間就能平衡，還是瑣事已經成為了家人之間避免深度交流的集體藉口大家都忙得很安全？',
  q2: '當家庭中出現鳥焚其巢般家的根本基礎受到威脅如重大變故或關係危機時，你會選擇旅即次般先把家人轉移到一個安全的情緒與物理空間再一起面對問題，還是堅持在原地處理認為一旦離開那個巢就等於承認了失敗再也回不去？',
  q3: '在旅即次般家庭經歷變故後在新的基礎上重新建立安頓的過程中，哪個具體的家庭儀式或互動一旦被你省略，代表重建已從必要的過渡變成了對過去創傷的逃避，你正在用一切都會好起來的樂觀來跳過必要的哀悼與療傷過程？',
};
HEX56.data.study = {
  imgs: ['山上有火', '旅即次', '旅于處'],
  q1: '山上有火象徵學習中靈感如火把照亮了山徑但你仍身處旅途中尚未抵達目的地，你覺得自己目前是火把剛點亮對前方路徑充滿好奇與探索慾望的啟程階段，還是火把已燒了一段時間你開始擔心在燃料耗盡前是否能夠走到想去的地方？',
  q2: '當學習中出現旅即次般找到了一個可以暫時停下來消化與整理知識的階段時，你會選擇利用這個停留點把之前學到的東西做一次系統性的整理與內化，還是旅于處般認為停留是必要的但不宜太久寧可保持學習的移動感持續接觸新的內容？',
  q3: '在旅于處般學習進入一個相對平穩的停留與鞏固階段後，哪個具體的學習訊號一旦出現，代表鞏固已從深度的內化變成了舒適的重複，你正在用複習的名義讓自己待在不需面對新挑戰的安全區裡？',
};
HEX56.data.health = {
  imgs: ['旅焚其次', '旅于處', '山上有火'],
  q1: '旅焚其次暗示你的身體可能正在經歷某種燃燒性的不適如發炎、過勞或慢性疼痛侵蝕著健康基礎，你覺得這把火是近期壓力或作息紊亂導致的暫時性狀況調整後就會熄滅，還是已燒了一段時間而你一直在用止痛或壓抑的方式假裝它不存在？',
  q2: '當身體在經歷旅于處般的暫時穩定階段症狀沒有惡化但也沒有真正好轉時，你會選擇山上有火般把這穩定當成警訊主動去尋找火的根源而不是滿足於暫時平靜，還是繼續維持現狀認為只要不惡化就是好消息不需在此階段做額外檢查或調整？',
  q3: '在山上有火般身體的警訊如火把般持續照亮某個健康問題時，哪個具體的身體訊號一旦被你用忍耐或忽視來回應超過某個時間長度，代表警訊已從提醒變成了最後通牒，身體下一次將不再用訊號而是用一場你無法忽視的崩潰來強迫你面對？',
};
HEX56.data.decision = {
  imgs: ['射雉一矢亡', '旅即次', '旅焚其次'],
  q1: '射雉一矢亡表示你正面臨需要投入重要資源去爭取高價值目標的決定手中箭只有一次機會，你覺得自己已對目標的距離與風向做了足夠評估這一箭值得射出，還是內心對這一箭能否命中並無把握只是在用孤注一擲來逃避更複雜的漸進方案？',
  q2: '當決定過程中出現旅即次般可以先暫緩不射在安全觀察點重新評估時，你會選擇把握暫停機會蒐集更多資訊提高命中率即使那可能讓目標移得更遠，還是旅焚其次般擔心觀察點本身也不安全與其在等待中被火燒到不如現在就把箭射出？',
  q3: '在旅焚其次般你用來安頓與評估的安全基礎正在被外部變化燃燒時，哪個具體的時間節點或條件一旦被觸及，代表你已經沒有繼續觀察的奢侈必須在基地完全燒毀之前做出決定，而那個時候你剩下的選項可能遠比現在更少也更差？',
};
HEX56.data.business = {
  imgs: ['山上有火', '旅于處', '射雉一矢亡'],
  q1: '山上有火象徵創業者在旅途中舉著火把探索市場機會光芒所及之處有限但足以照亮下一步，你覺得自己目前的火把是照亮了一條清晰的路徑只是需要時間與資源走到終點，還是火把的光線太弱你其實不太確定照亮的是機會還是自己的想像？',
  q2: '當企業處於旅于處般在某個市場定位上暫時站穩了腳步時，你會選擇利用穩定期深耕現有客戶與產品把暫時的落腳處變成持久根據地，還是射雉一矢亡般把累積的資源集中投入到一個你認為能讓企業躍升到更高層級的關鍵專案上？',
  q3: '在射雉一矢亡般將企業核心資源押注於關鍵突破點時，哪個具體的營運指標或市場訊號一旦出現惡化，代表這一箭已確定偏離而你還在用再堅持就會中的信念繼續燃燒資源，那時止損不是承認失敗而是在保住企業還能再射下一箭的本錢？',
};
HEX56.data.legal = {
  imgs: ['旅焚其次', '旅瑣瑣', '鳥焚其巢'],
  q1: '旅焚其次暗示你的法律基礎或合約安全正在受到某種威脅如同旅人的營地著了火，你覺得這把火是來自於對方的主動攻擊可以透過法律手段反制與撲滅，還是你自己的合約或程序中存在漏洞讓對方有機可乘火是從內部燒起來的？',
  q2: '當法律事務陷入旅瑣瑣般的程序拖延與瑣碎爭執時，你會選擇把精力集中在最核心的法律爭點上放棄只會消耗資源的邊緣性程序對抗，還是鳥焚其巢般意識到如果不在每個點上都守住對方就會像火燒鳥巢一樣逐步侵蝕你的全部法律防線？',
  q3: '在鳥焚其巢般法律防線全面受威脅的最壞情況下，哪個法律權利或資產一旦面臨被剝奪的即時危險，代表你必須從程序性對抗轉向生存性止損策略，繼續用法律手段追求是非對錯已不是重點重點是你能在火災中保住多少還能重建的基礎？',
};
HEX56.data.spiritual = {
  imgs: ['山上有火', '鳥焚其巢', '旅于處'],
  q1: '山上有火象徵內在修行如山中夜行手中火把只能照亮前方幾步路但那就是你此刻需要的全部，你目前滿足於這幾步清晰知道正走在正確道路上不需看到終點，還是對只能看見幾步的狀態感到焦慮渴望有更完整地圖來確認自己沒有走錯方向？',
  q2: '當內在修行中經歷鳥焚其巢般舊有信念系統或安全框架被徹底燒毀時，你會選擇旅于處般在廢墟旁先坐下來不急著重建讓自己完整經歷失去與哀悼，還是急著找尋新巢穴與信念體系填補被燒毀後的空洞害怕在無所依靠的狀態中停留太久？',
  q3: '在旅于處般心靈在經歷重大轉化後進入一個暫時的平靜與安頓期時，哪個具體的心念一旦反覆出現，代表安頓已從整合與沉澱變成了新的執著，你正在把暫時的平靜狀態當成永久避風港而不願意面對下一段旅程必然會帶來的新的不確定性？',
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
        version: '1.9.0-wD-refl-hex53-56',
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
  if (dupCount > 0) {
    return false;
  }
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
  const newH53 = buildQuestions(HEX53);
  const newH54 = buildQuestions(HEX54);
  const newH55 = buildQuestions(HEX55);
  const newH56 = buildQuestions(HEX56);

  const allNew = newH53.concat(newH54).concat(newH55).concat(newH56);
  console.log('Built ' + allNew.length + ' new questions (36 each hex 53,54,55,56).\n');

  let allPassed = true;

  console.log('--- LENGTH VALIDATION (38-105) ---');
  if (!validateLengths(newH53, 'HEX53')) allPassed = false;
  if (!validateLengths(newH54, 'HEX54')) allPassed = false;
  if (!validateLengths(newH55, 'HEX55')) allPassed = false;
  if (!validateLengths(newH56, 'HEX56')) allPassed = false;

  console.log('\n--- TERMINAL ？ VALIDATION ---');
  if (!validateEndsWithQuestionMark(newH53, 'HEX53')) allPassed = false;
  if (!validateEndsWithQuestionMark(newH54, 'HEX54')) allPassed = false;
  if (!validateEndsWithQuestionMark(newH55, 'HEX55')) allPassed = false;
  if (!validateEndsWithQuestionMark(newH56, 'HEX56')) allPassed = false;

  console.log('\n--- UNIQUENESS VALIDATION ---');
  if (!validateUniqueness(newH53, 'HEX53')) allPassed = false;
  if (!validateUniqueness(newH54, 'HEX54')) allPassed = false;
  if (!validateUniqueness(newH55, 'HEX55')) allPassed = false;
  if (!validateUniqueness(newH56, 'HEX56')) allPassed = false;
  if (!validateUniqueness(allNew, 'HEX53+54+55+56 combined')) allPassed = false;

  console.log('\n--- normU VALIDATION (>= 32/36) ---');
  if (!validateNormU(newH53, 'HEX53')) allPassed = false;
  if (!validateNormU(newH54, 'HEX54')) allPassed = false;
  if (!validateNormU(newH55, 'HEX55')) allPassed = false;
  if (!validateNormU(newH56, 'HEX56')) allPassed = false;

  console.log('\n--- IMAGERY USAGE VALIDATION ---');
  if (!validateImageryUsage(newH53, 'HEX53', '漸')) allPassed = false;
  if (!validateImageryUsage(newH54, 'HEX54', '歸妹')) allPassed = false;
  if (!validateImageryUsage(newH55, 'HEX55', '豐')) allPassed = false;
  if (!validateImageryUsage(newH56, 'HEX56', '旅')) allPassed = false;

  console.log('\n--- Q-STRUCTURE VALIDATION (Q1/Q2 還是, Q3 not) ---');
  if (!validateQStructure(newH53, 'HEX53')) allPassed = false;
  if (!validateQStructure(newH54, 'HEX54')) allPassed = false;
  if (!validateQStructure(newH55, 'HEX55')) allPassed = false;
  if (!validateQStructure(newH56, 'HEX56')) allPassed = false;

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

  const before53 = data.filter(function(d) { return d.hexagramId === 53; }).length;
  const before54 = data.filter(function(d) { return d.hexagramId === 54; }).length;
  const before55 = data.filter(function(d) { return d.hexagramId === 55; }).length;
  const before56 = data.filter(function(d) { return d.hexagramId === 56; }).length;
  console.log('Existing hex53=' + before53 + ', hex54=' + before54 + ', hex55=' + before55 + ', hex56=' + before56);

  const filtered = data.filter(function(d) {
    return d.hexagramId !== 53 && d.hexagramId !== 54 && d.hexagramId !== 55 && d.hexagramId !== 56;
  });
  const merged = filtered.concat(newH53).concat(newH54).concat(newH55).concat(newH56);

  merged.sort(function(a, b) { return a.hexagramId - b.hexagramId; });

  console.log('New total: ' + merged.length + ' (expected ' + (data.length - before53 - before54 - before55 - before56 + 144) + ')');

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
  for (const h of [53, 54, 55, 56]) {
    const vh = verifyData.filter(function(d) { return d.hexagramId === h; });
    console.log('Verification hex' + h + '=' + vh.length);
    if (vh.length !== 36) throw new Error('Verification failed: expected 36 questions for hex' + h);
  }

  const allVerified = verifyData.filter(function(d) { return [53,54,55,56].includes(d.hexagramId); });
  for (const q of allVerified) {
    if (q.qualityLevel !== 'refined') throw new Error(q.id + ': qualityLevel=' + q.qualityLevel);
    if (q.reviewed !== false) throw new Error(q.id + ': reviewed=' + q.reviewed);
    if (q.needsHumanReview !== true) throw new Error(q.id + ': needsHumanReview=' + q.needsHumanReview);
  }
  console.log('Quality field verification PASSED.');

  console.log('\nwD_refl_53_56.js generation COMPLETE - 144 questions written successfully.');
}

main();
