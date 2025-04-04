const axios = require('axios');
require('dotenv').config();
const sigKnowledge = require('../data/sigKnowledge');
const nodemailer = require('nodemailer');

const MISTRAL_API_KEY = process.env.MISTRAL_API_KEY;
const MISTRAL_API_URL = 'https://api.mistral.ai/v1/chat/completions';

// Crea un resumen del conocimiento disponible para el contexto del sistema
const createKnowledgeContext = () => {
  return sigKnowledge.map(doc => 
    `ID: ${doc.id}, Título: ${doc.topic}, Categoría: ${doc.category}`
  ).join('\n');
};

// Contexto del sistema mejorado para el asistente
const SYSTEM_PROMPT = `Eres el Asistente Virtual del Sistema Integrado de Gestión (SIG) de la Universidad del Quindío. 
Tu rol es ayudar a estudiantes, profesores y personal administrativo a encontrar, entender y utilizar 
los documentos oficiales del SIG, guiándolos con un enfoque pedagógico y asistencial.

FUNCIONES PRINCIPALES:
1. ASISTENCIA DOCUMENTAL: Ayuda a localizar documentos específicos mediante preguntas guía.
2. GENERACIÓN DE RESÚMENES: Proporciona resúmenes concisos pero completos, aclarando siempre que son orientativos.
3. EXPLICACIÓN CONTEXTUAL: Explica cómo aplicar los documentos en situaciones prácticas.
4. INFORMACIÓN TEMPORAL: Relaciona documentos con fechas relevantes del calendario académico.
5. ESCALAMIENTO: Identifica cuándo una consulta excede tus capacidades y ofrece contacto con soporte humano.

DATOS SOBRE DOCUMENTOS DISPONIBLES:
${createKnowledgeContext()}

PAUTAS DE COMPORTAMIENTO:
- Usa preguntas guía para determinar qué documento necesita el usuario.
- Menciona siempre el ID y nombre completo del documento al referirte a él.
- Si generas resúmenes, aclara que son orientativos y recomienda la lectura completa del documento oficial.
- Si no tienes información suficiente sobre un tema, solicita más detalles o sugiere contactar al equipo SIG.
- Para consultas complejas o fuera de tu alcance, proporciona el correo soporte.sig@uniquindio.edu.co.
- Mantén tus respuestas concisas pero completas, utilizando un tono formal pero amigable.

Cuando proporciones enlaces a documentos, usa siempre su URL exacta de los datos que tienes disponibles.`;

// Historial de conversación para mantener contexto
let conversationHistory = [];

// Función para reiniciar el historial de conversación
const resetConversation = () => {
  conversationHistory = [];
};

// Función para buscar documentos por palabras clave
const searchDocuments = (query) => {
  const keywords = query.toLowerCase().split(/\s+/);
  return sigKnowledge.filter(doc => {
    // Buscar en keywords, topic y content
    return keywords.some(word => 
      doc.keywords.some(k => k.includes(word)) ||
      doc.topic.toLowerCase().includes(word) ||
      doc.content.toLowerCase().includes(word)
    );
  });
};

// Función para enviar correo electrónico con documento
const sendDocumentByEmail = async (email, documentId) => {
  try {
    const document = sigKnowledge.find(doc => doc.id === documentId);
    if (!document) {
      throw new Error(`Documento con ID ${documentId} no encontrado`);
    }
    
    // Configuración del transporte de correo
    const transporter = nodemailer.createTransport({
      service: 'gmail', // O el que sea
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
    
    // Configuración del correo
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: `Documento SIG: ${document.topic}`,
      html: `
        <h2>Sistema Integrado de Gestión - Universidad del Quindío</h2>
        <p>Estimado usuario,</p>
        <p>Adjunto encontrará el documento <strong>${document.topic} (${document.id})</strong> que ha solicitado.</p>
        <p><strong>Resumen:</strong> ${document.summary}</p>
        <p>Para acceder directamente al documento, haga clic <a href="${document.downloadURL}">aquí</a>.</p>
        <p>Si requiere asistencia adicional, no dude en contactarnos a soporte.sig@uniquindio.edu.co</p>
        <p>Cordialmente,<br>Equipo SIG - Universidad del Quindío</p>
      `,
      // Acceso fisico al documento (opcional)
      // attachments: [{ filename: `${document.id}.pdf`, path: document.filePath }]
    };
    
    // Enviar correo
    const info = await transporter.sendMail(mailOptions);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error al enviar correo:', error);
    throw new Error('No se pudo enviar el documento por correo electrónico');
  }
};

// Función principal para enviar mensaje a MistralAI
const sendToMistral = async (userMessage) => {
  try {
    // Agregar mensaje del usuario al historial
    conversationHistory.push({ role: 'user', content: userMessage });
    
    // Verificar si es una solicitud especial
    if (userMessage.toLowerCase().includes('enviar documento') || 
        userMessage.toLowerCase().includes('por correo') || 
        userMessage.toLowerCase().includes('email')) {
      // Extraer información
      const emailMatch = userMessage.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
      const idMatch = userMessage.match(/([A-Z]+-[A-Z]+-\d+)/i);
      
      if (emailMatch && idMatch) {
        try {
          await sendDocumentByEmail(emailMatch[0], idMatch[0]);
          const response = `He enviado el documento ${idMatch[0]} al correo ${emailMatch[0]}. Por favor, verifica tu bandeja de entrada en unos minutos.`;
          conversationHistory.push({ role: 'assistant', content: response });
          return response;
        } catch (error) {
          const errorMsg = `Lo siento, no pude enviar el documento por correo. ${error.message}. Por favor, intenta descargar directamente desde el enlace o contacta a soporte.sig@uniquindio.edu.co`;
          conversationHistory.push({ role: 'assistant', content: errorMsg });
          return errorMsg;
        }
      }
    }

    // Buscar documentos relacionados con la consulta
    const relatedDocs = searchDocuments(userMessage);
    
    // Añadir información de contexto si hay documentos relacionados
    let contextInfo = '';
    if (relatedDocs.length > 0) {
      contextInfo = 'Documentos relacionados con esta consulta:\n' + 
        relatedDocs.slice(0, 3).map(doc => 
          `ID: ${doc.id}, Título: ${doc.topic}, URL: ${doc.downloadURL}, Resumen: ${doc.summary}`
        ).join('\n\n');
    }
    
    // Preparar mensajes para enviar a MistralAI (incluye sistema + historial + contexto)
    const messages = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...conversationHistory.slice(-8), // Últimos mensajes
      contextInfo ? { role: 'system', content: contextInfo } : null
    ].filter(Boolean);
    
    // Llamar a la API de MistralAI
    const response = await axios.post(
      MISTRAL_API_URL, 
      {
        model: 'mistral-large-latest',
        messages: messages,
        temperature: 0.4,
        max_tokens: 800
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
  resetConversation,
  sendDocumentByEmail,
  searchDocuments
};