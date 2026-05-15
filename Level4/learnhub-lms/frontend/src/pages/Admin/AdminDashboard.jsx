import React, { useState } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { FaPlus, FaUsers, FaBook, FaLayerGroup } from 'react-icons/fa';
import ManageRoadmaps from './ManageRoadmaps';
import ManageModules from './ManageModules';
import ManageUsers from './ManageUsers';

const AdminDashboard = () => {
  const location = useLocation();
  
  const menuItems = [
    { path: '/admin', icon: FaBook, label: 'Roadmaps', component: ManageRoadmaps },
    { path: '/admin/modules', icon: FaLayerGroup, label: 'Modules', component: ManageModules },
    { path: '/admin/users', icon: FaUsers, label: 'Users', component: ManageUsers },
  ];

  return (
    <div className="min-h-screen bg-dark-200">
      <div className="flex">
        {/* Admin Sidebar */}
        <div className="w-64 bg-dark-100 min-h-screen border-r border-gray-800">
          <div className="p-6">
            <h2 className="text-xl font-bold mb-6">Admin Panel</h2>
            <nav className="space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`
                      flex items-center space-x-3 px-4 py-3 rounded-lg transition
                      ${isActive 
                        ? 'bg-blue-600 text-white' 
                        : 'text-gray-300 hover:bg-dark-200'
                      }
                    `}
                  >
                    <Icon />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          <Routes>
            <Route path="/" element={<ManageRoadmaps />} />
            <Route path="/modules" element={<ManageModules />} />
            <Route path="/users" element={<ManageUsers />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;