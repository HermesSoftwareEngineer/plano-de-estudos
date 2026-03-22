import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { ThemeProvider } from './contexts/ThemeContext'
import { Sidebar } from './components/Sidebar'
import { VisaoGeral } from './pages/VisaoGeral'
import { Metas } from './pages/Metas'
import { Registros } from './pages/Registros'
import { AdminSeed } from './pages/AdminSeed'
import { TabelasAuxiliares } from './pages/TabelasAuxiliares'
import './App.css'

function AppContent() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  return (
    <div className="flex">
      <Sidebar
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen((prev) => !prev)}
      />
      <main
        className={`${isSidebarOpen ? 'ml-64' : 'ml-20'} flex-1 bg-gray-50 dark:bg-gray-950 min-h-screen transition-all duration-300`}
      >
        <Routes>
          <Route path="/visao-geral" element={<VisaoGeral />} />
          <Route path="/metas" element={<Metas />} />
          <Route path="/registros" element={<Registros />} />
          <Route path="/tabelas-auxiliares" element={<TabelasAuxiliares />} />
          <Route path="/admin-seed" element={<AdminSeed />} />
          <Route path="/" element={<Navigate to="/visao-geral" replace />} />
        </Routes>
      </main>
    </div>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <Router>
        <AppContent />
      </Router>
    </ThemeProvider>
  )
}
