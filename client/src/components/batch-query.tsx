import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Trash2, Search, Download, Upload, FileText, CheckCircle, XCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useMutation } from "@tanstack/react-query";
import type { BatchQuery } from "@shared/schema";

interface QueryItem {
  id: string;
  type: "customer_id" | "bill_number";
  value: string;
  billType?: string;
  provider?: string;
}

interface BatchResult {
  success: boolean;
  data?: any;
  error?: string;
  query: QueryItem;
}

export default function BatchQuery() {
  const [queries, setQueries] = useState<QueryItem[]>([]);
  const [bulkInput, setBulkInput] = useState("");
  const [results, setResults] = useState<BatchResult[]>([]);
  const { toast } = useToast();

  const batchMutation = useMutation({
    mutationFn: async (data: BatchQuery) => {
      const response = await apiRequest("POST", "/api/bills/batch", data);
      return response;
    },
    onSuccess: (data) => {
      setResults(data.results || []);
      toast({
        title: "Truy vấn thành công",
        description: `Đã xử lý ${data.total || 0} truy vấn. Thành công: ${data.success || 0}, Thất bại: ${data.failed || 0}`,
      });
    },
    onError: (error) => {
      toast({
        title: "Lỗi truy vấn",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const addQuery = () => {
    const newQuery: QueryItem = {
      id: Date.now().toString(),
      type: "customer_id",
      value: "",
      billType: "electricity",
      provider: "EVN"
    };
    setQueries([...queries, newQuery]);
  };

  const removeQuery = (id: string) => {
    setQueries(queries.filter(q => q.id !== id));
  };

  const updateQuery = (id: string, updates: Partial<QueryItem>) => {
    setQueries(queries.map(q => 
      q.id === id ? { ...q, ...updates } : q
    ));
  };

  const processBulkInput = () => {
    const lines = bulkInput.trim().split('\n').filter(line => line.trim());
    const newQueries: QueryItem[] = [];
    
    lines.forEach((line, index) => {
      const parts = line.split(',').map(p => p.trim());
      if (parts.length >= 2) {
        const [type, value, billType, provider] = parts;
        if ((type === 'customer_id' || type === 'bill_number') && value) {
          newQueries.push({
            id: `bulk_${Date.now()}_${index}`,
            type: type as "customer_id" | "bill_number",
            value,
            billType: billType || "electricity",
            provider: provider || "EVN"
          });
        }
      }
    });
    
    setQueries([...queries, ...newQueries]);
    setBulkInput("");
    toast({
      title: "Nhập hàng loạt",
      description: `Đã thêm ${newQueries.length} truy vấn`,
    });
  };

  const handleSubmit = () => {
    if (queries.length === 0) {
      toast({
        title: "Lỗi",
        description: "Vui lòng thêm ít nhất một truy vấn",
        variant: "destructive",
      });
      return;
    }

    const validQueries = queries.filter(q => q.value.trim());
    if (validQueries.length === 0) {
      toast({
        title: "Lỗi",
        description: "Vui lòng nhập giá trị tìm kiếm",
        variant: "destructive",
      });
      return;
    }

    batchMutation.mutate({
      queries: validQueries.map(q => ({
        type: q.type,
        value: q.value,
        billType: q.billType,
        provider: q.provider
      }))
    });
  };

  const exportResults = () => {
    if (results.length === 0) return;
    
    const csvData = results.map(result => ({
      'Loại truy vấn': result.query.type,
      'Giá trị': result.query.value,
      'Loại hóa đơn': result.query.billType || '',
      'Nhà cung cấp': result.query.provider || '',
      'Kết quả': result.success ? 'Thành công' : 'Thất bại',
      'Lỗi': result.error || '',
      'Tên khách hàng': result.data?.customerName || '',
      'Địa chỉ': result.data?.customerAddress || '',
      'Số tiền': result.data?.amount || ''
    }));
    
    if (csvData.length === 0) return;
    
    const csvContent = [
      Object.keys(csvData[0]).join(','),
      ...csvData.map(row => Object.values(row).join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `batch_query_results_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Truy vấn hàng loạt
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="manual">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="manual">Nhập thủ công</TabsTrigger>
              <TabsTrigger value="bulk">Nhập hàng loạt</TabsTrigger>
            </TabsList>
            
            <TabsContent value="manual" className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Danh sách truy vấn</h3>
                <Button onClick={addQuery} size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Thêm truy vấn
                </Button>
              </div>
              
              <div className="space-y-3">
                {queries.map((query) => (
                  <Card key={query.id} className="p-4">
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-3 items-end">
                      <div>
                        <Label>Loại truy vấn</Label>
                        <Select 
                          value={query.type} 
                          onValueChange={(value) => updateQuery(query.id, { type: value as any })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="customer_id">Mã khách hàng</SelectItem>
                            <SelectItem value="bill_number">Số hóa đơn</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <Label>Giá trị tìm kiếm</Label>
                        <Input
                          placeholder={query.type === 'customer_id' ? 'Mã khách hàng' : 'Số hóa đơn'}
                          value={query.value}
                          onChange={(e) => updateQuery(query.id, { value: e.target.value })}
                        />
                      </div>
                      
                      {query.type === 'customer_id' && (
                        <>
                          <div>
                            <Label>Loại hóa đơn</Label>
                            <Select 
                              value={query.billType} 
                              onValueChange={(value) => updateQuery(query.id, { billType: value })}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="electricity">Điện</SelectItem>
                                <SelectItem value="water">Nước</SelectItem>
                                <SelectItem value="internet">Internet</SelectItem>
                                <SelectItem value="tv">Truyền hình</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div>
                            <Label>Nhà cung cấp</Label>
                            <Select 
                              value={query.provider} 
                              onValueChange={(value) => updateQuery(query.id, { provider: value })}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="EVN">EVN</SelectItem>
                                <SelectItem value="PC_HCMC">PC TP.HCM</SelectItem>
                                <SelectItem value="SAWACO">SAWACO</SelectItem>
                                <SelectItem value="FPT">FPT</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </>
                      )}
                      
                      <div>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => removeQuery(query.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="bulk" className="space-y-4">
              <div>
                <Label>Nhập hàng loạt (CSV format)</Label>
                <p className="text-sm text-gray-600 mb-2">
                  Định dạng: loại_truy_vấn,giá_trị,loại_hóa_đơn,nhà_cung_cấp (mỗi dòng một truy vấn)
                </p>
                <Textarea
                  placeholder="customer_id,KH123456,electricity,EVN
bill_number,PD29007350490
customer_id,KH789012,water,SAWACO"
                  value={bulkInput}
                  onChange={(e) => setBulkInput(e.target.value)}
                  rows={6}
                />
              </div>
              <Button onClick={processBulkInput} disabled={!bulkInput.trim()}>
                <Upload className="h-4 w-4 mr-2" />
                Xử lý dữ liệu
              </Button>
            </TabsContent>
          </Tabs>
          
          <div className="flex justify-between items-center mt-6">
            <div className="flex items-center gap-2">
              <Badge variant="secondary">
                {queries.length} truy vấn
              </Badge>
              {results.length > 0 && (
                <Badge variant="outline">
                  {results.filter(r => r.success).length} thành công
                </Badge>
              )}
            </div>
            <div className="flex gap-2">
              <Button 
                onClick={handleSubmit} 
                disabled={queries.length === 0 || batchMutation.isPending}
              >
                <Search className="h-4 w-4 mr-2" />
                {batchMutation.isPending ? "Đang xử lý..." : "Thực hiện truy vấn"}
              </Button>
              {results.length > 0 && (
                <Button variant="outline" onClick={exportResults}>
                  <Download className="h-4 w-4 mr-2" />
                  Xuất kết quả
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      {results.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Kết quả truy vấn</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead>Loại</TableHead>
                  <TableHead>Giá trị</TableHead>
                  <TableHead>Khách hàng</TableHead>
                  <TableHead>Địa chỉ</TableHead>
                  <TableHead>Số tiền</TableHead>
                  <TableHead>Lỗi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {results.map((result, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      {result.success ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : (
                        <XCircle className="h-4 w-4 text-red-500" />
                      )}
                    </TableCell>
                    <TableCell>{result.query.type}</TableCell>
                    <TableCell>{result.query.value}</TableCell>
                    <TableCell>{result.data?.customerName || '-'}</TableCell>
                    <TableCell>{result.data?.customerAddress || '-'}</TableCell>
                    <TableCell>
                      {result.data?.amount ? 
                        new Intl.NumberFormat('vi-VN', {
                          style: 'currency',
                          currency: 'VND'
                        }).format(result.data.amount) : '-'
                      }
                    </TableCell>
                    <TableCell className="text-red-600 text-sm">
                      {result.error || '-'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}