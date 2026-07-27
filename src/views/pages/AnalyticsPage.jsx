// pages/AnalyticsPage.js
import React, { useState, useEffect } from 'react';
import { Row, Col, Spinner, Alert } from 'react-bootstrap';
import StatsCards from '../components/analytics/StatsCards';
import Charts from '../components/analytics/Charts';
import TopTracks from '../components/analytics/TopTracks';
import AnalyticsController from '../../controllers/AnalyticsController';

const AnalyticsPage = () => {
  const [controller] = useState(() => new AnalyticsController());
  const [dashboardData, setDashboardData] = useState(null);
  const [chartData, setChartData] = useState(null);
  const [timeRange, setTimeRange] = useState('month');

  useEffect(() => {
    loadData();
  }, [timeRange]);

  const loadData = async () => {
    try {
      const data = await controller.loadDashboardData();
      setDashboardData(data);
      // Load timeline for chart
      const chart = await controller.loadTimelineData(timeRange, 6);
      setChartData(chart);
    } catch (error) {
      console.error('Failed to load data:', error);
    }
  };

  if (controller.isLoading() && !dashboardData) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
     );
  }

  return (
    <div className="section-container">
      <div className="section-header">
        <h2><i className="bi bi-graph-up me-2"></i>Analytics Dashboard</h2>
        <p className="text-muted">Track performance and user engagement</p>
        <Form.Select value={timeRange} onChange={(e) => setTimeRange(e.target.value)} style={{ width: 'auto' }}>
          <option value="day">Last 7 Days</option>
          <option value="week">Last 4 Weeks</option>
          <option value="month">Last 6 Months</option>
          <option value="year">Last Year</option>
        </Form.Select>
      </div>

      {controller.getError() && <Alert variant="danger">{controller.getError()}</Alert>}

      {dashboardData && (
        <>
          <Row className="mb-4">
            <Col>
              <StatsCards stats={dashboardData.stats} />
            </Col>
          </Row>
          <Row>
            <Col lg={8}>
              <Charts chartData={chartData} timeRange={timeRange} />
            </Col>
            <Col lg={4}>
              <TopTracks tracks={dashboardData.topTracks} />
            </Col>
          </Row>
        </>
      )}
    </div>
  );
};



// import React, { useState, useEffect } from 'react';
// import { Row, Col, Spinner, Alert } from 'react-bootstrap';
// import StatsCards from '../components/analytics/StatsCards';
// import Charts from '../components/analytics/Charts';
// import TopTracks from '../components/analytics/TopTracks';
// import AnalyticsController from '../../controllers/AnalyticsController';

// const AnalyticsPage = () => {
//   const [controller] = useState(() => new AnalyticsController());
//   const [dashboardData, setDashboardData] = useState(null);

//   useEffect(() => {
//     loadDashboardData();
//   }, []); 

//   const loadDashboardData = async () => {
//     try {
//       const data = await controller.loadDashboardData();
//       setDashboardData(data);
//     } catch (error) {
//       console.error('Failed to load dashboard data:', error);
//     }
//   };

//   if (controller.isLoading() && !dashboardData) {
//     return (
//       <div className="text-center py-5">
//         <Spinner animation="border" role="status">
//           <span className="visually-hidden">Loading...</span>
//         </Spinner>
//       </div>
//     );
//   }

//   return (
//     <div className="section-container">
//       <div className="section-header">
//         <h2><i className="bi bi-graph-up me-2"></i>Analytics Dashboard</h2>
//         <p className="text-muted">Track performance and user engagement</p>
//       </div>

//       {controller.getError() && (
//         <Alert variant="danger">{controller.getError()}</Alert>
//       )}

//       {dashboardData && (
//         <>
//           <Row className="mb-4">
//             <Col>
//               <StatsCards stats={dashboardData.stats} />
//             </Col>
//           </Row>

//           <Row>
//             <Col lg={8}>
//               <Charts controller={controller} />
//             </Col>
//             <Col lg={4}>
//               <TopTracks tracks={dashboardData.topTracks} />
//             </Col>
//           </Row>
//         </>
//       )}
//     </div>
//   );
// };

// export default AnalyticsPage;

