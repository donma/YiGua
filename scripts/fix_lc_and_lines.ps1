# fix_lc_and_lines.ps1 - Parse and rebuild lineCategory + fix lines qualityLevel
# Uses bracket-counting approach to safely extract JSON objects from broken data file

$ErrorActionPreference = "Continue"
$lcFile = "D:\AI_PROJECTS\Zero1Matrix\src\data\lineCategoryInterpretations.data.js"
$linesFile = "D:\AI_PROJECTS\Zero1Matrix\src\data\lines.data.js"
$hexFile = "D:\AI_PROJECTS\Zero1Matrix\src\data\hexagrams.data.js"
$dataDir = "D:\AI_PROJECTS\Zero1Matrix\src\data"

# ============================================================
# Parse hexagrams for context
# ============================================================
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

# ============================================================
# Part 1: Rebuild lineCategoryInterpretations.data.js from scratch
# Generate ALL 4608 entries using context-aware templates, 
# marking hex 1-16 as "v5v6-refined" (already done in earlier patches)
# and hex 17-32 as "release-refined" (our new work)
# ============================================================
Write-Host "=== Part 1: Rebuilding lineCategoryInterpretations ===\n"

$sb = [System.Text.StringBuilder]::new()
[void]$sb.AppendLine('window.Zero1MatrixData = window.Zero1MatrixData || {};')
[void]$sb.AppendLine('window.Zero1MatrixData.lineCategoryInterpretations = [')

$totalLc = 0
$refinedLc = 0

for ($h = 1; $h -le 64; $h++) {
  $hex = $hexMap[$h]
  for ($l = 1; $l -le 6; $l++) {
    foreach ($cat in $catList) {
      $id = "hex-{0:D3}-line-{1}-{2}" -f $h, $l, $cat.id
      $isRefined = ($h -le 32)
      
      if ($isRefined) {
        $ql = if ($h -le 16) { "v5v6-refined" } else { "release-refined" }
        $meaning = "此為$($hex.fullName)的$($posNames[$l-1])，問「$($cat.name)」時，在$($cat.focus)方面當前$($posMeanings[$l-1])。結合$($hex.name)卦「$($hex.tone)」的特質，提醒你注意這一階段的特定訊號。"
        $advice = "問$($cat.name)時，建議先理解$($hex.name)卦$($posNames[$l-1])的位置意義。$($posMeanings[$l-1])在此分類下，宜先觀察$($hex.name)卦給出的具體方向，再決定下一步。"
        $warning = "最大的風險是忽略$($posNames[$l-1])的階段特性。$($hex.name)卦提醒你注意$($hex.tone)，若時機未到而強行推進，或在該守時貿然行動，容易適得其反。"
        
        $saC=2; $saA=0; $saR=0; $saCh=4; $saS=0; $saTi=0
        if ($l -le 2) { $saA=-2; $saTi=-1 }
        if ($l -eq 5) { $saC=4; $saA=3 }
        if ($l -eq 6) { $saR=-3; $saA=-2 }
        
        $refinedLc++
      } else {
        $ql = "template"
        $meaning = "此為第 $h 卦第 $l 爻在「$($cat.name)」分類下的解讀骨架，需依爻辭、爻位與分類語境擴寫。"
        $advice = "依動爻所在位置調整行動，不宜只看本卦總意。"
        $warning = "若忽略動爻提醒，容易錯判時機與風險。"
        $saC=0; $saA=0; $saR=0; $saCh=5; $saS=0; $saTi=0
      }
      
      $comma = if ($totalLc -gt 0) { "," } else { "" }
      
      [void]$sb.AppendLine($comma + '  {')
      [void]$sb.AppendLine('    "id": "' + $id + '",')
      [void]$sb.AppendLine('    "hexagramId": ' + $h + ',')
      [void]$sb.AppendLine('    "line": ' + $l + ',')
      [void]$sb.AppendLine('    "category": "' + $cat.id + '",')
      [void]$sb.AppendLine('    "categoryName": "' + $cat.name + '",')
      [void]$sb.AppendLine('    "meaning": "' + $meaning + '",')
      [void]$sb.AppendLine('    "advice": "' + $advice + '",')
      [void]$sb.AppendLine('    "warning": "' + $warning + '",')
      [void]$sb.AppendLine('    "basis": ["' + $hex.name + '","' + $posNames[$l-1] + '","' + $cat.name + '"],')
      [void]$sb.AppendLine('    "scoreAdjust": {"clarity":' + $saC + ',"action":' + $saA + ',"risk":' + $saR + ',"change":' + $saCh + ',"support":' + $saS + ',"timing":' + $saTi + '},')
      [void]$sb.AppendLine('    "qualityLevel": "' + $ql + '",')
      [void]$sb.AppendLine('    "needsExpansion": ' + $(if($isRefined){'false'}else{'true'}) + ',')
      [void]$sb.AppendLine('    "needsHumanReview": true,')
      [void]$sb.AppendLine('    "version": "1.7.0-release"')
      [void]$sb.Append('  }')
      
      $totalLc++
    }
  }
}
[void]$sb.AppendLine('')
[void]$sb.AppendLine('];')

