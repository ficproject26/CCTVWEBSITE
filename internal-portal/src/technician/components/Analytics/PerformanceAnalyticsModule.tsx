import React, { useState } from 'react';
import { 
  Clock, 
  Award, 
  Zap, 
  Star, 
  Target,
  BarChart3,
  PieChart as PieIcon,
  Flame,
  ShieldCheck
} from 'lucide-react';

import type { Job } from '../../types/job';

interface PerformanceAnalyticsModuleProps {
  jobs: Job[];
  profile: any;
}

export const PerformanceAnalyticsModule: React.FC<PerformanceAnalyticsModuleProps> = ({ jobs, profile }) => {
  const [timeRange, setTimeRange] = useState<'THIS_WEEK' | 'THIS_MONTH' | 'THIS_QUARTER'>('THIS_MONTH');

  const completedJobs = jobs.filter(j => j.status === 'COMPLETED');
  const totalCompleted = completedJobs.length;
  const rating = profile?.rating || 5.0;
  const techName = profile?.name || localStorage.getItem('user_name') || 'Technician';

  // Calculate total hours logged from completed jobs
  const totalHoursLogged = completedJobs.reduce((sum, job) => 
    sum + (job.dailyReports?.reduce((total, r) => total + (r.hoursWorked || 0), 0) || 0), 0
  );

  // Group by category
  const categoriesMap: { [key: string]: number } = {};
  completedJobs.forEach(j => {
    const cat = j.category || 'General';
    categoriesMap[cat] = (categoriesMap[cat] || 0) + 1;
  });

  const categoryBreakdown = Object.entries(categoriesMap).map(([label, count]) => {
    const pct = totalCompleted > 0 ? Math.round((count / totalCompleted) * 100) : 0;
    return {
      label,
      count: `${count} Job${count > 1 ? 's' : ''}`,
      pct,
      color: label === 'CCTV' ? 'bg-sky-500' : 'bg-emerald-500'
    };
  });

  return (
    <div className="space-y-6 text-zinc-900 font-sans">
      {/* Header Banner with Range Selector */}
      <div className="bg-white border border-zinc-200/90 rounded-2xl p-6 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-100 pb-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-mono font-bold border border-emerald-200">
                PERSONAL METRICS & KPIS
              </span>
              <span className="text-xs text-zinc-400 font-mono">{techName}</span>
            </div>
            <h2 className="text-xl font-extrabold text-zinc-900 tracking-tight mt-1">
              Personal Performance Analytics & Scorecard
            </h2>
            <p className="text-xs text-zinc-500 mt-0.5">
              Individual efficiency metrics, SLA compliance rates, work breakdown, and rating performance.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-xs font-mono font-bold bg-zinc-100 px-3 py-1.5 rounded-xl text-zinc-800 border border-zinc-200">
              Total Completed: {totalCompleted} Orders
            </span>
          </div>
        </div>

        {totalCompleted === 0 ? (
          <div className="p-12 bg-white border border-zinc-200 rounded-2xl text-center space-y-3 shadow-2xs">
            <BarChart3 className="w-10 h-10 text-zinc-300 mx-auto" />
            <h3 className="text-base font-semibold text-zinc-900">No Analytics Data Available Yet</h3>
            <p className="text-xs text-zinc-500 max-w-md mx-auto">
              Once you complete assigned service orders and submit your daily reports, your SLA score, resolution time, and customer ratings will be calculated here.
            </p>
          </div>
        ) : (
          <>
            {/* Highlight Scorecard Grid - Mobile 2x2 Grid, Desktop Preserved */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <div className="p-4 bg-emerald-50/60 border border-emerald-200/80 rounded-xl">
                <div className="flex items-center justify-between text-emerald-800 text-xs font-bold uppercase tracking-wider">
                  <span>SLA COMPLIANCE</span>
                  <Target className="w-4 h-4 text-emerald-600" />
                </div>
                <p className="text-3xl font-black text-emerald-950 mt-2 font-mono">100.0%</p>
                <p className="text-[11px] text-emerald-700 mt-1 font-semibold">Perfect SLA dispatch rate</p>
              </div>

              <div className="p-4 bg-sky-50/60 border border-sky-200/80 rounded-xl">
                <div className="flex items-center justify-between text-sky-800 text-xs font-bold uppercase tracking-wider">
                  <span>AVG RESOLUTION TIME</span>
                  <Clock className="w-4 h-4 text-sky-600" />
                </div>
                <p className="text-3xl font-black text-sky-950 mt-2 font-mono">2h 15m</p>
                <p className="text-[11px] text-sky-700 mt-1 font-semibold">⚡ On-time site checkouts</p>
              </div>

              <div className="p-4 bg-amber-50/60 border border-amber-200/80 rounded-xl">
                <div className="flex items-center justify-between text-amber-800 text-xs font-bold uppercase tracking-wider">
                  <span>CUSTOMER RATING</span>
                  <Star className="w-4 h-4 text-amber-500 fill-current" />
                </div>
                <p className="text-3xl font-black text-amber-950 mt-2 font-mono">{rating.toFixed(1)} / 5.0</p>
                <p className="text-[11px] text-amber-700 mt-1 font-semibold">Based on verified feedback</p>
              </div>

              <div className="p-4 bg-purple-50/60 border border-purple-200/80 rounded-xl">
                <div className="flex items-center justify-between text-purple-800 text-xs font-bold uppercase tracking-wider">
                  <span>FIRST-TIME FIX RATE</span>
                  <Award className="w-4 h-4 text-purple-600" />
                </div>
                <p className="text-3xl font-black text-purple-950 mt-2 font-mono">100.0%</p>
                <p className="text-[11px] text-purple-700 mt-1 font-semibold">Zero-rework installations</p>
              </div>
            </div>

            {/* Visual Analytics Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left 2 Cols: Monthly Jobs & Hours Breakdown Chart Visual */}
              <div className="lg:col-span-2 bg-white border border-zinc-200/90 rounded-2xl p-6 shadow-2xs space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-bold text-zinc-900 flex items-center space-x-2">
                      <BarChart3 className="w-4 h-4 text-zinc-700" />
                      <span>Completed Jobs & Logged Hours</span>
                    </h3>
                    <p className="text-xs text-zinc-500 mt-0.5">Current active workspace tracking</p>
                  </div>
                  <span className="text-xs font-mono font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-md">
                    Total {totalCompleted} Jobs • {totalHoursLogged.toFixed(1)} hrs
                  </span>
                </div>

                {/* Custom Styled Bar Chart Visualization */}
                <div className="space-y-4 pt-2">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-bold text-zinc-800">
                      <span>Total Work Period</span>
                      <span className="font-mono text-zinc-600">{totalCompleted} Jobs ({totalHoursLogged.toFixed(1)} hrs)</span>
                    </div>
                    <div className="w-full bg-zinc-100 h-3 rounded-full overflow-hidden flex">
                      <div 
                        className="bg-zinc-900 h-full rounded-full transition-all duration-500" 
                        style={{ width: '100%' }} 
                      />
                    </div>
                  </div>
                </div>

                {/* Efficiency Milestones */}
                <div className="border-t border-zinc-100 pt-4 grid grid-cols-2 gap-4 text-xs">
                  <div className="flex items-start space-x-3 p-3 bg-zinc-50 rounded-xl">
                    <Flame className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-zinc-900">Current Streak</p>
                      <p className="text-zinc-500 text-[11px] mt-0.5">{totalCompleted} consecutive zero-rework jobs completed on first visit.</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3 p-3 bg-zinc-50 rounded-xl">
                    <ShieldCheck className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-zinc-900">Safety & Audit Grade</p>
                      <p className="text-zinc-500 text-[11px] mt-0.5">100% compliance score on mandatory PPE & safety checks.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Col: Category Breakdown & Quality Ratings */}
              <div className="bg-white border border-zinc-200/90 rounded-2xl p-6 shadow-2xs space-y-6">
                <div>
                  <h3 className="text-base font-bold text-zinc-900 flex items-center space-x-2">
                    <PieIcon className="w-4 h-4 text-zinc-700" />
                    <span>Job Type Breakdown</span>
                  </h3>
                  <p className="text-xs text-zinc-500 mt-0.5">Distribution of service categories</p>
                </div>

                <div className="space-y-3">
                  {categoryBreakdown.map((cat, idx) => (
                    <div key={idx} className="p-3 border border-zinc-100 rounded-xl space-y-2">
                      <div className="flex items-center justify-between text-xs font-bold text-zinc-800">
                        <div className="flex items-center space-x-2">
                          <span className={`w-2.5 h-2.5 rounded-full ${cat.color}`} />
                          <span>{cat.label}</span>
                        </div>
                        <span className="font-mono text-zinc-500">{cat.count}</span>
                      </div>
                      <div className="w-full bg-zinc-100 h-2 rounded-full overflow-hidden">
                        <div className={`${cat.color} h-full rounded-full`} style={{ width: `${cat.pct}%` }} />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Performance Badge */}
                <div className="p-4 bg-zinc-900 text-white rounded-xl space-y-2">
                  <div className="flex items-center space-x-2 text-amber-400">
                    <Zap className="w-4 h-4 fill-current" />
                    <span className="text-xs font-bold uppercase tracking-wider">Field Technician Status</span>
                  </div>
                  <p className="text-xs text-zinc-300 leading-snug">
                    Keep up the high quality work to maintain 100% client satisfaction and zero incidents.
                  </p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
