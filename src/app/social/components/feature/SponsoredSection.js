"use client";

import { useState } from 'react';

export default function SponsoredSection() {
  const [sponsoredPosts] = useState([
    {
      id: 1,
      title: 'Premium Horse Feed',
      description: 'Give your horse the nutrition they deserve with our organic, specially formulated feed.',
      image: 'https://readdy.ai/api/search-image?query=premium%20organic%20horse%20feed%20bags%20in%20clean%20stable%20setting%20with%20fresh%20hay%20natural%20lighting%20simple%20background%20highlighting%20product%20quality&width=400&height=300&seq=sponsor1&orientation=landscape',
      sponsor: 'EquiNutrition Pro',
      link: '#',
      cta: 'Shop Now'
    },
    {
      id: 2,
      title: 'Professional Riding Gear',
      description: 'Elevate your riding experience with our premium collection of helmets, boots, and apparel.',
      image: 'https://readdy.ai/api/search-image?query=elegant%20professional%20equestrian%20riding%20gear%20helmet%20boots%20gloves%20displayed%20on%20clean%20white%20surface%20studio%20lighting%20simple%20background&width=400&height=300&seq=sponsor2&orientation=landscape',
      sponsor: 'RiderStyle Elite',
      link: '#',
      cta: 'Explore Collection'
    },
    {
      id: 3,
      title: 'Horse Health Insurance',
      description: 'Protect your beloved companion with comprehensive health coverage and peace of mind.',
      image: 'https://readdy.ai/api/search-image?query=healthy%20beautiful%20horse%20in%20veterinary%20care%20setting%20with%20professional%20vet%20gentle%20caring%20atmosphere%20clean%20background&width=400&height=300&seq=sponsor3&orientation=landscape',
      sponsor: 'EquiCare Insurance',
      link: '#',
      cta: 'Get Quote'
    },
    {
      id: 4,
      title: 'Stable Management Software',
      description: 'Streamline your stable operations with our all-in-one management platform.',
      image: 'https://readdy.ai/api/search-image?query=modern%20tablet%20displaying%20stable%20management%20software%20interface%20in%20professional%20barn%20setting%20clean%20organized%20background&width=400&height=300&seq=sponsor4&orientation=landscape',
      sponsor: 'StableHub',
      link: '#',
      cta: 'Try Free'
    }
  ]);

  return (
    <aside className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-900">Sponsored</h3>
        <span className="text-xs text-gray-500">Ad</span>
      </div>

      <div className="space-y-4">
        {sponsoredPosts.map((post) => (
          <div
            key={post.id}
            className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 border border-gray-100"
          >
            <div className="w-full h-48 overflow-hidden">
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-medium text-teal-600 bg-teal-50 px-2 py-1 rounded-full">
                  Sponsored
                </span>
                <span className="text-xs text-gray-500">{post.sponsor}</span>
              </div>
              <h4 className="font-bold text-gray-900 mb-2 text-base">{post.title}</h4>
              <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                {post.description}
              </p>
              <a
                href={post.link}
                className="block w-full text-center bg-teal-600 text-white py-2.5 rounded-lg hover:bg-teal-700 transition-colors font-medium text-sm whitespace-nowrap"
              >
                {post.cta}
              </a>
            </div>
          </div>
        ))}
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



