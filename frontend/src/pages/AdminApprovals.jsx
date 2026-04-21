import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { adminService } from '../services/adminService';
import { useDeviceDetection } from '../hooks/useDeviceDetection';

function AdminApprovals() {
  const { isMobile } = useDeviceDetection();
  const [pendingApprovals, setPendingApprovals] = useState([]);
  const [filterType, setFilterType] = useState('ALL'); // ALL, JOURNAL, CONFERENCE, BOOK, BOOK_CHAPTER, PATENT
  const [loading, setLoading] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [action, setAction] = useState(''); // APPROVE, REJECT, SEND_BACK
  const [remarks, setRemarks] = useState('');
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [detailsItem, setDetailsItem] = useState(null);

  useEffect(() => {
    loadPendingApprovals();
  }, [filterType]);

  const loadPendingApprovals = async () => {
    try {
      const type = filterType === 'ALL' ? null : filterType.toLowerCase();
      const response = await adminService.getPendingApprovals(type);
      const approvals = response.data || [];
      // Debug: Log file paths for each approval
      approvals.forEach(approval => {
        console.log(`Approval ${approval.id} (${approval.publicationType}):`, {
          title: approval.title,
          filePaths: approval.filePaths,
          hasFiles: approval.filePaths && Object.keys(approval.filePaths).length > 0
        });
      });
      setPendingApprovals(approvals);
    } catch (error) {
      console.error('Error loading pending approvals:', error);
    }
  };

  const handleApprovalAction = async (publicationType, publicationId, actionType) => {
    setLoading(true);
    try {
      switch (actionType) {
        case 'APPROVE':
          await adminService.approvePublication(publicationType, publicationId);
          break;
        case 'REJECT':
          // Use remarks if provided, otherwise use default
          const rejectionRemarks = remarks.trim() || 'Rejected by admin';
          await adminService.rejectPublication(publicationType, publicationId, rejectionRemarks);
          break;
        case 'SEND_BACK':
          const sendBackRemarks = remarks.trim() || 'Sent back for revision';
          await adminService.sendBackPublication(publicationType, publicationId, sendBackRemarks);
          break;
        case 'LOCK':
          await adminService.lockPublication(publicationType, publicationId);
          break;
      }
      setSelectedItem(null);
      setAction('');
      setRemarks('');
      loadPendingApprovals();
    } catch (error) {
      console.error('Error processing approval:', error);
      // Silently handle errors - just reload to refresh the list
      loadPendingApprovals();
    } finally {
      setLoading(false);
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

  const handleViewFile = async (filePath) => {
    if (!filePath) return;

    try {
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ||
        (import.meta.env.DEV ? 'http://localhost:8080/api' : 'https://drims-rnv0.onrender.com/api');
      const token = localStorage.getItem('token');

      // Fetch file with authentication
      const response = await fetch(`${API_BASE_URL}/files/download?path=${encodeURIComponent(filePath)}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to load file');
      }

      // Create blob and open in new tab
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      window.open(blobUrl, '_blank');

      // Clean up blob URL after a delay
      setTimeout(() => window.URL.revokeObjectURL(blobUrl), 100);
    } catch (error) {
      console.error('Error viewing file:', error);
      alert('Failed to view file. Please try again.');
    }
  };


  return (
    <Layout title="Approval Management">
      <div className="space-y-6">
        {/* Filter */}
        <div className="bg-white rounded-lg shadow p-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Type</label>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="w-full md:w-auto px-4 py-2 border border-gray-300 rounded-lg"
          >
            <option value="ALL">All Types</option>
            <option value="JOURNAL">Journals</option>
            <option value="CONFERENCE">Conferences</option>
            <option value="BOOK">Books</option>
            <option value="BOOK_CHAPTER">Book Chapters</option>
            <option value="PATENT">Patents</option>
            <option value="PROJECT">Projects</option>
          </select>
        </div>

        {/* Pending Approvals Table */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4">Pending Approvals</h3>
            {pendingApprovals.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No pending approvals found.</p>
            ) : isMobile ? (
              // Mobile Card View
              <div className="mobile-card-view">
                {pendingApprovals.map((item) => (
                  <div key={item.id} className="data-card">
                    <div className="data-card-header">
                      <div className="data-card-title">{item.title}</div>
                      <div className="data-card-status">
                        {getStatusBadge(item.approvalStatus)}
                      </div>
                    </div>
                    <div className="data-card-body">
                      <div className="data-card-field">
                        <div className="data-card-label">Type</div>
                        <div className="data-card-value">{item.publicationType}</div>
                      </div>
                      <div className="data-card-field">
                        <div className="data-card-label">Faculty</div>
                        <div className="data-card-value">{item.facultyName || 'N/A'}</div>
                      </div>
                      <div className="data-card-field">
                        <div className="data-card-label">Student</div>
                        <div className="data-card-value">{item.studentName || 'N/A'}</div>
                      </div>
                      <div className="data-card-field">
                        <div className="data-card-label">Submitted</div>
                        <div className="data-card-value">
                          {item.submittedAt ? new Date(item.submittedAt).toLocaleDateString() : 'N/A'}
                        </div>
                      </div>
                    </div>
                    <div className="data-card-actions">
                      <button
                        onClick={() => {
                          setDetailsItem(item);
                          setShowDetailsModal(true);
                        }}
                        className="bg-blue-600 text-white"
                      >
                        View Details
                      </button>
                      <button
                        onClick={() => handleApprovalAction(item.publicationType, item.id, 'APPROVE')}
                        disabled={loading}
                        className="bg-green-600 text-white"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => {
                          setSelectedItem(item);
                          setAction('REJECT');
                          setRemarks('');
                        }}
                        className="bg-red-600 text-white"
                      >
                        Reject
                      </button>
                      <button
                        onClick={() => {
                          setSelectedItem(item);
                          setAction('SEND_BACK');
                          setRemarks('');
                        }}
                        className="bg-orange-600 text-white"
                      >
                        Send Back
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              // Desktop Table View
              <div className="overflow-x-auto table-container">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Faculty</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Student</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Submitted</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {pendingApprovals.map((item) => (
                      <tr key={item.id}>
                        <td className="px-6 py-4 text-sm font-medium">{item.publicationType}</td>
                        <td className="px-6 py-4 text-sm">{item.title}</td>
                        <td className="px-6 py-4 text-sm">{item.facultyName || 'N/A'}</td>
                        <td className="px-6 py-4 text-sm">{item.studentName || 'N/A'}</td>
                        <td className="px-6 py-4 text-sm">{getStatusBadge(item.approvalStatus)}</td>
                        <td className="px-6 py-4 text-sm">
                          {item.submittedAt ? new Date(item.submittedAt).toLocaleDateString() : 'N/A'}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <div className="flex gap-2 flex-wrap">
                            <button
                              onClick={() => {
                                setDetailsItem(item);
                                setShowDetailsModal(true);
                              }}
                              className="bg-blue-600 text-white px-3 py-1 rounded text-xs hover:bg-blue-700"
                              title="View all publication details and files"
                            >
                              View Details
                            </button>
                            <button
                              onClick={() => handleApprovalAction(item.publicationType, item.id, 'APPROVE')}
                              disabled={loading}
                              className="bg-green-600 text-white px-3 py-1 rounded text-xs hover:bg-green-700 disabled:opacity-50"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => {
                                setSelectedItem(item);
                                setAction('REJECT');
                                setRemarks('');
                              }}
                              className="bg-red-600 text-white px-3 py-1 rounded text-xs hover:bg-red-700"
                            >
                              Reject
                            </button>
                            <button
                              onClick={() => {
                                setSelectedItem(item);
                                setAction('SEND_BACK');
                                setRemarks('');
                              }}
                              className="bg-orange-600 text-white px-3 py-1 rounded text-xs hover:bg-orange-700"
                            >
                              Send Back
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Publication Details Modal */}
        {showDetailsModal && detailsItem && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold">Publication Details</h3>
                <button
                  onClick={() => {
                    setShowDetailsModal(false);
                    setDetailsItem(null);
                  }}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>

              <div className="space-y-4">
                {/* Basic Information */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-lg mb-3">Basic Information</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-sm font-medium text-gray-600">Type:</span>
                      <p className="text-sm">{detailsItem.publicationType}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-600">Title:</span>
                      <p className="text-sm">{detailsItem.title}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-600">Faculty:</span>
                      <p className="text-sm">{detailsItem.facultyName || 'N/A'}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-600">Student:</span>
                      <p className="text-sm">{detailsItem.studentName || 'N/A'}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-600">Status:</span>
                      <p className="text-sm">{getStatusBadge(detailsItem.approvalStatus)}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-600">Submitted:</span>
                      <p className="text-sm">
                        {detailsItem.submittedAt ? new Date(detailsItem.submittedAt).toLocaleString() : 'N/A'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Publication Details */}
                {detailsItem.publicationDetails && Object.keys(detailsItem.publicationDetails).length > 0 && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-lg mb-3">Publication Details</h4>
                    <div className="grid grid-cols-2 gap-4">
                      {Object.entries(detailsItem.publicationDetails).map(([key, value]) => {
                        if (value === null || value === undefined || value === '') return null;
                        const displayKey = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
                        return (
                          <div key={key}>
                            <span className="text-sm font-medium text-gray-600">{displayKey}:</span>
                            <p className="text-sm">{Array.isArray(value) ? value.join(', ') : String(value)}</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Uploaded Files */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-lg mb-3">Uploaded Files</h4>
                  {detailsItem.filePaths && Object.keys(detailsItem.filePaths).length > 0 ? (
                    <div className="space-y-2">
                      {Object.entries(detailsItem.filePaths).map(([fileLabel, filePath]) => (
                        <div key={filePath} className="flex items-center justify-between bg-white p-3 rounded border">
                          <span className="text-sm font-medium">{fileLabel}</span>
                          <button
                            onClick={() => handleViewFile(filePath)}
                            className="bg-blue-600 text-white px-3 py-1 rounded text-xs hover:bg-blue-700"
                          >
                            View File
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">No files uploaded for this publication.</p>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 mt-6 pt-4 border-t">
                <button
                  onClick={() => handleApprovalAction(detailsItem.publicationType, detailsItem.id, 'APPROVE')}
                  disabled={loading}
                  className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 disabled:opacity-50"
                >
                  {loading ? 'Processing...' : 'Approve'}
                </button>
                <button
                  onClick={() => {
                    setShowDetailsModal(false);
                    setSelectedItem(detailsItem);
                    setAction('REJECT');
                    setRemarks('');
                  }}
                  className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700"
                >
                  Reject
                </button>
                <button
                  onClick={() => {
                    setShowDetailsModal(false);
                    setSelectedItem(detailsItem);
                    setAction('SEND_BACK');
                    setRemarks('');
                  }}
                  className="flex-1 bg-orange-600 text-white py-2 px-4 rounded-lg hover:bg-orange-700"
                >
                  Send Back
                </button>
                <button
                  onClick={() => {
                    setShowDetailsModal(false);
                    setDetailsItem(null);
                  }}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Action Modal */}
        {selectedItem && action && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <h3 className="text-lg font-semibold mb-4">
                {action === 'REJECT' ? 'Reject Publication' : 'Send Back Publication'}
              </h3>
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2">
                  <strong>Type:</strong> {selectedItem.publicationType}
                </p>
                <p className="text-sm text-gray-600 mb-2">
                  <strong>Title:</strong> {selectedItem.title}
                </p>
                {action === 'REJECT' && (
                  <p className="text-sm text-red-600 font-medium mb-2">
                    Remarks are mandatory for rejection.
                  </p>
                )}
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Remarks {action === 'REJECT' && <span className="text-red-600">*</span>}
                </label>
                <textarea
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  required={action === 'REJECT'}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  placeholder={action === 'REJECT' ? 'Please provide a reason for rejection...' : 'Optional remarks...'}
                />
              </div>
              <div className="flex gap-4">
                <button
                  onClick={() => handleApprovalAction(selectedItem.publicationType, selectedItem.id, action)}
                  disabled={loading || (action === 'REJECT' && !remarks.trim())}
                  className={`flex-1 py-2 px-4 rounded-lg text-white ${action === 'REJECT' ? 'bg-red-600 hover:bg-red-700' : 'bg-orange-600 hover:bg-orange-700'
                    } disabled:opacity-50`}
                >
                  {loading ? 'Processing...' : action === 'REJECT' ? 'Confirm Reject' : 'Send Back'}
                </button>
                <button
                  onClick={() => {
                    setSelectedItem(null);
                    setAction('');
                    setRemarks('');
                  }}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}

export default AdminApprovals;
