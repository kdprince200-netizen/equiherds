"use client";

import { useState, useEffect } from 'react';
import { getUserData } from '@/app/utils/localStorage';
import { uploadFiles } from '@/service';

export default function AddPostModal({ isOpen, onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    userId: '',
    description: '',
    dateTime: '',
    image: ''
  });
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const userData = getUserData();
      const userId = userData?.id || userData?._id || '';
      const now = new Date();
      const dateTimeLocal = now.toISOString().slice(0, 16); // Format for datetime-local input
      
      setFormData({
        userId: userId,
        description: '',
        dateTime: dateTimeLocal,
        image: ''
      });
      setSelectedImage(null);
      setImagePreview(null);
    }
  }, [isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      // Create preview
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Ensure userId is set from logged-in user
    const userData = getUserData();
    const userId = userData?.id || userData?._id;
    
    if (!userId) {
      alert('Please log in to create a post.');
      return;
    }

    if (!selectedImage) {
      alert('Please select an image.');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Upload image file and get URL
      const uploadedUrls = await uploadFiles([selectedImage]);
      const imageUrl = uploadedUrls[0]; // Get first URL from array
      
      if (!imageUrl) {
        throw new Error('Failed to upload image');
      }

      // Include userId and uploaded image URL in the payload
      await onSubmit({
        ...formData,
        userId: userId,
        image: imageUrl
      });
      
      // Reset form
      const now = new Date();
      const dateTimeLocal = now.toISOString().slice(0, 16);
      setFormData({
        userId: userId,
        description: '',
        dateTime: dateTimeLocal,
        image: ''
      });
      setSelectedImage(null);
      setImagePreview(null);
      
      // Clean up preview URL
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
      
      onClose();
    } catch (error) {
      console.error('Error submitting post:', error);
      alert('Failed to create post. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" 
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto" 
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-gray-900">Create New Post</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors w-8 h-8 flex items-center justify-center"
          >
            <i className="ri-close-line text-2xl"></i>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows={4}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-teal-500 resize-none"
              placeholder="What's on your mind?"
            />
          </div>

          <div>
            <label htmlFor="dateTime" className="block text-sm font-medium text-gray-700 mb-2">
              Date and Time <span className="text-red-500">*</span>
            </label>
            <input
              type="datetime-local"
              id="dateTime"
              name="dateTime"
              value={formData.dateTime}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div>
            <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-2">
              Image <span className="text-red-500">*</span>
            </label>
            <input
              type="file"
              id="image"
              name="image"
              accept="image/*"
              onChange={handleImageChange}
              required
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-teal-500"
            />
            {imagePreview && (
              <div className="mt-3">
                <img 
                  src={imagePreview} 
                  alt="Preview" 
                  className="w-full h-48 object-cover rounded-xl border border-gray-200"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              </div>
            )}
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 rounded-xl font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-teal-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Creating...' : 'Create Post'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

