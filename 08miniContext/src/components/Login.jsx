import React, { useContext, useState } from 'react';
import UserContext from '../context/UserContext';

function Login() {
  const { setUser } = useContext(UserContext);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [remember, setRemember] = useState(false);

  const validate = () => {
    let e = {};
    if (!username.trim()) e.username = 'username required';
    if (password.length < 4) e.password = 'min 4 characters';
    return e;
  };

  const handleSubmit = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setErrors({});
    setLoading(true);
    setTimeout(() => {
      setUser({
        username,
        joined: new Date().toLocaleDateString('en-IN', {
          day: 'numeric', month: 'short', year: 'numeric'
        }),
        remember,
      });
      setLoading(false);
    }, 900);
  };

  return (
    <div className="page-enter">
      <h1>Welcome back.</h1>
      <div className="subtitle">secure session · mannsvijay</div>

      <div className="field">
        <label>Username</label>
        <input
          className={errors.username ? 'error' : ''}
          type="text"
          value={username}
          onChange={e => { setUsername(e.target.value); setErrors(v => ({ ...v, username: '' })); }}
          placeholder=" exam - mannsvijay"
        />
        {errors.username && <span className="err-msg">{errors.username}</span>}
      </div>

      <div className="field">
        <label>Password</label>
        <input
          className={errors.password ? 'error' : ''}
          type={showPw ? 'text' : 'password'}
          value={password}
          onChange={e => { setPassword(e.target.value); setErrors(v => ({ ...v, password: '' })); }}
          placeholder="••••••••"
          style={{ paddingRight: '44px' }}
        />
        <button className="eye-btn" onClick={() => setShowPw(v => !v)}>
          {showPw ? '✕' : '◎'}
        </button>
        {errors.password && <span className="err-msg">{errors.password}</span>}
      </div>

      <div className="row">
        <label className="checkbox-row">
          <input
            type="checkbox"
            checked={remember}
            onChange={e => setRemember(e.target.checked)}
          />
          <span>Remember me</span>
        </label>
        <span className="forgot">Forgot password?</span>
      </div>

      <button
        className={`btn ${loading ? 'loading' : ''}`}
        onClick={handleSubmit}
      >
        {loading && <span className="btn-spin" />}
        {loading ? 'Authenticating...' : 'Sign In →'}
      </button>

    </div>
  );
}

export default Login;