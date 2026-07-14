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

// ===== HEX 61 中孚 =====
const HEX61 = {
  hexagramId: 61, hexagramName: '中孚', full: '風澤中孚', data: {}
};
HEX61.data.general = {
  imgs: ['澤上有風', '鶴鳴在陰其子和之', '有孚攣如'],
  q1: '澤上有風象徵真誠如澤水被風拂動般自然感通，你目前整體人生是處於澤水已深但風尚未起的沉潛期，還是風起水波已生正在感受真誠付出引來的回應？',
  q2: '鶴鳴在陰其子和之提醒真誠呼喚終引來同頻回應，你傾向先確認鶴鳴發自內心再等和鳴，還是持續發聲在反覆中尋找共振者就算內容尚未純化？',
  q3: '有孚攣如般真誠已成連結核心時，哪個明確信號一旦出現代表你對誠信的堅守已從美德變成自我束縛，正在用守信之名強撐已不再雙向的關係持續消耗自己？',
};
HEX61.data.career = {
  imgs: ['虞吉', '得敵', '月幾望馬匹亡'],
  q1: '虞吉提醒職涯審慎評估是吉祥起點，你對職場環境的判斷是經過充分觀察後心中有數，還是雖知虞吉之道卻對組織暗流與自身定位仍有大量盲區僅憑直覺前進？',
  q2: '職場出現得敵般立場對立的競爭者時，你會以虞吉之審慎堅守原則用實力證明立場，還是月幾望馬匹亡般果斷放下不必要的人際包袱輕裝前行不被對立消耗？',
  q3: '月幾望馬匹亡般需在高峰前夕放下長期依賴的夥伴時，哪個職涯信號一旦被忽略代表放下已從策略取捨變成逃避衝突，你正用斷捨離之名放棄本該爭取的權益？',
};
HEX61.data.love = {
  imgs: ['有孚攣如', '鶴鳴在陰其子和之', '虞吉'],
  q1: '有孚攣如暗示真誠連結如無形繩索將兩人相繫，目前這條繩是雙方自願均衡握持彼此感到安心，還是其中一方握太緊另一方已被捆綁卻不敢明說？',
  q2: '鶴鳴在陰其子和之般一方發出真誠呼喚期待回應時，你會確認聲音真實而非依賴之後才開口，還是虞吉般先評估對方狀態與接收能力再決定表達時機？',
  q3: '虞吉般以審慎覺察經營感情時，哪個互動模式一旦成常態代表審慎已從愛之智慧變成情感退縮，你正用謹慎之名迴避那些需要勇氣才能開啟的真實對話？',
};
HEX61.data.money = {
  imgs: ['月幾望馬匹亡', '虞吉', '得敵'],
  q1: '月幾望馬匹亡暗示接近豐盈時需放下對某些依賴路徑的執著，你目前是仍在積累期尚未到取捨關頭，還是已到必須決定放下那匹陪你走長路的馬才能輕裝前進？',
  q2: '財務需虞吉般審慎觀察時，你會寧可延遲決策保住本金安全，還是得敵般認為競爭中過度審慎本身也是風險可能錯失短暫的機會窗口？',
  q3: '得敵般面對財務競爭壓力時，哪個投資行為一旦變形代表競爭心已從理性配置變成賭氣跟風，你正為了不輸他人而違背自己設下的財務紀律？',
};
HEX61.data.people = {
  imgs: ['鶴鳴在陰其子和之', '有孚攣如', '得敵'],
  q1: '鶴鳴在陰其子和之象徵真誠發聲終能找到共鳴同伴，你目前在社交圈發出的聲音是被聽見且理解的狀態，還是感覺鶴鳴落入空谷只有回音而非真正的和鳴對象？',
  q2: '人際出現有孚攣如般需以真誠建深度連結與得敵般需劃清界線時，你會以核心原則用真誠對所有人但對不值得者保持距離，還是先釐清敵友再用不同策略互動？',
  q3: '得敵般意識到某些人際已從合作轉為對立時，哪個訊號一旦被反覆合理化代表你對衝突的迴避已讓敵對關係暗中侵蝕你的能量而你正用和氣之名放任它？',
};
HEX61.data.family = {
  imgs: ['虞吉', '翰音登于天', '有孚攣如'],
  q1: '虞吉提醒家庭關係中審慎覺察是吉祥基礎，你對家庭氛圍與成員暗流的覺察是及時敏銳的，還是常等到衝突表面化後才意識到微小訊號早已出現？',
  q2: '翰音登于天般某成員聲量過度張揚凌駕全家時，你會用有孚攣如真誠連結把全家拉回平等對話，還是讓那登天之聲自行感受高處孤獨等其主動回歸？',
  q3: '有孚攣如般以真誠凝聚家庭時，哪個儀式或互動一旦長期被你以忙碌省略，代表對真誠凝聚的信念已從行動變成口號家人情感連結正在悄悄鬆脫？',
};
HEX61.data.study = {
  imgs: ['澤上有風', '虞吉', '得敵'],
  q1: '澤上有風象徵學習需內在靜深度與外在觸動配合，你目前是澤水夠深但缺那陣能激起思考波瀾的風，還是風一直有但澤水太淺每次只起表面漣漪？',
  q2: '虞吉般需審慎選擇學習方向時，你會花時間在前端評估確保方向正確再投入，還是得敵般認為學習帶競爭性先選定方向快速進入再在過程中調整？',
  q3: '得敵般面對學習競爭時，哪個學習行為一旦從輔助變主導代表競爭心已從激勵變扭曲，你正為了勝過他人而學習對真正成長無益的短期競技內容？',
};
HEX61.data.health = {
  imgs: ['翰音登于天', '虞吉', '澤上有風'],
  q1: '翰音登于天暗示身體訊號如飛鳥鳴叫高亢提醒某部位承受過大壓力，你覺得這些警訊是偶發性不適休息後即消退，還是已反覆出現而你一直在用壓抑假裝牠不存在？',
  q2: '虞吉般需審慎觀察健康狀態時，你會用澤上有風般溫和漸進調理讓身體自然恢復，還是認為明確檢查數據與治療方案比模糊自我感覺更讓人安心？',
  q3: '澤上有風般以自然節奏調養身心時，哪個身體訊號一旦持續被再觀察看看延後，代表自然調養已從對身體的尊重變成對問題的逃避讓可逆狀況走向不可逆？',
};
HEX61.data.decision = {
  imgs: ['得敵', '月幾望馬匹亡', '虞吉'],
  q1: '得敵顯示重大決策正面臨明顯對立面，你覺得這個敵是外在環境真實障礙需要正面迎戰，還是更多來自你內心對選項的恐懼把中性路徑變成了對抗？',
  q2: '月幾望馬匹亡般需在圓滿前夕放掉長期依賴的模式時，你會虞吉般審慎決定何時放手確保不衝動，還是相信月亮近圓滿時就是最佳放手時機？',
  q3: '虞吉般反覆權衡重大決策時，哪個時間節點一旦到來代表審慎已變成決策癱瘓，繼續收集資訊不是在提高品質而是在用分析麻痺逃避承擔後果的責任？',
};
HEX61.data.business = {
  imgs: ['澤上有風', '虞吉', '月幾望馬匹亡'],
  q1: '澤上有風象徵創業需內在真誠底蘊與市場風向配合，你的事業是澤水已深只缺傳遞價值的市場風，還是風很大但澤水太淺每次只帶表面關注無法轉化留存？',
  q2: '月幾望馬匹亡般規模化前夕需放下創業初期依賴的模式時，你會虞吉般審慎評估哪些馬還能陪走下一段，還是認為躍升期速度優先果斷放下拖累？',
  q3: '為企業下一階段放下長期夥伴或模式後，哪個營運指標一旦低迷超過合理過渡期，代表放下已從戰略瘦身變成傷筋動骨你切掉的也包括核心能力？',
};
HEX61.data.legal = {
  imgs: ['有孚攣如', '得敵', '虞吉'],
  q1: '有孚攣如暗示法律事務中誠信是將雙方連結的最強紐帶，你目前是持守誠信等待對方以誠回應，還是發現自己對合約承諾的理解存在模糊需先釐清底線？',
  q2: '法律中出現得敵般對方明確站在對立面時，你會虞吉般審慎評估每一步成本與勝率不讓情緒升級，還是認為對方已亮敵意任何審慎都將被解讀為軟弱？',
  q3: '虞吉般以審慎策略處理法律事務時，哪個程序節點一旦逼近代表審慎已變成劣勢，對方正利用你的審慎拖延而你某些法律權利正在等待中悄悄流失？',
};
HEX61.data.spiritual = {
  imgs: ['澤上有風', '鶴鳴在陰其子和之', '有孚攣如'],
  q1: '澤上有風象徵心湖被靈性之風拂動時產生感應，你目前修行是心湖已平靜能清晰感知每次風的觸動，還是湖面看似平靜但底下暗流洶湧風的訊息已失真變形？',
  q2: '鶴鳴在陰其子和之般內在真誠呼喚引來相應時，你會將感應內化為更深誠信不追逐特殊體驗，還是跟隨這份和鳴能量深入探索看它帶你到何種層次？',
  q3: '有孚攣如般以對真理的誠信為修行唯一紐帶時，哪個心念一旦滲入代表誠信已從對道的信任變為對成果的貪執，你正用堅守信仰之名逃避挑戰既有認知的新洞見？',
};

