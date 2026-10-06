import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import './RadiologyDashboard.css';

const RadiologyDashboard = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('exams');
  const [message, setMessage] = useState('');
  
  // Données de démonstration
  const messages = [
    { id: 1, text: 'Bonjour M. Dupont, j\'ai analysé vos images IRM.', sender: 'doctor', time: '14:32' },
    { id: 2, text: 'Avez-vous des questions concernant les résultats?', sender: 'doctor', time: '14:33' },
    { id: 3, text: 'Bonjour Docteur, merci pour votre analyse. La petite lésion détectée est-elle inquiétante?', sender: 'user', time: '14:35' },
  ];
  
  const handleSendMessage = () => {
    if (message.trim()) {
      console.log('Message envoyé:', message);
      setMessage('');
    }
  };
  
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <div className="radiology-dashboard">
      {/* En-tête */}
      <header className="dashboard-header">
        <div className="header-content">
          <button className="menu-button">☰</button>
          <h1>Portail Patient de Radiologie</h1>
          <button className="logout-button">Se déconnecter</button>
        </div>
      </header>
      
      <main className="dashboard-main">
        <div className="dashboard-card">
          <h2>Tableau de bord</h2>
          <p>Bienvenue sur votre espace patient. Consultez vos examens et échangez avec votre équipe médicale.</p>
        </div>
        
        <div className="messages-container">
          <h3>Derniers messages</h3>
          
          {/* Liste des messages */}
          <div className="messages-list">
            {messages.map((msg) => (
              <div 
                key={msg.id}
                className={`message ${msg.sender === 'user' ? 'user-message' : 'doctor-message'}`}
              >
                <p>{msg.text}</p>
                <span className="message-time">{msg.time}</span>
              </div>
            ))}
          </div>
          
          {/* Champ de saisie */}
          <div className="message-input-container">
            <input
              type="text"
              className="message-input"
              placeholder="Tapez votre message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <button 
              className="send-button"
              onClick={handleSendMessage}
            >
              Envoyer
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default RadiologyDashboard;
