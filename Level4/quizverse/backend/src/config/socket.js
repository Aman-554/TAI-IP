import { Server } from 'socket.io';

/**
 * Initialize Socket.io on an existing HTTP server.
 * Returns the io instance so controllers can emit events.
 */
export const initSocket = (httpServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: process.env.FRONTEND_URL || 'http://localhost:5173',
      credentials: true,
    },
  });

  io.on('connection', (socket) => {
    console.log(`🔌 Socket connected: ${socket.id}`);

    // User-specific room (for notifications)
    socket.on('join-user-room', (userId) => {
      socket.join(`user-${userId}`);
    });

    // Quiz room for live play
    socket.on('join-quiz-room', (quizId) => {
      socket.join(`quiz-${quizId}`);
      console.log(`Socket ${socket.id} joined quiz-${quizId}`);
    });

    socket.on('leave-quiz-room', (quizId) => {
      socket.leave(`quiz-${quizId}`);
    });

    // Answer submission broadcast
    socket.on('submit-answer', (data) => {
      socket.to(`quiz-${data.quizId}`).emit('player-answered', {
        userId: data.userId,
        questionIndex: data.questionIndex,
      });
    });

    // Quiz completion
    socket.on('quiz-complete', (data) => {
      io.to(`quiz-${data.quizId}`).emit('player-finished', {
        userId: data.userId,
        score: data.score,
      });
    });

    socket.on('disconnect', () => {
      console.log(`🔌 Socket disconnected: ${socket.id}`);
    });
  });

  return io;
};
