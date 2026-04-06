import React from 'react'

const prioridadeConfig = {
  high: { label: 'high', className: 'bg-red-50 text-red-500 border border-red-100' },
  medium: { label: 'medium', className: 'bg-yellow-50 text-yellow-600 border border-yellow-100' },
  low: { label: 'low', className: 'bg-green-50 text-green-600 border border-green-100' },
}

const TarefaCard = ({ tarefa }) => {
  const prioridade = prioridadeConfig[tarefa.prioridade]

  return (
    <div className="bg-white rounded-2xl p-4 border border-gray-100 hover:border-primary/20 hover:shadow-sm transition-all">
      {/* Header */}
      <div className="flex items-start justify-between mb-2">
        <h4 className="font-semibold text-gray-900 text-sm leading-snug pr-2">{tarefa.titulo}</h4>
        <button className="text-gray-300 hover:text-gray-500 transition-colors flex-shrink-0">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
          </svg>
        </button>
      </div>

      <p className="text-xs text-gray-500 mb-4 leading-relaxed">{tarefa.descricao}</p>

      {/* Footer */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-gray-600 bg-gray-50 border border-gray-100 px-2 py-0.5 rounded-lg">
            {tarefa.horas}
          </span>
          <span className={`text-xs font-medium px-2 py-0.5 rounded-lg ${prioridade.className}`}>
            {prioridade.label}
          </span>
        </div>
        <img
          src={tarefa.avatar}
          className="w-7 h-7 rounded-full border-2 border-white shadow-sm object-cover"
          alt="assignee"
        />
      </div>
    </div>
  )
}

export default TarefaCard
