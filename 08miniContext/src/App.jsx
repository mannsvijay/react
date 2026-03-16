import React, { useRef, useContext } from 'react';
import UserContextProvider from './context/UserContextProvider';
import UserContext from './context/UserContext';
import Login from './components/Login';
import Profile from './components/Profile';
import './App.css';

function Card3D({ children }) {
  const ref = useRef();
  const shineRef = useRef();

  const onMove = e => {
    const r = ref.current.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    const cx = r.width / 2;
    const cy = r.height / 2;
    const rx = ((y - cy) / cy) * -12;
    const ry = ((x - cx) / cx) * 12;
    ref.current.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg) scale(1.01)`;
    ref.current.style.boxShadow = `${-ry}px ${-rx * 0.5}px 60px rgba(0,255,255,0.12), 0 0 80px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.15)`;
    if (shineRef.current)
      shineRef.current.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(255,255,255,0.1) 0%, transparent 60%)`;
  };

  const onLeave = () => {
    ref.current.style.transform = 'rotateX(0) rotateY(0) scale(1)';
    ref.current.style.boxShadow = '0 0 60px rgba(0,255,255,0.06), inset 0 1px 0 rgba(255,255,255,0.1)';
  };

  return (
    <div className="card-wrap">
      <div className="card" ref={ref} onMouseMove={onMove} onMouseLeave={onLeave}>
        <div className="shine" ref={shineRef} />
        {children}
      </div>
    </div>
  );
}

function AppInner() {
  const { user } = useContext(UserContext);
  const sceneRef = useRef();

  const onMove = e => {
    if (!sceneRef.current) return;
    const x = (e.clientX / window.innerWidth - 0.5) * 30;
    const y = (e.clientY / window.innerHeight - 0.5) * 20;
    sceneRef.current.style.backgroundPosition = `${50 + x * 0.1}% ${50 + y * 0.1}%`;
  };

  return (
    <div className="scene" ref={sceneRef} onMouseMove={onMove}>
      <div className="grid-bg" />
      <div className="orb orb1" />
      <div className="orb orb2" />
      <div className="orb orb3" />
      <Card3D>
        {user ? <Profile /> : <Login />}
      </Card3D>
    </div>
  );
}

function App() {
  return (
    <UserContextProvider>
      <AppInner />
    </UserContextProvider>
  );
}

export default App;