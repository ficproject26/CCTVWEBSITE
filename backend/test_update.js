const mongoose = require('mongoose');

async function test() {
  await mongoose.connect('mongodb://127.0.0.1:27017/cctv-ecommerce');
  const Job = mongoose.model('Job', new mongoose.Schema({}, { strict: false }));
  
  const o = {
    id: 'SK-ORD-82665',
    email: 'moorthy.antigraviity@gmail.com',
    status: 'Approved'
  };

  const emailQuery = o.email ? o.email.toLowerCase() : '';
  const associatedJob = await Job.findOne({
    $or: [
      { jobCode: o.id },
      { 'customer.email': emailQuery }
    ]
  });

  console.log('Before update: status =', associatedJob ? associatedJob.status : 'null');

  if (associatedJob) {
    if (o.status === 'Approved') {
      associatedJob.status = 'ASSIGNED';
    }
    await associatedJob.save();
    console.log('Saved successfully');
  }

  const updatedJob = await Job.findOne({ 'customer.email': emailQuery }).lean();
  console.log('After update: status =', updatedJob.status);

  await mongoose.disconnect();
}

test().catch(console.error);
