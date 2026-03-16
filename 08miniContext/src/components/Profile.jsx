import React, { useContext } from 'react';
import UserContext from '../context/UserContext';

function Profile() {
  const { user, setUser } = useContext(UserContext);

  if (!user) return <div>Please Login</div>;

  const initials = user.username.slice(0, 2).toUpperCase();

  return (
    <div className="page-enter">
      <div className="avatar">{initials}</div>

      <div style={{ textAlign: 'center' }}>
        <div className="badge">
          <span className="badge-dot" />&nbsp;ACTIVE SESSION
        </div>
        <h1 style={{ marginBottom: '4px' }}>{user.username}</h1>
        <div className="subtitle">authenticated user</div>
      </div>

      <div className="stat-row">
        <div className="stat">
          <span className="stat-val">✓</span>
          <span className="stat-lbl">verified</span>
        </div>
        <div className="stat">
          <span className="stat-val" style={{ fontSize: '12px', paddingTop: '4px' }}>
            {user.joined}
          </span>
          <span className="stat-lbl">joined</span>
        </div>
        <div className="stat">
          <span className="stat-val">{user.remember ? 'ON' : 'OFF'}</span>
          <span className="stat-lbl">remember</span>
        </div>
        <div className="stat">
          <span className="stat-val">JWT</span>
          <span className="stat-lbl">auth type</span>
        </div>
      </div>

      <button className="logout-btn" onClick={() => setUser(null)}>
        ⬡ &nbsp;Sign Out
      </button>

      <div className="tag">context state · <span>live</span></div>
    </div>
  );
}

export default Profile;