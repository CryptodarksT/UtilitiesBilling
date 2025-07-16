import { Wallet, Phone, Mail, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-muted/50 border-t border-border theme-transition">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Wallet className="h-6 w-6 text-primary" />
              <span className="text-lg font-semibold text-foreground">Payoo</span>
            </div>
            <p className="text-muted-foreground text-sm">
              Nền tảng thanh toán hóa đơn hàng đầu Việt Nam
            </p>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-foreground">Dịch vụ</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="#" className="hover:text-primary theme-transition-fast">
                  Thanh toán điện
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary theme-transition-fast">
                  Thanh toán nước
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary theme-transition-fast">
                  Thanh toán internet
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary theme-transition-fast">
                  Thanh toán truyền hình
                </a>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-foreground">Hỗ trợ</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="#" className="hover:text-primary theme-transition-fast">
                  Hướng dẫn
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary theme-transition-fast">
                  Câu hỏi thường gặp
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary theme-transition-fast">
                  Liên hệ
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary theme-transition-fast">
                  Báo cáo lỗi
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-foreground">Liên hệ</h4>
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-primary" />
                <span>1900 5454 78</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-primary" />
                <span>support@payoo.vn</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-primary" />
                <span>TP. Hồ Chí Minh</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-border text-center text-sm text-muted-foreground theme-transition">
          <p>&copy; 2024 Payoo. Tất cả quyền được bảo lưu.</p>
        </div>
      </div>
    </footer>
  );
}
