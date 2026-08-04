import type { JobFilterOptions, JobStatus, Priority } from '../../types/job';
import { Search, Filter, ArrowUpDown, X } from 'lucide-react';

interface JobFiltersProps {
  filters: JobFilterOptions;
  onFilterChange: (updated: Partial<JobFilterOptions>) => void;
  onResetFilters: () => void;
}

export const JobFilters = ({
  filters,
  onFilterChange,
  onResetFilters,
}: JobFiltersProps) => {
  const hasActiveFilters =
    filters.searchQuery !== '' || filters.status !== 'ALL' || filters.priority !== 'ALL';

  return (
    <div className="p-4 bg-white border border-zinc-200 rounded-xl space-y-4 shadow-xs">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Search Bar */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 transform -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            placeholder="Search by job code, title, customer..."
            value={filters.searchQuery}
            onChange={(e) => onFilterChange({ searchQuery: e.target.value, page: 1 })}
            className="w-full pl-10 pr-4 py-2 bg-zinc-50 border border-zinc-200 rounded-lg text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-900 focus:border-zinc-900 transition-all"
          />
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-2">
          {hasActiveFilters && (
            <button
              onClick={onResetFilters}
              className="px-3 py-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 text-xs font-medium rounded-lg flex items-center space-x-1.5 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter Options */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-3 border-t border-zinc-100 text-xs">
        {/* Status Filter */}
        <div>
          <label className="block text-zinc-500 font-medium mb-1 flex items-center space-x-1">
            <Filter className="w-3 h-3 text-zinc-400" />
            <span>Job Status</span>
          </label>
          <select
            value={filters.status}
            onChange={(e) => onFilterChange({ status: e.target.value as JobStatus | 'ALL', page: 1 })}
            className="w-full p-2 bg-zinc-50 border border-zinc-200 rounded-lg font-medium text-zinc-800 focus:outline-none focus:ring-1 focus:ring-zinc-900"
          >
            <option value="ALL">All Statuses</option>
            <option value="PENDING">Pending</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="COMPLETED">Completed</option>
            <option value="ON_HOLD">On Hold</option>
          </select>
        </div>

        {/* Priority Filter */}
        <div>
          <label className="block text-zinc-500 font-medium mb-1 flex items-center space-x-1">
            <Filter className="w-3 h-3 text-zinc-400" />
            <span>Priority</span>
          </label>
          <select
            value={filters.priority}
            onChange={(e) => onFilterChange({ priority: e.target.value as Priority | 'ALL', page: 1 })}
            className="w-full p-2 bg-zinc-50 border border-zinc-200 rounded-lg font-medium text-zinc-800 focus:outline-none focus:ring-1 focus:ring-zinc-900"
          >
            <option value="ALL">All Priorities</option>
            <option value="URGENT">Urgent</option>
            <option value="HIGH">High</option>
            <option value="MEDIUM">Medium</option>
            <option value="LOW">Low</option>
          </select>
        </div>

        {/* Sort By Filter */}
        <div>
          <label className="block text-zinc-500 font-medium mb-1 flex items-center space-x-1">
            <ArrowUpDown className="w-3 h-3 text-zinc-400" />
            <span>Sort Field</span>
          </label>
          <select
            value={filters.sortBy}
            onChange={(e) => onFilterChange({ sortBy: e.target.value as any })}
            className="w-full p-2 bg-zinc-50 border border-zinc-200 rounded-lg font-medium text-zinc-800 focus:outline-none focus:ring-1 focus:ring-zinc-900"
          >
            <option value="scheduledDate">Scheduled Date</option>
            <option value="jobCode">Job Code</option>
          </select>
        </div>

        {/* Sort Order Filter */}
        <div>
          <label className="block text-zinc-500 font-medium mb-1 flex items-center space-x-1">
            <ArrowUpDown className="w-3 h-3 text-zinc-400" />
            <span>Order</span>
          </label>
          <select
            value={filters.sortOrder}
            onChange={(e) => onFilterChange({ sortOrder: e.target.value as 'asc' | 'desc' })}
            className="w-full p-2 bg-zinc-50 border border-zinc-200 rounded-lg font-medium text-zinc-800 focus:outline-none focus:ring-1 focus:ring-zinc-900"
          >
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </div>
      </div>
    </div>
  );
};
