import { useEffect, useState } from "react";
import { useLocation, useRoute } from "wouter";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";

export default function PaymentSuccess() {
  const [location] = useLocation();
  const [paymentStatus, setPaymentStatus] = useState<"loading" | "success" | "failed">("loading");
  const [paymentInfo, setPaymentInfo] = useState<any>(null);

  useEffect(() => {
    // Get URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const resultCode = urlParams.get('resultCode');
    const orderId = urlParams.get('orderId');
    const amount = urlParams.get('amount');
    const orderInfo = urlParams.get('orderInfo');
    const transId = urlParams.get('transId');

    if (resultCode === '0') {
      setPaymentStatus("success");
      setPaymentInfo({
        orderId,
        amount: amount ? parseInt(amount) : 0,
        orderInfo,
        transId
      });
    } else {
      setPaymentStatus("failed");
      setPaymentInfo({
        orderId,
        amount: amount ? parseInt(amount) : 0,
        orderInfo,
        transId
      });
    }
  }, []);

  const handleReturnHome = () => {
    window.location.href = '/';
  };

  const handleViewHistory = () => {
    window.location.href = '/payment-history';
  };

  if (paymentStatus === "loading") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <Loader2 className="h-16 w-16 mx-auto text-blue-600 animate-spin" />
              <h2 className="text-xl font-semibold text-gray-900">
                Đang xử lý kết quả thanh toán...
              </h2>
              <p className="text-gray-600">
                Vui lòng đợi trong giây lát
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="text-center space-y-4">
            {paymentStatus === "success" ? (
              <>
                <CheckCircle className="h-16 w-16 mx-auto text-green-600" />
                <CardTitle className="text-2xl font-bold text-green-700">
                  Thanh toán thành công!
                </CardTitle>
              </>
            ) : (
              <>
                <XCircle className="h-16 w-16 mx-auto text-red-600" />
                <CardTitle className="text-2xl font-bold text-red-700">
                  Thanh toán thất bại!
                </CardTitle>
              </>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {paymentInfo && (
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-gray-600">Mã đơn hàng:</span>
                <span className="font-semibold">{paymentInfo.orderId}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-gray-600">Số tiền:</span>
                <span className="font-semibold text-lg">
                  {formatCurrency(paymentInfo.amount)}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-gray-600">Nội dung:</span>
                <span className="font-semibold text-right">
                  {paymentInfo.orderInfo}
                </span>
              </div>
              {paymentInfo.transId && (
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-gray-600">Mã giao dịch:</span>
                  <span className="font-semibold">{paymentInfo.transId}</span>
                </div>
              )}
            </div>
          )}
          
          <div className="flex flex-col space-y-3">
            <Button onClick={handleReturnHome} className="w-full">
              Quay về trang chủ
            </Button>
            <Button 
              onClick={handleViewHistory} 
              variant="outline" 
              className="w-full"
            >
              Xem lịch sử thanh toán
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}