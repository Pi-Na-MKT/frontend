import React from 'react'

export default function EmpresaCard({ empresa, onClick }) {
  return (
    <div
      onClick={() => onClick(empresa)}
      className="bg-white rounded-2xl border border-gray-100 p-6 cursor-pointer group card-hover"
    >
      <div className="flex items-center gap-4">
        <div className={`${empresa.cor} w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-base shadow-sm flex-shrink-0`}>
          {empresa.inicial}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 text-base group-hover:text-primary transition-colors truncate">{empresa.nome}</h3>
          <p className="text-sm text-gray-400 mt-0.5">
            {empresa.tarefas} tarefas · {empresa.campanhasAtivas} ativa{empresa.campanhasAtivas !== 1 ? 's' : ''}
          </p>
        </div>
        <svg className="w-4 h-4 text-gray-300 group-hover:text-primary transition-colors flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/>
        </svg>
      </div>
    </div>
  )
}
