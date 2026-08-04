import { Router, Request, Response } from 'express';
import Job from '../models/Job';

const router = Router();

// GET all jobs (for Technician / Admin)
router.get('/', async (req: Request, res: Response) => {
  try {
    const { status, priority, search, technicianId } = req.query;
    let filter: any = {};

    if (technicianId) {
      filter['assignedTechnician.id'] = technicianId;
    }

    if (status && status !== 'ALL') {
      filter.status = status;
    }
    if (priority && priority !== 'ALL') {
      filter.priority = priority;
    }
    if (search) {
      filter.$or = [
        { title: { $regex: search as string, $options: 'i' } },
        { jobCode: { $regex: search as string, $options: 'i' } },
        { 'customer.name': { $regex: search as string, $options: 'i' } },
      ];
    }

    const jobs = await Job.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, count: jobs.length, data: jobs });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET single job by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }
    res.json({ success: true, data: job });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST create new job
router.post('/', async (req: Request, res: Response) => {
  try {
    const emailQuery = req.body.customer?.email ? req.body.customer.email.toLowerCase() : '';
    const jobCodeQuery = req.body.jobCode || '';
    
    // Find if a job already exists for the same code or customer email
    let existingJob = null;
    if (jobCodeQuery || emailQuery) {
      existingJob = await Job.findOne({
        $or: [
          ...(jobCodeQuery ? [{ jobCode: jobCodeQuery }] : []),
          ...(emailQuery ? [{ 'customer.email': emailQuery }] : [])
        ]
      });
    }

    if (existingJob) {
      // Update the existing job's details and technician
      Object.assign(existingJob, req.body);
      const savedJob = await existingJob.save();
      return res.status(200).json({ success: true, data: savedJob });
    }

    const jobCode = `SK-JOB-${Math.floor(1000 + Math.random() * 9000)}`;
    const newJob = new Job({ ...req.body, jobCode });
    const savedJob = await newJob.save();
    res.status(201).json({ success: true, data: savedJob });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// PUT update job status / details
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    // Support pushing daily report
    if (req.body.dailyReport) {
      if (!job.dailyReports) job.dailyReports = [];
      job.dailyReports.push({
        ...req.body.dailyReport,
        id: `REP-${Date.now()}`
      });
      delete req.body.dailyReport;
    }

    // Support pushing photo
    if (req.body.photo) {
      const newPhoto = {
        ...req.body.photo,
        id: `PHO-${Date.now()}`
      };
      if (req.body.photo.type === 'BEFORE') {
        if (!job.beforePhotos) job.beforePhotos = [];
        job.beforePhotos.push(newPhoto);
      } else {
        if (!job.afterPhotos) job.afterPhotos = [];
        job.afterPhotos.push(newPhoto);
      }
      delete req.body.photo;
    }

    // Support saving inspection
    if (req.body.inspection) {
      job.inspection = req.body.inspection;
      delete req.body.inspection;
    }

    // Update other fields
    Object.assign(job, req.body);
    const updatedJob = await job.save();

    res.json({ success: true, data: updatedJob });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
});

export default router;
