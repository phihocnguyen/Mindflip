'use client';

import { useAuthStore } from '../hooks/authStore';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import Image from 'next/image';

// Sample images for the slider (replace with actual image URLs or local assets)
const sliderImages = [
  { src: '/images/study1.jpg', alt: 'Interactive Flashcards', caption: 'Học từ vựng với Flashcard tương tác' },
  { src: '/images/study2.jpg', alt: 'Spaced Repetition', caption: 'Ghi nhớ lâu hơn với Spaced Repetition' },
  { src: '/images/study3.jpg', alt: 'Learning Blog', caption: 'Khám phá blog học tập phong phú' },
];

export default function HeroSection() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-slide effect for the carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % sliderImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-screen bg-gradient-to-br from-indigo-100 via-white to-purple-100 dark:bg-gradient-to-br dark:from-gray-900 dark:via-gray-950 dark:to-gray-800 transition-colors duration-500 overflow-hidden">
      {/* Background decorative shapes */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-10 left-10 w-64 h-64 bg-indigo-300 dark:bg-indigo-700 opacity-20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-300 dark:bg-purple-700 opacity-20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* LEFT: Text Content */}
        <div className="text-center lg:text-left">
            {/* Main Heading with Animation */}
            <div className="mb-8 animate-fade-in-up">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold mb-6 text-gray-900 dark:text-white leading-tight">
                Chinh phục từ vựng với{' '}
                <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent animate-gradient-x">
                Mindflip
                </span>
            </h1>
            <div className="w-32 h-1 bg-gradient-to-r from-indigo-600 to-purple-600 mx-auto lg:mx-0 mb-8 rounded-full animate-scale-in"></div>
            </div>

            {/* Subtitle */}
            <p className="text-xl sm:text-2xl max-w-xl mx-auto lg:mx-0 mb-12 text-gray-700 dark:text-gray-200 leading-relaxed animate-fade-in-up delay-200">
            Khám phá nền tảng học từ vựng thông minh sử dụng{' '}
            <span className="font-semibold text-indigo-600 dark:text-indigo-400">Spaced Repetition</span>,
            tích hợp flashcard tương tác, tra từ tức thì và blog học tập đầy cảm hứng.
            </p>

            {/* CTA Buttons */}
            <div className="flex justify-center lg:justify-start gap-4 mb-16 animate-fade-in-up delay-400">
            <Link
                href={isAuthenticated ? '/dashboard' : '/signup'}
                className="inline-block px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
            >
                {isAuthenticated ? 'Vào học ngay' : 'Bắt đầu miễn phí'}
            </Link>
            <Link
                href="/features"
                className="inline-block px-8 py-4 text-lg font-semibold text-indigo-600 dark:text-indigo-400 bg-white dark:bg-gray-800 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
            >
                Tìm hiểu thêm
            </Link>
            </div>
        </div>

        {/* RIGHT: Image Slider */}
        <div className="animate-fade-in-up delay-500">
            <div className="relative h-64 sm:h-80 lg:h-[28rem] rounded-2xl overflow-hidden shadow-2xl">
            {sliderImages.map((image, index) => (
                <div
                key={index}
                className={`absolute inset-0 transition-opacity duration-1000 ${
                    index === currentSlide ? 'opacity-100' : 'opacity-0'
                }`}
                >
                <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    className="object-cover"
                    priority={index === 0}
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                    <p className="text-white text-lg sm:text-2xl font-semibold text-center px-4">
                    {image.caption}
                    </p>
                </div>
                </div>
            ))}
            </div>
            {/* Dots */}
            <div className="flex justify-center mt-4 gap-2">
            {sliderImages.map((_, index) => (
                <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full transition-colors duration-300 ${
                    index === currentSlide ? 'bg-indigo-600' : 'bg-gray-400'
                }`}
                />
            ))}
            </div>
        </div>
        </div>

      </div>

      {/* Scroll Indicator with Animation */}
      <div
        className="absolute bottom-20 left-1/2 transform -translate-x-1/2 animate-bounce cursor-pointer"
        onClick={() => window.scrollBy({ top: 800, behavior: 'smooth' })}
        >
        <svg className="w-8 h-8 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>

    </section>
  );
}

// CSS for animations (add to global.css or a CSS module)
<style jsx global>{`
  @keyframes fade-in-up {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  .animate-fade-in-up {
    animation: fade-in-up 0.8s ease-out forwards;
  }

  @keyframes scale-in {
    from {
      transform: scaleX(0);
    }
    to {
      transform: scaleX(1);
    }
  }
  .animate-scale-in {
    animation: scale-in 0.5s ease-out forwards;
  }

  @keyframes gradient-x {
    0% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
    100% {
      background-position: 0% 50%;
    }
  }
  .animate-gradient-x {
    background-size: 200% 200%;
    animation: gradient-x 3s ease infinite;
  }
`}</style>