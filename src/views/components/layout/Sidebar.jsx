import React from 'react';
import { Nav } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { id: 'dashboard', path: '/', icon: 'bi-speedometer2', label: 'Dashboard', badge: null },
    { id: 'uploads', path: '/upload', icon: 'bi-cloud-upload', label: 'Upload Music', badge: 'New' },
    { id: 'analytics', path: '/analytics', icon: 'bi-graph-up', label: 'Analytics', badge: null },
    { id: 'manager', path: '/manager', icon: 'bi-music-note-list', label: 'Tune Manager', badge: null },
    { id: 'tunes', path: '/tunes', icon: 'bi-music-note-list', label: 'FAQs', badge: null },
  ];

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <div className="sidebar">
      <Nav className="flex-column">
        {menuItems.map((item) => (
          <Nav.Link
            key={item.id}
            href={item.path}
            className={`sidebar-item ${location.pathname === item.path ? 'active' : ''}`}
            onClick={(e) => {
              e.preventDefault();
              handleNavigation(item.path);
            }}
          >
            <i className={`${item.icon} me-2`}></i>
            {item.label}
            {item.badge && <span className="badge bg-success ms-2">{item.badge}</span>}
          </Nav.Link>
        ))}
      </Nav>
      
      <div className="sidebar-footer mt-auto">
        <div className="system-status">
          <h6>System Status</h6>
          <div className="status-item">
            <span className="status-dot online"></span>
            API Server: Online
          </div>
          <div className="status-item">
            <span className="status-dot online"></span>
            Database: Connected
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;



