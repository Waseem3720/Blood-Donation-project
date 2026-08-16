import { useState, useEffect } from 'react';
import api from '../../services/api';
import '../../assets/adminTables.css';

const ViewDonors = () => {
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [bloodGroup, setBloodGroup] = useState('');
  const [location, setLocation] = useState('');
  const [totalDonors, setTotalDonors] = useState(0);

  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  const fetchDonors = async () => {
    try {
      setLoading(true);
      setError('');
      
      const params = new URLSearchParams();
      if (bloodGroup) params.append('bloodGroup', bloodGroup);
      if (location) params.append('location', location);

      const response = await api.get(`/admin/donors?${params.toString()}`);
      
      setDonors(response.data?.data || []);
      setTotalDonors(response.data?.totalDonors || (response.data?.data || []).length);
    } catch (err) {
      console.error('Fetch error:', err);
      setError(err.response?.data?.message || err.message || 'Failed to fetch donors');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDonors();
  }, [bloodGroup, location]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchDonors();
  };

  const handleClearFilters = () => {
    setBloodGroup('');
    setLocation('');
  };

  return (
    <div className="view-section">
      <h2>Registered Donors</h2>
      <div className="total-count-badge">Total Registered Donors: {totalDonors}</div>

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
          <p style={{ padding: '1.5rem', color: '#666' }}>Loading donors...</p>
        ) : donors.length === 0 ? (
          <p style={{ padding: '1.5rem', color: '#666' }}>No donors found.</p>
        ) : (
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
                  <td><span className="role-badge donor">{donor.bloodGroup}</span></td>
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
        )}
      </div>
    </div>
  );
};

export default ViewDonors;
