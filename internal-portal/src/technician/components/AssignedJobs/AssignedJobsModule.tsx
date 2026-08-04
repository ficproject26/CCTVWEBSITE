import { useEffect, useState, useCallback } from 'react';
import type { Job, JobFilterOptions, PaginatedJobsResponse, JobStatus } from '../../types/job';
import { JobsApiService } from '../../services/apiService';
import { JobFilters } from './JobFilters';
import { AssignedJobsTable } from './AssignedJobsTable';
import { Pagination } from './Pagination';
import { JobDetailDrawer } from '../JobDetailDrawer';
import { Briefcase, AlertTriangle, RefreshCw, CheckCircle2, Clock, Play, ArrowUpRight } from 'lucide-react';

interface AssignedJobsModuleProps {
  onOpenWorkflow: (job: Job) => void;
}

export const AssignedJobsModule: React.FC<AssignedJobsModuleProps> = ({ onOpenWorkflow }) => {
  const [filters, setFilters] = useState<JobFilterOptions>({
    searchQuery: '',
    status: 'ALL',
    priority: 'ALL',
    sortBy: 'scheduledDate',
    sortOrder: 'asc',
    page: 1,
    limit: 10,
  });

  const [response, setResponse] = useState<PaginatedJobsResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Selected job state for detail view drawer
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);

  const fetchJobs = useCallback(async () => {
    setError(null);
    try {
      const res = await JobsApiService.getAssignedJobs(filters);
      setResponse(res);
    } catch (err: any) {
      setError(err.message || 'Failed to load assigned jobs.');
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  const handleFilterChange = (updated: Partial<JobFilterOptions>) => {
    setFilters((prev) => ({ ...prev, ...updated }));
  };

  const handleResetFilters = () => {
    setFilters({
      searchQuery: '',
      status: 'ALL',
      priority: 'ALL',
      sortBy: 'scheduledDate',
      sortOrder: 'asc',
      page: 1,
      limit: 10,
    });
  };

  const handleUpdateStatus = async (jobId: string, newStatus: JobStatus, note?: string) => {
    try {
      const updatedJob = await JobsApiService.updateJobStatus(jobId, newStatus, note);
      fetchJobs();
      if (selectedJob && selectedJob.id === jobId) {
        setSelectedJob(updatedJob);
      }
    } catch (err: any) {
      alert(`Error updating job: ${err.message}`);
    }
  };

  const handleUploadPhoto = async (
    jobId: string,
    photoUrl: string,
    caption: string,
    type: 'BEFORE' | 'AFTER'
  ) => {
    try {
      const updatedJob = await JobsApiService.uploadJobPhoto(jobId, photoUrl, caption, type);
      fetchJobs();
      if (selectedJob && selectedJob.id === jobId) {
        setSelectedJob(updatedJob);
      }
    } catch (err: any) {
      alert(`Error uploading photo: ${err.message}`);
    }
  };

  const totalAssigned = response?.stats.totalAssigned ?? 0;
  const inProgressCount = response?.stats.inProgressCount ?? 0;
  const pendingCount = response?.stats.pendingCount ?? 0;
  const completedCount = response?.stats.completedCount ?? 0;

  return (
    <div className="space-y-6">
      {/* Rich High-Performance Metrics Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. Total Assigned */}
        <div className="bg-white border border-zinc-200/90 rounded-2xl p-5 shadow-2xs hover:shadow-md hover:border-zinc-300 hover:-translate-y-0.5 transition-all duration-200 group relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">TOTAL ASSIGNED</span>
            <div className="w-9 h-9 rounded-xl bg-zinc-100 group-hover:bg-zinc-900 group-hover:text-white transition-colors duration-200 flex items-center justify-center text-zinc-700">
              <Briefcase className="w-4.5 h-4.5" />
            </div>
          </div>

          <div className="mt-3 flex items-baseline justify-between">
            <p className="text-3xl font-black text-zinc-900 tracking-tight">{totalAssigned}</p>
            <span className={`inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded-md font-mono ${
              totalAssigned > 0 ? 'text-emerald-700 bg-emerald-50' : 'text-zinc-500 bg-zinc-50'
            }`}>
              {totalAssigned > 0 ? 'Active' : 'Idle'}
            </span>
          </div>

          <p className="text-[11px] font-semibold text-zinc-500 mt-1.5 flex items-center space-x-1">
            <span>{totalAssigned} Work Orders</span>
            <span className="text-zinc-300">•</span>
            <span className="text-zinc-400 font-normal">Active Dispatch Queue</span>
          </p>

          <div className="w-full bg-zinc-100 h-1 rounded-full mt-3 overflow-hidden">
            <div className="bg-zinc-900 h-full rounded-full transition-all duration-500" style={{ width: totalAssigned > 0 ? '100%' : '0%' }} />
          </div>
        </div>

        {/* 2. In Progress */}
        <div className="bg-white border border-zinc-200/90 rounded-2xl p-5 shadow-2xs hover:shadow-md hover:border-sky-300/80 hover:-translate-y-0.5 transition-all duration-200 group relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">IN PROGRESS</span>
            <div className="w-9 h-9 rounded-xl bg-sky-50 text-sky-600 group-hover:bg-sky-500 group-hover:text-white transition-colors duration-200 flex items-center justify-center">
              <Play className="w-4.5 h-4.5 fill-current" />
            </div>
          </div>

          <div className="mt-3 flex items-baseline justify-between">
            <p className="text-3xl font-black text-sky-700 tracking-tight">{inProgressCount}</p>
            <span className="inline-flex items-center text-[10px] font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded-md font-mono">
              ⚡ Live
            </span>
          </div>

          <p className="text-[11px] font-semibold text-sky-600 mt-1.5 flex items-center space-x-1">
            <span>Active On Site</span>
            <span className="text-zinc-300">•</span>
            <span className="text-zinc-400 font-normal">{inProgressCount > 0 ? 'GPS Verified' : 'None'}</span>
          </p>

          <div className="w-full bg-sky-100 h-1 rounded-full mt-3 overflow-hidden">
            <div className="bg-sky-500 h-full rounded-full transition-all duration-500" style={{ width: totalAssigned > 0 ? `${(inProgressCount / totalAssigned) * 100}%` : '0%' }} />
          </div>
        </div>

        {/* 3. Pending Start */}
        <div className="bg-white border border-zinc-200/90 rounded-2xl p-5 shadow-2xs hover:shadow-md hover:border-amber-300/80 hover:-translate-y-0.5 transition-all duration-200 group relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">PENDING START</span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 group-hover:bg-amber-500 group-hover:text-white transition-colors duration-200 flex items-center justify-center">
              <Clock className="w-4.5 h-4.5" />
            </div>
          </div>

          <div className="mt-3 flex items-baseline justify-between">
            <p className="text-3xl font-black text-amber-700 tracking-tight">{pendingCount}</p>
            <span className="inline-flex items-center text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md font-mono">
              Scheduled
            </span>
          </div>

          <p className="text-[11px] font-semibold text-amber-600 mt-1.5 flex items-center space-x-1">
            <span>{pendingCount} Scheduled</span>
            <span className="text-zinc-300">•</span>
            <span className="text-zinc-400 font-normal">Ready</span>
          </p>

          <div className="w-full bg-amber-100 h-1 rounded-full mt-3 overflow-hidden">
            <div className="bg-amber-500 h-full rounded-full transition-all duration-500" style={{ width: totalAssigned > 0 ? `${(pendingCount / totalAssigned) * 100}%` : '0%' }} />
          </div>
        </div>

        {/* 4. Completed */}
        <div className="bg-white border border-zinc-200/90 rounded-2xl p-5 shadow-2xs hover:shadow-md hover:border-emerald-300/80 hover:-translate-y-0.5 transition-all duration-200 group relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">COMPLETED</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors duration-200 flex items-center justify-center">
              <CheckCircle2 className="w-4.5 h-4.5" />
            </div>
          </div>

          <div className="mt-3 flex items-baseline justify-between">
            <p className="text-3xl font-black text-emerald-700 tracking-tight">{completedCount}</p>
            <span className="inline-flex items-center text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md font-mono">
              <ArrowUpRight className="w-3 h-3 mr-0.5" />
              {totalAssigned > 0 ? `${Math.round((completedCount / totalAssigned) * 100)}%` : '0%'}
            </span>
          </div>

          <p className="text-[11px] font-semibold text-emerald-600 mt-1.5 flex items-center space-x-1">
            <span>{completedCount} Completed</span>
            <span className="text-zinc-300">•</span>
            <span className="text-zinc-400 font-normal">Signed Off</span>
          </p>

          <div className="w-full bg-emerald-100 h-1 rounded-full mt-3 overflow-hidden">
            <div className="bg-emerald-500 h-full rounded-full transition-all duration-500" style={{ width: totalAssigned > 0 ? `${(completedCount / totalAssigned) * 100}%` : '0%' }} />
          </div>
        </div>
      </div>

      {/* Filter Controls */}
      <JobFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onResetFilters={handleResetFilters}
      />

      {/* Loading Skeleton */}
      {isLoading && (
        <div className="p-8 bg-white border border-zinc-200 rounded-xl space-y-4 shadow-xs">
          <div className="flex items-center space-x-3 text-zinc-500 text-sm">
            <RefreshCw className="w-4 h-4 animate-spin text-zinc-800" />
            <span>Fetching assigned jobs...</span>
          </div>
          <div className="h-10 bg-zinc-100 rounded-lg animate-pulse"></div>
          <div className="h-12 bg-zinc-100 rounded-lg animate-pulse"></div>
          <div className="h-12 bg-zinc-100 rounded-lg animate-pulse"></div>
        </div>
      )}

      {/* Error State */}
      {!isLoading && error && (
        <div className="p-6 bg-red-50 border border-red-200 rounded-xl text-center space-y-3">
          <AlertTriangle className="w-8 h-8 text-red-600 mx-auto" />
          <h3 className="text-sm font-semibold text-red-900">Error Loading Jobs</h3>
          <p className="text-xs text-red-700">{error}</p>
          <button
            onClick={fetchJobs}
            className="px-4 py-2 bg-red-600 text-white rounded-lg text-xs font-semibold hover:bg-red-700 transition-colors"
          >
            Retry
          </button>
        </div>
      )}

      {/* Table / Grid Content */}
      {!isLoading && !error && response && (
        <div className="space-y-4">
          {/* Live Result Count Bar */}
          <div className="flex items-center justify-between px-1 text-xs font-medium text-zinc-500">
            <span>
              Showing <strong className="text-zinc-900 font-mono font-bold">{response.data.length}</strong> of{' '}
              <strong className="text-zinc-900 font-mono font-bold">{response.total}</strong> jobs
            </span>
            {response.data.length === 0 && (
              <button
                onClick={handleResetFilters}
                className="text-xs text-sky-600 hover:text-sky-700 font-semibold underline cursor-pointer"
              >
                Reset filters
              </button>
            )}
          </div>

          <AssignedJobsTable
            jobs={response.data}
            onSelectJob={(job) => {
              setSelectedJob(job);
              setIsDrawerOpen(true);
            }}
            onOpenWorkflow={onOpenWorkflow}
            onUpdateStatus={handleUpdateStatus}
          />

          {response.data.length > 0 && (
            <Pagination
              currentPage={response.page}
              totalPages={response.totalPages}
              totalItems={response.total}
              itemsPerPage={response.limit}
              onPageChange={(page) => handleFilterChange({ page })}
            />
          )}
        </div>
      )}

      {/* Job Detail Drawer */}
      <JobDetailDrawer
        job={selectedJob}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onUpdateStatus={handleUpdateStatus}
        onUploadPhoto={handleUploadPhoto}
      />
    </div>
  );
};
