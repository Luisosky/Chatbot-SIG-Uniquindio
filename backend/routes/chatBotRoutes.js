const express = require('express');
const router = express.Router();
const { 
  sendToMistral, 
  resetConversation,
  sendDocumentByEmail,
  searchDocuments
} = require('../services/mistralServices');
const sigKnowledge = require('../data/sigKnowledge');

// Endpoint principal para interactuar con el chatbot
router.post('/chat', async (req, res) => {
  try {
    const { message, sender } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'El mensaje es requerido' });
    }
    
    // Obtener respuesta de MistralAI
    const response = await sendToMistral(message);
    
    // Analizar si hay comandos especiales en la respuesta
    let buttons = [];
    
    // Si la respuesta sugiere documentos, agregar botones
    const docIds = [...response.matchAll(/([A-Z]+-[A-Z]+-\d+)/g)].map(match => match[0]);
    if (docIds.length > 0) {
      // Convertir IDs detectados en botones de documentos
      const uniqueIds = [...new Set(docIds)];
      uniqueIds.forEach(id => {
        const doc = sigKnowledge.find(d => d.id === id);
        if (doc) {
          buttons.push({
            text: `Descargar ${doc.id}`,
            value: `Quiero descargar el documento ${doc.id}`
          });
          buttons.push({
            text: `Resumen de ${doc.id}`,
            value: `Dame un resumen del documento ${doc.id}`
          });
        }
      });
    }
    
    // Detectar si la respuesta menciona contactar a soporte
    if (response.includes('Por favor remita su solicitud al CSU, https://www.uniquindio.edu.co/csu/')) {
      buttons.push({
        text: 'Contactar soporte',
        value: 'Quiero contactar al soporte técnico'
      });
    }
    
    // Formatear respuesta para el frontend
    const formattedResponse = [{
      text: response,
      buttons: buttons.length > 0 ? buttons : undefined
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

// Endpoint para buscar documentos
router.get('/documents/search', (req, res) => {
  try {
    const { query } = req.query;
    if (!query) {
      return res.status(400).json({ error: 'El parámetro de búsqueda es requerido' });
    }
    
    const results = searchDocuments(query);
    res.json({ results });
  } catch (error) {
    console.error('Error en búsqueda de documentos:', error);
    res.status(500).json({ error: 'Error al buscar documentos' });
  }
});

// Endpoint para obtener detalles de un documento
router.get('/documents/:id', (req, res) => {
  try {
    const { id } = req.params;
    const document = sigKnowledge.find(doc => doc.id === id);
    
    if (!document) {
      return res.status(404).json({ error: `Documento con ID ${id} no encontrado` });
    }
    
    res.json({ document });
  } catch (error) {
    console.error('Error al obtener documento:', error);
    res.status(500).json({ error: 'Error al obtener el documento' });
  }
});

// Endpoint para enviar documento por correo
router.post('/documents/send-email', async (req, res) => {
  try {
    const { email, documentId } = req.body;
    
    if (!email || !documentId) {
      return res.status(400).json({ error: 'Se requiere email y documentId' });
    }
    
    const result = await sendDocumentByEmail(email, documentId);
    res.json({ success: true, result });
  } catch (error) {
    console.error('Error al enviar documento por correo:', error);
    res.status(500).json({ error: 'Error al enviar el documento por correo' });
  }
});

// Endpoint para solicitar contacto con soporte humano
router.post('/support-request', (req, res) => {
  try {
    const { email, name, issue } = req.body;
    
    if (!email || !issue) {
      return res.status(400).json({ error: 'Se requiere email y descripción del problema' });
    }
    
    // Lógica para registrar la solicitud
    // Por ejemplo, guardar en base de datos o enviar correo al equipo de soporte
    
    res.json({ 
      success: true, 
      message: 'Solicitud recibida. Un especialista se pondrá en contacto contigo pronto.',
      ticketId: `SR-${Date.now()}`
    });
  } catch (error) {
    console.error('Error al procesar solicitud de soporte:', error);
    res.status(500).json({ error: 'Error al procesar la solicitud de soporte' });
  }
});

module.exports = router;