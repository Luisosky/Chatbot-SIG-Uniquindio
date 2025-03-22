import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/UI/Header';
import Footer from '../components/UI/Footer';
import '../styles/SearchPage.css';
import ChatToggle from '../components/Chat/ChatToggle';

const SearchPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    system: '',
    documentType: '',
    process: '',
    dateFrom: '',
    dateTo: ''
  });
  
  // Resultados simulados de búsqueda
  const searchResults = [
    {
      id: 'doc1',
      code: 'MAN-001',
      title: 'Manual de Calidad Académica',
      type: 'Manual',
      system: { code: 'SIAC', name: 'Sistema Interno de Aseguramiento de la Calidad' },
      process: { name: 'Gestión de Calidad Académica' },
      lastUpdate: '2025-01-20',
      excerpt: 'Este manual establece los <em>lineamientos</em> y directrices para asegurar la <em>calidad académica</em> en todos los programas...',
      url: '/documents/doc1'
    },
    {
      id: 'doc2',
      code: 'PRO-002',
      title: 'Procedimiento de Revisión Curricular',
      type: 'Procedimiento',
      system: { code: 'SIAC', name: 'Sistema Interno de Aseguramiento de la Calidad' },
      process: { name: 'Gestión de Calidad Académica' },
      lastUpdate: '2025-02-15',
      excerpt: 'Este procedimiento describe los pasos para realizar la revisión curricular con enfoque en <em>calidad académica</em> y mejoramiento...',
      url: '/documents/doc2'
    },
    {
      id: 'doc3',
      code: 'GUI-010',
      title: 'Guía para Autoevaluación de Programas',
      type: 'Guía',
      system: { code: 'SIAC', name: 'Sistema Interno de Aseguramiento de la Calidad' },
      process: { name: 'Evaluación de Programas' },
      lastUpdate: '2025-03-10',
      excerpt: 'Esta guía proporciona orientaciones para realizar procesos de autoevaluación que contribuyan al aseguramiento de la <em>calidad</em>...',
      url: '/documents/doc3'
    },
  ];
  
  // Función para manejar la búsqueda
  const handleSearch = (e) => {
    e.preventDefault();
    // No implementado
    console.log('Buscando:', searchQuery, filters);
  };
  
  // Función para actualizar filtros
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value
    });
  };
  
  // Sistemas disponibles para el filtro
  const availableSystems = [
    { code: 'SIAC', name: 'Sistema Interno de Aseguramiento de la Calidad' },
    { code: 'SGSST', name: 'Sistema de Gestión de Seguridad y Salud en el Trabajo' },
    { code: 'SGA', name: 'Sistema de Gestión Ambiental' },
    { code: 'SGL', name: 'Sistema de Gestión Laboratorios' },
    { code: 'SSI', name: 'Sistema de Seguridad de la Información' }
  ];
  
  // Tipos de documentos para el filtro
  const documentTypes = [
    'Manual', 'Procedimiento', 'Formato', 'Instructivo', 'Guía', 'Política'
  ];
  
  return (
    <div className="search-page">
      <Header />
      
      <main className="search-content">
        <div className="search-header">
          <h1>Búsqueda de Documentos</h1>
          <form onSubmit={handleSearch} className="search-form">
            <div className="search-input-container">
              <input 
                type="text" 
                value={searchQuery} 
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar documentos, procesos o sistemas..." 
                className="search-input"
              />
              <button type="submit" className="search-button">
                <span className="search-icon">🔍</span>
              </button>
            </div>
          </form>
        </div>
        
        <div className="search-layout">
          <aside className="search-filters-sidebar">
            <div className="filters-container">
              <h2>Filtros</h2>
              
              <div className="filter-section">
                <h3>Sistema</h3>
                <select 
                  name="system" 
                  value={filters.system} 
                  onChange={handleFilterChange}
                  className="filter-select"
                >
                  <option value="">Todos los sistemas</option>
                  {availableSystems.map((system) => (
                    <option key={system.code} value={system.code}>
                      {system.code} - {system.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="filter-section">
                <h3>Tipo de Documento</h3>
                <select 
                  name="documentType" 
                  value={filters.documentType} 
                  onChange={handleFilterChange}
                  className="filter-select"
                >
                  <option value="">Todos los tipos</option>
                  {documentTypes.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              
              <div className="filter-section">
                <h3>Fecha de Actualización</h3>
                <div className="date-filter">
                  <label>Desde:</label>
                  <input 
                    type="date" 
                    name="dateFrom" 
                    value={filters.dateFrom} 
                    onChange={handleFilterChange}
                    className="filter-date"
                  />
                </div>
                <div className="date-filter">
                  <label>Hasta:</label>
                  <input 
                    type="date" 
                    name="dateTo" 
                    value={filters.dateTo} 
                    onChange={handleFilterChange}
                    className="filter-date"
                  />
                </div>
              </div>
              
              <button className="apply-filters-button" onClick={handleSearch}>
                Aplicar Filtros
              </button>
              <button 
                className="clear-filters-button"
                onClick={() => setFilters({
                  system: '',
                  documentType: '',
                  process: '',
                  dateFrom: '',
                  dateTo: ''
                })}
              >
                Limpiar Filtros
              </button>
            </div>
            
            <div className="search-help-box">
              <h3>¿Necesitas ayuda?</h3>
              <p>El asistente virtual puede ayudarte a encontrar documentos específicos.</p>
              <Link to="/chat" className="search-chat-button">
                Consultar al Asistente
              </Link>
            </div>
          </aside>
          
          <div className="search-results-container">
            <div className="search-summary">
              {searchQuery ? (
                <p>Se encontraron <strong>{searchResults.length}</strong> resultados para <strong>"{searchQuery}"</strong></p>
              ) : (
                <p>Utiliza los filtros o la barra de búsqueda para encontrar documentos</p>
              )}
            </div>
            
            <div className="search-results">
              <ul className="results-list">
                {searchResults.map(result => (
                  <li key={result.id} className="result-item">
                    <div className="result-header">
                      <span className={`result-type-badge ${result.type.toLowerCase()}`}>
                        {result.type}
                      </span>
                      <span className="result-code">{result.code}</span>
                      <span className="result-date">Actualizado: {result.lastUpdate}</span>
                    </div>
                    
                    <h3 className="result-title">
                      <Link to={result.url}>{result.title}</Link>
                    </h3>
                    
                    <div className="result-meta">
                      <span className="result-system">
                        <span className="meta-label">Sistema:</span> {result.system.code} - {result.system.name}
                      </span>
                      <span className="result-process">
                        <span className="meta-label">Proceso:</span> {result.process.name}
                      </span>
                    </div>
                    
                    <p className="result-excerpt" 
                      dangerouslySetInnerHTML={{ __html: result.excerpt }}
                    ></p>
                    
                    <div className="result-actions">
                      <Link to={result.url} className="view-document-link">
                        Ver documento <span className="arrow-icon">→</span>
                      </Link>
                      
                      <Link to={`/chat?document=${result.id}`} className="ask-about-link">
                        Preguntar sobre este documento
                      </Link>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
      <ChatToggle />
    </div>
  );
};

export default SearchPage;