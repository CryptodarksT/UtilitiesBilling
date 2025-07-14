import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { QrCode, Building2, Smartphone } from "lucide-react";
import { cn } from "@/lib/utils";

interface PaymentMethodsProps {
  onMethodSelect: (method: string) => void;
  selectedMethod: string | null;
  disabled?: boolean;
}

export default function PaymentMethods({ 
  onMethodSelect, 
  selectedMethod, 
  disabled = false 
}: PaymentMethodsProps) {
  const paymentMethods = [
    {
      id: "momo",
      name: "Ví MoMo",
      icon: Smartphone,
      description: "Thanh toán nhanh với ví MoMo",
    },
    {
      id: "visa",
      name: "Thẻ tín dụng Visa",
      icon: QrCode,
      description: "Thanh toán bằng thẻ Visa qua MoMo",
    },
    {
      id: "bank",
      name: "Chuyển khoản",
      icon: Building2,
      description: "Thanh toán qua ngân hàng",
    },
  ];

  return (
    <Card className="card-shadow">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-900">
          Phương thức thanh toán
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {paymentMethods.map((method) => {
            const IconComponent = method.icon;
            const isSelected = selectedMethod === method.id;
            
            return (
              <Button
                key={method.id}
                variant="outline"
                className={cn(
                  "h-auto p-4 flex flex-col items-center space-y-2 transition-all duration-200 hover-scale",
                  isSelected && "border-primary bg-primary/5 text-primary",
                  disabled && "opacity-50 cursor-not-allowed"
                )}
                onClick={() => !disabled && onMethodSelect(method.id)}
                disabled={disabled}
              >
                <IconComponent className="h-8 w-8" />
                <div className="text-center">
                  <div className="font-medium">{method.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {method.description}
                  </div>
                </div>
              </Button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
