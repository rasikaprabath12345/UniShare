import { useState, useEffect, useRef } from 'react';

export default function Timer({ duration, onExpire }) {
  const [seconds, setSeconds] = useState(duration);
  const startRef = useRef(Date.now());

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          const elapsed = Math.floor((Date.now() - startRef.current) / 1000);
          onExpire(elapsed);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [onExpire]);

  const m = String(Math.floor(seconds / 60)).padStart(2, '0');
  const s = String(seconds % 60).padStart(2, '0');
  const urgent = seconds < 60;

  return (
    <div style={{
      padding: '0.5rem 1.25rem',
      background: urgent ? '#FCEBEB' : 'var(--color-background-secondary)',
      border: `2px solid ${urgent ? '#E24B4A' : 'var(--color-border-secondary)'}`,
      borderRadius: 8, fontWeight: 600, fontSize: 20,
      color: urgent ? '#A32D2D' : 'var(--color-text-primary)',
      fontFamily: 'monospace', transition: 'all 0.3s'
    }}>
      {m}:{s}
    </div>
  );
}