import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signupUser } from '../api/authApi';
import { getUserTimezone } from '../utils/timezone';

export default function Signup({ setUser }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const timezone = getUserTimezone(); // Auto-detect
      const res = await signupUser({ email, password, timezone });
      localStorage.setItem('token', res.token);
      setUser(res.user);
      navigate('/');
    } catch (err) {
      setError(err.error || 'Signup failed');
    }
  };

  return (
    // Similar to Login, but with "Signup" title and link to login
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: 'var(--paper)', padding: '2rem' }}>
      <form onSubmit={handleSubmit} style={{ background: 'var(--paper)', padding: '3rem', borderRadius: '20px', border: '3px solid var(--gold)', boxShadow: '0 20px 50px var(--shadow)', maxWidth: '400px', width: '100%' }}>
        <h2 style={{ textAlign: 'center', fontFamily: "'Playfair Display', serif", color: 'var(--gold)', marginBottom: '2rem' }}>Join the Journey</h2>
        {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required style={{ /* same as login */ }} />
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required style={{ /* same as login */ }} />
        <button type="submit" style={{ /* same as login */ }}>Sign Up</button>
        <p style={{ textAlign: 'center', marginTop: '1rem' }}><a href="/login" style={{ color: 'var(--gold)' }}>Have Account? Login</a></p>
      </form>
    </div>
  );
}