import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: process.env.PORT || 5000,
  mongoUri: process.env.MONGODB_URI || '',
  jwtSecret: process.env.JWT_SECRET || 'dev_secret_change_me',
  corsOrigin: process.env.CORS_ORIGIN || '*',
  seedAdminName: process.env.SEED_ADMIN_NAME || 'Admin FOREVER',
  seedAdminUsername: process.env.SEED_ADMIN_USERNAME || 'admin',
  seedAdminPassword: process.env.SEED_ADMIN_PASSWORD || '123456'
};
