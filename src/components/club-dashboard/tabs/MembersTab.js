'use client';

import { useState } from 'react';

export default function MembersTab() {
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [editType, setEditType] = useState('');

  const members = [
    {
      id: 1,
      name: 'John Anderson',
      email: 'john.anderson@email.com',
      phone: '+1 (555) 777-8888',
      membershipType: 'Unlimited',
      belt: 'Blue Belt',
      joinDate: '2024-01-15',
      expiryDate: '2025-01-15',
      attendance: 92,
      status: 'Active',
      monthlyFee: '$149',
      emergencyContact: 'Jane Anderson - (555) 999-0000'
    },
    {
      id: 2,
      name: 'Sarah Mitchell',
      email: 'sarah.mitchell@email.com',
      phone: '+1 (555) 222-3333',
      membershipType: '3x per week',
      belt: 'Purple Belt',
      joinDate: '2023-11-20',
      expiryDate: '2024-11-20',
      attendance: 88,
      status: 'Active',
      monthlyFee: '$99',
      emergencyContact: 'Mike Mitchell - (555) 444-5555'
    },
    {
      id: 3,
      name: 'Mike Johnson',
      email: 'mike.johnson@email.com',
      phone: '+1 (555) 666-7777',
      membershipType: 'Unlimited',
      belt: 'White Belt',
      joinDate: '2024-02-01',
      expiryDate: '2025-02-01',
      attendance: 95,
      status: 'Active',
      monthlyFee: '$149',
      emergencyContact: 'Lisa Johnson - (555) 888-9999'
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
          <h3 className="text-xl font-bold text-slate-900">Club Members</h3>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Search members..."
              className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            <button className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors whitespace-nowrap">
              <i className="ri-add-line mr-2"></i>
              Add Member
            </button>
          </div>
        </div>
        <div className="space-y-4">
          {members.map((member) => (
            <div key={member.id} className="bg-slate-50 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-teal-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
                    {member.name.split(' ').map((n) => n[0]).join('')}
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-slate-900">{member.name}</h4>
                    <p className="text-slate-600">{member.belt} • {member.membershipType}</p>
                    <p className="text-sm text-slate-600">{member.email}</p>
                  </div>
                </div>
                <span className="px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
                  {member.status}
                </span>
              </div>
              <div className="grid grid-cols-4 gap-4 mb-4 text-sm">
                <div>
                  <span className="text-slate-600">Phone:</span>
                  <p className="font-semibold text-slate-900">{member.phone}</p>
                </div>
                <div>
                  <span className="text-slate-600">Monthly Fee:</span>
                  <p className="font-semibold text-green-600">{member.monthlyFee}</p>
                </div>
                <div>
                  <span className="text-slate-600">Attendance:</span>
                  <p className="font-semibold text-slate-900">{member.attendance}%</p>
                </div>
                <div>
                  <span className="text-slate-600">Member Since:</span>
                  <p className="font-semibold text-slate-900">{member.joinDate}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                <div>
                  <span className="text-slate-600">Expiry Date:</span>
                  <p className="font-semibold text-slate-900">{member.expiryDate}</p>
                </div>
                <div>
                  <span className="text-slate-600">Emergency Contact:</span>
                  <p className="font-semibold text-slate-900">{member.emergencyContact}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => handleEdit(member, 'Member')}
                  className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors whitespace-nowrap"
                >
                  Edit Profile
                </button>
                <button className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors whitespace-nowrap">
                  View History
                </button>
                <button className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors whitespace-nowrap">
                  Message
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
