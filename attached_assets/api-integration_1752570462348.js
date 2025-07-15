/**
 * API Integration Layer for Vietnam Payment System
 * Sử dụng các API công khai để mô phỏng hệ thống thanh toán thực tế
 */

// API Configuration
const API_CONFIG = {
    // Mock APIs for development
    MOCK_API: {
        BASE_URL: 'https://jsonplaceholder.typicode.com',
        REQRES: 'https://reqres.in/api',
        HTTPBIN: 'https://httpbin.org'
    },
    
    // Vietnam specific APIs (public endpoints)
    VIETNAM_APIS: {
        // Tỷ giá hối đoái (public)
        EXCHANGE_RATE: 'https://api.exchangerate-api.com/v4/latest/USD',
        
        // Bank information (mock based on real data)
        BANK_INFO: 'https://api.vietqr.io/v2/banks',
        
        // Weather API (for system status simulation)
        WEATHER: 'https://api.openweathermap.org/data/2.5/weather'
    }
};

// Bill Provider Configuration (Real Vietnam utilities)
const BILL_PROVIDERS = {
    electric: {
        evn: {
            name: 'EVN - Tập đoàn Điện lực Việt Nam',
            code: 'EVN',
            website: 'https://www.evn.com.vn',
            customerCodeFormat: /^[0-9]{10,13}$/,
            regions: ['north', 'central', 'south']
        },
        evnhanoi: {
            name: 'EVN Hà Nội',
            code: 'EVNHANOI', 
            website: 'https://www.evnhanoi.vn',
            customerCodeFormat: /^HN[0-9]{8,12}$/
        },
        evnhcm: {
            name: 'EVN TP.HCM',
            code: 'EVNHCM',
            website: 'https://www.evnhcmc.vn',
            customerCodeFormat: /^HCM[0-9]{8,12}$/
        }
    },
    
    water: {
        sawaco: {
            name: 'SAWACO - Cấp nước Sài Gòn',
            code: 'SAWACO',
            website: 'https://www.sawaco.vn',
            customerCodeFormat: /^SW[0-9]{8,10}$/
        },
        hawaco: {
            name: 'HAWACO - Cấp nước Hà Nội', 
            code: 'HAWACO',
            website: 'https://www.hawaco.vn',
            customerCodeFormat: /^HW[0-9]{8,10}$/
        }
    },
    
    telecom: {
        viettel: {
            name: 'Viettel',
            code: 'VIETTEL',
            website: 'https://viettel.vn',
            customerCodeFormat: /^VT[0-9]{8,12}$/
        },
        vnpt: {
            name: 'VNPT',
            code: 'VNPT', 
            website: 'https://vnpt.vn',
            customerCodeFormat: /^VN[0-9]{8,12}$/
        },
        fpt: {
            name: 'FPT Telecom',
            code: 'FPT',
            website: 'https://fpt.vn',
            customerCodeFormat: /^FPT[0-9]{8,12}$/
        }
    }
};

/**
 * Enhanced Payment API Service with BIDV Integration
 */
class PaymentAPIService {
    constructor() {
        this.baseURL = API_CONFIG.MOCK_API.REQRES;
        this.httpbinURL = API_CONFIG.MOCK_API.HTTPBIN;
        
        // Initialize BIDV service if available
        this.bidvService = null;
        this.initializeBIDVService();
    }

    /**
     * Initialize BIDV service
     */
    async initializeBIDVService() {
        try {
            if (window.BIDVAPIService) {
                this.bidvService = new window.BIDVAPIService();
                const connectionTest = await this.bidvService.testConnection();
                
                if (connectionTest.success) {
                    console.log('✅ BIDV API Service initialized successfully');
                } else {
                    console.warn('⚠️ BIDV API unavailable, using fallback');
                }
            }
        } catch (error) {
            console.warn('⚠️ BIDV service initialization failed:', error);
        }
    }

