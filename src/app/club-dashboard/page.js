'use client';

import { useState } from 'react';
import Tabs from '../../components/club-dashboard/Tabs';
import OverviewTab from '../../components/club-dashboard/tabs/OverviewTab';
import MembersTab from '../../components/club-dashboard/tabs/MembersTab';
import CoachesTab from '../../components/club-dashboard/tabs/CoachesTab';
import ClassesTab from '../../components/club-dashboard/tabs/ClassesTab';
import RecordedSessionsTab from '../../components/club-dashboard/tabs/RecordedSessionsTab';
import PromotionsTab from '../../components/club-dashboard/tabs/PromotionsTab';
import FinancesTab from '../../components/club-dashboard/tabs/FinancesTab';
import FacilitiesTab from '../../components/club-dashboard/tabs/FacilitiesTab';
import PerformanceTab from '../../components/club-dashboard/tabs/PerformanceTab';
import ProfileTab from '../../components/club-dashboard/tabs/ProfileTab';
import SettingsTab from '../../components/club-dashboard/tabs/SettingsTab';

export default function ClubDashboard() {
  const [activeTab, setActiveTab] = useState('overview');

  const clubData = {
    name: 'Elite Grappling Academy',
    email: 'info@elitegrappling.com',
    phone: '+1 (555) 234-5678',
    location: 'Los Angeles, CA',
    address: {
      street: '789 Martial Arts Boulevard',
      city: 'Los Angeles',
      state: 'CA',
      zipCode: '90210'
    },
    established: '2015',
    rating: 4.8,
    totalReviews: 234,
    totalMembers: 156,
    activeMembers: 142,
    coaches: 8,
    monthlyRevenue: 24500,
    subscriptionPlan: 'Premium',
    subscriptionExpiry: '2024-11-20',
    subscriptionStatus: 'Active',
    facilities: ['Main Training Area', 'Cardio Zone', 'Locker Rooms', 'Pro Shop'],
    operatingHours: 'Mon-Fri: 6AM-10PM, Sat-Sun: 8AM-8PM',
    website: 'www.elitegrappling.com',
    socialMedia: {
      facebook: '@elitegrappling',
      instagram: '@elitegrappling',
      twitter: '@elitegrappling'
    },
    verified: true
  };


  const financialData = {
    thisMonth: {
      revenue: 24500,
      expenses: 12300,
      profit: 12200,
      membershipFees: 18900,
      privateClasses: 4200,
      merchandise: 1400
    },
    lastMonth: {
      revenue: 22800,
      expenses: 11900,
      profit: 10900
    },
    yearToDate: {
      revenue: 289400,
      expenses: 145600,
      profit: 143800
    }
  };


  const sponsoredSessions = [
    {
      id: 1,
      title: 'Elite BJJ Masterclass - SPONSORED',
      coach: 'Marcus Silva',
      startDate: '2024-02-01',
      endDate: '2024-03-01',
      budget: 500,
      impressions: 12450,
      clicks: 890,
      enrollments: 67,
      status: 'Active',
      thumbnail: 'https://readdy.ai/api/search-image?query=professional%20brazilian%20jiu%20jitsu%20training%20session%20in%20modern%20gym%20with%20elite%20instructor%20demonstrating%20advanced%20techniques%20clean%20background%20high%20quality%20sports%20photography&width=400&height=225&seq=clubsponsor1&orientation=landscape'
    },
    {
      id: 2,
      title: 'Advanced Wrestling Techniques - PROMOTED',
      coach: 'Sarah Thompson',
      startDate: '2024-02-10',
      endDate: '2024-03-10',
      budget: 350,
      impressions: 8900,
      clicks: 645,
      enrollments: 52,
      status: 'Active',
      thumbnail: 'https://readdy.ai/api/search-image?query=advanced%20wrestling%20training%20session%20in%20professional%20gym%20with%20instructor%20demonstrating%20techniques%20clean%20background%20sports%20photography&width=400&height=225&seq=clubsponsor2&orientation=landscape'
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">

      <div className="bg-gradient-to-r from-slate-900 to-slate-700 text-white py-10 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 lg:gap-10">
            <div className="flex items-center gap-4 sm:gap-6">
              <div className="w-20 h-20 sm:w-24 sm:h-24 bg-teal-600 rounded-full flex items-center justify-center text-3xl sm:text-4xl font-bold">
                {clubData.name.split(' ').map((n) => n[0]).join('')}
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold mb-1 sm:mb-2">{clubData.name}</h1>
                <p className="text-slate-200 mb-1 text-sm sm:text-base">
                  {clubData.location} • Est. {clubData.established}
                </p>
                <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm">
                  <span className="flex items-center gap-1 whitespace-nowrap">
                    <i className="ri-star-fill text-yellow-400"></i>
                    {clubData.rating} ({clubData.totalReviews} reviews)
                  </span>
                  <span className="whitespace-nowrap">{clubData.totalMembers} Members</span>
                  <span className="whitespace-nowrap">{clubData.coaches} Coaches</span>
                </div>
              </div>
            </div>
            <div className="text-left lg:text-right w-full lg:w-auto">
              <div className="bg-white/10 rounded-lg px-4 py-3 sm:px-6 mb-2 inline-block">
                <div className="text-xs sm:text-sm text-slate-300">Monthly Revenue</div>
                <div className="text-lg sm:text-xl font-bold text-green-400">
                  ${clubData.monthlyRevenue.toLocaleString()}
                </div>
              </div>
              <p className="text-xs sm:text-sm text-slate-300">Plan: {clubData.subscriptionPlan}</p>
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
                <i className="ri-user-line text-2xl text-teal-600"></i>
              </div>
              <span className="text-sm text-slate-600">Active Members</span>
            </div>
            <div className="text-3xl font-bold text-slate-900">{clubData.activeMembers}</div>
            <div className="text-sm text-green-600 mt-1">+12 this month</div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 flex items-center justify-center">
                <i className="ri-team-line text-2xl text-blue-600"></i>
              </div>
              <span className="text-sm text-slate-600">Coaches</span>
            </div>
            <div className="text-3xl font-bold text-slate-900">{clubData.coaches}</div>
            <div className="text-sm text-slate-600 mt-1">All active</div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 flex items-center justify-center">
                <i className="ri-money-dollar-circle-line text-2xl text-green-600"></i>
              </div>
              <span className="text-sm text-slate-600">Monthly Profit</span>
            </div>
            <div className="text-3xl font-bold text-slate-900">
              ${financialData.thisMonth.profit.toLocaleString()}
            </div>
            <div className="text-sm text-green-600 mt-1">+11.9% vs last month</div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 flex items-center justify-center">
                <i className="ri-megaphone-line text-2xl text-purple-600"></i>
              </div>
              <span className="text-sm text-slate-600">Active Promotions</span>
            </div>
            <div className="text-3xl font-bold text-slate-900">{sponsoredSessions.filter(s => s.status === 'Active').length}</div>
            <div className="text-sm text-purple-600 mt-1">Sponsored sessions</div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />

        <div className="bg-white rounded-xl shadow-lg mb-8">
          <div className="p-6">
            {/* Overview Tab */}
            {activeTab === 'overview' && <OverviewTab />}

            {/* Recorded Sessions Tab */}
            {activeTab === 'recorded-sessions' && <RecordedSessionsTab />}

            {/* Members Tab */}
            {activeTab === 'members' && <MembersTab />}

            {/* Coaches Tab */}
            {activeTab === 'coaches' && <CoachesTab />}

            {/* Classes Tab */}
            {activeTab === 'classes' && <ClassesTab />}

            {/* Promotions Tab */}
            {activeTab === 'promotions' && <PromotionsTab />}

            {/* Finances Tab */}
            {activeTab === 'finances' && <FinancesTab />}

            {/* Facilities Tab */}
            {activeTab === 'facilities' && <FacilitiesTab />}

            {/* Performance Tab */}
            {activeTab === 'performance' && <PerformanceTab />}

            {/* Profile Tab */}
            {activeTab === 'profile' && <ProfileTab />}

            {/* Settings Tab */}
            {activeTab === 'settings' && <SettingsTab />}
          </div>
        </div>
      </div>


    </div>
  );
}
