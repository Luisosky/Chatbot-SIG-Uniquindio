const axios = require('axios');
require('dotenv').config();
const sigKnowledge = require('../data/sigKnowledge');
const nodemailer = require('nodemailer');
const fs = require('fs').promises;
const path = require('path');

// Nueva función para listar documentos en la carpeta "documents"
const listDocuments = async () => {
    const documentsDir = path.join(__dirname, '..', '..', 'documents');
    try {
        const files = await fs.readdir(documentsDir);
        // Filtrar solo archivos PDF u otros que consideres
        const pdfFiles = files.filter(file => path.extname(file).toLowerCase() === '.pdf');
        return pdfFiles;
    } catch (error) {
        console.error("Error leyendo la carpeta de documentos:", error);
        throw new Error("No se pudo leer la carpeta de documentos.");
    }
};

// Crea un resumen del conocimiento disponible para el contexto del sistema
const createKnowledgeContext = () => {
  return sigKnowledge.map(doc => 
    `ID: ${doc.id}, Título: ${doc.topic}, Categoría: ${doc.category}`
  ).join('\n');
};

const SYSTEM_PROMPT = `Eres el Asistente Virtual del Sistema Integrado de Gestión (SIG) de la Universidad del Quindío. 
Tu rol es ayudar a estudiantes, profesores y personal administrativo a encontrar, entender y utilizar 
los documentos oficiales del SIG, guiándolos con un enfoque pedagógico y asistencial.

FUNCIONES PRINCIPALES:
1. ASISTENCIA DOCUMENTAL: Ayuda a localizar documentos específicos mediante preguntas guía.
2. GENERACIÓN DE RESÚMENES: Proporciona resúmenes concisos pero completos, aclarando siempre que son orientativos.
3. EXPLICACIÓN CONTEXTUAL: Explica cómo aplicar los documentos en situaciones prácticas.
4. INFORMACIÓN TEMPORAL: Relaciona documentos con fechas relevantes del calendario académico.
5. ESCALAMIENTO: Identifica cuándo una consulta excede tus capacidades y ofrece contacto con soporte humano.
6. ENVÍO POR CORREO: Puedes enviar documentos por correo electrónico cuando el usuario lo solicite.

DATOS SOBRE DOCUMENTOS DISPONIBLES:
${createKnowledgeContext()}

PAUTAS DE COMPORTAMIENTO:
- Usa preguntas guía para determinar qué documento necesita el usuario.
- Menciona siempre el ID y nombre completo del documento al referirte a él.
- Si generas resúmenes, aclara que son orientativos y recomienda la lectura completa del documento oficial.
- Si no tienes información suficiente sobre un tema, solicita más detalles o sugiere contactar al equipo SIG.
- Para consultas complejas o fuera de tu alcance, proporciona el correo contactenos@uniquindio.edu.co.
- Mantén tus respuestas concisas pero completas, utilizando un tono formal pero amigable.
- Cuando un usuario solicite enviar un documento por correo, solicita explícitamente su dirección de correo electrónico.

INSTRUCCIONES PARA ENVÍO DE CORREOS:
- Cuando un usuario solicite un documento por correo, primero verifica que el documento exista.
- Si el documento existe, solicita la dirección de correo electrónico del usuario.
- Una vez tengas el correo, confirma el envío y proporciona instrucciones para verificar la bandeja de entrada.
- Si hay algún error en el envío, proporciona alternativas como la descarga directa o contacto con soporte.

Cuando proporciones enlaces a documentos, usa siempre su URL exacta de los datos que tienes disponibles.`;

let conversationHistory = [];
let pendingEmailRequest = null;
// Añadir una cola de correos pendientes
let emailQueue = [];

const resetConversation = () => {
  conversationHistory = [];
};

const searchDocuments = (query) => {
  const keywords = query.toLowerCase().split(/\s+/);

  return sigKnowledge.filter(doc => {
    return keywords.some(word => 
      doc.keywords.some(k => k.includes(word)) ||
      doc.topic.toLowerCase().includes(word) ||
      doc.content.toLowerCase().includes(word)
    );
  });
};

