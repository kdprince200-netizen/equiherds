'use client';

export default function Payments() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Payments</h2>
      <div className="bg-gray-50 rounded-lg p-8 text-center">
        <i className="ri-money-dollar-circle-line text-5xl text-gray-400 mb-4"></i>
        <p className="text-gray-600">No payment history available.</p>
      </div>
    </div>
  );
}

