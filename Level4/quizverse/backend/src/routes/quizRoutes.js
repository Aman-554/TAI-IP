import express from 'express';
import { protect, adminOnly } from '../middleware/authMiddleware.js';
import {
  getAllQuizzes,
  getQuizById,
  createQuiz,
  updateQuiz,
  deleteQuiz,
  submitQuizResult,
  generateAIQuiz,
} from '../controllers/quizController.js';
import { uploadMiddleware } from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.get('/', getAllQuizzes);
router.get('/:id', protect, getQuizById);
router.post('/', protect, adminOnly, createQuiz);
router.put('/:id', protect, adminOnly, updateQuiz);
router.delete('/:id', protect, adminOnly, deleteQuiz);
router.post('/:id/submit', protect, submitQuizResult);
router.post('/:id/thumbnail', protect, adminOnly, uploadMiddleware.single('thumbnail'), (req, res) => {
  res.json({ success: true, url: req.file?.path });
});
router.post('/generate-ai', protect, adminOnly, generateAIQuiz);

export default router;
