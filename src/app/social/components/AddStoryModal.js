"use client";

import { useState, useEffect } from 'react';
import { getUserData } from '@/app/utils/localStorage';
import { uploadFiles, uploadVideos } from '@/service';

export default function AddStoryModal({ isOpen, onClose, onSubmit }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [fileType, setFileType] = useState(null); // 'image' or 'video'
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setSelectedFile(null);
      setFilePreview(null);
      setFileType(null);
    }
  }, [isOpen]);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      
      // Determine file type
      if (file.type.startsWith('image/')) {
        setFileType('image');
        const previewUrl = URL.createObjectURL(file);
        setFilePreview(previewUrl);
      } else if (file.type.startsWith('video/')) {
        setFileType('video');
        const previewUrl = URL.createObjectURL(file);
        setFilePreview(previewUrl);
      } else {
        alert('Please select an image or video file');
        setSelectedFile(null);
        setFileType(null);
        setFilePreview(null);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedFile || !fileType) {
      alert('Please select an image or video file.');
      return;
    }

    // Ensure userId is set from logged-in user
    const userData = getUserData();
    const userId = userData?.id || userData?._id;
    
    if (!userId) {
      alert('Please log in to create a story.');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      let mediaUrl;
      
      // Upload file based on type
      if (fileType === 'image') {
        const uploadedUrls = await uploadFiles([selectedFile]);
        mediaUrl = uploadedUrls[0];
      } else if (fileType === 'video') {
        const uploadedUrls = await uploadVideos([selectedFile]);
        mediaUrl = uploadedUrls[0];
      }
      
      if (!mediaUrl) {
        throw new Error('Failed to upload file');
      }

      // Submit story with uploaded URL
      await onSubmit({
        userId: userId,
        media: mediaUrl,
        type: fileType
      });
      
      // Reset form
      setSelectedFile(null);
      setFilePreview(null);
      setFileType(null);
      
      // Clean up preview URL
      if (filePreview) {
        URL.revokeObjectURL(filePreview);
      }
      
      onClose();
    } catch (error) {
      console.error('Error submitting story:', error);
      alert('Failed to create story. Please try again.');
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
          <h3 className="text-2xl font-bold text-gray-900">Create New Story</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors w-8 h-8 flex items-center justify-center"
          >
            <i className="ri-close-line text-2xl"></i>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="media" className="block text-sm font-medium text-gray-700 mb-2">
              Image or Video <span className="text-red-500">*</span>
            </label>
            <input
              type="file"
              id="media"
              name="media"
              accept="image/*,video/*"
              onChange={handleFileChange}
              required
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-teal-500"
            />
            <p className="mt-2 text-xs text-gray-500">
              Select an image or video file to share as your story
            </p>
          </div>

          {filePreview && (
            <div className="mt-4">
              {fileType === 'image' ? (
                <div className="w-full h-96 rounded-xl overflow-hidden border border-gray-200">
                  <img 
                    src={filePreview} 
                    alt="Preview" 
                    className="w-full h-full object-contain"
                  />
                </div>
              ) : (
                <div className="w-full h-96 rounded-xl overflow-hidden border border-gray-200 bg-black">
                  <video 
                    src={filePreview} 
                    controls
                    className="w-full h-full object-contain"
                  />
                </div>
              )}
            </div>
          )}

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
              disabled={isSubmitting || !selectedFile}
              className="flex-1 bg-teal-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Uploading...' : 'Create Story'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}


