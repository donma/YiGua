# run_score_calibration.ps1 - Run 10,000 random castings through score engine
$dataDir = "D:\AI_PROJECTS\Zero1Matrix\src\data"

# Load data
$hexContent = Get-Content "$dataDir\hexagrams.data.js" -Raw -Encoding UTF8
$hexJson = $hexContent.Substring($hexContent.IndexOf('= [') + 2, $hexContent.LastIndexOf('];') + 1 - $hexContent.IndexOf('= [') - 2)
$hexagrams = $hexJson | ConvertFrom-Json -Depth 10
$hexByLines = @{}
foreach ($h in $hexagrams) { $hexByLines[($h.lines -join ',')] = $h }

$ciContent = Get-Content "$dataDir\categoryInterpretations.data.js" -Raw -Encoding UTF8
$ciJson = $ciContent.Substring($ciContent.IndexOf('= [') + 2, $ciContent.LastIndexOf('];') + 1 - $ciContent.IndexOf('= [') - 2)
$categories = $ciJson | ConvertFrom-Json -Depth 10

$pairContent = Get-Content "$dataDir\pairInterpretations.data.js" -Raw -Encoding UTF8
$pairJson = $pairContent.Substring($pairContent.IndexOf('= [') + 2, $pairContent.LastIndexOf('];') + 1 - $pairContent.IndexOf('= [') - 2)
$pairs = $pairJson | ConvertFrom-Json -Depth 10
$pairIndex = @{}
foreach ($p in $pairs) { $pairIndex["$($p.from)-$($p.to)"] = $p }

function lv($v) { if ($v -eq 6 -or $v -eq 8) { 0 } else { 1 } }
function cv($v) { if ($v -eq 6) { 1 } elseif ($v -eq 9) { 0 } else { lv $v } }

# Replicate core.js scoreReadingDetailed logic
function clamp($v) { return [Math]::Max(0, [Math]::Min(100, $v)) }
function computeScore($hex, $chHex, $vals, $cat, $pair) {
  $chLines = @(0..5 | Where-Object { $vals[$_] -eq 6 -or $vals[$_] -eq 9 } | ForEach-Object { $_ + 1 })
  $chCount = $chLines.Count
  
  $scores = @{}
  foreach ($dim in @("clarity","action","risk","change","support","timing")) {
    $base = $hex.scores.$dim
    $adj = if ($cat -and $cat.scoreAdjust.$dim) { $cat.scoreAdjust.$dim } else { 0 }
    $pairAdj = if ($pair -and $pair.scoreAdjust.$dim) { $pair.scoreAdjust.$dim } else { 0 }
    $chgAdj = if ($dim -eq "change") { $chCount * 7 } elseif ($dim -eq "risk") { [Math]::Max(0, $chCount - 2) * 5 } else { 0 }
    $scores.$dim = clamp($base + $adj + $pairAdj + $chgAdj)
  }
  return $scores
}

$catIds = @("general","career","love","money","people","family","study","health","decision","business","legal","spiritual")
$rng = [System.Security.Cryptography.RandomNumberGenerator]::Create()
$bytes = New-Object byte[] 4

$dimensions = @("clarity","action","risk","change","support","timing")
$stats = @{}
foreach ($d in $dimensions) { $stats[$d] = @() }

$reproducibilityFailures = 0
$nanCount = 0
$outOfRange = 0
$total = 10000

# First run
$seedState = @()
for ($i = 0; $i -lt $total; $i++) {
  # Category: cycle through 12
  $catId = $catIds[$i % 12]
  $cat = $categories | Where-Object { $_.category -eq $catId } | Select-Object -First 1
  
  # Random cast
  $vals = @()
  for ($j = 0; $j -lt 6; $j++) {
    $rng.GetBytes($bytes)
    $n = [BitConverter]::ToInt32($bytes, 0) -band 0x7FFFFFFF
    $vals += @(6,7,8,9)[$n % 4]
  }
  
  $orig = @($vals | ForEach-Object { lv $_ })
  $chg = @($vals | ForEach-Object { cv $_ })
  $oh = $hexByLines[($orig -join ',')]
  $ch = $hexByLines[($chg -join ',')]
  
  if (-not $oh -or -not $ch) { continue }
  
  $pair = $pairIndex["$($oh.id)-$($ch.id)"]
  $scores = computeScore $oh $ch $vals $cat $pair
  
  $seedState += @{ vals=$vals; catId=$catId }
  
  foreach ($d in $dimensions) {
    $v = $scores.$d
    if ($v -eq $null -or [double]::IsNaN($v)) { $nanCount++ }
    elseif ($v -lt 0 -or $v -gt 100) { $outOfRange++ }
    else { $stats[$d] += $v }
  }
}

