"use client";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-emerald-50 to-teal-50 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <img 
                src="https://equiherds.com/wp-content/uploads/2024/12/cropped-Equiherds-Logo-1-192x192.png" 
                alt="EquiHerds Logo" 
                className="h-12 w-12"
              />
              <span className="text-2xl font-bold text-gray-900">EquiHerds</span>
            </div>
            <p className="text-gray-600 mb-6 max-w-md leading-relaxed">
              Join our passionate community of horse lovers from around the world. Share your stories, connect with fellow equestrians, and celebrate the incredible bond between humans and horses.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 bg-teal-600 rounded-full flex items-center justify-center text-white hover:bg-teal-700 transition-colors">
                <i className="ri-facebook-fill text-lg"></i>
              </a>
              <a href="#" className="w-10 h-10 bg-teal-600 rounded-full flex items-center justify-center text-white hover:bg-teal-700 transition-colors">
                <i className="ri-instagram-line text-lg"></i>
              </a>
              <a href="#" className="w-10 h-10 bg-teal-600 rounded-full flex items-center justify-center text-white hover:bg-teal-700 transition-colors">
                <i className="ri-twitter-fill text-lg"></i>
              </a>
              <a href="#" className="w-10 h-10 bg-teal-600 rounded-full flex items-center justify-center text-white hover:bg-teal-700 transition-colors">
                <i className="ri-youtube-fill text-lg"></i>
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-bold text-gray-900 mb-4 text-lg">Quick Links</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-gray-600 hover:text-teal-600 transition-colors text-sm">About Us</a></li>
              <li><a href="#" className="text-gray-600 hover:text-teal-600 transition-colors text-sm">Stories</a></li>
              <li><a href="#" className="text-gray-600 hover:text-teal-600 transition-colors text-sm">Community</a></li>
              <li><a href="#" className="text-gray-600 hover:text-teal-600 transition-colors text-sm">Events</a></li>
              <li><a href="#" className="text-gray-600 hover:text-teal-600 transition-colors text-sm">Contact</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-gray-900 mb-4 text-lg">Resources</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-gray-600 hover:text-teal-600 transition-colors text-sm">Blog</a></li>
              <li><a href="#" className="text-gray-600 hover:text-teal-600 transition-colors text-sm">Guides</a></li>
              <li><a href="#" className="text-gray-600 hover:text-teal-600 transition-colors text-sm">FAQ</a></li>
              <li><a href="#" className="text-gray-600 hover:text-teal-600 transition-colors text-sm">Privacy Policy</a></li>
              <li><a href="#" className="text-gray-600 hover:text-teal-600 transition-colors text-sm">Terms of Service</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-600 text-sm">
            © 2024 EquiHerds. All rights reserved.
          </p>
          <a 
            href="https://readdy.ai/?origin=logo" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-gray-600 hover:text-teal-600 transition-colors text-sm"
          >
            Powered by Readdy
          </a>
        </div>
      </div>
    </footer>
  );
}



