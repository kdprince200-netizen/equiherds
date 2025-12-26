'use client';

export default function Subscription({ user }) {
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Subscription</h2>
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Current Plan</h3>
            <p className="text-gray-600">Status: <span className={`font-medium ${
              user?.subscriptionStatus === 'active' ? 'text-green-600' :
              user?.subscriptionStatus === 'expired' ? 'text-red-600' :
              'text-yellow-600'
            }`}>{user?.subscriptionStatus || 'No subscription'}</span></p>
          </div>
        </div>
        {user?.subscriptionExpiry && (
          <p className="text-sm text-gray-500">Expires on: {formatDate(user.subscriptionExpiry)}</p>
        )}
      </div>
    </div>
  );
}

