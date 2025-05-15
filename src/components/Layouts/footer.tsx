import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Youtube, Mail, Phone, MapPin, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function Footer() {
  // Get current year for copyright
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-white border-t mt-10">
      {/* Newsletter Section */}
      <div className="bg-blue-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-center md:text-left">
              <h3 className="text-xl font-bold text-blue-700 mb-2">Đăng ký nhận tin</h3>
              <p className="text-gray-600">Nhận thông tin khuyến mãi và chăm sóc thú cưng mới nhất</p>
            </div>
            <div className="w-full md:w-auto">
              <form className="flex gap-2 max-w-md mx-auto md:mx-0">
                <Input 
                  type="email" 
                  placeholder="Địa chỉ email của bạn" 
                  className="flex-grow"
                  required
                />
                <Button type="submit">
                  Đăng ký
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About Us Section */}
          <div>
            <h3 className="font-bold text-lg mb-4">Về PetPlatform</h3>
            <div className="mb-4">
              <img src="/logo.png" alt="PetPlatform Logo" className="h-10 mb-3" />
              <p className="text-gray-600 text-sm">
                PetPlatform là nền tảng thương mại điện tử hàng đầu về thú cưng tại Việt Nam, 
                cung cấp đầy đủ sản phẩm và dịch vụ chất lượng cao.
              </p>
            </div>
            
            {/* Social Media Links */}
            <div className="flex space-x-3 mt-4">
              <a 
                href="https://facebook.com/petplatform" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-blue-600 hover:text-white transition-colors"
              >
                <Facebook size={16} />
              </a>
              <a 
                href="https://instagram.com/petplatform" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-pink-600 hover:text-white transition-colors"
              >
                <Instagram size={16} />
              </a>
              <a 
                href="https://youtube.com/petplatform" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-red-600 hover:text-white transition-colors"
              >
                <Youtube size={16} />
              </a>
              <a 
                href="https://twitter.com/petplatform" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-blue-400 hover:text-white transition-colors"
              >
                <Twitter size={16} />
              </a>
            </div>
          </div>

          {/* Customer Service Section */}
          <div>
            <h3 className="font-bold text-lg mb-4">Hỗ Trợ Khách Hàng</h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/help-center" className="text-gray-600 hover:text-blue-600 transition-colors">Trung tâm trợ giúp</Link>
              </li>
              <li>
                <Link to="/purchase-guide" className="text-gray-600 hover:text-blue-600 transition-colors">Hướng dẫn mua hàng</Link>
              </li>
              <li>
                <Link to="/shipping-info" className="text-gray-600 hover:text-blue-600 transition-colors">Thông tin vận chuyển</Link>
              </li>
              <li>
                <Link to="/return-policy" className="text-gray-600 hover:text-blue-600 transition-colors">Chính sách đổi trả</Link>
              </li>
              <li>
                <Link to="/payment-guide" className="text-gray-600 hover:text-blue-600 transition-colors">Hướng dẫn thanh toán</Link>
              </li>
              <li>
                <Link to="/warranty-policy" className="text-gray-600 hover:text-blue-600 transition-colors">Chính sách bảo hành</Link>
              </li>
            </ul>
          </div>

          {/* About PetPlatform Section */}
          <div>
            <h3 className="font-bold text-lg mb-4">PetPlatform</h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/about-us" className="text-gray-600 hover:text-blue-600 transition-colors">Về chúng tôi</Link>
              </li>
              <li>
                <Link to="/blog" className="text-gray-600 hover:text-blue-600 transition-colors">Blog thú cưng</Link>
              </li>
              <li>
                <Link to="/career" className="text-gray-600 hover:text-blue-600 transition-colors">Tuyển dụng</Link>
              </li>
              <li>
                <Link to="/terms" className="text-gray-600 hover:text-blue-600 transition-colors">Điều khoản sử dụng</Link>
              </li>
              <li>
                <Link to="/privacy-policy" className="text-gray-600 hover:text-blue-600 transition-colors">Chính sách bảo mật</Link>
              </li>
              <li>
                <Link to="/seller-center" className="text-gray-600 hover:text-blue-600 transition-colors">Kênh người bán</Link>
              </li>
            </ul>
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="font-bold text-lg mb-4">Liên Hệ</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start">
                <MapPin className="mr-2 h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <span className="text-gray-600">
                  123 Nguyễn Văn Linh, Quận 7, TP. Hồ Chí Minh
                </span>
              </li>
              <li className="flex items-center">
                <Phone className="mr-2 h-5 w-5 text-blue-600 flex-shrink-0" />
                <a href="tel:1900123456" className="text-gray-600 hover:text-blue-600 transition-colors">
                  1900 123 456
                </a>
              </li>
              <li className="flex items-center">
                <Mail className="mr-2 h-5 w-5 text-blue-600 flex-shrink-0" />
                <a href="mailto:support@petplatform.vn" className="text-gray-600 hover:text-blue-600 transition-colors">
                  support@petplatform.vn
                </a>
              </li>
            </ul>

            {/* Payment Methods */}
            <div className="mt-6">
              <h4 className="font-medium text-sm mb-3">Phương thức thanh toán</h4>
              <div className="flex flex-wrap gap-2">
                {["visa", "mastercard", "jcb", "cash", "momo", "zalopay"].map((method) => (
                  <div key={method} className="w-10 h-6 bg-gray-100 rounded border flex items-center justify-center">
                    <img 
                      src={`/payment/${method}.png`} 
                      alt={`${method} payment`} 
                      className="max-h-4 max-w-8" 
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="bg-gray-50 py-4 text-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-center md:text-left">
              © {currentYear} PetPlatform. Tất cả quyền được bảo lưu.
            </p>
            <div className="flex items-center gap-4">
              <img src="/certificates/dmca.png" alt="DMCA Protected" className="h-6" />
              <img src="/certificates/boCongThuong.png" alt="Bộ Công Thương" className="h-8" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}