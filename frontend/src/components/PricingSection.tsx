'use client';

export default function PricingSection() {
  const plans = [
    {
      name: "Miễn phí",
      price: "0",
      period: "Mãi mãi",
      description: "Hoàn hảo để bắt đầu hành trình học tập",
      features: [
        "100 từ vựng",
        "Flashcard cơ bản", 
        "Tra từ giới hạn",
        "Thống kê cơ bản",
        "Hỗ trợ email"
      ],
      buttonText: "Bắt đầu miễn phí",
      buttonStyle: "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700",
      popular: false,
      gradient: "from-gray-400 to-gray-600"
    },
    {
      name: "Pro",
      price: "99,000",
      period: "tháng", 
      description: "Dành cho người học nghiêm túc",
      features: [
        "Không giới hạn từ vựng",
        "Flashcard thông minh với AI",
        "Tra từ không giới hạn",
        "SRS algorithm tối ưu",
        "Thống kê chi tiết",
        "Xuất/nhập dữ liệu",
        "Ưu tiên hỗ trợ"
      ],
      buttonText: "Chọn gói Pro",
      buttonStyle: "bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700",
      popular: true,
      gradient: "from-indigo-600 to-purple-600"
    },
    {
      name: "Premium",
      price: "199,000", 
      period: "tháng",
      description: "Cho team và tổ chức giáo dục",
      features: [
        "Tất cả tính năng Pro",
        "Tạo nhóm học tập",
        "Quản lý tiến độ team",
        "API access",
        "Custom branding",
        "Tích hợp LMS",
        "Hỗ trợ 24/7"
      ],
      buttonText: "Liên hệ tư vấn",
      buttonStyle: "bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700",
      popular: false,
      gradient: "from-purple-600 to-pink-600"
    }
  ];

  return (
    <section className="py-24 bg-gray-50 dark:bg-gray-800 transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-20">
          <h2 className="text-4xl sm:text-5xl font-bold mb-6 text-gray-900 dark:text-white">
            Gói{' '}
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              dịch vụ
            </span>
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-indigo-600 to-purple-600 mx-auto mb-6 rounded-full"></div>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Chọn gói phù hợp với nhu cầu học tập của bạn. Tất cả gói đều có thể hủy bất cứ lúc nào.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative bg-white dark:bg-gray-900 rounded-3xl shadow-xl overflow-hidden transform hover:scale-105 transition-all duration-300 flex flex-col h-full ${
                plan.popular ? 'ring-4 ring-indigo-500 ring-opacity-50' : ''
              }`}
            >
              {/* Popular badge */}
              {plan.popular && (
                <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10">
                  <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg">
                    Phổ biến nhất
                  </div>
                </div>
              )}

              <div className="p-8 flex flex-col h-full">
                {/* Plan header */}
                <div className="text-center mb-8 mt-6">
                  <div className={`w-16 h-16 mx-auto mb-4 bg-gradient-to-r ${plan.gradient} rounded-2xl flex items-center justify-center`}>
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    {plan.name}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    {plan.description}
                  </p>
                </div>

                {/* Price */}
                <div className="text-center mb-8">
                  <div className="flex items-baseline justify-center">
                    <span className="text-5xl font-bold text-gray-900 dark:text-white">
                      {plan.price === "0" ? "Miễn phí" : `${plan.price}₫`}
                    </span>
                    {plan.price !== "0" && (
                      <span className="text-xl text-gray-500 dark:text-gray-400 ml-2">
                        /{plan.period}
                      </span>
                    )}
                  </div>
                </div>

                {/* Features */}
                <div className="mb-8">
                  <ul className="space-y-4">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center">
                        <svg className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-gray-700 dark:text-gray-300">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* CTA Button */}
                <button className={`w-full py-4 px-6 rounded-xl font-bold text-lg transition-all duration-300 transform hover:-translate-y-1 shadow-lg hover:shadow-xl mt-auto ${plan.buttonStyle}`}>
                  {plan.buttonText}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="bg-white dark:bg-gray-900 rounded-3xl p-12 shadow-xl">
          <h3 className="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-white">
            Câu hỏi thường gặp
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h4 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">
                Tôi có thể hủy gói trả phí không?
              </h4>
              <p className="text-gray-600 dark:text-gray-300">
                Có, bạn có thể hủy bất cứ lúc nào. Không có phí hủy và bạn vẫn có thể sử dụng đến hết chu kỳ thanh toán.
              </p>
            </div>
            
            <div>
              <h4 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">
                Gói miễn phí có giới hạn thời gian không?
              </h4>
              <p className="text-gray-600 dark:text-gray-300">
                Không, gói miễn phí không có giới hạn thời gian. Bạn có thể sử dụng mãi mãi với 100 từ vựng.
              </p>
            </div>
            
            <div>
              <h4 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">
                Có hỗ trợ thanh toán qua ngân hàng không?
              </h4>
              <p className="text-gray-600 dark:text-gray-300">
                Có, chúng tôi hỗ trợ thanh toán qua thẻ ATM, Internet Banking, ví điện tử và chuyển khoản.
              </p>
            </div>
            
            <div>
              <h4 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">
                Có giảm giá cho học sinh, sinh viên không?
              </h4>
              <p className="text-gray-600 dark:text-gray-300">
                Có, chúng tôi có chương trình giảm giá 50% cho học sinh, sinh viên khi xuất trình thẻ học sinh/sinh viên.
              </p>
            </div>
          </div>
        </div>

        {/* Money back guarantee */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center bg-green-50 dark:bg-green-900/20 px-6 py-3 rounded-full">
            <svg className="w-6 h-6 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <span className="text-green-700 dark:text-green-300 font-semibold">
              Hoàn tiền 100% trong 30 ngày đầu nếu không hài lòng
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}