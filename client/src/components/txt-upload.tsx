import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Upload, Download, FileText, CheckCircle, XCircle, Loader2 } from "lucide-react";

interface UploadResult {
  processed: number;
  errors: string[];
  message: string;
}

export default function TxtUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState<UploadResult | null>(null);
  const { toast } = useToast();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      // Validate file type
      const allowedTypes = ['text/plain'];
      if (!allowedTypes.includes(selectedFile.type) && !selectedFile.name.endsWith('.txt')) {
        toast({
          title: "Lỗi định dạng file",
          description: "Chỉ hỗ trợ file text (.txt)",
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
      
      const response = await fetch('/api/txt/upload', {
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
      const response = await fetch('/api/txt/template');
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'template.txt';
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

  return (
    <div className="space-y-6">
      {/* Template Download */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            File mẫu
          </CardTitle>
          <CardDescription>
            Tải xuống file mẫu để chuẩn bị dữ liệu hóa đơn
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            variant="outline"
            onClick={handleDownloadTemplate}
            className="w-full"
          >
            <Download className="mr-2 h-4 w-4" />
            Tải file mẫu TXT
          </Button>
        </CardContent>
      </Card>

      {/* File Upload */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Upload File TXT
          </CardTitle>
          <CardDescription>
            Chọn file TXT chứa dữ liệu hóa đơn để import vào hệ thống
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <Input
              type="file"
              accept=".txt"
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
              File đã chọn: {file.name} ({(file.size / 1024).toFixed(2)} KB)
            </div>
          )}
        </CardContent>
      </Card>

      {/* Upload Result */}
      {result && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {result.errors.length === 0 ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : (
                <XCircle className="h-5 w-5 text-red-500" />
              )}
              Kết quả xử lý
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {result.processed}
                </div>
                <div className="text-sm text-muted-foreground">
                  Hóa đơn đã xử lý
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">
                  {result.errors.length}
                </div>
                <div className="text-sm text-muted-foreground">
                  Lỗi
                </div>
              </div>
            </div>
            
            {result.errors.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-semibold">Chi tiết lỗi:</h4>
                <div className="max-h-40 overflow-y-auto space-y-1">
                  {result.errors.map((error, index) => (
                    <div key={index} className="text-sm text-red-600 p-2 bg-red-50 rounded">
                      {error}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}