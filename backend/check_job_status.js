const mongoose = require('mongoose');

async function test() {
  await mongoose.connect('mongodb://127.0.0.1:27017/cctv-ecommerce');
  const Job = mongoose.model('Job', new mongoose.Schema({}, { strict: false }));
  const job = await Job.findOne({ 'customer.email': 'moorthy.antigraviity@gmail.com' }).lean();
  console.log('Current job status in DB:', job ? job.status : 'null');
  await mongoose.disconnect();
}

test();
