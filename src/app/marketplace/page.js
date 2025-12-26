'use client';

import { useState } from 'react';

export default function Marketplace() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const products = [
    {
      id: 1,
      name: 'Premium BJJ Gi - Competition Grade',
      category: 'Apparel',
      price: '$189.99',
      originalPrice: '$249.99',
      rating: 4.8,
      reviews: 124,
      vendor: 'Elite Gear Co.',
      image: '/images/marketplace/imgi_1_search-image.png',
      badge: 'Best Seller',
      inStock: true
    },
    {
      id: 2,
      name: 'Professional Wrestling Shoes',
      category: 'Footwear',
      price: '$129.99',
      originalPrice: null,
      rating: 4.9,
      reviews: 89,
      vendor: 'Combat Sports Pro',
      image: '/images/marketplace/imgi_2_search-image.png',
      badge: 'New',
      inStock: true
    },
    {
      id: 3,
      name: 'Heavy Duty Grappling Dummy',
      category: 'Training Equipment',
      price: '$299.99',
      originalPrice: '$349.99',
      rating: 4.7,
      reviews: 67,
      vendor: 'Training Pro',
      image: '/images/marketplace/imgi_3_search-image.png',
      badge: 'Sale',
      inStock: true
    },
    {
      id: 4,
      name: 'MMA Training Gloves Set',
      category: 'Protective Gear',
      price: '$79.99',
      originalPrice: null,
      rating: 4.6,
      reviews: 156,
      vendor: 'Fight Gear Plus',
      image: '/images/marketplace/imgi_4_search-image.png',
      badge: null,
      inStock: true
    },
    {
      id: 5,
      name: 'Submission Grappling Shorts',
      category: 'Apparel',
      price: '$59.99',
      originalPrice: '$79.99',
      rating: 4.5,
      reviews: 203,
      vendor: 'Grappler Wear',
      image: '/images/marketplace/imgi_5_search-image.png',
      badge: 'Sale',
      inStock: false
    },
    {
      id: 6,
      name: 'Competition Knee Pads',
      category: 'Protective Gear',
      price: '$49.99',
      originalPrice: null,
      rating: 4.4,
      reviews: 78,
      vendor: 'Safety First Sports',
      image: '/images/marketplace/imgi_6_search-image.png',
      badge: null,
      inStock: true
    },
    {
      id: 7,
      name: 'Judo Belt Set - All Ranks',
      category: 'Accessories',
      price: '$39.99',
      originalPrice: null,
      rating: 4.7,
      reviews: 92,
      vendor: 'Traditional Arts Supply',
      image: '/images/marketplace/imgi_7_search-image.png',
      badge: 'Popular',
      inStock: true
    },
    {
      id: 8,
      name: 'Portable Training Mats',
      category: 'Training Equipment',
      price: '$199.99',
      originalPrice: '$249.99',
      rating: 4.8,
      reviews: 45,
      vendor: 'Mat Masters',
      image: '/images/marketplace/imgi_8_search-image.png',
      badge: 'Sale',
      inStock: true
    }
  ];

  const categories = ['all', 'Apparel', 'Footwear', 'Training Equipment', 'Protective Gear', 'Accessories'];

  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         product.vendor.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-slate-900 to-slate-700 text-white py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-6">Grappling Marketplace</h1>
            <p className="text-xl mb-8 text-slate-200">
              Discover premium gear and equipment from trusted vendors worldwide
            </p>
            <div className="flex flex-col md:flex-row gap-4 max-w-2xl mx-auto">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Search products, brands, or vendors..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-6 py-4 rounded-lg text-slate-900 text-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <button className="bg-teal-600 hover:bg-teal-700 px-8 py-4 rounded-lg font-semibold transition-colors whitespace-nowrap">
                Search Products
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Category Filters */}
      <section className="py-8 bg-slate-50">
        <div className="container mx-auto px-6">
          <div className="flex flex-wrap gap-3 justify-center">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-3 rounded-full font-medium transition-colors whitespace-nowrap ${
                  selectedCategory === category
                    ? 'bg-teal-600 text-white'
                    : 'bg-white text-slate-700 hover:bg-slate-100'
                }`}
              >
                {category === 'all' ? 'All Categories' : category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <div key={product.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                <div className="relative">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-64 object-cover object-top"
                  />
                  {product.badge && (
                    <div className={`absolute top-4 left-4 px-3 py-1 rounded-full text-sm font-semibold ${
                      product.badge === 'Sale' ? 'bg-red-500 text-white' :
                      product.badge === 'New' ? 'bg-green-500 text-white' :
                      product.badge === 'Best Seller' ? 'bg-blue-500 text-white' :
                      'bg-yellow-500 text-black'
                    }`}>
                      {product.badge}
                    </div>
                  )}
                  {!product.inStock && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                      <span className="bg-white text-slate-900 px-4 py-2 rounded-lg font-semibold">
                        Out of Stock
                      </span>
                    </div>
                  )}
                </div>
                
                <div className="p-4">
                  <h3 className="text-lg font-bold text-slate-900 mb-2 line-clamp-2">{product.name}</h3>
                  <p className="text-teal-600 text-sm font-medium mb-2">{product.vendor}</p>
                  
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex items-center gap-1">
                      <i className="ri-star-fill text-yellow-500 text-sm"></i>
                      <span className="text-sm font-semibold">{product.rating}</span>
                    </div>
                    <span className="text-sm text-slate-600">({product.reviews} reviews)</span>
                  </div>

                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-xl font-bold text-slate-900">{product.price}</span>
                    {product.originalPrice && (
                      <span className="text-sm text-slate-500 line-through">{product.originalPrice}</span>
                    )}
                  </div>

                  <button 
                    className={`w-full py-3 px-4 rounded-lg font-semibold transition-colors whitespace-nowrap ${
                      product.inStock 
                        ? 'bg-teal-600 hover:bg-teal-700 text-white' 
                        : 'bg-slate-300 text-slate-500 cursor-not-allowed'
                    }`}
                    disabled={!product.inStock}
                  >
                    {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Vendor CTA Section */}
      <section className="py-16 bg-slate-900 text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-4">Are You a Vendor?</h2>
          <p className="text-xl text-slate-300 mb-8">
            Join our marketplace and reach thousands of grapplers worldwide
          </p>
          <button className="bg-teal-600 hover:bg-teal-700 px-8 py-4 rounded-lg font-semibold text-lg transition-colors whitespace-nowrap">
            Become a Vendor
          </button>
        </div>
      </section>
    </div>
  );
}

