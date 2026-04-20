import express from 'express';
import tableRouter from './tableRoutes.js';
import authRouter from './authRoutes.js';
import productRouter from './productRoutes.js';

const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'API routes working',
  });
});

router.use('/tables', tableRouter);
router.use('/auth', authRouter);
router.use('/products', productRouter);

export default router;
