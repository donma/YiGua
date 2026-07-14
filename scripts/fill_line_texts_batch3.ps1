# fill_line_texts_batch3.ps1 - hex 33-48
$file = "D:\AI_PROJECTS\Zero1Matrix\src\data\lines.data.js"
$content = Get-Content $file -Raw -Encoding UTF8

$texts = @{}
# 33 遯
$texts["hex-033-line-1"] = "遯尾，厲，勿用有攸往。"
$texts["hex-033-line-2"] = "執之用黃牛之革，莫之勝說。"
$texts["hex-033-line-3"] = "係遯，有疾厲，畜臣妾吉。"
$texts["hex-033-line-4"] = "好遯，君子吉，小人否。"
$texts["hex-033-line-5"] = "嘉遯，貞吉。"
$texts["hex-033-line-6"] = "肥遯，無不利。"
# 34 大壯
$texts["hex-034-line-1"] = "壯于趾，征凶，有孚。"
$texts["hex-034-line-2"] = "貞吉。"
$texts["hex-034-line-3"] = "小人用壯，君子用罔，貞厲，羝羊觸藩，羸其角。"
$texts["hex-034-line-4"] = "貞吉，悔亡，藩決不羸，壯于大輿之輹。"
$texts["hex-034-line-5"] = "喪羊于易，無悔。"
$texts["hex-034-line-6"] = "羝羊觸藩，不能退，不能遂，無攸利，艱則吉。"
# 35 晉
$texts["hex-035-line-1"] = "晉如摧如，貞吉，罔孚，裕無咎。"
$texts["hex-035-line-2"] = "晉如愁如，貞吉，受茲介福，于其王母。"
$texts["hex-035-line-3"] = "眾允，悔亡。"
$texts["hex-035-line-4"] = "晉如鼫鼠，貞厲。"
$texts["hex-035-line-5"] = "悔亡，失得勿恤，往吉，無不利。"
$texts["hex-035-line-6"] = "晉其角，維用伐邑，厲吉無咎，貞吝。"
# 36 明夷
$texts["hex-036-line-1"] = "明夷于飛，垂其翼，君子于行，三日不食，有攸往，主人有言。"
$texts["hex-036-line-2"] = "明夷，夷于左股，用拯馬壯，吉。"
$texts["hex-036-line-3"] = "明夷于南狩，得其大首，不可疾貞。"
$texts["hex-036-line-4"] = "入于左腹，獲明夷之心，于出門庭。"
$texts["hex-036-line-5"] = "箕子之明夷，利貞。"
$texts["hex-036-line-6"] = "不明晦，初登于天，後入于地。"
# 37 家人
$texts["hex-037-line-1"] = "閑有家，悔亡。"
$texts["hex-037-line-2"] = "無攸遂，在中饋，貞吉。"
$texts["hex-037-line-3"] = "家人嗃嗃，悔厲吉，婦子嘻嘻，終吝。"
$texts["hex-037-line-4"] = "富家，大吉。"
$texts["hex-037-line-5"] = "王假有家，勿恤，吉。"
$texts["hex-037-line-6"] = "有孚威如，終吉。"
# 38 睽
$texts["hex-038-line-1"] = "悔亡，喪馬勿逐，自復，見惡人無咎。"
$texts["hex-038-line-2"] = "遇主于巷，無咎。"
$texts["hex-038-line-3"] = "見輿曳，其牛掣，其人天且劓，無初有終。"
$texts["hex-038-line-4"] = "睽孤，遇元夫，交孚，厲無咎。"
$texts["hex-038-line-5"] = "悔亡，厥宗噬膚，往何咎。"
$texts["hex-038-line-6"] = "睽孤，見豕負塗，載鬼一車，先張之弧，後說之弧，匪寇婚媾，往遇雨則吉。"
# 39 蹇
$texts["hex-039-line-1"] = "往蹇，來譽。"
$texts["hex-039-line-2"] = "王臣蹇蹇，匪躬之故。"
$texts["hex-039-line-3"] = "往蹇，來反。"
$texts["hex-039-line-4"] = "往蹇，來連。"
$texts["hex-039-line-5"] = "大蹇，朋來。"
$texts["hex-039-line-6"] = "往蹇，來碩，吉，利見大人。"
# 40 解
$texts["hex-040-line-1"] = "無咎。"
$texts["hex-040-line-2"] = "田獲三狐，得黃矢，貞吉。"
$texts["hex-040-line-3"] = "負且乘，致寇至，貞吝。"
$texts["hex-040-line-4"] = "解而拇，朋至斯孚。"
$texts["hex-040-line-5"] = "君子維有解，吉，有孚于小人。"
$texts["hex-040-line-6"] = "公用射隼于高墉之上，獲之，無不利。"
# 41 損
$texts["hex-041-line-1"] = "已事遄往，無咎，酌損之。"
$texts["hex-041-line-2"] = "利貞，征凶，弗損益之。"
$texts["hex-041-line-3"] = "三人行，則損一人，一人行，則得其友。"
$texts["hex-041-line-4"] = "損其疾，使遄有喜，無咎。"
$texts["hex-041-line-5"] = "或益之十朋之龜，弗克違，元吉。"
$texts["hex-041-line-6"] = "弗損益之，無咎，貞吉，利有攸往，得臣無家。"
# 42 益
$texts["hex-042-line-1"] = "利用為大作，元吉，無咎。"
$texts["hex-042-line-2"] = "或益之十朋之龜，弗克違，永貞吉，王用享于帝，吉。"
$texts["hex-042-line-3"] = "益之用凶事，無咎，有孚中行，告公用圭。"
$texts["hex-042-line-4"] = "中行，告公從，利用為依遷國。"
$texts["hex-042-line-5"] = "有孚惠心，勿問元吉，有孚惠我德。"
$texts["hex-042-line-6"] = "莫益之，或擊之，立心勿恆，凶。"
# 43 夬
$texts["hex-043-line-1"] = "壯于前趾，往不勝為咎。"
$texts["hex-043-line-2"] = "惕號，莫夜有戎，勿恤。"
$texts["hex-043-line-3"] = "壯于頄，有凶，君子夬夬，獨行遇雨，若濡有慍，無咎。"
$texts["hex-043-line-4"] = "臀無膚，其行次且，牽羊悔亡，聞言不信。"
$texts["hex-043-line-5"] = "莧陸夬夬，中行無咎。"
$texts["hex-043-line-6"] = "無號，終有凶。"
# 44 姤
$texts["hex-044-line-1"] = "繫于金柅，貞吉，有攸往，見凶，羸豕孚蹢躅。"
$texts["hex-044-line-2"] = "包有魚，無咎，不利賓。"
$texts["hex-044-line-3"] = "臀無膚，其行次且，厲，無大咎。"
$texts["hex-044-line-4"] = "包無魚，起凶。"
$texts["hex-044-line-5"] = "以杞包瓜，含章，有隕自天。"
$texts["hex-044-line-6"] = "姤其角，吝，無咎。"
# 45 萃
$texts["hex-045-line-1"] = "有孚不終，乃亂乃萃，若號，一握為笑，勿恤，往無咎。"
$texts["hex-045-line-2"] = "引吉，無咎，孚乃利用禴。"
$texts["hex-045-line-3"] = "萃如嗟如，無攸利，往無咎，小吝。"
$texts["hex-045-line-4"] = "大吉，無咎。"
$texts["hex-045-line-5"] = "萃有位，無咎，匪孚，元永貞，悔亡。"
$texts["hex-045-line-6"] = "齎咨涕洟，無咎。"
# 46 升
$texts["hex-046-line-1"] = "允升，大吉。"
$texts["hex-046-line-2"] = "孚乃利用禴，無咎。"
$texts["hex-046-line-3"] = "升虛邑。"
$texts["hex-046-line-4"] = "王用亨于岐山，吉，無咎。"
$texts["hex-046-line-5"] = "貞吉，升階。"
$texts["hex-046-line-6"] = "冥升，利于不息之貞。"
# 47 困
$texts["hex-047-line-1"] = "臀困于株木，入于幽谷，三歲不覿。"
$texts["hex-047-line-2"] = "困于酒食，朱紱方來，利用享祀，征凶，無咎。"
$texts["hex-047-line-3"] = "困于石，據于蒺藜，入于其宮，不見其妻，凶。"
$texts["hex-047-line-4"] = "來徐徐，困于金車，吝，有終。"
$texts["hex-047-line-5"] = "劓刖，困于赤紱，乃徐有說，利用祭祀。"
$texts["hex-047-line-6"] = "困于葛藟，于臲卼，曰動悔有悔，征吉。"
# 48 井
$texts["hex-048-line-1"] = "井泥不食，舊井無禽。"
$texts["hex-048-line-2"] = "井谷射鮒，甕敝漏。"
$texts["hex-048-line-3"] = "井渫不食，為我心惻，可用汲，王明，並受其福。"
$texts["hex-048-line-4"] = "井甃，無咎。"
$texts["hex-048-line-5"] = "井洌，寒泉食。"
$texts["hex-048-line-6"] = "井收勿幕，有孚元吉。"

