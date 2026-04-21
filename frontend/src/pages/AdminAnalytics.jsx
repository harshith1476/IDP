import { useEffect, useState, useRef } from 'react';
import Layout from '../components/Layout';
import { adminService } from '../services/adminService';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

// Auto-refresh interval in milliseconds (5 seconds)
const REFRESH_INTERVAL = 5000;

function AdminAnalytics() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    // Initial load
    loadAnalytics();

    // Set up auto-refresh interval (increased to 30s to prevent request storming)
    intervalRef.current = setInterval(() => {
      if (!loading && !isRefreshing) {
        refreshAnalytics();
      }
    }, 30000);

    // Cleanup interval on unmount
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const loadAnalytics = async () => {
    try {
      const response = await adminService.getAnalytics();
      setAnalytics(response.data);
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const refreshAnalytics = async () => {
    try {
      setIsRefreshing(true);
      const response = await adminService.getAnalytics();
      setAnalytics(response.data);
    } catch (error) {
      console.error('Error refreshing analytics:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleExport = async () => {
    try {
      const response = await adminService.exportToExcel(null, null);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'research_data.xlsx');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error exporting data:', error);
      alert('Failed to export data. Please try again later.');
    }
  };

  if (loading) {
    return <Layout title="Analytics">Loading...</Layout>;
  }

  if (!analytics) {
    return <Layout title="Analytics">No data available</Layout>;
  }

  const yearWiseData = Object.entries(analytics.yearWiseTotals || {})
    .map(([year, count]) => ({ year: parseInt(year), count }))
    .sort((a, b) => a.year - b.year);

  const categoryWiseData = Object.entries(analytics.categoryWiseTotals || {})
    .map(([name, value]) => ({ name, value }));

  const facultyWiseData = Object.entries(analytics.facultyWiseContribution || {})
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 10);

  const statusWiseData = Object.entries(analytics.statusWiseBreakdown || {})
    .map(([name, value]) => ({ name, value }));

  return (
    <Layout title="Department Analytics">
      <div className="analytics-container">
        <div className="analytics-header">
          <div className="live-indicator">
            <span className={`live-dot ${isRefreshing ? 'pulsing' : ''}`}></span>
            <span className="live-text">Live Data</span>
          </div>
          <button
            onClick={handleExport}
            className="export-btn"
          >
            Export to Excel
          </button>
        </div>

        {/* Charts displayed side by side in rows */}
        <div className="charts-grid">
          {/* Year-wise Totals */}
          <div className="chart-card">
            <h3 className="chart-title">Year-wise Totals</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={yearWiseData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="year" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip />
                <Bar dataKey="count" fill="#1e3a8a" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Category-wise Totals */}
          <div className="chart-card">
            <h3 className="chart-title">Category-wise Totals</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryWiseData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={90}
                  fill="#1e3a8a"
                  dataKey="value"
                >
                  {categoryWiseData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value, name, props) => [
                    `${props.payload.name}: ${value}`,
                    'Count'
                  ]}
                />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  formatter={(value, entry) => `${entry.payload.name}: ${entry.payload.value}`}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Status-wise Breakdown */}
          <div className="chart-card">
            <h3 className="chart-title">Status-wise Breakdown</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusWiseData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={90}
                  fill="#1e3a8a"
                  dataKey="value"
                >
                  {statusWiseData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value, name, props) => [
                    `${props.payload.name}: ${value}`,
                    'Count'
                  ]}
                />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  formatter={(value, entry) => `${entry.payload.name}: ${entry.payload.value}`}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top 10 Faculty Contributions - Full Width */}
        <div className="chart-card chart-card-full">
          <h3 className="chart-title">Top 10 Faculty Contributions</h3>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={facultyWiseData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis
                dataKey="name"
                stroke="#64748b"
                angle={-45}
                textAnchor="end"
                height={100}
                interval={0}
              />
              <YAxis stroke="#64748b" />
              <Tooltip />
              <Bar dataKey="value" fill="#166534" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Summary Statistics */}
        <div className="summary-stats">
          <h3 className="chart-title">Summary Statistics</h3>
          <div className="summary-grid">
            <div className="summary-item">
              <p className="summary-label">Total Years</p>
              <p className="summary-value">{Object.keys(analytics.yearWiseTotals || {}).length}</p>
            </div>
            <div className="summary-item">
              <p className="summary-label">Total Categories</p>
              <p className="summary-value">{Object.keys(analytics.categoryWiseTotals || {}).length}</p>
            </div>
            <div className="summary-item">
              <p className="summary-label">Active Faculty</p>
              <p className="summary-value">{Object.keys(analytics.facultyWiseContribution || {}).length}</p>
            </div>
            <div className="summary-item">
              <p className="summary-label">Status Types</p>
              <p className="summary-value">{Object.keys(analytics.statusWiseBreakdown || {}).length}</p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default AdminAnalytics;

