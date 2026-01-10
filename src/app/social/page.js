"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function SocialPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to home page since tabs are now separate routes
    router.push('/home');
  }, [router]);

  return null;
}



