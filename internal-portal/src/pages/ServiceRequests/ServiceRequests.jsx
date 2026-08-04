import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateServiceRequestStatus, addServiceRequest, editServiceRequest } from '../../redux/dashboardSlice';
import { FiPlus, FiTool, FiUser, FiCalendar, FiSearch, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import Modal from '../../components/Modal';

export default function ServiceRequests() {
  const dispatch = useDispatch();
  const serviceRequests = useSelector(state => state.dashboard.serviceRequests);
  const technicians = useSelector(state => state.dashboard.technicians);

  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingReq, setEditingReq] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('All Priorities');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [typeFilter, setTypeFilter] = useState('All Types');

  const [requestForm, setRequestForm] = useState({ 
    customer: '', 
    contact: '', 
    type: 'Camera not working properly', 
    priority: 'Medium', 
    assignedTech: 'Unassigned',
    status: 'Open'
  });

  const getPriorityTheme = (priority) => {
    switch (priority) {
      case 'High':
        return {
          border: 'border-l-4 border-red-500',
          id: 'text-red-600 bg-red-50 dark:bg-red-950/20',
          badge: 'text-red-600 bg-red-50/50 dark:bg-red-950/10',
          priorityText: 'text-red-500 dark:text-red-400'
        };
      case 'Medium':
        return {
          border: 'border-l-4 border-amber-500',
          id: 'text-amber-600 bg-amber-50 dark:bg-amber-955/20',
          badge: 'text-amber-600 bg-amber-50/50 dark:bg-amber-955/10',
          priorityText: 'text-amber-500 dark:text-amber-400'
        };
      case 'Low':
      default:
        return {
          border: 'border-l-4 border-blue-500',
          id: 'text-blue-600 bg-blue-50 dark:bg-blue-955/20',
          badge: 'text-blue-600 bg-blue-50/50 dark:bg-blue-955/10',
          priorityText: 'text-blue-500 dark:text-blue-400'
        };
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Resolved':
        return 'text-emerald-600 bg-emerald-50/60 dark:bg-emerald-950/10';
      case 'In Progress':
        return 'text-blue-600 bg-blue-50/60 dark:bg-blue-955/10';
      case 'Open':
      default:
        return 'text-amber-600 bg-amber-50/60 dark:bg-amber-955/10';
    }
  };

  const getStatusButton = (status, id) => {
    switch (status) {
      case 'Resolved':
        return (
          <button className="flex items-center gap-1.5 py-2 px-3.5 bg-emerald-600 text-white text-xs font-semibold rounded-xl shadow-sm cursor-default">
            Resolved
          </button>
        );
      case 'In Progress':
        return (
          <button 
            onClick={() => handleStatusUpdate(id, 'Resolved')}
            className="flex items-center gap-1.5 py-2 px-3.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-sm transition-colors"
          >
            Update
          </button>
        );
      case 'Open':
      default:
        return (
          <button 
            onClick={() => handleStatusUpdate(id, 'In Progress')}
            className="flex items-center gap-1.5 py-2 px-3.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold rounded-xl shadow-sm transition-colors"
          >
            Assign
          </button>
        );
    }
  };

  const getTechStatusColor = (status) => {
    switch (status) {
      case 'Available': return 'bg-emerald-500';
      case 'Busy': return 'bg-amber-500';
      case 'Offline': return 'bg-red-500';
      case 'Leave': return 'bg-slate-400';
      default: return 'bg-slate-350';
    }
  };

  const handleStatusUpdate = (id, newStatus) => {
    dispatch(updateServiceRequestStatus({ id, status: newStatus }));
  };

  const handleAddRequest = (e) => {
    e.preventDefault();
    dispatch(addServiceRequest(requestForm));
    setRequestForm({ customer: '', contact: '', type: 'Camera not working properly', priority: 'Medium', assignedTech: 'Unassigned' });
    setModalOpen(false);
  };

  // Filter service requests
  const filteredRequests = serviceRequests.filter(req => {
    const matchesSearch = req.customer.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          req.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          req.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesPriority = priorityFilter === 'All Priorities' || req.priority === priorityFilter;
    const matchesStatus = statusFilter === 'All Status' || req.status === statusFilter;
    const matchesType = typeFilter === 'All Types' || req.type.toLowerCase().includes(typeFilter.toLowerCase());

    return matchesSearch && matchesPriority && matchesStatus && matchesType;
  });

  return (
    <div className="space-y-6">
      
      {/* Search & Actions Panel Toolbar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col xl:flex-row gap-4 justify-between items-center transition-colors">
        <div className="flex flex-col md:flex-row items-center gap-3.5 w-full xl:max-w-4xl">
          
          {/* Search box */}
          <div className="relative w-full md:max-w-xs">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
              <FiSearch size={15} />
            </span>
            <input
              type="text"
              placeholder="Search request, client, technician..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full text-xs pl-9 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200/50 dark:border-slate-800 rounded-xl focus:outline-none focus:border-primary text-slate-800 dark:text-slate-100 font-medium"
            />
          </div>

          {/* Priority filter */}
          <select 
            value={priorityFilter} 
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="w-full md:w-auto text-xs p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200/50 dark:border-slate-800 text-slate-700 dark:text-slate-350 rounded-xl focus:outline-none cursor-pointer font-semibold"
          >
            <option>All Priorities</option>
            <option>High</option>
            <option>Medium</option>
            <option>Low</option>
          </select>

          {/* Status filter */}
          <select 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full md:w-auto text-xs p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200/50 dark:border-slate-800 text-slate-700 dark:text-slate-350 rounded-xl focus:outline-none cursor-pointer font-semibold"
          >
            <option>All Status</option>
            <option>Open</option>
            <option>In Progress</option>
            <option>Resolved</option>
          </select>

          {/* Type filter */}
          <select 
            value={typeFilter} 
            onChange={(e) => setTypeFilter(e.target.value)}
            className="w-full md:w-auto text-xs p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200/50 dark:border-slate-800 text-slate-700 dark:text-slate-350 rounded-xl focus:outline-none cursor-pointer font-semibold"
          >
            <option>All Types</option>
            <option value="camera">Camera</option>
            <option value="video">Video Recording</option>
            <option value="display">Display</option>
          </select>

        </div>

        <button 
          onClick={() => setModalOpen(true)}
          className="w-full xl:w-auto flex items-center justify-center gap-1.5 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-colors"
        >
          <FiPlus /> New Service Request
        </button>
      </div>

      {/* wide requests list */}
      <div className="space-y-4">
        {filteredRequests.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-12 text-center text-slate-400 border border-slate-100 dark:border-slate-800">
            No service requests found matching the filter criteria.
          </div>
        ) : (
          filteredRequests.map((req) => {
            const pTheme = getPriorityTheme(req.priority);
            const assignedTechObj = technicians.find(t => t.name === req.assignedTech);
            const techStatus = assignedTechObj ? assignedTechObj.status : 'Offline';

            return (
              <div 
                key={req.id} 
                className={`flex flex-col lg:flex-row items-start lg:items-center justify-between bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-sm hover:shadow-md transition-all p-5 gap-6 text-left ${pTheme.border}`}
              >
                
                {/* ID & Status Badge Column */}
                <div className="flex flex-row lg:flex-col items-center lg:items-start gap-2 min-w-[120px]">
                  <span className={`text-sm font-semibold px-3 py-1 rounded-lg ${pTheme.id}`}>{req.id}</span>
                  <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${pTheme.badge}`}>{req.priority}</span>
                  <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${getStatusBadge(req.status)}`}>{req.status}</span>
                </div>

                {/* Main Content Details */}
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-slate-850 dark:text-slate-100 text-sm leading-snug">{req.type}</h4>
                  <p className="text-xs text-slate-500 mt-1 font-medium">{req.customer} &bull; Chennai Area</p>
                  <p className="text-xs text-slate-700 dark:text-slate-350 mt-1 leading-normal truncate max-w-lg font-sans">
                    Service request filed for troubleshoot. Contact client at {req.contact}.
                  </p>

                  <div className="flex flex-wrap gap-4 mt-4 text-xs text-slate-500 dark:text-slate-400 font-medium border-t border-slate-50 dark:border-slate-800/80 pt-3">
                    <span className="flex items-center gap-1.5"><FiCalendar className="text-slate-400 w-4 h-4" /> {req.date} (Created)</span>
                    <span className="flex items-center gap-1.5"><FiUser className="text-slate-400 w-4 h-4" /> {req.customer} (Reported By)</span>
                    <span className="flex items-center gap-1.5"><FiTool className="text-slate-400 w-4 h-4" /> Camera (Category)</span>
                  </div>
                </div>

                {/* Assigned Technician Block */}
                <div className="bg-slate-50/50 dark:bg-slate-800/30 border border-slate-100 dark:border-slate-800/80 rounded-xl p-3 flex items-center gap-3 min-w-[210px]">
                  <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center overflow-hidden">
                    <svg className="w-6 h-6 text-slate-450" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                    </svg>
                  </div>
                  <div>
                    <h5 className="font-semibold text-xs text-slate-850 dark:text-slate-200">{req.assignedTech}</h5>
                    <span className="text-xs text-slate-500 font-medium block mt-0.5 font-sans">Technician</span>
                    <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-450 mt-1">
                      <span className={`w-1.5 h-1.5 rounded-full ${getTechStatusColor(techStatus)}`} /> {techStatus}
                    </span>
                  </div>
                </div>

                {/* Right actions block */}
                <div className="flex items-center gap-2.5 min-w-[190px] justify-end w-full lg:w-auto font-medium">
                  <button className="flex items-center gap-1 py-2 px-3 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-semibold rounded-xl border border-slate-100 dark:border-slate-855 transition-colors">
                    <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    View
                  </button>
                  <button 
                    onClick={() => {
                      setEditingReq(req);
                      setRequestForm({
                        customer: req.clientName || req.customer,
                        contact: req.contact || '',
                        type: req.type || '',
                        priority: req.priority || 'Medium',
                        assignedTech: req.assignedTech || req.technician || 'Unassigned',
                        status: req.status || 'Open'
                      });
                      setEditModalOpen(true);
                    }}
                    className="px-2.5 py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-300 text-xs font-semibold rounded-xl transition-colors border border-blue-100 dark:border-blue-900/30"
                  >
                    Edit
                  </button>
                  {getStatusButton(req.status, req.id)}
                </div>

              </div>
            );
          })
        )}
      </div>

      {/* Pagination Bar */}
      <div className="flex items-center justify-between border-t border-slate-150/60 dark:border-slate-800/80 pt-6">
        <span className="text-xs text-slate-500 font-semibold">Showing 1 to {filteredRequests.length} of {filteredRequests.length} requests</span>
        <div className="flex items-center gap-1.5">
          <button className="p-2 border border-slate-100 dark:border-slate-800 rounded-xl text-slate-450 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"><FiChevronLeft /></button>
          <button className="w-8 h-8 flex items-center justify-center bg-blue-600 text-white text-xs font-semibold rounded-xl shadow-sm">1</button>
          <button className="w-8 h-8 flex items-center justify-center hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-650 dark:text-slate-300 text-xs font-semibold rounded-xl transition-colors">2</button>
          <button className="w-8 h-8 flex items-center justify-center hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-650 dark:text-slate-300 text-xs font-semibold rounded-xl transition-colors">3</button>
          <button className="p-2 border border-slate-100 dark:border-slate-800 rounded-xl text-slate-450 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"><FiChevronRight /></button>
        </div>
      </div>

      {/* Modal Add Service Request */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Log New CCTV Service Request">
        <form onSubmit={handleAddRequest} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1.5">Customer Name</label>
            <input 
              required
              type="text" 
              placeholder="e.g. Adyar Bakery" 
              value={requestForm.customer}
              onChange={(e) => setRequestForm({ ...requestForm, customer: e.target.value })}
              className="w-full text-xs p-2.5 border border-slate-200 dark:border-slate-700 bg-transparent dark:bg-slate-800/50 rounded-xl focus:outline-none focus:border-primary text-slate-800 dark:text-slate-100"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1.5">Contact Phone</label>
              <input 
                required
                type="text" 
                placeholder="+91 9XXXX XXXXX" 
                value={requestForm.contact}
                onChange={(e) => setRequestForm({ ...requestForm, contact: e.target.value })}
                className="w-full text-xs p-2.5 border border-slate-200 dark:border-slate-700 bg-transparent dark:bg-slate-800/50 rounded-xl focus:outline-none focus:border-primary text-slate-800 dark:text-slate-100"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1.5">Priority</label>
              <select 
                value={requestForm.priority}
                onChange={(e) => setRequestForm({ ...requestForm, priority: e.target.value })}
                className="w-full text-xs p-2.5 border border-slate-200 dark:border-slate-700 bg-transparent dark:bg-slate-800 rounded-xl focus:outline-none focus:border-primary text-slate-800 dark:text-slate-100"
              >
                <option>High</option>
                <option>Medium</option>
                <option>Low</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1.5">Service Type</label>
              <input 
                required
                type="text" 
                placeholder="e.g. DVR Reboot Loop" 
                value={requestForm.type}
                onChange={(e) => setRequestForm({ ...requestForm, type: e.target.value })}
                className="w-full text-xs p-2.5 border border-slate-200 dark:border-slate-700 bg-transparent dark:bg-slate-800/50 rounded-xl focus:outline-none focus:border-primary text-slate-800 dark:text-slate-100"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1.5">Assign Service Engineer</label>
              <select 
                value={requestForm.assignedTech}
                onChange={(e) => setRequestForm({ ...requestForm, assignedTech: e.target.value })}
                className="w-full text-xs p-2.5 border border-slate-200 dark:border-slate-700 bg-transparent dark:bg-slate-800 rounded-xl focus:outline-none focus:border-primary text-slate-800 dark:text-slate-100"
              >
                <option value="Unassigned">Unassigned</option>
                {technicians.map(t => (
                  <option key={t.id} value={t.name}>{t.name}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2">
            <button 
              type="button" 
              onClick={() => setModalOpen(false)}
              className="py-2 px-4 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-semibold rounded-xl border border-slate-100 dark:border-slate-700 transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-sm transition-colors"
            >
              Log Request
            </button>
          </div>
        </form>
      </Modal>

      {/* Edit Service Request Modal */}
      <Modal isOpen={editModalOpen} onClose={() => setEditModalOpen(false)} title="Edit Service Request Details">
        {editingReq && (
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              dispatch(editServiceRequest({
                id: editingReq.id,
                clientName: requestForm.customer,
                contact: requestForm.contact,
                type: requestForm.type,
                priority: requestForm.priority,
                technician: requestForm.assignedTech,
                description: editingReq.description || `Service request filed for troubleshoot. Contact client at ${requestForm.contact}.`,
                status: requestForm.status
              }));
              setEditModalOpen(false);
              setEditingReq(null);
            }} 
            className="space-y-4 text-left"
          >
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1.5">Customer Name</label>
              <input 
                required
                type="text" 
                value={requestForm.customer}
                onChange={(e) => setRequestForm({ ...requestForm, customer: e.target.value })}
                className="w-full text-xs p-2.5 border border-slate-200 dark:border-slate-700 bg-transparent dark:bg-slate-800/50 rounded-xl focus:outline-none focus:border-primary text-slate-800 dark:text-slate-100"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1.5">Contact Phone</label>
                <input 
                  required
                  type="text" 
                  value={requestForm.contact}
                  onChange={(e) => setRequestForm({ ...requestForm, contact: e.target.value })}
                  className="w-full text-xs p-2.5 border border-slate-200 dark:border-slate-700 bg-transparent dark:bg-slate-800/50 rounded-xl focus:outline-none focus:border-primary text-slate-800 dark:text-slate-100"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1.5">Priority</label>
                <select 
                  value={requestForm.priority}
                  onChange={(e) => setRequestForm({ ...requestForm, priority: e.target.value })}
                  className="w-full text-xs p-2.5 border border-slate-200 dark:border-slate-700 bg-transparent dark:bg-slate-800 rounded-xl focus:outline-none focus:border-primary text-slate-800 dark:text-slate-100"
                >
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1.5">Service Type</label>
                <input 
                  required
                  type="text" 
                  value={requestForm.type}
                  onChange={(e) => setRequestForm({ ...requestForm, type: e.target.value })}
                  className="w-full text-xs p-2.5 border border-slate-200 dark:border-slate-700 bg-transparent dark:bg-slate-800/50 rounded-xl focus:outline-none focus:border-primary text-slate-800 dark:text-slate-100"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1.5">Assign Service Engineer</label>
                <select 
                  value={requestForm.assignedTech}
                  onChange={(e) => setRequestForm({ ...requestForm, assignedTech: e.target.value })}
                  className="w-full text-xs p-2.5 border border-slate-200 dark:border-slate-700 bg-transparent dark:bg-slate-800 rounded-xl focus:outline-none focus:border-primary text-slate-800 dark:text-slate-100"
                >
                  <option value="Unassigned">Unassigned</option>
                  {technicians.map(t => (
                    <option key={t.id} value={t.name}>{t.name}</option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1.5">Request Status</label>
              <select
                value={requestForm.status}
                onChange={(e) => setRequestForm({ ...requestForm, status: e.target.value })}
                className="w-full text-xs p-2.5 border border-slate-200 dark:border-slate-700 bg-transparent dark:bg-slate-800 rounded-xl focus:outline-none focus:border-primary text-slate-800 dark:text-slate-100"
              >
                <option value="Open">Open</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
              </select>
            </div>
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2">
              <button 
                type="button" 
                onClick={() => {
                  setEditModalOpen(false);
                  setEditingReq(null);
                }}
                className="py-2 px-4 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-semibold rounded-xl border border-slate-100 dark:border-slate-700 transition-colors"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-sm transition-colors"
              >
                Save Changes
              </button>
            </div>
          </form>
        )}
      </Modal>

    </div>
  );
}
