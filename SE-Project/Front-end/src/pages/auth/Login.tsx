

// filepath: c:\Users\Lenovo\Downloads\thesis-trek-main\doctoral_student_portal\src\pages\auth\Login.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'sonner';
import { auth, googleProvider } from '../../firebaseConfig';
import { signInWithPopup } from 'firebase/auth';

type UserRole = 'student' | 'supervisor' | 'coordinator';

const Login = () => {
  const [selectedRole, setSelectedRole] = useState<UserRole>('student');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      setIsLoading(true);
  
      // Store selected role in a temporary cookie
      document.cookie = `requestedRole=${selectedRole}; path=/`; 
  
      // Redirect to backend OAuth URL
      const oauthUrl = `http://localhost:8080/oauth2/authorization/google`;
      window.location.href = oauthUrl;
  
    } catch (error) {
      toast.error('Google login failed. Please try again.');
      console.error('Google login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

 

  return (
    <div className="min-h-screen flex items-center justify-center bg-portal-gray">
      <div className="w-full max-w-md">
        <div className="portal-glass p-8 rounded-xl shadow-xl">
          <h1 className="text-2xl font-bold text-center mb-8">DOCTORAL RESEARCH PORTAL</h1>
          
          <div className="mb-6">
            <label className="block text-center text-gray-700 mb-4">Role</label>
            <div className="bg-white rounded-full p-1 flex shadow-sm">
              {['student', 'supervisor', 'coordinator'].map((role) => (
                <button
                  key={role}
                  className={`flex-1 py-2 px-4 rounded-full text-sm font-medium transition-all duration-200 ${
                    selectedRole === role
                      ? 'bg-portal-blue text-white shadow-sm'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                  onClick={() => setSelectedRole(role as UserRole)}
                >
                  {role === 'coordinator' ? 'PhD Coordinator' : role.charAt(0).toUpperCase() + role.slice(1)}
                </button>
              ))}
            </div>
          </div>
          
          <button
            onClick={handleLogin}
            disabled={isLoading}
            className="w-full flex items-center justify-center space-x-2 bg-white border border-gray-300 rounded-full py-2 px-4 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-portal-blue mt-6 transition-all duration-200"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 48 48"
              width="24px"
              height="24px"
            >
              <path
                fill="#FFC107"
                d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
              />
              <path
                fill="#FF3D00"
                d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
              />
              <path
                fill="#4CAF50"
                d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
              />
              <path
                fill="#1976D2"
                d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
              />
            </svg>
            <span>Sign in with Google</span>
          </button>
          
          {isLoading && (
            <div className="text-center mt-4 text-sm text-gray-500">
              Logging in...
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
