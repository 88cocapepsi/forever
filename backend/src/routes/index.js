import express from 'express';
import { authRouter } from './authRoutes.js';
import { productRouter } from './productRoutes.js';
import { tableRouter } from './tableRoutes.js';
import { orderRouter } from './orderRoutes.js';
import { reportRouter } from './reportRoutes.js';
import { warehouseRouter } from './warehouseRoutes.js';
import { notificationRouter } from './notificationRoutes.js';

export const apiRouter = express.Router();

apiRouter.get('/health', (_req, res) => {
  res.json({ ok: true, message: 'FOREVER POS API is running' });
});

apiRouter.use('/auth', authRouter);
apiRouter.use('/products', productRouter);
apiRouter.use('/tables', tableRouter);
apiRouter.use('/orders', orderRouter);
apiRouter.use('/reports', reportRouter);
apiRouter.use('/warehouse', warehouseRouter);
apiRouter.use('/notifications', notificationRouter);
