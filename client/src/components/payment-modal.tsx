import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { QrCode, Building2, Smartphone, Loader2, CheckCircle } from "lucide-react";
import { formatCurrency, generateTransactionId } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { Bill } from "@shared/schema";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  bill: Bill | null;
  paymentMethod: string | null;
  onPaymentSuccess: () => void;
}

export default function PaymentModal({
  isOpen,
  onClose,
  bill,
  paymentMethod,
  onPaymentSuccess,
}: PaymentModalProps) {
  const [transactionId, setTransactionId] = useState<string | null>(null);
  const { toast } = useToast();

  const createPaymentMutation = useMutation({
    mutationFn: async (data: { billId: number; paymentMethod: string }) => {
      const response = await apiRequest("POST", "/api/payments", data);
      return response.json();
    },
    onSuccess: (data) => {
      setTransactionId(data.transactionId);
      
      // Handle MoMo payments - redirect to payment URL
      if (data.paymentUrl && (paymentMethod === "momo" || paymentMethod === "visa")) {
        window.open(data.paymentUrl, '_blank');
        toast({
          title: "Chuyển hướng thanh toán",
          description: "Vui lòng hoàn tất thanh toán trên trang MoMo...",
        });
      } else if (data.momoStatus === "pending_verification") {
        toast({
          title: "Tích hợp MoMo đã sẵn sàng",
          description: "Tài khoản doanh nghiệp cần xác thực để xử lý thanh toán thực tế.",
        });
      } else {
        toast({
          title: "Đang xử lý thanh toán",
          description: "Vui lòng đợi trong giây lát...",
        });
      }
    },
    onError: (error) => {
      toast({
        title: "Lỗi",
        description: error instanceof Error ? error.message : "Có lỗi xảy ra",
        variant: "destructive",
      });
    },
  });

  // Poll payment status
  const { data: paymentStatus } = useQuery({
    queryKey: ["/api/payments", transactionId],
    enabled: !!transactionId,
    refetchInterval: 1000,
  });

  const handleConfirmPayment = () => {
    if (!bill || !paymentMethod) return;

    createPaymentMutation.mutate({
      billId: bill.id,
      paymentMethod,
    });
  };

  const handleClose = () => {
    setTransactionId(null);
    onClose();
  };

  const handlePaymentComplete = () => {
    queryClient.invalidateQueries({ queryKey: ["/api/bills/lookup"] });
    onPaymentSuccess();
    handleClose();
    
    toast({
      title: "Thanh toán thành công!",
      description: "Hóa đơn đã được thanh toán thành công.",
    });
  };

  // Check if payment is completed
  if (paymentStatus?.payment?.status === "completed") {
    setTimeout(handlePaymentComplete, 1000);
  }

  const renderPaymentMethodContent = () => {
    if (!bill || !paymentMethod) return null;

    const amount = formatCurrency(bill.amount);
    const txId = transactionId || generateTransactionId();

    switch (paymentMethod) {
      case "qr":
        return (
          <div className="text-center space-y-4">
            <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-8 flex items-center justify-center">
              <QrCode className="h-24 w-24 text-gray-400" />
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Quét mã QR để thanh toán
            </p>
            <Card>
              <CardContent className="pt-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="font-medium">Số tiền:</span>
                    <span className="font-bold text-primary">{amount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Mã GD:</span>
                    <span className="text-sm font-mono">{txId}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case "bank":
        return (
          <div className="space-y-4">
            <div className="flex items-center space-x-2 mb-4">
              <Building2 className="h-5 w-5 text-primary" />
              <h4 className="font-semibold">Thông tin chuyển khoản</h4>
            </div>
            <Card>
              <CardContent className="pt-4">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Ngân hàng:</span>
                    <span className="font-semibold">Vietcombank</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Số tài khoản:</span>
                    <span className="font-semibold font-mono">0123456789</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Chủ tài khoản:</span>
                    <span className="font-semibold">PAYOO VN</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Số tiền:</span>
                    <span className="font-semibold text-primary">{amount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Nội dung:</span>
                    <span className="font-semibold font-mono">PAY {bill.customerId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Mã GD:</span>
                    <span className="font-semibold font-mono">{txId}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case "ewallet":
        return (
          <div className="space-y-4">
            <div className="flex items-center space-x-2 mb-4">
              <Smartphone className="h-5 w-5 text-primary" />
              <h4 className="font-semibold">Chọn ví điện tử</h4>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Button
                variant="outline"
                className="h-16 flex flex-col items-center justify-center space-y-2"
              >
                <div className="w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">M</span>
                </div>
                <span className="text-sm">MoMo</span>
              </Button>
              <Button
                variant="outline"
                className="h-16 flex flex-col items-center justify-center space-y-2"
              >
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">Z</span>
                </div>
                <span className="text-sm">ZaloPay</span>
              </Button>
            </div>
            <Card>
              <CardContent className="pt-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="font-medium">Số tiền:</span>
                    <span className="font-bold text-primary">{amount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Mã GD:</span>
                    <span className="text-sm font-mono">{txId}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      default:
        return null;
    }
  };

  const isProcessing = createPaymentMutation.isPending || (transactionId && paymentStatus?.payment?.status === "pending");

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            {isProcessing ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : paymentStatus?.payment?.status === "completed" ? (
              <CheckCircle className="h-5 w-5 text-success" />
            ) : null}
            <span>
              {isProcessing 
                ? "Đang xử lý thanh toán..." 
                : paymentStatus?.payment?.status === "completed"
                ? "Thanh toán thành công!"
                : "Xác nhận thanh toán"
              }
            </span>
          </DialogTitle>
          <DialogDescription>
            {isProcessing 
              ? "Vui lòng đợi trong khi hệ thống xử lý thanh toán của bạn." 
              : paymentStatus?.payment?.status === "completed"
              ? "Giao dịch đã được hoàn tất thành công."
              : "Xác nhận thông tin và phương thức thanh toán hóa đơn."
            }
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {renderPaymentMethodContent()}

          <div className="flex space-x-4">
            <Button
              variant="outline"
              onClick={handleClose}
              className="flex-1"
              disabled={isProcessing}
            >
              {isProcessing ? "Đóng" : "Hủy"}
            </Button>
            {!transactionId && (
              <Button
                onClick={handleConfirmPayment}
                className="flex-1"
                disabled={createPaymentMutation.isPending}
              >
                {createPaymentMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Đang xử lý...
                  </>
                ) : (
                  "Xác nhận"
                )}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
