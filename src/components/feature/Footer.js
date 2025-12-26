import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-2xl font-bold mb-4" style={{ fontFamily: '"Pacifico", serif' }}>
              GrapplersHub
            </h3>
            <p className="text-gray-300 mb-4 max-w-md">
              The ultimate platform connecting grapplers worldwide. Find coaches, join clubs, 
              access training resources, and connect with the global grappling community.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-white cursor-pointer">
                <i className="ri-facebook-fill text-xl"></i>
              </a>
              <a href="#" className="text-gray-300 hover:text-white cursor-pointer">
                <i className="ri-twitter-fill text-xl"></i>
              </a>
              <a href="#" className="text-gray-300 hover:text-white cursor-pointer">
                <i className="ri-instagram-fill text-xl"></i>
              </a>
              <a href="#" className="text-gray-300 hover:text-white cursor-pointer">
                <i className="ri-youtube-fill text-xl"></i>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Platform</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/coaches" className="text-gray-300 hover:text-white cursor-pointer">
                  Find Coaches
                </Link>
              </li>
              <li>
                <Link href="/clubs" className="text-gray-300 hover:text-white cursor-pointer">
                  Find Clubs
                </Link>
              </li>
              {/* <li>
                <Link href="/marketplace" className="text-gray-300 hover:text-white cursor-pointer">
                  Marketplace
                </Link>
              </li> */}
              {/* <li>
                <Link href="/live-classes" className="text-gray-300 hover:text-white cursor-pointer">
                  Live Classes
                </Link>
              </li> */}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Support</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/help" className="text-gray-300 hover:text-white cursor-pointer">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-300 hover:text-white cursor-pointer">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-gray-300 hover:text-white cursor-pointer">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-300 hover:text-white cursor-pointer">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-300 text-sm text-center w-full">
            © 2024 GrapplersHub. All rights reserved.
          </p>
          {/* <a 
            href="https://readdy.ai/?origin=logo" 
            className="text-gray-400 hover:text-white text-sm cursor-pointer mt-2 md:mt-0"
          >
            Powered by Readdy
          </a> */}
        </div>
      </div>
    </footer>
  );
}

