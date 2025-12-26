'use client';

import { useState, useEffect } from 'react';
import { getRequest, putRequest, uploadFile, uploadFiles } from '../../../app/service';

export default function SettingsTab() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    clubGymName: '',
    location: '',
    subscriptionCharges: ''
  });
  
  const [profileImage, setProfileImage] = useState(null);
  const [profileImagePreview, setProfileImagePreview] = useState(null);
  const [amenitiesTags, setAmenitiesTags] = useState([]);
  const [amenitiesInput, setAmenitiesInput] = useState('');
  const [clubImages, setClubImages] = useState([]); // existing URLs
  const [newClubImages, setNewClubImages] = useState([]); // File[]

  // Fetch user data on mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const response = await getRequest('/api/auth/me');
        if (response.success && response.data) {
          setUser(response.data);
          // Populate form with user data
          setFormData({
            firstName: response.data.firstName || '',
            lastName: response.data.lastName || '',
            email: response.data.email || '',
            phoneNumber: response.data.phoneNumber || '',
            clubGymName: response.data.clubGymName || '',
            location: response.data.location || '',
            subscriptionCharges:
              typeof response.data.subscriptionCharges === 'number'
                ? String(response.data.subscriptionCharges)
                : ''
          });
          setProfileImagePreview(response.data.profilePicture || null);

          const amenitiesStr = response.data.amenities || '';
          const tags = amenitiesStr
            .split(',')
            .map(t => t.trim())
            .filter(Boolean);
          setAmenitiesTags(tags);
          setAmenitiesInput('');

          setClubImages(Array.isArray(response.data.clubImages) ? response.data.clubImages : []);
          setNewClubImages([]);
        } else {
          setError('Failed to load user data');
        }
      } catch (err) {
        console.error('Error fetching user data:', err);
        setError('Failed to load settings. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
    setSuccess('');
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError('Please select an image file');
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size should be less than 5MB');
        return;
      }

      setProfileImage(file);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
      setError('');
      setSuccess('');
    }
  };

  const handleClubImagesChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      setNewClubImages(prev => [...prev, ...files]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      let profilePictureUrl = user?.profilePicture;

      // Upload profile image if a new one is selected
      if (profileImage) {
        profilePictureUrl = await uploadFile(profileImage);
      }

      // Prepare amenities string from tags
      const amenitiesString = amenitiesTags.join(', ');

      // Upload new club images if any
      let finalClubImages = clubImages;
      if (newClubImages.length > 0) {
        const uploadedUrls = await uploadFiles(newClubImages);
        finalClubImages = [...clubImages, ...uploadedUrls];
      }

      // Prepare update data
      const updateData = {
        ...formData,
        amenities: amenitiesString,
        clubImages: finalClubImages,
        subscriptionCharges:
          formData.subscriptionCharges !== ''
            ? Number(formData.subscriptionCharges)
            : undefined,
        profilePicture: profilePictureUrl
      };

      // Update user via API
      const response = await putRequest(`/api/users/${user._id}`, updateData);

      if (response.success) {
        setSuccess('Settings updated successfully!');
        // Update local user state
        setUser(response.data);
        // Clear image file after successful upload
        setProfileImage(null);
        setNewClubImages([]);
      } else {
        setError(response.error || 'Failed to update settings');
      }
    } catch (err) {
      console.error('Update error:', err);
      setError(err.message || 'An error occurred while updating settings');
    } finally {
      setSaving(false);
    }
  };

  const handleManageSubscription = () => {
    alert('Subscription management will be integrated with Stripe. Please connect Stripe to enable this feature.');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-slate-600">Loading settings...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="text-red-900">Failed to load user data. Please refresh the page.</div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
          {success}
        </div>
      )}

      {/* Profile Picture */}
      <div className="bg-white border border-slate-200 rounded-xl p-6">
        <h3 className="text-xl font-bold text-slate-900 mb-4">Profile Picture</h3>
        <div className="flex items-center gap-6">
          <div className="relative">
            {profileImagePreview ? (
              <>
                <img
                  src={profileImagePreview}
                  alt="Profile"
                  className="w-24 h-24 rounded-full object-cover border-2 border-slate-300"
                />
                <button
                  type="button"
                  onClick={() => {
                    setProfileImage(null);
                    setProfileImagePreview(user.profilePicture || null);
                  }}
                  disabled={saving}
                  className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs shadow disabled:bg-red-300"
                >
                  ×
                </button>
              </>
            ) : (
              <div className="w-24 h-24 rounded-full bg-slate-200 flex items-center justify-center border-2 border-slate-300">
                <i className="ri-user-line text-4xl text-slate-400"></i>
              </div>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Upload Profile Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100 cursor-pointer"
              disabled={saving}
            />
            <p className="text-xs text-slate-500 mt-1">Max size: 5MB. Supported formats: JPG, PNG, GIF</p>
          </div>
        </div>
      </div>

      {/* Personal Information */}
      <div className="bg-white border border-slate-200 rounded-xl p-6">
        <h3 className="text-xl font-bold text-slate-900 mb-4">Personal Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-2">First Name *</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              required
              disabled={saving}
              className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm disabled:bg-slate-100"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-2">Last Name *</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              required
              disabled={saving}
              className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm disabled:bg-slate-100"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-2">Email *</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              disabled={saving}
              className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm disabled:bg-slate-100"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-2">Phone Number</label>
            <input
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              disabled={saving}
              className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm disabled:bg-slate-100"
            />
          </div>
        </div>
      </div>

      {/* Club Information */}
      <div className="bg-white border border-slate-200 rounded-xl p-6">
        <h3 className="text-xl font-bold text-slate-900 mb-4">Club Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-2">
              Club/Gym Name *
            </label>
            <input
              type="text"
              name="clubGymName"
              value={formData.clubGymName}
              onChange={handleInputChange}
              required
              disabled={saving}
              className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm disabled:bg-slate-100"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-2">
              Location *
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              required
              disabled={saving}
              className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm disabled:bg-slate-100"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-2">
              Amenities (tags)
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={amenitiesInput}
                onChange={(e) => setAmenitiesInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    const value = amenitiesInput.trim();
                    if (value && !amenitiesTags.includes(value)) {
                      setAmenitiesTags((prev) => [...prev, value]);
                      setAmenitiesInput('');
                    }
                  }
                }}
                disabled={saving}
                className="flex-1 px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm disabled:bg-slate-100"
                placeholder="Type amenity and press Enter (e.g., Parking)"
              />
              <button
                type="button"
                onClick={() => {
                  const value = amenitiesInput.trim();
                  if (value && !amenitiesTags.includes(value)) {
                    setAmenitiesTags((prev) => [...prev, value]);
                    setAmenitiesInput('');
                  }
                }}
                disabled={saving}
                className="px-4 py-2 bg-teal-600 text-white rounded-lg text-sm font-medium hover:bg-teal-700 disabled:bg-teal-300"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {amenitiesTags.map((tag, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-2 px-3 py-1 bg-teal-100 text-teal-800 rounded-full text-xs"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() =>
                      setAmenitiesTags((prev) => prev.filter((t) => t !== tag))
                    }
                    disabled={saving}
                    className="text-teal-700 hover:text-teal-900 disabled:opacity-50"
                  >
                    ×
                  </button>
                </span>
              ))}
              {amenitiesTags.length === 0 && (
                <span className="text-xs text-slate-400">
                  No amenities added yet.
                </span>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-2">
              Subscription Charges / Month
            </label>
            <input
              type="number"
              name="subscriptionCharges"
              value={formData.subscriptionCharges}
              onChange={handleInputChange}
              min="0"
              step="0.01"
              disabled={saving}
              className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm disabled:bg-slate-100"
              placeholder="e.g., 99.99"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-slate-900 mb-2">
              Club Images
            </label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleClubImagesChange}
              disabled={saving}
              className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100 cursor-pointer disabled:opacity-50"
            />
            {/* Existing club images */}
            {clubImages.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-3">
                {clubImages.map((url, idx) => (
                  <div key={idx} className="relative">
                    <img
                      src={url}
                      alt={`Club ${idx + 1}`}
                      className="w-20 h-20 rounded-lg object-cover border border-slate-300"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setClubImages(prev => prev.filter((_, i) => i !== idx))
                      }
                      disabled={saving}
                      className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs shadow disabled:bg-red-300"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
            {/* Newly selected, not yet uploaded */}
            {newClubImages.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-3">
                {newClubImages.map((file, idx) => {
                  const objectUrl = URL.createObjectURL(file);
                  return (
                    <div key={idx} className="relative">
                      <img
                        src={objectUrl}
                        alt={`New club ${idx + 1}`}
                        className="w-20 h-20 rounded-lg object-cover border border-dashed border-slate-300"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setNewClubImages(prev => prev.filter((_, i) => i !== idx))
                        }
                        className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs shadow"
                      >
                        ×
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Account Status */}
      <div className="bg-white border border-slate-200 rounded-xl p-6">
        <h3 className="text-xl font-bold text-slate-900 mb-4">Account Status</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-500 mb-1">Subscription Status</label>
            <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
              user.subscriptionStatus === 'active' ? 'bg-green-100 text-green-800' :
              user.subscriptionStatus === 'expired' ? 'bg-red-100 text-red-800' :
              user.subscriptionStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' :
              'bg-slate-100 text-slate-800'
            }`}>
              {user.subscriptionStatus || 'N/A'}
            </span>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-500 mb-1">Auto Renewal</label>
            <p className="text-lg text-slate-900">{user.autoRenewalEnabled ? 'Enabled' : 'Disabled'}</p>
          </div>
        </div>
      </div>

      {/* Account Information */}
      <div className="bg-white border border-slate-200 rounded-xl p-6">
        <h3 className="text-xl font-bold text-slate-900 mb-4">Account Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-500 mb-1">Member Since</label>
            <p className="text-lg text-slate-900">{formatDate(user.createdAt)}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-500 mb-1">Last Updated</label>
            <p className="text-lg text-slate-900">{formatDate(user.updatedAt)}</p>
          </div>
        </div>
      </div>

      {/* Subscription Management */}
      <div className="bg-white border border-slate-200 rounded-xl p-6">
        <h3 className="text-xl font-bold text-slate-900 mb-4">Subscription</h3>
        <div className="bg-slate-50 rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h4 className="font-semibold text-slate-900">
                Current Plan: {user.subscriptionPlan || 'N/A'}
              </h4>
              {user.subscriptionExpiry && (
                <p className="text-sm text-slate-600">
                  Renews on {new Date(user.subscriptionExpiry).toLocaleDateString()}
                </p>
              )}
            </div>
            <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
              user.subscriptionStatus === 'active' ? 'bg-green-100 text-green-700' :
              user.subscriptionStatus === 'expired' ? 'bg-red-100 text-red-700' :
              'bg-yellow-100 text-yellow-700'
            }`}>
              {user.subscriptionStatus || 'N/A'}
            </span>
          </div>
          <button
            type="button"
            onClick={handleManageSubscription}
            className="w-full bg-teal-600 hover:bg-teal-700 text-white py-3 px-6 rounded-lg font-semibold transition-colors whitespace-nowrap"
          >
            Manage Subscription
          </button>
        </div>
      </div>

      {/* Save Button */}
      <button 
        type="submit"
        disabled={saving}
        className="w-full bg-slate-900 hover:bg-slate-800 text-white py-3 px-6 rounded-lg font-semibold transition-colors whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {saving ? 'Saving...' : 'Save Changes'}
      </button>
    </form>
  );
}
