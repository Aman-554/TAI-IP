const pool = require('../config/database');

// @desc    Get all users
// @route   GET /api/admin/users
const getUsers = async (req, res) => {
    try {
        const [users] = await pool.execute(
            'SELECT id, name, email, role, streak, created_at FROM users'
        );
        res.json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Create roadmap
// @route   POST /api/admin/roadmaps
const createRoadmap = async (req, res) => {
    try {
        const { title, category, description, thumbnail } = req.body;
        
        const [result] = await pool.execute(
            'INSERT INTO roadmaps (title, category, description, thumbnail) VALUES (?, ?, ?, ?)',
            [title, category, description, thumbnail]
        );
        
        res.status(201).json({ success: true, id: result.insertId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Update roadmap
// @route   PUT /api/admin/roadmaps/:id
const updateRoadmap = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, category, description, thumbnail } = req.body;
        
        await pool.execute(
            'UPDATE roadmaps SET title = ?, category = ?, description = ?, thumbnail = ? WHERE id = ?',
            [title, category, description, thumbnail, id]
        );
        
        res.json({ success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Delete roadmap
// @route   DELETE /api/admin/roadmaps/:id
const deleteRoadmap = async (req, res) => {
    try {
        const { id } = req.params;
        await pool.execute('DELETE FROM roadmaps WHERE id = ?', [id]);
        res.json({ success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Create module
// @route   POST /api/admin/modules
const createModule = async (req, res) => {
    try {
        const { roadmap_id, title, description, order_index } = req.body;
        
        const [result] = await pool.execute(
            'INSERT INTO modules (roadmap_id, title, description, order_index) VALUES (?, ?, ?, ?)',
            [roadmap_id, title, description, order_index]
        );
        
        res.status(201).json({ success: true, id: result.insertId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Create lesson
// @route   POST /api/admin/lessons
const createLesson = async (req, res) => {
    try {
        const { module_id, title, youtube_url, playlist_url, resources, notes, duration, order_index } = req.body;
        
        const [result] = await pool.execute(
            'INSERT INTO lessons (module_id, title, youtube_url, playlist_url, resources, notes, duration, order_index) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [module_id, title, youtube_url, playlist_url, resources, notes, duration, order_index]
        );
        
        res.status(201).json({ success: true, id: result.insertId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { getUsers, createRoadmap, updateRoadmap, deleteRoadmap, createModule, createLesson };