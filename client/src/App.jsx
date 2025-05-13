import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import DonorDashboard from './pages/DonorDashboard';
import SeekerDashboard from './pages/SeekerDashboard';
import CompleteRegistration from './pages/CompleteRegistration';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ConnectionStatus from './components/ConnectionStatus';
import './App.css';

const App = () => {
  return (
    <BrowserRouter>
      <div className="app-container">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/donor" element={<DonorDashboard />} />
            <Route path="/seeker" element={<SeekerDashboard />} />
            <Route path="/complete-registration" element={<CompleteRegistration />} />
          </Routes>
        </main>
        <Footer />
        <ConnectionStatus />
      </div>
    </BrowserRouter>
  );
};

export default App;