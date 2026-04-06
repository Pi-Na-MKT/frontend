import React, { useState } from 'react'
import Empresas from './pages/Empresas'
import Tarefas from './pages/Tarefas'
import Dashboard from './pages/Dashboard'

// Simple in-app router using state
const PAGES = {
  EMPRESAS: 'empresas',
  TAREFAS: 'tarefas',
  DASHBOARD: 'dashboard',
}

function App() {
  const [page, setPage] = useState(PAGES.EMPRESAS)
  const [selectedEmpresa, setSelectedEmpresa] = useState(null)

  const handleEmpresaClick = (empresa) => {
    setSelectedEmpresa(empresa)
    setPage(PAGES.TAREFAS)
  }

  const handleVerDashboard = () => {
    setPage(PAGES.DASHBOARD)
  }

  const handleBackToEmpresas = () => {
    setPage(PAGES.EMPRESAS)
    setSelectedEmpresa(null)
  }

  const handleBackToTarefas = () => {
    setPage(PAGES.TAREFAS)
  }

  if (page === PAGES.DASHBOARD) {
    return (
      <Dashboard
        empresa={selectedEmpresa}
        onBack={handleBackToTarefas}
      />
    )
  }

  if (page === PAGES.TAREFAS) {
    return (
      <Tarefas
        empresa={selectedEmpresa}
        onBack={handleBackToEmpresas}
        onDashboard={handleVerDashboard}
      />
    )
  }

  return (
    <Empresas onEmpresaClick={handleEmpresaClick} />
  )
}

export default App
