import express from 'express';
import tableRouter from './tableRoutes.js';

const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'API routes working',
  });
});

router.use('/tables', tableRouter);

export default router;
