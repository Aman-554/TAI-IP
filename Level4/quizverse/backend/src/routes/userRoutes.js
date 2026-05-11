import express from 'express';
import { protect, adminOnly } from '../middleware/authMiddleware.js';
import {
  getAllUsers,
  getUserById,
  updateUserRole,
  banUser,
  updateProfile,
  deleteUser,
} from '../controllers/userController.js';

const router = express.Router();

router.get('/', protect, adminOnly, getAllUsers);
router.get('/:id', protect, adminOnly, getUserById);
router.put('/profile', protect, updateProfile);
router.put('/:id/role', protect, adminOnly, updateUserRole);
router.put('/:id/ban', protect, adminOnly, banUser);
router.delete('/:id', protect, adminOnly, deleteUser);

export default router;
