import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import { 
  FiShoppingCart, FiDollarSign, FiBriefcase, FiCheckSquare, 
  FiTool, FiPlusCircle, FiFileText, FiUserPlus, 
  FiEye, FiCheck, FiRefreshCw, FiArrowUpRight, FiArrowDownRight,
  FiActivity, FiPackage, FiUsers, FiClock, FiSettings, FiCheckCircle
} from 'react-icons/fi';
import { 
  addOrder, addTechnician, addProduct, approveProject, reworkProject, approveOrder 
} from '../../redux/dashboardSlice';
import Modal from '../../components/Modal';

export default function Dashboard() {
  const dispatch = useDispatch();

  // Retrieve states from Redux store
  const orders = useSelector(state => state.dashboard.orders);
  const technicians = useSelector(state => state.dashboard.technicians);
  const projects = useSelector(state => state.dashboard.projects);
  const serviceRequests = useSelector(state => state.dashboard.serviceRequests);
  const products = useSelector(state => state.dashboard.products);
  const payments = useSelector(state => state.dashboard.payments);
  const notifications = useSelector(state => state.dashboard.notifications);
  const customers = useSelector(state => state.dashboard.customers);

  // Calculate dynamic stats
  const totalRevenue = orders.reduce((sum, o) => sum + (parseFloat(o.amount) || 0), 0);
  const todayStr = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  const todayOrders = orders.filter(o => o.date === todayStr || o.date?.includes('Today') || o.date === 'May 25, 2024').length;
  const activeOrders = orders.filter(o => o.status === 'In Progress' || o.status === 'Pending' || o.status === 'Pending Approval').length;
  const finishedOrders = orders.filter(o => o.status === 'Completed' || o.status === 'Approved').length;

  // Calculate dynamic trend values from live data
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  let lastMonth = currentMonth - 1;
  let lastMonthYear = currentYear;
  if (lastMonth < 0) {
    lastMonth = 11;
    lastMonthYear = currentYear - 1;
  }

  let thisMonthRevenue = 0;
  let lastMonthRevenue = 0;

  orders.forEach(o => {
    const oDate = o.createdAt ? new Date(o.createdAt) : (o.date ? new Date(o.date) : null);
    if (!oDate || isNaN(oDate.getTime())) return;
    const oMonth = oDate.getMonth();
    const oYear = oDate.getFullYear();
    const amount = parseFloat(o.amount) || 0;

    if (oMonth === currentMonth && oYear === currentYear) {
      thisMonthRevenue += amount;
    } else if (oMonth === lastMonth && oYear === lastMonthYear) {
      lastMonthRevenue += amount;
    }
  });

  const revenueChangePercent = lastMonthRevenue > 0 
    ? ((thisMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100 
    : (thisMonthRevenue > 0 ? 100 : 0);

  const lastHourOrders = orders.filter(o => {
    const oTime = o.createdAt ? new Date(o.createdAt).getTime() : 0;
    return oTime > 0 && Date.now() - oTime < 3600000;
  }).length;

  const completionRate = orders.length > 0 
    ? Math.round((finishedOrders / orders.length) * 100) 
    : 0;

  // Modal visibility states
  const [modalType, setModalType] = useState(null); // 'order', 'tech', 'product', 'report', 'viewOrder'
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Form states
  const [orderForm, setOrderForm] = useState({ customer: '', email: '', phone: '', type: 'Cameras Installation', assignedTechnician: 'Unassigned', amount: '' });
  const [techForm, setTechForm] = useState({ name: '', phone: '', email: '', specialization: 'IP Cameras & Networking' });
  const [productForm, setProductForm] = useState({ name: '', category: 'IP Camera', price: '', stock: '', description: '', model: '' });
  const [reportRange, setReportRange] = useState('This Month');

  // Dynamic calculation of chart data from orders
  const getDynamicChartData = () => {
    const revenueByDate = {};
    orders.forEach(order => {
      let dateKey = order.date;
      if (dateKey && dateKey.includes(',')) {
        dateKey = dateKey.split(',')[0];
      }
      if (!dateKey) dateKey = 'Today';
      revenueByDate[dateKey] = (revenueByDate[dateKey] || 0) + (parseFloat(order.amount) || 0);
    });

    const sortedDates = Object.keys(revenueByDate).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
    
    if (sortedDates.length === 0) {
      return [];
    }

    return sortedDates.map(date => ({
      name: date,
      revenue: revenueByDate[date]
    }));
  };

  const lineChartData = getDynamicChartData();

  // Form Submit Handlers
  const handleCreateOrder = (e) => {
    e.preventDefault();
    dispatch(addOrder({
      customer: orderForm.customer,
      email: orderForm.email,
      phone: orderForm.phone,
      type: orderForm.type,
      assignedTechnician: orderForm.assignedTechnician,
      amount: parseFloat(orderForm.amount) || 0
    }));
    setOrderForm({ customer: '', email: '', phone: '', type: 'Cameras Installation', assignedTechnician: 'Unassigned', amount: '' });
    setModalType(null);
  };

  const handleAddTech = (e) => {
    e.preventDefault();
    dispatch(addTechnician(techForm));
    setTechForm({ name: '', phone: '', email: '', specialization: 'IP Cameras & Networking' });
    setModalType(null);
  };

  const handleAddProduct = (e) => {
    e.preventDefault();
    dispatch(addProduct(productForm));
    setProductForm({ name: '', category: 'IP Camera', price: '', stock: '', description: '', model: '' });
    setModalType(null);
  };

  const handleDownloadReport = () => {
    alert(`Report generated successfully for range: ${reportRange}. Starting download...`);
    setModalType(null);
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Approved':
      case 'Completed':
        return 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400';
      case 'In Progress':
        return 'bg-blue-50 text-blue-600 dark:bg-blue-950/20 dark:text-blue-400';
      case 'Pending Approval':
        return 'bg-amber-50 text-amber-600 dark:bg-amber-955/20 dark:text-amber-400';
      case 'Pending':
        return 'bg-red-50 text-red-600 dark:bg-red-950/20 dark:text-red-400';
      default:
        return 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400';
    }
  };

  // List of Recent Orders dynamically calculated from orders state
  const recentOrdersData = orders.slice(0, 4).map(order => {
    let icon = FiShoppingCart;
    let iconBg = 'bg-blue-50 dark:bg-blue-950/40';
    let iconColor = 'text-blue-600';

    if (order.status === 'Completed' || order.status === 'Approved') {
      icon = FiCheckCircle;
      iconBg = 'bg-emerald-50 dark:bg-emerald-950/40';
      iconColor = 'text-emerald-600';
    } else if (order.status === 'Pending Approval') {
      icon = FiClock;
      iconBg = 'bg-amber-50 dark:bg-amber-955/40';
      iconColor = 'text-amber-600';
    } else if (order.status === 'Pending') {
      icon = FiActivity;
      iconBg = 'bg-red-50 dark:bg-red-950/40';
      iconColor = 'text-red-600';
    }

    return {
      id: order.id.startsWith('#') ? order.id : `#${order.id}`,
      customer: order.location || 'Chennai Area',
      type: order.type,
      status: order.status,
      date: order.date,
      iconBg,
      iconColor,
      icon
    };
  });

  // Recent Activity timeline mapped from real notifications
  const recentActivities = (notifications || []).slice(0, 5).map(notif => {
    let icon = FiShoppingCart;
    let iconBg = 'bg-blue-500';

    if (notif.category === 'Payment' || notif.title.toLowerCase().includes('payment')) {
      icon = FiDollarSign;
      iconBg = 'bg-emerald-500';
    } else if (notif.category === 'System' || notif.title.toLowerCase().includes('system') || notif.title.toLowerCase().includes('broadcast')) {
      icon = FiCheckCircle;
      iconBg = 'bg-emerald-500';
    } else if (notif.category === 'Alert' || notif.category === 'Request' || notif.title.toLowerCase().includes('alert')) {
      icon = FiActivity;
      iconBg = 'bg-amber-500';
    } else if (notif.title.toLowerCase().includes('technician') || notif.title.toLowerCase().includes('tech')) {
      icon = FiTool;
      iconBg = 'bg-purple-500';
    }

    return {
      title: notif.message || notif.title,
      time: notif.time,
      iconBg,
      icon
    };
  });

  return (
    <div className="space-y-6">
      
      {/* 4 KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Total Revenue */}
        <div className="bg-blue-100/90 border-blue-200/60 dark:bg-blue-900/30 dark:border-blue-800 p-5 rounded-2xl border shadow-sm flex items-center gap-4 transition-colors">
          <div className="w-14 h-14 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-md shadow-blue-600/10 flex-shrink-0">
            <FiDollarSign size={24} />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Total Revenue</p>
            <h3 className="text-lg font-semibold text-slate-850 dark:text-slate-50 mt-1">₹{totalRevenue.toLocaleString('en-IN')}</h3>
            <span className={`text-xs font-semibold flex items-start gap-1 mt-1.5 ${revenueChangePercent >= 0 ? 'text-emerald-600' : 'text-rose-600 dark:text-rose-400'}`}>
              {revenueChangePercent >= 0 ? (
                <FiArrowUpRight className="flex-shrink-0 mt-0.5" />
              ) : (
                <FiArrowDownRight className="flex-shrink-0 mt-0.5" />
              )}
              <span>
                {Math.abs(revenueChangePercent).toFixed(1)}% <span className="text-slate-450 dark:text-slate-400 font-medium">from last month</span>
              </span>
            </span>
          </div>
        </div>

        {/* Today Orders */}
        <div className="bg-emerald-100/90 border-emerald-200/60 dark:bg-emerald-900/30 dark:border-emerald-800 p-5 rounded-2xl border shadow-sm flex items-center gap-4 transition-colors">
          <div className="w-14 h-14 bg-emerald-600 rounded-full flex items-center justify-center text-white shadow-md shadow-emerald-600/10 flex-shrink-0">
            <FiShoppingCart size={24} />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Today Orders</p>
            <h3 className="text-lg font-semibold text-slate-850 dark:text-slate-50 mt-1">{todayOrders}</h3>
            <span className="text-xs text-emerald-600 font-semibold flex items-start gap-1 mt-1.5">
              <FiArrowUpRight className="flex-shrink-0 mt-0.5" />
              <span>
                +{lastHourOrders} new <span className="text-slate-450 dark:text-slate-400 font-medium">in last hour</span>
              </span>
            </span>
          </div>
        </div>

        {/* Active Orders */}
        <div className="bg-amber-100/95 border-amber-200/60 dark:bg-amber-900/30 dark:border-amber-800 p-5 rounded-2xl border shadow-sm flex items-center gap-4 transition-colors">
          <div className="w-14 h-14 bg-amber-500 rounded-full flex items-center justify-center text-white shadow-md shadow-amber-500/10 flex-shrink-0">
            <FiClock size={24} />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Active Orders</p>
            <h3 className="text-lg font-semibold text-slate-850 dark:text-slate-50 mt-1">{activeOrders}</h3>
            <span className="text-xs text-emerald-600 font-semibold flex items-start gap-1 mt-1.5">
              <FiActivity className="flex-shrink-0 mt-0.5" />
              <span>
                Running <span className="text-slate-450 dark:text-slate-400 font-medium">installations</span>
              </span>
            </span>
          </div>
        </div>

        {/* Finished Orders */}
        <div className="bg-purple-100/90 border-purple-200/60 dark:bg-purple-900/30 dark:border-purple-800 p-5 rounded-2xl border shadow-sm flex items-center gap-4 transition-colors">
          <div className="w-14 h-14 bg-purple-600 rounded-full flex items-center justify-center text-white shadow-md shadow-purple-600/10 flex-shrink-0">
            <FiCheckCircle size={24} />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Finished Orders</p>
            <h3 className="text-lg font-semibold text-slate-850 dark:text-slate-50 mt-1">{finishedOrders}</h3>
            <span className="text-xs text-emerald-600 font-semibold flex items-start gap-1 mt-1.5">
              <FiCheck className="flex-shrink-0 mt-0.5" />
              <span>
                {completionRate}% <span className="text-slate-450 dark:text-slate-400 font-medium">completion rate</span>
              </span>
            </span>
          </div>
        </div>

      </div>

      {/* Row 1: Recent Orders & Revenue Overview (Line Chart) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Recent Orders List exactly matching Image 2 */}
        <div className="lg:col-span-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-md hover:shadow-lg transition-all duration-300 p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-semibold text-slate-800 dark:text-slate-100 text-sm tracking-tight">Recent Orders</h3>
              <span className="text-xs font-semibold text-blue-600 hover:underline cursor-pointer">View All</span>
            </div>
            
            <div className="space-y-3">
              {recentOrdersData.map((order, idx) => (
                <div key={idx} className="flex items-center justify-between p-1 hover:bg-slate-50/50 dark:hover:bg-slate-800/25 rounded-xl transition-colors">
                  <div className="flex items-center gap-2.5">
                    {/* Circle Icon */}
                    <div className={`w-8 h-8 rounded-full ${order.iconBg} ${order.iconColor} flex items-center justify-center flex-shrink-0`}>
                       <order.icon size={14} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-850 dark:text-white text-xs">{order.id}</h4>
                      <p className="text-xs text-slate-600 dark:text-slate-350 font-medium mt-0.5">{order.type}</p>
                      <p className="text-xs text-slate-550 dark:text-slate-400 font-medium mt-0.5">{order.customer}</p>
                    </div>
                  </div>
                  <div className="text-right flex flex-col items-end gap-1">
                    <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">{order.date}</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${getStatusBadgeClass(order.status)}`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-55 dark:border-slate-800 flex gap-2">
            <button 
              onClick={() => setModalType('order')}
              className="flex-1 py-2 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-colors text-center"
            >
              Create Offline Order
            </button>
            <button 
              onClick={() => setModalType('product')}
              className="flex-1 py-2 px-3 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-650 dark:text-slate-300 rounded-xl text-xs font-semibold border border-slate-100 dark:border-slate-850 transition-colors text-center"
            >
              Add Product
            </button>
          </div>
        </div>

        {/* Revenue Overview (Area / Line Chart) matching Image 2 */}
        <div className="lg:col-span-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-md hover:shadow-lg transition-all duration-300 p-6 flex flex-col">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="font-semibold text-slate-800 dark:text-slate-100 text-sm tracking-tight">Revenue Overview</h3>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Total Revenue</span>
                <span className="text-base font-semibold text-slate-850 dark:text-white">₹{totalRevenue.toLocaleString('en-IN')}</span>
              </div>
            </div>
            <select 
              value={reportRange} 
              onChange={(e) => setReportRange(e.target.value)}
              className="text-xs font-semibold bg-slate-50 dark:bg-slate-800 border border-slate-200/50 dark:border-slate-800 text-slate-700 dark:text-slate-300 rounded-lg px-2.5 py-1 focus:outline-none cursor-pointer"
            >
              <option>This Month</option>
              <option>Last Month</option>
            </select>
          </div>

          <div className="w-full flex-1 min-h-[310px] mt-4 pb-1">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={lineChartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" className="dark:stroke-slate-800/80" />
                <XAxis dataKey="name" stroke="#475569" fontSize={13} fontWeight="bold" tickLine={false} axisLine={false} />
                <YAxis 
                  stroke="#475569" 
                  fontSize={13} 
                  fontWeight="bold"
                  tickLine={false} 
                  axisLine={false}
                  tickFormatter={(val) => val >= 100000 ? `₹${val / 100000}L` : `₹${val.toLocaleString('en-IN')}`} 
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1E293B', 
                    borderRadius: '12px', 
                    border: 'none', 
                    fontSize: '13px',
                    color: '#FFF' 
                  }} 
                  formatter={(value) => [`₹${value.toLocaleString('en-IN')}`, 'Revenue']}
                />
                <Bar 
                  dataKey="revenue" 
                  fill="#4F46E5" 
                  radius={[6, 6, 0, 0]}
                  maxBarSize={30}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Row 2: Recent Activity (Timeline) & System Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Recent Activity Timeline card matching Image 2 */}
        <div className="lg:col-span-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-md hover:shadow-lg transition-all duration-300 p-6 flex flex-col">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-semibold text-slate-800 dark:text-slate-100 text-sm tracking-tight">Recent Activity</h3>
            <span className="text-xs font-semibold text-blue-600 hover:underline cursor-pointer">View All</span>
          </div>
          
          <div className="space-y-3">
            {recentActivities.map((act, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className={`w-7 h-7 rounded-lg ${act.iconBg} text-white flex items-center justify-center flex-shrink-0 shadow-sm`}>
                    <act.icon size={13} />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-slate-700 dark:text-slate-200">{act.title}</p>
                  </div>
                </div>
                <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">{act.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* System Summary card with 4 cards matching Image 2 */}
        <div className="lg:col-span-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-md hover:shadow-lg transition-all duration-300 p-6 flex flex-col">
          <h3 className="font-semibold text-slate-800 dark:text-slate-100 text-sm tracking-tight mb-5">System Summary</h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 flex-1">
            
            {/* Total Users */}
            <div className="bg-slate-50/50 dark:bg-slate-800/40 rounded-xl p-3 flex flex-col items-center justify-center text-center border border-slate-100/40 dark:border-slate-800">
              <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mb-2">
                <FiUsers size={14} />
              </div>
              <h4 className="text-sm font-semibold text-slate-850 dark:text-white">{(technicians?.length || 0) + (customers?.length || 0) + 1}</h4>
              <span className="text-xs text-slate-450 dark:text-slate-400 font-medium uppercase tracking-wider mt-0.5 block">Total Users</span>
            </div>

            {/* Total Customers */}
            <div className="bg-slate-50/50 dark:bg-slate-800/40 rounded-xl p-3 flex flex-col items-center justify-center text-center border border-slate-100/40 dark:border-slate-800">
              <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-2">
                <FiUsers size={14} />
              </div>
              <h4 className="text-sm font-semibold text-slate-850 dark:text-white">{customers?.length || 0}</h4>
              <span className="text-xs text-slate-450 dark:text-slate-400 font-medium uppercase tracking-wider mt-0.5 block">Total Customers</span>
            </div>

            {/* Total Products */}
            <div className="bg-slate-50/50 dark:bg-slate-800/40 rounded-xl p-3 flex flex-col items-center justify-center text-center border border-slate-100/40 dark:border-slate-800">
              <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mb-2">
                <FiPackage size={14} />
              </div>
              <h4 className="text-sm font-semibold text-slate-850 dark:text-white">{products?.length || 0}</h4>
              <span className="text-xs text-slate-450 dark:text-slate-400 font-medium uppercase tracking-wider mt-0.5 block">Total Products</span>
            </div>

            {/* Total Technicians */}
            <div className="bg-slate-50/50 dark:bg-slate-800/40 rounded-xl p-3 flex flex-col items-center justify-center text-center border border-slate-100/40 dark:border-slate-800">
              <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center mb-2">
                <FiTool size={14} />
              </div>
              <h4 className="text-sm font-semibold text-slate-850 dark:text-white">{technicians?.length || 0}</h4>
              <span className="text-xs text-slate-450 dark:text-slate-400 font-medium uppercase tracking-wider mt-0.5 block">Total Technicians</span>
            </div>

          </div>
        </div>

      </div>

      {/* --- QUICK ACTION MODALS --- */}

      {/* 1. Create Offline Order Modal */}
      <Modal isOpen={modalType === 'order'} onClose={() => setModalType(null)} title="Create Offline Order">
        <form onSubmit={handleCreateOrder} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1.5">Customer Name</label>
            <input 
              required
              type="text" 
              placeholder="e.g. Anand Pharmacy" 
              value={orderForm.customer}
              onChange={(e) => setOrderForm({ ...orderForm, customer: e.target.value })}
              className="w-full text-xs p-2.5 border border-slate-200 dark:border-slate-700 bg-transparent dark:bg-slate-800/50 rounded-xl focus:outline-none focus:border-primary"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1.5">Email Address</label>
              <input 
                required
                type="email" 
                placeholder="customer@domain.com" 
                value={orderForm.email}
                onChange={(e) => setOrderForm({ ...orderForm, email: e.target.value })}
                className="w-full text-xs p-2.5 border border-slate-200 dark:border-slate-700 bg-transparent dark:bg-slate-800/50 rounded-xl focus:outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1.5">Contact Phone</label>
              <input 
                required
                type="text" 
                placeholder="+91 XXXXX XXXXX" 
                value={orderForm.phone}
                onChange={(e) => setOrderForm({ ...orderForm, phone: e.target.value })}
                className="w-full text-xs p-2.5 border border-slate-200 dark:border-slate-700 bg-transparent dark:bg-slate-800/50 rounded-xl focus:outline-none focus:border-primary"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1.5">Order Type</label>
              <select 
                value={orderForm.type}
                onChange={(e) => setOrderForm({ ...orderForm, type: e.target.value })}
                className="w-full text-xs p-2.5 border border-slate-200 dark:border-slate-700 bg-transparent dark:bg-slate-800 rounded-xl focus:outline-none focus:border-primary"
              >
                <option>Cameras Installation</option>
                <option>AMC Service</option>
                <option>Cameras Repair</option>
                <option>DVR Upgrade</option>
                <option>System Audit</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1.5">Assigned Technician</label>
              <select 
                value={orderForm.assignedTechnician}
                onChange={(e) => setOrderForm({ ...orderForm, assignedTechnician: e.target.value })}
                className="w-full text-xs p-2.5 border border-slate-200 dark:border-slate-700 bg-transparent dark:bg-slate-800 rounded-xl focus:outline-none focus:border-primary"
              >
                <option value="Unassigned">Unassigned (Queue)</option>
                {technicians.map(t => (
                  <option key={t.id} value={t.name}>{t.name}</option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1.5">Amount (₹)</label>
            <input 
              required
              type="number" 
              placeholder="e.g. 15000" 
              value={orderForm.amount}
              onChange={(e) => setOrderForm({ ...orderForm, amount: e.target.value })}
              className="w-full text-xs p-2.5 border border-slate-200 dark:border-slate-700 bg-transparent dark:bg-slate-800/50 rounded-xl focus:outline-none focus:border-primary"
            />
          </div>
          <div className="pt-2 flex justify-end gap-2.5">
            <button 
              type="button" 
              onClick={() => setModalType(null)}
              className="px-4 py-2 border border-slate-200 dark:border-slate-700 text-slate-500 text-xs font-semibold rounded-xl"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="px-4 py-2 bg-blue-600 hover:bg-blue-705 text-white text-xs font-semibold rounded-xl transition-colors"
            >
              Create Offline Order
            </button>
          </div>
        </form>
      </Modal>

      {/* 2. Add Product Modal */}
      <Modal isOpen={modalType === 'product'} onClose={() => setModalType(null)} title="Add Product to Stock">
        <form onSubmit={handleAddProduct} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1.5">Product Name</label>
              <input 
                required
                type="text" 
                placeholder="e.g. CP Plus Dome Camera" 
                value={productForm.name}
                onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                className="w-full text-xs p-2.5 border border-slate-200 dark:border-slate-700 bg-transparent dark:bg-slate-800/50 rounded-xl focus:outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1.5">Model Number</label>
              <input 
                required
                type="text" 
                placeholder="e.g. CP-UNC-DA21L2" 
                value={productForm.model}
                onChange={(e) => setProductForm({ ...productForm, model: e.target.value })}
                className="w-full text-xs p-2.5 border border-slate-200 dark:border-slate-700 bg-transparent dark:bg-slate-800/50 rounded-xl focus:outline-none focus:border-primary"
              />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1.5">Category</label>
              <select 
                value={productForm.category}
                onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                className="w-full text-xs p-2.5 border border-slate-200 dark:border-slate-700 bg-transparent dark:bg-slate-800 rounded-xl focus:outline-none focus:border-primary"
              >
                <option>IP Camera</option>
                <option>Analog Camera</option>
                <option>NVR</option>
                <option>DVR</option>
                <option>Hard Disk</option>
                <option>Cables</option>
                <option>Power Supply</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1.5">Price (₹)</label>
              <input 
                required
                type="number" 
                placeholder="2500" 
                value={productForm.price}
                onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                className="w-full text-xs p-2.5 border border-slate-200 dark:border-slate-700 bg-transparent dark:bg-slate-800/50 rounded-xl focus:outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1.5">Initial Stock</label>
              <input 
                required
                type="number" 
                placeholder="10" 
                value={productForm.stock}
                onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })}
                className="w-full text-xs p-2.5 border border-slate-200 dark:border-slate-700 bg-transparent dark:bg-slate-800/50 rounded-xl focus:outline-none focus:border-primary"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1.5">Product Description</label>
            <textarea 
              rows={3}
              placeholder="Provide specifications, camera features..." 
              value={productForm.description}
              onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
              className="w-full text-xs p-2.5 border border-slate-200 dark:border-slate-700 bg-transparent dark:bg-slate-800/50 rounded-xl focus:outline-none focus:border-primary"
            />
          </div>
          <div className="pt-2 flex justify-end gap-2.5">
            <button 
              type="button" 
              onClick={() => setModalType(null)}
              className="px-4 py-2 border border-slate-200 dark:border-slate-700 text-slate-500 text-xs font-semibold rounded-xl"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl transition-colors"
            >
              Add Product
            </button>
          </div>
        </form>
      </Modal>

    </div>
  );
}
