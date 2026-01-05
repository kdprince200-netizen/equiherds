"use client";

import { useState } from 'react';
// import Navbar from './components/Navbar';
import Hero from './components/Hero';
import StoryBoard from './components/StoryBoard';
import FeedsSection from './components/FeedsSection';
// import Footer from './components/Footer';
import SponsoredSection from '../../components/feature/SponsoredSection';
import TabsNavigation from '../../components/TabsNavigation';

export default function HomePage({ activeTab, setActiveTab }) {
  return (
    <div className="min-h-screen bg-white">
      <TabsNavigation activeTab={activeTab} setActiveTab={setActiveTab} />
      <Hero />
      <StoryBoard />
      
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <FeedsSection />
            </div>
            <div className="lg:col-span-1">
              <div className="sticky top-24">
                <SponsoredSection />
              </div>
            </div>
          </div>
        </div>
      </div>
      
    </div>
  );
}

