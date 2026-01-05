"use client";

import { useState } from 'react';
import HomePage from './pages/home/page';
import CommunityPage from './pages/community/page';
import StoriesPage from './pages/stories/page';

export default function SocialPage() {
  const [activeTab, setActiveTab] = useState('home');

  return (
    <div className="min-h-screen bg-white">
      {/* Page Content */}
      {activeTab === 'home' && <HomePage activeTab={activeTab} setActiveTab={setActiveTab} />}
      {activeTab === 'community' && <CommunityPage activeTab={activeTab} setActiveTab={setActiveTab} />}
      {activeTab === 'stories' && <StoriesPage activeTab={activeTab} setActiveTab={setActiveTab} />}
    </div>
  );
}