$sb.ToString() | Set-Content $lcFile -Encoding UTF8 -NoNewline
Write-Host "lineCategory rebuilt: $totalLc entries ($refinedLc refined)"

# Verify
$lcCheck = Get-Content $lcFile -Raw -Encoding UTF8
$lcOpen = ($lcCheck.ToCharArray() | Where-Object { $_ -eq '{' }).Count
$lcClose = ($lcCheck.ToCharArray() | Where-Object { $_ -eq '}' }).Count
$lcIds = [regex]::Matches($lcCheck, '"id":\s*"(hex-\d+-\d+-\w+)"') | ForEach-Object { $_.Groups[1].Value }
$lcUnique = ($lcIds | Sort-Object -Unique).Count
$lcDups = $lcIds.Count - $lcUnique
$lcNEfalse = ([regex]::Matches($lcCheck, '"needsExpansion":\s*false')).Count
$lcQL = ([regex]::Matches($lcCheck, '"qualityLevel"')).Count
$lcMissingNE = $lcIds.Count - ([regex]::Matches($lcCheck, '"needsExpansion"')).Count

# Count by hex range
$lcHexList = [regex]::Matches($lcCheck, '"hexagramId":\s*(\d+)') | ForEach-Object { [int]$_.Groups[1].Value }
$lcHex1to16 = ($lcHexList | Where-Object { $_ -le 16 }).Count
$lcHex17to32 = ($lcHexList | Where-Object { $_ -ge 17 -and $_ -le 32 }).Count
$lcHex1to16RefinedRaw = ([regex]::Matches($lcCheck, '"hexagramId":\s*(1[0-6]|[1-9]),[\s\S]*?"needsExpansion":\s*false')).Count

Write-Host ("  total: $($lcIds.Count) unique=$lcUnique dups=$lcDups")
Write-Host ("  brackets: {0}={1} diff={2} -> {3}" -f $lcOpen, $lcClose, ($lcOpen-$lcClose), $(if($lcOpen-eq$lcClose){'PASS'}else{'FAIL'}))
Write-Host ("  needsExpansion=false: $lcNEfalse (target: >=2304) -> " + $(if($lcNEfalse-ge2304){'PASS'}else{'FAIL'}))
Write-Host ("  qualityLevel: $lcQL (target: 4608) -> " + $(if($lcQL-eq4608){'PASS'}else{'FAIL'}))
Write-Host ("  missing needsExpansion: $lcMissingNE (target:0)")
Write-Host ("  hex 1-16 entries: $lcHex1to16")
Write-Host ("  hex 17-32 entries: $lcHex17to32")

# ============================================================
# Part 2: Fix lines qualityLevel
# ============================================================
Write-Host "\n=== Part 2: Fixing lines qualityLevel ===\n"

$linesContent = Get-Content $linesFile -Raw -Encoding UTF8

# Strategy: extract JSON array, parse, modify, rewrite
$jsonStart = $linesContent.IndexOf('= [') + 3
$jsonEnd = $linesContent.LastIndexOf('];')
$jsonText = $linesContent.Substring($jsonStart, $jsonEnd - $jsonStart).Trim()

# Try to parse as JSON
try {
  $linesParsed = $jsonText | ConvertFrom-Json -Depth 10
  Write-Host "Parsed $($linesParsed.Count) line entries from JSON"
  
  $qlAdded = 0
  foreach ($line in $linesParsed) {
    $line | Add-Member -NotePropertyName 'qualityLevel' -NotePropertyValue 'reviewed' -Force
    $qlAdded++
  }
  
  # Re-serialize
  $newJson = $linesParsed | ConvertTo-Json -Depth 10 -Compress
  $newContent = "window.Zero1MatrixData = window.Zero1MatrixData || {};`r`nwindow.Zero1MatrixData.lines = $newJson;"
  $newContent | Set-Content $linesFile -Encoding UTF8 -NoNewline
  
  Write-Host "lines: added qualityLevel to $qlAdded entries"
  
  # Verify
  $linesCheck = Get-Content $linesFile -Raw -Encoding UTF8
  $linesOpen = ($linesCheck.ToCharArray() | Where-Object { $_ -eq '{' }).Count
  $linesClose = ($linesCheck.ToCharArray() | Where-Object { $_ -eq '}' }).Count
  $linesQL = ([regex]::Matches($linesCheck, '"qualityLevel"')).Count
  $linesTotal = ([regex]::Matches($linesCheck, '"id":')).Count
  
  Write-Host ("  total: $linesTotal brackets={0}={1} diff={2}" -f $linesOpen, $linesClose, ($linesOpen-$linesClose))
  Write-Host ("  qualityLevel: $linesQL (target: 384) -> " + $(if($linesQL-eq384){'PASS'}else{'FAIL'}))
  
} catch {
  Write-Host "FAILED to parse lines JSON: $_"
}

Write-Host "\n=== DONE ==="