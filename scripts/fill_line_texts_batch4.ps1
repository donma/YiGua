# fill_line_texts_batch4.ps1 - hex 49-64
$file = "D:\AI_PROJECTS\Zero1Matrix\src\data\lines.data.js"
$content = Get-Content $file -Raw -Encoding UTF8

$texts = @{}
# 49 革
$texts["hex-049-line-1"] = "鞏用黃牛之革。"
$texts["hex-049-line-2"] = "巳日乃革之，征吉，無咎。"
$texts["hex-049-line-3"] = "征凶，貞厲，革言三就，有孚。"
$texts["hex-049-line-4"] = "悔亡，有孚改命，吉。"
$texts["hex-049-line-5"] = "大人虎變，未占有孚。"
$texts["hex-049-line-6"] = "君子豹變，小人革面，征凶，居貞吉。"
# 50 鼎
$texts["hex-050-line-1"] = "鼎顛趾，利出否，得妾以其子，無咎。"
$texts["hex-050-line-2"] = "鼎有實，我仇有疾，不我能即，吉。"
$texts["hex-050-line-3"] = "鼎耳革，其行塞，雉膏不食，方雨虧悔，終吉。"
$texts["hex-050-line-4"] = "鼎折足，覆公餗，其形渥，凶。"
$texts["hex-050-line-5"] = "鼎黃耳金鉉，利貞。"
$texts["hex-050-line-6"] = "鼎玉鉉，大吉，無不利。"
# 51 震
$texts["hex-051-line-1"] = "震來虩虩，後笑言啞啞，吉。"
$texts["hex-051-line-2"] = "震來厲，億喪貝，躋于九陵，勿逐，七日得。"
$texts["hex-051-line-3"] = "震蘇蘇，震行無眚。"
$texts["hex-051-line-4"] = "震遂泥。"
$texts["hex-051-line-5"] = "震往來厲，億無喪，有事。"
$texts["hex-051-line-6"] = "震索索，視矍矍，征凶，震不于其躬，于其鄰，無咎，婚媾有言。"
# 52 艮
$texts["hex-052-line-1"] = "艮其趾，無咎，利永貞。"
$texts["hex-052-line-2"] = "艮其腓，不拯其隨，其心不快。"
$texts["hex-052-line-3"] = "艮其限，列其夤，厲薰心。"
$texts["hex-052-line-4"] = "艮其身，無咎。"
$texts["hex-052-line-5"] = "艮其輔，言有序，悔亡。"
$texts["hex-052-line-6"] = "敦艮，吉。"
# 53 漸
$texts["hex-053-line-1"] = "鴻漸于干，小子厲，有言，無咎。"
$texts["hex-053-line-2"] = "鴻漸于磐，飲食衎衎，吉。"
$texts["hex-053-line-3"] = "鴻漸于陸，夫征不復，婦孕不育，凶，利禦寇。"
$texts["hex-053-line-4"] = "鴻漸于木，或得其桷，無咎。"
$texts["hex-053-line-5"] = "鴻漸于陵，婦三歲不孕，終莫之勝，吉。"
$texts["hex-053-line-6"] = "鴻漸于陸，其羽可用為儀，吉。"
# 54 歸妹
$texts["hex-054-line-1"] = "歸妹以娣，跛能履，征吉。"
$texts["hex-054-line-2"] = "眇能視，利幽人之貞。"
$texts["hex-054-line-3"] = "歸妹以須，反歸以娣。"
$texts["hex-054-line-4"] = "歸妹愆期，遲歸有時。"
$texts["hex-054-line-5"] = "帝乙歸妹，其君之袂，不如其娣之袂良，月幾望，吉。"
$texts["hex-054-line-6"] = "女承筐無實，士刲羊無血，無攸利。"
# 55 豐
$texts["hex-055-line-1"] = "遇其配主，雖旬無咎，往有尚。"
$texts["hex-055-line-2"] = "豐其蔀，日中見斗，往得疑疾，有孚發若，吉。"
$texts["hex-055-line-3"] = "豐其沛，日中見沬，折其右肱，無咎。"
$texts["hex-055-line-4"] = "豐其蔀，日中見斗，遇其夷主，吉。"
$texts["hex-055-line-5"] = "來章，有慶譽，吉。"
$texts["hex-055-line-6"] = "豐其屋，蔀其家，闚其戶，闃其無人，三歲不覿，凶。"
# 56 旅
$texts["hex-056-line-1"] = "旅瑣瑣，斯其所取災。"
$texts["hex-056-line-2"] = "旅即次，懷其資，得童僕，貞。"
$texts["hex-056-line-3"] = "旅焚其次，喪其童僕，貞厲。"
$texts["hex-056-line-4"] = "旅于處，得其資斧，我心不快。"
$texts["hex-056-line-5"] = "射雉，一矢亡，終以譽命。"
$texts["hex-056-line-6"] = "鳥焚其巢，旅人先笑後號咷，喪牛于易，凶。"
# 57 巽
$texts["hex-057-line-1"] = "進退，利武人之貞。"
$texts["hex-057-line-2"] = "巽在牀下，用史巫紛若，吉，無咎。"
$texts["hex-057-line-3"] = "頻巽，吝。"
$texts["hex-057-line-4"] = "悔亡，田獲三品。"
$texts["hex-057-line-5"] = "貞吉，悔亡，無不利，無初有終，先庚三日，後庚三日，吉。"
$texts["hex-057-line-6"] = "巽在牀下，喪其資斧，貞凶。"
# 58 兌
$texts["hex-058-line-1"] = "和兌，吉。"
$texts["hex-058-line-2"] = "孚兌，吉，悔亡。"
$texts["hex-058-line-3"] = "來兌，凶。"
$texts["hex-058-line-4"] = "商兌未寧，介疾有喜。"
$texts["hex-058-line-5"] = "孚于剝，有厲。"
$texts["hex-058-line-6"] = "引兌。"
# 59 渙
$texts["hex-059-line-1"] = "用拯馬壯，吉。"
$texts["hex-059-line-2"] = "渙奔其机，悔亡。"
$texts["hex-059-line-3"] = "渙其躬，無悔。"
$texts["hex-059-line-4"] = "渙其群，元吉，渙有丘，匪夷所思。"
$texts["hex-059-line-5"] = "渙汗其大號，渙王居，無咎。"
$texts["hex-059-line-6"] = "渙其血，去逖出，無咎。"
# 60 節
$texts["hex-060-line-1"] = "不出戶庭，無咎。"
$texts["hex-060-line-2"] = "不出門庭，凶。"
$texts["hex-060-line-3"] = "不節若，則嗟若，無咎。"
$texts["hex-060-line-4"] = "安節，亨。"
$texts["hex-060-line-5"] = "甘節，吉，往有尚。"
$texts["hex-060-line-6"] = "苦節，貞凶，悔亡。"
# 61 中孚
$texts["hex-061-line-1"] = "虞吉，有它不燕。"
$texts["hex-061-line-2"] = "鳴鶴在陰，其子和之，我有好爵，吾與爾靡之。"
$texts["hex-061-line-3"] = "得敵，或鼓或罷，或泣或歌。"
$texts["hex-061-line-4"] = "月幾望，馬匹亡，無咎。"
$texts["hex-061-line-5"] = "有孚攣如，無咎。"
$texts["hex-061-line-6"] = "翰音登于天，貞凶。"
# 62 小過
$texts["hex-062-line-1"] = "飛鳥以凶。"
$texts["hex-062-line-2"] = "過其祖，遇其妣，不及其君，遇其臣，無咎。"
$texts["hex-062-line-3"] = "弗過防之，從或戕之，凶。"
$texts["hex-062-line-4"] = "無咎，弗過遇之，往厲必戒，勿用永貞。"
$texts["hex-062-line-5"] = "密雲不雨，自我西郊，公弋取彼在穴。"
$texts["hex-062-line-6"] = "弗遇過之，飛鳥離之，凶，是謂災眚。"
# 63 既濟
$texts["hex-063-line-1"] = "曳其輪，濡其尾，無咎。"
$texts["hex-063-line-2"] = "婦喪其茀，勿逐，七日得。"
$texts["hex-063-line-3"] = "高宗伐鬼方，三年克之，小人勿用。"
$texts["hex-063-line-4"] = "繻有衣袽，終日戒。"
$texts["hex-063-line-5"] = "東鄰殺牛，不如西鄰之禴祭，實受其福。"
$texts["hex-063-line-6"] = "濡其首，厲。"
# 64 未濟
$texts["hex-064-line-1"] = "濡其尾，吝。"
$texts["hex-064-line-2"] = "曳其輪，貞吉。"
$texts["hex-064-line-3"] = "未濟，征凶，利涉大川。"
$texts["hex-064-line-4"] = "貞吉，悔亡，震用伐鬼方，三年有賞于大國。"
$texts["hex-064-line-5"] = "貞吉，無悔，君子之光，有孚，吉。"
$texts["hex-064-line-6"] = "有孚于飲酒，無咎，濡其首，有孚失是。"

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
Write-Host "Batch 4 complete. Modified $modified text entries for hex 49-64."
