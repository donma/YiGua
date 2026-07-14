# run_golden_tests.ps1 - Execute 300 golden tests and output results JSON
$dataDir = "D:\AI_PROJECTS\Zero1Matrix\src\data"
$hexContent = Get-Content "$dataDir\hexagrams.data.js" -Raw -Encoding UTF8
$hexJson = $hexContent.Substring($hexContent.IndexOf('= [') + 2, $hexContent.LastIndexOf('];') + 1 - $hexContent.IndexOf('= [') - 2)
$hexagrams = $hexJson | ConvertFrom-Json -Depth 10
$hexByLines = @{}
foreach ($h in $hexagrams) { $hexByLines[($h.lines -join ',')] = $h }

function lv($v) { if ($v -eq 6 -or $v -eq 8) { 0 } else { 1 } }
function cv($v) { if ($v -eq 6) { 1 } elseif ($v -eq 9) { 0 } else { lv $v } }

$tests = Get-Content "D:\AI_PROJECTS\Zero1Matrix\tests\fixtures\golden-reading-cases.todo.json" -Raw -Encoding UTF8 | ConvertFrom-Json -Depth 10

$pass = 0; $fail = 0; $details = @()

foreach ($t in $tests) {
  $orig = @($t.casts | ForEach-Object { lv $_ })
  $chg = @($t.casts | ForEach-Object { cv $_ })
  $chLines = @(0..5 | Where-Object { $t.casts[$_] -eq 6 -or $t.casts[$_] -eq 9 } | ForEach-Object { $_ + 1 })
  
  $oh = $hexByLines[($orig -join ',')]
  $ch = $hexByLines[($chg -join ',')]
  
  $errors = @()
  if (-not $oh) { $errors += "original hex not found for $($orig -join ',')" }
  elseif ($oh.id -ne $t.expectedOriginalHexagramId) { $errors += "orig: expected $($t.expectedOriginalHexagramId) got $($oh.id)" }
  if (-not $ch) { $errors += "changed hex not found for $($chg -join ',')" }
  elseif ($ch.id -ne $t.expectedChangedHexagramId) { $errors += "chg: expected $($t.expectedChangedHexagramId) got $($ch.id)" }
  
  if ($errors.Count -eq 0) {
    $pass++
  } else {
    $fail++
    $details += @{ caseId=$t.caseId; errors=$errors }
  }
}

$result = [PSCustomObject]@{
  total = $tests.Count
  pass = $pass
  fail = $fail
  uniqueCasts = ($tests | ForEach-Object { ($_.casts -join ',') } | Sort-Object -Unique).Count
  testTimestamp = (Get-Date).ToString("yyyy-MM-ddTHH:mm:ss")
  failures = $details
}

$resultJson = $result | ConvertTo-Json -Depth 10
$resultJson | Set-Content "D:\AI_PROJECTS\Zero1Matrix\tests\results\golden-test-results.json" -Encoding UTF8
Write-Host "Golden tests: $pass/$($tests.Count) PASS"
Write-Host "Exit code: $(if($fail -eq 0){0}else{1})"
if ($fail -gt 0) { exit 1 } else { exit 0 }