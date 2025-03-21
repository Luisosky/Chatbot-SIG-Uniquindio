import React from 'react';
import { Link } from 'react-router-dom';
import './SystemsOverview.css';

const SystemsOverview = () => {
  // Datos simulados de sistemas
  const systems = [
    {
      id: 'siac',
      code: 'SIAC',
      name: 'Sistema Interno de Aseguramiento de la Calidad',
      description: 'Gestión académica y aseguramiento de calidad',
      icon: '🎓',
      color: '#4285f4'
    },
    {
      id: 'sgsst',
      code: 'SGSST',
      name: 'Sistema de Gestión de Seguridad y Salud en el Trabajo',
      description: 'Prevención de riesgos laborales',
      icon: '⛑️',
      color: '#ea4335'
    },
    {
      id: 'sga',
      code: 'SGA',
      name: 'Sistema de Gestión Ambiental',
      description: 'Gestión ambiental y sostenibilidad',
      icon: '🌿',
      color: '#34a853'
    },
    {
      id: 'sgl',
      code: 'SGL',
      name: 'Sistema de Gestión Laboratorios',
      description: 'Gestión de calidad en laboratorios',
      icon: '🧪',
      color: '#fbbc05'
    },
    {
      id: 'ssi',
      code: 'SSI',
      name: 'Sistema de Seguridad de la Información',
      description: 'Protección de datos y seguridad informática',
      icon: '🔒',
      color: '#9c27b0'
    }
  ];
  
  return (
    <div className="systems-overview">
      <div className="systems-grid">
        {systems.map(system => (
          <Link 
            key={system.id}
            to={`/systems/${system.id}`}
            className="system-card"
            style={{ borderColor: system.color }}
          >
            <div className="system-icon" style={{ backgroundColor: system.color }}>
              {system.icon}
            </div>
            <div className="system-info">
              <h3 className="system-name">
                <span className="system-code">{system.code}</span>
                {system.name}
              </h3>
              <p className="system-description">{system.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default SystemsOverview;