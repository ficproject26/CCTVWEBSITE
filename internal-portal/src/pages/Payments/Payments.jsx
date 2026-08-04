import React from 'react';
import { useSelector } from 'react-redux';
import { FiDollarSign, FiCreditCard, FiCheckCircle, FiClock, FiFileText } from 'react-icons/fi';

export default function Payments() {
  const payments = useSelector(state => state.dashboard.payments);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Paid': return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-300 border border-emerald-100 dark:border-emerald-900/30';
      case 'Pending': return 'bg-amber-50 text-amber-700 dark:bg-amber-955/20 dark:text-amber-300 border border-amber-100 dark:border-amber-900/30';
      case 'Overdue': return 'bg-red-50 text-red-700 dark:bg-red-950/20 dark:text-red-300 border border-red-100 dark:border-red-900/30';
      default: return 'bg-slate-50 text-slate-655';
    }
  };

  const paidTotal = payments.filter(p => p.status === 'Paid').reduce((s, p) => s + p.amount, 0);
  const pendingTotal = payments.filter(p => p.status === 'Pending').reduce((s, p) => s + p.amount, 0);

  return (
    <div className="space-y-6">
      
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Total Collections */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex items-center gap-4 transition-colors">
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-650 dark:text-emerald-400 rounded-xl">
            <FiCheckCircle size={22} />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-400">Total Collected Revenue</span>
            <h4 className="text-lg font-semibold text-slate-850 dark:text-slate-100 mt-0.5">₹{paidTotal.toLocaleString('en-IN')}</h4>
          </div>
        </div>

        {/* Outstanding Invoices */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex items-center gap-4 transition-colors">
          <div className="p-3 bg-amber-50 dark:bg-amber-955/20 text-amber-650 dark:text-amber-400 rounded-xl">
            <FiClock size={22} />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-400">Outstanding Approvals</span>
            <h4 className="text-lg font-semibold text-slate-850 dark:text-slate-100 mt-0.5">₹{pendingTotal.toLocaleString('en-IN')}</h4>
          </div>
        </div>

        {/* Total Billing Volume */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex items-center gap-4 transition-colors">
          <div className="p-3 bg-blue-50 dark:bg-blue-950/30 text-blue-650 dark:text-blue-400 rounded-xl">
            <FiFileText size={22} />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-400">Total Invoiced Amount</span>
            <h4 className="text-lg font-semibold text-slate-850 dark:text-slate-100 mt-0.5">
              ₹{(paidTotal + pendingTotal).toLocaleString('en-IN')}
            </h4>
          </div>
        </div>

      </div>

      {/* Invoice list */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm p-6 overflow-hidden transition-colors">
        <h3 className="font-semibold text-slate-800 dark:text-slate-100 text-sm mb-4">Invoice ledger records</h3>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 font-semibold">
                <th className="py-3 px-2">Invoice ID</th>
                <th className="py-3 px-2">Billing Date</th>
                <th className="py-3 px-2">Customer Account</th>
                <th className="py-3 px-2">Payment Method</th>
                <th className="py-3 px-2">Invoice Value</th>
                <th className="py-3 px-2">Status</th>
                <th className="py-3 px-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-800/40 text-slate-700 dark:text-slate-300 font-semibold">
              {payments.map((pay) => (
                <tr key={pay.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors">
                  <td className="py-3.5 px-2 font-semibold text-slate-900 dark:text-white">{pay.id}</td>
                  <td className="py-3.5 px-2 font-semibold text-slate-800 dark:text-slate-200">{pay.date}</td>
                  <td className="py-3.5 px-2 font-medium">{pay.customer}</td>
                  <td className="py-3.5 px-2 flex items-center gap-1.5 py-3 font-medium">
                    <FiCreditCard className="text-slate-400" />
                    <span>{pay.method}</span>
                  </td>
                  <td className="py-3.5 px-2 font-semibold text-slate-900 dark:text-white">₹{pay.amount.toLocaleString('en-IN')}</td>
                  <td className="py-3.5 px-2">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${getStatusBadge(pay.status)}`}>
                      {pay.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-2 text-right">
                    <button 
                      onClick={() => alert(`Receipt downloaded for ${pay.id}`)}
                      className="px-2.5 py-1 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-semibold rounded-lg border border-slate-100 dark:border-slate-850"
                    >
                      Receipt
                    </button>
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
