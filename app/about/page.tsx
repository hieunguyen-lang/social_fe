import React from 'react';
import { 
  FiTarget, 
  FiCpu, 
  FiBarChart2, 
  FiFolder, 
  FiSettings, 
  FiPhone, 
  FiMail, 
  FiGlobe,
  FiUsers,
  FiTrendingUp,
  FiShield,
  FiZap,
  FiAward,
  FiHeart,
  FiCheckCircle,
  FiArrowRight,
  FiMapPin,
  FiClock,
  FiStar,
  FiPlay
} from 'react-icons/fi';
import Navbar from '../components/Navbar';

export default function About() {
  const features = [
    {
      title: 'Quản lý khách hàng thông minh',
      description: 'Hệ thống CRM hiện đại giúp theo dõi, phân tích và quản lý mối quan hệ khách hàng một cách hiệu quả.',
      icon: <FiUsers className="h-8 w-8 text-blue-600" />,
      color: 'bg-blue-50'
    },
    {
      title: 'Analytics & Báo cáo nâng cao',
      description: 'Dashboard trực quan với các báo cáo chi tiết, biểu đồ phân tích và insights để ra quyết định chính xác.',
      icon: <FiBarChart2 className="h-8 w-8 text-green-600" />,
      color: 'bg-green-50'
    },
    {
      title: 'Tự động hóa quy trình',
      description: 'Tự động hóa các tác vụ lặp đi lặp lại, tăng hiệu suất làm việc và giảm thiểu sai sót.',
      icon: <FiZap className="h-8 w-8 text-yellow-600" />,
      color: 'bg-yellow-50'
    },
    {
      title: 'Bảo mật dữ liệu cao cấp',
      description: 'Hệ thống bảo mật đa lớp, mã hóa dữ liệu và tuân thủ các tiêu chuẩn bảo mật quốc tế.',
      icon: <FiShield className="h-8 w-8 text-purple-600" />,
      color: 'bg-purple-50'
    },
    {
      title: 'Tích hợp đa nền tảng',
      description: 'Kết nối với các hệ thống bên ngoài, API linh hoạt và đồng bộ dữ liệu real-time.',
      icon: <FiSettings className="h-8 w-8 text-orange-600" />,
      color: 'bg-orange-50'
    },
    {
      title: 'Mobile-first Design',
      description: 'Giao diện responsive, tối ưu cho mọi thiết bị, trải nghiệm người dùng mượt mà.',
      icon: <FiCpu className="h-8 w-8 text-indigo-600" />,
      color: 'bg-indigo-50'
    }
  ];

  const values = [
    {
      title: 'Sáng tạo',
      description: 'Luôn tìm kiếm giải pháp mới và cải tiến liên tục',
      icon: <FiZap className="h-6 w-6" />
    },
    {
      title: 'Chất lượng',
      description: 'Cam kết cung cấp sản phẩm và dịch vụ chất lượng cao nhất',
      icon: <FiAward className="h-6 w-6" />
    },
    {
      title: 'Khách hàng',
      description: 'Đặt trải nghiệm khách hàng lên hàng đầu',
      icon: <FiHeart className="h-6 w-6" />
    },
    {
      title: 'Minh bạch',
      description: 'Hoạt động minh bạch, rõ ràng và đáng tin cậy',
      icon: <FiShield className="h-6 w-6" />
    }
  ];

  const team = [
    {
      name: 'Nguyễn Văn A',
      position: 'CEO & Founder',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      description: '10+ năm kinh nghiệm trong lĩnh vực công nghệ và quản lý doanh nghiệp'
    },
    {
      name: 'Trần Thị B',
      position: 'CTO',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
      description: 'Chuyên gia về kiến trúc hệ thống và phát triển phần mềm'
    },
    {
      name: 'Lê Văn C',
      position: 'Head of Product',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      description: 'Chuyên gia về UX/UI và phát triển sản phẩm'
    }
  ];

  const stats = [
    { number: '500+', label: 'Khách hàng tin tưởng' },
    { number: '50K+', label: 'Giao dịch xử lý' },
    { number: '99.9%', label: 'Uptime hệ thống' },
    { number: '24/7', label: 'Hỗ trợ khách hàng' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white py-20">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Về chúng tôi
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-4xl mx-auto">
              Chúng tôi là đội ngũ chuyên gia công nghệ với sứ mệnh xây dựng hệ thống CRM hiện đại, 
              giúp doanh nghiệp tối ưu hóa quy trình quản lý khách hàng và tăng trưởng bền vững.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-blue-600 font-semibold px-8 py-4 rounded-lg hover:bg-gray-100 inline-flex items-center text-lg shadow-lg transition-all">
                Liên hệ ngay <FiArrowRight className="ml-2 w-5 h-5" />
              </button>
              <button className="bg-transparent border-2 border-white text-white font-semibold px-8 py-4 rounded-lg hover:bg-white hover:text-blue-600 inline-flex items-center text-lg transition-all">
                Xem demo <FiPlay className="ml-2 w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">{stat.number}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="bg-white rounded-xl p-8 shadow-sm">
              <div className="flex items-center mb-6">
                <FiTarget className="w-8 h-8 text-blue-600 mr-3" />
                <h2 className="text-2xl font-bold text-gray-900">Sứ mệnh</h2>
              </div>
              <p className="text-gray-600 text-lg leading-relaxed">
                Chúng tôi cam kết cung cấp giải pháp CRM hiện đại, giúp doanh nghiệp xây dựng mối quan hệ 
                khách hàng bền vững, tăng hiệu quả kinh doanh và phát triển bền vững trong thời đại số.
              </p>
            </div>
            <div className="bg-white rounded-xl p-8 shadow-sm">
              <div className="flex items-center mb-6">
                <FiTrendingUp className="w-8 h-8 text-green-600 mr-3" />
                <h2 className="text-2xl font-bold text-gray-900">Tầm nhìn</h2>
              </div>
              <p className="text-gray-600 text-lg leading-relaxed">
                Trở thành đối tác tin cậy hàng đầu trong lĩnh vực CRM, mang lại giá trị thực sự cho 
                khách hàng và góp phần thúc đẩy sự phát triển của cộng đồng doanh nghiệp Việt Nam.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Tính năng nổi bật
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Hệ thống CRM của chúng tôi được thiết kế với những tính năng hiện đại nhất, 
              giúp doanh nghiệp quản lý khách hàng hiệu quả và tăng trưởng bền vững.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className={`${feature.color} rounded-xl p-6 hover:shadow-lg transition-all duration-300`}>
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Giá trị cốt lõi
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Những giá trị định hướng mọi hoạt động và quyết định của chúng tôi
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="text-center">
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <div className="text-blue-600">{value.icon}</div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Đội ngũ chuyên gia
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Những con người tài năng và tâm huyết đằng sau sự thành công của hệ thống CRM
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <div key={index} className="text-center">
                <div className="mb-6">
                  <img 
                    src={member.avatar} 
                    alt={member.name}
                    className="w-32 h-32 rounded-full mx-auto object-cover shadow-lg"
                  />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-1">{member.name}</h3>
                <p className="text-blue-600 font-medium mb-3">{member.position}</p>
                <p className="text-gray-600">{member.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Liên hệ với chúng tôi
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Sẵn sàng hỗ trợ và tư vấn cho doanh nghiệp của bạn
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiPhone className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Điện thoại</h3>
              <p className="text-gray-600">0909 123 456</p>
              <p className="text-gray-600">Hỗ trợ 24/7</p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiMail className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Email</h3>
              <p className="text-gray-600">contact@crm.com</p>
              <p className="text-gray-600">Phản hồi nhanh</p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiMapPin className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Địa chỉ</h3>
              <p className="text-gray-600">TP.HCM, Việt Nam</p>
              <p className="text-gray-600">Văn phòng chính</p>
            </div>
            <div className="text-center">
              <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiClock className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Giờ làm việc</h3>
              <p className="text-gray-600">Thứ 2 - Thứ 6</p>
              <p className="text-gray-600">8:00 - 18:00</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Sẵn sàng bắt đầu?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Hãy để chúng tôi giúp doanh nghiệp của bạn tối ưu hóa quy trình quản lý khách hàng
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-blue-600 font-semibold px-8 py-4 rounded-lg hover:bg-gray-100 inline-flex items-center text-lg shadow-lg transition-all">
              Dùng thử miễn phí <FiArrowRight className="ml-2 w-5 h-5" />
            </button>
            <button className="bg-transparent border-2 border-white text-white font-semibold px-8 py-4 rounded-lg hover:bg-white hover:text-blue-600 inline-flex items-center text-lg transition-all">
              Tư vấn miễn phí <FiPhone className="ml-2 w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-bold mb-4">CRM Dashboard</h3>
              <p className="text-gray-400">
                Hệ thống quản lý khách hàng hiện đại, giúp doanh nghiệp tối ưu hóa quy trình và tăng hiệu quả kinh doanh.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Sản phẩm</h4>
              <ul className="space-y-2 text-gray-400">
                <li>CRM Core</li>
                <li>Analytics</li>
                <li>Automation</li>
                <li>Mobile App</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Hỗ trợ</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Hướng dẫn sử dụng</li>
                <li>FAQ</li>
                <li>Liên hệ hỗ trợ</li>
                <li>Chính sách bảo mật</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Công ty</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Về chúng tôi</li>
                <li>Đội ngũ</li>
                <li>Tin tức</li>
                <li>Tuyển dụng</li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} CRM Dashboard. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
} 