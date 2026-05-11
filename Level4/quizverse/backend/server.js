import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { httpServer } from './src/app.js';

dotenv.config();

const PORT = process.env.PORT || 5000;

// Connect to MongoDB
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/quizverse';

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('✅ MongoDB connected successfully');
    console.log(`📚 Database: ${mongoose.connection.name}`);
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err.message);
    console.log('\n💡 Troubleshooting:');
    console.log('1. Make sure MongoDB is running');
    console.log('2. Run: mongod --dbpath C:\\data\\db');
    console.log('3. Or use MongoDB Atlas in .env file');
    process.exit(1);
  });

// Start server
httpServer.listen(PORT, () => {
  console.log(`\n🚀 ========================================`);
  console.log(`🎯 QuizVerse Backend Server`);
  console.log(`🚀 ========================================`);
  console.log(`📡 Server running on http://localhost:${PORT}`);
  console.log(`📝 Health check: http://localhost:${PORT}/health`);
  console.log(`\n📋 Available API Endpoints:`);
  console.log(`   🔐 POST   /api/auth/register`);
  console.log(`   🔐 POST   /api/auth/login`);
  console.log(`   🔐 GET    /api/auth/me`);
  console.log(`   📚 GET    /api/quizzes`);
  console.log(`   📊 GET    /api/leaderboard`);
  console.log(`\n🚀 ========================================\n`);
});