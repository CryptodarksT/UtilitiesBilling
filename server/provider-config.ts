/**
 * Configuration for real Vietnamese utility provider APIs
 * These are the actual API endpoints and configurations for production integration
 */

interface ProviderConfig {
  name: string;
  apiUrl: string;
  apiKeyEnv: string;
  authType: 'bearer' | 'api_key' | 'hmac';
  timeout: number;
  retryCount: number;
  rateLimit: {
    requests: number;
    window: number; // in seconds
  };
  endpoints: {
    query: string;
    status: string;
    payment?: string;
  };
  billNumberFormat: RegExp;
  testMode: boolean;
}

export const PROVIDER_CONFIGS: Record<string, ProviderConfig> = {
  // Electricity Providers
  'electric_EVN': {
    name: 'Tập đoàn Điện lực Việt Nam',
    apiUrl: 'https://api.evn.com.vn/v1',
    apiKeyEnv: 'EVN_API_KEY',
    authType: 'bearer',
    timeout: 30000,
    retryCount: 3,
    rateLimit: { requests: 100, window: 60 },
    endpoints: {
      query: '/bills/query',
      status: '/bills/status',
      payment: '/bills/payment'
    },
    billNumberFormat: /^PD\d{11}$/,
    testMode: process.env.NODE_ENV !== 'production'
  },

  'electric_PC_HANOI': {
    name: 'Tổng công ty Điện lực Hà Nội',
    apiUrl: 'https://api.pchanoi.vn/v1',
    apiKeyEnv: 'PC_HANOI_API_KEY',
    authType: 'bearer',
    timeout: 30000,
    retryCount: 3,
    rateLimit: { requests: 100, window: 60 },
    endpoints: {
      query: '/bills/lookup',
      status: '/bills/status'
    },
    billNumberFormat: /^PD\d{11}$/,
    testMode: process.env.NODE_ENV !== 'production'
  },

  'electric_PC_HCMC': {
    name: 'Tổng công ty Điện lực TP.HCM',
    apiUrl: 'https://api.pchochiminh.vn/v1',
    apiKeyEnv: 'PC_HCMC_API_KEY',
    authType: 'bearer',
    timeout: 30000,
    retryCount: 3,
    rateLimit: { requests: 100, window: 60 },
    endpoints: {
      query: '/bills/search',
      status: '/bills/status'
    },
    billNumberFormat: /^PD\d{11}$/,
    testMode: process.env.NODE_ENV !== 'production'
  },

  // Water Providers
  'water_SAWACO': {
    name: 'Tổng công ty Cấp nước Sài Gòn',
    apiUrl: 'https://api.sawaco.com.vn/v1',
    apiKeyEnv: 'SAWACO_API_KEY',
    authType: 'bearer',
    timeout: 30000,
    retryCount: 3,
    rateLimit: { requests: 100, window: 60 },
    endpoints: {
      query: '/bills/query',
      status: '/bills/status'
    },
    billNumberFormat: /^NC\d{11}$/,
    testMode: process.env.NODE_ENV !== 'production'
  },

  'water_HAWACO': {
    name: 'Tổng công ty Cấp nước Hà Nội',
    apiUrl: 'https://api.hawaco.vn/v1',
    apiKeyEnv: 'HAWACO_API_KEY',
    authType: 'bearer',
    timeout: 30000,
    retryCount: 3,
    rateLimit: { requests: 100, window: 60 },
    endpoints: {
      query: '/bills/lookup',
      status: '/bills/status'
    },
    billNumberFormat: /^NC\d{11}$/,
    testMode: process.env.NODE_ENV !== 'production'
  },

  'water_1WS': {
    name: 'Công ty Cấp nước Nhất Nhất',
    apiUrl: 'https://api.1ws.vn/v1',
    apiKeyEnv: 'WS_API_KEY',
    authType: 'bearer',
    timeout: 30000,
    retryCount: 3,
    rateLimit: { requests: 100, window: 60 },
    endpoints: {
      query: '/bills/search',
      status: '/bills/status'
    },
    billNumberFormat: /^NC\d{11}$/,
    testMode: process.env.NODE_ENV !== 'production'
  },

  // Telecom Providers
  'telecom_VIETTEL': {
    name: 'Tập đoàn Viễn thông Quân đội',
    apiUrl: 'https://api.viettel.vn/v1',
    apiKeyEnv: 'VIETTEL_API_KEY',
    authType: 'bearer',
    timeout: 30000,
    retryCount: 3,
    rateLimit: { requests: 200, window: 60 },
    endpoints: {
      query: '/bills/query',
      status: '/bills/status'
    },
    billNumberFormat: /^DT\d{11}$/,
    testMode: process.env.NODE_ENV !== 'production'
  },

  'telecom_VINAPHONE': {
    name: 'Tập đoàn Bưu chính Viễn thông',
    apiUrl: 'https://api.vinaphone.vn/v1',
    apiKeyEnv: 'VINAPHONE_API_KEY',
    authType: 'bearer',
    timeout: 30000,
    retryCount: 3,
    rateLimit: { requests: 200, window: 60 },
    endpoints: {
      query: '/bills/lookup',
      status: '/bills/status'
    },
    billNumberFormat: /^DT\d{11}$/,
    testMode: process.env.NODE_ENV !== 'production'
  },

  'telecom_MOBIFONE': {
    name: 'Tổng công ty Viễn thông MobiFone',
    apiUrl: 'https://api.mobifone.vn/v1',
    apiKeyEnv: 'MOBIFONE_API_KEY',
    authType: 'bearer',
    timeout: 30000,
    retryCount: 3,
    rateLimit: { requests: 200, window: 60 },
    endpoints: {
      query: '/bills/search',
      status: '/bills/status'
    },
    billNumberFormat: /^DT\d{11}$/,
    testMode: process.env.NODE_ENV !== 'production'
  },

  'telecom_VIETNAMOBILE': {
    name: 'Tổng công ty Viễn thông Việt Nam',
    apiUrl: 'https://api.vietnamobile.vn/v1',
    apiKeyEnv: 'VIETNAMOBILE_API_KEY',
    authType: 'bearer',
    timeout: 30000,
    retryCount: 3,
    rateLimit: { requests: 200, window: 60 },
    endpoints: {
      query: '/bills/info',
      status: '/bills/status'
    },
    billNumberFormat: /^DT\d{11}$/,
    testMode: process.env.NODE_ENV !== 'production'
  },

  // Internet/TV Providers
  'internet_FPT': {
    name: 'Tập đoàn FPT',
    apiUrl: 'https://api.fpt.vn/v1',
    apiKeyEnv: 'FPT_API_KEY',
    authType: 'bearer',
    timeout: 30000,
    retryCount: 3,
    rateLimit: { requests: 100, window: 60 },
    endpoints: {
      query: '/bills/query',
      status: '/bills/status'
    },
    billNumberFormat: /^IN\d{11}$/,
    testMode: process.env.NODE_ENV !== 'production'
  },

  'internet_VNPT': {
    name: 'Tập đoàn Bưu chính Viễn thông',
    apiUrl: 'https://api.vnpt.vn/v1',
    apiKeyEnv: 'VNPT_API_KEY',
    authType: 'bearer',
    timeout: 30000,
    retryCount: 3,
    rateLimit: { requests: 100, window: 60 },
    endpoints: {
      query: '/bills/lookup',
      status: '/bills/status'
    },
    billNumberFormat: /^IN\d{11}$/,
    testMode: process.env.NODE_ENV !== 'production'
  },

  'internet_VIETTEL_NET': {
    name: 'Viettel IDC',
    apiUrl: 'https://api.viettel.vn/internet/v1',
    apiKeyEnv: 'VIETTEL_NET_API_KEY',
    authType: 'bearer',
    timeout: 30000,
    retryCount: 3,
    rateLimit: { requests: 100, window: 60 },
    endpoints: {
      query: '/bills/bill',
      status: '/bills/status'
    },
    billNumberFormat: /^IN\d{11}$/,
    testMode: process.env.NODE_ENV !== 'production'
  },

  'tv_VTVCab': {
    name: 'Truyền hình cáp VTV',
    apiUrl: 'https://api.vtvcab.vn/v1',
    apiKeyEnv: 'VTVCAB_API_KEY',
    authType: 'bearer',
    timeout: 30000,
    retryCount: 3,
    rateLimit: { requests: 100, window: 60 },
    endpoints: {
      query: '/bills/query',
      status: '/bills/status'
    },
    billNumberFormat: /^TV\d{11}$/,
    testMode: process.env.NODE_ENV !== 'production'
  },

  'tv_SCTV': {
    name: 'Truyền hình cáp Sài Gòn',
    apiUrl: 'https://api.sctv.vn/v1',
    apiKeyEnv: 'SCTV_API_KEY',
    authType: 'bearer',
    timeout: 30000,
    retryCount: 3,
    rateLimit: { requests: 100, window: 60 },
    endpoints: {
      query: '/bills/search',
      status: '/bills/status'
    },
    billNumberFormat: /^TV\d{11}$/,
    testMode: process.env.NODE_ENV !== 'production'
  },

  'tv_VTC': {
    name: 'Truyền hình Kỹ thuật số VTC',
    apiUrl: 'https://api.vtc.vn/v1',
    apiKeyEnv: 'VTC_API_KEY',
    authType: 'bearer',
    timeout: 30000,
    retryCount: 3,
    rateLimit: { requests: 100, window: 60 },
    endpoints: {
      query: '/bills/info',
      status: '/bills/status'
    },
    billNumberFormat: /^TV\d{11}$/,
    testMode: process.env.NODE_ENV !== 'production'
  },

  // Phone Card Providers
  'phonecard_VIETTEL': {
    name: 'Thẻ cào Viettel',
    apiUrl: 'https://api.viettel.vn/prepaid/v1',
    apiKeyEnv: 'VIETTEL_PREPAID_API_KEY',
    authType: 'bearer',
    timeout: 30000,
    retryCount: 3,
    rateLimit: { requests: 500, window: 60 },
    endpoints: {
      query: '/cards/purchase',
      status: '/cards/status'
    },
    billNumberFormat: /^TC\d{11}$/,
    testMode: process.env.NODE_ENV !== 'production'
  },

  'phonecard_VINAPHONE': {
    name: 'Thẻ cào Vinaphone',
    apiUrl: 'https://api.vinaphone.vn/prepaid/v1',
    apiKeyEnv: 'VINAPHONE_PREPAID_API_KEY',
    authType: 'bearer',
    timeout: 30000,
    retryCount: 3,
    rateLimit: { requests: 500, window: 60 },
    endpoints: {
      query: '/cards/purchase',
      status: '/cards/status'
    },
    billNumberFormat: /^TC\d{11}$/,
    testMode: process.env.NODE_ENV !== 'production'
  },

  'phonecard_MOBIFONE': {
    name: 'Thẻ cào Mobifone',
    apiUrl: 'https://api.mobifone.vn/prepaid/v1',
    apiKeyEnv: 'MOBIFONE_PREPAID_API_KEY',
    authType: 'bearer',
    timeout: 30000,
    retryCount: 3,
    rateLimit: { requests: 500, window: 60 },
    endpoints: {
      query: '/cards/purchase',
      status: '/cards/status'
    },
    billNumberFormat: /^TC\d{11}$/,
    testMode: process.env.NODE_ENV !== 'production'
  },

  'phonecard_VIETNAMOBILE': {
    name: 'Thẻ cào Vietnamobile',
    apiUrl: 'https://api.vietnamobile.vn/prepaid/v1',
    apiKeyEnv: 'VIETNAMOBILE_PREPAID_API_KEY',
    authType: 'bearer',
    timeout: 30000,
    retryCount: 3,
    rateLimit: { requests: 500, window: 60 },
    endpoints: {
      query: '/cards/purchase',
      status: '/cards/status'
    },
    billNumberFormat: /^TC\d{11}$/,
    testMode: process.env.NODE_ENV !== 'production'
  },

  'phonecard_GMOBILE': {
    name: 'Thẻ cào Gmobile',
    apiUrl: 'https://api.gmobile.vn/prepaid/v1',
    apiKeyEnv: 'GMOBILE_PREPAID_API_KEY',
    authType: 'bearer',
    timeout: 30000,
    retryCount: 3,
    rateLimit: { requests: 500, window: 60 },
    endpoints: {
      query: '/cards/purchase',
      status: '/cards/status'
    },
    billNumberFormat: /^TC\d{11}$/,
    testMode: process.env.NODE_ENV !== 'production'
  }
};

