import React, { useState } from 'react'
import EmpresaCard from '../components/EmpresaCard'
import { empresas } from '../data/mockData'

const Empresas = ({ onEmpresaClick }) => {
  const [search, setSearch] = useState('')

  const filtered = empresas.filter((e) =>
    e.nome.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Empresas</h1>
          <p className="text-sm text-gray-500 mt-1">Gerencie as campanhas e tarefas de seus clientes</p>
        </div>
        <button className="flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-primary-dark transition-colors shadow-sm">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
          </svg>
          Nova Empresa
        </button>
      </div>

      {/* Section */}
      <h2 className="text-base font-semibold text-gray-700 mb-4">Empresas Gerenciadas</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((empresa) => (
          <EmpresaCard key={empresa.id} empresa={empresa} onClick={onEmpresaClick} />
        ))}
      </div>
    </div>
  )
}

export default Empresas
