import React from 'react';
import type { TechnicianProfile } from '../../types/job';
import { 
  Award, 
  Truck, 
  CheckCircle2, 
  Star 
} from 'lucide-react';

interface ProfileModuleProps {
  profile: TechnicianProfile;
  onUpdateStatus?: (status: 'ON_DUTY' | 'OFF_DUTY' | 'ON_JOB') => Promise<void>;
}

export const ProfileModule: React.FC<ProfileModuleProps> = ({
  profile,
}) => {

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Profile Header Card */}
      <div className="bg-white border border-zinc-200 rounded-xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center space-x-4">
          <img
            src={profile.avatarUrl}
            alt={profile.name}
            className="w-16 h-16 rounded-full object-cover border-2 border-zinc-900"
          />
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-lg font-bold text-zinc-900">{profile.name}</h2>
              <span className="text-xs font-mono font-bold bg-zinc-100 text-zinc-800 px-2 py-0.5 rounded">
                {profile.badgeNumber}
              </span>
            </div>
            <p className="text-xs text-zinc-500 font-medium">{profile.role}</p>
            <div className="flex items-center space-x-3 text-xs text-zinc-400 mt-1">
              <span className="flex items-center space-x-1">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span className="font-bold text-zinc-800">{profile.rating} Rating</span>
              </span>
              <span>•</span>
              <span>{profile.completedJobsCount} Work Orders Completed</span>
            </div>
          </div>
        </div>

      </div>

      {/* Certifications & Inventory Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Certifications */}
        <div className="bg-white border border-zinc-200 rounded-xl p-5 space-y-4 shadow-xs">
          <h3 className="text-sm font-semibold text-zinc-900 flex items-center space-x-2">
            <Award className="w-4 h-4 text-zinc-800" />
            <span>Active Certifications & Credentials</span>
          </h3>
          <div className="space-y-2 text-xs">
            {profile.certifications.map((cert, index) => (
              <div key={index} className="p-3 bg-zinc-50 border border-zinc-200 rounded-lg flex items-center justify-between font-medium text-zinc-800">
                <span>{cert}</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              </div>
            ))}
          </div>
        </div>

        {/* Equipment & Vehicle Information */}
        <div className="bg-white border border-zinc-200 rounded-xl p-5 space-y-4 shadow-xs">
          <h3 className="text-sm font-semibold text-zinc-900 flex items-center space-x-2">
            <Truck className="w-4 h-4 text-zinc-800" />
            <span>Assigned Fleet Vehicle & Tool Kit</span>
          </h3>
          <div className="space-y-3 text-xs">
            <div className="p-3 bg-zinc-50 border border-zinc-200 rounded-lg flex items-center justify-between">
              <span className="text-zinc-500">Service Vehicle ID</span>
              <span className="font-mono font-bold text-zinc-900">{profile.vehicleNumber}</span>
            </div>
            <div className="p-3 bg-zinc-50 border border-zinc-200 rounded-lg flex items-center justify-between">
              <span className="text-zinc-500">Standard Issue Toolkit</span>
              <span className="font-medium text-zinc-900">SK-HV-KIT-PRO (Calibrated)</span>
            </div>
            <div className="p-3 bg-zinc-50 border border-zinc-200 rounded-lg flex items-center justify-between">
              <span className="text-zinc-500">Offline Sync Buffer</span>
              <span className="font-semibold text-emerald-600">Active (100% Persisted)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
