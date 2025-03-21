import React from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '../components/UI/Header';
import Footer from '../components/UI/Footer';
import '../styles/DocumentPage.css';

const DocumentPage = () => {
  const { documentId } = useParams();
  
  // Datos simulados del documento
  const document = {
    id: documentId,
    code: 'MAN-001',
    title: 'Manual de Calidad Académica',
    type: 'Manual',
    version: '2.0',
    creationDate: '2024-10-15',
    lastUpdate: '2025-01-20',
    system: {
      id: 'siac',
      code: 'SIAC',
      name: 'Sistema Interno de Aseguramiento de la Calidad'
    },
    process: {
      id: 'proc1',
      name: 'Gestión de Calidad Académica'
    },
    description: 'Este manual establece los lineamientos y directrices para asegurar la calidad académica en todos los programas ofrecidos por la Universidad del Quindío.',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam in dui mauris. Vivamus hendrerit arcu sed erat molestie vehicula. Sed auctor neque eu tellus rhoncus ut eleifend nibh porttitor. Ut in nulla enim. Phasellus molestie magna non est bibendum non venenatis nisl tempor. Suspendisse dictum feugiat nisl ut dapibus. Mauris iaculis porttitor posuere. Praesent id metus massa, ut blandit odio. Proin quis tortor orci. Etiam at risus et justo dignissim congue.',
    author: 'Comité de Calidad Académica',
    approver: 'Vicerrectoría Académica',
    tags: ['calidad', 'académica', 'lineamientos', 'manual'],
    viewCount: 152,
    downloadCount: 87,
    url: '#' // URL ficticia
  };
  
  // Datos simulados de documentos relacionados
  const relatedDocs = [
    { id: 'doc2', code: 'PRO-002', title: 'Procedimiento de Revisión Curricular', type: 'Procedimiento', version: '1.3' },
    { id: 'doc3', code: 'FOR-003', title: 'Formato de Evaluación de Programas', type: 'Formato', version: '1.0' },
    { id: 'doc4', code: 'INS-004', title: 'Instructivo para Rediseño Curricular', type: 'Instructivo', version: '1.1' },
  ];
  
  return (
    <div className="document-page">
      <Header />
      
      <main className="document-content">
        <div className="document-layout">
          <div className="document-sidebar">
            <div className="breadcrumb">
              <Link to="/systems">Sistemas</Link> &gt; 
              <Link to={`/systems/${document.system.id}`}>{document.system.name}</Link> &gt;
              <Link to={`/systems/${document.system.id}/processes/${document.process.id}`}>
                {document.process.name}
              </Link> &gt;
              <span>Documento</span>
            </div>
            
            <h1 className="document-title">
              <span className="document-code">{document.code}</span>
              {document.title}
            </h1>
            
            <div className="document-type-badge" data-type={document.type.toLowerCase()}>
              {document.type}
            </div>
            
            <div className="document-info">
              <div className="info-section">
                <h3>Información General</h3>
                <div className="info-grid">
                  <div className="info-label">Sistema:</div>
                  <div className="info-value">{document.system.name}</div>
                  
                  <div className="info-label">Proceso:</div>
                  <div className="info-value">{document.process.name}</div>
                  
                  <div className="info-label">Versión:</div>
                  <div className="info-value">{document.version}</div>
                  
                  <div className="info-label">Creación:</div>
                  <div className="info-value">{document.creationDate}</div>
                  
                  <div className="info-label">Actualización:</div>
                  <div className="info-value">{document.lastUpdate}</div>
                  
                  <div className="info-label">Autor:</div>
                  <div className="info-value">{document.author}</div>
                  
                  <div className="info-label">Aprobado por:</div>
                  <div className="info-value">{document.approver}</div>
                </div>
              </div>
            </div>
            
            <div className="document-actions">
              <a 
                href={document.url} 
                className="download-button" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <span className="download-icon">📥</span> Descargar
              </a>
              <button className="share-button">
                <span className="share-icon">🔗</span> Compartir
              </button>
              <Link 
                to={`/chat?document=${documentId}`} 
                className="chat-document-button"
              >
                <span className="chat-icon">💬</span> Preguntar
              </Link>
            </div>
            
            <div className="tags-container">
              <h3>Etiquetas</h3>
              <div className="tags-list">
                {document.tags.map((tag, index) => (
                  <span key={index} className="tag">{tag}</span>
                ))}
              </div>
            </div>
            
            <div className="related-documents">
              <h3>Documentos Relacionados</h3>
              <ul className="related-docs-list">
                {relatedDocs.map((doc) => (
                  <li key={doc.id} className="related-doc-item">
                    <Link to={`/documents/${doc.id}`} className="related-doc-link">
                      <span className="related-doc-code">{doc.code}</span>
                      <span className="related-doc-title">{doc.title}</span>
                      <span className={`related-doc-type ${doc.type.toLowerCase()}`}>{doc.type}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          <div className="document-main">
            <div className="document-viewer">
              <div className="document-preview">
                <h2>Vista previa del documento</h2>
                <div className="document-content">
                  <p>{document.description}</p>
                  <p>{document.content}</p>
                  {/* Contenido simulado */}
                  <h3>1. Introducción</h3>
                  <p>La Universidad del Quindío está comprometida con la calidad académica en todos sus programas...</p>
                  
                  <h3>2. Objetivos</h3>
                  <p>Este manual tiene como objetivo establecer los lineamientos para:</p>
                  <ul>
                    <li>Asegurar la calidad de los programas académicos</li>
                    <li>Definir procesos de evaluación y mejoramiento continuo</li>
                    <li>Establecer criterios para la acreditación de programas</li>
                  </ul>
                  
                  <h3>3. Alcance</h3>
                  <p>Este manual aplica a todos los programas académicos de la Universidad del Quindío...</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default DocumentPage;