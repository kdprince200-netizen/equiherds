"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import SponsoredSection from '../social/components/feature/SponsoredSection';
import AddPostModal from '../social/components/AddPostModal';
import { getUserData } from '@/app/utils/localStorage';

export default function Community() {
  const router = useRouter();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddPostModal, setShowAddPostModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState([]);
  const [currentUserId, setCurrentUserId] = useState(null);

  // Get current user ID
  useEffect(() => {
    const userData = getUserData();
    setCurrentUserId(userData?.id || userData?._id || null);
  }, []);

  // Fetch posts from API
  useEffect(() => {
    fetchPosts();
  }, [currentUserId]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/posts');
      
      if (!response.ok) {
        // Try to get error message from response
        let errorMessage = 'Failed to fetch posts';
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch (e) {
          // If response is not JSON, use status text
          errorMessage = response.statusText || errorMessage;
        }
        console.error('API Error:', response.status, errorMessage);
        // Set empty posts array instead of throwing
        setPosts([]);
        return;
      }
      
      const data = await response.json();
      
      // Ensure data is an array
      if (!Array.isArray(data)) {
        console.error('Invalid response format:', data);
        setPosts([]);
        return;
      }
      
      // Format posts for display
      let formattedPosts = data.map(post => ({
        ...post,
        content: post.description || post.content || '',
        timestamp: formatTimestamp(post.dateTime || post.createdAt || new Date().toISOString()),
        username: post.user?.name || `User ${post.userId ? post.userId.slice(-6) : 'Unknown'}`,
        avatar: post.user?.avatar || 'https://readdy.ai/api/search-image?query=default%20user%20avatar%20portrait%20friendly%20smile%20simple%20background&width=120&height=120&seq=default&orientation=squarish',
        shares: post.shares || 0,
        isSaved: post.isSaved || false,
        isLiked: post.isLiked || false,
      }));

      // Check like status for each post if user is logged in
      if (currentUserId) {
        const likeStatusPromises = formattedPosts.map(async (post) => {
          try {
            const likeResponse = await fetch(`/api/posts/${post.id}/like?userId=${currentUserId}`);
            if (likeResponse.ok) {
              const likeData = await likeResponse.json();
              return {
                ...post,
                isLiked: likeData.isLiked || false
              };
            }
          } catch (error) {
            console.error('Error checking like status:', error);
          }
          return post;
        });
        
        // Wait for all like status checks to complete
        formattedPosts = await Promise.all(likeStatusPromises);
      }

      setPosts(formattedPosts);
    } catch (error) {
      console.error('Error fetching posts:', error);
      // Set empty array on error so UI can show appropriate message
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  const formatTimestamp = (dateTime) => {
    const date = new Date(dateTime);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;
    return date.toLocaleDateString();
  };

  const handleCreatePost = async (formData) => {
    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create post');
      }

      // Refresh posts
      await fetchPosts();
    } catch (error) {
      console.error('Error creating post:', error);
      throw error;
    }
  };

  const toggleLike = async (postId) => {
    if (!currentUserId) {
      alert('Please log in to like posts');
      return;
    }

    try {
      const response = await fetch(`/api/posts/${postId}/like`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: currentUserId }),
      });

      if (!response.ok) throw new Error('Failed to toggle like');

      const data = await response.json();
      
    setPosts(posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
            isLiked: data.isLiked,
            likes: data.likes,
        };
      }
      return post;
    }));
    } catch (error) {
      console.error('Error toggling like:', error);
      alert('Failed to like post. Please try again.');
    }
  };

  const toggleSave = (postId) => {
    // Not implemented yet
    setPosts(posts.map(post => {
      if (post.id === postId) {
        return { ...post, isSaved: !post.isSaved };
      }
      return post;
    }));
  };

  const openShareModal = (post) => {
    setSelectedPost(post);
    setShowShareModal(true);
  };

  const openCommentModal = async (post) => {
    setSelectedPost(post);
    setShowCommentModal(true);
    
    // Fetch comments for this post
    try {
      const response = await fetch(`/api/posts/${post.id}/comments`);
      if (response.ok) {
        const commentsData = await response.json();
        const formattedComments = commentsData.map(comment => ({
          ...comment,
          timestamp: formatTimestamp(comment.timestamp),
        }));
        setComments(formattedComments);
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
      setComments([]);
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim() || !selectedPost || !currentUserId) {
      if (!currentUserId) {
        alert('Please log in to comment');
      }
      return;
    }

    try {
      const response = await fetch(`/api/posts/${selectedPost.id}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: currentUserId,
        content: newComment,
        }),
      });

      if (!response.ok) throw new Error('Failed to add comment');

      const newCommentData = await response.json();
      setComments([{
        ...newCommentData,
        timestamp: 'Just now',
      }, ...comments]);
      setNewComment('');
      
      // Update post comment count
      setPosts(posts.map(post => {
        if (post.id === selectedPost.id) {
          return { ...post, comments: post.comments + 1 };
        }
        return post;
      }));
    } catch (error) {
      console.error('Error adding comment:', error);
      alert('Failed to add comment. Please try again.');
    }
  };

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    alert('Link copied to clipboard!');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Community Feed</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Connect with fellow equestrians, share your journey, and celebrate the love of horses
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              {/* Add Post Button */}
              <div className="mb-6">
                <button
                  onClick={() => {
                    // Check if user is logged in before showing modal
                    try {
                      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
                      if (!token) {
                        router.push('/login');
                        return;
                      }
                      setShowAddPostModal(true);
                    } catch (error) {
                      console.error('Error checking auth:', error);
                      router.push('/login');
                    }
                  }}
                  className="w-full bg-teal-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-teal-700 transition-colors flex items-center justify-center gap-2"
                >
                  <i className="ri-add-line text-xl"></i>
                  Create New Post
                </button>
              </div>

              {loading ? (
                <div className="text-center py-12">
                  <p className="text-gray-500">Loading posts...</p>
                </div>
              ) : posts.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-2xl">
                  <p className="text-gray-500">No posts yet. Be the first to share!</p>
                </div>
              ) : (
              <div className="space-y-6">
                {posts.map((post) => (
                  <div key={post.id} className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                    <div className="p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 rounded-full overflow-hidden flex items-center justify-center">
                          <img
                            src={post.avatar}
                            alt={post.username}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">{post.username}</h3>
                          <p className="text-sm text-gray-500">{post.timestamp}</p>
                        </div>
                        <button className="text-gray-400 hover:text-gray-600 transition-colors w-8 h-8 flex items-center justify-center">
                          <i className="ri-more-fill text-xl"></i>
                        </button>
                      </div>

                      <p className="text-gray-700 mb-4 leading-relaxed">{post.content}</p>

                      <div className="w-full h-96 rounded-xl overflow-hidden mb-4">
                        <img
                          src={post.image}
                          alt="Post"
                          className="w-full h-full object-cover object-top"
                            onError={(e) => {
                              e.target.style.display = 'none';
                              e.target.parentElement.innerHTML = '<div class="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400">Image not available</div>';
                            }}
                        />
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        <div className="flex items-center gap-6">
                          <button
                            onClick={() => toggleLike(post.id)}
                            className="flex items-center gap-2 text-gray-600 hover:text-teal-600 transition-colors whitespace-nowrap"
                          >
                            <i className={`${post.isLiked ? 'ri-heart-fill text-red-500' : 'ri-heart-line'} text-xl`}></i>
                              <span className="text-sm font-medium">{post.likes || 0}</span>
                          </button>
                          <button
                            onClick={() => openCommentModal(post)}
                            className="flex items-center gap-2 text-gray-600 hover:text-teal-600 transition-colors whitespace-nowrap"
                          >
                            <i className="ri-chat-3-line text-xl"></i>
                              <span className="text-sm font-medium">{post.comments || 0}</span>
                          </button>
                          <button
                            onClick={() => openShareModal(post)}
                            className="flex items-center gap-2 text-gray-600 hover:text-teal-600 transition-colors whitespace-nowrap"
                          >
                            <i className="ri-share-line text-xl"></i>
                              <span className="text-sm font-medium">{post.shares || 0}</span>
                          </button>
                        </div>
                        <button
                          onClick={() => toggleSave(post.id)}
                          className="text-gray-600 hover:text-teal-600 transition-colors w-8 h-8 flex items-center justify-center"
                        >
                          <i className={`${post.isSaved ? 'ri-bookmark-fill text-teal-600' : 'ri-bookmark-line'} text-xl`}></i>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              )}
            </div>

            <div className="lg:col-span-1">
              <div className="sticky top-24">
                <SponsoredSection />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Post Modal */}
      <AddPostModal
        isOpen={showAddPostModal}
        onClose={() => setShowAddPostModal(false)}
        onSubmit={handleCreatePost}
      />

      {/* Share Modal */}
      {showShareModal && selectedPost && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowShareModal(false)}>
          <div className="bg-white rounded-2xl p-8 max-w-md w-full" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900">Share Post</h3>
              <button
                onClick={() => setShowShareModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors w-8 h-8 flex items-center justify-center"
              >
                <i className="ri-close-line text-2xl"></i>
              </button>
            </div>

            <div className="grid grid-cols-4 gap-4 mb-6">
              <button className="flex flex-col items-center gap-2 p-4 rounded-xl hover:bg-gray-50 transition-colors">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                  <i className="ri-facebook-fill text-white text-2xl"></i>
                </div>
                <span className="text-xs text-gray-600">Facebook</span>
              </button>
              <button className="flex flex-col items-center gap-2 p-4 rounded-xl hover:bg-gray-50 transition-colors">
                <div className="w-12 h-12 bg-sky-400 rounded-full flex items-center justify-center">
                  <i className="ri-twitter-fill text-white text-2xl"></i>
                </div>
                <span className="text-xs text-gray-600">Twitter</span>
              </button>
              <button className="flex flex-col items-center gap-2 p-4 rounded-xl hover:bg-gray-50 transition-colors">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                  <i className="ri-instagram-fill text-white text-2xl"></i>
                </div>
                <span className="text-xs text-gray-600">Instagram</span>
              </button>
              <button className="flex flex-col items-center gap-2 p-4 rounded-xl hover:bg-gray-50 transition-colors">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                  <i className="ri-whatsapp-fill text-white text-2xl"></i>
                </div>
                <span className="text-xs text-gray-600">WhatsApp</span>
              </button>
            </div>

            <div className="flex items-center gap-2 p-4 bg-gray-50 rounded-xl">
              <input
                type="text"
                value={typeof window !== 'undefined' ? window.location.href : ''}
                readOnly
                className="flex-1 bg-transparent text-sm text-gray-600 outline-none"
              />
              <button
                onClick={copyLink}
                className="text-teal-600 hover:text-teal-700 font-medium text-sm whitespace-nowrap"
              >
                Copy Link
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Comment Modal */}
      {showCommentModal && selectedPost && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowCommentModal(false)}>
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[80vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h3 className="text-2xl font-bold text-gray-900">Comments</h3>
              <button
                onClick={() => setShowCommentModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors w-8 h-8 flex items-center justify-center"
              >
                <i className="ri-close-line text-2xl"></i>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {comments.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No comments yet. Be the first to comment!</p>
              ) : (
                comments.map((comment) => (
                <div key={comment.id} className="flex gap-3">
                    <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 flex items-center justify-center bg-gray-200">
                      {comment.avatar ? (
                    <img
                      src={comment.avatar}
                      alt={comment.username}
                      className="w-full h-full object-cover"
                    />
                      ) : (
                        <i className="ri-user-line text-gray-400 text-xl"></i>
                      )}
                  </div>
                  <div className="flex-1">
                    <div className="bg-gray-50 rounded-2xl p-4">
                      <h4 className="font-semibold text-gray-900 mb-1">{comment.username}</h4>
                      <p className="text-gray-700 text-sm">{comment.content}</p>
                    </div>
                    <p className="text-xs text-gray-500 mt-2 ml-4">{comment.timestamp}</p>
                  </div>
                </div>
                ))
              )}
            </div>

            <div className="p-6 border-t border-gray-100">
              <div className="flex gap-3">
                <input
                  type="text"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Write a comment..."
                  className="flex-1 px-4 py-3 bg-gray-50 rounded-full text-sm outline-none focus:ring-2 focus:ring-teal-500"
                  onKeyPress={(e) => e.key === 'Enter' && handleAddComment()}
                />
                <button
                  onClick={handleAddComment}
                  className="bg-teal-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-teal-700 transition-colors whitespace-nowrap"
                >
                  Post
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

