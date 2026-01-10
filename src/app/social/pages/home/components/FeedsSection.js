"use client";

import { useState } from 'react';

export default function FeedsSection() {
  const [feeds, setFeeds] = useState([
    {
      id: 1,
      username: 'Emma_Rider',
      avatar: 'https://equiherds.com/wp-content/uploads/2024/12/pexels-photo-1996333-1996333.jpg',
      timeAgo: '2 hours ago',
      content: 'Beautiful morning ride through the countryside with my beloved Thunder. The connection we share is truly magical. Every ride reminds me why I fell in love with horses in the first place. 🐴❤️',
      image: 'https://equiherds.com/wp-content/uploads/2024/12/pexels-photo-1996333-1996333.jpg',
      likes: 342,
      comments: 28,
      shares: 15,
      isLiked: false,
      isSaved: false
    },
    {
      id: 2,
      username: 'JohnTheTrainer',
      avatar: 'https://equiherds.com/wp-content/uploads/2024/12/pexels-photo-1996333-1996333.jpg',
      timeAgo: '5 hours ago',
      content: 'Training session with our newest rescue horse, Luna. She\'s making incredible progress and gaining confidence every day. Patience and love can work wonders! 🌟',
      image: 'https://equiherds.com/wp-content/uploads/2024/12/pexels-photo-1996333-1996333.jpg',
      likes: 521,
      comments: 45,
      shares: 32,
      isLiked: false,
      isSaved: false
    },
    {
      id: 3,
      username: 'WildHorsePhotography',
      avatar: 'https://equiherds.com/wp-content/uploads/2024/12/pexels-photo-1996333-1996333.jpg',
      timeAgo: '8 hours ago',
      content: 'Captured this stunning moment during golden hour. The way the light hits their manes is absolutely breathtaking. Nature\'s beauty at its finest! 📸✨',
      image: 'https://equiherds.com/wp-content/uploads/2024/12/pexels-photo-1996333-1996333.jpg',
      likes: 892,
      comments: 67,
      shares: 54,
      isLiked: false,
      isSaved: false
    },
    {
      id: 4,
      username: 'StableDiaries',
      avatar: 'https://equiherds.com/wp-content/uploads/2024/12/pexels-photo-1996333-1996333.jpg',
      timeAgo: '12 hours ago',
      content: 'Morning grooming routine with my best friend. These quiet moments together are what I cherish most. The bond between horse and rider is truly special. 💕',
      image: 'https://equiherds.com/wp-content/uploads/2024/12/pexels-photo-1996333-1996333.jpg',
      likes: 445,
      comments: 34,
      shares: 21,
      isLiked: false,
      isSaved: false
    }
  ]);

  const [showSubscribeModal, setShowSubscribeModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(null);

  const handleLike = (feedId) => {
    setFeeds(prev => prev.map(feed => 
      feed.id === feedId 
        ? { 
            ...feed, 
            isLiked: !feed.isLiked,
            likes: feed.isLiked ? feed.likes - 1 : feed.likes + 1
          } 
        : feed
    ));
  };

  const handleSave = (feedId) => {
    setFeeds(prev => prev.map(feed => 
      feed.id === feedId 
        ? { ...feed, isSaved: !feed.isSaved } 
        : feed
    ));
  };

  const handleShare = (feedId) => {
    setShowShareModal(feedId);
  };

  return (
    <section className="bg-white">
      <div className="mb-12">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Community Feed</h2>
          <button 
            onClick={() => setShowSubscribeModal(true)}
            className="bg-teal-600 text-white px-6 py-2.5 rounded-full hover:bg-teal-700 transition-colors text-sm font-medium whitespace-nowrap flex items-center gap-2"
          >
            <i className="ri-notification-line"></i>
            Subscribe
          </button>
        </div>
      </div>

      <div className="space-y-8">
        {feeds.map(feed => (
          <article key={feed.id} className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow overflow-hidden border border-gray-100">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full overflow-hidden">
                    <img 
                      src={feed.avatar} 
                      alt={feed.username}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-base">{feed.username}</h3>
                    <p className="text-sm text-gray-500">{feed.timeAgo}</p>
                  </div>
                </div>
                <button className="text-gray-400 hover:text-gray-600 w-8 h-8 flex items-center justify-center">
                  <i className="ri-more-line text-xl"></i>
                </button>
              </div>

              <p className="text-gray-700 mb-4 leading-relaxed text-base">
                {feed.content}
              </p>
            </div>

            <div className="w-full h-96 overflow-hidden">
              <img 
                src={feed.image} 
                alt="Feed content"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>

            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-6">
                  <button 
                    onClick={() => handleLike(feed.id)}
                    className={`flex items-center gap-2 transition-colors ${
                      feed.isLiked ? 'text-red-500' : 'text-gray-600 hover:text-red-500'
                    }`}
                  >
                    <i className={`${feed.isLiked ? 'ri-heart-fill' : 'ri-heart-line'} text-2xl`}></i>
                    <span className="font-medium text-sm">{feed.likes}</span>
                  </button>
                  <button className="flex items-center gap-2 text-gray-600 hover:text-teal-600 transition-colors">
                    <i className="ri-chat-3-line text-2xl"></i>
                    <span className="font-medium text-sm">{feed.comments}</span>
                  </button>
                  <button 
                    onClick={() => handleShare(feed.id)}
                    className="flex items-center gap-2 text-gray-600 hover:text-teal-600 transition-colors"
                  >
                    <i className="ri-share-forward-line text-2xl"></i>
                    <span className="font-medium text-sm">{feed.shares}</span>
                  </button>
                </div>
                <button 
                  onClick={() => handleSave(feed.id)}
                  className={`transition-colors ${
                    feed.isSaved ? 'text-teal-600' : 'text-gray-600 hover:text-teal-600'
                  }`}
                >
                  <i className={`${feed.isSaved ? 'ri-bookmark-fill' : 'ri-bookmark-line'} text-2xl`}></i>
                </button>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full overflow-hidden">
                  <img 
                    src="https://equiherds.com/wp-content/uploads/2024/12/pexels-photo-1996333-1996333.jpg" 
                    alt="Your avatar"
                    className="w-full h-full object-cover"
                  />
                </div>
                <input 
                  type="text"
                  placeholder="Add a comment..."
                  className="flex-1 bg-gray-50 rounded-full px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>
          </article>
        ))}
      </div>

      <div className="mt-12 text-center">
        <button className="bg-gray-100 text-gray-700 px-8 py-3 rounded-full hover:bg-gray-200 transition-colors font-medium whitespace-nowrap">
          Load More Posts
        </button>
      </div>

      {showSubscribeModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-8 relative">
            <button 
              onClick={() => setShowSubscribeModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 w-8 h-8 flex items-center justify-center"
            >
              <i className="ri-close-line text-2xl"></i>
            </button>

            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="ri-notification-line text-3xl text-teal-600"></i>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Subscribe to Updates</h3>
              <p className="text-gray-600 text-sm">Get notified about new stories and community posts</p>
            </div>

            <form className="space-y-4">
              <input 
                type="email"
                placeholder="Enter your email"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
              />
              <button 
                type="submit"
                className="w-full bg-teal-600 text-white py-3 rounded-lg hover:bg-teal-700 transition-colors font-medium whitespace-nowrap"
              >
                Subscribe Now
              </button>
            </form>
          </div>
        </div>
      )}

      {showShareModal !== null && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-8 relative">
            <button 
              onClick={() => setShowShareModal(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 w-8 h-8 flex items-center justify-center"
            >
              <i className="ri-close-line text-2xl"></i>
            </button>

            <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Share Post</h3>

            <div className="grid grid-cols-4 gap-4">
              <button className="flex flex-col items-center gap-2 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <i className="ri-facebook-fill text-2xl text-blue-600"></i>
                </div>
                <span className="text-xs text-gray-600">Facebook</span>
              </button>
              <button className="flex flex-col items-center gap-2 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                <div className="w-12 h-12 bg-sky-100 rounded-full flex items-center justify-center">
                  <i className="ri-twitter-fill text-2xl text-sky-500"></i>
                </div>
                <span className="text-xs text-gray-600">Twitter</span>
              </button>
              <button className="flex flex-col items-center gap-2 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center">
                  <i className="ri-instagram-line text-2xl text-pink-600"></i>
                </div>
                <span className="text-xs text-gray-600">Instagram</span>
              </button>
              <button className="flex flex-col items-center gap-2 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <i className="ri-whatsapp-line text-2xl text-green-600"></i>
                </div>
                <span className="text-xs text-gray-600">WhatsApp</span>
              </button>
            </div>

            <div className="mt-6 flex items-center gap-2">
              <input 
                type="text"
                value={`https://equiherds.com/post/${showShareModal}`}
                readOnly
                className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-sm"
              />
              <button className="bg-teal-600 text-white px-4 py-2.5 rounded-lg hover:bg-teal-700 transition-colors whitespace-nowrap">
                Copy
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}





