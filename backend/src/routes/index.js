import express from 'express';
import tableRouter from './tableRoutes.js';

const router = express.Router();

// Health check route cho nhóm routes nếu cần test nhanh
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'API routes working',
  });
});

// Tables
router.use('/tables', tableRouter);

export default router;
