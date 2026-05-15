const express = require('express');
const { getRoadmaps, getRoadmapById, enrollRoadmap } = require('../controllers/roadmapController');
const { protect } = require('../middleware/auth');
const router = express.Router();

router.get('/', getRoadmaps);
router.get('/:id', protect, getRoadmapById);
router.post('/:id/enroll', protect, enrollRoadmap);

module.exports = router;