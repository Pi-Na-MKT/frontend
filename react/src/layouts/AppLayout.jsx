import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { empresas } from '../data/mockData'

function AvatarNeutro({ className = 'w-8 h-8' }) {
  return (
    <div className={`${className} rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0`}>
      <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
      </svg>
    </div>
  )
}

const navItems = [
  { id: 'anexos', label: 'Anexos', icon: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"/>
    </svg>
  )},
  { id: 'usuarios', label: 'Usuários', icon: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/>
    </svg>
  )},
  { id: 'configuracoes', label: 'Configurações', icon: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
    </svg>
  )},
]

function EmpresaSubItem({ empresa, activePage, selectedEmpresa, onTarefas, onDashboard }) {
  const isActive = selectedEmpresa?.id === empresa.id
  const [open, setOpen] = useState(isActive)

  return (
    <div>
      <button onClick={() => setOpen(v => !v)}
        className={`flex items-center gap-2 w-full px-2.5 py-2 rounded-xl text-xs font-medium transition-all ${
          isActive ? 'bg-primary/10 text-primary' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800'
        }`}>
        <span className={`w-5 h-5 rounded-md flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0 ${empresa.cor}`}>
          {empresa.inicial}
        </span>
        <span className="flex-1 truncate text-left">{empresa.nome}</span>
        <svg className={`w-3 h-3 flex-shrink-0 transition-transform ${open ? 'rotate-90' : ''}`}
          fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/>
        </svg>
      </button>

      {open && (
        <div className="ml-5 mt-0.5 flex flex-col gap-0.5 border-l-2 border-gray-100 pl-2">
          {[
            { label: 'Tarefas',   onClick: onTarefas,   page: 'tarefas',   icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
            { label: 'Dashboard', onClick: onDashboard, page: 'dashboard', icon: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z' },
          ].map(item => (
            <button key={item.label} onClick={() => item.onClick(empresa)}
              className={`flex items-center gap-2 px-2 py-1.5 rounded-lg text-[11px] font-medium transition-all ${
                activePage === item.page && isActive ? 'bg-primary text-white' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-800'
              }`}>
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon}/>
              </svg>
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default function AppLayout({ children, activePage, selectedEmpresa, onNavigate, onEmpresaTarefas, onEmpresaDashboard, searchPlaceholder = 'Buscar...' }) {
  const { user, logout } = useAuth()
  const [sidebarOpen, setSidebarOpen]   = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [empresasOpen, setEmpresasOpen] = useState(true)
  const isDashboard = activePage === 'dashboard'

  return (
    <div className="h-screen bg-[#F4F5F7] flex overflow-hidden">
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/40 z-30 lg:hidden" onClick={() => setSidebarOpen(false)}/>
      )}

      {/* ── Sidebar ── */}
      <aside className={`fixed top-0 left-0 z-40 flex flex-col bg-white border-r border-gray-100 w-56 h-full transition-transform duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static lg:z-auto`}>

        {/* Logo */}
        <div className="flex items-center gap-2.5 px-5 py-5 flex-shrink-0">
          <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center shadow-sm" style={{ boxShadow: '0 2px 8px rgba(91,79,232,0.35)' }}>
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z"/>
            </svg>
          </div>
          <div>
            <span className="text-base font-bold text-gray-900 tracking-tight">PiNa</span>
            <span className="text-[9px] text-gray-400 font-medium ml-1.5">Marketing</span>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex flex-col gap-0.5 px-3 flex-1 overflow-y-auto scrollbar-thin pb-3">
          {/* Label */}
          <p className="section-title px-2 mb-2 mt-1">Menu</p>

          {/* Empresas accordion */}
          <div className="mb-1">
            <button
              onClick={() => { onNavigate?.('empresas'); setEmpresasOpen(true); setSidebarOpen(false) }}
              className={`flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-sm font-semibold transition-all w-full text-left ${
                activePage === 'empresas' ? 'bg-primary/10 text-primary' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
              </svg>
              <span className="flex-1">Empresas</span>
              <svg onClick={e => { e.stopPropagation(); setEmpresasOpen(v => !v) }}
                className={`w-3.5 h-3.5 flex-shrink-0 transition-transform cursor-pointer text-gray-400 ${empresasOpen ? 'rotate-90' : ''}`}
                fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/>
              </svg>
            </button>

            {empresasOpen && (
              <div className="mt-1 ml-1 flex flex-col gap-0.5">
                {empresas.map(emp => (
                  <EmpresaSubItem key={emp.id} empresa={emp} activePage={activePage} selectedEmpresa={selectedEmpresa}
                    onTarefas={e => { onEmpresaTarefas(e); setSidebarOpen(false) }}
                    onDashboard={e => { onEmpresaDashboard(e); setSidebarOpen(false) }}
                  />
                ))}
              </div>
            )}
          </div>

          <div className="h-px bg-gray-100 my-2"/>
          <p className="section-title px-2 mb-2">Geral</p>

          {navItems.map(item => (
            <button key={item.id} onClick={() => { onNavigate?.(item.id); setSidebarOpen(false) }}
              className={`flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-sm font-medium transition-all w-full text-left ${
                activePage === item.id ? 'bg-primary/10 text-primary font-semibold' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}>
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>

        {/* User */}
        <div className="p-3 border-t border-gray-100 flex-shrink-0">
          <div className="flex items-center gap-2.5 px-2.5 py-2.5 rounded-xl hover:bg-gray-50 transition-colors">
            {user?.avatar ? <img src={user.avatar} className="w-8 h-8 rounded-full border border-gray-200 object-cover flex-shrink-0" alt=""/> : <AvatarNeutro/>}
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-gray-900 truncate">{user?.nome || user?.name}</p>
              <p className="text-[10px] text-gray-400 truncate">{user?.cargo || 'Membro'}</p>
            </div>
          </div>
          <button onClick={logout}
            className="flex items-center gap-2 w-full px-2.5 py-2 rounded-xl text-xs font-semibold text-red-400 hover:bg-red-50 hover:text-red-600 transition-all mt-1">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
            </svg>
            Sair da conta
          </button>
        </div>
      </aside>

      {/* ── Main ── */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Topbar */}
        <header className="bg-white border-b border-gray-100 px-4 lg:px-6 py-3 flex items-center gap-4 flex-shrink-0 z-20">
          <button className="lg:hidden p-2 rounded-xl text-gray-500 hover:bg-gray-100 transition-colors" onClick={() => setSidebarOpen(true)}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16"/>
            </svg>
          </button>

          <div className="flex-1 max-w-sm">
            <div className="relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
              <input type="text" placeholder={searchPlaceholder}
                className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder-gray-400"/>
            </div>
          </div>

          <div className="ml-auto flex items-center gap-2">
            {/* Notificações */}
            <button className="relative p-2 rounded-xl text-gray-500 hover:bg-gray-50 hover:text-gray-700 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
              </svg>
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-red-500 rounded-full"/>
            </button>

            {/* Avatar dropdown */}
            <div className="relative">
              <button onClick={() => setShowUserMenu(v => !v)}
                className="flex items-center gap-2 rounded-xl hover:bg-gray-50 px-2 py-1.5 transition-colors">
                {user?.avatar ? <img src={user.avatar} className="w-7 h-7 rounded-full border border-gray-200 object-cover" alt=""/> : <AvatarNeutro className="w-7 h-7"/>}
                <span className="hidden sm:block text-sm font-semibold text-gray-700">{(user?.nome || user?.name)?.split(' ')[0]}</span>
                <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/>
                </svg>
              </button>

              {showUserMenu && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-2xl border border-gray-100 shadow-xl py-2 z-50 animate-scale-in">
                  <div className="px-4 py-2 border-b border-gray-100 mb-1">
                    <p className="text-sm font-bold text-gray-900">{user?.nome || user?.name}</p>
                    <p className="text-xs text-gray-400">{user?.cargo || 'Membro'}</p>
                  </div>
                  <button onClick={() => { setShowUserMenu(false); logout() }}
                    className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-500 hover:bg-red-50 transition-colors rounded-xl mx-auto">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
                    </svg>
                    Sair
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Content */}
        <main className={`flex-1 min-h-0 ${isDashboard ? 'overflow-hidden' : 'overflow-y-auto scrollbar-thin'}`}>
          {children}
        </main>
      </div>

      <button className="fixed bottom-6 right-6 w-9 h-9 bg-gray-800 text-white rounded-full flex items-center justify-center text-xs font-bold shadow-lg hover:bg-gray-700 transition-all hover:scale-110 z-50">?</button>
    </div>
  )
}
