# run_score_calibration_v2.ps1 - Fixed: reproducibility + hex-matched category + all metrics
$dataDir = "D:\AI_PROJECTS\Zero1Matrix\src\data"
$ErrorActionPreference = "Continue"

# Load data
$hexContent = Get-Content "$dataDir\hexagrams.data.js" -Raw -Encoding UTF8
$hexJson = $hexContent.Substring($hexContent.IndexOf('= [') + 2, $hexContent.LastIndexOf('];') + 1 - $hexContent.IndexOf('= [') - 2)
$hexagrams = $hexJson | ConvertFrom-Json -Depth 10
$hexByLines = @{}; $hexById = @{}
foreach ($h in $hexagrams) { $hexByLines[($h.lines -join ',')] = $h; $hexById[$h.id] = $h }

$ciContent = Get-Content "$dataDir\categoryInterpretations.data.js" -Raw -Encoding UTF8
$ciJson = $ciContent.Substring($ciContent.IndexOf('= [') + 2, $ciContent.LastIndexOf('];') + 1 - $ciContent.IndexOf('= [') - 2)
$categories = $ciJson | ConvertFrom-Json -Depth 10
# Index by hex+category
$catIndex = @{}
foreach ($c in $categories) { $catIndex["$($c.hexagramId)-$($c.category)"] = $c }

$pairContent = Get-Content "$dataDir\pairInterpretations.data.js" -Raw -Encoding UTF8
$pairJson = $pairContent.Substring($pairContent.IndexOf('= [') + 2, $pairContent.LastIndexOf('];') + 1 - $pairContent.IndexOf('= [') - 2)
$pairs = $pairJson | ConvertFrom-Json -Depth 10
$pairIndex = @{}
foreach ($p in $pairs) { $pairIndex["$($p.from)-$($p.to)"] = $p }

function lv($v) { if ($v -eq 6 -or $v -eq 8) { 0 } else { 1 } }
function cv($v) { if ($v -eq 6) { 1 } elseif ($v -eq 9) { 0 } else { lv $v } }
function clamp($v) { return [Math]::Max(0, [Math]::Min(100, [Math]::Round($v))) }

function computeScore($hex, $chHex, $vals, $cat, $pair) {
  $chCount = @(0..5 | Where-Object { $vals[$_] -eq 6 -or $vals[$_] -eq 9 }).Count
  $scores = @{}
  foreach ($dim in @("clarity","action","risk","change","support","timing")) {
    $base = $hex.scores.$dim
    $adj = if ($cat -and $cat.scoreAdjust -and $cat.scoreAdjust.$dim) { $cat.scoreAdjust.$dim } else { 0 }
    $pairAdj = if ($pair -and $pair.scoreAdjust -and $pair.scoreAdjust.$dim) { $pair.scoreAdjust.$dim } else { 0 }
    $chgAdj = if ($dim -eq "change") { $chCount * 7 } elseif ($dim -eq "risk") { [Math]::Max(0, $chCount - 2) * 5 } else { 0 }
    $scores.$dim = clamp($base + $adj + $pairAdj + $chgAdj)
  }
  return $scores
}

$dims = @("clarity","action","risk","change","support","timing")
$catIds = @("general","career","love","money","people","family","study","health","decision","business","legal","spiritual")

# --- PHASE 1: Reproducibility test (100 fixed inputs, run twice) ---
Write-Host "=== Phase 1: Reproducibility ==="
$repCases = @()
$rng = New-Object System.Random(42)
for ($i = 0; $i -lt 100; $i++) {
  $vals = @(0..5 | ForEach-Object { @(6,7,8,9)[$rng.Next(4)] })
  $orig = @($vals | ForEach-Object { lv $_ })
  $chg = @($vals | ForEach-Object { cv $_ })
  $oh = $hexByLines[($orig -join ',')]
  $ch = $hexByLines[($chg -join ',')]
  if (-not $oh -or -not $ch) { continue }
  $catId = $catIds[$i % 12]
  $repCases += @{ vals=$vals; catId=$catId; ohId=$oh.id; chId=$ch.id }
}
Write-Host "  Created $($repCases.Count) reproducibility test cases"

# Run twice and compare
$repFailures = 0
for ($passNum = 1; $passNum -le 2; $passNum++) {
  $results = @()
  foreach ($c in $repCases) {
    $cat = $catIndex["$($c.ohId)-$($c.catId)"]
    if (-not $cat) { $cat = $catIndex["1-$($c.catId)"] } # fallback
    $oh = $hexById[$c.ohId]; $ch = $hexById[$c.chId]
    $pair = $pairIndex["$($c.ohId)-$($c.chId)"]
    $results += ,(computeScore $oh $ch $c.vals $cat $pair)
  }
  if ($passNum -eq 1) { $pass1Results = $results }
  else {
    for ($i = 0; $i -lt $results.Count; $i++) {
      foreach ($d in $dims) {
        if ($pass1Results[$i].$d -ne $results[$i].$d) {
          $repFailures++
          break
        }
      }
    }
  }
}
Write-Host "  Reproducibility failures: $repFailures / $($repCases.Count)"

# --- PHASE 2: 10,000 random calibration ---
Write-Host "=== Phase 2: 10,000 Calibration ==="
$rng2 = New-Object System.Random(12345) # deterministic for reproducibility within run
$stats = @{}; foreach ($d in $dims) { $stats[$d] = @() }
$nanCount = 0; $undefinedCount = 0; $outOfRange = 0; $missingCatCount = 0

