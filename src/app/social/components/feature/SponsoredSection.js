"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function SponsoredSection() {
  const [categoryItems, setCategoryItems] = useState({
    horses: [],
    equipment: [],
    otherServices: [],
    trainers: [],
    stables: []
  });
  const [currentCategory, setCurrentCategory] = useState('');
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Fetch sponsored items from API
  useEffect(() => {
    const fetchSponsoredItems = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/sponsored');
        if (!response.ok) throw new Error('Failed to fetch sponsored items');
        const data = await response.json();
        
        // Group items by category
        const grouped = {
          horses: (data.horses || []).map(item => ({ ...item, type: 'horse' })),
          equipment: (data.equipment || []).map(item => ({ ...item, type: 'equipment' })),
          otherServices: (data.otherServices || []).map(item => ({ ...item, type: 'otherService' })),
          trainers: (data.trainers || []).map(item => ({ ...item, type: 'trainer' })),
          stables: (data.stables || []).map(item => ({ ...item, type: 'stable' }))
        };
        
        setCategoryItems(grouped);
        
        // Set initial category (first non-empty category)
        const categories = ['horses', 'equipment', 'otherServices', 'trainers', 'stables'];
        const firstCategory = categories.find(cat => grouped[cat].length > 0);
        if (firstCategory) {
          setCurrentCategory(firstCategory);
          setCurrentCategoryIndex(0);
        }
      } catch (error) {
        console.error('Error fetching sponsored items:', error);
        setCategoryItems({
          horses: [],
          equipment: [],
          otherServices: [],
          trainers: [],
          stables: []
        });
      } finally {
        setLoading(false);
      }
    };

    fetchSponsoredItems();
  }, []);

  // Rotate items within current category, then move to next category
  useEffect(() => {
    if (!currentCategory) return;
    
    const currentItems = categoryItems[currentCategory];
    if (!currentItems || currentItems.length === 0) return;

    const interval = setInterval(() => {
      setCurrentCategoryIndex((prevIndex) => {
        // Get fresh category items
        const items = categoryItems[currentCategory];
        if (!items || items.length === 0) return prevIndex;
        
        const nextIndex = (prevIndex + 1) % items.length;
        
        // If we've completed all items in this category, move to next category
        if (nextIndex === 0 && items.length > 0) {
          const categories = ['horses', 'equipment', 'otherServices', 'trainers', 'stables'];
          const currentCatIndex = categories.indexOf(currentCategory);
          
          // Find next category with items
          for (let i = 1; i <= categories.length; i++) {
            const nextCategoryIndex = (currentCatIndex + i) % categories.length;
            const nextCategory = categories[nextCategoryIndex];
            const nextCategoryItems = categoryItems[nextCategory];
            
            if (nextCategoryItems && nextCategoryItems.length > 0) {
              setCurrentCategory(nextCategory);
              return 0; // Reset index for new category
            }
          }
          
          // If no next category found, stay on current
          return prevIndex;
        }
        
        // Move to next item in same category
        return nextIndex;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [currentCategory, categoryItems]);

  // Format item data based on type
  const formatItem = (item) => {
    const baseItem = {
      id: item.id || item._id,
      type: item.type,
      userId: item.userId,
      image: '',
      title: '',
      description: '',
      price: null,
      link: '#',
      cta: 'View Details'
    };

    switch (item.type) {
      case 'horse':
        return {
          ...baseItem,
          image: item.photos?.[0] || 'https://readdy.ai/api/search-image?query=beautiful%20horse%20portrait%20simple%20background&width=400&height=300&seq=horse&orientation=landscape',
          title: item.horseName || 'Horse for Sale',
          description: `${item.breed || 'Horse'} - ${item.gender || ''} | ${item.ageOrDOB || ''}`,
          price: item.askingPrice,
          link: `/market?type=horse&horseId=${item.id}`,
          cta: `View Horse - $${item.askingPrice?.toLocaleString() || 'Price on request'}`
        };
      
      case 'equipment':
        return {
          ...baseItem,
          image: item.photos?.[0] || 'https://readdy.ai/api/search-image?query=horse%20equipment%20tack%20simple%20background&width=400&height=300&seq=equipment&orientation=landscape',
          title: item.productName || 'Equipment',
          description: item.details || `${item.mainCategory || ''} - ${item.subcategory || ''}`,
          price: item.price,
          link: `/market?type=marketplace&equipmentId=${item.id}`,
          cta: `View Equipment - $${item.price?.toLocaleString() || 'Price on request'}`
        };
      
      case 'otherService':
        return {
          ...baseItem,
          image: item.images?.[0] || 'https://readdy.ai/api/search-image?query=horse%20service%20veterinary%20simple%20background&width=400&height=300&seq=service&orientation=landscape',
          title: item.title || 'Service',
          description: item.details || `${item.serviceType || ''} - $${item.pricePerHour || 0}/hour`,
          price: item.pricePerHour,
          link: `/bookingOtherService?serviceId=${item.id}`,
          cta: `View Service - $${item.pricePerHour || 0}/hour`
        };
      
      case 'trainer':
        return {
          ...baseItem,
          image: item.images?.[0] || 'https://readdy.ai/api/search-image?query=horse%20trainer%20professional%20simple%20background&width=400&height=300&seq=trainer&orientation=landscape',
          title: item.title || 'Trainer',
          description: item.details || `Experience: ${item.Experience || 'N/A'}`,
          price: item.price,
          link: `/bookingTrainer?trainerId=${item.id}`,
          cta: `View Trainer - $${item.price?.toLocaleString() || 'Price on request'}/session`
        };
      
      case 'stable':
        return {
          ...baseItem,
          image: item.image?.[0] || 'https://readdy.ai/api/search-image?query=horse%20stable%20barn%20simple%20background&width=400&height=300&seq=stable&orientation=landscape',
          title: item.Tittle || 'Stable',
          description: item.Deatils || item.location || 'Stable Services',
          price: item.PriceRate?.[0]?.PriceRate,
          link: `/bookingStables?stableId=${item.id}`,
          cta: `View Stable - $${item.PriceRate?.[0]?.PriceRate || 'Price on request'}/${item.PriceRate?.[0]?.RateType || 'day'}`
        };
      
      default:
        return baseItem;
    }
  };

  const handleClick = (link) => {
    if (link && link !== '#') {
      router.push(link);
    }
  };

  if (loading) {
    return (
      <aside className="space-y-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-900">Sponsored</h3>
          <span className="text-xs text-gray-500">Ad</span>
        </div>
        <div className="bg-white rounded-xl shadow-md p-8 text-center">
          <p className="text-gray-500">Loading sponsored content...</p>
        </div>
      </aside>
    );
  }

  // Check if any category has items
  const hasAnyItems = Object.values(categoryItems).some(items => items.length > 0);
  
  if (!hasAnyItems) {
    return (
      <aside className="space-y-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-900">Sponsored</h3>
          <span className="text-xs text-gray-500">Ad</span>
        </div>
        <div className="bg-gradient-to-br from-teal-50 to-emerald-50 rounded-xl p-6 border border-teal-100">
          <div className="text-center">
            <div className="w-12 h-12 bg-teal-600 rounded-full flex items-center justify-center mx-auto mb-3">
              <i className="ri-megaphone-line text-2xl text-white"></i>
            </div>
            <h4 className="font-bold text-gray-900 mb-2">Advertise Here</h4>
            <p className="text-sm text-gray-600 mb-4">
              Reach thousands of equestrian enthusiasts with your brand
            </p>
            <button className="bg-teal-600 text-white px-6 py-2.5 rounded-lg hover:bg-teal-700 transition-colors font-medium text-sm whitespace-nowrap">
              Learn More
            </button>
          </div>
        </div>
      </aside>
    );
  }

  // Get current item from current category
  const getCurrentItem = () => {
    if (!currentCategory || categoryItems[currentCategory].length === 0) {
      // Fallback: find first category with items
      const categories = ['horses', 'equipment', 'otherServices', 'trainers', 'stables'];
      const firstCategory = categories.find(cat => categoryItems[cat].length > 0);
      if (firstCategory && categoryItems[firstCategory].length > 0) {
        return formatItem(categoryItems[firstCategory][0]);
      }
      return null;
    }
    
    const currentItems = categoryItems[currentCategory];
    const item = currentItems[currentCategoryIndex] || currentItems[0];
    return formatItem(item);
  };

  const currentItem = getCurrentItem();
  
  if (!currentItem) {
    return (
      <aside className="space-y-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-900">Sponsored</h3>
          <span className="text-xs text-gray-500">Ad</span>
        </div>
        <div className="bg-gradient-to-br from-teal-50 to-emerald-50 rounded-xl p-6 border border-teal-100">
          <div className="text-center">
            <div className="w-12 h-12 bg-teal-600 rounded-full flex items-center justify-center mx-auto mb-3">
              <i className="ri-megaphone-line text-2xl text-white"></i>
            </div>
            <h4 className="font-bold text-gray-900 mb-2">Advertise Here</h4>
            <p className="text-sm text-gray-600 mb-4">
              Reach thousands of equestrian enthusiasts with your brand
            </p>
            <button className="bg-teal-600 text-white px-6 py-2.5 rounded-lg hover:bg-teal-700 transition-colors font-medium text-sm whitespace-nowrap">
              Learn More
            </button>
          </div>
        </div>
      </aside>
    );
  }

  // Calculate total items for navigation dots
  const totalItems = Object.values(categoryItems).reduce((sum, items) => sum + items.length, 0);
  const getCurrentGlobalIndex = () => {
    const categories = ['horses', 'equipment', 'otherServices', 'trainers', 'stables'];
    let index = 0;
    for (let i = 0; i < categories.length; i++) {
      if (categories[i] === currentCategory) {
        return index + currentCategoryIndex;
      }
      index += categoryItems[categories[i]].length;
    }
    return 0;
  };
  const currentGlobalIndex = getCurrentGlobalIndex();

  return (
    <aside className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-900">Sponsored</h3>
        <span className="text-xs text-gray-500">Ad</span>
      </div>

      <div className="space-y-4">
        {/* Current sponsored item - key forces re-render on change */}
        <div
          key={`${currentCategory}-${currentCategoryIndex}-${currentItem.id}`}
          className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 border border-gray-100"
        >
          <div className="w-full h-48 overflow-hidden relative">
            <img
              src={currentItem.image}
              alt={currentItem.title}
              className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-500"
              onError={(e) => {
                e.target.src = 'https://readdy.ai/api/search-image?query=horse%20equestrian%20simple%20background&width=400&height=300&seq=default&orientation=landscape';
              }}
            />
            {/* Category indicator */}
            <div className="absolute top-2 right-2">
              <span className="text-xs font-medium text-white bg-black/50 backdrop-blur-sm px-2 py-1 rounded-full capitalize">
                {currentItem.type === 'otherService' ? 'Service' : currentItem.type}
              </span>
            </div>
            {/* Navigation dots - show all items across all categories */}
            {totalItems > 1 && (
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1 max-w-[200px] overflow-x-auto">
                {Array.from({ length: totalItems }).map((_, index) => (
                  <div
                    key={index}
                    className={`w-1.5 h-1.5 rounded-full transition-all flex-shrink-0 ${
                      index === currentGlobalIndex ? 'bg-white w-4' : 'bg-white/50'
                    }`}
                  />
                ))}
              </div>
            )}
            {/* Category indicator */}
            <div className="absolute top-2 left-2">
              <span className="text-xs font-medium text-white bg-teal-600/90 backdrop-blur-sm px-2 py-1 rounded-full capitalize">
                {currentCategory === 'otherServices' ? 'Service' : currentCategory}
              </span>
            </div>
          </div>
          <div className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-medium text-teal-600 bg-teal-50 px-2 py-1 rounded-full">
                Sponsored
              </span>
              {currentItem.userId && (
                <span className="text-xs text-gray-500 truncate">
                  {currentItem.userId.name || 'Seller'}
                </span>
              )}
            </div>
            <h4 className="font-bold text-gray-900 mb-2 text-base line-clamp-2">
              {currentItem.title}
            </h4>
            <p className="text-sm text-gray-600 mb-4 leading-relaxed line-clamp-2">
              {currentItem.description}
            </p>
            <button
              onClick={() => handleClick(currentItem.link)}
              className="block w-full text-center bg-teal-600 text-white py-2.5 rounded-lg hover:bg-teal-700 transition-colors font-medium text-sm whitespace-nowrap"
            >
              {currentItem.cta}
            </button>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-teal-50 to-emerald-50 rounded-xl p-6 border border-teal-100">
        <div className="text-center">
          <div className="w-12 h-12 bg-teal-600 rounded-full flex items-center justify-center mx-auto mb-3">
            <i className="ri-megaphone-line text-2xl text-white"></i>
          </div>
          <h4 className="font-bold text-gray-900 mb-2">Advertise Here</h4>
          <p className="text-sm text-gray-600 mb-4">
            Reach thousands of equestrian enthusiasts with your brand
          </p>
          <button className="bg-teal-600 text-white px-6 py-2.5 rounded-lg hover:bg-teal-700 transition-colors font-medium text-sm whitespace-nowrap">
            Learn More
          </button>
        </div>
      </div>
    </aside>
  );
}




