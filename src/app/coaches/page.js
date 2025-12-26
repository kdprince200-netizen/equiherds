'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Coaches() {
  const router = useRouter();

  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const coaches = [
    {
      id: 1,
      name: 'Marcus Silva',
      specialty: 'Brazilian Jiu-Jitsu',
      experience: '15 years',
      rating: 4.9,
      price: '$80/hour',
      location: 'Los Angeles, CA',
      image: '/images/home/imgi_2_search-image.png',
      achievements: ['IBJJF World Champion', 'Black Belt 3rd Degree'],
      students: 150
    },
    {
      id: 2,
      name: 'Sarah Thompson',
      specialty: 'Wrestling',
      experience: '12 years',
      rating: 4.8,
      price: '$75/hour',
      location: 'Chicago, IL',
      image: '/images/home/imgi_3_search-image.png',
      achievements: ['NCAA Division I Champion', 'Olympic Trials Qualifier'],
      students: 120
    },
    {
      id: 3,
      name: 'Diego Rodriguez',
      specialty: 'Mixed Martial Arts',
      experience: '18 years',
      rating: 4.9,
      price: '$90/hour',
      location: 'Miami, FL',
      image: '/images/home/imgi_4_search-image.png',
      achievements: ['Former UFC Fighter', 'Multiple Championship Titles'],
      students: 200
    },
    {
      id: 4,
      name: 'Amanda Chen',
      specialty: 'Judo',
      experience: '14 years',
      rating: 4.7,
      price: '$70/hour',
      location: 'San Francisco, CA',
      image: '/images/home/imgi_5_search-image.png',
      achievements: ['Olympic Bronze Medalist', 'World Championship Silver'],
      students: 95
    },
    {
      id: 5,
      name: 'Jake Morrison',
      specialty: 'Submission Grappling',
      experience: '10 years',
      rating: 4.6,
      price: '$65/hour',
      location: 'Austin, TX',
      image: '/images/home/imgi_6_search-image.png',
      achievements: ['ADCC Veteran', 'Multiple NAGA Championships'],
      students: 80
    },
    {
      id: 6,
      name: 'Isabella Santos',
      specialty: 'Brazilian Jiu-Jitsu',
      experience: '11 years',
      rating: 4.8,
      price: '$78/hour',
      location: 'New York, NY',
      image: '/images/home/imgi_7_search-image.png',
      achievements: ['World Champion', 'Black Belt 2nd Degree'],
      students: 110
    }
  ];

  const categories = ['all', 'Brazilian Jiu-Jitsu', 'Wrestling', 'Mixed Martial Arts', 'Judo', 'Submission Grappling'];

  const filteredCoaches = coaches.filter(coach => {
    const matchesCategory = selectedCategory === 'all' || coach.specialty === selectedCategory;
    const matchesSearch = coach.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         coach.specialty.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-slate-900 to-slate-700 text-white py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-6">Find Your Perfect Grappling Coach</h1>
            <p className="text-xl mb-8 text-slate-200">
              Connect with world-class coaches and take your grappling skills to the next level
            </p>
            <div className="flex flex-col md:flex-row gap-4 max-w-2xl mx-auto">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Search coaches by name or specialty..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-6 py-4 rounded-lg text-slate-900 text-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <button className="bg-teal-600 hover:bg-teal-700 px-8 py-4 rounded-lg font-semibold transition-colors whitespace-nowrap">
                Search Coaches
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Filters */}
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
                {category === 'all' ? 'All Specialties' : category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Coaches Grid */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCoaches.map((coach) => (
              <div key={coach.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                <div className="relative">
                  <img
                    src={coach.image}
                    alt={coach.name}
                    className="w-full h-64 object-cover object-top"
                  />
                  <div className="absolute top-4 right-4 bg-white px-3 py-1 rounded-full">
                    <div className="flex items-center gap-1">
                      <i className="ri-star-fill text-yellow-500"></i>
                      <span className="font-semibold text-sm">{coach.rating}</span>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-bold text-slate-900 mb-2">{coach.name}</h3>
                  <p className="text-teal-600 font-semibold mb-2">{coach.specialty}</p>

                  <div className="flex items-center gap-4 text-sm text-slate-600 mb-4">
                    <div className="flex items-center gap-1">
                      <i className="ri-time-line w-4 h-4 flex items-center justify-center"></i>
                      <span>{coach.experience}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <i className="ri-map-pin-line w-4 h-4 flex items-center justify-center"></i>
                      <span>{coach.location}</span>
                    </div>
                  </div>

                  <div className="mb-4">
                    <h4 className="font-semibold text-slate-900 mb-2">Achievements</h4>
                    <ul className="text-sm text-slate-600">
                      {coach.achievements.map((achievement, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <i className="ri-medal-line w-3 h-3 flex items-center justify-center text-yellow-500"></i>
                          {achievement}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <span className="text-2xl font-bold text-slate-900">{coach.price}</span>
                      <p className="text-sm text-slate-600">{coach.students} students</p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Link href="/booking" className="flex-1 bg-teal-600 hover:bg-teal-700 text-white py-3 px-4 rounded-lg font-semibold transition-colors whitespace-nowrap text-center">
                      Book Session
                    </Link>
                    <button className="px-4 py-3 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors">
                      <i className="ri-message-3-line w-5 h-5 flex items-center justify-center"></i>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-teal-600 to-teal-700">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Share Your Expertise?
          </h2>
          <p className="text-xl text-teal-50 mb-8 max-w-2xl mx-auto">
            Join our platform and connect with students worldwide. Start earning while doing what you love.
          </p>
          <Link
            href="/become-coach"
            className="bg-white hover:bg-slate-100 text-teal-600 px-8 py-4 rounded-lg font-semibold text-lg transition-colors whitespace-nowrap inline-block"
          >
            Become a Coach
          </Link>
        </div>
      </section>
    </div>
  );
}

