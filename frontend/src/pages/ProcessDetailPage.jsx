import React from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '../components/UI/Header';
import Footer from '../components/UI/Footer';
import '../styles/ProcessDetailPage.css';

const ProcessDetailPage = () => {
  const { systemId, processId } = useParams();
  
  // Datos simulados del proceso
  const processData = {
    id: processId,
    name: 'Gestión de Calidad Académica',
    description: 'Este proceso se encarga de asegurar la calidad de los programas académicos de la universidad, incluyendo la elaboración de lineamientos, evaluación y mejora continua.',
    systemId: systemId,
    systemName: systemId === 'siac' ? 'Sistema Interno de Aseguramiento de la Calidad' : 
                systemId === 'sgsst' ? 'Sistema de Gestión de Seguridad y Salud en el Trabajo' :
                systemId === 'sga' ? 'Sistema de Gestión Ambiental' :
                systemId === 'sgl' ? 'Sistema de Gestión Laboratorios' : 
                'Sistema de Seguridad de la Información',
    documentCount: 12,
    subprocessCount: 3,
    owner: 'Oficina de Calidad Académica',
    lastUpdated: '2025-02-20',
  };
  
  // Datos simulados de documentos
  const documents = [
    { id: 'doc1', code: 'MAN-001', title: 'Manual de Calidad Académica', type: 'Manual', version: '2.0', lastUpdate: '2025-01-20' },
    { id: 'doc2', code: 'PRO-002', title: 'Procedimiento de Revisión Curricular', type: 'Procedimiento', version: '1.3', lastUpdate: '2025-02-15' },
    { id: 'doc3', code: 'FOR-003', title: 'Formato de Evaluación de Programas', type: 'Formato', version: '1.0', lastUpdate: '2025-03-05' },
    { id: 'doc4', code: 'INS-004', title: 'Instructivo para Rediseño Curricular', type: 'Instructivo', version: '1.1', lastUpdate: '2025-02-28' },
  ];
  
  // Datos simulados de subprocesos
  const subprocesses = [
    { id: 'sub1', name: 'Diseño Curricular', documentCount: 5 },
    { id: 'sub2', name: 'Evaluación de Programas', documentCount: 4 },
    { id: 'sub3', name: 'Mejoramiento Continuo', documentCount: 3 },
  ];
  
  return (
    <div className="process-detail-page">
      <Header />
      
      <main className="process-detail-content">
        <div className="process-header">
          <div className="breadcrumb">
            <Link to="/systems">Sistemas</Link> &gt; 
            <Link to={`/systems/${systemId}`}>{processData.systemName}</Link> &gt; 
            <span>Proceso</span>
          </div>
          
          <h1 className="process-title">{processData.name}</h1>
          
          <div className="process-meta">
            <span className="meta-item">
              <span className="meta-label">Sistema:</span> {processData.systemName}
            </span>
            <span className="meta-item">
              <span className="meta-label">Responsable:</span> {processData.owner}
            </span>
            <span className="meta-item">
              <span className="meta-label">Actualización:</span> {processData.lastUpdated}
            </span>
          </div>
          
          <p className="process-description">{processData.description}</p>
          
          <div className="process-stats">
            <div className="stat-badge">
              <span className="stat-value">{processData.documentCount}</span>
              <span className="stat-label">Documentos</span>
            </div>
            <div className="stat-badge">
              <span className="stat-value">{processData.subprocessCount}</span>
              <span className="stat-label">Subprocesos</span>
            </div>
          </div>
        </div>
        
        {subprocesses.length > 0 && (
          <section className="subprocesses-section">
            <h2>Subprocesos</h2>
            <div className="subprocesses-list">
              {subprocesses.map((subprocess) => (
                <div key={subprocess.id} className="subprocess-card">
                  <h3 className="subprocess-name">{subprocess.name}</h3>
                  <div className="subprocess-meta">
                    <span className="document-count">{subprocess.documentCount} documentos</span>
                  </div>
                  <Link to={`/systems/${systemId}/processes/${processId}/subprocesses/${subprocess.id}`} className="view-subprocess">
                    Ver subproceso →
                  </Link>
                </div>
              ))}
            </div>
          </section>
        )}
        
        <section className="documents-section">
          <h2>Documentos del Proceso</h2>
          <table className="documents-table">
            <thead>
              <tr>
                <th>Código</th>
                <th>Título</th>
                <th>Tipo</th>
                <th>Versión</th>
                <th>Actualización</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {documents.map((doc) => (
                <tr key={doc.id}>
                  <td>{doc.code}</td>
                  <td>{doc.title}</td>
                  <td>
                    <span className={`doc-type-badge ${doc.type.toLowerCase()}`}>
                      {doc.type}
                    </span>
                  </td>
                  <td>{doc.version}</td>
                  <td>{doc.lastUpdate}</td>
                  <td>
                    <div className="document-actions">
                      <Link to={`/documents/${doc.id}`} className="view-doc-button">
                        Ver
                      </Link>
                      <button className="download-doc-button">Descargar</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
        
        <div className="process-actions">
          <Link 
            to={`/chat?system=${systemId}&process=${processId}`} 
            className="chat-process-button"
          >
            <span className="chat-icon">💬</span> 
            Consultar al asistente sobre este proceso
          </Link>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ProcessDetailPage;