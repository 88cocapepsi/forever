import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import { connectDb } from './db.js';
import { config } from './config.js';
import { apiRouter } from './routes/index.js';

const app = express();

app.use(cors({ origin: config.corsOrigin === '*' ? true : config.corsOrigin }));
app.use(express.json());
app.use(morgan('dev'));

app.get('/health', (_req, res) => {
  res.json({ ok: true, app: 'forever-pos-backend', now: new Date().toISOString() });
});

app.use('/api', apiRouter);

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ message: err.message || 'Internal server error' });
});

connectDb().then(() => {
  app.listen(config.port, () => {
    console.log(`Forever POS backend running on port ${config.port}`);
  });
});
