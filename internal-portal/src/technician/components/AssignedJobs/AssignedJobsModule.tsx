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
      const job = response?.data.find(j => j.id === jobId);
      let updatedJob;

      if (newStatus === 'ACCEPTED' && (!job?.assignedTechnician || !job.assignedTechnician.id)) {
        const profile = await JobsApiService.getTechnicianProfile();
        updatedJob = await JobsApiService.acceptJob(jobId, profile);
      } else {
        updatedJob = await JobsApiService.updateJobStatus(jobId, newStatus, note);
      }

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
      {/* Sleek Professional Metrics Cards - Responsive 2x2 Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* 1. Total Assigned */}
        <div className="bg-white border border-zinc-200/90 rounded-2xl p-4 sm:p-5 shadow-2xs hover:shadow-md transition-all relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider">Total Assigned</span>
            <div className="w-8 h-8 rounded-xl bg-zinc-100 text-zinc-700 flex items-center justify-center group-hover:bg-red-600 group-hover:text-white transition-colors">
              <Briefcase className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl sm:text-3xl font-extrabold text-zinc-900 tracking-tight font-mono">{totalAssigned}</span>
            <span className="text-[10px] font-bold text-zinc-700 bg-zinc-100 px-2 py-0.5 rounded-full border border-zinc-200">
              Orders
            </span>
          </div>
          <p className="text-[11px] text-zinc-500 font-medium mt-1">Assigned work orders</p>
        </div>

        {/* 2. In Progress */}
        <div className="bg-white border border-zinc-200/90 rounded-2xl p-4 sm:p-5 shadow-2xs hover:shadow-md transition-all relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-sky-700 uppercase tracking-wider">In Progress</span>
            <div className="w-8 h-8 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center group-hover:bg-sky-600 group-hover:text-white transition-colors">
              <Play className="w-4 h-4 fill-current" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl sm:text-3xl font-extrabold text-sky-700 tracking-tight font-mono">{inProgressCount}</span>
            <span className="text-[10px] font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded-full border border-sky-100">
              Active
            </span>
          </div>
          <p className="text-[11px] text-sky-600 font-medium mt-1">Work in progress on site</p>
        </div>

        {/* 3. Pending Start */}
        <div className="bg-white border border-zinc-200/90 rounded-2xl p-4 sm:p-5 shadow-2xs hover:shadow-md transition-all relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-amber-700 uppercase tracking-wider">Pending Start</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:bg-amber-600 group-hover:text-white transition-colors">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl sm:text-3xl font-extrabold text-amber-700 tracking-tight font-mono">{pendingCount}</span>
            <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-100">
              Scheduled
            </span>
          </div>
          <p className="text-[11px] text-amber-600 font-medium mt-1">Scheduled & awaiting start</p>
        </div>

        {/* 4. Completed */}
        <div className="bg-white border border-zinc-200/90 rounded-2xl p-4 sm:p-5 shadow-2xs hover:shadow-md transition-all relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider">Completed</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl sm:text-3xl font-extrabold text-emerald-700 tracking-tight font-mono">{completedCount}</span>
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
              {totalAssigned > 0 ? `${Math.round((completedCount / totalAssigned) * 100)}%` : '0%'}
            </span>
          </div>
          <p className="text-[11px] text-emerald-600 font-medium mt-1">Finished & signed off</p>
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
