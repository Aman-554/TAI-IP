import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { quizAPI } from '../api/client';
import { useAuth } from '../contexts/AuthContext';

const Dashboard = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async () => {
    try {
      const response = await quizAPI.getAll();
      setQuizzes(response.data.data || []);
    } catch (error) {
      console.error('Failed to fetch quizzes:', error);
    } finally {
      setLoading(false);
    }
  };

  const categories = ['All', 'Programming', 'Science', 'General Knowledge', 'Sports', 'Movies', 'History'];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold gradient-text">
          Welcome back, {user?.username}! 👋
        </h1>
        <p className="text-gray-400 mt-2">Ready to test your knowledge today?</p>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <div className="glass-card rounded-xl p-6">
          <div className="text-3xl mb-2">📊</div>
          <div className="text-2xl font-bold">{user?.profile?.quizzesTaken || 0}</div>
          <div className="text-gray-400 text-sm">Quizzes Taken</div>
        </div>
        <div className="glass-card rounded-xl p-6">
          <div className="text-3xl mb-2">⭐</div>
          <div className="text-2xl font-bold">{user?.profile?.totalScore || 0}</div>
          <div className="text-gray-400 text-sm">Total Score</div>
        </div>
        <div className="glass-card rounded-xl p-6">
          <div className="text-3xl mb-2">🔥</div>
          <div className="text-2xl font-bold">{user?.streak?.current || 0}</div>
          <div className="text-gray-400 text-sm">Day Streak</div>
        </div>
        <div className="glass-card rounded-xl p-6">
          <div className="text-3xl mb-2">🏆</div>
          <div className="text-2xl font-bold">{user?.badges?.length || 0}</div>
          <div className="text-gray-400 text-sm">Badges Earned</div>
        </div>
      </div>

      {/* Categories */}
      <div className="mb-6 overflow-x-auto">
        <div className="flex space-x-2">
          {categories.map((cat) => (
            <button
              key={cat}
              className="px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 transition whitespace-nowrap"
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Quizzes Grid */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
        </div>
      ) : (
        <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
          {quizzes.map((quiz, index) => (
            <motion.div
              key={quiz._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="glass-card rounded-xl overflow-hidden hover:transform hover:scale-105 transition-all duration-300 cursor-pointer"
              onClick={() => window.location.href = `/quiz/${quiz._id}`}
            >
              <div className="h-32 bg-gradient-to-r from-purple-500 to-pink-500"></div>
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-1">{quiz.title}</h3>
                <p className="text-gray-400 text-sm mb-2">{quiz.description?.substring(0, 80)}</p>
                <div className="flex justify-between items-center">
                  <span className="text-xs px-2 py-1 rounded-full bg-white/10">
                    {quiz.category}
                  </span>
                  <span className="text-xs text-purple-400">
                    {quiz.difficulty}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;