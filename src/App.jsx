// src/App.jsx
import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import { useTheme } from './views/hooks/useTheme';
import 'bootstrap/dist/css/bootstrap.min.css';
import './assets/css/light-theme.css';
import './assets/css/dark-theme.css';

// Layout components
import Header from './views/components/layout/Header';
import Sidebar from './views/components/layout/Sidebar';

import Dashboard from './views/pages/Dashboard';
import UploadPage from './views/pages/UploadPage';
import AnalyticsPage from './views/pages/AnalyticsPage';
import TuneManagerPage from './views/pages/TuneManagerPage';
import TuneList from './views/components/tunes/TuneList';
import AnalyticsDashboard from './views/components/analytics/AnalyticsDashoard';

// Authentication imports
import { AuthProvider } from './views/hooks/useAuth';
import Login from './views/pages/Login';
import OAuthCallback from './views/pages/OAuthCallback';
import ProtectedRoute from './views/pages/ProtectedRoute';

// Layout component – wraps all protected pages with Header, Sidebar, and main content
const Layout = () => {
  const { theme, toggleTheme } = useTheme();
  return (
    <>
      <Header theme={theme} toggleTheme={toggleTheme} />
      <Container fluid>
        <Row>
          <Col xs={12} md={3} lg={2} className="sidebar-col">
            <Sidebar />
          </Col>
          <Col xs={12} md={9} lg={10} className="main-content">
            <div className="content-section">
              <Outlet />  {/* Renders the matched child route */}
            </div>
          </Col>
        </Row>
      </Container>
    </>
  );
};

function App() {
  const { theme } = useTheme();

  return (
    <AuthProvider>
      <Router>
        <div className={`app ${theme}`}>
          <Routes>
            {/* Public routes – no layout */}
            <Route path="/login" element={<Login />} />
            <Route path="/oauth-callback" element={<OAuthCallback />} />

            {/* Protected routes – require authentication and use the Layout */}
            <Route element={<ProtectedRoute />}>
              <Route element={<Layout />}>
                <Route path="/" element={<Dashboard />} />
                <Route path="/upload" element={<UploadPage />} />
                <Route path="/analytics" element={<AnalyticsDashboard />} />
                <Route path="/manager" element={<TuneManagerPage />} />
                <Route path="/tunes" element={<TuneList />} />
              </Route>
            </Route>
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;

