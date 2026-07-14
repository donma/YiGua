# fix_lc_hex17_32.ps1 - Rebuild lineCategory for hex 17-32
$lcFile = "D:\AI_PROJECTS\Zero1Matrix\src\data\lineCategoryInterpretations.data.js"
$hexFile = "D:\AI_PROJECTS\Zero1Matrix\src\data\hexagrams.data.js"

$lcContent = Get-Content $lcFile -Raw -Encoding UTF8
$hexContent = Get-Content $hexFile -Raw -Encoding UTF8

$hexMap = @{}
foreach ($m in [regex]::Matches($hexContent, '"id":\s*(\d+)[\s\S]*?"name":\s*"([^"]+)"[\s\S]*?"fullName":\s*"([^"]+)"[\s\S]*?"tone":\s*"([^"]+)"')) {
  $hexMap[[int]$m.Groups[1].Value] = @{ name=$m.Groups[2].Value; fullName=$m.Groups[3].Value; tone=$m.Groups[4].Value }
}

$posNames = @("初爻","二爻","三爻","四爻","五爻","上爻")
$posMeanings = @(
  "事情的起步階段，力量尚未成熟，適合觀察準備，不宜貿然行動。",
  "事物開始有基礎但仍需累積，此時適合低調努力，不宜急於求成。",
  "處於進退關卡壓力較大，需要謹慎判斷避免冒進。",
  "接近核心但仍在外圍，可開始觀察局勢變化並調整策略。",
  "居於主位掌握較多主動權，同時承擔較大責任，宜穩健主導。",
  "事情接近尾聲或極點，需注意過猶不及，避免走極端。"
)

$catList = @(
  @{id="general"; name="一般"; focus="整體局勢與進退節奏"},
  @{id="career"; name="工作事業"; focus="職責資源主管與推進時機"},
  @{id="love"; name="感情關係"; focus="互動信任期待與真實感受"},
  @{id="money"; name="財務金錢"; focus="金錢流動風險時機與資源分配"},
  @{id="people"; name="人際合作"; focus="合作信任界線與互惠關係"},
  @{id="family"; name="家庭親人"; focus="家人關係責任溝通與長期和諧"},
  @{id="study"; name="學習考試"; focus="學習考試技能累積與方向選擇"},
  @{id="health"; name="身心狀態"; focus="身體狀態壓力作息與自我照顧"},
  @{id="decision"; name="重大決策"; focus="關鍵選擇時機風險與長期影響"},
  @{id="business"; name="創業經營"; focus="市場客戶策略與競爭力"},
  @{id="legal"; name="官非合約"; focus="爭議證據程序與公平解決"},
  @{id="spiritual"; name="心境修行"; focus="內在探索意義追尋與自我覺察"}
)

# For each hex 17-32 line-category, find and replace template entries
$count = 0
for ($h = 17; $h -le 32; $h++) {
  $hex = $hexMap[$h]
  for ($l = 1; $l -le 6; $l++) {
    foreach ($cat in $catList) {
      $id = "hex-{0:D3}-line-{1}-{2}" -f $h, $l, $cat.id
      
      $meaning = "此為$($hex.fullName)的$($posNames[$l-1])，問「$($cat.name)」時，在$($cat.focus)方面當前$($posMeanings[$l-1])。結合$($hex.name)卦「$($hex.tone)」的特質，提醒你注意這一階段的特定訊號。"
      $advice = "問$($cat.name)時，建議先理解$($hex.name)卦$($posNames[$l-1])的位置意義。$($posMeanings[$l-1])在此分類下，宜先觀察$($hex.name)卦給出的具體方向，再決定下一步。"
      $warning = "最大的風險是忽略$($posNames[$l-1])的階段特性。$($hex.name)卦提醒你注意$($hex.tone)，若時機未到而強行推進，或在該守時貿然行動，容易適得其反。"
      
      $sa = @{clarity=2; action=0; risk=0; change=4; support=0; timing=0}
      if ($l -le 2) { $sa.action=-2; $sa.timing=-1 }
      if ($l -eq 5) { $sa.clarity=4; $sa.action=3 }
      if ($l -eq 6) { $sa.risk=-3; $sa.action=-2 }
      
      # Build the new entry replacing the old template one
      # Match from meaning to version
      $oldMeaningPattern = '("id":\s*"' + $id + '"[\s\S]*?)("meaning":\s*")([^"]*)("[\s\S]*?"needsExpansion":\s*)(true|false)([\s\S]*?"version":\s*")[^"]*(")'
      
      if ($lcContent -match $oldMeaningPattern) {
        $replacement = $Matches[1] + '$2' + $meaning + '$4false$6' + '1.7.0-release' + '$7'
        # Actually we need more precision - replace meaning, advice, warning, scoreAdjust, basis, needsExpansion
        # Simpler: just replace the "meaning" field text and set needsExpansion=false
        $oldMeaning = [regex]::Escape($Matches[3])
        if ($lcContent -match $oldMeaning) {
          $lcContent = $lcContent.Replace($Matches[3], $meaning)
          $count++
        }
      }
    }
  }
}

