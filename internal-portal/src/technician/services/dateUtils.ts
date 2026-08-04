/**
 * Formats any date string or Date instance into the standard format: "28 Jul 2026".
 * Uses navigator.language for device locale awareness while enforcing "DD MMM YYYY" style.
 */
export function formatDate(inputDate?: string | Date | number | null): string {
  if (!inputDate) return '';
  const dateObj = typeof inputDate === 'object' ? inputDate : new Date(inputDate);

  if (isNaN(dateObj.getTime())) {
    // If input is an ISO string or date string like "2026-07-28"
    if (typeof inputDate === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(inputDate)) {
      const [year, month, day] = inputDate.split('-').map(Number);
      const manualDate = new Date(year, month - 1, day);
      return formatWithDeviceLocale(manualDate);
    }
    return String(inputDate);
  }

  return formatWithDeviceLocale(dateObj);
}

function formatWithDeviceLocale(date: Date): string {
  const userLocale = typeof navigator !== 'undefined' ? navigator.language || 'en-US' : 'en-US';

  const day = new Intl.DateTimeFormat(userLocale, { day: '2-digit' }).format(date);
  const month = new Intl.DateTimeFormat(userLocale, { month: 'short' }).format(date);
  const year = new Intl.DateTimeFormat(userLocale, { year: 'numeric' }).format(date);

  return `${day} ${month} ${year}`;
}

/**
 * Calculates calendar days difference between two dates (inclusive of start day, minimum 1).
 */
export function calculateDaysBetween(startDateStr?: string | null, endDateStr?: string | null): number {
  if (!startDateStr || !endDateStr) return 1;
  const start = new Date(startDateStr);
  const end = new Date(endDateStr);
  if (isNaN(start.getTime()) || isNaN(end.getTime())) return 1;

  // Set to midnight UTC for pure calendar day diff
  const diffTime = Math.abs(end.getTime() - start.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return Math.max(1, diffDays + 1);
}

export interface JobDaysStats {
  startDate: string;
  targetCompletionDate: string;
  actualCompletionDate: string | null;
  totalTargetDays: number;
  elapsedDays: number;
  remainingDays: number;
  isOverdue: boolean;
  totalReportedDays: number;
  dayProgressPercentage: number;
  statusLabel: string;
}

/**
 * Calculates detailed day stats for a specific job (used across Admin, Tech, and Customer views).
 */
export function calculateJobDaysStats(job: {
  scheduledDate: string;
  startDate?: string;
  targetCompletionDate?: string;
  actualCompletionDate?: string;
  estimatedDays?: number;
  dailyReports?: { date: string }[];
  status: string;
}): JobDaysStats {
  const startDate = job.startDate || job.scheduledDate || new Date().toISOString().split('T')[0];
  const targetDays = job.estimatedDays || 5;

  let targetDateObj = new Date(startDate);
  if (job.targetCompletionDate) {
    targetDateObj = new Date(job.targetCompletionDate);
  } else {
    targetDateObj.setDate(targetDateObj.getDate() + (targetDays - 1));
  }
  const targetCompletionDate = targetDateObj.toISOString().split('T')[0];

  const actualCompletionDate = job.actualCompletionDate || (job.status === 'COMPLETED' ? new Date().toISOString().split('T')[0] : null);
  const totalTargetDays = calculateDaysBetween(startDate, targetCompletionDate);

  const referenceEndDate = actualCompletionDate || new Date().toISOString().split('T')[0];
  const elapsedDays = Math.min(
    totalTargetDays,
    calculateDaysBetween(startDate, referenceEndDate)
  );

  const isCompleted = job.status === 'COMPLETED';
  const remainingDays = isCompleted ? 0 : Math.max(0, totalTargetDays - elapsedDays);
  const isOverdue = !isCompleted && new Date() > new Date(targetCompletionDate);

  const uniqueReportDates = new Set(
    (job.dailyReports || []).map((r) => r.date.split(' ')[0])
  );
  const totalReportedDays = Math.max(1, uniqueReportDates.size || (isCompleted ? elapsedDays : 1));

  const dayProgressPercentage = Math.min(100, Math.round((elapsedDays / totalTargetDays) * 100));

  let statusLabel = `Day ${elapsedDays} of ${totalTargetDays} Days`;
  if (isCompleted) {
    statusLabel = `Completed in ${totalReportedDays} ${totalReportedDays === 1 ? 'Day' : 'Days'}`;
  } else if (isOverdue) {
    statusLabel = `Overdue (${elapsedDays} Days Spent)`;
  }

  return {
    startDate,
    targetCompletionDate,
    actualCompletionDate,
    totalTargetDays,
    elapsedDays,
    remainingDays,
    isOverdue,
    totalReportedDays,
    dayProgressPercentage,
    statusLabel,
  };
}

/**
 * Calculates technician-specific aggregate day statistics.
 */
export function calculateTechnicianDaysStats(jobs: Array<any>) {
  let totalDaysWorked = 0;
  let totalCompletedJobs = 0;
  let onTimeCompletions = 0;

  jobs.forEach((job) => {
    const stats = calculateJobDaysStats(job);
    totalDaysWorked += stats.totalReportedDays;
    if (job.status === 'COMPLETED') {
      totalCompletedJobs++;
      if (!stats.isOverdue) onTimeCompletions++;
    }
  });

  const avgDaysPerJob = totalCompletedJobs > 0 ? (totalDaysWorked / totalCompletedJobs).toFixed(1) : '1.0';

  return {
    totalDaysWorked,
    totalCompletedJobs,
    avgDaysPerJob,
    onTimeRate: totalCompletedJobs > 0 ? Math.round((onTimeCompletions / totalCompletedJobs) * 100) : 100,
  };
}

/**
 * Calculates admin-level aggregate day analytics across all jobs.
 */
export function calculateAdminDaysAnalytics(jobs: Array<any>) {
  let totalWorkDaysLogged = 0;
  let totalTargetDaysSum = 0;
  let overdueJobsCount = 0;
  let activeJobsCount = 0;

  jobs.forEach((job) => {
    const stats = calculateJobDaysStats(job);
    totalWorkDaysLogged += stats.totalReportedDays;
    totalTargetDaysSum += stats.totalTargetDays;
    if (stats.isOverdue) overdueJobsCount++;
    if (job.status === 'IN_PROGRESS' || job.status === 'PENDING') activeJobsCount++;
  });

  const avgProjectDurationDays = jobs.length > 0 ? (totalTargetDaysSum / jobs.length).toFixed(1) : '3.0';

  return {
    totalWorkDaysLogged,
    avgProjectDurationDays,
    overdueJobsCount,
    activeJobsCount,
  };
}

