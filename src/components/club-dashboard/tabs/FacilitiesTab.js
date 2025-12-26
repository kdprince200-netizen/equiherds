'use client';

import { useState } from 'react';

export default function FacilitiesTab() {
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [editType, setEditType] = useState('');

  const facilities = [
    {
      id: 1,
      name: 'Main Training Area',
      size: '2,500 sq ft',
      capacity: 30,
      equipment: ['Mats', 'Grappling Dummies', 'Wall Mirrors'],
      status: 'Operational',
      lastMaintenance: '2024-01-15'
    },
    {
      id: 2,
      name: 'Cardio Zone',
      size: '800 sq ft',
      capacity: 15,
      equipment: ['Treadmills', 'Rowing Machines', 'Bikes'],
      status: 'Operational',
      lastMaintenance: '2024-02-01'
    },
    {
      id: 3,
      name: 'Locker Rooms',
      size: '600 sq ft',
      capacity: 40,
      equipment: ['Lockers', 'Showers', 'Benches'],
      status: 'Operational',
      lastMaintenance: '2024-01-20'
    }
  ];

  const handleEdit = (item, type) => {
    setEditingItem(item);
    setEditType(type);
    setShowEditModal(true);
  };

  const handleSaveEdit = () => {
    alert(`Changes saved for ${editType}! This will be connected to Supabase for real data updates.`);
    setShowEditModal(false);
    setEditingItem(null);
    setEditType('');
  };

  return (
    <>
      <div>
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-slate-900">Facility Management</h3>
          <button className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors whitespace-nowrap">
            <i className="ri-add-line mr-2"></i>
            Add Facility
          </button>
        </div>
        <div className="grid grid-cols-2 gap-6">
          {facilities.map((facility) => (
            <div key={facility.id} className="bg-slate-50 rounded-lg p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h4 className="text-lg font-bold text-slate-900">{facility.name}</h4>
                  <p className="text-slate-600">{facility.size} • Capacity: {facility.capacity}</p>
                </div>
                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                  {facility.status}
                </span>
              </div>
              <div className="mb-4">
                <div className="text-sm text-slate-600 mb-2">Equipment:</div>
                <div className="flex flex-wrap gap-2">
                  {facility.equipment.map((item, index) => (
                    <span key={index} className="px-3 py-1 bg-white rounded-full text-xs text-slate-700">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
              <div className="text-sm text-slate-600 mb-4">
                Last Maintenance: {facility.lastMaintenance}
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => handleEdit(facility, 'Facility')}
                  className="flex-1 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors whitespace-nowrap"
                >
                  Edit
                </button>
                <button className="flex-1 px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors whitespace-nowrap">
                  Schedule Maintenance
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Edit Modal */}
      {showEditModal && editingItem && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-6">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-2xl font-bold text-slate-900">Edit {editType}</h3>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <i className="ri-close-line text-2xl"></i>
                </button>
              </div>

              <div className="space-y-4 mb-6">
                <p className="text-sm text-slate-600">
                  Make changes to the {editType.toLowerCase()} information. All fields will be saved to the database.
                </p>
                <textarea
                  placeholder={`Enter updated information for ${editType}...`}
                  maxLength={500}
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
                  rows={6}
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 px-6 py-3 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors font-semibold whitespace-nowrap"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveEdit}
                  className="flex-1 px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors font-semibold whitespace-nowrap"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
