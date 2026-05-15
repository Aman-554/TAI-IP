import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { FaUser, FaCalendar, FaFire } from 'react-icons/fa';
import Loader from '../../components/Common/Loader';
import toast from 'react-hot-toast';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await api.get('/admin/users');
      setUsers(response.data);
    } catch (error) {
      toast.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Manage Users</h1>
      
      <div className="grid grid-cols-1 gap-4">
        {users.map((user) => (
          <div key={user.id} className="card">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <FaUser className="text-white text-xl" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">{user.name}</h3>
                  <p className="text-gray-400">{user.email}</p>
                  <div className="flex items-center space-x-4 mt-2">
                    <span className="text-sm text-gray-500">
                      Role: {user.role}
                    </span>
                    <span className="flex items-center space-x-1 text-sm text-gray-500">
                      <FaFire className="text-orange-500" />
                      <span>Streak: {user.streak} days</span>
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500 flex items-center space-x-1">
                  <FaCalendar />
                  <span>Joined: {new Date(user.created_at).toLocaleDateString()}</span>
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManageUsers;