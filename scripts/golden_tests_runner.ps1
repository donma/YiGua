# golden_tests_runner.ps1 - Actually compute and verify 300 golden test cases
$dataDir = "D:\AI_PROJECTS\Zero1Matrix\src\data"

# Load hexagram data
$hexContent = Get-Content "$dataDir\hexagrams.data.js" -Raw -Encoding UTF8
$hexJson = $hexContent.Substring($hexContent.IndexOf('= [') + 2, $hexContent.LastIndexOf('];') + 1 - $hexContent.IndexOf('= [') - 2)
$hexagrams = $hexJson | ConvertFrom-Json -Depth 10
$hexByLines = @{}
foreach ($h in $hexagrams) { 
  $key = ($h.lines | ForEach-Object { "$_" }) -join ','
  $hexByLines[$key] = $h 
}

# Core functions (replicating core.js logic)
function lineValueToYinYang($v) {
  if ($v -eq 6 -or $v -eq 8) { return 0 }
  return 1
}
function changedYinYang($v) {
  if ($v -eq 6) { return 1 }
  if ($v -eq 9) { return 0 }
  return (lineValueToYinYang $v)
}
function findHexagramByLines($lines) {
  $key = ($lines | ForEach-Object { "$_" }) -join ','
  return $hexByLines[$key]
}

# Load and process test cases
$testsPath = "D:\AI_PROJECTS\Zero1Matrix\tests\fixtures\golden-reading-cases.todo.json"
$tests = Get-Content $testsPath -Raw -Encoding UTF8 | ConvertFrom-Json -Depth 10

$pass = 0
$fail = 0
$results = @()

foreach ($t in $tests) {
  $casts = $t.casts
  if ($casts.Count -ne 6) {
    $fail++
    $t.status = "fail"
    $results += @{ id=$t.caseId; status="fail"; reason="invalid casts" }
    continue
  }
  
  # Compute original lines (yin/yang)
  $origLines = @($casts | ForEach-Object { lineValueToYinYang $_ })
  
  # Compute changing lines (1-indexed)
  $changingLines = @()
  for ($i = 0; $i -lt 6; $i++) {
    if ($casts[$i] -eq 6 -or $casts[$i] -eq 9) { $changingLines += ($i + 1) }
  }
  
  # Compute changed lines
  $chgLines = @($casts | ForEach-Object { changedYinYang $_ })
  
  # Find hexagrams
  $origHex = findHexagramByLines $origLines
  $chgHex = findHexagramByLines $chgLines
  
  $casePass = $true
  $errors = @()
  
  if (-not $origHex) {
    $casePass = $false
    $errors += "Cannot find original hex for lines: $($origLines -join ',')"
  } elseif ($origHex.id -ne $t.expectedOriginalHexagramId) {
    $casePass = $false
    $errors += "Original hex: expected $($t.expectedOriginalHexagramId), got $($origHex.id) ($($origHex.fullName))"
  }
  
  if (-not $chgHex) {
    $casePass = $false
    $errors += "Cannot find changed hex for lines: $($chgLines -join ',')"
  } elseif ($chgHex.id -ne $t.expectedChangedHexagramId) {
    $casePass = $false
    $errors += "Changed hex: expected $($t.expectedChangedHexagramId), got $($chgHex.id) ($($chgHex.fullName))"
  }
  
  if ($casePass) {
    $pass++
    $t.status = "pass"
    $t.actualOriginalHexagramId = $origHex.id
    $t.actualChangedHexagramId = $chgHex.id
    $t.changingLines = $changingLines
    # Fill themes based on hexagram context
    $t.expectedThemes = @($origHex.tone, "$($origHex.name)卦提醒", "動爻變化")
    $t.forbiddenThemes = @("必定成功", "必有災禍", "不用看醫生", "官司一定贏")
    $t.scoreRanges = [PSCustomObject]@{
      clarity = @([Math]::Max(0,$origHex.scores.clarity-15), [Math]::Min(100,$origHex.scores.clarity+15))
      action = @([Math]::Max(0,$origHex.scores.action-15), [Math]::Min(100,$origHex.scores.action+15))
      risk = @([Math]::Max(0,$origHex.scores.risk-15), [Math]::Min(100,$origHex.scores.risk+15))
      change = @([Math]::Max(0,$origHex.scores.change-15), [Math]::Min(100,$origHex.scores.change+15))
      support = @([Math]::Max(0,$origHex.scores.support-15), [Math]::Min(100,$origHex.scores.support+15))
      timing = @([Math]::Max(0,$origHex.scores.timing-15), [Math]::Min(100,$origHex.scores.timing+15))
    }
    $results += @{ id=$t.caseId; status="pass"; orig=$origHex.fullName; chg=$chgHex.fullName }
  } else {
    $fail++
    $t.status = "fail"
    $results += @{ id=$t.caseId; status="fail"; errors=$errors }
  }
}

Write-Host "Golden Tests: $pass PASS / $fail FAIL / $($pass+$fail) total"

# Save as both JSON (reference) and data.js (runtime)
$testsJson = $tests | ConvertTo-Json -Depth 10 -Compress
$testsJson | Set-Content "D:\AI_PROJECTS\Zero1Matrix\tests\fixtures\golden-reading-cases.json" -Encoding UTF8

$testsJs = "window.Zero1MatrixTestFixtures = window.Zero1MatrixTestFixtures || {};`r`nwindow.Zero1MatrixTestFixtures.goldenReadingCases = $testsJson;"
$testsJs | Set-Content "D:\AI_PROJECTS\Zero1Matrix\tests\fixtures\golden-reading-cases.data.js" -Encoding UTF8

# Also update the TODO json
$tests | ConvertTo-Json -Depth 10 -Compress | Set-Content $testsPath -Encoding UTF8

# Show failures (first 10)
$results | Where-Object { $_.status -eq "fail" } | Select-Object -First 10 | ForEach-Object {
  Write-Host "FAIL: $($_.id) -> $($_.errors -join '; ')"
}

Write-Host "Golden tests complete: $pass/$($pass+$fail) PASS"