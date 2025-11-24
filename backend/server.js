const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const pool = require('./db');

const app = express();
const PORT = 5000;
const JWT_SECRET = 'your-super-secret-jwt-key-change-in-production';

// server.js or wherever you set up CORS
const allowedOrigins = [
  'http://localhost:5173',           // Vite dev
  'https://vintagejournal.legendbyte.com',  // Your real domain
  'https://www.vintagejournal.legendbyte.com' // Optional: www version
];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, Postman)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log('Blocked by CORS:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true  // Important for cookies, auth headers
}));

app.use(bodyParser.json({ limit: '10mb' }));

// Auth middleware
const authenticate = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token' });
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// Login
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const conn = await pool.getConnection();
    const [users] = await conn.query('SELECT * FROM users WHERE email = ?', [email]);
    conn.release();
    if (!users.length) return res.status(401).json({ error: 'Invalid credentials' });
    const user = users[0];
    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) return res.status(401).json({ error: 'Invalid credentials p' });
    const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user.id, email: user.email, timezone: user.timezone } });
  } catch (err) {
          console.log('err:', err);
    res.status(500).json({ error: err});
  }
});

// Signup
app.post('/api/auth/signup', async (req, res) => {
  const { email, password, timezone = 'UTC' } = req.body;
  try {
    const hash = await bcrypt.hash(password, 10);
    const conn = await pool.getConnection();
    const [result] = await conn.query('INSERT INTO users (email, password_hash, timezone) VALUES (?, ?, ?)', [email, hash, timezone]);
    conn.release();
    const token = jwt.sign({ userId: result.insertId, email }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: result.insertId, email, timezone } });
  } catch (err) {
       console.log('err:', err);
    if (err.code === 'ER_DUP_ENTRY') return res.status(400).json({ error: 'Email already exists' });
    res.status(500).json({ error: 'Signup failed' });
  }
});

// Get entry dates
app.get('/api/entries/dates', authenticate, async (req, res) => {
  try {
    const conn = await pool.getConnection();
    const [result] = await conn.query('CALL GetUserEntryDates(?)', [req.user.userId]);
    conn.release();
    const dates = result[0].map(r => r.entry_date_str);

    res.json(dates);
  } catch (err) {
       console.log('err:', err);
    res.status(500).json({ error: err });
  }
});

// Get entry
app.get('/api/entries/:date', authenticate, async (req, res) => {
  const { date } = req.params;
  console.log('ddatessss',date)
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return res.status(400).json({ error: 'Invalid date' });
  try {
    const conn = await pool.getConnection();
     console.log('date',date)
    const [result] = await conn.query('CALL GetEntryByDate(?, ?)', [req.user.userId, date]);
    conn.release();
    res.json(result[0][0] || null);
  } catch (err) {
       console.log('err:', err);
    res.status(500).json({ error: 'Failed to load entry' });
  }
});

// Save entry
app.post('/api/entries', authenticate, async (req, res) => {


  const entry = req.body;
    console.log('entry.date',entry.date)
  try {
    const conn = await pool.getConnection();
    await conn.query('CALL SaveOrUpdateEntry(?,?,?,?,?,?,?,?,?,?,?,?,?,?)', [
      req.user.userId, entry.date, entry.focus || null, entry.mantra || null,
      entry.didToday || null, entry.wentWell || null, entry.challenges || null,
      entry.learned || null, entry.feelings || null, entry.triggers || null,
      entry.gratitude || null, entry.proud || null, entry.tomorrow || null,
      entry.positiveThought || null
    ]);
    conn.release();
    res.json({ success: true });
  } catch (err) {
       console.log('err:', err);
    res.status(500).json({ error: err });
  }
});

// Export
app.get('/api/export', authenticate, async (req, res) => {
  try {
    const conn = await pool.getConnection();
    const [rows] = await conn.query('SELECT * FROM entries WHERE user_id = ? ORDER BY entry_date_utc DESC', [req.user.userId]);
    conn.release();
    res.json(rows);
  } catch (err) {
       console.log('err:', err);
    res.status(500).json({ error: 'Export failed' });
  }
});

app.listen(PORT, () => console.log(`Backend on http://localhost:${PORT}`));