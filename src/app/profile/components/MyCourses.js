'use client';

export default function MyCourses() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">My Courses</h2>
      <div className="bg-gray-50 rounded-lg p-8 text-center">
        <i className="ri-book-open-line text-5xl text-gray-400 mb-4"></i>
        <p className="text-gray-600">No courses available yet.</p>
      </div>
    </div>
  );
}

