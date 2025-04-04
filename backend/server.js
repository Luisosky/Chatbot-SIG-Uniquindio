const express = require('express');
const cors = require('cors');
require('dotenv').config();
const chatRoutes = require('./routes/chatRoutes');

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
    
    res.json([{
      text: response,
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