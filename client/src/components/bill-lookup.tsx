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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { billLookupSchema, billNumberLookupSchema, type BillLookup, type BillNumberLookup } from "@shared/schema";
import { Loader2, Search, Receipt } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface BillLookupProps {
  onBillFound: (data: any) => void;
}

export default function BillLookup({ onBillFound }: BillLookupProps) {
  const [isSearching, setIsSearching] = useState(false);
  const { toast } = useToast();

  // Form for customer ID lookup
  const form = useForm<BillLookup>({
    resolver: zodResolver(billLookupSchema),
    defaultValues: {
      billType: "",
      provider: "",
      customerId: "",
    },
  });

  // Form for bill number lookup
  const billNumberForm = useForm<BillNumberLookup>({
    resolver: zodResolver(billNumberLookupSchema),
    defaultValues: {
      billNumber: "",
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

  const onBillNumberSubmit = async (data: BillNumberLookup) => {
    setIsSearching(true);
    try {
      const response = await apiRequest("POST", "/api/bills/lookup-by-number", data);
      const result = await response.json();
      
      onBillFound(result);
      toast({
        title: "Thành công",
        description: "Tìm thấy hóa đơn từ BIDV thành công",
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
        <Tabs defaultValue="customer" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="customer" className="flex items-center gap-2">
              <Search className="h-4 w-4" />
              Tra cứu bằng mã khách hàng
            </TabsTrigger>
            <TabsTrigger value="billnumber" className="flex items-center gap-2">
              <Receipt className="h-4 w-4" />
              Tra cứu bằng số hóa đơn
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="customer" className="mt-6">
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
                            <SelectItem value="phonecard">Thẻ cào điện thoại</SelectItem>
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
                            placeholder="Nhập mã khách hàng (VD: EVN001234)"
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
          </TabsContent>

          <TabsContent value="billnumber" className="mt-6">
            <Form {...billNumberForm}>
              <form onSubmit={billNumberForm.handleSubmit(onBillNumberSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 gap-6">
                  {/* Bill Number */}
                  <FormField
                    control={billNumberForm.control}
                    name="billNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Số hóa đơn</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Nhập số hóa đơn (VD: PD29007350490)"
                            {...field}
                            className="text-center font-mono text-lg"
                          />
                        </FormControl>
                        <FormMessage />
                        <div className="text-sm text-gray-500 mt-2">
                          <p className="font-medium">Định dạng số hóa đơn:</p>
                          <p>• Điện: PD + 11 số (VD: PD29007350490)</p>
                          <p>• Nước: WB + 11 số (VD: WB29007350498)</p>
                          <p>• Internet: IT + 11 số (VD: IT29007350911)</p>
                          <p>• Truyền hình: TV + 11 số</p>
                        </div>
                      </FormItem>
                    )}
                  />

                  {/* Search Button */}
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isSearching}
                  >
                    {isSearching ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Đang tra cứu từ BIDV...
                      </>
                    ) : (
                      <>
                        <Receipt className="mr-2 h-4 w-4" />
                        Tra cứu từ BIDV
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
