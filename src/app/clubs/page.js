'use client';

import { useState } from 'react';

export default function Clubs() {
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const clubs = [
    {
      id: 1,
      name: 'Elite Grappling Academy',
      location: 'Los Angeles, CA',
      type: 'Brazilian Jiu-Jitsu',
      rating: 4.9,
      members: 250,
      monthlyFee: '$150',
      image: '/images/club/imgi_1_search-image.png',
      amenities: ['Professional Mats', 'Changing Rooms', 'Equipment Storage', 'Parking'],
      classes: ['Beginner BJJ', 'Advanced BJJ', 'Competition Team', 'Kids Classes'],
      instructors: 8
    },
    {
      id: 2,
      name: 'Iron Wolf Wrestling Club',
      location: 'Chicago, IL',
      type: 'Wrestling',
      rating: 4.8,
      members: 180,
      monthlyFee: '$120',
      image: '/images/club/imgi_2_search-image.png',
      amenities: ['Wrestling Mats', 'Strength Training', 'Cardio Equipment', 'Locker Rooms'],
      classes: ['Youth Wrestling', 'High School Prep', 'Adult Wrestling', 'Competition Team'],
      instructors: 6
    },
    {
      id: 3,
      name: 'Apex MMA Training Center',
      location: 'Miami, FL',
      type: 'Mixed Martial Arts',
      rating: 4.9,
      members: 320,
      monthlyFee: '$180',
      image: '/images/club/imgi_3_search-image.png',
      amenities: ['Octagon Cage', 'Heavy Bags', 'Cardio Area', 'Recovery Room'],
      classes: ['MMA Fundamentals', 'Striking', 'Grappling', 'Fight Team'],
      instructors: 12
    },
    {
      id: 4,
      name: 'Golden Gate Judo Club',
      location: 'San Francisco, CA',
      type: 'Judo',
      rating: 4.7,
      members: 140,
      monthlyFee: '$100',
      image: '/images/club/imgi_4_search-image.png',
      amenities: ['Tatami Mats', 'Traditional Dojo', 'Equipment Room', 'Meditation Area'],
      classes: ['Beginner Judo', 'Advanced Judo', 'Competition Prep', 'Kids Judo'],
      instructors: 5
    },
    {
      id: 5,
      name: 'Lone Star Grappling',
      location: 'Austin, TX',
      type: 'Submission Grappling',
      rating: 4.6,
      members: 200,
      monthlyFee: '$140',
      image: '/images/club/imgi_5_search-image.png',
      amenities: ['Grappling Mats', 'Strength Area', 'Recovery Zone', 'Pro Shop'],
      classes: ['No-Gi Grappling', 'Wrestling', 'Submission Defense', 'Open Mat'],
      instructors: 7
    },
    {
      id: 6,
      name: 'Empire Combat Sports',
      location: 'New York, NY',
      type: 'Mixed Martial Arts',
      rating: 4.8,
      members: 280,
      monthlyFee: '$200',
      image: '/images/club/imgi_6_search-image.png',
      amenities: ['Multiple Training Areas', 'Sauna', 'Nutrition Bar', 'Personal Training'],
      classes: ['MMA Basics', 'Muay Thai', 'BJJ', 'Boxing'],
      instructors: 15
    }
  ];

  const locations = ['all', 'Los Angeles, CA', 'Chicago, IL', 'Miami, FL', 'San Francisco, CA', 'Austin, TX', 'New York, NY'];

  const filteredClubs = clubs.filter(club => {
    const matchesLocation = selectedLocation === 'all' || club.location === selectedLocation;
    const matchesSearch = club.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         club.type.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesLocation && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-slate-900 to-slate-700 text-white py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-6">Find Your Training Home</h1>
            <p className="text-xl mb-8 text-slate-200">
              Discover top-rated grappling clubs and martial arts academies near you
            </p>
            <div className="flex flex-col md:flex-row gap-4 max-w-2xl mx-auto">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Search clubs by name or martial art..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-6 py-4 rounded-lg text-slate-900 text-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <button className="bg-teal-600 hover:bg-teal-700 px-8 py-4 rounded-lg font-semibold transition-colors whitespace-nowrap">
                Find Clubs
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Location Filters */}
      <section className="py-8 bg-slate-50">
        <div className="container mx-auto px-6">
          <div className="flex flex-wrap gap-3 justify-center">
            {locations.map((location) => (
              <button
                key={location}
                onClick={() => setSelectedLocation(location)}
                className={`px-6 py-3 rounded-full font-medium transition-colors whitespace-nowrap ${
                  selectedLocation === location
                    ? 'bg-teal-600 text-white'
                    : 'bg-white text-slate-700 hover:bg-slate-100'
                }`}
              >
                {location === 'all' ? 'All Locations' : location}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Clubs Grid */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {filteredClubs.map((club) => (
              <div key={club.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                <div className="relative">
                  <img
                    src={club.image}
                    alt={club.name}
                    className="w-full h-48 object-cover object-top"
                  />
                  <div className="absolute top-4 right-4 bg-white px-3 py-1 rounded-full">
                    <div className="flex items-center gap-1">
                      <i className="ri-star-fill text-yellow-500"></i>
                      <span className="font-semibold text-sm">{club.rating}</span>
                    </div>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-slate-900 mb-1">{club.name}</h3>
                      <p className="text-teal-600 font-semibold">{club.type}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-slate-900">{club.monthlyFee}</div>
                      <div className="text-sm text-slate-600">per month</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-slate-600 mb-4">
                    <div className="flex items-center gap-1">
                      <i className="ri-map-pin-line w-4 h-4 flex items-center justify-center"></i>
                      <span>{club.location}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <i className="ri-group-line w-4 h-4 flex items-center justify-center"></i>
                      <span>{club.members} members</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <i className="ri-user-line w-4 h-4 flex items-center justify-center"></i>
                      <span>{club.instructors} instructors</span>
                    </div>
                  </div>

                  <div className="mb-4">
                    <h4 className="font-semibold text-slate-900 mb-2">Classes Offered</h4>
                    <div className="flex flex-wrap gap-2">
                      {club.classes.map((classType, index) => (
                        <span key={index} className="bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-sm">
                          {classType}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mb-6">
                    <h4 className="font-semibold text-slate-900 mb-2">Amenities</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {club.amenities.map((amenity, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm text-slate-600">
                          <i className="ri-check-line w-3 h-3 flex items-center justify-center text-green-500"></i>
                          {amenity}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button className="flex-1 bg-teal-600 hover:bg-teal-700 text-white py-3 px-4 rounded-lg font-semibold transition-colors whitespace-nowrap">
                      Join Club
                    </button>
                    <button className="px-4 py-3 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors">
                      <i className="ri-phone-line w-5 h-5 flex items-center justify-center"></i>
                    </button>
                    <button className="px-4 py-3 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors">
                      <i className="ri-map-pin-line w-5 h-5 flex items-center justify-center"></i>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-slate-900 text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-4">Own a Grappling Club?</h2>
          <p className="text-xl text-slate-300 mb-8">
            List your club on our platform and reach more students
          </p>
          <button className="bg-teal-600 hover:bg-teal-700 px-8 py-4 rounded-lg font-semibold text-lg transition-colors whitespace-nowrap">
            List Your Club
          </button>
        </div>
      </section>
    </div>
  );
}

