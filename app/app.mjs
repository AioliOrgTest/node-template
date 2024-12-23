import path from 'node:path'
import { fileURLToPath } from 'node:url';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import compress from 'compression';
import helmet from 'helmet';
import health from './routes/health.mjs';
import api from './routes/api.mjs';
import requestLogger from './middlewares/expressLogger.mjs';

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.disable('x-powered-by');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger);
app.use(cookieParser());
app.use(compress());
app.use(helmet());
app.use(cors());

app.use(express.static(path.join(__dirname, '../public')));
app.use(health);
app.use('/api', api);

app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Not Found' });
})

export default app;
