"use client";
import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthStore } from "../../../hooks/authStore";

export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const login = useAuthStore((state) => state.login);

  useEffect(() => {
    const token = searchParams.get("token");
    if (token) {
      login(token);
      router.replace("/");
    } else {
      // Nếu không có token, chuyển về trang đăng nhập
      router.replace("/login");
    }
  }, [searchParams, login, router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="loader mb-4" />
        <p>Đang xác thực với Google...</p>
      </div>
    </div>
  );
}