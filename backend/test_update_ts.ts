import mongoose from 'mongoose';
import Job from './src/models/Job';

async function test() {
  await mongoose.connect('mongodb://127.0.0.1:27017/cctv-ecommerce');
  console.log('Connected');

  const emailQuery = 'moorthy.antigraviity@gmail.com';
  const associatedJob = await Job.findOne({ 'customer.email': emailQuery });

  console.log('Before update: status =', associatedJob ? associatedJob.status : 'null');

  if (associatedJob) {
    associatedJob.status = 'ASSIGNED';
    await associatedJob.save();
    console.log('Saved successfully');
  }

  const updatedJob = await Job.findOne({ 'customer.email': emailQuery }).lean();
  console.log('After update: status =', updatedJob ? updatedJob.status : 'null');

  await mongoose.disconnect();
}

test().catch(console.error);
