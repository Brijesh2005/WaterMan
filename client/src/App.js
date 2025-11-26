import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Users from './components/Users';
import WaterSources from './components/WaterSources';
import ConsumptionRecords from './components/ConsumptionRecords';
import Billing from './components/Billing';
import Conservation from './components/Conservation';
import WaterMeters from './components/WaterMeters';
import './App.css';
// Icon imports (using SVGs for no extra deps)
const icons = {
  users: <svg width="18" height="18" fill="none" viewBox="0 0 24 24"><path fill="#6ee7b7" d="M12 12c2.7 0 8 1.34 8 4v2H4v-2c0-2.66 5.3-4 8-4Zm0-2a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z"/></svg>,
  'water-sources': <svg width="18" height="18" fill="none" viewBox="0 0 24 24"><path fill="#60a5fa" d="M12 2C10 7 5 12 5 16a7 7 0 0 0 14 0c0-4-5-9-7-14Zm0 18a5 5 0 0 1-5-5c0-2.5 3-6.5 5-10 2 3.5 5 7.5 5 10a5 5 0 0 1-5 5Z"/></svg>,
  'consumption-records': <svg width="18" height="18" fill="none" viewBox="0 0 24 24"><path fill="#facc15" d="M17 3a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h10Zm-1 2H8v14h8V5Zm-2 2v2h-2V7h2Zm0 4v2h-2v-2h2Zm0 4v2h-2v-2h2Z"/></svg>,
  billing: <svg width="18" height="18" fill="none" viewBox="0 0 24 24"><path fill="#f472b6" d="M4 4h16v2H4V4Zm0 4h16v2H4V8Zm0 4h16v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-6Zm2 2v4h12v-4H6Z"/></svg>,
  conservation: <svg width="18" height="18" fill="none" viewBox="0 0 24 24"><path fill="#a3e635" d="M12 2C7 7 2 12 2 17a7 7 0 0 0 14 0c0-5-5-10-10-15Zm0 18a5 5 0 0 1-5-5c0-2.5 3-6.5 5-10 2 3.5 5 7.5 5 10a5 5 0 0 1-5 5Z"/></svg>,
  'water-meters': <svg width="18" height="18" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="#38bdf8" strokeWidth="2"/><path stroke="#38bdf8" strokeWidth="2" d="M12 6v6l4 2"/></svg>
};


function App() {
  const [activeSection, setActiveSection] = useState('users');

  const renderSection = () => {
    switch (activeSection) {
      case 'users':
        return <Users />;
      case 'water-sources':
        return <WaterSources />;
      case 'consumption-records':
        return <ConsumptionRecords />;
      case 'billing':
        return <Billing />;
      case 'conservation':
        return <Conservation />;
      case 'water-meters':
        return <WaterMeters />;
      default:
        return <Users />;
    }
  };

  return (
    <div className="App">
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
        <div className="container">
          <div className="navbar-brand-logo">
            <svg width="40" height="40" viewBox="0 0 40 40" className="logo-svg">
              {/* Background circle */}
              <circle cx="20" cy="20" r="18" fill="#ffffff" opacity="0.15" />
              
              {/* Water drops forming a leaf shape */}
              <path d="M 20 8 Q 15 15 15 22 Q 15 28 20 32 Q 25 28 25 22 Q 25 15 20 8 Z" fill="#60a5fa" opacity="0.9" />
              <path d="M 20 12 Q 17 17 17 22 Q 17 27 20 30 Q 23 27 23 22 Q 23 17 20 12 Z" fill="#93c5fd" />
              
              {/* Shine effect */}
              <circle cx="19" cy="16" r="3" fill="#ffffff" opacity="0.6" />
              
              {/* Small droplets around */}
              <circle cx="10" cy="20" r="2" fill="#60a5fa" opacity="0.7" />
              <circle cx="30" cy="20" r="2" fill="#60a5fa" opacity="0.7" />
              <circle cx="20" cy="35" r="1.5" fill="#60a5fa" opacity="0.5" />
            </svg>
            <span className="logo-text">Water Conservation</span>
          </div>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav">
              {[
                { key: 'users', label: 'Users' },
                { key: 'water-sources', label: 'Water Sources' },
                { key: 'consumption-records', label: 'Consumption Records' },
                { key: 'billing', label: 'Billing' },
                { key: 'conservation', label: 'Conservation' },
                { key: 'water-meters', label: 'Water Meters' }
              ].map(({ key, label }) => (
                <li className="nav-item" key={key}>
                  <button
                    className={`nav-link btn btn-link d-flex align-items-center gap-2 ${activeSection === key ? 'active' : ''}`}
                    onClick={() => setActiveSection(key)}
                    title={label}
                  >
                    <span style={{display:'inline-flex',alignItems:'center'}}>{icons[key]}</span>
                    <span className="d-none d-md-inline" style={{marginLeft:4}}>{label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </nav>

      <div className="container mt-4">
        {renderSection()}
      </div>
    </div>
  );
}

export default App;
