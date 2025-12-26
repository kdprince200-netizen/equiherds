'use client';

import { useState } from 'react';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('users');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [showAddPodcastModal, setShowAddPodcastModal] = useState(false);
  const [showVideoReviewModal, setShowVideoReviewModal] = useState(false);
  const [showAddEventModal, setShowAddEventModal] = useState(false);
  const [showUserProfileModal, setShowUserProfileModal] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [users, setUsers] = useState([
    { id: '1', name: 'John Smith', email: 'john.smith@email.com', role: 'Student', joined: '2024-01-15', status: 'Active', phone: '', location: '', bio: '', lastActive: '2 hours ago', sessions: 24 },
    { id: '2', name: 'Sarah Johnson', email: 'sarah.j@email.com', role: 'Coach', joined: '2024-01-10', status: 'Active', phone: '', location: '', bio: '', lastActive: '1 hour ago', sessions: 156 },
    { id: '3', name: 'Mike Chen', email: 'mike.chen@email.com', role: 'Student', joined: '2024-01-20', status: 'Active', phone: '', location: '', bio: '', lastActive: '30 minutes ago', sessions: 18 },
    { id: '4', name: 'Emma Davis', email: 'emma.d@email.com', role: 'Student', joined: '2024-01-18', status: 'Active', phone: '', location: '', bio: '', lastActive: '3 hours ago', sessions: 32 },
    { id: '5', name: 'Carlos Rodriguez', email: 'carlos.r@email.com', role: 'Coach', joined: '2024-01-12', status: 'Active', phone: '', location: '', bio: '', lastActive: '5 hours ago', sessions: 142 },
    { id: '6', name: 'Lisa Wang', email: 'lisa.wang@email.com', role: 'Student', joined: '2024-01-25', status: 'Inactive', phone: '', location: '', bio: '', lastActive: '2 days ago', sessions: 8 },
    { id: '7', name: 'David Kim', email: 'david.kim@email.com', role: 'Vendor', joined: '2024-01-08', status: 'Active', phone: '', location: '', bio: '', lastActive: '1 hour ago', sessions: 89 },
    { id: '8', name: 'Anna Martinez', email: 'anna.m@email.com', role: 'Student', joined: '2024-01-22', status: 'Active', phone: '', location: '', bio: '', lastActive: '4 hours ago', sessions: 15 },
  ]);

  const [pendingVideos, setPendingVideos] = useState([
    {
      id: 1,
      title: 'Advanced Triangle Choke Techniques',
      club: 'Elite Grappling Academy',
      coach: 'Marcus Silva',
      category: 'Brazilian Jiu-Jitsu',
      level: 'Advanced',
      duration: '45 min',
      description: 'Master the triangle choke with detailed breakdowns of setup, execution, and common mistakes.',
      uploadDate: '2024-01-28',
      thumbnail: 'https://readdy.ai/api/search-image?query=professional%20martial%20arts%20instructor%20demonstrating%20brazilian%20jiu%20jitsu%20triangle%20choke%20technique%20in%20modern%20training%20facility%20with%20clean%20white%20background%20high%20quality%20sports%20photography%20focused%20and%20technical%20demonstration&width=800&height=450&seq=vid1&orientation=landscape',
      isPaid: true,
      price: 29.99
    },
    {
      id: 2,
      title: 'Beginner Karate Kata Fundamentals',
      club: 'Dragon Martial Arts',
      coach: 'Sarah Chen',
      category: 'Karate',
      level: 'Beginner',
      duration: '30 min',
      description: 'Learn the foundational kata movements essential for every karate practitioner.',
      uploadDate: '2024-01-27',
      thumbnail: 'https://readdy.ai/api/search-image?query=karate%20instructor%20teaching%20kata%20fundamentals%20in%20traditional%20dojo%20with%20simple%20clean%20background%20professional%20martial%20arts%20photography%20beginner%20friendly%20demonstration&width=800&height=450&seq=vid2&orientation=landscape',
      isPaid: false,
      price: 0
    }
  ]);

  const [seminarsAndEvents, setSeminarsAndEvents] = useState([
    {
      id: 1,
      title: 'International BJJ Championship 2024',
      organizer: 'Elite Grappling Academy',
      type: 'Competition',
      date: '2024-03-15',
      time: '09:00 AM',
      duration: '8 hours',
      location: 'Los Angeles Convention Center, CA',
      price: 50,
      attendees: 245,
      maxAttendees: 300,
      status: 'Upcoming',
      thumbnail: 'https://readdy.ai/api/search-image?query=professional%20brazilian%20jiu%20jitsu%20championship%20competition%20venue%20with%20mats%20and%20spectators%20modern%20sports%20facility%20clean%20organized%20tournament%20setting&width=800&height=450&seq=event1&orientation=landscape'
    },
    {
      id: 2,
      title: 'Advanced Striking Workshop with Master Chen',
      organizer: 'Dragon Martial Arts',
      type: 'Workshop',
      date: '2024-03-20',
      time: '02:00 PM',
      duration: '4 hours',
      location: 'Dragon Martial Arts Dojo, New York',
      price: 75,
      attendees: 28,
      maxAttendees: 30,
      status: 'Upcoming',
      thumbnail: 'https://readdy.ai/api/search-image?query=martial%20arts%20master%20teaching%20striking%20techniques%20workshop%20in%20professional%20training%20facility%20clean%20modern%20dojo%20environment%20focused%20instruction&width=800&height=450&seq=event2&orientation=landscape'
    }
  ]);

  const [newPodcast, setNewPodcast] = useState({
    title: '',
    host: '',
    category: '',
    description: '',
    coverImage: '',
    episodeCount: '0',
    status: 'draft'
  });

  const [newEvent, setNewEvent] = useState({
    title: '',
    organizer: '',
    type: 'seminar',
    date: '',
    time: '',
    duration: '',
    location: '',
    price: '0',
    maxAttendees: '',
    description: '',
    featured: false
  });

  const handleViewUser = (user) => {
    setSelectedUser(user);
    setShowUserModal(true);
  };

  const handleEditUser = (user) => {
    setEditingUser({
      id: user.id,
      full_name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
      phone: user.phone || '',
      location: user.location || '',
      bio: user.bio || ''
    });
    setShowEditModal(true);
    setShowUserModal(false);
  };

  const handleSaveUser = async () => {
    if (!editingUser) return;
    
    try {
      // Update local state
      setUsers(users.map(u => 
        u.id === editingUser.id 
          ? { ...u, name: editingUser.full_name, role: editingUser.role, status: editingUser.status, phone: editingUser.phone, location: editingUser.location, bio: editingUser.bio }
          : u
      ));

      setShowEditModal(false);
      setEditingUser(null);
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const handleReviewVideo = (video) => {
    setSelectedVideo(video);
    setShowVideoReviewModal(true);
  };

  const handleApproveVideo = () => {
    if (selectedVideo) {
      setPendingVideos(pendingVideos.filter(v => v.id !== selectedVideo.id));
      setShowVideoReviewModal(false);
      setSelectedVideo(null);
      setRejectionReason('');
    }
  };

  const handleRejectVideo = () => {
    if (selectedVideo && rejectionReason.trim()) {
      setPendingVideos(pendingVideos.filter(v => v.id !== selectedVideo.id));
      setShowVideoReviewModal(false);
      setSelectedVideo(null);
      setRejectionReason('');
    }
  };

  const handleAddPodcast = () => {
    if (newPodcast.title && newPodcast.host && newPodcast.category && newPodcast.description) {
      // Add podcast logic here
      setShowAddPodcastModal(false);
      setNewPodcast({
        title: '',
        host: '',
        category: '',
        description: '',
        coverImage: '',
        episodeCount: '0',
        status: 'draft'
      });
    }
  };

  const handleAddEvent = () => {
    if (newEvent.title && newEvent.organizer && newEvent.date && newEvent.time && newEvent.location && newEvent.maxAttendees) {
      const event = {
        id: seminarsAndEvents.length + 1,
        title: newEvent.title,
        organizer: newEvent.organizer,
        type: newEvent.type.charAt(0).toUpperCase() + newEvent.type.slice(1),
        date: newEvent.date,
        time: newEvent.time,
        duration: newEvent.duration,
        location: newEvent.location,
        price: parseFloat(newEvent.price) || 0,
        attendees: 0,
        maxAttendees: parseInt(newEvent.maxAttendees),
        status: 'Upcoming',
        thumbnail: `https://readdy.ai/api/search-image?query=professional%20martial%20arts%20$%7BnewEvent.type%7D%20event%20venue%20modern%20training%20facility%20clean%20organized%20setting&width=800&height=450&seq=event${seminarsAndEvents.length + 1}&orientation=landscape`
      };
      setSeminarsAndEvents([...seminarsAndEvents, event]);
      setShowAddEventModal(false);
      setNewEvent({
        title: '',
        organizer: '',
        type: 'seminar',
        date: '',
        time: '',
        duration: '',
        location: '',
        price: '0',
        maxAttendees: '',
        description: '',
        featured: false
      });
    }
  };

  const handleCloseUserProfile = () => {
    setShowUserProfileModal(false);
    setSelectedUser(null);
  };

  const handleSuspendUser = () => {
    if (selectedUser) {
      const newStatus = selectedUser.status === 'Active' ? 'Suspended' : 'Active';
      setUsers(users.map(u => 
        u.id === selectedUser.id ? { ...u, status: newStatus } : u
      ));
      setSelectedUser({ ...selectedUser, status: newStatus });
    }
  };

  const handleMessageUser = () => {
    // Message user logic
    console.log('Sending message to:', selectedUser?.email);
  };

  return (
    <div className="min-h-screen bg-gray-50">

      <div className="flex flex-col md:flex-row">
        {/* Sidebar */}
        <aside className="w-full md:w-64 bg-white md:min-h-screen border-b md:border-b-0 border-r border-gray-200">
          <div className="p-4 md:p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Admin Panel</h2>
            <nav className="space-y-2">
              <button
                onClick={() => setActiveTab('overview')}
                className={`w-full text-left px-4 py-3 rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                  activeTab === 'overview'
                    ? 'bg-teal-50 text-teal-600 font-semibold'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <i className="ri-dashboard-line mr-3"></i>
                Overview
              </button>
              <button
                onClick={() => setActiveTab('video-review')}
                className={`w-full text-left px-4 py-3 rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                  activeTab === 'video-review'
                    ? 'bg-teal-50 text-teal-600 font-semibold'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <i className="ri-video-line mr-3"></i>
                Video Review
                {pendingVideos.length > 0 && (
                  <span className="ml-2 px-2 py-1 bg-red-500 text-white text-xs rounded-full">
                    {pendingVideos.length}
                  </span>
                )}
              </button>
              <button
                onClick={() => setActiveTab('users')}
                className={`w-full text-left px-4 py-3 rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                  activeTab === 'users'
                    ? 'bg-teal-50 text-teal-600 font-semibold'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <i className="ri-user-line mr-3"></i>
                Users
              </button>
              <button
                onClick={() => setActiveTab('coaches')}
                className={`w-full text-left px-4 py-3 rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                  activeTab === 'coaches'
                    ? 'bg-teal-50 text-teal-600 font-semibold'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <i className="ri-user-star-line mr-3"></i>
                Coaches
              </button>
              <button
                onClick={() => setActiveTab('clubs')}
                className={`w-full text-left px-4 py-3 rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                  activeTab === 'clubs'
                    ? 'bg-teal-50 text-teal-600 font-semibold'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <i className="ri-building-line mr-3"></i>
                Clubs
              </button>
              <button
                onClick={() => setActiveTab('seminars')}
                className={`w-full text-left px-4 py-3 rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                  activeTab === 'seminars'
                    ? 'bg-teal-50 text-teal-600 font-semibold'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <i className="ri-calendar-event-line mr-3"></i>
                Seminars & Events
              </button>
              <button
                onClick={() => setActiveTab('podcasts')}
                className={`w-full text-left px-4 py-3 rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                  activeTab === 'podcasts'
                    ? 'bg-teal-50 text-teal-600 font-semibold'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <i className="ri-mic-line mr-3"></i>
                Podcasts
              </button>
              <button
                onClick={() => setActiveTab('marketplace')}
                className={`w-full text-left px-4 py-3 rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                  activeTab === 'marketplace'
                    ? 'bg-teal-50 text-teal-600 font-semibold'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <i className="ri-store-line mr-3"></i>
                Marketplace
              </button>
              <button
                onClick={() => setActiveTab('promotions')}
                className={`w-full text-left px-4 py-3 rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                  activeTab === 'promotions'
                    ? 'bg-teal-50 text-teal-600 font-semibold'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <i className="ri-megaphone-line mr-3"></i>
                Promotions
              </button>
              <button
                onClick={() => setActiveTab('reports')}
                className={`w-full text-left px-4 py-3 rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                  activeTab === 'reports'
                    ? 'bg-teal-50 text-teal-600 font-semibold'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <i className="ri-file-chart-line mr-3"></i>
                Reports
              </button>
              <button
                onClick={() => setActiveTab('settings')}
                className={`w-full text-left px-4 py-3 rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                  activeTab === 'settings'
                    ? 'bg-teal-50 text-teal-600 font-semibold'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <i className="ri-settings-line mr-3"></i>
                Settings
              </button>
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {activeTab === 'overview' && (
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard Overview</h1>
              
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-500 text-sm">Total Users</p>
                      <p className="text-3xl font-bold text-gray-900 mt-2">12,458</p>
                      <p className="text-green-600 text-sm mt-2">
                        <i className="ri-arrow-up-line"></i> 12% from last month
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <i className="ri-user-line text-2xl text-blue-600"></i>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-500 text-sm">Active Coaches</p>
                      <p className="text-3xl font-bold text-gray-900 mt-2">847</p>
                      <p className="text-green-600 text-sm mt-2">
                        <i className="ri-arrow-up-line"></i> 8% from last month
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center">
                      <i className="ri-user-star-line text-2xl text-teal-600"></i>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-500 text-sm">Total Revenue</p>
                      <p className="text-3xl font-bold text-gray-900 mt-2">$284,592</p>
                      <p className="text-green-600 text-sm mt-2">
                        <i className="ri-arrow-up-line"></i> 23% from last month
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <i className="ri-money-dollar-circle-line text-2xl text-green-600"></i>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-500 text-sm">Pending Reviews</p>
                      <p className="text-3xl font-bold text-gray-900 mt-2">{pendingVideos.length}</p>
                      <p className="text-orange-600 text-sm mt-2">
                        <i className="ri-time-line"></i> Needs attention
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                      <i className="ri-video-line text-2xl text-orange-600"></i>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Activity</h2>
                <div className="space-y-4">
                  {[
                    { user: 'John Smith', action: 'registered as a new coach', time: '5 minutes ago', icon: 'ri-user-add-line', color: 'text-green-600' },
                    { user: 'Sarah Johnson', action: 'booked a BJJ session', time: '12 minutes ago', icon: 'ri-calendar-line', color: 'text-blue-600' },
                    { user: 'Mike Chen', action: 'purchased training equipment', time: '23 minutes ago', icon: 'ri-shopping-cart-line', color: 'text-purple-600' },
                    { user: 'Elite MMA Club', action: 'updated their profile', time: '1 hour ago', icon: 'ri-edit-line', color: 'text-orange-600' },
                    { user: 'Emma Davis', action: 'left a 5-star review', time: '2 hours ago', icon: 'ri-star-line', color: 'text-yellow-600' },
                  ].map((activity, index) => (
                    <div key={index} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                      <div className="flex items-center">
                        <div className={`w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mr-4`}>
                          <i className={`${activity.icon} ${activity.color}`}></i>
                        </div>
                        <div>
                          <p className="text-gray-900">
                            <span className="font-semibold">{activity.user}</span> {activity.action}
                          </p>
                          <p className="text-sm text-gray-500">{activity.time}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'video-review' && (
            <div>
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Video Review Queue</h1>
                  <p className="text-gray-600 mt-2">{pendingVideos.length} videos pending review</p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6">
                {pendingVideos.map((video) => (
                  <div key={video.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                    <div className="flex">
                      <div className="w-80 flex-shrink-0">
                        <img 
                          src={video.thumbnail} 
                          alt={video.title}
                          className="w-full h-full object-cover object-top"
                        />
                      </div>
                      <div className="flex-1 p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">{video.title}</h3>
                            <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                              <span><i className="ri-building-line mr-1"></i>{video.club}</span>
                              <span><i className="ri-user-line mr-1"></i>{video.coach}</span>
                              <span><i className="ri-time-line mr-1"></i>{video.duration}</span>
                            </div>
                            <div className="flex items-center gap-2 mb-4">
                              <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                                {video.category}
                              </span>
                              <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-semibold">
                                {video.level}
                              </span>
                              {video.isPaid ? (
                                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                                  Paid - ${video.price}
                                </span>
                              ) : (
                                <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-semibold">
                                  Free
                                </span>
                              )}
                            </div>
                            <p className="text-gray-700 mb-4">{video.description}</p>
                            <p className="text-sm text-gray-500">
                              <i className="ri-calendar-line mr-1"></i>
                              Uploaded on {video.uploadDate}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-3">
                          <button 
                            onClick={() => handleReviewVideo(video)}
                            className="px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors cursor-pointer whitespace-nowrap font-semibold"
                          >
                            <i className="ri-eye-line mr-2"></i>
                            Review Video
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {pendingVideos.length === 0 && (
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
                    <i className="ri-checkbox-circle-line text-6xl text-green-500 mb-4"></i>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">All Caught Up!</h3>
                    <p className="text-gray-600">No videos pending review at the moment.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <div>
              <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    placeholder="Search users..."
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
                  />
                  <button className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors cursor-pointer whitespace-nowrap">
                    <i className="ri-filter-line mr-2"></i>Filter
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">User</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Email</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Role</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Joined</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {[
                        { name: 'John Smith', email: 'john.smith@email.com', role: 'Student', joined: '2024-01-15', status: 'Active' },
                        { name: 'Sarah Johnson', email: 'sarah.j@email.com', role: 'Coach', joined: '2024-01-10', status: 'Active' },
                        { name: 'Mike Chen', email: 'mike.chen@email.com', role: 'Student', joined: '2024-01-20', status: 'Active' },
                        { name: 'Emma Davis', email: 'emma.d@email.com', role: 'Student', joined: '2024-01-18', status: 'Active' },
                        { name: 'Carlos Rodriguez', email: 'carlos.r@email.com', role: 'Coach', joined: '2024-01-12', status: 'Active' },
                        { name: 'Lisa Wang', email: 'lisa.wang@email.com', role: 'Student', joined: '2024-01-25', status: 'Inactive' },
                        { name: 'David Kim', email: 'david.kim@email.com', role: 'Vendor', joined: '2024-01-08', status: 'Active' },
                        { name: 'Anna Martinez', email: 'anna.m@email.com', role: 'Student', joined: '2024-01-22', status: 'Active' },
                      ].map((user, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-6 py-4">
                            <div className="flex items-center">
                              <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center mr-3">
                                <span className="text-teal-600 font-semibold">{user.name.charAt(0)}</span>
                              </div>
                              <div className="font-semibold text-gray-900">{user.name}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-gray-600">{user.email}</td>
                          <td className="px-6 py-4">
                            <span className={`px-3 py-1 rounded-full text-sm ${
                              user.role === 'Coach' ? 'bg-purple-100 text-purple-700' :
                              user.role === 'Vendor' ? 'bg-orange-100 text-orange-700' :
                              'bg-blue-100 text-blue-700'
                            }`}>
                              {user.role}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-gray-600">{user.joined}</td>
                          <td className="px-6 py-4">
                            <span className={`px-3 py-1 rounded-full text-sm ${
                              user.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                            }`}>
                              {user.status}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <button 
                                onClick={() => handleViewUser(user)}
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg cursor-pointer"
                              >
                                <i className="ri-eye-line"></i>
                              </button>
                              <button
                                onClick={() => handleEditUser(user)}
                                className="p-2 text-orange-600 hover:bg-orange-50 rounded-lg cursor-pointer"
                              >
                                <i className="ri-edit-line"></i>
                              </button>
                              <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg cursor-pointer">
                                <i className="ri-delete-bin-line"></i>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'coaches' && (
            <div>
              <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Coach Management</h1>
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    placeholder="Search coaches..."
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
                  />
                  <button className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors cursor-pointer whitespace-nowrap">
                    <i className="ri-add-line mr-2"></i>Add Coach
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  { name: 'Marcus Silva', specialty: 'Brazilian Jiu-Jitsu', rating: 4.9, students: 156, experience: '15 years', status: 'Active' },
                  { name: 'Sarah Chen', specialty: 'Karate', rating: 4.8, students: 203, experience: '12 years', status: 'Active' },
                  { name: 'Diego Rodriguez', specialty: 'MMA', rating: 4.9, students: 189, experience: '18 years', status: 'Active' },
                  { name: 'Alex Thompson', specialty: 'Wrestling', rating: 4.7, students: 124, experience: '10 years', status: 'Active' },
                  { name: 'Kenji Yamamoto', specialty: 'Judo', rating: 4.9, students: 167, experience: '20 years', status: 'Active' },
                  { name: 'Carlos Martinez', specialty: 'Boxing', rating: 4.8, students: 142, experience: '14 years', status: 'Active' },
                ].map((coach, index) => (
                  <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center">
                        <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mr-4">
                          <span className="text-2xl text-teal-600 font-bold">{coach.name.charAt(0)}</span>
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-900">{coach.name}</h3>
                          <p className="text-sm text-gray-600">{coach.specialty}</p>
                        </div>
                      </div>
                      <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                        {coach.status}
                      </span>
                    </div>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Rating</span>
                        <span className="font-semibold text-gray-900">
                          <i className="ri-star-fill text-yellow-500 mr-1"></i>{coach.rating}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Students</span>
                        <span className="font-semibold text-gray-900">{coach.students}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Experience</span>
                        <span className="font-semibold text-gray-900">{coach.experience}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button className="flex-1 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors cursor-pointer whitespace-nowrap text-sm">
                        View Profile
                      </button>
                      <button className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg cursor-pointer">
                        <i className="ri-more-2-fill"></i>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'clubs' && (
            <div>
              <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Club Management</h1>
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    placeholder="Search clubs..."
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
                  />
                  <button className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors cursor-pointer whitespace-nowrap">
                    <i className="ri-add-line mr-2"></i>Add Club
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[640px]">
                    <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Club Name</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Location</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Specialties</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Members</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Actions</th>
                    </tr>
                  </thead>
                    <tbody className="divide-y divide-gray-200">
                    {[
                      { name: 'Elite MMA Academy', location: 'Los Angeles, CA', specialties: 'MMA, BJJ, Boxing', members: 450, status: 'Active' },
                      { name: 'Dragon Martial Arts', location: 'New York, NY', specialties: 'Karate, Taekwondo', members: 320, status: 'Active' },
                      { name: 'Thunder Gym', location: 'Miami, FL', specialties: 'Muay Thai, Kickboxing', members: 280, status: 'Active' },
                      { name: 'Warrior\'s Path Dojo', location: 'Chicago, IL', specialties: 'Judo, Aikido', members: 195, status: 'Active' },
                      { name: 'Iron Fist Boxing', location: 'Houston, TX', specialties: 'Boxing', members: 240, status: 'Active' },
                      { name: 'Samurai Spirit', location: 'Seattle, WA', specialties: 'Kendo, Jiu-Jitsu', members: 165, status: 'Pending' },
                    ].map((club, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="font-semibold text-gray-900">{club.name}</div>
                        </td>
                        <td className="px-6 py-4 text-gray-600">{club.location}</td>
                        <td className="px-6 py-4 text-gray-600">{club.specialties}</td>
                        <td className="px-6 py-4 text-gray-600">{club.members}</td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-sm ${
                            club.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                          }`}>
                            {club.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-2">
                            <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg cursor-pointer">
                              <i className="ri-eye-line"></i>
                            </button>
                            <button className="p-2 text-orange-600 hover:bg-orange-50 rounded-lg cursor-pointer">
                              <i className="ri-edit-line"></i>
                            </button>
                            <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg cursor-pointer">
                              <i className="ri-delete-bin-line"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'seminars' && (
            <div>
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Seminars & Events</h1>
                  <p className="text-gray-600 mt-2">{seminarsAndEvents.length} events scheduled</p>
                </div>
                <button 
                  onClick={() => setShowAddEventModal(true)}
                  className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors cursor-pointer whitespace-nowrap"
                >
                  <i className="ri-add-line mr-2"></i>Add Event
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-500 text-sm">Total Events</p>
                      <p className="text-3xl font-bold text-gray-900 mt-2">{seminarsAndEvents.length}</p>
                    </div>
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <i className="ri-calendar-event-line text-2xl text-blue-600"></i>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-500 text-sm">Total Attendees</p>
                      <p className="text-3xl font-bold text-gray-900 mt-2">
                        {seminarsAndEvents.reduce((sum, e) => sum + e.attendees, 0)}
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                      <i className="ri-user-line text-2xl text-purple-600"></i>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-500 text-sm">Revenue</p>
                      <p className="text-3xl font-bold text-gray-900 mt-2">
                        ${seminarsAndEvents.reduce((sum, e) => sum + (e.price * e.attendees), 0).toLocaleString()}
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <i className="ri-money-dollar-circle-line text-2xl text-green-600"></i>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-500 text-sm">Upcoming</p>
                      <p className="text-3xl font-bold text-gray-900 mt-2">
                        {seminarsAndEvents.filter(e => e.status === 'Upcoming').length}
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                      <i className="ri-time-line text-2xl text-orange-600"></i>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6">
                {seminarsAndEvents.map((event) => (
                  <div key={event.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                    <div className="flex gap-6 p-6">
                      <div className="w-80 flex-shrink-0">
                        <img 
                          src={event.thumbnail} 
                          alt={event.title}
                          className="w-full h-48 object-cover object-top rounded-lg"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">{event.title}</h3>
                            <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                              <span><i className="ri-building-line mr-1"></i>{event.organizer}</span>
                              <span><i className="ri-calendar-line mr-1"></i>{event.date}</span>
                              <span><i className="ri-time-line mr-1"></i>{event.time}</span>
                            </div>
                            <div className="flex items-center gap-2 mb-4">
                              <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                                {event.type}
                              </span>
                              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                event.status === 'Upcoming' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                              }`}>
                                {event.status}
                              </span>
                              {event.price === 0 ? (
                                <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-semibold">
                                  Free
                                </span>
                              ) : (
                                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                                  ${event.price}
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-600 mb-4">
                              <i className="ri-map-pin-line mr-1"></i>{event.location}
                            </p>
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4 mb-4">
                          <div className="bg-gray-50 rounded-lg p-3">
                            <div className="text-xs text-gray-600 mb-1">Attendees</div>
                            <div className="text-lg font-bold text-gray-900">
                              {event.attendees} / {event.maxAttendees}
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                              <div 
                                className="bg-teal-600 h-2 rounded-full"
                                style={{ width: `${(event.attendees / event.maxAttendees) * 100}%` }}
                              />
                            </div>
                          </div>
                          <div className="bg-gray-50 rounded-lg p-3">
                            <div className="text-xs text-gray-600 mb-1">Revenue</div>
                            <div className="text-lg font-bold text-green-600">
                              ${(event.price * event.attendees).toLocaleString()}
                            </div>
                          </div>
                          <div className="bg-gray-50 rounded-lg p-3">
                            <div className="text-xs text-gray-600 mb-1">Capacity</div>
                            <div className="text-lg font-bold text-gray-900">
                              {Math.round((event.attendees / event.maxAttendees) * 100)}%
                            </div>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <button className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors cursor-pointer whitespace-nowrap text-sm">
                            <i className="ri-edit-line mr-1"></i>Edit Event
                          </button>
                          <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer whitespace-nowrap text-sm">
                            <i className="ri-eye-line mr-1"></i>View Details
                          </button>
                          <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer whitespace-nowrap text-sm">
                            <i className="ri-user-line mr-1"></i>Manage Attendees
                          </button>
                          <button className="px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors cursor-pointer whitespace-nowrap text-sm">
                            <i className="ri-close-circle-line mr-1"></i>Cancel Event
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'podcasts' && (
            <div>
              <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Podcast Management</h1>
                <button 
                  onClick={() => setShowAddPodcastModal(true)}
                  className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors cursor-pointer whitespace-nowrap"
                >
                  <i className="ri-add-line mr-2"></i>Add New Podcast
                </button>
              </div>

              {/* Podcasts Table */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[640px]">
                    <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Podcast</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Host</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Category</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Episodes</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Actions</th>
                    </tr>
                  </thead>
                    <tbody className="divide-y divide-gray-200">
                    {[
                      { name: 'BJJ Chronicles', host: 'Marcus Silva', category: 'Brazilian Jiu-Jitsu', episodes: 156, status: 'Active' },
                      { name: 'Cage Talk', host: 'Dana Martinez', category: 'MMA', episodes: 203, status: 'Active' },
                      { name: 'Mat Masters', host: 'Alex Thompson', category: 'Wrestling', episodes: 89, status: 'Active' },
                      { name: 'Way of Judo', host: 'Kenji Yamamoto', category: 'Judo', episodes: 124, status: 'Active' },
                      { name: 'Karate Conversations', host: 'Sarah Chen', category: 'Karate', episodes: 67, status: 'Active' },
                      { name: 'Submission Science', host: 'Dr. James Wilson', category: 'Grappling', episodes: 142, status: 'Active' },
                    ].map((podcast, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="font-semibold text-gray-900">{podcast.name}</div>
                        </td>
                        <td className="px-6 py-4 text-gray-600">{podcast.host}</td>
                        <td className="px-6 py-4">
                          <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                            {podcast.category}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-gray-600">{podcast.episodes}</td>
                        <td className="px-6 py-4">
                          <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                            {podcast.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-2">
                            <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg cursor-pointer">
                              <i className="ri-edit-line"></i>
                            </button>
                            <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg cursor-pointer">
                              <i className="ri-delete-bin-line"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'marketplace' && (
            <div>
              <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Marketplace Management</h1>
                <button className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors cursor-pointer whitespace-nowrap">
                  <i className="ri-add-line mr-2"></i>Add Product
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-500 text-sm">Total Products</p>
                      <p className="text-3xl font-bold text-gray-900 mt-2">1,247</p>
                    </div>
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                      <i className="ri-shopping-bag-line text-2xl text-purple-600"></i>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-500 text-sm">Active Vendors</p>
                      <p className="text-3xl font-bold text-gray-900 mt-2">89</p>
                    </div>
                    <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                      <i className="ri-store-line text-2xl text-orange-600"></i>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-500 text-sm">Total Sales</p>
                      <p className="text-3xl font-bold text-gray-900 mt-2">$156,892</p>
                    </div>
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <i className="ri-money-dollar-circle-line text-2xl text-green-600"></i>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-500 text-sm">Pending Orders</p>
                      <p className="text-3xl font-bold text-gray-900 mt-2">47</p>
                    </div>
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <i className="ri-shopping-cart-line text-2xl text-blue-600"></i>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Product</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Vendor</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Category</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Price</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Stock</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {[
                      { name: 'Premium BJJ Gi', vendor: 'Elite Gear Co.', category: 'Apparel', price: '$149.99', stock: 45, status: 'Active' },
                      { name: 'Boxing Gloves Pro', vendor: 'Fight Equipment', category: 'Equipment', price: '$89.99', stock: 78, status: 'Active' },
                      { name: 'Training Dummy', vendor: 'MMA Supplies', category: 'Equipment', price: '$299.99', stock: 12, status: 'Active' },
                      { name: 'Rashguard Set', vendor: 'Combat Wear', category: 'Apparel', price: '$59.99', stock: 156, status: 'Active' },
                      { name: 'Muay Thai Shorts', vendor: 'Thai Gear', category: 'Apparel', price: '$39.99', stock: 203, status: 'Active' },
                      { name: 'Grappling Dummy', vendor: 'Training Tools', category: 'Equipment', price: '$199.99', stock: 8, status: 'Low Stock' },
                    ].map((product, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="font-semibold text-gray-900">{product.name}</div>
                        </td>
                        <td className="px-6 py-4 text-gray-600">{product.vendor}</td>
                        <td className="px-6 py-4">
                          <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                            {product.category}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-gray-900 font-semibold">{product.price}</td>
                        <td className="px-6 py-4 text-gray-600">{product.stock}</td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-sm ${
                            product.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                          }`}>
                            {product.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-2">
                            <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg cursor-pointer">
                              <i className="ri-eye-line"></i>
                            </button>
                            <button className="p-2 text-orange-600 hover:bg-orange-50 rounded-lg cursor-pointer">
                              <i className="ri-edit-line"></i>
                            </button>
                            <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg cursor-pointer">
                              <i className="ri-delete-bin-line"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'promotions' && (
            <div>
              <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Promotions & Campaigns</h1>
                <button className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors cursor-pointer whitespace-nowrap">
                  <i className="ri-add-line mr-2"></i>Create Campaign
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-500 text-sm">Active Campaigns</p>
                      <p className="text-3xl font-bold text-gray-900 mt-2">18</p>
                    </div>
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <i className="ri-megaphone-line text-2xl text-green-600"></i>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-500 text-sm">Total Reach</p>
                      <p className="text-3xl font-bold text-gray-900 mt-2">78.5K</p>
                    </div>
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <i className="ri-user-line text-2xl text-blue-600"></i>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-500 text-sm">Conversion Rate</p>
                      <p className="text-3xl font-bold text-gray-900 mt-2">22.3%</p>
                    </div>
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                      <i className="ri-line-chart-line text-2xl text-purple-600"></i>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <div className="flex gap-2 border-b border-gray-200">
                  <button className="px-6 py-3 border-b-2 border-teal-600 text-teal-600 font-semibold">
                    Sessions & Classes
                  </button>
                  <button className="px-6 py-3 text-gray-600 hover:text-gray-900">
                    Clubs
                  </button>
                  <button className="px-6 py-3 text-gray-600 hover:text-gray-900">
                    Products
                  </button>
                  <button className="px-6 py-3 text-gray-600 hover:text-gray-900">
                    Events
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6">
                {/* Session Promotion */}
                {[
                  { 
                    name: 'Elite BJJ Masterclass - PROMOTED', 
                    type: 'Session', 
                    organizer: 'Elite Grappling Academy',
                    status: 'Active', 
                    startDate: '2024-02-01', 
                    endDate: '2024-03-01',
                    budget: 800,
                    impressions: 18500,
                    clicks: 1542,
                    conversions: 127
                  },
                  { 
                    name: 'Elite Grappling Academy - FEATURED', 
                    type: 'Club', 
                    organizer: 'Elite Grappling Academy',
                    status: 'Active', 
                    startDate: '2024-02-10', 
                    endDate: '2024-03-10',
                    budget: 1200,
                    impressions: 24800,
                    clicks: 2156,
                    conversions: 189
                  },
                  { 
                    name: 'Premium BJJ Gi Bundle - SPONSORED', 
                    type: 'Product', 
                    organizer: 'GrappleGear Pro',
                    status: 'Active', 
                    startDate: '2024-02-05', 
                    endDate: '2024-03-05',
                    budget: 650,
                    impressions: 15200,
                    clicks: 1289,
                    conversions: 98
                  },
                  { 
                    name: 'International BJJ Championship - PROMOTED', 
                    type: 'Event', 
                    organizer: 'Elite Grappling Academy',
                    status: 'Active', 
                    startDate: '2024-02-15', 
                    endDate: '2024-03-15',
                    budget: 1500,
                    impressions: 32400,
                    clicks: 3245,
                    conversions: 245
                  },
                ].map((campaign, index) => (
                  <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-bold text-gray-900">{campaign.name}</h3>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            campaign.status === 'Active' ? 'bg-green-100 text-green-700' : 
                            campaign.status === 'Scheduled' ? 'bg-blue-100 text-blue-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {campaign.status}
                          </span>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            campaign.type === 'Session' ? 'bg-purple-100 text-purple-700' :
                            campaign.type === 'Club' ? 'bg-blue-100 text-blue-700' :
                            campaign.type === 'Product' ? 'bg-orange-100 text-orange-700' :
                            'bg-pink-100 text-pink-700'
                          }`}>
                            {campaign.type}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">By {campaign.organizer}</p>
                        <div className="flex items-center gap-6 text-sm text-gray-600">
                          <span><i className="ri-calendar-line mr-1"></i>{campaign.startDate} - {campaign.endDate}</span>
                          <span><i className="ri-money-dollar-circle-line mr-1"></i>Budget: ${campaign.budget}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors cursor-pointer whitespace-nowrap text-sm">
                          View Details
                        </button>
                        <button className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg cursor-pointer">
                          <i className="ri-more-2-fill"></i>
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-4 gap-4 pt-4 border-t border-gray-100">
                      <div>
                        <div className="text-sm text-gray-600 mb-1">Impressions</div>
                        <div className="text-xl font-bold text-gray-900">{campaign.impressions.toLocaleString()}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600 mb-1">Clicks</div>
                        <div className="text-xl font-bold text-gray-900">{campaign.clicks.toLocaleString()}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600 mb-1">CTR</div>
                        <div className="text-xl font-bold text-teal-600">
                          {((campaign.clicks / campaign.impressions) * 100).toFixed(1)}%
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600 mb-1">Conversions</div>
                        <div className="text-xl font-bold text-gray-900">{campaign.conversions}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'reports' && (
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-8">Reports & Analytics</h1>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-500 text-sm">Monthly Revenue</p>
                      <p className="text-3xl font-bold text-gray-900 mt-2">$89,432</p>
                      <p className="text-green-600 text-sm mt-2">
                        <i className="ri-arrow-up-line"></i> 15% vs last month
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <i className="ri-money-dollar-circle-line text-2xl text-green-600"></i>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-500 text-sm">New Signups</p>
                      <p className="text-3xl font-bold text-gray-900 mt-2">1,247</p>
                      <p className="text-green-600 text-sm mt-2">
                        <i className="ri-arrow-up-line"></i> 8% vs last month
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <i className="ri-user-add-line text-2xl text-blue-600"></i>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-500 text-sm">Active Sessions</p>
                      <p className="text-3xl font-bold text-gray-900 mt-2">3,892</p>
                      <p className="text-green-600 text-sm mt-2">
                        <i className="ri-arrow-up-line"></i> 12% vs last month
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                      <i className="ri-calendar-check-line text-2xl text-purple-600"></i>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-500 text-sm">Avg. Rating</p>
                      <p className="text-3xl font-bold text-gray-900 mt-2">4.8</p>
                      <p className="text-green-600 text-sm mt-2">
                        <i className="ri-arrow-up-line"></i> 0.2 vs last month
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                      <i className="ri-star-line text-2xl text-yellow-600"></i>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Top Performing Coaches</h2>
                  <div className="space-y-4">
                    {[
                      { name: 'Marcus Silva', sessions: 156, rating: 4.9, revenue: '$12,450' },
                      { name: 'Sarah Chen', sessions: 142, rating: 4.8, revenue: '$11,280' },
                      { name: 'Diego Rodriguez', sessions: 138, rating: 4.9, revenue: '$10,950' },
                      { name: 'Alex Thompson', sessions: 124, rating: 4.7, revenue: '$9,860' },
                      { name: 'Kenji Yamamoto', sessions: 118, rating: 4.9, revenue: '$9,440' },
                    ].map((coach, index) => (
                      <div key={index} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center mr-3">
                            <span className="text-teal-600 font-semibold">{coach.name.charAt(0)}</span>
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">{coach.name}</p>
                            <p className="text-sm text-gray-500">{coach.sessions} sessions</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-900">{coach.revenue}</p>
                          <p className="text-sm text-gray-500">
                            <i className="ri-star-fill text-yellow-500"></i> {coach.rating}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Popular Martial Arts</h2>
                  <div className="space-y-4">
                    {[
                      { name: 'Brazilian Jiu-Jitsu', students: 3245, percentage: 28 },
                      { name: 'MMA', students: 2891, percentage: 25 },
                      { name: 'Muay Thai', students: 2156, percentage: 19 },
                      { name: 'Boxing', students: 1678, percentage: 14 },
                      { name: 'Karate', students: 1589, percentage: 14 },
                    ].map((art, index) => (
                      <div key={index}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-semibold text-gray-900">{art.name}</span>
                          <span className="text-sm text-gray-600">{art.students} students ({art.percentage}%)</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-teal-600 h-2 rounded-full" 
                            style={{ width: `${art.percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-8">Platform Settings</h1>
              
              <div className="space-y-6">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">General Settings</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">Platform Name</label>
                      <input
                        type="text"
                        defaultValue="Martial Arts Platform"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">Support Email</label>
                      <input
                        type="email"
                        defaultValue="support@martialarts.com"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">Time Zone</label>
                      <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm pr-8 cursor-pointer">
                        <option>UTC-8 (Pacific Time)</option>
                        <option>UTC-5 (Eastern Time)</option>
                        <option>UTC+0 (GMT)</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Payment Settings</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">Commission Rate (%)</label>
                      <input
                        type="number"
                        defaultValue="15"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">Minimum Payout Amount</label>
                      <input
                        type="number"
                        defaultValue="50"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Notification Settings</h2>
                  <div className="space-y-4">
                    {[
                      { label: 'Email notifications for new registrations', checked: true },
                      { label: 'Email notifications for new bookings', checked: true },
                      { label: 'Email notifications for reviews', checked: false },
                      { label: 'Email notifications for payments', checked: true },
                    ].map((setting, index) => (
                      <label key={index} className="flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          defaultChecked={setting.checked}
                          className="mr-3 cursor-pointer"
                        />
                        <span className="text-gray-700">{setting.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end">
                  <button className="px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors cursor-pointer whitespace-nowrap font-semibold">
                    Save Settings
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* User Details Modal */}
      {showUserModal && selectedUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white">
              <h3 className="text-2xl font-bold text-gray-900">User Details</h3>
              <button
                onClick={() => setShowUserModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
              >
                <i className="ri-close-line text-2xl text-gray-600"></i>
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* User Header */}
              <div className="flex items-center gap-4 pb-6 border-b border-gray-200">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-2xl font-bold">
                  {selectedUser.name.split(' ').map((n) => n[0]).join('')}
                </div>
                <div className="flex-1">
                  <h4 className="text-xl font-bold text-gray-900">{selectedUser.name}</h4>
                  <p className="text-gray-600">{selectedUser.email}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      selectedUser.status === 'Active' 
                        ? 'bg-green-100 text-green-700'
                        : selectedUser.status === 'Suspended'
                        ? 'bg-red-100 text-red-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {selectedUser.status}
                    </span>
                    <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-700">
                      {selectedUser.role}
                    </span>
                  </div>
                </div>
              </div>

              {/* User Information Grid */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-medium text-gray-500">User ID</label>
                  <p className="mt-1 text-gray-900 font-mono text-sm">{selectedUser.id}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Join Date</label>
                  <p className="mt-1 text-gray-900">{selectedUser.joined}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Last Active</label>
                  <p className="mt-1 text-gray-900">{selectedUser.lastActive}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Total Sessions</label>
                  <p className="mt-1 text-gray-900 font-semibold">{selectedUser.sessions}</p>
                </div>
              </div>

              {/* Activity Stats */}
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6">
                <h5 className="font-semibold text-gray-900 mb-4">Activity Statistics</h5>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">{selectedUser.sessions}</div>
                    <div className="text-sm text-gray-600 mt-1">Total Sessions</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-pink-600">
                      {selectedUser.role === 'Coach' ? '4.8' : selectedUser.role === 'Student' ? '12' : '8'}
                    </div>
                    <div className="text-sm text-gray-600 mt-1">
                      {selectedUser.role === 'Coach' ? 'Rating' : selectedUser.role === 'Student' ? 'Bookings' : 'Products'}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-indigo-600">
                      {selectedUser.role === 'Coach' ? '45' : selectedUser.role === 'Student' ? '8' : '156'}
                    </div>
                    <div className="text-sm text-gray-600 mt-1">
                      {selectedUser.role === 'Coach' ? 'Students' : selectedUser.role === 'Student' ? 'Reviews' : 'Orders'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Additional Information */}
              {selectedUser.role === 'Coach' && (
                <div>
                  <h5 className="font-semibold text-gray-900 mb-3">Coach Information</h5>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Specialties</label>
                      <div className="flex flex-wrap gap-2 mt-2">
                        <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">Brazilian Jiu-Jitsu</span>
                        <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">MMA</span>
                        <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">Grappling</span>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Experience</label>
                      <p className="mt-1 text-gray-900">12 years</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Certifications</label>
                      <p className="mt-1 text-gray-900">Black Belt BJJ, IBJJF Certified</p>
                    </div>
                  </div>
                </div>
              )}

              {selectedUser.role === 'Vendor' && (
                <div>
                  <h5 className="font-semibold text-gray-900 mb-3">Vendor Information</h5>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Store Name</label>
                      <p className="mt-1 text-gray-900">Fight Gear Pro</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Total Revenue</label>
                      <p className="mt-1 text-gray-900 font-semibold text-green-600">$12,450</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Product Categories</label>
                      <div className="flex flex-wrap gap-2 mt-2">
                        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">Gear</span>
                        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">Apparel</span>
                        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">Supplements</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <button className="flex-1 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors whitespace-nowrap cursor-pointer">
                  <i className="ri-mail-line mr-2"></i>
                  Send Message
                </button>
                {selectedUser.status === 'Active' ? (
                  <button className="flex-1 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors whitespace-nowrap cursor-pointer">
                    <i className="ri-forbid-line mr-2"></i>
                    Suspend User
                  </button>
                ) : (
                  <button className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors whitespace-nowrap cursor-pointer">
                    <i className="ri-check-line mr-2"></i>
                    Activate User
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {showEditModal && editingUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900">Edit User</h3>
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setEditingUser(null);
                }}
                className="p-2 hover:bg-gray-100 rounded-lg cursor-pointer"
              >
                <i className="ri-close-line text-xl text-gray-500"></i>
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Basic Information */}
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-4">Basic Information</h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={editingUser.full_name}
                      onChange={(e) => setEditingUser({ ...editingUser, full_name: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={editingUser.email}
                      disabled
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
                    />
                    <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Role
                      </label>
                      <select
                        value={editingUser.role}
                        onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value })}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent cursor-pointer"
                      >
                        <option value="student">Student</option>
                        <option value="coach">Coach</option>
                        <option value="club">Club</option>
                        <option value="vendor">Vendor</option>
                        <option value="admin">Admin</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Status
                      </label>
                      <select
                        value={editingUser.status}
                        onChange={(e) => setEditingUser({ ...editingUser, status: e.target.value })}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent cursor-pointer"
                      >
                        <option value="active">Active</option>
                        <option value="suspended">Suspended</option>
                        <option value="pending">Pending</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-4">Contact Information</h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={editingUser.phone}
                      onChange={(e) => setEditingUser({ ...editingUser, phone: e.target.value })}
                      placeholder="+1 (555) 000-0000"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Location
                    </label>
                    <input
                      type="text"
                      value={editingUser.location}
                      onChange={(e) => setEditingUser({ ...editingUser, location: e.target.value })}
                      placeholder="City, State"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* Bio */}
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-4">Biography</h4>
                <textarea
                  value={editingUser.bio}
                  onChange={(e) => setEditingUser({ ...editingUser, bio: e.target.value })}
                  rows={4}
                  placeholder="Tell us about this user..."
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
                  maxLength={500}
                />
                <p className="text-xs text-gray-500 mt-1">
                  {editingUser.bio.length}/500 characters
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    setEditingUser(null);
                  }}
                  className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium whitespace-nowrap cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveUser}
                  className="px-6 py-2.5 bg-teal-600 text-white rounded-lg hover:bg-teal-700 font-medium whitespace-nowrap cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add New Podcast Modal */}
      {showAddPodcastModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Add New Podcast</h2>
                <button
                  onClick={() => setShowAddPodcastModal(false)}
                  className="text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                  <i className="ri-close-line text-2xl"></i>
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="space-y-6">
                {/* Podcast Title */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Podcast Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={newPodcast.title}
                    onChange={(e) => setNewPodcast({ ...newPodcast, title: e.target.value })}
                    placeholder="Enter podcast title"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
                  />
                </div>

                {/* Host Name */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Host Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={newPodcast.host}
                    onChange={(e) => setNewPodcast({ ...newPodcast, host: e.target.value })}
                    placeholder="Enter host name"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={newPodcast.category}
                    onChange={(e) => setNewPodcast({ ...newPodcast, category: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm pr-8 cursor-pointer"
                  >
                    <option value="">Select a category</option>
                    <option value="Brazilian Jiu-Jitsu">Brazilian Jiu-Jitsu</option>
                    <option value="MMA">MMA</option>
                    <option value="Wrestling">Wrestling</option>
                    <option value="Judo">Judo</option>
                    <option value="Karate">Karate</option>
                    <option value="Grappling">Grappling</option>
                    <option value="Muay Thai">Muay Thai</option>
                    <option value="Boxing">Boxing</option>
                    <option value="Taekwondo">Taekwondo</option>
                  </select>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={newPodcast.description}
                    onChange={(e) => setNewPodcast({ ...newPodcast, description: e.target.value })}
                    placeholder="Enter podcast description"
                    rows={4}
                    maxLength={500}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm resize-none"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    {newPodcast.description.length}/500 characters
                  </p>
                </div>

                {/* Cover Image URL */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Cover Image URL
                  </label>
                  <input
                    type="url"
                    value={newPodcast.coverImage}
                    onChange={(e) => setNewPodcast({ ...newPodcast, coverImage: e.target.value })}
                    placeholder="https://example.com/image.jpg"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
                  />
                </div>

                {/* Initial Episode Count */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Initial Episode Count
                  </label>
                  <input
                    type="number"
                    value={newPodcast.episodeCount}
                    onChange={(e) => setNewPodcast({ ...newPodcast, episodeCount: e.target.value })}
                    placeholder="0"
                    min="0"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
                  />
                </div>

                {/* Status */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Status
                  </label>
                  <div className="flex items-center space-x-4">
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="status"
                        value="draft"
                        checked={newPodcast.status === 'draft'}
                        onChange={(e) => setNewPodcast({ ...newPodcast, status: e.target.value })}
                        className="mr-2 cursor-pointer"
                      />
                      <span className="text-gray-700">Draft</span>
                    </label>
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="status"
                        value="active"
                        checked={newPodcast.status === 'active'}
                        onChange={(e) => setNewPodcast({ ...newPodcast, status: e.target.value })}
                        className="mr-2 cursor-pointer"
                      />
                      <span className="text-gray-700">Active</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end space-x-4 mt-8 pt-6 border-t border-gray-200">
                <button
                  onClick={() => setShowAddPodcastModal(false)}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer whitespace-nowrap"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddPodcast}
                  disabled={!newPodcast.title || !newPodcast.host || !newPodcast.description || !newPodcast.category}
                  className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors cursor-pointer whitespace-nowrap disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  Add Podcast
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Video Review Modal */}
      {showVideoReviewModal && selectedVideo && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Review Video</h2>
                <button
                  onClick={() => {
                    setShowVideoReviewModal(false);
                    setSelectedVideo(null);
                    setRejectionReason('');
                  }}
                  className="text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                  <i className="ri-close-line text-2xl"></i>
                </button>
              </div>
            </div>

            <div className="p-6">
              {/* Video Preview */}
              <div className="mb-6">
                <img 
                  src={selectedVideo.thumbnail} 
                  alt={selectedVideo.title}
                  className="w-full h-96 object-cover object-top rounded-lg"
                />
              </div>

              {/* Video Details */}
              <div className="space-y-4 mb-6">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{selectedVideo.title}</h3>
                  <div className="flex items-center gap-4 text-sm text-gray-600 mt-2">
                    <span><i className="ri-building-line mr-1"></i>{selectedVideo.club}</span>
                    <span><i className="ri-user-line mr-1"></i>{selectedVideo.coach}</span>
                    <span><i className="ri-time-line mr-1"></i>{selectedVideo.duration}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
                    {selectedVideo.category}
                  </span>
                  <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-semibold">
                    {selectedVideo.level}
                  </span>
                  {selectedVideo.isPaid ? (
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
                      Paid - ${selectedVideo.price}
                    </span>
                  ) : (
                    <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-semibold">
                      Free
                    </span>
                  )}
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Description</h4>
                  <p className="text-gray-700">{selectedVideo.description}</p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Upload Date</h4>
                  <p className="text-gray-700">{selectedVideo.uploadDate}</p>
                </div>
              </div>

              {/* Rejection Reason */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Rejection Reason (if rejecting)
                </label>
                <textarea
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="Provide detailed feedback for the club..."
                  rows={4}
                  maxLength={500}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm resize-none"
                />
                <p className="text-sm text-gray-500 mt-1">
                  {rejectionReason.length}/500 characters
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
                <button
                  onClick={() => {
                    setShowVideoReviewModal(false);
                    setSelectedVideo(null);
                    setRejectionReason('');
                  }}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer whitespace-nowrap font-semibold"
                >
                  Cancel
                </button>
                <button
                  onClick={handleRejectVideo}
                  className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors cursor-pointer whitespace-nowrap font-semibold"
                >
                  <i className="ri-close-circle-line mr-2"></i>
                  Reject Video
                </button>
                <button
                  onClick={handleApproveVideo}
                  className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors cursor-pointer whitespace-nowrap font-semibold"
                >
                  <i className="ri-checkbox-circle-line mr-2"></i>
                  Approve Video
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Event Modal */}
      {showAddEventModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Add New Event</h2>
                <button
                  onClick={() => setShowAddEventModal(false)}
                  className="text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                  <i className="ri-close-line text-2xl"></i>
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Event Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={newEvent.title}
                    onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                    placeholder="e.g., International BJJ Championship 2024"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Organizer <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={newEvent.organizer}
                    onChange={(e) => setNewEvent({ ...newEvent, organizer: e.target.value })}
                    placeholder="e.g., Elite Grappling Academy"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Event Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={newEvent.type}
                    onChange={(e) => setNewEvent({ ...newEvent, type: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm pr-8 cursor-pointer"
                  >
                    <option value="seminar">Seminar</option>
                    <option value="workshop">Workshop</option>
                    <option value="competition">Competition</option>
                    <option value="event">Event</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Date <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      value={newEvent.date}
                      onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Time <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="time"
                      value={newEvent.time}
                      onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Duration <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={newEvent.duration}
                    onChange={(e) => setNewEvent({ ...newEvent, duration: e.target.value })}
                    placeholder="e.g., 3 hours"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Location <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={newEvent.location}
                    onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                    placeholder="e.g., Los Angeles Convention Center"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Price (USD)
                    </label>
                    <input
                      type="number"
                      value={newEvent.price}
                      onChange={(e) => setNewEvent({ ...newEvent, price: e.target.value })}
                      placeholder="0 for free"
                      min="0"
                      step="0.01"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Max Attendees <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      value={newEvent.maxAttendees}
                      onChange={(e) => setNewEvent({ ...newEvent, maxAttendees: e.target.value })}
                      placeholder="e.g., 100"
                      min="1"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Description
                  </label>
                  <textarea
                    value={newEvent.description}
                    onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                    placeholder="Describe the event..."
                    rows={4}
                    maxLength={500}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm resize-none"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    {newEvent.description.length}/500 characters
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="featured"
                    checked={newEvent.featured}
                    onChange={(e) => setNewEvent({ ...newEvent, featured: e.target.checked })}
                    className="w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500 cursor-pointer"
                  />
                  <label htmlFor="featured" className="text-sm text-gray-700 cursor-pointer">
                    Feature this event on homepage
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-end space-x-4 mt-8 pt-6 border-t border-gray-200">
                <button
                  onClick={() => setShowAddEventModal(false)}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer whitespace-nowrap"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddEvent}
                  className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors cursor-pointer whitespace-nowrap"
                >
                  Add Event
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* User Profile Modal */}
      {showUserProfileModal && selectedUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-start">
                <h3 className="text-2xl font-bold text-gray-900">User Profile</h3>
                <button
                  onClick={handleCloseUserProfile}
                  className="text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                  <i className="ri-close-line text-2xl"></i>
                </button>
              </div>
            </div>

            <div className="p-6">
              {/* User Header */}
              <div className="flex items-start gap-6 mb-6 pb-6 border-b border-gray-200">
                <div className="w-24 h-24 bg-teal-100 rounded-full flex items-center justify-center text-3xl font-bold text-teal-600">
                  {selectedUser.name.charAt(0)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="text-2xl font-bold text-gray-900">{selectedUser.name}</h4>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      selectedUser.status === 'Active' ? 'bg-green-100 text-green-800' :
                      selectedUser.status === 'Suspended' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {selectedUser.status}
                    </span>
                  </div>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <i className="ri-mail-line"></i>
                      <span>{selectedUser.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <i className="ri-phone-line"></i>
                      <span>+1 (555) {Math.floor(Math.random() * 900) + 100}-{Math.floor(Math.random() * 9000) + 1000}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <i className="ri-shield-user-line"></i>
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                        selectedUser.role === 'Coach' ? 'bg-purple-100 text-purple-800' :
                        selectedUser.role === 'Vendor' ? 'bg-orange-100 text-orange-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {selectedUser.role}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Account Information */}
              <div className="mb-6">
                <h5 className="text-lg font-semibold text-gray-900 mb-4">Account Information</h5>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-sm text-gray-600 mb-1">Member Since</div>
                    <div className="font-semibold text-gray-900">{selectedUser.joined}</div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-sm text-gray-600 mb-1">Last Active</div>
                    <div className="font-semibold text-gray-900">2 hours ago</div>
                  </div>
                </div>
              </div>

              {/* Activity Statistics */}
              <div className="mb-6">
                <h5 className="text-lg font-semibold text-gray-900 mb-4">Activity Statistics</h5>
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-blue-600 mb-1">
                      {selectedUser.role === 'Coach' ? '156' : selectedUser.role === 'Vendor' ? '89' : '24'}
                    </div>
                    <div className="text-sm text-gray-600">
                      {selectedUser.role === 'Coach' ? 'Sessions Taught' : selectedUser.role === 'Vendor' ? 'Products Sold' : 'Sessions Booked'}
                    </div>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-green-600 mb-1">
                      {selectedUser.role === 'Coach' ? '4.8' : selectedUser.role === 'Vendor' ? '4.6' : '12'}
                    </div>
                    <div className="text-sm text-gray-600">
                      {selectedUser.role === 'Coach' ? 'Avg Rating' : selectedUser.role === 'Vendor' ? 'Avg Rating' : 'Reviews Written'}
                    </div>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-purple-600 mb-1">
                      {selectedUser.role === 'Coach' ? '45' : selectedUser.role === 'Vendor' ? '$12.5k' : '8'}
                    </div>
                    <div className="text-sm text-gray-600">
                      {selectedUser.role === 'Coach' ? 'Students' : selectedUser.role === 'Vendor' ? 'Revenue' : 'Purchases'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={handleEditUser}
                  className="flex-1 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors cursor-pointer whitespace-nowrap"
                >
                  <i className="ri-edit-line mr-2"></i>Edit Profile
                </button>
                <button
                  onClick={handleSuspendUser}
                  className={`flex-1 px-4 py-2 rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                    selectedUser.status === 'Active' 
                      ? 'bg-red-600 text-white hover:bg-red-700' 
                      : 'bg-green-600 text-white hover:bg-green-700'
                  }`}
                >
                  <i className={`${selectedUser.status === 'Active' ? 'ri-forbid-line' : 'ri-check-line'} mr-2`}></i>
                  {selectedUser.status === 'Active' ? 'Suspend Account' : 'Activate Account'}
                </button>
                <button
                  onClick={handleMessageUser}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer whitespace-nowrap"
                >
                  <i className="ri-message-3-line mr-2"></i>Send Message
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}