// ===== HEX 62 小過 =====
const HEX62 = {
  hexagramId: 62, hexagramName: '小過', full: '雷山小過', data: {}
};
HEX62.data.general = {
  imgs: ['山上有雷', '飛鳥以凶', '弗過防之'],
  q1: '小過卦山上有雷象徵小處過越如雷在山巔足以撼動日常平衡，你目前哪些小節出現過度傾向打亂了生活節奏，還是某些方面不是做太多而是做太少？',
  q2: '飛鳥以凶般微小但帶凶險徵兆的事件掠過時，你會弗過防之不過度反應但保持警覺視為微調訊號，還是認為飛鳥之凶就是行動信號即刻調整不給小問題變大？',
  q3: '弗過防之般對小過警訊採取不誇大不忽視時，哪個生活信號一旦被防範機制漏接代表警覺已從敏銳變麻木，下一隻飛過的凶鳥可能不再是警告而是撞擊？',
};
HEX62.data.career = {
  imgs: ['過其祖遇其妣', '不及其君遇其臣', '弗過防之'],
  q1: '過其祖遇其妣暗示職涯錯過預期機遇卻在下層遇到新可能，你正經歷錯過階段還看不清替代機遇，還是已看到意料之外的替代路徑正在評估是否值得投入？',
  q2: '不及其君遇其臣般未能達上位卻在當前位置遇值得跟隨之人時，你會弗過防之般不抗拒臣位把它當學習據點，還是積極在臣位做出超越本分的表現？',
  q3: '弗過防之般對職涯小過錯保持開放時，哪個績效訊號一旦持續出現代表寬容已從彈性變成妥協，你正用不過度反應之名放任關鍵職場行為的品質下滑？',
};
HEX62.data.love = {
  imgs: ['飛鳥以凶', '從或戕之', '密雲不雨'],
  q1: '飛鳥以凶暗示感情出現微小凶兆如飛鳥掠過轉瞬即逝，你覺得這是過度解讀小摩擦其實沒事，還是直覺告訴你這個微裂痕不處理將成為未來關係的斷裂點？',
  q2: '從或戕之般你的過度順從正在傷害自己時，你會密雲不雨先把不滿壓心底等適當時機溝通，還是認為傷害一旦開始就該勇敢說出來即使氣氛不完美？',
  q3: '密雲不雨般積壓情緒如濃雲未化作溝通雨水時，哪個互動模式一旦被沉默固化代表沉默已從審慎變成慢性毒藥那場遲遲不下的雨將是摧毀性的情緒暴雨？',
};
HEX62.data.money = {
  imgs: ['密雲不雨', '飛鳥以凶', '弗過防之'],
  q1: '密雲不雨暗示財務烏雲密布卻遲遲未有實際降雨，你覺得雲層只是短期波動很快就散，還是內心知道有筆潛在支出正在醞釀而你用雲還沒下雨合理化拖延？',
  q2: '飛鳥以凶般小額虧損如驚鳥飛過時，你會弗過防之視為一次性小事件不調整既有計畫，還是將此凶鳥當成財務體系有漏洞的警示立即啟動全面檢查？',
  q3: '弗過防之般對財務小波動保持從容時，哪個數字或習慣一旦持續往錯誤方向移動代表從容已從穩健變成麻木，你選擇忽略的那隻飛鳥正變成一群猛禽？',
};
HEX62.data.people = {
  imgs: ['不及其君遇其臣', '過其祖遇其妣', '弗遇過之'],
  q1: '不及其君遇其臣暗示錯過高位者連結卻在次層遇到意外契合之人，你覺得這是命運幫你過濾不合適的關係，還是你因猶豫自卑沒去爭取本該屬於你的君級關係？',
  q2: '弗遇過之般在該相遇的時刻因小過錯擦身而過時，你會主動回頭修補那個錯過不讓小過成永久遺憾，還是接受小過卦提醒有些錯過本身就是一種保護？',
  q3: '過其祖遇其妣般接受錯過後的替代關係時，哪個互動訊號一旦出現代表接受已從豁達轉念變成對遺憾的否認，你正用遇其妣也很好的說詞掩蓋從未放下的事實？',
};
HEX62.data.family = {
  imgs: ['從或戕之', '飛鳥以凶', '密雲不雨'],
  q1: '從或戕之暗示家庭中過度順從正在對某成員造成隱性傷害，你覺得目前的順從是基於愛的互相退讓，還是已有成員長期犧牲需求維持和諧而這犧牲正被全家視為當然？',
  q2: '飛鳥以凶般孩子或長輩的異常行為如驚鳥提醒家庭小過錯正在發酵時，你會密雲不雨先觀察沉澱不立即反應，還是認為對家人警訊永遠值得過度重視？',
  q3: '密雲不雨般家中未說出口的話如烏雲越積越厚時，哪個互動儀式一旦被全家默契迴避代表那場該下的雨已從溝通變清算，潰堤時將是衝垮家庭結構的山洪？',
};
HEX62.data.study = {
  imgs: ['山上有雷', '弗過防之', '過其祖遇其妣'],
  q1: '山上有雷象徵對小處過度在意如雷在山頂雖不大卻打亂專注，你正花太多時間完美打磨細節拖慢進度，還是因太急看成果而忽略那些決定成敗的微小基礎？',
  q2: '弗過防之般需決定對某個小錯誤的態度時，你會不糾結繼續推進讓後續自然修正，還是認為每個小錯誤都可能是理解體系裂縫放過它會讓後續整層崩塌？',
  q3: '過其祖遇其妣般學習偏離原定目標卻意外發現新領域時，哪個訊號一旦出現代表偏離已從有益探索變方向迷失，你正用發現新興趣之名逃避真正困難的瓶頸？',
};
HEX62.data.health = {
  imgs: ['弗遇過之', '從或戕之', '山上有雷'],
  q1: '弗遇過之暗示身體與本該相遇的療癒契機擦身而過，你覺得只是時間巧合隨時可重新約定，還是內心知道自己在刻意迴避面對某個可能的健康真相？',
  q2: '從或戕之般某生活習慣正在悄悄傷害你而你仍順從時，你會山上有雷般以一次果決行動打破習慣，還是從微小減量漸進調整擔心過激改變導致反彈？',
  q3: '山上有雷般以較強力手段打破不健康模式時，哪個身體訊號一旦出現代表力度已從果決變成粗暴，你正用自律之名對身體施加過度壓力而這壓力本身也是戕之？',
};
HEX62.data.decision = {
  imgs: ['密雲不雨', '飛鳥以凶', '弗過防之'],
  q1: '密雲不雨表示重大決定烏雲密布卻遲遲未見關鍵資訊落下，你覺得這些雲只是暫時的資訊不對稱，還是這片雲本身就是答案告訴你此刻不是做決定的時機？',
  q2: '飛鳥以凶般微小尖銳警訊劃過決策天際時，你會弗過防之不讓小訊號主導整體方向但納入風險備註，還是認為任何凶兆都不該輕忽即使只是飛鳥掠過也暫停決策？',
  q3: '弗過防之般對決策小波瀾採取開放態度時，哪個時間節點一旦觸及代表開放已從理性風險承受變成隨波逐流，不做決定不是在等最佳時機而是讓選項接連過期？',
};
HEX62.data.business = {
  imgs: ['山上有雷', '過其祖遇其妣', '密雲不雨'],
  q1: '山上有雷象徵創業中的小過度如資源分配或節奏偏差，你的事業目前哪個小環節出現過度傾向是行銷燒太快還是產品打磨太久錯過了市場窗口？',
  q2: '過其祖遇其妣般錯過頭部機會卻在次級市場發現切入點時，你會密雲不雨先沉下心驗證再投入資源，還是認為錯過一個就該立即抓下一個不讓機會再溜走？',
  q3: '密雲不雨般市場不確定性烏雲密布時，哪個營運數據一旦連三週期下滑代表觀望已從審慎變逃避，那場遲不下來的雨不是市場變化而是你不敢做的關鍵決策？',
};
HEX62.data.legal = {
  imgs: ['從或戕之', '不及其君遇其臣', '飛鳥以凶'],
  q1: '從或戕之暗示法律中過度退讓正在傷害自身權益，你覺得退讓是基於大局精算保住核心利益，還是已退到忘記初衷而對方正利用你的順從蠶食底線？',
  q2: '不及其君遇其臣般未能達理想判決但在次級層面取得部分進展時，你會接受階段性成果為基礎繼續推進，還是認為任何妥協都可能成為日後不利先例必須堅持？',
  q3: '飛鳥以凶般法律中出現微小但可能改變全局的關鍵證據時，哪個時效節點一旦錯過代表你對凶鳥的輕視已成致命疏忽那隻放過的飛鳥將成對方最強武器？',
};
HEX62.data.spiritual = {
  imgs: ['山上有雷', '密雲不雨', '飛鳥以凶'],
  q1: '山上有雷象徵修行中對小過錯的覺察如雷在山巔迴盪，你對微小執著的覺察力是敏銳到能見雷光前的靜電預兆，還是常在雷劈下來後才驚覺又掉入相同模式？',
  q2: '密雲不雨般內在醞釀轉化但尚未具體顯現時，你會安住雲層不催促讓轉化以自己時間發生，還是把醞釀的不適感視為需主動突破的信號用密集修行來加速？',
  q3: '飛鳥以凶般修行中出現微小警示體驗時，哪個心念一旦讓你選擇視而不見代表對舒適區的留戀已超過對真相的追求，那隻凶鳥下次將直撞你最深的暗角？',
};

