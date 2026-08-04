import type {
  Job,
  JobFilterOptions,
  PaginatedJobsResponse,
  JobStatus,
  DailyReport,
  InspectionSummary,
  NotificationItem,
  TechnicianProfile
} from '../types/job';

// Initial Production Mock State
const MOCK_JOBS_DATABASE: Job[] = [
  {
    id: 'job-101',
    jobCode: 'SK-JOB-8492',
    title: 'Enterprise HVAC Control Unit Commissioning',
    category: 'HVAC Systems',
    status: 'IN_PROGRESS',
    priority: 'URGENT',
    scheduledDate: '2026-07-28',
    startDate: '2026-07-28',
    targetCompletionDate: '2026-07-31',
    estimatedDays: 4,
    scheduledTimeSlot: '09:00 AM - 11:30 AM',
    estimatedDuration: '2.5 hrs',
    assignedTechnician: {
      id: 'tech-01',
      name: 'Alex Vance',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
      phone: '+1 (555) 901-2233',
    },
    customer: {
      name: 'Apex Industrial Logistics',
      phone: '+1 (555) 234-8901',
      email: 'ops@apexlogistics.io',
      address: '742 Enterprise Blvd, Suite 400',
      city: 'Austin, TX',
      postalCode: '78701',
    },
    installation: {
      equipmentType: 'Variable Air Volume (VAV) Controller',
      modelNumber: 'SK-VAV-9000X',
      serialNumber: 'SN-9948201-B',
      locationDetails: 'Roof Top Level 4 - Mechanical Room B',
      specialInstructions: 'High voltage unit. Ensure safety lockout/tagout protocol is signed before main circuit access.',
    },
    inspection: {
      inspectedBy: 'Alex Vance',
      inspectionDate: '2026-07-28',
      checklistPassed: true,
      safetyVerified: true,
      voltageReading: '480V 3-Phase',
      groundingStatus: 'Passed (0.02 Ohms)',
      checklistItems: [
        { id: 'chk-1', label: 'Main circuit isolation breaker verified open', passed: true },
        { id: 'chk-2', label: 'Grounding bonding conductor continuity test', passed: true },
        { id: 'chk-3', label: 'Physical mounting brackets torque to 45 Nm', passed: true },
        { id: 'chk-4', label: 'Control signal wires polarity & shielding check', passed: true },
      ],
      notes: 'Pre-installation site wiring verified. Zero ground fault detected.',
    },
    dailyReports: [
      {
        id: 'rep-1',
        date: '2026-07-28 09:30 AM',
        technicianName: 'Alex Vance',
        hoursWorked: 2.0,
        workDone: 'Arrived at site. Mounted SK-VAV-9000X chassis. Connected primary power feeder lines.',
        materialsUsed: ['SK-VAV-9000X Unit', '20ft Shielded CAT6', 'M10 Mounting Bolts'],
        issuesEncountered: 'Minor dust accumulation in junction box clean up required.',
        statusUpdate: 'Mounting completed. Ready for calibration phase.',
        createdAt: '2026-07-28T09:30:00Z',
      },
    ],
    beforePhotos: [
      {
        id: 'photo-1',
        url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80',
        caption: 'Initial wiring panel before terminal upgrade',
        uploadedAt: '2026-07-28 09:15 AM',
        type: 'BEFORE',
      },
    ],
    afterPhotos: [],
    activities: [
      {
        id: 'act-1',
        timestamp: '2026-07-28 09:00 AM',
        user: 'Alex Vance',
        action: 'Job Accepted & Started',
        details: 'Checked in at site location with GPS timestamp',
      },
      {
        id: 'act-2',
        timestamp: '2026-07-28 09:15 AM',
        user: 'Alex Vance',
        action: 'Before Photo Uploaded',
        details: 'Uploaded before inspection photo of junction panel',
      },
    ],
    createdAt: '2026-07-25T08:00:00Z',
    updatedAt: '2026-07-28T09:30:00Z',
  },
  {
    id: 'job-102',
    jobCode: 'SK-JOB-8493',
    title: 'Smart Meter Gateway & Fiber Termination',
    category: 'Electrical & Telemetry',
    status: 'PENDING',
    priority: 'HIGH',
    scheduledDate: '2026-07-28',
    scheduledTimeSlot: '01:00 PM - 03:00 PM',
    estimatedDuration: '2.0 hrs',
    assignedTechnician: {
      id: 'tech-01',
      name: 'Alex Vance',
    },
    customer: {
      name: 'Vanguard Data Systems',
      phone: '+1 (555) 887-1234',
      email: 'facilities@vanguarddata.com',
      address: '102 Tech Heights Plaza',
      city: 'Austin, TX',
      postalCode: '78702',
    },
    installation: {
      equipmentType: 'Optical Gateway Transceiver',
      modelNumber: 'SK-OGT-500',
      serialNumber: 'SN-4410294-A',
      locationDetails: 'Basement Server Room 02 - Rack 14',
      specialInstructions: 'Escort required at security desk floor 1.',
    },
    beforePhotos: [],
    afterPhotos: [],
    dailyReports: [],
    activities: [
      {
        id: 'act-3',
        timestamp: '2026-07-27 04:30 PM',
        user: 'Dispatcher Desk',
        action: 'Job Assigned',
        details: 'Assigned to Alex Vance for afternoon execution',
      },
    ],
    createdAt: '2026-07-26T10:00:00Z',
    updatedAt: '2026-07-26T10:00:00Z',
  },
  {
    id: 'job-103',
    jobCode: 'SK-JOB-8488',
    title: 'Solar Inverter Module Replacement & Diagnostics',
    category: 'Renewable Power',
    status: 'COMPLETED',
    priority: 'MEDIUM',
    scheduledDate: '2026-07-27',
    scheduledTimeSlot: '10:00 AM - 12:30 PM',
    estimatedDuration: '2.5 hrs',
    assignedTechnician: {
      id: 'tech-01',
      name: 'Alex Vance',
    },
    customer: {
      name: 'Horizon Energy Park',
      phone: '+1 (555) 991-0022',
      email: 'maintenance@horizonpark.org',
      address: '55 Green Energy Way',
      city: 'Round Rock, TX',
      postalCode: '78664',
    },
    installation: {
      equipmentType: 'Grid-Tied Inverter 50kW',
      modelNumber: 'SK-INV-50K-PRO',
      serialNumber: 'SN-7721839-C',
      locationDetails: 'Exterior South Power Substation 01',
    },
    inspection: {
      inspectedBy: 'Alex Vance',
      inspectionDate: '2026-07-27',
      checklistPassed: true,
      safetyVerified: true,
      checklistItems: [
        { id: 'chk-1', label: 'DC disconnect switch isolated', passed: true },
        { id: 'chk-2', label: 'AC grid frequency sync test', passed: true },
      ],
      notes: 'All terminal torques set to manufacturer specification (35 Nm). Output voltage balanced.',
    },
    beforePhotos: [
      {
        id: 'photo-b1',
        url: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=600&q=80',
        caption: 'Damaged inverter component board',
        uploadedAt: '2026-07-27 10:10 AM',
        type: 'BEFORE',
      },
    ],
    afterPhotos: [
      {
        id: 'photo-a1',
        url: 'https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?auto=format&fit=crop&w=600&q=80',
        caption: 'Newly installed inverter module functioning smoothly',
        uploadedAt: '2026-07-27 12:15 PM',
        type: 'AFTER',
      },
    ],
    dailyReports: [
      {
        id: 'rep-103',
        date: '2026-07-27 12:00 PM',
        technicianName: 'Alex Vance',
        hoursWorked: 2.5,
        workDone: 'Replaced inverter module. Calibrated string voltages.',
        materialsUsed: ['Inverter Board SK-INV-50K', 'Thermal Paste'],
        statusUpdate: 'Work completed. Commissioning report signed by client.',
        createdAt: '2026-07-27T12:00:00Z',
      },
    ],
    completionSummary: {
      completedAt: '2026-07-27 12:25 PM',
      notes: 'Job completed ahead of estimated schedule. Grid handshake verified cleanly.',
      qualityPassed: true,
    },
    activities: [
      {
        id: 'act-4',
        timestamp: '2026-07-27 12:25 PM',
        user: 'Alex Vance',
        action: 'Job Completed',
        details: 'Signed off by site manager',
      },
    ],
    createdAt: '2026-07-24T09:00:00Z',
    updatedAt: '2026-07-27T12:25:00Z',
  },
];

