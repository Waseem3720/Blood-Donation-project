import { useState, useEffect } from 'react';
import api from '../../services/api';
import '../../assets/adminTables.css';

const ViewDonors = () => {
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [bloodGroup, setBloodGroup] = useState('');
  const [location, setLocation] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalDonors, setTotalDonors] = useState(0);

  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  const fetchDonors = async (pageNum = 1) => {
    try {
      setLoading(true);
      setError('');
      
      const params = new URLSearchParams();
      params.append('page', pageNum);
      params.append('limit', 10);
      if (bloodGroup) params.append('bloodGroup', bloodGroup);
      if (location) params.append('location', location);

      const response = await api.get(`/admin/donors?${params.toString()}`);
      
      setDonors(response.data?.data || []);
      setTotalPages(response.data?.totalPages || 1);
      setTotalDonors(response.data?.totalDonors || 0);
      setPage(pageNum);
    } catch (err) {
      console.error('Fetch error:', err);
      setError(err.response?.data?.message || err.message || 'Failed to fetch donors');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setPage(1);
    fetchDonors(1);
  }, [bloodGroup, location]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchDonors(1);
  };

  const handleClearFilters = () => {
    setBloodGroup('');
    setLocation('');
    setPage(1);
    fetchDonors(1);
  };

  const handleNextPage = () => {
    if (page < totalPages) {
      fetchDonors(page + 1);
    }
  };

  const handlePrevPage = () => {
    if (page > 1) {
      fetchDonors(page - 1);
    }
  };

  return (
    <div className="view-section">
      <div className="search-filters">
        <h3>Search Donors</h3>
        <form onSubmit={handleSearch} className="filter-form">
          <div className="filter-group">
            <label htmlFor="bloodGroup">Blood Group:</label>
            <select
              id="bloodGroup"
              value={bloodGroup}
              onChange={(e) => setBloodGroup(e.target.value)}
            >
              <option value="">All Blood Groups</option>
              {bloodGroups.map(bg => (
                <option key={bg} value={bg}>{bg}</option>
              ))}
            </select>
          </div>

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
          <p>Loading donors...</p>
        ) : donors.length === 0 ? (
          <p>No donors found.</p>
        ) : (
          <>
            <div className="donor-count">Total Donors: {totalDonors}</div>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Blood Group</th>
                  <th>Location</th>
                  <th>Age</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {donors.map(donor => (
                  <tr key={donor._id}>
                    <td>{donor.fullName}</td>
                    <td>{donor.email}</td>
                    <td>{donor.phoneNumber}</td>
                    <td className="blood-group-badge">{donor.bloodGroup}</td>
                    <td>{donor.location}</td>
                    <td>{donor.age}</td>
                    <td>
                      <span className={`status-badge ${donor.isAvailable ? 'available' : 'unavailable'}`}>
                        {donor.isAvailable ? 'Available' : 'Unavailable'}
                      </span>
                    </td>
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

export default ViewDonors;
