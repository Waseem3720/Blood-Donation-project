import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BloodGroupSelect from '../components/BloodGroupSelect';
import api from '../services/api';
import '../assets/forms.css';

export default function RequestBlood() {
  const [bloodGroup, setBloodGroup] = useState('');
  const [note, setNote] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/seeker/requests', { bloodGroup, note });
      navigate('/seeker');
    } catch (err) {
      alert(err.response?.data?.message || 'Request failed');
    }
  };

  return (
    <div className="form-container">
      <h2>Request Blood</h2>
      <form onSubmit={handleSubmit}>
        <BloodGroupSelect 
          value={bloodGroup}
          onChange={setBloodGroup}
        />
        <textarea
          placeholder="Additional notes (optional)"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
        <button type="submit">Submit Request</button>
      </form>
    </div>
  );
}