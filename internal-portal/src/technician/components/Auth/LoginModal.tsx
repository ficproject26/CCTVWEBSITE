import React, { useState } from 'react';
import { 
  Wrench, 
  Lock, 
  User, 
  ArrowRight, 
  ShieldCheck 
} from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onLoginSuccess: (email: string) => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onLoginSuccess }) => {
  const [email, setEmail] = useState('alex.vance@sktechnology.com');
  const [password, setPassword] = useState('••••••••••••');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      onLoginSuccess(email);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-zinc-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden border border-zinc-200 animate-fade-in">
        
        {/* Header */}
        <div className="p-6 bg-zinc-900 text-white text-center space-y-2">
          <div className="w-12 h-12 bg-white text-zinc-900 rounded-xl flex items-center justify-center mx-auto shadow-md">
            <Wrench className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold tracking-tight">SK Technology</h2>
          <p className="text-xs text-zinc-400 font-normal">Technician Field Management Portal v1.0</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 bg-white">
          <div>
            <label className="block text-xs font-semibold text-zinc-700 mb-1">Technician Email / ID</label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 bg-zinc-50 border border-zinc-300 rounded-lg text-xs font-medium text-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900"
              />
              <User className="w-4 h-4 text-zinc-400 absolute left-3 top-3" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-700 mb-1">Password</label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 bg-zinc-50 border border-zinc-300 rounded-lg text-xs font-medium text-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900"
              />
              <Lock className="w-4 h-4 text-zinc-400 absolute left-3 top-3" />
            </div>
          </div>

          <div className="p-3 bg-zinc-50 border border-zinc-200 rounded-lg flex items-center justify-between text-xs text-zinc-600">
            <div className="flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>JWT Multi-Factor Security Active</span>
            </div>
            <span className="font-mono text-[10px] text-zinc-400">256-bit</span>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-xs rounded-xl flex items-center justify-center space-x-2 transition-colors shadow-md mt-2"
          >
            <span>{isSubmitting ? 'Authenticating Technician...' : 'Sign In to Technician Portal'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
