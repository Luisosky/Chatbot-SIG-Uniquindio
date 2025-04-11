const path = require('path');

/**
 * Base de conocimiento sobre el SIG para el contexto del chatbot
 * Estructura diseñada para facilitar la búsqueda y entrega de documentos
 */

const sigKnowledge = [
  {
    id: "VIG-SGL-BPM-INT-08",
    topic: "Instructivo de Capacitación en Plantas Piloto",
    content: "Contenido extraído del PDF: El documento establece de forma contundente que la capacitación en las plantas piloto de la Universidad del Quindío tiene como fin desarrollar competencias en personal y estudiantes para garantizar la calidad e inocuidad de los alimentos, definiendo su aplicación para todo el personal operativo y estudiantil; además, incluye definiciones clave (como alimento contaminado, Buenas Prácticas de Manufactura, desinfección, higiene, inocuidad, manipulador de alimentos, peligro, riesgos y vigilancia epidemiológica), detalla el desarrollo de la capacitación a través de cursos y temas específicos (hábitos higiénicos, seguridad en las prácticas, identificación de riesgos, limpieza y desinfección) respaldados por la documentación obligatoria (registros, evaluaciones y cronograma anual), y se fundamenta en normativas y estándares internacionales, como la Resolución 2674/2013 e ISO 22000:2018, concluyendo con controles precisos mediante fichas y evaluaciones para asegurar un proceso integral y riguroso.",
    summary: "Documento que detalla el manejo administrativo de bienes y la capacitación en plantas piloto, abarcando objetivos, definiciones y procedimientos.",
    applicationContext: "Capacitación del personal operativo y estudiantes del SIG en la Universidad del Quindío",
    relevantDates: ["2024/02/01"],
    downloadURL: "https://intraweb2024.uniquindio.edu.co/index.php?option=com_formasonline&formasonlineform=Documentos_pub",
    filePath: path.join(__dirname, '..', '..', 'documents', 'VIG-SGL-BPM-INT-08.pdf'),
    relatedDocuments: [],
    category: "Capacitación",
    keywords: ["capacitación", "plantas piloto", "instructivo", "SIG", "universidad"]
  }
];

  
  module.exports = sigKnowledge;