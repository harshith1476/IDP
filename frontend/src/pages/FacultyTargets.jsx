import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { facultyService } from '../services/facultyService';
import { authService } from '../services/authService';

function FacultyTargets() {
  const [targets, setTargets] = useState([]);
  const [formData, setFormData] = useState({
    year: new Date().getFullYear(),
    journalTarget: 0,
    conferenceTarget: 0,
    patentTarget: 0,
    bookChapterTarget: 0
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Check if user is authenticated
    if (!authService.isAuthenticated()) {
      console.warn('User not authenticated. Redirecting to login...');
      window.location.href = '/login';
      return;
    }
    loadTargets();
  }, []);

  const loadTargets = async () => {
    try {
      // Check if token exists before making request
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No authentication token found. Please log in again.');
        return;
      }
      
      const response = await facultyService.getTargets();
      setTargets(response.data);
    } catch (error) {
      console.error('Error loading targets:', error);
      console.error('Error details:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        url: error.config?.url
      });
      
      if (error.response?.status === 403) {
        console.error('Access denied (403). Possible causes:');
        console.error('1. Token expired - try logging out and back in');
        console.error('2. User role mismatch - check if user has FACULTY role');
        console.error('3. Token invalid - try refreshing the page');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      // Check if user is authenticated
      const token = localStorage.getItem('token');
      if (!token) {
        setMessage('Error: You are not logged in. Please log in and try again.');
        setLoading(false);
        return;
      }

      // Ensure all values are numbers, not NaN - allow 0 values
      const targetData = {
        year: Number(formData.year) || new Date().getFullYear(),
        journalTarget: Number(formData.journalTarget) || 0,
        conferenceTarget: Number(formData.conferenceTarget) || 0,
        patentTarget: Number(formData.patentTarget) || 0,
        bookChapterTarget: Number(formData.bookChapterTarget) || 0
      };
      
      // Validate year
      if (targetData.year < 2000) {
        setMessage('Error: Year must be 2000 or later.');
        setLoading(false);
        return;
      }
      
      const response = await facultyService.createOrUpdateTarget(targetData);
      setMessage('Target saved successfully!');
      loadTargets();
      setFormData({
        year: new Date().getFullYear(),
        journalTarget: 0,
        conferenceTarget: 0,
        patentTarget: 0,
        bookChapterTarget: 0
      });
    } catch (error) {
      console.error('Error saving target:', error);
      console.error('Full error details:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message,
        config: error.config
      });
      
      // Handle 403 specifically - Authentication/Authorization issue
      if (error.response?.status === 403) {
        const user = authService.getCurrentUser();
        console.error('403 Error - User info:', user);
        console.error('403 Error - Token exists:', !!localStorage.getItem('token'));
        
        setMessage('Error: Access denied. Your session may have expired. Please click "Logout" and log back in, then try again.');
        
        // Don't auto-redirect, let user manually log out
        // This gives them a chance to see the error message
      } else if (error.response?.status === 401) {
        setMessage('Error: Authentication failed. Please log in again.');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setTimeout(() => {
          window.location.href = '/login';
        }, 2000);
      } else if (error.response?.status >= 500) {
        const serverError = error.response?.data || error.message || 'Unknown server error';
        console.error('Server error details:', serverError);
        setMessage(`Error: Server error - ${serverError}. Please check backend logs and try again.`);
      } else {
        const errorMessage = error.response?.data?.message || error.response?.data || error.message || 'Error saving target';
        setMessage(`Error: ${errorMessage}. Please try again.`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout title="Research Targets">
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Set/Update Target</h3>
          
          {message && (
            <div className={`mb-4 p-3 rounded ${message.includes('success') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Year *</label>
              <input
                type="number"
                value={formData.year || ''}
                onChange={(e) => {
                  const value = e.target.value === '' ? new Date().getFullYear() : parseInt(e.target.value) || new Date().getFullYear();
                  setFormData({ ...formData, year: value });
                }}
                required
                min="2000"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Journal Target *</label>
                <input
                  type="number"
                  value={formData.journalTarget ?? ''}
                  onChange={(e) => {
                    const val = e.target.value;
                    const value = val === '' ? 0 : (isNaN(parseInt(val)) ? 0 : parseInt(val));
                    setFormData({ ...formData, journalTarget: value });
                  }}
                  required
                  min="0"
                  step="1"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">Enter 0 if no target for this category</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Conference Target *</label>
                <input
                  type="number"
                  value={formData.conferenceTarget ?? ''}
                  onChange={(e) => {
                    const val = e.target.value;
                    const value = val === '' ? 0 : (isNaN(parseInt(val)) ? 0 : parseInt(val));
                    setFormData({ ...formData, conferenceTarget: value });
                  }}
                  required
                  min="0"
                  step="1"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">Enter 0 if no target for this category</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Patent Target *</label>
                <input
                  type="number"
                  value={formData.patentTarget ?? ''}
                  onChange={(e) => {
                    const val = e.target.value;
                    const value = val === '' ? 0 : (isNaN(parseInt(val)) ? 0 : parseInt(val));
                    setFormData({ ...formData, patentTarget: value });
                  }}
                  required
                  min="0"
                  step="1"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">Enter 0 if no target for this category</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Book Chapter Target *</label>
                <input
                  type="number"
                  value={formData.bookChapterTarget ?? ''}
                  onChange={(e) => {
                    const val = e.target.value;
                    const value = val === '' ? 0 : (isNaN(parseInt(val)) ? 0 : parseInt(val));
                    setFormData({ ...formData, bookChapterTarget: value });
                  }}
                  required
                  min="0"
                  step="1"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">Enter 0 if no target for this category</p>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save Target'}
            </button>
          </form>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Historical Targets</h3>
          {targets.length === 0 ? (
            <p className="text-gray-500">No targets set yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Year</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Journals</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Conferences</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Patents</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Book Chapters</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {targets.map((target) => (
                    <tr key={target.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{target.year}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">{target.journalTarget}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">{target.conferenceTarget}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">{target.patentTarget}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">{target.bookChapterTarget}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}

export default FacultyTargets;

