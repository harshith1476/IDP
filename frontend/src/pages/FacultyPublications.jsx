import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { facultyService } from '../services/facultyService';
import externalService from '../services/externalService';
import FileUpload from '../components/FileUpload';
import { useDeviceDetection } from '../hooks/useDeviceDetection';
import './FacultyPublications.css';

function FacultyPublications() {
  const { isMobile } = useDeviceDetection();
  const [activeTab, setActiveTab] = useState('journals');
  const [journals, setJournals] = useState([]);
  const [conferences, setConferences] = useState([]);
  const [patents, setPatents] = useState([]);
  const [bookChapters, setBookChapters] = useState([]);
  const [books, setBooks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState(null);
  const [fileUploads, setFileUploads] = useState({});
  const [showImportModal, setShowImportModal] = useState(false);
  const [importLoading, setImportLoading] = useState(false);
  const [externalPapers, setExternalPapers] = useState([]);
  const [importSearchName, setImportSearchName] = useState('');
  const [externalAuthors, setExternalAuthors] = useState([]);

  useEffect(() => {
    loadData();
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const profileRes = await facultyService.getProfile();
      setProfile(profileRes.data);
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  };

  const loadData = async () => {
    const fetchers = [
      { key: 'journals', fn: facultyService.getJournals, setter: setJournals },
      { key: 'conferences', fn: facultyService.getConferences, setter: setConferences },
      { key: 'patents', fn: facultyService.getPatents, setter: setPatents },
      { key: 'bookChapters', fn: facultyService.getBookChapters, setter: setBookChapters },
      { key: 'books', fn: facultyService.getBooks, setter: setBooks },
      { key: 'projects', fn: facultyService.getProjects, setter: setProjects }
    ];

    await Promise.all(fetchers.map(async (f) => {
      try {
        const res = await f.fn();
        f.setter(res.data || []);
      } catch (error) {
        console.error(`Error loading ${f.key}:`, error);
        f.setter([]); // Set empty array on failure to avoid UI breaks
      }
    }));
  };

  const openModal = (type, item = null) => {
    setEditingItem(item);
    setActiveTab(type);
    if (item) {
      // Handle custom quartile values for journals
      if (type === 'journals' && item.quartile && !['Q1', 'Q2', 'Q3', 'Q4'].includes(item.quartile)) {
        setFormData({ ...item, quartile: 'Other', otherQuartile: item.quartile });
      } else {
        setFormData(item);
      }
    } else {
      setFormData(getDefaultFormData(type));
    }
    setShowModal(true);
  };

  const getDefaultFormData = (type) => {
    const base = {
      year: new Date().getFullYear(),
      status: 'Published',
      approvalStatus: 'SUBMITTED'
    };
    switch (type) {
      case 'journals':
        return {
          ...base,
          title: '',
          journalName: '',
          authors: [''],
          correspondingAuthors: [''],
          category: 'National',
          indexType: '',
          quartile: '',
          otherQuartile: '',
          volume: '',
          issue: '',
          pages: '',
          doi: '',
          impactFactor: '',
          journalHIndex: '',
          publisher: '',
          issn: '',
          openAccess: 'Open Access',
          collaboratedWithStudents: false,
          studentCollaborations: []
        };
      case 'conferences':
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
          doi: '',
          publisher: '',
          volume: '',
          impactFactor: '',
          journalHIndex: '',
          publishedIn: '',
          otherPublishedIn: '',
          paymentDetails: '',
          acknowledgmentPath: '',
          collaboratedWithStudents: false,
          studentCollaborations: []
        };
      case 'patents':
        return {
          ...base,
          title: '',
          applicationNumber: '',
          filingDate: '',
          patentNumber: '',
          inventors: [''],
          correspondingInventors: [''],
          country: '',
          category: 'National',
          doi: '',
          publisher: '',
          volume: '',
          impactFactor: '',
          journalHIndex: '',
          status: 'Filed'
        };
      case 'bookChapters':
        return {
          ...base,
          title: '',
          bookTitle: '',
          authors: [''],
          correspondingAuthors: [''],
          editors: '',
          publisher: '',
          pages: '',
          doi: '',
          volume: '',
          impactFactor: '',
          journalHIndex: '',
          isbn: '',
          category: 'National'
        };
      case 'books':
        return {
          ...base,
          bookTitle: '',
          authors: [''],
          correspondingAuthors: [''],
          publisher: '',
          isbn: '',
          doi: '',
          volume: '',
          impactFactor: '',
          journalHIndex: '',
          publicationYear: new Date().getFullYear(),
          role: 'Author',
          category: 'National'
        };
      case 'projects':
        return {
          ...base,
          projectType: '',
          seedGrantLink: '',
          investigatorName: '',
          department: '',
          employeeId: '',
          title: '',
          dateApproved: '',
          duration: '',
          amount: '',
          outcomeProofPath: ''
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
      <div className="publication-form-section" style={{ marginTop: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 className="publication-form-section-title" style={{ margin: 0 }}>{title}</h3>
          <button
            type="button"
            onClick={() => handleAddArrayItem(field)}
            className="add-item-btn"
            style={{
              padding: '6px 12px',
              background: '#1e3a8a',
              color: '#ffffff',
              border: 'none',
              borderRadius: '6px',
              fontSize: '14px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add {type}
          </button>
        </div>
        <div className="publication-form-fields">
          {(formData[field] || ['']).map((item, index) => (
            <div key={index} className="publication-form-field" style={{ marginBottom: '12px' }}>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <div style={{ flex: 1 }}>
                  <label className="publication-form-label">
                    {type} {index + 1} {index === 0 && (field === 'authors' || field === 'inventors') ? (
                      <> (Mandatory) <span className="publication-form-label-required">*</span></>
                    ) : ''}
                  </label>
                  <input
                    type="text"
                    value={item || ''}
                    onChange={(e) => handleArrayItemChange(field, index, e.target.value)}
                    required={index === 0 && (field === 'authors' || field === 'inventors')}
                    className="publication-form-input"
                    placeholder={`Enter name of ${type.toLowerCase()} ${index + 1}`}
                  />
                </div>
                {index > 0 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveArrayItem(field, index)}
                    style={{
                      marginTop: '24px',
                      padding: '10px',
                      background: '#dc2626',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer'
                    }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                )}
              </div>
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
      const listFields = ['authors', 'correspondingAuthors', 'inventors', 'correspondingInventors', 'editors'];

      listFields.forEach(field => {
        if (Array.isArray(submissionData[field])) {
          submissionData[field] = submissionData[field].filter(item => item && item.trim() !== '');
        }
      });

      // Ensure mandatory fields have at least one entry if validation passed
      if (submissionData.authors && submissionData.authors.length === 0) {
        submissionData.authors = [formData.authors[0] || ''];
      }
      if (submissionData.inventors && submissionData.inventors.length === 0) {
        submissionData.inventors = [formData.inventors[0] || ''];
      }

      // Clean student collaborations
      if (Array.isArray(submissionData.studentCollaborations)) {
        submissionData.studentCollaborations = submissionData.studentCollaborations.filter(
          collab => collab.studentName && collab.studentName.trim() !== ''
        );
      }

      // Handle "Other" quartile for journals
      if (activeTab === 'journals' && submissionData.quartile === 'Other' && submissionData.otherQuartile) {
        submissionData.quartile = submissionData.otherQuartile;
      }

      // Debug: Log submissionData before submission
      console.log('Submitting publication with data:', submissionData);

      if (editingItem) {
        await updatePublication(submissionData);
      } else {
        await createPublication(submissionData);
      }
      setShowModal(false);
      loadData();
    } catch (error) {
      console.error('Error saving publication:', error);
      let errorMessage = 'Failed to save publication. Please ensure all required fields are filled and files are uploaded.';

      if (error.response?.data) {
        if (typeof error.response.data === 'string') {
          errorMessage = error.response.data;
        } else if (error.response.data.message) {
          errorMessage = error.response.data.message;
        } else if (error.response.data.errors && Array.isArray(error.response.data.errors)) {
          errorMessage = error.response.data.errors.join(', ');
        }
      }

      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const createPublication = async (data) => {
    switch (activeTab) {
      case 'journals':
        await facultyService.createJournal(data);
        break;
      case 'conferences':
        await facultyService.createConference(data);
        break;
      case 'patents':
        await facultyService.createPatent(data);
        break;
      case 'bookChapters':
        await facultyService.createBookChapter(data);
        break;
      case 'books':
        await facultyService.createBook(data);
        break;
      case 'projects':
        await facultyService.createProject(data);
        break;
    }
  };

  const updatePublication = async (data) => {
    switch (activeTab) {
      case 'journals':
        await facultyService.updateJournal(editingItem.id, data);
        break;
      case 'conferences':
        await facultyService.updateConference(editingItem.id, data);
        break;
      case 'patents':
        await facultyService.updatePatent(editingItem.id, data);
        break;
      case 'bookChapters':
        await facultyService.updateBookChapter(editingItem.id, data);
        break;
      case 'books':
        await facultyService.updateBook(editingItem.id, data);
        break;
      case 'projects':
        await facultyService.updateProject(editingItem.id, data);
        break;
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this publication?')) return;

    try {
      switch (activeTab) {
        case 'journals':
          await facultyService.deleteJournal(id);
          break;
        case 'conferences':
          await facultyService.deleteConference(id);
          break;
        case 'patents':
          await facultyService.deletePatent(id);
          break;
        case 'bookChapters':
          await facultyService.deleteBookChapter(id);
          break;
        case 'books':
          await facultyService.deleteBook(id);
          break;
        case 'projects':
          await facultyService.deleteProject(id);
          break;
      }
      loadData();
    } catch (error) {
      console.error('Error deleting publication:', error);
    }
  };

  const handleImportSearch = async (source, overrideId = null) => {
    setImportLoading(true);
    try {
      let results = [];
      const input = (overrideId || importSearchName || "").trim();
      
      if (source === 'scholar') {
        const id = profile.semanticScholarId || input;
        if (!id) {
          alert('Please provide an author name or connect your Semantic Scholar ID in profile.');
          return;
        }
        results = await externalService.getAuthorPapers(id);
        setExternalPapers(results);
        setExternalAuthors([]);
      } else if (source === 'google') {
        const id = input;
        if (!id) {
          alert('Please provide a Google Scholar Author ID.');
          return;
        }
        results = await externalService.getGoogleScholarPapers(id);
        setExternalPapers(results);
        setExternalAuthors([]);
      } else if (source === 'orcid') {
        const orcidRegex = /^\d{4}-\d{4}-\d{4}-\d{3}[\dX]$/;
        
        if (orcidRegex.test(input)) {
          results = await externalService.getOrcidWorks(input);
          setExternalPapers(results);
          setExternalAuthors([]);
        } else {
          // It's a name, search for researchers
          const researchers = await externalService.searchOrcid(input);
          setExternalAuthors(researchers);
          setExternalPapers([]);
          if (researchers.length === 0) {
            alert(`No ORCID profiles found for "${input}". Please provide a valid ORCID ID.`);
          }
        }
      } else if (source === 'books') {
        const books = await externalService.searchResearchBooks(input);
        // Map BookDocument to paper-like structure for the UI
        results = books.map(b => ({
          title: b.title,
          venue: b.publisher,
          year: b.publishedDate ? parseInt(b.publishedDate.substring(0, 4), 10) : null,
          authors: b.authors || [],
          source: 'GoogleBooks',
          _isBook: true
        }));
        setExternalPapers(results);
        setExternalAuthors([]);
      } else if (source === 'patents') {
        const patents = await externalService.searchResearchPatents(input);
        results = patents.map(p => ({
          title: p.title,
          venue: 'Patent Number: ' + p.patentNumber,
          year: p.filingDate ? parseInt(p.filingDate.substring(0, 4), 10) : null,
          authors: [p.inventor],
          source: 'PatentsView',
          _isPatent: true,
          patentNumber: p.patentNumber
        }));
        setExternalPapers(results);
        setExternalAuthors([]);
      }
    } catch (error) {
      console.error('Error importing papers:', error);
      alert('Failed to fetch papers from external API');
    } finally {
      setImportLoading(false);
    }
  };

  const handleImportPaper = (paper) => {
    let type = activeTab;
    if (paper._isBook) type = 'books';
    if (paper._isPatent) type = 'patents';
    
    // Auto-switch tab if searching specifically for others
    if (paper._isBook || paper._isPatent) {
      setActiveTab(type);
    } else {
      type = activeTab === 'journals' ? 'journals' : (activeTab === 'conferences' ? 'conferences' : 'journals');
    }

    const defaultData = getDefaultFormData(type);
    
    const mappedData = {
      ...defaultData,
      title: paper.title,
      year: paper.year || new Date().getFullYear(),
      doi: paper.doi || '-',
      authors: paper.authors && paper.authors.length > 0 ? paper.authors : [''],
      publisher: paper.venue || paper.publisher || '-',
      pages: paper.pages || ''
    };

    if (type === 'journals') {
      mappedData.journalName = paper.venue || '';
    } else if (type === 'conferences') {
      mappedData.conferenceName = paper.venue || '';
    } else if (type === 'books') {
      mappedData.bookTitle = paper.title;
    } else if (type === 'patents') {
      mappedData.patentNumber = paper.patentNumber || '';
      mappedData.inventors = paper.authors;
    }
    
    setFormData(mappedData);
    setShowImportModal(false);
    setShowModal(true);
  };

  const handleBulkSync = async () => {
    if (!profile?.semanticScholarId) {
      alert('Please connect your Semantic Scholar ID in Profile first.');
      return;
    }

    if (!window.confirm('This will automatically fetch and import all your publications from Semantic Scholar. Existing publications will not be duplicated. Proceed?')) {
      return;
    }

    setLoading(true);
    try {
      const count = await externalService.syncPapers();
      alert(`Successfully imported ${count} new publications!`);
      loadData();
    } catch (error) {
      console.error('Error in bulk sync:', error);
      alert('Failed to sync publications. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (file, fieldName, category, fileType) => {
    if (!profile?.id) {
      alert('Profile not loaded. Please wait and try again.');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('userType', 'faculty');
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
        const errorText = await response.text();
        throw new Error(errorText || 'File upload failed');
      }

      // Backend returns plain text (file path), not JSON
      const result = await response.text();
      setFormData(prev => ({
        ...prev,
        [fieldName]: result
      }));
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Failed to upload file. Please try again.');
    }
  };

  const renderTable = (data, type) => {
    if (data.length === 0) {
      return <p className="text-gray-500">No {type} found.</p>;
    }

    // Mobile: Render cards
    if (isMobile) {
      return (
        <div className="mobile-card-view">
          {data.map((item) => (
            <div key={item.id} className="data-card">
              <div className="data-card-header">
                <div className="data-card-title">
                  {item.title || item.bookTitle || 'Untitled'}
                </div>
                <div className="data-card-status">
                  {getStatusBadge(item.approvalStatus)}
                </div>
              </div>
              <div className="data-card-body">
                {renderCardFields(item, type)}
              </div>
              <div className="data-card-actions">
                {(item.approvalStatus !== 'APPROVED' && item.approvalStatus !== 'LOCKED') ? (
                  <>
                    <button
                      onClick={() => openModal(type, item)}
                      className="bg-blue-600 text-white"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="bg-red-600 text-white"
                    >
                      Delete
                    </button>
                  </>
                ) : (
                  <span className="text-gray-500 text-sm">Locked - No edits allowed</span>
                )}
              </div>
              {item.remarks && (
                <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded">
                  <div className="data-card-label">Admin Remarks</div>
                  <div className="text-sm text-red-600">{item.remarks}</div>
                </div>
              )}
            </div>
          ))}
        </div>
      );
    }

    // Desktop: Render table
    const headers = getHeaders(type);
    return (
      <div className="overflow-x-auto table-container">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {headers.map((header) => (
                <th key={header} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  {header}
                </th>
              ))}
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((item) => (
              <tr key={item.id}>
                {renderRow(item, type)}
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  {(item.approvalStatus !== 'APPROVED' && item.approvalStatus !== 'LOCKED') && (
                    <>
                      <button
                        onClick={() => openModal(type, item)}
                        className="text-blue-600 hover:text-blue-900 mr-3"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </>
                  )}
                  {(item.approvalStatus === 'APPROVED' || item.approvalStatus === 'LOCKED') && (
                    <span className="text-gray-500 text-xs">Locked - No edits allowed</span>
                  )}
                  {item.remarks && (
                    <div className="mt-2 text-xs text-red-600 whitespace-normal">
                      Remarks: {item.remarks}
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const renderCardFields = (item, type) => {
    switch (type) {
      case 'journals':
        return (
          <>
            <div className="data-card-field">
              <div className="data-card-label">Journal</div>
              <div className="data-card-value">{item.journalName || 'N/A'}</div>
            </div>
            <div className="data-card-field">
              <div className="data-card-label">Category</div>
              <div className="data-card-value">{item.category || 'N/A'}</div>
            </div>
            <div className="data-card-field">
              <div className="data-card-label">Index Type</div>
              <div className="data-card-value">{item.indexType || 'N/A'}</div>
            </div>
            <div className="data-card-field">
              <div className="data-card-label">Year</div>
              <div className="data-card-value">{item.year || 'N/A'}</div>
            </div>
            <div className="data-card-field">
              <div className="data-card-label">Status</div>
              <div className="data-card-value">{item.status || 'N/A'}</div>
            </div>
          </>
        );
      case 'conferences':
        return (
          <>
            <div className="data-card-field">
              <div className="data-card-label">Conference</div>
              <div className="data-card-value">{item.conferenceName || 'N/A'}</div>
            </div>
            <div className="data-card-field">
              <div className="data-card-label">Category</div>
              <div className="data-card-value">{item.category || 'N/A'}</div>
            </div>
            <div className="data-card-field">
              <div className="data-card-label">Year</div>
              <div className="data-card-value">{item.year || 'N/A'}</div>
            </div>
            <div className="data-card-field">
              <div className="data-card-label">Status</div>
              <div className="data-card-value">{item.status || 'N/A'}</div>
            </div>
            {item.paymentDetails && (
              <div className="data-card-field">
                <div className="data-card-label">Payment Details</div>
                <div className="data-card-value">{item.paymentDetails}</div>
              </div>
            )}
          </>
        );
      case 'patents':
        return (
          <>
            <div className="data-card-field">
              <div className="data-card-label">Application Number</div>
              <div className="data-card-value">{item.applicationNumber || item.patentNumber || 'N/A'}</div>
            </div>
            <div className="data-card-field">
              <div className="data-card-label">Status</div>
              <div className="data-card-value">{item.status || 'N/A'}</div>
            </div>
            <div className="data-card-field">
              <div className="data-card-label">Category</div>
              <div className="data-card-value">{item.category || 'N/A'}</div>
            </div>
            <div className="data-card-field">
              <div className="data-card-label">Year</div>
              <div className="data-card-value">{item.year || 'N/A'}</div>
            </div>
          </>
        );
      case 'bookChapters':
        return (
          <>
            <div className="data-card-field">
              <div className="data-card-label">Book</div>
              <div className="data-card-value">{item.bookTitle || 'N/A'}</div>
            </div>
            <div className="data-card-field">
              <div className="data-card-label">Category</div>
              <div className="data-card-value">{item.category || 'N/A'}</div>
            </div>
            <div className="data-card-field">
              <div className="data-card-label">Year</div>
              <div className="data-card-value">{item.year || 'N/A'}</div>
            </div>
            <div className="data-card-field">
              <div className="data-card-label">Status</div>
              <div className="data-card-value">{item.status || 'N/A'}</div>
            </div>
          </>
        );
      case 'books':
        return (
          <>
            <div className="data-card-field">
              <div className="data-card-label">Publisher</div>
              <div className="data-card-value">{item.publisher || 'N/A'}</div>
            </div>
            <div className="data-card-field">
              <div className="data-card-label">ISBN</div>
              <div className="data-card-value">{item.isbn || 'N/A'}</div>
            </div>
            <div className="data-card-field">
              <div className="data-card-label">Category</div>
              <div className="data-card-value">{item.category || 'N/A'}</div>
            </div>
            <div className="data-card-field">
              <div className="data-card-label">Role</div>
              <div className="data-card-value">{item.role || 'Author'}</div>
            </div>
            <div className="data-card-field">
              <div className="data-card-label">Year</div>
              <div className="data-card-value">{item.publicationYear || item.year || 'N/A'}</div>
            </div>
            <div className="data-card-field">
              <div className="data-card-label">Status</div>
              <div className="data-card-value">{item.status || 'N/A'}</div>
            </div>
          </>
        );
      case 'projects':
        return (
          <>
            <div className="data-card-field">
              <div className="data-card-label">Type</div>
              <div className="data-card-value">{item.projectType || 'N/A'}</div>
            </div>
            <div className="data-card-field">
              <div className="data-card-label">Investigator</div>
              <div className="data-card-value">{item.investigatorName || 'N/A'}</div>
            </div>
            <div className="data-card-field">
              <div className="data-card-label">Amount</div>
              <div className="data-card-value">{item.amount || 'N/A'}</div>
            </div>
            <div className="data-card-field">
              <div className="data-card-label">Status</div>
              <div className="data-card-value">{item.status || 'N/A'}</div>
            </div>
          </>
        );
      default:
        return null;
    }
  };

  const getHeaders = (type) => {
    switch (type) {
      case 'journals':
        return ['Title', 'Journal', 'Category', 'Index Type', 'Year', 'Approval Status', 'Status'];
      case 'conferences':
        return ['Title', 'Conference', 'Category', 'Year', 'Approval Status', 'Status'];
      case 'patents':
        return ['Title', 'Application No.', 'Status', 'Category', 'Year', 'Approval Status'];
      case 'bookChapters':
        return ['Title', 'Book', 'Category', 'Year', 'Approval Status', 'Status'];
      case 'books':
        return ['Title', 'Publisher', 'ISBN', 'Category', 'Role', 'Year', 'Approval Status', 'Status'];
      case 'projects':
        return ['Title', 'Type', 'Status', 'Investigator', 'Department', 'Amount', 'Approval Status'];
      default:
        return [];
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

  const renderRow = (item, type) => {
    switch (type) {
      case 'journals':
        return (
          <>
            <td className="px-6 py-4 text-sm">{item.title}</td>
            <td className="px-6 py-4 text-sm">{item.journalName}</td>
            <td className="px-6 py-4 text-sm">{item.category || 'N/A'}</td>
            <td className="px-6 py-4 text-sm">{item.indexType || 'N/A'}</td>
            <td className="px-6 py-4 text-sm">{item.year}</td>
            <td className="px-6 py-4 text-sm">{getStatusBadge(item.approvalStatus)}</td>
            <td className="px-6 py-4 text-sm">{item.status}</td>
          </>
        );
      case 'conferences':
        return (
          <>
            <td className="px-6 py-4 text-sm">{item.title}</td>
            <td className="px-6 py-4 text-sm">{item.conferenceName}</td>
            <td className="px-6 py-4 text-sm">{item.category || 'N/A'}</td>
            <td className="px-6 py-4 text-sm">{item.year}</td>
            <td className="px-6 py-4 text-sm">{getStatusBadge(item.approvalStatus)}</td>
            <td className="px-6 py-4 text-sm">{item.status}</td>
          </>
        );
      case 'patents':
        return (
          <>
            <td className="px-6 py-4 text-sm">{item.title}</td>
            <td className="px-6 py-4 text-sm">{item.applicationNumber || item.patentNumber || 'N/A'}</td>
            <td className="px-6 py-4 text-sm">{item.status}</td>
            <td className="px-6 py-4 text-sm">{item.category || 'N/A'}</td>
            <td className="px-6 py-4 text-sm">{item.year}</td>
            <td className="px-6 py-4 text-sm">{getStatusBadge(item.approvalStatus)}</td>
          </>
        );
      case 'bookChapters':
        return (
          <>
            <td className="px-6 py-4 text-sm">{item.title}</td>
            <td className="px-6 py-4 text-sm">{item.bookTitle}</td>
            <td className="px-6 py-4 text-sm">{item.category || 'N/A'}</td>
            <td className="px-6 py-4 text-sm">{item.year}</td>
            <td className="px-6 py-4 text-sm">{getStatusBadge(item.approvalStatus)}</td>
            <td className="px-6 py-4 text-sm">{item.status}</td>
          </>
        );
      case 'books':
        return (
          <>
            <td className="px-6 py-4 text-sm">{item.bookTitle}</td>
            <td className="px-6 py-4 text-sm">{item.publisher || 'N/A'}</td>
            <td className="px-6 py-4 text-sm">{item.isbn || 'N/A'}</td>
            <td className="px-6 py-4 text-sm">{item.category || 'N/A'}</td>
            <td className="px-6 py-4 text-sm">{item.role || 'Author'}</td>
            <td className="px-6 py-4 text-sm">{item.publicationYear || item.year || 'N/A'}</td>
            <td className="px-6 py-4 text-sm">{getStatusBadge(item.approvalStatus)}</td>
            <td className="px-6 py-4 text-sm">{item.status}</td>
          </>
        );
      case 'projects':
        return (
          <>
            <td className="px-6 py-4 text-sm">{item.title}</td>
            <td className="px-6 py-4 text-sm">{item.projectType}</td>
            <td className="px-6 py-4 text-sm">{item.status || 'N/A'}</td>
            <td className="px-6 py-4 text-sm">{item.investigatorName}</td>
            <td className="px-6 py-4 text-sm">{item.department}</td>
            <td className="px-6 py-4 text-sm">{item.amount}</td>
            <td className="px-6 py-4 text-sm">{getStatusBadge(item.approvalStatus)}</td>
          </>
        );
      default:
        return null;
    }
  };

  const renderForm = () => {

    const statusField = (
      <div className="publication-form-field">
        <label className="publication-form-label">
          Status <span className="publication-form-label-required">*</span>
        </label>
        <select
          value={formData.status || 'Published'}
          onChange={(e) => setFormData({ ...formData, status: e.target.value })}
          required
          className="publication-form-select"
        >
          <option value="Communicated">Communicated</option>
          <option value="Rejected">Rejected</option>
          <option value="Accepted">Accepted</option>
          <option value="Online Published">Online Published</option>
          <option value="Published">Published</option>
          {activeTab === 'patents' && (
            <>
              <option value="Granted">Granted</option>
              <option value="Filed">Filed</option>
              <option value="Pending">Pending</option>
            </>
          )}
        </select>
      </div>
    );

    const titleField = (
      <div className="publication-form-field">
        <label className="publication-form-label">
          Title of the Article/Book/Patent <span className="publication-form-label-required">*</span>
        </label>
        <input
          type="text"
          value={formData.title || ''}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
          className="publication-form-input"
        />
      </div>
    );

    const yearField = (
      <div className="publication-form-field">
        <label className="publication-form-label">
          Year <span className="publication-form-label-required">*</span>
        </label>
        <input
          type="number"
          value={formData.year || ''}
          onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
          required
          min="2000"
          className="publication-form-input"
        />
      </div>
    );

    switch (activeTab) {
      case 'journals':
        return (
          <>
            <div className="publication-form-section">
              <h3 className="publication-form-section-title">Journal Details</h3>
              <div className="publication-form-fields">
                {titleField}
                {yearField}
                {statusField}
                <div className="publication-form-field">
                  <label className="publication-form-label">
                    Journal Name <span className="publication-form-label-required">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.journalName || ''}
                    onChange={(e) => setFormData({ ...formData, journalName: e.target.value })}
                    required
                    className="publication-form-input"
                  />
                </div>
                <div className="publication-form-field-grid">
                  <div className="publication-form-field">
                    <label className="publication-form-label">
                      Category <span className="publication-form-label-required">*</span>
                    </label>
                    <select
                      value={formData.category || 'National'}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      required
                      className="publication-form-select"
                    >
                      <option value="National">National</option>
                      <option value="International">International</option>
                    </select>
                  </div>
                  <div className="publication-form-field">
                    <label className="publication-form-label">Index Type</label>
                    <select
                      value={formData.indexType || ''}
                      onChange={(e) => setFormData({ ...formData, indexType: e.target.value })}
                      className="publication-form-select"
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
                  {(formData.indexType === 'SCI' || formData.indexType === 'SCIE') && (
                    <div className="publication-form-field">
                      <label className="publication-form-label">Quartiles <span className="publication-form-label-required">*</span></label>
                      <select
                        value={formData.quartile || ''}
                        onChange={(e) => setFormData({ ...formData, quartile: e.target.value })}
                        required
                        className="publication-form-select"
                      >
                        <option value="">Select Quartile</option>
                        <option value="Q1">Q1</option>
                        <option value="Q2">Q2</option>
                        <option value="Q3">Q3</option>
                        <option value="Q4">Q4</option>
                        <option value="Other">Other</option>
                      </select>
                      {formData.quartile === 'Other' && (
                        <div className="mt-2">
                          <label className="publication-form-label">Specify Quartile <span className="publication-form-label-required">*</span></label>
                          <input
                            type="text"
                            value={formData.otherQuartile || ''}
                            onChange={(e) => setFormData({ ...formData, otherQuartile: e.target.value })}
                            className="publication-form-input"
                            required
                            placeholder="Specify your quartile"
                          />
                        </div>
                      )}
                    </div>
                  )}
                </div>
                <div className="publication-form-field">
                  <label className="publication-form-label">DOI <span className="publication-form-label-required">*</span></label>
                  <input
                    type="text"
                    value={formData.doi || ''}
                    onChange={(e) => setFormData({ ...formData, doi: e.target.value })}
                    required
                    className="publication-form-input"
                    placeholder="Enter DOI (Use - or nil if not available)"
                  />
                </div>
                <div className="publication-form-field-grid">
                  <div className="publication-form-field">
                    <label className="publication-form-label">Publisher <span className="publication-form-label-required">*</span></label>
                    <input
                      type="text"
                      value={formData.publisher || ''}
                      onChange={(e) => setFormData({ ...formData, publisher: e.target.value })}
                      required
                      className="publication-form-input"
                      placeholder="Enter Publisher (Use - or nil if not available)"
                    />
                  </div>
                  <div className="publication-form-field">
                    <label className="publication-form-label">ISSN</label>
                    <input
                      type="text"
                      value={formData.issn || ''}
                      onChange={(e) => setFormData({ ...formData, issn: e.target.value })}
                      className="publication-form-input"
                    />
                  </div>
                </div>
                <div className="publication-form-field-grid">
                  <div className="publication-form-field">
                    <label className="publication-form-label">Volume <span className="publication-form-label-required">*</span></label>
                    <input
                      type="text"
                      value={formData.volume || ''}
                      onChange={(e) => setFormData({ ...formData, volume: e.target.value })}
                      required
                      className="publication-form-input"
                      placeholder="Enter Volume (Use - or nil if not available)"
                    />
                  </div>
                  <div className="publication-form-field">
                    <label className="publication-form-label">Issue</label>
                    <input
                      type="text"
                      value={formData.issue || ''}
                      onChange={(e) => setFormData({ ...formData, issue: e.target.value })}
                      className="publication-form-input"
                    />
                  </div>
                </div>
                <div className="publication-form-field-grid">
                  <div className="publication-form-field">
                    <label className="publication-form-label">Pages</label>
                    <input
                      type="text"
                      value={formData.pages || ''}
                      onChange={(e) => setFormData({ ...formData, pages: e.target.value })}
                      className="publication-form-input"
                    />
                  </div>
                  <div className="publication-form-field">
                    <label className="publication-form-label">Journal Impact Factor <span className="publication-form-label-required">*</span></label>
                    <input
                      type="text"
                      value={formData.impactFactor || ''}
                      onChange={(e) => setFormData({ ...formData, impactFactor: e.target.value })}
                      required
                      className="publication-form-input"
                      placeholder="Enter Impact Factor (Use - or nil if not available)"
                    />
                  </div>
                </div>
                <div className="publication-form-field">
                  <label className="publication-form-label">Journal h-index <span className="publication-form-label-required">*</span></label>
                  <input
                    type="text"
                    value={formData.journalHIndex || ''}
                    onChange={(e) => setFormData({ ...formData, journalHIndex: e.target.value })}
                    required
                    className="publication-form-input"
                    placeholder="Enter h-index (Use - or nil if not available)"
                  />
                </div>
                <div className="publication-form-field">
                  <label className="publication-form-label">Open Access / Subscription</label>
                  <select
                    value={formData.openAccess || 'Open Access'}
                    onChange={(e) => setFormData({ ...formData, openAccess: e.target.value })}
                    className="publication-form-select"
                  >
                    <option value="Open Access">Open Access</option>
                    <option value="Subscription">Subscription</option>
                  </select>
                </div>
              </div>
            </div>

            {renderAuthorSection('Author', 'Author Details', 'authors')}
            {renderAuthorSection('Corresponding Author', 'Corresponding Author Details', 'correspondingAuthors')}

            {/* Student Collaboration Section */}
            <div className="publication-form-section">
              <h3 className="publication-form-section-title">Student Collaboration</h3>
              <div className="publication-form-fields">
                <div className="publication-form-field">
                  <label className="publication-form-label">
                    Collaborated with Students
                  </label>
                  <select
                    value={formData.collaboratedWithStudents ? 'yes' : 'no'}
                    onChange={(e) => {
                      const value = e.target.value === 'yes';
                      setFormData({
                        ...formData,
                        collaboratedWithStudents: value,
                        studentCollaborations: value ? (formData.studentCollaborations || []) : []
                      });
                    }}
                    className="publication-form-select"
                  >
                    <option value="no">No</option>
                    <option value="yes">Yes</option>
                  </select>
                </div>

                {formData.collaboratedWithStudents && (
                  <div className="publication-form-field">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                      <label className="publication-form-label">Student Details</label>
                      <button
                        type="button"
                        onClick={() => {
                          setFormData({
                            ...formData,
                            studentCollaborations: [
                              ...(formData.studentCollaborations || []),
                              { studentName: '', registrationNumber: '', year: '', guideName: '' }
                            ]
                          });
                        }}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '6px 12px',
                          background: '#1e3a8a',
                          color: '#ffffff',
                          border: 'none',
                          borderRadius: '6px',
                          fontSize: '14px',
                          fontWeight: '500',
                          cursor: 'pointer'
                        }}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Add Student
                      </button>
                    </div>

                    {(formData.studentCollaborations || []).map((student, index) => (
                      <div key={index} style={{
                        border: '1px solid #e2e8f0',
                        borderRadius: '6px',
                        padding: '16px',
                        marginBottom: '12px',
                        background: '#f8fafc'
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                          <span style={{ fontWeight: '600', color: '#1e293b' }}>Student {index + 1}</span>
                          <button
                            type="button"
                            onClick={() => {
                              const updated = [...(formData.studentCollaborations || [])];
                              updated.splice(index, 1);
                              setFormData({ ...formData, studentCollaborations: updated });
                            }}
                            style={{
                              padding: '4px 8px',
                              background: '#dc2626',
                              color: '#ffffff',
                              border: 'none',
                              borderRadius: '4px',
                              fontSize: '12px',
                              cursor: 'pointer'
                            }}
                          >
                            Remove
                          </button>
                        </div>
                        <div className="publication-form-field-grid">
                          <div className="publication-form-field">
                            <label className="publication-form-label">Student Name <span className="publication-form-label-required">*</span></label>
                            <input
                              type="text"
                              value={student.studentName || ''}
                              onChange={(e) => {
                                const updated = [...(formData.studentCollaborations || [])];
                                updated[index] = { ...updated[index], studentName: e.target.value };
                                setFormData({ ...formData, studentCollaborations: updated });
                              }}
                              required
                              className="publication-form-input"
                            />
                          </div>
                          <div className="publication-form-field">
                            <label className="publication-form-label">Registration Number <span className="publication-form-label-required">*</span></label>
                            <input
                              type="text"
                              value={student.registrationNumber || ''}
                              onChange={(e) => {
                                const updated = [...(formData.studentCollaborations || [])];
                                updated[index] = { ...updated[index], registrationNumber: e.target.value };
                                setFormData({ ...formData, studentCollaborations: updated });
                              }}
                              required
                              className="publication-form-input"
                            />
                          </div>
                        </div>
                        <div className="publication-form-field-grid">
                          <div className="publication-form-field">
                            <label className="publication-form-label">Year <span className="publication-form-label-required">*</span></label>
                            <input
                              type="text"
                              value={student.year || ''}
                              onChange={(e) => {
                                const updated = [...(formData.studentCollaborations || [])];
                                updated[index] = { ...updated[index], year: e.target.value };
                                setFormData({ ...formData, studentCollaborations: updated });
                              }}
                              required
                              className="publication-form-input"
                              placeholder="e.g., 2024"
                            />
                          </div>
                          <div className="publication-form-field">
                            <label className="publication-form-label">Guide Name <span className="publication-form-label-required">*</span></label>
                            <input
                              type="text"
                              value={student.guideName || ''}
                              onChange={(e) => {
                                const updated = [...(formData.studentCollaborations || [])];
                                updated[index] = { ...updated[index], guideName: e.target.value };
                                setFormData({ ...formData, studentCollaborations: updated });
                              }}
                              required
                              className="publication-form-input"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="publication-form-section">
              <h3 className="publication-form-section-title">Mandatory Uploads (PDF)</h3>
              <div className="publication-form-uploads">
                <p className="publication-form-uploads-title">
                  All files must be in PDF format <span className="publication-form-label-required">*</span>
                </p>
                <div className="publication-form-uploads-list">
                  {/* Show Acceptance Mail PDF only for Accepted or Submitted status */}
                  {(formData.status === 'Accepted' || formData.status === 'Submitted' || editingItem?.acceptanceMailPath) && (
                    <FileUpload
                      label="Acceptance Mail PDF"
                      acceptedFile={formData.acceptanceMailPath}
                      onFileChange={(file) => {
                        // File selected, will be uploaded automatically via onUpload
                      }}
                      onUpload={(filePath) => {
                        // File uploaded successfully, update formData
                        setFormData(prev => ({
                          ...prev,
                          acceptanceMailPath: filePath
                        }));
                      }}
                      required={formData.status === 'Accepted' || formData.status === 'Submitted'}
                      userType="faculty"
                      userId={profile?.id || ''}
                      category="journals/acceptance-mail"
                      disabled={editingItem && (editingItem.approvalStatus === 'APPROVED' || editingItem.approvalStatus === 'LOCKED')}
                    />
                  )}
                  {/* Show Published Paper PDF only for Published status */}
                  {(formData.status === 'Published' || editingItem?.publishedPaperPath) && (
                    <FileUpload
                      label="Published Paper PDF"
                      acceptedFile={formData.publishedPaperPath}
                      onFileChange={(file) => {
                        // File selected, will be uploaded automatically via onUpload
                      }}
                      onUpload={(filePath) => {
                        // File uploaded successfully, update formData
                        setFormData(prev => ({
                          ...prev,
                          publishedPaperPath: filePath
                        }));
                      }}
                      required={formData.status === 'Published'}
                      userType="faculty"
                      userId={profile?.id || ''}
                      category="journals/published-paper"
                      disabled={editingItem && (editingItem.approvalStatus === 'APPROVED' || editingItem.approvalStatus === 'LOCKED')}
                    />
                  )}
                  <FileUpload
                    label="Index Proof PDF"
                    acceptedFile={formData.indexProofPath}
                    onFileChange={(file) => {
                      // File selected, will be uploaded automatically via onUpload
                    }}
                    onUpload={(filePath) => {
                      // File uploaded successfully, update formData
                      setFormData(prev => ({
                        ...prev,
                        indexProofPath: filePath
                      }));
                    }}
                    required
                    userType="faculty"
                    userId={profile?.id || ''}
                    category="journals/index-proof"
                    disabled={editingItem && (editingItem.approvalStatus === 'APPROVED' || editingItem.approvalStatus === 'LOCKED')}
                  />
                </div>
              </div>
            </div>

            {editingItem && editingItem.remarks && (
              <div className="publication-form-remarks">
                <label className="publication-form-remarks-label">Admin Remarks</label>
                <p className="publication-form-remarks-text">{editingItem.remarks}</p>
              </div>
            )}
          </>
        );
      case 'conferences':
        return (
          <>
            {titleField}
            {yearField}
            <div className="grid grid-cols-2 gap-4">
              {statusField}
              {formData.status === 'Published' ? (
                <div className="publication-form-field">
                  <label className="publication-form-label">Published In</label>
                  <select
                    value={formData.publishedIn || ''}
                    onChange={(e) => setFormData({ ...formData, publishedIn: e.target.value })}
                    className="publication-form-select"
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
              <div className="publication-form-field">
                <label className="publication-form-label">Specify <span className="publication-form-label-required">*</span></label>
                <input
                  type="text"
                  value={formData.otherPublishedIn || ''}
                  onChange={(e) => setFormData({ ...formData, otherPublishedIn: e.target.value })}
                  required
                  className="publication-form-input"
                  placeholder="Enter publication details"
                />
              </div>
            )}

            <div>
              <label className="publication-form-label">Conference Name <span className="publication-form-label-required">*</span></label>
              <input
                type="text"
                value={formData.conferenceName || ''}
                onChange={(e) => setFormData({ ...formData, conferenceName: e.target.value })}
                required
                className="publication-form-input"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="publication-form-label">Category <span className="publication-form-label-required">*</span></label>
                <select
                  value={formData.category || 'National'}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  required
                  className="publication-form-input"
                >
                  <option value="National">National</option>
                  <option value="International">International</option>
                </select>
              </div>
              <div>
                <label className="publication-form-label">Organizer</label>
                <input
                  type="text"
                  value={formData.organizer || ''}
                  onChange={(e) => setFormData({ ...formData, organizer: e.target.value })}
                  className="publication-form-input"
                />
              </div>
            </div>
            <div>
              <label className="publication-form-label">Location / Venue</label>
              <input
                type="text"
                value={formData.location || ''}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="publication-form-input"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="publication-form-label">Date</label>
                <input
                  type="date"
                  value={formData.date || ''}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="publication-form-input"
                />
              </div>
              <div>
                <label className="publication-form-label">Registration Amount</label>
                <input
                  type="text"
                  value={formData.registrationAmount || ''}
                  onChange={(e) => setFormData({ ...formData, registrationAmount: e.target.value })}
                  className="publication-form-input"
                />
              </div>
            </div>
            <div>
              <label className="publication-form-label">Payment Mode</label>
              <select
                value={formData.paymentMode || 'Online'}
                onChange={(e) => setFormData({ ...formData, paymentMode: e.target.value })}
                className="publication-form-select"
              >
                <option value="Online">Online</option>
                <option value="Cash">Cash</option>
                <option value="Cheque">Cheque</option>
                <option value="NEFT">NEFT</option>
              </select>
            </div>
            {renderAuthorSection('Author', 'Author Details', 'authors')}
            {renderAuthorSection('Corresponding Author', 'Corresponding Author Details', 'correspondingAuthors')}

            <div className="grid grid-cols-2 gap-4 mt-4">
              <div>
                <label className="publication-form-label">DOI <span className="publication-form-label-required">*</span></label>
                <input
                  type="text"
                  value={formData.doi || ''}
                  onChange={(e) => setFormData({ ...formData, doi: e.target.value })}
                  required
                  className="publication-form-input"
                  placeholder="Use - or nil if missing"
                />
              </div>
              <div>
                <label className="publication-form-label">Publisher <span className="publication-form-label-required">*</span></label>
                <input
                  type="text"
                  value={formData.publisher || ''}
                  onChange={(e) => setFormData({ ...formData, publisher: e.target.value })}
                  required
                  className="publication-form-input"
                  placeholder="Use - or nil if missing"
                />
              </div>
            </div>
            <div className="publication-form-field">
              <label className="publication-form-label">Volume <span className="publication-form-label-required">*</span></label>
              <input
                type="text"
                value={formData.volume || ''}
                onChange={(e) => setFormData({ ...formData, volume: e.target.value })}
                required
                className="publication-form-input"
                placeholder="Use - or nil if missing"
              />
            </div>

            <div className="border-t pt-4 mt-4">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Collaborated with Students
                </label>
                <select
                  value={formData.collaboratedWithStudents ? 'yes' : 'no'}
                  onChange={(e) => {
                    const value = e.target.value === 'yes';
                    setFormData({
                      ...formData,
                      collaboratedWithStudents: value,
                      studentCollaborations: value ? (formData.studentCollaborations || []) : []
                    });
                  }}
                  className="publication-form-input"
                >
                  <option value="no">No</option>
                  <option value="yes">Yes</option>
                </select>
              </div>

              {formData.collaboratedWithStudents && (
                <div className="mt-4">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <label className="block text-sm font-medium text-gray-700">Student Details</label>
                    <button
                      type="button"
                      onClick={() => {
                        setFormData({
                          ...formData,
                          studentCollaborations: [
                            ...(formData.studentCollaborations || []),
                            { studentName: '', registrationNumber: '', year: '', guideName: '' }
                          ]
                        });
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '6px 12px',
                        background: '#1e3a8a',
                        color: '#ffffff',
                        border: 'none',
                        borderRadius: '6px',
                        fontSize: '14px',
                        fontWeight: '500',
                        cursor: 'pointer'
                      }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      Add Student
                    </button>
                  </div>

                  {(formData.studentCollaborations || []).map((student, index) => (
                    <div key={index} style={{
                      border: '1px solid #e2e8f0',
                      borderRadius: '6px',
                      padding: '16px',
                      marginBottom: '12px',
                      background: '#f8fafc'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                        <span style={{ fontWeight: '600', color: '#1e293b' }}>Student {index + 1}</span>
                        <button
                          type="button"
                          onClick={() => {
                            const updated = [...(formData.studentCollaborations || [])];
                            updated.splice(index, 1);
                            setFormData({ ...formData, studentCollaborations: updated });
                          }}
                          style={{
                            padding: '4px 8px',
                            background: '#dc2626',
                            color: '#ffffff',
                            border: 'none',
                            borderRadius: '4px',
                            fontSize: '12px',
                            cursor: 'pointer'
                          }}
                        >
                          Remove
                        </button>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Student Name *</label>
                          <input
                            type="text"
                            value={student.studentName || ''}
                            onChange={(e) => {
                              const updated = [...(formData.studentCollaborations || [])];
                              updated[index] = { ...updated[index], studentName: e.target.value };
                              setFormData({ ...formData, studentCollaborations: updated });
                            }}
                            required
                            className="publication-form-input"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Registration Number *</label>
                          <input
                            type="text"
                            value={student.registrationNumber || ''}
                            onChange={(e) => {
                              const updated = [...(formData.studentCollaborations || [])];
                              updated[index] = { ...updated[index], registrationNumber: e.target.value };
                              setFormData({ ...formData, studentCollaborations: updated });
                            }}
                            required
                            className="publication-form-input"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4 mt-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Year *</label>
                          <input
                            type="text"
                            value={student.year || ''}
                            onChange={(e) => {
                              const updated = [...(formData.studentCollaborations || [])];
                              updated[index] = { ...updated[index], year: e.target.value };
                              setFormData({ ...formData, studentCollaborations: updated });
                            }}
                            required
                            className="publication-form-input"
                            placeholder="e.g., 2024"
                          />
                        </div>
                        <div>
                          <label className="publication-form-label">Guide Name <span className="publication-form-label-required">*</span></label>
                          <input
                            type="text"
                            value={student.guideName || ''}
                            onChange={(e) => {
                              const updated = [...(formData.studentCollaborations || [])];
                              updated[index] = { ...updated[index], guideName: e.target.value };
                              setFormData({ ...formData, studentCollaborations: updated });
                            }}
                            required
                            className="publication-form-input"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="space-y-4">
              <h3 className="publication-form-section-title">Mandatory Uploads (PDF) <span className="publication-form-label-required">*</span></h3>

              <div className="publication-form-field">
                <label className="publication-form-label">Transaction ID / Net Banking Details <span className="publication-form-label-required">*</span></label>
                <input
                  type="text"
                  value={formData.paymentDetails || ''}
                  onChange={(e) => setFormData({ ...formData, paymentDetails: e.target.value })}
                  required
                  className="publication-form-input"
                  placeholder="Enter Transaction ID or Net Banking details"
                  disabled={editingItem && (editingItem.approvalStatus === 'APPROVED' || editingItem.approvalStatus === 'LOCKED')}
                />
              </div>

              <FileUpload
                label="Registration or Payment Proof PDF"
                acceptedFile={formData.registrationReceiptPath}
                onFileChange={(file) => { }}
                onUpload={(filePath) => {
                  setFormData(prev => ({ ...prev, registrationReceiptPath: filePath }));
                }}
                required
                userType="faculty"
                userId={profile?.id || ''}
                category="conferences/registration-receipt"
                disabled={editingItem && (editingItem.approvalStatus === 'APPROVED' || editingItem.approvalStatus === 'LOCKED')}
              />

              <FileUpload
                label="Payment Receipt Mail Proof (Acknowledgment Screenshot PDF)"
                acceptedFile={formData.acknowledgmentPath}
                onFileChange={(file) => { }}
                onUpload={(filePath) => {
                  setFormData(prev => ({ ...prev, acknowledgmentPath: filePath }));
                }}
                required
                userType="faculty"
                userId={profile?.id || ''}
                category="conferences/acknowledgment"
                disabled={editingItem && (editingItem.approvalStatus === 'APPROVED' || editingItem.approvalStatus === 'LOCKED')}
              />

              <FileUpload
                label="Certificate PDF"
                acceptedFile={formData.certificatePath}
                onFileChange={(file) => { }}
                onUpload={(filePath) => {
                  setFormData(prev => ({ ...prev, certificatePath: filePath }));
                }}
                required
                userType="faculty"
                userId={profile?.id || ''}
                category="conferences/certificate"
                disabled={editingItem && (editingItem.approvalStatus === 'APPROVED' || editingItem.approvalStatus === 'LOCKED')}
              />

              <FileUpload
                label="Published Paper PDF"
                acceptedFile={formData.publishedPaperPath}
                onFileChange={(file) => { }}
                onUpload={(filePath) => {
                  setFormData(prev => ({ ...prev, publishedPaperPath: filePath }));
                }}
                required
                userType="faculty"
                userId={profile?.id || ''}
                category="conferences/published-paper"
                disabled={editingItem && (editingItem.approvalStatus === 'APPROVED' || editingItem.approvalStatus === 'LOCKED')}
              />
            </div>
            {editingItem && editingItem.remarks && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <label className="block text-sm font-medium text-red-700 mb-1">Admin Remarks</label>
                <p className="text-sm text-red-600">{editingItem.remarks}</p>
              </div>
            )}
          </>
        );
      case 'patents':
        return (
          <>
            {titleField}
            {yearField}
            {statusField}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="publication-form-label">Category <span className="publication-form-label-required">*</span></label>
                <select
                  value={formData.category || 'National'}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  required
                  className="publication-form-select"
                >
                  <option value="National">National</option>
                  <option value="International">International</option>
                </select>
              </div>
              <div>
                <label className="publication-form-label">Status Flow <span className="publication-form-label-required">*</span></label>
                <select
                  value={formData.status || 'Filed'}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  required
                  className="publication-form-select"
                >
                  <option value="Filed">Filed</option>
                  <option value="Published">Published</option>
                  <option value="Granted">Granted</option>
                </select>
              </div>
            </div>
            <div>
              <label className="publication-form-label">Application Number</label>
              <input
                type="text"
                value={formData.applicationNumber || ''}
                onChange={(e) => setFormData({ ...formData, applicationNumber: e.target.value })}
                className="publication-form-input"
              />
            </div>
            <div>
              <label className="publication-form-label">Filing Date</label>
              <input
                type="date"
                value={formData.filingDate || ''}
                onChange={(e) => setFormData({ ...formData, filingDate: e.target.value })}
                className="publication-form-input"
              />
            </div>
            {renderAuthorSection('Inventor', 'Inventor Details', 'inventors')}
            {renderAuthorSection('Corresponding Inventor', 'Corresponding Inventor Details', 'correspondingInventors')}
            <div>
              <label className="publication-form-label">Country</label>
              <input
                type="text"
                value={formData.country || ''}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                className="publication-form-input"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="publication-form-label">DOI <span className="publication-form-label-required">*</span></label>
                <input
                  type="text"
                  value={formData.doi || ''}
                  onChange={(e) => setFormData({ ...formData, doi: e.target.value })}
                  required
                  className="publication-form-input"
                  placeholder="Use - or nil if missing"
                />
              </div>
              <div>
                <label className="publication-form-label">Publisher <span className="publication-form-label-required">*</span></label>
                <input
                  type="text"
                  value={formData.publisher || ''}
                  onChange={(e) => setFormData({ ...formData, publisher: e.target.value })}
                  required
                  className="publication-form-input"
                  placeholder="Use - or nil if missing"
                />
              </div>
            </div>
            <div className="publication-form-field">
              <label className="publication-form-label">Volume <span className="publication-form-label-required">*</span></label>
              <input
                type="text"
                value={formData.volume || ''}
                onChange={(e) => setFormData({ ...formData, volume: e.target.value })}
                required
                className="publication-form-input"
                placeholder="Use - or nil if missing"
              />
            </div>
            <div className="publication-form-section">
              <h3 className="publication-form-section-title">Mandatory Uploads (PDF, Conditional) <span className="publication-form-label-required">*</span></h3>
              <FileUpload
                label="Filing Proof PDF (Required for Filed status)"
                acceptedFile={formData.filingProofPath}
                onFileChange={(file) => { }}
                onUpload={(filePath) => {
                  setFormData(prev => ({ ...prev, filingProofPath: filePath }));
                }}
                required={formData.status === 'Filed'}
                userType="faculty"
                userId={profile?.id || ''}
                category="patents/filing-proof"
                disabled={editingItem && (editingItem.approvalStatus === 'APPROVED' || editingItem.approvalStatus === 'LOCKED')}
              />
              {(formData.status === 'Published' || formData.status === 'Granted' || editingItem?.publicationCertificatePath) && (
                <FileUpload
                  label="Publication Certificate PDF"
                  acceptedFile={formData.publicationCertificatePath}
                  onFileChange={(file) => { }}
                  onUpload={(filePath) => {
                    setFormData(prev => ({ ...prev, publicationCertificatePath: filePath }));
                  }}
                  required={formData.status === 'Published' || formData.status === 'Granted'}
                  userType="faculty"
                  userId={profile?.id || ''}
                  category="patents/publication-certificate"
                  disabled={editingItem && (editingItem.approvalStatus === 'APPROVED' || editingItem.approvalStatus === 'LOCKED')}
                />
              )}
              {(formData.status === 'Granted' || editingItem?.grantCertificatePath) && (
                <FileUpload
                  label="Grant Certificate PDF"
                  acceptedFile={formData.grantCertificatePath}
                  onFileChange={(file) => { }}
                  onUpload={(filePath) => {
                    setFormData(prev => ({ ...prev, grantCertificatePath: filePath }));
                  }}
                  required={formData.status === 'Granted'}
                  userType="faculty"
                  userId={profile?.id || ''}
                  category="patents/grant-certificate"
                  disabled={editingItem && (editingItem.approvalStatus === 'APPROVED' || editingItem.approvalStatus === 'LOCKED')}
                />
              )}
            </div>
            {editingItem && editingItem.remarks && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <label className="block text-sm font-medium text-red-700 mb-1">Admin Remarks</label>
                <p className="text-sm text-red-600">{editingItem.remarks}</p>
              </div>
            )}
          </>
        );
      case 'bookChapters':
        return (
          <>
            {titleField}
            {yearField}
            {statusField}
            <div>
              <label className="publication-form-label">Book Title <span className="publication-form-label-required">*</span></label>
              <input
                type="text"
                value={formData.bookTitle || ''}
                onChange={(e) => setFormData({ ...formData, bookTitle: e.target.value })}
                required
                className="publication-form-input"
              />
            </div>
            {renderAuthorSection('Author', 'Author Details', 'authors')}
            {renderAuthorSection('Corresponding Author', 'Corresponding Author Details', 'correspondingAuthors')}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="publication-form-label">Category <span className="publication-form-label-required">*</span></label>
                <select
                  value={formData.category || 'National'}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  required
                  className="publication-form-input"
                >
                  <option value="National">National</option>
                  <option value="International">International</option>
                </select>
              </div>
              <div>
                <label className="publication-form-label">Publisher <span className="publication-form-label-required">*</span></label>
                <input
                  type="text"
                  value={formData.publisher || ''}
                  onChange={(e) => setFormData({ ...formData, publisher: e.target.value })}
                  required
                  className="publication-form-input"
                  placeholder="Use - or nil if missing"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Editors</label>
              <input
                type="text"
                value={formData.editors || ''}
                onChange={(e) => setFormData({ ...formData, editors: e.target.value })}
                className="publication-form-input"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="publication-form-label">DOI <span className="publication-form-label-required">*</span></label>
                <input
                  type="text"
                  value={formData.doi || ''}
                  onChange={(e) => setFormData({ ...formData, doi: e.target.value })}
                  required
                  className="publication-form-input"
                  placeholder="Use - or nil if missing"
                />
              </div>
              <div>
                <label className="publication-form-label">Volume <span className="publication-form-label-required">*</span></label>
                <input
                  type="text"
                  value={formData.volume || ''}
                  onChange={(e) => setFormData({ ...formData, volume: e.target.value })}
                  required
                  className="publication-form-input"
                  placeholder="Use - or nil if missing"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="publication-form-label">Page Numbers</label>
                <input
                  type="text"
                  value={formData.pages || ''}
                  onChange={(e) => setFormData({ ...formData, pages: e.target.value })}
                  placeholder="e.g., 45-67"
                  className="publication-form-input"
                />
              </div>
              <div>
                <label className="publication-form-label">ISBN <span className="publication-form-label-required">*</span></label>
                <input
                  type="text"
                  value={formData.isbn || ''}
                  onChange={(e) => setFormData({ ...formData, isbn: e.target.value })}
                  required
                  className="publication-form-input"
                />
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="publication-form-section-title">Mandatory Uploads (PDF) <span className="publication-form-label-required">*</span></h3>
              <FileUpload
                label="Chapter PDF"
                acceptedFile={formData.chapterPdfPath}
                onFileChange={(file) => { }}
                onUpload={(filePath) => {
                  setFormData(prev => ({ ...prev, chapterPdfPath: filePath }));
                }}
                required
                userType="faculty"
                userId={profile?.id || ''}
                category="book-chapters/chapter-pdf"
                disabled={editingItem && (editingItem.approvalStatus === 'APPROVED' || editingItem.approvalStatus === 'LOCKED')}
              />
              <FileUpload
                label="ISBN Proof PDF"
                acceptedFile={formData.isbnProofPath}
                onFileChange={(file) => { }}
                onUpload={(filePath) => {
                  setFormData(prev => ({ ...prev, isbnProofPath: filePath }));
                }}
                required
                userType="faculty"
                userId={profile?.id || ''}
                category="book-chapters/isbn-proof"
                disabled={editingItem && (editingItem.approvalStatus === 'APPROVED' || editingItem.approvalStatus === 'LOCKED')}
              />
            </div>
            {editingItem && editingItem.remarks && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <label className="block text-sm font-medium text-red-700 mb-1">Admin Remarks</label>
                <p className="text-sm text-red-600">{editingItem.remarks}</p>
              </div>
            )}
          </>
        );
      case 'books':
        return (
          <>
            <div>
              <label className="publication-form-label">Book Title <span className="publication-form-label-required">*</span></label>
              <input
                type="text"
                value={formData.bookTitle || ''}
                onChange={(e) => setFormData({ ...formData, bookTitle: e.target.value })}
                required
                className="publication-form-input"
              />
            </div>
            {renderAuthorSection('Author', 'Author Details', 'authors')}
            {renderAuthorSection('Corresponding Author', 'Corresponding Author Details', 'correspondingAuthors')}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="publication-form-label">Category <span className="publication-form-label-required">*</span></label>
                <select
                  value={formData.category || 'National'}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  required
                  className="publication-form-input"
                >
                  <option value="National">National</option>
                  <option value="International">International</option>
                </select>
              </div>
              <div>
                <label className="publication-form-label">Role <span className="publication-form-label-required">*</span></label>
                <select
                  value={formData.role || 'Author'}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  required
                  className="publication-form-input"
                >
                  <option value="Author">Author</option>
                  <option value="Editor">Editor</option>
                </select>
              </div>
            </div>
            <div>
              <label className="publication-form-label">Publisher <span className="publication-form-label-required">*</span></label>
              <input
                type="text"
                value={formData.publisher || ''}
                onChange={(e) => setFormData({ ...formData, publisher: e.target.value })}
                required
                className="publication-form-input"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="publication-form-label">ISBN <span className="publication-form-label-required">*</span></label>
                <input
                  type="text"
                  value={formData.isbn || ''}
                  onChange={(e) => setFormData({ ...formData, isbn: e.target.value })}
                  required
                  className="publication-form-input"
                />
              </div>
              <div>
                <label className="publication-form-label">Publication Year <span className="publication-form-label-required">*</span></label>
                <input
                  type="number"
                  value={formData.publicationYear || formData.year || ''}
                  onChange={(e) => setFormData({ ...formData, publicationYear: parseInt(e.target.value), year: parseInt(e.target.value) })}
                  required
                  min="2000"
                  max={new Date().getFullYear() + 1}
                  className="publication-form-input"
                />
              </div>
            </div>
            <div>
              <label className="publication-form-label">Status <span className="publication-form-label-required">*</span></label>
              <select
                value={formData.status || 'Published'}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                required
                className="publication-form-input"
              >
                <option value="Published">Published</option>
                <option value="Accepted">Accepted</option>
                <option value="Submitted">Submitted</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div>
                <label className="publication-form-label">DOI <span className="publication-form-label-required">*</span></label>
                <input
                  type="text"
                  value={formData.doi || ''}
                  onChange={(e) => setFormData({ ...formData, doi: e.target.value })}
                  required
                  className="publication-form-input"
                  placeholder="Use - or nil if missing"
                />
              </div>
              <div>
                <label className="publication-form-label">Volume <span className="publication-form-label-required">*</span></label>
                <input
                  type="text"
                  value={formData.volume || ''}
                  onChange={(e) => setFormData({ ...formData, volume: e.target.value })}
                  required
                  className="publication-form-input"
                  placeholder="Use - or nil if missing"
                />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="publication-form-section-title">Mandatory Uploads (PDF) <span className="publication-form-label-required">*</span></h3>
              <FileUpload
                label="Book Cover PDF"
                acceptedFile={formData.bookCoverPath}
                onFileChange={(file) => { }}
                onUpload={(filePath) => {
                  setFormData(prev => ({ ...prev, bookCoverPath: filePath }));
                }}
                required
                userType="faculty"
                userId={profile?.id || ''}
                category="books/book-cover"
                disabled={editingItem && (editingItem.approvalStatus === 'APPROVED' || editingItem.approvalStatus === 'LOCKED')}
              />
              <FileUpload
                label="ISBN Proof PDF"
                acceptedFile={formData.isbnProofPath}
                onFileChange={(file) => { }}
                onUpload={(filePath) => {
                  setFormData(prev => ({ ...prev, isbnProofPath: filePath }));
                }}
                required
                userType="faculty"
                userId={profile?.id || ''}
                category="books/isbn-proof"
                disabled={editingItem && (editingItem.approvalStatus === 'APPROVED' || editingItem.approvalStatus === 'LOCKED')}
              />
            </div>
            {editingItem && editingItem.remarks && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <label className="block text-sm font-medium text-red-700 mb-1">Admin Remarks</label>
                <p className="text-sm text-red-600">{editingItem.remarks}</p>
              </div>
            )}
          </>
        );
      case 'projects':
        return (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div className="publication-form-field">
                <label className="publication-form-label">Project Type <span className="publication-form-label-required">*</span></label>
                <select
                  value={formData.projectType || ''}
                  onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
                  required
                  className="publication-form-select"
                >
                  <option value="">Select Project Type</option>
                  <option value="Seedgrant project">Seedgrant project</option>
                  <option value="Consultancy project">Consultancy project</option>
                  <option value="External funding project">External funding project</option>
                </select>
              </div>
              {formData.projectType === 'Seedgrant project' && (
                <div className="publication-form-field">
                  <label className="publication-form-label">Seed Grant Link <span className="publication-form-label-required">*</span></label>
                  <input
                    type="url"
                    value={formData.seedGrantLink || ''}
                    onChange={(e) => setFormData({ ...formData, seedGrantLink: e.target.value })}
                    required
                    className="publication-form-input"
                    placeholder="Enter project link"
                  />
                </div>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4">
              {titleField}
              {statusField}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="publication-form-field">
                <label className="publication-form-label">Name of Investigator <span className="publication-form-label-required">*</span></label>
                <input
                  type="text"
                  value={formData.investigatorName || ''}
                  onChange={(e) => setFormData({ ...formData, investigatorName: e.target.value })}
                  required
                  className="publication-form-input"
                />
              </div>
              <div className="publication-form-field">
                <label className="publication-form-label">Department <span className="publication-form-label-required">*</span></label>
                <input
                  type="text"
                  value={formData.department || ''}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  required
                  className="publication-form-input"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="publication-form-field">
                <label className="publication-form-label">Employee ID <span className="publication-form-label-required">*</span></label>
                <input
                  type="text"
                  value={formData.employeeId || ''}
                  onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
                  required
                  className="publication-form-input"
                />
              </div>
              <div className="publication-form-field">
                <label className="publication-form-label">Date Approved <span className="publication-form-label-required">*</span></label>
                <input
                  type="date"
                  value={formData.dateApproved || ''}
                  onChange={(e) => setFormData({ ...formData, dateApproved: e.target.value })}
                  required
                  className="publication-form-input"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="publication-form-field">
                <label className="publication-form-label">Duration <span className="publication-form-label-required">*</span></label>
                <input
                  type="text"
                  value={formData.duration || ''}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  required
                  className="publication-form-input"
                  placeholder="e.g., 2 years"
                />
              </div>
              <div className="publication-form-field">
                <label className="publication-form-label">Amount <span className="publication-form-label-required">*</span></label>
                <input
                  type="text"
                  value={formData.amount || ''}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  required
                  className="publication-form-input"
                />
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="publication-form-section-title">Outcome Proof <span className="publication-form-label-required">*</span></h3>
              <FileUpload
                label="Outcome Proof PDF"
                acceptedFile={formData.outcomeProofPath}
                onUpload={(filePath) => setFormData(prev => ({ ...prev, outcomeProofPath: filePath }))}
                required
                userType="faculty"
                userId={profile?.id || ''}
                category="projects/outcome-proof"
                disabled={editingItem && (editingItem.approvalStatus === 'APPROVED' || editingItem.approvalStatus === 'LOCKED')}
              />
            </div>
            {editingItem && editingItem.remarks && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <label className="block text-sm font-medium text-red-700 mb-1">Admin Remarks</label>
                <p className="text-sm text-red-600">{editingItem.remarks}</p>
              </div>
            )}
          </>
        );
      default:
        return null;
    }
  };

  return (
    <Layout title="My Publications">
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow">
          <div className="border-b border-gray-200">
            <nav className={`flex -mb-px ${isMobile ? 'overflow-x-auto' : ''}`}>
              {['journals', 'conferences', 'patents', 'bookChapters', 'books', 'projects'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-4 px-4 sm:px-6 text-xs sm:text-sm font-medium border-b-2 whitespace-nowrap ${activeTab === tab
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                >
                  {tab === 'bookChapters' ? 'Book Chapters' : tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-4 sm:p-6">
            <div className="mb-4 flex flex-wrap gap-2">
              <button
                onClick={() => openModal(activeTab)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm sm:text-base font-medium shadow-sm"
              >
                Add Manual
              </button>
              {(activeTab === 'journals' || activeTab === 'conferences') && (
                <button
                  onClick={() => {
                    setShowImportModal(true);
                    if (profile?.name) setImportSearchName(profile.name);
                  }}
                  className="bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-black text-sm sm:text-base font-medium shadow-sm flex items-center gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                  Import External
                </button>
              )}
              {activeTab === 'journals' && profile?.semanticScholarId && (
                <button
                  onClick={handleBulkSync}
                  disabled={loading}
                  className="bg-blue-50 text-blue-700 px-4 py-2 rounded-lg hover:bg-blue-100 text-sm sm:text-base font-medium shadow-sm flex items-center gap-2 border border-blue-200"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  {loading ? 'Syncing...' : 'Sync All from Scholar'}
                </button>
              )}
            </div>

            {activeTab === 'journals' && renderTable(journals, 'journals')}
            {activeTab === 'conferences' && renderTable(conferences, 'conferences')}
            {activeTab === 'patents' && renderTable(patents, 'patents')}
            {activeTab === 'bookChapters' && renderTable(bookChapters, 'bookChapters')}
            {activeTab === 'books' && renderTable(books, 'books')}
            {activeTab === 'projects' && renderTable(projects, 'projects')}
          </div>
        </div>
      </div>

      {showModal && (
        <div className="publication-form-modal" onClick={(e) => e.target === e.currentTarget && setShowModal(false)}>
          <div className="publication-form-container">
            <div className="publication-form-header">
              <h3 className="publication-form-title">
                {editingItem ? 'Edit' : 'Add New'} {activeTab.charAt(0).toUpperCase() + activeTab.slice(1).replace(/([A-Z])/g, ' $1')}
              </h3>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="publication-form-body">
                {renderForm()}
              </div>
              <div className="publication-form-actions">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="publication-form-btn publication-form-btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="publication-form-btn publication-form-btn-primary"
                >
                  {loading ? 'Saving...' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {showImportModal && (
        <div className="publication-form-modal" onClick={(e) => e.target === e.currentTarget && setShowImportModal(false)}>
          <div className="publication-form-container" style={{ maxWidth: '800px' }}>
            <div className="publication-form-header">
              <h3 className="publication-form-title">Import from External APIs</h3>
              <button onClick={() => setShowImportModal(false)} className="text-gray-400 hover:text-gray-600">×</button>
            </div>
            <div className="publication-form-body">
              <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
                <p className="text-sm text-blue-800 mb-4">
                  Search for your publications on Semantic Scholar or ORCID. Once found, you can import them directly into the system.
                </p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={importSearchName}
                    onChange={(e) => setImportSearchName(e.target.value)}
                    placeholder="Enter author name or ID..."
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                  <button 
                    onClick={() => handleImportSearch('scholar')}
                    disabled={importLoading}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                  >
                    Scholar
                  </button>
                  <button 
                    onClick={() => handleImportSearch('google')}
                    disabled={importLoading}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                  >
                    Google
                  </button>
                  <button 
                    onClick={() => handleImportSearch('orcid')}
                    disabled={importLoading}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
                  >
                    ORCID
                  </button>
                  <button 
                    onClick={() => handleImportSearch('books')}
                    disabled={importLoading}
                    className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50"
                  >
                    Books
                  </button>
                  <button 
                    onClick={() => handleImportSearch('patents')}
                    disabled={importLoading}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
                  >
                    Patents
                  </button>
                </div>
              </div>

              {importLoading ? (
                <div className="flex justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
              ) : (
                <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                  {externalPapers.length > 0 && (
                    <div className="flex justify-between items-center bg-blue-50 p-3 rounded-lg border border-blue-200 sticky top-0 z-10">
                      <span className="text-sm font-bold text-blue-800">{externalPapers.length} Results Found</span>
                      <button
                        onClick={async () => {
                          if (window.confirm(`Are you sure you want to import ALL ${externalPapers.length} items?`)) {
                            setImportLoading(true);
                            try {
                              const count = await externalService.importResearchPapers(externalPapers);
                              alert(`Successfully imported ${count} items!`);
                              setShowImportModal(false);
                              loadData();
                            } catch (e) {
                              console.error('Bulk import failed:', e);
                              alert(`Bulk import failed: ${e.response?.data?.message || e.message}`);
                            } finally {
                              setImportLoading(false);
                            }
                          }
                        }}
                        className="px-4 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-xs font-bold"
                      >
                        Import All Visible
                      </button>
                    </div>
                  )}
                  {externalAuthors.map((author, idx) => (
                    <div key={idx} className="researcher-card">
                      <div className="researcher-info">
                        <h4>{author.name}</h4>
                        <p className="researcher-id">{author.externalId}</p>
                      </div>
                      <button
                        onClick={() => {
                          setImportSearchName(author.externalId);
                          handleImportSearch('orcid', author.externalId);
                        }}
                        className="view-works-btn"
                      >
                        View Works
                      </button>
                    </div>
                  ))}

                  {externalPapers.map((paper, idx) => (
                    <div key={idx} className="p-4 border rounded-lg hover:border-blue-300 transition-colors bg-white shadow-sm">
                      <h4 className="font-bold text-gray-900 mb-1">{paper.title}</h4>
                      <div className="flex flex-wrap gap-2 text-xs text-gray-500 mb-3">
                        <span className="bg-gray-100 px-2 py-0.5 rounded">{paper.year}</span>
                        {paper.venue && <span className="bg-blue-50 px-2 py-0.5 rounded text-blue-700">{paper.venue}</span>}
                        {paper.citationCount !== undefined && <span className="bg-yellow-50 px-2 py-0.5 rounded text-yellow-700">Citations: {paper.citationCount}</span>}
                      </div>
                      <p className="text-sm text-gray-600 mb-3 italic">{paper.authors?.join(', ')}</p>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => handleImportPaper(paper)}
                          className="py-2 bg-gray-50 text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors text-xs font-bold"
                        >
                          Details & Edit
                        </button>
                        <button
                          onClick={async () => {
                            setImportLoading(true);
                            try {
                              await externalService.importResearchPapers([paper]);
                              alert('Paper imported successfully!');
                              loadData();
                            } catch (e) {
                              alert('Import failed');
                            } finally {
                              setImportLoading(false);
                            }
                          }}
                          className="py-2 bg-blue-600 text-white border border-blue-600 rounded-lg hover:bg-blue-700 transition-colors text-xs font-bold"
                        >
                          Import Directly
                        </button>
                      </div>
                    </div>
                  ))}
                  {externalPapers.length === 0 && externalAuthors.length === 0 && !importLoading && (
                    <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                      <p className="text-gray-500">Search to find publications to import</p>
                    </div>
                  )}
                </div>
              )}
            </div>
            <div className="publication-form-actions">
              <button
                onClick={() => setShowImportModal(false)}
                className="publication-form-btn publication-form-btn-secondary"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}

export default FacultyPublications;

