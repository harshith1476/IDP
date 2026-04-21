import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { adminService } from '../services/adminService';
import './AdminFacultyDetail.css';

function AdminFacultyDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    loadCompleteData();
  }, [id]);

  // Refresh data when component becomes visible (handles browser tab switching)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        loadCompleteData();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [id]);

  const loadCompleteData = async () => {
    try {
      const response = await adminService.getCompleteFacultyData(id);
      setData(response.data);
    } catch (error) {
      console.error('Error loading faculty data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Get initials for avatar
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

  if (loading) {
    return (
      <Layout title="Faculty Details">
        <div className="faculty-loading">
          <div className="loading-spinner"></div>
          <p>Loading faculty data...</p>
        </div>
      </Layout>
    );
  }

  if (!data) {
    return (
      <Layout title="Faculty Details">
        <div className="faculty-error">
          Faculty data not found
        </div>
      </Layout>
    );
  }

  const { profile, targets, journals, conferences, patents, bookChapters, books = [], projects = [] } = data;
  const totalPublications = journals.length + conferences.length + patents.length + bookChapters.length + books.length + projects.length;

  return (
    <Layout title={`Faculty Details - ${profile.name}`}>
      <div className="faculty-detail-page">
        {/* Back Button and Refresh */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <button
            onClick={() => navigate('/admin/faculty')}
            className="back-button"
          >
            <svg className="back-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Faculty List
          </button>
          <button
            onClick={loadCompleteData}
            disabled={loading}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 16px',
              background: '#1e3a8a',
              color: '#ffffff',
              border: 'none',
              borderRadius: '6px',
              fontSize: '14px',
              fontWeight: '500',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.6 : 1,
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => !loading && (e.target.style.background = '#1e40af')}
            onMouseLeave={(e) => !loading && (e.target.style.background = '#1e3a8a')}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              style={{
                animation: loading ? 'spin 1s linear infinite' : 'none',
                transform: loading ? 'rotate(360deg)' : 'none'
              }}
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            {loading ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>

        {/* Official Profile Header */}
        <div className="faculty-header-card">
          <div className="faculty-header-content">
            <div className="faculty-avatar-section">
              {profile.photoPath ? (
                <img
                  src={getPhotoUrl(profile.photoPath)}
                  alt={profile.name}
                  className="faculty-avatar"
                  style={{ objectFit: 'cover', borderRadius: '50%' }}
                  onError={(e) => {
                    // Fallback to initials if image fails to load
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
              ) : null}
              <div
                className="faculty-avatar"
                style={{ display: profile.photoPath ? 'none' : 'flex' }}
              >
                {getInitials(profile.name)}
              </div>
            </div>

            <div className="faculty-info-section">
              <h1 className="faculty-name">{profile.name}</h1>
              <p className="faculty-designation">{profile.designation}</p>
              <p className="faculty-department">{profile.department}</p>
              <div className="faculty-meta">
                <span className="faculty-meta-item">
                  <strong>Employee ID:</strong> {profile.employeeId}
                </span>
                <span className="faculty-meta-item">
                  <strong>Email:</strong> {profile.email}
                </span>
              </div>
              {profile.description && (
                <p className="faculty-description" style={{ marginTop: '12px', fontSize: '14px', color: '#64748b', lineHeight: '1.6' }}>
                  {profile.description}
                </p>
              )}
            </div>

            <div className="faculty-metrics-section">
              <div className="metric-card">
                <div className="metric-value">{totalPublications}</div>
                <div className="metric-label">Total Publications</div>
              </div>
              <div className="metric-card">
                <div className="metric-value">{journals.length}</div>
                <div className="metric-label">Journals</div>
              </div>
              <div className="metric-card">
                <div className="metric-value">{conferences.length}</div>
                <div className="metric-label">Conferences</div>
              </div>
              <div className="metric-card">
                <div className="metric-value">{projects.length}</div>
                <div className="metric-label">Projects</div>
              </div>
            </div>
          </div>
        </div>

        {/* Official Tabs */}
        <div className="faculty-tabs-container">
          <nav className="faculty-tabs">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'targets', label: 'Research Targets' },
              { id: 'journals', label: `Journals (${journals.length})` },
              { id: 'conferences', label: `Conferences (${conferences.length})` },
              { id: 'patents', label: `Patents (${patents.length})` },
              { id: 'bookChapters', label: `Book Chapters (${bookChapters.length})` },
              { id: 'books', label: `Books (${books.length})` },
              { id: 'projects', label: `Projects (${projects.length})` }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`faculty-tab ${activeTab === tab.id ? 'active' : ''}`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="faculty-content">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Research Areas */}
              <div className="content-section">
                <h3 className="section-title">Research Areas</h3>
                <div className="research-areas">
                  {profile.researchAreas?.map((area, index) => (
                    <span key={index} className="research-pill">
                      {area}
                    </span>
                  ))}
                </div>
              </div>

              {/* Academic Profiles */}
              <div className="content-section">
                <h3 className="section-title">Academic Profiles</h3>
                <div className="academic-profiles-grid">
                  {profile.orcidId && (
                    <div className="academic-profile-card">
                      <p className="academic-profile-label">ORCID ID</p>
                      <p className="academic-profile-value">{profile.orcidId}</p>
                    </div>
                  )}
                  {profile.scopusId && (
                    <div className="academic-profile-card">
                      <p className="academic-profile-label">Scopus ID</p>
                      <p className="academic-profile-value">{profile.scopusId}</p>
                    </div>
                  )}
                  {profile.googleScholarLink && (
                    <div className="academic-profile-card">
                      <p className="academic-profile-label">Google Scholar</p>
                      <a href={profile.googleScholarLink} target="_blank" rel="noopener noreferrer" className="academic-profile-link">
                        View Profile →
                      </a>
                    </div>
                  )}
                </div>
              </div>

              {/* Statistics */}
              <div className="content-section">
                <h3 className="section-title">Publication Statistics</h3>
                <div className="stats-grid">
                  <div className="stat-box stat-box-blue">
                    <div className="stat-box-value">{journals.length}</div>
                    <div className="stat-box-label">Journals</div>
                  </div>
                  <div className="stat-box stat-box-slate">
                    <div className="stat-box-value">{conferences.length}</div>
                    <div className="stat-box-label">Conferences</div>
                  </div>
                  <div className="stat-box stat-box-slate">
                    <div className="stat-box-value">{patents.length}</div>
                    <div className="stat-box-label">Patents</div>
                  </div>
                  <div className="stat-box stat-box-slate">
                    <div className="stat-box-value">{bookChapters.length}</div>
                    <div className="stat-box-label">Book Chapters</div>
                  </div>
                  <div className="stat-box stat-box-slate">
                    <div className="stat-box-value">{projects.length}</div>
                    <div className="stat-box-label">Projects</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'targets' && (
            <div className="content-section">
              <h3 className="section-title">Research Targets</h3>
              {targets.length === 0 ? (
                <p className="empty-state">No targets set</p>
              ) : (
                <div className="table-wrapper">
                  <table className="faculty-table">
                    <thead>
                      <tr>
                        <th>Year</th>
                        <th>Journals</th>
                        <th>Conferences</th>
                        <th>Patents</th>
                        <th>Book Chapters</th>
                        <th>Projects</th>
                      </tr>
                    </thead>
                    <tbody>
                      {targets.map((target) => (
                        <tr key={target.id}>
                          <td className="font-medium">{target.year}</td>
                          <td>{target.journalTarget || 0}</td>
                          <td>{target.conferenceTarget || 0}</td>
                          <td>{target.patentTarget || 0}</td>
                          <td>{target.bookChapterTarget || 0}</td>
                          <td>{target.projectTarget || 0}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {activeTab === 'journals' && (
            <div className="content-section">
              <h3 className="section-title">Journal Publications</h3>
              {journals.length === 0 ? (
                <p className="empty-state">No journal publications</p>
              ) : (
                <div className="publications-list">
                  {journals.map((journal) => (
                    <div key={journal.id} className="publication-card">
                      <h4 className="publication-title">{journal.title}</h4>
                      <div className="publication-details">
                        <div className="publication-detail-row">
                          <span className="detail-label">Journal:</span>
                          <span className="detail-value">{journal.journalName}</span>
                        </div>
                        <div className="publication-detail-row">
                          <span className="detail-label">Year:</span>
                          <span className="detail-value">{journal.year}</span>
                        </div>
                        <div className="publication-detail-row">
                          <span className="detail-label">Authors:</span>
                          <span className="detail-value">{Array.isArray(journal.authors) ? journal.authors.join(', ') : journal.authors}</span>
                        </div>
                        {journal.correspondingAuthors && journal.correspondingAuthors.length > 0 && (
                          <div className="publication-detail-row">
                            <span className="detail-label">Corresponding Authors:</span>
                            <span className="detail-value">{journal.correspondingAuthors.join(', ')}</span>
                          </div>
                        )}
                        {journal.volume && (
                          <div className="publication-detail-row">
                            <span className="detail-label">Volume:</span>
                            <span className="detail-value">{journal.volume}</span>
                          </div>
                        )}
                        {journal.issue && (
                          <div className="publication-detail-row">
                            <span className="detail-label">Issue:</span>
                            <span className="detail-value">{journal.issue}</span>
                          </div>
                        )}
                        {journal.doi && (
                          <div className="publication-detail-row">
                            <span className="detail-label">DOI:</span>
                            <a href={journal.doi} target="_blank" rel="noopener noreferrer" className="detail-link">
                              {journal.doi}
                            </a>
                          </div>
                        )}
                        {journal.publisher && (
                          <div className="publication-detail-row">
                            <span className="detail-label">Publisher:</span>
                            <span className="detail-value">{journal.publisher}</span>
                          </div>
                        )}
                        {journal.indexType && (
                          <div className="publication-detail-row">
                            <span className="detail-label">Index Type:</span>
                            <span className="detail-value">{journal.indexType}</span>
                          </div>
                        )}
                        {journal.quartile && (
                          <div className="publication-detail-row">
                            <span className="detail-label">Quartile:</span>
                            <span className="detail-value">{journal.quartile}</span>
                          </div>
                        )}
                        {journal.impactFactor && (
                          <div className="publication-detail-row">
                            <span className="detail-label">Impact Factor:</span>
                            <span className="detail-value">{journal.impactFactor}</span>
                          </div>
                        )}
                        {journal.journalHIndex && (
                          <div className="publication-detail-row">
                            <span className="detail-label">h-index:</span>
                            <span className="detail-value">{journal.journalHIndex}</span>
                          </div>
                        )}
                        <div className="publication-detail-row">
                          <span className="detail-label">Status:</span>
                          <span className={`status-badge status-${journal.status.toLowerCase()}`}>
                            {journal.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'conferences' && (
            <div className="content-section">
              <h3 className="section-title">Conference Publications</h3>
              {conferences.length === 0 ? (
                <p className="empty-state">No conference publications</p>
              ) : (
                <div className="publications-list">
                  {conferences.map((conference) => (
                    <div key={conference.id} className="publication-card">
                      <h4 className="publication-title">{conference.title}</h4>
                      <div className="publication-details">
                        <div className="publication-detail-row">
                          <span className="detail-label">Conference:</span>
                          <span className="detail-value">{conference.conferenceName}</span>
                        </div>
                        <div className="publication-detail-row">
                          <span className="detail-label">Year:</span>
                          <span className="detail-value">{conference.year}</span>
                        </div>
                        <div className="publication-detail-row">
                          <span className="detail-label">Authors:</span>
                          <span className="detail-value">{Array.isArray(conference.authors) ? conference.authors.join(', ') : conference.authors}</span>
                        </div>
                        {conference.correspondingAuthors && conference.correspondingAuthors.length > 0 && (
                          <div className="publication-detail-row">
                            <span className="detail-label">Corresponding Authors:</span>
                            <span className="detail-value">{conference.correspondingAuthors.join(', ')}</span>
                          </div>
                        )}
                        {conference.date && (
                          <div className="publication-detail-row">
                            <span className="detail-label">Date:</span>
                            <span className="detail-value">{conference.date}</span>
                          </div>
                        )}
                        {conference.location && (
                          <div className="publication-detail-row">
                            <span className="detail-label">Location:</span>
                            <span className="detail-value">{conference.location}</span>
                          </div>
                        )}
                        {conference.doi && (
                          <div className="publication-detail-row">
                            <span className="detail-label">DOI:</span>
                            <span className="detail-value">{conference.doi}</span>
                          </div>
                        )}
                        {conference.publisher && (
                          <div className="publication-detail-row">
                            <span className="detail-label">Publisher:</span>
                            <span className="detail-value">{conference.publisher}</span>
                          </div>
                        )}
                        {conference.volume && (
                          <div className="publication-detail-row">
                            <span className="detail-label">Volume:</span>
                            <span className="detail-value">{conference.volume}</span>
                          </div>
                        )}

                        <div className="publication-detail-row">
                          <span className="detail-label">Status:</span>
                          <span className={`status-badge status-${conference.status.toLowerCase()}`}>
                            {conference.status}
                          </span>
                        </div>
                        {conference.paymentDetails && (
                          <div className="publication-detail-row">
                            <span className="detail-label">Payment Details:</span>
                            <span className="detail-value">{conference.paymentDetails}</span>
                          </div>
                        )}
                        {conference.status === 'Published' && conference.publishedIn && (
                          <div className="publication-detail-row">
                            <span className="detail-label">Published In:</span>
                            <span className="detail-value">
                              {conference.publishedIn === 'Others' ? conference.otherPublishedIn : conference.publishedIn}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'patents' && (
            <div className="content-section">
              <h3 className="section-title">Patents</h3>
              {patents.length === 0 ? (
                <p className="empty-state">No patents</p>
              ) : (
                <div className="publications-list">
                  {patents.map((patent) => (
                    <div key={patent.id} className="publication-card">
                      <h4 className="publication-title">{patent.title}</h4>
                      <div className="publication-details">
                        <div className="publication-detail-row">
                          <span className="detail-label">Patent Number:</span>
                          <span className="detail-value">{patent.patentNumber}</span>
                        </div>
                        <div className="publication-detail-row">
                          <span className="detail-label">Year:</span>
                          <span className="detail-value">{patent.year}</span>
                        </div>
                        <div className="publication-detail-row">
                          <span className="detail-label">Inventors:</span>
                          <span className="detail-value">{Array.isArray(patent.inventors) ? patent.inventors.join(', ') : patent.inventors}</span>
                        </div>
                        {patent.correspondingInventors && patent.correspondingInventors.length > 0 && (
                          <div className="publication-detail-row">
                            <span className="detail-label">Corresponding Inventors:</span>
                            <span className="detail-value">{patent.correspondingInventors.join(', ')}</span>
                          </div>
                        )}
                        <div className="publication-detail-row">
                          <span className="detail-label">Country:</span>
                          <span className="detail-value">{patent.country}</span>
                        </div>
                        {patent.doi && (
                          <div className="publication-detail-row">
                            <span className="detail-label">DOI:</span>
                            <span className="detail-value">{patent.doi}</span>
                          </div>
                        )}
                        {patent.publisher && (
                          <div className="publication-detail-row">
                            <span className="detail-label">Publisher:</span>
                            <span className="detail-value">{patent.publisher}</span>
                          </div>
                        )}
                        {patent.volume && (
                          <div className="publication-detail-row">
                            <span className="detail-label">Volume:</span>
                            <span className="detail-value">{patent.volume}</span>
                          </div>
                        )}

                        <div className="publication-detail-row">
                          <span className="detail-label">Status:</span>
                          <span className={`status-badge status-${patent.status.toLowerCase()}`}>
                            {patent.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'bookChapters' && (
            <div className="content-section">
              <h3 className="section-title">Book Chapters</h3>
              {bookChapters.length === 0 ? (
                <p className="empty-state">No book chapters</p>
              ) : (
                <div className="publications-list">
                  {bookChapters.map((chapter) => (
                    <div key={chapter.id} className="publication-card">
                      <h4 className="publication-title">{chapter.title}</h4>
                      <div className="publication-details">
                        <div className="publication-detail-row">
                          <span className="detail-label">Book Title:</span>
                          <span className="detail-value">{chapter.bookTitle}</span>
                        </div>
                        <div className="publication-detail-row">
                          <span className="detail-label">Year:</span>
                          <span className="detail-value">{chapter.year}</span>
                        </div>
                        <div className="publication-detail-row">
                          <span className="detail-label">Authors:</span>
                          <span className="detail-value">{Array.isArray(chapter.authors) ? chapter.authors.join(', ') : chapter.authors}</span>
                        </div>
                        {chapter.correspondingAuthors && chapter.correspondingAuthors.length > 0 && (
                          <div className="publication-detail-row">
                            <span className="detail-label">Corresponding Authors:</span>
                            <span className="detail-value">{chapter.correspondingAuthors.join(', ')}</span>
                          </div>
                        )}
                        {chapter.doi && (
                          <div className="publication-detail-row">
                            <span className="detail-label">DOI:</span>
                            <span className="detail-value">{chapter.doi}</span>
                          </div>
                        )}
                        {chapter.volume && (
                          <div className="publication-detail-row">
                            <span className="detail-label">Volume:</span>
                            <span className="detail-value">{chapter.volume}</span>
                          </div>
                        )}

                        {chapter.publisher && (
                          <div className="publication-detail-row">
                            <span className="detail-label">Publisher:</span>
                            <span className="detail-value">{chapter.publisher}</span>
                          </div>
                        )}
                        {chapter.editors && (
                          <div className="publication-detail-row">
                            <span className="detail-label">Editors:</span>
                            <span className="detail-value">{chapter.editors}</span>
                          </div>
                        )}
                        {chapter.isbn && (
                          <div className="publication-detail-row">
                            <span className="detail-label">ISBN:</span>
                            <span className="detail-value">{chapter.isbn}</span>
                          </div>
                        )}
                        {chapter.pages && (
                          <div className="publication-detail-row">
                            <span className="detail-label">Pages:</span>
                            <span className="detail-value">{chapter.pages}</span>
                          </div>
                        )}
                        <div className="publication-detail-row">
                          <span className="detail-label">Status:</span>
                          <span className={`status-badge status-${chapter.status.toLowerCase()}`}>
                            {chapter.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          {activeTab === 'books' && (
            <div className="content-section">
              <h3 className="section-title">Books</h3>
              {books.length === 0 ? (
                <p className="empty-state">No books</p>
              ) : (
                <div className="publications-list">
                  {books.map((book) => (
                    <div key={book.id} className="publication-card">
                      <h4 className="publication-title">{book.bookTitle}</h4>
                      <div className="publication-details">
                        <div className="publication-detail-row">
                          <span className="detail-label">Publisher:</span>
                          <span className="detail-value">{book.publisher}</span>
                        </div>
                        <div className="publication-detail-row">
                          <span className="detail-label">Year:</span>
                          <span className="detail-value">{book.publicationYear}</span>
                        </div>
                        <div className="publication-detail-row">
                          <span className="detail-label">Authors:</span>
                          <span className="detail-value">{Array.isArray(book.authors) ? book.authors.join(', ') : (book.authors || 'N/A')}</span>
                        </div>
                        {book.correspondingAuthors && book.correspondingAuthors.length > 0 && (
                          <div className="publication-detail-row">
                            <span className="detail-label">Corresponding Authors:</span>
                            <span className="detail-value">{book.correspondingAuthors.join(', ')}</span>
                          </div>
                        )}
                        <div className="publication-detail-row">
                          <span className="detail-label">Role:</span>
                          <span className="detail-value">{book.role}</span>
                        </div>
                        {book.isbn && (
                          <div className="publication-detail-row">
                            <span className="detail-label">ISBN:</span>
                            <span className="detail-value">{book.isbn}</span>
                          </div>
                        )}
                        {book.doi && (
                          <div className="publication-detail-row">
                            <span className="detail-label">DOI:</span>
                            <span className="detail-value">{book.doi}</span>
                          </div>
                        )}
                        {book.volume && (
                          <div className="publication-detail-row">
                            <span className="detail-label">Volume:</span>
                            <span className="detail-value">{book.volume}</span>
                          </div>
                        )}

                        <div className="publication-detail-row">
                          <span className="detail-label">Status:</span>
                          <span className={`status-badge status-${book.status ? book.status.toLowerCase() : 'N/A'}`}>
                            {book.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          {activeTab === 'projects' && (
            <div className="content-section">
              <h3 className="section-title">Projects</h3>
              {projects.length === 0 ? (
                <p className="empty-state">No projects</p>
              ) : (
                <div className="publications-list">
                  {projects.map((project) => (
                    <div key={project.id} className="publication-card">
                      <h4 className="publication-title">{project.title}</h4>
                      <div className="publication-details">
                        <div className="publication-detail-row">
                          <span className="detail-label">Project Type:</span>
                          <span className="detail-value">{project.projectType}</span>
                        </div>
                        <div className="publication-detail-row">
                          <span className="detail-label">Investigator:</span>
                          <span className="detail-value">{project.investigatorName}</span>
                        </div>
                        <div className="publication-detail-row">
                          <span className="detail-label">Department:</span>
                          <span className="detail-value">{project.department}</span>
                        </div>
                        <div className="publication-detail-row">
                          <span className="detail-label">Duration:</span>
                          <span className="detail-value">{project.duration}</span>
                        </div>
                        <div className="publication-detail-row">
                          <span className="detail-label">Amount:</span>
                          <span className="detail-value">{project.amount}</span>
                        </div>
                        <div className="publication-detail-row">
                          <span className="detail-label">Status:</span>
                          <span className={`status-badge status-${project.status ? project.status.toLowerCase() : 'N/A'}`}>
                            {project.status || 'N/A'}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}

export default AdminFacultyDetail;