const sendDocumentByEmail = async (email, documentId) => {
  try {
    // Si email es un array, procesar cada correo secuencialmente
    if (Array.isArray(email)) {
      console.log(`[${new Date().toISOString()}] Iniciando envío múltiple de documento ${documentId} a ${email.length} destinatarios`);
      
      const results = [];
      const failures = [];
      
      // Enviar a cada correo de forma secuencial
      for (const singleEmail of email) {
        try {
          const result = await sendDocumentByEmail(singleEmail, documentId);
          results.push({ email: singleEmail, ...result });
          // Esperar un pequeño intervalo entre envíos para no sobrecargar el servidor SMTP
          await new Promise(r => setTimeout(r, 1000));
        } catch (error) {
          console.error(`Error al enviar a ${singleEmail}:`, error.message);
          failures.push({ email: singleEmail, error: error.message });
        }
      }
      
      // Retornar resultados consolidados
      return {
        success: results.length > 0,
        totalSent: results.length,
        totalFailed: failures.length,
        successDetails: results,
        failureDetails: failures,
        timestamp: new Date().toISOString()
      };
    }
    
    console.log(`[${new Date().toISOString()}] Iniciando envío de documento ${documentId} a ${email}`);
    
    // Normalizar el ID (asegurar formato correcto)
    const normalizedId = documentId.trim().toUpperCase();
    
    // Buscar primero por ID exacto
    let document = sigKnowledge.find(doc => doc.id === normalizedId);
    
    // Si no encuentra, intentar buscar por ID parcial (sin prefijos)
    if (!document) {
      const idParts = normalizedId.split('-');
      const partialId = idParts.length > 1 ? idParts.slice(1).join('-') : normalizedId;
      document = sigKnowledge.find(doc => doc.id.includes(partialId));
      
      console.log(`Búsqueda por ID parcial: ${partialId}, Documento encontrado:`, document ? 'Sí' : 'No');
    }
    
    if (!document) {
      throw new Error(`Documento con ID ${documentId} no encontrado`);
    }
    
    // Definir variable para la ruta del archivo
    let filePath = null;
    
    // Verificar que el archivo exista antes de intentar enviarlo
    if (document.filePath) {
      try {
        console.log(`Verificando ruta del archivo: ${document.filePath}`);
        await fs.access(document.filePath);
        console.log(`✅ Archivo verificado correctamente: ${document.filePath}`);
        filePath = document.filePath;
      } catch (fileError) {
        console.error(`❌ El archivo no existe en la ruta principal: ${document.filePath}`);
      }
    } else {
      console.log('⚠️ No hay ruta de archivo definida para este documento');
    }
    
    // Si no existe en la ruta principal, intentar rutas alternativas
    if (!filePath) {
      const possiblePaths = [
        path.join(__dirname, '..', '..', 'documents', `${documentId}.pdf`),
        path.join(__dirname, '..', 'documents', `${documentId}.pdf`),
        path.join(__dirname, '..', '..', 'backend', 'documents', `${documentId}.pdf`),
        path.join(__dirname, '..', '..', 'data', 'documents', `${documentId}.pdf`)
      ];
      
      console.log('Intentando rutas alternativas:');
      for (const altPath of possiblePaths) {
        try {
          console.log(`- Verificando: ${altPath}`);
          await fs.access(altPath);
          console.log(`✅ Archivo encontrado en: ${altPath}`);
          filePath = altPath;
          break;
        } catch (e) {
          console.log(`  × No encontrado`);
        }
      }
    }
    
    // Si no se encontró el archivo en ninguna ruta
    if (!filePath) {
      console.warn('⚠️ No se encontró el archivo PDF para adjuntar');
      console.log('Enviando correo SIN ADJUNTO, solo con link de descarga');
    }
    
    // Crear el transporter
    console.log('Creando transporter para envío de correo...');
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      },
      tls: {
        rejectUnauthorized: false
      },
      debug: true
    });
    
    // Verificar la conexión
    await transporter.verify();
    console.log('✅ Conexión SMTP verificada');
    
    // Preparar opciones de correo
    const mailOptions = {
      from: `"SIG Uniquindío" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `Documento SIG: ${document.topic}`,
      html: `
        <h2>Sistema Integrado de Gestión - Universidad del Quindío</h2>
        <p>Estimado usuario,</p>
        <p>A continuación encontrará información sobre el documento <strong>${document.topic} (${document.id})</strong> que ha solicitado.</p>
        <p><strong>Resumen:</strong> ${document.summary}</p>
        <p>Para acceder directamente al documento, haga clic <a href="${document.downloadURL}">aquí</a>.</p>
        ${!filePath ? '<p><strong>NOTA:</strong> No ha sido posible adjuntar el archivo. Por favor use el enlace anterior para descargarlo.</p>' : ''}
        <p>Si requiere asistencia adicional, no dude en contactarnos a contactenos@uniquindio.edu.co</p>
        <p>Cordialmente,<br>Equipo SIG - Universidad del Quindío</p>
        <p><small>Enviado: ${new Date().toLocaleString()}</small></p>
      `
    };
    
    // Agregar adjunto solo si existe
    if (filePath) {
      mailOptions.attachments = [{ 
        filename: `${document.id}.pdf`, 
        path: filePath,
        contentType: 'application/pdf'
      }];
      console.log(`Agregando adjunto: ${filePath}`);
    }
    
    // Enviar el correo
    console.log('Enviando correo...');
    const info = await transporter.sendMail(mailOptions);
    
    // Log del resultado
    console.log('✅ Correo enviado correctamente:');
    console.log(`- ID del mensaje: ${info.messageId}`);
    console.log(`- Respuesta: ${info.response}`);
    
    return { 
      success: true, 
      messageId: info.messageId,
      withAttachment: !!filePath,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error(`❌ Error al enviar correo:`, error);
    
    // Mejorar mensajes de error específicos
    let errorMessage = 'Error al enviar el documento. ';
    
    if (error.code === 'EAUTH') {
      errorMessage += 'Error de autenticación con el servidor de correo. Las credenciales pueden ser incorrectas.';
    } else if (error.code === 'ENOENT') {
      errorMessage += 'El documento solicitado no fue encontrado en el sistema.';
    } else if (error.code === 'ESOCKET') {
      errorMessage += 'Problema de conexión con el servidor de correo.';
    } else if (error.code === 'ECONNREFUSED') {
      errorMessage += 'Conexión rechazada por el servidor de correo.';
    } else {
      errorMessage += `${error.message}`;
    }
    
    throw new Error(errorMessage);
  }
};

// Función auxiliar para obtener el tamaño de un archivo
const getFileSize = async (filePath) => {
  try {
    const stats = await fs.stat(filePath);
    return stats.size;
  } catch (error) {
    console.error(`Error al obtener tamaño del archivo: ${error.message}`);
    return 'desconocido';
  }
};

// Modificar la función sendToMistral para detectar múltiples correos
const sendToMistral = async (userMessage) => {
  // Mejorar la detección de intenciones de envío
  const sendIntentPattern = /(envi[ae]r|mandar)\s*(el)?\s*documento\s+([A-Z]+-[A-Z]+-[A-Z]+-\d{2})\s*(a|al|por)?\s*(correo)?/i;
  const sendIntentMatch = userMessage.match(sendIntentPattern);

  // Extraer todos los correos del mensaje
  const emailMatches = userMessage.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g) || [];
  
  // Si hay múltiples correos y una solicitud pendiente o un ID mencionado
  if (emailMatches.length > 1) {
    // Caso 1: Hay una solicitud pendiente de envío
    if (pendingEmailRequest) {
      try {
        const result = await sendDocumentByEmail(emailMatches, pendingEmailRequest.documentId);
        const response = `He enviado el documento ${pendingEmailRequest.documentId} a ${emailMatches.length} correos: ${emailMatches.join(', ')}. 
        Se enviaron correctamente ${result.totalSent} de ${emailMatches.length} correos.`;
        conversationHistory.push({ role: 'assistant', content: response });
        pendingEmailRequest = null;
        return response;
      } catch (error) {
        const errorMsg = `Lo siento, ocurrió un error al enviar el documento por correo. ${error.message}`;
        conversationHistory.push({ role: 'assistant', content: errorMsg });
        pendingEmailRequest = null;
        return errorMsg;
      }
    }
    
    // Caso 2: Hay un ID en el mensaje actual
    const idMatch = userMessage.match(/([A-Z]{3}-)?([A-Z]{3}-[A-Z]{3}-[A-Z]{3}-\d{2})/i);
    if (idMatch) {
      const docId = idMatch[0];
      const document = sigKnowledge.find(doc => doc.id === docId);
      if (document) {
        try {
          const result = await sendDocumentByEmail(emailMatches, docId);
          const response = `He enviado el documento ${docId} a ${emailMatches.length} correos: ${emailMatches.join(', ')}. 
          Se enviaron correctamente ${result.totalSent} de ${emailMatches.length} correos.`;
          conversationHistory.push({ role: 'assistant', content: response });
          return response;
        } catch (error) {
          const errorMsg = `Lo siento, no pude enviar el documento por correo. ${error.message}`;
          conversationHistory.push({ role: 'assistant', content: errorMsg });
          return errorMsg;
        }
      }
    }
    
    // Caso 3: Buscar ID reciente si se menciona envío
    if (userMessage.toLowerCase().includes('enviar') || 
        userMessage.toLowerCase().includes('mandar') || 
        userMessage.toLowerCase().includes('por correo')) {
      const recentDocId = findRecentDocumentId();
      if (recentDocId) {
        try {
          const result = await sendDocumentByEmail(emailMatches, recentDocId);
          const response = `He enviado el documento ${recentDocId} a ${emailMatches.length} correos: ${emailMatches.join(', ')}. 
          Se enviaron correctamente ${result.totalSent} de ${emailMatches.length} correos.`;
          conversationHistory.push({ role: 'assistant', content: response });
          return response;
        } catch (error) {
          const errorMsg = `Lo siento, no pude enviar el documento por correo. ${error.message}`;
          conversationHistory.push({ role: 'assistant', content: errorMsg });
          return errorMsg;
        }
      }
    }
  }

  if (sendIntentMatch) {
    const docId = sendIntentMatch[3]; // El ID está en el grupo de captura 3
    const document = sigKnowledge.find(doc => doc.id === docId);
    
    if (document) {
      const emailMatch = userMessage.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/)
      if (emailMatch) {
        // Si ya proporcionó el correo, enviar directamente
        try {
          await sendDocumentByEmail(emailMatch[0], docId);
          const response = `He enviado el documento ${docId} al correo ${emailMatch[0]}. Por favor, verifica tu bandeja de entrada en unos minutos.`;
          conversationHistory.push({ role: 'assistant', content: response });
          return response;
        } catch (error) {
          const errorMsg = `Lo siento, no pude enviar el documento por correo. ${error.message}`;
          conversationHistory.push({ role: 'assistant', content: errorMsg });
          return errorMsg;
        }
      } else {
        // Si no proporcionó el correo, solicitar y configurar pendingEmailRequest
        const response = `He encontrado el documento ${document.topic} (${docId}). Por favor, indícame tu dirección de correo electrónico para enviártelo.`;
        conversationHistory.push({ role: 'assistant', content: response });
        pendingEmailRequest = { documentId: docId };
        return response;
      }
    } else {
      const response = `Lo siento, no pude encontrar un documento con el ID ${docId}. Por favor, verifica el ID e intenta nuevamente.`;
      conversationHistory.push({ role: 'assistant', content: response });
      return response;
    }
  }

  // Si existe una intención de envío pero no hay solicitud pendiente, instruir al usuario
  if (!pendingEmailRequest && (userMessage.toLowerCase().includes('enviar documento') ||
      userMessage.toLowerCase().includes('por correo') ||
      userMessage.toLowerCase().includes('email'))) {
    const response = "Para enviar el documento a tu correo, primero por favor solicita el documento (por ejemplo, pidiendo su resumen) o indica el ID del documento que necesitas junto con tu dirección de correo.";
    conversationHistory.push({ role: 'assistant', content: response });
    return response;
  }

  // Verificar si hay solicitud de documento y correo en el mismo mensaje
  const emailMatch = userMessage.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  const idMatch = userMessage.match(/([A-Z]{3}-)?([A-Z]{3}-[A-Z]{3}-[A-Z]{3}-\d{2})/i);
  if (emailMatch && idMatch) {
    const docId = idMatch[0];
    const document = sigKnowledge.find(doc => doc.id === docId);
    if (document) {
      try {
        await sendDocumentByEmail(emailMatch[0], docId);
        const response = `He enviado el documento ${docId} al correo ${emailMatch[0]}. Por favor, verifica tu bandeja de entrada en unos minutos.`;
        conversationHistory.push({ role: 'assistant', content: response });
        return response;
      } catch (error) {
        const errorMsg = `Lo siento, no pude enviar el documento por correo. ${error.message}. Por favor, intenta descargar directamente desde el enlace o contacta a contactenos@uniquindio.edu.co`;
        conversationHistory.push({ role: 'assistant', content: errorMsg });
        return errorMsg;
      }
    }
  }

  // Si el mensaje contiene un correo pero sin ID específico, y hay una mención de envío
  if (emailMatch && (userMessage.toLowerCase().includes('enviar') || 
                    userMessage.toLowerCase().includes('mandar') || 
                    userMessage.toLowerCase().includes('por correo'))) {
    // Buscar en la conversación reciente si se mencionó algún ID de documento
    const recentDocId = findRecentDocumentId();
    if (recentDocId) {
      try {
        await sendDocumentByEmail(emailMatch[0], recentDocId);
        const response = `He enviado el documento ${recentDocId} al correo ${emailMatch[0]}. Por favor, verifica tu bandeja de entrada en unos minutos.`;
        conversationHistory.push({ role: 'assistant', content: response });
        return response;
      } catch (error) {
        const errorMsg = `Lo siento, no pude enviar el documento por correo. ${error.message}. Por favor, inténtalo de nuevo o contacta a contactenos@uniquindio.edu.co`;
        conversationHistory.push({ role: 'assistant', content: errorMsg });
        return errorMsg;
      }
    } else {
      const response = "Por favor, específica qué documento necesitas enviar por correo (por ejemplo, el ID del documento).";
      conversationHistory.push({ role: 'assistant', content: response });
      return response;
    }
  }

  // Patrón para solicitudes específicas de un documento que requieren resumen
  const specificDocPattern = /(?:muestrame|resume|mostrar|mostrame|quiero información sobre|dame detalles de|información de)(?:\s*el)?\s*documento\s+([A-Z]+-[A-Z]+-[A-Z]+-\d{2})/i;
  const specificDocMatch = userMessage.match(specificDocPattern);
  if (specificDocMatch) {
    const docId = specificDocMatch[1];
    const document = sigKnowledge.find(doc => doc.id === docId);
    if (document) {
      const responseText = 
        `Documento ${document.topic} (${document.id}):\n\n` +
        `Resumen: ${document.summary}\n\n` +
        `URL: ${document.downloadURL}\n\n` +
        `¿Deseas que te envíe el documento completo a tu correo institucional?`;
      conversationHistory.push({ role: 'assistant', content: responseText });
      // Almacenar la solicitud pendiente para envío por correo
      pendingEmailRequest = { documentId: document.id };
      return responseText;
    }
  }
  
  // También agregar la misma funcionalidad en búsquedas genéricas que encuentran un documento específico
  if (userMessage.toLowerCase().includes('resumen') || 
      userMessage.toLowerCase().includes('información sobre') || 
      userMessage.toLowerCase().includes('datos de') || 
      userMessage.toLowerCase().includes('detalles de')) {
    
    const relatedDocs = searchDocuments(userMessage);
    
    // Si solo hay un documento relacionado, ofrecer enviar por correo
    if (relatedDocs.length === 1) {
      const document = relatedDocs[0];
      const responseText = 
        `Documento ${document.topic} (${document.id}):\n\n` +
        `Resumen: ${document.summary}\n\n` +
        `URL: ${document.downloadURL}\n\n` +
        `¿Deseas que te envíe el documento completo a tu correo institucional?`;
      conversationHistory.push({ role: 'assistant', content: responseText });
      // Almacenar la solicitud pendiente para envío por correo
      pendingEmailRequest = { documentId: document.id };
      return responseText;
    }
  }
  
  // Si hay una solicitud pendiente y el usuario responde afirmativamente
  if (pendingEmailRequest && /^(s[ií]|claro|por supuesto|afirmativo|envía|envíame|ok|dale)/i.test(userMessage.trim())) {
    const emailMatch = userMessage.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
    if (emailMatch) {
      // El usuario respondió "sí" y proporcionó su correo
      try {
        await sendDocumentByEmail(emailMatch[0], pendingEmailRequest.documentId);
        const response = `He enviado el documento ${pendingEmailRequest.documentId} al correo ${emailMatch[0]}. Por favor, revisa tu bandeja de entrada.`;
        conversationHistory.push({ role: 'assistant', content: response });
        pendingEmailRequest = null;
        return response;
      } catch (error) {
        const errorMsg = `Lo siento, no pude enviar el documento por correo. ${error.message}`;
        conversationHistory.push({ role: 'assistant', content: errorMsg });
        pendingEmailRequest = null;
        return errorMsg;
      }
    } else {
      // El usuario respondió "sí" pero no proporcionó su correo
      const response = "Por favor, indícame tu dirección de correo electrónico para enviarte el documento.";
      conversationHistory.push({ role: 'assistant', content: response });
      return response;
    }
  }
  
  // Agregar mensaje del usuario al historial
  conversationHistory.push({ role: 'user', content: userMessage });
  
  // Buscar documentos relacionados con la consulta
  const relatedDocs = searchDocuments(userMessage);
  let contextInfo = '';
  if (relatedDocs.length > 0) {
    contextInfo = 'Documentos relacionados con esta consulta:\n' + 
      relatedDocs.slice(0, 3).map(doc => 
        `ID: ${doc.id}, Título: ${doc.topic}, URL: ${doc.downloadURL}, Resumen: ${doc.summary}`
      ).join('\n\n');
  }
  
  const messages = [
    { role: 'system', content: SYSTEM_PROMPT },
    ...conversationHistory.slice(-8),
    contextInfo ? { role: 'system', content: contextInfo } : null
  ].filter(Boolean);
  
  const response = await axios.post(
    process.env.MISTRAL_API_URL, 
    {
      model: 'mistral-large-latest',
      messages: messages,
      temperature: 0.4,
      max_tokens: 800
    },
    {
      headers: {
        'Authorization': `Bearer ${process.env.MISTRAL_API_KEY}`,
        'Content-Type': 'application/json'
      }
    }
  );
  
  const botResponse = response.data.choices[0].message.content;
  conversationHistory.push({ role: 'assistant', content: botResponse });
  
  return botResponse;
};

// Función auxiliar para buscar el ID de documento más reciente mencionado en la conversación
function findRecentDocumentId() {
  // Buscar en los últimos 6 mensajes de la conversación
  for (let i = conversationHistory.length - 1; i >= Math.max(0, conversationHistory.length - 6); i--) {
    const message = conversationHistory[i];
    // Buscar patrones de ID de documento con el formato correcto VIG-SGL-BPM-INT-08
    const idMatch = message.content.match(/([A-Z]{3}-[A-Z]{3}-[A-Z]{3}-\d{2})/i);
    if (idMatch) {
      return idMatch[0];
    }
  }
  return null;
}

module.exports = {
  sendToMistral,
  resetConversation,
  sendDocumentByEmail,
  searchDocuments
};