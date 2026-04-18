import bcrypt from 'bcryptjs';
import { connectDatabase } from './db.js';
import { config } from './config.js';
import { User } from './models/User.js';

async function run() {
  await connectDatabase();

  const existed = await User.findOne({ username: config.seedAdminUsername });
  if (!existed) {
    const passwordHash = await bcrypt.hash(config.seedAdminPassword, 10);
    await User.create({
      name: config.seedAdminName,
      username: config.seedAdminUsername,
      passwordHash,
      role: 'admin'
    });
    console.log('✅ Seeded admin account');
  } else {
    console.log('ℹ️ Admin account already exists');
  }

  process.exit(0);
}

run().catch((error) => {
  console.error('❌ Seed failed:', error);
  process.exit(1);
});
