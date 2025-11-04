import React, { useState } from 'react';
import './AdminLogin.css';

const AdminLogin = ({ onLogin }) => {
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Simple authentication - you can make this more secure later
    const adminUsername = process.env.REACT_APP_ADMIN_USERNAME || 'admin';
    const adminPassword = process.env.REACT_APP_ADMIN_PASSWORD || 'password123';

    if (credentials.username === adminUsername && credentials.password === adminPassword) {
      localStorage.setItem('adminAuthenticated', 'true');
      onLogin(true);
    } else {
      setError('Invalid credentials');
    }
  };

  return (
    <div className="admin-login">
      <div className="login-container">
        <div className="login-form">
          <h2>Admin Login</h2>
          <p>Enter your credentials to access the dashboard</p>
          
          {error && <div className="error-message">{error}</div>}
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                name="username"
                value={credentials.username}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={credentials.password}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <button type="submit" className="login-btn">
              Sign In
            </button>
          </form>
          
          <div className="login-info">
            <p><strong>Default Credentials:</strong></p>
            <p>Username: admin</p>
            <p>Password: password123</p>
            <p className="note">Change these in your environment variables for production</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;