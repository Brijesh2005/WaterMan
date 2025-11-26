import React from 'react';

const WaterSavingVisualize = () => {
  return (
    <div className="water-saving-container">
      <div className="water-saving-grid">
        
        {/* Water Drop - Conservation */}
        <div className="water-card">
          <svg viewBox="0 0 200 200" className="water-svg">
            {/* Background circle */}
            <circle cx="100" cy="100" r="95" fill="#e8f4f8" stroke="#60a5fa" strokeWidth="2" />
            
            {/* Water drop */}
            <path d="M 100 40 Q 75 65 75 85 Q 75 110 100 130 Q 125 110 125 85 Q 125 65 100 40 Z" 
                  fill="#3b82f6" opacity="0.8" />
            <path d="M 100 50 Q 82 68 82 82 Q 82 105 100 120 Q 118 105 118 82 Q 118 68 100 50 Z" 
                  fill="#60a5fa" />
            
            {/* Shine effect */}
            <circle cx="95" cy="75" r="8" fill="#ffffff" opacity="0.6" />
          </svg>
          <h5>Save Water</h5>
          <p>Every drop counts towards a sustainable future</p>
        </div>

        {/* Faucet - Reduce Usage */}
        <div className="water-card">
          <svg viewBox="0 0 200 200" className="water-svg">
            {/* Background */}
            <circle cx="100" cy="100" r="95" fill="#f0e8f8" stroke="#a78bfa" strokeWidth="2" />
            
            {/* Faucet pipe */}
            <rect x="70" y="40" width="60" height="15" rx="7" fill="#64748b" />
            <rect x="95" y="55" width="10" height="40" fill="#64748b" />
            
            {/* Water stream */}
            <path d="M 95 95 Q 90 110 88 130" stroke="#3b82f6" strokeWidth="4" fill="none" strokeLinecap="round" />
            <path d="M 105 95 Q 110 110 112 130" stroke="#60a5fa" strokeWidth="3" fill="none" strokeLinecap="round" />
            
            {/* Droplets */}
            <circle cx="85" cy="135" r="4" fill="#3b82f6" opacity="0.7" />
            <circle cx="115" cy="140" r="3" fill="#60a5fa" opacity="0.7" />
          </svg>
          <h5>Fix Leaks</h5>
          <p>Repair dripping faucets to prevent water waste</p>
        </div>

        {/* Shower - Smart Usage */}
        <div className="water-card">
          <svg viewBox="0 0 200 200" className="water-svg">
            {/* Background */}
            <circle cx="100" cy="100" r="95" fill="#e8f8f0" stroke="#10b981" strokeWidth="2" />
            
            {/* Shower head */}
            <circle cx="100" cy="50" r="20" fill="#64748b" />
            
            {/* Holes */}
            <circle cx="90" cy="45" r="2" fill="#ffffff" />
            <circle cx="100" cy="42" r="2" fill="#ffffff" />
            <circle cx="110" cy="45" r="2" fill="#ffffff" />
            <circle cx="95" cy="55" r="2" fill="#ffffff" />
            <circle cx="105" cy="55" r="2" fill="#ffffff" />
            
            {/* Pipe */}
            <rect x="95" y="70" width="10" height="35" fill="#94a3b8" />
            
            {/* Water streams */}
            <path d="M 85 75 Q 80 95 78 120" stroke="#06b6d4" strokeWidth="2" fill="none" strokeLinecap="round" />
            <path d="M 100 75 Q 100 100 100 120" stroke="#0891b2" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            <path d="M 115 75 Q 120 95 122 120" stroke="#06b6d4" strokeWidth="2" fill="none" strokeLinecap="round" />
          </svg>
          <h5>Short Showers</h5>
          <p>Shorter showers reduce water consumption significantly</p>
        </div>

        {/* Plant Watering - Efficient Irrigation */}
        <div className="water-card">
          <svg viewBox="0 0 200 200" className="water-svg">
            {/* Background */}
            <circle cx="100" cy="100" r="95" fill="#f0f8e8" stroke="#84cc16" strokeWidth="2" />
            
            {/* Watering can */}
            <ellipse cx="70" cy="85" rx="25" ry="20" fill="#fbbf24" stroke="#f59e0b" strokeWidth="2" />
            <path d="M 95 85 L 130 100" stroke="#f59e0b" strokeWidth="3" fill="none" strokeLinecap="round" />
            <circle cx="135" cy="105" r="3" fill="#f59e0b" />
            
            {/* Water drops from spout */}
            <circle cx="132" cy="115" r="3" fill="#3b82f6" opacity="0.8" />
            <circle cx="140" cy="125" r="2.5" fill="#3b82f6" opacity="0.7" />
            <circle cx="125" cy="130" r="2" fill="#60a5fa" opacity="0.6" />
            
            {/* Plant */}
            <ellipse cx="100" cy="160" rx="30" ry="10" fill="#22c55e" />
            <path d="M 90 160 Q 85 140 80 120" stroke="#16a34a" strokeWidth="2" fill="none" />
            <path d="M 110 160 Q 115 140 120 120" stroke="#16a34a" strokeWidth="2" fill="none" />
            <ellipse cx="75" cy="115" rx="8" ry="12" fill="#22c55e" transform="rotate(-30 75 115)" />
            <ellipse cx="125" cy="115" rx="8" ry="12" fill="#22c55e" transform="rotate(30 125 115)" />
          </svg>
          <h5>Smart Watering</h5>
          <p>Water plants early morning or evening to reduce evaporation</p>
        </div>

        {/* Rainwater Collection - Sustainable */}
        <div className="water-card">
          <svg viewBox="0 0 200 200" className="water-svg">
            {/* Background */}
            <circle cx="100" cy="100" r="95" fill="#e0f2fe" stroke="#0ea5e9" strokeWidth="2" />
            
            {/* Rain */}
            <circle cx="60" cy="50" r="2" fill="#0ea5e9" />
            <circle cx="80" cy="40" r="2" fill="#0ea5e9" />
            <circle cx="100" cy="35" r="2" fill="#0ea5e9" />
            <circle cx="120" cy="45" r="2" fill="#0ea5e9" />
            <circle cx="140" cy="55" r="2" fill="#0ea5e9" />
            
            {/* Rain lines */}
            <line x1="60" y1="50" x2="55" y2="70" stroke="#0ea5e9" strokeWidth="1.5" opacity="0.6" />
            <line x1="80" y1="40" x2="75" y2="65" stroke="#0ea5e9" strokeWidth="1.5" opacity="0.6" />
            <line x1="100" y1="35" x2="100" y2="65" stroke="#0ea5e9" strokeWidth="1.5" opacity="0.6" />
            
            {/* Tank */}
            <rect x="60" y="90" width="80" height="60" rx="5" fill="#dbeafe" stroke="#0284c7" strokeWidth="2" />
            <path d="M 75 90 Q 75 75 100 75 Q 125 75 125 90" fill="#bfdbfe" stroke="#0284c7" strokeWidth="1" />
            
            {/* Water inside */}
            <rect x="65" y="110" width="70" height="35" fill="#3b82f6" opacity="0.6" rx="3" />
            <ellipse cx="100" cy="110" rx="35" ry="8" fill="#60a5fa" opacity="0.5" />
          </svg>
          <h5>Rainwater Harvesting</h5>
          <p>Collect rainwater for gardening and outdoor use</p>
        </div>

        {/* Water Meter - Monitor Usage */}
        <div className="water-card">
          <svg viewBox="0 0 200 200" className="water-svg">
            {/* Background */}
            <circle cx="100" cy="100" r="95" fill="#f8e8f8" stroke="#d946ef" strokeWidth="2" />
            
            {/* Meter gauge */}
            <circle cx="100" cy="100" r="45" fill="#f5e6ff" stroke="#c084fc" strokeWidth="2" />
            
            {/* Scale marks */}
            <line x1="100" y1="60" x2="100" y2="50" stroke="#a855f7" strokeWidth="2" />
            <line x1="132" y1="68" x2="138" y2="62" stroke="#a855f7" strokeWidth="2" />
            <line x1="140" y1="100" x2="150" y2="100" stroke="#a855f7" strokeWidth="2" />
            <line x1="132" y1="132" x2="138" y2="138" stroke="#a855f7" strokeWidth="2" />
            
            {/* Center dot */}
            <circle cx="100" cy="100" r="4" fill="#d946ef" />
            
            {/* Needle */}
            <line x1="100" y1="100" x2="120" y2="75" stroke="#d946ef" strokeWidth="3" strokeLinecap="round" />
            
            {/* Display */}
            <rect x="80" y="130" width="40" height="20" rx="3" fill="#e9d5ff" stroke="#c084fc" strokeWidth="1" />
            <text x="100" y="142" textAnchor="middle" fontSize="12" fill="#7c3aed" fontWeight="bold">125L</text>
          </svg>
          <h5>Monitor Usage</h5>
          <p>Track daily water consumption to identify patterns</p>
        </div>

      </div>
    </div>
  );
};

export default WaterSavingVisualize;
