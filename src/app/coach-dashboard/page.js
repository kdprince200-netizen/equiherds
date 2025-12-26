'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CoachDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showSessionDetails, setShowSessionDetails] = useState(null);
  const [showEditModal, setShowEditModal] = useState(null);
  const [showPromoteModal, setShowPromoteModal] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState('');
  const [messageForm, setMessageForm] = useState({
    subject: '',
    message: ''
  });
  const [newPromotion, setNewPromotion] = useState({
    sessionId: '',
    title: '',
    startDate: '',
    endDate: '',
    budget: '',
    targetAudience: 'All Students',
    placement: [],
    goals: ''
  });

  const coachData = {
    name: 'Marcus Silva',
    specialization: 'Brazilian Jiu-Jitsu',
    belt: 'Black Belt',
    experience: '15 years',
    rating: 4.9,
    totalReviews: 234,
    totalStudents: 156,
    activeClasses: 12,
    verified: true
  };

  const recordedSessions = [
    {
      id: 1,
      title: 'Advanced Guard Passing Techniques',
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
      thumbnail: 'https://readdy.ai/api/search-image?query=professional%20brazilian%20jiu%20jitsu%20instructor%20demonstrating%20guard%20pass%20technique%20in%20modern%20training%20facility%20with%20clean%20white%20background%20high%20quality%20sports%20photography&width=400&height=225&seq=coach1&orientation=landscape'
    },
    {
      id: 2,
      title: 'Submission Chains from Top Position',
      category: 'Technique',
      level: 'Intermediate',
      duration: '50 min',
      uploadDate: '2024-01-28',
      status: 'Approved',
      isPaid: true,
      price: 24.99,
      views: 1567,
      revenue: 3123.33,
      subscribers: 125,
      rating: 4.7,
      thumbnail: 'https://readdy.ai/api/search-image?query=bjj%20instructor%20demonstrating%20submission%20technique%20from%20top%20position%20in%20professional%20training%20environment%20clean%20simple%20background%20martial%20arts%20photography&width=400&height=225&seq=coach2&orientation=landscape'
    },
    {
      id: 3,
      title: 'Fundamentals: Basic Positions',
      category: 'Fundamentals',
      level: 'Beginner',
      duration: '35 min',
      uploadDate: '2024-02-01',
      status: 'Pending',
      isPaid: false,
      price: 0,
      views: 0,
      revenue: 0,
      subscribers: 0,
      rating: 0,
      thumbnail: 'https://readdy.ai/api/search-image?query=martial%20arts%20instructor%20teaching%20basic%20positions%20in%20professional%20gym%20setting%20with%20simple%20clean%20background%20beginner%20training%20photography&width=400&height=225&seq=coach3&orientation=landscape'
    },
    {
      id: 4,
      title: 'Competition Strategy and Mindset',
      category: 'Mental Training',
      level: 'All Levels',
      duration: '30 min',
      uploadDate: '2024-01-15',
      status: 'Rejected',
      isPaid: true,
      price: 19.99,
      views: 0,
      revenue: 0,
      subscribers: 0,
      rating: 0,
      rejectionReason: 'Video quality does not meet platform standards. Please re-upload with better lighting and audio.',
      thumbnail: 'https://readdy.ai/api/search-image?query=focused%20martial%20arts%20coach%20discussing%20competition%20strategy%20in%20modern%20gym%20with%20minimal%20clean%20background%20motivational%20sports%20image&width=400&height=225&seq=coach4&orientation=landscape'
    }
  ];

  const upcomingSchedule = [
    {
      id: 1,
      title: 'Private Session - Guard Work',
      student: 'John Martinez',
      date: '2024-02-15',
      time: '10:00 AM',
      duration: '60 min',
      type: 'Private',
      status: 'Confirmed'
    },
    {
      id: 2,
      title: 'Group Class - Fundamentals',
      students: 12,
      date: '2024-02-15',
      time: '6:00 PM',
      duration: '90 min',
      type: 'Group',
      status: 'Confirmed'
    },
    {
      id: 3,
      title: 'Private Session - Competition Prep',
      student: 'Sarah Chen',
      date: '2024-02-16',
      time: '2:00 PM',
      duration: '90 min',
      type: 'Private',
      status: 'Pending'
    }
  ];

  const students = [
    {
      id: 1,
      name: 'John Martinez',
      belt: 'Blue Belt',
      joinDate: '2023-06-15',
      totalSessions: 48,
      lastSession: '2024-02-10',
      progress: 'Excellent',
      avatar: 'https://readdy.ai/api/search-image?query=professional%20portrait%20of%20male%20martial%20arts%20student%20in%20training%20gi%20confident%20expression%20clean%20studio%20background&width=100&height=100&seq=student1&orientation=squarish'
    },
    {
      id: 2,
      name: 'Sarah Chen',
      belt: 'Purple Belt',
      joinDate: '2022-03-20',
      totalSessions: 124,
      lastSession: '2024-02-12',
      progress: 'Outstanding',
      avatar: 'https://readdy.ai/api/search-image?query=professional%20portrait%20of%20female%20martial%20arts%20athlete%20in%20training%20uniform%20determined%20expression%20clean%20studio%20background&width=100&height=100&seq=student2&orientation=squarish'
    },
    {
      id: 3,
      name: 'Mike Johnson',
      belt: 'White Belt',
      joinDate: '2024-01-10',
      totalSessions: 12,
      lastSession: '2024-02-11',
      progress: 'Good',
      avatar: 'https://readdy.ai/api/search-image?query=professional%20portrait%20of%20male%20beginner%20martial%20arts%20student%20in%20white%20gi%20friendly%20expression%20clean%20studio%20background&width=100&height=100&seq=student3&orientation=squarish'
    }
  ];

  const handleUploadSubmit = (e) => {
    e.preventDefault();
    alert('Session uploaded successfully! It will be reviewed by admin within 24-48 hours.');
    setShowUploadModal(false);
    setUploadForm({
      title: '',
      description: '',
      category: 'technique',
      level: 'beginner',
      duration: '',
      isPaid: false,
      price: '',
      videoFile: null
    });
  };

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadForm({...uploadForm, videoFile: file});
    }
  };

  const totalRevenue = recordedSessions
    .filter(s => s.status === 'Approved')
    .reduce((sum, s) => sum + s.revenue, 0);

  const totalViews = recordedSessions
    .filter(s => s.status === 'Approved')
    .reduce((sum, s) => sum + s.views, 0);

  const totalSubscribers = recordedSessions
    .filter(s => s.status === 'Approved')
    .reduce((sum, s) => sum + s.subscribers, 0);

  const selectedSession = recordedSessions.find(s => s.id === showSessionDetails);

  const sponsoredSessions = [
    {
      id: 1,
      title: 'Advanced Guard Passing - SPONSORED',
      startDate: '2024-02-01',
      endDate: '2024-03-01',
      budget: 300,
      impressions: 8900,
      clicks: 567,
      enrollments: 45,
      status: 'Active',
      thumbnail: 'https://readdy.ai/api/search-image?query=professional%20brazilian%20jiu%20jitsu%20instructor%20demonstrating%20guard%20pass%20technique%20in%20modern%20training%20facility%20with%20clean%20white%20background%20high%20quality%20sports%20photography&width=400&height=225&seq=coachsponsor1&orientation=landscape'
    }
  ];

  const togglePromotionPlacement = (location) => {
    setNewPromotion(prev => ({
      ...prev,
      placement: prev.placement.includes(location)
        ? prev.placement.filter(p => p !== location)
        : [...prev.placement, location]
    }));
  };

  const handleCreatePromotion = () => {
    console.log('Creating new promotion:', newPromotion);
    setShowPromoteModal(false);
    // Reset form
    setNewPromotion({
      sessionId: '',
      title: '',
      startDate: '',
      endDate: '',
      budget: '',
      targetAudience: 'All Students',
      placement: [],
      goals: ''
    });
  };

  const handleMessageSubmit = (e) => {
    e.preventDefault();
    if (!messageForm.subject.trim() || !messageForm.message.trim()) {
      alert('Please fill in all fields');
      return;
    }
    alert(`Message sent to ${selectedStudent} successfully!`);
    setShowMessageModal(false);
    setMessageForm({ subject: '', message: '' });
    setSelectedStudent('');
  };

  const openMessageModal = (studentName) => {
    setSelectedStudent(studentName);
    setShowMessageModal(true);
  };

  const handleViewProfile = (studentId) => {
    router.push('/student-profile');
  };

  const renderPromotionsTab = () => (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Session Promotions</h1>
        <button 
          onClick={() => setShowPromoteModal(true)}
          className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors whitespace-nowrap flex items-center gap-2 cursor-pointer"
        >
          <i className="ri-megaphone-line text-xl"></i>
          Promote Session
        </button>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <div className="flex items-start gap-3">
          <i className="ri-information-line text-blue-600 text-xl flex-shrink-0"></i>
          <div>
            <p className="text-sm text-blue-900 font-medium mb-1">Boost Your Reach</p>
            <p className="text-sm text-blue-700">
              Promote your sessions to attract more students. Your promoted sessions will appear at the top of search results and featured sections across the platform.
            </p>
          </div>
        </div>
      </div>

      {sponsoredSessions.length > 0 ? (
        <>
          <div className="grid grid-cols-4 gap-6 mb-6">
            <div className="bg-slate-50 rounded-lg p-4">
              <div className="text-sm text-slate-600 mb-1">Total Investment</div>
              <div className="text-2xl font-bold text-slate-900">
                ${sponsoredSessions.reduce((sum, s) => sum + s.budget, 0)}
              </div>
            </div>
            <div className="bg-slate-50 rounded-lg p-4">
              <div className="text-sm text-slate-600 mb-1">Total Impressions</div>
              <div className="text-2xl font-bold text-blue-600">
                {sponsoredSessions.reduce((sum, s) => sum + s.impressions, 0).toLocaleString()}
              </div>
            </div>
            <div className="bg-slate-50 rounded-lg p-4">
              <div className="text-sm text-slate-600 mb-1">Total Clicks</div>
              <div className="text-2xl font-bold text-purple-600">
                {sponsoredSessions.reduce((sum, s) => sum + s.clicks, 0).toLocaleString()}
              </div>
            </div>
            <div className="bg-slate-50 rounded-lg p-4">
              <div className="text-sm text-slate-600 mb-1">New Students</div>
              <div className="text-2xl font-bold text-green-600">
                +{sponsoredSessions.reduce((sum, s) => sum + s.enrollments, 0)}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {sponsoredSessions.map((session) => (
              <div key={session.id} className="bg-white border-2 border-purple-200 rounded-xl overflow-hidden">
                <div className="flex gap-6 p-6">
                  <div className="relative">
                    <img 
                      src={session.thumbnail} 
                      alt={session.title}
                      className="w-64 h-36 object-cover object-top rounded-lg flex-shrink-0"
                    />
                    <div className="absolute top-2 left-2 bg-purple-600 text-white px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1">
                      <i className="ri-megaphone-fill"></i>
                      PROMOTED
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-bold text-slate-900 text-lg mb-1">{session.title}</h4>
                        <p className="text-sm text-slate-600">Campaign Period: {session.startDate} - {session.endDate}</p>
                      </div>
                      <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium whitespace-nowrap">
                        {session.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-4 gap-4 mb-4">
                      <div>
                        <span className="text-xs text-slate-600">Budget</span>
                        <p className="font-semibold text-green-600 text-sm">${session.budget}</p>
                      </div>
                      <div>
                        <span className="text-xs text-slate-600">Impressions</span>
                        <p className="font-semibold text-blue-600 text-sm">{session.impressions.toLocaleString()}</p>
                      </div>
                      <div>
                        <span className="text-xs text-slate-600">Clicks</span>
                        <p className="font-semibold text-purple-600 text-sm">{session.clicks}</p>
                      </div>
                      <div>
                        <span className="text-xs text-slate-600">CTR</span>
                        <p className="font-semibold text-slate-900 text-sm">
                          {((session.clicks / session.impressions) * 100).toFixed(2)}%
                        </p>
                      </div>
                    </div>

                    <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-xs text-green-700 mb-1">New Students from Campaign</div>
                          <div className="text-2xl font-bold text-green-600">+{session.enrollments}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs text-green-700 mb-1">Cost per Student</div>
                          <div className="text-lg font-bold text-green-600">
                            ${(session.budget / session.enrollments).toFixed(2)}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs text-green-700 mb-1">ROI</div>
                          <div className="text-lg font-bold text-green-600">
                            {(((session.enrollments * 50 - session.budget) / session.budget) * 100).toFixed(0)}%
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors whitespace-nowrap text-sm">
                        <i className="ri-bar-chart-line mr-1"></i>View Analytics
                      </button>
                      <button className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors whitespace-nowrap text-sm">
                        <i className="ri-edit-line mr-1"></i>Edit Campaign
                      </button>
                      <button className="px-4 py-2 border border-orange-300 text-orange-600 rounded-lg hover:bg-orange-50 transition-colors whitespace-nowrap text-sm">
                        <i className="ri-pause-circle-line mr-1"></i>Pause
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="text-center py-12">
          <i className="ri-megaphone-line text-6xl text-slate-300 mb-4"></i>
          <h4 className="text-xl font-bold text-slate-900 mb-2">No Active Promotions</h4>
          <p className="text-slate-600 mb-6">Start promoting your sessions to reach more students</p>
          <button className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors whitespace-nowrap">
            Create Your First Promotion
          </button>
        </div>
      )}
    </div>
  );

  const renderSessionsTab = () => (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-slate-900">My Recorded Sessions</h3>
        <button
          onClick={() => setShowUploadModal(true)}
          className="px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors whitespace-nowrap flex items-center gap-2 cursor-pointer"
        >
          <i className="ri-upload-cloud-line text-xl"></i>
          Upload New Session
        </button>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {recordedSessions.map((session) => (
          <div key={session.id} className="bg-white border border-slate-200 rounded-xl overflow-hidden">
            <div className="relative">
              <img 
                src={session.thumbnail} 
                alt={session.title}
                className="w-full h-48 object-cover object-top"
              />
              <div className="absolute top-3 right-3 bg-black/70 text-white px-3 py-1 rounded-lg text-sm font-semibold">
                {session.duration}
              </div>
              <div className={`absolute top-3 left-3 px-3 py-1 rounded-lg text-sm font-semibold ${
                session.status === 'Approved' ? 'bg-green-600 text-white' :
                session.status === 'Pending' ? 'bg-yellow-600 text-white' :
                'bg-red-600 text-white'
              }`}>
                {session.status}
              </div>
            </div>
            <div className="p-4">
              <h4 className="font-bold text-slate-900 text-lg mb-2">{session.title}</h4>
              <div className="flex items-center gap-4 mb-3 text-sm text-slate-600">
                <span className="px-2 py-1 bg-slate-100 rounded text-xs font-semibold">
                  {session.category}
                </span>
                <span className="px-2 py-1 bg-slate-100 rounded text-xs font-semibold">
                  {session.level}
                </span>
                {session.isPaid ? (
                  <span className="text-green-600 font-semibold">${session.price}</span>
                ) : (
                  <span className="text-blue-600 font-semibold">Free</span>
                )}
              </div>

              {session.status === 'Approved' && (
                <div className="grid grid-cols-3 gap-3 mb-4 text-sm">
                  <div className="bg-slate-50 rounded p-2 text-center">
                    <div className="text-slate-600 text-xs">Views</div>
                    <div className="font-bold text-slate-900">{session.views}</div>
                  </div>
                  <div className="bg-slate-50 rounded p-2 text-center">
                    <div className="text-slate-600 text-xs">Subscribers</div>
                    <div className="font-bold text-slate-900">{session.subscribers}</div>
                  </div>
                  <div className="bg-slate-50 rounded p-2 text-center">
                    <div className="text-slate-600 text-xs">Revenue</div>
                    <div className="font-bold text-green-600">${session.revenue.toFixed(0)}</div>
                  </div>
                </div>
              )}

              {session.status === 'Rejected' && session.rejectionReason && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                  <div className="flex items-start gap-2">
                    <i className="ri-error-warning-line text-red-600 mt-0.5"></i>
                    <div>
                      <div className="text-sm font-semibold text-red-900 mb-1">Rejection Reason</div>
                      <div className="text-sm text-red-700">{session.rejectionReason}</div>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex gap-2">
                <button 
                  onClick={() => setShowEditModal(session.id)}
                  className="flex-1 px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors whitespace-nowrap text-sm cursor-pointer"
                >
                  <i className="ri-edit-line mr-1"></i>
                  Edit
                </button>
                <button 
                  onClick={() => setShowSessionDetails(session.id)}
                  className="flex-1 px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors whitespace-nowrap text-sm cursor-pointer"
                >
                  <i className="ri-bar-chart-line mr-1"></i>
                  Analytics
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderScheduleTab = () => (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-slate-900">Upcoming Schedule</h3>
        <button className="px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors whitespace-nowrap cursor-pointer">
          <i className="ri-add-line mr-1"></i>
          Add Session
        </button>
      </div>

      <div className="space-y-4">
        {upcomingSchedule.map((session) => (
          <div key={session.id} className="bg-white border border-slate-200 rounded-xl p-6">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h4 className="font-bold text-slate-900 text-lg">{session.title}</h4>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    session.type === 'Private' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                  }`}>
                    {session.type}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    session.status === 'Confirmed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {session.status}
                  </span>
                </div>
                <div className="flex items-center gap-6 text-sm text-slate-600">
                  <span className="flex items-center gap-1">
                    <i className="ri-calendar-line"></i>
                    {session.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <i className="ri-time-line"></i>
                    {session.time}
                  </span>
                  <span className="flex items-center gap-1">
                    <i className="ri-timer-line"></i>
                    {session.duration}
                  </span>
                  {session.type === 'Private' ? (
                    <span className="flex items-center gap-1">
                      <i className="ri-user-line"></i>
                      {session.student}
                    </span>
                  ) : (
                    <span className="flex items-center gap-1">
                      <i className="ri-group-line"></i>
                      {session.students} students
                    </span>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                <button className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors whitespace-nowrap text-sm cursor-pointer">
                  <i className="ri-edit-line"></i>
                </button>
                <button className="px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors whitespace-nowrap text-sm cursor-pointer">
                  <i className="ri-close-line"></i>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderStudentsTab = () => (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-slate-900">My Students</h3>
        <div className="flex gap-3">
          <input
            type="text"
            placeholder="Search students..."
            className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {students.map((student) => (
          <div key={student.id} className="bg-white border border-slate-200 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <img 
                  src={student.avatar} 
                  alt={student.name}
                  className="w-16 h-16 rounded-full object-cover object-top"
                />
                <div>
                  <h4 className="font-bold text-slate-900 text-lg">{student.name}</h4>
                  <p className="text-slate-600 text-sm mb-1">{student.belt}</p>
                  <div className="flex items-center gap-4 text-xs text-slate-500">
                    <span>Joined: {student.joinDate}</span>
                    <span>•</span>
                    <span>{student.totalSessions} sessions</span>
                    <span>•</span>
                    <span>Last: {student.lastSession}</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors whitespace-nowrap text-sm cursor-pointer">
                  Message
                </button>
                <button 
                  onClick={() => handleViewProfile(student.id)}
                  className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors whitespace-nowrap text-sm cursor-pointer"
                >
                  View Profile
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderEarningsTab = () => (
    <div>
      <h3 className="text-xl font-bold text-slate-900 mb-6">Earnings Overview</h3>
      
      <div className="grid grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white">
          <div className="text-sm mb-2 opacity-90">Total Earnings</div>
          <div className="text-4xl font-bold mb-1">${totalRevenue.toLocaleString()}</div>
          <div className="text-sm opacity-75">All time</div>
        </div>
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white">
          <div className="text-sm mb-2 opacity-90">This Month</div>
          <div className="text-4xl font-bold mb-1">$2,847</div>
          <div className="text-sm opacity-75">+23% from last month</div>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white">
          <div className="text-sm mb-2 opacity-90">Pending</div>
          <div className="text-4xl font-bold mb-1">$456</div>
          <div className="text-sm opacity-75">To be paid out</div>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-6">
        <h4 className="font-bold text-slate-900 mb-4">Recent Transactions</h4>
        <div className="space-y-3">
          {[
            { date: '2024-02-12', description: 'Session Purchase - Advanced Guard Passing', amount: 29.99 },
            { date: '2024-02-11', description: 'Session Purchase - Submission Chains', amount: 24.99 },
            { date: '2024-02-10', description: 'Session Purchase - Advanced Guard Passing', amount: 29.99 },
            { date: '2024-02-09', description: 'Session Purchase - Submission Chains', amount: 24.99 },
          ].map((transaction, index) => (
            <div key={index} className="flex justify-between items-center py-3 border-b border-slate-100 last:border-0">
              <div>
                <div className="font-semibold text-slate-900">{transaction.description}</div>
                <div className="text-sm text-slate-500">{transaction.date}</div>
              </div>
              <div className="text-green-600 font-bold">+${transaction.amount}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderSettingsTab = () => (
    <div>
      <h3 className="text-xl font-bold text-slate-900 mb-6">Account Settings</h3>
      
      <div className="space-y-6">
        <div className="bg-white border border-slate-200 rounded-xl p-6">
          <h4 className="font-bold text-slate-900 mb-4">Profile Information</h4>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">Full Name</label>
              <input
                type="text"
                defaultValue={coachData.name}
                className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">Specialization</label>
              <input
                type="text"
                defaultValue={coachData.specialization}
                className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">Belt Rank</label>
                <input
                  type="text"
                  defaultValue={coachData.belt}
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">Years of Experience</label>
                <input
                  type="text"
                  defaultValue={coachData.experience}
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>
            <button className="px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors whitespace-nowrap cursor-pointer">
              Save Changes
            </button>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-6">
          <h4 className="font-bold text-slate-900 mb-4">Notification Preferences</h4>
          <div className="space-y-3">
            {[
              { label: 'New booking notifications', checked: true },
              { label: 'Session reminders', checked: true },
              { label: 'Student messages', checked: true },
              { label: 'Payment notifications', checked: true },
              { label: 'Marketing emails', checked: false },
            ].map((pref, index) => (
              <label key={index} className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  defaultChecked={pref.checked}
                  className="w-5 h-5 text-teal-600 rounded focus:ring-2 focus:ring-teal-500"
                />
                <span className="text-slate-700">{pref.label}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderOverviewTab = () => (
    <div>
      <h3 className="text-xl font-bold text-slate-900 mb-6">Dashboard Overview</h3>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white border border-slate-200 rounded-xl p-6">
          <h4 className="font-bold text-slate-900 mb-4">Recent Activity</h4>
          <div className="space-y-3">
            {[
              { icon: 'ri-video-line', text: 'New session uploaded', time: '2 hours ago', color: 'text-blue-600' },
              { icon: 'ri-user-add-line', text: 'New student enrolled', time: '5 hours ago', color: 'text-green-600' },
              { icon: 'ri-calendar-check-line', text: 'Session completed', time: '1 day ago', color: 'text-purple-600' },
              { icon: 'ri-money-dollar-circle-line', text: 'Payment received', time: '2 days ago', color: 'text-green-600' },
            ].map((activity, index) => (
              <div key={index} className="flex items-center gap-3 py-2">
                <div className={`w-10 h-10 flex items-center justify-center ${activity.color}`}>
                  <i className={`${activity.icon} text-xl`}></i>
                </div>
                <div className="flex-1">
                  <div className="text-slate-900 font-medium">{activity.text}</div>
                  <div className="text-sm text-slate-500">{activity.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-6">
          <h4 className="font-bold text-slate-900 mb-4">Quick Actions</h4>
          <div className="space-y-3">
            <button 
              onClick={() => setShowUploadModal(true)}
              className="w-full px-4 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors whitespace-nowrap cursor-pointer text-left flex items-center gap-3"
            >
              <i className="ri-upload-cloud-line text-xl"></i>
              Upload New Session
            </button>
            <button 
              onClick={() => setActiveTab('schedule')}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors whitespace-nowrap cursor-pointer text-left flex items-center gap-3"
            >
              <i className="ri-calendar-line text-xl"></i>
              View Schedule
            </button>
            <button 
              onClick={() => setActiveTab('students')}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors whitespace-nowrap cursor-pointer text-left flex items-center gap-3"
            >
              <i className="ri-group-line text-xl"></i>
              Manage Students
            </button>
            <button 
              onClick={() => setActiveTab('earnings')}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors whitespace-nowrap cursor-pointer text-left flex items-center gap-3"
            >
              <i className="ri-money-dollar-circle-line text-xl"></i>
              View Earnings
            </button>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-teal-500 to-blue-500 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-xl font-bold mb-2">Grow Your Coaching Business</h4>
            <p className="opacity-90 mb-4">Upload more sessions and reach more students worldwide</p>
            <button 
              onClick={() => setShowUploadModal(true)}
              className="px-6 py-3 bg-white text-teal-600 rounded-lg hover:bg-slate-50 transition-colors whitespace-nowrap font-semibold cursor-pointer"
            >
              Get Started
            </button>
          </div>
          <i className="ri-trophy-line text-8xl opacity-20"></i>
        </div>
      </div>
    </div>
  );

  const renderTabsContent = () => {
    switch (activeTab) {
      case 'promotions':
        return renderPromotionsTab();
      case 'sessions':
        return renderSessionsTab();
      case 'schedule':
        return renderScheduleTab();
      case 'students':
        return renderStudentsTab();
      case 'earnings':
        return renderEarningsTab();
      case 'settings':
        return renderSettingsTab();
      case 'overview':
        return renderOverviewTab();
      default:
        return renderOverviewTab();
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">

      <div className="bg-gradient-to-r from-slate-900 to-slate-700 text-white py-10 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 lg:gap-10">
            <div className="flex items-center gap-4 sm:gap-6">
              <div className="w-20 h-20 sm:w-24 sm:h-24 bg-teal-600 rounded-full flex items-center justify-center text-3xl sm:text-4xl font-bold">
                {coachData.name.split(' ').map((n) => n[0]).join('')}
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1 sm:mb-2">
                  <h1 className="text-2xl sm:text-3xl font-bold">{coachData.name}</h1>
                  {coachData.verified && (
                    <i className="ri-verified-badge-fill text-blue-400 text-xl sm:text-2xl" title="Verified Coach"></i>
                  )}
                </div>
                <p className="text-slate-200 mb-1 text-sm sm:text-base">
                  {coachData.specialization} • {coachData.belt}
                </p>
                <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm">
                  <span className="flex items-center gap-1 whitespace-nowrap">
                    <i className="ri-star-fill text-yellow-400"></i>
                    {coachData.rating} ({coachData.totalReviews} reviews)
                  </span>
                  <span className="whitespace-nowrap">{coachData.totalStudents} Students</span>
                  <span className="whitespace-nowrap">{coachData.experience} Experience</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 flex items-center justify-center">
                <i className="ri-video-line text-2xl text-teal-600"></i>
              </div>
              <span className="text-sm text-slate-600">Total Sessions</span>
            </div>
            <div className="text-3xl font-bold text-slate-900">{recordedSessions.length}</div>
            <div className="text-sm text-green-600 mt-1">
              {recordedSessions.filter(s => s.status === 'Approved').length} approved
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 flex items-center justify-center">
                <i className="ri-eye-line text-2xl text-blue-600"></i>
              </div>
              <span className="text-sm text-slate-600">Total Views</span>
            </div>
            <div className="text-3xl font-bold text-slate-900">{totalViews.toLocaleString()}</div>
            <div className="text-sm text-slate-600 mt-1">Across all sessions</div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 flex items-center justify-center">
                <i className="ri-money-dollar-circle-line text-2xl text-green-600"></i>
              </div>
              <span className="text-sm text-slate-600">Total Revenue</span>
            </div>
            <div className="text-3xl font-bold text-slate-900">${totalRevenue.toLocaleString()}</div>
            <div className="text-sm text-green-600 mt-1">From paid sessions</div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 flex items-center justify-center">
                <i className="ri-user-follow-line text-2xl text-purple-600"></i>
              </div>
              <span className="text-sm text-slate-600">Subscribers</span>
            </div>
            <div className="text-3xl font-bold text-slate-900">{totalSubscribers}</div>
            <div className="text-sm text-slate-600 mt-1">Active learners</div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 flex items-center justify-center">
                <i className="ri-megaphone-line text-2xl text-purple-600"></i>
              </div>
              <span className="text-sm text-slate-600">Promotions</span>
            </div>
            <div className="text-3xl font-bold text-slate-900">{sponsoredSessions.filter(s => s.status === 'Active').length}</div>
            <div className="text-sm text-purple-600 mt-1">Active campaigns</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-lg mb-8">
          <div className="border-b border-slate-200 overflow-x-auto">
            <div className="flex gap-1 p-1 min-w-max sm:min-w-0">
              {['overview', 'sessions', 'students', 'schedule', 'promotions', 'earnings', 'profile', 'settings'].map(
                (tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-3 sm:px-4 md:px-6 py-2 sm:py-3 rounded-lg text-sm sm:text-base font-medium transition-colors whitespace-nowrap ${
                      activeTab === tab ? 'bg-teal-600 text-white' : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                )
              )}
            </div>
          </div>

          <div className="p-6">
            {renderTabsContent()}
          </div>
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
                  className="text-slate-400 hover:text-slate-600 cursor-pointer"
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
                    Video File *
                  </label>
                  <label className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center hover:border-teal-500 transition-colors cursor-pointer block">
                    <i className="ri-upload-cloud-2-line text-4xl text-slate-400 mb-2"></i>
                    <p className="text-slate-600 mb-1">
                      {uploadForm.videoFile ? uploadForm.videoFile.name : 'Click to upload or drag and drop'}
                    </p>
                    <p className="text-sm text-slate-500">MP4, MOV, or AVI (max 2GB)</p>
                    <input
                      type="file"
                      accept="video/*"
                      className="hidden"
                      onChange={handleFileSelect}
                    />
                  </label>
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
                    className="flex-1 px-6 py-3 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors font-semibold whitespace-nowrap cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors font-semibold whitespace-nowrap cursor-pointer"
                  >
                    Upload Session
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Session Details/Analytics Modal */}
      {showSessionDetails && selectedSession && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-6">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-slate-900">{selectedSession.title}</h3>
                  <p className="text-slate-600">Session Analytics</p>
                </div>
                <button
                  onClick={() => setShowSessionDetails(null)}
                  className="text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <i className="ri-close-line text-2xl"></i>
                </button>
              </div>

              <div className="grid grid-cols-4 gap-4 mb-6">
                <div className="bg-slate-50 rounded-lg p-4">
                  <div className="text-sm text-slate-600 mb-1">Total Views</div>
                  <div className="text-2xl font-bold text-slate-900">{selectedSession.views}</div>
                </div>
                <div className="bg-slate-50 rounded-lg p-4">
                  <div className="text-sm text-slate-600 mb-1">Subscribers</div>
                  <div className="text-2xl font-bold text-slate-900">{selectedSession.subscribers}</div>
                </div>
                <div className="bg-slate-50 rounded-lg p-4">
                  <div className="text-sm text-slate-600 mb-1">Revenue</div>
                  <div className="text-2xl font-bold text-green-600">${selectedSession.revenue.toFixed(2)}</div>
                </div>
                <div className="bg-slate-50 rounded-lg p-4">
                  <div className="text-sm text-slate-600 mb-1">Rating</div>
                  <div className="text-2xl font-bold text-slate-900 flex items-center gap-1">
                    <i className="ri-star-fill"></i>
                    {selectedSession.rating}
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 rounded-lg p-6 mb-6">
                <h4 className="font-bold text-slate-900 mb-4">Session Information</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-slate-600">Category:</span>
                    <span className="ml-2 font-semibold text-slate-900">{selectedSession.category}</span>
                  </div>
                  <div>
                    <span className="text-slate-600">Level:</span>
                    <span className="ml-2 font-semibold text-slate-900">{selectedSession.level}</span>
                  </div>
                  <div>
                    <span className="text-slate-600">Duration:</span>
                    <span className="ml-2 font-semibold text-slate-900">{selectedSession.duration}</span>
                  </div>
                  <div>
                    <span className="text-slate-600">Upload Date:</span>
                    <span className="ml-2 font-semibold text-slate-900">{selectedSession.uploadDate}</span>
                  </div>
                  <div>
                    <span className="text-slate-600">Status:</span>
                    <span className={`ml-2 px-3 py-1 rounded-full text-xs font-semibold ${
                      selectedSession.status === 'Approved' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {selectedSession.status}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-600">Price:</span>
                    <span className="ml-2 font-semibold text-green-600">
                      {selectedSession.isPaid ? `$${selectedSession.price}` : 'Free'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowSessionDetails(null)}
                  className="flex-1 px-6 py-3 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors font-semibold whitespace-nowrap cursor-pointer"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    setShowSessionDetails(null);
                    setShowEditModal(selectedSession.id);
                  }}
                  className="flex-1 px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors font-semibold whitespace-nowrap cursor-pointer"
                >
                  Edit Session
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-6">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-2xl font-bold text-slate-900">Edit Session</h3>
                <button
                  onClick={() => setShowEditModal(null)}
                  className="text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <i className="ri-close-line text-2xl"></i>
                </button>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <div className="flex items-start gap-2">
                  <i className="ri-information-line text-blue-600 mt-0.5"></i>
                  <div className="text-sm text-blue-900">
                    <p className="font-semibold mb-1">Edit Functionality</p>
                    <p>Session editing is currently under development. You'll be able to update session details, pricing, and content soon.</p>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setShowEditModal(null)}
                className="w-full px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors font-semibold whitespace-nowrap cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Promote Session Modal */}
      {showPromoteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900">Promote Your Session</h3>
              <button
                onClick={() => setShowPromoteModal(false)}
                className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
              >
                <i className="ri-close-line text-xl"></i>
              </button>
            </div>

            <div className="p-6">
              <div className="space-y-5">
                {/* Session Selection */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Select Session to Promote</label>
                  <select
                    value={newPromotion.sessionId}
                    onChange={(e) => setNewPromotion({ ...newPromotion, sessionId: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 pr-8 cursor-pointer"
                  >
                    <option value="">Choose a session...</option>
                    <option value="1">Advanced Guard Passing Techniques</option>
                    <option value="2">Submission Fundamentals</option>
                    <option value="3">No-Gi Grappling Basics</option>
                    <option value="4">Competition Preparation</option>
                    <option value="5">Takedown Mastery</option>
                  </select>
                </div>

                {/* Campaign Title */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Campaign Title</label>
                  <input
                    type="text"
                    value={newPromotion.title}
                    onChange={(e) => setNewPromotion({ ...newPromotion, title: e.target.value })}
                    placeholder="e.g., Master Guard Passing - Limited Time Offer"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                {/* Date Range */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">Start Date</label>
                    <input
                      type="date"
                      value={newPromotion.startDate}
                      onChange={(e) => setNewPromotion({ ...newPromotion, startDate: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">End Date</label>
                    <input
                      type="date"
                      value={newPromotion.endDate}
                      onChange={(e) => setNewPromotion({ ...newPromotion, endDate: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                </div>

                {/* Budget */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Campaign Budget ($)</label>
                  <input
                    type="number"
                    value={newPromotion.budget}
                    onChange={(e) => setNewPromotion({ ...newPromotion, budget: e.target.value })}
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                {/* Target Audience */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Target Audience</label>
                  <select
                    value={newPromotion.targetAudience}
                    onChange={(e) => setNewPromotion({ ...newPromotion, targetAudience: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 pr-8 cursor-pointer"
                  >
                    <option value="All Students">All Students</option>
                    <option value="Beginners">Beginners</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                    <option value="Competitors">Competitors</option>
                  </select>
                </div>

                {/* Placement Selection */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-3">Placement Locations</label>
                  <div className="grid grid-cols-2 gap-3">
                    {['Home Page', 'Sessions Page', 'Coaches Page', 'Live Classes', 'Clubs Page', 'Marketplace'].map((location) => (
                      <label key={location} className="flex items-center gap-3 p-3 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={newPromotion.placement.includes(location)}
                          onChange={() => togglePromotionPlacement(location)}
                          className="w-5 h-5 text-purple-600 rounded focus:ring-2 focus:ring-purple-500 cursor-pointer"
                        />
                        <span className="text-gray-900">{location}</span>
                      </label>
                    ))}
                  </div>
                  {newPromotion.placement.length === 0 && (
                    <p className="text-sm text-orange-600 mt-2">
                      <i className="ri-alert-line mr-1"></i>Please select at least one placement location
                    </p>
                  )}
                </div>

                {/* Campaign Goals */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Campaign Goals</label>
                  <textarea
                    value={newPromotion.goals}
                    onChange={(e) => {
                      if (e.target.value.length <= 500) {
                        setNewPromotion({ ...newPromotion, goals: e.target.value });
                      }
                    }}
                    placeholder="Describe what you want to achieve with this promotion..."
                    rows={4}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                  />
                  <div className="flex justify-between items-center mt-1">
                    <p className="text-xs text-gray-500">Describe your campaign objectives and target outcomes</p>
                    <p className="text-xs text-gray-500">{newPromotion.goals.length}/500</p>
                  </div>
                </div>

                {/* Info Box */}
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <div className="flex gap-3">
                    <i className="ri-information-line text-purple-600 text-xl flex-shrink-0"></i>
                    <div className="text-sm text-purple-900">
                      <p className="font-semibold mb-1">Promotion Benefits:</p>
                      <ul className="space-y-1 list-disc list-inside">
                        <li>Increase session visibility across the platform</li>
                        <li>Reach targeted students based on skill level</li>
                        <li>Track performance with detailed analytics</li>
                        <li>Boost enrollment and student engagement</li>
                        <li>Flexible budget and duration control</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 mt-6 pt-6 border-t border-gray-200">
                <button
                  onClick={handleCreatePromotion}
                  disabled={!newPromotion.sessionId || !newPromotion.title || !newPromotion.startDate || !newPromotion.endDate || !newPromotion.budget || newPromotion.placement.length === 0}
                  className="flex-1 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors cursor-pointer whitespace-nowrap font-semibold disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  <i className="ri-megaphone-line mr-2"></i>Launch Promotion
                </button>
                <button
                  onClick={() => setShowPromoteModal(false)}
                  className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer whitespace-nowrap font-semibold"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Message Modal */}
      {showMessageModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-6">
          <div className="bg-white rounded-xl max-w-2xl w-full">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-slate-900">Send Message</h3>
                  <p className="text-slate-600 mt-1">To: {selectedStudent}</p>
                </div>
                <button
                  onClick={() => {
                    setShowMessageModal(false);
                    setMessageForm({ subject: '', message: '' });
                    setSelectedStudent('');
                  }}
                  className="text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <i className="ri-close-line text-2xl"></i>
                </button>
              </div>

              <form onSubmit={handleMessageSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-2">
                    Subject *
                  </label>
                  <input
                    type="text"
                    required
                    value={messageForm.subject}
                    onChange={(e) => setMessageForm({ ...messageForm, subject: e.target.value })}
                    placeholder="Enter message subject"
                    className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-2">
                    Message *
                  </label>
                  <textarea
                    required
                    value={messageForm.message}
                    onChange={(e) => {
                      if (e.target.value.length <= 500) {
                        setMessageForm({ ...messageForm, message: e.target.value });
                      }
                    }}
                    placeholder="Type your message here..."
                    maxLength={500}
                    rows={6}
                    className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
                  />
                  <div className="text-sm text-slate-500 mt-1 text-right">
                    {messageForm.message.length}/500 characters
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start gap-2">
                    <i className="ri-mail-line text-blue-600 mt-0.5"></i>
                    <div className="text-sm text-blue-900">
                      <p className="font-semibold mb-1">Email Notification</p>
                      <p>This message will be sent to the student's registered email address.</p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowMessageModal(false);
                      setMessageForm({ subject: '', message: '' });
                      setSelectedStudent('');
                    }}
                    className="flex-1 px-6 py-3 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors font-semibold whitespace-nowrap cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors font-semibold whitespace-nowrap cursor-pointer"
                  >
                    <i className="ri-send-plane-fill mr-2"></i>
                    Send Message
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
