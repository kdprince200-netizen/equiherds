'use client';

export default function Tabs({ activeTab, setActiveTab }) {
  const tabs = [
    'overview',
    'members',
    'coaches',
    'classes',
    'recorded-sessions',
    'promotions',
    'finances',
    'facilities',
    'performance',
    'profile',
    'settings'
  ];

  return (
    <div className="bg-white rounded-xl shadow-lg mb-8">
      <div className="border-b border-slate-200 overflow-x-auto">
        <div className="flex gap-1 p-1 min-w-max sm:min-w-0">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 sm:px-4 md:px-6 py-2 sm:py-3 rounded-lg text-sm sm:text-base font-medium transition-colors whitespace-nowrap ${
                activeTab === tab ? 'bg-teal-600 text-white' : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              {tab === 'recorded-sessions' ? 'Recorded Sessions' : tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

