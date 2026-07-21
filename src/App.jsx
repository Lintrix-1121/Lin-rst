// src/App.jsx
import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './views/components/layout/Header';
import Sidebar from './views/components/layout/Sidebar';
import Dashboard from './views/pages/Dashboard';
import UploadPage from './views/pages/UploadPage';
import AnalyticsPage from './views/pages/AnalyticsPage';
import TuneManagerPage from './views/pages/TuneManagerPage';
import { useTheme } from './views/hooks/useTheme';
import 'bootstrap/dist/css/bootstrap.min.css';
import './assets/css/light-theme.css';
import './assets/css/dark-theme.css';
import TuneList from './views/components/tunes/TuneList';
import AnalyticsDashboard from './views/components/analytics/AnalyticsDashoard';

// Simple version without animations for now
function App() {
  const { theme, toggleTheme } = useTheme();

  return (
    <Router>
      <div className={`app ${theme}`}>
        <Header theme={theme} toggleTheme={toggleTheme} />
        
        <Container fluid>
          <Row>
            <Col xs={12} md={3} lg={2} className="sidebar-col">
              <Sidebar />
            </Col>
            
            <Col xs={12} md={9} lg={10} className="main-content">
              <div className="content-section">
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/upload" element={<UploadPage />} />
                  {/* <Route path="/analytics" element={<AnalyticsPage />} /> */}
                  <Route path="/manager" element={<TuneManagerPage />} />
                  <Route path="/tunes" element={<TuneList />} />
                  <Route path='/analytics' element={<AnalyticsDashboard />} />
                </Routes>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </Router>
  );
}

export default App;



