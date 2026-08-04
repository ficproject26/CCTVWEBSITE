import { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { AssignedJobsModule } from './components/AssignedJobs/AssignedJobsModule';
import { DashboardModule } from './components/Dashboard/DashboardModule';
import { TodaysScheduleModule } from './components/Schedule/TodaysScheduleModule';
import { DailyReportsModule } from './components/Reports/DailyReportsModule';
import { JobHistoryModule } from './components/History/JobHistoryModule';
import { QueryModule } from './components/Query/QueryModule';
import { PerformanceAnalyticsModule } from './components/Analytics/PerformanceAnalyticsModule';
import { NotificationsModule } from './components/Notifications/NotificationsModule';
import { ProfileModule } from './components/Profile/ProfileModule';
import { SettingsModule } from './components/Settings/SettingsModule';
import { WorkflowModal } from './components/Workflow/WorkflowModal';
import { JobDetailDrawer } from './components/JobDetailDrawer';
import { LoginScreen } from './components/Auth/LoginScreen';

import { JobsApiService } from './services/apiService';
import type {
  Job,
  JobStatus,
  InspectionSummary,
  DailyReport,
  NotificationItem,
  TechnicianProfile
} from './types/job';

import { ErrorBanner, type GlobalErrorState } from './components/ErrorBanner';
import { OfflineBanner } from './components/OfflineBanner';

export function App() {
  const [globalError, setGlobalError] = useState<GlobalErrorState | null>(null);
  const [autoSyncEnabled, setAutoSyncEnabled] = useState<boolean>(true);
  const [queuedReportsCount, setQueuedReportsCount] = useState<number>(3);
  const [isAutoSyncing, setIsAutoSyncing] = useState<boolean>(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<string>(() => {
    return localStorage.getItem('sk_tech_tab') || 'dashboard';
  });
  const [globalSearchQuery, setGlobalSearchQuery] = useState<string>('');

  // Persist Active Tab to localStorage
  useEffect(() => {
    localStorage.setItem('sk_tech_tab', activeTab);
  }, [activeTab]);

  // State
  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isDetailDrawerOpen, setIsDetailDrawerOpen] = useState<boolean>(false);

  // Workflow Modal State
  const [workflowJob, setWorkflowJob] = useState<Job | null>(null);
  const [isWorkflowOpen, setIsWorkflowOpen] = useState<boolean>(false);

  // Notifications State
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  // Offline Field Sync State
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setGlobalError(null);

      if (autoSyncEnabled && queuedReportsCount > 0) {
        setIsAutoSyncing(true);
        setTimeout(() => {
          setQueuedReportsCount(0);
          setIsAutoSyncing(false);
        }, 2000);
      }
    };
    const handleOffline = () => {
      setIsOnline(false);
      setGlobalError({
        id: `net-${Date.now()}`,
        type: 'NETWORK',
        title: 'Network Connection Dropped',
        message: 'Field network signal lost. Offline mode active; all job data will queue locally.',
      });
    };
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [autoSyncEnabled, queuedReportsCount]);

  // Mobile Responsive Drawer State
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false);

  // Technician Profile State
  const [profile, setProfile] = useState<TechnicianProfile | null>(null);
  const [isLoadingData, setIsLoadingData] = useState<boolean>(true);

  // Initial Data Fetch
  useEffect(() => {
    const loadInitialData = async () => {
      setIsLoadingData(true);
      try {
        const [jobsResponse, notifsData, profileData] = await Promise.all([
          JobsApiService.getAssignedJobs({ searchQuery: '', status: 'ALL', priority: 'ALL', sortBy: 'scheduledDate', sortOrder: 'asc', page: 1, limit: 10 }),
          JobsApiService.getNotifications(),
          JobsApiService.getTechnicianProfile(),
        ]);
        setJobs(jobsResponse.data);
        setNotifications(notifsData);
        setProfile(profileData);
      } catch (err: any) {
        console.error('Failed to load initial portal data:', err);
        setGlobalError({
          id: `fetch-${Date.now()}`,
          type: 'FETCH',
          title: 'Portal Data Fetch Error',
          message: err?.message || 'Failed to sync latest field work orders from central database.',
          onRetry: () => window.location.reload(),
        });
      } finally {
        setIsLoadingData(false);
      }
    };

    loadInitialData();
  }, []);

  // Authentication login handler
  const handleLoginSuccess = (technicianData: { name: string; email: string; badge: string; role: string }) => {
    localStorage.setItem('sk_tech_auth', 'true');
    setIsAuthenticated(true);
    setProfile({
      id: 'TECH-9042',
      name: technicianData.name,
      badgeNumber: technicianData.badge,
      role: technicianData.role,
      email: technicianData.email,
      phone: '+1 (512) 890-4421',
      status: 'ON_DUTY',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
      certifications: [
        'Certified Field Tech Level 4',
        'LOTO Safety Certified'
      ],
      vehicleNumber: 'Ford Transit #SK-408',
      rating: 4.9,
      completedJobsCount: 142,
    });
    setActiveTab('dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem('sk_tech_auth');
    localStorage.removeItem('sk_tech_tab');
    localStorage.removeItem('internal_token');
    localStorage.removeItem('internal_role');
    setIsAuthenticated(false);
    window.location.href = '/login';
  };

  // Handlers
  const handleSelectJob = (job: Job) => {
    setSelectedJob(job);
    setIsDetailDrawerOpen(true);
  };

  const handleOpenWorkflow = (job: Job) => {
    setWorkflowJob(job);
    setIsWorkflowOpen(true);
  };

  const handleUpdateStatus = async (jobId: string, status: JobStatus) => {
    try {
      const updated = await JobsApiService.updateJobStatus(jobId, status);
      setJobs((prev) => prev.map((j) => (j.id === jobId ? updated : j)));
      if (selectedJob?.id === jobId) setSelectedJob(updated);
      if (workflowJob?.id === jobId) setWorkflowJob(updated);

      // 🔔 1. Broadcast Notification to All Technicians
      const techName = profile?.name || 'Alex Vance';
      const actionText = status === 'ACCEPTED' || status === 'IN_PROGRESS' ? 'accepted and started' : `updated to ${status}`;
      const newNotif: NotificationItem = {
        id: `notif-${Date.now()}`,
        title: `📢 Work Order ${updated.jobCode} ${status === 'ACCEPTED' ? 'Accepted' : 'Updated'}`,
        message: `Technician ${techName} has ${actionText} job "${updated.title}" at ${updated.customer.name}.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        read: false,
        type: 'ASSIGNMENT',
        jobId: updated.id,
      };

      // 👑 2. High-Priority Admin Dispatch Center Alert
      const adminNotif: NotificationItem = {
        id: `admin-notif-${Date.now()}`,
        title: `👑 ADMIN ALERT: ${updated.jobCode} Dispatched`,
        message: `Central Dispatch Notification: ${techName} accepted work order for ${updated.customer.name}. Real-time tracking enabled.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        read: false,
        type: 'URGENT',
        jobId: updated.id,
      };

      setNotifications((prev) => [adminNotif, newNotif, ...prev]);
    } catch (err: any) {
      console.error('Failed to update status:', err);
      setGlobalError({
        id: `err-${Date.now()}`,
        type: 'JOB_ACTION',
        title: 'Job Action Failed',
        message: err?.message || 'Unable to update job status. Please check connection and try again.',
        onRetry: () => handleUpdateStatus(jobId, status),
      });
    }
  };

  const handleUploadPhoto = async (jobId: string, photoUrl: string, caption: string, type: 'BEFORE' | 'AFTER') => {
    try {
      const updated = await JobsApiService.uploadJobPhoto(jobId, photoUrl, caption, type);
      setJobs((prev) => prev.map((j) => (j.id === jobId ? updated : j)));
      if (selectedJob?.id === jobId) setSelectedJob(updated);
      if (workflowJob?.id === jobId) setWorkflowJob(updated);
    } catch (err) {
      console.error('Failed to upload photo:', err);
    }
  };

  const handleSaveInspection = async (jobId: string, summary: InspectionSummary) => {
    try {
      const updated = await JobsApiService.saveInspectionSummary(jobId, summary);
      setJobs((prev) => prev.map((j) => (j.id === jobId ? updated : j)));
      if (selectedJob?.id === jobId) setSelectedJob(updated);
      if (workflowJob?.id === jobId) setWorkflowJob(updated);
    } catch (err) {
      console.error('Failed to save inspection:', err);
    }
  };

  const handleAddDailyReport = async (jobId: string, report: Omit<DailyReport, 'id' | 'createdAt'>) => {
    try {
      const updated = await JobsApiService.addDailyReport(jobId, report);
      setJobs((prev) => prev.map((j) => (j.id === jobId ? updated : j)));
      if (selectedJob?.id === jobId) setSelectedJob(updated);
      if (workflowJob?.id === jobId) setWorkflowJob(updated);
    } catch (err) {
      console.error('Failed to add daily report:', err);
    }
  };

  const handleCompleteJob = async (jobId: string, closeoutNotes: string, customerSignature?: string) => {
    try {
      const updated = await JobsApiService.completeJob(jobId, closeoutNotes, customerSignature);
      setJobs((prev) => prev.map((j) => (j.id === jobId ? updated : j)));
      if (selectedJob?.id === jobId) setSelectedJob(updated);
      if (workflowJob?.id === jobId) setWorkflowJob(updated);

      // 🔔 1. Broadcast Notification to All Technicians
      const techName = profile?.name || 'Alex Vance';
      const newNotif: NotificationItem = {
        id: `notif-${Date.now()}`,
        title: `✅ Work Order ${updated.jobCode} Completed & Signed Off`,
        message: `Technician ${techName} successfully completed job "${updated.title}". Quality verified and archived.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        read: false,
        type: 'SYSTEM',
        jobId: updated.id,
      };

      // 👑 2. High-Priority Admin Closeout Sign-Off Alert
      const adminNotif: NotificationItem = {
        id: `admin-notif-${Date.now()}`,
        title: `👑 ADMIN ALERT: ${updated.jobCode} Sign-Off Complete`,
        message: `Central Dispatch Control: Work order ${updated.jobCode} fully completed by ${techName}. Digital customer signature archived.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        read: false,
        type: 'URGENT',
        jobId: updated.id,
      };

      setNotifications((prev) => [adminNotif, newNotif, ...prev]);
    } catch (err) {
      console.error('Failed to complete job:', err);
    }
  };

  const handleMarkNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const handleUpdateProfileStatus = async (status: 'ON_DUTY' | 'OFF_DUTY' | 'ON_JOB') => {
    try {
      const updated = await JobsApiService.updateTechnicianStatus(status);
      setProfile(updated);
    } catch (err) {
      console.error('Failed to update technician status:', err);
    }
  };

  // Render Login Page if not authenticated
  if (!isAuthenticated) {
    return <LoginScreen onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="h-screen flex bg-zinc-50 font-sans text-zinc-900 overflow-hidden">
      {/* Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentTechnician={profile}
        onLogout={handleLogout}
        isOpen={isMobileSidebarOpen}
        onClose={() => setIsMobileSidebarOpen(false)}
        jobsCount={jobs.length}
        notificationsCount={notifications.filter(n => !n.read).length}
      />

      {/* Main Content Layout */}
      <div className="flex-1 flex flex-col h-screen overflow-y-auto min-w-0">
        <OfflineBanner
          isOnline={isOnline}
          queuedCount={queuedReportsCount}
          isAutoSyncing={isAutoSyncing}
        />

        {activeTab === 'dashboard' && (
          <Header
            searchQuery={globalSearchQuery}
            onSearchChange={setGlobalSearchQuery}
            currentTechnician={profile}
            onToggleSidebar={() => setIsMobileSidebarOpen(true)}
            notifications={notifications}
            onMarkRead={handleMarkNotificationRead}
            onNavigateToNotifications={() => setActiveTab('notifications')}
          />
        )}

        <main className="flex-1 px-6 py-8 lg:px-8 lg:py-10 max-w-7xl w-full mx-auto space-y-6">
          {/* Module Title Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200 pb-5">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-zinc-900 capitalize">
                {activeTab === 'dashboard' && 'Technician Operational Overview'}
                {activeTab === 'assigned_jobs' && 'Assigned Field Jobs'}
                {activeTab === 'todays_jobs' && "Today's Field Schedule"}
                {activeTab === 'reports' && 'Daily Service & Progress Reports'}
                {activeTab === 'history' && 'Job History'}
                {activeTab === 'query' && 'Field Support & Dispatch Query Helpdesk'}
                {activeTab === 'analytics' && 'Personal Performance & Analytics Scorecard'}
                {activeTab === 'notifications' && 'System Notifications'}
                {activeTab === 'profile' && 'Technician Profile'}
                {activeTab === 'settings' && 'Portal Settings & Sync'}
              </h1>
              <p className="text-xs text-zinc-500 mt-1">
                SK Technology Enterprise Field Service Management System.
              </p>
            </div>

            <div className="flex items-center space-x-3">
              {/* 📶 Offline Field Sync Mode Status Pill */}
              <button
                onClick={() => setIsOnline(!isOnline)}
                className={`px-3 py-1.5 rounded-xl border text-xs font-mono font-bold flex items-center space-x-2 transition-all cursor-pointer shadow-2xs ${isOnline
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                    : 'bg-amber-50 text-amber-800 border-amber-300 hover:bg-amber-100 animate-pulse'
                  }`}
                title="Click to toggle Field Network Connection (Simulate Offline Work in Basements)"
              >
                <span className={`w-2 h-2 rounded-full ${isOnline ? 'bg-emerald-500' : 'bg-amber-500 animate-ping'}`} />
                <span>{isOnline ? 'NETWORK: ONLINE & SYNCED' : 'OFFLINE MODE (LOCAL QUEUE ACTIVE)'}</span>
              </button>
            </div>
          </div>

          {/* Module Views Routing */}
          {activeTab === 'dashboard' && (
            <DashboardModule
              jobs={jobs}
              isLoading={isLoadingData}
              onSelectJob={handleSelectJob}
              onOpenWorkflow={handleOpenWorkflow}
            />
          )}

          {activeTab === 'assigned_jobs' && (
            <AssignedJobsModule onOpenWorkflow={handleOpenWorkflow} />
          )}

          {activeTab === 'todays_jobs' && (
            <TodaysScheduleModule
              jobs={jobs}
              onSelectJob={handleSelectJob}
              onOpenWorkflow={handleOpenWorkflow}
            />
          )}

          {activeTab === 'reports' && (
            <DailyReportsModule
              jobs={jobs}
              isLoading={isLoadingData}
              onOpenWorkflow={handleOpenWorkflow}
            />
          )}

          {activeTab === 'history' && (
            <JobHistoryModule
              jobs={jobs}
              onSelectJob={handleSelectJob}
            />
          )}

          {activeTab === 'query' && (
            <QueryModule />
          )}

          {activeTab === 'analytics' && (
            <PerformanceAnalyticsModule
              jobs={jobs}
              profile={profile}
            />
          )}

          {activeTab === 'notifications' && (
            <NotificationsModule
              notifications={notifications}
              onMarkRead={handleMarkNotificationRead}
            />
          )}

          {activeTab === 'profile' && profile && (
            <ProfileModule
              profile={profile}
              onUpdateStatus={handleUpdateProfileStatus}
            />
          )}

          {activeTab === 'settings' && (
            <SettingsModule
              autoSync={autoSyncEnabled}
              onAutoSyncChange={setAutoSyncEnabled}
              onSyncError={(title, message) => setGlobalError({
                id: `sync-${Date.now()}`,
                type: 'SYNC',
                title,
                message,
              })}
            />
          )}
        </main>
      </div>

      {/* Unified App-Wide Error Banner */}
      <ErrorBanner
        error={globalError}
        onDismiss={() => setGlobalError(null)}
      />

      {/* Global Modals & Drawers */}
      <JobDetailDrawer
        job={selectedJob}
        isOpen={isDetailDrawerOpen}
        onClose={() => setIsDetailDrawerOpen(false)}
        onUpdateStatus={handleUpdateStatus}
        onUploadPhoto={handleUploadPhoto}
      />

      <WorkflowModal
        job={workflowJob}
        isOpen={isWorkflowOpen}
        onClose={() => setIsWorkflowOpen(false)}
        onUpdateStatus={handleUpdateStatus}
        onSaveInspection={handleSaveInspection}
        onAddDailyReport={handleAddDailyReport}
        onUploadPhoto={handleUploadPhoto}
        onCompleteJob={handleCompleteJob}
      />
    </div>
  );
}

export default App;
