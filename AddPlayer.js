import React, { useState, useRef, useEffect } from 'react'; // useEffect BURAYA EKLENDİ
import { useNavigate } from 'react-router-dom';
import './AddPlayer.css';

function AddPlayer() {
    // ÖNCE BUNLARI TANIMLAMALIYIZ (Sıralama önemli)
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    // Token kontrolünü en başta yapıyoruz
    useEffect(() => {
        if (!token) {
            alert("Oyuncu eklemek için giriş yapmalısınız!");
            navigate('/login');
        }
    }, [token, navigate]);

    // State tanımları
    const [name, setName] = useState('');
    const [team, setTeam] = useState('');
    const [position, setPosition] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    
    // Dosya input referansı
    const fileInputRef = useRef(null);

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedFile(e.target.files[0]);
        }
    };

    const handleBoxClick = () => {
        fileInputRef.current.click();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // 1. Önce Oyuncuyu Yarat (PORT: 7123)
            const playerRes = await fetch('http://localhost:5131/api/players', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, team, position, imageUrl })
            });

            if (playerRes.ok) {
                const createdPlayer = await playerRes.json();

                // 2. Eğer dosya seçildiyse yükle
                if (selectedFile) {
                    const formData = new FormData();
                    formData.append('file', selectedFile);

                    const uploadRes = await fetch(`http://localhost:5131/api/shots/upload/${createdPlayer.id}`, {
                        method: 'POST',
                        body: formData
                    });

                    if (!uploadRes.ok) {
                        alert("Oyuncu eklendi ama dosya yüklenemedi!");
                        return;
                    }
                }

                alert("Oyuncu ve Veriler Başarıyla Eklendi!");
                navigate('/');
            } else {
                alert("Oyuncu eklenirken bir hata oluştu.");
            }
        } catch (error) {
            console.error("Hata:", error);
            alert("Sunucuya bağlanılamadı.");
        }
    };

    // Eğer token yoksa boş sayfa göster (zaten yönlendirecek)
    if (!token) return null;

    return (
        <div className="container">
            <h1>Yeni Oyuncu Ekle</h1>
            <p className="subtitle">Oyuncu bilgilerini girin ve şut veri setini yükleyin</p>

            <form onSubmit={handleSubmit} className="player-form">
                <div className="form-section">
                    <h3>Oyuncu Bilgileri</h3>
                    <div className="form-group">
                        <label htmlFor="name" className="form-label">Ad Soyad</label>
                        <input type="text" id="name" className="form-input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Örn: Michael Jordan" required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="team" className="form-label">Takım</label>
                        <input type="text" id="team" className="form-input" value={team} onChange={(e) => setTeam(e.target.value)} placeholder="Örn: Chicago Bulls" required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="position" className="form-label">Pozisyon</label>
                        <input type="text" id="position" className="form-input" value={position} onChange={(e) => setPosition(e.target.value)} placeholder="Örn: Shooting Guard" required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="imageUrl" className="form-label">Fotoğraf URL</label>
                        <input type="text" id="imageUrl" className="form-input" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="https://..." required />
                    </div>
                </div>

                <div className="form-section">
                    <h3>Şut Veri Seti (Dataset)</h3>
                    <div className="upload-box-form" onClick={handleBoxClick}>
                        <div className="upload-icon">⬆️</div>
                        <h3>
                            {selectedFile ? `Seçilen Dosya: ${selectedFile.name}` : "CSV Dosyasını Buraya Sürükleyin veya Tıklayın"}
                        </h3>
                        <p>{selectedFile ? "Değiştirmek için tekrar tıklayın" : "CSV Formatı Desteklenir"}</p>
                        
                        <input 
                            type="file" 
                            ref={fileInputRef} 
                            onChange={handleFileChange} 
                            accept=".csv" 
                            style={{ display: 'none' }} 
                        />
                        
                        <button type="button" className="upload-button-form">
                            {selectedFile ? "Dosya Değiştir" : "Dosya Seç"}
                        </button>
                    </div>
                </div>

                <button type="submit" className="submit-button">Oyuncuyu Kaydet</button>
            </form>
        </div>
    );
}

export default AddPlayer;