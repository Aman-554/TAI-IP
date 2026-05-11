import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import { createServer } from 'http';
import { Server } from 'socket.io';
import mongoose from 'mongoose';

// Import routes
import authRoutes from './routes/authRoutes.js';
import quizRoutes from './routes/quizRoutes.js';
import questionRoutes from './routes/questionRoutes.js';
import resultRoutes from './routes/resultRoutes.js';
import leaderboardRoutes from './routes/leaderboardRoutes.js';
import userRoutes from './routes/userRoutes.js';
import passport from './config/passport.js';

// Import middleware
import { errorHandler } from './middleware/errorMiddleware.js';

const app = express();
const httpServer = createServer(app);

// Socket.io setup
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true
  }
});

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());
app.use(morgan('dev'));
app.use('/api', limiter);
app.use(passport.initialize());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/quizzes', quizRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/results', resultRoutes);
app.use('/api/leaderboard', leaderboardRoutes);
app.use('/api/users', userRoutes);

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date() });
});

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log('🔌 New client connected:', socket.id);

  socket.on('join-quiz-room', (quizId) => {
    socket.join(`quiz-${quizId}`);
    console.log(`Socket ${socket.id} joined quiz-${quizId}`);
  });

  socket.on('leave-quiz-room', (quizId) => {
    socket.leave(`quiz-${quizId}`);
  });

  socket.on('submit-answer', (data) => {
    socket.to(`quiz-${data.quizId}`).emit('player-answered', {
      userId: data.userId,
      answer: data.answer
    });
  });

  socket.on('quiz-complete', (data) => {
    io.to(`quiz-${data.quizId}`).emit('player-finished', {
      userId: data.userId,
      score: data.score,
    });
  });

  socket.on('disconnect', () => {
    console.log('🔌 Client disconnected:', socket.id);
  });
});

// Store io instance for use in controllers
app.set('io', io);

// Error handling middleware
app.use(errorHandler);

export { httpServer, io };