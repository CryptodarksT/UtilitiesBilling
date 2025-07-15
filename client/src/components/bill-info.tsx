import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatDate, getStatusDisplay } from "@/lib/utils";
import type { Bill, Customer } from "@shared/schema";

interface BillInfoProps {
  bill: Bill & {
    billNumber?: string;
    description?: string;
    unit?: string;
    unitPrice?: string;
    taxes?: string;
    fees?: string;
  };
  customer: Customer;
  source?: string;
}

export default function BillInfo({ bill, customer, source }: BillInfoProps) {
  const statusDisplay = getStatusDisplay(bill.status);

  return (
    <Card className="card-shadow fade-in">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          Thông tin hóa đơn
          {source === 'bidv' && (
            <Badge variant="outline" className="text-green-600 border-green-600">
              BIDV API
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-4">
            {bill.billNumber && (
              <div className="flex justify-between py-2 border-b border-gray-200">
                <span className="text-gray-600">Số hóa đơn:</span>
                <span className="font-medium font-mono text-primary">{bill.billNumber}</span>
              </div>
            )}
            <div className="flex justify-between py-2 border-b border-gray-200">
              <span className="text-gray-600">Mã khách hàng:</span>
              <span className="font-medium font-mono">{bill.customerId}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-200">
              <span className="text-gray-600">Tên khách hàng:</span>
              <span className="font-medium">{customer.name}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-200">
              <span className="text-gray-600">Địa chỉ:</span>
              <span className="font-medium text-right">{customer.address}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-200">
              <span className="text-gray-600">Kỳ thanh toán:</span>
              <span className="font-medium">{bill.period}</span>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            <div className="flex justify-between py-2 border-b border-gray-200">
              <span className="text-gray-600">Nhà cung cấp:</span>
              <span className="font-medium">{bill.provider}</span>
            </div>
            {bill.oldIndex && (
              <div className="flex justify-between py-2 border-b border-gray-200">
                <span className="text-gray-600">Chỉ số cũ:</span>
                <span className="font-medium">{bill.oldIndex} {bill.unit}</span>
              </div>
            )}
            {bill.newIndex && (
              <div className="flex justify-between py-2 border-b border-gray-200">
                <span className="text-gray-600">Chỉ số mới:</span>
                <span className="font-medium">{bill.newIndex} {bill.unit}</span>
              </div>
            )}
            {bill.consumption && (
              <div className="flex justify-between py-2 border-b border-gray-200">
                <span className="text-gray-600">Tiêu thụ:</span>
                <span className="font-medium">{bill.consumption} {bill.unit}</span>
              </div>
            )}
            {bill.unitPrice && (
              <div className="flex justify-between py-2 border-b border-gray-200">
                <span className="text-gray-600">Đơn giá:</span>
                <span className="font-medium">{formatCurrency(bill.unitPrice)}</span>
              </div>
            )}
            <div className="flex justify-between py-2 border-b border-gray-200">
              <span className="text-gray-600">Trạng thái:</span>
              <Badge
                variant={bill.status === "paid" ? "default" : "secondary"}
                className={statusDisplay.className}
              >
                {statusDisplay.text}
              </Badge>
            </div>
          </div>
        </div>

        {/* BIDV specific information */}
        {source === 'bidv' && (
          <div className="mt-6 bg-green-50 dark:bg-green-950/20 rounded-lg p-4">
            <h4 className="font-semibold text-green-800 dark:text-green-200 mb-2">
              Thông tin chi tiết từ BIDV
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {bill.description && (
                <div className="flex justify-between py-1">
                  <span className="text-green-700 dark:text-green-300 text-sm">Mô tả:</span>
                  <span className="text-green-800 dark:text-green-200 text-sm font-medium">
                    {bill.description}
                  </span>
                </div>
              )}
              {bill.taxes && (
                <div className="flex justify-between py-1">
                  <span className="text-green-700 dark:text-green-300 text-sm">Thuế:</span>
                  <span className="text-green-800 dark:text-green-200 text-sm font-medium">
                    {formatCurrency(bill.taxes)}
                  </span>
                </div>
              )}
              {bill.fees && (
                <div className="flex justify-between py-1">
                  <span className="text-green-700 dark:text-green-300 text-sm">Phí:</span>
                  <span className="text-green-800 dark:text-green-200 text-sm font-medium">
                    {formatCurrency(bill.fees)}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Bill Amount */}
        <div className="mt-6 bg-blue-50 dark:bg-blue-950/20 rounded-lg p-4">
          <div className="flex justify-between items-center">
            <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Số tiền cần thanh toán:
            </span>
            <span className="text-2xl font-bold text-primary">
              {formatCurrency(bill.amount)}
            </span>
          </div>
          <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            <span>Hạn thanh toán: </span>
            <span className="font-medium">{formatDate(bill.dueDate)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
