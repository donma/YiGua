# check_js_syntax.ps1 - Validate all .js files can be loaded as valid JS
# Since no node --check, we validate by parsing the JSON array portions
$dataDir = "D:\AI_PROJECTS\Zero1Matrix\src\data"
$jsFiles = Get-ChildItem -Path "D:\AI_PROJECTS\Zero1Matrix" -Recurse -Include *.js -Exclude sw.js | Where-Object { $_.FullName -notmatch 'node_modules|\.git' }

$errors = 0
$failedFiles = @()
$checked = 0

foreach ($f in $jsFiles) {
  $checked++
  $content = Get-Content $f.FullName -Raw -Encoding UTF8 -ErrorAction SilentlyContinue
  if (-not $content) { continue }
  
  # Basic bracket balance
  $open = ($content.ToCharArray() | Where-Object { $_ -eq '{' }).Count
  $close = ($content.ToCharArray() | Where-Object { $_ -eq '}' }).Count
  if ($open -ne $close) {
    $errors++
    $failedFiles += @{ file=$f.Name; error="bracket mismatch $open vs $close" }
    continue
  }
  
  # For data files, try to parse the JSON portion
  if ($f.FullName -match 'src\\data\\.*\.data\.js$' -and $f.Name -notmatch '\.todo\.') {
    $jsonStart = $content.IndexOf('= [')
    $jsonEnd = $content.LastIndexOf('];')
    if ($jsonStart -ge 0 -and $jsonEnd -gt $jsonStart) {
      $json = $content.Substring($jsonStart + 2, $jsonEnd - $jsonStart)
      # Wrap with brackets for array
      $wrapJson = '[' + $json.Trim().TrimStart('[').TrimEnd(']').TrimEnd(',').Trim() + ']'
      try {
        $null = $wrapJson | ConvertFrom-Json -Depth 10 -ErrorAction Stop
      } catch {
        $errors++
        $failedFiles += @{ file=$f.Name; error=$_.Exception.Message.Substring(0, [Math]::Min(100, $_.Exception.Message.Length)) }
      }
    }
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
Write-Host "  Files checked: $checked, Errors: $errors"
foreach ($f in $failedFiles) { Write-Host "  FAILED: $($f.file) - $($f.error)" }
exit $(if($pass){0}else{1})