'use client';

import { useState, useEffect, useRef } from 'react';
import { getRequest, postRequest, putRequest, uploadVideos } from '../../../app/service';

export default function RecordedSessionsTab() {
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingSession, setEditingSession] = useState(null);
  const [uploadForm, setUploadForm] = useState({
    title: '',
    description: '',
    category: 'technique',
    level: 'beginner',
    duration: '',
    isPaid: false,
    price: '',
    videoFiles: [] // Changed to array for multiple files
  });
  const [editForm, setEditForm] = useState({
    title: '',
    description: '',
    category: 'technique',
    level: 'beginner',
    duration: '',
    isPaid: false,
    price: '',
    status: 'Pending',
    videoUrls: []
  });
  const [recordedSessions, setRecordedSessions] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const fileInputRef = useRef(null);

  // Fetch user and sessions on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Get current user
        const userResponse = await getRequest('/api/auth/me');
        if (userResponse.success && userResponse.data) {
          setUser(userResponse.data);
          // Fetch recorded sessions for this club
          const sessionsResponse = await getRequest(`/api/recorded-sessions?clubId=${userResponse.data._id}`);
          if (sessionsResponse.success) {
            setRecordedSessions(sessionsResponse.data || []);
          } else {
            setError(sessionsResponse.error || 'Failed to load sessions');
          }
          
        } else {
          setError('Please login to view sessions');
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load sessions. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const fetchSessions = async () => {
    if (!user?._id) return;
    try {
      const response = await getRequest(`/api/recorded-sessions?clubId=${user._id}`);
      if (response.success) {
        setRecordedSessions(response.data || []);
      }
    } catch (err) {
      console.error('Error fetching sessions:', err);
    }
  };

  // Mock data for fallback (can be removed once API is fully working)
  const mockRecordedSessions = [
    {
      id: 1,
      title: 'Advanced Guard Passing Techniques',
      coach: 'Marcus Silva',
      category: 'Technique',
      level: 'Advanced',
      duration: '45 min',
      uploadDate: '2024-02-10',
      status: 'Approved',
      isPaid: true,
      price: 29.99,
      views: 1234,
      revenue: 2468.66,
      subscribers: 82,
      rating: 4.9,
      thumbnail: 'https://readdy.ai/api/search-image?query=professional%20brazilian%20jiu%20jitsu%20instructor%20demonstrating%20guard%20pass%20technique%20in%20modern%20training%20facility%20with%20clean%20white%20background%20high%20quality%20sports%20photography&width=400&height=225&seq=club1&orientation=landscape'
    },
    {
      id: 2,
      title: 'Fundamentals: Escapes and Defense',
      coach: 'Sarah Thompson',
      category: 'Fundamentals',
      level: 'Beginner',
      duration: '60 min',
      uploadDate: '2024-02-08',
      status: 'Approved',
      isPaid: false,
      price: 0,
      views: 2156,
      revenue: 0,
      subscribers: 145,
      rating: 4.8,
      thumbnail: 'https://readdy.ai/api/search-image?query=martial%20arts%20instructor%20teaching%20defensive%20escape%20techniques%20in%20professional%20gym%20setting%20with%20simple%20clean%20background%20sports%20training%20photography&width=400&height=225&seq=club2&orientation=landscape'
    },
    {
      id: 3,
      title: 'No-Gi Grappling Fundamentals',
      coach: 'Diego Rodriguez',
      category: 'Technique',
      level: 'Intermediate',
      duration: '50 min',
      uploadDate: '2024-02-01',
      status: 'Pending',
      isPaid: true,
      price: 24.99,
      views: 0,
      revenue: 0,
      subscribers: 0,
      rating: 0,
      thumbnail: 'https://readdy.ai/api/search-image?query=no%20gi%20grappling%20training%20session%20in%20modern%20martial%20arts%20gym%20with%20clean%20simple%20background%20professional%20sports%20photography&width=400&height=225&seq=club3&orientation=landscape'
    },
    {
      id: 4,
      title: 'Strength Training for Grapplers',
      coach: 'Alex Martinez',
      category: 'Conditioning',
      level: 'All Levels',
      duration: '40 min',
      uploadDate: '2024-01-25',
      status: 'Rejected',
      isPaid: false,
      price: 0,
      views: 0,
      revenue: 0,
      subscribers: 0,
      rating: 0,
      rejectionReason: 'Audio quality needs improvement. Please re-record with better microphone setup.',
      thumbnail: 'https://readdy.ai/api/search-image?query=athletic%20person%20doing%20strength%20training%20exercises%20for%20grappling%20in%20clean%20modern%20gym%20with%20simple%20background%20fitness%20photography&width=400&height=225&seq=club4&orientation=landscape'
    }
  ];

  // Use fetched sessions or fallback to mock data
  const displaySessions = recordedSessions.length > 0 ? recordedSessions : mockRecordedSessions;

  const totalSessionRevenue = displaySessions
    .filter(s => s.status === 'Active')
    .reduce((sum, s) => sum + (s.revenue || 0), 0);

  const totalSessionViews = displaySessions
    .filter(s => s.status === 'Active')
    .reduce((sum, s) => sum + (s.views || 0), 0);

  const totalSessionSubscribers = displaySessions
    .filter(s => s.status === 'Active')
    .reduce((sum, s) => sum + (s.subscribers || 0), 0);

  const handleEdit = (session) => {
    setEditingSession(session);
    setEditForm({
      title: session.title || '',
      description: session.description || '',
      category: session.category || 'technique',
      level: session.level || 'beginner',
      duration: session.duration?.toString() || '',
      isPaid: session.isPaid || false,
      price: session.price?.toString() || '',
      status: session.status || 'Pending',
      videoUrls: session.videoUrls || (session.videoUrl ? [session.videoUrl] : [])
    });
    setShowEditModal(true);
    setError('');
    setSuccess('');
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);
    setError('');
    setSuccess('');

    try {
      const payload = {
        title: editForm.title,
        description: editForm.description,
        category: editForm.category,
        level: editForm.level,
        duration: parseInt(editForm.duration, 10),
        isPaid: editForm.isPaid,
        price: editForm.isPaid ? parseFloat(editForm.price) : 0,
        status: editForm.status,
        videoUrls: editForm.videoUrls,
      };

      if (editForm.videoUrls && editForm.videoUrls.length > 0) {
        payload.videoUrl = editForm.videoUrls[0];
      }

      const result = await putRequest(`/api/recorded-sessions/${editingSession._id || editingSession.id}`, payload);

      if (result.success) {
        setSuccess(result.message || 'Session updated successfully!');
        setShowEditModal(false);
        setEditingSession(null);
        // Refresh sessions list
        await fetchSessions();
      } else {
        setError(result.error || 'Failed to update session');
      }
    } catch (err) {
      console.error('Update error:', err);
      setError(err.message || 'An error occurred while updating the session');
    } finally {
      setUpdating(false);
    }
  };

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);
    setError('');
    setSuccess('');

    try {
      // Validate video files
      if (!uploadForm.videoFiles || uploadForm.videoFiles.length === 0) {
        setError('Please select at least one video file');
        setUploading(false);
        return;
      }

      // Step 1: Upload all video files
      let videoUrls = [];
      try {
        const uploadedUrls = await uploadVideos(uploadForm.videoFiles);
        if (Array.isArray(uploadedUrls) && uploadedUrls.length > 0) {
          videoUrls = uploadedUrls;
        } else if (typeof uploadedUrls === 'string') {
          videoUrls = [uploadedUrls];
        } else {
          throw new Error('Failed to get video URLs from upload response');
        }
      } catch (uploadError) {
        console.error('Video upload error:', uploadError);
        setError(`Video upload failed: ${uploadError.message}`);
        setUploading(false);
        return;
      }

      // Step 2: Prepare payload with video URLs
      // For backward compatibility, use first video URL as primary
      const payload = {
        title: uploadForm.title,
        description: uploadForm.description,
        category: uploadForm.category,
        level: uploadForm.level,
        duration: parseInt(uploadForm.duration, 10),
        isPaid: uploadForm.isPaid,
        price: uploadForm.isPaid ? parseFloat(uploadForm.price) : 0,
        videoUrl: videoUrls[0], // Primary video URL (first one)
        videoUrls: videoUrls, // Array of all video URLs
      };

      if (user?._id) {
        payload.clubId = user._id;
        payload.createdBy = user._id;
      }

      if (user?.firstName && user?.lastName) {
        payload.coach = `${user.firstName} ${user.lastName}`;
      }

      // Step 3: Send payload to API using postRequest
      const result = await postRequest('/api/recorded-sessions', payload);

      if (result.success) {
        setSuccess(result.message || 'Session uploaded successfully! It will be reviewed by admin within 24-48 hours.');
        setShowUploadModal(false);
        setUploadForm({
          title: '',
          description: '',
          category: 'technique',
          level: 'beginner',
          duration: '',
          isPaid: false,
          price: '',
          videoFiles: []
        });
        // Reset file input
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        // Refresh sessions list
        await fetchSessions();
      } else {
        setError(result.error || 'Failed to upload session');
      }
    } catch (err) {
      console.error('Upload error:', err);
      setError(err.message || 'An error occurred while uploading the session');
    } finally {
      setUploading(false);
    }
  };

  // Format duration for display
  const formatDuration = (minutes) => {
    if (typeof minutes === 'number') {
      return `${minutes} min`;
    }
    return minutes || 'N/A';
  };

  // Format category for display (capitalize first letter)
  const formatCategory = (category) => {
    if (!category) return '';
    return category.split(' ').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  // Format level for display (capitalize first letter)
  const formatLevel = (level) => {
    if (!level) return '';
    return level.split(' ').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-slate-600">Loading sessions...</div>
      </div>
    );
  }

  return (
    <>
      <div>
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-slate-900">Club Recorded Sessions</h3>
          <button
            onClick={() => setShowUploadModal(true)}
            className="px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors whitespace-nowrap flex items-center gap-2"
          >
            <i className="ri-upload-cloud-line text-xl"></i>
            Upload New Session
          </button>
        </div>

        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-start gap-2">
              <i className="ri-error-warning-line text-red-600 mt-0.5"></i>
              <div className="text-sm text-red-900">{error}</div>
            </div>
          </div>
        )}

        {success && (
          <div className="mb-4 bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-start gap-2">
              <i className="ri-checkbox-circle-line text-green-600 mt-0.5"></i>
              <div className="text-sm text-green-900">{success}</div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-4 gap-6 mb-6">
          <div className="bg-slate-50 rounded-lg p-4">
            <div className="text-sm text-slate-600 mb-1">Total Sessions</div>
            <div className="text-2xl font-bold text-slate-900">{displaySessions.length}</div>
          </div>
          <div className="bg-slate-50 rounded-lg p-4">
            <div className="text-sm text-slate-600 mb-1">Total Views</div>
            <div className="text-2xl font-bold text-slate-900">{totalSessionViews.toLocaleString()}</div>
          </div>
          <div className="bg-slate-50 rounded-lg p-4">
            <div className="text-sm text-slate-600 mb-1">Total Revenue</div>
            <div className="text-2xl font-bold text-green-600">${totalSessionRevenue.toLocaleString()}</div>
          </div>
          <div className="bg-slate-50 rounded-lg p-4">
            <div className="text-sm text-slate-600 mb-1">Subscribers</div>
            <div className="text-2xl font-bold text-slate-900">{totalSessionSubscribers}</div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          {displaySessions.map((session) => (
            <div key={session._id || session.id} className="bg-white border border-slate-200 rounded-xl overflow-hidden">
              <div className="relative">
                {session.thumbnail ? (
                  <img 
                    src={session.thumbnail} 
                    alt={session.title}
                    className="w-full h-48 object-cover object-top"
                  />
                ) : (
                  <div className="w-full h-48 bg-slate-200 flex items-center justify-center">
                    <i className="ri-video-line text-4xl text-slate-400"></i>
                  </div>
                )}
                <div className="absolute top-3 right-3 bg-black/70 text-white px-3 py-1 rounded-lg text-sm font-semibold">
                  {formatDuration(session.duration)}
                </div>
                <div className={`absolute top-3 left-3 px-3 py-1 rounded-lg text-sm font-semibold ${
                  session.status === 'Active' ? 'bg-green-600 text-white' :
                  session.status === 'Pending' ? 'bg-yellow-600 text-white' :
                  'bg-gray-600 text-white'
                }`}>
                  {session.status}
                </div>
              </div>
              <div className="p-4">
                <h4 className="font-bold text-slate-900 text-lg mb-2">{session.title}</h4>
                {session.coach && (
                  <div className="text-sm text-slate-600 mb-3">Coach: {session.coach}</div>
                )}
                <div className="flex items-center gap-4 mb-3 text-sm text-slate-600">
                  <span className="px-2 py-1 bg-slate-100 rounded text-xs font-semibold">
                    {formatCategory(session.category)}
                  </span>
                  <span className="px-2 py-1 bg-slate-100 rounded text-xs font-semibold">
                    {formatLevel(session.level)}
                  </span>
                  {session.isPaid ? (
                    <span className="text-green-600 font-semibold">${session.price}</span>
                  ) : (
                    <span className="text-blue-600 font-semibold">Free</span>
                  )}
                </div>

                {session.status === 'Active' && (
                  <div className="grid grid-cols-3 gap-3 mb-4 text-sm">
                    <div className="bg-slate-50 rounded p-2 text-center">
                      <div className="text-slate-600 text-xs">Views</div>
                      <div className="font-bold text-slate-900">{session.views || 0}</div>
                    </div>
                    <div className="bg-slate-50 rounded p-2 text-center">
                      <div className="text-slate-600 text-xs">Subscribers</div>
                      <div className="font-bold text-slate-900">{session.subscribers || 0}</div>
                    </div>
                    <div className="bg-slate-50 rounded p-2 text-center">
                      <div className="text-slate-600 text-xs">Revenue</div>
                      <div className="font-bold text-green-600">${(session.revenue || 0).toFixed(0)}</div>
                    </div>
                  </div>
                )}

                <div className="flex gap-2">
                  <button 
                    onClick={() => handleEdit(session)}
                    className="flex-1 px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors whitespace-nowrap text-sm"
                  >
                    <i className="ri-edit-line mr-1"></i>
                    Edit
                  </button>
                  <button className="flex-1 px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors whitespace-nowrap text-sm">
                    <i className="ri-bar-chart-line mr-1"></i>
                    Analytics
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-6">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-2xl font-bold text-slate-900">Upload Recorded Session</h3>
                <button
                  onClick={() => setShowUploadModal(false)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <i className="ri-close-line text-2xl"></i>
                </button>
              </div>

              <form onSubmit={handleUploadSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-2">
                    Session Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={uploadForm.title}
                    onChange={(e) => setUploadForm({...uploadForm, title: e.target.value})}
                    placeholder="e.g., Advanced Guard Passing Techniques"
                    className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-2">
                    Description *
                  </label>
                  <textarea
                    required
                    value={uploadForm.description}
                    onChange={(e) => setUploadForm({...uploadForm, description: e.target.value})}
                    placeholder="Describe what students will learn in this session..."
                    maxLength={500}
                    rows={4}
                    className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
                  />
                  <div className="text-sm text-slate-500 mt-1 text-right">
                    {uploadForm.description.length}/500 characters
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-900 mb-2">
                      Category *
                    </label>
                    <select
                      required
                      value={uploadForm.category}
                      onChange={(e) => setUploadForm({...uploadForm, category: e.target.value})}
                      className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500 pr-8"
                    >
                      <option value="technique">Technique</option>
                      <option value="fundamentals">Fundamentals</option>
                      <option value="conditioning">Conditioning</option>
                      <option value="mental training">Mental Training</option>
                      <option value="competition prep">Competition Prep</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-900 mb-2">
                      Skill Level *
                    </label>
                    <select
                      required
                      value={uploadForm.level}
                      onChange={(e) => setUploadForm({...uploadForm, level: e.target.value})}
                      className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500 pr-8"
                    >
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                      <option value="all levels">All Levels</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-2">
                    Duration (minutes) *
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={uploadForm.duration}
                    onChange={(e) => setUploadForm({...uploadForm, duration: e.target.value})}
                    placeholder="e.g., 45"
                    className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div className="bg-slate-50 rounded-lg p-4">
                  <label className="flex items-center gap-3 cursor-pointer mb-3">
                    <input
                      type="checkbox"
                      checked={uploadForm.isPaid}
                      onChange={(e) => setUploadForm({...uploadForm, isPaid: e.target.checked, price: e.target.checked ? uploadForm.price : ''})}
                      className="w-5 h-5 text-teal-600 rounded focus:ring-2 focus:ring-teal-500"
                    />
                    <span className="font-semibold text-slate-900">This is a paid session</span>
                  </label>

                  {uploadForm.isPaid && (
                    <div>
                      <label className="block text-sm font-semibold text-slate-900 mb-2">
                        Price (USD) *
                      </label>
                      <input
                        type="number"
                        required={uploadForm.isPaid}
                        min="0.01"
                        step="0.01"
                        value={uploadForm.price}
                        onChange={(e) => setUploadForm({...uploadForm, price: e.target.value})}
                        placeholder="e.g., 29.99"
                        className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-2">
                    Video Files * (Multiple videos allowed)
                  </label>
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center hover:border-teal-500 transition-colors cursor-pointer"
                  >
                    <i className="ri-upload-cloud-2-line text-4xl text-slate-400 mb-2"></i>
                    <p className="text-slate-600 mb-1">
                      {uploadForm.videoFiles.length > 0 
                        ? `${uploadForm.videoFiles.length} file(s) selected` 
                        : 'Click to upload or drag and drop'}
                    </p>
                    <p className="text-sm text-slate-500">MP4, MOV, or AVI (max 2GB per file)</p>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="video/*"
                      multiple
                      className="hidden"
                      onChange={(e) => {
                        const newFiles = Array.from(e.target.files || []);
                        // Add new files to existing array (avoid duplicates by name)
                        setUploadForm(prev => {
                          const existingNames = prev.videoFiles.map(f => f.name);
                          const uniqueNewFiles = newFiles.filter(f => !existingNames.includes(f.name));
                          return {
                            ...prev,
                            videoFiles: [...prev.videoFiles, ...uniqueNewFiles]
                          };
                        });
                        // Reset input to allow selecting the same files again
                        e.target.value = '';
                      }}
                    />
                  </div>
                  
                  {/* Display selected files */}
                  {uploadForm.videoFiles.length > 0 && (
                    <div className="mt-4 space-y-2">
                      <p className="text-sm font-semibold text-slate-700 mb-2">Selected Files:</p>
                      {uploadForm.videoFiles.map((file, index) => (
                        <div key={index} className="flex items-center justify-between bg-slate-50 rounded-lg p-3">
                          <div className="flex items-center gap-2 flex-1 min-w-0">
                            <i className="ri-video-line text-teal-600"></i>
                            <span className="text-sm text-slate-700 truncate">{file.name}</span>
                            <span className="text-xs text-slate-500">
                              ({(file.size / (1024 * 1024)).toFixed(2)} MB)
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              const newFiles = uploadForm.videoFiles.filter((_, i) => i !== index);
                              setUploadForm({...uploadForm, videoFiles: newFiles});
                              // Reset input to allow selecting the same file again
                              if (fileInputRef.current) {
                                fileInputRef.current.value = '';
                              }
                            }}
                            className="ml-2 text-red-600 hover:text-red-700"
                          >
                            <i className="ri-close-circle-line text-lg"></i>
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start gap-2">
                    <i className="ri-information-line text-blue-600 mt-0.5"></i>
                    <div className="text-sm text-blue-900">
                      <p className="font-semibold mb-1">Review Process</p>
                      <p>Your session will be reviewed by our admin team within 24-48 hours. You'll be notified once it's approved or if any changes are needed.</p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowUploadModal(false)}
                    className="flex-1 px-6 py-3 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors font-semibold whitespace-nowrap"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={uploading}
                    className="flex-1 px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors font-semibold whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {uploading ? 'Uploading...' : 'Upload Session'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && editingSession && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-6">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-2xl font-bold text-slate-900">Edit Recorded Session</h3>
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    setEditingSession(null);
                  }}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <i className="ri-close-line text-2xl"></i>
                </button>
              </div>

              <form onSubmit={handleEditSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-2">
                    Session Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={editForm.title}
                    onChange={(e) => setEditForm({...editForm, title: e.target.value})}
                    placeholder="e.g., Advanced Guard Passing Techniques"
                    className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-2">
                    Description *
                  </label>
                  <textarea
                    required
                    value={editForm.description}
                    onChange={(e) => setEditForm({...editForm, description: e.target.value})}
                    placeholder="Describe what students will learn in this session..."
                    maxLength={500}
                    rows={4}
                    className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
                  />
                  <div className="text-sm text-slate-500 mt-1 text-right">
                    {editForm.description.length}/500 characters
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-900 mb-2">
                      Category *
                    </label>
                    <select
                      required
                      value={editForm.category}
                      onChange={(e) => setEditForm({...editForm, category: e.target.value})}
                      className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500 pr-8"
                    >
                      <option value="technique">Technique</option>
                      <option value="fundamentals">Fundamentals</option>
                      <option value="conditioning">Conditioning</option>
                      <option value="mental training">Mental Training</option>
                      <option value="competition prep">Competition Prep</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-900 mb-2">
                      Skill Level *
                    </label>
                    <select
                      required
                      value={editForm.level}
                      onChange={(e) => setEditForm({...editForm, level: e.target.value})}
                      className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500 pr-8"
                    >
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                      <option value="all levels">All Levels</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-900 mb-2">
                      Duration (minutes) *
                    </label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={editForm.duration}
                      onChange={(e) => setEditForm({...editForm, duration: e.target.value})}
                      placeholder="e.g., 45"
                      className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-900 mb-2">
                      Status *
                    </label>
                    <select
                      required
                      value={editForm.status}
                      onChange={(e) => setEditForm({...editForm, status: e.target.value})}
                      className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500 pr-8"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>
                </div>

                <div className="bg-slate-50 rounded-lg p-4">
                  <label className="flex items-center gap-3 cursor-pointer mb-3">
                    <input
                      type="checkbox"
                      checked={editForm.isPaid}
                      onChange={(e) => setEditForm({...editForm, isPaid: e.target.checked, price: e.target.checked ? editForm.price : ''})}
                      className="w-5 h-5 text-teal-600 rounded focus:ring-2 focus:ring-teal-500"
                    />
                    <span className="font-semibold text-slate-900">This is a paid session</span>
                  </label>

                  {editForm.isPaid && (
                    <div>
                      <label className="block text-sm font-semibold text-slate-900 mb-2">
                        Price (USD) *
                      </label>
                      <input
                        type="number"
                        required={editForm.isPaid}
                        min="0.01"
                        step="0.01"
                        value={editForm.price}
                        onChange={(e) => setEditForm({...editForm, price: e.target.value})}
                        placeholder="e.g., 29.99"
                        className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                    </div>
                  )}
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowEditModal(false);
                      setEditingSession(null);
                    }}
                    className="flex-1 px-6 py-3 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors font-semibold whitespace-nowrap"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={updating}
                    className="flex-1 px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors font-semibold whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {updating ? 'Updating...' : 'Update Session'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
