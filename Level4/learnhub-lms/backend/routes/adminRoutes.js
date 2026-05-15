const express = require('express');
const { getUsers, createRoadmap, updateRoadmap, deleteRoadmap, createModule, createLesson } = require('../controllers/adminController');
const { protect } = require('../middleware/auth');
const { admin } = require('../middleware/admin');
const router = express.Router();

router.use(protect, admin);
router.get('/users', getUsers);
router.post('/roadmaps', createRoadmap);
router.put('/roadmaps/:id', updateRoadmap);
router.delete('/roadmaps/:id', deleteRoadmap);
router.post('/modules', createModule);
router.post('/lessons', createLesson);

module.exports = router;