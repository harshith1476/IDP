import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { facultyService } from '../services/facultyService';
import externalService from '../services/externalService';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

// Same API base URL logic as axios instance, for building image URLs
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ||
  (import.meta.env.DEV ? 'http://localhost:8080/api' : 'https://drims-rnv0.onrender.com/api');

function FacultyProfile() {
  const [profile, setProfile] = useState({
    id: '',
    name: '',
    employeeId: '',
    designation: '',
    department: '',
    researchAreas: [],
    orcidId: '',
    scopusId: '',
    googleScholarLink: '',
    email: '',
    photoPath: '',
    hIndex: 0,
    citationCount: 0,
    semanticScholarId: '',
    googleScholarId: ''
  });
  const [externalAuthors, setExternalAuthors] = useState([]);
  const [showSearch, setShowSearch] = useState(false);
  const [searchSource, setSearchSource] = useState('scholar'); // 'scholar' or 'google'
  const [searchName, setSearchName] = useState('');
  const [researchArea, setResearchArea] = useState('');
  const [metrics, setMetrics] = useState({
    citationsAll: 0,
    citationsSince2021: 0,
    hIndexAll: 0,
    i10IndexAll: 0,
    citationsByYear: {},
    journalRankings: { Q1: 0, Q2: 0, Q3: 0, Q4: 0, NA: 0 }
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadProfile();
    loadMetrics();
  }, []);

  const loadMetrics = async () => {
    try {
      const response = await facultyService.getResearchMetrics();
      setMetrics(response.data);
    } catch (error) {
      console.error('Error loading metrics:', error);
    }
  };

  const loadProfile = async () => {
    try {
      const response = await facultyService.getProfile();
      // Ensure researchAreas and photoPath have sensible defaults
      const data = response.data || {};
      setProfile({
        id: data.id || '',
        name: data.name || '',
        employeeId: data.employeeId || '',
        designation: data.designation || '',
        department: data.department || '',
        researchAreas: data.researchAreas || [],
        orcidId: data.orcidId || '',
        scopusId: data.scopusId || '',
        googleScholarLink: data.googleScholarLink || '',
        email: data.email || '',
        photoPath: data.photoPath || '',
        hIndex: data.hIndex || 0,
        citationCount: data.citationCount || 0,
        semanticScholarId: data.semanticScholarId || '',
        googleScholarId: data.googleScholarId || ''
      });
      setSearchName(data.name || '');
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  };

  const getInitials = (name) => {
    if (!name) return 'FA';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const getPhotoUrl = (photoPath) => {
    if (!photoPath) return null;
    // If it's already a full URL, return it directly
    if (photoPath.startsWith('http://') || photoPath.startsWith('https://')) {
      return photoPath;
    }
    // Otherwise, treat it as a file path and use the download endpoint
    return `${API_BASE_URL}/files/download?path=${encodeURIComponent(photoPath)}`;
  };

  const handlePhotoChange = async (event) => {
    const file = event.target.files && event.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file (JPG or PNG).');
      return;
    }

    if (!profile.id) {
      alert('Profile not loaded yet. Please wait and try again.');
      return;
    }

    try {
      setLoading(true);
      setMessage('');
      const response = await facultyService.uploadProfilePhoto(profile.id, file);
      const photoPath = response.data;

      // Update local state and save to profile DTO
      const updatedProfile = { ...profile, photoPath };
      setProfile(updatedProfile);
      await facultyService.updateProfile(updatedProfile);
      setMessage('Profile photo updated successfully!');
    } catch (error) {
      console.error('Error uploading profile photo:', error);
      setMessage('Error uploading profile photo');
    } finally {
      setLoading(false);
      // Clear file input value so same file can be reselected if needed
      event.target.value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      await facultyService.updateProfile(profile);
      setMessage('Profile updated successfully!');
    } catch (error) {
      setMessage('Error updating profile');
    } finally {
      setLoading(false);
    }
  };

  const addResearchArea = () => {
    if (researchArea.trim()) {
      setProfile({
        ...profile,
        researchAreas: [...profile.researchAreas, researchArea.trim()]
      });
      setResearchArea('');
    }
  };

  const removeResearchArea = (index) => {
    setProfile({
      ...profile,
      researchAreas: profile.researchAreas.filter((_, i) => i !== index)
    });
  };

  const handleSync = async (authorInfo) => {
    setLoading(true);
    setMessage('');
    try {
      const updated = await externalService.syncProfile(authorInfo);
      setProfile({
        ...profile,
        hIndex: updated.hIndex,
        citationCount: updated.citationCount,
        semanticScholarId: updated.semanticScholarId,
        orcidId: updated.orcidId || profile.orcidId
      });
      setMessage('Profile synced successfully with Semantic Scholar!');
      setShowSearch(false);
      loadMetrics(); // Refresh metrics after sync
    } catch (error) {
      console.error('Error syncing profile:', error);
      setMessage('Error syncing with external API');
    } finally {
      setLoading(false);
    }
  };

  const chartData = Object.entries(metrics.citationsByYear || {}).map(([year, count]) => ({
    year,
    citations: count
  }));

  const rankingData = Object.entries(metrics.journalRankings || {}).map(([name, value]) => ({
    name,
    value
  }));

  const rankingColors = {
    Q1: '#4ade80', // Green
    Q2: '#facc15', // Yellow
    Q3: '#fb923c', // Orange
    Q4: '#f87171', // Red
    NA: '#94a3b8'  // Gray
  };

  return (
    <Layout title="My Profile">
      <div className="bg-white rounded-lg shadow p-6">
        {message && (
          <div className={`mb-4 p-3 rounded flex justify-between items-center ${message.includes('success') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
            <span>{message}</span>
            <button onClick={() => setMessage('')} className="text-current opacity-50 hover:opacity-100">×</button>
          </div>
        )}

        {/* Research Analytics Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Cited By Table & Chart */}
          <div className="bg-gray-50 rounded-xl p-6 border border-gray-100 shadow-sm">
            <h3 className="text-xl font-bold text-gray-800 mb-6 border-b pb-2">Cited by</h3>
            <div className="grid grid-cols-2 gap-8 mb-8">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-gray-500 border-b">
                    <th className="text-left py-2 font-medium">Metric</th>
                    <th className="text-right py-2 font-medium px-4">All</th>
                    <th className="text-right py-2 font-medium">Since 2021</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr>
                    <td className="py-3 text-gray-700">Citations</td>
                    <td className="py-3 text-right font-bold text-gray-900 px-4">{metrics.citationsAll}</td>
                    <td className="py-3 text-right font-bold text-gray-900">{metrics.citationsSince2021}</td>
                  </tr>
                  <tr>
                    <td className="py-3 text-gray-700">h-index</td>
                    <td className="py-3 text-right font-bold text-gray-900 px-4">{metrics.hIndexAll}</td>
                    <td className="py-3 text-right font-bold text-gray-900">{metrics.hIndexAll}</td> 
                  </tr>
                  <tr>
                    <td className="py-3 text-gray-700">i10-index</td>
                    <td className="py-3 text-right font-bold text-gray-900 px-4">{metrics.i10IndexAll}</td>
                    <td className="py-3 text-right font-bold text-gray-900">{metrics.i10IndexAll}</td>
                  </tr>
                </tbody>
              </table>

              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                    <XAxis dataKey="year" fontSize={10} tick={{ fill: '#6b7280' }} />
                    <YAxis fontSize={10} tick={{ fill: '#6b7280' }} />
                    <Tooltip 
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                      cursor={{ fill: 'rgba(243, 244, 246, 0.5)' }}
                    />
                    <Bar dataKey="citations" fill="#4b5563" radius={[2, 2, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Journals' Rankings Section */}
          <div className="bg-blue-50/30 rounded-xl p-6 border border-blue-100 shadow-sm relative overflow-hidden">
             <div className="absolute top-0 right-0 p-2 opacity-10">
               <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-2.317 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946 2.317 3.42 3.42 0 012.742 2.742 3.42 3.42 0 002.317 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-2.317 1.946 3.42 3.42 0 01-2.742 2.742 3.42 3.42 0 00-1.946 2.317 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-2.317 3.42 3.42 0 01-2.742-2.742 3.42 3.42 0 00-2.317-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 002.317-1.946 3.42 3.42 0 012.742-2.742z" />
               </svg>
             </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Journals' Rankings</h3>
            <p className="text-xs text-gray-500 mb-6">— based on publications in DRIMS</p>
            
            <div className="flex w-full h-10 rounded-lg overflow-hidden border border-white shadow-sm mb-8">
              {['Q1', 'Q2', 'Q3', 'Q4', 'NA'].map((q) => {
                const count = metrics.journalRankings?.[q] || 0;
                const total = Object.values(metrics.journalRankings || {}).reduce((a, b) => a + b, 0) || 1;
                const percent = (count / total) * 100;
                if (count === 0) return null;
                return (
                  <div 
                    key={q}
                    style={{ width: `${percent}%`, backgroundColor: rankingColors[q] }}
                    className="h-full flex flex-col justify-center px-2 min-w-fit"
                  >
                    <span className="text-[10px] font-bold text-gray-800 leading-none">{q}</span>
                    <span className="text-[10px] text-gray-700 font-medium leading-none">{Math.round(percent)}% <span className="opacity-50">{count}</span></span>
                  </div>
                );
              })}
            </div>

            <div className="grid grid-cols-5 gap-2 text-center">
               {['Q1', 'Q2', 'Q3', 'Q4', 'NA'].map(q => (
                 <div key={q} className="bg-white/50 backdrop-blur-sm rounded p-2 border border-gray-100">
                    <div className="w-2 h-2 rounded-full mx-auto mb-1" style={{ backgroundColor: rankingColors[q] }}></div>
                    <p className="text-[10px] font-bold text-gray-600 uppercase">{q}</p>
                    <p className="text-sm font-bold text-gray-800">{metrics.journalRankings?.[q] || 0}</p>
                 </div>
               ))}
            </div>
          </div>
        </div>

        {/* External Sync Section */}
        <div className="mb-8 p-4 bg-blue-50 rounded-lg border border-blue-100 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="bg-blue-600 text-white p-2 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <h3 className="font-bold text-blue-900">Research Bibliometrics</h3>
              <p className="text-sm text-blue-700">Sync with Semantic Scholar to update your h-index and citations.</p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="text-center px-4 py-1 bg-white rounded border border-blue-200">
              <p className="text-xs text-blue-500 uppercase font-bold">h-Index</p>
              <p className="text-xl font-bold text-blue-900">{profile.hIndex || 0}</p>
            </div>
            <div className="text-center px-4 py-1 bg-white rounded border border-blue-200">
              <p className="text-xs text-blue-500 uppercase font-bold">Citations</p>
              <p className="text-xl font-bold text-blue-900">{profile.citationCount || 0}</p>
            </div>
            <button 
              onClick={() => {
                const scholarUrl = `https://scholar.google.com/scholar?q=${encodeURIComponent(profile.name)}`;
                window.open(scholarUrl, '_blank');
              }}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition shadow-sm font-medium flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              View Google Scholar Profile
            </button>
            <button 
              onClick={() => {
                if (profile.semanticScholarId || profile.googleScholarId) {
                  const authorInfo = {
                    externalId: profile.googleScholarId || profile.semanticScholarId,
                    source: profile.googleScholarId ? 'GoogleScholar' : 'SemanticScholar',
                    hIndex: profile.hIndex,
                    citationCount: profile.citationCount
                  };
                  handleSync(authorInfo);
                } else {
                  setShowSearch(true);
                }
              }}
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-sm font-medium disabled:opacity-50"
            >
              {loading ? 'Syncing...' : (profile.semanticScholarId || profile.googleScholarId) ? 'Sync Updates' : 'Connect Scholar ID'}
            </button>
          </div>
        </div>

        {showSearch && (
          <div className="mb-8 p-6 bg-white border-2 border-blue-200 rounded-lg shadow-inner">
            <div className="flex justify-between items-center mb-4">
              <h4 className="font-bold text-gray-800">Search Research Author</h4>
              <div className="flex bg-gray-100 p-1 rounded-lg">
                <button 
                  onClick={() => setSearchSource('scholar')}
                  className={`px-3 py-1 text-xs rounded-md transition ${searchSource === 'scholar' ? 'bg-white shadow text-blue-600 font-bold' : 'text-gray-500'}`}
                >
                  Semantic Scholar
                </button>
                <button 
                  onClick={() => setSearchSource('google')}
                  className={`px-3 py-1 text-xs rounded-md transition ${searchSource === 'google' ? 'bg-white shadow text-green-600 font-bold' : 'text-gray-500'}`}
                >
                  Google Scholar
                </button>
              </div>
              <button onClick={() => setShowSearch(false)} className="text-gray-400 hover:text-gray-600">×</button>
            </div>
            <div className="flex gap-2 mb-4">
              <input 
                type="text" 
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
                placeholder="Enter author name..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              <button 
                onClick={async () => {
                  setLoading(true);
                  try {
                    const results = searchSource === 'google' 
                      ? await externalService.searchGoogleScholar(searchName)
                      : await externalService.searchAuthors(searchName);
                    setExternalAuthors(results);
                  } catch (e) {
                    setMessage('Error searching authors');
                  } finally {
                    setLoading(false);
                  }
                }}
                className={`px-6 py-2 text-white rounded-lg transition ${searchSource === 'google' ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-800 hover:bg-black'}`}
              >
                Search {searchSource === 'google' ? 'Google' : 'Scholar'}
              </button>
            </div>
            <div className="max-h-60 overflow-y-auto space-y-2">
              {externalAuthors.map((author) => (
                <div key={author.externalId} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                  <div>
                    <p className="font-bold">{author.name}</p>
                    <p className="text-xs text-gray-500">Papers: {author.paperCount} | h-Index: {author.hIndex} | Citations: {author.citationCount}</p>
                  </div>
                  <button 
                    onClick={() => handleSync(author)}
                    className="text-sm px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 font-medium"
                  >
                    Connect & Sync
                  </button>
                </div>
              ))}
              {externalAuthors.length === 0 && !loading && (
                <p className="text-center text-gray-500 py-4">No results found. Search by your research name.</p>
              )}
            </div>
          </div>
        )}

        {/* Profile photo and basic info */}
        <div className="flex items-center gap-6 mb-6">
          <div className="relative">
            {profile.photoPath ? (
              <img
                src={getPhotoUrl(profile.photoPath)}
                alt={profile.name}
                className="w-40 h-40 rounded-full object-cover border-4 border-blue-600 shadow-lg"
              />
            ) : (
              <div className="w-40 h-40 rounded-full bg-blue-600 text-white flex items-center justify-center text-4xl font-bold border-4 border-blue-600 shadow-lg">
                {getInitials(profile.name)}
              </div>
            )}
            <label className="absolute bottom-0 right-0 bg-white border border-gray-300 rounded-full p-2 cursor-pointer shadow-sm hover:bg-gray-50 transition-colors">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 text-gray-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                />
              </svg>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handlePhotoChange}
              />
            </label>
          </div>
          <div>
            <p className="text-lg font-semibold">{profile.name}</p>
            <p className="text-sm text-gray-600">{profile.designation}</p>
            <p className="text-sm text-gray-600">{profile.department}</p>
            <p className="text-sm text-gray-500 mt-1">Employee ID: {profile.employeeId}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Name <span className="text-red-600">*</span></label>
              <input
                type="text"
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Employee ID <span className="text-red-600">*</span></label>
              <input
                type="text"
                value={profile.employeeId}
                onChange={(e) => setProfile({ ...profile, employeeId: e.target.value })}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Designation <span className="text-red-600">*</span></label>
              <input
                type="text"
                value={profile.designation}
                onChange={(e) => setProfile({ ...profile, designation: e.target.value })}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Department <span className="text-red-600">*</span></label>
              <input
                type="text"
                value={profile.department}
                onChange={(e) => setProfile({ ...profile, department: e.target.value })}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                type="email"
                value={profile.email}
                disabled
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">ORCID ID</label>
              <input
                type="text"
                value={profile.orcidId || ''}
                onChange={(e) => setProfile({ ...profile, orcidId: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Scopus ID</label>
              <input
                type="text"
                value={profile.scopusId || ''}
                onChange={(e) => setProfile({ ...profile, scopusId: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Google Scholar Link</label>
              <input
                type="url"
                value={profile.googleScholarLink || ''}
                onChange={(e) => setProfile({ ...profile, googleScholarLink: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Research Areas</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={researchArea}
                onChange={(e) => setResearchArea(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addResearchArea())}
                placeholder="Add research area"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={addResearchArea}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {profile.researchAreas.map((area, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                >
                  {area}
                  <button
                    type="button"
                    onClick={() => removeResearchArea(index)}
                    className="ml-2 text-blue-600 hover:text-blue-800"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Updating...' : 'Update Profile'}
          </button>
        </form>
      </div>
    </Layout>
  );
}

export default FacultyProfile;

