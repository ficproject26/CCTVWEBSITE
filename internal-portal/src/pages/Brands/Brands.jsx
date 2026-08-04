import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  FiPlus, 
  FiSearch, 
  FiEdit3, 
  FiTrash2, 
  FiGlobe, 
  FiMail, 
  FiCheckCircle, 
  FiXCircle, 
  FiInfo, 
  FiUploadCloud,
  FiFileText
} from 'react-icons/fi';
import Modal from '../../components/Modal';
import { 
  addBrand, 
  deleteBrand, 
  editBrand, 
  toggleBrandStatus 
} from '../../redux/dashboardSlice';

export default function Brands() {
  const dispatch = useDispatch();
  const brands = useSelector(state => state.dashboard.brands) || [];

  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const [brandForm, setBrandForm] = useState({
    name: '',
    logoUrl: '',
    country: '',
    status: 'Active',
    supportContact: '',
    description: ''
  });

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setBrandForm(prev => ({ ...prev, logoUrl: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddBrand = (e) => {
    e.preventDefault();
    dispatch(addBrand({
      ...brandForm,
      logoUrl: brandForm.logoUrl || 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?q=80&w=300&auto=format&fit=crop'
    }));
    setBrandForm({
      name: '',
      logoUrl: '',
      country: '',
      status: 'Active',
      supportContact: '',
      description: ''
    });
    setModalOpen(false);
  };

  const handleEditBrand = (e) => {
    e.preventDefault();
    if (!editingBrand) return;
    dispatch(editBrand({
      id: editingBrand.id,
      ...brandForm
    }));
    setEditModalOpen(false);
    setEditingBrand(null);
    setBrandForm({
      name: '',
      logoUrl: '',
      country: '',
      status: 'Active',
      supportContact: '',
      description: ''
    });
  };

  const openEditModal = (brand) => {
    setEditingBrand(brand);
    setBrandForm({
      name: brand.name,
      logoUrl: brand.logoUrl,
      country: brand.country,
      status: brand.status,
      supportContact: brand.supportContact,
      description: brand.description
    });
    setEditModalOpen(true);
  };

  const filteredBrands = brands.filter(b => {
    const matchesSearch = b.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          b.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          b.country.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || b.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header and Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 sm:p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-xs">
        <div className="text-left">
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 tracking-tight">CCTV Brands Management</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Manage official partners, manufacturer origins, logos, and support contacts.</p>
        </div>
        <button 
          onClick={() => {
            setBrandForm({
              name: '',
              logoUrl: '',
              country: '',
              status: 'Active',
              supportContact: '',
              description: ''
            });
            setModalOpen(true);
          }}
          className="flex items-center justify-center gap-1.5 px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-xl text-xs font-semibold shadow-sm transition-colors sm:ml-auto flex-shrink-0"
        >
          <FiPlus /> Add CCTV Brand
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:max-w-xs">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
          <input 
            type="text" 
            placeholder="Search brands by name, country..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full text-xs pl-9 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:border-primary text-slate-800 dark:text-slate-100 shadow-xs"
          />
        </div>

        <div className="flex gap-2 w-full md:w-auto justify-end">
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:border-primary text-slate-700 dark:text-slate-200 shadow-xs"
          >
            <option value="All">All Statuses</option>
            <option value="Active">Active Partners</option>
            <option value="Inactive">Inactive Partners</option>
          </select>
        </div>
      </div>

      {/* Brands Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredBrands.length === 0 ? (
          <div className="col-span-full py-16 text-center text-slate-400 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-xs">
            <FiInfo className="mx-auto mb-2 opacity-40" size={32} />
            <p className="text-xs">No brands found matching your selection.</p>
          </div>
        ) : (
          filteredBrands.map((brand) => (
            <div 
              key={brand.id} 
              className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-5 shadow-xs flex flex-col justify-between hover:shadow-md hover:border-slate-200 dark:hover:border-slate-700 transition-all duration-300 relative group"
            >
              <div>
                {/* Brand Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="w-14 h-14 bg-slate-50 dark:bg-slate-800 rounded-xl flex items-center justify-center p-1.5 overflow-hidden border border-slate-100 dark:border-slate-750">
                    <img 
                      src={brand.logoUrl} 
                      alt={brand.name} 
                      className="w-full h-full object-contain rounded-lg"
                    />
                  </div>
                  <button 
                    onClick={() => dispatch(toggleBrandStatus(brand.id))}
                    className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                      brand.status === 'Active' 
                        ? 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-450 border border-emerald-100 dark:border-emerald-900/30' 
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-500 border border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    {brand.status}
                  </button>
                </div>

                {/* Brand Info */}
                <div className="mt-4 text-left">
                  <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm tracking-tight">{brand.name}</h3>
                  <div className="flex items-center gap-1 mt-1 text-[10px] text-slate-400 font-bold uppercase">
                    <FiGlobe size={11} className="text-slate-400" />
                    <span>{brand.country || 'Global'}</span>
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-2.5 leading-relaxed line-clamp-3">{brand.description}</p>
                </div>
              </div>

              {/* Support Contact and Actions */}
              <div className="mt-4 pt-3.5 border-t border-slate-50 dark:border-slate-855 flex flex-col gap-3">
                <div className="flex items-center gap-2 text-[10px] text-slate-500 dark:text-slate-400 font-semibold">
                  <FiMail className="text-slate-400 flex-shrink-0" size={12} />
                  <span className="truncate">{brand.supportContact || 'No support email'}</span>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => openEditModal(brand)}
                    className="flex-1 py-1.5 bg-blue-55 hover:bg-blue-100 text-blue-600 dark:bg-blue-900/10 dark:hover:bg-blue-900/20 dark:text-blue-400 text-[11px] font-bold rounded-xl transition-colors border border-blue-50 dark:border-blue-900/20 flex items-center justify-center gap-1"
                  >
                    <FiEdit3 size={11} /> Edit
                  </button>
                  <button 
                    onClick={() => dispatch(deleteBrand(brand.id))}
                    className="p-1.5 rounded-xl border border-red-100 dark:border-red-900/20 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
                    title="Remove brand"
                  >
                    <FiTrash2 size={13} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal Add Brand */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Add CCTV Brand Partnership">
        <form onSubmit={handleAddBrand} className="space-y-4 text-left">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1.5">Brand Name</label>
              <input 
                required
                type="text" 
                placeholder="e.g. Hikvision" 
                value={brandForm.name}
                onChange={(e) => setBrandForm({ ...brandForm, name: e.target.value })}
                className="w-full text-xs p-2.5 border border-slate-200 dark:border-slate-700 bg-transparent dark:bg-slate-800/50 rounded-xl focus:outline-none focus:border-primary text-slate-800 dark:text-slate-100"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1.5">Origin Country</label>
              <input 
                required
                type="text" 
                placeholder="e.g. India, Japan" 
                value={brandForm.country}
                onChange={(e) => setBrandForm({ ...brandForm, country: e.target.value })}
                className="w-full text-xs p-2.5 border border-slate-200 dark:border-slate-700 bg-transparent dark:bg-slate-800/50 rounded-xl focus:outline-none focus:border-primary text-slate-800 dark:text-slate-100"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1.5">Support Email</label>
              <input 
                type="email" 
                placeholder="support@brand.com" 
                value={brandForm.supportContact}
                onChange={(e) => setBrandForm({ ...brandForm, supportContact: e.target.value })}
                className="w-full text-xs p-2.5 border border-slate-200 dark:border-slate-700 bg-transparent dark:bg-slate-800/50 rounded-xl focus:outline-none focus:border-primary text-slate-800 dark:text-slate-100"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1.5">Status</label>
              <select 
                value={brandForm.status}
                onChange={(e) => setBrandForm({ ...brandForm, status: e.target.value })}
                className="w-full text-xs p-2.5 border border-slate-200 dark:border-slate-700 bg-transparent dark:bg-slate-850 rounded-xl focus:outline-none focus:border-primary text-slate-850 dark:text-slate-100"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1.5">Brand Logo</label>
            <div className="flex items-center gap-3">
              <label className="flex-1 flex flex-col items-center justify-center p-3 border border-dashed border-slate-200 dark:border-slate-700 rounded-xl cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                <FiUploadCloud className="text-slate-400 mb-1" size={16} />
                <span className="text-[10px] font-semibold text-slate-500">Upload brand logo</span>
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleLogoUpload}
                  className="hidden" 
                />
              </label>
              {brandForm.logoUrl && (
                <div className="w-14 h-14 bg-slate-50 dark:bg-slate-800 border rounded-xl flex items-center justify-center p-1 relative overflow-hidden flex-shrink-0">
                  <img src={brandForm.logoUrl} alt="preview" className="w-full h-full object-contain rounded" />
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1.5">Brand Description</label>
            <textarea 
              rows={3}
              placeholder="Enter brief description or details..." 
              value={brandForm.description}
              onChange={(e) => setBrandForm({ ...brandForm, description: e.target.value })}
              className="w-full text-xs p-2.5 border border-slate-200 dark:border-slate-700 bg-transparent dark:bg-slate-800/50 rounded-xl focus:outline-none focus:border-primary text-slate-800 dark:text-slate-100"
            />
          </div>

          <div className="flex gap-3 justify-end pt-2">
            <button 
              type="button" 
              onClick={() => setModalOpen(false)}
              className="px-4 py-2 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-xl text-xs font-semibold shadow-sm transition-colors"
            >
              Save Brand
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal Edit Brand */}
      <Modal isOpen={editModalOpen} onClose={() => setEditModalOpen(false)} title="Edit Brand Details">
        <form onSubmit={handleEditBrand} className="space-y-4 text-left">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1.5">Brand Name</label>
              <input 
                required
                type="text" 
                value={brandForm.name}
                onChange={(e) => setBrandForm({ ...brandForm, name: e.target.value })}
                className="w-full text-xs p-2.5 border border-slate-200 dark:border-slate-700 bg-transparent dark:bg-slate-800/50 rounded-xl focus:outline-none focus:border-primary text-slate-800 dark:text-slate-100"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1.5">Origin Country</label>
              <input 
                required
                type="text" 
                value={brandForm.country}
                onChange={(e) => setBrandForm({ ...brandForm, country: e.target.value })}
                className="w-full text-xs p-2.5 border border-slate-200 dark:border-slate-700 bg-transparent dark:bg-slate-800/50 rounded-xl focus:outline-none focus:border-primary text-slate-800 dark:text-slate-100"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1.5">Support Email</label>
              <input 
                type="email" 
                value={brandForm.supportContact}
                onChange={(e) => setBrandForm({ ...brandForm, supportContact: e.target.value })}
                className="w-full text-xs p-2.5 border border-slate-200 dark:border-slate-700 bg-transparent dark:bg-slate-800/50 rounded-xl focus:outline-none focus:border-primary text-slate-800 dark:text-slate-100"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1.5">Status</label>
              <select 
                value={brandForm.status}
                onChange={(e) => setBrandForm({ ...brandForm, status: e.target.value })}
                className="w-full text-xs p-2.5 border border-slate-200 dark:border-slate-700 bg-transparent dark:bg-slate-855 rounded-xl focus:outline-none focus:border-primary text-slate-850 dark:text-slate-100"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1.5">Brand Logo</label>
            <div className="flex items-center gap-3">
              <label className="flex-1 flex flex-col items-center justify-center p-3 border border-dashed border-slate-200 dark:border-slate-700 rounded-xl cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                <FiUploadCloud className="text-slate-400 mb-1" size={16} />
                <span className="text-[10px] font-semibold text-slate-500">Upload new logo</span>
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleLogoUpload}
                  className="hidden" 
                />
              </label>
              {brandForm.logoUrl && (
                <div className="w-14 h-14 bg-slate-50 dark:bg-slate-800 border rounded-xl flex items-center justify-center p-1 relative overflow-hidden flex-shrink-0">
                  <img src={brandForm.logoUrl} alt="preview" className="w-full h-full object-contain rounded" />
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1.5">Brand Description</label>
            <textarea 
              rows={3}
              value={brandForm.description}
              onChange={(e) => setBrandForm({ ...brandForm, description: e.target.value })}
              className="w-full text-xs p-2.5 border border-slate-200 dark:border-slate-700 bg-transparent dark:bg-slate-800/50 rounded-xl focus:outline-none focus:border-primary text-slate-800 dark:text-slate-100"
            />
          </div>

          <div className="flex gap-3 justify-end pt-2">
            <button 
              type="button" 
              onClick={() => setEditModalOpen(false)}
              className="px-4 py-2 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-xl text-xs font-semibold shadow-sm transition-colors"
            >
              Save Changes
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
