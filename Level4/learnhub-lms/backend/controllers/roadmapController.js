const pool = require('../config/database');

// @desc    Get all roadmaps
// @route   GET /api/roadmaps
const getRoadmaps = async (req, res) => {
    try {
        const { category } = req.query;
        let query = 'SELECT * FROM roadmaps';
        let params = [];

        if (category && category !== 'All') {
            query += ' WHERE category = ?';
            params.push(category);
        }

        query += ' ORDER BY created_at DESC';
        
        const [roadmaps] = await pool.execute(query, params);
        res.json(roadmaps);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get single roadmap with modules and lessons
// @route   GET /api/roadmaps/:id
const getRoadmapById = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Get roadmap
        const [roadmaps] = await pool.execute('SELECT * FROM roadmaps WHERE id = ?', [id]);
        if (roadmaps.length === 0) {
            return res.status(404).json({ message: 'Roadmap not found' });
        }
        
        const roadmap = roadmaps[0];
        
        // Get modules
        const [modules] = await pool.execute(
            'SELECT * FROM modules WHERE roadmap_id = ? ORDER BY order_index',
            [id]
        );
        
        // Get lessons for each module
        for (let module of modules) {
            const [lessons] = await pool.execute(
                'SELECT * FROM lessons WHERE module_id = ? ORDER BY order_index',
                [module.id]
            );
            module.lessons = lessons;
        }
        
        roadmap.modules = modules;
        
        // Check if user is enrolled
        if (req.user) {
            const [enrolled] = await pool.execute(
                'SELECT * FROM enrollments WHERE user_id = ? AND roadmap_id = ?',
                [req.user.id, id]
            );
            roadmap.isEnrolled = enrolled.length > 0;
            
            // Get completed lessons
            const [completed] = await pool.execute(
                `SELECT lesson_id FROM completed_lessons 
                 WHERE user_id = ? AND lesson_id IN (
                    SELECT id FROM lessons WHERE module_id IN (
                        SELECT id FROM modules WHERE roadmap_id = ?
                    )
                )`,
                [req.user.id, id]
            );
            roadmap.completedLessons = completed.map(c => c.lesson_id);
        }
        
        res.json(roadmap);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Enroll in roadmap
// @route   POST /api/roadmaps/:id/enroll
const enrollRoadmap = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        
        // Check if already enrolled
        const [existing] = await pool.execute(
            'SELECT * FROM enrollments WHERE user_id = ? AND roadmap_id = ?',
            [userId, id]
        );
        
        if (existing.length > 0) {
            return res.status(400).json({ message: 'Already enrolled' });
        }
        
        // Enroll
        await pool.execute(
            'INSERT INTO enrollments (user_id, roadmap_id) VALUES (?, ?)',
            [userId, id]
        );
        
        res.json({ success: true, message: 'Enrolled successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { getRoadmaps, getRoadmapById, enrollRoadmap };