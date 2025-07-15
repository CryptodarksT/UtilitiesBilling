import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { CreditCard, Plus, Star, Trash2, Shield } from 'lucide-react';

interface LinkedCard {
  id: number;
  customerId: string;
  cardType: string;
  cardNumber: string;
  cardHolderName: string;
  bankName?: string;
  isDefault: boolean;
  createdAt: string;
}

export default function CardManager() {
  const [isAddingCard, setIsAddingCard] = useState(false);
  const [formData, setFormData] = useState({
    customerId: '',
    cardType: '',
    cardNumber: '',
    cardHolderName: '',
    expiryMonth: '',
    expiryYear: '',
    bankName: '',
  });
  const { toast } = useToast();
  const { getAuthToken } = useAuth();
  const queryClient = useQueryClient();

  // Fetch user's linked cards
  const { data: cardsData, isLoading } = useQuery({
    queryKey: ['linkedCards'],
    queryFn: async () => {
      const token = await getAuthToken();
      const response = await apiRequest('GET', '/api/cards', null, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.json();
    },
  });

  // Add new card mutation
  const addCardMutation = useMutation({
    mutationFn: async (cardData: any) => {
      const token = await getAuthToken();
      return apiRequest('POST', '/api/cards/link', cardData, {
        headers: { Authorization: `Bearer ${token}` }
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['linkedCards'] });
      setIsAddingCard(false);
      setFormData({
        customerId: '',
        cardType: '',
        cardNumber: '',
        cardHolderName: '',
        expiryMonth: '',
        expiryYear: '',
        bankName: '',
      });
      toast({
        title: "Thành công",
        description: "Thẻ đã được liên kết thành công!"
      });
    },
    onError: (error: any) => {
      toast({
        title: "Lỗi",
        description: error.message || "Không thể liên kết thẻ",
        variant: "destructive"
      });
    }
  });

  // Set default card mutation
  const setDefaultMutation = useMutation({
    mutationFn: async (cardId: number) => {
      const token = await getAuthToken();
      return apiRequest('PATCH', `/api/cards/${cardId}/default`, null, {
        headers: { Authorization: `Bearer ${token}` }
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['linkedCards'] });
      toast({
        title: "Thành công",
        description: "Thẻ mặc định đã được cập nhật!"
      });
    }
  });

  // Remove card mutation
  const removeCardMutation = useMutation({
    mutationFn: async (cardId: number) => {
      const token = await getAuthToken();
      return apiRequest('DELETE', `/api/cards/${cardId}`, null, {
        headers: { Authorization: `Bearer ${token}` }
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['linkedCards'] });
      toast({
        title: "Thành công",
        description: "Thẻ đã được xóa!"
      });
    }
  });

  const handleAddCard = async (e: React.FormEvent) => {
    e.preventDefault();
    await addCardMutation.mutateAsync(formData);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const getCardTypeColor = (type: string) => {
    switch (type) {
      case 'visa': return 'bg-blue-500';
      case 'mastercard': return 'bg-red-500';
      case 'local_bank': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  const cards = cardsData?.cards || [];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Quản lý thẻ liên kết</h2>
          <p className="text-muted-foreground">
            Liên kết thẻ để thanh toán tự động cho khách hàng
          </p>
        </div>
        <Dialog open={isAddingCard} onOpenChange={setIsAddingCard}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Thêm thẻ mới
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Thêm thẻ liên kết</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddCard} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="customerId">Mã khách hàng *</Label>
                <Input
                  id="customerId"
                  name="customerId"
                  placeholder="EVN001234"
                  value={formData.customerId}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="cardType">Loại thẻ *</Label>
                <Select
                  value={formData.cardType}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, cardType: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn loại thẻ" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="visa">Visa</SelectItem>
                    <SelectItem value="mastercard">Mastercard</SelectItem>
                    <SelectItem value="local_bank">Thẻ ATM nội địa</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="cardNumber">Số thẻ *</Label>
                <Input
                  id="cardNumber"
                  name="cardNumber"
                  placeholder="1234 5678 9012 3456"
                  value={formData.cardNumber}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="cardHolderName">Tên chủ thẻ *</Label>
                <Input
                  id="cardHolderName"
                  name="cardHolderName"
                  placeholder="NGUYEN VAN A"
                  value={formData.cardHolderName}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="expiryMonth">Tháng hết hạn</Label>
                  <Input
                    id="expiryMonth"
                    name="expiryMonth"
                    placeholder="12"
                    value={formData.expiryMonth}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="expiryYear">Năm hết hạn</Label>
                  <Input
                    id="expiryYear"
                    name="expiryYear"
                    placeholder="2025"
                    value={formData.expiryYear}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="bankName">Ngân hàng</Label>
                <Input
                  id="bankName"
                  name="bankName"
                  placeholder="Vietcombank"
                  value={formData.bankName}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsAddingCard(false)}
                  className="flex-1"
                >
                  Hủy
                </Button>
                <Button
                  type="submit"
                  disabled={addCardMutation.isPending}
                  className="flex-1"
                >
                  {addCardMutation.isPending ? (
                    <div className="animate-spin w-4 h-4 border-2 border-current border-t-transparent rounded-full mr-2" />
                  ) : null}
                  Thêm thẻ
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {cards.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <CreditCard className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Chưa có thẻ liên kết</h3>
            <p className="text-muted-foreground text-center mb-4">
              Thêm thẻ để bắt đầu thanh toán tự động cho khách hàng
            </p>
            <Button onClick={() => setIsAddingCard(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Thêm thẻ đầu tiên
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {cards.map((card: LinkedCard) => (
            <Card key={card.id} className="relative">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded ${getCardTypeColor(card.cardType)} flex items-center justify-center`}>
                      <CreditCard className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{card.cardNumber}</CardTitle>
                      <CardDescription>{card.cardHolderName}</CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {card.isDefault && (
                      <Badge variant="secondary">
                        <Star className="h-3 w-3 mr-1" />
                        Mặc định
                      </Badge>
                    )}
                    <Badge variant="outline" className="capitalize">
                      {card.cardType}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <div className="text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Shield className="h-3 w-3" />
                      Khách hàng: {card.customerId}
                    </div>
                    {card.bankName && (
                      <div className="mt-1">Ngân hàng: {card.bankName}</div>
                    )}
                  </div>
                  <div className="flex gap-2">
                    {!card.isDefault && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setDefaultMutation.mutate(card.id)}
                        disabled={setDefaultMutation.isPending}
                      >
                        <Star className="h-3 w-3 mr-1" />
                        Đặt mặc định
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeCardMutation.mutate(card.id)}
                      disabled={removeCardMutation.isPending}
                    >
                      <Trash2 className="h-3 w-3 mr-1" />
                      Xóa
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}