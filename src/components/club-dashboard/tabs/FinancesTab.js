'use client';

export default function FinancesTab() {
  const financialData = {
    thisMonth: {
      revenue: 24500,
      expenses: 12300,
      profit: 12200,
      membershipFees: 18900,
      privateClasses: 4200,
      merchandise: 1400
    },
    lastMonth: {
      revenue: 22800,
      expenses: 11900,
      profit: 10900
    },
    yearToDate: {
      revenue: 289400,
      expenses: 145600,
      profit: 143800
    }
  };

  const expenses = [
    { category: 'Rent', amount: 5000, percentage: 41 },
    { category: 'Staff Salaries', amount: 4500, percentage: 37 },
    { category: 'Utilities', amount: 1200, percentage: 10 },
    { category: 'Equipment', amount: 800, percentage: 6 },
    { category: 'Marketing', amount: 500, percentage: 4 },
    { category: 'Insurance', amount: 300, percentage: 2 }
  ];

  const paymentHistory = [
    {
      id: 1,
      date: '2024-02-15',
      description: 'Monthly Membership Fees',
      amount: '$18,900',
      type: 'Income',
      status: 'Completed'
    },
    {
      id: 2,
      date: '2024-02-10',
      description: 'Private Training Sessions',
      amount: '$4,200',
      type: 'Income',
      status: 'Completed'
    },
    {
      id: 3,
      date: '2024-02-05',
      description: 'Rent Payment',
      amount: '$5,000',
      type: 'Expense',
      status: 'Completed'
    }
  ];

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-slate-900">Financial Overview</h3>
      
      <div className="grid grid-cols-3 gap-6">
        <div className="bg-slate-50 rounded-lg p-6">
          <h4 className="font-semibold text-slate-900 mb-4">This Month</h4>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-slate-600">Revenue:</span>
              <span className="font-semibold text-green-600">${financialData.thisMonth.revenue.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Expenses:</span>
              <span className="font-semibold text-red-600">${financialData.thisMonth.expenses.toLocaleString()}</span>
            </div>
            <div className="flex justify-between pt-3 border-t border-slate-300">
              <span className="font-bold text-slate-900">Profit:</span>
              <span className="font-bold text-green-600">${financialData.thisMonth.profit.toLocaleString()}</span>
            </div>
          </div>
        </div>

        <div className="bg-slate-50 rounded-lg p-6">
          <h4 className="font-semibold text-slate-900 mb-4">Last Month</h4>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-slate-600">Revenue:</span>
              <span className="font-semibold text-slate-900">${financialData.lastMonth.revenue.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Expenses:</span>
              <span className="font-semibold text-slate-900">${financialData.lastMonth.expenses.toLocaleString()}</span>
            </div>
            <div className="flex justify-between pt-3 border-t border-slate-300">
              <span className="font-bold text-slate-900">Profit:</span>
              <span className="font-bold text-slate-900">${financialData.lastMonth.profit.toLocaleString()}</span>
            </div>
          </div>
        </div>

        <div className="bg-slate-50 rounded-lg p-6">
          <h4 className="font-semibold text-slate-900 mb-4">Year to Date</h4>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-slate-600">Revenue:</span>
              <span className="font-semibold text-green-600">${financialData.yearToDate.revenue.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Expenses:</span>
              <span className="font-semibold text-red-600">${financialData.yearToDate.expenses.toLocaleString()}</span>
            </div>
            <div className="flex justify-between pt-3 border-t border-slate-300">
              <span className="font-bold text-slate-900">Profit:</span>
              <span className="font-bold text-green-600">${financialData.yearToDate.profit.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <h4 className="font-semibold text-slate-900 mb-4">Revenue Breakdown</h4>
          <div className="bg-slate-50 rounded-lg p-6 space-y-3">
            <div className="flex justify-between">
              <span className="text-slate-600">Membership Fees:</span>
              <span className="font-semibold text-slate-900">${financialData.thisMonth.membershipFees.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Private Classes:</span>
              <span className="font-semibold text-slate-900">${financialData.thisMonth.privateClasses.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Merchandise:</span>
              <span className="font-semibold text-slate-900">${financialData.thisMonth.merchandise.toLocaleString()}</span>
            </div>
          </div>
        </div>

        <div>
          <h4 className="font-semibold text-slate-900 mb-4">Expense Breakdown</h4>
          <div className="bg-slate-50 rounded-lg p-6 space-y-3">
            {expenses.map((expense, index) => (
              <div key={index}>
                <div className="flex justify-between mb-1">
                  <span className="text-slate-600">{expense.category}:</span>
                  <span className="font-semibold text-slate-900">${expense.amount.toLocaleString()}</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div
                    className="bg-red-600 h-2 rounded-full"
                    style={{ width: `${expense.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div>
        <h4 className="font-semibold text-slate-900 mb-4">Payment History</h4>
        <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Date</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Description</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Type</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Amount</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {paymentHistory.map((payment) => (
                <tr key={payment.id}>
                  <td className="px-6 py-4 text-sm text-slate-900">{payment.date}</td>
                  <td className="px-6 py-4 text-sm text-slate-900">{payment.description}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      payment.type === 'Income' 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {payment.type}
                    </span>
                  </td>
                  <td className={`px-6 py-4 text-sm font-semibold ${
                    payment.type === 'Income' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {payment.amount}
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                      {payment.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
