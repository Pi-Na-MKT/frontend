import React, { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'

const NIVEL_BADGE = {
  gestor:      { label: 'Gestor',      color: 'bg-purple-100 text-purple-700' },
  colaborador: { label: 'Colaborador', color: 'bg-blue-100 text-blue-700' },
  analista:    { label: 'Analista',    color: 'bg-teal-100 text-teal-700' },
  estagiario:  { label: 'Estagiário',  color: 'bg-orange-100 text-orange-700' },
}

const STATUS_BADGE = {
  ativo:   { label: 'Ativo',   color: 'bg-green-100 text-green-700' },
  inativo: { label: 'Inativo', color: 'bg-gray-100 text-gray-500' },
}

function Badge({ config }) {
  if (!config) return null
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
      {config.label}
    </span>
  )
}

function Initials({ nome }) {
  const initials = nome
    ? nome.split(' ').map(p => p[0]).slice(0, 2).join('').toUpperCase()
    : '?'
  return (
    <div className="w-9 h-9 rounded-full bg-primary-light text-primary flex items-center justify-center text-xs font-bold flex-shrink-0">
      {initials}
    </div>
  )
}

export default function Usuarios({ onCadastrarNovo }) {
  // registeredUsers vem do AuthContext, que já busca do backend via GET /api/users
  const { registeredUsers, fetchUsers } = useAuth()
  const [busca, setBusca]               = useState('')
  const [filtroNivel, setFiltroNivel]   = useState('todos')
  const [filtroEquipe, setFiltroEquipe] = useState('todas')
  const [carregando, setCarregando]     = useState(false)

  // Atualiza a lista sempre que a tela é aberta
  useEffect(() => {
    setCarregando(true)
    fetchUsers().finally(() => setCarregando(false))
  }, [])

  // O backend retorna "name" — o AuthContext normaliza para "nome"
  // Os demais campos (cargo, nivelAcesso, equipe) existem se você expandir a entidade User no backend.
  // Por enquanto, exibimos nome e e-mail garantidos, e os demais quando presentes.
  const equipes = [...new Set(registeredUsers.map(u => u.equipe).filter(Boolean))]

  const filtrados = registeredUsers.filter(u => {
    const termo = busca.toLowerCase()
    const bateTexto = !busca || (
      u.nome?.toLowerCase().includes(termo) ||
      u.name?.toLowerCase().includes(termo) ||
      u.email?.toLowerCase().includes(termo) ||
      u.cargo?.toLowerCase().includes(termo)
    )
    const bateNivel  = filtroNivel  === 'todos'  || u.nivelAcesso === filtroNivel
    const bateEquipe = filtroEquipe === 'todas'  || u.equipe      === filtroEquipe
    return bateTexto && bateNivel && bateEquipe
  })

  return (
    <div className="p-6 lg:p-8 max-w-6xl mx-auto">

      {/* Cabeçalho */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Usuários</h1>
          <p className="text-gray-500 text-sm mt-0.5">{registeredUsers.length} membros cadastrados no sistema</p>
        </div>
        <button
          onClick={onCadastrarNovo}
          className="inline-flex items-center gap-2 bg-primary text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-primary-dark transition-all shadow-sm self-start sm:self-auto"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Novo usuário
        </button>
      </div>

      {/* Cards de resumo */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-7">
        {[
          { label: 'Total',        valor: registeredUsers.length,                                             icon: '👥', cor: 'bg-blue-50 text-blue-600'   },
          { label: 'Gestores',     valor: registeredUsers.filter(u => u.nivelAcesso === 'gestor').length,     icon: '🎯', cor: 'bg-purple-50 text-purple-600' },
          { label: 'Colaboradores',valor: registeredUsers.filter(u => u.nivelAcesso === 'colaborador').length,icon: '🤝', cor: 'bg-teal-50 text-teal-600'   },
          { label: 'Equipes',      valor: equipes.length,                                                     icon: '🏷️', cor: 'bg-orange-50 text-orange-600' },
        ].map(({ label, valor, icon, cor }) => (
          <div key={label} className="bg-white rounded-xl border border-gray-100 p-4 flex items-center gap-3 shadow-sm">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${cor}`}>
              {icon}
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{valor}</p>
              <p className="text-xs text-gray-500">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-xl border border-gray-100 p-4 mb-4 flex flex-col sm:flex-row gap-3 shadow-sm">
        <div className="relative flex-1">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={busca}
            onChange={e => setBusca(e.target.value)}
            placeholder="Buscar por nome, e-mail ou cargo..."
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
          />
        </div>

        <select
          value={filtroNivel}
          onChange={e => setFiltroNivel(e.target.value)}
          className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-gray-700 appearance-none min-w-[150px]"
        >
          <option value="todos">Todos os níveis</option>
          <option value="gestor">Gestor</option>
          <option value="colaborador">Colaborador</option>
          <option value="analista">Analista</option>
          <option value="estagiario">Estagiário</option>
        </select>

        <select
          value={filtroEquipe}
          onChange={e => setFiltroEquipe(e.target.value)}
          className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-gray-700 appearance-none min-w-[150px]"
        >
          <option value="todas">Todas as equipes</option>
          {equipes.map(eq => <option key={eq} value={eq}>{eq}</option>)}
        </select>
      </div>

      {/* Estado de carregamento */}
      {carregando ? (
        <div className="bg-white rounded-xl border border-gray-100 p-12 text-center shadow-sm">
          <svg className="w-6 h-6 text-primary animate-spin mx-auto mb-2" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
          </svg>
          <p className="text-gray-400 text-sm">Carregando usuários...</p>
        </div>
      ) : filtrados.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 p-12 text-center shadow-sm">
          <p className="text-gray-400 text-sm">Nenhum usuário encontrado com esses filtros.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          {/* Cabeçalho da tabela */}
          <div className="hidden md:grid grid-cols-[1fr_1.5fr_1fr_1fr_1fr] gap-4 px-5 py-3 bg-gray-50 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wide">
            <span>Usuário</span>
            <span>E-mail / Cargo</span>
            <span>Nível</span>
            <span>Equipe</span>
            <span>Status</span>
          </div>

          {/* Linhas */}
          <div className="divide-y divide-gray-50">
            {filtrados.map((u, i) => (
              <div
                key={u.id || i}
                className="grid md:grid-cols-[1fr_1.5fr_1fr_1fr_1fr] gap-4 px-5 py-4 items-center hover:bg-gray-50/60 transition-colors"
              >
                {/* Nome + iniciais */}
                <div className="flex items-center gap-3 min-w-0">
                  <Initials nome={u.nome || u.name} />
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">{u.nome || u.name}</p>
                    <p className="text-xs text-gray-400 truncate md:hidden">{u.email}</p>
                  </div>
                </div>

                {/* E-mail + cargo */}
                <div className="hidden md:block min-w-0">
                  <p className="text-sm text-gray-700 truncate">{u.email}</p>
                  <p className="text-xs text-gray-400 truncate">{u.cargo || '—'}</p>
                </div>

                {/* Nível */}
                <div>
                  {u.nivelAcesso
                    ? <Badge config={NIVEL_BADGE[u.nivelAcesso]} />
                    : <span className="text-xs text-gray-300">—</span>
                  }
                </div>

                {/* Equipe */}
                <div>
                  {u.equipe
                    ? <span className="text-sm text-gray-600">{u.equipe}</span>
                    : <span className="text-xs text-gray-300">—</span>
                  }
                </div>

                {/* Status */}
                <div>
                  <Badge config={STATUS_BADGE[u.status] || STATUS_BADGE.ativo} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}