import React, { useState } from 'react';
import { 
  Settings, 
  Wifi, 
  Database, 
  RefreshCw 
} from 'lucide-react';

interface SettingsModuleProps {
  onSyncError?: (title: string, message: string) => void;
  autoSync: boolean;
  onAutoSyncChange: (val: boolean) => void;
}

export const SettingsModule: React.FC<SettingsModuleProps> = ({ 
  onSyncError,
  autoSync,
  onAutoSyncChange
}) => {
  const [highResUpload, setHighResUpload] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncDone, setSyncDone] = useState(false);

  const handleManualSync = () => {
    setIsSyncing(true);
    setSyncDone(false);
    setTimeout(() => {
      setIsSyncing(false);
      if (!navigator.onLine) {
        if (onSyncError) {
          onSyncError('Sync Failed', 'Network connection offline. Local data queued for re-transmission.');
        }
      } else {
        setSyncDone(true);
        setTimeout(() => setSyncDone(false), 3000);
      }
    }, 1200);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="bg-white border border-zinc-200 rounded-xl p-6 space-y-6 shadow-xs">
        <div className="pb-4 border-b border-zinc-100">
          <h2 className="text-base font-semibold text-zinc-900 flex items-center space-x-2">
            <Settings className="w-5 h-5 text-zinc-800" />
            <span>Portal & Field Sync Settings</span>
          </h2>
          <p className="text-xs text-zinc-500 mt-0.5">
            Manage data synchronization, camera photo compression, and offline storage parameters.
          </p>
        </div>

        {/* Offline & Data Sync Section */}
        <div className="space-y-4">
          <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
            Field Offline Engine & Sync
          </h3>

          <div className="p-4 bg-zinc-50 border border-zinc-200 rounded-xl flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Database className="w-5 h-5 text-zinc-700" />
              <div>
                <p className="text-xs font-semibold text-zinc-900">Background Automatic Sync</p>
                <p className="text-[11px] text-zinc-500">Automatically sync pending reports when network connection is re-established.</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={autoSync}
                onChange={(e) => onAutoSyncChange(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-zinc-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-zinc-900"></div>
            </label>
          </div>

          <div className="p-4 bg-zinc-50 border border-zinc-200 rounded-xl flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Wifi className="w-5 h-5 text-zinc-700" />
              <div>
                <p className="text-xs font-semibold text-zinc-900">High-Resolution Inspection Photos</p>
                <p className="text-[11px] text-zinc-500">Upload original resolution evidence files when connected to Wi-Fi/5G.</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={highResUpload}
                onChange={(e) => setHighResUpload(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-zinc-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-zinc-900"></div>
            </label>
          </div>

          {/* Manual Sync Trigger Button */}
          <div className="pt-2 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-zinc-900">Force Local Storage Sync</p>
              <p className="text-[11px] text-zinc-500">Push all cached site photos and offline reports to central database.</p>
            </div>
            <button
              onClick={handleManualSync}
              disabled={isSyncing}
              className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-semibold rounded-lg flex items-center space-x-2 transition-colors shadow-xs"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>{isSyncing ? 'Syncing...' : syncDone ? 'Data Synced!' : 'Sync Now'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
