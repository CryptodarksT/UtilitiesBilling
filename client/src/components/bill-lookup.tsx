import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { billLookupSchema, type BillLookup } from "@shared/schema";
import { Loader2, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface BillLookupProps {
  onBillFound: (data: any) => void;
}

export default function BillLookup({ onBillFound }: BillLookupProps) {
  const [isSearching, setIsSearching] = useState(false);
  const { toast } = useToast();

  const form = useForm<BillLookup>({
    resolver: zodResolver(billLookupSchema),
    defaultValues: {
      billType: "",
      provider: "",
      customerId: "",
    },
  });

  const billType = form.watch("billType");

  // Fetch providers based on bill type
  const { data: providersData } = useQuery({
    queryKey: ["/api/providers", billType],
    enabled: !!billType,
  });

  const onSubmit = async (data: BillLookup) => {
    setIsSearching(true);
    try {
      const response = await apiRequest("POST", "/api/bills/lookup", data);
      const result = await response.json();
      
      onBillFound(result);
      toast({
        title: "Thành công",
        description: "Tìm thấy hóa đơn thành công",
      });
    } catch (error) {
      toast({
        title: "Lỗi",
        description: error instanceof Error ? error.message : "Không tìm thấy hóa đơn",
        variant: "destructive",
      });
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <Card className="card-shadow">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-gray-900">
          Tra cứu hóa đơn
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Bill Type */}
              <FormField
                control={form.control}
                name="billType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Loại hóa đơn</FormLabel>
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value);
                        form.setValue("provider", "");
                      }}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn loại hóa đơn" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="electricity">Điện (EVN)</SelectItem>
                        <SelectItem value="water">Nước (SAWACO)</SelectItem>
                        <SelectItem value="internet">Internet (FPT, Viettel)</SelectItem>
                        <SelectItem value="tv">Truyền hình (VTVcab)</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Provider */}
              <FormField
                control={form.control}
                name="provider"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nhà cung cấp</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled={!billType}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn nhà cung cấp" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {providersData?.providers?.map((provider: string) => (
                          <SelectItem key={provider} value={provider}>
                            {provider}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Customer ID */}
              <FormField
                control={form.control}
                name="customerId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mã khách hàng</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Nhập mã khách hàng"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Search Button */}
              <div className="flex items-end">
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isSearching}
                >
                  {isSearching ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Đang tìm kiếm...
                    </>
                  ) : (
                    <>
                      <Search className="mr-2 h-4 w-4" />
                      Tra cứu
                    </>
                  )}
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
