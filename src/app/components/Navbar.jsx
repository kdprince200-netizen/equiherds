"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Home, Briefcase, Info, Phone, Newspaper, LogIn, Menu, X, User, Users, Building, Wrench, CreditCard, ShoppingBag, Store, MessageCircle, Camera } from "lucide-react";
import { getUserData } from "../utils/localStorage";

const baseNavItems = [
  { href: "/", label: "Home", Icon: Home },
  { href: "/services", label: "Services", Icon: Briefcase },
  { href: "/market", label: "Market", Icon: ShoppingBag },
  { href: "/social", label: "Social", Icon: Users },
  { href: "/aboutus", label: "About us", Icon: Info },
  { href: "/contactus", label: "Contact us", Icon: Phone },
  { href: "/news", label: "News", Icon: Newspaper },
  { href: "/subscription", label: "Subscription", Icon: CreditCard },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [marketOpen, setMarketOpen] = useState(false);
  const [socialOpen, setSocialOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const servicesRef = useRef(null);
  const marketRef = useRef(null);
  const socialRef = useRef(null);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const userId = getUserData();

  // Helper function to validate URL and provide fallback
  const getValidImageSrc = (imageUrl) => {
    if (!imageUrl) return "/logo2.png";
    
    // Check if it's a placeholder URL that should be avoided
    if (imageUrl.includes('via.placeholder.com') || imageUrl.includes('placeholder')) {
      return "/logo2.png";
    }
    
    try {
      new URL(imageUrl);
      return imageUrl;
    } catch (_) {
      return "/logo2.png";
    }
  };

  useEffect(() => {
    const checkToken = () => {
      try {
        const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
        setIsAuthenticated(Boolean(token));
      } catch {
        setIsAuthenticated(false);
      }
    };
    checkToken();

    // Sync across tabs
    const onStorage = (e) => {
      if (e.key === "token") checkToken();
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  // Close Services, Market, and Social on outside click / Escape
  useEffect(() => {
    function handleClick(event) {
      if (servicesRef.current && !servicesRef.current.contains(event.target)) {
        setServicesOpen(false);
      }
      if (marketRef.current && !marketRef.current.contains(event.target)) {
        setMarketOpen(false);
      }
      if (socialRef.current && !socialRef.current.contains(event.target)) {
        setSocialOpen(false);
      }
    }
    function handleKey(event) {
      if (event.key === "Escape") {
        setServicesOpen(false);
        setMarketOpen(false);
        setSocialOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("touchstart", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("touchstart", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, []);

  // Handle navigation with loading state
  const handleNavigation = (href, e) => {
    e.preventDefault();
    // Determine current full href including query
    const currentQuery = searchParams?.toString() || "";
    const currentHref = currentQuery ? `${pathname}?${currentQuery}` : pathname;
    if (currentHref === href) return; // Avoid redundant navigation
    
    setIsLoading(true);
    setOpen(false); // Close mobile menu
    
    // Navigate immediately
    router.push(href);
  };

  // Listen for route changes to hide loading
  useEffect(() => {
    // Hide loading when path OR query changes
    setIsLoading(false);
  }, [pathname, searchParams]);

  return (
    <>
      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999]">
          <Image src="/loading.gif" alt="Loading" width={160} height={160} />
        </div>
      )}
      
      <header className="w-full border-b border-white/10 bg-primary sticky top-0 z-40">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="flex items-center"
            onClick={(e) => handleNavigation("/", e)}
          >
            <Image src="/logo2.png" alt="Logo" width={138} height={138} />
          </Link>
        </div>

        <button aria-label="Toggle menu" className="sm:hidden p-2 rounded hover:bg-white/10 text-white" onClick={() => setOpen((v) => !v)}>
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>

        <nav className="hidden sm:flex items-center gap-6 text-[15px]">
          {[...baseNavItems, isAuthenticated ? { href: "/profile", label: "Profile", Icon: User } : { href: "/login", label: "Login", Icon: LogIn }].map(({ href, label, Icon }) => {
            const isActive = href === "/" ? pathname === "/" : pathname.startsWith(href);
            if (label === "Services") {
              return (
                <div
                  key={href}
                  className="relative group"
                  ref={servicesRef}
                  onMouseEnter={() => setServicesOpen(true)}
                >
                  <Link
                    href={href}
                    className={`flex items-center gap-2 underline-offset-4 ${
                      isActive ? "underline text-white" : "text-white hover:underline"
                    }`}
                    onClick={(e) => {
                      e.preventDefault();
                      setServicesOpen((v) => !v);
                    }}
                  >
                    <Icon className="text-white" size={22} />
                    <span className="text-white font-bold">{label}</span>
                  </Link>
                  <div
                    className={`${servicesOpen ? "visible opacity-100" : "invisible opacity-0"} group-hover:visible group-hover:opacity-100 transition-opacity duration-200 absolute left-0 top-full mt-2 min-w-[180px] rounded-md border border-white/10 bg-primary shadow-lg`}
                    onMouseEnter={() => setServicesOpen(true)}
                    onMouseLeave={() => setServicesOpen(false)}
                  >
                    <Link href="/services?type=trainer" className="block px-4 py-2 text-white hover:bg-white/10" onClick={(e) => { setServicesOpen(false); handleNavigation("/services?type=trainer", e); }}>Our Trainers</Link>
                    <Link href="/services?type=stables" className="block px-4 py-2 text-white hover:bg-white/10" onClick={(e) => { setServicesOpen(false); handleNavigation("/services?type=stables", e); }}>Our Stables</Link>
                    <Link href="/services?type=otherservices" className="block px-4 py-2 text-white hover:bg-white/10" onClick={(e) => { setServicesOpen(false); handleNavigation("/services?type=otherservices", e); }}>Other Services</Link>
                  </div>
                </div>
              );
            }
            if (label === "Market") {
              return (
                <div
                  key={href}
                  className="relative group"
                  ref={marketRef}
                  onMouseEnter={() => setMarketOpen(true)}
                >
                  <Link
                    href={href}
                    className={`flex items-center gap-2 underline-offset-4 ${
                      isActive ? "underline text-white" : "text-white hover:underline"
                    }`}
                    onClick={(e) => {
                      e.preventDefault();
                      setMarketOpen((v) => !v);
                    }}
                  >
                    <Icon className="text-white" size={22} />
                    <span className="text-white font-bold">{label}</span>
                  </Link>
                  <div
                    className={`${marketOpen ? "visible opacity-100" : "invisible opacity-0"} group-hover:visible group-hover:opacity-100 transition-opacity duration-200 absolute left-0 top-full mt-2 min-w-[180px] rounded-md border border-white/10 bg-primary shadow-lg`}
                    onMouseEnter={() => setMarketOpen(true)}
                    onMouseLeave={() => setMarketOpen(false)}
                  >
                    <Link href="/market?type=horse" className="block px-4 py-2 text-white hover:bg-white/10" onClick={(e) => { setMarketOpen(false); handleNavigation("/market?type=horse", e); }}>Horse Market</Link>
                    <Link href="/market?type=marketplace" className="block px-4 py-2 text-white hover:bg-white/10" onClick={(e) => { setMarketOpen(false); handleNavigation("/market?type=marketplace", e); }}>Market Place</Link>
                  </div>
                </div>
              );
            }
            if (label === "Social") {
              const isSocialActive = pathname === "/community" || pathname === "/stories" || pathname === "/home";
              return (
                <div
                  key={href}
                  className="relative group"
                  ref={socialRef}
                  onMouseEnter={() => setSocialOpen(true)}
                >
                  <Link
                    href={href}
                    className={`flex items-center gap-2 underline-offset-4 ${
                      isSocialActive ? "underline text-white" : "text-white hover:underline"
                    }`}
                    onClick={(e) => {
                      e.preventDefault();
                      setSocialOpen((v) => !v);
                    }}
                  >
                    <Icon className="text-white" size={22} />
                    <span className="text-white font-bold">{label}</span>
                  </Link>
                  <div
                    className={`${socialOpen ? "visible opacity-100" : "invisible opacity-0"} group-hover:visible group-hover:opacity-100 transition-opacity duration-200 absolute left-0 top-full mt-2 min-w-[180px] rounded-md border border-white/10 bg-primary shadow-lg`}
                    onMouseEnter={() => setSocialOpen(true)}
                    onMouseLeave={() => setSocialOpen(false)}
                  >
                    <Link href="/community" className="block px-4 py-2 text-white hover:bg-white/10" onClick={(e) => { setSocialOpen(false); handleNavigation("/community", e); }}>Community</Link>
                    <Link href="/stories" className="block px-4 py-2 text-white hover:bg-white/10" onClick={(e) => { setSocialOpen(false); handleNavigation("/stories", e); }}>Stories</Link>
                  </div>
                </div>
              );
            }
            if (label === "Profile" && isAuthenticated) {
              // Check for various possible image field names
              const profileImage = userId?.brandImage || userId?.profileImage || userId?.avatar || userId?.image;
              console.log("Profile image found:", profileImage);
              
              if (profileImage) {
                return (
                  <Link
                    key={href}
                    href={href}
                    className="flex items-center"
                    title="Profile"
                    onClick={(e) => handleNavigation(href, e)}
                  >
                    <Image 
                      src={getValidImageSrc(profileImage)} 
                      alt="Profile" 
                      width={40} 
                      height={40} 
                      className="rounded-full object-cover border-2 border-white/20 hover:border-white/40 transition-colors w-10 h-10"
                      style={{ objectFit: 'cover', objectPosition: 'center' }}
                      onError={(e) => {
                        console.log("Image failed to load, using fallback");
                        e.target.src = "/logo2.png";
                      }}
                    />
                  </Link>
                );
              } else {
                // Show default profile icon if no image
                return (
                  <Link
                    key={href}
                    href={href}
                    className="flex items-center"
                    title="Profile"
                    onClick={(e) => handleNavigation(href, e)}
                  >
                    <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center border-2 border-white/20 hover:border-white/40 transition-colors overflow-hidden">
                      <User className="text-white" size={20} />
                    </div>
                  </Link>
                );
              }
            }
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-2 underline-offset-4 ${
                  isActive ? "underline text-white" : "text-white hover:underline"
                }`}
                onClick={(e) => handleNavigation(href, e)}
              >
                <Icon className="text-white" size={22} />
                <span className="text-white font-bold">{label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Mobile drawer */}
      <div className={`sm:hidden fixed inset-0 z-50 ${open ? "pointer-events-auto" : "pointer-events-none"}`}>
        {/* Backdrop */}
        <div
          className={`absolute inset-0 bg-black/50 transition-opacity duration-300 ${open ? "opacity-100" : "opacity-0"}`}
          onClick={() => setOpen(false)}
        />
        {/* Panel */}
        <div
          className={`absolute left-0 top-0 h-full w-[80vw] max-w-[22rem] bg-primary border-r border-white/10 shadow-xl transition-transform duration-300 ease-out ${open ? "translate-x-0" : "-translate-x-full"}`}
        >
          <div className="px-4 py-3 flex items-center justify-between border-b border-white/10">
            <Link href="/" className="flex items-center gap-2 gap-2" onClick={(e) => { setOpen(false); handleNavigation("/", e); }}>
              <Image src="/logo2.png" alt="Logo" width={127} height={127} />
            </Link>
            <button aria-label="Close menu" className="p-2 rounded hover:bg-white/10 text-white" onClick={() => setOpen(false)}>
              <X size={20} />
            </button>
          </div>
          <nav className="px-4 py-3 grid grid-cols-1 gap-2 text-[15px]">
            {[...baseNavItems, isAuthenticated ? { href: "/profile", label: "Profile", Icon: User } : { href: "/login", label: "Login", Icon: LogIn }].map(({ href, label, Icon }) => {
              const isActive = href === "/" ? pathname === "/" : pathname.startsWith(href);
              if (label === "Services") {
                return (
                  <div key={href} className="grid gap-1">
                    <Link
                      href={href}
                      className={`flex items-center gap-3 ${
                        isActive ? "underline text-white" : "text-white hover:underline"
                      }`}
                      onClick={(e) => { setOpen(false); handleNavigation(href, e); }}
                    >
                      <Icon className="text-white" size={20} />
                      <span className="text-white">{label}</span>
                    </Link>
                    <div className="ml-7 grid">
                      <Link href="/services?type=trainer" className="flex items-center gap-2 px-2 py-1 text-white hover:text-white/80 hover:bg-white/10 rounded transition-colors" onClick={(e) => { setOpen(false); handleNavigation("/services?type=trainer", e); }}>
                        <Users className="text-white" size={16} />
                        Trainers
                      </Link>
                      <Link href="/services?type=stables" className="flex items-center gap-2 px-2 py-1 text-white hover:text-white/80 hover:bg-white/10 rounded transition-colors" onClick={(e) => { setOpen(false); handleNavigation("/services?type=stables", e); }}>
                        <Building className="text-white" size={16} />
                        Stables
                      </Link>
                      <Link href="/services?type=otherservices" className="flex items-center gap-2 px-2 py-1 text-white hover:text-white/80 hover:bg-white/10 rounded transition-colors" onClick={(e) => { setOpen(false); handleNavigation("/services?type=otherservices", e); }}>
                        <Wrench className="text-white" size={16} />
                        Other Services
                      </Link>
                    </div>
                  </div>
                );
              }
              if (label === "Market") {
                return (
                  <div key={href} className="grid gap-1">
                    <Link
                      href={href}
                      className={`flex items-center gap-3 ${
                        isActive ? "underline text-white" : "text-white hover:underline"
                      }`}
                      onClick={(e) => { setOpen(false); handleNavigation(href, e); }}
                    >
                      <Icon className="text-white" size={20} />
                      <span className="text-white">{label}</span>
                    </Link>
                    <div className="ml-7 grid">
                      <Link href="/market?type=horse" className="flex items-center gap-2 px-2 py-1 text-white hover:text-white/80 hover:bg-white/10 rounded transition-colors" onClick={(e) => { setOpen(false); handleNavigation("/market?type=horse", e); }}>
                        <ShoppingBag className="text-white" size={16} />
                        Horse
                      </Link>
                      <Link href="/market?type=marketplace" className="flex items-center gap-2 px-2 py-1 text-white hover:text-white/80 hover:bg-white/10 rounded transition-colors" onClick={(e) => { setOpen(false); handleNavigation("/market?type=marketplace", e); }}>
                        <Store className="text-white" size={16} />
                        Market Place
                      </Link>
                    </div>
                  </div>
                );
              }
              if (label === "Social") {
                const isSocialActive = pathname === "/community" || pathname === "/stories" || pathname === "/home";
                return (
                  <div key={href} className="grid gap-1">
                    <Link
                      href={href}
                      className={`flex items-center gap-3 ${
                        isSocialActive ? "underline text-white" : "text-white hover:underline"
                      }`}
                      onClick={(e) => { setOpen(false); handleNavigation(href, e); }}
                    >
                      <Icon className="text-white" size={20} />
                      <span className="text-white">{label}</span>
                    </Link>
                    <div className="ml-7 grid">
                      <Link href="/community" className="flex items-center gap-2 px-2 py-1 text-white hover:text-white/80 hover:bg-white/10 rounded transition-colors" onClick={(e) => { setOpen(false); handleNavigation("/community", e); }}>
                        <MessageCircle className="text-white" size={16} />
                        Community
                      </Link>
                      <Link href="/stories" className="flex items-center gap-2 px-2 py-1 text-white hover:text-white/80 hover:bg-white/10 rounded transition-colors" onClick={(e) => { setOpen(false); handleNavigation("/stories", e); }}>
                        <Camera className="text-white" size={16} />
                        Stories
                      </Link>
                    </div>
                  </div>
                );
              }
              if (label === "Profile" && isAuthenticated) {
                // Check for various possible image field names
                const profileImage = userId?.brandImage || userId?.profileImage || userId?.avatar || userId?.image;
                
                if (profileImage) {
                  return (
                    <Link
                      key={href}
                      href={href}
                      className="flex items-center gap-3"
                      onClick={(e) => { setOpen(false); handleNavigation(href, e); }}
                      title="Profile"
                    >
                      <Image 
                        src={getValidImageSrc(profileImage)} 
                        alt="Profile" 
                        width={36} 
                        height={36} 
                        className="rounded-full object-cover border-2 border-white/20 w-9 h-9"
                        style={{ objectFit: 'cover', objectPosition: 'center' }}
                        onError={(e) => {
                          console.log("Image failed to load, using fallback");
                          e.target.src = "/logo2.png";
                        }}
                      />
                      <span className="text-white">{label}</span>
                    </Link>
                  );
                } else {
                  // Show default profile icon if no image
                  return (
                    <Link
                      key={href}
                      href={href}
                      className="flex items-center gap-3"
                      onClick={(e) => { setOpen(false); handleNavigation(href, e); }}
                      title="Profile"
                    >
                      <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center border-2 border-white/20 overflow-hidden">
                        <User className="text-white" size={18} />
                      </div>
                      <span className="text-white">{label}</span>
                    </Link>
                  );
                }
              }
              return (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center gap-3 ${
                    isActive ? "underline text-white" : "text-white hover:underline"
                  }`}
                  onClick={(e) => { setOpen(false); handleNavigation(href, e); }}
                >
                  <Icon className="text-white" size={20} />
                  <span className="text-white">{label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
    </>
  );
}
