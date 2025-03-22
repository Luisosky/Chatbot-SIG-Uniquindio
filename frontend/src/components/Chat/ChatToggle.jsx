import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ChatWidget from '../Chat/ChatWidget';
import './ChatToggle.css';

const ChatToggle = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const toggleChat = () => setIsOpen(prev => !prev);

  const handleImmersive = () => {
    navigate('/chat');
  };

  return (
    <>
      {isOpen && (
        <div className="chat-overlay">
          <div className="chat-modal">
            <div className="chat-modal-header">
              <button className="close-button" onClick={toggleChat}>X</button>
              <button className="immersive-button" onClick={handleImmersive}>
                ⛶ Inmersivo
              </button>
            </div>
            <ChatWidget />
          </div>
        </div>
      )}
      <button className="chat-toggle-button" onClick={toggleChat}>
        Chat
      </button>
    </>
  );
};

export default ChatToggle;