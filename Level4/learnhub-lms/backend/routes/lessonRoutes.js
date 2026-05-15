const express = require('express');
const { completeLesson, uncompleteLesson, bookmarkLesson } = require('../controllers/lessonController');
const { protect } = require('../middleware/auth');
const router = express.Router();

router.post('/:id/complete', protect, completeLesson);
router.delete('/:id/complete', protect, uncompleteLesson);
router.post('/:id/bookmark', protect, bookmarkLesson);

module.exports = router;