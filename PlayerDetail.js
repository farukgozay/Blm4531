import React, { useState, useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import "./PlayerDetail.css";

function CourtSvg({ opacity = 0.9 }) {
  // External image yok -> "Basketball Court" kırık görsel sorunu biter
  return (
    <svg
      viewBox="-25 0 50 47"
      preserveAspectRatio="none"
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        opacity,
        pointerEvents: "none",
      }}
    >
      {/* Zemin */}
      <rect x="-25" y="0" width="50" height="47" fill="#d2a679" />
      {/* Dış çizgi */}
      <rect
        x="-25"
        y="0"
        width="50"
        height="47"
        fill="none"
        stroke="#3a2a1a"
        strokeWidth="0.4"
      />

      {/* Pota / board */}
      <circle
        cx="0"
        cy="4.75"
        r="0.75"
        fill="none"
        stroke="#3a2a1a"
        strokeWidth="0.35"
      />
      <line x1="-3" y1="4" x2="3" y2="4" stroke="#3a2a1a" strokeWidth="0.35" />
      <rect
        x="-3"
        y="3.2"
        width="6"
        height="0.8"
        fill="none"
        stroke="#3a2a1a"
        strokeWidth="0.35"
      />

      {/* Paint */}
      <rect
        x="-8"
        y="0"
        width="16"
        height="19"
        fill="none"
        stroke="#3a2a1a"
        strokeWidth="0.35"
      />
      <rect
        x="-6"
        y="0"
        width="12"
        height="19"
        fill="none"
        stroke="#3a2a1a"
        strokeWidth="0.25"
        opacity="0.8"
      />

      {/* Free throw circle */}
      <circle
        cx="0"
        cy="19"
        r="6"
        fill="none"
        stroke="#3a2a1a"
        strokeWidth="0.35"
      />

      {/* Restricted */}
      <path
        d="M -4 4.75 A 4 4 0 0 1 4 4.75"
        fill="none"
        stroke="#3a2a1a"
        strokeWidth="0.35"
      />

      {/* 3PT */}
      <line x1="-22" y1="0" x2="-22" y2="14" stroke="#3a2a1a" strokeWidth="0.35" />
      <line x1="22" y1="0" x2="22" y2="14" stroke="#3a2a1a" strokeWidth="0.35" />
      <path
        d="M -22 14 A 23.75 23.75 0 0 0 22 14"
        fill="none"
        stroke="#3a2a1a"
        strokeWidth="0.35"
      />

      {/* Half-court line */}
      <line x1="-25" y1="47" x2="25" y2="47" stroke="#3a2a1a" strokeWidth="0.6" />
    </svg>
  );
}

function PlayerDetail() {
  const { playerId } = useParams();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://localhost:5131/api/players/${playerId}/details`)
      .then((res) => {
        if (!res.ok) throw new Error("Veri çekilemedi");
        return res.json();
      })
      .then((result) => {
        setData(result);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [playerId]);

  // ✅ Hook her render’da çağrılır (eslint hatası bitti)
  const maxCount = useMemo(() => {
    if (!data || !data.hexbin || data.hexbin.length === 0) return 1;
    return Math.max(...data.hexbin.map((z) => z.count || 0), 1);
  }, [data]);

  if (loading) {
    return (
      <div className="container">
        <h1>Veriler Yükleniyor...</h1>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="container">
        <h1>Oyuncu veya Veri Bulunamadı.</h1>
      </div>
    );
  }

  const { player, stats, shots, hexbin } = data;

  const effToColor = (eff) => {
    const e = Math.max(0, Math.min(1, Number(eff || 0)));
    const r = Math.round(255 * (1 - e));
    const g = Math.round(210 * e + 30);
    const b = 60;
    return `rgba(${r}, ${g}, ${b}, 0.75)`;
  };

  const toLeft = (x) => ((Number(x) + 25) / 50) * 100;
  const toBottom = (y) => (Number(y) / 35) * 100;

  return (
    <div className="container detail-page">
      <div className="header-card">
        <img src={player.imageUrl} className="detail-img" alt={player.name} />

        <div className="detail-info">
          <h1>{player.name}</h1>

          <h3>
            eFG%: {stats.efg.toFixed(1)}% | Şut Sayısı: {stats.total}
          </h3>

          {/* Yeni statlar */}
          <h3 style={{ marginTop: 10, color: "#ccc", fontSize: "1rem" }}>
            Ribaund: {stats.rebounds} | Asist: {stats.assists} | Faul: {stats.fouls}
          </h3>

          <h3 style={{ color: "#ccc", fontSize: "1rem" }}>
            2 Sayı: {stats.twoPtMade}/{stats.twoPtAttempted} (%{stats.twoPtPct.toFixed(1)})
            {" | "}
            3 Sayı: {stats.threePtMade}/{stats.threePtAttempted} (%{stats.threePtPct.toFixed(1)})
            {" | "}
            Serbest Atış: {stats.ftMade}/{stats.ftAttempted} (%{stats.ftPct.toFixed(1)})
          </h3>
        </div>
      </div>

      <div className="content-grid">
        {/* ŞUT HARİTASI */}
        <div className="shot-chart-panel">
          <h3>Şut Haritası</h3>

          <div className="court-wrap">
            <CourtSvg opacity={0.95} />

            {shots.map((shot, index) => (
              <div
                key={index}
                className={`shot-dot ${shot.made ? "made" : "missed"}`}
                style={{
                  left: `${toLeft(shot.x)}%`,
                  bottom: `${toBottom(shot.y)+25}%`,
                }}
                title={`Tip: ${shot.shotType} | Periyot: ${shot.period} | Clock: ${shot.clock}`}
              />
            ))}
          </div>

          <div className="legend-row">
            <div className="legend-item">
              <span className="legend-dot made" /> İsabet
            </div>
            <div className="legend-item">
              <span className="legend-dot missed" /> Kaçan
            </div>
          </div>
        </div>

        {/* ISI HARİTASI */}
        <div className="shot-chart-panel">
          <h3>Isı Haritası (Yoğunluk + Verim)</h3>

          <div className="court-wrap">
            <CourtSvg opacity={0.95} />

            {hexbin.map((zone, i) => {
              // grid hücresinin ortasına oturtmak için +2.5
              const cx = toLeft((zone.x ?? 0) + 2.5);
              const cy = toBottom((zone.y ?? 0) + 10);

              const count = Number(zone.count || 0);
              const scale = Math.max(0.15, count / maxCount);
              const sizePx = 10 + scale * 26;

              return (
                <div
                  key={i}
                  style={{
                    position: "absolute",
                    left: `${cx}%`,
                    bottom: `${cy}%`,
                    width: `${sizePx}px`,
                    height: `${sizePx}px`,
                    transform: "translate(-50%, -50%)",
                    borderRadius: "50%",
                    backgroundColor: effToColor(zone.efficiency),
                    boxShadow: "0 0 14px rgba(0,0,0,0.35)",
                    pointerEvents: "auto",
                  }}
                  title={`Attempt: ${count} | Verim: %${((zone.efficiency || 0) * 100).toFixed(0)}`}
                />
              );
            })}
          </div>

          <div style={{ marginTop: 10, color: "#888", fontSize: "0.9rem" }}>
            Not: Balon boyutu = bölgedeki şut sayısı, renk = verim (kırmızı düşük → yeşil yüksek).
          </div>
        </div>
      </div>
    </div>
  );
}

export default PlayerDetail;
