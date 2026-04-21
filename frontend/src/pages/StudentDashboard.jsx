import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { studentService } from '../services/studentService';
import { useNavigate } from 'react-router-dom';
import FileUpload from '../components/FileUpload';
import { useDeviceDetection } from '../hooks/useDeviceDetection';

function StudentDashboard() {
  const { isMobile } = useDeviceDetection();
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState({
    journals: 0,
    conferences: 0,
    pending: 0,
    approved: 0,
    rejected: 0
  });
  const [activeTab, setActiveTab] = useState('journals');
  const [journals, setJournals] = useState([]);
  const [conferences, setConferences] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({});
  const [dataLoading, setDataLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setDataLoading(true);
      const [profileRes, journalsRes, conferencesRes] = await Promise.all([
        studentService.getProfile(),
        studentService.getMyJournals(),
        studentService.getMyConferences()
      ]);

      setProfile(profileRes.data);
      setJournals(journalsRes.data);
      setConferences(conferencesRes.data);

      // Calculate stats
      const allPending = [...journalsRes.data, ...conferencesRes.data].filter(
        p => p.approvalStatus === 'SUBMITTED' || p.approvalStatus === 'SENT_BACK'
      ).length;
      const allApproved = [...journalsRes.data, ...conferencesRes.data].filter(
        p => p.approvalStatus === 'APPROVED' || p.approvalStatus === 'LOCKED'
      ).length;
      const allRejected = [...journalsRes.data, ...conferencesRes.data].filter(
        p => p.approvalStatus === 'REJECTED'
      ).length;

      setStats({
        journals: journalsRes.data.length,
        conferences: conferencesRes.data.length,
        pending: allPending,
        approved: allApproved,
        rejected: allRejected
      });
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setDataLoading(false);
    }
  };

  const openModal = (type) => {
    setActiveTab(type);
    setFormData(getDefaultFormData(type));
    setShowModal(true);
  };

  const getDefaultFormData = (type) => {
    const base = {
      year: new Date().getFullYear(),
      status: 'Published',
      approvalStatus: 'SUBMITTED'
    };

    if (type === 'journals') {
      return {
        ...base,
        title: '',
        journalName: '',
        authors: [''],
        correspondingAuthors: [''],
        category: 'National',
        indexType: '',
        quartile: '',
        volume: '',
        issue: '',
        pages: '',
        doi: '',
        impactFactor: '',
        publisher: '',
        issn: '',
        openAccess: 'Open Access'
      };
    } else {
      return {
        ...base,
        title: '',
        conferenceName: '',
        organizer: '',
        authors: [''],
        correspondingAuthors: [''],
        category: 'National',
        location: '',
        date: '',
        registrationAmount: '',
        paymentMode: 'Online',
        isStudentPublication: true,
        studentName: profile?.name || '',
        studentRegisterNumber: profile?.registerNumber || '',
        guideId: profile?.guideId || '',
        guideName: profile?.guideName || '',
        publishedIn: '',
        otherPublishedIn: ''
      };
    }
  };

  const handleAddArrayItem = (field) => {
    setFormData(prev => ({
      ...prev,
      [field]: [...(prev[field] || []), '']
    }));
  };

  const handleRemoveArrayItem = (field, index) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const handleArrayItemChange = (field, index, value) => {
    setFormData(prev => {
      const updated = [...(prev[field] || [])];
      updated[index] = value;
      return { ...prev, [field]: updated };
    });
  };

  const renderAuthorSection = (type, title, field) => {
    return (
      <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 mt-2">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <h4 className="text-sm font-semibold text-gray-700">{title}</h4>
          <button
            type="button"
            onClick={() => handleAddArrayItem(field)}
            className="flex items-center gap-1 text-xs bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add {type}
          </button>
        </div>
        <div className="space-y-2">
          {(formData[field] || ['']).map((item, index) => (
            <div key={index} className="flex gap-2 items-center">
              <div className="flex-1">
                <label className="block text-xs text-gray-500 mb-1">
                  {type} {index + 1} {index === 0 && (field === 'authors') ? (
                    <> (Your name/First author <span className="text-red-600">*</span>)</>
                  ) : ''}
                </label>
                <input
                  type="text"
                  value={item || ''}
                  onChange={(e) => handleArrayItemChange(field, index, e.target.value)}
                  required={index === 0 && (field === 'authors')}
                  className="w-full px-3 py-1.5 border border-gray-300 rounded text-sm"
                  placeholder={`Enter ${type.toLowerCase()} ${index + 1}`}
                />
              </div>
              {index > 0 && (
                <button
                  type="button"
                  onClick={() => handleRemoveArrayItem(field, index)}
                  className="mt-5 p-1.5 bg-red-100 text-red-600 rounded hover:bg-red-200"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Clean up lists by removing empty strings
      const submissionData = { ...formData };
      ['authors', 'correspondingAuthors'].forEach(field => {
        if (Array.isArray(submissionData[field])) {
          submissionData[field] = submissionData[field].filter(item => item && item.trim() !== '');
        }
      });

      // Ensure mandatory fields have at least one entry
      if (submissionData.authors && submissionData.authors.length === 0) {
        submissionData.authors = [formData.authors[0] || ''];
      }

      if (activeTab === 'journals') {
        await studentService.submitJournal(submissionData);
      } else {
        await studentService.submitConference(submissionData);
      }
      setShowModal(false);
      loadData();
    } catch (error) {
      console.error('Error submitting publication:', error);
      alert('Failed to submit publication. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleStudentFileUpload = async (file, fieldName, category, fileType) => {
    if (!profile?.id) {
      alert('Profile not loaded. Please wait and try again.');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('userType', 'student');
      formData.append('userId', profile.id);
      formData.append('category', `${category}/${fileType}`);

      const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || (import.meta.env.DEV ? 'http://localhost:8080/api' : 'https://drims-rnv0.onrender.com/api');
      const response = await fetch(`${apiBaseUrl}/files/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error('File upload failed');
      }

      const result = await response.json();
      setFormData(prev => ({
        ...prev,
        [fieldName]: result
      }));
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Failed to upload file. Please try again.');
    }
  };

  const getStatusBadge = (status) => {
    const statusColors = {
      'SUBMITTED': 'bg-yellow-100 text-yellow-800',
      'APPROVED': 'bg-green-100 text-green-800',
      'REJECTED': 'bg-red-100 text-red-800',
      'SENT_BACK': 'bg-orange-100 text-orange-800',
      'LOCKED': 'bg-blue-100 text-blue-800'
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[status] || 'bg-gray-100 text-gray-800'}`}>
        {status || 'SUBMITTED'}
      </span>
    );
  };

  return (
    <Layout title="Student Dashboard">
      <div className="space-y-6">
        {/* Profile Info Skeleton */}
        {dataLoading ? (
          <div className="bg-white rounded-lg shadow p-6 animate-pulse">
            <div className="h-6 w-48 bg-gray-200 rounded mb-4"></div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map(i => (
                <div key={i}>
                  <div className="h-3 w-16 bg-gray-100 rounded mb-2"></div>
                  <div className="h-5 w-32 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          </div>
        ) : profile && (
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Profile Information</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-gray-500">Name</p>
                <p className="font-medium">{profile.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Register Number</p>
                <p className="font-medium">{profile.registerNumber}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Department</p>
                <p className="font-medium">{profile.department}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Guide</p>
                <p className="font-medium">{profile.guideName || 'N/A'}</p>
              </div>
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="bg-white rounded-lg shadow p-4">
            <h3 className="text-gray-500 text-sm font-medium mb-2">Journals</h3>
            <p className="text-2xl font-bold text-blue-600">{stats.journals}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <h3 className="text-gray-500 text-sm font-medium mb-2">Conferences</h3>
            <p className="text-2xl font-bold text-green-600">{stats.conferences}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <h3 className="text-gray-500 text-sm font-medium mb-2">Pending</h3>
            <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <h3 className="text-gray-500 text-sm font-medium mb-2">Approved</h3>
            <p className="text-2xl font-bold text-green-600">{stats.approved}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <h3 className="text-gray-500 text-sm font-medium mb-2">Rejected</h3>
            <p className="text-2xl font-bold text-red-600">{stats.rejected}</p>
          </div>
        </div>

        {/* Publications Tabs */}
        <div className="bg-white rounded-lg shadow">
          <div className="border-b border-gray-200">
            <nav className={`flex -mb-px ${isMobile ? 'overflow-x-auto' : ''}`}>
              {['journals', 'conferences'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-4 px-4 sm:px-6 text-xs sm:text-sm font-medium border-b-2 whitespace-nowrap ${activeTab === tab
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-4 sm:p-6">
            <div className="mb-4">
              <button
                onClick={() => openModal(activeTab)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm sm:text-base"
              >
                Submit New {activeTab === 'journals' ? 'Journal' : 'Conference'}
              </button>
            </div>

            {/* Journals Table/Cards */}
            {activeTab === 'journals' && (
              <>
                {/* Mobile Card View */}
                {isMobile && (
                  <div className="mobile-card-view">
                    {journals.length === 0 ? (
                      <p className="text-gray-500 text-center py-8">No journals submitted yet.</p>
                    ) : (
                      journals.map((journal) => (
                        <div key={journal.id} className="data-card">
                          <div className="data-card-header">
                            <div className="data-card-title">{journal.title}</div>
                            <div className="data-card-status">{getStatusBadge(journal.approvalStatus)}</div>
                          </div>
                          <div className="data-card-body">
                            <div className="data-card-field">
                              <div className="data-card-label">Journal</div>
                              <div className="data-card-value">{journal.journalName}</div>
                            </div>
                            <div className="data-card-field">
                              <div className="data-card-label">Year</div>
                              <div className="data-card-value">{journal.year}</div>
                            </div>
                            <div className="data-card-field">
                              <div className="data-card-label">Category</div>
                              <div className="data-card-value">{journal.category || 'N/A'}</div>
                            </div>
                            <div className="data-card-field">
                              <div className="data-card-label">Publication Status</div>
                              <div className="data-card-value">{journal.status || 'N/A'}</div>
                            </div>
                          </div>
                          <div className="data-card-actions">
                            <button
                              onClick={() => navigate(`/student/journals/${journal.id}/status`)}
                              className="bg-blue-600 text-white"
                            >
                              View Status
                            </button>
                          </div>
                          {journal.remarks && (
                            <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded">
                              <div className="data-card-label">Admin Remarks</div>
                              <div className="text-sm text-red-600">{journal.remarks}</div>
                            </div>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                )}

                {/* Desktop Table View */}
                {!isMobile && (
                  <div className="overflow-x-auto table-container">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Journal</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Year</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Publication Status</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Approval Status</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {journals.map((journal) => (
                          <tr key={journal.id}>
                            <td className="px-6 py-4 text-sm">{journal.title}</td>
                            <td className="px-6 py-4 text-sm">{journal.journalName}</td>
                            <td className="px-6 py-4 text-sm">{journal.year}</td>
                            <td className="px-6 py-4 text-sm">{journal.category || 'N/A'}</td>
                            <td className="px-6 py-4 text-sm">{journal.status || 'N/A'}</td>
                            <td className="px-6 py-4 text-sm">{getStatusBadge(journal.approvalStatus)}</td>
                            <td className="px-6 py-4 text-sm">
                              <button
                                onClick={() => navigate(`/student/journals/${journal.id}/status`)}
                                className="text-blue-600 hover:text-blue-900"
                              >
                                View Status
                              </button>
                              {journal.remarks && (
                                <div className="mt-2 text-xs text-red-600">
                                  Remarks: {journal.remarks}
                                </div>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {journals.length === 0 && (
                      <p className="text-gray-500 text-center py-8">No journals submitted yet.</p>
                    )}
                  </div>
                )}
              </>
            )}

            {/* Conferences Table/Cards */}
            {activeTab === 'conferences' && (
              <>
                {/* Mobile Card View */}
                {isMobile && (
                  <div className="mobile-card-view">
                    {conferences.length === 0 ? (
                      <p className="text-gray-500 text-center py-8">No conferences submitted yet.</p>
                    ) : (
                      conferences.map((conference) => (
                        <div key={conference.id} className="data-card">
                          <div className="data-card-header">
                            <div className="data-card-title">{conference.title}</div>
                            <div className="data-card-status">{getStatusBadge(conference.approvalStatus)}</div>
                          </div>
                          <div className="data-card-body">
                            <div className="data-card-field">
                              <div className="data-card-label">Conference</div>
                              <div className="data-card-value">{conference.conferenceName}</div>
                            </div>
                            <div className="data-card-field">
                              <div className="data-card-label">Year</div>
                              <div className="data-card-value">{conference.year}</div>
                            </div>
                            <div className="data-card-field">
                              <div className="data-card-label">Category</div>
                              <div className="data-card-value">{conference.category || 'N/A'}</div>
                            </div>
                            <div className="data-card-field">
                              <div className="data-card-label">Publication Status</div>
                              <div className="data-card-value">{conference.status || 'N/A'}</div>
                            </div>
                            <div className="data-card-field">
                              <div className="data-card-label">Status</div>
                              <div className="data-card-value">{getStatusBadge(conference.approvalStatus)}</div>
                            </div>
                          </div>
                          <div className="data-card-actions">
                            <button
                              onClick={() => navigate(`/student/conferences/${conference.id}/status`)}
                              className="bg-blue-600 text-white"
                            >
                              View Status
                            </button>
                          </div>
                          {conference.remarks && (
                            <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded">
                              <div className="data-card-label">Admin Remarks</div>
                              <div className="text-sm text-red-600">{conference.remarks}</div>
                            </div>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                )}

                {/* Desktop Table View */}
                {!isMobile && (
                  <div className="overflow-x-auto table-container">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Conference</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Year</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Publication Status</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {conferences.map((conference) => (
                          <tr key={conference.id}>
                            <td className="px-6 py-4 text-sm">{conference.title}</td>
                            <td className="px-6 py-4 text-sm">{conference.conferenceName}</td>
                            <td className="px-6 py-4 text-sm">{conference.year}</td>
                            <td className="px-6 py-4 text-sm">{conference.category || 'N/A'}</td>
                            <td className="px-6 py-4 text-sm">{conference.status || 'N/A'}</td>
                            <td className="px-6 py-4 text-sm">{getStatusBadge(conference.approvalStatus)}</td>
                            <td className="px-6 py-4 text-sm">
                              <button
                                onClick={() => navigate(`/student/conferences/${conference.id}/status`)}
                                className="text-blue-600 hover:text-blue-900"
                              >
                                View Status
                              </button>
                              {conference.remarks && (
                                <div className="mt-2 text-xs text-red-600">
                                  Remarks: {conference.remarks}
                                </div>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {conferences.length === 0 && (
                      <p className="text-gray-500 text-center py-8">No conferences submitted yet.</p>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-40 p-4">
            <div className="bg-white rounded-xl shadow-2xl p-5 pt-4 max-w-4xl w-full max-h-[78vh] overflow-y-auto">
              <h3 className="text-lg font-bold mb-2 text-gray-800">
                Submit New {activeTab === 'journals' ? 'Journal' : 'Conference'}
              </h3>
              <form onSubmit={handleSubmit} className="space-y-3">
                {activeTab === 'journals' ? (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Title of the Article <span className="text-red-600">*</span></label>
                      <input
                        type="text"
                        value={formData.title || ''}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        required
                        className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Journal Name <span className="text-red-600">*</span></label>
                      <input
                        type="text"
                        value={formData.journalName || ''}
                        onChange={(e) => setFormData({ ...formData, journalName: e.target.value })}
                        required
                        className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Category <span className="text-red-600">*</span></label>
                        <select
                          value={formData.category || 'National'}
                          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                          required
                          className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm"
                        >
                          <option value="National">National</option>
                          <option value="International">International</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Index Type</label>
                        <select
                          value={formData.indexType || ''}
                          onChange={(e) => setFormData({ ...formData, indexType: e.target.value })}
                          className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm"
                        >
                          <option value="">Select Index Type</option>
                          <option value="SCI">SCI</option>
                          <option value="SCIE">SCIE</option>
                          <option value="Scopus">Scopus</option>
                          <option value="ESCI">ESCI</option>
                          <option value="WoS">Web of Science (WoS)</option>
                          <option value="UGC CARE">UGC CARE</option>
                        </select>
                      </div>
                    </div>

                    {(formData.indexType === 'SCI' || formData.indexType === 'SCIE') && (
                      <div className="mb-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Quartiles <span className="text-red-600">*</span></label>
                        <select
                          value={formData.quartile || ''}
                          onChange={(e) => setFormData({ ...formData, quartile: e.target.value })}
                          required
                          className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm"
                        >
                          <option value="">Select Quartile</option>
                          <option value="Q1">Q1</option>
                          <option value="Q2">Q2</option>
                          <option value="Q3">Q3</option>
                          <option value="Q4">Q4</option>
                        </select>
                      </div>
                    )}
                    {renderAuthorSection('Author', 'Author Details', 'authors')}
                    {renderAuthorSection('Corresponding Author', 'Corresponding Author Details', 'correspondingAuthors')}
                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Publication Year <span className="text-red-600">*</span></label>
                        <input
                          type="number"
                          value={formData.year || ''}
                          onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
                          required
                          min="2000"
                          max={new Date().getFullYear() + 1}
                          className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Volume</label>
                        <input
                          type="text"
                          value={formData.volume || ''}
                          onChange={(e) => setFormData({ ...formData, volume: e.target.value })}
                          className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Issue</label>
                        <input
                          type="text"
                          value={formData.issue || ''}
                          onChange={(e) => setFormData({ ...formData, issue: e.target.value })}
                          className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">DOI</label>
                      <input
                        type="text"
                        value={formData.doi || ''}
                        onChange={(e) => setFormData({ ...formData, doi: e.target.value })}
                        className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Impact Factor</label>
                        <input
                          type="text"
                          value={formData.impactFactor || ''}
                          onChange={(e) => setFormData({ ...formData, impactFactor: e.target.value })}
                          className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Publication Status <span className="text-red-600">*</span></label>
                        <select
                          value={formData.status || 'Published'}
                          onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                          required
                          className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm"
                        >
                          <option value="Communicated">Communicated</option>
                          <option value="Rejected">Rejected</option>
                          <option value="Accepted">Accepted</option>
                          <option value="Online Published">Online Published</option>
                          <option value="Published">Published</option>
                        </select>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Publisher</label>
                        <input
                          type="text"
                          value={formData.publisher || ''}
                          onChange={(e) => setFormData({ ...formData, publisher: e.target.value })}
                          className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">ISSN</label>
                        <input
                          type="text"
                          value={formData.issn || ''}
                          onChange={(e) => setFormData({ ...formData, issn: e.target.value })}
                          className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Open Access / Subscription</label>
                      <select
                        value={formData.openAccess || 'Open Access'}
                        onChange={(e) => setFormData({ ...formData, openAccess: e.target.value })}
                        className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm"
                      >
                        <option value="Open Access">Open Access</option>
                        <option value="Subscription">Subscription</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium text-gray-700 mb-1">Mandatory Uploads (PDF) <span className="text-red-600">*</span></h3>
                      <FileUpload
                        label="Acceptance Mail PDF"
                        acceptedFile={formData.acceptanceMailPath}
                        onFileChange={(file) => {
                          if (file && profile?.id) {
                            handleStudentFileUpload(file, 'acceptanceMailPath', 'journals', 'acceptance-mail');
                          }
                        }}
                        required
                        userType="student"
                        userId={profile?.id || ''}
                        category="journals"
                        disabled={false}
                      />
                      <FileUpload
                        label="Published Paper PDF"
                        acceptedFile={formData.publishedPaperPath}
                        onFileChange={(file) => {
                          if (file && profile?.id) {
                            handleStudentFileUpload(file, 'publishedPaperPath', 'journals', 'published-paper');
                          }
                        }}
                        required
                        userType="student"
                        userId={profile?.id || ''}
                        category="journals"
                        disabled={false}
                      />
                      <FileUpload
                        label="Index Proof PDF"
                        acceptedFile={formData.indexProofPath}
                        onFileChange={(file) => {
                          if (file && profile?.id) {
                            handleStudentFileUpload(file, 'indexProofPath', 'journals', 'index-proof');
                          }
                        }}
                        required
                        userType="student"
                        userId={profile?.id || ''}
                        category="journals"
                        disabled={false}
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Title of the Article <span className="text-red-600">*</span></label>
                      <input
                        type="text"
                        value={formData.title || ''}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3 mb-2">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Publication Status <span className="text-red-600">*</span></label>
                        <select
                          value={formData.status || 'Published'}
                          onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                          required
                          className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm"
                        >
                          <option value="Communicated">Communicated</option>
                          <option value="Rejected">Rejected</option>
                          <option value="Accepted">Accepted</option>
                          <option value="Online Published">Online Published</option>
                          <option value="Published">Published</option>
                        </select>
                      </div>
                      {formData.status === 'Published' ? (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Published In</label>
                          <select
                            value={formData.publishedIn || ''}
                            onChange={(e) => setFormData({ ...formData, publishedIn: e.target.value })}
                            className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm"
                          >
                            <option value="">Select Option</option>
                            <option value="Proceedings">Proceedings</option>
                            <option value="IEEE">IEEE</option>
                            <option value="Springer">Springer</option>
                            <option value="Others">Others</option>
                          </select>
                        </div>
                      ) : <div />}
                    </div>

                    {formData.status === 'Published' && formData.publishedIn === 'Others' && (
                      <div className="mb-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Specify <span className="text-red-600">*</span></label>
                        <input
                          type="text"
                          value={formData.otherPublishedIn || ''}
                          onChange={(e) => setFormData({ ...formData, otherPublishedIn: e.target.value })}
                          required
                          className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm"
                          placeholder="Enter publication details"
                        />
                      </div>
                    )}

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Conference Name <span className="text-red-600">*</span></label>
                      <input
                        type="text"
                        value={formData.conferenceName || ''}
                        onChange={(e) => setFormData({ ...formData, conferenceName: e.target.value })}
                        required
                        className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Category <span className="text-red-600">*</span></label>
                        <select
                          value={formData.category || 'National'}
                          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                          required
                          className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm"
                        >
                          <option value="National">National</option>
                          <option value="International">International</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Organizer</label>
                        <input
                          type="text"
                          value={formData.organizer || ''}
                          onChange={(e) => setFormData({ ...formData, organizer: e.target.value })}
                          className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm"
                        />
                      </div>
                    </div>


                    {renderAuthorSection('Author', 'Author Details', 'authors')}
                    {renderAuthorSection('Corresponding Author', 'Corresponding Author Details', 'correspondingAuthors')}
                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Year <span className="text-red-600">*</span></label>
                        <input
                          type="number"
                          value={formData.year || ''}
                          onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
                          required
                          min="2000"
                          max={new Date().getFullYear() + 1}
                          className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                        <input
                          type="text"
                          value={formData.location || ''}
                          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                          className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                        <input
                          type="date"
                          value={formData.date || ''}
                          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                          className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Registration Amount</label>
                        <input
                          type="text"
                          value={formData.registrationAmount || ''}
                          onChange={(e) => setFormData({ ...formData, registrationAmount: e.target.value })}
                          className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Payment Mode</label>
                        <select
                          value={formData.paymentMode || 'Online'}
                          onChange={(e) => setFormData({ ...formData, paymentMode: e.target.value })}
                          className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm"
                        >
                          <option value="Online">Online</option>
                          <option value="Cash">Cash</option>
                          <option value="Cheque">Cheque</option>
                          <option value="NEFT">NEFT</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Guide (Faculty Name) <span className="text-red-600">*</span></label>
                      <input
                        type="text"
                        value={formData.guideName || ''}
                        onChange={(e) => setFormData({ ...formData, guideName: e.target.value })}
                        required
                        className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm"
                      />
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-sm font-medium text-gray-700 mb-1">Mandatory Uploads (PDF) <span className="text-red-600">*</span></h3>
                      <FileUpload
                        label="Registration Receipt PDF"
                        acceptedFile={formData.registrationReceiptPath}
                        onFileChange={(file) => {
                          if (file && profile?.id) {
                            handleStudentFileUpload(file, 'registrationReceiptPath', 'conferences', 'registration-receipt');
                          }
                        }}
                        required
                        userType="student"
                        userId={profile?.id || ''}
                        category="conferences"
                        disabled={false}
                      />
                      <FileUpload
                        label="Certificate PDF"
                        acceptedFile={formData.certificatePath}
                        onFileChange={(file) => {
                          if (file && profile?.id) {
                            handleStudentFileUpload(file, 'certificatePath', 'conferences', 'certificate');
                          }
                        }}
                        required
                        userType="student"
                        userId={profile?.id || ''}
                        category="conferences"
                        disabled={false}
                      />
                      <FileUpload
                        label="Published Paper PDF"
                        acceptedFile={formData.publishedPaperPath}
                        onFileChange={(file) => {
                          if (file && profile?.id) {
                            handleStudentFileUpload(file, 'publishedPaperPath', 'conferences', 'published-paper');
                          }
                        }}
                        required
                        userType="student"
                        userId={profile?.id || ''}
                        category="conferences"
                        disabled={false}
                      />
                    </div>
                  </>
                )}

                <div className="flex gap-4 pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-blue-600 text-white py-1.5 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 text-sm"
                  >
                    {loading ? 'Submitting...' : 'Submit'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 bg-gray-300 text-gray-700 py-1.5 px-4 rounded-lg hover:bg-gray-400 text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}

export default StudentDashboard;
