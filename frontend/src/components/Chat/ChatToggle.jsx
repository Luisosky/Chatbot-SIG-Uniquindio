import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ChatWidget from '../Chat/ChatWidget';
import './ChatToggle.css';

const ChatToggle = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false); 
  const navigate = useNavigate();

  const toggleChat = () => {
    if(isOpen){
      setIsClosing(true);
      setTimeout(() => {
        setIsOpen(false);
        setIsClosing(false);
      }, 300);
    }else{
      setIsOpen(true);
    }
  }

  const handleImmersive = () => {
    navigate('/chat');
  };

  return (
    <>
      {isOpen && (
        <div className={`chat-overlay${isClosing ? ' closing' : ''}`}>
          <div className="chat-modal">
            <div className="chat-modal-header">
            <button className="immersive-button" title="inmsersivo" onClick={handleImmersive}>⛶</button>
            <button className="close-button" title="cerrar chat" onClick={toggleChat}>X</button>
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