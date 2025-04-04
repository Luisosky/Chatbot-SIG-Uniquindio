const express = require('express');
const cors = require('cors');
require('dotenv').config();
const chatRoutes = require('./routes/chatBotRoutes');
const { sendToMistral } = require('./services/mistralServices');

const app = express();
const PORT = process.env.PORT || 5005;

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas
app.use('/api', chatRoutes);

// Mantener compatibilidad con la ruta antigua de Rasa
app.post('/webhooks/rest/webhook', async (req, res) => {
  try {
    const { message } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'El mensaje es requerido' });
    }
    
    const response = await sendToMistral(message);
    
    // Analizar si hay comandos especiales en la respuesta
    let buttons = [];
    
    // Detectar IDs de documentos mencionados
    const docIds = [...response.matchAll(/([A-Z]+-[A-Z]+-\d+)/g)].map(match => match[0]);
    if (docIds.length > 0) {
      // Eliminar duplicados
      const uniqueIds = [...new Set(docIds)];
      
      // Buscar información de cada documento
      const sigKnowledge = require('./data/sigKnowledge');
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
    
    res.json([{
      text: response,
      buttons: buttons.length > 0 ? buttons : undefined
    }]);
  } catch (error) {
    console.error('Error en webhook:', error);
    res.status(500).json([{ 
      text: 'Lo siento, tuve un problema al procesar tu solicitud. Por favor, inténtalo de nuevo.'
    }]);
  }
});

app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en el puerto ${PORT}`);
});