// ===== HEX 63 既濟 =====
const HEX63 = {
  hexagramId: 63, hexagramName: '既濟', full: '水火既濟', data: {}
};
HEX63.data.general = {
  imgs: ['水在火上', '濡其首', '繻有衣袽'],
  q1: '水在火上象徵事情已完成水火交融各得其位但這平衡最脆弱，你已完成的那些事是穩定維持在平衡點上，還是已察覺某些曾完成的事正悄悄往失序方向滑動？',
  q2: '濡其首般成功後鬆懈讓你犯奮鬥期絕不犯的錯誤時，你會重回如履薄冰的警覺用奮鬥期標準要求自己，還是繻有衣袽般建立新的維護機制接受節奏本該不同？',
  q3: '繻有衣袽般為已完成成果準備了防漏補丁後，哪個訊號一旦被視為正常代表防漏機制已從保護變依賴，你正用有備案的安心感取代持續的主動維護？',
};
HEX63.data.career = {
  imgs: ['曳其輪', '高宗伐鬼方', '婦喪其茀'],
  q1: '曳其輪提醒既濟後不該猛踩油門該拉住車輪控制速度，你對職涯節奏是在高峰後有意識放慢鞏固，還是因成功自信而比之前衝得更快完全沒有曳輪意識？',
  q2: '既濟後出現高宗伐鬼方般需耗心力處理遙遠挑戰時，你會婦喪其茀接受征伐中必然失去日常掩護專注打完硬仗，還是認為既濟後不該再有如此耗損寧可放棄遠方目標？',
  q3: '婦喪其茀般為守既濟成果失去某些日常保護後，哪個職場信號一旦出現代表失去已從必要代價變結構性脆弱，你正用犧牲換成果的舊思維經營本該維穩的事業？',
};
HEX63.data.love = {
  imgs: ['婦喪其茀', '繻有衣袽', '濡其首'],
  q1: '婦喪其茀暗示既濟後失去曾保護脆弱面的日常屏障變得赤裸，你覺得這種失去讓關係更真實沒東西遮掩，還是這赤裸正讓原本可緩衝的小摩擦變直接撞擊？',
  q2: '既濟後出現濡其首般因安逸做出傷害關係的輕率行為時，你會繻有衣袽般建立日常維護儀式不讓習慣侵蝕，還是認為真愛不該需要這麼多刻意維護能自然抵擋磨損？',
  q3: '繻有衣袽般為既濟感情準備各種維繫措施後，哪個互動模式一旦被這些措施取代代表維護已從愛的補充變成替代，正用定期約會形式填補早已停止流動的情感？',
};
HEX63.data.money = {
  imgs: ['曳其輪', '高宗伐鬼方', '東鄰殺牛'],
  q1: '曳其輪提醒既濟達標後應拉住車輪避免因成功信心過度投資，你對財務是達標後有意識進入保守模式，還是因覺得目標已達而鬆懈控管支出正悄悄侵蝕成果？',
  q2: '既濟後出現高宗伐鬼方般需投入資金處理長期財務工程時，你會東鄰殺牛般做一次重大犧牲奠定長期安全，還是曳其輪認為既濟後首要不犯錯把資金留在防守位置？',
  q3: '東鄰殺牛般為長遠財務安全做重大配置後，哪個指標一旦持續偏離預期代表配置已從遠見變誤判，你正用長期主義之名拒絕承認眼前的決策錯誤？',
};
HEX63.data.people = {
  imgs: ['濡其首', '曳其輪', '婦喪其茀'],
  q1: '濡其首暗示既濟後可能因自滿而開始在社交中犯輕率言行，你對人際分寸仍保持奮鬥期的謙遜警覺，還是已在某些關係中因覺得地位穩固而說話做事不再謹慎？',
  q2: '既濟後需曳其輪般刻意放慢社交節奏篩選真正值得的關係時，你會婦喪其茀放下靠日常掩護維持的泛泛之交，還是認為既濟後人脈是辛苦資產不該主動捨棄？',
  q3: '婦喪其茀般因精簡人際圈失去日常社交緩衝後，哪個訊號一旦出現代表精簡已從有意識篩選變自我封閉，你正用斷捨離之名失去雖不深但有需要時的基本支持網？',
};
HEX63.data.family = {
  imgs: ['繻有衣袽', '東鄰殺牛', '曳其輪'],
  q1: '繻有衣袽提醒家庭安穩階段需為日常運作準備補丁因穩定表象下總有細小裂縫，你是有意識進行預防性維護，還是覺得一切很好細小裂縫你其實已看到只是覺得不嚴重？',
  q2: '既濟後需東鄰殺牛般做較大犧牲確保長遠穩定時，你會曳其輪先拉全家前進速度確保每人有共識再行動，還是認為有些大事不能等全體共識該由能判斷者先決定？',
  q3: '曳其輪般為家庭長遠穩定刻意放慢節奏時，哪個訊號一旦出現代表放慢已從深度關照變成抗拒改變，全家人正用穩定之名一起拒絕那些本有益的成長契機？',
};
HEX63.data.study = {
  imgs: ['水在火上', '高宗伐鬼方', '曳其輪'],
  q1: '水在火上象徵已把知識之火與理解之水調和完成但最易被遺忘蒸發，你對已學知識的保溫鞏固做得夠紮實，還是很多曾經精通的內容正在悄悄從記憶中流失？',
  q2: '既濟後需高宗伐鬼方般投入長時間攻克殘留難點時，你會曳其輪放慢新知攝取先把遺留問題徹底解決，還是認為既濟後時間該學新東西那個舊難點可能本不重要？',
  q3: '曳其輪般為鞏固既濟成果放慢新知攝取時，哪個訊號一旦出現代表鞏固已從必要內化變停滯藉口，你正用複習之名待在不需面對新挑戰的安全區裡讓知識加速折舊？',
};
HEX63.data.health = {
  imgs: ['濡其首', '繻有衣袽', '水在火上'],
  q1: '濡其首暗示既濟後覺得健康目標已達成而開始放縱把頭浸入不良習慣，你達標後仍保持自律，還是已察覺某些在調理期間嚴格禁止的行為正悄悄回到日常生活中？',
  q2: '既濟後需繻有衣袽般建立日常健康維護防復胖復發時，你會水在火上般用溫和可持續平衡維持不陷入極端循環，還是認為須保持警戒因一旦放鬆身體就回不健康模式？',
  q3: '水在火上般以水火相濟維持既濟後健康時，哪個訊號一旦被你用已達標合理化代表平衡已從維持變緩慢退轉，你正用保持不錯的自我感覺掩蓋逐月回來的體重數字？',
};
HEX63.data.decision = {
  imgs: ['高宗伐鬼方', '濡其首', '水在火上'],
  q1: '高宗伐鬼方表示既濟後仍有重大征戰不是一勞永逸，你面對的後既濟挑戰是真正需全力處理的殘留問題，還是因不習慣無目標的安穩而為自己製造新戰場填補空虛？',
  q2: '濡其首般因既濟後自信開始輕率判斷時，你會水在火上般回到基礎原則以謹慎冷卻過熱自信，還是認為既濟後該信任已建立的判斷力不需為小失誤退回戰兢模式？',
  q3: '水在火上般以既濟後平衡智慧做重大決策時，哪個信號一旦被忽略代表平衡已從成熟判斷變兩面討好，你正試圖做出讓所有人滿意的決定而這種決定從未存在過？',
};
HEX63.data.business = {
  imgs: ['水在火上', '曳其輪', '東鄰殺牛'],
  q1: '水在火上象徵企業已達既濟產品與市場如水火相濟但這平衡極易被顛覆，你企業是真正建立了護城河難被外力打破，還是目前穩定更多因市場還沒出現真正挑戰者？',
  q2: '既濟後需曳其輪般放慢擴張回頭鞏固已佔市場時，你會東鄰殺牛把擴張資源轉為重大品牌投資加深護城河，還是認為放慢就是退步寧可鞏固同時保持一定速度？',
  q3: '東鄰殺牛般為長期護城河做重大投入後，哪個指標一旦持續未見回報代表投入已從遠見布局變固執豪賭，你正往一條可能沒水的河道裡繼續挖深？',
};
HEX63.data.legal = {
  imgs: ['婦喪其茀', '繻有衣袽', '曳其輪'],
  q1: '婦喪其茀暗示既濟後失去某些日常法律保護暴露在之前未意識的風險中，你覺得失去的茀是本不該依賴的程序性保護，還是當初以為不重要的保護條款現在比想像關鍵？',
  q2: '既濟後需繻有衣袽般為已完成合約準備防漏補救時，你會曳其輪放慢逐條檢視每個潛在漏洞，還是認為既濟成果已經充分攻防不需為極低機率風險做過度準備？',
  q3: '曳其輪般逐一檢視既濟法律成果時，哪個條款一旦被你以過度謹慎不會錯為由跳過代表檢視已從盡職變形式化你正用檢查過的安心感掩蓋其實未真正理解內容？',
};
HEX63.data.spiritual = {
  imgs: ['水在火上', '濡其首', '曳其輪'],
  q1: '水在火上象徵修行已達既濟內在水火調和完成達平衡覺知，你覺得這平衡是長期實修後穩定成就不易被波動撼動，還是內心知道這既濟狀態其實相當脆弱？',
  q2: '濡其首般因自認有成就開始修行輕慢鬆懈時，你會曳其輪般刻意拉住自己回到最基礎功夫重新老實練習，還是認為既濟後的鬆弛也是修行一部分不需過度嚴格？',
  q3: '曳其輪般既濟後刻意放慢修行形式回到最簡單日常覺察時，哪個心念反覆出現代表回歸基礎已從真誠紮根變成放棄瓶頸，你正悄悄從修行者退為對修行有興趣的旁觀者？',
};

