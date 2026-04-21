import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { adminService } from '../services/adminService';
import { useDeviceDetection } from '../hooks/useDeviceDetection';

function AdminFacultyList() {
  const { isMobile } = useDeviceDetection();
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [facultyName, setFacultyName] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadSubmissions();
  }, [selectedYear, facultyName]);

  const loadSubmissions = async () => {
    setLoading(true);
    try {
      const response = await adminService.getFacultySubmissions(selectedYear, facultyName);
      setProfiles(response.data);
      setError(null);
    } catch (error) {
      console.error('Error loading submissions:', error);
      setError('Failed to load faculty submission data.');
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    try {
      const response = await adminService.exportToExcel(selectedYear, 'FacultySubmissions', facultyName);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Faculty_Submissions_${selectedYear}${facultyName ? `_${facultyName}` : ''}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export failed:', error);
      alert('Failed to export data to Excel.');
    }
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          <span className="ml-3 text-sm font-semibold text-slate-600 tracking-tight">Syncing data...</span>
        </div>
      );
    }

    if (error) {
      return (
        <div className="p-10 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-rose-50 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <p className="text-slate-600 text-sm font-medium mb-4">{error}</p>
          <button 
            onClick={loadSubmissions}
            className="px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-bold hover:bg-slate-800 transition-colors"
          >
            Retry Request
          </button>
        </div>
      );
    }

    if (profiles.length === 0) {
      return (
        <div className="text-center py-20 bg-white">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-slate-50 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <h3 className="text-slate-800 font-bold">No results found</h3>
          <p className="text-slate-400 text-sm mt-1">Adjust your filters to see more results.</p>
        </div>
      );
    }

    if (isMobile) {
      return (
        <div className="p-4 space-y-4">
          {profiles.map((profile) => (
            <div 
              key={profile.id} 
              className="p-4 bg-white border border-slate-200 rounded-xl shadow-sm cursor-pointer active:bg-slate-50 transition-colors"
              onClick={() => navigate(`/admin/faculty/${profile.id}`)}
            >
              <div className="flex justify-between items-start mb-3">
                <div className="font-bold text-slate-800">{profile.name}</div>
                <span className={`status-badge ${profile.submissionStatus === 'SUBMITTED' ? 'status-submitted' : 'status-not-submitted'}`}>
                  {profile.submissionStatus}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-y-2 text-xs">
                <div className="text-slate-400 font-medium">Employee ID</div>
                <div className="text-slate-700 font-bold text-right">{profile.employeeId || 'N/A'}</div>
                <div className="text-slate-400 font-medium">Department</div>
                <div className="text-slate-700 font-bold text-right truncate pl-4">{profile.department || 'N/A'}</div>
                <div className="text-slate-400 font-medium pt-2 border-t border-slate-100 mt-2">Annual Total</div>
                <div className="text-indigo-600 font-black text-right pt-2 border-t border-slate-100 mt-2 text-sm">{profile.totalSubmissions}</div>
              </div>
            </div>
          ))}
        </div>
      );
    }

    return (
      <div className="overflow-x-auto">
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Faculty Member</th>
              <th>Department</th>
              <th className="text-center">Count ({selectedYear})</th>
              <th className="text-center">Status</th>
              <th className="text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {profiles.map((profile) => (
              <tr 
                key={profile.id}
                onClick={() => navigate(`/admin/faculty/${profile.id}`)}
                className="cursor-pointer group"
              >
                <td className="font-medium text-slate-500 font-mono text-[13px]">{profile.employeeId}</td>
                <td className="font-bold text-indigo-950 group-hover:text-indigo-600 transition-colors">
                  {profile.name}
                </td>
                <td className="text-slate-500 italic font-medium">{profile.department}</td>
                <td className="text-center">
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-indigo-50 text-indigo-700 font-black text-[13px] border border-indigo-100">
                    {profile.totalSubmissions}
                  </span>
                </td>
                <td className="text-center">
                  <span className={`status-badge ${profile.submissionStatus === 'SUBMITTED' ? 'status-submitted' : 'status-not-submitted'}`}>
                    {profile.submissionStatus}
                  </span>
                </td>
                <td className="text-right">
                  <span className="view-link uppercase tracking-tighter">
                    Analyze <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <Layout title="Faculty Submissions Report">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Compact & Professional Filter Header */}
        <div className="mb-6 bg-white/80 backdrop-blur-md p-4 rounded-xl shadow-sm border border-slate-200/60 flex flex-col md:flex-row items-center justify-between gap-4 ring-1 ring-slate-900/5">
          <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
            {/* Year Filter */}
            <div className="relative w-full md:w-32 group">
              <label className="absolute -top-2 left-3 px-1 bg-white text-[9px] font-black text-slate-400 uppercase tracking-widest z-10 transition-colors group-focus-within:text-indigo-600">
                FY Year
              </label>
              <select 
                value={selectedYear}
                onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                className="w-full pl-3 pr-8 py-2 bg-slate-50/50 border border-slate-200 rounded-lg focus:outline-none focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 transition-all font-bold text-slate-700 text-sm appearance-none cursor-pointer"
              >
                {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - 5 + i).map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            {/* Separator Dot (Desktop only) */}
            <div className="hidden md:block w-1 h-1 rounded-full bg-slate-300"></div>

            {/* Faculty Search */}
            <div className="relative w-full md:w-64 group">
              <label className="absolute -top-2 left-3 px-1 bg-white text-[9px] font-black text-slate-400 uppercase tracking-widest z-10 transition-colors group-focus-within:text-indigo-600">
                Staff Search
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </span>
                <input 
                  type="text" 
                  value={facultyName}
                  onChange={(e) => setFacultyName(e.target.value)}
                  placeholder="Employee name..."
                  className="w-full pl-8 pr-4 py-2 bg-slate-50/50 border border-slate-200 rounded-lg focus:outline-none focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 transition-all font-semibold text-slate-700 text-sm placeholder:text-slate-300"
                />
              </div>
            </div>
          </div>
          
          {/* Action Buttons */}
          <button 
            onClick={handleExport}
            disabled={loading || profiles.length === 0}
            className={`flex items-center justify-center gap-2 px-6 py-2 rounded-lg font-black text-[10px] uppercase tracking-widest transition-all active:scale-95 shadow-lg border-b-2 ${
              loading || profiles.length === 0
                ? 'bg-slate-100 text-slate-300 border-slate-200 cursor-not-allowed'
                : 'bg-emerald-600 text-white border-emerald-700 hover:bg-emerald-700 hover:shadow-emerald-200 shadow-emerald-100'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Generate Excel
          </button>
        </div>

        {/* Professional Table View */}
        <div className="rounded-xl border border-slate-200 bg-white shadow-xl shadow-slate-200/40 overflow-hidden ring-1 ring-slate-900/5">
          {renderContent()}
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .admin-table {
          width: 100%;
          border-collapse: separate;
          border-spacing: 0;
        }
        .admin-table th {
          background-color: #fafbfc;
          color: #94a3b8;
          font-size: 9px;
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: 0.15em;
          padding: 12px 24px;
          border-bottom: 1px solid #f1f5f9;
          text-align: left;
        }
        .admin-table td {
          padding: 14px 24px;
          font-size: 13px;
          color: #334155;
          border-bottom: 1px solid #f8fafc;
          transition: all 0.2s;
        }
        .admin-table tr:hover td {
          background-color: #f8fafc;
        }
        .status-badge {
          display: inline-flex;
          align-items: center;
          padding: 2px 8px;
          border-radius: 4px;
          font-size: 9px;
          font-weight: 900;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          border: 1px solid transparent;
        }
        .status-submitted {
          background-color: #f0fdf4;
          color: #166534;
          border-color: #dcfce7;
        }
        .status-not-submitted {
          background-color: #fff1f2;
          color: #9f1239;
          border-color: #ffe4e6;
        }
        .view-link {
          color: #6366f1;
          font-weight: 900;
          font-size: 11px;
          display: inline-flex;
          align-items: center;
          gap: 4px;
          transition: all 0.2s;
        }
        .view-link:hover {
          color: #4338ca;
        }
      `}} />
    </Layout>
  );
}

export default AdminFacultyList;
