import React, { useState, useEffect } from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

function CourtBackground() {
  return (
    <svg
      viewBox="-25 0 50 47"
      preserveAspectRatio="none"
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        opacity: 0.95,
        pointerEvents: "none",
      }}
    >
      <rect x="-25" y="0" width="50" height="47" fill="#d2a679" />
      <rect x="-25" y="0" width="50" height="47" fill="none" stroke="#3a2a1a" strokeWidth="0.4" />
      <circle cx="0" cy="4.75" r="0.75" fill="none" stroke="#3a2a1a" strokeWidth="0.35" />
      <line x1="-3" y1="4" x2="3" y2="4" stroke="#3a2a1a" strokeWidth="0.35" />
      <rect x="-3" y="3.2" width="6" height="0.8" fill="none" stroke="#3a2a1a" strokeWidth="0.35" />
      <rect x="-8" y="0" width="16" height="19" fill="none" stroke="#3a2a1a" strokeWidth="0.35" />
      <circle cx="0" cy="19" r="6" fill="none" stroke="#3a2a1a" strokeWidth="0.35" />
      <path d="M -4 4.75 A 4 4 0 0 1 4 4.75" fill="none" stroke="#3a2a1a" strokeWidth="0.35" />
      <line x1="-22" y1="0" x2="-22" y2="14" stroke="#3a2a1a" strokeWidth="0.35" />
      <line x1="22" y1="0" x2="22" y2="14" stroke="#3a2a1a" strokeWidth="0.35" />
      <path d="M -22 14 A 23.75 23.75 0 0 0 22 14" fill="none" stroke="#3a2a1a" strokeWidth="0.35" />
      <line x1="-25" y1="47" x2="25" y2="47" stroke="#3a2a1a" strokeWidth="0.6" />
    </svg>
  );
}

function ShotMap() {
  const [players, setPlayers] = useState([]);
  const [selectedPlayer, setSelectedPlayer] = useState('');
  const [shots, setShots] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5131/api/players')
      .then(res => res.json())
      .then(data => setPlayers(data));
  }, []);

  useEffect(() => {
    if (selectedPlayer) {
      fetch(`http://localhost:5131/api/shots/player/${selectedPlayer}`)
        .then(res => res.json())
        .then(data => setShots(data));
    }
  }, [selectedPlayer]);

  return (
    <div className="container">
      <h1>İnteraktif Şut Haritası</h1>

      <div style={{ marginBottom: 20 }}>
        <select
          className="form-input"
          style={{ width: '50%' }}
          onChange={(e) => setSelectedPlayer(e.target.value)}
          value={selectedPlayer}
        >
          <option value="">Oyuncu Seçiniz...</option>
          {players.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
      </div>

      <div
        style={{
          width: '100%',
          maxWidth: 1000,
          margin: '0 auto',
          aspectRatio: '50 / 47',
          background: '#d2a679',
          borderRadius: 12,
          border: '1px solid #2a2a2a',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <CourtBackground />

        <div style={{ position: "absolute", inset: 0 }}>
          <ResponsiveContainer>
            <ScatterChart margin={{ top: 10, right: 10, bottom: 250, left: 10 }}>
              <XAxis type="number" dataKey="x" hide domain={[-25, 25]} />
              <YAxis type="number" dataKey="y" hide domain={[0, 36]} />
              <Tooltip cursor={{ strokeDasharray: '3 3' }} />
              <Scatter name="Shots" data={shots}>
                {shots.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.made ? '#00d26a' : '#ff4d4d'} />
                ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export default ShotMap;
