'use client';

import { useState } from 'react';

export default function VendorDashboard() {
  const [activeTab, setActiveTab] = useState('products');
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [showPromotionModal, setShowPromotionModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [promotionType, setPromotionType] = useState('featured');
  const [promotionDuration, setPromotionDuration] = useState(7);

  const vendorData = {
    name: 'GrappleGear Pro',
    category: 'Training Equipment',
    rating: 4.7,
    totalReviews: 189,
    totalProducts: 45,
    activeProducts: 42,
    totalOrders: 523,
    monthlyRevenue: 15800,
    subscriptionPlan: 'Business',
    subscriptionExpiry: '2024-10-30',
  };

  const performanceMetrics = {
    customerSatisfaction: 95,
    orderFulfillment: 98,
    responseTime: 92,
    productQuality: 96,
  };

  const recentOrders = [
    {
      id: 1,
      orderNumber: 'ORD-2024-1234',
      customer: 'John Anderson',
      product: 'Premium BJJ Gi',
      amount: 149,
      date: '2024-02-14',
      status: 'Shipped',
    },
    {
      id: 2,
      orderNumber: 'ORD-2024-1235',
      customer: 'Sarah Mitchell',
      product: 'Grappling Dummy',
      amount: 299,
      date: '2024-02-14',
      status: 'Processing',
    },
    {
      id: 3,
      orderNumber: 'ORD-2024-1236',
      customer: 'Mike Johnson',
      product: 'Rashguard Set',
      amount: 89,
      date: '2024-02-13',
      status: 'Delivered',
    },
  ];

  const topProducts = [
    {
      id: 1,
      name: 'Premium BJJ Gi',
      category: 'Apparel',
      price: 149,
      sold: 87,
      revenue: 12963,
      rating: 4.8,
      stock: 45,
    },
    {
      id: 2,
      name: 'Grappling Dummy',
      category: 'Equipment',
      price: 299,
      sold: 34,
      revenue: 10166,
      rating: 4.9,
      stock: 12,
    },
    {
      id: 3,
      name: 'Rashguard Set',
      category: 'Apparel',
      price: 89,
      sold: 156,
      revenue: 13884,
      rating: 4.6,
      stock: 78,
    },
  ];

  const promotedProducts = [
    {
      id: 1,
      title: 'Premium Training Equipment Bundle - PROMOTED',
      product: 'Premium BJJ Gi + Grappling Dummy',
      startDate: '2024-02-10',
      endDate: '2024-03-10',
      budget: 750,
      impressions: 18900,
      clicks: 1240,
      sales: 156,
      revenue: 23244,
      status: 'Active',
      thumbnail: 'https://readdy.ai/api/search-image?query=premium%20martial%20arts%20training%20equipment%20bundle%20with%20grappling%20gear%20on%20clean%20white%20background%20professional%20product%20photography&width=400&height=225&seq=vendorsponsor1&orientation=landscape'
    }
  ];

  const handleManageSubscription = () => {
    alert(
      'Subscription management will be integrated with Stripe. Please connect Stripe to enable this feature.'
    );
  };

  const promotionPrices = {
    featured: 49,
    banner: 99,
    sponsored: 29
  };

  const calculatePromotionCost = () => {
    const weeklyPrice = promotionPrices[promotionType] || 0;
    const weeks = promotionDuration / 7;
    return weeklyPrice * weeks;
  };

  const handlePromoteProduct = () => {
    if (!selectedProduct) {
      alert('Please select a product to promote');
      return;
    }
    
    console.log({
      productId: selectedProduct,
      type: promotionType,
      duration: promotionDuration,
      cost: calculatePromotionCost()
    });
    
    alert('Promotion started successfully!');
    setShowPromotionModal(false);
    setSelectedProduct('');
    setPromotionType('featured');
    setPromotionDuration(7);
  };

  const products = [
    {
      id: 1,
      name: 'Premium BJJ Gi - White',
      category: 'Apparel',
      price: 149.99,
      stock: 45,
      sales: 127,
      revenue: 19048.73,
      image: 'https://readdy.ai/api/search-image?query=premium%20white%20brazilian%20jiu%20jitsu%20gi%20kimono%20on%20simple%20clean%20white%20background%20professional%20product%20photography%20high%20quality%20martial%20arts%20uniform&width=400&height=400&seq=vd1&orientation=squarish',
      status: 'active'
    },
    {
      id: 2,
      name: 'MMA Training Gloves',
      category: 'Equipment',
      price: 79.99,
      stock: 32,
      sales: 89,
      revenue: 7119.11,
      image: 'https://readdy.ai/api/search-image?query=professional%20mma%20training%20gloves%20black%20red%20on%20simple%20clean%20white%20background%20product%20photography%20high%20quality%20mixed%20martial%20arts%20equipment&width=400&height=400&seq=vd2&orientation=squarish',
      status: 'active'
    },
    {
      id: 3,
      name: 'Boxing Hand Wraps Set',
      category: 'Accessories',
      price: 24.99,
      stock: 156,
      sales: 234,
      revenue: 5847.66,
      image: 'https://readdy.ai/api/search-image?query=boxing%20hand%20wraps%20set%20black%20on%20simple%20clean%20white%20background%20product%20photography%20high%20quality%20martial%20arts%20accessories&width=400&height=400&seq=vd3&orientation=squarish',
      status: 'active'
    },
    {
      id: 4,
      name: 'Muay Thai Shin Guards',
      category: 'Protection',
      price: 89.99,
      stock: 28,
      sales: 67,
      revenue: 6029.33,
      image: 'https://readdy.ai/api/search-image?query=muay%20thai%20shin%20guards%20black%20on%20simple%20clean%20white%20background%20product%20photography%20high%20quality%20martial%20arts%20protection%20equipment&width=400&height=400&seq=vd4&orientation=squarish',
      status: 'active'
    },
    {
      id: 5,
      name: 'Karate Belt - Black',
      category: 'Accessories',
      price: 19.99,
      stock: 89,
      sales: 156,
      revenue: 3118.44,
      image: 'https://readdy.ai/api/search-image?query=black%20karate%20belt%20on%20simple%20clean%20white%20background%20product%20photography%20high%20quality%20martial%20arts%20accessory&width=400&height=400&seq=vd5&orientation=squarish',
      status: 'low-stock'
    },
    {
      id: 6,
      name: 'Judo Gi - Blue',
      category: 'Apparel',
      price: 129.99,
      stock: 0,
      sales: 43,
      revenue: 5589.57,
      image: 'https://readdy.ai/api/search-image?query=blue%20judo%20gi%20kimono%20on%20simple%20clean%20white%20background%20professional%20product%20photography%20high%20quality%20martial%20arts%20uniform&width=400&height=400&seq=vd6&orientation=squarish',
      status: 'out-of-stock'
    }
  ];

  const renderPromotionsTab = () => (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Product Promotions</h1>
        <button 
          onClick={() => setShowPromotionModal(true)}
          className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors whitespace-nowrap flex items-center gap-2 cursor-pointer"
        >
          <i className="ri-megaphone-line text-xl"></i>
          Promote Product
        </button>
      </div>

      {/* ... existing promotions content ... */}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">

      <div className="bg-gradient-to-r from-slate-900 to-slate-700 text-white py-10 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 lg:gap-10">
            <div className="flex items-center gap-4 sm:gap-6">
              <div className="w-20 h-20 sm:w-24 sm:h-24 bg-teal-600 rounded-full flex items-center justify-center text-3xl sm:text-4xl font-bold">
                {vendorData.name.split(' ').map((n) => n[0]).join('')}
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold mb-1 sm:mb-2">{vendorData.name}</h1>
                <p className="text-slate-200 mb-1 text-sm sm:text-base">{vendorData.category}</p>
                <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm">
                  <span className="flex items-center gap-1 whitespace-nowrap">
                    <i className="ri-star-fill text-yellow-400"></i>
                    {vendorData.rating} ({vendorData.totalReviews} reviews)
                  </span>
                  <span className="whitespace-nowrap">{vendorData.totalProducts} Products</span>
                  <span className="whitespace-nowrap">{vendorData.totalOrders} Orders</span>
                </div>
              </div>
            </div>
            <div className="text-left lg:text-right w-full lg:w-auto">
              <div className="bg-white/10 rounded-lg px-4 py-3 sm:px-6 mb-2 inline-block">
                <div className="text-xs sm:text-sm text-slate-300">Subscription Status</div>
                <div className="text-lg sm:text-xl font-bold text-green-400">
                  Active - {vendorData.subscriptionPlan}
                </div>
              </div>
              <button
                onClick={handleManageSubscription}
                className="text-xs sm:text-sm text-teal-300 hover:text-teal-200 whitespace-nowrap"
              >
                Manage Subscription
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-2">
              <i className="ri-shopping-bag-line text-2xl text-teal-600"></i>
              <span className="text-sm text-slate-600">Active Products</span>
            </div>
            <div className="text-3xl font-bold text-slate-900">{vendorData.activeProducts}</div>
            <div className="text-sm text-green-600 mt-1">+3 this month</div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-2">
              <i className="ri-shopping-cart-line text-2xl text-blue-600"></i>
              <span className="text-sm text-slate-600">Total Orders</span>
            </div>
            <div className="text-3xl font-bold text-slate-900">{vendorData.totalOrders}</div>
            <div className="text-sm text-green-600 mt-1">+28 this week</div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-2">
              <i className="ri-money-dollar-circle-line text-2xl text-green-600"></i>
              <span className="text-sm text-slate-600">Monthly Revenue</span>
            </div>
            <div className="text-3xl font-bold text-slate-900">
              ${vendorData.monthlyRevenue.toLocaleString()}
            </div>
            <div className="text-sm text-green-600 mt-1">+22% vs last month</div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-2">
              <i className="ri-star-line text-2xl text-yellow-600"></i>
              <span className="text-sm text-slate-600">Average Rating</span>
            </div>
            <div className="text-3xl font-bold text-slate-900">{vendorData.rating}</div>
            <div className="text-sm text-slate-600 mt-1">{vendorData.totalReviews} reviews</div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-2">
              <i className="ri-megaphone-line text-2xl text-purple-600"></i>
              <span className="text-sm text-slate-600">Promotions</span>
            </div>
            <div className="text-3xl font-bold text-slate-900">{promotedProducts.filter(p => p.status === 'Active').length}</div>
            <div className="text-sm text-purple-600 mt-1">Active campaigns</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-lg mb-8">
          <div className="border-b border-slate-200 overflow-x-auto">
            <div className="flex gap-1 p-1 min-w-max sm:min-w-0">
              {['overview', 'products', 'orders', 'promotions', 'performance', 'settings'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-3 sm:px-4 md:px-6 py-2 sm:py-3 rounded-lg text-sm sm:text-base font-medium transition-colors whitespace-nowrap ${
                    activeTab === tab ? 'bg-teal-600 text-white' : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className="p-6">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-4">Recent Orders</h3>
                  <div className="space-y-4">
                    {recentOrders.map((order) => (
                      <div
                        key={order.id}
                        className="bg-slate-50 rounded-lg p-4 flex items-center justify-between"
                      >
                        <div>
                          <h4 className="font-semibold text-slate-900">{order.orderNumber}</h4>
                          <p className="text-sm text-slate-600">
                            {order.customer} • {order.product}
                          </p>
                          <p className="text-sm text-slate-600">{order.date}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-green-600 text-lg">${order.amount}</p>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              order.status === 'Delivered'
                                ? 'bg-green-100 text-green-700'
                                : order.status === 'Shipped'
                                ? 'bg-blue-100 text-blue-700'
                                : 'bg-yellow-100 text-yellow-700'
                            }`}
                          >
                            {order.status}
                          </span>
                        </div>
                        <button className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors whitespace-nowrap">
                          View Details
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-4">Top Selling Products</h3>
                  <div className="grid grid-cols-3 gap-6">
                    {topProducts.slice(0, 3).map((product) => (
                      <div key={product.id} className="bg-slate-50 rounded-lg p-4">
                        <h4 className="font-semibold text-slate-900 mb-2">{product.name}</h4>
                        <div className="space-y-1 text-sm">
                          <div className="flex justify-between">
                            <span className="text-slate-600">Sold:</span>
                            <span className="font-semibold text-slate-900">{product.sold} units</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-600">Revenue:</span>
                            <span className="font-semibold text-green-600">
                              ${product.revenue.toLocaleString()}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-600">Rating:</span>
                            <span className="font-semibold text-slate-900">
                              <i className="ri-star-fill text-yellow-500"></i> {product.rating}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Products Tab */}
            {activeTab === 'products' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-slate-900">All Products</h3>
                  <button className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors whitespace-nowrap">
                    <i className="ri-add-line mr-2"></i>
                    Add New Product
                  </button>
                </div>
                <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[640px]">
                    <thead className="bg-slate-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">
                          Product
                        </th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">
                          Category
                        </th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">
                          Price
                        </th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">
                          Sold
                        </th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">
                          Stock
                        </th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">
                          Rating
                        </th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {topProducts.map((product) => (
                        <tr key={product.id}>
                          <td className="px-6 py-4 text-sm font-semibold text-slate-900">
                            {product.name}
                          </td>
                          <td className="px-6 py-4 text-sm text-slate-600">{product.category}</td>
                          <td className="px-6 py-4 text-sm font-semibold text-slate-900">
                            ${product.price}
                          </td>
                          <td className="px-6 py-4 text-sm text-slate-900">{product.sold}</td>
                          <td className="px-6 py-4 text-sm text-slate-900">{product.stock}</td>
                          <td className="px-6 py-4 text-sm">
                            <i className="ri-star-fill text-yellow-500"></i> {product.rating}
                          </td>
                          <td className="px-6 py-4">
                            <button className="text-teal-600 hover:text-teal-700 text-sm font-semibold whitespace-nowrap">
                              Edit
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  </div>
                </div>
              </div>
            )}

            {/* Orders Tab */}
            {activeTab === 'orders' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-slate-900">Order Management</h3>
                  <div className="flex gap-2">
                    <select className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 pr-8">
                      <option>All Orders</option>
                      <option>Processing</option>
                      <option>Shipped</option>
                      <option>Delivered</option>
                    </select>
                    <button className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors whitespace-nowrap">
                      <i className="ri-download-line mr-2"></i>
                      Export
                    </button>
                  </div>
                </div>
                <div className="space-y-4">
                  {recentOrders.map((order) => (
                    <div key={order.id} className="bg-slate-50 rounded-lg p-6">
                      <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-4">
                        <div>
                          <h4 className="text-lg font-bold text-slate-900">{order.orderNumber}</h4>
                          <p className="text-slate-600">Customer: {order.customer}</p>
                        </div>
                        <span
                          className={`px-4 py-2 rounded-full text-sm font-semibold ${
                            order.status === 'Delivered'
                              ? 'bg-green-100 text-green-700'
                              : order.status === 'Shipped'
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-yellow-100 text-yellow-700'
                          }`}
                        >
                          {order.status}
                        </span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                        <div>
                          <div className="text-sm text-slate-600">Product</div>
                          <div className="font-semibold text-slate-900">{order.product}</div>
                        </div>
                        <div>
                          <div className="text-sm text-slate-600">Order Date</div>
                          <div className="font-semibold text-slate-900">{order.date}</div>
                        </div>
                        <div>
                          <div className="text-sm text-slate-600">Amount</div>
                          <div className="font-semibold text-green-600">${order.amount}</div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors whitespace-nowrap">
                          Update Status
                        </button>
                        <button className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors whitespace-nowrap">
                          View Details
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Promotions Tab */}
            {activeTab === 'promotions' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-slate-900">Product Promotions</h3>
                  <button 
                    onClick={() => setShowPromotionModal(true)}
                    className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors whitespace-nowrap flex items-center gap-2 cursor-pointer"
                  >
                    <i className="ri-megaphone-line text-xl"></i>
                    Promote Product
                  </button>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <div className="flex items-start gap-3">
                    <i className="ri-information-line text-blue-600 text-xl flex-shrink-0"></i>
                    <div>
                      <p className="text-sm text-blue-900 font-medium mb-1">Boost Your Sales</p>
                      <p className="text-sm text-blue-700">
                        Promote your products to increase visibility in the marketplace. Featured products appear at the top of search results and category pages, driving more traffic and sales.
                      </p>
                    </div>
                  </div>
                </div>

                {promotedProducts.length > 0 ? (
                  <>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-6">
                      <div className="bg-slate-50 rounded-lg p-4">
                        <div className="text-sm text-slate-600 mb-1">Total Investment</div>
                        <div className="text-2xl font-bold text-slate-900">
                          ${promotedProducts.reduce((sum, p) => sum + p.budget, 0).toLocaleString()}
                        </div>
                      </div>
                      <div className="bg-slate-50 rounded-lg p-4">
                        <div className="text-sm text-slate-600 mb-1">Total Impressions</div>
                        <div className="text-2xl font-bold text-blue-600">
                          {promotedProducts.reduce((sum, p) => sum + p.impressions, 0).toLocaleString()}
                        </div>
                      </div>
                      <div className="bg-slate-50 rounded-lg p-4">
                        <div className="text-sm text-slate-600 mb-1">Total Clicks</div>
                        <div className="text-2xl font-bold text-purple-600">
                          {promotedProducts.reduce((sum, p) => sum + p.clicks, 0).toLocaleString()}
                        </div>
                      </div>
                      <div className="bg-slate-50 rounded-lg p-4">
                        <div className="text-sm text-slate-600 mb-1">Sales from Ads</div>
                        <div className="text-2xl font-bold text-green-600">
                          {promotedProducts.reduce((sum, p) => sum + p.sales, 0)}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {promotedProducts.map((product) => (
                        <div key={product.id} className="bg-white border-2 border-purple-200 rounded-xl overflow-hidden">
                          <div className="flex gap-6 p-6">
                            <div className="relative">
                              <img 
                                src={product.thumbnail} 
                                alt={product.title}
                                className="w-64 h-36 object-cover object-top rounded-lg flex-shrink-0"
                              />
                              <div className="absolute top-2 left-2 bg-purple-600 text-white px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1">
                                <i className="ri-megaphone-fill"></i>
                                PROMOTED
                              </div>
                            </div>
                            <div className="flex-1">
                              <div className="flex items-start justify-between mb-3">
                                <div>
                                  <h4 className="font-bold text-slate-900 text-lg mb-1">{product.title}</h4>
                                  <p className="text-sm text-slate-600">Campaign: {product.startDate} - {product.endDate}</p>
                                </div>
                                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium whitespace-nowrap">
                                  {product.status}
                                </span>
                              </div>

                              <div className="grid grid-cols-4 gap-4 mb-4">
                                <div>
                                  <span className="text-xs text-slate-600">Budget</span>
                                  <p className="font-semibold text-green-600 text-sm">${product.budget}</p>
                                </div>
                                <div>
                                  <span className="text-xs text-slate-600">Impressions</span>
                                  <p className="font-semibold text-blue-600 text-sm">{product.impressions.toLocaleString()}</p>
                                </div>
                                <div>
                                  <span className="text-xs text-slate-600">Clicks</span>
                                  <p className="font-semibold text-purple-600 text-sm">{product.clicks}</p>
                                </div>
                                <div>
                                  <span className="text-xs text-slate-600">CTR</span>
                                  <p className="font-semibold text-slate-900 text-sm">
                                    {((product.clicks / product.impressions) * 100).toFixed(2)}%
                                  </p>
                                </div>
                              </div>

                              <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                                <div className="flex items-center justify-between">
                                  <div>
                                    <div className="text-xs text-green-700 mb-1">Sales from Campaign</div>
                                    <div className="text-2xl font-bold text-green-600">{product.sales}</div>
                                  </div>
                                  <div className="text-right">
                                    <div className="text-xs text-green-700 mb-1">Revenue Generated</div>
                                    <div className="text-lg font-bold text-green-600">
                                      ${product.revenue.toLocaleString()}
                                    </div>
                                  </div>
                                  <div className="text-right">
                                    <div className="text-xs text-green-700 mb-1">ROAS</div>
                                    <div className="text-lg font-bold text-green-600">
                                      {(product.revenue / product.budget).toFixed(2)}x
                                    </div>
                                  </div>
                                  <div className="text-right">
                                    <div className="text-xs text-green-700 mb-1">Profit</div>
                                    <div className="text-lg font-bold text-green-600">
                                      ${(product.revenue - product.budget).toLocaleString()}
                                    </div>
                                  </div>
                                </div>
                              </div>

                              <div className="flex gap-2">
                                <button className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors whitespace-nowrap text-sm">
                                  <i className="ri-bar-chart-line mr-1"></i>View Analytics
                                </button>
                                <button className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors whitespace-nowrap text-sm">
                                  <i className="ri-edit-line mr-1"></i>Edit Campaign
                                </button>
                                <button className="px-4 py-2 border border-orange-300 text-orange-600 rounded-lg hover:bg-orange-50 transition-colors whitespace-nowrap text-sm">
                                  <i className="ri-pause-circle-line mr-1"></i>Pause
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="text-center py-12">
                    <i className="ri-megaphone-line text-6xl text-slate-300 mb-4"></i>
                    <h4 className="text-xl font-bold text-slate-900 mb-2">No Active Promotions</h4>
                    <p className="text-slate-600 mb-6">Start promoting your products to increase sales</p>
                    <button className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors whitespace-nowrap">
                      Create Your First Promotion
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Performance Tab */}
            {activeTab === 'performance' && (
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-slate-900">Vendor Performance</h3>
                {Object.entries(performanceMetrics).map(([key, value]) => (
                  <div key={key}>
                    <div className="flex justify-between mb-2">
                      <span className="font-semibold text-slate-900 capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </span>
                      <span className="font-bold text-teal-600">{value}%</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-3">
                      <div
                        className="bg-teal-600 h-3 rounded-full transition-all"
                        style={{ width: `${value}%` }}
                      />
                    </div>
                  </div>
                ))}

                <div className="bg-slate-50 rounded-lg p-6 mt-8">
                  <h4 className="font-semibold text-slate-900 mb-4">Performance Insights</h4>
                  <ul className="space-y-3 text-sm text-slate-700">
                    <li className="flex items-start gap-2">
                      <i className="ri-trophy-line text-yellow-500 mt-1"></i>
                      <span>Top-rated vendor in Training Equipment category</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <i className="ri-arrow-up-line text-green-500 mt-1"></i>
                      <span>Sales increased by 22% compared to last month</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <i className="ri-star-line text-yellow-500 mt-1"></i>
                      <span>Maintained 4.7+ rating for 8 consecutive months</span>
                    </li>
                  </ul>
                </div>
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-4">Store Settings</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-slate-900 mb-2">
                        Store Name
                      </label>
                      <input
                        type="text"
                        defaultValue={vendorData.name}
                        className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-900 mb-2">
                        Category
                      </label>
                      <select className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500 pr-8">
                        <option>Training Equipment</option>
                        <option>Apparel</option>
                        <option>Nutrition</option>
                        <option>Accessories</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-900 mb-2">
                        Store Description
                      </label>
                      <textarea
                        rows={4}
                        maxLength={500}
                        defaultValue="Premium grappling equipment and apparel for serious athletes."
                        className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-4">Subscription</h3>
                  <div className="bg-slate-50 rounded-lg p-6">
                    <div className="flex justify-between items-center mb-4">
                      <div>
                        <h4 className="font-semibold text-slate-900">
                          Current Plan: {vendorData.subscriptionPlan}
                        </h4>
                        <p className="text-sm text-slate-600">
                          Renews on {vendorData.subscriptionExpiry}
                        </p>
                      </div>
                      <span className="px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
                        Active
                      </span>
                    </div>
                    <button
                      onClick={handleManageSubscription}
                      className="w-full bg-teal-600 hover:bg-teal-700 text-white py-3 px-6 rounded-lg font-semibold transition-colors whitespace-nowrap"
                    >
                      Manage Subscription
                    </button>
                  </div>
                </div>

                <button className="w-full bg-slate-900 hover:bg-slate-800 text-white py-3 px-6 rounded-lg font-semibold transition-colors whitespace-nowrap">
                  Save Changes
                </button>
              </div>
            )}

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
              <div className="flex gap-4">
                <button 
                  onClick={() => setShowPromotionModal(true)}
                  className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors whitespace-nowrap flex items-center gap-2 cursor-pointer"
                >
                  <i className="ri-megaphone-line text-xl"></i>
                  Promote Product
                </button>
                <button className="px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors whitespace-nowrap flex items-center gap-2 cursor-pointer">
                  <i className="ri-add-line text-xl"></i>
                  Add New Product
                </button>
                <button className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors whitespace-nowrap flex items-center gap-2 cursor-pointer">
                  <i className="ri-file-list-line text-xl"></i>
                  View All Orders
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Promotion Modal */}
      {showPromotionModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white">
              <h3 className="text-2xl font-bold text-gray-900">Promote Your Product</h3>
              <button
                onClick={() => setShowPromotionModal(false)}
                className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors"
              >
                <i className="ri-close-line text-2xl"></i>
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Select Product */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Select Product
                </label>
                <select
                  value={selectedProduct}
                  onChange={(e) => setSelectedProduct(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="">Choose a product...</option>
                  {products
                    .filter(p => p.status === 'active')
                    .map(product => (
                      <option key={product.id} value={product.id}>
                        {product.name} - ${product.price}
                      </option>
                    ))}
                </select>
              </div>

              {/* Promotion Type */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Promotion Type
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <button
                    onClick={() => setPromotionType('featured')}
                    className={`p-4 border-2 rounded-lg transition-all ${
                      promotionType === 'featured'
                        ? 'border-purple-600 bg-purple-50'
                        : 'border-gray-200 hover:border-purple-300'
                    }`}
                  >
                    <div className="w-12 h-12 flex items-center justify-center bg-purple-100 rounded-lg mx-auto mb-3">
                      <i className="ri-star-line text-2xl text-purple-600"></i>
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-1">Featured</h4>
                    <p className="text-sm text-gray-600 mb-2">Top placement on marketplace</p>
                    <p className="text-lg font-bold text-purple-600">$49/week</p>
                  </button>

                  <button
                    onClick={() => setPromotionType('banner')}
                    className={`p-4 border-2 rounded-lg transition-all ${
                      promotionType === 'banner'
                        ? 'border-purple-600 bg-purple-50'
                        : 'border-gray-200 hover:border-purple-300'
                    }`}
                  >
                    <div className="w-12 h-12 flex items-center justify-center bg-purple-100 rounded-lg mx-auto mb-3">
                      <i className="ri-layout-line text-2xl text-purple-600"></i>
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-1">Banner Ad</h4>
                    <p className="text-sm text-gray-600 mb-2">Homepage banner display</p>
                    <p className="text-lg font-bold text-purple-600">$99/week</p>
                  </button>

                  <button
                    onClick={() => setPromotionType('sponsored')}
                    className={`p-4 border-2 rounded-lg transition-all ${
                      promotionType === 'sponsored'
                        ? 'border-purple-600 bg-purple-50'
                        : 'border-gray-200 hover:border-purple-300'
                    }`}
                  >
                    <div className="w-12 h-12 flex items-center justify-center bg-purple-100 rounded-lg mx-auto mb-3">
                      <i className="ri-rocket-line text-2xl text-purple-600"></i>
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-1">Sponsored</h4>
                    <p className="text-sm text-gray-600 mb-2">Appears in search results</p>
                    <p className="text-lg font-bold text-purple-600">$29/week</p>
                  </button>
                </div>
              </div>

              {/* Duration */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Duration
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[7, 14, 30, 60].map(days => (
                    <button
                      key={days}
                      onClick={() => setPromotionDuration(days)}
                      className={`py-3 px-4 border-2 rounded-lg font-semibold transition-all whitespace-nowrap ${
                        promotionDuration === days
                          ? 'border-purple-600 bg-purple-50 text-purple-600'
                          : 'border-gray-200 text-gray-700 hover:border-purple-300'
                      }`}
                    >
                      {days} Days
                    </button>
                  ))}
                </div>
              </div>

              {/* Cost Summary */}
              <div className="bg-purple-50 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-gray-700 font-medium">Promotion Type:</span>
                  <span className="text-gray-900 font-semibold capitalize">{promotionType}</span>
                </div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-gray-700 font-medium">Duration:</span>
                  <span className="text-gray-900 font-semibold">{promotionDuration} Days</span>
                </div>
                <div className="pt-4 border-t border-purple-200 flex items-center justify-between">
                  <span className="text-lg font-bold text-gray-900">Total Cost:</span>
                  <span className="text-2xl font-bold text-purple-600">${calculatePromotionCost()}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowPromotionModal(false)}
                  className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold whitespace-nowrap"
                >
                  Cancel
                </button>
                <button
                  onClick={handlePromoteProduct}
                  className="flex-1 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-semibold whitespace-nowrap"
                >
                  Start Promotion
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
