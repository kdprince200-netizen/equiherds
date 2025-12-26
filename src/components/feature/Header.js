'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import Button from '../base/Button';
import { getRequest } from '../../app/service';

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [isProfileHovered, setIsProfileHovered] = useState(false);

  useEffect(() => {
    // Check if user is logged in by checking for token in localStorage
    const checkAuth = async () => {
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('token');
        const loggedIn = !!token;
        setIsLoggedIn(loggedIn);
        
        // Fetch user data if logged in
        if (loggedIn) {
          try {
            const response = await getRequest('/api/auth/me');
            if (response.success && response.data) {
              setUser(response.data);
            } else {
              // Token might be invalid
              localStorage.removeItem('token');
              setIsLoggedIn(false);
              setUser(null);
            }
          } catch (error) {
            console.error('Error fetching user data:', error);
            // If token is invalid, clear it
            localStorage.removeItem('token');
            setIsLoggedIn(false);
            setUser(null);
          }
        } else {
          setUser(null);
        }
      }
    };

    checkAuth();
    
    // Listen for storage changes (e.g., when user logs in/out in another tab)
    if (typeof window !== 'undefined') {
      window.addEventListener('storage', checkAuth);
      // Listen for custom logout event
      window.addEventListener('userLogout', checkAuth);
      // Also check on window focus to catch same-tab login events
      window.addEventListener('focus', checkAuth);
      return () => {
        window.removeEventListener('storage', checkAuth);
        window.removeEventListener('userLogout', checkAuth);
        window.removeEventListener('focus', checkAuth);
      };
    }
  }, [pathname]); // Re-check when route changes

  const handleProfileClick = () => {
    // Redirect based on account type
    if (!user?.accountType) {
      router.push('/student-dashboard'); // default fallback
      return;
    }
    
    let redirectPath = '/student-dashboard'; // default
    
    switch (user.accountType) {
      case 'student':
        redirectPath = '/student-dashboard';
        break;
      case 'coach':
        redirectPath = '/coach-dashboard';
        break;
      case 'club':
        redirectPath = '/club-dashboard';
        break;
      case 'vendor':
        redirectPath = '/vendor-dashboard';
        break;
      case 'superAdmin':
        redirectPath = '/admin-dashboard';
        break;
      default:
        redirectPath = '/student-dashboard';
    }
    
    router.push(redirectPath);
  };

  const handleLogout = () => {
    // Clear token and user data
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setUser(null);
    setIsProfileHovered(false);
    
    // Dispatch logout event for other components
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('userLogout'));
    }
    
    // Redirect to login page
    router.push('/login');
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <span className="text-2xl font-bold text-blue-600" style={{ fontFamily: '"Pacifico", serif' }}>
              GrapplersHub
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/coaches" className="text-gray-700 hover:text-blue-600 cursor-pointer">
              Find Coaches
            </Link>
            <Link href="/clubs" className="text-gray-700 hover:text-blue-600 cursor-pointer">
              Find Clubs
            </Link>
            <Link href="/marketplace" className="text-gray-700 hover:text-blue-600 cursor-pointer">
              Marketplace
            </Link>
            <Link href="/podcasts" className="text-gray-700 hover:text-blue-600 cursor-pointer">
              Podcasts
            </Link>
            <Link href="/about" className="text-gray-700 hover:text-blue-600 cursor-pointer">
              About
            </Link>
            <Link href="/pricing" className="text-gray-700 hover:text-blue-600 cursor-pointer">
              Pricing
            </Link>
          </nav>

          {/* Auth Buttons / Profile Icon */}
          <div className="hidden md:flex items-center space-x-4">
            {!isLoggedIn ? (
              <>
                <Link href="/login">
                  <Button variant="outline" size="sm">
                    Sign In
                  </Button>
                </Link>
                <Link href="/register">
                  <Button size="sm">
                    Get Started
                  </Button>
                </Link>
              </>
            ) : (
              <div 
                className="relative"
                onMouseEnter={() => setIsProfileHovered(true)}
                onMouseLeave={() => setIsProfileHovered(false)}
              >
                <button
                  onClick={handleProfileClick}
                  className="relative w-10 h-10 rounded-full bg-blue-600 hover:bg-blue-700 flex items-center justify-center transition-colors cursor-pointer overflow-hidden z-10"
                  title="View Profile"
                >
                  {user?.profilePicture ? (
                    <img
                      src={user.profilePicture}
                      alt="Profile"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        // Fallback to icon if image fails to load
                        e.target.style.display = 'none';
                        const icon = e.target.parentElement.querySelector('.profile-icon');
                        if (icon) icon.style.display = 'block';
                      }}
                    />
                  ) : null}
                  <i 
                    className="ri-user-line text-white text-lg profile-icon"
                    style={{ display: user?.profilePicture ? 'none' : 'block' }}
                  ></i>
                </button>
                {/* Logout button on hover */}
                {isProfileHovered && (
                  <div className="absolute right-0 top-full z-50">
                    {/* Invisible bridge area to prevent hover gap - covers the gap between button and dropdown */}
                    <div className="absolute right-0 bottom-full w-full h-2"></div>
                    <div style={{ paddingTop: '8px' }}>
                      <button
                        onClick={handleLogout}
                        className="bg-white shadow-lg rounded-lg px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2 whitespace-nowrap border border-gray-200 transition-colors"
                        title="Logout"
                      >
                        <i className="ri-logout-box-line"></i>
                        <span>Logout</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-md text-gray-700 hover:text-blue-600 cursor-pointer"
          >
            <i className={`ri-${isMenuOpen ? 'close' : 'menu'}-line text-xl`}></i>
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col space-y-4">
              <Link href="/coaches" className="text-gray-700 hover:text-blue-600 cursor-pointer">
                Find Coaches
              </Link>
              <Link href="/clubs" className="text-gray-700 hover:text-blue-600 cursor-pointer">
                Find Clubs
              </Link>
              <Link href="/marketplace" className="text-gray-700 hover:text-blue-600 cursor-pointer">
                Marketplace
              </Link>
              <Link href="/podcasts" className="text-gray-700 hover:text-blue-600 cursor-pointer">
                Podcasts
              </Link>
              <Link href="/about" className="text-gray-700 hover:text-blue-600 cursor-pointer">
                About
              </Link>
              <Link href="/pricing" className="text-gray-700 hover:text-blue-600 cursor-pointer">
                Pricing
              </Link>
              <div className="flex flex-col space-y-2 pt-4">
                {!isLoggedIn ? (
                  <>
                    <Link href="/login">
                      <Button variant="outline" size="sm" className="w-full">
                        Sign In
                      </Button>
                    </Link>
                    <Link href="/register">
                      <Button size="sm" className="w-full">
                        Get Started
                      </Button>
                    </Link>
                  </>
                ) : (
                  <>
                    <button
                      onClick={handleProfileClick}
                      className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors cursor-pointer"
                    >
                      {user?.profilePicture ? (
                        <img
                          src={user.profilePicture}
                          alt="Profile"
                          className="w-6 h-6 rounded-full object-cover mr-2 border border-white"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            const icon = e.target.nextSibling;
                            if (icon) icon.style.display = 'inline-block';
                          }}
                        />
                      ) : null}
                      <i 
                        className="ri-user-line mr-2"
                        style={{ display: user?.profilePicture ? 'none' : 'inline-block' }}
                      ></i>
                      View Profile
                    </button>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center justify-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors cursor-pointer mt-2"
                    >
                      <i className="ri-logout-box-line mr-2"></i>
                      Logout
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

