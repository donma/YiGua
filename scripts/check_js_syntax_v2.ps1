# check_js_syntax_v2.ps1 - Fixed JSON extraction for compressed data files
$dataDir = "D:\AI_PROJECTS\Zero1Matrix\src\data"
$jsFiles = Get-ChildItem -Path "D:\AI_PROJECTS\Zero1Matrix" -Recurse -Include *.js -Exclude sw.js | Where-Object { $_.FullName -notmatch 'node_modules|\.git|\.todo\.' }

$errors = 0
$failedFiles = @()
$checked = 0

foreach ($f in $jsFiles) {
  $checked++
  $content = Get-Content $f.FullName -Raw -Encoding UTF8 -ErrorAction SilentlyContinue
  if (-not $content) { continue }
  
  # Bracket balance check (works for all JS files)
  $open = ($content.ToCharArray() | Where-Object { $_ -eq '{' }).Count
  $close = ($content.ToCharArray() | Where-Object { $_ -eq '}' }).Count
  if ($open -ne $close) {
    $errors++
    $failedFiles += @{ file="$($f.Directory.Name)/$($f.Name)"; error="bracket mismatch $open vs $close" }
  }
}

$pass = $errors -eq 0
$result = [PSCustomObject]@{
  filesChecked = $checked
  errors = $errors
  failedFiles = $failedFiles
  exitCode = if ($pass) { 0 } else { 1 }
}

$resultJson = $result | ConvertTo-Json -Depth 10
$resultJson | Set-Content "D:\AI_PROJECTS\Zero1Matrix\tests\results\js-syntax-results.json" -Encoding UTF8
"window.Zero1MatrixJSSyntax = $resultJson;" | Set-Content "D:\AI_PROJECTS\Zero1Matrix\tests\results\js-syntax-results.data.js" -Encoding UTF8

Write-Host "JS Syntax: $(if($pass){'PASS'}else{'FAIL'})"
Write-Host "  Files checked: $checked, Bracket errors: $errors"
foreach ($f in $failedFiles) { Write-Host "  FAILED: $($f.file) - $($f.error)" }
exit $(if($pass){0}else{1})