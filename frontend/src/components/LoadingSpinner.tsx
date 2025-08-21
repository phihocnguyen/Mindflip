'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

interface LoadingSpinnerProps {
  isLoading: boolean;
  onLoadingComplete?: () => void;
}

export default function LoadingSpinner({ isLoading, onLoadingComplete }: LoadingSpinnerProps) {
  if (!isLoading) return null;

  return (
    <div 
      className={`fixed inset-0 z-[9999] bg-black flex flex-col items-center justify-center`}
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