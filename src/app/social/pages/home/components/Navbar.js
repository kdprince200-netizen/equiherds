"use client";

import { useState, useEffect } from 'react';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <nav className={`fixed top-16 left-0 right-0 z-30 transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-md' : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-teal-600 rounded-full flex items-center justify-center">
                <i className="ri-horse-line text-white text-xl"></i>
              </div>
              <span className={`text-xl font-bold ${isScrolled ? 'text-gray-900' : 'text-white'}`}>
                EquiHerds
              </span>
            </div>

            <div className="flex items-center gap-4">
              <button 
                onClick={() => setShowJoinModal(true)}
                className="bg-teal-600 text-white px-6 py-2.5 rounded-full hover:bg-teal-700 transition-colors text-sm font-medium whitespace-nowrap"
              >
                Join Now
              </button>
            </div>
          </div>
        </div>
      </nav>

      {showJoinModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowJoinModal(false)}>
          <div className="bg-white rounded-2xl max-w-md w-full p-8 relative" onClick={(e) => e.stopPropagation()}>
            <button 
              onClick={() => setShowJoinModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors w-8 h-8 flex items-center justify-center"
            >
              <i className="ri-close-line text-2xl"></i>
            </button>

            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="ri-user-add-line text-3xl text-teal-600"></i>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Join EquiHerds</h3>
              <p className="text-gray-600 text-sm">Connect with fellow equestrians and share your passion</p>
            </div>

            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
              <div>
                <input 
                  type="text"
                  placeholder="Full Name"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
                  required
                />
              </div>
              <div>
                <input 
                  type="email"
                  placeholder="Email Address"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
                  required
                />
              </div>
              <div>
                <input 
                  type="password"
                  placeholder="Password"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
                  required
                />
              </div>
              <div>
                <input 
                  type="password"
                  placeholder="Confirm Password"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
                  required
                />
              </div>
              <div className="flex items-start gap-2">
                <input 
                  type="checkbox"
                  id="terms"
                  className="mt-1 w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
                  required
                />
                <label htmlFor="terms" className="text-xs text-gray-600">
                  I agree to the Terms of Service and Privacy Policy
                </label>
              </div>
              <button 
                type="submit"
                className="w-full bg-teal-600 text-white py-3 rounded-lg hover:bg-teal-700 transition-colors font-medium whitespace-nowrap"
              >
                Create Account
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{' '}
                <button className="text-teal-600 hover:text-teal-700 font-medium">
                  Sign In
                </button>
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