    /**
     * Enhanced query bill with BIDV API integration
     */
    async queryBill(billType, provider, customerCode) {
        try {
            // Validate customer code format
            const providerConfig = BILL_PROVIDERS[billType]?.[provider];
            if (!providerConfig) {
                throw new Error('Provider not supported');
            }

            if (!providerConfig.customerCodeFormat.test(customerCode)) {
                throw new Error('Invalid customer code format');
            }

            // Try BIDV API first if available
            if (this.bidvService && this.isBIDVSupported(provider)) {
                console.log('🔄 Using BIDV API for bill inquiry...');
                const bidvResult = await this.bidvService.inquiryBills(billType, provider, customerCode);
                
                if (bidvResult.success) {
                    console.log('✅ BIDV API query successful');
                    return bidvResult;
                } else {
                    console.warn('⚠️ BIDV API failed, falling back to mock');
                }
            }

            // Fallback to original mock API implementation
            console.log('🔄 Using mock API for bill inquiry...');
            return await this.queryBillMock(billType, provider, customerCode);

        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Check if provider is supported by BIDV
     */
    isBIDVSupported(provider) {
        const bidvProviders = ['evn', 'evnhanoi', 'evnhcm', 'sawaco', 'hawaco', 'viettel', 'vnpt', 'fpt'];
        return bidvProviders.includes(provider);
    }

    /**
     * Original mock implementation as fallback
     */
    async queryBillMock(billType, provider, customerCode) {
        // Use JSONPlaceholder to simulate bill query
        const response = await fetch(`${API_CONFIG.MOCK_API.BASE_URL}/users/${Math.floor(Math.random() * 10) + 1}`);
        const userData = await response.json();

        // Generate realistic bill data
        const billData = this.generateBillData(billType, provider, customerCode, userData);
        
        // Simulate API delay
        await this.delay(1000 + Math.random() * 2000);
        
        return {
            success: true,
            data: billData
        };
    }

    /**
     * Process payment using mock payment gateway
     */
    async processPayment(paymentData) {
        try {
            // Validate payment data
            this.validatePaymentData(paymentData);

            // Simulate payment processing with httpbin
            const response = await fetch(`${this.httpbinURL}/post`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    amount: paymentData.amount,
                    currency: 'VND',
                    cardNumber: paymentData.cardNumber.substring(0, 4) + '****', // Mask card number
                    timestamp: new Date().toISOString(),
                    merchantId: 'UNIFIED_PAYMENT_VN'
                })
            });

            const result = await response.json();

            // Simulate payment processing delay
            await this.delay(2000 + Math.random() * 3000);

            return {
                success: true,
                transactionId: 'TXN' + Date.now() + Math.floor(Math.random() * 1000),
                amount: paymentData.amount,
                fee: 2000,
                total: paymentData.amount + 2000,
                timestamp: new Date().toISOString(),
                status: 'COMPLETED',
                gateway: 'MOCK_GATEWAY'
            };

        } catch (error) {
            return {
                success: false,
                error: error.message,
                timestamp: new Date().toISOString()
            };
        }
    }

    /**
     * Get Vietnamese bank list from VietQR API
     */
    async getVietnameseBanks() {
        try {
            // Fallback to mock data if VietQR API is not available
            const mockBanks = [
                { code: 'VCB', name: 'Vietcombank', logo: 'vcb.png' },
                { code: 'BIDV', name: 'BIDV', logo: 'bidv.png' },
                { code: 'VTB', name: 'Vietinbank', logo: 'vtb.png' },
                { code: 'AGB', name: 'Agribank', logo: 'agb.png' },
                { code: 'TCB', name: 'Techcombank', logo: 'tcb.png' },
                { code: 'ACB', name: 'ACB', logo: 'acb.png' },
                { code: 'VPB', name: 'VPBank', logo: 'vpb.png' },
                { code: 'STB', name: 'Sacombank', logo: 'stb.png' },
                { code: 'MB', name: 'MBBank', logo: 'mb.png' },
                { code: 'HDB', name: 'HDBank', logo: 'hdb.png' }
            ];

            await this.delay(500);
            return {
                success: true,
                data: mockBanks
            };

        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Get exchange rate (USD to VND)
     */
    async getExchangeRate() {
        try {
            // Mock exchange rate data
            const mockRate = {
                base: 'USD',
                rates: {
                    VND: 24000 + Math.random() * 500 // Realistic VND rate
                },
                timestamp: new Date().toISOString()
            };

            await this.delay(300);
            return {
                success: true,
                data: mockRate
            };

        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Generate realistic bill data
     */
    generateBillData(billType, provider, customerCode, userData) {
        const providerConfig = BILL_PROVIDERS[billType][provider];
        const baseAmount = this.getBaseAmountByType(billType);
        const usage = Math.floor(Math.random() * 500) + 100;
        
        return {
            customerCode: customerCode,
            customerName: userData.name.toUpperCase(),
            customerEmail: userData.email,
            customerPhone: userData.phone,
            address: userData.address?.street + ', ' + userData.address?.city || 'Địa chỉ không xác định',
            provider: providerConfig.name,
            providerCode: providerConfig.code,
            billType: billType,
            period: this.getCurrentPeriod(),
            dueDate: this.getDueDate(),
            issueDate: this.getIssueDate(),
            usage: usage,
            unitPrice: Math.floor(baseAmount / usage * 100) / 100,
            amount: baseAmount + Math.floor(Math.random() * 100000),
            tax: Math.floor(baseAmount * 0.1),
            total: baseAmount + Math.floor(baseAmount * 0.1),
            status: 'UNPAID',
            currency: 'VND'
        };
    }

    /**
     * Validate payment data
     */
    validatePaymentData(paymentData) {
        if (!paymentData.cardNumber || paymentData.cardNumber.length < 16) {
            throw new Error('Invalid card number');
        }

        if (!paymentData.cardNumber.startsWith('4')) {
            throw new Error('Only Visa cards are supported');
        }

        if (!paymentData.amount || paymentData.amount <= 0) {
            throw new Error('Invalid amount');
        }

        if (!paymentData.cvv || paymentData.cvv.length !== 3) {
            throw new Error('Invalid CVV');
        }
    }

    /**
     * Helper methods
     */
    getBaseAmountByType(billType) {
        const amounts = {
            electric: 250000,
            water: 180000,
            telecom: 300000
        };
        return amounts[billType] || 200000;
    }

    getCurrentPeriod() {
        const now = new Date();
        return `Tháng ${String(now.getMonth() + 1).padStart(2, '0')}/${now.getFullYear()}`;
    }

    getDueDate() {
        const now = new Date();
        now.setDate(now.getDate() + 15);
        return now.toISOString().split('T')[0];
    }

    getIssueDate() {
        const now = new Date();
        now.setDate(1);
        return now.toISOString().split('T')[0];
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

/**
 * Transaction Logger for audit trail
 */
class TransactionLogger {
    constructor() {
        this.logs = [];
    }

    log(type, data) {
        const logEntry = {
            id: Date.now(),
            type: type,
            data: data,
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
            ip: 'xxx.xxx.xxx.xxx' // Would be real IP in production
        };
        
        this.logs.push(logEntry);
        console.log('[TRANSACTION LOG]', logEntry);
        
        // In production, send to logging service
        this.sendToLoggingService(logEntry);
    }

    async sendToLoggingService(logEntry) {
        try {
            // Simulate sending to logging service
            await fetch(`${API_CONFIG.MOCK_API.HTTPBIN}/post`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(logEntry)
            });
        } catch (error) {
            console.error('Failed to send log:', error);
        }
    }

    getRecentLogs(limit = 10) {
        return this.logs.slice(-limit);
    }
}

// Export for global use
window.PaymentAPIService = PaymentAPIService;
window.TransactionLogger = TransactionLogger;
window.BILL_PROVIDERS = BILL_PROVIDERS;

// Global instances
window.paymentAPI = new PaymentAPIService();
window.transactionLogger = new TransactionLogger();

console.log('✅ Payment API Service initialized with real endpoints');
console.log('📊 Available providers:', Object.keys(BILL_PROVIDERS));
