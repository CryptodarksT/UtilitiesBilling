import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { 
  HelpCircle, 
  BookOpen, 
  Phone, 
  Mail, 
  MessageCircle, 
  Download,
  FileText,
  Video,
  Users,
  Shield,
  CreditCard,
  Building,
  Zap,
  ExternalLink,
  Clock,
  CheckCircle
} from "lucide-react";

export default function Support() {
  const [activeTab, setActiveTab] = useState("getting-started");

  const gettingStartedSteps = [
    {
      title: "Đăng ký tài khoản doanh nghiệp",
      description: "Tạo tài khoản cho các nhà cung cấp thanh toán",
      icon: <Users className="h-5 w-5" />,
      status: "required"
    },
    {
      title: "Cấu hình API credentials",
      description: "Nhập thông tin API từ các nhà cung cấp",
      icon: <Shield className="h-5 w-5" />,
      status: "required"
    },
    {
      title: "Kiểm tra kết nối",
      description: "Test API và xác nhận hoạt động",
      icon: <CheckCircle className="h-5 w-5" />,
      status: "recommended"
    },
    {
      title: "Triển khai production",
      description: "Chuyển từ sandbox sang môi trường thật",
      icon: <ExternalLink className="h-5 w-5" />,
      status: "optional"
    }
  ];

  const apiGuides = [
    {
      provider: "MoMo Business",
      icon: <CreditCard className="h-6 w-6" />,
      description: "Hướng dẫn tích hợp MoMo Business API",
      steps: [
        "Đăng ký tài khoản doanh nghiệp tại https://business.momo.vn",
        "Hoàn thiện thủ tục xác thực doanh nghiệp",
        "Lấy Partner Code và Access Key từ dashboard",
        "Cấu hình webhook URL để nhận thông báo thanh toán",
        "Test API ở môi trường sandbox trước khi go-live"
      ],
      docs: "https://developers.momo.vn/v3/",
      support: "https://business.momo.vn/support"
    },
    {
      provider: "BIDV API",
      icon: <Building className="h-6 w-6" />,
      description: "Hướng dẫn tích hợp BIDV Open Banking API",
      steps: [
        "Đăng ký tài khoản developer tại https://openapi.bidv.com.vn",
        "Nộp hồ sơ xác thực doanh nghiệp",
        "Lấy API Key và API Secret",
        "Cấu hình certificate cho HTTPS",
        "Test API tra cứu hóa đơn"
      ],
      docs: "https://openapi.bidv.com.vn/docs",
      support: "https://openapi.bidv.com.vn/support"
    },
    {
      provider: "ZaloPay Business",
      icon: <Zap className="h-6 w-6" />,
      description: "Hướng dẫn tích hợp ZaloPay for Business",
      steps: [
        "Đăng ký tài khoản merchant tại https://merchant.zalopay.vn",
        "Xác thực thông tin doanh nghiệp",
        "Lấy App ID, Key 1, Key 2 từ dashboard",
        "Cấu hình callback URL",
        "Test payment flow với ZaloPay sandbox"
      ],
      docs: "https://developers.zalopay.vn/",
      support: "https://merchant.zalopay.vn/support"
    },
    {
      provider: "Visa Direct",
      icon: <Shield className="h-6 w-6" />,
      description: "Hướng dẫn tích hợp Visa Direct API",
      steps: [
        "Đăng ký tài khoản developer tại https://developer.visa.com",
        "Tạo ứng dụng và chọn Visa Direct API",
        "Tải certificate và private key",
        "Cấu hình mutual TLS authentication",
        "Test API với sandbox environment"
      ],
      docs: "https://developer.visa.com/capabilities/visa_direct",
      support: "https://developer.visa.com/support"
    }
  ];

  const faqItems = [
    {
      question: "Tại sao tôi không thể kết nối với API?",
      answer: "Kiểm tra lại API credentials, đảm bảo đã nhập đúng API Key và Secret. Cũng kiểm tra network connectivity và firewall settings.",
      category: "technical"
    },
    {
      question: "Làm sao để chuyển từ sandbox sang production?",
      answer: "Cần xác thực doanh nghiệp hoàn tất, cập nhật API endpoint từ sandbox sang production URL, và cấu hình lại webhook URLs.",
      category: "deployment"
    },
    {
      question: "Phí giao dịch được tính như thế nào?",
      answer: "Phí giao dịch phụ thuộc vào từng nhà cung cấp. MoMo: 1.5-2%, BIDV: 0.5-1%, ZaloPay: 1.8-2.2%, Visa: 2.5-3%.",
      category: "billing"
    },
    {
      question: "Có giới hạn số lượng giao dịch không?",
      answer: "Tài khoản sandbox có giới hạn 100 giao dịch/ngày. Tài khoản production không giới hạn nhưng có rate limiting theo từng API.",
      category: "limits"
    },
    {
      question: "Làm sao để xử lý lỗi thanh toán?",
      answer: "Hệ thống tự động retry 3 lần. Nếu vẫn lỗi, kiểm tra error code và message để xử lý accordingly.",
      category: "technical"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-6xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Trung tâm hỗ trợ Payoo
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Hướng dẫn và hỗ trợ cho hệ thống thanh toán hóa đơn
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="getting-started">Bắt đầu</TabsTrigger>
            <TabsTrigger value="api-guides">API Guides</TabsTrigger>
            <TabsTrigger value="faq">FAQ</TabsTrigger>
            <TabsTrigger value="downloads">Tải xuống</TabsTrigger>
            <TabsTrigger value="contact">Liên hệ</TabsTrigger>
          </TabsList>

          <TabsContent value="getting-started" className="mt-6">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5" />
                    Hướng dẫn bắt đầu
                  </CardTitle>
                  <CardDescription>
                    Các bước cơ bản để thiết lập hệ thống thanh toán
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {gettingStartedSteps.map((step, index) => (
                      <div key={index} className="flex items-start gap-4 p-4 rounded-lg border bg-white dark:bg-gray-800">
                        <div className="flex-shrink-0 w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                          {step.icon}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-medium text-gray-900 dark:text-white">
                              {step.title}
                            </h3>
                            <Badge variant={step.status === 'required' ? 'destructive' : step.status === 'recommended' ? 'default' : 'secondary'}>
                              {step.status === 'required' ? 'Bắt buộc' : step.status === 'recommended' ? 'Khuyến nghị' : 'Tùy chọn'}
                            </Badge>
                          </div>
                          <p className="text-gray-600 dark:text-gray-400">
                            {step.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Alert>
                <HelpCircle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Lưu ý:</strong> Trước khi triển khai production, hãy đảm bảo đã test đầy đủ các chức năng ở môi trường sandbox.
                </AlertDescription>
              </Alert>
            </div>
          </TabsContent>

          <TabsContent value="api-guides" className="mt-6">
            <div className="grid gap-6">
              {apiGuides.map((guide, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      {guide.icon}
                      {guide.provider}
                    </CardTitle>
                    <CardDescription>{guide.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium mb-2">Các bước thực hiện:</h4>
                        <ol className="space-y-2">
                          {guide.steps.map((step, stepIndex) => (
                            <li key={stepIndex} className="flex items-start gap-2">
                              <span className="flex-shrink-0 w-6 h-6 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center text-sm font-medium">
                                {stepIndex + 1}
                              </span>
                              <span className="text-sm text-gray-600 dark:text-gray-400">{step}</span>
                            </li>
                          ))}
                        </ol>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" asChild>
                          <a href={guide.docs} target="_blank" rel="noopener noreferrer">
                            <FileText className="h-4 w-4 mr-1" />
                            Tài liệu API
                          </a>
                        </Button>
                        <Button variant="outline" size="sm" asChild>
                          <a href={guide.support} target="_blank" rel="noopener noreferrer">
                            <MessageCircle className="h-4 w-4 mr-1" />
                            Hỗ trợ
                          </a>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="faq" className="mt-6">
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Câu hỏi thường gặp</CardTitle>
                  <CardDescription>Giải đáp các thắc mắc phổ biến</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {faqItems.map((item, index) => (
                      <div key={index} className="border-b pb-4 last:border-b-0">
                        <h3 className="font-medium text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                          <HelpCircle className="h-4 w-4" />
                          {item.question}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 ml-6">
                          {item.answer}
                        </p>
                        <Badge variant="outline" className="mt-2 ml-6">
                          {item.category}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="downloads" className="mt-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Download className="h-5 w-5" />
                    Tài liệu và mẫu
                  </CardTitle>
                  <CardDescription>Tải xuống các tài liệu cần thiết</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Button variant="outline" className="w-full justify-start">
                      <FileText className="h-4 w-4 mr-2" />
                      Hướng dẫn tích hợp API (PDF)
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <FileText className="h-4 w-4 mr-2" />
                      Mẫu Excel upload hóa đơn
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <FileText className="h-4 w-4 mr-2" />
                      Postman Collection
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Shield className="h-4 w-4 mr-2" />
                      SSL Certificate templates
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Video className="h-5 w-5" />
                    Video hướng dẫn
                  </CardTitle>
                  <CardDescription>Xem video hướng dẫn chi tiết</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Button variant="outline" className="w-full justify-start">
                      <Video className="h-4 w-4 mr-2" />
                      Cài đặt và cấu hình hệ thống
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Video className="h-4 w-4 mr-2" />
                      Tích hợp API thanh toán
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Video className="h-4 w-4 mr-2" />
                      Xử lý lỗi và troubleshooting
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Video className="h-4 w-4 mr-2" />
                      Chuyển từ sandbox sang production
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="contact" className="mt-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageCircle className="h-5 w-5" />
                    Liên hệ hỗ trợ
                  </CardTitle>
                  <CardDescription>Các kênh hỗ trợ khách hàng</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
                      <Phone className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="font-medium">Hotline 24/7</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">1900 1234</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
                      <Mail className="h-5 w-5 text-green-600" />
                      <div>
                        <p className="font-medium">Email hỗ trợ</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">support@payoo.vn</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
                      <MessageCircle className="h-5 w-5 text-purple-600" />
                      <div>
                        <p className="font-medium">Live Chat</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Trực tuyến 8:00-22:00</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Thời gian hỗ trợ
                  </CardTitle>
                  <CardDescription>Lịch làm việc của team hỗ trợ</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Hỗ trợ kỹ thuật</span>
                      <span className="text-sm text-gray-600 dark:text-gray-400">24/7</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Hỗ trợ tích hợp API</span>
                      <span className="text-sm text-gray-600 dark:text-gray-400">8:00-18:00</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Hỗ trợ doanh nghiệp</span>
                      <span className="text-sm text-gray-600 dark:text-gray-400">9:00-17:00</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Email response</span>
                      <span className="text-sm text-gray-600 dark:text-gray-400">≤ 2 giờ</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}