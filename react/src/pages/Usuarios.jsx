import React, { useState, useEffect, useRef } from 'react'
import { useAuth } from '../context/AuthContext'

const STATUS_CFG = {
  ativo:   { label: 'Ativo',   cls: 'status-ativo'   },
  inativo: { label: 'Inativo', cls: 'status-inativo' },
}

function AvatarNeutro({ size = 'w-9 h-9' }) {
  return (
    <div className={`${size} rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0`}>
      <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
      </svg>
    </div>
  )
}

function UserAvatar({ user, size = 'w-9 h-9' }) {
  if (user?.avatar || user?.foto)
    return <img src={user.avatar || user.foto} className={`${size} rounded-full object-cover border-2 border-gray-100 flex-shrink-0`} alt=""/>
  return <AvatarNeutro size={size} />
}

function ModalEditar({ usuario, onSalvar, onFechar }) {
  const [form, setForm] = useState({
    nome: usuario.nome || usuario.name || '',
    email: usuario.email || '',
    cargo: usuario.cargo || '',
    equipe: usuario.equipe || '',
    status: usuario.status || 'ativo',
    avatar: usuario.avatar || usuario.foto || '',
  })
  const [preview, setPreview] = useState(form.avatar)
  const fileRef = useRef(null)
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }))

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 animate-fade-up">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md animate-scale-in">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h3 className="text-base font-bold text-gray-900">Editar usuário</h3>
          <button onClick={onFechar} className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <div className="px-6 py-5 flex flex-col gap-4">
          {/* Avatar upload */}
          <div className="flex items-center gap-4 pb-1">
            <div className="relative cursor-pointer group" onClick={() => fileRef.current?.click()}>
              {preview ? <img src={preview} className="w-16 h-16 rounded-full object-cover border-2 border-gray-200" alt=""/> : <AvatarNeutro size="w-16 h-16"/>}
              <div className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"/>
                </svg>
              </div>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-800">Foto de perfil</p>
              <p className="text-xs text-gray-400 mt-0.5">Clique na imagem para alterar</p>
            </div>
            <input ref={fileRef} type="file" accept="image/*" className="hidden"
              onChange={e => { const f = e.target.files?.[0]; if (f) { const r = new FileReader(); r.onload = ev => { setPreview(ev.target.result); set('avatar', ev.target.result) }; r.readAsDataURL(f) } }}/>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <label className="section-title block mb-1.5">Nome completo</label>
              <input value={form.nome} onChange={e => set('nome', e.target.value)} className="input-base" placeholder="Nome"/>
            </div>
            <div className="col-span-2">
              <label className="section-title block mb-1.5">E-mail</label>
              <input type="email" value={form.email} onChange={e => set('email', e.target.value)} className="input-base" placeholder="email@empresa.com"/>
            </div>
            <div>
              <label className="section-title block mb-1.5">Cargo</label>
              <input value={form.cargo} onChange={e => set('cargo', e.target.value)} className="input-base" placeholder="—"/>
            </div>
            <div>
              <label className="section-title block mb-1.5">Equipe</label>
              <input value={form.equipe} onChange={e => set('equipe', e.target.value)} className="input-base" placeholder="—"/>
            </div>
            <div>
              <label className="section-title block mb-1.5">Status</label>
              <select value={form.status} onChange={e => set('status', e.target.value)} className="input-base appearance-none">
                <option value="ativo">Ativo</option>
                <option value="inativo">Inativo</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex gap-3 px-6 py-4 border-t border-gray-100">
          <button onClick={onFechar} className="btn-ghost flex-1 justify-center">Cancelar</button>
          <button onClick={() => onSalvar({ ...usuario, ...form, nome: form.nome, name: form.nome })} className="btn-primary flex-1 justify-center">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/>
            </svg>
            Salvar
          </button>
        </div>
      </div>
    </div>
  )
}

