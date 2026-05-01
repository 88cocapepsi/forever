import mongoose from 'mongoose';
import { config } from './config.js';

export async function connectDatabase() {
  if (!config.mongoUri) {
    throw new Error('Missing MONGODB_URI in environment variables');
  }

  mongoose.set('strictQuery', true);
  await mongoose.connect(config.mongoUri);
  console.log('✅ MongoDB connected');
}
