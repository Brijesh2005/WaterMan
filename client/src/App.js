import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Login from './components/Login';
import SignUp from './components/SignUp';
import WaterSources from './components/WaterSources';
import ConsumptionRecords from './components/ConsumptionRecords';
import Billing from './components/Billing';
import Conservation from './components/Conservation';
import WaterMeters from './components/WaterMeters';
import AdminDashboard from './components/AdminDashboard';
import './App.css';

const icons = {
  login: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 1H5C3.89 1 3 1.89 3 3V21C3 22.11 3.89 23 5 23H19C20.11 23 21 22.11 21 21V9M19 9H14V4H19V9Z" fill="#10b981"/>
    </svg>
  ),
  'water-sources': (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2L2 7L12 12L22 7L12 2M2 17L12 22L22 17V10L12 15L2 10V17Z" fill="#2563eb"/>
    </svg>
  ),
  'consumption-records': (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M14 2H6C4.89 2 4 2.89 4 4V20C4 21.11 4.89 22 6 22H18C19.11 22 20 21.11 20 20V8L14 2M18 20H6V4H13V9H18V20Z" fill="#7c3aed"/>
    </svg>
  ),
  billing: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M7 4V2C7 1.45 7.45 1 8 1H16C16.55 1 17 1.45 17 2V4H20C20.55 4 21 4.45 21 5S20.55 6 20 6H19V19C19 20.1 18.1 21 17 21H7C5.9 21 5 20.1 5 19V6H4C3.45 6 3 5.55 3 5S3.45 4 4 4H7M9 3V4H15V3H9M7 6V19H17V6H7Z" fill="#facc15"/>
    </svg>
  ),
  conservation: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2L13.09 8.26L19 9L13.09 9.74L12 16L10.91 9.74L5 9L10.91 8.26L12 2M7.5 12L8.5 15L11.5 13.5L8.5 12L7.5 9L6.5 12L3.5 13.5L6.5 15L7.5 12M16.5 12L17.5 15L20.5 13.5L17.5 12L16.5 9L15.5 12L12.5 13.5L15.5 15L16.5 12Z" fill="#a3e635"/>
    </svg>
  ),
  'water-meters': (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="3" stroke="#38bdf8" strokeWidth="2"/>
      <path d="M12 7V5M12 19V17M7 12H5M19 12H17M16.24 7.76L14.83 9.17M9.17 14.83L7.76 16.24M16.24 16.24L14.83 14.83M9.17 9.17L7.76 7.76" stroke="#38bdf8" strokeWidth="2"/>
    </svg>
  )
};

function App() {
  const [activeSection, setActiveSection] = useState('login');
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check if user is logged in
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setActiveSection('water-sources'); // Default to first page after login
    }
  }, []);

  const renderSection = () => {
    switch (activeSection) {
      case 'login':
        return <Login onSwitchToSignUp={() => setActiveSection('signup')} onLoginSuccess={(userData) => { setUser(userData); setActiveSection('water-sources'); }} />;
      case 'signup':
        return <SignUp onSwitchToLogin={() => setActiveSection('login')} />;
      case 'water-sources':
        return <WaterSources user={user} />;
      case 'consumption-records':
        return <ConsumptionRecords />;
      case 'billing':
        return <Billing />;
      case 'conservation':
        return <Conservation user={user} />;
      case 'water-meters':
        return <WaterMeters />;
      case 'admin-dashboard':
        return user && user.role === 'admin' ? <AdminDashboard /> : <Login onSwitchToSignUp={() => setActiveSection('signup')} />;
      default:
        return <Login onSwitchToSignUp={() => setActiveSection('signup')} />;
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    setActiveSection('login');
  };

  return (
    <div className="App">
      {user ? (
        user.role === 'admin' ? (
          <div>
            <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
              <div className="container">
                <a className="navbar-brand" href="#!">
                  <i className="fas fa-tint me-2"></i>
                  Water Management System - Admin
                </a>
                <ul className="navbar-nav ms-auto">
                  <li className="nav-item">
                    <button
                      className="nav-link btn btn-link"
                      onClick={handleLogout}
                    >
                      Logout
                    </button>
                  </li>
                </ul>
              </div>
            </nav>
            <main className="container-fluid mt-4">
              <AdminDashboard />
            </main>
          </div>
        ) : (
          <div>
            <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
              <div className="container">
                <a className="navbar-brand" href="#!">
                  <i className="fas fa-tint me-2"></i>
                  Water Management System
                </a>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                  <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                  <ul className="navbar-nav me-auto">
                    <li className="nav-item">
                      <button
                        className={`nav-link btn btn-link ${activeSection === 'water-sources' ? 'active' : ''}`}
                        onClick={() => setActiveSection('water-sources')}
                      >
                        {icons['water-sources']}
                        <span className="ms-2">Water Sources</span>
                      </button>
                    </li>
                    <li className="nav-item">
                      <button
                        className={`nav-link btn btn-link ${activeSection === 'consumption-records' ? 'active' : ''}`}
                        onClick={() => setActiveSection('consumption-records')}
                      >
                        {icons['consumption-records']}
                        <span className="ms-2">Consumption</span>
                      </button>
                    </li>
                    <li className="nav-item">
                      <button
                        className={`nav-link btn btn-link ${activeSection === 'billing' ? 'active' : ''}`}
                        onClick={() => setActiveSection('billing')}
                      >
                        {icons.billing}
                        <span className="ms-2">Billing</span>
                      </button>
                    </li>
                    <li className="nav-item">
                      <button
                        className={`nav-link btn btn-link ${activeSection === 'conservation' ? 'active' : ''}`}
                        onClick={() => setActiveSection('conservation')}
                      >
                        {icons.conservation}
                        <span className="ms-2">Conservation</span>
                      </button>
                    </li>
                    <li className="nav-item">
                      <button
                        className={`nav-link btn btn-link ${activeSection === 'water-meters' ? 'active' : ''}`}
                        onClick={() => setActiveSection('water-meters')}
                      >
                        {icons['water-meters']}
                        <span className="ms-2">Water Meters</span>
                      </button>
                    </li>
                  </ul>
                  <ul className="navbar-nav">
                    <li className="nav-item">
                      <button
                        className="nav-link btn btn-link"
                        onClick={handleLogout}
                      >
                        Logout
                      </button>
                    </li>
                  </ul>
                </div>
              </div>
            </nav>
            <main className="container-fluid mt-4">
              {renderSection()}
            </main>
          </div>
        )
      ) : null}

      {!user && (
        <main className="container-fluid mt-4">
          {renderSection()}
        </main>
      )}
    </div>
  );
}

export default App;