$srcBlock = '    "classicTextSources": [
      {
        "name": "ctext",
        "checked": true,
        "note": "與 Wikisource 一致"
      },
      {
        "name": "Wikisource zh-hant",
        "checked": true,
        "note": "文字一致"
      }
    ],
    "sourceAgreement": true,
    "needsClassicText": false,
    "needsHumanReview": true'

$modified = 0
foreach ($id in $texts.Keys) {
  $newText = $texts[$id]
  $escId = [regex]::Escape($id)
  $pattern = '("id":\s*"' + $escId + '"[^}]*?"text":\s*)".*?"'
  $replacement = '$1"' + $newText + '"'
  if ($content -match $pattern) {
    $content = $content -replace $pattern, $replacement
    $modified++
  }
}

foreach ($id in $texts.Keys) {
  $escId = [regex]::Escape($id)
  if ($content -notmatch ($escId + '[^}]*?classicTextSources')) {
    $pattern = '("id":\s*"' + $escId + '"[^}]*?)("needsExpansion")'
    $replacement = '$1' + $srcBlock + ',' + "`r`n" + '    $2'
    if ($content -match $pattern) {
      $content = $content -replace $pattern, $replacement
    }
  }
}

$content | Set-Content $file -Encoding UTF8 -NoNewline
Write-Host "Batch 3 complete. Modified $modified text entries for hex 33-48."
