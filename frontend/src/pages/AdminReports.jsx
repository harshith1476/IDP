import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { adminService } from '../services/adminService';

function AdminReports() {
  const [reportType, setReportType] = useState('NAAC'); // NAAC, NBA, NIRF
  const [year, setYear] = useState(null);
  const [facultyId, setFacultyId] = useState(null);
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [facultyList, setFacultyList] = useState([]);

  useEffect(() => {
    loadFacultyList();
  }, []);

  const loadFacultyList = async () => {
    try {
      const response = await adminService.getAllProfiles();
      setFacultyList(response.data || []);
    } catch (error) {
      console.error('Error loading faculty list:', error);
    }
  };

  const generateReport = async () => {
    setLoading(true);
    try {
      let response;
      switch (reportType) {
        case 'NAAC':
          response = await adminService.generateNAACReport(year || null, facultyId || null);
          break;
        case 'NBA':
          response = await adminService.generateNBAReport(year || null, facultyId || null);
          break;
        case 'NIRF':
          response = await adminService.generateNIRFReport(year || null, facultyId || null);
          break;
        default:
          return;
      }
      setReportData(response.data);
    } catch (error) {
      console.error('Error generating report:', error);
      alert('Failed to generate report. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async (format) => {
    try {
      let response;
      if (format === 'excel') {
        response = await adminService.exportReportToExcel(reportType, year || null, facultyId || null);
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `${reportType.toLowerCase()}_report.xlsx`);
        document.body.appendChild(link);
        link.click();
        link.remove();
      } else if (format === 'pdf') {
        response = await adminService.exportReportToPDF(reportType, year || null, facultyId || null);
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `${reportType.toLowerCase()}_report.pdf`);
        document.body.appendChild(link);
        link.click();
        link.remove();
      }
    } catch (error) {
      console.error('Error exporting report:', error);
      alert('Failed to export report. Please try again.');
    }
  };

  const renderReportData = () => {
    if (!reportData) return null;

    return (
      <div className="space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="bg-white rounded-lg shadow p-4">
            <h4 className="text-gray-500 text-sm font-medium mb-2">Journals</h4>
            <p className="text-2xl font-bold text-blue-600">{reportData.totalJournals || 0}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <h4 className="text-gray-500 text-sm font-medium mb-2">Conferences</h4>
            <p className="text-2xl font-bold text-green-600">{reportData.totalConferences || 0}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <h4 className="text-gray-500 text-sm font-medium mb-2">Patents</h4>
            <p className="text-2xl font-bold text-purple-600">{reportData.totalPatents || 0}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <h4 className="text-gray-500 text-sm font-medium mb-2">Book Chapters</h4>
            <p className="text-2xl font-bold text-orange-600">{reportData.totalBookChapters || 0}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <h4 className="text-gray-500 text-sm font-medium mb-2">Books</h4>
            <p className="text-2xl font-bold text-teal-600">{reportData.totalBooks || 0}</p>
          </div>
        </div>

        {/* Category-wise Distribution */}
        {(reportData.journalsByCategory || reportData.conferencesByCategory) && (
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Category-wise Distribution</h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {reportData.journalsByCategory && (
                <div>
                  <h4 className="font-medium mb-2">Journals</h4>
                  <ul className="text-sm space-y-1">
                    {Object.entries(reportData.journalsByCategory).map(([cat, count]) => (
                      <li key={cat}>{cat}: {count}</li>
                    ))}
                  </ul>
                </div>
              )}
              {reportData.conferencesByCategory && (
                <div>
                  <h4 className="font-medium mb-2">Conferences</h4>
                  <ul className="text-sm space-y-1">
                    {Object.entries(reportData.conferencesByCategory).map(([cat, count]) => (
                      <li key={cat}>{cat}: {count}</li>
                    ))}
                  </ul>
                </div>
              )}
              {reportData.patentsByCategory && (
                <div>
                  <h4 className="font-medium mb-2">Patents</h4>
                  <ul className="text-sm space-y-1">
                    {Object.entries(reportData.patentsByCategory).map(([cat, count]) => (
                      <li key={cat}>{cat}: {count}</li>
                    ))}
                  </ul>
                </div>
              )}
              {reportData.bookChaptersByCategory && (
                <div>
                  <h4 className="font-medium mb-2">Book Chapters</h4>
                  <ul className="text-sm space-y-1">
                    {Object.entries(reportData.bookChaptersByCategory).map(([cat, count]) => (
                      <li key={cat}>{cat}: {count}</li>
                    ))}
                  </ul>
                </div>
              )}
              {reportData.booksByCategory && (
                <div>
                  <h4 className="font-medium mb-2">Books</h4>
                  <ul className="text-sm space-y-1">
                    {Object.entries(reportData.booksByCategory).map(([cat, count]) => (
                      <li key={cat}>{cat}: {count}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Year-wise Distribution */}
        {(reportData.yearWiseJournals || reportData.yearWiseConferences) && (
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Year-wise Distribution</h3>
            <div className="grid grid-cols-2 gap-4">
              {reportData.yearWiseJournals && (
                <div>
                  <h4 className="font-medium mb-2">Journals</h4>
                  <ul className="text-sm space-y-1">
                    {Object.entries(reportData.yearWiseJournals).map(([yr, count]) => (
                      <li key={yr}>{yr}: {count}</li>
                    ))}
                  </ul>
                </div>
              )}
              {reportData.yearWiseConferences && (
                <div>
                  <h4 className="font-medium mb-2">Conferences</h4>
                  <ul className="text-sm space-y-1">
                    {Object.entries(reportData.yearWiseConferences).map(([yr, count]) => (
                      <li key={yr}>{yr}: {count}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Faculty-wise Contribution */}
        {reportData.facultyWiseJournals && (
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Faculty-wise Contribution</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Faculty</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Journals</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {Object.entries(reportData.facultyWiseJournals).map(([faculty, count]) => (
                    <tr key={faculty}>
                      <td className="px-6 py-4 text-sm">{faculty}</td>
                      <td className="px-6 py-4 text-sm">{count}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* NBA Specific - Index Type Distribution */}
        {reportData.indexTypeDistribution && (
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Index Type Distribution</h3>
            <ul className="text-sm space-y-1">
              {Object.entries(reportData.indexTypeDistribution).map(([indexType, count]) => (
                <li key={indexType}>{indexType}: {count}</li>
              ))}
            </ul>
          </div>
        )}

        {/* NIRF Specific - Quality Metrics */}
        {(reportData.highImpactJournals !== undefined || reportData.publicationQualityScore !== undefined) && (
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Quality Metrics</h3>
            <div className="grid grid-cols-2 gap-4">
              {reportData.highImpactJournals !== undefined && (
                <div>
                  <h4 className="font-medium mb-2">High Impact Journals (IF ≥ 3.0)</h4>
                  <p className="text-2xl font-bold">{reportData.highImpactJournals}</p>
                </div>
              )}
              {reportData.publicationQualityScore !== undefined && (
                <div>
                  <h4 className="font-medium mb-2">Quality Score</h4>
                  <p className="text-2xl font-bold">{reportData.publicationQualityScore.toFixed(2)}%</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <Layout title="Reports & Analytics">
      <div className="space-y-6">
        {/* Report Generation Form */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Generate Report</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Report Type *</label>
              <select
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              >
                <option value="NAAC">NAAC Report</option>
                <option value="NBA">NBA Report</option>
                <option value="NIRF">NIRF Report</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Year (Optional)</label>
              <input
                type="number"
                value={year || ''}
                onChange={(e) => setYear(e.target.value ? parseInt(e.target.value) : null)}
                min="2000"
                max={new Date().getFullYear() + 1}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                placeholder="All Years"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Faculty (Optional)</label>
              <select
                value={facultyId || ''}
                onChange={(e) => setFacultyId(e.target.value || null)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              >
                <option value="">All Faculty</option>
                {facultyList.map((faculty) => (
                  <option key={faculty.id} value={faculty.id}>{faculty.name}</option>
                ))}
              </select>
            </div>
            <div className="flex items-end">
              <button
                onClick={generateReport}
                disabled={loading}
                className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? 'Generating...' : 'Generate Report'}
              </button>
            </div>
          </div>
        </div>

        {/* Report Data Display */}
        {reportData && (
          <div className="space-y-4">
            <div className="flex gap-4 justify-end">
              <button
                onClick={() => handleExport('excel')}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
              >
                Export to Excel
              </button>
              <button
                onClick={() => handleExport('pdf')}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
              >
                Export to PDF
              </button>
            </div>
            {renderReportData()}
          </div>
        )}
      </div>
    </Layout>
  );
}

export default AdminReports;
