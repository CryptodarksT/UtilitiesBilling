import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Search, Download, History } from "lucide-react";
import { formatCurrency, formatDate, getBillTypeDisplay, getStatusDisplay, getPaymentMethodDisplay } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

export default function PaymentHistory() {
  const [searchCustomerId, setSearchCustomerId] = useState("");
  const [currentCustomerId, setCurrentCustomerId] = useState("");
  const { toast } = useToast();

  const { data: historyData, isLoading, error } = useQuery({
    queryKey: ["/api/payments/history", currentCustomerId],
    enabled: !!currentCustomerId,
  });

  const handleSearch = () => {
    if (!searchCustomerId.trim()) {
      toast({
        title: "Lỗi",
        description: "Vui lòng nhập mã khách hàng",
        variant: "destructive",
      });
      return;
    }
    setCurrentCustomerId(searchCustomerId.trim());
  };

  const handleDownloadReceipt = (paymentId: number) => {
    // Simulate receipt download
    toast({
      title: "Đang tải hóa đơn",
      description: "Hóa đơn sẽ được tải xuống trong giây lát...",
    });
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <History className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              Lịch sử thanh toán
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Theo dõi và quản lý lịch sử thanh toán hóa đơn của bạn
          </p>
        </div>

        {/* Search Section */}
        <Card className="card-shadow mb-8">
          <CardHeader>
            <CardTitle>Tìm kiếm lịch sử thanh toán</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex space-x-4">
              <div className="flex-1">
                <Input
                  placeholder="Nhập mã khách hàng..."
                  value={searchCustomerId}
                  onChange={(e) => setSearchCustomerId(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                />
              </div>
              <Button onClick={handleSearch} disabled={isLoading}>
                <Search className="h-4 w-4 mr-2" />
                Tìm kiếm
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Payment History Table */}
        {currentCustomerId && (
          <Card className="card-shadow">
            <CardHeader>
              <CardTitle>
                Lịch sử thanh toán - Mã KH: {currentCustomerId}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                  <p className="mt-2 text-gray-600 dark:text-gray-400">
                    Đang tải dữ liệu...
                  </p>
                </div>
              ) : error ? (
                <div className="text-center py-8">
                  <p className="text-red-500">
                    Không tìm thấy dữ liệu cho mã khách hàng này
                  </p>
                </div>
              ) : !historyData?.history?.length ? (
                <div className="text-center py-8">
                  <p className="text-gray-600 dark:text-gray-400">
                    Chưa có lịch sử thanh toán
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Ngày thanh toán</TableHead>
                        <TableHead>Loại hóa đơn</TableHead>
                        <TableHead>Nhà cung cấp</TableHead>
                        <TableHead>Kỳ thanh toán</TableHead>
                        <TableHead>Phương thức</TableHead>
                        <TableHead>Số tiền</TableHead>
                        <TableHead>Trạng thái</TableHead>
                        <TableHead>Thao tác</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {historyData.history.map((payment: any) => {
                        const statusDisplay = getStatusDisplay(payment.status);
                        
                        return (
                          <TableRow key={payment.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                            <TableCell>
                              {payment.paidAt ? formatDate(payment.paidAt) : formatDate(payment.createdAt)}
                            </TableCell>
                            <TableCell>
                              {payment.bill ? getBillTypeDisplay(payment.bill.billType) : "-"}
                            </TableCell>
                            <TableCell>
                              {payment.bill?.provider || "-"}
                            </TableCell>
                            <TableCell>
                              {payment.bill?.period || "-"}
                            </TableCell>
                            <TableCell>
                              {getPaymentMethodDisplay(payment.paymentMethod)}
                            </TableCell>
                            <TableCell className="font-semibold">
                              {formatCurrency(payment.amount)}
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant={payment.status === "completed" ? "default" : "secondary"}
                                className={statusDisplay.className}
                              >
                                {statusDisplay.text}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDownloadReceipt(payment.id)}
                                className="text-primary hover:text-primary/80"
                              >
                                <Download className="h-4 w-4 mr-1" />
                                Tải hóa đơn
                              </Button>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
