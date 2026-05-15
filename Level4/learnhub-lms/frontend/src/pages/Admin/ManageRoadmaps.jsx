import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import toast from 'react-hot-toast';
import Loader from '../../components/Common/Loader';

const ManageRoadmaps = () => {
  const [roadmaps, setRoadmaps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingRoadmap, setEditingRoadmap] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    category: 'MERN',
    description: '',
    thumbnail: ''
  });

  useEffect(() => {
    fetchRoadmaps();
  }, []);

  const fetchRoadmaps = async () => {
    try {
      const response = await api.get('/roadmaps');
      setRoadmaps(response.data);
    } catch (error) {
      toast.error('Failed to fetch roadmaps');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingRoadmap) {
        await api.put(`/admin/roadmaps/${editingRoadmap.id}`, formData);
        toast.success('Roadmap updated successfully');
      } else {
        await api.post('/admin/roadmaps', formData);
        toast.success('Roadmap created successfully');
      }
      fetchRoadmaps();
      setShowModal(false);
      resetForm();
    } catch (error) {
      toast.error('Failed to save roadmap');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this roadmap?')) {
      try {
        await api.delete(`/admin/roadmaps/${id}`);
        toast.success('Roadmap deleted successfully');
        fetchRoadmaps();
      } catch (error) {
        toast.error('Failed to delete roadmap');
      }
    }
  };

  const resetForm = () => {
    setEditingRoadmap(null);
    setFormData({
      title: '',
      category: 'MERN',
      description: '',
      thumbnail: ''
    });
  };

  const editRoadmap = (roadmap) => {
    setEditingRoadmap(roadmap);
    setFormData(roadmap);
    setShowModal(true);
  };

  if (loading) return <Loader />;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manage Roadmaps</h1>
        <button
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
          className="btn-primary flex items-center space-x-2"
        >
          <FaPlus />
          <span>Add Roadmap</span>
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {roadmaps.map((roadmap) => (
          <div key={roadmap.id} className="card flex justify-between items-center">
            <div>
              <h3 className="text-xl font-bold mb-2">{roadmap.title}</h3>
              <p className="text-gray-400">{roadmap.description}</p>
              <span className="inline-block px-2 py-1 bg-blue-600 text-xs rounded mt-2">
                {roadmap.category}
              </span>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => editRoadmap(roadmap)}
                className="p-2 hover:bg-dark-200 rounded-lg transition"
              >
                <FaEdit className="text-blue-500" />
              </button>
              <button
                onClick={() => handleDelete(roadmap.id)}
                className="p-2 hover:bg-dark-200 rounded-lg transition"
              >
                <FaTrash className="text-red-500" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-dark-100 rounded-xl p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4">
              {editingRoadmap ? 'Edit Roadmap' : 'Add Roadmap'}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-300 mb-2">Title</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-2 bg-dark-200 border border-gray-700 rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-300 mb-2">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-2 bg-dark-200 border border-gray-700 rounded-lg"
                  >
                    <option value="MERN">MERN</option>
                    <option value="DSA">DSA</option>
                    <option value="AI/ML">AI/ML</option>
                    <option value="Java">Java</option>
                    <option value="Python">Python</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-300 mb-2">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-2 bg-dark-200 border border-gray-700 rounded-lg"
                    rows="3"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-300 mb-2">Thumbnail URL</label>
                  <input
                    type="url"
                    value={formData.thumbnail}
                    onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
                    className="w-full px-4 py-2 bg-dark-200 border border-gray-700 rounded-lg"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  {editingRoadmap ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageRoadmaps;