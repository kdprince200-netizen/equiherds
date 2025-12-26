'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

export default function PodcastDetail() {
  const params = useParams();
  const slug = params.slug;
  const [currentEpisode, setCurrentEpisode] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);

  const podcastData = {
    'bjj-chronicles': {
      title: 'The BJJ Chronicles',
      description: 'Explore the gentle art with world-class black belts sharing techniques, philosophy, and competition insights.',
      episodes: [
        { id: 1, title: 'Episode 1', guest: 'Guest Name', duration: '45:30', date: '2024-01-14' },
        { id: 2, title: 'Episode 2', guest: 'Guest Name', duration: '52:15', date: '2024-01-07' }
      ]
    },
    'cage-talk': {
      title: 'Cage Talk',
      description: 'Inside the octagon with UFC fighters, coaches, and analysts discussing the latest in mixed martial arts.',
      episodes: [
        { id: 1, title: 'Episode 1', guest: 'Guest Name', duration: '48:20', date: '2024-01-14' }
      ]
    }
  };

  const podcast = podcastData[slug] || podcastData['bjj-chronicles'];
  const currentEpisodeData = podcast.episodes.find(ep => ep.id === currentEpisode) || podcast.episodes[0];

  return (
    <div className="min-h-screen bg-white">
      <section className="py-20 bg-gradient-to-r from-slate-900 to-slate-700 text-white">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-6">{podcast.title}</h1>
            <p className="text-xl text-slate-200">{podcast.description}</p>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">{currentEpisodeData.title}</h2>
              <p className="text-gray-600 mb-6">Guest: {currentEpisodeData.guest}</p>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold"
                >
                  {isPlaying ? 'Pause' : 'Play'}
                </button>
                <span className="text-gray-600">{currentEpisodeData.duration}</span>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-bold text-gray-900">All Episodes</h3>
              {podcast.episodes.map((episode) => (
                <div
                  key={episode.id}
                  className={`bg-white rounded-lg shadow p-4 cursor-pointer hover:shadow-md transition-shadow ${
                    currentEpisode === episode.id ? 'ring-2 ring-blue-500' : ''
                  }`}
                  onClick={() => setCurrentEpisode(episode.id)}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-semibold text-gray-900">{episode.title}</h4>
                      <p className="text-sm text-gray-600">{episode.guest} • {episode.duration}</p>
                    </div>
                    <span className="text-sm text-gray-500">{episode.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

