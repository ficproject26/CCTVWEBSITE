import React, { useState, useRef, useEffect } from 'react';
import { Search, Bell, ShieldCheck, Menu, AlertTriangle, Briefcase, ChevronRight } from 'lucide-react';
import type { TechnicianProfile, NotificationItem } from '../types/job';

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  currentTechnician: TechnicianProfile | null;
  onToggleSidebar?: () => void;
  notifications?: NotificationItem[];
  onMarkRead?: (id: string) => void;
  onNavigateToNotifications?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  searchQuery, 
  onSearchChange,
  currentTechnician,
  onToggleSidebar,
  notifications = [],
  onMarkRead,
  onNavigateToNotifications
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter(n => !n.read).length;
  const recentNotifications = notifications.slice(0, 5);

  const initials = currentTechnician?.name
    ? currentTechnician.name.split(' ').map((n) => n[0]).join('').toUpperCase()
    : 'AV';

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="h-24 py-4 border-b border-zinc-200 bg-white px-6 sm:px-8 flex items-center justify-between sticky top-0 z-30 shadow-2xs">
      {/* Mobile Menu Hamburger Button */}
      <div className="flex items-center space-x-4 flex-1 max-w-lg">
        {onToggleSidebar && (
          <button
            onClick={onToggleSidebar}
            className="lg:hidden p-2.5 rounded-xl text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 transition-colors cursor-pointer"
            title="Open Navigation Menu"
          >
            <Menu className="w-6 h-6" />
          </button>
        )}

        {/* Quick Search */}
        <div className="relative w-full">
          <Search className="w-4.5 h-4.5 absolute left-3.5 top-1/2 transform -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            placeholder="Search job code, customer name..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-900 focus:border-zinc-900 transition-all shadow-2xs"
          />
        </div>
      </div>

      {/* Right Action Tools */}
      <div className="flex items-center space-x-3 sm:space-x-5 pl-2">
        {/* Verification Status Pill */}
        <div className="hidden sm:flex items-center space-x-2 px-3 py-1.5 bg-emerald-50/80 border border-emerald-200/80 rounded-full text-xs font-semibold text-emerald-800 shadow-2xs">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>SK Certified Field Tech</span>
        </div>

        {/* Notifications Bell with Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="relative p-2 rounded-xl text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 transition-all cursor-pointer"
            title="Notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-red-500 text-white font-mono text-[10px] font-black rounded-full flex items-center justify-center shadow-xs border-2 border-white animate-pulse">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Dropdown Panel */}
          {isOpen && (
            <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-white border border-zinc-200 rounded-2xl shadow-xl z-50 overflow-hidden text-zinc-900">
              <div className="p-3.5 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/80">
                <div className="flex items-center space-x-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-900">Real-Time Alerts</h3>
                  {unreadCount > 0 && (
                    <span className="px-2 py-0.5 bg-zinc-900 text-white text-[10px] font-mono font-bold rounded-full">
                      {unreadCount} New
                    </span>
                  )}
                </div>
                {onNavigateToNotifications && (
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      onNavigateToNotifications();
                    }}
                    className="text-[11px] text-sky-600 hover:text-sky-700 font-semibold flex items-center space-x-0.5 cursor-pointer"
                  >
                    <span>View All</span>
                    <ChevronRight className="w-3 h-3" />
                  </button>
                )}
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-zinc-100">
                {recentNotifications.length === 0 ? (
                  <div className="p-6 text-center text-zinc-400 text-xs">
                    No recent notifications
                  </div>
                ) : (
                  recentNotifications.map((notif) => (
                    <div
                      key={notif.id}
                      onClick={() => {
                        if (onMarkRead && !notif.read) onMarkRead(notif.id);
                      }}
                      className={`p-3.5 hover:bg-zinc-50 transition-colors cursor-pointer flex items-start space-x-3 ${
                        !notif.read ? 'bg-amber-50/40' : ''
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-white text-xs ${
                        notif.type === 'URGENT' ? 'bg-red-500' : notif.type === 'ASSIGNMENT' ? 'bg-zinc-900' : 'bg-emerald-500'
                      }`}>
                        {notif.type === 'URGENT' && <AlertTriangle className="w-4 h-4" />}
                        {notif.type === 'ASSIGNMENT' && <Briefcase className="w-4 h-4" />}
                        {notif.type === 'SYSTEM' && <ShieldCheck className="w-4 h-4" />}
                      </div>

                      <div className="flex-1 space-y-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs font-bold text-zinc-900 truncate">{notif.title}</h4>
                          <span className="text-[10px] text-zinc-400 font-mono flex-shrink-0">{notif.timestamp}</span>
                        </div>
                        <p className="text-[11px] text-zinc-600 line-clamp-2 leading-snug">{notif.message}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Avatar */}
        <div className="flex items-center space-x-3 pl-4 border-l border-zinc-200">
          <div className="w-10 h-10 rounded-xl bg-zinc-900 text-white flex items-center justify-center font-extrabold text-xs shadow-xs border border-zinc-800">
            {initials}
          </div>
          <span className="text-sm font-bold text-zinc-900 hidden md:inline pr-1">
            {currentTechnician?.name || 'Alex Vance'}
          </span>
        </div>
      </div>
    </header>
  );
};
