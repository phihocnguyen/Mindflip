'use client';

export default function TestimonialsSection() {
  const testimonials = [
    {
      name: "Minh Anh",
      role: "Sinh viên đại học",
      avatar: "MA",
      content: "Mindflip đã giúp tôi tăng vốn từ vựng tiếng Anh từ 2000 lên 5000 từ chỉ trong 3 tháng. Hệ thống SRS thực sự hiệu quả!",
      rating: 5,
      gradient: "from-blue-500 to-indigo-600"
    },
    {
      name: "Hoàng Việt",
      role: "Lập trình viên",
      avatar: "HV", 
      content: "Tính năng tra từ tức thì rất tiện lợi khi đọc tài liệu kỹ thuật. Không cần mở tab mới hay app khác, học từ mới ngay trong quá trình đọc.",
      rating: 5,
      gradient: "from-green-500 to-emerald-600"
    },
    {
      name: "Thu Hà",
      role: "Marketing Manager",
      avatar: "TH",
      content: "Interface đẹp, dễ sử dụng và blog có nhiều bài viết hay về phương pháp học. Đã recommend cho cả team của mình rồi!",
      rating: 5,
      gradient: "from-purple-500 to-pink-600"
    },
    {
      name: "Đức Minh", 
      role: "Học sinh THPT",
      avatar: "DM",
      content: "Chuẩn bị thi IELTS với Mindflip rất hiệu quả. Flashcard có hình ảnh và ví dụ cụ thể giúp nhớ từ lâu hơn nhiều so với học thuộc lòng.",
      rating: 5,
      gradient: "from-orange-500 to-red-600"
    },
    {
      name: "Lan Phương",
      role: "Giảng viên",
      avatar: "LP",
      content: "Tôi dùng Mindflip để dạy từ vựng cho học sinh. Các em rất thích tính năng gamification và thống kê tiến độ rõ ràng.",
      rating: 5,
      gradient: "from-teal-500 to-cyan-600"
    },
    {
      name: "Quang Huy",
      role: "Doanh nhân",
      avatar: "QH",
      content: "Bận công việc nhưng vẫn có thể học từ vựng hiệu quả nhờ hệ thống nhắc nhở thông minh. 15 phút mỗi ngày mà tiến bộ rõ rệt.",
      rating: 5,
      gradient: "from-indigo-500 to-purple-600"
    }
  ];

  return (
    <section className="py-24 bg-white dark:bg-gray-900 transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-20">
          <h2 className="text-4xl sm:text-5xl font-bold mb-6 text-gray-900 dark:text-white">
            Người dùng{' '}
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              nói gì
            </span>
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-indigo-600 to-purple-600 mx-auto mb-6 rounded-full"></div>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Hàng nghìn người đã cải thiện vốn từ vựng và đạt được mục tiêu học tập với Mindflip
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index}
              className="group bg-gray-50 dark:bg-gray-800 p-8 rounded-2xl border border-gray-200 dark:border-gray-700 hover:border-transparent hover:shadow-2xl hover:-translate-y-1 transition-all duration-500"
            >
              {/* Quote icon */}
              <div className="mb-6">
                <svg className="w-10 h-10 text-indigo-200 dark:text-indigo-800" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/>
                </svg>
              </div>

              {/* Content */}
              <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed italic">
                "{testimonial.content}"
              </p>

              {/* Rating */}
              <div className="flex mb-6">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                ))}
              </div>

              {/* Author info */}
              <div className="flex items-center">
                <div className={`w-12 h-12 bg-gradient-to-r ${testimonial.gradient} rounded-full flex items-center justify-center text-white font-bold mr-4 group-hover:scale-110 transition-transform duration-300`}>
                  {testimonial.avatar}
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-300">
                    {testimonial.name}
                  </h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {testimonial.role}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
          <div className="text-center">
            <div className="text-4xl sm:text-5xl font-bold text-indigo-600 dark:text-indigo-400 mb-2">
              10K+
            </div>
            <div className="text-gray-600 dark:text-gray-300 font-medium">Người dùng hoạt động</div>
          </div>
          <div className="text-center">
            <div className="text-4xl sm:text-5xl font-bold text-green-600 dark:text-green-400 mb-2">
              50K+
            </div>
            <div className="text-gray-600 dark:text-gray-300 font-medium">Từ vựng đã học</div>
          </div>
          <div className="text-center">
            <div className="text-4xl sm:text-5xl font-bold text-purple-600 dark:text-purple-400 mb-2">
              95%
            </div>
            <div className="text-gray-600 dark:text-gray-300 font-medium">Tỷ lệ hài lòng</div>
          </div>
          <div className="text-center">
            <div className="text-4xl sm:text-5xl font-bold text-orange-600 dark:text-orange-400 mb-2">
              4.9
            </div>
            <div className="text-gray-600 dark:text-gray-300 font-medium">Đánh giá trung bình</div>
          </div>
        </div>

        {/* Social Proof */}
        <div className="text-center">
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
            Được tin dùng bởi sinh viên, chuyên gia và giảng viên tại:
          </p>
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
            <div className="px-6 py-3 bg-gray-100 dark:bg-gray-800 rounded-lg font-semibold text-gray-700 dark:text-gray-300">
              Đại học Bách Khoa
            </div>
            <div className="px-6 py-3 bg-gray-100 dark:bg-gray-800 rounded-lg font-semibold text-gray-700 dark:text-gray-300">
              FPT University
            </div>
            <div className="px-6 py-3 bg-gray-100 dark:bg-gray-800 rounded-lg font-semibold text-gray-700 dark:text-gray-300">
              VinGroup
            </div>
            <div className="px-6 py-3 bg-gray-100 dark:bg-gray-800 rounded-lg font-semibold text-gray-700 dark:text-gray-300">
              Tiki
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}