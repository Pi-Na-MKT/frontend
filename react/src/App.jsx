import React, { useState } from 'react'
import { AuthProvider, useAuth } from './context/AuthContext'
import Login from './pages/Login'
import AppLayout from './layouts/AppLayout'
import Empresas from './pages/Empresas'
import Tarefas from './pages/Tarefas'
import Dashboard from './pages/Dashboard'

const PAGES = {
  EMPRESAS: 'empresas',
  TAREFAS: 'tarefas',
  DASHBOARD: 'dashboard',
}

function AppContent() {
  const { loading } = useAuth()
  const [page, setPage] = useState(PAGES.EMPRESAS)
  const [selectedEmpresa, setSelectedEmpresa] = useState(null)

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F4F5F7]">
        <div className="flex flex-col items-center gap-3">
          <svg className="w-8 h-8 text-primary animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
          </svg>
          <span className="text-sm text-gray-500">Carregando...</span>
        </div>
      </div>
    )
  }

  return <AuthGate page={page} setPage={setPage} selectedEmpresa={selectedEmpresa} setSelectedEmpresa={setSelectedEmpresa} />
}

function AuthGate({ page, setPage, selectedEmpresa, setSelectedEmpresa }) {
  const { user } = useAuth()

  if (!user) return <Login />

  const goToTarefas   = (empresa) => { setSelectedEmpresa(empresa); setPage(PAGES.TAREFAS) }
  const goToDashboard = () => setPage(PAGES.DASHBOARD)
  const goToEmpresas  = () => { setPage(PAGES.EMPRESAS); setSelectedEmpresa(null) }
  const goToTarefasBack = () => setPage(PAGES.TAREFAS)

  const handleSidebarNav = (id) => {
    if (id === PAGES.EMPRESAS) goToEmpresas()
    else if (id === PAGES.DASHBOARD) goToDashboard()
  }

  const searchPlaceholder =
    page === PAGES.EMPRESAS ? 'Buscar empresas...' :
    page === PAGES.TAREFAS  ? 'Buscar tarefas, campanhas ou clientes...' : 'Buscar...'

  return (
    <AppLayout activePage={page} onNavigate={handleSidebarNav} searchPlaceholder={searchPlaceholder}>
      {page === PAGES.EMPRESAS && <Empresas onEmpresaClick={goToTarefas} />}
      {page === PAGES.TAREFAS  && <Tarefas empresa={selectedEmpresa} onBack={goToEmpresas} onDashboard={goToDashboard} />}
      {page === PAGES.DASHBOARD && <Dashboard empresa={selectedEmpresa} onBack={goToTarefasBack} />}
    </AppLayout>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}
