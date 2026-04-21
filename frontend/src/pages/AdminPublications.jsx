import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { adminService } from '../services/adminService';
import { useDeviceDetection } from '../hooks/useDeviceDetection';

function AdminPublications() {
  const { isMobile } = useDeviceDetection();
  const [activeTab, setActiveTab] = useState('journals');
  const [journals, setJournals] = useState([]);
  const [conferences, setConferences] = useState([]);
  const [patents, setPatents] = useState([]);
  const [bookChapters, setBookChapters] = useState([]);
  const [books, setBooks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [journalsRes, conferencesRes, patentsRes, bookChaptersRes, booksRes, projectsRes] = await Promise.all([
        adminService.getAllJournals(),
        adminService.getAllConferences(),
        adminService.getAllPatents(),
        adminService.getAllBookChapters(),
        adminService.getAllBooks(),
        adminService.getAllProjects()
      ]);
      setJournals(journalsRes.data);
      setConferences(conferencesRes.data);
      setPatents(patentsRes.data);
      setBookChapters(bookChaptersRes.data);
      setBooks(booksRes.data);
      setProjects(projectsRes.data);
    } catch (error) {
      console.error('Error loading publications:', error);
    } finally {
      setLoading(false);
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
    }
  };

  const renderTable = (data, type) => {
    if (loading) return <p className="text-center py-8">Loading...</p>;
    if (data.length === 0) return <p className="text-gray-500 text-center py-8">No {type} found.</p>;

    // Mobile: Render cards
    if (isMobile) {
      return (
        <div className="mobile-card-view">
          {data.map((item) => (
            <div key={item.id} className="data-card">
              <div className="data-card-header">
                <div className="data-card-title">
                  {item.title || 'Untitled'}
                </div>
                <div className="data-card-status">
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                    {item.status || 'N/A'}
                  </span>
                </div>
              </div>
              <div className="data-card-body">
                {renderCardFields(item, type)}
              </div>
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
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((item) => (
              <tr key={item.id}>
                {renderRow(item, type)}
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
              <div className="data-card-label">Authors</div>
              <div className="data-card-value">{Array.isArray(item.authors) ? item.authors.join(', ') : (item.authors || 'N/A')}</div>
            </div>
            <div className="data-card-field">
              <div className="data-card-label">Year</div>
              <div className="data-card-value">{item.year || 'N/A'}</div>
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
              <div className="data-card-label">Authors</div>
              <div className="data-card-value">{Array.isArray(item.authors) ? item.authors.join(', ') : (item.authors || 'N/A')}</div>
            </div>
            <div className="data-card-field">
              <div className="data-card-label">Year</div>
              <div className="data-card-value">{item.year || 'N/A'}</div>
            </div>
          </>
        );
      case 'patents':
        return (
          <>
            <div className="data-card-field">
              <div className="data-card-label">Patent Number</div>
              <div className="data-card-value">{item.patentNumber || 'N/A'}</div>
            </div>
            <div className="data-card-field">
              <div className="data-card-label">Inventors</div>
              <div className="data-card-value">{Array.isArray(item.inventors) ? item.inventors.join(', ') : (item.inventors || 'N/A')}</div>
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
              <div className="data-card-label">Authors</div>
              <div className="data-card-value">{Array.isArray(item.authors) ? item.authors.join(', ') : (item.authors || 'N/A')}</div>
            </div>
            <div className="data-card-field">
              <div className="data-card-label">Year</div>
              <div className="data-card-value">{item.year || 'N/A'}</div>
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
              <div className="data-card-label">Authors</div>
              <div className="data-card-value">{Array.isArray(item.authors) ? item.authors.join(', ') : (item.authors || 'N/A')}</div>
            </div>
            <div className="data-card-field">
              <div className="data-card-label">Year</div>
              <div className="data-card-value">{item.publicationYear || item.year || 'N/A'}</div>
            </div>
          </>
        );
      case 'projects':
        return (
          <>
            <div className="data-card-field">
              <div className="data-card-label">Project Type</div>
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
          </>
        );
      default:
        return null;
    }
  };

  const getHeaders = (type) => {
    switch (type) {
      case 'journals':
        return ['Title', 'Journal', 'Authors', 'Year', 'Status'];
      case 'conferences':
        return ['Title', 'Conference', 'Authors', 'Year', 'Status'];
      case 'patents':
        return ['Title', 'Patent Number', 'Inventors', 'Year', 'Status'];
      case 'bookChapters':
        return ['Title', 'Book', 'Authors', 'Year', 'Status'];
      case 'books':
        return ['Title', 'Publisher', 'Authors', 'Year', 'Status'];
      case 'projects':
        return ['Title', 'Type', 'Investigator', 'Amount', 'Status'];
      default:
        return [];
    }
  };

  const renderRow = (item, type) => {
    switch (type) {
      case 'journals':
        return (
          <>
            <td className="px-6 py-4 text-sm">{item.title}</td>
            <td className="px-6 py-4 text-sm">{item.journalName}</td>
            <td className="px-6 py-4 text-sm">{Array.isArray(item.authors) ? item.authors.join(', ') : item.authors}</td>
            <td className="px-6 py-4 text-sm">{item.year}</td>
            <td className="px-6 py-4 text-sm">{item.status}</td>
          </>
        );
      case 'conferences':
        return (
          <>
            <td className="px-6 py-4 text-sm">{item.title}</td>
            <td className="px-6 py-4 text-sm">{item.conferenceName}</td>
            <td className="px-6 py-4 text-sm">{Array.isArray(item.authors) ? item.authors.join(', ') : item.authors}</td>
            <td className="px-6 py-4 text-sm">{item.year}</td>
            <td className="px-6 py-4 text-sm">{item.status}</td>
          </>
        );
      case 'patents':
        return (
          <>
            <td className="px-6 py-4 text-sm">{item.title}</td>
            <td className="px-6 py-4 text-sm">{item.patentNumber || 'N/A'}</td>
            <td className="px-6 py-4 text-sm">{Array.isArray(item.inventors) ? item.inventors.join(', ') : item.inventors}</td>
            <td className="px-6 py-4 text-sm">{item.year}</td>
            <td className="px-6 py-4 text-sm">{item.status}</td>
          </>
        );
      case 'bookChapters':
        return (
          <>
            <td className="px-6 py-4 text-sm">{item.title}</td>
            <td className="px-6 py-4 text-sm">{item.bookTitle}</td>
            <td className="px-6 py-4 text-sm">{Array.isArray(item.authors) ? item.authors.join(', ') : item.authors}</td>
            <td className="px-6 py-4 text-sm">{item.year}</td>
            <td className="px-6 py-4 text-sm">{item.status}</td>
          </>
        );
      case 'books':
        return (
          <>
            <td className="px-6 py-4 text-sm">{item.bookTitle}</td>
            <td className="px-6 py-4 text-sm">{item.publisher || 'N/A'}</td>
            <td className="px-6 py-4 text-sm">{Array.isArray(item.authors) ? item.authors.join(', ') : (item.authors || 'N/A')}</td>
            <td className="px-6 py-4 text-sm">{item.publicationYear || item.year || 'N/A'}</td>
            <td className="px-6 py-4 text-sm">{item.status}</td>
          </>
        );
      case 'projects':
        return (
          <>
            <td className="px-6 py-4 text-sm">{item.title}</td>
            <td className="px-6 py-4 text-sm">{item.projectType}</td>
            <td className="px-6 py-4 text-sm">{item.investigatorName}</td>
            <td className="px-6 py-4 text-sm">{item.amount}</td>
            <td className="px-6 py-4 text-sm">{item.status || 'N/A'}</td>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <Layout title="All Publications">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h3 className="text-lg font-semibold">View All Publications</h3>
          <button
            onClick={handleExport}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 text-sm sm:text-base"
          >
            Export to Excel
          </button>
        </div>

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
                  {tab.charAt(0).toUpperCase() + tab.slice(1).replace(/([A-Z])/g, ' $1')}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-4 sm:p-6">
            {activeTab === 'journals' && renderTable(journals, 'journals')}
            {activeTab === 'conferences' && renderTable(conferences, 'conferences')}
            {activeTab === 'patents' && renderTable(patents, 'patents')}
            {activeTab === 'bookChapters' && renderTable(bookChapters, 'bookChapters')}
            {activeTab === 'books' && renderTable(books, 'books')}
            {activeTab === 'projects' && renderTable(projects, 'projects')}
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default AdminPublications;

