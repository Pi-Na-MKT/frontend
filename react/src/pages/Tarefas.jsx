import React from 'react'
import TarefaCard from '../components/TarefaCard'
import { tarefas } from '../data/mockData'

const colunas = [
  { id: 'naoIniciadas', label: 'Não Iniciadas', key: 'naoIniciadas' },
  { id: 'emExecucao',   label: 'Em Execução',   key: 'emExecucao' },
  { id: 'finalizadas',  label: 'Finalizadas',    key: 'finalizadas' },
]

const Tarefas = ({ empresa, onBack, onDashboard }) => {
  return (
    <div className="max-w-7xl mx-auto px-6 py-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-4">
        <button onClick={onBack} className="hover:text-primary transition-colors">Empresas</button>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
        <span className="font-semibold text-gray-900">{empresa?.nome || 'Loja Aurora'}</span>
      </nav>

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-xl font-bold text-gray-900">
          {empresa?.nome || 'Loja Aurora'} — Gestão de Tarefas
        </h1>
        <button
          onClick={onDashboard}
          className="flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-primary-dark transition-colors shadow-sm"
        >
          Ver Dashboard
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </button>
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {colunas.map((coluna) => {
          const cards = tarefas[coluna.key] || []
          return (
            <div key={coluna.id} className="bg-gray-100/80 rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-4">
                <h2 className="font-semibold text-gray-800">{coluna.label}</h2>
                <span className="bg-gray-200 text-gray-600 text-xs font-semibold w-5 h-5 rounded-full flex items-center justify-center">
                  {cards.length}
                </span>
              </div>
              <div className="flex flex-col gap-3">
                {cards.map((tarefa) => (
                  <TarefaCard key={tarefa.id} tarefa={tarefa} />
                ))}
                <button className="w-full border-2 border-dashed border-gray-200 rounded-2xl py-3 text-sm text-gray-400 hover:border-primary/40 hover:text-primary/60 transition-all flex items-center justify-center gap-2 bg-white/50">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Adicionar Card
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default Tarefas
