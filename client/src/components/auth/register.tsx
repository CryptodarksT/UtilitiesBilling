import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { ArrowLeft, Building2, Key, Copy, Check } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface RegisterProps {
  onBack: () => void;
}

export default function Register({ onBack }: RegisterProps) {
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    businessName: '',
    phone: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();
  const { register } = useAuth();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email || !formData.name) {
      toast({
        title: "Lỗi",
        description: "Vui lòng điền đầy đủ thông tin bắt buộc",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const result = await register(formData);
      setApiKey(result.apiKey);
      toast({
        title: "Đăng ký thành công",
        description: "Tài khoản đã được tạo. Vui lòng lưu API key của bạn."
      });
    } catch (error: any) {
      toast({
        title: "Đăng ký thất bại",
        description: error.message || "Không thể tạo tài khoản",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyApiKey = async () => {
    try {
      await navigator.clipboard.writeText(apiKey);
      setCopied(true);
      toast({
        title: "Đã sao chép",
        description: "API key đã được sao chép vào clipboard"
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể sao chép API key",
        variant: "destructive"
      });
    }
  };

  const handleContinue = () => {
    onBack();
  };

  if (apiKey) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
              <Check className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <CardTitle className="text-2xl font-bold">Đăng ký thành công!</CardTitle>
            <CardDescription>
              Tài khoản của bạn đã được tạo. Vui lòng lưu API key này để đăng nhập.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <Key className="h-4 w-4" />
              <AlertDescription>
                <strong>Quan trọng:</strong> Vui lòng lưu API key này. Bạn sẽ không thể xem lại nó sau này.
              </AlertDescription>
            </Alert>

            <div className="space-y-2">
              <Label htmlFor="apiKey">API Key của bạn</Label>
              <div className="flex space-x-2">
                <Input
                  id="apiKey"
                  type="text"
                  value={apiKey}
                  readOnly
                  className="font-mono text-sm"
                />
                <Button
                  onClick={handleCopyApiKey}
                  variant="outline"
                  size="sm"
                  className="px-3"
                >
                  {copied ? (
                    <Check className="h-4 w-4 text-green-600" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg">
              <p className="text-sm text-yellow-800 dark:text-yellow-200">
                <strong>Lưu ý:</strong> 
                <br />• API key này có hiệu lực 1 năm
                <br />• Giữ bí mật API key của bạn
                <br />• Liên hệ admin để xác minh tài khoản
              </p>
            </div>

            <Button 
              onClick={handleContinue}
              className="w-full"
            >
              Tiếp tục đăng nhập
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary">
            <Building2 className="h-6 w-6 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold">Đăng ký tài khoản</CardTitle>
          <CardDescription>
            Tạo tài khoản doanh nghiệp để sử dụng Payoo Business
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email <span className="text-red-500">*</span></Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="email@doanhnghiep.com"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Họ và tên <span className="text-red-500">*</span></Label>
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="Nguyễn Văn A"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="businessName">Tên doanh nghiệp</Label>
              <Input
                id="businessName"
                name="businessName"
                type="text"
                placeholder="Công ty ABC"
                value={formData.businessName}
                onChange={handleInputChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Số điện thoại</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                placeholder="0123456789"
                value={formData.phone}
                onChange={handleInputChange}
              />
            </div>

            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2" />
              ) : null}
              Tạo tài khoản
            </Button>
          </form>

          <Button 
            onClick={onBack}
            variant="outline" 
            className="w-full"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Quay lại đăng nhập
          </Button>

          <div className="text-center text-sm text-muted-foreground">
            <p>
              Bằng cách đăng ký, bạn đồng ý với{' '}
              <a href="#" className="text-primary hover:underline">
                Điều khoản dịch vụ
              </a>{' '}
              và{' '}
              <a href="#" className="text-primary hover:underline">
                Chính sách bảo mật
              </a>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}