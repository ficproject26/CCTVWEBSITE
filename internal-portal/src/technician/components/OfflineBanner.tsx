import React from 'react';
import { WifiOff, RefreshCw } from 'lucide-react';

interface OfflineBannerProps {
  isOnline: boolean;
  queuedCount: number;
  isAutoSyncing: boolean;
}

export const OfflineBanner: React.FC<OfflineBannerProps> = ({
  isOnline,
  queuedCount,
  isAutoSyncing,
}) => {
  if (isOnline && !isAutoSyncing) return null;

  return (
    <div className={`w-full py-2.5 px-4 text-xs font-semibold text-white flex items-center justify-center space-x-2 transition-all duration-300 shadow-xs z-30 ${
      !isOnline ? 'bg-amber-600' : 'bg-emerald-600'
    }`}>
      {!isOnline ? (
        <>
          <WifiOff className="w-4 h-4 animate-pulse text-amber-200" />
          <span>You're offline — {queuedCount} report{queuedCount === 1 ? '' : 's'} queued for sync.</span>
        </>
      ) : (
        <>
          <RefreshCw className="w-4 h-4 animate-spin text-emerald-200" />
          <span>Back online — Auto-syncing {queuedCount} pending field report{queuedCount === 1 ? '' : 's'}...</span>
        </>
      )}
    </div>
  );
};
