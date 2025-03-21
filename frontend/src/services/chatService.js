const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

/**
 * Genera un ID de sesión único
 * @returns {string} - ID de sesión generado
 */
export const generateSessionId = () => {
  return 'user-' + Math.random().toString(36).substring(2, 15);
};

/**
 * Envía un mensaje al chatbot y devuelve la respuesta
 * @param {string} message - El mensaje del usuario
 * @param {string} senderId - ID del usuario (ahora es valor fijo)
 * @returns {Promise<Array>} - Array con las respuestas del bot
 */
export const sendMessage = async (message, senderId = 'anonymous-user') => {
  try {
    // Simulación de respuesta para desarrollo local
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          {
            text: `Esto es una respuesta simulada para: "${message}"`,
            buttons: [
              { title: "Ver más información", payload: "más info" },
              { title: "Buscar documento", payload: "buscar documento" }
            ]
          }
        ]);
      }, 1000);
    });
    
    // Código real para cuando el backend esté disponible:
    /*
    const response = await fetch(`${API_URL}/webhooks/rest/webhook`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: message,
        sender_id: senderId
      }),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    return await response.json();
    */
  } catch (error) {
    console.error('Error en chatService:', error);
    throw error;
  }
};

/**
 * Inicializa una conexión WebSocket para chat en tiempo real (opcional)
 * @param {function} onMessage - Callback para mensajes recibidos
 * @returns {WebSocket} - Objeto WebSocket
 */
export const initWebSocket = (onMessage) => {
  // Simulación de WebSocket para desarrollo
  console.log('WebSocket simulado inicializado');
  return {
    close: () => console.log('WebSocket simulado cerrado')
  };
  
  // Código real para cuando el backend esté disponible:
  /*
  const fixedUserId = 'anonymous-user';
  const ws = new WebSocket(`ws://${API_URL.replace('http://', '')}/ws/${fixedUserId}`);
  
  ws.onopen = () => {
    console.log('Conexión WebSocket establecida');
  };
  
  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    onMessage(data);
  };
  
  ws.onerror = (error) => {
    console.error('Error en WebSocket:', error);
  };
  
  return ws;
  */
};