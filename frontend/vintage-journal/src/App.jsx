import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import EntryGrid from './components/EntryGrid';
import JournalEditor from './components/JournalEditor';
import EntryViewer from './components/EntryViewer';
import Login from './components/Login';
import Signup from './components/Signup';
import { getAllEntryDates, getEntryByDate, saveEntry, exportAllEntries } from './api/journalApi';
import { getUserTimezone } from './utils/timezone';

const today = new Date().toISOString().split('T')[0];

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [user, setUser] = useState(null);
  const [dates, setDates] = useState([]);
  const [currentView, setCurrentView] = useState('grid');
  const [currentEntry, setCurrentEntry] = useState({ date: today });
  const [showTodayExistsDialog, setShowTodayExistsDialog] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // Decode token to get user (simple, no backend call)
      const payload = JSON.parse(atob(token.split('.')[1]));
      setUser(payload);
    }
    document.body.classList.toggle('dark-mode', darkMode);
  }, [darkMode]);

  useEffect(() => {
    if (user) loadDates();
  }, [user]);

  const loadDates = async () => {
    try {
      const res = await getAllEntryDates();
      console.log('getAllEntryDates',res)
      setDates(res.sort((a, b) => b.localeCompare(a)));
    } catch (err) {
      console.error(err);
    }
  };

  const loadEntry = async (date) => {
    console.log('dddddddddddd:',date)
    try {
      const res = await getEntryByDate(date);
      if (res) {
        setCurrentEntry({ ...res, date });
        setCurrentView('viewer');
      } else {
        setCurrentEntry({ date: convertLocalToUTC(date, user.timezone) });
        setCurrentView('editor');
      }
    } catch (err) {
      setCurrentEntry({ date: convertLocalToUTC(date, user.timezone) });
      setCurrentView('editor');
    }
  };

  const convertLocalToUTC = (localDateStr, timezone) => {
    const date = new Date(localDateStr);
    return date.toISOString().split('T')[0]; // Simple UTC conversion
  };

  const handleNewEntry = async () => {
    if (dates.includes(today)) {
      setShowTodayExistsDialog(true);
    } else {
      setCurrentEntry({ date: convertLocalToUTC(today, user.timezone) });
      setCurrentView('editor');
    }
  };

  const handleSave = async (data) => {
    try {
      data.date = convertLocalToUTC(data.date, user.timezone);
      await saveEntry(data);
      await loadDates();
      alert('Saved!');
      setCurrentView('grid');
    } catch (err) {
      alert('Save failed');
    }
  };

  const handleClose = () => setCurrentView('grid');

  if (!user) {
    return (
      <Router>
        <Routes>
          <Route path="/login" element={<Login setUser={setUser} />} />
          <Route path="/signup" element={<Signup setUser={setUser} />} />
                  <Route path="/" element={<Login setUser={setUser} />} />
          {/* <Route path="*" element={<Navigate to="/login" />} /> */}
        </Routes>
      </Router>
    );
  }

  return (
    <Router>
      <Navbar onNewEntry={handleNewEntry} onToggleDark={() => setDarkMode(!darkMode)} isDark={darkMode} user={user} setUser={setUser} />
      {/* Dialog and views as before, with timezone in convertLocalToUTC */}
    {showTodayExistsDialog && (
  <div
    style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0, 0, 0, 0.82)',
      backdropFilter: 'blur(12px)',
      zIndex: 5000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      animation: 'fadeIn 0.4s ease-out'
    }}
    onClick={() => setShowTodayExistsDialog(false)}
  >
    <div
      style={{
        background: 'var(--paper)',
        maxWidth: '520px',
        width: '100%',
        padding: '3.5rem 3rem',
        borderRadius: '24px',
        border: '5px double var(--gold)',
        boxShadow: '0 30px 80px rgba(0, 0, 0, 0.6)',
        textAlign: 'center',
        position: 'relative',
        fontFamily: "'Libre Baskerville', serif",
        lineHeight: '1.8',
        animation: 'slideUp 0.5s ease-out'
      }}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Close Button */}
      <button
        onClick={() => setShowTodayExistsDialog(false)}
        style={{
          position: 'absolute',
          top: '18px',
          right: '24px',
          background: 'none',
          border: 'none',
          fontSize: '2.8rem',
          color: 'var(--ink)',
          opacity: 0.6,
          cursor: 'pointer',
          fontWeight: '300'
        }}
        onMouseEnter={(e) => (e.target.style.opacity = 1)}
        onMouseLeave={(e) => (e.target.style.opacity = 0.6)}
      >
        ×
      </button>

      {/* Title */}
      <h2
        style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: '2.6rem',
          color: 'var(--gold)',
          margin: '0 0 1.2rem',
          fontWeight: '700'
        }}
      >
        You’ve Already Written Today
      </h2>

      {/* Subtitle */}
      <p style={{ fontSize: '1.35rem', margin: '1.5rem 0 2.5rem', color: 'var(--ink)', opacity: 0.9 }}>
        Amazing consistency! Your reflection for today already exists.
      </p>

      {/* Message */}
      <p style={{ fontSize: '1.15rem', marginBottom: '3rem', color: 'var(--ink-light)' }}>
        Would you like to <strong>view</strong> it, <strong>edit</strong> it, or start fresh?
      </p>

      {/* Action Buttons */}
      <div style={{ display: 'flex', gap: '1.2rem', justifyContent: 'center', flexWrap: 'wrap' }}>
        <button
          className="btn-nav"
          onClick={() => {
            loadEntry(today);
            setShowTodayExistsDialog(false);
          }}
          style={{ padding: '0.9rem 2rem', fontSize: '1.1rem' }}
        >
          View Today’s Entry
        </button>

        <button
          className="btn-nav"
          onClick={() => {
            setCurrentEntry({ date: today });
            setCurrentView('editor');
            setShowTodayExistsDialog(false);
          }}
          style={{
            background: 'transparent',
            border: '2px solid var(--gold)',
            color: 'var(--ink)'
          }}
        >
          Edit It
        </button>

        <button
          onClick={() => setShowTodayExistsDialog(false)}
          style={{
            background: 'transparent',
            color: 'var(--ink)',
            padding: '0.9rem 1.8rem',
            border: 'none',
            fontSize: '1rem',
            textDecoration: 'underline',
            cursor: 'pointer',
            opacity: 0.8
          }}
          onMouseEnter={(e) => (e.target.style.opacity = 1)}
          onMouseLeave={(e) => (e.target.style.opacity = 0.8)}
        >
          Cancel
        </button>
      </div>

      {/* Optional Decorative Quote */}
      <div
        style={{
          marginTop: '3rem',
          padding: '1.5rem',
          background: 'rgba(184, 155, 106, 0.12)',
          borderRadius: '16px',
          fontStyle: 'italic',
          color: 'var(--gold)',
          fontSize: '1.25rem',
          fontFamily: "'Playfair Display', serif"
        }}
      >
        “Consistency is the quiet art of becoming.”
      </div>
    </div>
  </div>
)}
      <Routes>
        <Route path="/entries" element={
          currentView === 'grid' ? (
            // Grid JSX
            <div style={{ marginTop: '100px', textAlign: 'center' }}>
              <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '3.5rem', marginBottom: '2rem', color: 'var(--ink)' }}>
                Your Reflection Journey
              </h1>
              <EntryGrid entries={dates} onSelectEntry={loadEntry} />
              {/* Export/Print buttons */}
            </div>
          ) : currentView === 'editor' ? (
            <JournalEditor entry={currentEntry} onSave={handleSave} onClose={handleClose} />
          ) : (
            <EntryViewer entry={currentEntry} onEdit={() => setCurrentView('editor')} onClose={handleClose} />
          )
        } />
      </Routes>
    </Router>
  );
}

export default App;