import React from 'react';
import { AlertCircle, AlertTriangle, WifiOff, X, RefreshCw } from 'lucide-react';

export interface GlobalErrorState {
  id: string;
  type: 'SYNC' | 'JOB_ACTION' | 'NETWORK' | 'FETCH';
  title: string;
  message: string;
  onRetry?: () => void;
}

interface ErrorBannerProps {
  error: GlobalErrorState | null;
  onDismiss: () => void;
}

export const ErrorBanner: React.FC<ErrorBannerProps> = ({ error, onDismiss }) => {
  if (!error) return null;

  const isNetwork = error.type === 'NETWORK';
  const isSync = error.type === 'SYNC';

  return (
    <div className="fixed top-4 right-4 left-4 sm:left-auto sm:max-w-md z-50 animate-in fade-in slide-in-from-top-4 duration-300">
      <div className={`p-4 rounded-2xl border shadow-xl flex items-start justify-between gap-3 text-xs font-sans backdrop-blur-md ${
        isNetwork 
          ? 'bg-amber-950/95 text-amber-100 border-amber-800' 
          : isSync
          ? 'bg-zinc-900 text-white border-zinc-700'
          : 'bg-red-950/95 text-red-100 border-red-800'
      }`}>
        <div className="flex items-start space-x-3">
          <div className={`p-2 rounded-xl flex-shrink-0 ${
            isNetwork ? 'bg-amber-900/80 text-amber-300' : isSync ? 'bg-zinc-800 text-sky-400' : 'bg-red-900/80 text-red-300'
          }`}>
            {isNetwork && <WifiOff className="w-4 h-4 animate-pulse" />}
            {isSync && <AlertTriangle className="w-4 h-4" />}
            {!isNetwork && !isSync && <AlertCircle className="w-4 h-4" />}
          </div>

          <div className="space-y-1">
            <h4 className="font-bold tracking-tight text-sm flex items-center space-x-2">
              <span>{error.title}</span>
            </h4>
            <p className="opacity-90 leading-relaxed font-normal">{error.message}</p>

            {error.onRetry && (
              <button
                onClick={() => {
                  error.onRetry?.();
                  onDismiss();
                }}
                className="mt-2 px-3 py-1 bg-white/10 hover:bg-white/20 text-white font-bold rounded-lg flex items-center space-x-1.5 transition-colors cursor-pointer text-[11px]"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Retry Action</span>
              </button>
            )}
          </div>
        </div>

        <button
          onClick={onDismiss}
          className="p-1 rounded-lg hover:bg-white/10 opacity-70 hover:opacity-100 transition-all cursor-pointer"
          title="Dismiss Error"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
