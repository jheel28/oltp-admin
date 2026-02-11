$ports = @(5002, 5003, 5004, 5005)
foreach ($port in $ports) {
    $process = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue
    if ($process) {
        Write-Host "Killing process on port $port (PID: $($process.OwningProcess))"
        Stop-Process -Id $process.OwningProcess -Force -ErrorAction SilentlyContinue
    }
}
Write-Host "All specified ports cleared."
