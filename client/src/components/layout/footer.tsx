import { Wallet, Phone, Mail, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Wallet className="h-6 w-6" />
              <span className="text-lg font-semibold">Payoo</span>
            </div>
            <p className="text-gray-400 text-sm">
              Nền tảng thanh toán hóa đơn hàng đầu Việt Nam
            </p>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Dịch vụ</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Thanh toán điện
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Thanh toán nước
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Thanh toán internet
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Thanh toán truyền hình
                </a>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Hỗ trợ</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Hướng dẫn
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Câu hỏi thường gặp
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Liên hệ
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Báo cáo lỗi
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Liên hệ</h4>
            <div className="space-y-2 text-sm text-gray-400">
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4" />
                <span>1900 5454 78</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4" />
                <span>support@payoo.vn</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4" />
                <span>TP. Hồ Chí Minh</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-700 text-center text-sm text-gray-400">
          <p>&copy; 2024 Payoo. Tất cả quyền được bảo lưu.</p>
        </div>
      </div>
    </footer>
  );
}
