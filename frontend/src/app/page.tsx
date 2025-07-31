'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../hooks/authStore';
import Link from 'next/link';
import HeroSection from '../components/HeroSection';
import FeaturesSection from '../components/FeaturesSection';
import HowItWorksSection from '../components/HowItWorksSection';
import PricingSection from '../components/PricingSection';
import TestimonialsSection from '../components/TestimonialsSection';
import FooterSection from '../components/Footer';


export default function Home() {
  const router = useRouter();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isLoading = useAuthStore((state) => state.isLoading);
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    // Khởi tạo auth state
    useAuthStore.getState().initialize();
  }, []);

  useEffect(() => {
    // Redirect to dashboard if authenticated
    if (!isLoading && isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, isLoading, router]);

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:bg-gradient-to-br dark:from-gray-900 dark:via-gray-950 dark:to-gray-800">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-300">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render the landing page if user is authenticated
  if (isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:bg-gradient-to-br dark:from-gray-900 dark:via-gray-950 dark:to-gray-800 transition-colors duration-500 flex flex-col">
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <PricingSection />
      <TestimonialsSection />
      <FooterSection />
    </div>
  );
}
