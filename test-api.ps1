# Test Health Check
Write-Host "Testing Health Check..."
$response = Invoke-WebRequest -Uri "http://localhost:5000/api/health" -UseBasicParsing -ErrorAction SilentlyContinue
if ($response) {
    Write-Host "✅ Health Check: $($response.StatusCode) - $($response.StatusDescription)"
    Write-Host $response.Content
} else {
    Write-Host "❌ Health Check: Failed to connect"
}

# Test Hospitals Endpoint
Write-Host "\nTesting Hospitals Endpoint..."
$response = Invoke-WebRequest -Uri "http://localhost:5000/api/hospitals" -UseBasicParsing -ErrorAction SilentlyContinue
if ($response) {
    Write-Host "✅ Hospitals Endpoint: $($response.StatusCode) - $($response.StatusDescription)"
    $response.Content | ConvertFrom-Json | ConvertTo-Json -Depth 3 | Write-Host
} else {
    Write-Host "❌ Hospitals Endpoint: Failed to connect"
}

# Test Auth Endpoint
Write-Host "\nTesting Auth Endpoint..."
$body = @{
    email = "test@example.com"
    password = "test123"
} | ConvertTo-Json

$response = Invoke-WebRequest -Uri "http://localhost:5000/api/auth/login" -Method Post -Body $body -ContentType "application/json" -UseBasicParsing -ErrorAction SilentlyContinue
if ($response) {
    Write-Host "✅ Auth Login: $($response.StatusCode) - $($response.StatusDescription)"
    $response.Content | ConvertFrom-Json | ConvertTo-Json -Depth 3 | Write-Host
} else {
    Write-Host "❌ Auth Login: Failed to connect"
}
