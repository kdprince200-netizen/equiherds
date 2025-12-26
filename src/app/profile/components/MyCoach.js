'use client';

import { useState, useEffect } from 'react';
import { getRequest, postRequest } from '../../service';

export default function MyCoach({ user }) {
  const [coaches, setCoaches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
    coachingBusinessName: '',
    yearsOfExperience: '',
    certificationsCredentials: '',
    location: '',
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchCoaches();
  }, [user]);

  const fetchCoaches = async () => {
    try {
      setLoading(true);
      setError('');
      
      // If user is a club, get coaches assigned to this club
      // If user is a student, we could get their assigned coach
      let url = '/api/coaches';
      if (user?.accountType === 'club' && user?._id) {
        url = `/api/coaches?clubId=${user._id}`;
      } else if (user?.accountType === 'student' && user?.parentClubId) {
        // Students can see coaches from their assigned club
        url = `/api/coaches?clubId=${user.parentClubId}`;
      }

      const response = await getRequest(url);
      
      if (response.success) {
        setCoaches(response.data || []);
      } else {
        setError(response.error || 'Failed to load coaches');
      }
    } catch (err) {
      console.error('Error fetching coaches:', err);
      setError('An error occurred while loading coaches');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    // Validate passwords
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setSubmitting(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      setSubmitting(false);
      return;
    }

    try {
      // Add parentClubId if user is a club
      const coachData = {
        ...formData,
        yearsOfExperience: formData.yearsOfExperience ? Number(formData.yearsOfExperience) : undefined,
      };

      if (user?.accountType === 'club' && user?._id) {
        coachData.parentClubId = user._id;
      }

      const response = await postRequest('/api/coaches', coachData);

      if (response.success) {
        setShowAddModal(false);
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          password: '',
          confirmPassword: '',
          phoneNumber: '',
          coachingBusinessName: '',
          yearsOfExperience: '',
          certificationsCredentials: '',
          location: '',
        });
        fetchCoaches(); // Refresh the list
      } else {
        setError(response.error || 'Failed to add coach');
      }
    } catch (err) {
      console.error('Error adding coach:', err);
      setError('An error occurred while adding the coach');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">My Coaches</h2>
        <div className="bg-gray-50 rounded-lg p-8 text-center">
          <p className="text-gray-600">Loading coaches...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-900">My Coaches</h2>
        {user?.accountType === 'club' && (
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <i className="ri-add-line"></i>
            Add New Coach
          </button>
        )}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {coaches.length === 0 ? (
        <div className="bg-gray-50 rounded-lg p-8 text-center">
          <i className="ri-user-star-line text-5xl text-gray-400 mb-4"></i>
          <p className="text-gray-600">No coaches found.</p>
          {user?.accountType === 'club' && (
            <p className="text-gray-500 text-sm mt-2">Click "Add New Coach" to register a coach.</p>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {coaches.map((coach) => (
            <div key={coach._id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-4 mb-4">
                {coach.profilePicture ? (
                  <img
                    src={coach.profilePicture}
                    alt={`${coach.firstName} ${coach.lastName}`}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
                    <i className="ri-user-line text-2xl text-blue-600"></i>
                  </div>
                )}
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">
                    {coach.firstName} {coach.lastName}
                  </h3>
                  {coach.coachingBusinessName && (
                    <p className="text-sm text-gray-600">{coach.coachingBusinessName}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2 text-sm">
                {coach.email && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <i className="ri-mail-line"></i>
                    <span className="truncate">{coach.email}</span>
                  </div>
                )}
                {coach.phoneNumber && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <i className="ri-phone-line"></i>
                    <span>{coach.phoneNumber}</span>
                  </div>
                )}
                {coach.yearsOfExperience && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <i className="ri-medal-line"></i>
                    <span>{coach.yearsOfExperience} years experience</span>
                  </div>
                )}
                {coach.location && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <i className="ri-map-pin-line"></i>
                    <span>{coach.location}</span>
                  </div>
                )}
                {coach.certificationsCredentials && (
                  <div className="flex items-start gap-2 text-gray-600 mt-3">
                    <i className="ri-file-list-line mt-0.5"></i>
                    <span className="text-xs line-clamp-2">{coach.certificationsCredentials}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Coach Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-900">Add New Coach</h3>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setError('');
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <i className="ri-close-line text-2xl"></i>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-4">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    First Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Password <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    minLength={6}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Confirm Password <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    required
                    minLength={6}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Years of Experience
                  </label>
                  <input
                    type="number"
                    name="yearsOfExperience"
                    value={formData.yearsOfExperience}
                    onChange={handleInputChange}
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Coaching Business Name
                  </label>
                  <input
                    type="text"
                    name="coachingBusinessName"
                    value={formData.coachingBusinessName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    placeholder="City, State"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Certifications & Credentials
                  </label>
                  <textarea
                    name="certificationsCredentials"
                    value={formData.certificationsCredentials}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                    placeholder="List certifications, credentials, and achievements"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setError('');
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={submitting}
                >
                  {submitting ? 'Adding...' : 'Add Coach'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

