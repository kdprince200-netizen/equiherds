'use client';

import { useState } from 'react';

export default function ProfileTab() {
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [editType, setEditType] = useState('');

  const clubData = {
    name: 'Elite Grappling Academy',
    email: 'info@elitegrappling.com',
    phone: '+1 (555) 234-5678',
    location: 'Los Angeles, CA',
    address: {
      street: '789 Martial Arts Boulevard',
      city: 'Los Angeles',
      state: 'CA',
      zipCode: '90210'
    },
    established: '2015',
    rating: 4.8,
    totalReviews: 234,
    totalMembers: 156,
    activeMembers: 142,
    coaches: 8,
    monthlyRevenue: 24500,
    subscriptionPlan: 'Premium',
    subscriptionExpiry: '2024-11-20',
    subscriptionStatus: 'Active',
    facilities: ['Main Training Area', 'Cardio Zone', 'Locker Rooms', 'Pro Shop'],
    operatingHours: 'Mon-Fri: 6AM-10PM, Sat-Sun: 8AM-8PM',
    website: 'www.elitegrappling.com',
    socialMedia: {
      facebook: '@elitegrappling',
      instagram: '@elitegrappling',
      twitter: '@elitegrappling'
    },
    verified: true
  };

  const handleEdit = (item, type) => {
    setEditingItem(item);
    setEditType(type);
    setShowEditModal(true);
  };

  const handleSaveEdit = () => {
    alert(`Changes saved for ${editType}! This will be connected to Supabase for real data updates.`);
    setShowEditModal(false);
    setEditingItem(null);
    setEditType('');
  };

  return (
    <>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-bold text-slate-900">Club Profile</h3>
          <button 
            onClick={() => handleEdit(clubData, 'Club Profile')}
            className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors whitespace-nowrap"
          >
            Edit Profile
          </button>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="bg-slate-50 rounded-lg p-6">
            <h4 className="font-semibold text-slate-900 mb-4">Contact Information</h4>
            <div className="space-y-3">
              <div>
                <span className="text-sm text-slate-600">Club Name:</span>
                <p className="font-semibold text-slate-900">{clubData.name}</p>
              </div>
              <div>
                <span className="text-sm text-slate-600">Email:</span>
                <p className="font-semibold text-slate-900">{clubData.email}</p>
              </div>
              <div>
                <span className="text-sm text-slate-600">Phone:</span>
                <p className="font-semibold text-slate-900">{clubData.phone}</p>
              </div>
              <div>
                <span className="text-sm text-slate-600">Website:</span>
                <p className="font-semibold text-slate-900">{clubData.website}</p>
              </div>
            </div>
          </div>

          <div className="bg-slate-50 rounded-lg p-6">
            <h4 className="font-semibold text-slate-900 mb-4">Location</h4>
            <div className="space-y-1">
              <p className="font-semibold text-slate-900">{clubData.address.street}</p>
              <p className="text-slate-600">
                {clubData.address.city}, {clubData.address.state} {clubData.address.zipCode}
              </p>
              <p className="text-sm text-slate-600 mt-3">
                <strong>Operating Hours:</strong><br />
                {clubData.operatingHours}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-slate-50 rounded-lg p-6">
          <h4 className="font-semibold text-slate-900 mb-4">Social Media</h4>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <span className="text-sm text-slate-600">Facebook:</span>
              <p className="font-semibold text-slate-900">{clubData.socialMedia.facebook}</p>
            </div>
            <div>
              <span className="text-sm text-slate-600">Instagram:</span>
              <p className="font-semibold text-slate-900">{clubData.socialMedia.instagram}</p>
            </div>
            <div>
              <span className="text-sm text-slate-600">Twitter:</span>
              <p className="font-semibold text-slate-900">{clubData.socialMedia.twitter}</p>
            </div>
          </div>
        </div>

        <div className="bg-slate-50 rounded-lg p-6">
          <h4 className="font-semibold text-slate-900 mb-4">Facilities</h4>
          <div className="flex flex-wrap gap-2">
            {clubData.facilities.map((facility, index) => (
              <span key={index} className="px-4 py-2 bg-white rounded-lg text-slate-700 font-semibold">
                <i className="ri-checkbox-circle-line text-green-500 mr-2"></i>
                {facility}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {showEditModal && editingItem && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-6">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-2xl font-bold text-slate-900">Edit {editType}</h3>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <i className="ri-close-line text-2xl"></i>
                </button>
              </div>

              <div className="space-y-4 mb-6">
                <p className="text-sm text-slate-600">
                  Make changes to the {editType.toLowerCase()} information. All fields will be saved to the database.
                </p>
                <textarea
                  placeholder={`Enter updated information for ${editType}...`}
                  maxLength={500}
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
                  rows={6}
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 px-6 py-3 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors font-semibold whitespace-nowrap"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveEdit}
                  className="flex-1 px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors font-semibold whitespace-nowrap"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
