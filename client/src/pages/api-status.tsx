import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  RefreshCw,
  TrendingUp,
  Clock,
  Globe,
  Shield,
  CreditCard,
  Building,
  Zap
} from "lucide-react";

interface ApiStatus {
  name: string;
  status: 'operational' | 'degraded' | 'down' | 'maintenance';
  uptime: number;
  responseTime: number;
  lastCheck: string;
  icon: React.ReactNode;
  endpoint: string;
  description: string;
}

interface SystemMetrics {
  totalTransactions: number;
  successRate: number;
  avgResponseTime: number;
  activeUsers: number;
}

export default function ApiStatus() {
  const [apiStatuses, setApiStatuses] = useState<ApiStatus[]>([
    {
      name: "MoMo Business API",
      status: "operational",
      uptime: 99.9,
      responseTime: 145,
      lastCheck: new Date().toISOString(),
      icon: <CreditCard className="h-5 w-5" />,
      endpoint: "https://payment.momo.vn/api/v2/gateway/processor",
      description: "API thanh toán e-wallet MoMo"
    },
    {
      name: "BIDV Open Banking",
      status: "operational", 
      uptime: 99.8,
      responseTime: 89,
      lastCheck: new Date().toISOString(),
      icon: <Building className="h-5 w-5" />,
      endpoint: "https://openapi.bidv.com.vn/bidv/sandbox/open-banking",
      description: "API tra cứu hóa đơn từ BIDV"
    },
    {
      name: "ZaloPay Business",
      status: "degraded",
      uptime: 98.5,
      responseTime: 234,
      lastCheck: new Date().toISOString(),
      icon: <Zap className="h-5 w-5" />,
      endpoint: "https://business.zalopay.vn/api/v2/payment",
      description: "API thanh toán ZaloPay Business"
    },
    {
      name: "Visa Direct API",
      status: "operational",
      uptime: 99.95,
      responseTime: 67,
      lastCheck: new Date().toISOString(),
      icon: <Shield className="h-5 w-5" />,
      endpoint: "https://sandbox.api.visa.com/visadirect/fundstransfer",
      description: "API thanh toán thẻ Visa Direct"
    }
  ]);

  const [systemMetrics, setSystemMetrics] = useState<SystemMetrics>({
    totalTransactions: 12457,
    successRate: 99.2,
    avgResponseTime: 134,
    activeUsers: 342
  });

  const [isRefreshing, setIsRefreshing] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'operational': return 'bg-green-500';
      case 'degraded': return 'bg-yellow-500';
      case 'down': return 'bg-red-500';
      case 'maintenance': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'operational': return 'Hoạt động tốt';
      case 'degraded': return 'Chậm';
      case 'down': return 'Lỗi';
      case 'maintenance': return 'Bảo trì';
      default: return 'Không xác định';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'operational': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'degraded': return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case 'down': return <XCircle className="h-4 w-4 text-red-500" />;
      case 'maintenance': return <Clock className="h-4 w-4 text-blue-500" />;
      default: return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const refreshStatus = async () => {
    setIsRefreshing(true);
    
    // Simulate API calls to check status
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Update with new random data (in real app, this would be actual API calls)
    setApiStatuses(prev => prev.map(api => ({
      ...api,
      responseTime: Math.floor(Math.random() * 200) + 50,
      lastCheck: new Date().toISOString(),
      uptime: Math.floor(Math.random() * 100) / 10 + 98
    })));
    
    setSystemMetrics(prev => ({
      ...prev,
      totalTransactions: prev.totalTransactions + Math.floor(Math.random() * 50),
      successRate: Math.floor(Math.random() * 100) / 10 + 98,
      avgResponseTime: Math.floor(Math.random() * 100) + 80,
      activeUsers: Math.floor(Math.random() * 100) + 300
    }));
    
    setIsRefreshing(false);
  };

  useEffect(() => {
    // Auto-refresh every 30 seconds
    const interval = setInterval(refreshStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-6xl mx-auto p-6">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Trạng thái hệ thống
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Theo dõi tình trạng hoạt động của các API thanh toán
              </p>
            </div>
            <Button 
              onClick={refreshStatus} 
              disabled={isRefreshing}
              variant="outline"
              className="flex items-center gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              Làm mới
            </Button>
          </div>
        </div>

        {/* System Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Tổng giao dịch
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {systemMetrics.totalTransactions.toLocaleString()}
                  </p>
                </div>
                <TrendingUp className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Tỷ lệ thành công
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {systemMetrics.successRate}%
                  </p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Thời gian phản hồi
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {systemMetrics.avgResponseTime}ms
                  </p>
                </div>
                <Clock className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Người dùng online
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {systemMetrics.activeUsers}
                  </p>
                </div>
                <Globe className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* API Status Cards */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Trạng thái API
          </h2>
          
          {apiStatuses.map((api, index) => (
            <Card key={index}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {api.icon}
                    <div>
                      <CardTitle className="text-lg">{api.name}</CardTitle>
                      <CardDescription>{api.description}</CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(api.status)}
                    <Badge variant="outline" className={`${getStatusColor(api.status)} text-white`}>
                      {getStatusText(api.status)}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Uptime</p>
                    <p className="text-lg font-semibold">{api.uptime}%</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Response Time</p>
                    <p className="text-lg font-semibold">{api.responseTime}ms</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Last Check</p>
                    <p className="text-lg font-semibold">
                      {new Date(api.lastCheck).toLocaleTimeString('vi-VN')}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Endpoint</p>
                    <p className="text-sm font-mono bg-gray-100 dark:bg-gray-800 rounded px-2 py-1 truncate">
                      {api.endpoint}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* System Alerts */}
        <div className="mt-8 space-y-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Thông báo hệ thống
          </h2>
          
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>Cập nhật bảo trì:</strong> ZaloPay API sẽ được nâng cấp vào 2:00 AM ngày 16/07/2025. 
              Dự kiến thời gian hoàn thành: 30 phút.
            </AlertDescription>
          </Alert>

          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>Cải thiện hiệu suất:</strong> Visa Direct API đã được tối ưu hóa, 
              giảm thời gian phản hồi trung bình 15%.
            </AlertDescription>
          </Alert>
        </div>

        {/* Recent Incidents */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Sự cố gần đây
          </h2>
          
          <Card>
            <CardContent className="pt-6">
              <div className="text-center text-gray-500 dark:text-gray-400">
                <Clock className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>Không có sự cố nào trong 30 ngày qua</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}