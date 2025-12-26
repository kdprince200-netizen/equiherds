'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getRequest } from '../service';
import ProfileContent from './components/ProfileContent';
import MyLectures from './components/MyLectures';
import Payments from './components/Payments';
import Subscription from './components/Subscription';
import MyCourses from './components/MyCourses';
import Clients from './components/Clients';
import MyCoach from './components/MyCoach';
import SubscriptionPackages from './components/SubscriptionPackages';

export default function Profile() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('Profile');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          router.push('/login');
          return;
        }

        const response = await getRequest('/api/auth/me');
        
        if (response.success && response.data) {
          setUser(response.data);
        } else {
          setError(response.error || 'Failed to load user data');
          // If token is invalid, redirect to login
          if (response.error?.includes('token') || response.error?.includes('Unauthorized')) {
            localStorage.removeItem('token');
            router.push('/login');
          }
        }
      } catch (err) {
        console.error('Error fetching user data:', err);
        setError('An error occurred while loading your profile');
        localStorage.removeItem('token');
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [router]);


  const getTabs = (accountType) => {
    switch (accountType) {
      case 'student':
        return ['Profile','My Courses', 'My Coach', 'Payments', 'Logout'];
      case 'coach':
        return ['Profile', 'Subscription', 'My Lectures', 'Clients', 'Logout'];
      case 'club':
        return ['Profile', 'Subscription', 'My Coach', 'My Lectures', 'Clients', 'Logout'];
      case 'superAdmin':
        return ['Profile', 'Clients', 'Subscription Packages', 'Payments', 'Logout'];
      default:
        return ['Profile', 'Logout'];
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    // Dispatch custom event to notify Header component
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('userLogout'));
    }
    router.push('/login');
  };

  const handleUserUpdate = (updatedUser) => {
    setUser(updatedUser);
    setError('');
  };

  const renderTabContent = () => {
    if (!user) return null;

    switch (activeTab) {
      case 'Profile':
        return <ProfileContent user={user} onUpdate={handleUserUpdate} />;
      case 'My Lectures':
        return <MyLectures />;
      case 'Payments':
        return <Payments />;
      case 'Subscription':
        return <Subscription user={user} />;
      case 'My Courses':
        return <MyCourses />;
      case 'Clients':
        return <Clients />;
      case 'My Coach':
        return <MyCoach user={user} />;
      case 'Subscription Packages':
        return <SubscriptionPackages />;
      case 'Logout':
        return null; // Handled by handleLogout
      default:
        return <ProfileContent user={user} onUpdate={handleUserUpdate} />;
    }
  };


  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error && !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full">
          <div className="text-center">
            <div className="text-red-500 text-5xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Error</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={() => router.push('/login')}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Go to Login
            </button>
          </div>
        </div>
      </div>
    );
  }


  if (!user) return null;

  const tabs = getTabs(user.accountType);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Account</h1>
          <p className="text-gray-600">Manage your account and preferences</p>
        </div>

        {error && (
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded-lg text-sm mb-6">
            {error}
          </div>
        )}

        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar Tabs */}
          <div className="w-full md:w-64 flex-shrink-0">
            <div className="bg-white rounded-xl shadow-lg p-4">
              <nav className="space-y-2">
                {tabs.map((tab) => (
                  <button
                    key={tab}
                    onClick={() => {
                      if (tab === 'Logout') {
                        handleLogout();
                      } else {
                        setActiveTab(tab);
                      }
                    }}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                      activeTab === tab
                        ? 'bg-blue-600 text-white'
                        : tab === 'Logout'
                        ? 'text-red-600 hover:bg-red-50'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center">
                      {tab === 'Profile' && <i className="ri-user-line mr-3 text-lg"></i>}
                      {tab === 'My Lectures' && <i className="ri-video-line mr-3 text-lg"></i>}
                      {tab === 'Payments' && <i className="ri-money-dollar-circle-line mr-3 text-lg"></i>}
                      {tab === 'Subscription' && <i className="ri-wallet-line mr-3 text-lg"></i>}
                      {tab === 'My Courses' && <i className="ri-book-open-line mr-3 text-lg"></i>}
                      {tab === 'Clients' && <i className="ri-user-3-line mr-3 text-lg"></i>}
                      {tab === 'My Coach' && <i className="ri-user-star-line mr-3 text-lg"></i>}
                      {tab === 'Subscription Packages' && <i className="ri-price-tag-3-line mr-3 text-lg"></i>}
                      {tab === 'Logout' && <i className="ri-logout-box-line mr-3 text-lg"></i>}
                      <span className="font-medium">{tab}</span>
                    </div>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1">
            <div className="bg-white rounded-xl shadow-lg p-8">
              {renderTabContent()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

