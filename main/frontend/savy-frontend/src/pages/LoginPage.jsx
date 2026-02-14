import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const navigate = useNavigate();
  const [userType, setUserType] = useState('patient');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Mock user credentials
  const mockUsers = {
    patient: {
      email: 'rahul.sharma@example.com',
      password: 'password123',
      name: 'Rahul Sharma',
      id: 'USR-2024-001'
    },
    doctor: {
      email: 'dr.aris.thorne@example.com',
      password: 'doctor123',
      name: 'Dr. Aris Thorne',
      id: 'DOC-001'
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Simulate API call
    setTimeout(() => {
      const expectedUser = mockUsers[userType];
      if (email === expectedUser.email && password === expectedUser.password) {
        // Login successful
        localStorage.setItem('userType', userType);
        localStorage.setItem('userName', expectedUser.name);
        localStorage.setItem('userId', expectedUser.id);
        
        // Reload the page to ensure the login state is properly detected
        window.location.href = '/dashboard';
      } else {
        // Login failed
        setError('Invalid email or password');
      }
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 4.5a2.5 2.5 0 0 0-4.96-.46 2.5 2.5 0 0 0-1.98 3 2.5 2.5 0 0 0 1.32 4.24 3 3 0 0 0 .34 5.58 2.5 2.5 0 0 0 5.28.55" />
              <path d="M12 4.5a2.5 2.5 0 0 1 4.96-.46 2.5 2.5 0 0 1 1.98 3 2.5 2.5 0 0 1-1.32 4.24 3 3 0 0 1-.34 5.58 2.5 2.5 0 0 1-5.28.55" />
              <path d="M12 4.5v16" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">NEUROVAULT</h1>
          <p className="text-gray-600">Neural Data Steward</p>
        </div>

        {/* User Type Selection */}
        <div className="flex bg-gray-100 rounded-xl p-1 mb-6">
          <button
            onClick={() => setUserType('patient')}
            className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-all ${
              userType === 'patient'
                ? 'bg-white text-cyan-600 shadow-md'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Patient Login
          </button>
          <button
            onClick={() => setUserType('doctor')}
            className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-all ${
              userType === 'doctor'
                ? 'bg-white text-cyan-600 shadow-md'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Doctor Login
          </button>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={userType === 'patient' ? 'patient@example.com' : 'doctor@example.com'}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-colors"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-colors"
              required
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 px-4 rounded-lg text-white font-medium transition-all ${
              isLoading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-cyan-600 hover:bg-cyan-700'
            }`}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Logging in...
              </div>
            ) : (
              `Sign In as ${userType === 'patient' ? 'Patient' : 'Doctor'}`
            )}
          </button>
        </form>

        {/* Demo Credentials */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <p className="text-sm font-medium text-gray-700 mb-2">Demo Credentials:</p>
          {userType === 'patient' ? (
            <div className="space-y-1 text-xs text-gray-600">
              <p>Email: rahul.sharma@example.com</p>
              <p>Password: password123</p>
            </div>
          ) : (
            <div className="space-y-1 text-xs text-gray-600">
              <p>Email: dr.aris.thorne@example.com</p>
              <p>Password: doctor123</p>
            </div>
          )}
        </div>

        {/* Forgot Password */}
        <div className="mt-6 text-center">
          <a href="#" className="text-sm text-cyan-600 hover:text-cyan-800 transition-colors">
            Forgot Password?
          </a>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;