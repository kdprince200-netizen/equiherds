"use client";

import { useState } from 'react';

export default function StoryBoard() {
  const [stories, setStories] = useState([
    {
      id: 1,
      username: 'Emma_Rider',
      avatar: 'https://equiherds.com/wp-content/uploads/2024/12/pexels-photo-1996333-1996333.jpg',
      image: 'https://equiherds.com/wp-content/uploads/2024/12/pexels-photo-1996333-1996333.jpg',
      type: 'image',
      isViewed: false
    },
    {
      id: 2,
      username: 'JohnTheTrainer',
      avatar: 'https://equiherds.com/wp-content/uploads/2024/12/pexels-photo-1996333-1996333.jpg',
      video: 'https://videos.pexels.com/video-files/5359200/5359200-uhd_2560_1440_25fps.mp4',
      type: 'video',
      isViewed: false
    },
    {
      id: 3,
      username: 'WildHorsePhotography',
      avatar: 'https://equiherds.com/wp-content/uploads/2024/12/pexels-photo-1996333-1996333.jpg',
      image: 'https://equiherds.com/wp-content/uploads/2024/12/pexels-photo-1996333-1996333.jpg',
      type: 'image',
      isViewed: false
    },
    {
      id: 4,
      username: 'StableDiaries',
      avatar: 'https://equiherds.com/wp-content/uploads/2024/12/pexels-photo-1996333-1996333.jpg',
      video: 'https://videos.pexels.com/video-files/6896336/6896336-uhd_2560_1440_25fps.mp4',
      type: 'video',
      isViewed: false
    },
    {
      id: 5,
      username: 'EquineAdventures',
      avatar: 'https://equiherds.com/wp-content/uploads/2024/12/pexels-photo-1996333-1996333.jpg',
      image: 'https://equiherds.com/wp-content/uploads/2024/12/pexels-photo-1996333-1996333.jpg',
      type: 'image',
      isViewed: false
    },
    {
      id: 6,
      username: 'HorseWhisperer',
      avatar: 'https://equiherds.com/wp-content/uploads/2024/12/pexels-photo-1996333-1996333.jpg',
      video: 'https://videos.pexels.com/video-files/3571264/3571264-uhd_2560_1440_30fps.mp4',
      type: 'video',
      isViewed: false
    }
  ]);

  const [currentStoryIndex, setCurrentStoryIndex] = useState(null);
  const [showAllStories, setShowAllStories] = useState(false);

  const openStory = (index) => {
    setCurrentStoryIndex(index);
    markAsViewed(index);
  };

  const closeStory = () => {
    setCurrentStoryIndex(null);
  };

  const nextStory = () => {
    if (currentStoryIndex !== null && currentStoryIndex < stories.length - 1) {
      const newIndex = currentStoryIndex + 1;
      setCurrentStoryIndex(newIndex);
      markAsViewed(newIndex);
    }
  };

  const prevStory = () => {
    if (currentStoryIndex !== null && currentStoryIndex > 0) {
      const newIndex = currentStoryIndex - 1;
      setCurrentStoryIndex(newIndex);
      markAsViewed(newIndex);
    }
  };

  const markAsViewed = (index) => {
    setStories(prev => prev.map((story, i) => 
      i === index ? { ...story, isViewed: true } : story
    ));
  };

  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Stories</h2>
          <button 
            onClick={() => setShowAllStories(true)}
            className="text-teal-600 hover:text-teal-700 font-medium text-sm whitespace-nowrap flex items-center gap-2 cursor-pointer"
          >
            View All <i className="ri-arrow-right-line"></i>
          </button>
        </div>

        <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
          {stories.slice(0, 8).map((story, index) => (
            <button
              key={story.id}
              onClick={() => openStory(index)}
              className="flex-shrink-0 flex flex-col items-center gap-2 group cursor-pointer"
            >
              <div className={`w-20 h-20 rounded-full p-0.5 ${
                story.isViewed 
                  ? 'bg-gray-300' 
                  : 'bg-gradient-to-tr from-teal-400 via-teal-500 to-teal-600'
              }`}>
                <div className="w-full h-full rounded-full p-1 bg-white">
                  <div className="w-full h-full rounded-full overflow-hidden relative">
                    <img 
                      src={story.avatar} 
                      alt={story.username}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    {story.type === 'video' && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                        <i className="ri-play-fill text-white text-lg"></i>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <span className="text-xs text-gray-700 font-medium max-w-[80px] truncate">
                {story.username}
              </span>
            </button>
          ))}
        </div>
      </div>

      {currentStoryIndex !== null && (
        <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
          <button 
            onClick={closeStory}
            className="absolute top-4 right-4 text-white hover:text-gray-300 z-10 w-10 h-10 flex items-center justify-center cursor-pointer"
          >
            <i className="ri-close-line text-3xl"></i>
          </button>

          <div className="absolute top-4 left-1/2 -translate-x-1/2 flex gap-1 w-full max-w-md px-4 z-10">
            {stories.map((_, index) => (
              <div 
                key={index}
                className={`h-1 flex-1 rounded-full ${
                  index <= currentStoryIndex ? 'bg-white' : 'bg-white/30'
                }`}
              />
            ))}
          </div>

          {currentStoryIndex > 0 && (
            <button 
              onClick={prevStory}
              className="absolute left-4 text-white hover:text-gray-300 w-12 h-12 flex items-center justify-center cursor-pointer"
            >
              <i className="ri-arrow-left-s-line text-4xl"></i>
            </button>
          )}

          {currentStoryIndex < stories.length - 1 && (
            <button 
              onClick={nextStory}
              className="absolute right-4 text-white hover:text-gray-300 w-12 h-12 flex items-center justify-center cursor-pointer"
            >
              <i className="ri-arrow-right-s-line text-4xl"></i>
            </button>
          )}

          <div className="w-full h-full max-w-md max-h-screen flex items-center justify-center">
            {stories[currentStoryIndex].type === 'image' ? (
              <img 
                src={stories[currentStoryIndex].image} 
                alt={stories[currentStoryIndex].username}
                className="w-full h-full object-contain"
              />
            ) : (
              <video 
                src={stories[currentStoryIndex].video} 
                className="w-full h-full object-contain"
                controls
                autoPlay
                loop
                playsInline
              />
            )}
          </div>

          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-3 bg-black/50 px-4 py-3 rounded-full">
            <div className="w-10 h-10 rounded-full overflow-hidden">
              <img 
                src={stories[currentStoryIndex].avatar} 
                alt={stories[currentStoryIndex].username}
                className="w-full h-full object-cover"
              />
            </div>
            <span className="text-white font-medium">
              {stories[currentStoryIndex].username}
            </span>
            <div className="flex items-center gap-1 ml-2">
              <i className={`${stories[currentStoryIndex].type === 'video' ? 'ri-video-line' : 'ri-image-line'} text-white/80`}></i>
            </div>
          </div>
        </div>
      )}

      {showAllStories && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-4xl w-full p-8 relative my-8">
            <button 
              onClick={() => setShowAllStories(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 w-8 h-8 flex items-center justify-center cursor-pointer"
            >
              <i className="ri-close-line text-2xl"></i>
            </button>

            <h3 className="text-2xl font-bold text-gray-900 mb-6">All Stories</h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
              {stories.map((story, index) => (
                <button
                  key={story.id}
                  onClick={() => {
                    setShowAllStories(false);
                    openStory(index);
                  }}
                  className="flex flex-col items-center gap-3 group cursor-pointer"
                >
                  <div className={`w-24 h-24 rounded-full p-0.5 ${
                    story.isViewed 
                      ? 'bg-gray-300' 
                      : 'bg-gradient-to-tr from-teal-400 via-teal-500 to-teal-600'
                  }`}>
                    <div className="w-full h-full rounded-full p-1 bg-white">
                      <div className="w-full h-full rounded-full overflow-hidden relative">
                        <img 
                          src={story.avatar} 
                          alt={story.username}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                        {story.type === 'video' && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                            <i className="ri-play-fill text-white text-xl"></i>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <span className="text-sm text-gray-700 font-medium text-center">
                    {story.username}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}





