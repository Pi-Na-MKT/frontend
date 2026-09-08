import React, { useState } from 'react'
import { AuthProvider, useAuth } from './context/AuthContext'
import Spinner from './components/Spinner'
import Login from './pages/Login'
import Register from './pages/Register'
import Users from './pages/Users'
import AppLayout from './layouts/AppLayout'
import Companies from './pages/Companies'
import Tasks from './pages/Tasks'
import Dashboard from './pages/Dashboard'
import Attachments from './pages/Attachments'

const PAGES = {
  COMPANIES:         'companies',
  TASKS:             'tasks',
  DASHBOARD:         'dashboard',
  ATTACHMENTS:       'attachments',
  USERS:             'users',
  REGISTER_USER:     'register_user',
}

const AUTH_VIEWS = {
  LOGIN:    'login',
  REGISTER: 'register',
}

function AppContent() {
  const { loading } = useAuth()
  const [page, setPage] = useState(PAGES.COMPANIES)
  const [selectedEmpresa, setSelectedEmpresa] = useState(null)

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F4F5F7]">
        <div className="flex flex-col items-center gap-3">
          <Spinner size="lg"/>
          <span className="text-sm text-gray-500">Carregando...</span>
        </div>
      </div>
    )
  }

  return (
    <AuthGate
      page={page}
      setPage={setPage}
      selectedEmpresa={selectedEmpresa}
      setSelectedEmpresa={setSelectedEmpresa}
    />
  )
}

function AuthGate({ page, setPage, selectedEmpresa, setSelectedEmpresa }) {
  const { user } = useAuth()
  const [authView, setAuthView] = useState(AUTH_VIEWS.LOGIN)

  if (!user) {
    if (authView === AUTH_VIEWS.REGISTER) {
      return <Register onGoToLogin={() => setAuthView(AUTH_VIEWS.LOGIN)} />
    }
    return <Login onGoToRegister={() => setAuthView(AUTH_VIEWS.REGISTER)} />
  }

  const goToTasks           = (empresa) => { setSelectedEmpresa(empresa); setPage(PAGES.TASKS) }
  const goToDashboard         = () => setPage(PAGES.DASHBOARD)
  const goToDashboardGeral    = () => { setSelectedEmpresa(null); setPage(PAGES.DASHBOARD) }
  const goToCompanies          = () => { setPage(PAGES.COMPANIES); setSelectedEmpresa(null) }
  const goToUsers              = () => setPage(PAGES.USERS)
  const goToAttachments        = () => setPage(PAGES.ATTACHMENTS)
  const goToTasksBack         = () => setPage(PAGES.TASKS)
  const goToRegisterUser       = () => setPage(PAGES.REGISTER_USER)

  const handleSidebarNav = (id) => {
    if (id === PAGES.COMPANIES)  goToCompanies()
    if (id === PAGES.USERS)      goToUsers()
    if (id === PAGES.ATTACHMENTS) goToAttachments()
    if (id === PAGES.DASHBOARD)   goToDashboardGeral()
  }

  const handleCompanyNavDashboard = (company) => { setSelectedEmpresa(company); setPage(PAGES.DASHBOARD) }
  const handleCompanyNavTasks     = (company) => { setSelectedEmpresa(company); setPage(PAGES.TASKS) }

  const searchPlaceholder =
    page === PAGES.COMPANIES   ? 'Buscar empresas...'     :
    page === PAGES.TASKS       ? 'Buscar tarefas...'      :
    page === PAGES.USERS       ? 'Buscar usuários...'      : 'Buscar...'

  if (page === PAGES.REGISTER_USER) {
    return <Register onGoToLogin={goToUsers} isInternalAccess />
  }

  return (
    <AppLayout
      activePage={page}
      selectedEmpresa={selectedEmpresa}
      onNavigate={handleSidebarNav}
      onCompanyTasks={handleCompanyNavTasks}
      onCompanyDashboard={handleCompanyNavDashboard}
      searchPlaceholder={searchPlaceholder}
    >
      {page === PAGES.COMPANIES   && <Companies onCompanyClick={goToTasks} />}
      {page === PAGES.TASKS       && <Tasks empresa={selectedEmpresa} onBack={goToCompanies} onDashboard={goToDashboard} />}
      {page === PAGES.DASHBOARD && (
        <Dashboard
          empresaInicial={selectedEmpresa}
          onBack={selectedEmpresa ? goToTasksBack : null}
        />
      )}
      {page === PAGES.USERS       && <Users onRegisterNew={goToRegisterUser} />}
      {page === PAGES.ATTACHMENTS && <Attachments />}
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
