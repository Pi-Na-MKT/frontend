import React, { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import EmpresaCard from '../components/EmpresaCard'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'

const toSlug = (name) =>
  name.normalize('NFD').replace(/[̀-ͯ]/g, '')
      .toLowerCase().trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')

function ModalNovaEmpresa({ onFechar, onCriada }) {
  const [form, setForm]     = useState({ nome: '', slug: '', active: true })
  const [slugManual, setSlugManual] = useState(false)
  const [erro, setErro]     = useState('')
  const [loading, setLoading] = useState(false)
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }))

  const handleNome = (v) => {
    set('nome', v)
    if (!slugManual) set('slug', toSlug(v))
  }

  const handleSlug = (v) => {
    setSlugManual(true)
    set('slug', v.toLowerCase().replace(/[^a-z0-9-]/g, ''))
  }

  const handleSubmit = async () => {
    if (!form.nome.trim()) { setErro('Nome é obrigatório.'); return }
    if (!form.slug.trim()) { setErro('Slug é obrigatório.'); return }
    setErro(''); setLoading(true)
    try {
      const { data } = await api.post('/companies', {
        name:   form.nome.trim(),
        slug:   form.slug.trim(),
        active: form.active,
      })
      onCriada(data)
    } catch (err) {
      setErro(err.response?.data?.detail || err.response?.data?.message || 'Erro ao criar empresa.')
    } finally {
      setLoading(false)
    }
  }

  return createPortal(
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md animate-scale-in">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h3 className="text-base font-bold text-gray-900">Nova empresa</h3>
          <button onClick={onFechar} className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 flex flex-col gap-4">

          <div>
            <label className="section-title block mb-1.5">Nome da empresa <span className="text-red-400">*</span></label>
            <input
              autoFocus
              value={form.nome}
              onChange={e => handleNome(e.target.value)}
              placeholder="Ex.: Tech Solutions"
              className="input-base"
            />
          </div>

          <div>
            <label className="section-title block mb-1.5">
              Slug (URL)
              {!slugManual && form.nome && (
                <span className="ml-2 text-[10px] font-normal text-primary normal-case">gerado automaticamente</span>
              )}
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 pointer-events-none select-none">
                /
              </span>
              <input
                value={form.slug}
                onChange={e => handleSlug(e.target.value)}
                placeholder="tech-solutions"
                className="input-base pl-5 font-mono text-sm"
              />
            </div>
            <p className="text-[11px] text-gray-400 mt-1">Apenas letras minúsculas, números e hifens.</p>
          </div>

          <div className="flex items-center justify-between py-1">
            <div>
              <p className="text-sm font-semibold text-gray-800">Empresa ativa</p>
              <p className="text-xs text-gray-400">Empresa visível para os membros</p>
            </div>
            <button
              type="button"
              onClick={() => set('active', !form.active)}
              className={`relative w-10 h-6 rounded-full transition-colors duration-200 flex-shrink-0 ${form.active ? 'bg-primary' : 'bg-gray-200'}`}>
              <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${form.active ? 'translate-x-5' : 'translate-x-1'}`}/>
            </button>
          </div>

          {erro && (
            <div className="flex items-center gap-2 px-3 py-2.5 bg-red-50 border border-red-100 rounded-xl text-sm text-red-600">
              <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              {erro}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex gap-3 px-6 py-4 border-t border-gray-100">
          <button onClick={onFechar} className="btn-ghost flex-1 justify-center">Cancelar</button>
          <button onClick={handleSubmit} disabled={loading} className="btn-primary flex-1 justify-center disabled:opacity-50">
            {loading ? (
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4"/>
              </svg>
            )}
            {loading ? 'Criando...' : 'Criar empresa'}
          </button>
        </div>
      </div>
    </div>,
    document.body
  )
}

export default function Empresas({ onEmpresaClick }) {
  const { user, companies, fetchCompanies } = useAuth()
  const [search, setSearch]       = useState('')
  const [loading, setLoading]     = useState(false)
  const [modalAberto, setModalAberto] = useState(false)

  const isAdmin = user?.role?.toUpperCase() === 'ADMIN'

  useEffect(() => {
    setLoading(true)
    fetchCompanies().finally(() => setLoading(false))
  }, [])

  const filtered = companies.filter(e =>
    e.nome.toLowerCase().includes(search.toLowerCase())
  )

  const handleCriada = () => {
    setModalAberto(false)
    setLoading(true)
    fetchCompanies().finally(() => setLoading(false))
  }

  return (
    <div className="px-8 py-8 animate-fade-up">

      {/* ── Header ── */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Empresas</h1>
          <p className="text-sm text-gray-400 mt-0.5">
            {companies.length} cliente{companies.length !== 1 ? 's' : ''} gerenciado{companies.length !== 1 ? 's' : ''}
          </p>
        </div>
        {isAdmin && (
          <button onClick={() => setModalAberto(true)} className="btn-primary">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4"/>
            </svg>
            Nova empresa
          </button>
        )}
      </div>

      {/* ── Busca ── */}
      <div className="relative mb-7 max-w-md">
        <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
        </svg>
        <input
          type="text" value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Buscar empresa..."
          className="input-base pl-10"
        />
      </div>

      {/* ── Loading ── */}
      {loading && (
        <div className="flex items-center justify-center py-16">
          <svg className="w-6 h-6 text-primary animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
          </svg>
        </div>
      )}

      {/* ── Grid ── */}
      {!loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((empresa, i) => (
            <div key={empresa.id} className="animate-fade-up" style={{ animationDelay: `${i * 40}ms` }}>
              <EmpresaCard empresa={empresa} onClick={onEmpresaClick} />
            </div>
          ))}
        </div>
      )}

      {!loading && filtered.length === 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center mt-2">
          <p className="text-gray-400 text-sm">
            {search ? 'Nenhuma empresa encontrada.' : 'Nenhuma empresa cadastrada ainda.'}
          </p>
        </div>
      )}

      {/* ── Modal ── */}
      {modalAberto && (
        <ModalNovaEmpresa
          onFechar={() => setModalAberto(false)}
          onCriada={handleCriada}
        />
      )}
    </div>
  )
}
