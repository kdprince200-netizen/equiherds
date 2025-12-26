'use client';

import { useState, useEffect } from 'react';
import { getRequest, postRequest, putRequest, deleteRequest } from '../../../app/service';

export default function ClassesTab() {
  const [showAddClassModal, setShowAddClassModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [ratingClassId, setRatingClassId] = useState(null);
  const [ratingForm, setRatingForm] = useState({ rating: 0, comment: '' });
  const [editingItem, setEditingItem] = useState(null);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submittingRating, setSubmittingRating] = useState(false);
  const [user, setUser] = useState(null);
  const [newClass, setNewClass] = useState({
    title: '',
    instructor: '',
    category: '',
    level: '',
    day: '',
    time: '',
    duration: '',
    maxStudents: '',
    price: '',
    recurring: true,
    description: '',
    startDate: '',
    endDate: '',
    room: 'Main Training Area'
  });

  // Fetch user data and classes on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Get current user
        const userResponse = await getRequest('/api/auth/me');
        if (userResponse.success && userResponse.data) {
          setUser(userResponse.data);
          // Fetch classes for this user/club
          const classesResponse = await getRequest(`/api/classes?clubId=${userResponse.data._id}`);
          if (classesResponse.success) {
            setClasses(classesResponse.data || []);
          } else {
            setError(classesResponse.error || 'Failed to load classes');
          }
        } else {
          setError('Please login to view classes');
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load classes. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const fetchClasses = async () => {
    if (!user?._id) return;
    try {
      const response = await getRequest(`/api/classes?clubId=${user._id}`);
      if (response.success) {
        setClasses(response.data || []);
      }
    } catch (err) {
      console.error('Error fetching classes:', err);
    }
  };

  const handleEdit = (item) => {
    // Format dates for input fields (YYYY-MM-DD)
    const formatDate = (dateString) => {
      if (!dateString) return '';
      const date = new Date(dateString);
      return date.toISOString().split('T')[0];
    };

    setEditingItem({
      ...item,
      startDate: formatDate(item.startDate),
      endDate: formatDate(item.endDate),
      duration: item.duration?.toString() || '',
      maxStudents: item.maxStudents?.toString() || '',
      price: item.price?.toString() || ''
    });
    setShowEditModal(true);
  };

  const handleSaveEdit = async () => {
    if (!editingItem) return;

    try {
      setSubmitting(true);
      const updateData = {
        ...editingItem,
        duration: parseInt(editingItem.duration),
        maxStudents: parseInt(editingItem.maxStudents),
        price: editingItem.price ? parseFloat(editingItem.price) : 0
      };

      const response = await putRequest(`/api/classes/${editingItem._id}`, updateData);
      
      if (response.success) {
        await fetchClasses();
    setShowEditModal(false);
    setEditingItem(null);
      } else {
        alert(response.error || 'Failed to update class');
      }
    } catch (err) {
      console.error('Error updating class:', err);
      alert('Failed to update class. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (classId) => {
    if (!confirm('Are you sure you want to delete this class?')) return;

    try {
      const response = await deleteRequest(`/api/classes/${classId}`);
      if (response.success) {
        await fetchClasses();
      } else {
        alert(response.error || 'Failed to delete class');
      }
    } catch (err) {
      console.error('Error deleting class:', err);
      alert('Failed to delete class. Please try again.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!newClass.title || !newClass.instructor || !newClass.category || 
        !newClass.level || !newClass.day || !newClass.time || 
        !newClass.duration || !newClass.maxStudents || !newClass.startDate || 
        !newClass.endDate) {
      alert('Please fill in all required fields');
      return;
    }
    
    if (newClass.startDate && newClass.endDate && newClass.endDate < newClass.startDate) {
      alert('End date must be after start date');
      return;
    }

    try {
      setSubmitting(true);
      const classData = {
        ...newClass,
        duration: parseInt(newClass.duration),
        maxStudents: parseInt(newClass.maxStudents),
        price: newClass.price ? parseFloat(newClass.price) : 0
      };

      const response = await postRequest('/api/classes', classData);
      
      if (response.success) {
        await fetchClasses();
        setShowAddClassModal(false);
        setNewClass({
          title: '',
          instructor: '',
          category: '',
          level: '',
          day: '',
          time: '',
          duration: '',
          maxStudents: '',
          price: '',
          recurring: true,
          description: '',
          startDate: '',
          endDate: '',
          room: 'Main Training Area'
        });
      } else {
        alert(response.error || 'Failed to create class');
      }
    } catch (err) {
      console.error('Error creating class:', err);
      alert('Failed to create class. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const formatTime = (timeString) => {
    if (!timeString) return '';
    // If time is in HH:MM format, convert to 12-hour format
    if (timeString.includes(':')) {
      const [hours, minutes] = timeString.split(':');
      const hour = parseInt(hours);
      const ampm = hour >= 12 ? 'PM' : 'AM';
      const hour12 = hour % 12 || 12;
      return `${hour12}:${minutes} ${ampm}`;
    }
    return timeString;
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const getEnrolledCount = (classItem) => {
    if (!classItem.enrolledStudents) return 0;
    return classItem.enrolledStudents.filter(s => s.status === 'enrolled').length;
  };

  const handleOpenRatingModal = (classId) => {
    setRatingClassId(classId);
    setRatingForm({ rating: 0, comment: '' });
    setShowRatingModal(true);
  };

  const handleSubmitRating = async (e) => {
    e.preventDefault();
    
    if (!ratingForm.rating || ratingForm.rating < 1 || ratingForm.rating > 5) {
      alert('Please select a rating between 1 and 5 stars');
      return;
    }

    try {
      setSubmittingRating(true);
      const response = await postRequest(`/api/classes/${ratingClassId}/reviews`, {
        rating: ratingForm.rating,
        comment: ratingForm.comment
      });

      if (response.success) {
        await fetchClasses();
        setShowRatingModal(false);
        setRatingClassId(null);
        setRatingForm({ rating: 0, comment: '' });
      } else {
        alert(response.error || 'Failed to submit rating');
      }
    } catch (err) {
      console.error('Error submitting rating:', err);
      alert('Failed to submit rating. Please try again.');
    } finally {
      setSubmittingRating(false);
    }
  };

  const getUserReview = (classItem) => {
    if (!user?._id || !classItem.reviews) return null;
    return classItem.reviews.find(review => review.userId?._id === user._id || review.userId?.toString() === user._id);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-slate-600">Loading classes...</p>
      </div>
    );
  }

  return (
    <>
      <div>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-slate-900">Class Schedule</h3>
          <button 
            onClick={() => setShowAddClassModal(true)}
            className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors whitespace-nowrap">
            <i className="ri-add-line mr-2"></i>Add New Class
          </button>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        {classes.length === 0 ? (
          <div className="text-center py-12 bg-slate-50 rounded-lg">
            <p className="text-slate-600">No classes found. Create your first class to get started!</p>
          </div>
        ) : (
        <div className="space-y-4">
            {classes.map((classItem) => {
              const enrolledCount = getEnrolledCount(classItem);
              return (
                <div key={classItem._id} className="bg-slate-50 rounded-lg p-6">
              <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h4 className="text-lg font-bold text-slate-900">{classItem.title}</h4>
                      <p className="text-slate-600">Instructor: {classItem.instructor}</p>
                      <div className="flex gap-2 mt-2">
                        <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                    {classItem.level}
                  </span>
                        <span className="inline-block px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-semibold">
                          {classItem.category}
                        </span>
                        {classItem.rating > 0 && (
                          <span className="inline-block px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-semibold">
                            ⭐ {classItem.rating.toFixed(1)} ({classItem.ratingCount})
                          </span>
                        )}
                      </div>
                </div>
                <div className="flex gap-2">
                  <button 
                        onClick={() => handleOpenRatingModal(classItem._id)}
                        className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors whitespace-nowrap"
                        title="Add Rating & Review"
                      >
                        <i className="ri-star-line mr-2"></i>Rate
                      </button>
                      <button 
                        onClick={() => handleEdit(classItem)}
                    className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors whitespace-nowrap"
                  >
                    Edit
                  </button>
                      <button 
                        onClick={() => handleDelete(classItem._id)}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors whitespace-nowrap"
                      >
                        Delete
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-slate-600">Schedule:</span>
                  <p className="font-semibold text-slate-900">
                        {classItem.day} {formatTime(classItem.time)}
                      </p>
                      <p className="text-xs text-slate-500">
                        {formatDate(classItem.startDate)} - {formatDate(classItem.endDate)}
                  </p>
                </div>
                <div>
                  <span className="text-slate-600">Duration:</span>
                      <p className="font-semibold text-slate-900">{classItem.duration} min</p>
                </div>
                <div>
                  <span className="text-slate-600">Room:</span>
                      <p className="font-semibold text-slate-900">{classItem.room || 'Main Training Area'}</p>
                </div>
                <div>
                  <span className="text-slate-600">Enrollment:</span>
                  <p className="font-semibold text-slate-900">
                        {enrolledCount}/{classItem.maxStudents}
                  </p>
                </div>
              </div>
                  {classItem.description && (
                    <div className="mt-4 pt-4 border-t border-slate-200">
                    <p className="text-sm text-slate-600">{classItem.description}</p>
            </div>
                  )}
                  {classItem.reviews && classItem.reviews.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-slate-200">
                      <div className="flex items-center justify-between mb-3">
                        <h5 className="text-sm font-semibold text-slate-900">
                          Reviews ({classItem.reviews.length})
                        </h5>
                        {classItem.rating > 0 && (
                          <div className="flex items-center gap-1">
                            <span className="text-yellow-500 text-lg">⭐</span>
                            <span className="text-sm font-semibold text-slate-900">
                              {classItem.rating.toFixed(1)} / 5.0
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="space-y-3 max-h-48 overflow-y-auto">
                        {classItem.reviews.map((review, idx) => {
                          const reviewUser = review.userId || {};
                          const userName = reviewUser.firstName 
                            ? `${reviewUser.firstName} ${reviewUser.lastName || ''}`.trim()
                            : review.userName || 'Anonymous';
                          return (
                            <div key={review._id || idx} className="bg-white rounded-lg p-3 border border-slate-200">
                              <div className="flex items-center justify-between mb-1">
                                <div className="flex items-center gap-2">
                                  <span className="font-medium text-slate-900 text-sm">{userName}</span>
                                  <div className="flex items-center gap-1">
                                    {[...Array(5)].map((_, i) => (
                                      <span
                                        key={i}
                                        className={`text-sm ${
                                          i < review.rating ? 'text-yellow-500' : 'text-slate-300'
                                        }`}
                                      >
                                        ⭐
                                      </span>
          ))}
        </div>
                                </div>
                                <span className="text-xs text-slate-500">
                                  {review.createdAt 
                                    ? new Date(review.createdAt).toLocaleDateString()
                                    : ''}
                                </span>
                              </div>
                              {review.comment && (
                                <p className="text-slate-600 text-xs mt-1">{review.comment}</p>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                  {(!classItem.reviews || classItem.reviews.length === 0) && (
                    <div className="mt-4 pt-4 border-t border-slate-200">
                      <p className="text-sm text-slate-500">No reviews yet. Be the first to rate this class!</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Add New Class Modal */}
      {showAddClassModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
              <h3 className="text-xl font-bold text-slate-900">Add New Class</h3>
              <button
                onClick={() => {
                  setShowAddClassModal(false);
                  setNewClass({
                    title: '',
                    instructor: '',
                    category: '',
                    level: '',
                    day: '',
                    time: '',
                    duration: '',
                    maxStudents: '',
                    price: '',
                    recurring: true,
                    description: '',
                    startDate: '',
                    endDate: '',
                    room: 'Main Training Area'
                  });
                }}
                className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
              >
                <i className="ri-close-line text-2xl"></i>
              </button>
            </div>

            <form
              onSubmit={handleSubmit}
              className="p-6 space-y-6"
            >
              {/* Class Details Section */}
              <div>
                <h4 className="text-lg font-semibold text-slate-900 mb-4">Class Details</h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Class Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={newClass.title}
                      onChange={(e) => setNewClass({ ...newClass, title: e.target.value })}
                      placeholder="e.g., Advanced BJJ Techniques"
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Instructor Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={newClass.instructor}
                      onChange={(e) => setNewClass({ ...newClass, instructor: e.target.value })}
                      placeholder="e.g., John Smith"
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Category <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={newClass.category}
                        onChange={(e) => setNewClass({ ...newClass, category: e.target.value })}
                        className="w-full px-4 py-2 pr-8 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm cursor-pointer"
                        required
                      >
                        <option value="">Select category</option>
                        <option value="BJJ">Brazilian Jiu-Jitsu</option>
                        <option value="Muay Thai">Muay Thai</option>
                        <option value="Boxing">Boxing</option>
                        <option value="MMA">MMA</option>
                        <option value="Judo">Judo</option>
                        <option value="Karate">Karate</option>
                        <option value="Taekwondo">Taekwondo</option>
                        <option value="Wrestling">Wrestling</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Skill Level <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={newClass.level}
                        onChange={(e) => setNewClass({ ...newClass, level: e.target.value })}
                        className="w-full px-4 py-2 pr-8 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm cursor-pointer"
                        required
                      >
                        <option value="">Select level</option>
                        <option value="Beginner">Beginner</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Advanced">Advanced</option>
                        <option value="All Levels">All Levels</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Schedule Section */}
              <div>
                <h4 className="text-lg font-semibold text-slate-900 mb-4">Schedule</h4>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Class Start Date <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        value={newClass.startDate}
                        onChange={(e) => setNewClass({ ...newClass, startDate: e.target.value })}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm cursor-pointer"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Class End Date <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        value={newClass.endDate}
                        onChange={(e) => setNewClass({ ...newClass, endDate: e.target.value })}
                        min={newClass.startDate || undefined}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm cursor-pointer"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Day <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={newClass.day}
                        onChange={(e) => setNewClass({ ...newClass, day: e.target.value })}
                        className="w-full px-4 py-2 pr-8 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm cursor-pointer"
                        required
                      >
                        <option value="">Select day</option>
                        <option value="Monday">Monday</option>
                        <option value="Tuesday">Tuesday</option>
                        <option value="Wednesday">Wednesday</option>
                        <option value="Thursday">Thursday</option>
                        <option value="Friday">Friday</option>
                        <option value="Saturday">Saturday</option>
                        <option value="Sunday">Sunday</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Time <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="time"
                        value={newClass.time}
                        onChange={(e) => setNewClass({ ...newClass, time: e.target.value })}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm cursor-pointer"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Duration <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={newClass.duration}
                        onChange={(e) => setNewClass({ ...newClass, duration: e.target.value })}
                        className="w-full px-4 py-2 pr-8 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm cursor-pointer"
                        required
                      >
                        <option value="">Select</option>
                        <option value="30">30 min</option>
                        <option value="45">45 min</option>
                        <option value="60">60 min</option>
                        <option value="90">90 min</option>
                        <option value="120">120 min</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="recurring"
                      checked={newClass.recurring}
                      onChange={(e) => setNewClass({ ...newClass, recurring: e.target.checked })}
                      className="w-4 h-4 text-teal-600 border-slate-300 rounded focus:ring-teal-500 cursor-pointer"
                    />
                    <label htmlFor="recurring" className="text-sm text-slate-700 cursor-pointer">
                      Recurring weekly class
                    </label>
                  </div>
                </div>
              </div>

              {/* Capacity & Pricing Section */}
              <div>
                <h4 className="text-lg font-semibold text-slate-900 mb-4">Capacity & Pricing</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Max Students <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      value={newClass.maxStudents}
                      onChange={(e) => setNewClass({ ...newClass, maxStudents: e.target.value })}
                      placeholder="e.g., 20"
                      min="1"
                      max="100"
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Price per Class (Optional)
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">$</span>
                      <input
                        type="number"
                        value={newClass.price}
                        onChange={(e) => setNewClass({ ...newClass, price: e.target.value })}
                        placeholder="0.00"
                        min="0"
                        step="0.01"
                        className="w-full pl-8 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Room Section */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Room/Location (Optional)
                </label>
                <input
                  type="text"
                  value={newClass.room}
                  onChange={(e) => setNewClass({ ...newClass, room: e.target.value })}
                  placeholder="e.g., Main Training Area"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
                />
              </div>

              {/* Description Section */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Class Description (Optional)
                </label>
                <textarea
                  value={newClass.description}
                  onChange={(e) => {
                    if (e.target.value.length <= 500) {
                      setNewClass({ ...newClass, description: e.target.value });
                    }
                  }}
                  placeholder="Describe what students will learn in this class..."
                  rows={4}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm resize-none"
                />
                <div className="flex items-center justify-between mt-2">
                  <p className="text-xs text-slate-500">
                    Provide details about techniques, focus areas, or requirements
                  </p>
                  <span className="text-xs text-slate-500">
                    {newClass.description.length}/500
                  </span>
                </div>
              </div>

              {/* Info Box */}
              <div className="bg-teal-50 border border-teal-200 rounded-lg p-4">
                <div className="flex gap-3">
                  <i className="ri-information-line text-teal-600 text-xl flex-shrink-0"></i>
                  <div>
                    <p className="text-sm text-teal-900 font-medium mb-1">Class Visibility</p>
                    <p className="text-sm text-teal-700">
                      Once added, this class will be visible to all students. They can view the schedule and book available spots based on capacity.
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddClassModal(false);
                    setNewClass({
                      title: '',
                      instructor: '',
                      category: '',
                      level: '',
                      day: '',
                      time: '',
                      duration: '',
                      maxStudents: '',
                      price: '',
                      recurring: true,
                      description: '',
                      startDate: '',
                      endDate: '',
                      room: 'Main Training Area'
                    });
                  }}
                  className="flex-1 px-6 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 font-semibold transition-colors whitespace-nowrap cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 font-semibold transition-colors whitespace-nowrap cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <i className="ri-add-line mr-2"></i>{submitting ? 'Adding...' : 'Add Class'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && editingItem && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
              <h3 className="text-xl font-bold text-slate-900">Edit Class</h3>
                <button
                onClick={() => {
                  setShowEditModal(false);
                  setEditingItem(null);
                }}
                className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                >
                  <i className="ri-close-line text-2xl"></i>
                </button>
              </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSaveEdit();
              }}
              className="p-6 space-y-6"
            >
              {/* Class Details Section */}
              <div>
                <h4 className="text-lg font-semibold text-slate-900 mb-4">Class Details</h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Class Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={editingItem.title || ''}
                      onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Instructor Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={editingItem.instructor || ''}
                      onChange={(e) => setEditingItem({ ...editingItem, instructor: e.target.value })}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Category <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={editingItem.category || ''}
                        onChange={(e) => setEditingItem({ ...editingItem, category: e.target.value })}
                        className="w-full px-4 py-2 pr-8 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm cursor-pointer"
                        required
                      >
                        <option value="">Select category</option>
                        <option value="BJJ">Brazilian Jiu-Jitsu</option>
                        <option value="Muay Thai">Muay Thai</option>
                        <option value="Boxing">Boxing</option>
                        <option value="MMA">MMA</option>
                        <option value="Judo">Judo</option>
                        <option value="Karate">Karate</option>
                        <option value="Taekwondo">Taekwondo</option>
                        <option value="Wrestling">Wrestling</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Skill Level <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={editingItem.level || ''}
                        onChange={(e) => setEditingItem({ ...editingItem, level: e.target.value })}
                        className="w-full px-4 py-2 pr-8 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm cursor-pointer"
                        required
                      >
                        <option value="">Select level</option>
                        <option value="Beginner">Beginner</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Advanced">Advanced</option>
                        <option value="All Levels">All Levels</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Schedule Section */}
              <div>
                <h4 className="text-lg font-semibold text-slate-900 mb-4">Schedule</h4>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Class Start Date <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        value={editingItem.startDate || ''}
                        onChange={(e) => setEditingItem({ ...editingItem, startDate: e.target.value })}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm cursor-pointer"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Class End Date <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        value={editingItem.endDate || ''}
                        onChange={(e) => setEditingItem({ ...editingItem, endDate: e.target.value })}
                        min={editingItem.startDate || undefined}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm cursor-pointer"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Day <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={editingItem.day || ''}
                        onChange={(e) => setEditingItem({ ...editingItem, day: e.target.value })}
                        className="w-full px-4 py-2 pr-8 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm cursor-pointer"
                        required
                      >
                        <option value="">Select day</option>
                        <option value="Monday">Monday</option>
                        <option value="Tuesday">Tuesday</option>
                        <option value="Wednesday">Wednesday</option>
                        <option value="Thursday">Thursday</option>
                        <option value="Friday">Friday</option>
                        <option value="Saturday">Saturday</option>
                        <option value="Sunday">Sunday</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Time <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="time"
                        value={editingItem.time || ''}
                        onChange={(e) => setEditingItem({ ...editingItem, time: e.target.value })}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm cursor-pointer"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Duration (min) <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={editingItem.duration || ''}
                        onChange={(e) => setEditingItem({ ...editingItem, duration: e.target.value })}
                        className="w-full px-4 py-2 pr-8 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm cursor-pointer"
                        required
                      >
                        <option value="">Select</option>
                        <option value="30">30 min</option>
                        <option value="45">45 min</option>
                        <option value="60">60 min</option>
                        <option value="90">90 min</option>
                        <option value="120">120 min</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="edit-recurring"
                      checked={editingItem.recurring || false}
                      onChange={(e) => setEditingItem({ ...editingItem, recurring: e.target.checked })}
                      className="w-4 h-4 text-teal-600 border-slate-300 rounded focus:ring-teal-500 cursor-pointer"
                    />
                    <label htmlFor="edit-recurring" className="text-sm text-slate-700 cursor-pointer">
                      Recurring weekly class
                    </label>
                  </div>
                </div>
              </div>

              {/* Capacity & Pricing Section */}
              <div>
                <h4 className="text-lg font-semibold text-slate-900 mb-4">Capacity & Pricing</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Max Students <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      value={editingItem.maxStudents || ''}
                      onChange={(e) => setEditingItem({ ...editingItem, maxStudents: e.target.value })}
                      min="1"
                      max="100"
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Price per Class (Optional)
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">$</span>
                      <input
                        type="number"
                        value={editingItem.price || ''}
                        onChange={(e) => setEditingItem({ ...editingItem, price: e.target.value })}
                        placeholder="0.00"
                        min="0"
                        step="0.01"
                        className="w-full pl-8 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Description Section */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Class Description (Optional)
                </label>
                <textarea
                  value={editingItem.description || ''}
                  onChange={(e) => {
                    if (e.target.value.length <= 500) {
                      setEditingItem({ ...editingItem, description: e.target.value });
                    }
                  }}
                  placeholder="Describe what students will learn in this class..."
                  rows={4}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm resize-none"
                />
                <div className="flex items-center justify-between mt-2">
                  <p className="text-xs text-slate-500">
                    Provide details about techniques, focus areas, or requirements
                  </p>
                  <span className="text-xs text-slate-500">
                    {(editingItem.description || '').length}/500
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false);
                    setEditingItem(null);
                  }}
                  className="flex-1 px-6 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 font-semibold transition-colors whitespace-nowrap cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 font-semibold transition-colors whitespace-nowrap cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Rating & Review Modal */}
      {showRatingModal && ratingClassId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-lg w-full">
            <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
              <h3 className="text-xl font-bold text-slate-900">Rate & Review Class</h3>
              <button
                onClick={() => {
                  setShowRatingModal(false);
                  setRatingClassId(null);
                  setRatingForm({ rating: 0, comment: '' });
                }}
                className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
              >
                <i className="ri-close-line text-2xl"></i>
              </button>
            </div>

            <form onSubmit={handleSubmitRating} className="p-6 space-y-6">
              {/* Rating Selection */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-3">
                  Your Rating <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRatingForm({ ...ratingForm, rating: star })}
                      className={`text-4xl transition-transform hover:scale-110 ${
                        star <= ratingForm.rating
                          ? 'text-yellow-500'
                          : 'text-slate-300 hover:text-yellow-300'
                      }`}
                    >
                      ⭐
                    </button>
                  ))}
                </div>
                {ratingForm.rating > 0 && (
                  <p className="text-sm text-slate-600 mt-2">
                    You selected {ratingForm.rating} {ratingForm.rating === 1 ? 'star' : 'stars'}
                  </p>
                )}
              </div>

              {/* Comment Section */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Your Review (Optional)
                </label>
                <textarea
                  value={ratingForm.comment}
                  onChange={(e) => {
                    if (e.target.value.length <= 500) {
                      setRatingForm({ ...ratingForm, comment: e.target.value });
                    }
                  }}
                  placeholder="Share your experience with this class..."
                  rows={4}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm resize-none"
                />
                <div className="flex items-center justify-between mt-2">
                  <p className="text-xs text-slate-500">
                    Help others by sharing your experience
                  </p>
                  <span className="text-xs text-slate-500">
                    {ratingForm.comment.length}/500
                  </span>
                </div>
              </div>

              {/* Info Box */}
              <div className="bg-teal-50 border border-teal-200 rounded-lg p-4">
              <div className="flex gap-3">
                  <i className="ri-information-line text-teal-600 text-xl flex-shrink-0"></i>
                  <div>
                    <p className="text-sm text-teal-900 font-medium mb-1">Rating Guidelines</p>
                    <p className="text-sm text-teal-700">
                      Your rating and review will help other students make informed decisions. 
                      If you've already rated this class, your previous rating will be updated.
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => {
                    setShowRatingModal(false);
                    setRatingClassId(null);
                    setRatingForm({ rating: 0, comment: '' });
                  }}
                  className="flex-1 px-6 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 font-semibold transition-colors whitespace-nowrap cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingRating || ratingForm.rating === 0}
                  className="flex-1 px-6 py-3 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 font-semibold transition-colors whitespace-nowrap cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submittingRating ? 'Submitting...' : 'Submit Rating'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
