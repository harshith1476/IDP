import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { facultyService } from '../services/facultyService';
import './FacultyDashboard.css';

function FacultyDashboard() {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [imageError, setImageError] = useState(false);
  const [stats, setStats] = useState({
    journals: 0,
    conferences: 0,
    patents: 0,
    bookChapters: 0,
    books: 0,
    projects: 0
  });

  // Get initials for avatar fallback
  const getInitials = (name) => {
    if (!name) return 'FA';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  // Get photo URL - handles both external URLs and file paths
  const getPhotoUrl = (photoPath) => {
    if (!photoPath) return null;
    // If it's already a full URL, return it directly
    if (photoPath.startsWith('http://') || photoPath.startsWith('https://')) {
      return photoPath;
    }
    // Otherwise, treat it as a file path and use the download endpoint
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ||
      (import.meta.env.DEV ? 'http://localhost:8080/api' : 'https://drims-rnv0.onrender.com/api');
    return `${API_BASE_URL}/files/download?path=${encodeURIComponent(photoPath)}`;
  };

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [
        profileRes,
        journalsRes,
        conferencesRes,
        patentsRes,
        bookChaptersRes,
        booksRes,
        projectsRes
      ] = await Promise.all([
        facultyService.getProfile(),
        facultyService.getJournals(),
        facultyService.getConferences(),
        facultyService.getPatents(),
        facultyService.getBookChapters(),
        facultyService.getBooks(),
        facultyService.getProjects()
      ]);

      setProfile(profileRes.data);
      setImageError(false); // reset image error so new/updated photo is displayed
      setStats({
        journals: journalsRes.data.length,
        conferences: conferencesRes.data.length,
        patents: patentsRes.data.length,
        bookChapters: bookChaptersRes.data.length,
        books: booksRes.data.length,
        projects: projectsRes.data.length
      });
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout title="Faculty Dashboard">
      {/* Loading Skeleton to prevent CLS */}
      {loading ? (
        <div className="faculty-profile-container animate-pulse">
          <div className="h-8 w-32 bg-gray-200 rounded mb-6"></div>
          <div className="faculty-profile-content-wrapper">
            <div className="faculty-profile-left">
              <div className="faculty-profile-image-wrapper bg-gray-200 aspect-[5/4] rounded-xl"></div>
            </div>
            <div className="faculty-profile-right">
              <div className="h-8 w-64 bg-gray-200 rounded mb-4"></div>
              <div className="h-4 w-48 bg-gray-200 rounded mb-8"></div>
              <div className="space-y-3">
                <div className="h-4 w-full bg-gray-100 rounded"></div>
                <div className="h-4 w-full bg-gray-100 rounded"></div>
                <div className="h-4 w-3/4 bg-gray-100 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      ) : profile && (
        <div className="faculty-profile-container">
          {/* Profile Title - Above everything */}
          <h1 className="faculty-profile-title">Profile</h1>

          <div className="faculty-profile-content-wrapper">
            {/* Left Column - Image Only */}
            <div className="faculty-profile-left">
              <div className="faculty-profile-image-wrapper">
                {profile.photoPath && !imageError ? (
                  <img
                    src={getPhotoUrl(profile.photoPath)}
                    alt={profile.name}
                    className="faculty-profile-image"
                    onError={() => setImageError(true)}
                  />
                ) : (
                  <div className="faculty-profile-image-fallback">
                    {getInitials(profile.name)}
                  </div>
                )}
              </div>
            </div>

            {/* Right Column - All Profile Information */}
            <div className="faculty-profile-right">
              {/* Name and Designation */}
              <div className="faculty-name-designation-section">
                <h2 className="faculty-profile-name">{profile.name}</h2>
                <p className="faculty-profile-designation">{profile.designation}</p>
              </div>

              {/* Description Section */}
              {profile.description && (
                <div className="faculty-description-section">
                  <p className="faculty-description-text">{profile.description}</p>
                </div>
              )}

              {/* Details Section */}
              <div className="faculty-profile-section">
                <h3 className="faculty-section-heading">Details</h3>
                <ul className="faculty-details-list">
                  <li><strong>Employee ID:</strong> {profile.employeeId}</li>
                  <li><strong>Email:</strong> {profile.email}</li>
                  <li><strong>Department:</strong> {profile.department}</li>
                  {profile.researchAreas && profile.researchAreas.length > 0 && (
                    <li>
                      <strong>Research Areas:</strong> {profile.researchAreas.join(', ')}
                    </li>
                  )}
                  {profile.orcidId && (
                    <li><strong>ORCID ID:</strong> {profile.orcidId}</li>
                  )}
                  {profile.scopusId && (
                    <li><strong>Scopus ID:</strong> {profile.scopusId}</li>
                  )}
                  {profile.googleScholarLink && (
                    <li>
                      <strong>Google Scholar:</strong>{' '}
                      <a href={profile.googleScholarLink} target="_blank" rel="noopener noreferrer" className="faculty-link">
                        View Profile
                      </a>
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quick stats cards row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 mb-8 mt-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-gray-500 text-sm font-medium mb-2">Journals</h3>
          <p className="text-3xl font-bold text-blue-600">{stats.journals}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-gray-500 text-sm font-medium mb-2">Conferences</h3>
          <p className="text-3xl font-bold text-green-600">{stats.conferences}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-gray-500 text-sm font-medium mb-2">Patents</h3>
          <p className="text-3xl font-bold text-purple-600">{stats.patents}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-gray-500 text-sm font-medium mb-2">Book Chapters</h3>
          <p className="text-3xl font-bold text-orange-600">{stats.bookChapters}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-gray-500 text-sm font-medium mb-2">Books</h3>
          <p className="text-3xl font-bold text-indigo-600">{stats.books}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-gray-500 text-sm font-medium mb-2">Projects</h3>
          <p className="text-3xl font-bold text-teal-600">{stats.projects}</p>
        </div>
      </div>
    </Layout>
  );
}

export default FacultyDashboard;
