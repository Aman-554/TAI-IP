import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import Loader from '../components/Common/Loader';
import { FaCheck, FaYoutube, FaBookmark, FaExternalLinkAlt } from 'react-icons/fa';

const RoadmapDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedModules, setExpandedModules] = useState({});

  useEffect(() => {
    fetchRoadmapDetails();
  }, [id]);

  const fetchRoadmapDetails = async () => {
    try {
      const response = await api.get(`/roadmaps/${id}`);
      setRoadmap(response.data);
      // Expand first module by default
      if (response.data.modules?.length > 0) {
        setExpandedModules({ [response.data.modules[0].id]: true });
      }
    } catch (error) {
      console.error('Error fetching roadmap:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleModule = (moduleId) => {
    setExpandedModules(prev => ({ ...prev, [moduleId]: !prev[moduleId] }));
  };

  const handleLessonClick = (lesson) => {
    navigate(`/lesson/${lesson.id}`, { state: { lesson, roadmapId: id } });
  };

  const calculateModuleProgress = (module) => {
    if (!module.lessons || module.lessons.length === 0) return 0;
    const completedCount = module.lessons.filter(lesson => 
      roadmap.completedLessons?.includes(lesson.id)
    ).length;
    return (completedCount / module.lessons.length) * 100;
  };

  if (loading) return <Loader fullScreen />;
  if (!roadmap) return <div className="text-center py-12">Roadmap not found</div>;

  return (
    <div className="min-h-screen bg-dark-200">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">{roadmap.title}</h1>
          <p className="text-xl opacity-90">{roadmap.description}</p>
          <div className="mt-4">
            <span className="inline-block px-3 py-1 bg-white bg-opacity-20 rounded-full text-sm">
              {roadmap.category}
            </span>
          </div>
        </div>
      </div>

      {/* Modules Section */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="space-y-4">
          {roadmap.modules?.map((module, index) => {
            const progress = calculateModuleProgress(module);
            const isExpanded = expandedModules[module.id];
            
            return (
              <div key={module.id} className="card">
                <button
                  onClick={() => toggleModule(module.id)}
                  className="w-full text-left"
                >
                  <div className="flex justify-between items-center">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold mb-2">
                        Module {index + 1}: {module.title}
                      </h3>
                      <p className="text-gray-400 text-sm">{module.description}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-400 mb-2">
                        {progress.toFixed(0)}% Complete
                      </div>
                      <div className="w-32 bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all"
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </button>

                {isExpanded && (
                  <div className="mt-4 space-y-3">
                    {module.lessons?.map((lesson) => {
                      const isCompleted = roadmap.completedLessons?.includes(lesson.id);
                      return (
                        <div
                          key={lesson.id}
                          className="bg-dark-200 rounded-lg p-4 hover:bg-dark-100 transition cursor-pointer"
                          onClick={() => handleLessonClick(lesson)}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-3">
                                {isCompleted && <FaCheck className="text-green-500" />}
                                <h4 className="font-semibold">{lesson.title}</h4>
                              </div>
                              {lesson.duration && (
                                <p className="text-sm text-gray-400 mt-1">{lesson.duration}</p>
                              )}
                            </div>
                            <div className="flex space-x-2">
                              {lesson.youtube_url && <FaYoutube className="text-red-500" />}
                              <FaExternalLinkAlt className="text-gray-400 text-sm" />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default RoadmapDetails;