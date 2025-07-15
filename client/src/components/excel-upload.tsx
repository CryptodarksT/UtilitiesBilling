import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { Upload, FileSpreadsheet, Download, CheckCircle, XCircle, Loader2 } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

interface UploadResult {
  processed: number;
  errors: string[];
  message: string;
}

export default function ExcelUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState<UploadResult | null>(null);
  const { toast } = useToast();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      // Validate file type
      const allowedTypes = ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel'];
      if (!allowedTypes.includes(selectedFile.type) && !selectedFile.name.endsWith('.xlsx') && !selectedFile.name.endsWith('.xls')) {
        toast({
          title: "Lỗi định dạng file",
          description: "Chỉ hỗ trợ file Excel (.xlsx, .xls)",
          variant: "destructive",
        });
        return;
      }
      
      // Validate file size (10MB)
      if (selectedFile.size > 10 * 1024 * 1024) {
        toast({
          title: "File quá lớn",
          description: "Kích thước file không được vượt quá 10MB",
          variant: "destructive",
        });
        return;
      }
      
      setFile(selectedFile);
      setResult(null);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    
    setUploading(true);
    setResult(null);
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await fetch('/api/excel/upload', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Lỗi khi upload file');
      }
      
      const data = await response.json();
      setResult(data);
      
      if (data.errors.length === 0) {
        toast({
          title: "Upload thành công",
          description: data.message,
        });
      } else {
        toast({
          title: "Upload hoàn thành với một số lỗi",
          description: `${data.message}. ${data.errors.length} lỗi cần xem lại.`,
          variant: "destructive",
        });
      }
    } catch (error: any) {
      toast({
        title: "Lỗi upload",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleDownloadTemplate = async () => {
    try {
      const response = await fetch('/api/excel/template');
      
      if (!response.ok) {
        throw new Error('Không thể tải template');
      }
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'template-hoa-don.xlsx';
      a.click();
      window.URL.revokeObjectURL(url);
      
      toast({
        title: "Tải template thành công",
        description: "File template đã được tải về",
      });
    } catch (error: any) {
      toast({
        title: "Lỗi tải template",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Template Download */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileSpreadsheet className="h-5 w-5" />
            Template Excel
          </CardTitle>
          <CardDescription>
            Tải về template để chuẩn bị dữ liệu hóa đơn theo đúng định dạng
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button 
            onClick={handleDownloadTemplate}
            variant="outline"
            className="w-full"
          >
            <Download className="mr-2 h-4 w-4" />
            Tải template Excel
          </Button>
        </CardContent>
      </Card>

      {/* File Upload */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Upload File Excel
          </CardTitle>
          <CardDescription>
            Chọn file Excel chứa dữ liệu hóa đơn để import vào hệ thống
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <Input
              type="file"
              accept=".xlsx,.xls"
              onChange={handleFileSelect}
              className="flex-1"
            />
            <Button
              onClick={handleUpload}
              disabled={!file || uploading}
              className="min-w-[120px]"
            >
              {uploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Đang xử lý...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Upload
                </>
              )}
            </Button>
          </div>
          
          {file && (
            <div className="text-sm text-muted-foreground">
              File đã chọn: {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
            </div>
          )}
        </CardContent>
      </Card>

      {/* Upload Results */}
      {result && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {result.errors.length === 0 ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : (
                <XCircle className="h-5 w-5 text-yellow-500" />
              )}
              Kết quả xử lý
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-green-50 dark:bg-green-950/20 rounded-lg">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {result.processed}
                </div>
                <div className="text-sm text-green-600 dark:text-green-400">
                  Hóa đơn đã xử lý
                </div>
              </div>
              <div className="text-center p-4 bg-red-50 dark:bg-red-950/20 rounded-lg">
                <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                  {result.errors.length}
                </div>
                <div className="text-sm text-red-600 dark:text-red-400">
                  Lỗi
                </div>
              </div>
            </div>
            
            {result.errors.length > 0 && (
              <Alert variant="destructive">
                <XCircle className="h-4 w-4" />
                <AlertDescription>
                  <div className="font-semibold mb-2">Các lỗi cần xử lý:</div>
                  <ul className="list-disc list-inside space-y-1">
                    {result.errors.map((error, index) => (
                      <li key={index} className="text-sm">{error}</li>
                    ))}
                  </ul>
                </AlertDescription>
              </Alert>
            )}
            
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>{result.message}</AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      )}
    </div>
  );
}