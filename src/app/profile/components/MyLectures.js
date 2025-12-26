'use client';

import { useState, useEffect } from 'react';
import {
  getRequest,
  postRequest,
  putRequest,
  deleteRequest,
  uploadFile,
  uploadVideos,
} from '../../service';

export default function MyLectures() {
  const [activeTab, setActiveTab] = useState('live'); // 'live' or 'offline'
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lectureType, setLectureType] = useState('offline'); // 'offline' or 'live'
  const [editingLectureId, setEditingLectureId] = useState(null);
  const [toast, setToast] = useState({ visible: false, type: 'success', message: '' });
  const [formData, setFormData] = useState({
    courseTitle: '',
    coverImage: null,
    demoVideo: null,
    coverImageUrl: '',
    demoVideoUrl: '',
    courseType: [],
    coursePrice: '',
    discount: '',
    duration: '',
    lectureVideos: [],
    existingLectureVideos: [],
    description: '',
    // Live lecture specific
    courseLengthWeeks: '',
    classSchedule: []
  });

  const [liveLectures, setLiveLectures] = useState([]);
  const [offlineLectures, setOfflineLectures] = useState([]);
  const [courseTypeInput, setCourseTypeInput] = useState('');
  const [scheduleInput, setScheduleInput] = useState({
    day: '',
    startTime: '',
    endTime: ''
  });
  const [deleteTarget, setDeleteTarget] = useState(null); // { lecture, type: 'live' | 'offline' } | null

  const showToast = (message, type = 'success', duration = 3000) => {
    setToast({ visible: true, type, message });
    if (duration > 0) {
      setTimeout(() => {
        setToast((prev) => ({ ...prev, visible: false }));
      }, duration);
    }
  };

  // Load existing lectures from API
  useEffect(() => {
    const fetchLectures = async () => {
      try {
        const res = await getRequest('/api/lectures?limit=100');
        if (!res || !res.success || !Array.isArray(res.data)) return;

        const live = res.data.filter((l) => l.lectureType === 'live');
        const offline = res.data.filter((l) => l.lectureType === 'offline');

        setLiveLectures(live);
        setOfflineLectures(offline);
      } catch (err) {
        console.error('Failed to load lectures:', err);
      }
    };

    fetchLectures();
  }, []);

  const handleOpenModal = (type) => {
    setLectureType(type);
    setEditingLectureId(null);
    setFormData({
      courseTitle: '',
      coverImage: null,
      demoVideo: null,
      coverImageUrl: '',
      demoVideoUrl: '',
      courseType: [],
      coursePrice: '',
      discount: '',
      duration: '',
      lectureVideos: [],
      existingLectureVideos: [],
      description: '',
      courseLengthWeeks: '',
      classSchedule: []
    });
    setCourseTypeInput('');
    setScheduleInput({ day: '', startTime: '', endTime: '' });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingLectureId(null);
  };

  const handleEditLecture = (lecture) => {
    const id = lecture._id || lecture.id;
    setEditingLectureId(id);
    setLectureType(lecture.lectureType || 'offline');

    setFormData({
      courseTitle: lecture.courseTitle || '',
      coverImage: null,
      demoVideo: null,
      coverImageUrl: lecture.coverImageUrl || '',
      demoVideoUrl: lecture.demoVideoUrl || '',
      courseType: lecture.courseType || [],
      coursePrice: lecture.coursePrice != null ? String(lecture.coursePrice) : '',
      discount: lecture.discount != null ? String(lecture.discount) : '',
      duration: lecture.duration || '',
      lectureVideos: [],
      existingLectureVideos: lecture.lectureVideos || [],
      description: lecture.description || '',
      courseLengthWeeks:
        lecture.courseLengthWeeks != null ? String(lecture.courseLengthWeeks) : '',
      classSchedule: lecture.classSchedule || [],
    });

    setCourseTypeInput('');
    setScheduleInput({ day: '', startTime: '', endTime: '' });
    setShowModal(true);
  };

  const getLectureId = (lecture) => lecture._id || lecture.id;

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    const { lecture, type } = deleteTarget;
    const id = getLectureId(lecture);
    if (!id) {
      setDeleteTarget(null);
      return;
    }

    try {
      const res = await deleteRequest(`/api/lectures/${id}`);
      if (!res || res.success === false) {
        throw new Error(res?.error || res?.message || 'Failed to delete lecture');
      }

      if (type === 'live') {
        setLiveLectures((prev) => prev.filter((l) => getLectureId(l) !== id));
      } else {
        setOfflineLectures((prev) => prev.filter((l) => getLectureId(l) !== id));
      }

      showToast('Lecture deleted successfully');
    } catch (err) {
      console.error('Delete lecture error:', err);
      showToast(err.message || 'Failed to delete lecture', 'error');
    } finally {
      setDeleteTarget(null);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const { name } = e.target;
    const file = e.target.files[0];
    setFormData(prev => ({
      ...prev,
      [name]: file
    }));
  };

  const handleMultipleFilesChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData(prev => ({
      ...prev,
      lectureVideos: files
    }));
  };

  const addCourseType = () => {
    if (courseTypeInput.trim() && !formData.courseType.includes(courseTypeInput.trim())) {
      setFormData(prev => ({
        ...prev,
        courseType: [...prev.courseType, courseTypeInput.trim()]
      }));
      setCourseTypeInput('');
    }
  };

  const removeCourseType = (tag) => {
    setFormData(prev => ({
      ...prev,
      courseType: prev.courseType.filter(t => t !== tag)
    }));
  };

  const addSchedule = () => {
    if (scheduleInput.day && scheduleInput.startTime && scheduleInput.endTime) {
      setFormData(prev => ({
        ...prev,
        classSchedule: [...prev.classSchedule, { ...scheduleInput }]
      }));
      setScheduleInput({ day: '', startTime: '', endTime: '' });
    }
  };

  const removeSchedule = (index) => {
    setFormData(prev => ({
      ...prev,
      classSchedule: prev.classSchedule.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsSubmitting(true);
    try {
      // 1) Upload media to external services -> get URLs (or reuse existing URLs)
      let coverImageUrl = formData.coverImageUrl;
      if (formData.coverImage) {
        coverImageUrl = await uploadFile(formData.coverImage);
      }
      if (!coverImageUrl) {
        throw new Error('Cover image is required');
      }

      let demoVideoUrl = formData.demoVideoUrl;
      if (formData.demoVideo) {
        const demoVideoUrls = await uploadVideos([formData.demoVideo]);
        demoVideoUrl = Array.isArray(demoVideoUrls) ? demoVideoUrls[0] : demoVideoUrls;
      }
      if (!demoVideoUrl) {
        throw new Error('Demo video is required');
      }

      let lectureVideosUrls = [];
      if (lectureType === 'offline') {
        const existing = formData.existingLectureVideos || [];
        if (formData.lectureVideos.length > 0) {
          const uploaded = await uploadVideos(formData.lectureVideos);
          lectureVideosUrls = [...existing, ...uploaded];
        } else {
          lectureVideosUrls = existing;
        }
      }

      // 2) Build payload for lectures API
      const payload = {
        courseTitle: formData.courseTitle,
        description: formData.description,
        coverImageUrl,
        demoVideoUrl,
        courseType: formData.courseType,
        coursePrice: Number(formData.coursePrice),
        discount: Number(formData.discount || 0),
        lectureType,
        duration: lectureType === 'offline' ? formData.duration : undefined,
        lectureVideos: lectureType === 'offline' ? lectureVideosUrls : [],
        courseLengthWeeks:
          lectureType === 'live' ? Number(formData.courseLengthWeeks) : undefined,
        classSchedule: lectureType === 'live' ? formData.classSchedule : [],
      };

      let response;

      if (editingLectureId) {
        // Update existing lecture
        response = await putRequest(`/api/lectures/${editingLectureId}`, payload);
      } else {
        // Create new lecture
        response = await postRequest('/api/lectures', payload, true);
      }

      if (!response || !response.success) {
        throw new Error(response?.error || response?.message || 'Failed to save lecture');
      }

      const savedLecture = response.data;

      // Update UI lists using data from DB
      if (savedLecture.lectureType === 'live') {
        setLiveLectures((prev) =>
          editingLectureId
            ? prev.map((l) => (getLectureId(l) === getLectureId(savedLecture) ? savedLecture : l))
            : [...prev, savedLecture]
        );
      } else {
        setOfflineLectures((prev) =>
          editingLectureId
            ? prev.map((l) => (getLectureId(l) === getLectureId(savedLecture) ? savedLecture : l))
            : [...prev, savedLecture]
        );
      }

      showToast(editingLectureId ? 'Lecture updated successfully' : 'Lecture created successfully');
      handleCloseModal();
    } catch (err) {
      console.error('Error saving lecture:', err);
      showToast(err.message || 'Error saving lecture. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toast.visible && (
        <div className="fixed top-4 right-4 z-50">
          <div
            className={`px-4 py-3 rounded-lg shadow-lg text-sm text-white ${
              toast.type === 'error' ? 'bg-red-600' : 'bg-teal-600'
            }`}
          >
            {toast.message}
          </div>
        </div>
      )}

      {/* Delete confirmation modal */}
      {deleteTarget && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Delete lecture</h3>
            <p className="text-sm text-gray-600 mb-4">
              Are you sure you want to delete{' '}
              <span className="font-semibold">
                {deleteTarget.lecture.courseTitle || 'this lecture'}
              </span>
              ? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <h2 className="text-2xl font-bold text-gray-900 mb-4">My Lectures</h2>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex">
            <button
              onClick={() => setActiveTab('live')}
              className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'live'
                  ? 'border-teal-600 text-teal-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <i className="ri-live-line mr-2"></i>
              Live Lectures
            </button>
            <button
              onClick={() => setActiveTab('offline')}
              className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'offline'
                  ? 'border-teal-600 text-teal-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <i className="ri-video-line mr-2"></i>
              Offline Lectures
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'live' ? (
          // Live Lectures Content
          <>
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Live Lectures</h3>
              <button
                onClick={() => handleOpenModal('live')}
                className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
              >
                <i className="ri-add-line"></i>
                Add Live Lecture
              </button>
            </div>
            {liveLectures.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <i className="ri-video-line text-4xl text-gray-300 mb-2"></i>
                <p>No live lectures available yet.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course Title</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Weeks</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Schedule</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {liveLectures.map((lecture) => (
                      <tr key={lecture.id} className="hover:bg-gray-50">
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{lecture.courseTitle}</td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="flex flex-wrap gap-1">
                            {lecture.courseType.map((type, idx) => (
                              <span key={idx} className="px-2 py-1 text-xs bg-teal-100 text-teal-800 rounded-full">{type}</span>
                            ))}
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                          ${lecture.coursePrice} {lecture.discount && <span className="text-red-600">({lecture.discount}% off)</span>}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{lecture.courseLengthWeeks} weeks</td>
                        <td className="px-4 py-4 text-sm text-gray-900">
                          <div className="space-y-1">
                            {lecture.classSchedule.map((schedule, idx) => (
                              <div key={idx} className="text-xs">
                                {schedule.day}: {schedule.startTime} - {schedule.endTime}
                              </div>
                            ))}
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            type="button"
                            onClick={() => handleEditLecture(lecture)}
                            className="text-teal-600 hover:text-teal-900 mr-3"
                          >
                            <i className="ri-edit-line"></i>
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeleteTarget({ lecture, type: 'live' })}
                            className="text-red-600 hover:text-red-900"
                          >
                            <i className="ri-delete-bin-line"></i>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        ) : (
          // Offline Lectures Content
          <>
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Offline Lectures</h3>
              <button
                onClick={() => handleOpenModal('offline')}
                className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
              >
                <i className="ri-add-line"></i>
                Add Offline Lecture
              </button>
            </div>
            {offlineLectures.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <i className="ri-video-line text-4xl text-gray-300 mb-2"></i>
                <p>No offline lectures available yet.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course Title</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Videos</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {offlineLectures.map((lecture) => (
                      <tr key={lecture.id} className="hover:bg-gray-50">
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{lecture.courseTitle}</td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="flex flex-wrap gap-1">
                            {lecture.courseType.map((type, idx) => (
                              <span key={idx} className="px-2 py-1 text-xs bg-teal-100 text-teal-800 rounded-full">{type}</span>
                            ))}
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                          ${lecture.coursePrice} {lecture.discount && <span className="text-red-600">({lecture.discount}% off)</span>}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{lecture.duration}</td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{lecture.lectureVideos.length} videos</td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            type="button"
                            onClick={() => handleEditLecture(lecture)}
                            className="text-teal-600 hover:text-teal-900 mr-3"
                          >
                            <i className="ri-edit-line"></i>
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeleteTarget({ lecture, type: 'offline' })}
                            className="text-red-600 hover:text-red-900"
                          >
                            <i className="ri-delete-bin-line"></i>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900">
                {editingLectureId ? 'Edit' : 'Add'} {lectureType === 'live' ? 'Live' : 'Offline'} Lecture
              </h3>
              <button
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <i className="ri-close-line text-2xl"></i>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Course Title - Full Width */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Course Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="courseTitle"
                  value={formData.courseTitle}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-gray-900"
                  placeholder="Enter course title"
                />
              </div>

              {/* Cover Image and Demo Video - 2 Columns */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Cover Image */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cover Image <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="file"
                    name="coverImage"
                    onChange={handleFileChange}
                    accept="image/*"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-gray-900"
                  />
                  {formData.coverImage && (
                    <p className="mt-2 text-sm text-gray-600">
                      Selected: {formData.coverImage.name}
                    </p>
                  )}
                  {!formData.coverImage && formData.coverImageUrl && (
                    <div className="mt-3 flex items-center gap-3">
                      <img
                        src={formData.coverImageUrl}
                        alt="Cover"
                        className="h-16 w-16 rounded object-cover border border-gray-200"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setFormData((prev) => ({
                            ...prev,
                            coverImageUrl: '',
                            coverImage: null,
                          }))
                        }
                        className="text-sm text-red-600 hover:text-red-800"
                      >
                        Remove current image
                      </button>
                    </div>
                  )}
                </div>

                {/* Demo Video */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Demo Video <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="file"
                    name="demoVideo"
                    onChange={handleFileChange}
                    accept="video/*"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-gray-900"
                  />
                  {formData.demoVideo && (
                    <p className="mt-2 text-sm text-gray-600">
                      Selected: {formData.demoVideo.name}
                    </p>
                  )}
                  {!formData.demoVideo && formData.demoVideoUrl && (
                    <div className="mt-3 flex items-center gap-3">
                      <a
                        href={formData.demoVideoUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-sm text-teal-600 hover:text-teal-800 underline"
                      >
                        View current demo video
                      </a>
                      <button
                        type="button"
                        onClick={() =>
                          setFormData((prev) => ({
                            ...prev,
                            demoVideoUrl: '',
                            demoVideo: null,
                          }))
                        }
                        className="text-sm text-red-600 hover:text-red-800"
                      >
                        Remove current video
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Course Type - Full Width */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Course Type <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={courseTypeInput}
                    onChange={(e) => setCourseTypeInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCourseType())}
                    placeholder="Enter course type and press Enter"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-gray-900"
                  />
                  <button
                    type="button"
                    onClick={addCourseType}
                    className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.courseType.map((tag, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-2 px-3 py-1 bg-teal-100 text-teal-800 rounded-full text-sm"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeCourseType(tag)}
                        className="text-teal-600 hover:text-teal-800"
                      >
                        <i className="ri-close-line"></i>
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Course Price and Discount - 2 Columns */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Course Price */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Course Price <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="coursePrice"
                    value={formData.coursePrice}
                    onChange={handleInputChange}
                    required
                    min="0"
                    step="0.01"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-gray-900"
                    placeholder="0.00"
                  />
                </div>

                {/* Discount */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Discount (%)
                  </label>
                  <input
                    type="number"
                    name="discount"
                    value={formData.discount}
                    onChange={handleInputChange}
                    min="0"
                    max="100"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-gray-900"
                    placeholder="0"
                  />
                </div>
              </div>

              {/* Conditional Fields */}
              {lectureType === 'offline' ? (
                <>
                  {/* Duration - Single Column */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Duration <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="duration"
                        value={formData.duration}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-gray-900"
                        placeholder="e.g., 10 hours, 5 days"
                      />
                    </div>
                  </div>

                  {/* Upload Lecture Videos - Full Width */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Upload Lecture Videos <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="file"
                      multiple
                      onChange={handleMultipleFilesChange}
                      accept="video/*"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-gray-900"
                    />
                    {formData.lectureVideos.length > 0 && (
                      <div className="mt-2 space-y-1">
                        {formData.lectureVideos.map((file, idx) => (
                          <p key={idx} className="text-sm text-gray-600">
                            New Video {idx + 1}: {file.name}
                          </p>
                        ))}
                      </div>
                    )}
                    {formData.existingLectureVideos.length > 0 && (
                      <div className="mt-3 space-y-2">
                        {formData.existingLectureVideos.map((url, idx) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between px-3 py-2 bg-gray-50 rounded-lg"
                          >
                            <a
                              href={url}
                              target="_blank"
                              rel="noreferrer"
                              className="text-sm text-teal-600 hover:text-teal-800 underline"
                            >
                              Existing Video {idx + 1}
                            </a>
                            <button
                              type="button"
                              onClick={() =>
                                setFormData((prev) => ({
                                  ...prev,
                                  existingLectureVideos: prev.existingLectureVideos.filter(
                                    (_, i) => i !== idx
                                  ),
                                }))
                              }
                              className="text-sm text-red-600 hover:text-red-800"
                            >
                              Remove
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <>
                  {/* Course Length in Weeks - Single Column */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Course Length (Weeks) <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        name="courseLengthWeeks"
                        value={formData.courseLengthWeeks}
                        onChange={handleInputChange}
                        required
                        min="1"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-gray-900"
                        placeholder="e.g., 4"
                      />
                    </div>
                  </div>

                  {/* Class Schedule - Full Width */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Class Schedule <span className="text-red-500">*</span>
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-2">
                      <select
                        value={scheduleInput.day}
                        onChange={(e) => setScheduleInput(prev => ({ ...prev, day: e.target.value }))}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-gray-900"
                      >
                        <option value="">Select Day</option>
                        <option value="Monday">Monday</option>
                        <option value="Tuesday">Tuesday</option>
                        <option value="Wednesday">Wednesday</option>
                        <option value="Thursday">Thursday</option>
                        <option value="Friday">Friday</option>
                        <option value="Saturday">Saturday</option>
                        <option value="Sunday">Sunday</option>
                      </select>
                      <input
                        type="time"
                        value={scheduleInput.startTime}
                        onChange={(e) => setScheduleInput(prev => ({ ...prev, startTime: e.target.value }))}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-gray-900"
                        placeholder="Start Time"
                      />
                      <div className="flex gap-2">
                        <input
                          type="time"
                          value={scheduleInput.endTime}
                          onChange={(e) => setScheduleInput(prev => ({ ...prev, endTime: e.target.value }))}
                          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-gray-900"
                          placeholder="End Time"
                        />
                        <button
                          type="button"
                          onClick={addSchedule}
                          className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
                        >
                          <i className="ri-add-line"></i>
                        </button>
                      </div>
                    </div>
                    {formData.classSchedule.length > 0 && (
                      <div className="space-y-2 mt-2">
                        {formData.classSchedule.map((schedule, idx) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between px-3 py-2 bg-gray-50 rounded-lg"
                          >
                            <span className="text-sm text-gray-700">
                              {schedule.day}: {schedule.startTime} - {schedule.endTime}
                            </span>
                            <button
                              type="button"
                              onClick={() => removeSchedule(idx)}
                              className="text-red-600 hover:text-red-800"
                            >
                              <i className="ri-close-line"></i>
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </>
              )}

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  rows="4"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-gray-900"
                  placeholder="Enter course description"
                />
              </div>

              {/* Form Actions */}
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`px-6 py-2 rounded-lg transition-colors ${
                    isSubmitting
                      ? 'bg-teal-300 text-white cursor-not-allowed'
                      : 'bg-teal-600 text-white hover:bg-teal-700'
                  }`}
                >
                  {isSubmitting
                    ? 'Saving...'
                    : editingLectureId
                    ? 'Update Lecture'
                    : 'Add Lecture'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
