import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ allowedRole, children }) => {
  const token = localStorage.getItem('token');
  const userStr = localStorage.getItem('user');

  // If user is unauthenticated, redirect to login
  if (!token || !userStr) {
    return <Navigate to="/login" replace />;
  }

  try {
    const user = JSON.parse(userStr);
    if (!user || !user.role) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      return <Navigate to="/login" replace />;
    }

    const userRole = String(user.role).toLowerCase();
    const requiredRole = String(allowedRole).toLowerCase();

    // If user's stored role doesn't match the required role, redirect to their own dashboard
    if (userRole !== requiredRole) {
      return <Navigate to={`/${userRole}`} replace />;
    }

    return children;
  } catch (err) {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return <Navigate to="/login" replace />;
  }
};

export default ProtectedRoute;
