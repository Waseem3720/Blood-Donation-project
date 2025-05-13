import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode'; // Updated import
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import '../assets/googleAuth.css';
import { useState } from 'react'; // Added for error state

const GoogleAuth = ({ role }) => {
  const navigate = useNavigate();
  const [error, setError] = useState(null); // Error state

  const handleSuccess = async (credentialResponse) => {
    try {
      setError(null); // Reset error on new attempt
      
      if (!credentialResponse?.credential) {
        throw new Error('No credential received from Google');
      }

      const decoded = jwtDecode(credentialResponse.credential); // Updated usage
      
      const { data } = await api.post('/auth/google', { 
        token: credentialResponse.credential,
        role 
      });
      
      if (!data) {
        throw new Error('No response from server');
      }

      if (data.needsAdditionalInfo) {
        navigate('/complete-registration', { 
          state: { 
            googleData: decoded,
            role,
            email: decoded.email // Ensure email is passed
          } 
        });
      } else {
        if (!data.token || !data.user) {
          throw new Error('Authentication data incomplete');
        }
        
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        navigate(`/${data.user.role}`, { replace: true });
      }
    } catch (error) {
      console.error('Google Auth Error:', error);
      setError(error.message || 'Authentication failed. Please try again.');
    }
  };

  const handleError = () => {
    setError('Google login failed. Please try again or use another method.');
    console.log('Google Login Failed');
  };

  return (
    <div className="google-auth-container">
      <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
        <GoogleLogin
          onSuccess={handleSuccess}
          onError={handleError}
          useOneTap
          text="continue_with"
          size="medium"
          width="300"
        />
        {error && (
          <div className="auth-error">
            {error}
          </div>
        )}
      </GoogleOAuthProvider>
    </div>
  );
};

export default GoogleAuth;