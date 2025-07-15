import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Smartphone, ShoppingCart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { formatCurrency } from "@/lib/utils";
import PaymentModal from "@/components/payment-modal";
import type { Bill } from "@shared/schema";

export default function PhonecardPurchase() {
  const [provider, setProvider] = useState<string>("");
  const [denomination, setDenomination] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(1);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string | null>(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [generatedBill, setGeneratedBill] = useState<Bill | null>(null);
  const { toast } = useToast();

  const providers = [
    { value: "viettel", label: "Viettel", color: "text-green-600" },
    { value: "vinaphone", label: "Vinaphone", color: "text-orange-600" },
    { value: "mobifone", label: "Mobifone", color: "text-blue-600" },
    { value: "vietnamobile", label: "Vietnamobile", color: "text-red-600" },
    { value: "gmobile", label: "Gmobile", color: "text-purple-600" },
  ];

  const denominations = [
    { value: "10000", label: "10.000đ" },
    { value: "20000", label: "20.000đ" },
    { value: "50000", label: "50.000đ" },
    { value: "100000", label: "100.000đ" },
    { value: "200000", label: "200.000đ" },
    { value: "500000", label: "500.000đ" },
  ];

  const paymentMethods = [
    { id: "momo", label: "Ví MoMo", icon: "💳" },
    { id: "visa", label: "Thẻ Visa/Mastercard", icon: "💳" },
    { id: "bank", label: "Chuyển khoản ngân hàng", icon: "🏦" },
  ];

  const getTotalAmount = () => {
    return parseInt(denomination) * quantity;
  };

  const handlePurchase = () => {
    if (!provider || !denomination || quantity < 1) {
      toast({
        title: "Lỗi",
        description: "Vui lòng chọn đầy đủ thông tin thẻ cào",
        variant: "destructive",
      });
      return;
    }

    if (!selectedPaymentMethod) {
      toast({
        title: "Lỗi",
        description: "Vui lòng chọn phương thức thanh toán",
        variant: "destructive",
      });
      return;
    }

    // Generate a bill-like object for payment processing
    const phonecardBill: Bill = {
      id: Date.now(),
      customerId: "PHONECARD_CUSTOMER",
      billType: "phonecard",
      provider: provider,
      amount: getTotalAmount().toString(),
      dueDate: new Date().toISOString(),
      status: "pending",
      period: new Date().toISOString().slice(0, 7),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setGeneratedBill(phonecardBill);
    setIsPaymentModalOpen(true);
  };

  const handlePaymentSuccess = () => {
    toast({
      title: "Thành công",
      description: `Đã mua ${quantity} thẻ ${denomination}đ của ${provider}`,
    });
    // Reset form
    setProvider("");
    setDenomination("");
    setQuantity(1);
    setSelectedPaymentMethod(null);
    setGeneratedBill(null);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Smartphone className="h-6 w-6 text-pink-500" />
            Mua thẻ cào điện thoại
          </CardTitle>
          <CardDescription>
            Chọn loại thẻ, mệnh giá và số lượng cần mua
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Provider Selection */}
          <div className="space-y-2">
            <Label>Nhà mạng</Label>
            <Select value={provider} onValueChange={setProvider}>
              <SelectTrigger>
                <SelectValue placeholder="Chọn nhà mạng" />
              </SelectTrigger>
              <SelectContent>
                {providers.map((p) => (
                  <SelectItem key={p.value} value={p.value}>
                    <span className={p.color}>{p.label}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Denomination Selection */}
          <div className="space-y-2">
            <Label>Mệnh giá</Label>
            <Select value={denomination} onValueChange={setDenomination}>
              <SelectTrigger>
                <SelectValue placeholder="Chọn mệnh giá" />
              </SelectTrigger>
              <SelectContent>
                {denominations.map((d) => (
                  <SelectItem key={d.value} value={d.value}>
                    {d.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Quantity */}
          <div className="space-y-2">
            <Label>Số lượng</Label>
            <Input
              type="number"
              min="1"
              max="10"
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
              className="w-32"
            />
          </div>

          {/* Total Amount */}
          {provider && denomination && (
            <div className="rounded-lg bg-muted p-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Tổng tiền:</span>
                <span className="text-2xl font-bold text-primary">
                  {formatCurrency(getTotalAmount())}
                </span>
              </div>
            </div>
          )}

          {/* Payment Methods */}
          <div className="space-y-2">
            <Label>Phương thức thanh toán</Label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {paymentMethods.map((method) => (
                <Button
                  key={method.id}
                  variant={selectedPaymentMethod === method.id ? "default" : "outline"}
                  className="h-20 flex flex-col items-center justify-center space-y-2"
                  onClick={() => setSelectedPaymentMethod(method.id)}
                >
                  <span className="text-2xl">{method.icon}</span>
                  <span className="text-sm">{method.label}</span>
                </Button>
              ))}
            </div>
          </div>

          {/* Purchase Button */}
          <Button
            onClick={handlePurchase}
            className="w-full bg-success hover:bg-success/90 text-white py-3 text-lg font-semibold"
            disabled={!provider || !denomination || !selectedPaymentMethod}
          >
            <ShoppingCart className="mr-2 h-5 w-5" />
            Mua thẻ ngay
          </Button>
        </CardContent>
      </Card>

      {/* Payment Modal */}
      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        bill={generatedBill}
        paymentMethod={selectedPaymentMethod}
        onPaymentSuccess={handlePaymentSuccess}
      />
    </div>
  );
}