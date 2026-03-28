import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
import { requestLogger } from './middleware/requestLogger';
import { errorHandler } from './middleware/errorHandler';
import agentsRouter from './routes/agents';
import inboxRouter from './routes/inbox';
import messagesRouter from './routes/messages';
import tasksRouter from './routes/tasks';
import dashboardRouter from './routes/dashboard';
import alertsRouter from './routes/alerts';

const app = express();

app.use(cors({ origin: `http://localhost:${process.env.FRONTEND_PORT ?? 3000}` }));
app.use(express.json());
app.use(requestLogger);

app.use('/api/agents', agentsRouter);
app.use('/api/inbox', inboxRouter);
app.use('/api/messages', messagesRouter);
app.use('/api/tasks', tasksRouter);
app.use('/api/dashboard', dashboardRouter);
app.use('/api/alerts', alertsRouter);

app.use(errorHandler);

export default app;
