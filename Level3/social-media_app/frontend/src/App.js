import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Feed from './pages/Feed';
import Profile from './pages/Profile';
import CreatePost from './pages/CreatePost';
import Navbar from './components/Navbar';
import './App.css';

function App() {
    const isAuthenticated = !!localStorage.getItem('token');

    return (
        <Router>
            <div className="App">
                {isAuthenticated && <Navbar />}
                <Routes>
                    <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/" />} />
                    <Route path="/register" element={!isAuthenticated ? <Register /> : <Navigate to="/" />} />
                    <Route path="/" element={isAuthenticated ? <Feed /> : <Navigate to="/login" />} />
                    <Route path="/profile/:userId" element={isAuthenticated ? <Profile /> : <Navigate to="/login" />} />
                    <Route path="/create" element={isAuthenticated ? <CreatePost /> : <Navigate to="/login" />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;