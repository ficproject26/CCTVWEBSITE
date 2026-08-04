import React, { useState } from 'react';
import type { Job, JobStatus } from '../../types/job';
import { StatusBadge } from '../StatusBadge';
import { 
  Play, 
  MapPin, 
  Clock, 
  ChevronRight, 
  Calendar, 
  ClipboardCheck, 
  CheckCheck,
  Briefcase
} from 'lucide-react';

import { formatDate } from '../../services/dateUtils';

interface AssignedJobsTableProps {
  jobs: Job[];
  isLoading?: boolean;
  onSelectJob: (job: Job) => void;
  onOpenWorkflow?: (job: Job) => void;
  onUpdateStatus: (jobId: string, status: JobStatus) => Promise<void>;
  viewMode?: 'table' | 'grid';
}

export const AssignedJobsTable: React.FC<AssignedJobsTableProps> = ({
  jobs,
  isLoading = false,
  onSelectJob,
  onOpenWorkflow,
  onUpdateStatus,
}) => {
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const handleQuickStatus = async (e: React.MouseEvent, jobId: string, newStatus: JobStatus) => {
    e.stopPropagation();
    setUpdatingId(jobId);
    try {
      await onUpdateStatus(jobId, newStatus);
    } finally {
      setUpdatingId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-zinc-600">
            <thead className="bg-zinc-50 border-b border-zinc-200 text-zinc-500 font-semibold uppercase text-[11px] tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Job Code & Title</th>
                <th className="py-3.5 px-4">Customer & Location</th>
                <th className="py-3.5 px-4">Priority</th>
                <th className="py-3.5 px-4">Schedule</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Workflow Actions</th>
                <th className="py-3.5 px-4 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 font-normal">
              {[...Array(5)].map((_, idx) => (
                <tr key={idx} className="animate-pulse">
                  <td className="py-4 px-4 space-y-2">
                    <div className="h-3 w-20 bg-zinc-200 rounded"></div>
                    <div className="h-4 w-48 bg-zinc-200 rounded"></div>
                    <div className="h-2.5 w-32 bg-zinc-200 rounded"></div>
                  </td>
                  <td className="py-4 px-4 space-y-2">
                    <div className="h-3.5 w-36 bg-zinc-200 rounded"></div>
                    <div className="h-3 w-40 bg-zinc-200 rounded"></div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="h-5 w-16 bg-zinc-200 rounded-full"></div>
                  </td>
                  <td className="py-4 px-4 space-y-2">
                    <div className="h-3.5 w-24 bg-zinc-200 rounded"></div>
                    <div className="h-3 w-28 bg-zinc-200 rounded"></div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="h-5 w-20 bg-zinc-200 rounded-full"></div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="h-7 w-24 bg-zinc-200 rounded-md"></div>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <div className="h-5 w-5 bg-zinc-200 rounded ml-auto"></div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  if (jobs.length === 0) {
    return (
      <div className="bg-white border border-zinc-200 rounded-xl p-12 text-center space-y-3 shadow-xs">
        <div className="w-12 h-12 bg-zinc-100 rounded-2xl flex items-center justify-center mx-auto text-zinc-400">
          <Briefcase className="w-6 h-6" />
        </div>
        <h3 className="text-base font-bold text-zinc-900">No results found</h3>
        <p className="text-xs text-zinc-500 max-w-sm mx-auto">
          No work orders match your search query or filter settings. Try adjusting your parameters.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden shadow-xs">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-zinc-600">
          <thead className="bg-zinc-50 border-b border-zinc-200 text-zinc-500 font-semibold uppercase text-[11px] tracking-wider">
            <tr>
              <th className="py-3.5 px-4">Job Code & Title</th>
              <th className="py-3.5 px-4">Customer & Location</th>
              <th className="py-3.5 px-4">Priority</th>
              <th className="py-3.5 px-4">Schedule</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-4">Workflow Actions</th>
              <th className="py-3.5 px-4 text-right">Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100 font-normal">
            {jobs.map((job) => (
              <tr
                key={job.id}
                onClick={() => onSelectJob(job)}
                className="hover:bg-zinc-50/80 transition-colors cursor-pointer group"
              >
                {/* Job Code & Title */}
                <td className="py-4 px-4">
                  <div className="font-mono font-bold text-zinc-900 text-xs flex items-center space-x-1.5">
                    <span>{job.jobCode}</span>
                    <span className="text-[10px] font-sans font-normal text-zinc-400 bg-zinc-100 px-1.5 py-0.5 rounded">
                      {job.category}
                    </span>
                  </div>
                  <div className="font-semibold text-zinc-900 text-sm mt-0.5 group-hover:text-zinc-900">
                    {job.title}
                  </div>
                  <div className="text-[11px] text-zinc-400 mt-0.5">
                    Equipment: {job.installation.equipmentType}
                  </div>
                </td>

                {/* Customer & Location */}
                <td className="py-4 px-4">
                  <div className="font-semibold text-zinc-900">{job.customer.name}</div>
                  <div className="flex items-center space-x-1 text-zinc-500 mt-0.5">
                    <MapPin className="w-3 h-3 text-zinc-400 flex-shrink-0" />
                    <span className="truncate max-w-[180px]">{job.customer.address}, {job.customer.city}</span>
                  </div>
                </td>

                {/* Priority */}
                <td className="py-4 px-4">
                  <StatusBadge priority={job.priority} size="sm" />
                </td>

                {/* Scheduled Slot */}
                <td className="py-4 px-4">
                  <div className="flex items-center space-x-1 text-zinc-900 font-medium">
                    <Calendar className="w-3.5 h-3.5 text-zinc-400" />
                    <span>{formatDate(job.scheduledDate)}</span>
                  </div>
                  <div className="flex items-center space-x-1 text-zinc-400 text-[11px] mt-0.5">
                    <Clock className="w-3 h-3" />
                    <span>{job.scheduledTimeSlot}</span>
                  </div>
                </td>

                {/* Status */}
                <td className="py-4 px-4">
                  <StatusBadge status={job.status} size="sm" />
                </td>

                {/* Guided Workflow Buttons */}
                <td className="py-4 px-4" onClick={(e) => e.stopPropagation()}>
                  <div className="flex items-center space-x-2">
                    {job.status === 'PENDING' && (
                      <button
                        disabled={updatingId === job.id}
                        onClick={(e) => handleQuickStatus(e, job.id, 'ACCEPTED')}
                        className="px-2.5 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-white font-medium text-[11px] rounded-md flex items-center space-x-1 transition-colors"
                      >
                        <Play className="w-3 h-3 fill-current" />
                        <span>Accept Job</span>
                      </button>
                    )}

                    {(job.status === 'ACCEPTED' || job.status === 'IN_PROGRESS' || job.status === 'BEFORE_PHOTOS_DONE' || job.status === 'INSPECTED' || job.status === 'DAILY_REPORTED' || job.status === 'AFTER_PHOTOS_DONE') && onOpenWorkflow && (
                      <button
                        onClick={() => onOpenWorkflow(job)}
                        className="px-2.5 py-1.5 bg-zinc-900 text-white hover:bg-zinc-800 font-medium text-[11px] rounded-md flex items-center space-x-1 transition-colors shadow-xs"
                      >
                        <ClipboardCheck className="w-3 h-3" />
                        <span>Workflow Center</span>
                      </button>
                    )}

                    {job.status === 'COMPLETED' && (
                      <span className="text-[11px] text-emerald-600 font-medium flex items-center space-x-1 bg-emerald-50 px-2 py-1 rounded">
                        <CheckCheck className="w-3.5 h-3.5" />
                        <span>Signed Off</span>
                      </span>
                    )}
                  </div>
                </td>

                {/* Details Chevron */}
                <td className="py-4 px-4 text-right">
                  <button
                    onClick={() => onSelectJob(job)}
                    className="p-1.5 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 rounded-md transition-colors"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
