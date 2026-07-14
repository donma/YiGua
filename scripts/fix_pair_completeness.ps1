# fix_pair_completeness.ps1 - Insert missing 48 pair entries + fix missing fields
$pairFile = "D:\AI_PROJECTS\Zero1Matrix\src\data\pairInterpretations.data.js"
$hexFile = "D:\AI_PROJECTS\Zero1Matrix\src\data\hexagrams.data.js"

$pairContent = Get-Content $pairFile -Raw -Encoding UTF8
$hexContent = Get-Content $hexFile -Raw -Encoding UTF8

# Parse hexagram names
$hexMap = @{}
$hPattern = '"id":\s*(\d+)[\s\S]*?"name":\s*"([^"]+)"[\s\S]*?"fullName":\s*"([^"]+)"[\s\S]*?"tone":\s*"([^"]+)"'
$hMatches = [regex]::Matches($hexContent, $hPattern)
foreach ($m in $hMatches) {
  $hid = [int]$m.Groups[1].Value
  $hexMap[$hid] = @{
    name = $m.Groups[2].Value
    fullName = $m.Groups[3].Value
    tone = $m.Groups[4].Value
  }
}

# Missing 48 IDs
$missing = @(
  "pair-003-009","pair-003-012","pair-003-013","pair-003-016","pair-003-064",
  "pair-004-001","pair-004-002","pair-004-003","pair-004-009","pair-004-012","pair-004-013","pair-004-016",
  "pair-005-009","pair-005-012","pair-005-013","pair-005-016","pair-005-064",
  "pair-006-001","pair-006-002","pair-006-003","pair-006-009","pair-006-012","pair-006-013","pair-006-016","pair-006-064",
  "pair-007-001","pair-007-002","pair-007-003","pair-007-009","pair-007-012","pair-007-013","pair-007-016","pair-007-064",
  "pair-008-001","pair-008-002","pair-008-003","pair-008-012","pair-008-013","pair-008-016","pair-008-064",
  "pair-009-001","pair-009-016",
  "pair-010-012","pair-010-013","pair-010-016",
  "pair-015-009","pair-015-012","pair-015-013"
)

# Generate template entries for missing pairs
$newEntries = @()
foreach ($mid in $missing) {
  $mid -match 'pair-(\d+)-(\d+)' | Out-Null
  $from = [int]$Matches[1]
  $to = [int]$Matches[2]
  
  $f = if ($hexMap.ContainsKey($from)) { $hexMap[$from] } else { @{name='?';fullName='?'} }
  $t = if ($hexMap.ContainsKey($to)) { $hexMap[$to] } else { @{name='?';fullName='?'} }
  
  if ($from -eq $to) {
    $type = "本卦不變"
    $summary = "$($f.fullName)不變，表示此事目前核心課題穩定，宜重點看本卦與分類解讀。"
    $scoreChange = 0
  } else {
    $type = "由$($f.tone)轉向$($t.tone)"
    $summary = "本卦由$($f.fullName)轉為$($t.fullName)，表示局勢從「$($f.tone)」逐步轉向「$($t.tone)」。"
    $scoreChange = 8
  }

  $entry = @"
  {
    "id": "$mid",
    "from": $from,
    "to": $to,
    "type": "$type",
    "summary": "$summary",
    "advice": "看本卦以辨現況，看變卦以辨後勢。行動上宜先處理本卦指出的當前課題，再順勢調整。",
    "risk": "若只追求變卦的結果，而不處理本卦的問題，容易造成判斷跳躍。",
    "basis": [
      "$($f.name)",
      "$($t.name)",
      "本卦變卦關係"
    ],
    "scoreAdjust": {
      "clarity": 0,
      "action": 0,
      "risk": 0,
      "change": $scoreChange,
      "support": 0,
      "timing": 0
    },
    "needsExpansion": true,
    "needsHumanReview": true,
    "version": "1.0.0"
  }
"@
  $newEntries += $entry
}

Write-Host "Generated $($newEntries.Count) missing entries"

# Insert entries at appropriate positions (right before the closing ])
# Find the last entry before the closing ]
$insertPos = $pairContent.LastIndexOf('}')
$insertPos = $pairContent.LastIndexOf('}', $insertPos - 1) # Second to last }
# Actually, insert before final ]; 
$closingBracket = $pairContent.LastIndexOf('];')
if ($closingBracket -lt 0) { $closingBracket = $pairContent.LastIndexOf(']') }

$insertText = "," + "`r`n" + ($newEntries -join ",`r`n")
$pairContent = $pairContent.Insert($closingBracket, $insertText)

# Now fix entries missing needsExpansion field
# Find entries that end with "version": "X.X.X"\n  } without needsExpansion before version
$versionPattern = '("version":\s*"[^"]*")(\r?\n\s*\})'
$versionMatches = [regex]::Matches($pairContent, $versionPattern)
$fixCount = 0
foreach ($m in $versionMatches) {
  # Check if the preceding 200 chars contain needsExpansion
  $start = [Math]::Max(0, $m.Index - 300)
  $len = $m.Index - $start
  $context = $pairContent.Substring($start, $len)
  if ($context -notmatch '"needsExpansion"') {
    # This entry has no needsExpansion - add it
    # Find the actual position in the full string
    $exactPos = $m.Index
    # Insert needsExpansion and needsHumanReview if missing before version
    $insertFields = ""
    if ($context -notmatch '"needsHumanReview"') {
      $insertFields = '    "needsExpansion": true,' + "`r`n" + '    "needsHumanReview": true,' + "`r`n" + '    '
    } else {
      $insertFields = '    "needsExpansion": true,' + "`r`n" + '    '
    }
    $pairContent = $pairContent.Insert($exactPos, $insertFields)
    $fixCount++
  } elseif ($context -notmatch '"needsHumanReview"') {
    # Has needsExpansion but missing needsHumanReview
    $exactPos = $m.Index
    $pairContent = $pairContent.Insert($exactPos, '    "needsHumanReview": true,' + "`r`n" + '    ')
    $fixCount++
  }
}

Write-Host "Fixed $fixCount entries missing needsExpansion or needsHumanReview"

$pairContent | Set-Content $pairFile -Encoding UTF8 -NoNewline
Write-Host "Saved."
