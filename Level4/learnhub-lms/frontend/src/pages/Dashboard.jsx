import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import ProgressBar from '../components/Dashboard/ProgressBar';

const Dashboard = () => {
  const [enrolledRoadmaps, setEnrolledRoadmaps] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchEnrolledRoadmaps();
  }, []);

  const fetchEnrolledRoadmaps = async () => {
    try {
      const response = await api.get('/roadmaps');
      const roadmaps = response.data;
      
      // Mock enrolled roadmaps - you'll need to implement the actual endpoint
      // For now, let's show some sample data
      setEnrolledRoadmaps(roadmaps.slice(0, 2));
    } catch (error) {
      console.error('Error fetching enrolled roadmaps:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-200">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.name}!</h1>
          <p className="text-gray-400">Continue your learning journey</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="card">
            <h3 className="text-lg font-semibold mb-2">Learning Streak</h3>
            <p className="text-3xl font-bold text-blue-500">{user?.streak || 0} days</p>
          </div>
          <div className="card">
            <h3 className="text-lg font-semibold mb-2">Enrolled Courses</h3>
            <p className="text-3xl font-bold text-green-500">{enrolledRoadmaps.length}</p>
          </div>
          <div className="card">
            <h3 className="text-lg font-semibold mb-2">Completed Lessons</h3>
            <p className="text-3xl font-bold text-purple-500">0</p>
          </div>
        </div>

        <h2 className="text-2xl font-bold mb-6">My Learning Paths</h2>
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : enrolledRoadmaps.length > 0 ? (
          <div className="space-y-6">
            {enrolledRoadmaps.map((roadmap) => (
              <div key={roadmap.id} className="card">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
                  <div>
                    <h3 className="text-xl font-bold mb-2">{roadmap.title}</h3>
                    <p className="text-gray-400">{roadmap.description}</p>
                  </div>
                  <Link to={`/roadmap/${roadmap.id}`} className="btn-primary mt-4 md:mt-0">
                    Continue Learning
                  </Link>
                </div>
                <ProgressBar progress={35} />
                <p className="text-sm text-gray-400 mt-2">35% Complete</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-400 mb-4">You haven't enrolled in any roadmaps yet.</p>
            <Link to="/" className="btn-primary">Browse Roadmaps</Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;