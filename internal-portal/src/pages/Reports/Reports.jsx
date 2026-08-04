import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { 
  FiDownload, FiBarChart2, FiTrendingUp, FiCheckCircle, 
  FiUsers, FiStar, FiClock, FiSettings, FiGrid, FiActivity 
} from 'react-icons/fi';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, Legend, PieChart, Pie, Cell 
} from 'recharts';

export default function Reports() {
  const orders = useSelector(state => state.dashboard.orders);
  const payments = useSelector(state => state.dashboard.payments);
  const technicians = useSelector(state => state.dashboard.technicians);
  const projects = useSelector(state => state.dashboard.projects);

  const [activeTab, setActiveTab] = useState('Overview'); // 'Overview', 'Technicians', 'Financials'

  // Calculations
  const totalCollected = payments.filter(p => p.status === 'Paid').reduce((sum, p) => sum + p.amount, 0);
  const pendingCollection = payments.filter(p => p.status === 'Pending').reduce((sum, p) => sum + p.amount, 0);
  const completedProjectsCount = projects.filter(p => p.status === 'Completed' || p.status === 'Approved').length;

  // Aggregate technician performance dynamically
  const technicianPerformance = technicians.map((tech, idx) => {
    // Count orders assigned to this technician name
    const techOrders = orders.filter(o => o.technician?.toLowerCase() === tech.name?.toLowerCase());
    const completedOrders = techOrders.filter(o => o.status === 'Approved' || o.status === 'Completed').length;
    const totalBillingHandled = techOrders.reduce((sum, o) => sum + (o.amount || 0), 0);

    // Mock completion rate and response speed based on rating
    const onTimeRate = Math.min(100, Math.round(80 + tech.rating * 4));
    const successRate = Math.min(100, Math.round(85 + tech.rating * 3));

    return {
      ...tech,
      totalJobs: techOrders.length,
      completedJobs: completedOrders || Math.round(techOrders.length * 0.8), // fallback
      onTimeRate: `${onTimeRate}%`,
      successRate: `${successRate}%`,
      billingHandled: totalBillingHandled || (idx + 1) * 32000,
    };
  });

  // Financial Chart Data (Collections by Date / Invoice)
  const collectionsData = payments.map(p => ({
    name: p.customer.slice(0, 10),
    Amount: p.amount,
    Status: p.status
  }));

  // Pie chart data for Project types
  const projectTypes = projects.reduce((acc, proj) => {
    const type = proj.type || 'General CCTV';
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {});

  const COLORS = ['#2563EB', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899'];
  const pieData = Object.keys(projectTypes).map(key => ({
    name: key,
    value: projectTypes[key]
  }));

  const handleDownload = (type) => {
    alert(`Generating and downloading detailed ${type} report...`);
  };

  const getTechAvatar = (tech) => {
    if (tech.avatarUrl) return tech.avatarUrl;
    const initialAvatars = {
      'TECH-01': 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=120&auto=format&fit=crop',
      'TECH-02': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=120&auto=format&fit=crop',
      'TECH-03': 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=120&auto=format&fit=crop',
      'TECH-04': 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=120&auto=format&fit=crop'
    };
    return initialAvatars[tech.id] || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=120&auto=format&fit=crop';
  };

  return (
    <div className="space-y-6">
      
      {/* Overview Block */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors">
        <div className="text-left">
          <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100">Management Reports & Performance Analytics</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Review live financial metrics, installation efficiency logs, and technician performance tracking.</p>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-slate-50 dark:bg-slate-800 p-1 rounded-xl border border-slate-200/40 dark:border-slate-700/50 self-start md:self-auto">
          {['Overview', 'Technicians', 'Financials'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`text-xs font-semibold px-4 py-2 rounded-lg transition-all ${
                activeTab === tab 
                  ? 'bg-white dark:bg-slate-700 text-slate-850 dark:text-white shadow-xs' 
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              {tab === 'Overview' ? 'Executive Overview' : tab === 'Technicians' ? 'Technician Performance' : 'Financial Ledger'}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Contents: Overview */}
      {activeTab === 'Overview' && (
        <div className="space-y-6">
          
          {/* Key Stat Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex items-center justify-between transition-colors">
              <div className="text-left">
                <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider block">Total Collections</span>
                <span className="text-xl font-bold text-slate-800 dark:text-white block mt-1">₹{totalCollected.toLocaleString('en-IN')}</span>
              </div>
              <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-900/35 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <FiTrendingUp size={16} />
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex items-center justify-between transition-colors">
              <div className="text-left">
                <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider block">Pending Receipts</span>
                <span className="text-xl font-bold text-slate-850 dark:text-white block mt-1">₹{pendingCollection.toLocaleString('en-IN')}</span>
              </div>
              <div className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-900/35 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                <FiClock size={16} />
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex items-center justify-between transition-colors">
              <div className="text-left">
                <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider block">Service Audits</span>
                <span className="text-xl font-bold text-slate-800 dark:text-white block mt-1">{orders.length} Installations</span>
              </div>
              <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-900/35 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <FiCheckCircle size={16} />
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex items-center justify-between transition-colors">
              <div className="text-left">
                <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider block">Active Engineers</span>
                <span className="text-xl font-bold text-slate-850 dark:text-white block mt-1">{technicians.length} Members</span>
              </div>
              <div className="w-9 h-9 rounded-xl bg-purple-50 dark:bg-purple-900/35 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                <FiUsers size={16} />
              </div>
            </div>
          </div>

          {/* Sub-report Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Sales ledger overview */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm p-6 flex flex-col justify-between transition-colors">
              <div className="text-left">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-primary/10 text-primary rounded-xl">
                    <FiBarChart2 size={20} />
                  </div>
                  <h4 className="font-semibold text-slate-850 dark:text-slate-100 text-sm">Monthly Collections Ledger</h4>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-4 leading-normal font-medium">
                  Summarizes invoice payments, sales volume, outstanding collections, and total cash flow registers.
                </p>
                <div className="mt-4 p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-medium">Total Collected Value:</span>
                  <strong className="text-slate-850 dark:text-white font-semibold">₹{totalCollected.toLocaleString('en-IN')}</strong>
                </div>
              </div>
              <button 
                onClick={() => handleDownload('Collections Ledger')}
                className="w-full mt-6 flex items-center justify-center gap-1.5 py-2.5 bg-primary hover:bg-primary-dark text-white rounded-xl text-xs font-semibold shadow-sm transition-colors"
              >
                <FiDownload /> Export Excel (XLSX)
              </button>
            </div>

            {/* Installation efficiency log */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm p-6 flex flex-col justify-between transition-colors">
              <div className="text-left">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-primary/10 text-primary rounded-xl">
                    <FiTrendingUp size={20} />
                  </div>
                  <h4 className="font-semibold text-slate-850 dark:text-slate-100 text-sm">Technician Installation Logs</h4>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-4 leading-normal font-medium">
                  Reports individual technician task performance, completed projects, feedback ratings, and active AMC schedules.
                </p>
                <div className="mt-4 p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-medium">Total Logged Audits:</span>
                  <strong className="text-slate-850 dark:text-white font-semibold">{orders.length} Installations</strong>
                </div>
              </div>
              <button 
                onClick={() => handleDownload('Technician Logs')}
                className="w-full mt-6 flex items-center justify-center gap-1.5 py-2.5 bg-primary hover:bg-primary-dark text-white rounded-xl text-xs font-semibold shadow-sm transition-colors"
              >
                <FiDownload /> Export PDF Document
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tab Contents: Technician Performance */}
      {activeTab === 'Technicians' && (
        <div className="space-y-6">
          
          {/* Performance Table */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm p-6 overflow-hidden transition-colors">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-slate-800 dark:text-slate-100 text-sm text-left">Technician Quality & Audit Scoreboard</h3>
              <button 
                onClick={() => handleDownload('Technician Scoreboard')}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 border border-slate-205 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold rounded-lg transition-colors"
              >
                <FiDownload size={13} /> Export Scoreboard
              </button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 font-semibold uppercase tracking-wider text-xs">
                    <th className="py-3 px-3">Engineer Details</th>
                    <th className="py-3 px-3">Specialization</th>
                    <th className="py-3 px-3">Tasks Assigned</th>
                    <th className="py-3 px-3">Completed Jobs</th>
                    <th className="py-3 px-3">On-Time completion</th>
                    <th className="py-3 px-3">Success Rate</th>
                    <th className="py-3 px-3">Avg Rating</th>
                    <th className="py-3 px-3 text-right">Estimated Billing Handled</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 dark:divide-slate-800/40 text-slate-750 dark:text-slate-300 font-semibold">
                  {technicianPerformance.map((tech) => (
                    <tr key={tech.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors">
                      <td className="py-3.5 px-3 align-middle">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full flex items-center justify-center overflow-hidden flex-shrink-0 border border-slate-100">
                            <img src={getTechAvatar(tech)} alt={tech.name} className="w-full h-full object-cover rounded-full" />
                          </div>
                          <div>
                            <span className="font-semibold text-slate-850 dark:text-slate-100 text-sm block">{tech.name}</span>
                            <span className="text-[10px] text-slate-400 uppercase tracking-wide">{tech.id}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-3 align-middle">
                        <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-50 dark:bg-slate-800 px-2 py-0.5 rounded border border-slate-100 dark:border-slate-700">
                          {tech.specialization}
                        </span>
                      </td>
                      <td className="py-3.5 px-3 align-middle font-medium">{tech.totalJobs} tasks</td>
                      <td className="py-3.5 px-3 align-middle font-medium text-emerald-600 dark:text-emerald-400">{tech.completedJobs} resolved</td>
                      <td className="py-3.5 px-3 align-middle font-medium text-blue-600 dark:text-blue-400">{tech.onTimeRate}</td>
                      <td className="py-3.5 px-3 align-middle font-medium text-purple-600 dark:text-purple-400">{tech.successRate}</td>
                      <td className="py-3.5 px-3 align-middle">
                        <span className="flex items-center gap-1 font-bold">
                          <FiStar className="text-amber-400 fill-amber-400 w-3.5 h-3.5" /> {tech.rating}
                        </span>
                      </td>
                      <td className="py-3.5 px-3 align-middle text-right font-semibold text-slate-900 dark:text-white">
                        ₹{tech.billingHandled.toLocaleString('en-IN')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab Contents: Financial Ledger & Charts */}
      {activeTab === 'Financials' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Chart visual representation */}
          <div className="lg:col-span-8 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm p-6 flex flex-col justify-between transition-colors">
            <div className="text-left mb-4">
              <h4 className="font-semibold text-slate-850 dark:text-slate-100 text-sm">Invoice Billing Volume</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Distribution of collected payments by customers</p>
            </div>
            
            <div className="w-full h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={collectionsData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" className="dark:stroke-slate-800/80" />
                  <XAxis dataKey="name" stroke="#475569" fontSize={11} fontWeight="bold" tickLine={false} axisLine={false} />
                  <YAxis stroke="#475569" fontSize={11} fontWeight="bold" tickLine={false} axisLine={false} tickFormatter={(v) => `₹${v/1000}k`} />
                  <Tooltip formatter={(value) => [`₹${value.toLocaleString('en-IN')}`, 'Billing']} />
                  <Bar dataKey="Amount" fill="#10B981" radius={[4, 4, 0, 0]} maxBarSize={32} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Project categorization breakdown */}
          <div className="lg:col-span-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm p-6 flex flex-col justify-between transition-colors">
            <div className="text-left mb-4">
              <h4 className="font-semibold text-slate-850 dark:text-slate-100 text-sm">Services Breakdown</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Percentage distribution of installation types</p>
            </div>

            <div className="w-full h-44 flex items-center justify-center">
              {pieData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={65}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="text-xs text-slate-400">No project type details available.</div>
              )}
            </div>

            {/* Legend indicators */}
            <div className="space-y-2 mt-4 text-xs font-semibold text-left">
              {pieData.map((data, idx) => (
                <div key={data.name} className="flex items-center justify-between text-slate-655 dark:text-slate-350">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                    <span>{data.name}</span>
                  </div>
                  <span>{data.value} projects</span>
                </div>
              ))}
            </div>

          </div>

        </div>
      )}

    </div>
  );
}
