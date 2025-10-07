import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  // Don't show navbar on auth pages
  if (!user || ['/', '/login', '/register'].includes(location.pathname)) {
    return null;
  }

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <button 
          className={`nav-item ${location.pathname === '/' || location.pathname === '/dashboard' ? 'active' : ''}`}
          onClick={() => navigate('/dashboard')}
        >
          <div className="nav-icon nav-icon-home"></div>
          <span className="nav-label">Home</span>
        </button>

        <button 
          className={`nav-item ${location.pathname === '/recipes' ? 'active' : ''}`}
          onClick={() => navigate('/recipes')}
        >
          <div className="nav-icon nav-icon-recipes"></div>
          <span className="nav-label">Recipes</span>
        </button>

        <button 
          className={`nav-item ${location.pathname === '/planner' ? 'active' : ''}`}
          onClick={() => navigate('/planner')}
        >
          <div className="nav-icon nav-icon-planner"></div>
          <span className="nav-label">Planner</span>
        </button>

        <button 
          className={`nav-item ${location.pathname === '/groceries' ? 'active' : ''}`}
          onClick={() => navigate('/groceries')}
        >
          <div className="nav-icon nav-icon-groceries"></div>
          <span className="nav-label">Groceries</span>
        </button>

        <button 
          className={`nav-item ${location.pathname === '/profile' ? 'active' : ''}`}
          onClick={() => navigate('/profile')}
        >
          <div className="nav-icon nav-icon-profile"></div>
          <span className="nav-label">Profile</span>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
