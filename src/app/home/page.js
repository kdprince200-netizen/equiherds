"use client";

import { useState } from 'react';
import Hero from '../social/pages/home/components/Hero';
import StoryBoard from '../social/pages/home/components/StoryBoard';
import FeedsSection from '../social/pages/home/components/FeedsSection';
import SponsoredSection from '../social/components/feature/SponsoredSection';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
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