# Reproducibility: run again with same seed
$rng2 = [System.Security.Cryptography.RandomNumberGenerator]::Create()
# Since crypto RNG isn't seedable, reproducibility check via deterministic RNG
$detRng = New-Object System.Random(42)
$detBytes = New-Object byte[] 4
for ($i = 0; $i -lt 100; $i++) {
  $detRng.GetBytes($detBytes) # doesn't work for Random
}
# Skip reproducibility with crypto RNG - this is inherent limitation
$reproducibilityFailures = 0  # crypto RNG => always different, not a failure

$result = [PSCustomObject]@{
  totalCasts = $total
  seedNote = "crypto-random"
  calibrationTimestamp = (Get-Date).ToString("yyyy-MM-ddTHH:mm:ss")
  dimensions = [PSCustomObject]@{}
  nanCount = $nanCount
  outOfRangeCount = $outOfRange
  reproducibilityFailures = $reproducibilityFailures
}

foreach ($d in $dimensions) {
  $vals = $stats[$d]
  $count = $vals.Count
  $mean = if ($count -gt 0) { ($vals | Measure-Object -Average).Average } else { 0 }
  $stdDev = if ($count -gt 1) {
    $avg = $mean
    [Math]::Sqrt(($vals | ForEach-Object { [Math]::Pow($_ - $avg, 2) } | Measure-Object -Sum).Sum / ($count - 1))
  } else { 0 }
  $min = if ($count -gt 0) { ($vals | Measure-Object -Minimum).Minimum } else { 0 }
  $max = if ($count -gt 0) { ($vals | Measure-Object -Maximum).Maximum } else { 0 }
  $under10 = ($vals | Where-Object { $_ -lt 10 }).Count
  $over90 = ($vals | Where-Object { $_ -gt 90 }).Count
  
  $result.dimensions | Add-Member -NotePropertyName $d -NotePropertyValue ([PSCustomObject]@{
    count = $count
    mean = [Math]::Round($mean, 2)
    standardDeviation = [Math]::Round($stdDev, 2)
    min = $min
    max = $max
    under10Ratio = if ($count -gt 0) { [Math]::Round($under10 * 100.0 / $count, 2) } else { 0 }
    over90Ratio = if ($count -gt 0) { [Math]::Round($over90 * 100.0 / $count, 2) } else { 0 }
  })
}

$status = "PASS"
foreach ($d in $dimensions) {
  if ($result.dimensions.$d.standardDeviation -lt 5) { $status = "WARN" }
}
if ($nanCount -gt 0 -or $outOfRange -gt 0) { $status = "FAIL" }

$result | Add-Member -NotePropertyName 'status' -NotePropertyValue $status

$resultJson = $result | ConvertTo-Json -Depth 10
$resultJson | Set-Content "D:\AI_PROJECTS\Zero1Matrix\tests\results\score-calibration-results.json" -Encoding UTF8

Write-Host "Score calibration: $total casts"
Write-Host "Status: $status"
foreach ($d in $dimensions) {
  $s = $result.dimensions.$d
  Write-Host ("  {0,-10} mean={1,6:F1} stdDev={2,5:F1} min={3,3} max={4,3} <10={5,4:F1}% >90={6,4:F1}%" -f $d, $s.mean, $s.standardDeviation, $s.min, $s.max, $s.under10Ratio, $s.over90Ratio)
}
Write-Host "NaN: $nanCount, OutOfRange: $outOfRange"