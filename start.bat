@echo off
echo Starting Payoo Application...

:: Check if PM2 is installed
pm2 --version >nul 2>&1
if %errorlevel% neq 0 (
    echo PM2 is not installed. Installing PM2...
    npm install -g pm2
    npm install -g pm2-windows-service
)

:: Run database migrations
echo Running database migrations...
npm run db:push

:: Start application with PM2
echo Starting application with PM2...
pm2 start ecosystem.config.js

:: Save PM2 configuration
pm2 save

:: Show PM2 status
pm2 list

echo Application started successfully!
echo Access the application at: http://160.30.44.141:5000
echo Use 'pm2 logs' to view logs
echo Use 'pm2 monit' to monitor the application
pause