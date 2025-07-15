# PowerShell deployment script for Payoo Application on Windows VPS
# Run this script as Administrator

Write-Host "=== Payoo Application Deployment Script ===" -ForegroundColor Green

# Check if running as Administrator
if (-NOT ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole] "Administrator")) {
    Write-Host "This script must be run as Administrator. Please restart PowerShell as Administrator." -ForegroundColor Red
    exit 1
}

# Variables
$AppName = "payoo"
$AppPath = "C:\payoo-app"
$LogPath = "$AppPath\logs"
$BackupPath = "C:\payoo-backup"

# Create directories
Write-Host "Creating directories..." -ForegroundColor Yellow
New-Item -ItemType Directory -Force -Path $AppPath
New-Item -ItemType Directory -Force -Path $LogPath
New-Item -ItemType Directory -Force -Path $BackupPath

# Check Node.js installation
Write-Host "Checking Node.js installation..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "Node.js version: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "Node.js is not installed. Please install Node.js v20.x from https://nodejs.org/" -ForegroundColor Red
    exit 1
}

# Check PM2 installation
Write-Host "Checking PM2 installation..." -ForegroundColor Yellow
try {
    $pm2Version = pm2 --version
    Write-Host "PM2 version: $pm2Version" -ForegroundColor Green
} catch {
    Write-Host "Installing PM2..." -ForegroundColor Yellow
    npm install -g pm2
    npm install -g pm2-windows-service
}

# Install PostgreSQL (if not exists)
Write-Host "Checking PostgreSQL installation..." -ForegroundColor Yellow
$postgresService = Get-Service -Name "postgresql*" -ErrorAction SilentlyContinue
if (-not $postgresService) {
    Write-Host "PostgreSQL not found. Please install PostgreSQL manually from https://www.postgresql.org/download/windows/" -ForegroundColor Yellow
    Write-Host "After installation, create database 'payoo_db' and user 'payoo_user'" -ForegroundColor Yellow
    Read-Host "Press Enter after PostgreSQL installation is complete"
}

# Copy application files
Write-Host "Setting up application files..." -ForegroundColor Yellow
Copy-Item -Path ".\" -Destination $AppPath -Recurse -Force

# Change to application directory
Set-Location $AppPath

# Install dependencies
Write-Host "Installing dependencies..." -ForegroundColor Yellow
npm install

# Build application
Write-Host "Building application..." -ForegroundColor Yellow
npm run build

# Setup environment
Write-Host "Setting up environment..." -ForegroundColor Yellow
if (-not (Test-Path ".env")) {
    Copy-Item "production.env" ".env"
    Write-Host "Environment file created. Please update .env with your actual API keys." -ForegroundColor Yellow
}

# Setup database
Write-Host "Setting up database..." -ForegroundColor Yellow
Write-Host "Please ensure PostgreSQL is running and database 'payoo_db' exists" -ForegroundColor Yellow
$dbSetup = Read-Host "Continue with database migration? (y/n)"
if ($dbSetup -eq "y") {
    npm run db:push
}

# Configure Windows Firewall
Write-Host "Configuring Windows Firewall..." -ForegroundColor Yellow
New-NetFirewallRule -DisplayName "Payoo App" -Direction Inbound -Protocol TCP -LocalPort 5000 -Action Allow

# Start application with PM2
Write-Host "Starting application..." -ForegroundColor Yellow
pm2 start ecosystem.config.js
pm2 save

# Install PM2 as Windows Service
Write-Host "Installing PM2 as Windows Service..." -ForegroundColor Yellow
pm2-service-install
pm2-service-start

# Display status
Write-Host "Application deployed successfully!" -ForegroundColor Green
Write-Host "Application URL: http://160.30.44.141:5000" -ForegroundColor Green
Write-Host "PM2 Commands:" -ForegroundColor Yellow
Write-Host "  pm2 list       - Show running processes" -ForegroundColor White
Write-Host "  pm2 logs       - Show logs" -ForegroundColor White
Write-Host "  pm2 monit      - Monitor application" -ForegroundColor White
Write-Host "  pm2 restart $AppName - Restart application" -ForegroundColor White

pm2 list