import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { signInWithGoogle } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';
import { LogIn, Building2 } from 'lucide-react';

interface LoginProps {
  onRegister: () => void;
}

export default function Login({ onRegister }: LoginProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { register } = useAuth();

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      const result = await signInWithGoogle();
      
      // Check if user exists in our database
      try {
        const token = await result.user.getIdToken();
        const response = await fetch('/api/auth/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (!response.ok) {
          // User doesn't exist, show registration form
          onRegister();
        } else {
          toast({
            title: "Đăng nhập thành công",
            description: "Chào mừng bạn quay trở lại!"
          });
        }
      } catch (error) {
        console.error('Profile check error:', error);
        // If profile check fails, assume new user
        onRegister();
      }
    } catch (error: any) {
      console.error('Google sign in error:', error);
      toast({
        title: "Lỗi đăng nhập",
        description: error.message || "Không thể đăng nhập với Google",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
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
          <Button
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className="w-full"
            variant="outline"
          >
            {isLoading ? (
              <div className="animate-spin w-4 h-4 border-2 border-current border-t-transparent rounded-full mr-2" />
            ) : (
              <LogIn className="mr-2 h-4 w-4" />
            )}
            Đăng nhập với Google
          </Button>
          
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Hoặc
              </span>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="email@doanhnghiep.com"
              disabled
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">Mật khẩu</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              disabled
            />
          </div>
          
          <Button className="w-full" disabled>
            Đăng nhập bằng email (Sắp có)
          </Button>
          
          <div className="text-center text-sm text-muted-foreground">
            Bằng cách đăng nhập, bạn đồng ý với{' '}
            <a href="#" className="text-primary hover:underline">
              Điều khoản dịch vụ
            </a>{' '}
            và{' '}
            <a href="#" className="text-primary hover:underline">
              Chính sách bảo mật
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}