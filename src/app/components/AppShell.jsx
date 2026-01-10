"use client";
import { Suspense } from "react";
import { usePathname } from "next/navigation";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function AppShell({ children }) {
  const pathname = usePathname();
  const isSwagger = pathname === "/swagger";
  const isFerozi = pathname === "/mystore";
  const isStories = pathname === "/stories";

  if (isSwagger || isFerozi) {
    return (
      <main className="flex-1">
        {children}
      </main>
    );
  }

  return (
    <>
      <Suspense fallback={null}>
        <Navbar />
      </Suspense>
      <main className="flex-1">
        {children}
      </main>
      {!isStories && <Footer />}
    </>
  );
}


