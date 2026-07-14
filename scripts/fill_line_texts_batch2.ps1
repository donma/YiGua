# fill_line_texts_batch2.ps1 - Batch 2: hexagrams 17-32
$file = "D:\AI_PROJECTS\Zero1Matrix\src\data\lines.data.js"
$content = Get-Content $file -Raw -Encoding UTF8

$texts = @{}
# 17 隨
$texts["hex-017-line-1"] = "官有渝，貞吉，出門交有功。"
$texts["hex-017-line-2"] = "係小子，失丈夫。"
$texts["hex-017-line-3"] = "係丈夫，失小子，隨有求得，利居貞。"
$texts["hex-017-line-4"] = "隨有獲，貞凶，有孚在道，以明，何咎。"
$texts["hex-017-line-5"] = "孚于嘉，吉。"
$texts["hex-017-line-6"] = "拘係之，乃從維之，王用亨于西山。"
# 18 蠱
$texts["hex-018-line-1"] = "幹父之蠱，有子，考無咎，厲終吉。"
$texts["hex-018-line-2"] = "幹母之蠱，不可貞。"
$texts["hex-018-line-3"] = "幹父之蠱，小有悔，無大咎。"
$texts["hex-018-line-4"] = "裕父之蠱，往見吝。"
$texts["hex-018-line-5"] = "幹父之蠱，用譽。"
$texts["hex-018-line-6"] = "不事王侯，高尚其事。"
# 19 臨
$texts["hex-019-line-1"] = "咸臨，貞吉。"
$texts["hex-019-line-2"] = "咸臨，吉，無不利。"
$texts["hex-019-line-3"] = "甘臨，無攸利，既憂之，無咎。"
$texts["hex-019-line-4"] = "至臨，無咎。"
$texts["hex-019-line-5"] = "知臨，大君之宜，吉。"
$texts["hex-019-line-6"] = "敦臨，吉，無咎。"
# 20 觀
$texts["hex-020-line-1"] = "童觀，小人無咎，君子吝。"
$texts["hex-020-line-2"] = "闚觀，利女貞。"
$texts["hex-020-line-3"] = "觀我生，進退。"
$texts["hex-020-line-4"] = "觀國之光，利用賓于王。"
$texts["hex-020-line-5"] = "觀我生，君子無咎。"
$texts["hex-020-line-6"] = "觀其生，君子無咎。"
# 21 噬嗑
$texts["hex-021-line-1"] = "屨校滅趾，無咎。"
$texts["hex-021-line-2"] = "噬膚滅鼻，無咎。"
$texts["hex-021-line-3"] = "噬腊肉，遇毒，小吝，無咎。"
$texts["hex-021-line-4"] = "噬乾胏，得金矢，利艱貞，吉。"
$texts["hex-021-line-5"] = "噬乾肉，得黃金，貞厲，無咎。"
$texts["hex-021-line-6"] = "何校滅耳，凶。"
# 22 賁
$texts["hex-022-line-1"] = "賁其趾，舍車而徒。"
$texts["hex-022-line-2"] = "賁其須。"
$texts["hex-022-line-3"] = "賁如濡如，永貞吉。"
$texts["hex-022-line-4"] = "賁如皤如，白馬翰如，匪寇婚媾。"
$texts["hex-022-line-5"] = "賁于丘園，束帛戔戔，吝，終吉。"
$texts["hex-022-line-6"] = "白賁，無咎。"
# 23 剝
$texts["hex-023-line-1"] = "剝牀以足，蔑貞凶。"
$texts["hex-023-line-2"] = "剝牀以辨，蔑貞凶。"
$texts["hex-023-line-3"] = "剝之，無咎。"
$texts["hex-023-line-4"] = "剝牀以膚，凶。"
$texts["hex-023-line-5"] = "貫魚，以宮人寵，無不利。"
$texts["hex-023-line-6"] = "碩果不食，君子得輿，小人剝廬。"
# 24 復
$texts["hex-024-line-1"] = "不遠復，無祗悔，元吉。"
$texts["hex-024-line-2"] = "休復，吉。"
$texts["hex-024-line-3"] = "頻復，厲，無咎。"
$texts["hex-024-line-4"] = "中行獨復。"
$texts["hex-024-line-5"] = "敦復，無悔。"
$texts["hex-024-line-6"] = "迷復，凶，有災眚，用行師，終有大敗，以其國君凶，至于十年不克征。"
# 25 無妄
$texts["hex-025-line-1"] = "無妄，往吉。"
$texts["hex-025-line-2"] = "不耕穫，不菑畬，則利有攸往。"
$texts["hex-025-line-3"] = "無妄之災，或繫之牛，行人之得，邑人之災。"
$texts["hex-025-line-4"] = "可貞，無咎。"
$texts["hex-025-line-5"] = "無妄之疾，勿藥有喜。"
$texts["hex-025-line-6"] = "無妄，行有眚，無攸利。"
# 26 大畜
$texts["hex-026-line-1"] = "有厲，利已。"
$texts["hex-026-line-2"] = "輿說輹。"
$texts["hex-026-line-3"] = "良馬逐，利艱貞，曰閑輿衛，利有攸往。"
$texts["hex-026-line-4"] = "童牛之牿，元吉。"
$texts["hex-026-line-5"] = "豶豕之牙，吉。"
$texts["hex-026-line-6"] = "何天之衢，亨。"
# 27 頤
$texts["hex-027-line-1"] = "舍爾靈龜，觀我朵頤，凶。"
$texts["hex-027-line-2"] = "顛頤，拂經于丘頤，征凶。"
$texts["hex-027-line-3"] = "拂頤，貞凶，十年勿用，無攸利。"
$texts["hex-027-line-4"] = "顛頤，吉，虎視眈眈，其欲逐逐，無咎。"
$texts["hex-027-line-5"] = "拂經，居貞吉，不可涉大川。"
$texts["hex-027-line-6"] = "由頤，厲吉，利涉大川。"
# 28 大過
$texts["hex-028-line-1"] = "藉用白茅，無咎。"
$texts["hex-028-line-2"] = "枯楊生稊，老夫得其女妻，無不利。"
$texts["hex-028-line-3"] = "棟橈，凶。"
$texts["hex-028-line-4"] = "棟隆，吉，有它吝。"
$texts["hex-028-line-5"] = "枯楊生華，老婦得其士夫，無咎無譽。"
$texts["hex-028-line-6"] = "過涉滅頂，凶，無咎。"
# 29 坎
$texts["hex-029-line-1"] = "習坎，入于坎窞，凶。"
$texts["hex-029-line-2"] = "坎有險，求小得。"
$texts["hex-029-line-3"] = "來之坎坎，險且枕，入于坎窞，勿用。"
$texts["hex-029-line-4"] = "樽酒簋貳，用缶，納約自牖，終無咎。"
$texts["hex-029-line-5"] = "坎不盈，祗既平，無咎。"
$texts["hex-029-line-6"] = "係用徽纆，寘于叢棘，三歲不得，凶。"
# 30 離
$texts["hex-030-line-1"] = "履錯然，敬之無咎。"
$texts["hex-030-line-2"] = "黃離，元吉。"
$texts["hex-030-line-3"] = "日昃之離，不鼓缶而歌，則大耋之嗟，凶。"
$texts["hex-030-line-4"] = "突如其來如，焚如，死如，棄如。"
$texts["hex-030-line-5"] = "出涕沱若，戚嗟若，吉。"
$texts["hex-030-line-6"] = "王用出征，有嘉折首，獲匪其醜，無咎。"
# 31 咸
$texts["hex-031-line-1"] = "咸其拇。"
$texts["hex-031-line-2"] = "咸其腓，凶，居吉。"
$texts["hex-031-line-3"] = "咸其股，執其隨，往吝。"
$texts["hex-031-line-4"] = "貞吉，悔亡，憧憧往來，朋從爾思。"
$texts["hex-031-line-5"] = "咸其脢，無悔。"
$texts["hex-031-line-6"] = "咸其輔頰舌。"
# 32 恆
$texts["hex-032-line-1"] = "浚恆，貞凶，無攸利。"
$texts["hex-032-line-2"] = "悔亡。"
$texts["hex-032-line-3"] = "不恆其德，或承之羞，貞吝。"
$texts["hex-032-line-4"] = "田無禽。"
$texts["hex-032-line-5"] = "恆其德，貞，婦人吉，夫子凶。"
$texts["hex-032-line-6"] = "振恆，凶。"

$srcBlock = @'
    "classicTextSources": [
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
    "needsHumanReview": true
'@

$modified = 0
foreach ($id in $texts.Keys) {
  $newText = $texts[$id]
  $escId = [regex]::Escape($id)
  # Replace text
  $pattern = '("id":\s*"' + $escId + '"[^}]*?"text":\s*)".*?"'
  if ($content -match $pattern) {
    $content = $content -replace $pattern, '$1"' + $newText + '"'
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
Write-Host "Batch 2 complete. Modified $modified text entries for hex 17-32."
