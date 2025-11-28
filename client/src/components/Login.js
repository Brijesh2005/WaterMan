import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Login = ({ onSwitchToSignUp, onLoginSuccess }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'user'
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check if user is already logged in
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleRoleToggle = () => {
    setFormData({
      ...formData,
      role: formData.role === 'user' ? 'admin' : 'user'
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email) {
      setMessage('Email is required');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const response = await axios.post('http://localhost:5000/api/users/login', {
        email: formData.email,
        password: formData.password,
        role: formData.role
      });

      setUser(response.data.user);
      setMessage(`Welcome ${response.data.user.name}!`);

      // Store user in localStorage for persistence
      localStorage.setItem('user', JSON.stringify(response.data.user));

      // Notify parent component of successful login
      if (onLoginSuccess) {
        onLoginSuccess(response.data.user);
      }

    } catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
        setMessage(error.response.data.error);
      } else {
        setMessage('Login failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setUser(null);
    setMessage('');
    localStorage.removeItem('user');
  };

  if (user) {
    return (
      <div className="container mt-4">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="card">
              <div className="card-header bg-success text-white">
                <h4>Logged In</h4>
              </div>
              <div className="card-body text-center">
                <h5>Welcome, {user.name}!</h5>
                <p>Email: {user.email}</p>
                <p>Role: <span className={`badge ${user.role === 'admin' ? 'bg-danger' : 'bg-primary'}`}>{user.role}</span></p>
                <button className="btn btn-outline-danger" onClick={handleLogout}>
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              <h4>Login</h4>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Enter your email"
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Password</label>
                  <input
                    type="password"
                    className="form-control"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Enter your password"
                  />
                </div>
                <div className="mb-3">
                  <div className="form-check form-switch">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="roleToggle"
                      checked={formData.role === 'admin'}
                      onChange={handleRoleToggle}
                    />
                    <label className="form-check-label" htmlFor="roleToggle">
                      Login as Admin
                    </label>
                  </div>
                  <small className="text-muted">
                    Current role: <strong>{formData.role}</strong>
                  </small>
                </div>
                <button type="submit" className="btn btn-primary w-100" disabled={loading}>
                  {loading ? 'Logging in...' : 'Login'}
                </button>
              </form>
              {message && (
                <div className={`alert mt-3 ${message.includes('Welcome') ? 'alert-success' : 'alert-danger'}`}>
                  {message}
                </div>
              )}
              <div className="text-center mt-3">
                <p>Don't have an account? <button className="btn btn-link p-0" onClick={onSwitchToSignUp}>Sign up here</button></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
