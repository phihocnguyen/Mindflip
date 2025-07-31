'use client';

export default function HowItWorksSection() {
  const steps = [
    {
      step: "01",
      title: "Tạo tài khoản",
      description: "Đăng ký miễn phí và thiết lập mục tiêu học tập của bạn",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
        </svg>
      ),
      color: "from-blue-500 to-indigo-600"
    },
    {
      step: "02", 
      title: "Chọn từ vựng",
      description: "Thêm từ mới hoặc chọn từ bộ sưu tập có sẵn theo chủ đề",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
      color: "from-green-500 to-emerald-600"
    },
    {
      step: "03",
      title: "Học với flashcard",
      description: "Sử dụng flashcard thông minh với hệ thống SRS để ghi nhớ hiệu quả",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      ),
      color: "from-purple-500 to-pink-600"
    },
    {
      step: "04",
      title: "Ôn tập thông minh", 
      description: "Hệ thống tự động nhắc nhở ôn tập đúng thời điểm để ghi nhớ lâu dài",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: "from-orange-500 to-red-600"
    }
  ];

  return (
    <section className="py-24 bg-gray-50 dark:bg-gray-800 transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-20">
          <h2 className="text-4xl sm:text-5xl font-bold mb-6 text-gray-900 dark:text-white">
            Cách thức{' '}
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              hoạt động
            </span>
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-indigo-600 to-purple-600 mx-auto mb-6 rounded-full"></div>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Quy trình học tập đơn giản và hiệu quả, được thiết kế dựa trên khoa học nhận thức
          </p>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Connection line */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-indigo-200 via-purple-200 to-pink-200 dark:from-indigo-800 dark:via-purple-800 dark:to-pink-800 transform -translate-y-1/2 z-0"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
            {steps.map((step, index) => (
              <div key={index} className="text-center group">
                {/* Step number */}
                <div className="relative mb-8">
                  <div className={`w-20 h-20 mx-auto bg-gradient-to-r ${step.color} rounded-full flex items-center justify-center text-white font-bold text-2xl shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    {step.step}
                  </div>
                  {/* Connector dot for larger screens */}
                  {index < steps.length - 1 && (
                    <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-8 bg-white dark:bg-gray-800 rounded-full border-4 border-gray-200 dark:border-gray-600 transform -translate-y-1/2 shadow-lg"></div>
                  )}
                </div>

                {/* Icon */}
                <div className={`w-16 h-16 mx-auto mb-6 bg-gradient-to-r ${step.color} rounded-2xl flex items-center justify-center text-white shadow-lg group-hover:scale-105 transition-transform duration-300`}>
                  {step.icon}
                </div>

                {/* Content */}
                <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-indigo-600 group-hover:to-purple-600 group-hover:bg-clip-text transition-all duration-300">
                  {step.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Demo Video Section */}
        <div className="mt-24">
          <div className="bg-white dark:bg-gray-900 rounded-3xl p-8 shadow-2xl">
            <div className="text-center mb-12">
              <h3 className="text-3xl sm:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
                Xem Mindflip hoạt động
              </h3>
              <p className="text-xl text-gray-600 dark:text-gray-300">
                Video demo 2 phút để hiểu rõ cách sử dụng platform
              </p>
            </div>
            
            {/* Video placeholder */}
            <div className="relative aspect-video bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-gray-800 dark:to-gray-700 rounded-2xl overflow-hidden group cursor-pointer">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-24 h-24 bg-white/90 dark:bg-gray-800/90 rounded-full flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-12 h-12 text-indigo-600 ml-1" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                </div>
              </div>
              
              {/* Overlay text */}
              <div className="absolute inset-0 flex items-end p-8">
                <div className="text-white">
                  <h4 className="text-2xl font-bold mb-2">Demo Mindflip</h4>
                  <p className="text-indigo-100">Khám phá tính năng flashcard và space repetition</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}