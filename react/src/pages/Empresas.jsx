import React, { useState } from 'react'
import EmpresaCard from '../components/EmpresaCard'
import { empresas } from '../data/mockData'

export default function Empresas({ onEmpresaClick }) {
  const [search, setSearch] = useState('')

  const filtered = empresas.filter(e =>
    e.nome.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="px-8 py-8 animate-fade-up">

      {/* ── Header ── */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Empresas</h1>
          <p className="text-sm text-gray-400 mt-0.5">{empresas.length} clientes gerenciados</p>
        </div>
        <button className="btn-primary">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4"/>
          </svg>
          Nova empresa
        </button>
      </div>

      {/* ── Busca ── */}
      <div className="relative mb-7 max-w-md">
        {/* <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
        </svg> */}
        <input
          type="text" value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Buscar empresa..."
          className="input-base pl-10"
        />
      </div>

      {/* ── Grid ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((empresa, i) => (
          <div key={empresa.id} className="animate-fade-up" style={{ animationDelay: `${i * 40}ms` }}>
            <EmpresaCard empresa={empresa} onClick={onEmpresaClick} />
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center mt-2">
          <p className="text-gray-400 text-sm">Nenhuma empresa encontrada.</p>
        </div>
      )}
    </div>
  )
}
