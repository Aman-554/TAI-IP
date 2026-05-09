import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Navbar() {
    const navigate = useNavigate();
    const currentUser = localStorage.getItem('username');
    const userId = localStorage.getItem('userId');

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        localStorage.removeItem('username');
        navigate('/login');
    };

    return (
        <nav className="navbar">
            <div className="nav-container">
                <Link to="/" className="nav-logo">
                    📱 SocialApp
                </Link>
                
                <div className="nav-menu">
                    <Link to="/" className="nav-item">
                        🏠 Feed
                    </Link>
                    <Link to="/create" className="nav-item">
                        ✍️ Create Post
                    </Link>
                    <Link to={`/profile/${userId}`} className="nav-item">
                        👤 Profile
                    </Link>
                    <button onClick={handleLogout} className="nav-logout-btn">
                        🚪 Logout
                    </button>
                </div>

                {currentUser && (
                    <div className="nav-user">
                        Welcome, {currentUser}!
                    </div>
                )}
            </div>
        </nav>
    );
}

export default Navbar;