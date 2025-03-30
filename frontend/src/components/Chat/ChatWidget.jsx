import React, { useState, useEffect, useRef, useCallback } from 'react';
import './ChatWidget.css';
import ReactMarkdown from 'react-markdown';

// Constantes extraídas para mejor mantenimiento y buenas practicas 
const API_URL = "http://localhost:5005/webhooks/rest/webhook";
const TYPING_DELAY = 500;
const WELCOME_MESSAGE = '¡Hola! Soy el asistente del Sistema Integrado de Gestión de la UniQuindío. ¿En qué puedo ayudarte hoy?';

// Crear componentes más pequeños para mejorar la legibilidad
const TypingIndicator = () => (
  <div className="typing-indicator">
    <span></span>
    <span></span>
    <span></span>
  </div>
);

const MessageTime = ({ timestamp }) => (
  <span className="message-time">
    {timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
  </span>
);

const ChatWidget = () => {
  // Estado y refs existentes
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null); // Nuevo ref para el input

  useEffect(() => {
    // Mensaje de bienvenida
    setMessages([
      {
        id: 1,
        text: WELCOME_MESSAGE,
        sender: 'bot',
        timestamp: new Date()
      }
    ]);
    
    // Enfocar el input al inicio
    inputRef.current?.focus();
  }, []);

  // Extraer la lógica de envío a una función memoizada con useCallback
  const sendMessage = useCallback(async (text) => {
    setIsTyping(true);
    setIsLoading(true);

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sender: "user", 
          message: text
        })
      });
      
      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }
      
      const data = await response.json();

      // Añadir un pequeño retraso para simular tiempo de pensamiento del bot
      setTimeout(() => {
        if (data.length === 0) {
          // Manejar respuestas vacías
          setMessages(prev => [...prev, {
            id: Date.now(),
            text: "Lo siento, no encuentro una respuesta para tu consulta. ¿Podrías reformularla?",
            sender: 'bot',
            timestamp: new Date()
          }]);
        } else {
          data.forEach((botMsg) => {
            const newBotMessage = {
              id: Date.now() + Math.random(),
              text: botMsg.text,
              sender: 'bot',
              timestamp: new Date(),
              buttons: botMsg.buttons
            };
            setMessages(prev => [...prev, newBotMessage]);
          });
        }
        setIsTyping(false);
        setIsLoading(false);
      }, TYPING_DELAY);
    } catch (error) {
      console.error("Error al enviar el mensaje a Rasa:", error);
      // Mostrar mensaje de error al usuario
      setMessages(prev => [...prev, {
        id: Date.now(),
        text: "Lo siento, tuve un problema al procesar tu solicitud. Por favor, inténtalo de nuevo.",
        sender: 'bot',
        timestamp: new Date(),
        isError: true
      }]);
      setIsTyping(false);
      setIsLoading(false);
    }
  }, []);

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = inputValue;
    setInputValue('');
    
    // Enfocar nuevamente el input
    inputRef.current?.focus();
    
    // Enviar el mensaje al backend
    sendMessage(currentInput);
  };

  // Scroll al último mensaje
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Manejar clic en botones de respuesta
  const handleButtonClick = (value) => {
    setInputValue(value);
    setTimeout(() => {
      handleSendMessage();
    }, 100);
  };

  // Renderizar mensaje con soporte markdown
  const renderMessageContent = (text) => {
    return (
      <div className="message-text">
        <ReactMarkdown>{text}</ReactMarkdown>
      </div>
    );
  };

  return (
    <div className="chat-widget">
      <div className="chat-header">
        <h3>Asistente SIG UniQuindío</h3>
      </div>
      
      <div className="chat-messages" role="log" aria-live="polite">
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`message ${msg.sender} ${msg.isError ? 'error' : ''}`}
            aria-label={`Mensaje de ${msg.sender === 'bot' ? 'asistente' : 'usuario'}`}
          >
            <div className="message-content">
              {renderMessageContent(msg.text)}
              
              {msg.buttons && msg.buttons.length > 0 && (
                <div className="message-buttons">
                  {msg.buttons.map((btn, index) => (
                    <button 
                      key={index} 
                      onClick={() => handleButtonClick(btn.value)}
                      className="response-button"
                    >
                      {btn.text}
                    </button>
                  ))}
                </div>
              )}
              
              <MessageTime timestamp={msg.timestamp} />
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="message bot typing" aria-label="El asistente está escribiendo">
            <div className="message-content">
              <TypingIndicator />
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      <div className="chat-input-container">
        <input
          type="text"
          ref={inputRef}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Escribe tu mensaje..."
          onKeyPress={(e) => e.key === 'Enter' && !isLoading && handleSendMessage()}
          className="chat-input"
          disabled={isLoading}
          aria-label="Mensaje para el asistente"
        />
        <button 
          onClick={handleSendMessage} 
          className={`send-button ${isLoading ? 'disabled' : ''}`}
          disabled={isLoading}
          aria-label="Enviar mensaje"
        >
          <svg viewBox="0 0 24 24" width="24" height="24">
            <path fill="currentColor" d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"></path>
          </svg>
        </button>
      </div>
    </div>
  );
};

export default ChatWidget;