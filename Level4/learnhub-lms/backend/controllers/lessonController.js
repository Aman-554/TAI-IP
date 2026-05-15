const pool = require('../config/database');

// @desc    Mark lesson as complete
// @route   POST /api/lessons/:id/complete
const completeLesson = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        
        // Check if already completed
        const [existing] = await pool.execute(
            'SELECT * FROM completed_lessons WHERE user_id = ? AND lesson_id = ?',
            [userId, id]
        );
        
        if (existing.length === 0) {
            await pool.execute(
                'INSERT INTO completed_lessons (user_id, lesson_id) VALUES (?, ?)',
                [userId, id]
            );
            
            // Update streak
            await pool.execute(
                'UPDATE users SET streak = streak + 1 WHERE id = ?',
                [userId]
            );
        }
        
        res.json({ success: true, message: 'Lesson marked as complete' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Unmark lesson
// @route   DELETE /api/lessons/:id/complete
const uncompleteLesson = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        
        await pool.execute(
            'DELETE FROM completed_lessons WHERE user_id = ? AND lesson_id = ?',
            [userId, id]
        );
        
        res.json({ success: true, message: 'Lesson unmarked' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Bookmark lesson
// @route   POST /api/lessons/:id/bookmark
const bookmarkLesson = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        
        await pool.execute(
            'INSERT INTO bookmarks (user_id, lesson_id) VALUES (?, ?)',
            [userId, id]
        );
        
        res.json({ success: true, message: 'Lesson bookmarked' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { completeLesson, uncompleteLesson, bookmarkLesson };