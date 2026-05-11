import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
  getLeaderboard,
  getQuizLeaderboard,
  getMyRank,
} from '../controllers/leaderboardController.js';

const router = express.Router();

router.get('/', protect, getLeaderboard);
router.get('/me', protect, getMyRank);
router.get('/quiz/:quizId', protect, getQuizLeaderboard);

export default router;
