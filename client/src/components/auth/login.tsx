import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { LogIn, Building2, Key, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface LoginProps {
  onRegister: () => void;
}

export default function Login({ onRegister }: LoginProps) {
  const [apiKey, setApiKey] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { login } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!apiKey.trim()) {
      toast({
        title: "Lỗi",
        description: "Vui lòng nhập API key",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      await login(apiKey.trim());
      toast({
        title: "Đăng nhập thành công",
        description: "Chào mừng bạn quay trở lại!"
      });
    } catch (error: any) {
      toast({
        title: "Đăng nhập thất bại",
        description: error.message || "API key không hợp lệ",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = () => {
    onRegister();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary">
            <Building2 className="h-6 w-6 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold">Đăng nhập Payoo Business</CardTitle>
          <CardDescription>
            Quản lý thanh toán hóa đơn cho doanh nghiệp của bạn
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Sử dụng API key để đăng nhập. Nếu chưa có tài khoản, vui lòng đăng ký để nhận API key.
            </AlertDescription>
          </Alert>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="apiKey">API Key</Label>
              <div className="relative">
                <Key className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="apiKey"
                  type="password"
                  placeholder="pk_1234567890abcdef..."
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="pl-9"
                  required
                />
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2" />
              ) : (
                <LogIn className="mr-2 h-4 w-4" />
              )}
              Đăng nhập
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Chưa có tài khoản?
              </span>
            </div>
          </div>

          <Button 
            onClick={handleRegister}
            variant="outline" 
            className="w-full"
          >
            Đăng ký tài khoản mới
          </Button>

          <div className="text-center text-sm text-muted-foreground">
            <p>
              Bằng cách đăng nhập, bạn đồng ý với{' '}
              <a href="#" className="text-primary hover:underline">
                Điều khoản dịch vụ
              </a>{' '}
              và{' '}
              <a href="#" className="text-primary hover:underline">
                Chính sách bảo mật
              </a>
            </p>
            <p className="mt-2">
              Cần hỗ trợ? Liên hệ{' '}
              <a href="mailto:support@payoo.vn" className="text-primary hover:underline">
                support@payoo.vn
              </a>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}