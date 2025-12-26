'use client';

export default function PerformanceTab() {
  const performanceMetrics = {
    memberRetention: 94,
    classAttendance: 88,
    memberSatisfaction: 96,
    facilityRating: 92,
    coachPerformance: 91,
    revenueGrowth: 15
  };

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-slate-900">Club Performance</h3>
      {Object.entries(performanceMetrics).map(([key, value]) => (
        <div key={key}>
          <div className="flex justify-between mb-2">
            <span className="font-semibold text-slate-900 capitalize">
              {key.replace(/([A-Z])/g, ' $1').trim()}
            </span>
            <span className="font-bold text-teal-600">{value}%</span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-3">
            <div
              className="bg-teal-600 h-3 rounded-full transition-all"
              style={{ width: `${value}%` }}
            />
          </div>
        </div>
      ))}

      <div className="bg-slate-50 rounded-lg p-6 mt-8">
        <h4 className="font-semibold text-slate-900 mb-4">Performance Insights</h4>
        <ul className="space-y-3 text-sm text-slate-700">
          <li className="flex items-start gap-2">
            <i className="ri-trophy-line text-yellow-500 mt-1"></i>
            <span>Top-rated club in your area with 4.8+ rating</span>
          </li>
          <li className="flex items-start gap-2">
            <i className="ri-arrow-up-line text-green-500 mt-1"></i>
            <span>Member retention improved by 12% this quarter</span>
          </li>
          <li className="flex items-start gap-2">
            <i className="ri-team-line text-blue-500 mt-1"></i>
            <span>Average class size increased to 12 students</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
