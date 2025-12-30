import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AddPlayer.css'; // Form stillerini kullanalım

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch('http://localhost:5131/api/Auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });

            if (res.ok) {
                const token = await res.text();
                localStorage.setItem('token', token);
                // Sayfayı yenile ki Navbar güncellensin
                window.location.href = "/"; 
            } else {
                alert("Kullanıcı adı veya şifre hatalı!");
            }
        } catch (err) {
            alert("Sunucu hatası.");
        }
    };

    return (
        <div className="container">
            <h1>Giriş Yap</h1>
            <form onSubmit={handleLogin} className="player-form">
                <div className="form-group">
                    <label className="form-label">Kullanıcı Adı</label>
                    <input className="form-input" onChange={e => setUsername(e.target.value)} />
                </div>
                <div className="form-group">
                    <label className="form-label">Şifre</label>
                    <input className="form-input" type="password" onChange={e => setPassword(e.target.value)} />
                </div>
                <button className="submit-button">Giriş Yap</button>
                <p style={{marginTop: 20, color: '#888'}}>Test için Swagger'dan kayıt oluşturman gerekebilir.</p>
            </form>
        </div>
    );
}
export default Login;