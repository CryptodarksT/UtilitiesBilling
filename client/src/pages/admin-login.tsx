import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Eye, EyeOff, Shield, CreditCard, Building, Zap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const loginSchema = z.object({
  username: z.string().min(1, "Tên đăng nhập không được để trống"),
  password: z.string().min(6, "Mật khẩu tối thiểu 6 ký tự"),
});

const apiConfigSchema = z.object({
  apiKey: z.string().min(1, "API Key không được để trống"),
  apiSecret: z.string().min(1, "API Secret không được để trống"),
  sandboxMode: z.boolean().default(false),
});

type LoginForm = z.infer<typeof loginSchema>;
type ApiConfigForm = z.infer<typeof apiConfigSchema>;

export default function AdminLogin() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("momo");
  const { toast } = useToast();

  const loginForm = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const apiConfigForm = useForm<ApiConfigForm>({
    resolver: zodResolver(apiConfigSchema),
    defaultValues: {
      apiKey: "",
      apiSecret: "",
      sandboxMode: false,
    },
  });

  const handleLogin = async (data: LoginForm) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Đăng nhập thành công",
        description: "Bạn đã đăng nhập vào hệ thống quản trị",
      });
      
      // Store login state
      localStorage.setItem('adminLoggedIn', 'true');
      localStorage.setItem('adminProvider', activeTab);
      
    } catch (error) {
      toast({
        title: "Đăng nhập thất bại",
        description: "Vui lòng kiểm tra lại thông tin đăng nhập",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleApiConfig = async (data: ApiConfigForm) => {
    setIsLoading(true);
    try {
      // Save API configuration
      localStorage.setItem(`${activeTab}_api_config`, JSON.stringify(data));
      
      toast({
        title: "Cấu hình API thành công",
        description: `Đã lưu cấu hình ${activeTab.toUpperCase()} API`,
      });
      
    } catch (error) {
      toast({
        title: "Cấu hình thất bại",
        description: "Có lỗi xảy ra khi lưu cấu hình API",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const providerInfo = {
    momo: {
      name: "MoMo Business",
      icon: <CreditCard className="h-6 w-6" />,
      description: "Tài khoản doanh nghiệp MoMo để xử lý thanh toán e-wallet",
      docs: "https://developers.momo.vn/",
      fields: [
        { name: "apiKey", label: "Partner Code", placeholder: "Nhập Partner Code" },
        { name: "apiSecret", label: "Access Key", placeholder: "Nhập Access Key" },
      ]
    },
    bidv: {
      name: "BIDV API",
      icon: <Building className="h-6 w-6" />,
      description: "API tra cứu hóa đơn từ Ngân hàng BIDV",
      docs: "https://openapi.bidv.com.vn/",
      fields: [
        { name: "apiKey", label: "API Key", placeholder: "Nhập BIDV API Key" },
        { name: "apiSecret", label: "API Secret", placeholder: "Nhập BIDV API Secret" },
      ]
    },
    zalopay: {
      name: "ZaloPay Business",
      icon: <Zap className="h-6 w-6" />,
      description: "Tài khoản doanh nghiệp ZaloPay cho thanh toán online",
      docs: "https://developers.zalopay.vn/",
      fields: [
        { name: "apiKey", label: "App ID", placeholder: "Nhập ZaloPay App ID" },
        { name: "apiSecret", label: "Key 1", placeholder: "Nhập ZaloPay Key 1" },
      ]
    },
    visa: {
      name: "Visa Direct",
      icon: <Shield className="h-6 w-6" />,
      description: "API thanh toán thẻ tín dụng/ghi nợ Visa",
      docs: "https://developer.visa.com/",
      fields: [
        { name: "apiKey", label: "User ID", placeholder: "Nhập Visa User ID" },
        { name: "apiSecret", label: "Password", placeholder: "Nhập Visa Password" },
      ]
    }
  };

  const currentProvider = providerInfo[activeTab as keyof typeof providerInfo];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Quản trị hệ thống Payoo
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Đăng nhập và cấu hình các tài khoản doanh nghiệp
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="momo">MoMo</TabsTrigger>
            <TabsTrigger value="bidv">BIDV</TabsTrigger>
            <TabsTrigger value="zalopay">ZaloPay</TabsTrigger>
            <TabsTrigger value="visa">Visa</TabsTrigger>
          </TabsList>

          {Object.entries(providerInfo).map(([key, provider]) => (
            <TabsContent key={key} value={key}>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {provider.icon}
                    {provider.name}
                  </CardTitle>
                  <CardDescription>{provider.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <Alert>
                    <AlertDescription>
                      <strong>Hướng dẫn:</strong> Truy cập{" "}
                      <a 
                        href={provider.docs} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        {provider.docs}
                      </a>{" "}
                      để đăng ký tài khoản doanh nghiệp và lấy API credentials.
                    </AlertDescription>
                  </Alert>

                  {/* Login Form */}
                  <div className="space-y-4">
                    <h3 className="font-medium">Đăng nhập tài khoản</h3>
                    <form onSubmit={loginForm.handleSubmit(handleLogin)} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="username">Tên đăng nhập</Label>
                          <Input
                            id="username"
                            {...loginForm.register("username")}
                            placeholder="Nhập tên đăng nhập"
                          />
                          {loginForm.formState.errors.username && (
                            <p className="text-sm text-red-500">
                              {loginForm.formState.errors.username.message}
                            </p>
                          )}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="password">Mật khẩu</Label>
                          <div className="relative">
                            <Input
                              id="password"
                              type={showPassword ? "text" : "password"}
                              {...loginForm.register("password")}
                              placeholder="Nhập mật khẩu"
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="absolute right-2 top-1/2 transform -translate-y-1/2"
                              onClick={() => setShowPassword(!showPassword)}
                            >
                              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </Button>
                          </div>
                          {loginForm.formState.errors.password && (
                            <p className="text-sm text-red-500">
                              {loginForm.formState.errors.password.message}
                            </p>
                          )}
                        </div>
                      </div>
                      <Button type="submit" disabled={isLoading} className="w-full">
                        {isLoading ? "Đang đăng nhập..." : "Đăng nhập"}
                      </Button>
                    </form>
                  </div>

                  {/* API Configuration */}
                  <div className="space-y-4 border-t pt-4">
                    <h3 className="font-medium">Cấu hình API</h3>
                    <form onSubmit={apiConfigForm.handleSubmit(handleApiConfig)} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        {provider.fields.map((field) => (
                          <div key={field.name} className="space-y-2">
                            <Label htmlFor={field.name}>{field.label}</Label>
                            <Input
                              id={field.name}
                              {...apiConfigForm.register(field.name as keyof ApiConfigForm)}
                              placeholder={field.placeholder}
                            />
                          </div>
                        ))}
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="sandboxMode"
                          {...apiConfigForm.register("sandboxMode")}
                          className="rounded border-gray-300"
                        />
                        <Label htmlFor="sandboxMode">Chế độ Sandbox (Test)</Label>
                      </div>
                      <Button type="submit" disabled={isLoading} className="w-full">
                        {isLoading ? "Đang lưu..." : "Lưu cấu hình"}
                      </Button>
                    </form>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
}