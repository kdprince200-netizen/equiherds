"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Briefcase, Info, Phone, Newspaper, LogIn } from "lucide-react";

const footerItems = [
  { href: "/", label: "Home", Icon: Home },
  { href: "/services", label: "Services", Icon: Briefcase },
  { href: "/about", label: "About us", Icon: Info },
  { href: "/contact", label: "Contact us", Icon: Phone },
  { href: "/news", label: "News", Icon: Newspaper },
  { href: "/login", label: "Login", Icon: LogIn },
];

export default function Footer() {
  const pathname = usePathname();
  return (
    <footer className="w-full border-t border-white/10 mt-10 bg-primary text-white">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-12 text-[15px]">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Image src="/logo2.png" className="" alt="Logo" width={150} height={150} />
            <p className="opacity-70 leading-relaxed max-w-xs">Building modern herd management experiences with care and technology.</p>
          </div>

          <div>
            <h4 className="mb-4 font-bold text-white text-[16px]">Company</h4>
            <ul className="space-y-3">
              {[
                { href: "/aboutus", label: "About us" },
                { href: "/news", label: "News" },
                { href: "/contactus", label: "Contact us" },
              ].map(({ href, label }) => {
                const isActive = href === "/" ? pathname === "/" : pathname.startsWith(href);
                return (
                  <li key={href}>
                    <Link href={href} className={`text-white hover:underline underline-offset-4 ${isActive ? "[color:var(--secondary)] underline" : "text-white/80 hover:[color:var(--secondary)]"}`}>{label}</Link>
                  </li>
                );
              })}
            </ul>
          </div>

          <div>
            <h4 className="mb-4 font-semibold  text-[16px]">Services</h4>
            <ul className="space-y-3">
              {[
                { href: "/services?type=trainer", label: "All Services" },
                { href: "/services?type=stables", label: "Stables" },
                { href: "/services?type=otherservices", label: "Other Services" },
              ].map(({ href, label }) => {
                const isActive = href === "/" ? pathname === "/" : pathname.startsWith(href);
                return (
                  <li key={href}>
                    <Link href={href} className={`text-white hover:underline underline-offset-4 ${isActive ? "[color:var(--secondary)] underline" : "text-white/80 hover:[color:var(--secondary)]"}`}>{label}</Link>
                  </li>
                );
              })}
            </ul>
          </div>

          <div>
            <h4 className="mb-4 font-semibold text-[16px]">Legal</h4>
            <ul className="space-y-3">
              {[
                // { href: "/imprint", label: "Imprint" },
                { href: "/dataprivacy", label: "Data Privacy" },
                // { href: "/right-of-withdrawal", label: "Right of Withdrawal" },
                { href: "/termsandconditions", label: "Terms and Conditions" },
              ].map(({ href, label }) => {
                const isActive = href === "/" ? pathname === "/" : pathname.startsWith(href);
                return (
                  <li key={href}>
                    <Link href={href} className={`text-white hover:underline underline-offset-4 ${isActive ? "[color:var(--secondary)] underline" : "text-white/80 hover:[color:var(--secondary)]"}`}>{label}</Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        <div className="flex items-center justify-center pt-8 mt-8 border-t border-white/10">
          <p className="opacity-70 text-center">© {new Date().getFullYear()} EquiHerds. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}