const MOCK_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    title: 'Urgent Dispatch Update',
    message: 'Job SK-JOB-8492 marked as High Priority. Customer requested arrival confirmation.',
    timestamp: '10 minutes ago',
    read: false,
    type: 'URGENT',
    jobId: 'job-101',
  },
  {
    id: 'notif-2',
    title: 'New Job Assigned',
    message: 'Smart Meter Gateway & Fiber Termination assigned to your queue for 01:00 PM.',
    timestamp: '1 hour ago',
    read: false,
    type: 'ASSIGNMENT',
    jobId: 'job-102',
  },
  {
    id: 'notif-3',
    title: 'System Maintenance Notice',
    message: 'Offline sync buffer activated for field technicians. All data automatically persists locally.',
    timestamp: 'Yesterday',
    read: true,
    type: 'SYSTEM',
  },
];

const MOCK_TECHNICIAN_PROFILE: TechnicianProfile = {
  id: 'tech-01',
  name: 'Alex Vance',
  email: 'alex.vance@sktechnology.com',
  phone: '+1 (555) 901-2233',
  role: 'Senior Lead Field Engineer',
  badgeNumber: 'SK-TECH-9042',
  certifications: [
    'HVAC Master Master Certificate (EPA 608)',
    'Fiber Optic Installer (FOI Certified)',
    'High Voltage Safety & OSHA 30',
  ],
  vehicleNumber: 'Van #SK-409',
  status: 'ON_DUTY',
  rating: 4.9,
  completedJobsCount: 148,
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
};

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const JobsApiService = {
  async getAssignedJobs(options: JobFilterOptions): Promise<PaginatedJobsResponse> {
    const techId = localStorage.getItem('user_id');
    if (!techId) {
      return {
        data: [],
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 1,
        stats: { totalAssigned: 0, pendingCount: 0, inProgressCount: 0, completedCount: 0, onHoldCount: 0 }
      };
    }

    try {
      const url = `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/jobs?technicianId=${techId}&status=${options.status !== 'ALL' ? options.status : ''}&search=${options.searchQuery}`;
      const res = await fetch(url);
      const resData = await res.json();
      const rawJobs = resData.data || [];

      // Map backend Mongoose jobs schema to what the Technician frontend expects
      const mappedJobs = rawJobs.map((j: any) => ({
        id: j._id,
        jobCode: j.jobCode,
        title: j.title,
        category: j.category,
        status: j.status,
        priority: j.priority,
        scheduledDate: j.scheduledDate,
        startDate: j.startDate,
        targetCompletionDate: j.targetCompletionDate,
        estimatedDays: j.estimatedDays || 1,
        scheduledTimeSlot: j.scheduledTimeSlot || '09:00 AM - 12:00 PM',
        estimatedDuration: j.estimatedDuration || '3 hrs',
        assignedTechnician: j.assignedTechnician,
        customer: j.customer || {
          name: 'N/A',
          phone: 'N/A',
          email: 'N/A',
          address: 'N/A',
          city: 'N/A',
          postalCode: 'N/A'
        },
        installation: j.installation || {
          equipmentType: 'General Hardware',
          modelNumber: 'N/A',
          serialNumber: 'N/A',
          locationDetails: 'N/A',
          specialInstructions: ''
        },
        scopeOfWork: j.scopeOfWork || [],
        equipmentList: j.equipmentList || [],
        notes: j.notes || [],
        fieldNotes: j.fieldNotes || '',
        beforePhotos: j.beforePhotos || [],
        afterPhotos: j.afterPhotos || [],
        dailyReports: j.dailyReports || [],
        activities: j.activities || [],
        createdAt: j.createdAt || new Date().toISOString(),
        updatedAt: j.updatedAt || new Date().toISOString()
      }));

      // Filter priority manually if needed since backend currently doesn't query filter it
      let filtered = mappedJobs;
      if (options.priority !== 'ALL') {
        filtered = filtered.filter((j: any) => j.priority === options.priority);
      }

      const stats = {
        totalAssigned: mappedJobs.length,
        pendingCount: mappedJobs.filter((j: any) => j.status === 'PENDING').length,
        inProgressCount: mappedJobs.filter((j: any) => j.status === 'IN_PROGRESS' || j.status === 'ACCEPTED').length,
        completedCount: mappedJobs.filter((j: any) => j.status === 'COMPLETED').length,
        onHoldCount: mappedJobs.filter((j: any) => j.status === 'ON_HOLD').length,
      };

      const startIndex = (options.page - 1) * options.limit;
      const paginatedData = filtered.slice(startIndex, startIndex + options.limit);
      const totalPages = Math.ceil(filtered.length / options.limit) || 1;

      return {
        data: paginatedData,
        total: filtered.length,
        page: options.page,
        limit: options.limit,
        totalPages,
        stats,
      };
    } catch (err) {
      console.error('Error fetching dynamic technician jobs:', err);
      throw err;
    }
  },

  async getNotifications(): Promise<NotificationItem[]> {
    return [];
  },

  async markNotificationRead(id: string): Promise<NotificationItem[]> {
    return [];
  },

  async getTechnicianProfile(): Promise<TechnicianProfile> {
    const id = localStorage.getItem('user_id') || 'tech-01';
    const name = localStorage.getItem('user_name') || 'Technician';
    const email = localStorage.getItem('user_email') || 'tech@sktechnology.in';
    const phone = localStorage.getItem('user_phone') || '+91 99999 99999';

    return {
      id,
      name,
      email,
      phone,
      role: 'Field Service Technician',
      badgeNumber: `SK-TECH-${id.substring(0, 4).toUpperCase()}`,
      certifications: ['Certified Field Tech Level 4', 'LOTO Safety Certified'],
      vehicleNumber: 'Ford Transit #SK-408',
      status: 'ON_DUTY',
      rating: 5.0,
      completedJobsCount: 0,
      avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80',
    };
  },

  async updateTechnicianStatus(status: 'ON_DUTY' | 'OFF_DUTY' | 'ON_JOB'): Promise<TechnicianProfile> {
    const profile = await this.getTechnicianProfile();
    profile.status = status;
    return profile;
  },

  mapJob(j: any): Job {
    return {
      id: j._id || j.id,
      jobCode: j.jobCode,
      title: j.title,
      category: j.category,
      status: j.status,
      priority: j.priority,
      scheduledDate: j.scheduledDate,
      startDate: j.startDate,
      targetCompletionDate: j.targetCompletionDate,
      estimatedDays: j.estimatedDays || 1,
      scheduledTimeSlot: j.scheduledTimeSlot || '09:00 AM - 12:00 PM',
      estimatedDuration: j.estimatedDuration || '3 hrs',
      assignedTechnician: j.assignedTechnician,
      customer: j.customer || {
        name: 'N/A',
        phone: 'N/A',
        email: 'N/A',
        address: 'N/A',
        city: 'N/A',
        postalCode: 'N/A'
      },
      installation: j.installation || {
        equipmentType: 'General Hardware',
        modelNumber: 'N/A',
        serialNumber: 'N/A',
        locationDetails: 'N/A',
        specialInstructions: ''
      },
      scopeOfWork: j.scopeOfWork || [],
      equipmentList: j.equipmentList || [],
      notes: j.notes || [],
      fieldNotes: j.fieldNotes || '',
      beforePhotos: j.beforePhotos || [],
      afterPhotos: j.afterPhotos || [],
      dailyReports: j.dailyReports || [],
      activities: j.activities || [],
      createdAt: j.createdAt || new Date().toISOString(),
      updatedAt: j.updatedAt || new Date().toISOString()
    };
  },

  async updateJobStatus(jobId: string, status: JobStatus): Promise<Job> {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/jobs/${jobId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      const resData = await res.json();
      return this.mapJob(resData.data);
    } catch (err) {
      console.error('Error updating job status:', err);
      throw err;
    }
  },

  async uploadJobPhoto(jobId: string, photoUrl: string, caption: string, type: 'BEFORE' | 'AFTER'): Promise<Job> {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/jobs/${jobId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          status: type === 'BEFORE' ? 'BEFORE_PHOTOS_DONE' : 'AFTER_PHOTOS_DONE',
          photo: {
            url: photoUrl,
            caption: caption,
            type: type,
            uploadedAt: new Date().toLocaleTimeString()
          }
        })
      });
      const resData = await res.json();
      return this.mapJob(resData.data);
    } catch (err) {
      console.error('Error uploading photo:', err);
      throw err;
    }
  },

  async completeJob(jobId: string, completionNotes: string, signatureData?: string): Promise<Job> {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/jobs/${jobId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          status: 'COMPLETED',
          fieldNotes: completionNotes
        })
      });
      const resData = await res.json();
      return this.mapJob(resData.data);
    } catch (err) {
      console.error('Error completing job:', err);
      throw err;
    }
  },

  async saveInspectionSummary(jobId: string, summary: InspectionSummary): Promise<Job> {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/jobs/${jobId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          status: 'INSPECTED',
          inspection: summary 
        })
      });
      const resData = await res.json();
      return this.mapJob(resData.data);
    } catch (err) {
      console.error('Error saving inspection summary:', err);
      throw err;
    }
  },

  async addDailyReport(jobId: string, report: Omit<DailyReport, 'id' | 'createdAt'>): Promise<Job> {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/jobs/${jobId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          status: 'DAILY_REPORTED',
          dailyReport: report 
        })
      });
      const resData = await res.json();
      return this.mapJob(resData.data);
    } catch (err) {
      console.error('Error adding daily report:', err);
      throw err;
    }
  },

  async autoAssignNextJob(technicianId: string): Promise<{ success: boolean; assignedJob?: Job; message: string }> {
    return { success: false, message: 'Auto-assignment is disabled. Jobs must be assigned by Admin.' };
  }
};
