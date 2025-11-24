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
    setError('');
    try {
      const timezone = getUserTimezone();
      const res = await signupUser({ email, password, timezone });
      localStorage.setItem('token', res.token);
      setUser(res.user);
      navigate('/');
    } catch (err) {
      setError(err.error || 'Signup failed. Please try again.');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-title-badge">Vintage Journal</div>

        <h2 className="auth-heading">Join the Journey</h2>
        <p className="auth-subtitle">Begin your story of honest growth</p>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            className="auth-input"
            placeholder="Your Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            className="auth-input"
            placeholder="Choose a Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength="6"
          />
          <button type="submit" className="auth-btn">
            Begin Writing
          </button>
        </form>

        <p style={{ marginTop: '2.5rem' }}>
          Already have an account?{' '}
          <a href="/login" className="auth-link">Sign In Here</a>
        </p>

        <div className="auth-footer-quote">
          “The pages are blank. The pen is in your hand.”
        </div>
      </div>
    </div>
  );
}