// ===== HEX 64 未濟 =====
const HEX64 = {
  hexagramId: 64, hexagramName: '未濟', full: '火水未濟', data: {}
};
HEX64.data.general = {
  imgs: ['火在水上', '濡其尾', '未濟征凶'],
  q1: '火在水上象徵事尚未完成火在水面燃燒卻無法煮沸水火各行其是，你那個未完成的目標是處於火剛點燃水剛升溫的初啟期，還是火已燒很久水卻未沸你開始懷疑鍋子本身有問題？',
  q2: '濡其尾般因急於過河在最後淺灘弄濕尾巴功虧一簣時，你會未濟征凶般接受此刻非渡河良機退回重新準備，還是認為已走到尾巴濕了不如咬牙走完即使狼狽也要完成？',
  q3: '未濟征凶般意識到強行推進本身就是最大凶險時，哪個信號一旦被再堅持一下合理化代表堅持已從毅力變固執，那個將完成的東西在你強推中已變質成原本不想要的結果？',
};
HEX64.data.career = {
  imgs: ['曳其輪', '君子之光', '未濟征凶'],
  q1: '曳其輪提醒未濟階段最忌猛踩油門該拉住車輪以免在接近目標時翻覆，你對職涯進程是在接近目標時有意識放慢確保踏穩，還是因目標在望反而更急躁想一口氣衝過？',
  q2: '未濟階段你已展現君子之光般能力被周圍看見時，你會繼續謙遜耕耘讓成果自然成熟，還是意識到被看見本身需謹慎處理因過早曝光可能引來干擾或過高期待？',
  q3: '未濟征凶般察覺急躁推進正製造錯誤時，哪個工作品質信號一旦下滑代表速度追求已從企圖心變盲目衝刺，繼續奔跑你不是接近目標而是加速撞上那面未見的牆？',
};
HEX64.data.love = {
  imgs: ['濡其首', '有孚于飲酒', '濡其尾'],
  q1: '濡其首暗示未濟階段因急於確認關係而把整顆頭浸入做出衝動承諾，你對這段尚未完成的關係保持清醒觀察不急於定義，還是因不確定性焦慮想趕快推到下階段？',
  q2: '有孚于飲酒般在不確定中仍能真誠相待從容共處時，你會享受未完成過渡階段相信真誠相處就是最好建設，還是擔心過渡太久動能消散寧可在尾巴濕前做決定性推進？',
  q3: '濡其尾般因急於讓感情渡過未濟之河而在最後關頭弄濕尾巴關係倒退時，你用來補救的互動模式是否已從修復關係變成對控制感的執著在用更多付出強行拉回？',
};
HEX64.data.money = {
  imgs: ['曳其輪', '濡其尾', '未濟征凶'],
  q1: '曳其輪提醒未濟階段最需拉住車輪避免接近目標時因樂觀做高風險決定，你財務在目標將近時比之前更謹慎，還是因目標數字在眼前而開始放鬆對風險的警覺？',
  q2: '濡其尾般即將達標時因急躁決定讓累積成果在最後關頭受損，你會接受此損失當昂貴教訓退回保守重新來過，還是認為損失只是暫時波動繼續堅持原策略？',
  q3: '未濟征凶般認知到未達成前強行操作是最大風險時，哪個投資行為一旦偏離紀律代表渴望已從動力變賭性，你正用最後一搏心態拿累積許久的成果去換不必要的風險？',
};
HEX64.data.people = {
  imgs: ['君子之光', '有孚于飲酒', '曳其輪'],
  q1: '君子之光暗示未濟階段你的真誠能力已被看見既是助力也是考驗，你是吸引了更多真誠夥伴願一起走完最後一段，還是引來了想在你未完成時就來收割關係的投機者？',
  q2: '有孚于飲酒般未完成狀態中仍能與志同道合者從容相交時，你會曳其輪般不快速推新關係入深度合作讓節奏自然，還是認為未濟時機寶貴遇到對的人就該加速進程？',
  q3: '曳其輪般放慢新人際推進以確保每段都穩固時，哪個信號一旦出現代表放慢已從審慎篩選變社交退縮，你正用慢慢來之名迴避需走出舒適區才能建立的關鍵人脈？',
};
HEX64.data.family = {
  imgs: ['濡其尾', '濡其首', '有孚于飲酒'],
  q1: '濡其尾暗示未濟階段家庭接近目標完成時因急於收尾在最後細節出差錯，全家人還能保持耐心做好收尾，還是已有人因過程太長失去耐性正在草率催促全家趕快結束？',
  q2: '濡其首般某成員因過度焦慮做出傷害家庭和諧的衝動行為時，你會用有孚于飲酒般真誠陪伴幫他冷靜不讓一人焦慮變全家恐慌，還是認為此刻最需明確行動主動介入？',
  q3: '有孚于飲酒般以真誠從容陪伴家庭走過未濟最後階段時，哪個互動一旦被你用順其自然跳過代表從容已從陪伴變旁觀，你正用不給壓力之名放棄該承擔的引導責任？',
};
HEX64.data.study = {
  imgs: ['火在水上', '未濟征凶', '君子之光'],
  q1: '火在水上象徵未濟階段知識之火與理解之水尚未交融，你處於火勢正旺持續加熱水溫緩升的投入期，還是火已燒到疲乏水卻未沸你正考慮是否該換一種加熱方式？',
  q2: '未濟征凶般意識到尚未掌握前急於考試展示是危險時，你會君子之光般重心放真正理解讓成果自然發光，還是認為適度外部檢驗能幫你更清楚看到與目標的距離？',
  q3: '君子之光般未濟階段你的潛力被看見時，哪個學習行為一旦從內在驅動變外在表演代表被看見已從鼓勵變包袱，你正為了維持好形象而學習而非為了真正的成長？',
};
HEX64.data.health = {
  imgs: ['濡其首', '有孚于飲酒', '火在水上'],
  q1: '濡其首暗示未濟階段因急看成果把頭浸入過激運動或節食讓身體承受衝擊，你健康計畫是循序漸進身體適應良好，還是因渴望速度選了捷徑而這捷徑正消耗身體根本？',
  q2: '有孚于飲酒般需以從容真誠對待身體不因未達標而自我否定時，你會接受水火未交融就是當下真實不強迫身體，還是認為明確時間表是維持紀律必要過度從容只是美化懶惰？',
  q3: '火在水上般接受未濟的身體狀態時，哪個訊號一旦被還在過渡期合理化超過合理時間長度代表接受已從尊重變放任，那個你認為還在調整的狀態已固化成新的不健康常態？',
};
HEX64.data.decision = {
  imgs: ['未濟征凶', '曳其輪', '君子之光'],
  q1: '未濟征凶提醒在事未完成時強行推進本身就是凶險，你面對的決定處於可等待更多資訊的階段，還是外部壓力已讓你不容再等但你內心知道現在決定都帶著征凶風險？',
  q2: '曳其輪般需拉住急於下決定的慣性時，你會君子之光般相信沉穩等待本身就是領導力不急於用決定證明果斷，還是認為過長等待會被解讀為猶豫寧可在不完美時決定？',
  q3: '君子之光般以沉穩耐心等待未濟決策最佳時機時，哪個外部壓力一旦讓你動搖代表沉穩已從力量變屈服，你即將因等不下去而做出明知時機未到的決定？',
};
HEX64.data.business = {
  imgs: ['火在水上', '君子之光', '曳其輪'],
  q1: '火在水上象徵未濟階段產品與市場尚未達真正契合，你創業是火找到對水面正持續加熱方向正確，還是火燒了很久但水溫反饋讓你開始懷疑這片水面根本不是對的市場？',
  q2: '君子之光般未濟階段開始在業界被看見認可時，你會曳其輪般刻意拉住擴張不讓外界認可催你加速，還是認為窗口不等人在君子之光已顯現時就該趁勢加速？',
  q3: '曳其輪般放慢擴張節奏以確保基礎穩固時，哪個競爭信號一旦出現代表放慢已從審慎節奏變錯失機會，競爭對手正用你放慢的時間窗口搶佔你還在慢慢加熱的水面？',
};
HEX64.data.legal = {
  imgs: ['未濟征凶', '有孚于飲酒', '濡其尾'],
  q1: '未濟征凶提醒法律在未有結果時強行推進可能適得其反，你目前處境是需要耐心等程序走完的正常節奏，還是正考慮採取更激進手段加速而這加速本身就帶征凶風險？',
  q2: '有孚于飲酒般在結果未明朗時仍保持真誠從容，你會用等待期強化準備讓自己在任何結果出來都有最佳位置，還是擔心等待就是給對方準備時間寧可現在就行動？',
  q3: '濡其尾般因急於在未濟時採取行動而在程序上出現對己不利瑕疵時，哪個權利因急躁受損代表急躁已從戰術失誤變戰略失敗你為搶快一步失去本可穩妥保住的權益？',
};
HEX64.data.spiritual = {
  imgs: ['火在水上', '君子之光', '未濟征凶'],
  q1: '火在水上象徵未濟階段靈性之火與凡俗之水尚未交融覺知與習氣仍在拉鋸，你是火勢穩定水溫緩升的踏實期，還是火燒很旺水卻無反應你開始懷疑修行方法是否有效？',
  q2: '君子之光般內在覺性開始顯現被感知時，你會未濟征凶般警覺到初現最危險因極易催生我慢與對體驗的執著，還是認為這是自然里程碑該坦然接受作為繼續的鼓勵？',
  q3: '未濟征凶般警覺修行未完成前任何自滿都是退轉開始時，哪個心念一旦從警覺變壓抑代表防範已從智慧謹慎變成對修行的恐懼，你正用不敢犯錯的緊繃來修行？',
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
        version: '1.10.0-wE-refl-hex61-64',
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
  const newH61 = buildQuestions(HEX61);
  const newH62 = buildQuestions(HEX62);
  const newH63 = buildQuestions(HEX63);
  const newH64 = buildQuestions(HEX64);

  const allNew = newH61.concat(newH62).concat(newH63).concat(newH64);
  console.log('Built ' + allNew.length + ' new questions (36 each hex 61,62,63,64).\n');

  let allPassed = true;

  console.log('--- LENGTH VALIDATION (38-105) ---');
  if (!validateLengths(newH61, 'HEX61')) allPassed = false;
  if (!validateLengths(newH62, 'HEX62')) allPassed = false;
  if (!validateLengths(newH63, 'HEX63')) allPassed = false;
  if (!validateLengths(newH64, 'HEX64')) allPassed = false;

  console.log('\n--- TERMINAL ？ VALIDATION ---');
  if (!validateEndsWithQuestionMark(newH61, 'HEX61')) allPassed = false;
  if (!validateEndsWithQuestionMark(newH62, 'HEX62')) allPassed = false;
  if (!validateEndsWithQuestionMark(newH63, 'HEX63')) allPassed = false;
  if (!validateEndsWithQuestionMark(newH64, 'HEX64')) allPassed = false;

  console.log('\n--- UNIQUENESS VALIDATION ---');
  if (!validateUniqueness(newH61, 'HEX61')) allPassed = false;
  if (!validateUniqueness(newH62, 'HEX62')) allPassed = false;
  if (!validateUniqueness(newH63, 'HEX63')) allPassed = false;
  if (!validateUniqueness(newH64, 'HEX64')) allPassed = false;
  if (!validateUniqueness(allNew, 'HEX61+62+63+64 combined')) allPassed = false;

  console.log('\n--- normU VALIDATION (>= 32/36) ---');
  if (!validateNormU(newH61, 'HEX61')) allPassed = false;
  if (!validateNormU(newH62, 'HEX62')) allPassed = false;
  if (!validateNormU(newH63, 'HEX63')) allPassed = false;
  if (!validateNormU(newH64, 'HEX64')) allPassed = false;

  console.log('\n--- IMAGERY USAGE VALIDATION ---');
  if (!validateImageryUsage(newH61, 'HEX61', '中孚')) allPassed = false;
  if (!validateImageryUsage(newH62, 'HEX62', '小過')) allPassed = false;
  if (!validateImageryUsage(newH63, 'HEX63', '既濟')) allPassed = false;
  if (!validateImageryUsage(newH64, 'HEX64', '未濟')) allPassed = false;

  console.log('\n--- Q-STRUCTURE VALIDATION (Q1/Q2 還是, Q3 not) ---');
  if (!validateQStructure(newH61, 'HEX61')) allPassed = false;
  if (!validateQStructure(newH62, 'HEX62')) allPassed = false;
  if (!validateQStructure(newH63, 'HEX63')) allPassed = false;
  if (!validateQStructure(newH64, 'HEX64')) allPassed = false;

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

  const before61 = data.filter(function(d) { return d.hexagramId === 61; }).length;
  const before62 = data.filter(function(d) { return d.hexagramId === 62; }).length;
  const before63 = data.filter(function(d) { return d.hexagramId === 63; }).length;
  const before64 = data.filter(function(d) { return d.hexagramId === 64; }).length;
  console.log('Existing hex61=' + before61 + ', hex62=' + before62 + ', hex63=' + before63 + ', hex64=' + before64);

  const filtered = data.filter(function(d) {
    return d.hexagramId !== 61 && d.hexagramId !== 62 && d.hexagramId !== 63 && d.hexagramId !== 64;
  });
  const merged = filtered.concat(newH61).concat(newH62).concat(newH63).concat(newH64);
  merged.sort(function(a, b) { return a.hexagramId - b.hexagramId; });
  console.log('New total: ' + merged.length + ' (expected ' + (data.length - before61 - before62 - before63 - before64 + 144) + ')');

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
  for (const h of [61, 62, 63, 64]) {
    const vh = verifyData.filter(function(d) { return d.hexagramId === h; });
    console.log('Verification hex' + h + '=' + vh.length);
    if (vh.length !== 36) throw new Error('Verification failed: expected 36 questions for hex' + h);
  }

  const allVerified = verifyData.filter(function(d) { return [61,62,63,64].includes(d.hexagramId); });
  for (const q of allVerified) {
    if (q.qualityLevel !== 'refined') throw new Error(q.id + ': qualityLevel=' + q.qualityLevel);
    if (q.reviewed !== false) throw new Error(q.id + ': reviewed=' + q.reviewed);
    if (q.needsHumanReview !== true) throw new Error(q.id + ': needsHumanReview=' + q.needsHumanReview);
  }
  console.log('Quality field verification PASSED.');
  console.log('\nwE_refl_61_64.js generation COMPLETE - 144 questions written successfully.');
}

main();