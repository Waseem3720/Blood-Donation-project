import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import DonorDashboard from './pages/DonorDashboard';
import SeekerDashboard from './pages/SeekerDashboard';
import CompleteRegistration from './pages/CompleteRegistration';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import './App.css';

const AppContent = () => {
  const location = useLocation();
  
  // Show Navbar only on public pages (Home, Login, Register)
  const publicPages = ['/', '/login', '/register'];
  const showNavbar = publicPages.includes(location.pathname);

  return (
    <div className="app-container">
      {showNavbar && <Navbar />}
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute allowedRole="admin">
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/donor" 
            element={
              <ProtectedRoute allowedRole="donor">
                <DonorDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/seeker" 
            element={
              <ProtectedRoute allowedRole="seeker">
                <SeekerDashboard />
              </ProtectedRoute>
            } 
          />
          <Route path="/complete-registration" element={<CompleteRegistration />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
};

export default App;