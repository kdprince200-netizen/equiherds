'use client';

import { usePathname } from 'next/navigation';
import Header from '../feature/Header';
import Footer from '../feature/Footer';

export default function ConditionalLayout({ children }) {
  const pathname = usePathname();
  const hideNavAndFooter = pathname === '/swagger';

  return (
    <>
      {!hideNavAndFooter && <Header />}
      {children}
      {!hideNavAndFooter && <Footer />}
    </>
  );
}

