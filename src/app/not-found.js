export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center px-4">
        <h2 className="text-4xl font-bold text-gray-900 mb-4">404</h2>
        <p className="text-xl text-gray-600 mb-6">Page Not Found</p>
        <a
          href="/"
          className="bg-primary text-white px-6 py-2 rounded hover:opacity-90 transition-opacity inline-block"
        >
          Go back home
        </a>
      </div>
    </div>
  );
}

