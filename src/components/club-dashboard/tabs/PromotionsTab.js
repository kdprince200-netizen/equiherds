'use client';

import { useState } from 'react';

export default function PromotionsTab() {
  const [showCreatePromotion, setShowCreatePromotion] = useState(false);
  const [promotionForm, setPromotionForm] = useState({
    sessionTitle: '',
    sessionType: 'group',
    instructor: '',
    startDate: '',
    endDate: '',
    budget: '',
    targetAudience: 'all',
    placements: [],
    description: ''
  });

  const handlePlacementToggle = (placement) => {
    setPromotionForm(prev => ({
      ...prev,
      placements: prev.placements.includes(placement)
        ? prev.placements.filter(p => p !== placement)
        : [...prev.placements, placement]
    }));
  };

  const handleCreatePromotion = () => {
    // Validate form
    if (!promotionForm.sessionTitle || !promotionForm.instructor || !promotionForm.startDate || 
        !promotionForm.endDate || !promotionForm.budget || promotionForm.placements.length === 0) {
      alert('Please fill in all required fields and select at least one placement location');
      return;
    }

    // Here you would typically send the data to your backend
    console.log('Creating promotion:', promotionForm);
    
    // Reset form and close modal
    setPromotionForm({
      sessionTitle: '',
      sessionType: 'group',
      instructor: '',
      startDate: '',
      endDate: '',
      budget: '',
      targetAudience: 'all',
      placements: [],
      description: ''
    });
    setShowCreatePromotion(false);
    alert('Promotion campaign created successfully!');
  };

  const isFormValid = promotionForm.sessionTitle && promotionForm.instructor && 
                      promotionForm.startDate && promotionForm.endDate && 
                      promotionForm.budget && promotionForm.placements.length > 0;

  return (
    <>
      <div className="space-y-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm">Total Spent</span>
              <i className="ri-money-dollar-circle-line text-2xl text-purple-600"></i>
            </div>
            <div className="text-3xl font-bold text-gray-900">$2,450</div>
            <div className="text-sm text-green-600 mt-1">+12% this month</div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm">Impressions</span>
              <i className="ri-eye-line text-2xl text-blue-600"></i>
            </div>
            <div className="text-3xl font-bold text-gray-900">45.2K</div>
            <div className="text-sm text-green-600 mt-1">+18% this week</div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm">Clicks</span>
              <i className="ri-cursor-line text-2xl text-teal-600"></i>
            </div>
            <div className="text-3xl font-bold text-gray-900">3,842</div>
            <div className="text-sm text-green-600 mt-1">8.5% CTR</div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm">Enrollments</span>
              <i className="ri-user-add-line text-2xl text-orange-600"></i>
            </div>
            <div className="text-3xl font-bold text-gray-900">127</div>
            <div className="text-sm text-green-600 mt-1">3.3% conversion</div>
          </div>
        </div>

        {/* Create Promotion Button */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Sponsored Sessions</h3>
              <p className="text-gray-600">Promote your sessions to reach more students</p>
            </div>
            <button 
              onClick={() => setShowCreatePromotion(true)}
              className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors whitespace-nowrap flex items-center gap-2 cursor-pointer"
            >
              <i className="ri-megaphone-line text-xl"></i>
              Create Promotion
            </button>
          </div>
        </div>

        {/* Active Promotions */}
        <div className="space-y-4">
          {/* Promotion Card 1 */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h4 className="text-lg font-bold text-gray-900">Advanced BJJ Techniques</h4>
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">Active</span>
                  <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-semibold">PROMOTED</span>
                </div>
                <p className="text-gray-600 text-sm mb-3">Group Session • Instructor: Marcus Silva</p>
                <div className="flex items-center gap-6 text-sm text-gray-600">
                  <span><i className="ri-calendar-line mr-1"></i>Jan 15 - Feb 15, 2025</span>
                  <span><i className="ri-money-dollar-circle-line mr-1"></i>Budget: $800</span>
                  <span><i className="ri-map-pin-line mr-1"></i>Home, Sessions, Coaches</span>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer">
                  <i className="ri-edit-line text-xl"></i>
                </button>
                <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer">
                  <i className="ri-pause-circle-line text-xl"></i>
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-5 gap-4 pt-4 border-t border-gray-100">
              <div>
                <div className="text-sm text-gray-600 mb-1">Impressions</div>
                <div className="text-xl font-bold text-gray-900">18.5K</div>
              </div>
              <div>
                <div className="text-sm text-gray-600 mb-1">Clicks</div>
                <div className="text-xl font-bold text-gray-900">1,542</div>
              </div>
              <div>
                <div className="text-sm text-gray-600 mb-1">CTR</div>
                <div className="text-xl font-bold text-teal-600">8.3%</div>
              </div>
              <div>
                <div className="text-sm text-gray-600 mb-1">Enrollments</div>
                <div className="text-xl font-bold text-gray-900">52</div>
              </div>
              <div>
                <div className="text-sm text-gray-600 mb-1">Cost/Enrollment</div>
                <div className="text-xl font-bold text-purple-600">$15.38</div>
              </div>
            </div>
          </div>

          {/* Promotion Card 2 */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h4 className="text-lg font-bold text-gray-900">Kids Karate Program</h4>
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">Active</span>
                  <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-semibold">PROMOTED</span>
                </div>
                <p className="text-gray-600 text-sm mb-3">Group Session • Instructor: Sarah Chen</p>
                <div className="flex items-center gap-6 text-sm text-gray-600">
                  <span><i className="ri-calendar-line mr-1"></i>Jan 10 - Feb 10, 2025</span>
                  <span><i className="ri-money-dollar-circle-line mr-1"></i>Budget: $650</span>
                  <span><i className="ri-map-pin-line mr-1"></i>Home, Sessions</span>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer">
                  <i className="ri-edit-line text-xl"></i>
                </button>
                <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer">
                  <i className="ri-pause-circle-line text-xl"></i>
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-5 gap-4 pt-4 border-t border-gray-100">
              <div>
                <div className="text-sm text-gray-600 mb-1">Impressions</div>
                <div className="text-xl font-bold text-gray-900">12.8K</div>
              </div>
              <div>
                <div className="text-sm text-gray-600 mb-1">Clicks</div>
                <div className="text-xl font-bold text-gray-900">1,089</div>
              </div>
              <div>
                <div className="text-sm text-gray-600 mb-1">CTR</div>
                <div className="text-xl font-bold text-teal-600">8.5%</div>
              </div>
              <div>
                <div className="text-sm text-gray-600 mb-1">Enrollments</div>
                <div className="text-xl font-bold text-gray-900">38</div>
              </div>
              <div>
                <div className="text-sm text-gray-600 mb-1">Cost/Enrollment</div>
                <div className="text-xl font-bold text-purple-600">$17.11</div>
              </div>
            </div>
          </div>

          {/* Promotion Card 3 */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h4 className="text-lg font-bold text-gray-900">MMA Fundamentals</h4>
                  <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-semibold">Scheduled</span>
                  <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-semibold">PROMOTED</span>
                </div>
                <p className="text-gray-600 text-sm mb-3">Group Session • Instructor: Jake Thompson</p>
                <div className="flex items-center gap-6 text-sm text-gray-600">
                  <span><i className="ri-calendar-line mr-1"></i>Feb 1 - Mar 1, 2025</span>
                  <span><i className="ri-money-dollar-circle-line mr-1"></i>Budget: $1,000</span>
                  <span><i className="ri-map-pin-line mr-1"></i>Home, Sessions, Clubs</span>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer">
                  <i className="ri-edit-line text-xl"></i>
                </button>
                <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer">
                  <i className="ri-delete-bin-line text-xl"></i>
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-5 gap-4 pt-4 border-t border-gray-100">
              <div>
                <div className="text-sm text-gray-600 mb-1">Impressions</div>
                <div className="text-xl font-bold text-gray-400">-</div>
              </div>
              <div>
                <div className="text-sm text-gray-600 mb-1">Clicks</div>
                <div className="text-xl font-bold text-gray-400">-</div>
              </div>
              <div>
                <div className="text-sm text-gray-600 mb-1">CTR</div>
                <div className="text-xl font-bold text-gray-400">-</div>
              </div>
              <div>
                <div className="text-sm text-gray-600 mb-1">Enrollments</div>
                <div className="text-xl font-bold text-gray-400">-</div>
              </div>
              <div>
                <div className="text-sm text-gray-600 mb-1">Cost/Enrollment</div>
                <div className="text-xl font-bold text-gray-400">-</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Create Promotion Modal */}
      {showCreatePromotion && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-8 py-6 flex items-center justify-between">
              <h3 className="text-2xl font-bold text-gray-900">Create Promotion Campaign</h3>
              <button 
                onClick={() => setShowCreatePromotion(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
              >
                <i className="ri-close-line text-2xl text-gray-600"></i>
              </button>
            </div>

            <div className="p-8 space-y-6">
              {/* Session Title */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Session Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={promotionForm.sessionTitle}
                  onChange={(e) => setPromotionForm({...promotionForm, sessionTitle: e.target.value})}
                  placeholder="e.g., Advanced BJJ Techniques"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                />
              </div>

              {/* Session Type */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Session Type <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {['group', 'private', 'seminar'].map((type) => (
                    <button
                      key={type}
                      onClick={() => setPromotionForm({...promotionForm, sessionType: type})}
                      className={`px-4 py-3 rounded-lg border-2 transition-all cursor-pointer whitespace-nowrap ${
                        promotionForm.sessionType === type
                          ? 'border-purple-600 bg-purple-50 text-purple-700'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Instructor */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Instructor Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={promotionForm.instructor}
                  onChange={(e) => setPromotionForm({...promotionForm, instructor: e.target.value})}
                  placeholder="e.g., Marcus Silva"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                />
              </div>

              {/* Date Range */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Start Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={promotionForm.startDate}
                    onChange={(e) => setPromotionForm({...promotionForm, startDate: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    End Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={promotionForm.endDate}
                    onChange={(e) => setPromotionForm({...promotionForm, endDate: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                  />
                </div>
              </div>

              {/* Budget */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Campaign Budget <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                  <input
                    type="number"
                    value={promotionForm.budget}
                    onChange={(e) => setPromotionForm({...promotionForm, budget: e.target.value})}
                    placeholder="500"
                    className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                  />
                </div>
              </div>

              {/* Target Audience */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Target Audience
                </label>
                <div className="grid grid-cols-4 gap-3">
                  {['all', 'beginners', 'intermediate', 'advanced'].map((audience) => (
                    <button
                      key={audience}
                      onClick={() => setPromotionForm({...promotionForm, targetAudience: audience})}
                      className={`px-4 py-3 rounded-lg border-2 transition-all cursor-pointer whitespace-nowrap text-sm ${
                        promotionForm.targetAudience === audience
                          ? 'border-purple-600 bg-purple-50 text-purple-700'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {audience.charAt(0).toUpperCase() + audience.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Placement Locations */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Placement Locations <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { id: 'home', label: 'Home Page', icon: 'ri-home-line' },
                    { id: 'sessions', label: 'Sessions Page', icon: 'ri-calendar-line' },
                    { id: 'coaches', label: 'Coaches Page', icon: 'ri-user-star-line' },
                    { id: 'clubs', label: 'Clubs Page', icon: 'ri-building-line' },
                    { id: 'live', label: 'Live Classes', icon: 'ri-live-line' },
                    { id: 'marketplace', label: 'Marketplace', icon: 'ri-store-line' }
                  ].map((placement) => (
                    <button
                      key={placement.id}
                      onClick={() => handlePlacementToggle(placement.id)}
                      className={`px-4 py-3 rounded-lg border-2 transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 text-sm ${
                        promotionForm.placements.includes(placement.id)
                          ? 'border-purple-600 bg-purple-50 text-purple-700'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <i className={`${placement.icon} text-lg`}></i>
                      {placement.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Campaign Description
                </label>
                <textarea
                  value={promotionForm.description}
                  onChange={(e) => setPromotionForm({...promotionForm, description: e.target.value})}
                  placeholder="Describe what makes this session special and why students should enroll..."
                  rows={4}
                  maxLength={500}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm resize-none"
                />
                <div className="text-xs text-gray-500 mt-1">{promotionForm.description.length}/500 characters</div>
              </div>

              {/* Info Box */}
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <div className="flex gap-3">
                  <i className="ri-information-line text-xl text-purple-600 flex-shrink-0"></i>
                  <div className="text-sm text-purple-900">
                    <strong>Promotion Guidelines:</strong> Your session will be featured with a "PROMOTED" badge in selected locations. Budget will be distributed across the campaign duration. You can pause or edit the campaign anytime.
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-4">
                <button
                  onClick={() => setShowCreatePromotion(false)}
                  className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer whitespace-nowrap font-semibold"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreatePromotion}
                  disabled={!isFormValid}
                  className={`flex-1 px-6 py-3 rounded-lg transition-colors cursor-pointer whitespace-nowrap font-semibold ${
                    isFormValid
                      ? 'bg-purple-600 text-white hover:bg-purple-700'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  <i className="ri-megaphone-line mr-2"></i>
                  Create Promotion
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
