import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CreditCard, Plus, Star, Trash2, Shield, Edit } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { customerCardSchema, type CustomerCardRequest, type CustomerCard } from "@shared/schema";

interface CustomerCardsProps {
  customerId: string;
  onCardSelect?: (card: CustomerCard) => void;
}

export default function CustomerCards({ customerId, onCardSelect }: CustomerCardsProps) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState<CustomerCard | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<CustomerCardRequest>({
    resolver: zodResolver(customerCardSchema),
    defaultValues: {
      customerId,
      cardName: "",
      cardNumber: "",
      cardHolder: "",
      expiryMonth: "",
      expiryYear: "",
      cardType: "visa",
      isDefault: false,
    },
  });

  // Fetch customer cards
  const { data: cardsData, isLoading } = useQuery({
    queryKey: ["/api/customers", customerId, "cards"],
    queryFn: () => apiRequest("GET", `/api/customers/${customerId}/cards`),
    enabled: !!customerId,
  });

  // Add card mutation
  const addCardMutation = useMutation({
    mutationFn: async (data: CustomerCardRequest) => {
      return apiRequest("POST", `/api/customers/${customerId}/cards`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["/api/customers", customerId, "cards"],
      });
      setIsAddDialogOpen(false);
      form.reset();
      toast({
        title: "Thành công",
        description: "Đã thêm thẻ thanh toán mới",
      });
    },
    onError: (error) => {
      toast({
        title: "Lỗi",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Set default card mutation
  const setDefaultMutation = useMutation({
    mutationFn: async (cardId: number) => {
      return apiRequest("PUT", `/api/customers/${customerId}/cards/${cardId}/default`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["/api/customers", customerId, "cards"],
      });
      toast({
        title: "Thành công",
        description: "Đã đặt làm thẻ mặc định",
      });
    },
    onError: (error) => {
      toast({
        title: "Lỗi",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Delete card mutation
  const deleteCardMutation = useMutation({
    mutationFn: async (cardId: number) => {
      return apiRequest("DELETE", `/api/customers/${customerId}/cards/${cardId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["/api/customers", customerId, "cards"],
      });
      toast({
        title: "Thành công",
        description: "Đã xóa thẻ thanh toán",
      });
    },
    onError: (error) => {
      toast({
        title: "Lỗi",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: CustomerCardRequest) => {
    addCardMutation.mutate(data);
  };

  const handleSetDefault = (cardId: number) => {
    setDefaultMutation.mutate(cardId);
  };

  const handleDeleteCard = (cardId: number) => {
    if (window.confirm("Bạn có chắc muốn xóa thẻ này?")) {
      deleteCardMutation.mutate(cardId);
    }
  };

  const getCardIcon = (cardType: string) => {
    switch (cardType) {
      case "visa":
        return "💳";
      case "mastercard":
        return "🔴";
      case "jcb":
        return "🟡";
      case "amex":
        return "🔵";
      default:
        return "💳";
    }
  };

  const cards = cardsData?.cards || [];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Thẻ thanh toán
            </CardTitle>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Thêm thẻ mới
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Thêm thẻ thanh toán</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="cardName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tên thẻ</FormLabel>
                          <FormControl>
                            <Input placeholder="Thẻ chính, Thẻ phụ..." {...field} />
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
                              maxLength={19}
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
                      name="cardHolder"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tên chủ thẻ</FormLabel>
                          <FormControl>
                            <Input placeholder="NGUYEN VAN A" {...field} />
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
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="MM" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {Array.from({ length: 12 }, (_, i) => {
                                  const month = (i + 1).toString().padStart(2, '0');
                                  return (
                                    <SelectItem key={month} value={month}>
                                      {month}
                                    </SelectItem>
                                  );
                                })}
                              </SelectContent>
                            </Select>
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
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="YY" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {Array.from({ length: 10 }, (_, i) => {
                                  const year = (new Date().getFullYear() + i).toString().slice(-2);
                                  return (
                                    <SelectItem key={year} value={year}>
                                      {year}
                                    </SelectItem>
                                  );
                                })}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="cardType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Loại thẻ</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="visa">Visa</SelectItem>
                              <SelectItem value="mastercard">Mastercard</SelectItem>
                              <SelectItem value="jcb">JCB</SelectItem>
                              <SelectItem value="amex">American Express</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="isDefault"
                      render={({ field }) => (
                        <FormItem className="flex items-center space-x-2">
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <FormLabel>Đặt làm thẻ mặc định</FormLabel>
                        </FormItem>
                      )}
                    />
                    
                    <div className="flex justify-end space-x-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsAddDialogOpen(false)}
                      >
                        Hủy
                      </Button>
                      <Button type="submit" disabled={addCardMutation.isPending}>
                        {addCardMutation.isPending ? "Đang thêm..." : "Thêm thẻ"}
                      </Button>
                    </div>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(3)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-4">
                    <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : cards.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <CreditCard className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Chưa có thẻ thanh toán nào</p>
              <p className="text-sm">Thêm thẻ để thanh toán nhanh hơn</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {cards.map((card: CustomerCard) => (
                <Card 
                  key={card.id} 
                  className={`cursor-pointer transition-all hover:shadow-lg ${
                    selectedCard?.id === card.id ? 'ring-2 ring-blue-500' : ''
                  }`}
                  onClick={() => {
                    setSelectedCard(card);
                    onCardSelect?.(card);
                  }}
                >
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{getCardIcon(card.cardType)}</span>
                        <div>
                          <p className="font-medium">{card.cardName}</p>
                          <p className="text-sm text-gray-500 uppercase">
                            {card.cardType}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        {card.isDefault && (
                          <Badge variant="default" className="text-xs">
                            <Star className="h-3 w-3 mr-1" />
                            Mặc định
                          </Badge>
                        )}
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSetDefault(card.id);
                            }}
                            disabled={card.isDefault}
                          >
                            <Star className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteCard(card.id);
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <p className="font-mono text-lg tracking-wider">
                        {card.cardNumber}
                      </p>
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-xs text-gray-500">Chủ thẻ</p>
                          <p className="font-medium text-sm">{card.cardHolder}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-gray-500">Hết hạn</p>
                          <p className="font-medium text-sm">
                            {card.expiryMonth}/{card.expiryYear}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-3 pt-3 border-t">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1 text-green-600">
                          <Shield className="h-4 w-4" />
                          <span className="text-xs">Bảo mật</span>
                        </div>
                        <Badge 
                          variant={card.isActive ? "default" : "secondary"}
                          className="text-xs"
                        >
                          {card.isActive ? "Hoạt động" : "Tạm khóa"}
                        </Badge>
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