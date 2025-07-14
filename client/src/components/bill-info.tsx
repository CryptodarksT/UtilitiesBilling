import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatDate, getStatusDisplay } from "@/lib/utils";
import type { Bill, Customer } from "@shared/schema";

interface BillInfoProps {
  bill: Bill;
  customer: Customer;
}

export default function BillInfo({ bill, customer }: BillInfoProps) {
  const statusDisplay = getStatusDisplay(bill.status);

  return (
    <Card className="card-shadow fade-in">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-900">
          Thông tin hóa đơn
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-4">
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
                <span className="font-medium">{bill.oldIndex}</span>
              </div>
            )}
            {bill.newIndex && (
              <div className="flex justify-between py-2 border-b border-gray-200">
                <span className="text-gray-600">Chỉ số mới:</span>
                <span className="font-medium">{bill.newIndex}</span>
              </div>
            )}
            {bill.consumption && (
              <div className="flex justify-between py-2 border-b border-gray-200">
                <span className="text-gray-600">Tiêu thụ:</span>
                <span className="font-medium">{bill.consumption}</span>
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
