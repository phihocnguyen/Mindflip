'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [show, setShow] = useState(false);

  useEffect(() => {
    setShow(false);
    const timeout = setTimeout(() => setShow(true), 30);
    return () => clearTimeout(timeout);
  }, [pathname]);

  // Chỉ apply transition-opacity khi chuyển route, không ảnh hưởng dark mode
  return (
    <div
      key={pathname}
      style={{ transition: 'opacity 0.5s' }}
      className={show ? 'opacity-100' : 'opacity-0'}
    >
      {children}
    </div>
  );
}