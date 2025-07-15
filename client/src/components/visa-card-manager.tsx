import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { CreditCard, Plus, Trash2, Edit, Shield } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";

const visaCardSchema = z.object({
  cardNumber: z.string().min(16, "Số thẻ phải có 16 chữ số").max(16, "Số thẻ phải có 16 chữ số"),
  expiryMonth: z.string().min(2, "Tháng hết hạn không hợp lệ").max(2, "Tháng hết hạn không hợp lệ"),
  expiryYear: z.string().min(2, "Năm hết hạn không hợp lệ").max(2, "Năm hết hạn không hợp lệ"),
  cvv: z.string().min(3, "CVV phải có 3 chữ số").max(3, "CVV phải có 3 chữ số"),
  holderName: z.string().min(2, "Tên chủ thẻ quá ngắn"),
  nickname: z.string().min(1, "Vui lòng nhập tên gọi cho thẻ"),
});

type VisaCardForm = z.infer<typeof visaCardSchema>;

interface VisaCard {
  id: string;
  cardNumber: string;
  expiryMonth: string;
  expiryYear: string;
  cvv: string;
  holderName: string;
  nickname: string;
  isDefault: boolean;
  createdAt: string;
}

export default function VisaCardManager() {
  const [cards, setCards] = useState<VisaCard[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingCard, setEditingCard] = useState<VisaCard | null>(null);
  const { toast } = useToast();

  const form = useForm<VisaCardForm>({
    resolver: zodResolver(visaCardSchema),
    defaultValues: {
      cardNumber: "",
      expiryMonth: "",
      expiryYear: "",
      cvv: "",
      holderName: "",
      nickname: "",
    },
  });

  // Load cards from localStorage on component mount
  useEffect(() => {
    const storedCards = localStorage.getItem('visaCards');
    if (storedCards) {
      setCards(JSON.parse(storedCards));
    }
  }, []);

  // Save cards to localStorage whenever cards change
  useEffect(() => {
    localStorage.setItem('visaCards', JSON.stringify(cards));
  }, [cards]);

  const formatCardNumber = (value: string) => {
    // Remove all non-digit characters
    const cleaned = value.replace(/\D/g, '');
    // Add spaces every 4 digits
    return cleaned.replace(/(\d{4})(?=\d)/g, '$1 ');
  };

  const maskCardNumber = (cardNumber: string) => {
    return cardNumber.replace(/(\d{4})(\d{4})(\d{4})(\d{4})/, '****-****-****-$4');
  };

  const onSubmit = (data: VisaCardForm) => {
    const newCard: VisaCard = {
      id: editingCard?.id || Date.now().toString(),
      ...data,
      isDefault: cards.length === 0 || editingCard?.isDefault || false,
      createdAt: editingCard?.createdAt || new Date().toISOString(),
    };

    if (editingCard) {
      setCards(cards.map(card => card.id === editingCard.id ? newCard : card));
      toast({
        title: "Thành công",
        description: "Đã cập nhật thông tin thẻ Visa",
      });
    } else {
      setCards([...cards, newCard]);
      toast({
        title: "Thành công",
        description: "Đã thêm thẻ Visa mới",
      });
    }

    form.reset();
    setIsAddDialogOpen(false);
    setEditingCard(null);
  };

  const handleEdit = (card: VisaCard) => {
    setEditingCard(card);
    form.reset({
      cardNumber: card.cardNumber,
      expiryMonth: card.expiryMonth,
      expiryYear: card.expiryYear,
      cvv: card.cvv,
      holderName: card.holderName,
      nickname: card.nickname,
    });
    setIsAddDialogOpen(true);
  };

  const handleDelete = (cardId: string) => {
    setCards(cards.filter(card => card.id !== cardId));
    toast({
      title: "Thành công",
      description: "Đã xóa thẻ Visa",
    });
  };

  const handleSetDefault = (cardId: string) => {
    setCards(cards.map(card => ({
      ...card,
      isDefault: card.id === cardId
    })));
    toast({
      title: "Thành công",
      description: "Đã đặt làm thẻ mặc định",
    });
  };

  const handleDialogClose = () => {
    setIsAddDialogOpen(false);
    setEditingCard(null);
    form.reset();
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-6 w-6 text-blue-600" />
            Quản lý thẻ Visa
          </CardTitle>
          <CardDescription>
            Thêm và quản lý thẻ Visa để sử dụng trong thanh toán tự động
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm text-muted-foreground">
              {cards.length} thẻ đã lưu
            </span>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => setEditingCard(null)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Thêm thẻ mới
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>
                    {editingCard ? "Chỉnh sửa thẻ Visa" : "Thêm thẻ Visa mới"}
                  </DialogTitle>
                </DialogHeader>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="nickname"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tên gọi thẻ</FormLabel>
                          <FormControl>
                            <Input placeholder="VD: Thẻ chính, Thẻ backup" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="cardNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Số thẻ</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="1234567890123456"
                              maxLength={16}
                              {...field}
                              onChange={(e) => {
                                const value = e.target.value.replace(/\D/g, '');
                                field.onChange(value);
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="expiryMonth"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Tháng hết hạn</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="MM"
                                maxLength={2}
                                {...field}
                                onChange={(e) => {
                                  const value = e.target.value.replace(/\D/g, '');
                                  field.onChange(value);
                                }}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="expiryYear"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Năm hết hạn</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="YY"
                                maxLength={2}
                                {...field}
                                onChange={(e) => {
                                  const value = e.target.value.replace(/\D/g, '');
                                  field.onChange(value);
                                }}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="cvv"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>CVV</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="123"
                              maxLength={3}
                              type="password"
                              {...field}
                              onChange={(e) => {
                                const value = e.target.value.replace(/\D/g, '');
                                field.onChange(value);
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="holderName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tên chủ thẻ</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="NGUYEN VAN A"
                              {...field}
                              onChange={(e) => {
                                const value = e.target.value.toUpperCase();
                                field.onChange(value);
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="flex justify-end gap-2">
                      <Button type="button" variant="outline" onClick={handleDialogClose}>
                        Hủy
                      </Button>
                      <Button type="submit">
                        {editingCard ? "Cập nhật" : "Thêm thẻ"}
                      </Button>
                    </div>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>

          {cards.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <CreditCard className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Chưa có thẻ Visa nào được lưu</p>
              <p className="text-sm">Thêm thẻ để sử dụng cho thanh toán tự động</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {cards.map((card) => (
                <Card key={card.id} className="relative">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded flex items-center justify-center">
                          <CreditCard className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{card.nickname}</span>
                            {card.isDefault && (
                              <Badge variant="secondary" className="text-xs">
                                Mặc định
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {maskCardNumber(card.cardNumber)}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {card.holderName} • {card.expiryMonth}/{card.expiryYear}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {!card.isDefault && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleSetDefault(card.id)}
                          >
                            <Shield className="h-4 w-4 mr-1" />
                            Đặt mặc định
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(card)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(card.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}