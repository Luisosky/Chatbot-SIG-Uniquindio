import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '../components/UI/Header';
import Footer from '../components/UI/Footer';
import '../styles/SystemDetailPage.css';

const SystemDetailPage = () => {
  const { systemId } = useParams();
  const [activeTab, setActiveTab] = useState('overview');
  
  // Datos simulados del sistema
  const systemData = {
    siac: {
      id: 'siac',
      code: 'SIAC',
      name: 'Sistema Interno de Aseguramiento de la Calidad',
      description: 'El Sistema Interno de Aseguramiento de la Calidad (SIAC) establece los lineamientos y mecanismos para garantizar la calidad de los procesos académicos y administrativos de la institución, promoviendo la mejora continua en todas las actividades universitarias.',
      icon: '🎓',
      color: '#4285f4',
      documentCount: 45,
      lastUpdated: '2025-03-15',
      processes: [
        { id: 'proc1', name: 'Gestión Académica', documentCount: 12, hasSubprocesses: true },
        { id: 'proc2', name: 'Evaluación Institucional', documentCount: 8, hasSubprocesses: false },
        { id: 'proc3', name: 'Acreditación de Programas', documentCount: 15, hasSubprocesses: true },
        { id: 'proc4', name: 'Seguimiento a Egresados', documentCount: 6, hasSubprocesses: false },
      ],
      documents: [
        { id: 'doc1', code: 'MAN-001', title: 'Manual de Calidad Académica', type: 'Manual', lastUpdate: '2025-01-20', process: 'Gestión Académica' },
        { id: 'doc2', code: 'PRO-002', title: 'Procedimiento de Evaluación Docente', type: 'Procedimiento', lastUpdate: '2025-02-15', process: 'Evaluación Institucional' },
        { id: 'doc3', code: 'FOR-003', title: 'Formato de Autoevaluación', type: 'Formato', lastUpdate: '2025-03-05', process: 'Acreditación de Programas' },
      ]
    },
    sgsst: {
      id: 'sgsst',
      code: 'SGSST',
      name: 'Sistema de Gestión de Seguridad y Salud en el Trabajo',
      description: 'El Sistema de Gestión de Seguridad y Salud en el Trabajo (SGSST) establece políticas y procedimientos para garantizar la protección y el bienestar de todos los trabajadores, identificando, evaluando y controlando los riesgos que puedan afectar la seguridad y salud en el entorno laboral.',
      icon: '⛑️',
      color: '#ea4335',
      documentCount: 38,
      lastUpdated: '2025-03-10',
      processes: [
        { id: 'proc1', name: 'Prevención de Riesgos', documentCount: 14, hasSubprocesses: true },
        { id: 'proc2', name: 'Gestión de Emergencias', documentCount: 9, hasSubprocesses: false },
        { id: 'proc3', name: 'Capacitación en SST', documentCount: 8, hasSubprocesses: false },
      ],
      documents: [
        { id: 'doc1', code: 'MAN-101', title: 'Manual del SGSST', type: 'Manual', lastUpdate: '2025-02-08', process: 'Prevención de Riesgos' },
        { id: 'doc2', code: 'PRO-102', title: 'Procedimiento de Identificación de Peligros', type: 'Procedimiento', lastUpdate: '2025-03-01', process: 'Prevención de Riesgos' },
      ]
    },
    sga: {
      id: 'sga',
      code: 'SGA',
      name: 'Sistema de Gestión Ambiental',
      description: 'El Sistema de Gestión Ambiental (SGA) establece las políticas y acciones para identificar, evaluar y controlar los aspectos ambientales de las actividades universitarias, promoviendo prácticas sostenibles y minimizando el impacto ambiental de la institución.',
      icon: '🌿',
      color: '#34a853',
      documentCount: 27,
      lastUpdated: '2025-02-20',
      processes: [
        { id: 'proc1', name: 'Gestión de Residuos', documentCount: 10, hasSubprocesses: false },
        { id: 'proc2', name: 'Eficiencia Energética', documentCount: 7, hasSubprocesses: false },
        { id: 'proc3', name: 'Educación Ambiental', documentCount: 6, hasSubprocesses: true },
      ],
      documents: [
        { id: 'doc1', code: 'POL-201', title: 'Política Ambiental', type: 'Política', lastUpdate: '2025-01-15', process: 'Gestión de Residuos' },
        { id: 'doc2', code: 'PRO-202', title: 'Procedimiento de Separación de Residuos', type: 'Procedimiento', lastUpdate: '2025-02-10', process: 'Gestión de Residuos' },
      ]
    },
    sgl: {
      id: 'sgl',
      code: 'SGL',
      name: 'Sistema de Gestión Laboratorios',
      description: 'El Sistema de Gestión de Laboratorios (SGL) establece las directrices para garantizar el correcto funcionamiento y la calidad en todos los laboratorios de la institución, asegurando procedimientos estandarizados, equipamiento adecuado y cumplimiento de normas de bioseguridad.',
      icon: '🧪',
      color: '#fbbc05',
      documentCount: 32,
      lastUpdated: '2025-03-05',
      processes: [
        { id: 'proc1', name: 'Gestión de Equipos', documentCount: 11, hasSubprocesses: false },
        { id: 'proc2', name: 'Bioseguridad', documentCount: 9, hasSubprocesses: true },
        { id: 'proc3', name: 'Control de Calidad', documentCount: 8, hasSubprocesses: false },
      ],
      documents: [
        { id: 'doc1', code: 'MAN-301', title: 'Manual de Bioseguridad', type: 'Manual', lastUpdate: '2025-02-25', process: 'Bioseguridad' },
        { id: 'doc2', code: 'INS-302', title: 'Instructivo de Uso de Equipos', type: 'Instructivo', lastUpdate: '2025-03-01', process: 'Gestión de Equipos' },
      ]
    },
    ssi: {
      id: 'ssi',
      code: 'SSI',
      name: 'Sistema de Seguridad de la Información',
      description: 'El Sistema de Seguridad de la Información (SSI) establece las políticas y medidas para proteger la confidencialidad, integridad y disponibilidad de la información institucional, gestionando los riesgos asociados a los activos de información y sistemas informáticos.',
      icon: '🔒',
      color: '#9c27b0',
      documentCount: 23,
      lastUpdated: '2025-02-28',
      processes: [
        { id: 'proc1', name: 'Gestión de Accesos', documentCount: 8, hasSubprocesses: false },
        { id: 'proc2', name: 'Gestión de Incidentes', documentCount: 7, hasSubprocesses: false },
        { id: 'proc3', name: 'Continuidad del Servicio', documentCount: 5, hasSubprocesses: true },
      ],
      documents: [
        { id: 'doc1', code: 'POL-401', title: 'Política de Seguridad de la Información', type: 'Política', lastUpdate: '2025-01-30', process: 'Gestión de Accesos' },
        { id: 'doc2', code: 'PRO-402', title: 'Procedimiento de Gestión de Incidentes', type: 'Procedimiento', lastUpdate: '2025-02-20', process: 'Gestión de Incidentes' },
      ]
    }
  };
  
  // Sistema seleccionado
  const system = systemData[systemId] || systemData.siac;
  
  return (
    <div className="system-detail-page">
      <Header />
      
      <main className="system-detail-content">
        <div className="system-header" style={{ backgroundColor: `${system.color}22` }}>
          <div className="back-link">
            <Link to="/systems">← Volver a Sistemas</Link>
          </div>
          
          <div className="system-title">
            <div className="system-icon" style={{ backgroundColor: system.color }}>
              {system.icon}
            </div>
            <div className="system-info">
              <h1>
                <span className="system-code">{system.code}</span>
                {system.name}
              </h1>
              <p className="system-meta">
                {system.documentCount} documentos • Última actualización: {system.lastUpdated}
              </p>
            </div>
          </div>
          
          <p className="system-description">{system.description}</p>
          
          <div className="system-actions">
            <Link to={`/chat?system=${system.code}`} className="chat-button">
              <span className="chat-icon">💬</span> Consultar al Asistente
            </Link>
          </div>
        </div>
        
        <div className="system-tabs">
          <button 
            className={`tab-button ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            Resumen
          </button>
          <button 
            className={`tab-button ${activeTab === 'processes' ? 'active' : ''}`}
            onClick={() => setActiveTab('processes')}
          >
            Procesos
          </button>
          <button 
            className={`tab-button ${activeTab === 'documents' ? 'active' : ''}`}
            onClick={() => setActiveTab('documents')}
          >
            Documentos
          </button>
        </div>
        
        <div className="tab-content">
          {activeTab === 'overview' && (
            <div className="overview-tab">
              <div className="system-stats">
                <div className="stat-card">
                  <h3>{system.processes.length}</h3>
                  <p>Procesos</p>
                </div>
                <div className="stat-card">
                  <h3>{system.documentCount}</h3>
                  <p>Documentos</p>
                </div>
                <div className="stat-card">
                  <h3>{system.processes.filter(p => p.hasSubprocesses).length}</h3>
                  <p>Subprocesos</p>
                </div>
              </div>
              
              <div className="recent-updates">
                <h2>Actualizaciones Recientes</h2>
                <ul className="updates-list">
                  {system.documents.map(doc => (
                    <li key={doc.id} className="update-item">
                      <div className="update-date">{doc.lastUpdate}</div>
                      <div className="update-content">
                        <strong>{doc.title}</strong> fue actualizado
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="quick-access">
                <h2>Acceso Rápido</h2>
                <div className="quick-links">
                  <Link to={`/systems/${systemId}/processes`} className="quick-link">
                    <div className="quick-link-icon">📋</div>
                    <span>Ver todos los procesos</span>
                  </Link>
                  <Link to={`/systems/${systemId}/documents`} className="quick-link">
                    <div className="quick-link-icon">📄</div>
                    <span>Buscar documentos</span>
                  </Link>
                  <Link to={`/chat?system=${system.code}`} className="quick-link">
                    <div className="quick-link-icon">💬</div>
                    <span>Preguntar al asistente</span>
                  </Link>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'processes' && (
            <div className="processes-tab">
              <h2>Procesos del {system.code}</h2>
              <div className="processes-list">
                {system.processes.map(process => (
                  <Link 
                    key={process.id} 
                    to={`/systems/${systemId}/processes/${process.id}`}
                    className="process-card"
                  >
                    <h3 className="process-name">{process.name}</h3>
                    <div className="process-meta">
                      <span className="document-count">{process.documentCount} documentos</span>
                      {process.hasSubprocesses && (
                        <span className="has-subprocesses">Incluye subprocesos</span>
                      )}
                    </div>
                    <div className="process-arrow">→</div>
                  </Link>
                ))}
              </div>
            </div>
          )}
          
          {activeTab === 'documents' && (
            <div className="documents-tab">
              <h2>Documentos del {system.code}</h2>
              <div className="document-filters">
                <input 
                  type="text" 
                  placeholder="Buscar documentos..." 
                  className="document-search"
                />
                <select className="document-filter">
                  <option value="">Todos los tipos</option>
                  <option value="manual">Manuales</option>
                  <option value="procedimiento">Procedimientos</option>
                  <option value="formato">Formatos</option>
                  <option value="instructivo">Instructivos</option>
                </select>
              </div>
              <table className="documents-table">
                <thead>
                  <tr>
                    <th>Código</th>
                    <th>Título</th>
                    <th>Tipo</th>
                    <th>Proceso</th>
                    <th>Actualización</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {system.documents.map(doc => (
                    <tr key={doc.id}>
                      <td>{doc.code}</td>
                      <td>{doc.title}</td>
                      <td>
                        <span className={`doc-type-badge ${doc.type.toLowerCase()}`}>
                          {doc.type}
                        </span>
                      </td>
                      <td>{doc.process}</td>
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
            </div>
          )}
        </div>
        
        <div className="chat-help-cta">
          <div className="chat-help-content">
            <h3>¿No encuentras lo que buscas?</h3>
            <p>Nuestro asistente virtual puede ayudarte a encontrar documentos específicos.</p>
            <Link to={`/chat?system=${systemId}`} className="chat-help-button">
              Consultar al Asistente
            </Link>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default SystemDetailPage;