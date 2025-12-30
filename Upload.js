import React from 'react';
import './Upload.css';

function Upload() {
  return (
    <div className="container">
      <h1>Oyuncu Verisi Yükle</h1>
      <p className="subtitle">Analiz için şut verilerini içeren CSV veya JSON dosyanızı yükleyin</p>
      <div className="upload-box">
        <div className="upload-icon">⬆️</div>
        <h3>Dosyayı buraya sürükleyin</h3>
        <p>veya</p>
        <button className="upload-button">Bilgisayardan Seç</button>
      </div>
    </div>
  );
}
export default Upload;