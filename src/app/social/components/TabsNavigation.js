export default function TabsNavigation({ activeTab, setActiveTab }) {
  return (
    <div className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-8 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('home')}
            className={`py-4 px-2 font-medium text-sm transition-colors border-b-2 ${
              activeTab === 'home'
                ? 'border-teal-600 text-teal-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Home
          </button>
          <button
            onClick={() => setActiveTab('community')}
            className={`py-4 px-2 font-medium text-sm transition-colors border-b-2 ${
              activeTab === 'community'
                ? 'border-teal-600 text-teal-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Community
          </button>
          <button
            onClick={() => setActiveTab('stories')}
            className={`py-4 px-2 font-medium text-sm transition-colors border-b-2 ${
              activeTab === 'stories'
                ? 'border-teal-600 text-teal-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Stories
          </button>
        </div>
      </div>
    </div>
  );
}

