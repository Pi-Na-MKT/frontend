import React from 'react'

const EmpresaCard = ({ empresa, onClick }) => {
  return (
    <div
      onClick={() => onClick(empresa)}
      className="bg-white rounded-2xl p-5 border border-gray-100 hover:border-primary/30 hover:shadow-md transition-all cursor-pointer group"
    >
      {/* Header */}
      <div className="flex items-center gap-4 mb-4">
        <div className={`${empresa.cor} w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-sm flex-shrink-0`}>
          {empresa.inicial}
        </div>
        <div>
          <h3 className="font-semibold text-gray-900 group-hover:text-primary transition-colors">{empresa.nome}</h3>
          <p className="text-sm text-gray-500">Campanhas ativas: {empresa.campanhasAtivas}</p>
        </div>
      </div>

      {/* Stats */}
      <div className="flex items-center gap-5 text-sm text-gray-500">
        <div className="flex items-center gap-1.5">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          <span>{empresa.tarefas} tarefas</span>
        </div>
        <div className="flex items-center gap-1.5">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
          <span>{empresa.campanhas} campanhas</span>
        </div>
      </div>
    </div>
  )
}

export default EmpresaCard
