import { useState, useEffect } from 'react';
import api from '../../services/api';
import '../../assets/adminTables.css';

const ViewSeekers = () => {
  const [seekers, setSeekers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [location, setLocation] = useState('');
  const [totalSeekers, setTotalSeekers] = useState(0);

  const fetchSeekers = async () => {
    try {
      setLoading(true);
      setError('');
      
      const params = new URLSearchParams();
      if (location) params.append('location', location);

      const response = await api.get(`/admin/seekers?${params.toString()}`);
      
      setSeekers(response.data?.data || []);
      setTotalSeekers(response.data?.totalSeekers || (response.data?.data || []).length);
    } catch (err) {
      console.error('Fetch error:', err);
      setError(err.response?.data?.message || err.message || 'Failed to fetch seekers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSeekers();
  }, [location]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchSeekers();
  };

  const handleClearFilters = () => {
    setLocation('');
  };

  return (
    <div className="view-section">
      <h2>Registered Seekers</h2>
      <div className="total-count-badge">Total Registered Seekers: {totalSeekers}</div>

      <div className="search-filters">
        <h3>Search Seekers</h3>
        <form onSubmit={handleSearch} className="filter-form">
          <div className="filter-group">
            <label htmlFor="location">Location:</label>
            <input
              id="location"
              type="text"
              placeholder="Enter location..."
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>

          <div className="filter-buttons">
            <button type="submit" className="btn-search">Search</button>
            <button type="button" className="btn-clear" onClick={handleClearFilters}>
              Clear Filters
            </button>
          </div>
        </form>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="table-container">
        {loading ? (
          <p style={{ padding: '1.5rem', color: '#666' }}>Loading seekers...</p>
        ) : seekers.length === 0 ? (
          <p style={{ padding: '1.5rem', color: '#666' }}>No seekers found.</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Location</th>
                <th>Joined Date</th>
              </tr>
            </thead>
            <tbody>
              {seekers.map(seeker => (
                <tr key={seeker._id}>
                  <td>{seeker.fullName}</td>
                  <td>{seeker.email}</td>
                  <td>{seeker.phoneNumber}</td>
                  <td>{seeker.location}</td>
                  <td>{new Date(seeker.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default ViewSeekers;
