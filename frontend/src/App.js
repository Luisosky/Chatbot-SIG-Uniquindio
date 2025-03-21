import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import HomePage from './pages/HomePage';
import ChatPage from './pages/ChatPage';
import SystemsPage from './pages/SystemsPage';
import SystemDetailPage from './pages/SystemDetailPage';
import ProcessDetailPage from './pages/ProcessDetailPage';
import DocumentPage from './pages/DocumentPage';
import SearchPage from './pages/SearchPage';
import NotFoundPage from './pages/NotFoundPage';
import PageTransition from './components/PageTransition';
import './App.css';

// Componente contenedor para AnimatePresence
function AnimatedRoutes() {
  const location = useLocation();
  
  return (
    <div style={{ position: 'relative', minHeight: '100vh' }}>
      <AnimatePresence mode="wait" initial={false}>
        <Routes location={location} key={location.pathname}>
          <Route
            path="/"
            element={
              <PageTransition>
                <HomePage />
              </PageTransition>
            }
          />
          <Route
            path="/chat"
            element={
              <PageTransition>
                <ChatPage />
              </PageTransition>
            }
          />
          <Route
            path="/systems"
            element={
              <PageTransition>
                <SystemsPage />
              </PageTransition>
            }
          />
          <Route
            path="/systems/:systemId"
            element={
              <PageTransition>
                <SystemDetailPage />
              </PageTransition>
            }
          />
          <Route
            path="/systems/:systemId/processes/:processId"
            element={
              <PageTransition>
                <ProcessDetailPage />
              </PageTransition>
            }
          />
          <Route
            path="/documents/:documentId"
            element={
              <PageTransition>
                <DocumentPage />
              </PageTransition>
            }
          />
          <Route
            path="/search"
            element={
              <PageTransition>
                <SearchPage />
              </PageTransition>
            }
          />
          <Route
            path="*"
            element={
              <PageTransition>
                <NotFoundPage />
              </PageTransition>
            }
          />
        </Routes>
      </AnimatePresence>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AnimatedRoutes />
    </Router>
  );
}

export default App;