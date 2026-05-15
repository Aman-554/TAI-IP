import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import HeroCarousel from '../components/Home/HeroCarousel';
import Categories from '../components/Home/Categories';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const [roadmaps, setRoadmaps] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    fetchRoadmaps();
  }, [selectedCategory]);

  const fetchRoadmaps = async () => {
    try {
      const response = await api.get('/roadmaps', {
        params: { category: selectedCategory }
      });
      setRoadmaps(response.data);
    } catch (error) {
      console.error('Error fetching roadmaps:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async (roadmapId) => {
    if (!user) {
      navigate('/login');
      return;
    }
    try {
      await api.post(`/roadmaps/${roadmapId}/enroll`);
      navigate('/dashboard');
    } catch (error) {
      console.error('Error enrolling:', error);
    }
  };

  return (
    <div className="min-h-screen">
      <HeroCarousel />
      
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold mb-8 text-center">Learning Roadmaps</h2>
        <Categories selectedCategory={selectedCategory} onSelectCategory={setSelectedCategory} />
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            {roadmaps.map((roadmap) => (
              <div key={roadmap.id} className="card group">
                <img
                  src={roadmap.thumbnail || 'https://via.placeholder.com/300x200'}
                  alt={roadmap.title}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
                <span className="inline-block px-3 py-1 bg-blue-600 text-xs font-semibold rounded-full mb-2">
                  {roadmap.category}
                </span>
                <h3 className="text-xl font-bold mb-2 group-hover:text-blue-500 transition">
                  {roadmap.title}
                </h3>
                <p className="text-gray-400 mb-4 line-clamp-2">{roadmap.description}</p>
                <button
                  onClick={() => handleEnroll(roadmap.id)}
                  className="w-full btn-primary"
                >
                  Enroll Now
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;