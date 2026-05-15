import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../services/api';
import Loader from '../components/Common/Loader';
import { FaCheck, FaBookmark, FaRegBookmark, FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import toast from 'react-hot-toast';

const LessonView = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { lesson, roadmapId } = location.state || {};
  const [isCompleted, setIsCompleted] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!lesson) {
      navigate('/dashboard');
    }
    checkCompletionStatus();
    checkBookmarkStatus();
  }, [lesson]);

  const checkCompletionStatus = async () => {
    // This would be an API call to check if lesson is completed
    // For now, we'll just set it to false
    setIsCompleted(false);
  };

  const checkBookmarkStatus = async () => {
    // This would be an API call to check if lesson is bookmarked
    setIsBookmarked(false);
  };

  const handleCompleteLesson = async () => {
    setLoading(true);
    try {
      if (isCompleted) {
        await api.delete(`/lessons/${lesson.id}/complete`);
        toast.success('Lesson marked as incomplete');
        setIsCompleted(false);
      } else {
        await api.post(`/lessons/${lesson.id}/complete`);
        toast.success('Lesson completed! Great job! 🎉');
        setIsCompleted(true);
      }
    } catch (error) {
      toast.error('Failed to update lesson status');
    } finally {
      setLoading(false);
    }
  };

  const handleBookmark = async () => {
    try {
      if (isBookmarked) {
        // Would need a delete bookmark endpoint
        toast.success('Bookmark removed');
        setIsBookmarked(false);
      } else {
        await api.post(`/lessons/${lesson.id}/bookmark`);
        toast.success('Lesson bookmarked!');
        setIsBookmarked(true);
      }
    } catch (error) {
      toast.error('Failed to bookmark lesson');
    }
  };

  if (!lesson) return null;

  // Extract YouTube video ID from URL
  const getYouTubeEmbedUrl = (url) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? `https://www.youtube.com/embed/${match[2]}` : url;
  };

  const embedUrl = getYouTubeEmbedUrl(lesson.youtube_url);

  return (
    <div className="min-h-screen bg-dark-200">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Navigation */}
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={() => navigate(`/roadmap/${roadmapId}`)}
            className="flex items-center space-x-2 text-gray-400 hover:text-white transition"
          >
            <FaArrowLeft />
            <span>Back to Roadmap</span>
          </button>
          
          <div className="flex space-x-3">
            <button
              onClick={handleBookmark}
              className="p-2 rounded-lg bg-dark-100 hover:bg-dark-200 transition"
            >
              {isBookmarked ? <FaBookmark className="text-blue-500" /> : <FaRegBookmark />}
            </button>
          </div>
        </div>

        {/* Lesson Title */}
        <h1 className="text-3xl font-bold mb-4">{lesson.title}</h1>
        
        {lesson.duration && (
          <p className="text-gray-400 mb-6">Duration: {lesson.duration}</p>
        )}

        {/* Video Section */}
        {embedUrl && (
          <div className="mb-8">
            <div className="aspect-w-16 aspect-h-9 bg-black rounded-lg overflow-hidden">
              <iframe
                src={embedUrl}
                title={lesson.title}
                className="w-full h-full"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        )}

        {/* Resources Section */}
        {(lesson.resources || lesson.playlist_url || lesson.notes) && (
          <div className="card mb-8">
            <h2 className="text-xl font-bold mb-4">Resources</h2>
            <div className="space-y-3">
              {lesson.resources && (
                <div>
                  <h3 className="font-semibold mb-1">Additional Resources:</h3>
                  <a
                    href={lesson.resources}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    {lesson.resources}
                  </a>
                </div>
              )}
              {lesson.playlist_url && (
                <div>
                  <h3 className="font-semibold mb-1">Full Playlist:</h3>
                  <a
                    href={lesson.playlist_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    Watch Full Playlist
                  </a>
                </div>
              )}
              {lesson.notes && (
                <div>
                  <h3 className="font-semibold mb-1">Notes:</h3>
                  <p className="text-gray-300 whitespace-pre-wrap">{lesson.notes}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Complete Button */}
        <div className="flex justify-center">
          <button
            onClick={handleCompleteLesson}
            disabled={loading}
            className={`
              flex items-center space-x-2 px-8 py-3 rounded-lg font-semibold transition
              ${isCompleted 
                ? 'bg-green-600 hover:bg-green-700' 
                : 'btn-primary'
              }
              disabled:opacity-50
            `}
          >
            {isCompleted ? (
              <>
                <FaCheck />
                <span>Completed!</span>
              </>
            ) : (
              <>
                <FaCheck />
                <span>Mark as Complete</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LessonView;