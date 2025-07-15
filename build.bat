@echo off
echo Building Payoo Application...

:: Install dependencies
echo Installing dependencies...
npm install

:: Build the application
echo Building application...
npm run build

:: Create logs directory
if not exist "logs" mkdir logs

:: Create production environment file template
if not exist ".env" (
    echo Creating .env template...
    echo NODE_ENV=production > .env
    echo PORT=5000 >> .env
    echo DATABASE_URL=postgresql://payoo_user:secure_password_123@localhost:5432/payoo_db >> .env
    echo. >> .env
    echo # API Keys - Replace with your actual keys >> .env
    echo BIDV_API_KEY=your_bidv_api_key >> .env
    echo BIDV_API_SECRET=your_bidv_api_secret >> .env
    echo MOMO_PARTNER_CODE=your_momo_partner_code >> .env
    echo MOMO_ACCESS_KEY=your_momo_access_key >> .env
    echo MOMO_SECRET_KEY=your_momo_secret_key >> .env
    echo VNPAY_TMN_CODE=your_vnpay_tmn_code >> .env
    echo VNPAY_HASH_SECRET=your_vnpay_hash_secret >> .env
)

echo Build completed!
echo Please update the .env file with your actual API keys before running the application.
pause