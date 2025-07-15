import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Download, Upload, CreditCard, CheckCircle, XCircle, AlertCircle, FileSpreadsheet } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { formatCurrency } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface AutoPaymentResult {
  billNumber: string;
  status: 'success' | 'failed' | 'skipped';
  message: string;
  amount?: string;
  transactionId?: string;
  timestamp: string;
}

interface AutoPaymentSummary {
  total: number;
  success: number;
  failed: number;
  skipped: number;
  totalAmount: number;
}

interface VisaCard {
  id: string;
  cardNumber: string;
  expiryMonth: string;
  expiryYear: string;
  cvv: string;
  holderName: string;
  nickname: string;
  isDefault: boolean;
}

export default function AutoPayment() {
  const [file, setFile] = useState<File | null>(null);
  const [selectedCard, setSelectedCard] = useState<string>("");
  const [visaCards, setVisaCards] = useState<VisaCard[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [results, setResults] = useState<AutoPaymentResult[]>([]);
  const [summary, setSummary] = useState<AutoPaymentSummary | null>(null);
  const { toast } = useToast();

  // Load visa cards from localStorage
  useEffect(() => {
    const storedCards = localStorage.getItem('visaCards');
    if (storedCards) {
      const cards = JSON.parse(storedCards);
      setVisaCards(cards);
      // Auto-select default card if available
      const defaultCard = cards.find((card: VisaCard) => card.isDefault);
      if (defaultCard) {
        setSelectedCard(defaultCard.id);
      }
    }
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      const allowedTypes = [
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-excel'
      ];
      
      if (!allowedTypes.includes(selectedFile.type)) {
        toast({
          title: "Lỗi",
          description: "Chỉ hỗ trợ file Excel (.xlsx, .xls)",
          variant: "destructive",
        });
        return;
      }
      
      setFile(selectedFile);
    }
  };

  const handleDownloadTemplate = async () => {
    try {
      const response = await fetch("/api/payments/auto/template");
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'auto-payment-template.xlsx';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast({
        title: "Thành công",
        description: "Đã tải xuống file mẫu",
      });
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể tải file mẫu",
        variant: "destructive",
      });
    }
  };

  const handleProcessPayment = async () => {
    if (!file) {
      toast({
        title: "Lỗi",
        description: "Vui lòng chọn file Excel",
        variant: "destructive",
      });
      return;
    }

    if (!selectedCard) {
      toast({
        title: "Lỗi",
        description: "Vui lòng chọn thẻ Visa để thanh toán",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    const formData = new FormData();
    formData.append('file', file);
    
    // Find selected card and generate token
    const card = visaCards.find(c => c.id === selectedCard);
    if (card) {
      const cardToken = `${card.cardNumber.slice(-4)}_${card.expiryMonth}${card.expiryYear}_${Date.now()}`;
      formData.append('visaCardToken', cardToken);
    }

    try {
      const response = await fetch("/api/payments/auto", {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Lỗi xử lý thanh toán');
      }

      const data = await response.json();
      setResults(data.results);
      setSummary(data.summary);
      
      toast({
        title: "Hoàn thành",
        description: data.message,
      });
    } catch (error: any) {
      toast({
        title: "Lỗi",
        description: error.message || "Lỗi xử lý thanh toán tự động",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownloadReport = async () => {
    if (!results || results.length === 0) {
      return;
    }

    try {
      const response = await apiRequest('POST', '/api/payments/auto/report', { results });
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `payment-report-${new Date().toISOString().slice(0, 10)}.xlsx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast({
        title: "Thành công",
        description: "Đã tải xuống báo cáo",
      });
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể tải báo cáo",
        variant: "destructive",
      });
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'skipped':
        return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'success':
        return <Badge className="bg-green-500">Thành công</Badge>;
      case 'failed':
        return <Badge variant="destructive">Thất bại</Badge>;
      case 'skipped':
        return <Badge className="bg-yellow-500">Bỏ qua</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Thanh toán tự động từ Excel</CardTitle>
          <CardDescription>
            Upload file Excel chứa danh sách hóa đơn để thanh toán tự động bằng thẻ Visa
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="file">File Excel</Label>
              <Input
                id="file"
                type="file"
                accept=".xlsx,.xls"
                onChange={handleFileChange}
                disabled={isProcessing}
              />
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownloadTemplate}
                className="w-full"
              >
                <Download className="w-4 h-4 mr-2" />
                Tải file mẫu
              </Button>
            </div>

            <div className="space-y-2">
              <Label htmlFor="visa">Thẻ Visa để thanh toán</Label>
              <Select value={selectedCard} onValueChange={setSelectedCard} disabled={isProcessing}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn thẻ Visa" />
                </SelectTrigger>
                <SelectContent>
                  {visaCards.map((card) => (
                    <SelectItem key={card.id} value={card.id}>
                      <div className="flex items-center gap-2">
                        <CreditCard className="w-4 h-4" />
                        <span>{card.nickname}</span>
                        <span className="text-muted-foreground text-xs">
                          ****{card.cardNumber.slice(-4)}
                        </span>
                        {card.isDefault && (
                          <Badge variant="secondary" className="text-xs">Mặc định</Badge>
                        )}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {visaCards.length === 0 && (
                <p className="text-xs text-muted-foreground">
                  Chưa có thẻ Visa nào. Vui lòng thêm thẻ trong tab "Quản lý thẻ Visa"
                </p>
              )}
            </div>
          </div>

          <Button
            onClick={handleProcessPayment}
            disabled={!file || isProcessing || !selectedCard}
            className="w-full"
          >
            {isProcessing ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Đang xử lý...
              </>
            ) : (
              <>
                <CreditCard className="w-4 h-4 mr-2" />
                Thanh toán tự động
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {summary && (
        <Card>
          <CardHeader>
            <CardTitle>Tổng kết thanh toán</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold">{summary.total}</p>
                <p className="text-sm text-muted-foreground">Tổng số</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-500">{summary.success}</p>
                <p className="text-sm text-muted-foreground">Thành công</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-red-500">{summary.failed}</p>
                <p className="text-sm text-muted-foreground">Thất bại</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-yellow-500">{summary.skipped}</p>
                <p className="text-sm text-muted-foreground">Bỏ qua</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold">{formatCurrency(summary.totalAmount)}</p>
                <p className="text-sm text-muted-foreground">Tổng tiền</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {results.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Chi tiết giao dịch</CardTitle>
            <div className="flex justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownloadReport}
              >
                <FileSpreadsheet className="w-4 h-4 mr-2" />
                Tải báo cáo
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Số hóa đơn</TableHead>
                    <TableHead>Trạng thái</TableHead>
                    <TableHead>Thông báo</TableHead>
                    <TableHead>Số tiền</TableHead>
                    <TableHead>Mã giao dịch</TableHead>
                    <TableHead>Thời gian</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {results.map((result, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{result.billNumber}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(result.status)}
                          {getStatusBadge(result.status)}
                        </div>
                      </TableCell>
                      <TableCell className="max-w-[200px] truncate">
                        {result.message}
                      </TableCell>
                      <TableCell>
                        {result.amount ? formatCurrency(result.amount) : '-'}
                      </TableCell>
                      <TableCell className="font-mono text-xs">
                        {result.transactionId || '-'}
                      </TableCell>
                      <TableCell>
                        {new Date(result.timestamp).toLocaleString('vi-VN')}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}