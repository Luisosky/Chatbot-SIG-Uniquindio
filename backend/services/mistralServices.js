const axios = require('axios');
require('dotenv').config();

const MISTRAL_API_KEY = process.env.MISTRAL_API_KEY;
const MISTRAL_API_URL = 'https://api.mistral.ai/v1/chat/completions';

// Contexto del sistema para el asistente
const SYSTEM_PROMPT = `Eres el Asistente Virtual del Sistema Integrado de Gestión (SIG) de la Universidad del Quindío. 
Tu rol es ayudar a estudiantes, profesores y personal administrativo a encontrar, entender y utilizar 
los documentos oficiales del SIG, guiándolos con un enfoque pedagógico y asistencial.
Mantén tus respuestas concisas, informativas y relevantes al contexto universitario.`;

// Historial de conversación para mantener contexto
let conversationHistory = [];

// Función para reiniciar el historial de conversación
const resetConversation = () => {
  conversationHistory = [];
};

// Función para enviar mensaje a MistralAI
const sendToMistral = async (userMessage) => {
  try {
    // Agregar mensaje del usuario al historial
    conversationHistory.push({ role: 'user', content: userMessage });
    
    // Preparar mensajes para enviar a MistralAI (incluye sistema + historial)
    const messages = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...conversationHistory.slice(-10) // Mantener solo los últimos 10 mensajes para evitar tokens excesivos
    ];
    
    // Llamar a la API de MistralAI
    const response = await axios.post(
      MISTRAL_API_URL, 
      {
        model: 'mistral-large-latest', // Puedes cambiar al modelo que prefieras
        messages: messages,
        temperature: 0.3, // Valor bajo para respuestas más consistentes
        max_tokens: 500 // Limitar longitud de respuesta
      },
      {
        headers: {
          'Authorization': `Bearer ${MISTRAL_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    // Extraer la respuesta
    const botResponse = response.data.choices[0].message.content;
    
    // Agregar respuesta del bot al historial
    conversationHistory.push({ role: 'assistant', content: botResponse });
    
    return botResponse;
  } catch (error) {
    console.error('Error llamando a MistralAI:', error.response?.data || error.message);
    throw new Error('Error al procesar tu solicitud con MistralAI');
  }
};

module.exports = {
  sendToMistral,
  resetConversation
};