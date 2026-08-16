import { useState, useEffect } from 'react';
import api from '../../services/api';
import '../../assets/adminTables.css';

const ViewSeekers = () => {
  const [seekers, setSeekers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [location, setLocation] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalSeekers, setTotalSeekers] = useState(0);

  const fetchSeekers = async (pageNum = 1) => {
    try {
      setLoading(true);
      setError('');
      
      const params = new URLSearchParams();
      params.append('page', pageNum);
      params.append('limit', 10);
      if (location) params.append('location', location);

      const response = await api.get(`/admin/seekers?${params.toString()}`);
      
      setSeekers(response.data?.data || []);
      setTotalPages(response.data?.totalPages || 1);
      setTotalSeekers(response.data?.totalSeekers || 0);
      setPage(pageNum);
    } catch (err) {
      console.error('Fetch error:', err);
      setError(err.response?.data?.message || err.message || 'Failed to fetch seekers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setPage(1);
    fetchSeekers(1);
  }, [location]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchSeekers(1);
  };

  const handleClearFilters = () => {
    setLocation('');
    setPage(1);
    fetchSeekers(1);
  };

  const handleNextPage = () => {
    if (page < totalPages) {
      fetchSeekers(page + 1);
    }
  };

  const handlePrevPage = () => {
    if (page > 1) {
      fetchSeekers(page - 1);
    }
  };

  return (
    <div className="view-section">
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
          <p>Loading seekers...</p>
        ) : seekers.length === 0 ? (
          <p>No seekers found.</p>
        ) : (
          <>
            <div className="seeker-count">Total Seekers: {totalSeekers}</div>
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

            <div className="pagination">
              <button 
                onClick={handlePrevPage} 
                disabled={page === 1}
                className="pagination-btn"
              >
                Previous
              </button>
              <span className="page-info">Page {page} of {totalPages}</span>
              <button 
                onClick={handleNextPage} 
                disabled={page === totalPages}
                className="pagination-btn"
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ViewSeekers;
