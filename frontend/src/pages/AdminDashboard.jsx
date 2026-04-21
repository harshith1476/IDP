import { useEffect, useState, useRef } from 'react';
import Layout from '../components/Layout';
import { adminService } from '../services/adminService';

// Auto-refresh interval in milliseconds (5 seconds)
const REFRESH_INTERVAL = 5000;

function AdminDashboard() {
  const [stats, setStats] = useState({
    facultyCount: 0,
    journals: 0,
    conferences: 0,
    patents: 0,
    bookChapters: 0,
    books: 0,
    projects: 0
  });
  const intervalRef = useRef(null);

  useEffect(() => {
    // Initial load
    loadStats();

    // Set up auto-refresh interval
    intervalRef.current = setInterval(() => {
      loadStats();
    }, REFRESH_INTERVAL);

    // Cleanup interval on unmount
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const loadStats = async () => {
    try {
      const [profilesRes, journalsRes, conferencesRes, patentsRes, bookChaptersRes, booksRes, projectsRes] = await Promise.all([
        adminService.getAllProfiles(),
        adminService.getAllJournals(),
        adminService.getAllConferences(),
        adminService.getAllPatents(),
        adminService.getAllBookChapters(),
        adminService.getAllBooks(),
        adminService.getAllProjects()
      ]);

      setStats({
        facultyCount: profilesRes.data.length,
        journals: journalsRes.data.length,
        conferences: conferencesRes.data.length,
        patents: patentsRes.data.length,
        bookChapters: bookChaptersRes.data.length,
        books: booksRes.data.length,
        projects: projectsRes.data.length
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  return (
    <Layout title="Admin Dashboard">
      <div className="admin-dashboard">
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-card-content">
              <h3 className="stat-label">Total Faculty</h3>
              <p className="stat-value stat-value-blue">{stats.facultyCount}</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-card-content">
              <h3 className="stat-label">Journals</h3>
              <p className="stat-value stat-value-green">{stats.journals}</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-card-content">
              <h3 className="stat-label">Conferences</h3>
              <p className="stat-value stat-value-slate">{stats.conferences}</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-card-content">
              <h3 className="stat-label">Patents</h3>
              <p className="stat-value stat-value-slate">{stats.patents}</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-card-content">
              <h3 className="stat-label">Book Chapters</h3>
              <p className="stat-value stat-value-slate">{stats.bookChapters}</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-card-content">
              <h3 className="stat-label">Books</h3>
              <p className="stat-value stat-value-slate">{stats.books}</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-card-content">
              <h3 className="stat-label">Projects</h3>
              <p className="stat-value stat-value-slate">{stats.projects}</p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default AdminDashboard;

