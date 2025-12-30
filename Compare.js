import React, { useState, useEffect } from 'react';
import './AddPlayer.css'; // Stilleri ödünç al

function Compare() {
  const [players, setPlayers] = useState([]);
  const [p1, setP1] = useState('');
  const [p2, setP2] = useState('');
  const [stats1, setStats1] = useState(null);
  const [stats2, setStats2] = useState(null);

  useEffect(() => {
    fetch('http://localhost:5131/api/players')
      .then(r => r.json())
      .then(setPlayers);
  }, []);

  const handleCompare = async () => {
    if (!p1 || !p2) return;

    const r1 = await fetch(`http://localhost:5131/api/players/${p1}/details`).then(r => r.json());
    setStats1(r1);

    const r2 = await fetch(`http://localhost:5131/api/players/${p2}/details`).then(r => r.json());
    setStats2(r2);
  };

  const StatRow = ({ label, leftValue, rightValue, suffix = "" }) => {
    const l = Number(leftValue ?? 0);
    const r = Number(rightValue ?? 0);
    const max = Math.max(l, r, 1);

    // 0..50 arası (yarım bar)
    const leftW = (l / max) * 50;
    const rightW = (r / max) * 50;

    const leftIsHigher = l > r;
    const rightIsHigher = r > l;

    const leftColor = leftIsHigher ? '#00d26a' : (rightIsHigher ? '#ff4d4d' : '#888');
    const rightColor = rightIsHigher ? '#00d26a' : (leftIsHigher ? '#ff4d4d' : '#888');

    const format = (v) => {
      if (Number.isNaN(Number(v))) return v;
      // yüzde gibi değerlerde 1 basamak iyi duruyor
      if (label.includes('%') || label.includes('Pct') || label.includes('Yüzde')) {
        return `${Number(v).toFixed(1)}${suffix}`;
      }
      // diğerleri integer göster
      return `${Math.round(Number(v))}${suffix}`;
    };

    return (
      <div style={{
        display: 'grid',
        gridTemplateColumns: '180px 1fr',
        alignItems: 'center',
        gap: 12,
        marginBottom: 14
      }}>
        <div style={{ color: '#aaa', textAlign: 'left', fontWeight: 600 }}>
          {label}
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: '120px 1fr 120px',
          alignItems: 'center',
          gap: 12
        }}>
          {/* Sol değer */}
          <div style={{ textAlign: 'right', fontWeight: 700, color: '#fff' }}>
            {format(l)}
          </div>

          {/* Bar alanı */}
          <div style={{
            position: 'relative',
            height: 12,
            borderRadius: 999,
            background: '#2a2a2a',
            border: '1px solid #333',
            overflow: 'hidden'
          }}>
            {/* Orta çizgi */}
            <div style={{
              position: 'absolute',
              left: '50%',
              top: 0,
              bottom: 0,
              width: 2,
              background: '#666',
              opacity: 0.8
            }} />

            {/* Sol bar (merkezden sola doğru) */}
            <div style={{
              position: 'absolute',
              right: '50%',
              top: 0,
              bottom: 0,
              width: `${leftW}%`,
              background: leftColor,
              opacity: 0.9
            }} />

            {/* Sağ bar (merkezden sağa doğru) */}
            <div style={{
              position: 'absolute',
              left: '50%',
              top: 0,
              bottom: 0,
              width: `${rightW}%`,
              background: rightColor,
              opacity: 0.9
            }} />
          </div>

          {/* Sağ değer */}
          <div style={{ textAlign: 'left', fontWeight: 700, color: '#fff' }}>
            {format(r)}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="container">
      <h1>Oyuncu Kıyaslama</h1>

      <div style={{ display: 'flex', gap: 20, justifyContent: 'center', marginBottom: 30 }}>
        <select className="form-input" onChange={e => setP1(e.target.value)} value={p1}>
          <option value="">1. Oyuncu</option>
          {players.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>

        <select className="form-input" onChange={e => setP2(e.target.value)} value={p2}>
          <option value="">2. Oyuncu</option>
          {players.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>

        <button className="submit-button" style={{ width: 'auto' }} onClick={handleCompare}>VS</button>
      </div>

      {stats1 && stats2 && (
        <div style={{
          background: '#1e1e1e',
          padding: 30,
          borderRadius: 15,
          border: '1px solid #333'
        }}>
          {/* Header: iki oyuncu */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 120px 1fr',
            alignItems: 'center',
            marginBottom: 26
          }}>
            <div style={{ textAlign: 'center' }}>
              <img src={stats1.player.imageUrl} style={{ width: 90, borderRadius: '50%' }} alt="" />
              <h2 style={{ margin: '12px 0 0' }}>{stats1.player.name}</h2>
              <div style={{ color: '#888', marginTop: 4 }}>{stats1.player.team}</div>
            </div>

            <div style={{
              textAlign: 'center',
              fontSize: '3rem',
              fontWeight: 'bold',
              color: 'red'
            }}>
              VS
            </div>

            <div style={{ textAlign: 'center' }}>
              <img src={stats2.player.imageUrl} style={{ width: 90, borderRadius: '50%' }} alt="" />
              <h2 style={{ margin: '12px 0 0' }}>{stats2.player.name}</h2>
              <div style={{ color: '#888', marginTop: 4 }}>{stats2.player.team}</div>
            </div>
          </div>

          {/* Stat Bars */}
          <div style={{
            maxWidth: 920,
            margin: '0 auto',
            background: '#171717',
            border: '1px solid #2a2a2a',
            borderRadius: 14,
            padding: 22
          }}>
            <StatRow label="eFG%" leftValue={stats1.stats.efg} rightValue={stats2.stats.efg} suffix="%" />
            <StatRow label="Toplam Şut" leftValue={stats1.stats.total} rightValue={stats2.stats.total} />

            <div style={{ height: 10 }} />

            <StatRow label="Ribaund" leftValue={stats1.stats.rebounds} rightValue={stats2.stats.rebounds} />
            <StatRow label="Asist" leftValue={stats1.stats.assists} rightValue={stats2.stats.assists} />
            <StatRow label="Faul" leftValue={stats1.stats.fouls} rightValue={stats2.stats.fouls} />

            <div style={{ height: 10 }} />

            <StatRow label="2 Sayı Yüzdesi" leftValue={stats1.stats.twoPtPct} rightValue={stats2.stats.twoPtPct} suffix="%" />
            <StatRow label="3 Sayı Yüzdesi" leftValue={stats1.stats.threePtPct} rightValue={stats2.stats.threePtPct} suffix="%" />
            <StatRow label="Serbest Atış Yüzdesi" leftValue={stats1.stats.ftPct} rightValue={stats2.stats.ftPct} suffix="%" />

            <div style={{ height: 10 }} />

            {/* İstersen isabet/deneme sayıları da bar değil text olarak kalsın diye buraya ekleyebilirsin.
                Ama sen "bar olsun" dediğin için yüzde bazlı yaptım. */}
          </div>
        </div>
      )}
    </div>
  );
}

export default Compare;
