import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Navbar({ onNewEntry, onToggleDark, isDark, user, setUser }) {
  const [showHelp, setShowHelp] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/login');
  };

  return (
    <>
      {/* Fixed Top Navbar */}
      <div className="topnav">
        <div className="brand">
          <div>Vintage Journal</div>
          <div style={{ fontSize: '10px', opacity: 0.8 }}>
            A place for honest growth • Est. 2025
          </div>
        </div>

        <div className="nav-right">
          {/* Help Button */}
          <span
            className="help-btn-nav"
            onClick={() => setShowHelp(true)}
            title="Help & Guide"
          >
            ?
          </span>

          {/* New Entry Button */}
          <button className="btn-nav" onClick={onNewEntry}>
            New Entry
          </button>

          {/* Dark Mode Toggle */}
          <button className="btn-nav" onClick={onToggleDark}>
            {isDark ? 'Light' : 'Dark'} Mode
          </button>

          {/* User Avatar + Dropdown */}
          <div
            className="avatar-menu"
            onMouseEnter={() => setShowDropdown(true)}
            onMouseLeave={() => setShowDropdown(false)}
          >
            <img
              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.email || 'user'}&backgroundColor=ffdfbf`}
              alt="User avatar"
              className="avatar"
            />
            <div className="dropdown" style={{ display: showDropdown ? 'block' : 'none' }}>
              <div style={{
                padding: '0.8rem 1rem',
                borderBottom: '1px solid rgba(184,155,106,0.3)',
                fontWeight: '600',
                color: 'var(--gold)',
                fontSize: '0.95rem'
              }}>
                {user?.email || 'Guest'}
              </div>
              <a href="#" onClick={(e) => { e.preventDefault(); alert('Profile coming soon'); }}>
                Profile
              </a>
              <a href="#" onClick={(e) => { e.preventDefault(); alert('Settings coming soon'); }}>
                Settings
              </a>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  handleLogout();
                }}
                style={{ color: '#c44', fontWeight: '600' }}
              >
                Sign Out
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Help Popup */}
      {showHelp && (
        <div
          id="helpOverlay"
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.75)',
            backdropFilter: 'blur(10px)',
            zIndex: 5000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem'
          }}
          onClick={(e) => e.target === e.currentTarget && setShowHelp(false)}
        >
          <div className="help-popup">
            <span
              className="help-close"
              onClick={() => setShowHelp(false)}
              style={{ fontSize: '2.8rem', opacity: 0.7 }}
            >
              ×
            </span>

            <h3 style={{ color: 'var(--gold)', borderBottom: '2px solid var(--gold)', paddingBottom: '0.8rem' }}>
              How to Use This Vintage Reflection Journal
            </h3>

            <div style={{ lineHeight: '1.8', fontSize: '1.05rem' }}>
              <p><strong>1. Start with the Basics</strong><br />
                Every entry has a date (auto-filled) and a <strong>Title/Focus</strong> — one word or phrase about today’s theme (e.g., Confidence, Decision Making, Creativity).</p>

              <p><strong>2. Recommended Structure</strong></p>
              <ul style={{ paddingLeft: '1.5rem' }}>
                <li><strong>A. Daily Reflection</strong> – What happened and what it taught you</li>
                <li><strong>B. Emotional Check</strong> – Honest feelings and triggers</li>
                <li><strong>C. Gratitude & Pride</strong> – Celebrate yourself</li>
                <li><strong>D. Forward Planning</strong> – One small step for tomorrow + a mantra</li>
              </ul>

              <p><strong>3. Tips for Deep Growth</strong><br />
                • Be completely honest — this journal is for you only<br />
                • Keep entries short (10–20 minutes) — consistency  perfection<br />
                • Review past pages weekly to see your progress</p>

              <div style={{
                background: 'rgba(184,155,106,0.15)',
                padding: '2rem',
                borderRadius: '16px',
                margin: '2rem 0',
                fontStyle: 'italic',
                textAlign: 'center',
                fontSize: '1.3rem',
                color: 'var(--gold)',
                fontFamily: "'Playfair Display', serif"
              }}>
                “Progress, not perfection.”
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}