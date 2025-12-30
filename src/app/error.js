'use client';

export default function Error({ error, reset }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center px-4">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Something went wrong!</h2>
        <button
          onClick={reset}
          className="bg-primary text-white px-6 py-2 rounded hover:opacity-90 transition-opacity"
        >
          Try again
        </button>
      </div>
    </div>
  );
}

