# fill_line_texts.ps1 - Batch 1: hexagrams 9-32 (144 line texts)
param($Batch = 1)

$file = "D:\AI_PROJECTS\Zero1Matrix\src\data\lines.data.js"
$content = Get-Content $file -Raw -Encoding UTF8

# All 384 line texts indexed by id
$texts = @{}

# === BATCH 1: Hex 9-16 ===
# 9 小畜
$texts["hex-009-line-1"] = "復自道，何其咎，吉。"
$texts["hex-009-line-2"] = "牽復，吉。"
$texts["hex-009-line-3"] = "輿說輻，夫妻反目。"
$texts["hex-009-line-4"] = "有孚，血去惕出，無咎。"
$texts["hex-009-line-5"] = "有孚攣如，富以其鄰。"
$texts["hex-009-line-6"] = "既雨既處，尚德載，婦貞厲，月幾望，君子征凶。"
# 10 履
$texts["hex-010-line-1"] = "素履，往無咎。"
$texts["hex-010-line-2"] = "履道坦坦，幽人貞吉。"
$texts["hex-010-line-3"] = "眇能視，跛能履，履虎尾，咥人，凶。武人為于大君。"
$texts["hex-010-line-4"] = "履虎尾，愬愬，終吉。"
$texts["hex-010-line-5"] = "夬履，貞厲。"
$texts["hex-010-line-6"] = "視履考祥，其旋元吉。"
# 11 泰
$texts["hex-011-line-1"] = "拔茅茹，以其彙，征吉。"
$texts["hex-011-line-2"] = "包荒，用馮河，不遐遺，朋亡，得尚于中行。"
$texts["hex-011-line-3"] = "無平不陂，無往不復，艱貞無咎，勿恤其孚，于食有福。"
$texts["hex-011-line-4"] = "翩翩，不富以其鄰，不戒以孚。"
$texts["hex-011-line-5"] = "帝乙歸妹，以祉元吉。"
$texts["hex-011-line-6"] = "城復于隍，勿用師，自邑告命，貞吝。"
# 12 否
$texts["hex-012-line-1"] = "拔茅茹，以其彙，貞吉，亨。"
$texts["hex-012-line-2"] = "包承，小人吉，大人否，亨。"
$texts["hex-012-line-3"] = "包羞。"
$texts["hex-012-line-4"] = "有命無咎，疇離祉。"
$texts["hex-012-line-5"] = "休否，大人吉，其亡其亡，繫于苞桑。"
$texts["hex-012-line-6"] = "傾否，先否後喜。"
# 13 同人
$texts["hex-013-line-1"] = "同人于門，無咎。"
$texts["hex-013-line-2"] = "同人于宗，吝。"
$texts["hex-013-line-3"] = "伏戎于莽，升其高陵，三歲不興。"
$texts["hex-013-line-4"] = "乘其墉，弗克攻，吉。"
$texts["hex-013-line-5"] = "同人，先號咷而後笑，大師克相遇。"
$texts["hex-013-line-6"] = "同人于郊，無悔。"
# 14 大有
$texts["hex-014-line-1"] = "無交害，匪咎，艱則無咎。"
$texts["hex-014-line-2"] = "大車以載，有攸往，無咎。"
$texts["hex-014-line-3"] = "公用亨于天子，小人弗克。"
$texts["hex-014-line-4"] = "匪其彭，無咎。"
$texts["hex-014-line-5"] = "厥孚交如，威如，吉。"
$texts["hex-014-line-6"] = "自天祐之，吉，無不利。"
# 15 謙
$texts["hex-015-line-1"] = "謙謙君子，用涉大川，吉。"
$texts["hex-015-line-2"] = "鳴謙，貞吉。"
$texts["hex-015-line-3"] = "勞謙君子，有終吉。"
$texts["hex-015-line-4"] = "無不利，撝謙。"
$texts["hex-015-line-5"] = "不富以其鄰，利用侵伐，無不利。"
$texts["hex-015-line-6"] = "鳴謙，利用行師，征邑國。"
# 16 豫
$texts["hex-016-line-1"] = "鳴豫，凶。"
$texts["hex-016-line-2"] = "介于石，不終日，貞吉。"
$texts["hex-016-line-3"] = "盱豫，悔，遲有悔。"
$texts["hex-016-line-4"] = "由豫，大有得，勿疑，朋盍簪。"
$texts["hex-016-line-5"] = "貞疾，恆不死。"
$texts["hex-016-line-6"] = "冥豫，成有渝，無咎。"

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
  # Replace placeholder text with real text
  $pattern = '("id":\s*"' + [regex]::Escape($id) + '"[^}]*?"text":\s*)".*?"'
  $replacement = '$1"' + $newText + '"'
  if ($content -match $pattern) {
    $content = $content -replace $pattern, $replacement
    $modified++
  }
}

# Now add classicTextSources to entries that don't have it (hex 9-16)
foreach ($id in $texts.Keys) {
  if ($content -match ('"id":\s*"' + [regex]::Escape($id) + '"') -and $content -notmatch ($id + '[^}]*?classicTextSources')) {
    # Add before needsExpansion
    $pattern = '("id":\s*"' + [regex]::Escape($id) + '"[^}]*?)("needsExpansion")'
    $replacement = '$1' + $srcBlock + ',`r`n    $2'
    $content = $content -replace $pattern, $replacement
  }
}

$content | Set-Content $file -Encoding UTF8 -NoNewline
Write-Host "Batch 1 complete. Modified $modified text entries for hex 9-16."
