'use client';

import Link from 'next/link';

export default function FooterSection() {
  const footerLinks = {
    product: [
      { name: "Tính năng", href: "#features" },
      { name: "Gói dịch vụ", href: "#pricing" },
      { name: "API", href: "/api-docs" },
      { name: "Tích hợp", href: "/integrations" }
    ],
    resources: [
      { name: "Blog", href: "/blog" },
      { name: "Hướng dẫn", href: "/guides" },
      { name: "Phương pháp học", href: "/methods" },
      { name: "Từ điển", href: "/dictionary" }
    ],
    company: [
      { name: "Về chúng tôi", href: "/about" },
      { name: "Tuyển dụng", href: "/careers" },
      { name: "Báo chí", href: "/press" },
      { name: "Đối tác", href: "/partners" }
    ],
    support: [
      { name: "Trung tâm trợ giúp", href: "/help" },
      { name: "Liên hệ", href: "/contact" },
      { name: "Trạng thái hệ thống", href: "/status" },
      { name: "Báo lỗi", href: "/report-bug" }
    ]
  };

  const socialLinks = [
    {
      name: "Facebook",
      href: "#",
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
      )
    },
    {
      name: "Twitter", 
      href: "#",
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
        </svg>
      )
    },
    {
      name: "Instagram",
      href: "#", 
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987s11.987-5.367 11.987-11.987C24.014 5.367 18.647.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.563-3.239-1.455-.792-.891-1.239-2.023-1.239-3.132 0-1.109.447-2.241 1.239-3.132.791-.892 1.942-1.455 3.239-1.455s2.448.563 3.239 1.455c.792.891 1.239 2.023 1.239 3.132 0 1.109-.447 2.241-1.239 3.132-.791.892-1.942 1.455-3.239 1.455zM12 7.5a4.5 4.5 0 100 9 4.5 4.5 0 000-9zm6.406-1.845a1.08 1.08 0 11-2.16 0 1.08 1.08 0 012.16 0z" />
        </svg>
      )
    },
  ];

  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 mt-16">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          {Object.entries(footerLinks).map(([section, links]) => (
            <div key={section}>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4 capitalize">{section}</h3>
              <ul className="space-y-2">
                {links.map(link => (
                  <li key={link.name}>
                    <Link href={link.href} className="text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-200 text-sm">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="flex flex-col md:flex-row items-center justify-between border-t border-gray-100 dark:border-gray-800 pt-8 gap-4">
          <span className="text-xs text-gray-500 dark:text-gray-400">&copy; {new Date().getFullYear()} Mindflip. All rights reserved.</span>
          <div className="flex space-x-4">
            {socialLinks.map(link => (
              <a key={link.name} href={link.href} className="text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-200" aria-label={link.name} target="_blank" rel="noopener noreferrer">
                {link.icon}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}