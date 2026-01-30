<#
.\send_test_push.ps1
# Usage examples:
#   $env:API_BASE = 'https://localhost:4000'; $env:API_TOKEN = '<token>'; $env:WORKORDER_ID = '<wo-id>'; .\send_test_push.ps1
#   $env:API_BASE = 'https://localhost:4000'; $env:NIPP='1960324618'; $env:PASS='secret'; $env:WORKORDER_ID='<wo-id>'; $env:DEVICE_TOKEN='<fcm-token>'; .\send_test_push.ps1
#>

param()

$API_BASE = $env:API_BASE
if (-not $API_BASE) { $API_BASE = 'http://localhost:4000' }
$API_TOKEN = $env:API_TOKEN
$NIPP = $env:NIPP
$PASS = $env:PASS
$WORKORDER_ID = $env:WORKORDER_ID
$DEVICE_TOKEN = $env:DEVICE_TOKEN

if (-not $WORKORDER_ID) {
    Write-Error 'WORKORDER_ID is required. Set env var and retry.'
    exit 1
}

if (-not $API_TOKEN) {
    if ($NIPP -and $PASS) {
        Write-Host 'Logging in to obtain API token...'
        $body = @{ nipp = $NIPP; password = $PASS } | ConvertTo-Json
        $resp = Invoke-RestMethod -Method Post -Uri "$API_BASE/api/auth/login" -Body $body -ContentType 'application/json' -ErrorAction Stop
        $API_TOKEN = $resp.accessToken
        if (-not $API_TOKEN) { $API_TOKEN = $resp.token }
        if (-not $API_TOKEN) { Write-Error "Failed to login. Response: $($resp | ConvertTo-Json -Depth 1)"; exit 1 }
        Write-Host 'Got API token.'
    } else {
        Write-Error 'Provide API_TOKEN or NIPP+PASS to login. Aborting.'
        exit 1
    }
}

$headers = @{ Authorization = "Bearer $API_TOKEN" }

if ($DEVICE_TOKEN) {
    Write-Host 'Registering device token...'
    $d = @{ token = $DEVICE_TOKEN; platform = 'android' } | ConvertTo-Json
    try {
        $r = Invoke-RestMethod -Method Post -Uri "$API_BASE/api/device-tokens" -Headers $headers -Body $d -ContentType 'application/json' -ErrorAction Stop
        $r | ConvertTo-Json -Depth 3
    } catch {
        Write-Warning "Register device token failed: $_"
    }
}

Write-Host "Triggering deploy for work order $WORKORDER_ID..."
try {
    $r2 = Invoke-RestMethod -Method Post -Uri "$API_BASE/api/work-orders/$WORKORDER_ID/deploy" -Headers $headers -Body '{}' -ContentType 'application/json' -ErrorAction Stop
    $r2 | ConvertTo-Json -Depth 3
} catch {
    Write-Error "Deploy call failed: $_"
}

Write-Host 'Done. Check backend logs for pushNotify output and device for notifications.'