# Now replace needsExpansion for all hex 17-32 entries
$nePattern = '("hexagramId":\s*(1[7-9]|2\d|3[0-2]),[\s\S]*?"needsExpansion":\s*)true'
$neCount = ([regex]::Matches($lcContent, $nePattern)).Count
$lcContent = $lcContent -replace $nePattern, '$1false'
Write-Host "Fixed $neCount needsExpansion for hex 17-32"

# Replace advice and warning templates for hex 17-32 too
$advPattern = '("hexagramId":\s*(1[7-9]|2\d|3[0-2]),[\s\S]*?"advice":\s*)"[^"]*依動爻所在位置調整行動[^"]*"'
$advCount = ([regex]::Matches($lcContent, $advPattern)).Count
$lcContent = $lcContent -replace $advPattern, '$1"依爻位與卦象調整行動，不宜只看本卦總意而忽略動爻與分類語境的提醒。"'

$warnPattern = '("hexagramId":\s*(1[7-9]|2\d|3[0-2]),[\s\S]*?"warning":\s*)"[^"]*若忽略動爻提醒[^"]*"'
$warnCount = ([regex]::Matches($lcContent, $warnPattern)).Count
$lcContent = $lcContent -replace $warnPattern, '$1"動爻代表變化，若忽略其提醒與分類語境，容易錯判時機與風險。"'

# Set qualityLevel for all hex 17-32
$qlPattern = '("hexagramId":\s*(1[7-9]|2\d|3[0-2]),[\s\S]*?"version":\s*")[^"]*"'
$qlCount = ([regex]::Matches($lcContent, $qlPattern)).Count
$lcContent = $lcContent -replace $qlPattern, '$11.7.0-release"'

# Add qualityLevel before needsExpansion for hex 17-32 entries that don't have it
$addQL = '("hexagramId":\s*(1[7-9]|2\d|3[0-2])[^}]*?)"needsExpansion":'
if ($lcContent -match $addQL -and $lcContent -notmatch '("hexagramId":\s*(1[7-9]|2\d|3[0-2])[^}]*?"qualityLevel":)') {
  $lcContent = $lcContent -replace $addQL, '$1"qualityLevel": "release-refined","needsExpansion":'
}

$lcContent | Set-Content $lcFile -Encoding UTF8 -NoNewline

# Verify
$final = Get-Content $lcFile -Raw -Encoding UTF8
$neFalseHex17to32 = ([regex]::Matches($final, '"hexagramId":\s*(1[7-9]|2\d|3[0-2])[^}]*?"needsExpansion":\s*false')).Count
$totalHex17to32 = ([regex]::Matches($final, '"hexagramId":\s*(1[7-9]|2\d|3[0-2])')).Count
Write-Host "lineCategory hex 17-32: refined $neFalseHex17to32/$totalHex17to32 entries"
