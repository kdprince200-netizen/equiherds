'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function StudentDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingField, setEditingField] = useState('');
  const [selectedSession, setSelectedSession] = useState(null);
  const [showSessionModal, setShowSessionModal] = useState(false);
  const [sessionFilter, setSessionFilter] = useState('all');
  const [sessionSearch, setSessionSearch] = useState('');

  const studentData = {
    name: 'Alex Thompson',
    email: 'alex.thompson@email.com',
    phone: '+1 (555) 123-4567',
    dateOfBirth: '1995-08-15',
    belt: 'Blue Belt',
    discipline: 'Brazilian Jiu-Jitsu',
    joinDate: '2023-06-15',
    totalSessions: 84,
    currentStreak: 12,
    membershipType: 'Unlimited',
    membershipExpiry: '2024-12-15',
    membershipStatus: 'Active',
    club: 'Elite Grappling Academy',
    coach: 'Marcus Silva',
    emergencyContact: {
      name: 'Sarah Thompson',
      relationship: 'Spouse',
      phone: '+1 (555) 987-6543'
    },
    medicalConditions: 'None',
    preferredClassTimes: ['Morning', 'Evening'],
    trainingExperience: '18 months',
    weight: '175 lbs',
    height: '5\'10"',
    address: {
      street: '123 Main Street',
      city: 'Los Angeles',
      state: 'CA',
      zipCode: '90210'
    }
  };

  const membershipDetails = {
    plan: 'Unlimited Monthly',
    price: '$149/month',
    nextBilling: '2024-03-15',
    paymentMethod: '**** **** **** 4532',
    autoRenewal: true,
    joinedDate: '2023-06-15',
    totalPaid: '$1,341'
  };

  const paymentHistory = [
    {
      id: 1,
      date: '2024-02-15',
      amount: '$149.00',
      description: 'Unlimited Monthly Membership',
      status: 'Paid',
      method: 'Credit Card'
    },
    {
      id: 2,
      date: '2024-01-15',
      amount: '$149.00',
      description: 'Unlimited Monthly Membership', 
      status: 'Paid',
      method: 'Credit Card'
    },
    {
      id: 3,
      date: '2023-12-15',
      amount: '$149.00',
      description: 'Unlimited Monthly Membership',
      status: 'Paid',
      method: 'Credit Card'
    }
  ];

  const progressMetrics = {
    technique: 78,
    conditioning: 85,
    sparring: 72,
    attendance: 92,
    flexibility: 68,
    strength: 81,
    cardio: 89,
    mentalFocus: 75
  };

  const upcomingClasses = [
    {
      id: 1,
      name: 'Fundamentals BJJ',
      coach: 'Marcus Silva',
      date: '2024-02-15',
      time: '06:00 PM',
      duration: '90 min',
      location: 'Elite Grappling Academy',
      enrolled: 12,
      capacity: 15,
      status: 'Enrolled'
    },
    {
      id: 2,
      name: 'Advanced Techniques',
      coach: 'Sarah Thompson',
      date: '2024-02-16',
      time: '07:30 PM',
      duration: '60 min',
      location: 'Elite Grappling Academy',
      enrolled: 8,
      capacity: 10,
      status: 'Available'
    },
    {
      id: 3,
      name: 'No-Gi Grappling',
      coach: 'Diego Rodriguez',
      date: '2024-02-17',
      time: '06:00 PM',
      duration: '90 min',
      location: 'Elite Grappling Academy',
      enrolled: 15,
      capacity: 15,
      status: 'Full'
    }
  ];

  const recentSessions = [
    {
      id: 1,
      class: 'Fundamentals BJJ',
      coach: 'Marcus Silva',
      date: '2024-02-12',
      duration: '90 min',
      rating: 5,
      notes: 'Worked on guard passes and submissions'
    },
    {
      id: 2,
      class: 'Sparring Session',
      coach: 'Diego Rodriguez',
      date: '2024-02-10',
      duration: '60 min',
      rating: 5,
      notes: 'Great rolling session, improved timing'
    },
    {
      id: 3,
      class: 'Advanced Techniques',
      coach: 'Sarah Thompson',
      date: '2024-02-08',
      duration: '60 min',
      rating: 4,
      notes: 'Learned new takedown variations'
    }
  ];

  const achievements = [
    {
      id: 1,
      title: '50 Sessions Milestone',
      description: 'Completed 50 training sessions',
      date: '2024-01-15',
      icon: 'ri-trophy-line',
      color: 'text-yellow-500'
    },
    {
      id: 2,
      title: 'Perfect Attendance',
      description: '30 day training streak',
      date: '2024-01-20',
      icon: 'ri-calendar-check-line',
      color: 'text-green-500'
    },
    {
      id: 3,
      title: 'Belt Promotion',
      description: 'Promoted to Blue Belt',
      date: '2023-12-10',
      icon: 'ri-medal-line',
      color: 'text-blue-500'
    }
  ];

  const trainingGoals = [
    {
      id: 1,
      goal: 'Complete 100 sessions',
      current: 84,
      target: 100,
      deadline: '2024-06-30'
    },
    {
      id: 2,
      goal: 'Master 20 techniques',
      current: 15,
      target: 20,
      deadline: '2024-05-31'
    },
    {
      id: 3,
      goal: 'Attend 4 sessions per week',
      current: 3.5,
      target: 4,
      deadline: 'Ongoing'
    }
  ];

  const recordedSessions = [
    {
      id: 1,
      title: 'Advanced Guard Passing Techniques',
      coach: 'Marcus Silva',
      coachVerified: true,
      club: 'Elite Grappling Academy',
      clubVerified: true,
      duration: '45 min',
      uploadDate: '2024-02-10',
      category: 'Technique',
      level: 'Advanced',
      views: 1234,
      rating: 4.9,
      thumbnail: 'https://readdy.ai/api/search-image?query=professional%20brazilian%20jiu%20jitsu%20instructor%20demonstrating%20guard%20pass%20technique%20in%20modern%20training%20facility%20with%20clean%20white%20background%20high%20quality%20sports%20photography&width=400&height=225&seq=rec1&orientation=landscape',
      isPaid: true,
      price: 29.99,
      subscribed: true,
      description: 'Master the most effective guard passing techniques used by world champions. This comprehensive session covers pressure passing, speed passing, and combination attacks.'
    },
    {
      id: 2,
      title: 'Fundamentals: Escapes and Defense',
      coach: 'Sarah Thompson',
      coachVerified: true,
      club: 'Elite Grappling Academy',
      clubVerified: false,
      duration: '60 min',
      uploadDate: '2024-02-08',
      category: 'Fundamentals',
      level: 'Beginner',
      views: 2156,
      rating: 4.8,
      thumbnail: 'https://readdy.ai/api/search-image?query=martial%20arts%20instructor%20teaching%20defensive%20escape%20techniques%20in%20professional%20gym%20setting%20with%20simple%20clean%20background%20sports%20training%20photography&width=400&height=225&seq=rec2&orientation=landscape',
      isPaid: false,
      price: 0,
      subscribed: true,
      description: 'Essential escape techniques every grappler must know. Learn how to escape from mount, side control, and back control positions safely and effectively.'
    },
    {
      id: 3,
      title: 'Competition Preparation: Mental Game',
      coach: 'Diego Rodriguez',
      coachVerified: true,
      club: 'Warriors MMA Gym',
      clubVerified: true,
      duration: '30 min',
      uploadDate: '2024-02-05',
      category: 'Mental Training',
      level: 'All Levels',
      views: 892,
      rating: 5.0,
      thumbnail: 'https://readdy.ai/api/search-image?query=focused%20martial%20arts%20athlete%20in%20meditation%20pose%20preparing%20for%20competition%20in%20modern%20gym%20with%20minimal%20clean%20background%20motivational%20sports%20image&width=400&height=225&seq=rec3&orientation=landscape',
      isPaid: true,
      price: 19.99,
      subscribed: true,
      description: 'Develop the mental toughness needed for competition success. Learn visualization techniques, breathing exercises, and pre-competition routines from a championship coach.'
    },
    {
      id: 4,
      title: 'Submission Chains from Top Position',
      coach: 'Marcus Silva',
      coachVerified: true,
      club: 'Elite Grappling Academy',
      clubVerified: true,
      duration: '50 min',
      uploadDate: '2024-01-28',
      category: 'Technique',
      level: 'Intermediate',
      views: 1567,
      rating: 4.7,
      thumbnail: 'https://readdy.ai/api/search-image?query=bjj%20instructor%20demonstrating%20submission%20technique%20from%20top%20position%20in%20professional%20training%20environment%20clean%20simple%20background%20martial%20arts%20photography&width=400&height=225&seq=rec4&orientation=landscape',
      isPaid: true,
      price: 24.99,
      subscribed: true,
      description: 'Learn to chain submissions together from dominant top positions. This session covers armbar to triangle transitions, kimura attacks, and more.'
    },
    {
      id: 5,
      title: 'Conditioning for Grapplers',
      coach: 'Alex Martinez',
      coachVerified: false,
      club: 'Fitness Combat Academy',
      clubVerified: false,
      duration: '40 min',
      uploadDate: '2024-01-20',
      category: 'Conditioning',
      level: 'All Levels',
      views: 3421,
      rating: 4.6,
      thumbnail: 'https://readdy.ai/api/search-image?query=athletic%20person%20doing%20intense%20grappling%20conditioning%20workout%20exercises%20in%20clean%20modern%20gym%20with%20simple%20background%20fitness%20training%20photography&width=400&height=225&seq=rec5&orientation=landscape',
      isPaid: false,
      price: 0,
      subscribed: true,
      description: 'Build the endurance and strength needed for high-level grappling. Follow along with this intense conditioning workout designed specifically for combat athletes.'
    }
  ];

  const filteredSessions = recordedSessions.filter(session => {
    const matchesFilter = sessionFilter === 'all' || session.category.toLowerCase() === sessionFilter.toLowerCase();
    const matchesSearch = session.title.toLowerCase().includes(sessionSearch.toLowerCase()) ||
                         session.coach.toLowerCase().includes(sessionSearch.toLowerCase()) ||
                         session.club.toLowerCase().includes(sessionSearch.toLowerCase());
    return matchesFilter && matchesSearch && session.subscribed;
  });

  const handlePlaySession = (session) => {
    setSelectedSession(session);
    setShowSessionModal(true);
  };

  const handleBookClass = (classItem) => {
    setSelectedClass(classItem);
    setShowBookingModal(true);
  };

  const handleConfirmBooking = () => {
    if (!selectedClass) {
      return;
    }
    alert(`Successfully booked: ${selectedClass.name}`);
    setShowBookingModal(false);
    setSelectedClass(null);
  };

  const handleEditField = (field) => {
    setEditingField(field);
    setShowEditModal(true);
  };

  const handleSaveEdit = () => {
    alert('Changes saved successfully! This will be connected to Supabase for real data updates.');
    setShowEditModal(false);
    setEditingField('');
  };

  const handleBrowseClasses = () => {
    router.push('/live-classes');
  };

  return (
    <div className="min-h-screen bg-white">

      <div className="bg-gradient-to-r from-slate-900 to-slate-700 text-white py-10 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 lg:gap-10">
            <div className="flex items-center gap-4 sm:gap-6">
              <div className="w-20 h-20 sm:w-24 sm:h-24 bg-teal-600 rounded-full flex items-center justify-center text-3xl sm:text-4xl font-bold">
                {studentData.name.split(' ').map((n) => n[0]).join('')}
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold mb-1 sm:mb-2">{studentData.name}</h1>
                <p className="text-slate-200 mb-1 text-sm sm:text-base">
                  {studentData.discipline} • {studentData.belt}
                </p>
                <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm">
                  <span className="flex items-center gap-1 whitespace-nowrap">
                    <i className="ri-calendar-line"></i>
                    Member since {new Date(studentData.joinDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                  </span>
                  <span className="flex items-center gap-1 whitespace-nowrap">
                    <i className="ri-fire-line text-orange-400"></i>
                    {studentData.currentStreak} day streak
                  </span>
                </div>
              </div>
            </div>
            <div className="text-left lg:text-right w-full lg:w-auto">
              <div className="bg-white/10 rounded-lg px-4 py-3 sm:px-6 mb-2">
                <div className="text-xs sm:text-sm text-slate-300">Membership Status</div>
                <div className="text-lg sm:text-xl font-bold text-green-400">
                  Active - {studentData.membershipType}
                </div>
              </div>
              <p className="text-xs sm:text-sm text-slate-300">Renews on {studentData.membershipExpiry}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 flex items-center justify-center">
                <i className="ri-calendar-check-line text-2xl text-teal-600"></i>
              </div>
              <span className="text-sm text-slate-600">Total Sessions</span>
            </div>
            <div className="text-3xl font-bold text-slate-900">{studentData.totalSessions}</div>
            <div className="text-sm text-green-600 mt-1">+8 this month</div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 flex items-center justify-center">
                <i className="ri-fire-line text-2xl text-orange-600"></i>
              </div>
              <span className="text-sm text-slate-600">Current Streak</span>
            </div>
            <div className="text-3xl font-bold text-slate-900">{studentData.currentStreak} days</div>
            <div className="text-sm text-slate-600 mt-1">Keep it up!</div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 flex items-center justify-center">
                <i className="ri-trophy-line text-2xl text-yellow-600"></i>
              </div>
              <span className="text-sm text-slate-600">Achievements</span>
            </div>
            <div className="text-3xl font-bold text-slate-900">{achievements.length}</div>
            <div className="text-sm text-slate-600 mt-1">Unlocked</div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 flex items-center justify-center">
                <i className="ri-line-chart-line text-2xl text-blue-600"></i>
              </div>
              <span className="text-sm text-slate-600">Progress</span>
            </div>
            <div className="text-3xl font-bold text-slate-900">
              {Math.round(Object.values(progressMetrics).reduce((a, b) => a + b, 0) / Object.values(progressMetrics).length)}%
            </div>
            <div className="text-sm text-green-600 mt-1">+5% this month</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-lg mb-8">
          <div className="border-b border-slate-200 overflow-x-auto">
            <div className="flex gap-1 p-1 min-w-max sm:min-w-0">
              {['overview', 'schedule', 'recorded-sessions', 'progress', 'achievements', 'goals', 'membership', 'profile', 'settings'].map(
                (tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-3 sm:px-4 md:px-6 py-2 sm:py-3 rounded-lg text-sm sm:text-base font-medium transition-colors whitespace-nowrap ${
                      activeTab === tab
                        ? 'bg-teal-600 text-white'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {tab === 'recorded-sessions' ? 'Recorded Sessions' : tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                )
              )}
            </div>
          </div>

          <div className="p-6">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-4">Upcoming Classes</h3>
                  <div className="space-y-4">
                    {upcomingClasses.map((classItem) => (
                      <div
                        key={classItem.id}
                        className="bg-slate-50 rounded-lg p-4 flex items-center justify-between"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-teal-600 rounded-full flex items-center justify-center text-white">
                            <i className="ri-calendar-line text-xl"></i>
                          </div>
                          <div>
                            <h4 className="font-semibold text-slate-900 text-lg">
                              {classItem.name}
                            </h4>
                            <p className="text-sm text-slate-600">
                              Coach: {classItem.coach} • {classItem.duration}
                            </p>
                            <p className="text-sm text-slate-600">
                              {classItem.date} at {classItem.time}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-slate-600 mb-2">
                            {classItem.enrolled}/{classItem.capacity} enrolled
                          </div>
                          {classItem.status === 'Enrolled' ? (
                            <span className="px-4 py-2 bg-green-100 text-green-700 rounded-lg text-sm font-semibold">
                              Enrolled
                            </span>
                          ) : classItem.status === 'Full' ? (
                            <span className="px-4 py-2 bg-slate-200 text-slate-600 rounded-lg text-sm font-semibold">
                              Full
                            </span>
                          ) : (
                            <button
                              onClick={() => handleBookClass(classItem)}
                              className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors whitespace-nowrap"
                            >
                              Book Class
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-4">Recent Sessions</h3>
                  <div className="space-y-3">
                    {recentSessions.map((session) => (
                      <div
                        key={session.id}
                        className="flex items-center justify-between py-3 border-b border-slate-200"
                      >
                        <div>
                          <p className="font-semibold text-slate-900">{session.class}</p>
                          <p className="text-sm text-slate-600">
                            {session.coach} • {session.date}
                          </p>
                          <p className="text-sm text-slate-500 italic">{session.notes}</p>
                        </div>
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <i
                              key={i}
                              className={`ri-star-fill text-sm ${
                                i < session.rating ? 'text-yellow-500' : 'text-slate-300'
                              }`}
                            ></i>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Membership Tab */}
            {activeTab === 'membership' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-slate-50 rounded-lg p-6">
                    <h4 className="font-semibold text-slate-900 mb-4">Current Membership</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-slate-600">Plan:</span>
                        <span className="font-semibold text-slate-900">{membershipDetails.plan}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Price:</span>
                        <span className="font-semibold text-slate-900">{membershipDetails.price}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Next Billing:</span>
                        <span className="font-semibold text-slate-900">{membershipDetails.nextBilling}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Payment Method:</span>
                        <span className="font-semibold text-slate-900">{membershipDetails.paymentMethod}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Auto-Renewal:</span>
                        <span className={`font-semibold ${membershipDetails.autoRenewal ? 'text-green-600' : 'text-red-600'}`}>
                          {membershipDetails.autoRenewal ? 'Enabled' : 'Disabled'}
                        </span>
                      </div>
                    </div>
                    <button className="w-full mt-4 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors whitespace-nowrap">
                      Manage Membership
                    </button>
                  </div>

                  <div className="bg-slate-50 rounded-lg p-6">
                    <h4 className="font-semibold text-slate-900 mb-4">Membership Summary</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-slate-600">Member Since:</span>
                        <span className="font-semibold text-slate-900">{membershipDetails.joinedDate}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Total Paid:</span>
                        <span className="font-semibold text-green-600">{membershipDetails.totalPaid}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Status:</span>
                        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                          Active
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-slate-900 mb-4">Payment History</h4>
                  <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-slate-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Date</th>
                          <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Description</th>
                          <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Amount</th>
                          <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Method</th>
                          <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200">
                        {paymentHistory.map((payment) => (
                          <tr key={payment.id}>
                            <td className="px-6 py-4 text-sm text-slate-900">{payment.date}</td>
                            <td className="px-6 py-4 text-sm text-slate-900">{payment.description}</td>
                            <td className="px-6 py-4 text-sm font-semibold text-slate-900">{payment.amount}</td>
                            <td className="px-6 py-4 text-sm text-slate-600">{payment.method}</td>
                            <td className="px-6 py-4">
                              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                                {payment.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-slate-50 rounded-lg p-6">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="font-semibold text-slate-900">Personal Information</h4>
                      <button 
                        onClick={() => handleEditField('personal')}
                        className="text-teal-600 hover:text-teal-700 text-sm font-semibold whitespace-nowrap"
                      >
                        <i className="ri-edit-line mr-1"></i>Edit
                      </button>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <span className="text-sm text-slate-600">Full Name:</span>
                        <p className="font-semibold text-slate-900">{studentData.name}</p>
                      </div>
                      <div>
                        <span className="text-sm text-slate-600">Email:</span>
                        <p className="font-semibold text-slate-900">{studentData.email}</p>
                      </div>
                      <div>
                        <span className="text-sm text-slate-600">Phone:</span>
                        <p className="font-semibold text-slate-900">{studentData.phone}</p>
                      </div>
                      <div>
                        <span className="text-sm text-slate-600">Date of Birth:</span>
                        <p className="font-semibold text-slate-900">{studentData.dateOfBirth}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-50 rounded-lg p-6">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="font-semibold text-slate-900">Physical Information</h4>
                      <button 
                        onClick={() => handleEditField('physical')}
                        className="text-teal-600 hover:text-teal-700 text-sm font-semibold whitespace-nowrap"
                      >
                        <i className="ri-edit-line mr-1"></i>Edit
                      </button>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <span className="text-sm text-slate-600">Height:</span>
                        <p className="font-semibold text-slate-900">{studentData.height}</p>
                      </div>
                      <div>
                        <span className="text-sm text-slate-600">Weight:</span>
                        <p className="font-semibold text-slate-900">{studentData.weight}</p>
                      </div>
                      <div>
                        <span className="text-sm text-slate-600">Training Experience:</span>
                        <p className="font-semibold text-slate-900">{studentData.trainingExperience}</p>
                      </div>
                      <div>
                        <span className="text-sm text-slate-600">Medical Conditions:</span>
                        <p className="font-semibold text-slate-900">{studentData.medicalConditions}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-slate-50 rounded-lg p-6">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="font-semibold text-slate-900">Address</h4>
                      <button 
                        onClick={() => handleEditField('address')}
                        className="text-teal-600 hover:text-teal-700 text-sm font-semibold whitespace-nowrap"
                      >
                        <i className="ri-edit-line mr-1"></i>Edit
                      </button>
                    </div>
                    <div className="space-y-1">
                      <p className="font-semibold text-slate-900">{studentData.address.street}</p>
                      <p className="text-slate-600">
                        {studentData.address.city}, {studentData.address.state} {studentData.address.zipCode}
                      </p>
                    </div>
                  </div>

                  <div className="bg-slate-50 rounded-lg p-6">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="font-semibold text-slate-900">Emergency Contact</h4>
                      <button 
                        onClick={() => handleEditField('emergency')}
                        className="text-teal-600 hover:text-teal-700 text-sm font-semibold whitespace-nowrap"
                      >
                        <i className="ri-edit-line mr-1"></i>Edit
                      </button>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <span className="text-sm text-slate-600">Name:</span>
                        <p className="font-semibold text-slate-900">{studentData.emergencyContact.name}</p>
                      </div>
                      <div>
                        <span className="text-sm text-slate-600">Relationship:</span>
                        <p className="font-semibold text-slate-900">{studentData.emergencyContact.relationship}</p>
                      </div>
                      <div>
                        <span className="text-sm text-slate-600">Phone:</span>
                        <p className="font-semibold text-slate-900">{studentData.emergencyContact.phone}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Recorded Sessions Tab */}
            {activeTab === 'recorded-sessions' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-slate-900">My Recorded Sessions</h3>
                  <div className="flex gap-3">
                    <div className="relative">
                      <i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"></i>
                      <input
                        type="text"
                        placeholder="Search sessions..."
                        value={sessionSearch}
                        onChange={(e) => setSessionSearch(e.target.value)}
                        className="pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
                      />
                    </div>
                    <select 
                      value={sessionFilter}
                      onChange={(e) => setSessionFilter(e.target.value)}
                      className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm pr-8"
                    >
                      <option value="all">All Categories</option>
                      <option value="technique">Technique</option>
                      <option value="fundamentals">Fundamentals</option>
                      <option value="conditioning">Conditioning</option>
                      <option value="mental training">Mental Training</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredSessions.map((session) => (
                    <div key={session.id} className="bg-white border border-slate-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow">
                      <div className="relative">
                        <img 
                          src={session.thumbnail} 
                          alt={session.title}
                          className="w-full h-48 object-cover object-top"
                        />
                        <div className="absolute top-3 right-3 bg-black/70 text-white px-3 py-1 rounded-lg text-sm font-semibold">
                          {session.duration}
                        </div>
                        {session.isPaid && (
                          <div className="absolute top-3 left-3 bg-teal-600 text-white px-3 py-1 rounded-lg text-sm font-semibold">
                            Premium
                          </div>
                        )}
                      </div>
                      <div className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-bold text-slate-900 text-lg flex-1">{session.title}</h4>
                        </div>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-sm text-slate-600">Coach: {session.coach}</span>
                          {session.coachVerified && (
                            <i className="ri-verified-badge-fill text-blue-500 text-sm" title="Verified Coach"></i>
                          )}
                        </div>
                        <div className="flex items-center gap-2 mb-3">
                          <span className="text-sm text-slate-600">{session.club}</span>
                          {session.clubVerified && (
                            <i className="ri-verified-badge-fill text-blue-500 text-sm" title="Verified Club"></i>
                          )}
                        </div>
                        <div className="flex items-center gap-4 mb-3 text-sm text-slate-600">
                          <span className="flex items-center gap-1">
                            <i className="ri-star-fill text-yellow-500"></i>
                            {session.rating}
                          </span>
                          <span className="flex items-center gap-1">
                            <i className="ri-eye-line"></i>
                            {session.views.toLocaleString()} views
                          </span>
                          <span className="px-2 py-1 bg-slate-100 rounded text-xs font-semibold">
                            {session.level}
                          </span>
                        </div>
                        <p className="text-sm text-slate-600 mb-4 line-clamp-2">{session.description}</p>
                        <button
                          onClick={() => handlePlaySession(session)}
                          className="w-full bg-teal-600 hover:bg-teal-700 text-white py-3 px-4 rounded-lg font-semibold transition-colors whitespace-nowrap flex items-center justify-center gap-2"
                        >
                          <i className="ri-play-circle-line text-xl"></i>
                          Watch Now
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {filteredSessions.length === 0 && (
                  <div className="text-center py-12">
                    <i className="ri-video-line text-6xl text-slate-300 mb-4"></i>
                    <h4 className="text-xl font-bold text-slate-900 mb-2">No Sessions Found</h4>
                    <p className="text-slate-600 mb-6">
                      {sessionSearch || sessionFilter !== 'all' 
                        ? 'Try adjusting your search or filters' 
                        : 'You haven\'t subscribed to any recorded sessions yet'}
                    </p>
                    <button className="px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors whitespace-nowrap">
                      Browse Available Sessions
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Schedule Tab */}
            {activeTab === 'schedule' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-slate-900">My Schedule</h3>
                  <div className="flex gap-2">
                    <button className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors whitespace-nowrap">
                      <i className="ri-filter-line mr-2"></i>
                      Filter
                    </button>
                    <button 
                      onClick={handleBrowseClasses}
                      className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors whitespace-nowrap"
                    >
                      <i className="ri-add-line mr-2"></i>
                      Browse Classes
                    </button>
                  </div>
                </div>

                <div className="bg-slate-50 rounded-lg p-6 mb-6">
                  <div className="grid grid-cols-7 gap-4 mb-4">
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                      <div key={day} className="text-center font-semibold text-slate-900">
                        {day}
                      </div>
                    ))}
                  </div>
                  <div className="grid grid-cols-7 gap-4">
                    {[...Array(35)].map((_, i) => (
                      <div
                        key={i}
                        className="aspect-square bg-white rounded-lg p-2 border border-slate-200 hover:border-teal-600 cursor-pointer transition-colors"
                      >
                        <div className="text-sm font-semibold text-slate-900">{i + 1}</div>
                        {i % 4 === 0 && (
                          <div className="mt-1 text-xs bg-teal-100 text-teal-700 rounded px-1 py-0.5">
                            Class
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-4">All Enrolled Classes</h3>
                  <div className="space-y-4">
                    {upcomingClasses.filter(c => c.status === 'Enrolled').map((classItem) => (
                      <div key={classItem.id} className="bg-slate-50 rounded-lg p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h4 className="text-lg font-bold text-slate-900">{classItem.name}</h4>
                            <p className="text-slate-600">Instructor: {classItem.coach}</p>
                          </div>
                          <div className="flex gap-2">
                            <button className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors whitespace-nowrap">
                              Cancel
                            </button>
                          </div>
                        </div>
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className="text-slate-600">Schedule:</span>
                            <p className="font-semibold text-slate-900">
                              {classItem.date} {classItem.time}
                            </p>
                          </div>
                          <div>
                            <span className="text-slate-600">Duration:</span>
                            <p className="font-semibold text-slate-900">{classItem.duration}</p>
                          </div>
                          <div>
                            <span className="text-slate-600">Location:</span>
                            <p className="font-semibold text-slate-900">{classItem.location}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Progress Tab */}
            {activeTab === 'progress' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-4">Training Progress</h3>
                  {Object.entries(progressMetrics).map(([key, value]) => (
                    <div key={key} className="mb-6">
                      <div className="flex justify-between mb-2">
                        <span className="font-semibold text-slate-900 capitalize">
                          {key}
                        </span>
                        <span className="font-bold text-teal-600">{value}%</span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-3">
                        <div
                          className="bg-teal-600 h-3 rounded-full transition-all"
                          style={{ width: `${value}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="bg-slate-50 rounded-lg p-6">
                    <h4 className="font-semibold text-slate-900 mb-4">Training Stats</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-slate-600">Total Hours:</span>
                        <span className="font-semibold text-slate-900">126 hrs</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">This Month:</span>
                        <span className="font-semibold text-slate-900">18 hrs</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Avg per Week:</span>
                        <span className="font-semibold text-slate-900">4.5 hrs</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Attendance Rate:</span>
                        <span className="font-semibold text-green-600">92%</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-50 rounded-lg p-6">
                    <h4 className="font-semibold text-slate-900 mb-4">Belt Progress</h4>
                    <div className="text-center mb-4">
                      <div className="text-4xl font-bold text-blue-600 mb-2">Blue Belt</div>
                      <p className="text-sm text-slate-600">Current Rank</p>
                    </div>
                    <div className="mb-2">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-slate-600">Progress to Purple Belt</span>
                        <span className="font-semibold text-slate-900">45%</span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2">
                        <div className="bg-purple-600 h-2 rounded-full" style={{ width: '45%' }} />
                      </div>
                    </div>
                    <p className="text-xs text-slate-500 mt-3">
                      Estimated time to next belt: 8-12 months
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-4">Technique Mastery</h3>
                  <div className="grid grid-cols-3 gap-4">
                    {[
                      { name: 'Guard Passes', level: 8, total: 10 },
                      { name: 'Submissions', level: 6, total: 10 },
                      { name: 'Takedowns', level: 7, total: 10 },
                      { name: 'Escapes', level: 9, total: 10 },
                      { name: 'Sweeps', level: 5, total: 10 },
                      { name: 'Defense', level: 8, total: 10 }
                    ].map((technique) => (
                      <div key={technique.name} className="bg-slate-50 rounded-lg p-4">
                        <h5 className="font-semibold text-slate-900 mb-2">{technique.name}</h5>
                        <div className="flex gap-1">
                          {[...Array(technique.total)].map((_, i) => (
                            <div
                              key={i}
                              className={`h-2 flex-1 rounded ${
                                i < technique.level ? 'bg-teal-600' : 'bg-slate-200'
                              }`}
                            />
                          ))}
                        </div>
                        <p className="text-xs text-slate-600 mt-2">
                          Level {technique.level}/{technique.total}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Achievements Tab */}
            {activeTab === 'achievements' && (
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-6">Your Achievements</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {achievements.map((achievement) => (
                    <div
                      key={achievement.id}
                      className="bg-slate-50 rounded-lg p-6 text-center hover:shadow-lg transition-shadow"
                    >
                      <div className={`text-5xl mb-4 ${achievement.color}`}>
                        <i className={achievement.icon}></i>
                      </div>
                      <h4 className="font-bold text-slate-900 mb-2">{achievement.title}</h4>
                      <p className="text-sm text-slate-600 mb-3">{achievement.description}</p>
                      <p className="text-xs text-slate-500">Earned on {achievement.date}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-8">
                  <h3 className="text-xl font-bold text-slate-900 mb-4">Locked Achievements</h3>
                  <div className="grid grid-cols-3 gap-6">
                    {[
                      { title: '100 Sessions', description: 'Complete 100 training sessions', progress: 84 },
                      { title: 'Competition Ready', description: 'Enter your first competition', progress: 0 },
                      { title: 'Master Instructor', description: 'Train with 5 different coaches', progress: 60 }
                    ].map((locked, index) => (
                      <div
                        key={index}
                        className="bg-slate-50 rounded-lg p-6 text-center opacity-60"
                      >
                        <div className="text-5xl mb-4 text-slate-400">
                          <i className="ri-lock-line"></i>
                        </div>
                        <h4 className="font-bold text-slate-900 mb-2">{locked.title}</h4>
                        <p className="text-sm text-slate-600 mb-3">{locked.description}</p>
                        {locked.progress > 0 && (
                          <div className="mt-3">
                            <div className="w-full bg-slate-200 rounded-full h-2">
                              <div
                                className="bg-teal-600 h-2 rounded-full"
                                style={{ width: `${locked.progress}%` }}
                              />
                            </div>
                            <p className="text-xs text-slate-500 mt-1">{locked.progress}% complete</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Goals Tab */}
            {activeTab === 'goals' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-slate-900">Training Goals</h3>
                  <button className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors whitespace-nowrap">
                    <i className="ri-add-line mr-2"></i>
                    Add New Goal
                  </button>
                </div>

                <div className="space-y-6">
                  {trainingGoals.map((goal) => (
                    <div key={goal.id} className="bg-slate-50 rounded-lg p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h4 className="text-lg font-bold text-slate-900">{goal.goal}</h4>
                          <p className="text-sm text-slate-600">Deadline: {goal.deadline}</p>
                        </div>
                        <button className="text-slate-400 hover:text-slate-600">
                          <i className="ri-more-2-fill text-xl"></i>
                        </button>
                      </div>
                      <div className="mb-2">
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-slate-600">Progress</span>
                          <span className="font-semibold text-slate-900">
                            {goal.current} / {goal.target}
                          </span>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-3">
                          <div
                            className="bg-teal-600 h-3 rounded-full transition-all"
                            style={{ width: `${(goal.current / goal.target) * 100}%` }}
                          />
                        </div>
                      </div>
                      <p className="text-sm text-slate-600 mt-3">
                        {Math.round((goal.current / goal.target) * 100)}% complete
                      </p>
                    </div>
                  ))}
                </div>

                <div className="mt-8 bg-slate-50 rounded-lg p-6">
                  <h4 className="font-semibold text-slate-900 mb-4">Goal Insights</h4>
                  <ul className="space-y-3 text-sm text-slate-700">
                    <li className="flex items-start gap-2">
                      <i className="ri-checkbox-circle-line text-green-500 mt-1"></i>
                      <span>You're on track to complete your 100 sessions goal</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <i className="ri-arrow-up-line text-blue-500 mt-1"></i>
                      <span>Training frequency increased by 15% this month</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <i className="ri-lightbulb-line text-yellow-500 mt-1"></i>
                      <span>Consider adding a competition goal to challenge yourself</span>
                    </li>
                  </ul>
                </div>
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-4">Profile Settings</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-slate-900 mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        defaultValue={studentData.name}
                        className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-900 mb-2">
                        Primary Discipline
                      </label>
                      <select className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500 pr-8">
                        <option>Brazilian Jiu-Jitsu</option>
                        <option>Wrestling</option>
                        <option>Judo</option>
                        <option>MMA</option>
                        <option>Karate</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-900 mb-2">
                        Current Belt/Rank
                      </label>
                      <select className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500 pr-8">
                        <option>White Belt</option>
                        <option selected>Blue Belt</option>
                        <option>Purple Belt</option>
                        <option>Brown Belt</option>
                        <option>Black Belt</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-4">Notifications</h3>
                  <div className="space-y-3">
                    {[
                      { label: 'Class Reminders', checked: true },
                      { label: 'Achievement Notifications', checked: true },
                      { label: 'Progress Updates', checked: true },
                      { label: 'Promotional Emails', checked: false }
                    ].map((notification, index) => (
                      <label key={index} className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          defaultChecked={notification.checked}
                          className="w-5 h-5 text-teal-600 rounded focus:ring-2 focus:ring-teal-500"
                        />
                        <span className="text-slate-900">{notification.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <button className="w-full bg-slate-900 hover:bg-slate-800 text-white py-3 px-6 rounded-lg font-semibold transition-colors whitespace-nowrap">
                  Save Changes
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      {showBookingModal && selectedClass && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-6">
          <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-2xl font-bold text-slate-900">Confirm Booking</h3>
                <button
                  onClick={() => setShowBookingModal(false)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <i className="ri-close-line text-2xl"></i>
                </button>
              </div>

              <div className="bg-slate-50 rounded-lg p-4 mb-6">
                <h4 className="font-bold text-slate-900 text-lg mb-2">{selectedClass.name}</h4>
                <div className="space-y-1 text-sm text-slate-600">
                  <p>Coach: {selectedClass.coach}</p>
                  <p>Date: {selectedClass.date}</p>
                  <p>Time: {selectedClass.time}</p>
                  <p>Duration: {selectedClass.duration}</p>
                  <p>Location: {selectedClass.location}</p>
                </div>
              </div>

              <div className="space-y-4 mb-6">
                <p className="text-sm text-slate-600">
                  This class will be added to your schedule. You can cancel up to 2 hours before the class starts.
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowBookingModal(false)}
                  className="flex-1 px-6 py-3 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors font-semibold whitespace-nowrap"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmBooking}
                  className="flex-1 px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors font-semibold whitespace-nowrap"
                >
                  Confirm Booking
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-6">
          <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-2xl font-bold text-slate-900">Edit {editingField}</h3>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <i className="ri-close-line text-2xl"></i>
                </button>
              </div>

              <div className="space-y-4 mb-6">
                <p className="text-sm text-slate-600">
                  Make changes to your {editingField} information. Changes will be saved automatically.
                </p>
                <textarea
                  placeholder="Enter your updates here..."
                  maxLength={500}
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
                  rows={4}
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 px-6 py-3 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors font-semibold whitespace-nowrap"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveEdit}
                  className="flex-1 px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors font-semibold whitespace-nowrap"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Session Player Modal */}
      {showSessionModal && selectedSession && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-6">
          <div className="bg-white rounded-xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">{selectedSession.title}</h3>
                  <div className="flex items-center gap-4 text-sm text-slate-600">
                    <span className="flex items-center gap-1">
                      Coach: {selectedSession.coach}
                      {selectedSession.coachVerified && (
                        <i className="ri-verified-badge-fill text-blue-500" title="Verified Coach"></i>
                      )}
                    </span>
                    <span>•</span>
                    <span>{selectedSession.duration}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <i className="ri-star-fill text-yellow-500"></i>
                      {selectedSession.rating}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setShowSessionModal(false)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <i className="ri-close-line text-2xl"></i>
                </button>
              </div>

              <div className="bg-slate-900 rounded-lg mb-6 aspect-video flex items-center justify-center">
                <div className="text-center text-white">
                  <i className="ri-play-circle-line text-6xl mb-4"></i>
                  <p className="text-lg">Video Player</p>
                  <p className="text-sm text-slate-400 mt-2">This will be connected to your video hosting service</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-6 mb-6">
                <div className="bg-slate-50 rounded-lg p-4">
                  <div className="text-sm text-slate-600 mb-1">Category</div>
                  <div className="font-semibold text-slate-900">{selectedSession.category}</div>
                </div>
                <div className="bg-slate-50 rounded-lg p-4">
                  <div className="text-sm text-slate-600 mb-1">Level</div>
                  <div className="font-semibold text-slate-900">{selectedSession.level}</div>
                </div>
                <div className="bg-slate-50 rounded-lg p-4">
                  <div className="text-sm text-slate-600 mb-1">Views</div>
                  <div className="font-semibold text-slate-900">{selectedSession.views.toLocaleString()}</div>
                </div>
              </div>

              <div className="mb-6">
                <h4 className="font-bold text-slate-900 mb-2">About This Session</h4>
                <p className="text-slate-700">{selectedSession.description}</p>
              </div>

              <div className="bg-slate-50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-slate-900 mb-1">{selectedSession.club}</div>
                    <div className="text-sm text-slate-600">Uploaded on {selectedSession.uploadDate}</div>
                  </div>
                  {selectedSession.clubVerified && (
                    <div className="flex items-center gap-2 text-blue-600">
                      <i className="ri-verified-badge-fill text-xl"></i>
                      <span className="text-sm font-semibold">Verified Club</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
