# check_golden_test_results.ps1 - Extended golden test verification with mismatches
$dataDir = "D:\AI_PROJECTS\Zero1Matrix\src\data"
$hexContent = Get-Content "$dataDir\hexagrams.data.js" -Raw -Encoding UTF8
$hexJson = $hexContent.Substring($hexContent.IndexOf('= [') + 2, $hexContent.LastIndexOf('];') + 1 - $hexContent.IndexOf('= [') - 2)
$hexagrams = $hexJson | ConvertFrom-Json -Depth 10
$hexByLines = @{}
foreach ($h in $hexagrams) { $hexByLines[($h.lines -join ',')] = $h }

function lv($v) { if ($v -eq 6 -or $v -eq 8) { 0 } else { 1 } }
function cv($v) { if ($v -eq 6) { 1 } elseif ($v -eq 9) { 0 } else { lv $v } }

$tests = Get-Content "D:\AI_PROJECTS\Zero1Matrix\tests\fixtures\golden-reading-cases.todo.json" -Raw -Encoding UTF8 | ConvertFrom-Json -Depth 10

$pass = 0; $fail = 0
$origMismatch = 0; $chgMismatch = 0; $movingMismatch = 0
$failures = @()

foreach ($t in $tests) {
  $orig = @($t.casts | ForEach-Object { lv $_ })
  $chg = @($t.casts | ForEach-Object { cv $_ })
  $chLines = @(0..5 | Where-Object { $t.casts[$_] -eq 6 -or $t.casts[$_] -eq 9 } | ForEach-Object { $_ + 1 })
  
  $oh = $hexByLines[($orig -join ',')]
  $ch = $hexByLines[($chg -join ',')]
  
  $caseFail = $false
  if (-not $oh -or $oh.id -ne $t.expectedOriginalHexagramId) { $origMismatch++; $caseFail = $true }
  if (-not $ch -or $ch.id -ne $t.expectedChangedHexagramId) { $chgMismatch++; $caseFail = $true }
  
  $expectedLines = if ($t.changingLines) { @($t.changingLines) } else { @() }
  if (($chLines -join ',') -ne ($expectedLines -join ',')) { $movingMismatch++; $caseFail = $true }
  
  if ($caseFail) { $fail++ } else { $pass++ }
}

$result = [PSCustomObject]@{
  total = $tests.Count
  passed = $pass
  failed = $fail
  uniqueCasts = ($tests | ForEach-Object { ($_.casts -join ',') } | Sort-Object -Unique).Count
  originalHexagramMismatch = $origMismatch
  changedHexagramMismatch = $chgMismatch
  movingLinesMismatch = $movingMismatch
  testTimestamp = (Get-Date).ToString("yyyy-MM-ddTHH:mm:ss")
}

$resultJson = $result | ConvertTo-Json -Depth 10
$resultJson | Set-Content "D:\AI_PROJECTS\Zero1Matrix\tests\results\golden-test-results.json" -Encoding UTF8
"window.Zero1MatrixGoldenTestResults = $resultJson;" | Set-Content "D:\AI_PROJECTS\Zero1Matrix\tests\results\golden-test-results.data.js" -Encoding UTF8

Write-Host "Golden Tests: $pass/$($tests.Count) PASS"
Write-Host "  Orig mismatch: $origMismatch, Chg mismatch: $chgMismatch, Moving mismatch: $movingMismatch"
Write-Host "  Unique casts: $($result.uniqueCasts)"
exit $(if($fail -eq 0){0}else{1})