export default function Usuarios({ onCadastrarNovo }) {
  const { registeredUsers, fetchUsers } = useAuth()
  const [lista,       setLista]       = useState([])
  const [busca,       setBusca]       = useState('')
  const [filtroEq,    setFiltroEq]    = useState('todas')
  const [filtroSt,    setFiltroSt]    = useState('todos')
  const [carregando,  setCarregando]  = useState(false)
  const [editando,    setEditando]    = useState(null)
  const [confirmDel,  setConfirmDel]  = useState(null)

  useEffect(() => { setCarregando(true); fetchUsers().finally(() => setCarregando(false)) }, [])
  useEffect(() => { setLista(registeredUsers.map(u => ({ ...u }))) }, [registeredUsers])

  const equipes  = [...new Set(lista.map(u => u.equipe).filter(Boolean))]
  const ativos   = lista.filter(u => (u.status || 'ativo') === 'ativo').length

  const filtrados = lista.filter(u => {
    const termo = busca.toLowerCase()
    const txt = !busca || [(u.nome || u.name), u.email, u.cargo].some(v => v?.toLowerCase().includes(termo))
    const eq  = filtroEq === 'todas'  || u.equipe === filtroEq
    const st  = filtroSt === 'todos'  || (u.status || 'ativo') === filtroSt
    return txt && eq && st
  })

  return (
    <div className="p-6 lg:p-8 max-w-6xl mx-auto animate-fade-up">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <p className="section-title mb-1">Gestão de pessoas</p>
          <h1 className="page-header">Usuários</h1>
          <p className="page-sub">{lista.length} membros · {ativos} ativos</p>
        </div>
        <button onClick={onCadastrarNovo} className="btn-primary self-start sm:self-auto">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4"/>
          </svg>
          Novo usuário
        </button>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-7">
        {[
          { label: 'Total',    v: lista.length,  cor: 'text-violet-600', bg: 'bg-violet-50',  border: 'border-violet-100' },
          { label: 'Ativos',   v: ativos,         cor: 'text-emerald-600',bg: 'bg-emerald-50', border: 'border-emerald-100' },
          { label: 'Inativos', v: lista.filter(u => u.status === 'inativo').length, cor: 'text-gray-500', bg: 'bg-gray-50', border: 'border-gray-200' },
          { label: 'Equipes',  v: equipes.length, cor: 'text-amber-600', bg: 'bg-amber-50',  border: 'border-amber-100' },
        ].map(({ label, v, cor, bg, border }) => (
          <div key={label} className={`${bg} ${border} border rounded-2xl p-4 flex items-center justify-between`}>
            <span className="text-sm font-medium text-gray-600">{label}</span>
            <span className={`text-2xl font-bold ${cor}`}>{v}</span>
          </div>
        ))}
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-2xl border border-gray-100 p-4 mb-5 flex flex-col sm:flex-row gap-3 shadow-sm">
        <div className="relative flex-1">
          <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
          <input type="text" value={busca} onChange={e => setBusca(e.target.value)} placeholder="Buscar por nome, e-mail ou cargo..."
            className="input-base pl-10 bg-gray-50 border-gray-200"/>
        </div>
        <select value={filtroEq} onChange={e => setFiltroEq(e.target.value)}
          className="input-base bg-gray-50 border-gray-200 appearance-none min-w-[160px]">
          <option value="todas">Todas as equipes</option>
          {equipes.map(eq => <option key={eq} value={eq}>{eq}</option>)}
        </select>
        <select value={filtroSt} onChange={e => setFiltroSt(e.target.value)}
          className="input-base bg-gray-50 border-gray-200 appearance-none min-w-[130px]">
          <option value="todos">Todos os status</option>
          <option value="ativo">Ativo</option>
          <option value="inativo">Inativo</option>
        </select>
      </div>

      {/* Tabela */}
      {carregando ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
          <svg className="w-6 h-6 text-primary animate-spin mx-auto mb-3" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
          </svg>
          <p className="text-gray-400 text-sm">Carregando usuários...</p>
        </div>
      ) : filtrados.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center">
          <AvatarNeutro size="w-12 h-12"/>
          <p className="text-gray-400 text-sm mt-3 font-medium">Nenhum usuário encontrado</p>
          <p className="text-gray-300 text-xs mt-1">Tente ajustar os filtros</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="hidden md:grid grid-cols-[1fr_1.6fr_1fr_1fr_80px] gap-4 px-5 py-3.5 bg-gray-50/80 border-b border-gray-100">
            {['Usuário', 'E-mail / Cargo', 'Equipe', 'Status', 'Ações'].map(h => (
              <span key={h} className="section-title">{h}</span>
            ))}
          </div>

          <div className="divide-y divide-gray-50">
            {filtrados.map((u, i) => (
              <div key={u.id || u.email || i}
                className="grid md:grid-cols-[1fr_1.6fr_1fr_1fr_80px] gap-4 px-5 py-3.5 items-center hover:bg-gray-50/50 transition-colors group animate-fade-up"
                style={{ animationDelay: `${i * 30}ms` }}>

                <div className="flex items-center gap-3 min-w-0">
                  <UserAvatar user={u}/>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">{u.nome || u.name}</p>
                  </div>
                </div>

                <div className="hidden md:block min-w-0">
                  <p className="text-sm text-gray-700 truncate">{u.email}</p>
                  <p className="text-xs text-gray-400 truncate mt-0.5">{u.cargo || '—'}</p>
                </div>

                <div className="hidden md:block">
                  {u.equipe
                    ? <span className="badge bg-gray-100 text-gray-600 ring-1 ring-gray-200/80">{u.equipe}</span>
                    : <span className="text-xs text-gray-300">—</span>}
                </div>

                <div>
                  <span className={`badge ${(STATUS_CFG[u.status || 'ativo']).cls}`}>
                    <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${u.status === 'inativo' ? 'bg-gray-400' : 'bg-emerald-500'}`}/>
                    {(STATUS_CFG[u.status || 'ativo']).label}
                  </span>
                </div>

                <div className="flex items-center gap-1">
                  <button onClick={() => setEditando(u)}
                    className="p-2 rounded-lg text-gray-300 hover:text-primary hover:bg-primary/10 transition-all"
                    title="Editar">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                    </svg>
                  </button>
                  <button onClick={() => setConfirmDel(u)}
                    className="p-2 rounded-lg text-gray-300 hover:text-red-500 hover:bg-red-50 transition-all"
                    title="Excluir">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {editando && <ModalEditar usuario={editando} onSalvar={u => { setLista(p => p.map(x => (x.id || x.email) === (u.id || u.email) ? u : x)); setEditando(null) }} onFechar={() => setEditando(null)}/>}

      {confirmDel && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl animate-scale-in">
            <div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
              </svg>
            </div>
            <h3 className="text-base font-bold text-gray-900 text-center mb-1">Excluir usuário?</h3>
            <p className="text-sm text-gray-500 text-center mb-5">
              "<span className="font-semibold">{confirmDel.nome || confirmDel.name}</span>" será removido permanentemente.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setConfirmDel(null)} className="btn-ghost flex-1 justify-center">Cancelar</button>
              <button onClick={() => { setLista(p => p.filter(u => (u.id || u.email) !== (confirmDel.id || confirmDel.email))); setConfirmDel(null) }}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white bg-red-500 hover:bg-red-600 transition-colors">
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
