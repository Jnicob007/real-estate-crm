import express from 'express';
import cors from 'cors';
import helmet from 'helmet';

export const app = express();

app.use(helmet());
app.use(cors({ origin: process.env.WEB_ORIGIN ?? 'http://localhost:5173' }));
app.use(express.json({ limit: '1mb' }));

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

// TODO: Rejestruj routery modułów po dodaniu implementacji.
