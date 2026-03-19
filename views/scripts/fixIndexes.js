const mongoose = require('mongoose');
require('dotenv').config();
const Employer = require('../models/employers');

async function run() {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.error('MONGO_URI not set in environment. Aborting.');
    process.exit(1);
  }

  await mongoose.connect(uri);
  const col = Employer.collection;

  try {
    // Attempt to drop the old camelCase index if it exists
    await col.dropIndex('companyEmail_1');
    console.log('Dropped index companyEmail_1');
  } catch (e) {
    console.log('No index named companyEmail_1 to drop or drop failed:', e.message);
  }

  try {
    // Also attempt to drop any existing index on the lowercase field to avoid name conflicts
    await col.dropIndex('companyemail_1');
    console.log('Dropped index companyemail_1');
  } catch (e) {
    console.log('No index named companyemail_1 to drop or drop failed:', e.message);
  }

  try {
    // Create the correct index on `companyemail` (lowercase) as unique + sparse
    await col.createIndex({ companyemail: 1 }, { unique: true, sparse: true });
    console.log('Created index on companyemail (unique, sparse)');
  } catch (e) {
    console.error('Failed creating index on companyemail:', e.message);
    process.exitCode = 2;
  }

  await mongoose.disconnect();
}

run().catch(err => {
  console.error('Script error:', err && err.stack ? err.stack : err);
  process.exit(1);
});