for ($i = 0; $i -lt 10000; $i++) {
  $vals = @(0..5 | ForEach-Object { @(6,7,8,9)[$rng2.Next(4)] })
  $catId = $catIds[$i % 12]
  $orig = @($vals | ForEach-Object { lv $_ })
  $chg = @($vals | ForEach-Object { cv $_ })
  $oh = $hexByLines[($orig -join ',')]
  $ch = $hexByLines[($chg -join ',')]
  if (-not $oh -or -not $ch) { continue }
  
  $cat = $catIndex["$($oh.id)-$catId"]
  if (-not $cat) { $missingCatCount++; continue }
  
  $pair = $pairIndex["$($oh.id)-$($ch.id)"]
  $scores = computeScore $oh $ch $vals $cat $pair
  
  foreach ($d in $dims) {
    $v = $scores.$d
    if ($v -eq $null) { $undefinedCount++; continue }
    if ([double]::IsNaN($v)) { $nanCount++; continue }
    if ($v -lt 0 -or $v -gt 100) { $outOfRange++; continue }
    $stats[$d] += $v
  }
}

Write-Host "  NaN: $nanCount, Undefined: $undefinedCount, OutOfRange: $outOfRange, MissingCategory: $missingCatCount"

# --- Build result ---
$result = [PSCustomObject]@{
  totalCasts = 10000
  calibrationTimestamp = (Get-Date).ToString("yyyy-MM-ddTHH:mm:ss")
  nanCount = $nanCount
  undefinedCount = $undefinedCount
  outOfRangeCount = $outOfRange
  missingCategoryRecords = $missingCatCount
  reproducibilityCases = $repCases.Count
  reproducibilityFailures = $repFailures
  dimensions = [PSCustomObject]@{}
  status = "PASS"
}

foreach ($d in $dims) {
  $vals = $stats[$d]
  $n = $vals.Count
  if ($n -eq 0) { $result.dimensions | Add-Member -NotePropertyName $d -NotePropertyValue ([PSCustomObject]@{count=0; mean=0; stdDev=0; min=0; max=0; under10Ratio=0; over90Ratio=0; bandConcentration=0}); continue }
  $mean = ($vals | Measure-Object -Average).Average
  $min = ($vals | Measure-Object -Minimum).Minimum
  $max = ($vals | Measure-Object -Maximum).Maximum
  $stdDev = if ($n -gt 1) { $avg=$mean; [Math]::Sqrt(($vals | ForEach-Object { [Math]::Pow($_ - $avg, 2) } | Measure-Object -Sum).Sum / ($n - 1)) } else { 0 }
  $under10 = ($vals | Where-Object { $_ -lt 10 }).Count
  $over90 = ($vals | Where-Object { $_ -gt 90 }).Count
  # Band concentration: max % in any 10-point band
  $bands = @{}
  foreach ($v in $vals) { $b = [Math]::Floor($v / 10) * 10; $bands[$b] = ($bands[$b] || 0) + 1 }
  $maxBand = if ($bands.Count -gt 0) { ($bands.Values | Measure-Object -Maximum).Maximum } else { 0 }
  $bandConc = if ($n -gt 0) { [Math]::Round($maxBand * 100.0 / $n, 1) } else { 0 }
  
  $result.dimensions | Add-Member -NotePropertyName $d -NotePropertyValue ([PSCustomObject]@{
    count = $n
    mean = [Math]::Round($mean, 2)
    standardDeviation = [Math]::Round($stdDev, 2)
    min = $min
    max = $max
    under10Ratio = [Math]::Round($under10 * 100.0 / $n, 2)
    over90Ratio = [Math]::Round($over90 * 100.0 / $n, 2)
    bandConcentrationPercent = $bandConc
  })
}

# Status logic
if ($nanCount -gt 0 -or $undefinedCount -gt 0 -or $outOfRange -gt 0 -or $missingCatCount -gt 0 -or $repFailures -gt 0) {
  $result.status = "FAIL"
} else {
  $warn = $false
  foreach ($d in $dims) {
    $s = $result.dimensions.$d
    if ($s.standardDeviation -lt 5) { $warn = $true }
    if ($s.bandConcentrationPercent -gt 70) { $warn = $true }
  }
  if ($warn) { $result.status = "WARN" }
}

$resultJson = $result | ConvertTo-Json -Depth 10
$resultJson | Set-Content "D:\AI_PROJECTS\Zero1Matrix\tests\results\score-calibration-results.json" -Encoding UTF8
"window.Zero1MatrixScoreCalibration = $resultJson;" | Set-Content "D:\AI_PROJECTS\Zero1Matrix\tests\results\score-calibration-results.data.js" -Encoding UTF8

Write-Host "`n=== Score Calibration Results ==="
Write-Host "Status: $($result.status)"
Write-Host "Reproducibility: $repFailures/$($repCases.Count) failures"
foreach ($d in $dims) {
  $s = $result.dimensions.$d
  Write-Host ("  {0,-10} n={1,4} mean={2,6:F1} std={3,5:F1} bandConc={4,5:F1}%" -f $d, $s.count, $s.mean, $s.standardDeviation, $s.bandConcentrationPercent)
}
exit $(if($result.status -eq "FAIL"){1}else{0})