# ============================================================================
# Script: publish-wcf-clean.ps1
# Purpose: Build, publish e limpar ficheiros duplicados do WCF
# ============================================================================

param(
    [string]$Configuration = "Release"
)

$ErrorActionPreference = "Stop"
$wcfPath = "C:\Users\gabri\Documents\IPCA\ISI\InvestmentPortfolio\InvestmentPortfolio.Wcf"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "WCF Clean Publish Script" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

# 1. Navegar para o projeto WCF
Write-Host "`n[1/6] Navigating to WCF project..." -ForegroundColor Yellow
Set-Location $wcfPath

# 2. Limpar tudo
Write-Host "`n[2/6] Cleaning previous builds..." -ForegroundColor Yellow
dotnet clean -c $Configuration
Remove-Item -Recurse -Force .\bin -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force .\obj -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force .\publish -ErrorAction SilentlyContinue
Remove-Item -Force .\*.zip -ErrorAction SilentlyContinue

# 3. Restore
Write-Host "`n[3/6] Restoring packages..." -ForegroundColor Yellow
dotnet restore

# 4. Publish (IGNORA warnings sobre ficheiros duplicados)
Write-Host "`n[4/6] Publishing..." -ForegroundColor Yellow
dotnet publish -c $Configuration -o ./publish 2>&1 | Where-Object { 
    $_ -notmatch "Found multiple publish output files" 
}

# 5. LIMPAR ficheiros duplicados da API
Write-Host "`n[5/6] Removing duplicate files from API project..." -ForegroundColor Yellow

$apiAppsettings = Get-ChildItem -Path "./publish" -Recurse -File | 
    Where-Object { 
        $_.FullName -match "InvestmentPortfolio\.Api" -and 
        $_.Name -match "appsettings.*\.json"
    }

if ($apiAppsettings) {
    Write-Host "   Found $($apiAppsettings.Count) API appsettings files to remove:" -ForegroundColor Red
    foreach ($file in $apiAppsettings) {
        Write-Host "   - Removing: $($file.FullName)" -ForegroundColor Red
        Remove-Item $file.FullName -Force
    }
} else {
    Write-Host "   ? No duplicate API files found" -ForegroundColor Green
}

# Verificar appsettings finais
Write-Host "`n   Final appsettings.json files:" -ForegroundColor Cyan
Get-ChildItem -Path "./publish" -Filter "appsettings*.json" -Recurse | 
    ForEach-Object { Write-Host "   - $($_.FullName)" -ForegroundColor Green }

# 6. Criar ZIP
Write-Host "`n[6/6] Creating deployment package..." -ForegroundColor Yellow
Compress-Archive -Path .\publish\* -DestinationPath .\wcfapp.zip -Force

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "? Build completed successfully!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "`nPackage ready: $wcfPath\wcfapp.zip" -ForegroundColor Green
Write-Host "`nTo deploy, run:" -ForegroundColor Cyan
Write-Host "az webapp deploy ``" -ForegroundColor White
Write-Host "  --resource-group InvestmentPortfolio-RG ``" -ForegroundColor White
Write-Host "  --name investmentportfolio-wcf ``" -ForegroundColor White
Write-Host "  --src-path .\wcfapp.zip ``" -ForegroundColor White
Write-Host "  --type zip ``" -ForegroundColor White
Write-Host "  --clean true" -ForegroundColor White