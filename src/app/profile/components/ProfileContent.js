'use client';

import { useState, useEffect } from 'react';
import { putRequest, uploadFile, uploadFiles } from '../../service';
import Button from '../../../components/base/Button';

export default function ProfileContent({ user, onUpdate }) {
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [amenitiesTags, setAmenitiesTags] = useState([]);
  const [amenitiesInput, setAmenitiesInput] = useState('');
  const [clubImages, setClubImages] = useState([]); // existing URLs
  const [newClubImages, setNewClubImages] = useState([]); // File[]

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phoneNumber: user.phoneNumber || '',
        clubGymName: user.clubGymName || '',
        location: user.location || '',
        subscriptionCharges:
          typeof user.subscriptionCharges === 'number'
            ? String(user.subscriptionCharges)
            : ''
      });
      setProfileImagePreview(user.profilePicture || null);

      const amenitiesStr = user.amenities || '';
      const tags = amenitiesStr
        .split(',')
        .map(t => t.trim())
        .filter(Boolean);
      setAmenitiesTags(tags);
      setAmenitiesInput('');

      setClubImages(Array.isArray(user.clubImages) ? user.clubImages : []);
      setNewClubImages([]);
    }
  }, [user]);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const getAccountTypeLabel = (type) => {
    const labels = {
      'student': 'Student',
      'coach': 'Coach',
      'club': 'Club Owner',
      'vendor': 'Vendor',
      'superAdmin': 'Super Admin'
    };
    return labels[type] || type;
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
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Please select an image file');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size should be less than 5MB');
        return;
      }

      setProfileImage(file);
      
      // Create preview
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
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      let profilePictureUrl = user.profilePicture;

      // Upload image if a new one is selected
      if (profileImage) {
        profilePictureUrl = await uploadFile(profileImage);
      }

      // Prepare amenities string from tags
      const amenitiesString = amenitiesTags.join(', ');

      // Upload new club images if any (for club accounts)
      let finalClubImages = clubImages;
      if (user.accountType === 'club' && newClubImages.length > 0) {
        const uploadedUrls = await uploadFiles(newClubImages);
        finalClubImages = [...clubImages, ...uploadedUrls];
      }

      // Prepare update data
      const updateData = {
        ...formData,
        amenities: amenitiesString,
        clubImages: user.accountType === 'club' ? finalClubImages : undefined,
        subscriptionCharges:
          formData.subscriptionCharges !== ''
            ? Number(formData.subscriptionCharges)
            : undefined,
        profilePicture: profilePictureUrl
      };

      // Update user via API
      const response = await putRequest(`/api/users/${user._id}`, updateData);

      if (response.success) {
        setSuccess('Profile updated successfully!');
        // Call onUpdate callback to refresh user data
        if (onUpdate) {
          onUpdate(response.data);
        }
        // Clear image file after successful upload
        setProfileImage(null);
      } else {
        setError(response.error || 'Failed to update profile');
      }
    } catch (err) {
      console.error('Update error:', err);
      setError(err.message || 'An error occurred while updating your profile');
    } finally {
      setLoading(false);
    }
  };

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

      {/* Profile Image */}
      <div className="border-b pb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Profile Picture</h2>
        <div className="flex items-center gap-6">
          <div className="relative">
            {profileImagePreview ? (
              <>
                <img
                  src={profileImagePreview}
                  alt="Profile"
                  className="w-24 h-24 rounded-full object-cover border-2 border-gray-300"
                />
                <button
                  type="button"
                  onClick={() => {
                    setProfileImage(null);
                    setProfileImagePreview(null);
                  }}
                  disabled={loading}
                  className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs shadow disabled:bg-red-300"
                >
                  ×
                </button>
              </>
            ) : (
              <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center border-2 border-gray-300">
                <i className="ri-user-line text-4xl text-gray-400"></i>
              </div>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload Profile Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
              disabled={loading}
            />
            <p className="text-xs text-gray-500 mt-1">Max size: 5MB. Supported formats: JPG, PNG, GIF</p>
          </div>
        </div>
      </div>

      {/* Personal Information */}
      <div className="border-b pb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Personal Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">First Name *</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              required
              disabled={loading}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm text-black disabled:bg-gray-100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Last Name *</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              required
              disabled={loading}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm text-black disabled:bg-gray-100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              disabled={loading}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm text-black disabled:bg-gray-100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
            <input
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              disabled={loading}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm text-black disabled:bg-gray-100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">Account Type</label>
            <p className="text-lg text-gray-900">{getAccountTypeLabel(user.accountType)}</p>
          </div>
          {user.parentClubId && (
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Assigned Club</label>
              <p className="text-lg text-gray-900">
                {typeof user.parentClubId === 'object' && user.parentClubId.clubGymName 
                  ? user.parentClubId.clubGymName 
                  : 'N/A'}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Student-specific fields */}
      {user.accountType === 'student' && (
        <div className="border-b pb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Student Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Grappling Experience</label>
              <p className="text-lg text-gray-900">{user.grapplingExperience || 'N/A'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Training Goals</label>
              <p className="text-lg text-gray-900">{user.trainingGoals || 'N/A'}</p>
            </div>
          </div>
        </div>
      )}

      {/* Coach-specific fields */}
      {user.accountType === 'coach' && (
        <div className="border-b pb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Coach Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Business Name</label>
              <p className="text-lg text-gray-900">{user.coachingBusinessName || 'N/A'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Years of Experience</label>
              <p className="text-lg text-gray-900">{user.yearsOfExperience || 'N/A'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Location</label>
              <p className="text-lg text-gray-900">{user.location || 'N/A'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Certifications</label>
              <p className="text-lg text-gray-900">{user.certificationsCredentials || 'N/A'}</p>
            </div>
          </div>
        </div>
      )}

      {/* Club-specific fields */}
      {user.accountType === 'club' && (
        <div className="border-b pb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Club Information </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Club/Gym Name
              </label>
              <input
                type="text"
                name="clubGymName"
                value={formData.clubGymName}
                onChange={handleInputChange}
                disabled={loading}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm text-black disabled:bg-gray-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                disabled={loading}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm text-black disabled:bg-gray-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
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
                  disabled={loading}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm text-black disabled:bg-gray-100"
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
                  disabled={loading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:bg-blue-300"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {amenitiesTags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() =>
                        setAmenitiesTags((prev) => prev.filter((t) => t !== tag))
                      }
                      className="text-blue-700 hover:text-blue-900"
                    >
                      ×
                    </button>
                  </span>
                ))}
                {amenitiesTags.length === 0 && (
                  <span className="text-xs text-gray-400">
                    No amenities added yet.
                  </span>
                )}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subscription Charges / Month
              </label>
              <input
                type="number"
                name="subscriptionCharges"
                value={formData.subscriptionCharges}
                onChange={handleInputChange}
                min="0"
                step="0.01"
                disabled={loading}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm text-black disabled:bg-gray-100"
                placeholder="e.g., 99.99"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Club Images
              </label>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleClubImagesChange}
                disabled={loading}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
              />
              {/* Existing club images */}
              {clubImages.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-3">
                  {clubImages.map((url, idx) => (
                    <div key={idx} className="relative">
                      <img
                        src={url}
                        alt={`Club ${idx + 1}`}
                        className="w-20 h-20 rounded-lg object-cover border border-gray-300"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setClubImages(prev => prev.filter((_, i) => i !== idx))
                        }
                        className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs shadow"
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
                          className="w-20 h-20 rounded-lg object-cover border border-dashed border-gray-300"
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
      )}

      {/* Vendor-specific fields */}
      {user.accountType === 'vendor' && (
        <div className="border-b pb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Vendor Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Company Name</label>
              <p className="text-lg text-gray-900">{user.companyName || 'N/A'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Business Type</label>
              <p className="text-lg text-gray-900">{user.businessType || 'N/A'}</p>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-500 mb-1">Business Description</label>
              <p className="text-lg text-gray-900">{user.businessDescription || 'N/A'}</p>
            </div>
          </div>
        </div>
      )}

      {/* Account Status */}
      <div className="border-b pb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Account Status</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">Subscription Status</label>
            <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
              user.subscriptionStatus === 'active' ? 'bg-green-100 text-green-800' :
              user.subscriptionStatus === 'expired' ? 'bg-red-100 text-red-800' :
              user.subscriptionStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              {user.subscriptionStatus || 'N/A'}
            </span>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">Auto Renewal</label>
            <p className="text-lg text-gray-900">{user.autoRenewalEnabled ? 'Enabled' : 'Disabled'}</p>
          </div>
        </div>
      </div>

      {/* Account Dates */}
      <div className="border-b pb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Account Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">Member Since</label>
            <p className="text-lg text-gray-900">{formatDate(user.createdAt)}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">Last Updated</label>
            <p className="text-lg text-gray-900">{formatDate(user.updatedAt)}</p>
          </div>
        </div>
      </div>

      {/* Update Button */}
      <div className="flex justify-end pt-4">
        <Button
          type="submit"
          size="lg"
          disabled={loading}
          className="min-w-[150px]"
        >
          {loading ? 'Updating...' : 'Update Profile'}
        </Button>
      </div>
    </form>
  );
}

