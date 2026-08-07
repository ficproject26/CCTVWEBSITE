import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addCustomer, editCustomer } from '../../redux/dashboardSlice';
import { FiSearch, FiMail, FiPhone, FiMapPin, FiGrid, FiList, FiPlus, FiLayers, FiInfo } from 'react-icons/fi';
import Modal from '../../components/Modal';

export default function Customers() {
  const dispatch = useDispatch();
  const customers = useSelector(state => state.dashboard.customers);

  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);

  const [customerForm, setCustomerForm] = useState({
    name: '',
    email: '',
    phone: '',
    location: 'Anna Nagar, Chennai'
  });

  const filteredCustomers = customers.filter(cust => {
    return cust.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
           cust.phone.includes(searchTerm) ||
           cust.email.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const getThemeClass = (index) => {
    const themes = [
      {
        border: 'border-l-4 border-l-blue-500',
        badge: 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
        billing: 'text-blue-600 dark:text-blue-400'
      },
      {
        border: 'border-l-4 border-l-emerald-500',
        badge: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400',
        billing: 'text-emerald-600 dark:text-emerald-400'
      },
      {
        border: 'border-l-4 border-l-amber-500',
        badge: 'bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400',
        billing: 'text-amber-600 dark:text-amber-400'
      },
      {
        border: 'border-l-4 border-l-purple-500',
        badge: 'bg-purple-50 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400',
        billing: 'text-purple-600 dark:text-purple-400'
      },
      {
        border: 'border-l-4 border-l-teal-500',
        badge: 'bg-teal-50 text-teal-600 dark:bg-teal-900/30 dark:text-teal-400',
        billing: 'text-teal-600 dark:text-teal-400'
      },
      {
        border: 'border-l-4 border-l-red-500',
        badge: 'bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400',
        billing: 'text-red-600 dark:text-red-400'
      }
    ];
    return themes[index % themes.length];
  };

  const handleAddCustomerSubmit = (e) => {
    e.preventDefault();
    dispatch(addCustomer(customerForm));
    setCustomerForm({
      name: '',
      email: '',
      phone: '',
      location: 'Anna Nagar, Chennai'
    });
    setModalOpen(false);
  };

  return (
    <div className="space-y-6">
      
      {/* Search Bar, Location Tabs & Switcher Row */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col xl:flex-row gap-4 justify-between items-center transition-colors">
        
        {/* Search */}
        <div className="relative w-full xl:max-w-xs">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
            <FiSearch size={15} />
          </span>
          <input
            type="text"
            placeholder="Search customers by name, phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full text-xs pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200/50 dark:border-slate-800 rounded-xl focus:outline-none focus:border-primary text-slate-800 dark:text-slate-100"
          />
        </div>

        {/* Right Side Controls (View Switcher & Onboard Customer Button) */}
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-slate-50 dark:bg-slate-800 p-1 rounded-xl border border-slate-200/40 dark:border-slate-700/50">
            <button 
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-white dark:bg-slate-700 text-blue-650 shadow-xs' : 'text-slate-400 hover:text-slate-600'}`}
              title="Card Grid View"
            >
              <FiGrid size={15} />
            </button>
            <button 
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-white dark:bg-slate-700 text-blue-650 shadow-xs' : 'text-slate-400 hover:text-slate-600'}`}
              title="Table List View"
            >
              <FiList size={15} />
            </button>
          </div>

          <button 
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-primary hover:bg-primary-dark text-white rounded-xl text-xs font-semibold shadow-sm transition-colors"
          >
            <FiPlus /> Add Customer
          </button>
        </div>

      </div>

      {/* Main Customers content */}
      {viewMode === 'grid' ? (
        /* Customers Card Grid View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredCustomers.length === 0 ? (
            <div className="col-span-full py-12 text-center text-slate-450 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800">
              No customers found matching that query.
            </div>
          ) : (
            filteredCustomers.map((cust, idx) => {
              const theme = getThemeClass(idx);
              return (
                <div 
                  key={cust.id || idx} 
                  className={`bg-white dark:bg-slate-900 rounded-2xl border-y border-r border-t-slate-100 border-b-slate-100 border-r-slate-100 dark:border-t-slate-800 dark:border-b-slate-800 dark:border-r-slate-800 shadow-sm p-4 flex flex-col justify-between hover:shadow-md transition-all group ${theme.border}`}
                >
                  <div>
                    <div className="flex items-start justify-between gap-3">
                      <div className="text-left min-w-0 flex-1">
                        <h4 className="ty-card-title truncate text-sm font-extrabold" title={cust.name}>{cust.name}</h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2 leading-relaxed flex items-start gap-1">
                          <FiMapPin size={12} className="shrink-0 mt-0.5 text-red-500" />
                          <span>{cust.location || 'Anna Nagar, Chennai'}</span>
                        </p>
                      </div>
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs uppercase shrink-0 shadow-2xs ${theme.badge}`}>
                        {cust.name.slice(0, 2)}
                      </div>
                    </div>

                    <div className="mt-3 space-y-1 border-t border-b border-slate-100 dark:border-slate-800/80 py-2 text-left">
                      <p className="text-xs text-slate-600 dark:text-slate-300 flex items-center gap-2 truncate">
                        <FiMail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">{cust.email}</span>
                      </p>
                      <p className="text-xs text-slate-600 dark:text-slate-300 flex items-center gap-2">
                        <FiPhone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{cust.phone}</span>
                      </p>
                    </div>
                  </div>

                  <div className="mt-3 flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-2.5">
                    <div className="text-left">
                      <span className="text-[10px] text-slate-400 font-semibold block uppercase tracking-wider">CCTV Orders</span>
                      <span className="text-xs font-extrabold text-slate-900 dark:text-white font-mono">{cust.installationsCount || 0} Orders</span>
                    </div>

                    <div className="text-right flex items-center gap-2">
                      <div>
                        <span className="text-[10px] text-slate-400 font-semibold block uppercase tracking-wider">Total Billing</span>
                        <span className={`text-xs sm:text-sm font-black font-mono ${theme.billing}`}>₹{(cust.totalSpent || 0).toLocaleString('en-IN')}</span>
                      </div>

                      <button
                        onClick={() => {
                          setEditingCustomer(cust);
                          setCustomerForm({
                            name: cust.name,
                            email: cust.email,
                            phone: cust.phone,
                            location: cust.location
                          });
                          setEditModalOpen(true);
                        }}
                        className="px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300 text-xs font-bold rounded-lg transition-colors border border-blue-200 dark:border-blue-800/50 shrink-0 cursor-pointer ml-1"
                      >
                        Edit
                      </button>
                    </div>
                  </div>

                </div>
              );
            })
          )}
        </div>
      ) : (
        /* Customers Tabular List View (with Mobile Card Support) */
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm p-4 md:p-0 overflow-hidden transition-colors">
          
          {/* 📱 Mobile Customer List Cards (block md:hidden) */}
          <div className="block md:hidden space-y-3">
            {filteredCustomers.length === 0 ? (
              <div className="py-8 text-center text-slate-400 text-xs">
                No customers match your search parameters.
              </div>
            ) : (
              filteredCustomers.map((cust, idx) => (
                <div key={`mob-cust-${cust.id || idx}`} className="bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-3.5 space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-xs text-slate-900 dark:text-white">{cust.name}</h4>
                      <p className="text-[11px] text-slate-500 truncate">📍 {cust.location}</p>
                    </div>
                    <button
                      onClick={() => {
                        setEditingCustomer(cust);
                        setCustomerForm({
                          name: cust.name,
                          email: cust.email,
                          phone: cust.phone,
                          location: cust.location
                        });
                        setEditModalOpen(true);
                      }}
                      className="px-2.5 py-1 bg-blue-50 text-blue-600 dark:bg-blue-900/30 text-[10px] font-bold rounded-lg border border-blue-200"
                    >
                      Edit
                    </button>
                  </div>

                  <div className="text-[11px] text-slate-600 dark:text-slate-300 space-y-0.5 pt-1 border-t border-slate-200/60 dark:border-slate-700/60">
                    <p className="truncate">📞 {cust.phone} • ✉️ {cust.email}</p>
                    <div className="flex items-center justify-between font-mono font-bold pt-1">
                      <span className="text-slate-500">{cust.installationsCount || 0} Orders</span>
                      <span className="text-emerald-600">₹{(cust.totalSpent || 0).toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* 💻 Desktop Table View (hidden md:block) */}
          <div className="hidden md:block overflow-x-auto min-w-full">
            {filteredCustomers.length === 0 ? (
              <div className="py-12 text-center text-slate-450 text-xs font-medium">
                <FiInfo size={36} className="mx-auto mb-2 opacity-50" />
                <p className="text-xs">No customers match your search parameters.</p>
              </div>
            ) : (
              <table className="w-full text-left border-collapse min-w-[850px]">
                <thead>
                  <tr className="bg-slate-50/80 dark:bg-slate-800/50 border-b border-slate-200/80 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider text-[11px]">
                    <th className="py-3.5 px-4 whitespace-nowrap w-28">Customer ID</th>
                    <th className="py-3.5 px-4 min-w-[200px] whitespace-nowrap">Customer Name</th>
                    <th className="py-3.5 px-4 min-w-[240px] whitespace-nowrap">Contact Details</th>
                    <th className="py-3.5 px-4 whitespace-nowrap w-48">Location Area</th>
                    <th className="py-3.5 px-4 text-center whitespace-nowrap w-32">Orders</th>
                    <th className="py-3.5 px-4 text-right whitespace-nowrap w-40">Total Billing</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-800 dark:text-slate-200 text-xs">
                  {filteredCustomers.map((cust, idx) => (
                    <tr 
                      key={cust.id || idx} 
                      onClick={() => {
                        setEditingCustomer(cust);
                        setCustomerForm({
                          name: cust.name,
                          email: cust.email,
                          phone: cust.phone,
                          location: cust.location
                        });
                        setEditModalOpen(true);
                      }}
                      className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors cursor-pointer group"
                    >
                      <td className="py-4 px-4 align-middle font-mono font-bold text-slate-500 whitespace-nowrap">{cust.id || `CUST-0${idx + 1}`}</td>
                      <td className="py-4 px-4 align-middle">
                        <span className="font-bold text-slate-900 dark:text-slate-100 text-xs block leading-tight group-hover:text-primary transition-colors whitespace-nowrap">{cust.name}</span>
                      </td>
                      <td className="py-4 px-4 align-middle whitespace-nowrap">
                        <div className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">{cust.email}</div>
                        <div className="text-[11px] text-slate-400 font-medium mt-0.5 font-sans whitespace-nowrap">{cust.phone}</div>
                      </td>
                      <td className="py-4 px-4 align-middle font-semibold text-slate-700 dark:text-slate-300 whitespace-nowrap">{cust.location}</td>
                      <td className="py-4 px-4 align-middle text-center font-bold text-slate-700 dark:text-slate-300 whitespace-nowrap">
                        <span className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-xs font-bold">
                          {cust.installationsCount || 0} orders
                        </span>
                      </td>
                      <td className="py-4 px-4 align-middle text-right font-bold text-slate-900 dark:text-white whitespace-nowrap">
                        ₹{(cust.totalSpent || 0).toLocaleString('en-IN')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {/* Add New Customer Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Register New Customer">
        <form onSubmit={handleAddCustomerSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1.5">Full Name</label>
            <input 
              required
              type="text" 
              placeholder="e.g. Ramesh Kumar" 
              value={customerForm.name}
              onChange={(e) => setCustomerForm({ ...customerForm, name: e.target.value })}
              className="w-full text-xs p-2.5 border border-slate-200 dark:border-slate-700 bg-transparent dark:bg-slate-800/50 rounded-xl focus:outline-none focus:border-primary text-slate-800 dark:text-slate-100"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1.5">Phone Number</label>
              <input 
                required
                type="text" 
                placeholder="+91 XXXXX XXXXX" 
                value={customerForm.phone}
                onChange={(e) => setCustomerForm({ ...customerForm, phone: e.target.value })}
                className="w-full text-xs p-2.5 border border-slate-200 dark:border-slate-700 bg-transparent dark:bg-slate-800/50 rounded-xl focus:outline-none focus:border-primary text-slate-800 dark:text-slate-100"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1.5">Email ID</label>
              <input 
                required
                type="email" 
                placeholder="customer@domain.com" 
                value={customerForm.email}
                onChange={(e) => setCustomerForm({ ...customerForm, email: e.target.value })}
                className="w-full text-xs p-2.5 border border-slate-200 dark:border-slate-700 bg-transparent dark:bg-slate-800/50 rounded-xl focus:outline-none focus:border-primary text-slate-800 dark:text-slate-100"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1.5">Location Area</label>
            <select 
              value={customerForm.location}
              onChange={(e) => setCustomerForm({ ...customerForm, location: e.target.value })}
              className="w-full text-xs p-2.5 border border-slate-200 dark:border-slate-700 bg-transparent dark:bg-slate-800 rounded-xl focus:outline-none focus:border-primary text-slate-800 dark:text-slate-100"
            >
              <option value="Anna Nagar, Chennai">Anna Nagar, Chennai</option>
              <option value="T. Nagar, Chennai">T. Nagar, Chennai</option>
              <option value="Velachery, Chennai">Velachery, Chennai</option>
              <option value="Porur, Chennai">Porur, Chennai</option>
              <option value="Adyar, Chennai">Adyar, Chennai</option>
              <option value="Mylapore, Chennai">Mylapore, Chennai</option>
            </select>
          </div>
          <div className="pt-2 flex justify-end gap-2.5">
            <button 
              type="button" 
              onClick={() => setModalOpen(false)}
              className="px-4 py-2 border border-slate-200 dark:border-slate-700 text-slate-500 text-xs font-semibold rounded-xl"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="px-4 py-2 bg-primary hover:bg-primary-dark text-white text-xs font-semibold rounded-xl transition-colors"
            >
              Onboard Customer
            </button>
          </div>
        </form>
      </Modal>

      {/* Edit Customer Modal */}
      <Modal isOpen={editModalOpen} onClose={() => setEditModalOpen(false)} title="Edit Customer Details">
        {editingCustomer && (
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              dispatch(editCustomer({
                id: editingCustomer.id,
                name: customerForm.name,
                email: customerForm.email,
                phone: customerForm.phone,
                location: customerForm.location
              }));
              setEditModalOpen(false);
              setEditingCustomer(null);
            }} 
            className="space-y-4 text-left"
          >
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1.5">Full Name</label>
              <input 
                required
                type="text" 
                value={customerForm.name}
                onChange={(e) => setCustomerForm({ ...customerForm, name: e.target.value })}
                className="w-full text-xs p-2.5 border border-slate-200 dark:border-slate-700 bg-transparent dark:bg-slate-800/50 rounded-xl focus:outline-none focus:border-primary text-slate-800 dark:text-slate-100"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1.5">Phone Number</label>
                <input 
                  required
                  type="text" 
                  value={customerForm.phone}
                  onChange={(e) => setCustomerForm({ ...customerForm, phone: e.target.value })}
                  className="w-full text-xs p-2.5 border border-slate-200 dark:border-slate-700 bg-transparent dark:bg-slate-800/50 rounded-xl focus:outline-none focus:border-primary text-slate-800 dark:text-slate-100"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1.5">Email ID</label>
                <input 
                  required
                  type="email" 
                  value={customerForm.email}
                  onChange={(e) => setCustomerForm({ ...customerForm, email: e.target.value })}
                  className="w-full text-xs p-2.5 border border-slate-200 dark:border-slate-700 bg-transparent dark:bg-slate-800/50 rounded-xl focus:outline-none focus:border-primary text-slate-800 dark:text-slate-100"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1.5">Location Area</label>
              <select 
                value={customerForm.location}
                onChange={(e) => setCustomerForm({ ...customerForm, location: e.target.value })}
                className="w-full text-xs p-2.5 border border-slate-200 dark:border-slate-700 bg-transparent dark:bg-slate-800 rounded-xl focus:outline-none focus:border-primary text-slate-800 dark:text-slate-100"
              >
                <option value="Anna Nagar, Chennai">Anna Nagar, Chennai</option>
                <option value="T. Nagar, Chennai">T. Nagar, Chennai</option>
                <option value="Velachery, Chennai">Velachery, Chennai</option>
                <option value="Porur, Chennai">Porur, Chennai</option>
                <option value="Adyar, Chennai">Adyar, Chennai</option>
                <option value="Mylapore, Chennai">Mylapore, Chennai</option>
              </select>
            </div>
            <div className="pt-2 flex justify-end gap-2.5">
              <button 
                type="button" 
                onClick={() => {
                  setEditModalOpen(false);
                  setEditingCustomer(null);
                }}
                className="px-4 py-2 border border-slate-200 dark:border-slate-700 text-slate-500 text-xs font-semibold rounded-xl"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="px-4 py-2 bg-primary hover:bg-primary-dark text-white text-xs font-semibold rounded-xl transition-colors"
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