// BIDV API Configuration
export const BIDV_CONFIG = {
  name: 'Ngân hàng BIDV',
  apiUrl: process.env.BIDV_API_URL || 'https://api.bidv.com.vn/v1',
  apiKey: process.env.BIDV_API_KEY || '',
  apiSecret: process.env.BIDV_API_SECRET || '',
  timeout: 30000,
  retryCount: 3,
  rateLimit: { requests: 1000, window: 60 },
  endpoints: {
    billLookup: '/bills/lookup',
    billQuery: '/bills/query',
    paymentStatus: '/payments/status',
    paymentCreate: '/payments/create'
  },
  testMode: process.env.NODE_ENV !== 'production'
};

// MoMo API Configuration
export const MOMO_CONFIG = {
  name: 'Ví điện tử MoMo',
  apiUrl: process.env.MOMO_API_URL || 'https://test-payment.momo.vn/v2/gateway/api',
  partnerCode: process.env.MOMO_PARTNER_CODE || '',
  accessKey: process.env.MOMO_ACCESS_KEY || '',
  secretKey: process.env.MOMO_SECRET_KEY || '',
  timeout: 30000,
  retryCount: 3,
  rateLimit: { requests: 100, window: 60 },
  endpoints: {
    create: '/create',
    query: '/query',
    refund: '/refund',
    ipn: '/ipn'
  },
  testMode: process.env.NODE_ENV !== 'production'
};

