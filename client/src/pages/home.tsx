import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bolt, Droplets, Wifi, Tv, DollarSign, Upload, Smartphone } from "lucide-react";
import BillLookup from "@/components/bill-lookup";
import BillInfo from "@/components/bill-info";
import PaymentMethods from "@/components/payment-methods";
import PaymentModal from "@/components/payment-modal";
import StatsCards from "@/components/stats-cards";
import TxtUpload from "@/components/txt-upload";
import AutoPayment from "@/components/auto-payment";
import PhonecardPurchase from "@/components/phonecard-purchase";
import VisaCardManager from "@/components/visa-card-manager";
import { useToast } from "@/hooks/use-toast";
import type { Bill, Customer } from "@shared/schema";

export default function Home() {
  const [billData, setBillData] = useState<{ bill: Bill; customer: Customer; source?: string } | null>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string | null>(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const { toast } = useToast();

  const handleBillFound = (data: { bill: Bill; customer: Customer; source?: string }) => {
    setBillData(data);
    setSelectedPaymentMethod(null);
  };

  const handlePaymentMethodSelect = (method: string) => {
    setSelectedPaymentMethod(method);
  };

  const handlePaymentClick = () => {
    if (!selectedPaymentMethod) {
      toast({
        title: "Lỗi",
        description: "Vui lòng chọn phương thức thanh toán",
        variant: "destructive",
      });
      return;
    }
    setIsPaymentModalOpen(true);
  };

  const handlePaymentSuccess = () => {
    // Refresh bill data to show updated status
    if (billData) {
      setBillData({
        ...billData,
        bill: { ...billData.bill, status: "paid" },
      });
    }
    setSelectedPaymentMethod(null);
  };

  const billTypeButtons = [
    { id: "electricity", label: "Điện", icon: Bolt, color: "text-yellow-500" },
    { id: "water", label: "Nước", icon: Droplets, color: "text-blue-500" },
    { id: "internet", label: "Internet", icon: Wifi, color: "text-purple-500" },
    { id: "tv", label: "Truyền hình", icon: Tv, color: "text-green-500" },
    { id: "phonecard", label: "Thẻ cào", icon: Smartphone, color: "text-pink-500" },
  ];

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="gradient-primary rounded-lg p-8 mb-8 text-white">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="md:w-1/2 mb-6 md:mb-0">
              <h1 className="text-3xl md:text-4xl font-bold mb-4">
                Thanh toán hóa đơn
              </h1>
              <p className="text-lg opacity-90">
                Điện - Nước - Internet - Truyền hình
              </p>
              <p className="text-sm opacity-80 mt-2">
                Nhanh chóng • An toàn • Tiện lợi
              </p>
            </div>
            <div className="md:w-1/2 flex justify-center">
              <div className="bg-white bg-opacity-20 rounded-full p-8">
                <DollarSign className="h-16 w-16" />
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {billTypeButtons.map((button) => {
            const IconComponent = button.icon;
            return (
              <Button
                key={button.id}
                variant="outline"
                className="h-20 flex flex-col items-center justify-center space-y-2 bg-white hover:bg-gray-50 card-shadow hover:shadow-lg transition-all duration-200"
              >
                <IconComponent className={`h-8 w-8 ${button.color}`} />
                <span className="text-sm font-medium">{button.label}</span>
              </Button>
            );
          })}
        </div>

        {/* Main Content Tabs */}
        <div className="mb-8">
          <Tabs defaultValue="search" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="search">Tra cứu hóa đơn</TabsTrigger>
              <TabsTrigger value="txt">Upload TXT</TabsTrigger>
              <TabsTrigger value="auto">Thanh toán tự động</TabsTrigger>
              <TabsTrigger value="phonecard">Mua thẻ cào</TabsTrigger>
              <TabsTrigger value="visa">Quản lý thẻ Visa</TabsTrigger>
            </TabsList>
            
            <TabsContent value="search" className="mt-6">
              <BillLookup onBillFound={handleBillFound} />
            </TabsContent>
            
            <TabsContent value="txt" className="mt-6">
              <TxtUpload />
            </TabsContent>
            
            <TabsContent value="auto" className="mt-6">
              <AutoPayment />
            </TabsContent>
            
            <TabsContent value="phonecard" className="mt-6">
              <PhonecardPurchase />
            </TabsContent>
            
            <TabsContent value="visa" className="mt-6">
              <VisaCardManager />
            </TabsContent>
          </Tabs>
        </div>

        {/* Bill Information */}
        {billData && (
          <div className="mb-8">
            <BillInfo bill={billData.bill} customer={billData.customer} source={billData.source} />
          </div>
        )}

        {/* Payment Methods */}
        {billData && billData.bill.status !== "paid" && (
          <div className="mb-8">
            <PaymentMethods
              onMethodSelect={handlePaymentMethodSelect}
              selectedMethod={selectedPaymentMethod}
            />
          </div>
        )}

        {/* Payment Button */}
        {billData && billData.bill.status !== "paid" && (
          <div className="mb-8">
            <Button
              onClick={handlePaymentClick}
              className="w-full bg-success hover:bg-success/90 text-white py-3 px-6 text-lg font-semibold"
              disabled={!selectedPaymentMethod}
            >
              Thanh toán ngay
            </Button>
          </div>
        )}

        {/* Payment Success Badge */}
        {billData && billData.bill.status === "paid" && (
          <div className="mb-8 flex justify-center">
            <Badge className="bg-success text-white px-6 py-2 text-lg">
              Hóa đơn đã được thanh toán
            </Badge>
          </div>
        )}

        {/* Stats Cards */}
        <StatsCards />

        {/* Payment Modal */}
        <PaymentModal
          isOpen={isPaymentModalOpen}
          onClose={() => setIsPaymentModalOpen(false)}
          bill={billData?.bill || null}
          paymentMethod={selectedPaymentMethod}
          onPaymentSuccess={handlePaymentSuccess}
        />
      </div>
    </div>
  );
}
