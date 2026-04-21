import { useDeviceDetection } from '../hooks/useDeviceDetection';
import './TableCardView.css';

/**
 * Responsive Table/Card Component
 * Shows table on desktop, cards on mobile
 */
function TableCardView({ 
  data, 
  columns, 
  renderRow, 
  renderCard,
  emptyMessage = 'No data available',
  loading = false 
}) {
  const { isMobile } = useDeviceDetection();

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  if (data.length === 0) {
    return <p className="empty-message">{emptyMessage}</p>;
  }

  // Mobile: Show cards
  if (isMobile) {
    return (
      <div className="card-view-container">
        {data.map((item, index) => (
          <div key={item.id || index} className="data-card">
            {renderCard ? renderCard(item) : <DefaultCard item={item} columns={columns} />}
          </div>
        ))}
      </div>
    );
  }

  // Desktop: Show table
  return (
    <div className="table-view-container">
      <div className="overflow-x-auto">
        <table className="responsive-table">
          <thead>
            <tr>
              {columns.map((col) => (
                <th key={col.key || col.label}>{col.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={item.id || index}>
                {renderRow(item)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/**
 * Default card renderer
 */
function DefaultCard({ item, columns }) {
  return (
    <div className="default-card-content">
      {columns.map((col) => {
        const value = item[col.key] || 'N/A';
        return (
          <div key={col.key} className="card-field">
            <span className="card-label">{col.label}:</span>
            <span className="card-value">{value}</span>
          </div>
        );
      })}
    </div>
  );
}

export default TableCardView;
