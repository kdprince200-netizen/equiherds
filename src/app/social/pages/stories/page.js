"use client";

import { useState, useEffect, useRef } from 'react';
// import Navbar from '../home/components/Navbar';
// import Footer from '../home/components/Footer';
import TabsNavigation from '../../components/TabsNavigation';

const Stories = ({ activeTab, setActiveTab }) => {
  const [stories] = useState([
    {
      id: 1,
      username: 'Emma_Rider',
      avatar: 'https://readdy.ai/api/search-image?query=professional%20female%20equestrian%20rider%20portrait%20with%20warm%20smile%20wearing%20riding%20helmet%20outdoor%20natural%20lighting%20against%20simple%20blurred%20stable%20background&width=120&height=120&seq=story1&orientation=squarish',
      media: 'https://readdy.ai/api/search-image?query=beautiful%20brown%20horse%20performing%20elegant%20dressage%20movement%20in%20professional%20arena%20with%20rider%20in%20formal%20attire%20sunny%20day%20clear%20sky%20simple%20background&width=1080&height=1920&seq=story1media&orientation=portrait',
      type: 'image',
      timestamp: '2 hours ago',
      views: 1234
    },
    {
      id: 2,
      username: 'JohnTheTrainer',
      avatar: 'https://readdy.ai/api/search-image?query=professional%20male%20horse%20trainer%20portrait%20confident%20expression%20wearing%20riding%20gear%20outdoor%20stable%20background&width=120&height=120&seq=story2&orientation=squarish',
      media: 'https://videos.pexels.com/video-files/5359200/5359200-uhd_1440_2560_25fps.mp4',
      type: 'video',
      timestamp: '5 hours ago',
      views: 2456
    },
    {
      id: 3,
      username: 'WildHorsePhotography',
      avatar: 'https://readdy.ai/api/search-image?query=professional%20photographer%20portrait%20with%20camera%20wearing%20casual%20outdoor%20clothing%20natural%20lighting%20simple%20background&width=120&height=120&seq=story3&orientation=squarish',
      media: 'https://readdy.ai/api/search-image?query=stunning%20white%20horse%20running%20freely%20in%20golden%20hour%20sunlight%20beautiful%20countryside%20meadow%20with%20dramatic%20sky%20artistic%20photography%20simple%20background&width=1080&height=1920&seq=story3media&orientation=portrait',
      type: 'image',
      timestamp: '8 hours ago',
      views: 3789
    },
    {
      id: 4,
      username: 'StableDiaries',
      avatar: 'https://readdy.ai/api/search-image?query=friendly%20female%20stable%20owner%20portrait%20warm%20smile%20wearing%20casual%20equestrian%20clothing%20outdoor%20natural%20light%20simple%20background&width=120&height=120&seq=story4&orientation=squarish',
      media: 'https://videos.pexels.com/video-files/6896336/6896336-uhd_1440_2560_25fps.mp4',
      type: 'video',
      timestamp: '12 hours ago',
      views: 4521
    },
    {
      id: 5,
      username: 'EquineAdventures',
      avatar: 'https://readdy.ai/api/search-image?query=adventurous%20equestrian%20portrait%20confident%20look%20wearing%20outdoor%20riding%20gear%20natural%20lighting%20simple%20background&width=120&height=120&seq=story5&orientation=squarish',
      media: 'https://readdy.ai/api/search-image?query=majestic%20black%20horse%20jumping%20over%20colorful%20obstacle%20in%20competition%20arena%20exciting%20action%20moment%20professional%20photography%20simple%20background&width=1080&height=1920&seq=story5media&orientation=portrait',
      type: 'image',
      timestamp: '1 day ago',
      views: 5678
    },
    {
      id: 6,
      username: 'HorseWhisperer',
      avatar: 'https://readdy.ai/api/search-image?query=experienced%20horse%20trainer%20portrait%20gentle%20expression%20wearing%20professional%20riding%20attire%20outdoor%20natural%20light%20simple%20background&width=120&height=120&seq=story6&orientation=squarish',
      media: 'https://videos.pexels.com/video-files/3571264/3571264-uhd_1440_2560_30fps.mp4',
      type: 'video',
      timestamp: '1 day ago',
      views: 6234
    },
    {
      id: 7,
      username: 'MountainRiders',
      avatar: 'https://readdy.ai/api/search-image?query=outdoor%20adventure%20rider%20portrait%20wearing%20trail%20riding%20gear%20mountain%20background%20natural%20lighting&width=120&height=120&seq=story7&orientation=squarish',
      media: 'https://readdy.ai/api/search-image?query=group%20of%20horses%20and%20riders%20on%20scenic%20mountain%20trail%20with%20breathtaking%20valley%20views%20clear%20blue%20sky%20adventure%20photography%20simple%20background&width=1080&height=1920&seq=story7media&orientation=portrait',
      type: 'image',
      timestamp: '2 days ago',
      views: 7891
    },
    {
      id: 8,
      username: 'CompetitionLife',
      avatar: 'https://readdy.ai/api/search-image?query=professional%20show%20jumper%20portrait%20wearing%20competition%20attire%20confident%20expression%20simple%20background&width=120&height=120&seq=story8&orientation=squarish',
      media: 'https://readdy.ai/api/search-image?query=elegant%20horse%20and%20rider%20performing%20dressage%20routine%20in%20competition%20arena%20formal%20attire%20professional%20photography%20simple%20background&width=1080&height=1920&seq=story8media&orientation=portrait',
      type: 'image',
      timestamp: '2 days ago',
      views: 8456
    }
  ]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState({});
  const containerRef = useRef(null);
  const storyRefs = useRef({});
  const videoRefs = useRef({});
  const touchStartY = useRef(0);
  const touchEndY = useRef(0);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [selectedStoryForMore, setSelectedStoryForMore] = useState(null);
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowDown' && currentIndex < stories.length - 1) {
        scrollToStory(currentIndex + 1);
      } else if (e.key === 'ArrowUp' && currentIndex > 0) {
        scrollToStory(currentIndex - 1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, stories.length]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const index = parseInt(entry.target.getAttribute('data-index') || '0');
          if (entry.isIntersecting) {
            setCurrentIndex(index);
            if (stories[index].type === 'video' && videoRefs.current[index]) {
              const video = videoRefs.current[index];
              if (video) {
                video.play().catch(() => {
                  setIsPlaying(prev => ({ ...prev, [index]: false }));
                });
                setIsPlaying(prev => ({ ...prev, [index]: true }));
              }
            }
          } else {
            if (stories[index].type === 'video' && videoRefs.current[index]) {
              videoRefs.current[index]?.pause();
              setIsPlaying(prev => ({ ...prev, [index]: false }));
            }
          }
        });
      },
      { threshold: 0.7 }
    );

    const storyElements = document.querySelectorAll('.story-item');
    storyElements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [stories]);

  const scrollToStory = (index) => {
    const element = document.querySelector(`[data-index="${index}"]`);
    element?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleTouchStart = (e) => {
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchMove = (e) => {
    touchEndY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = () => {
    const diff = touchStartY.current - touchEndY.current;
    if (Math.abs(diff) > 50) {
      if (diff > 0 && currentIndex < stories.length - 1) {
        scrollToStory(currentIndex + 1);
      } else if (diff < 0 && currentIndex > 0) {
        scrollToStory(currentIndex - 1);
      }
    }
  };

  const togglePlayPause = (index) => {
    const video = videoRefs.current[index];
    if (video) {
      if (isPlaying[index]) {
        video.pause();
        setIsPlaying(prev => ({ ...prev, [index]: false }));
      } else {
        video.play().catch(() => {
          console.log('Video play failed');
        });
        setIsPlaying(prev => ({ ...prev, [index]: true }));
      }
    }
  };

  const handleMoreClick = (storyId, e) => {
    e.stopPropagation();
    setSelectedStoryForMore(storyId);
    setShowMoreMenu(true);
  };

  const handleReportStory = () => {
    alert('Story reported. Thank you for helping keep our community safe.');
    setShowMoreMenu(false);
  };

  const handleBlockUser = () => {
    if (confirm('Are you sure you want to block this user?')) {
      alert('User has been blocked.');
      setShowMoreMenu(false);
    }
  };

  const handleCopyLink = () => {
    const link = `${window.location.origin}/stories/${selectedStoryForMore}`;
    navigator.clipboard.writeText(link);
    alert('Link copied to clipboard!');
    setShowMoreMenu(false);
  };

  const handleNotInterested = () => {
    alert('We\'ll show you less content like this.');
    setShowMoreMenu(false);
  };

  return (
    <div className="min-h-screen bg-black">
      <TabsNavigation activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="fixed inset-0 overflow-y-scroll snap-y snap-mandatory scrollbar-hide" ref={containerRef}>
        {stories.map((story, index) => (
          <div
            key={story.id}
            ref={(el) => (storyRefs.current[index] = el)}
            className="story-item relative w-full h-screen snap-start snap-always flex items-center justify-center"
            data-index={index}
          >
            {story.type === 'image' ? (
              <img
                src={story.media}
                alt={story.username}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="relative w-full h-full">
                <video
                  ref={(el) => (videoRefs.current[index] = el)}
                  src={story.media}
                  className="w-full h-full object-cover"
                  loop
                  playsInline
                  muted
                  onClick={() => togglePlayPause(index)}
                />
                {!isPlaying[index] && (
                  <button
                    onClick={() => togglePlayPause(index)}
                    className="absolute inset-0 flex items-center justify-center bg-black/20 cursor-pointer"
                  >
                    <div className="w-20 h-20 bg-white/90 rounded-full flex items-center justify-center">
                      <i className="ri-play-fill text-4xl text-gray-900 ml-1"></i>
                    </div>
                  </button>
                )}
              </div>
            )}

            <div className="absolute top-24 left-0 right-0 px-6 z-10">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white flex items-center justify-center">
                  <img
                    src={story.avatar}
                    alt={story.username}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="text-white font-semibold text-base drop-shadow-lg">
                    {story.username}
                  </h3>
                  <p className="text-white/90 text-sm drop-shadow-lg">{story.timestamp}</p>
                </div>
                <button
                  onClick={(e) => handleMoreClick(story.id, e)}
                  className="text-white hover:text-white/80 transition-colors w-8 h-8 flex items-center justify-center cursor-pointer"
                >
                  <i className="ri-more-fill text-2xl drop-shadow-lg"></i>
                </button>
              </div>
            </div>

            <div className="absolute bottom-8 left-0 right-0 px-6 z-10">
              <div className="flex items-center gap-2 text-white/90 text-sm mb-4">
                <i className="ri-eye-line"></i>
                <span className="drop-shadow-lg">{story.views.toLocaleString()} views</span>
              </div>
            </div>

            <div className="absolute right-6 bottom-32 flex flex-col gap-6 z-10">
              <button className="flex flex-col items-center gap-1 text-white hover:text-white/80 transition-colors cursor-pointer">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                  <i className="ri-heart-line text-2xl drop-shadow-lg"></i>
                </div>
                <span className="text-xs drop-shadow-lg">Like</span>
              </button>
              <button className="flex flex-col items-center gap-1 text-white hover:text-white/80 transition-colors cursor-pointer">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                  <i className="ri-chat-3-line text-2xl drop-shadow-lg"></i>
                </div>
                <span className="text-xs drop-shadow-lg">Comment</span>
              </button>
              <button className="flex flex-col items-center gap-1 text-white hover:text-white/80 transition-colors cursor-pointer">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                  <i className="ri-share-forward-line text-2xl drop-shadow-lg"></i>
                </div>
                <span className="text-xs drop-shadow-lg">Share</span>
              </button>
              <button className="flex flex-col items-center gap-1 text-white hover:text-white/80 transition-colors cursor-pointer">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                  <i className="ri-bookmark-line text-2xl drop-shadow-lg"></i>
                </div>
                <span className="text-xs drop-shadow-lg">Save</span>
              </button>
            </div>

            {index < stories.length - 1 && (
              <button
                onClick={() => scrollToStory(index + 1)}
                className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/80 hover:text-white transition-colors animate-bounce cursor-pointer"
              >
                <i className="ri-arrow-down-line text-3xl drop-shadow-lg"></i>
              </button>
            )}
          </div>
        ))}
      </div>

      {/* More Menu Modal */}
      {showMoreMenu && (
        <div 
          className="fixed inset-0 bg-black/70 z-50 flex items-end justify-center p-4"
          onClick={() => setShowMoreMenu(false)}
        >
          <div 
            className="bg-white rounded-t-3xl w-full max-w-md pb-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mt-3 mb-6"></div>
            
            <div className="space-y-1">
              <button
                onClick={handleReportStory}
                className="w-full px-6 py-4 text-left hover:bg-gray-50 transition-colors flex items-center gap-4"
              >
                <i className="ri-flag-line text-xl text-red-500"></i>
                <div>
                  <div className="font-medium text-gray-900">Report Story</div>
                  <div className="text-sm text-gray-500">Report inappropriate content</div>
                </div>
              </button>

              <button
                onClick={handleBlockUser}
                className="w-full px-6 py-4 text-left hover:bg-gray-50 transition-colors flex items-center gap-4"
              >
                <i className="ri-user-forbid-line text-xl text-red-500"></i>
                <div>
                  <div className="font-medium text-gray-900">Block User</div>
                  <div className="text-sm text-gray-500">Stop seeing posts from this user</div>
                </div>
              </button>

              <button
                onClick={handleCopyLink}
                className="w-full px-6 py-4 text-left hover:bg-gray-50 transition-colors flex items-center gap-4"
              >
                <i className="ri-link text-xl text-gray-700"></i>
                <div>
                  <div className="font-medium text-gray-900">Copy Link</div>
                  <div className="text-sm text-gray-500">Share this story via link</div>
                </div>
              </button>

              <button
                onClick={handleNotInterested}
                className="w-full px-6 py-4 text-left hover:bg-gray-50 transition-colors flex items-center gap-4"
              >
                <i className="ri-eye-off-line text-xl text-gray-700"></i>
                <div>
                  <div className="font-medium text-gray-900">Not Interested</div>
                  <div className="text-sm text-gray-500">See less content like this</div>
                </div>
              </button>

              <button
                onClick={() => setShowMoreMenu(false)}
                className="w-full px-6 py-4 text-left hover:bg-gray-50 transition-colors flex items-center gap-4 border-t border-gray-100 mt-2"
              >
                <i className="ri-close-line text-xl text-gray-700"></i>
                <div className="font-medium text-gray-900">Cancel</div>
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="fixed right-8 top-1/2 -translate-y-1/2 z-40 flex flex-col gap-2">
        {stories.map((_, index) => (
          <button
            key={index}
            onClick={() => scrollToStory(index)}
            className={`w-2 h-2 rounded-full transition-all cursor-pointer ${
              currentIndex === index
                ? 'bg-white h-8'
                : 'bg-white/50 hover:bg-white/70'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default Stories;

