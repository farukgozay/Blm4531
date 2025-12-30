import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import '../App.css';

function Dashboard() {
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5131/api/players')
      .then(response => response.json())
      .then(data => setPlayers(data))
      .catch(error => console.error('API çekme hatası:', error));
  }, []);

  const handleDelete = async (e, playerId, playerName) => {
    e.preventDefault();      // Link'e gitmesini engelle
    e.stopPropagation();     // Kart click'i tetiklenmesin

    const ok = window.confirm(`${playerName} oyuncusunu silmek istediğine emin misin?`);
    if (!ok) return;

    try {
      const res = await fetch(`http://localhost:5131/api/players/${playerId}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setPlayers(prev => prev.filter(p => p.id !== playerId));
      } else {
        alert("Silme işlemi başarısız.");
      }
    } catch (err) {
      console.error(err);
      alert("Sunucuya bağlanılamadı.");
    }
  };

  return (
    <div className="container">
      <h1>Oyuncu Panosu</h1>
      <p className="subtitle">Analiz yapmak için bir oyuncu seçin</p>

      <div className="player-list">
        {players.map(player => (
          <Link to={`/player/${player.id}`} key={player.id} className="player-card">
            {/* KIRMIZI X SİLME BUTONU */}
            <button
              className="delete-player-btn"
              onClick={(e) => handleDelete(e, player.id, player.name)}
              title="Oyuncuyu Sil"
            >
              ✖
            </button>

            <img src={player.imageUrl} alt={player.name} className="player-image" />
            <div className="player-info">
              <h2>{player.name}</h2>
              <p>{player.team}</p>
            </div>
          </Link>
        ))}

        <Link to="/add-player" className="player-card add-player-card">
          <div className="add-player-content">
            <span className="plus-icon">+</span>
            <h2>Yeni Oyuncu Ekle</h2>
          </div>
        </Link>
      </div>
    </div>
  );
}

export default Dashboard;
