const express = require('express');
const router = express.Router();
const { sendToMistral, resetConversation } = require('../services/mistralService');

// Endpoint principal para interactuar con el chatbot
router.post('/chat', async (req, res) => {
  try {
    const { message, sender } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'El mensaje es requerido' });
    }
    
    // Obtener respuesta de MistralAI
    const response = await sendToMistral(message);
    
    // Formatear respuesta similar a la que espera tu frontend
    const formattedResponse = [{
      text: response,
      // Botones específicos de la respuesta (por medio de preguntas de lista)
    }];
    
    res.json(formattedResponse);
  } catch (error) {
    console.error('Error en el endpoint de chat:', error);
    res.status(500).json({ 
      error: 'Error al procesar tu solicitud',
      detail: error.message
    });
  }
});

// Endpoint para reiniciar conversación
router.post('/reset', (req, res) => {
  resetConversation();
  res.json({ success: true, message: 'Conversación reiniciada' });
});

module.exports = router;