import React, { useState } from 'react'

const PRIORIDADE = {
  high:   { label: 'Alta',   dot: 'bg-red-400',    pill: 'bg-red-50   text-red-600   ring-1 ring-red-100'    },
  medium: { label: 'Média',  dot: 'bg-amber-400',  pill: 'bg-amber-50 text-amber-600 ring-1 ring-amber-100'  },
  low:    { label: 'Baixa',  dot: 'bg-emerald-400',pill: 'bg-emerald-50 text-emerald-600 ring-1 ring-emerald-100' },
}

export default function TarefaCard({ tarefa }) {
  const [checked, setChecked] = useState(false)
  const pri = PRIORIDADE[tarefa.prioridade] || PRIORIDADE.low

  return (
    <div className={`bg-white rounded-2xl p-4 border transition-all group cursor-pointer card-hover ${
      checked ? 'border-emerald-100 bg-emerald-50/30' : 'border-gray-100 hover:border-primary/20'
    }`}>
      {/* Prioridade dot + título */}
      <div className="flex items-start gap-2.5 mb-2">
        <button
          onClick={e => { e.stopPropagation(); setChecked(v => !v) }}
          className={`mt-0.5 w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
            checked ? 'bg-emerald-500 border-emerald-500' : 'border-gray-300 hover:border-primary'
          }`}
        >
          {checked && (
            <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7"/>
            </svg>
          )}
        </button>
        <h4 className={`font-semibold text-sm leading-snug flex-1 transition-colors ${
          checked ? 'text-gray-400 line-through' : 'text-gray-900'
        }`}>{tarefa.titulo}</h4>

        {/* Menu */}
        <button className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-300 hover:text-gray-500 flex-shrink-0">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z"/>
          </svg>
        </button>
      </div>

      {/* Descrição */}
      {!checked && (
        <p className="text-xs text-gray-400 leading-relaxed mb-3 ml-6.5 line-clamp-2" style={{ marginLeft: '26px' }}>
          {tarefa.descricao}
        </p>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between ml-6.5" style={{ marginLeft: '26px' }}>
        <div className="flex items-center gap-1.5">
          {/* Prioridade */}
          <span className={`badge text-[10px] ${pri.pill}`}>
            <span className={`w-1.5 h-1.5 rounded-full mr-1 ${pri.dot}`}/>
            {pri.label}
          </span>

          {/* Tempo estimado */}
          <span className="badge text-[10px] bg-gray-50 text-gray-500 ring-1 ring-gray-100" title="Tempo estimado para conclusão">
            <svg className="w-2.5 h-2.5 mr-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            {tarefa.horas}
          </span>
        </div>

        {/* Avatar */}
        {tarefa.avatar && (
          <img src={tarefa.avatar} className="w-6 h-6 rounded-full border-2 border-white shadow-sm object-cover" alt=""/>
        )}
      </div>
    </div>
  )
}
