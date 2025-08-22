'use client';

import React, { useState, useEffect } from 'react';
import { create } from 'zustand';

const useAuthStore = create((set) => ({
  isAuthenticated: false,
  user: null,
}));

const VideoPlayer = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const YOUTUBE_VIDEO_ID = 'SwuFlbv1QI4';

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeModal();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, []);

  return (
    <>
      <div className="w-full">
        <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 sm:p-8 shadow-2xl">
          <div
            onClick={openModal}
            className="relative flex items-center justify-center aspect-video rounded-2xl overflow-hidden group cursor-pointer"
          >
            {/* YouTube Thumbnail Image */}
            <img
              src="/my-logo.png"
              alt="Video Thumbnail"
              className="w-[300px] h-[200px] transition-transform duration-300 group-hover:scale-105"
            />
            
            {/* Overlay and Play Button */}
            <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/40 transition-all duration-300">
              <div className="w-20 h-20 sm:w-24 sm:h-24 bg-white/90 dark:bg-gray-900/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-300">
                <svg className="w-10 h-10 sm:w-12 sm:h-12 text-indigo-600 dark:text-indigo-400 ml-1" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </div>
            
            {/* Text Overlay */}
            <div className="absolute inset-0 flex items-end p-4 sm:p-8 pointer-events-none">
               <div className="bg-gradient-to-t from-black/60 to-transparent absolute bottom-0 left-0 right-0 h-1/2"></div>
              <div className="relative text-white">
                <h4 className="text-xl sm:text-2xl font-bold mb-1 sm:mb-2">Demo Mindflip</h4>
                <p className="text-sm sm:text-base text-indigo-200">Khám phá các tính năng học từ vựng thông minh</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div
          onClick={closeModal}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-opacity duration-300"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative bg-black rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden"
          >
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 z-10 w-10 h-10 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
              aria-label="Close video player"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            <div className="aspect-video">
              <iframe
                className="w-full h-full"
                src={`https://www.youtube.com/embed/${YOUTUBE_VIDEO_ID}?autoplay=1&rel=0&showinfo=0`}
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>
      )}
    </>
  );
};


export default function HeroSection() {
  const isAuthenticated = useAuthStore((state : any) => state.isAuthenticated);
  
  return (
    <section className="relative min-h-screen bg-gradient-to-br from-indigo-100 via-white to-purple-100 dark:bg-gradient-to-br dark:from-gray-900 dark:via-gray-950 dark:to-gray-800 transition-colors duration-500 overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-10 left-10 w-64 h-64 bg-indigo-300 dark:bg-indigo-700 opacity-20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-300 dark:bg-purple-700 opacity-20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="text-center lg:text-left">
          <div className="mb-8 animate-fade-in-up">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold mb-6 text-gray-900 dark:text-white leading-tight">
              Chinh phục từ vựng với{' '}
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent animate-gradient-x">
              Mindflip
              </span>
          </h1>
          <div className="w-32 h-1 bg-gradient-to-r from-indigo-600 to-purple-600 mx-auto lg:mx-0 mb-8 rounded-full animate-scale-in"></div>
          </div>

          <p className="text-xl sm:text-2xl max-w-xl mx-auto lg:mx-0 mb-12 text-gray-700 dark:text-gray-200 leading-relaxed animate-fade-in-up delay-200">
          Nền tảng học từ vựng thông minh với{' '}
          <span className="font-semibold text-indigo-600 dark:text-indigo-400">Spaced Repetition</span>,
          flashcard tương tác, tra từ tức thì và theo dõi tiến độ học tập.
          </p>

          <div className="flex justify-center lg:justify-start gap-4 mb-16 animate-fade-in-up delay-400">
          <a
              href={isAuthenticated ? '/dashboard' : '/signup'}
              className="inline-block px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
          >
              {isAuthenticated ? 'Vào học ngay' : 'Bắt đầu miễn phí'}
          </a>
          <a
              href="/features"
              className="inline-block px-8 py-4 text-lg font-semibold text-indigo-600 dark:text-indigo-400 bg-white dark:bg-gray-800 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
          >
              Tìm hiểu thêm
          </a>
          </div>
        </div>

        <div className="flex items-center justify-center">
          <VideoPlayer />
        </div>
        </div>

      </div>

      <div
        className="absolute bottom-20 left-1/2 transform -translate-x-1/2 animate-bounce cursor-pointer"
        onClick={() => window.scrollBy({ top: 800, behavior: 'smooth' })}
        >
        <svg className="w-8 h-8 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>

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
    </section>
  );
}