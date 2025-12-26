'use client';

export default function OverviewTab() {
  const upcomingClasses = [
    {
      id: 1,
      name: 'Fundamentals BJJ',
      coach: 'Marcus Silva',
      date: '2024-02-15',
      time: '06:00 PM',
      duration: '90 min',
      enrolled: 12,
      capacity: 15,
      room: 'Main Training Area',
      level: 'Beginner'
    },
    {
      id: 2,
      name: 'Advanced Wrestling',
      coach: 'Sarah Thompson',
      date: '2024-02-15',
      time: '07:30 PM',
      duration: '60 min',
      enrolled: 8,
      capacity: 10,
      room: 'Main Training Area',
      level: 'Advanced'
    },
    {
      id: 3,
      name: 'No-Gi Grappling',
      coach: 'Diego Rodriguez',
      date: '2024-02-16',
      time: '06:00 PM',
      duration: '90 min',
      enrolled: 15,
      capacity: 15,
      room: 'Main Training Area',
      level: 'Intermediate'
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-bold text-slate-900 mb-4">Upcoming Classes</h3>
        <div className="space-y-4">
          {upcomingClasses.slice(0, 3).map((classItem) => (
            <div
              key={classItem.id}
              className="bg-slate-50 rounded-lg p-4 flex items-center justify-between"
            >
              <div>
                <h4 className="font-semibold text-slate-900 text-lg">
                  {classItem.name}
                </h4>
                <p className="text-sm text-slate-600">Coach: {classItem.coach}</p>
                <p className="text-sm text-slate-600">
                  {classItem.date} • {classItem.time} • {classItem.duration}
                </p>
              </div>
              <div className="text-right">
                <div className="text-sm text-slate-600 mb-1">
                  Enrolled: {classItem.enrolled}/{classItem.capacity}
                </div>
                <div className="w-32 bg-slate-200 rounded-full h-2">
                  <div
                    className="bg-teal-600 h-2 rounded-full"
                    style={{
                      width: `${(classItem.enrolled / classItem.capacity) * 100}%`
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="bg-slate-50 rounded-lg p-6">
          <h4 className="font-semibold text-slate-900 mb-4">Quick Stats</h4>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-slate-600">Classes This Week:</span>
              <span className="font-semibold text-slate-900">24</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Average Attendance:</span>
              <span className="font-semibold text-slate-900">88%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">New Members:</span>
              <span className="font-semibold text-green-600">+12</span>
            </div>
          </div>
        </div>
        <div className="bg-slate-50 rounded-lg p-6">
          <h4 className="font-semibold text-slate-900 mb-4">Recent Activity</h4>
          <div className="space-y-2 text-sm">
            <p className="text-slate-700">• New member joined: John Anderson</p>
            <p className="text-slate-700">• Class added: Advanced BJJ</p>
            <p className="text-slate-700">• Coach added: Marcus Silva</p>
          </div>
        </div>
      </div>
    </div>
  );
}
