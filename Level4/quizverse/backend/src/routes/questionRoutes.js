import express from 'express';
import { protect, adminOnly } from '../middleware/authMiddleware.js';
import {
  getQuestions,
  getQuestionById,
  createQuestion,
  updateQuestion,
  deleteQuestion,
} from '../controllers/questionController.js';

const router = express.Router();

router.get('/quiz/:quizId', protect, getQuestions);
router.get('/:id', protect, getQuestionById);
router.post('/', protect, adminOnly, createQuestion);
router.put('/:id', protect, adminOnly, updateQuestion);
router.delete('/:id', protect, adminOnly, deleteQuestion);

export default router;
