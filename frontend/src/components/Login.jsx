import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../api/authApi';
import { useEffect } from 'react';

export default function Login({ setUser }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
         console.log('token')
      navigate('/entries')
    }
    else{
          console.log('no token')
      navigate('/');
    }

  }, []);


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await loginUser({ email, password });
      localStorage.setItem('token', res.token);
      setUser(res.user);
          navigate('/entries')
    } catch (err) {
      setError(err.error || 'Login failed');
    }
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: 'var(--paper)', padding: '2rem' }}>
      <form onSubmit={handleSubmit} style={{ background: 'var(--paper)', padding: '3rem', borderRadius: '20px', border: '3px solid var(--gold)', boxShadow: '0 20px 50px var(--shadow)', maxWidth: '400px', width: '100%' }}>
        <h2 style={{ textAlign: 'center', fontFamily: "'Playfair Display', serif", color: 'var(--gold)', marginBottom: '2rem' }}>Welcome Back</h2>
        {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required style={{ width: '100%', padding: '1rem', marginBottom: '1rem', border: '2px solid var(--gold)', borderRadius: '8px', background: 'transparent', color: 'var(--ink)' }} />
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required style={{ width: '100%', padding: '1rem', marginBottom: '1rem', border: '2px solid var(--gold)', borderRadius: '8px', background: 'transparent', color: 'var(--ink)' }} />
        <button type="submit" style={{ width: '100%', padding: '1rem', background: 'var(--gold)', color: 'var(--ink)', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }}>Login</button>
        <p style={{ textAlign: 'center', marginTop: '1rem' }}><a href="/signup" style={{ color: 'var(--gold)' }}>Create Account</a></p>
      </form>
    </div>
  );
}