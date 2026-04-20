import express from 'express';
import tableRouter from './tableRoutes.js';

const router = express.Router();

// test route
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'API routes working',
  });
});

// tables API
router.use('/tables', tableRouter);

export default router;
