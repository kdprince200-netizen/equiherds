'use client';

import { useState, useEffect } from 'react';
import { getRequest, postRequest, putRequest } from '../../../app/service';

export default function CoachesTab() {
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [editType, setEditType] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [user, setUser] = useState(null);
  const [coaches, setCoaches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [editing, setEditing] = useState(false);
  const [toast, setToast] = useState({ visible: false, type: 'success', message: '' });
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
  const [editFormData, setEditFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    coachingBusinessName: '',
    yearsOfExperience: '',
    certificationsCredentials: '',
    location: '',
    status: 'Active',
  });

  useEffect(() => {
    fetchUserData();
  }, []);

  useEffect(() => {
    if (user) {
      fetchCoaches();
    }
  }, [user]);

  const fetchUserData = async () => {
    try {
      const response = await getRequest('/api/auth/me');
      if (response.success && response.data) {
        setUser(response.data);
      }
    } catch (err) {
      console.error('Error fetching user data:', err);
    }
  };

  const fetchCoaches = async () => {
    try {
      setLoading(true);
      setError('');
      
      // If user is a club, get coaches assigned to this club
      let url = '/api/coaches';
      if (user?.accountType === 'club' && user?._id) {
        url = `/api/coaches?clubId=${user._id}`;
      }

      const response = await getRequest(url);
      
      if (response.success) {
        setCoaches(response.data || []);
      } else {
        setError(response.error || 'Failed to load coaches');
        showToast(response.error || 'Failed to load coaches', 'error');
      }
    } catch (err) {
      console.error('Error fetching coaches:', err);
      setError('An error occurred while loading coaches');
      showToast('An error occurred while loading coaches', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showToast = (message, type = 'success', duration = 3000) => {
    setToast({ visible: true, type, message });
    if (duration > 0) {
      setTimeout(() => {
        setToast((prev) => ({ ...prev, visible: false }));
      }, duration);
    }
  };

  const handleEdit = (item, type) => {
    setEditingItem(item);
    setEditType(type);
    setEditFormData({
      firstName: item.firstName || '',
      lastName: item.lastName || '',
      email: item.email || '',
      phoneNumber: item.phoneNumber || '',
      coachingBusinessName: item.coachingBusinessName || '',
      yearsOfExperience: item.yearsOfExperience || '',
      certificationsCredentials: item.certificationsCredentials || '',
      location: item.location || '',
      status: item.status || 'Active',
    });
    setShowEditModal(true);
    setError('');
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    setError('');
    setEditing(true);

    try {
      if (!editingItem || !editingItem._id) {
        setError('Invalid coach data');
        setEditing(false);
        return;
      }

      const updateData = {
        ...editFormData,
        yearsOfExperience: editFormData.yearsOfExperience ? Number(editFormData.yearsOfExperience) : undefined,
      };

      // Remove empty strings
      Object.keys(updateData).forEach(key => {
        if (updateData[key] === '') {
          updateData[key] = undefined;
        }
      });

      const response = await putRequest(`/api/users/${editingItem._id}`, updateData);

      if (response.success) {
        setShowEditModal(false);
        setEditingItem(null);
        setEditType('');
        fetchCoaches(); // Refresh the coaches list
        showToast('Coach updated successfully!');
      } else {
        setError(response.error || 'Failed to update coach');
      }
    } catch (err) {
      console.error('Error updating coach:', err);
      setError('An error occurred while updating the coach');
    } finally {
      setEditing(false);
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
        fetchCoaches(); // Refresh the coaches list
        showToast('Coach added successfully!');
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

  return (
    <>
      {/* Toast */}
      {toast.visible && (
        <div className="fixed top-4 right-4 z-50">
          <div
            className={`px-4 py-3 rounded-lg shadow-lg text-sm text-white ${
              toast.type === 'error' ? 'bg-red-600' : 'bg-teal-600'
            }`}
          >
            {toast.message}
          </div>
        </div>
      )}

      <div>
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-slate-900">Our Coaches</h3>
          <button 
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors whitespace-nowrap"
          >
            <i className="ri-add-line mr-2"></i>
            Add Coach
          </button>
        </div>

        {loading ? (
          <div className="bg-slate-50 rounded-lg p-8 text-center">
            <p className="text-slate-600">Loading coaches...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
            {error}
          </div>
        ) : coaches.length === 0 ? (
          <div className="bg-slate-50 rounded-lg p-8 text-center">
            <i className="ri-user-star-line text-5xl text-slate-400 mb-4"></i>
            <p className="text-slate-600">No coaches found.</p>
            <p className="text-slate-500 text-sm mt-2">Click "Add Coach" to register a coach.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {coaches.map((coach) => {
              const coachName = `${coach.firstName || ''} ${coach.lastName || ''}`.trim() || 'Coach';
              const initials = coachName.split(' ').map((n) => n[0]).join('').toUpperCase() || 'C';
              
              return (
                <div key={coach._id || coach.id} className="bg-slate-50 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                      {coach.profilePicture ? (
                        <img
                          src={coach.profilePicture}
                          alt={coachName}
                          className="w-16 h-16 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-16 h-16 bg-teal-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
                          {initials}
                        </div>
                      )}
                      <div>
                        <h4 className="text-lg font-bold text-slate-900">{coachName}</h4>
                        {coach.coachingBusinessName && (
                          <p className="text-slate-600">{coach.coachingBusinessName}</p>
                        )}
                        {coach.email && (
                          <p className="text-sm text-slate-600">{coach.email}</p>
                        )}
                      </div>
                    </div>
                    <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
                      coach.status === 'Active' 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {coach.status || 'Active'}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm">
                    {coach.phoneNumber && (
                      <div>
                        <span className="text-slate-600">Phone:</span>
                        <p className="font-semibold text-slate-900">{coach.phoneNumber}</p>
                      </div>
                    )}
                    {coach.yearsOfExperience && (
                      <div>
                        <span className="text-slate-600">Experience:</span>
                        <p className="font-semibold text-slate-900">{coach.yearsOfExperience} years</p>
                      </div>
                    )}
                    {coach.location && (
                      <div>
                        <span className="text-slate-600">Location:</span>
                        <p className="font-semibold text-slate-900">{coach.location}</p>
                      </div>
                    )}
                    {coach.email && (
                      <div>
                        <span className="text-slate-600">Email:</span>
                        <p className="font-semibold text-slate-900 truncate">{coach.email}</p>
                      </div>
                    )}
                  </div>
                  {coach.certificationsCredentials && (
                    <div className="mb-4 text-sm">
                      <span className="text-slate-600">Certifications:</span>
                      <p className="font-semibold text-slate-900 mt-1">{coach.certificationsCredentials}</p>
                    </div>
                  )}
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleEdit(coach, 'Coach')}
                      className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors whitespace-nowrap"
                    >
                      Edit Profile
                    </button>
                    <button className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors whitespace-nowrap">
                      View Schedule
                    </button>
                    <button className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors whitespace-nowrap">
                      Message
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {showEditModal && editingItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-900">Edit Coach</h3>
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setEditingItem(null);
                  setEditType('');
                  setError('');
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <i className="ri-close-line text-2xl"></i>
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="p-6">
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
                    value={editFormData.firstName}
                    onChange={handleEditInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-black"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={editFormData.lastName}
                    onChange={handleEditInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-black"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={editFormData.email}
                    onChange={handleEditInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-black"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={editFormData.phoneNumber}
                    onChange={handleEditInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-black"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Years of Experience
                  </label>
                  <input
                    type="number"
                    name="yearsOfExperience"
                    value={editFormData.yearsOfExperience}
                    onChange={handleEditInputChange}
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-black"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Coaching Business Name
                  </label>
                  <input
                    type="text"
                    name="coachingBusinessName"
                    value={editFormData.coachingBusinessName}
                    onChange={handleEditInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-black"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={editFormData.location}
                    onChange={handleEditInputChange}
                    placeholder="City, State"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-black"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="status"
                    value={editFormData.status}
                    onChange={handleEditInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-black"
                  >
                    <option value="Active">Active</option>
                    <option value="Deactive">Deactive</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Certifications & Credentials
                  </label>
                  <textarea
                    name="certificationsCredentials"
                    value={editFormData.certificationsCredentials}
                    onChange={handleEditInputChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-black"
                    placeholder="List certifications, credentials, and achievements"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false);
                    setEditingItem(null);
                    setEditType('');
                    setError('');
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  disabled={editing}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={editing}
                >
                  {editing ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-black"
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-black"
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-black"
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-black"
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-black"
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-black"
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-black"
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-black"
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-black"
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-black"
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
                  className="flex-1 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={submitting}
                >
                  {submitting ? 'Adding...' : 'Add Coach'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
