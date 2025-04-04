/**
 * Base de conocimiento sobre el SIG para el contexto del chatbot
 * Estructura diseñada para facilitar la búsqueda y entrega de documentos
 */

const sigKnowledge = [
    {
      id: "SIG-POL-001",
      topic: "Política de Calidad",
      content: "La Universidad del Quindío está comprometida con una cultura de alta calidad en sus procesos académicos y administrativos...",
      summary: "Documento que establece el compromiso institucional con la excelencia y mejora continua en todos los procesos académicos y administrativos.",
      applicationContext: "Base para auditorías internas y procesos de acreditación institucional",
      relevantDates: ["15 de marzo: Inicio auditoría interna", "30 de septiembre: Revisión anual"],
      downloadURL: "https://sig.uniquindio.edu.co/documentos/politica-calidad.pdf",
      relatedDocuments: ["SIG-MAN-001", "SIG-PRO-005"],
      category: "Políticas",
      keywords: ["calidad", "política", "acreditación", "mejora continua"]
    },
    {
      id: "SIG-MAN-001",
      topic: "Manual de Calidad",
      content: "Este manual describe el Sistema Integrado de Gestión de la Universidad del Quindío, su alcance...",
      summary: "Documento marco que describe la estructura, componentes y funcionamiento del Sistema Integrado de Gestión.",
      applicationContext: "Guía principal para entender cómo está conformado el SIG y cómo los procesos se interrelacionan",
      relevantDates: [],
      downloadURL: "https://sig.uniquindio.edu.co/documentos/manual-calidad.pdf",
      relatedDocuments: ["SIG-POL-001", "SIG-PRO-001"],
      category: "Manuales",
      keywords: ["manual", "procesos", "sistema", "gestión"]
    },
    {
      id: "SIG-PRO-001",
      topic: "Procedimiento de Control de Documentos",
      content: "Este procedimiento establece las directrices para la elaboración, revisión, aprobación, actualización...",
      summary: "Define cómo se crean, modifican y controlan los documentos oficiales del SIG.",
      applicationContext: "Aplica cuando se necesite crear o modificar cualquier documento del sistema",
      relevantDates: [],
      downloadURL: "https://sig.uniquindio.edu.co/documentos/proc-control-documentos.pdf",
      relatedDocuments: ["SIG-FOR-001", "SIG-INS-002"],
      category: "Procedimientos",
      keywords: ["documentos", "control", "versiones", "formatos"]
    },
    {
      id: "SIG-PRO-005",
      topic: "Procedimiento de Auditorías Internas",
      content: "Este procedimiento define las actividades necesarias para planificar y ejecutar las auditorías internas...",
      summary: "Establece cómo se planifican y realizan las auditorías internas para verificar la conformidad del SIG.",
      applicationContext: "Se utiliza durante la preparación y ejecución del programa anual de auditorías",
      relevantDates: ["Febrero: Planificación anual de auditorías", "Mayo-Junio: Primer ciclo de auditorías", "Octubre-Noviembre: Segundo ciclo de auditorías"],
      downloadURL: "https://sig.uniquindio.edu.co/documentos/proc-auditorias.pdf",
      relatedDocuments: ["SIG-FOR-010", "SIG-FOR-011"],
      category: "Procedimientos",
      keywords: ["auditoría", "conformidad", "hallazgos", "mejora"]
    },
    {
      id: "SIG-FOR-010",
      topic: "Formato Plan de Auditoría",
      content: "Formato utilizado para la planificación detallada de cada auditoría interna...",
      summary: "Plantilla para documentar el plan específico de una auditoría.",
      applicationContext: "Debe completarse y comunicarse a los auditados al menos una semana antes de la auditoría",
      relevantDates: [],
      downloadURL: "https://sig.uniquindio.edu.co/documentos/formato-plan-auditoria.docx",
      relatedDocuments: ["SIG-PRO-005"],
      category: "Formatos",
      keywords: ["auditoría", "plan", "formato"]
    },
    {
      id: "CAL-ACA-001",
      topic: "Calendario Académico",
      content: "Establece las fechas oficiales para los procesos académicos del año lectivo...",
      summary: "Documento que define todas las fechas relevantes del ciclo académico universitario.",
      applicationContext: "Guía para estudiantes y profesores sobre fechas críticas del semestre",
      relevantDates: ["Enero y Julio: Matrículas", "Junio y Diciembre: Finalización de semestre"],
      downloadURL: "https://uniquindio.edu.co/calendario-academico.pdf",
      relatedDocuments: [],
      category: "Académicos",
      keywords: ["calendario", "fechas", "semestre", "matrícula"]
    },
    {
      id: "SIG-PRO-010",
      topic: "Procedimiento de Gestión de PQRS",
      content: "Este procedimiento describe el proceso para recibir, gestionar y responder a las peticiones, quejas, reclamos y sugerencias...",
      summary: "Define cómo se manejan las PQRS recibidas por cualquier canal institucional.",
      applicationContext: "Se aplica cuando un usuario interno o externo presenta una PQRS",
      relevantDates: [],
      downloadURL: "https://sig.uniquindio.edu.co/documentos/proc-pqrs.pdf",
      relatedDocuments: ["SIG-FOR-020"],
      category: "Procedimientos",
      keywords: ["PQRS", "quejas", "peticiones", "reclamos", "sugerencias"]
    },
    {
      id: "SIG-GUI-001",
      topic: "Guía de Indicadores de Gestión",
      content: "Esta guía describe la metodología para establecer, medir y analizar los indicadores de gestión de los procesos...",
      summary: "Explica cómo definir y utilizar indicadores para medir el desempeño de los procesos.",
      applicationContext: "Se consulta al diseñar indicadores o al analizar resultados de medición",
      relevantDates: ["Trimestral: Reporte de indicadores", "Diciembre: Revisión anual de indicadores"],
      downloadURL: "https://sig.uniquindio.edu.co/documentos/guia-indicadores.pdf",
      relatedDocuments: ["SIG-FOR-030"],
      category: "Guías",
      keywords: ["indicadores", "medición", "desempeño", "procesos"]
    }
  ];
  
  module.exports = sigKnowledge;