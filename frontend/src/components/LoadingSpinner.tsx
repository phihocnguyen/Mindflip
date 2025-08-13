'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

interface LoadingSpinnerProps {
  isLoading: boolean;
  onLoadingComplete?: () => void;
}

export default function LoadingSpinner({ isLoading, onLoadingComplete }: LoadingSpinnerProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    if (!isLoading && isVisible) {
      setIsFading(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
        onLoadingComplete?.();
      }, 300); // Fade out duration

      return () => clearTimeout(timer);
    }
  }, [isLoading, isVisible, onLoadingComplete]);

  if (!isVisible) return null;

  return (
    <div 
      className={`fixed inset-0 z-[9999] bg-black flex flex-col items-center justify-center transition-opacity duration-300 ${
        isFading ? 'opacity-0' : 'opacity-100'
      }`}
    >
      {/* Logo */}
      <div className="mb-4">
        <Image
          src="/my-logo.png"
          alt="Mindflip Logo"
          width={200}
          height={200}
          priority
        />
      </div>

      {/* Loading Dots */}
      <div className="flex space-x-2">
        <div className="w-3 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
        <div className="w-3 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
        <div className="w-3 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
      </div>
    </div>
  );
} 