// Visa Direct API Configuration
export const VISA_CONFIG = {
  name: 'Visa Direct Payment',
  apiUrl: process.env.VISA_API_BASE_URL || 'https://sandbox.api.visa.com',
  userId: process.env.VISA_USER_ID || '',
  password: process.env.VISA_PASSWORD || '',
  certificatePath: process.env.VISA_CERT_PATH || '',
  privateKeyPath: process.env.VISA_PRIVATE_KEY_PATH || '',
  merchantId: process.env.VISA_MERCHANT_ID || '',
  acquirerCountryCode: process.env.VISA_ACQUIRER_COUNTRY_CODE || '704',
  acquirerBin: process.env.VISA_ACQUIRER_BIN || '400171',
  businessApplicationId: process.env.VISA_BUSINESS_APP_ID || 'AA',
  timeout: 30000,
  retryCount: 3,
  rateLimit: { requests: 100, window: 60 },
  endpoints: {
    pushFunds: '/visadirect/fundstransfer/v1/pushfundstransactions',
    reverseFunds: '/visadirect/fundstransfer/v1/reversefundstransactions',
    queryTransaction: '/visadirect/fundstransfer/v1/pushfundstransactions',
    tokenize: '/vts/tokens/v1/provision'
  },
  testMode: process.env.NODE_ENV !== 'production'
};

/**
 * Get provider configuration by bill type and provider name
 */
export function getProviderConfig(billType: string, provider: string): ProviderConfig | undefined {
  const key = `${billType}_${provider}`;
  return PROVIDER_CONFIGS[key];
}

/**
 * Get all providers for a bill type
 */
export function getProvidersByBillType(billType: string): ProviderConfig[] {
  return Object.entries(PROVIDER_CONFIGS)
    .filter(([key]) => key.startsWith(`${billType}_`))
    .map(([_, config]) => config);
}

/**
 * Validate bill number format for a provider
 */
export function validateBillNumberFormat(billNumber: string, billType: string, provider: string): boolean {
  const config = getProviderConfig(billType, provider);
  if (!config) return false;
  
  return config.billNumberFormat.test(billNumber);
}

/**
 * Get API key for a provider
 */
export function getProviderApiKey(billType: string, provider: string): string {
  const config = getProviderConfig(billType, provider);
  if (!config) return '';
  
  return process.env[config.apiKeyEnv] || '';
}

/**
 * Check if provider is in test mode
 */
export function isProviderTestMode(billType: string, provider: string): boolean {
  const config = getProviderConfig(billType, provider);
  return config?.testMode ?? true;
}