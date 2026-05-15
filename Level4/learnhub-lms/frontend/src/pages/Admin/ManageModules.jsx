import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import toast from 'react-hot-toast';
import Loader from '../../components/Common/Loader';

const ManageModules = () => {
  const [roadmaps, setRoadmaps] = useState([]);
  const [modules, setModules] = useState([]);
  const [selectedRoadmap, setSelectedRoadmap] = useState('');
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    order_index: 0
  });

  useEffect(() => {
    fetchRoadmaps();
  }, []);

  useEffect(() => {
    if (selectedRoadmap) {
      fetchModules();
    }
  }, [selectedRoadmap]);

  const fetchRoadmaps = async () => {
    try {
      const response = await api.get('/roadmaps');
      setRoadmaps(response.data);
      if (response.data.length > 0) {
        setSelectedRoadmap(response.data[0].id);
      }
    } catch (error) {
      toast.error('Failed to fetch roadmaps');
    } finally {
      setLoading(false);
    }
  };

  const fetchModules = async () => {
    try {
      const response = await api.get(`/roadmaps/${selectedRoadmap}`);
      setModules(response.data.modules || []);
    } catch (error) {
      toast.error('Failed to fetch modules');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/admin/modules', {
        ...formData,
        roadmap_id: selectedRoadmap
      });
      toast.success('Module created successfully');
      fetchModules();
      setShowModal(false);
      setFormData({ title: '', description: '', order_index: 0 });
    } catch (error) {
      toast.error('Failed to create module');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure?')) {
      try {
        await api.delete(`/admin/modules/${id}`);
        toast.success('Module deleted');
        fetchModules();
      } catch (error) {
        toast.error('Failed to delete module');
      }
    }
  };

  if (loading) return <Loader />;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manage Modules</h1>
        <button
          onClick={() => setShowModal(true)}
          className="btn-primary flex items-center space-x-2"
          disabled={!selectedRoadmap}
        >
          <FaPlus />
          <span>Add Module</span>
        </button>
      </div>

      <div className="mb-6">
        <label className="block text-gray-300 mb-2">Select Roadmap</label>
        <select
          value={selectedRoadmap}
          onChange={(e) => setSelectedRoadmap(e.target.value)}
          className="px-4 py-2 bg-dark-100 border border-gray-700 rounded-lg"
        >
          {roadmaps.map(roadmap => (
            <option key={roadmap.id} value={roadmap.id}>{roadmap.title}</option>
          ))}
        </select>
      </div>

      <div className="space-y-4">
        {modules.map((module, index) => (
          <div key={module.id} className="card flex justify-between items-center">
            <div>
              <h3 className="text-xl font-bold mb-2">
                Module {index + 1}: {module.title}
              </h3>
              <p className="text-gray-400">{module.description}</p>
            </div>
            <button
              onClick={() => handleDelete(module.id)}
              className="p-2 hover:bg-dark-200 rounded-lg transition"
            >
              <FaTrash className="text-red-500" />
            </button>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-dark-100 rounded-xl p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4">Add Module</h2>
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
                  <label className="block text-gray-300 mb-2">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-2 bg-dark-200 border border-gray-700 rounded-lg"
                    rows="3"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 mb-2">Order Index</label>
                  <input
                    type="number"
                    value={formData.order_index}
                    onChange={(e) => setFormData({ ...formData, order_index: parseInt(e.target.value) })}
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
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageModules;