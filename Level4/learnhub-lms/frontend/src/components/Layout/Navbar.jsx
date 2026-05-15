import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FaUser, FaBook, FaSignOutAlt, FaBars, FaTimes } from 'react-icons/fa';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-dark-100 border-b border-gray-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <FaBook className="text-blue-500 text-2xl" />
            <span className="text-xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
              LearnHub LMS
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-gray-300 hover:text-white transition">Home</Link>
            {user && (
              <>
                <Link to="/dashboard" className="text-gray-300 hover:text-white transition">Dashboard</Link>
                {user.role === 'admin' && (
                  <Link to="/admin" className="text-gray-300 hover:text-white transition">Admin</Link>
                )}
              </>
            )}
          </div>

          {/* User Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <FaUser className="text-white text-sm" />
                  </div>
                  <span className="text-gray-300">{user.name}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 text-gray-300 hover:text-white transition"
                >
                  <FaSignOutAlt />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <>
                <Link to="/login" className="text-gray-300 hover:text-white transition">Login</Link>
                <Link to="/register" className="btn-primary">Sign Up</Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-300 hover:text-white focus:outline-none"
            >
              {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-800">
            <div className="flex flex-col space-y-3">
              <Link to="/" className="text-gray-300 hover:text-white transition px-2 py-1">Home</Link>
              {user && (
                <>
                  <Link to="/dashboard" className="text-gray-300 hover:text-white transition px-2 py-1">Dashboard</Link>
                  {user.role === 'admin' && (
                    <Link to="/admin" className="text-gray-300 hover:text-white transition px-2 py-1">Admin</Link>
                  )}
                </>
              )}
              {user ? (
                <button
                  onClick={handleLogout}
                  className="text-left text-gray-300 hover:text-white transition px-2 py-1"
                >
                  Logout
                </button>
              ) : (
                <>
                  <Link to="/login" className="text-gray-300 hover:text-white transition px-2 py-1">Login</Link>
                  <Link to="/register" className="text-blue-500 hover:text-blue-400 transition px-2 py-1">Sign Up</Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;