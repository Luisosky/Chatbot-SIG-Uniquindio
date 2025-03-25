import React, { useState, useEffect, useRef } from 'react';
import './ChatWidget.css';

const ChatWidget = () => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // Mensajes iniciales simulados
  useEffect(() => {
    setMessages([
      {
        id: 1,
        text: '¡Hola! Soy el asistente del Sistema Integrado de Gestión de la UniQuindío. ¿En qué puedo ayudarte hoy?',
        sender: 'bot',
        timestamp: new Date()
      }
    ]);
  }, []);

  // Simular respuestas del bot (sin conexión)
  const simulateBotResponse = (userMessage) => {
    // Respuestas predefinidas basadas en palabras clave
    let botResponse = {
      id: Date.now(),
      sender: 'bot',
      timestamp: new Date()
    };

    if (userMessage.toLowerCase().includes('sistema')) {
      botResponse.text = 'Los sistemas disponibles son: SIAC (Sistema Interno de Aseguramiento de la Calidad), SGSST (Sistema de Gestión de Seguridad y Salud en el Trabajo), SGA (Sistema de Gestión Ambiental), SGL (Sistema de Gestión Laboratorios) y SSI (Sistema de Seguridad de la Información).';
    } 
    else if (userMessage.toLowerCase().includes('documento')) {
      botResponse.text = 'Puedo ayudarte a encontrar documentos en el Sistema Integrado de Gestión. ¿De qué sistema te gustaría obtener documentos?';
      botResponse.buttons = [
        { text: 'SIAC', value: 'Muéstrame documentos del SIAC' },
        { text: 'SGSST', value: 'Muéstrame documentos del SGSST' },
        { text: 'SGA', value: 'Muéstrame documentos del SGA' }
      ];
    }
    else if (userMessage.toLowerCase().includes('siac')) {
      botResponse.text = 'El SIAC (Sistema Interno de Aseguramiento de la Calidad) tiene procesos como: Gestión Académica, Evaluación y Acreditación. ¿Te gustaría ver documentos de alguno de estos procesos?';
    }
    else if (userMessage.toLowerCase().includes('proceso')) {
      botResponse.text = 'Los procesos varían según el sistema. Por ejemplo, el SIAC tiene procesos de Gestión Académica y Acreditación. ¿De qué sistema específico quieres conocer los procesos?';
    }
    else {
      botResponse.text = 'Disculpa, no tengo información específica sobre eso. ¿Puedes reformular tu pregunta? Puedo ayudarte con información sobre sistemas, procesos o documentos del Sistema Integrado de Gestión.';
    }

    return botResponse;
  };

  // Función para enviar mensaje (simulada)
  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    // Agregar mensaje del usuario
    const userMessage = {
      id: Date.now(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simular tiempo de respuesta
    setTimeout(() => {
      const botResponse = simulateBotResponse(userMessage.text);
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1000);
  };

  // Scroll al último mensaje
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Manejar clic en botones de respuesta
  const handleButtonClick = (value) => {
    // Simular envío de mensaje como si el usuario lo hubiera escrito
    setInputValue(value);
    setTimeout(() => {
      handleSendMessage();
    }, 100);
  };

  return (
    <div className="chat-widget">
      <div className="chat-header">
        <h3>Asistente SIG UniQuindío</h3>
      </div>
      
      <div className="chat-messages">
        {messages.map((msg) => (
          <div key={msg.id} className={`message ${msg.sender}`}>
            <div className="message-content">
              <p>{msg.text}</p>
              
              {/* Botones de respuesta rápida */}
              {msg.buttons && (
                <div className="message-buttons">
                  {msg.buttons.map((btn, index) => (
                    <button 
                      key={index} 
                      onClick={() => handleButtonClick(btn.value)}
                    >
                      {btn.text}
                    </button>
                  ))}
                </div>
              )}
              
              <span className="message-time">
                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="message bot typing">
            <div className="typing-indicator">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      <div className="chat-input-container">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Escribe tu mensaje..."
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          className="chat-input"
        />
        <button onClick={handleSendMessage} className="send-button">
          <svg viewBox="0 0 24 24" width="24" height="24">
            <path fill="currentColor" d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"></path>
          </svg>
        </button>
      </div>


    </div>
  );
};

export default ChatWidget;