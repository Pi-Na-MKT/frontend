import React, { useState } from 'react'
import TarefaCard from '../components/TarefaCard'
import { tarefas as tarefasIniciais } from '../data/mockData'

const colunasIniciais = [
  { id: 'naoIniciadas', label: 'Não Iniciadas', cor: 'bg-gray-400' },
  { id: 'emExecucao',   label: 'Em Execução',   cor: 'bg-blue-500' },
  { id: 'finalizadas',  label: 'Finalizadas',   cor: 'bg-emerald-500' },
]

export default function Tarefas({ empresa, onBack, onDashboard }) {
  const [colunas, setColunas]         = useState(colunasIniciais)
  const [tarefasData, setTarefasData] = useState({ ...tarefasIniciais })
  const [adicionandoColuna, setAdicionandoColuna] = useState(false)
  const [novaColunaNome, setNovaColunaNome]       = useState('')
  const [editandoColuna, setEditandoColuna]       = useState(null)
  const [editandoNome, setEditandoNome]           = useState('')
  const [confirmDeleteColuna, setConfirmDeleteColuna] = useState(null)

  const totalTarefas = Object.values(tarefasData).reduce((s, arr) => s + arr.length, 0)
  const finalizadas  = (tarefasData['finalizadas'] || []).length

  const handleAdicionarColuna = () => {
    const nome = novaColunaNome.trim()
    if (!nome) return
    const id = `coluna_${Date.now()}`
    setColunas(prev => [...prev, { id, label: nome, cor: 'bg-violet-400' }])
    setTarefasData(prev => ({ ...prev, [id]: [] }))
    setNovaColunaNome('')
    setAdicionandoColuna(false)
  }

  const confirmarEdicao = () => {
    const nome = editandoNome.trim()
    if (!nome) return
    setColunas(prev => prev.map(c => c.id === editandoColuna ? { ...c, label: nome } : c))
    setEditandoColuna(null)
  }

  const confirmarExclusao = () => {
    const id = confirmDeleteColuna
    setColunas(prev => prev.filter(c => c.id !== id))
    setTarefasData(prev => { const n = { ...prev }; delete n[id]; return n })
    setConfirmDeleteColuna(null)
  }

  return (
    <div className="h-full flex flex-col animate-fade-up">
      {/* ── Header ── */}
      <div className="flex-shrink-0 bg-white border-b border-gray-100 px-6 py-4">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-gray-400 mb-3">
          <button onClick={onBack} className="hover:text-primary transition-colors font-medium">Empresas</button>
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/>
          </svg>
          <span className="text-gray-600 font-semibold">{empresa?.nome || 'Empresa'}</span>
        </nav>

        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {empresa && (
              <div className={`w-9 h-9 rounded-xl ${empresa.cor} flex items-center justify-center text-white text-sm font-bold shadow-sm`}>
                {empresa.inicial}
              </div>
            )}
            <div>
              <h1 className="text-lg font-bold text-gray-900">{empresa?.nome || 'Empresa'}</h1>
              <p className="text-xs text-gray-400">
                {totalTarefas} tarefa{totalTarefas !== 1 ? 's' : ''} ·{' '}
                <span className="text-emerald-600 font-semibold">{finalizadas} concluída{finalizadas !== 1 ? 's' : ''}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Progresso rápido */}
            {totalTarefas > 0 && (
              <div className="hidden sm:flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2">
                <div className="w-20 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                    style={{ width: `${Math.round((finalizadas / totalTarefas) * 100)}%` }}/>
                </div>
                <span className="text-xs font-semibold text-gray-600">
                  {Math.round((finalizadas / totalTarefas) * 100)}%
                </span>
              </div>
            )}
            <button onClick={onDashboard} className="btn-primary">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/>
              </svg>
              Dashboard
            </button>
          </div>
        </div>
      </div>

      {/* ── Kanban board ── */}
      <div className="flex-1 overflow-x-auto overflow-y-hidden">
        <div className="flex gap-5 p-6 h-full kanban-board" style={{ alignItems: 'flex-start', minWidth: 'max-content' }}>
          {colunas.map((coluna) => {
            const cards = tarefasData[coluna.id] || []
            const isEditing = editandoColuna === coluna.id

            return (
              <div key={coluna.id}
                className="kanban-col flex flex-col bg-gray-100/70 rounded-2xl flex-shrink-0 w-80"
                style={{ maxHeight: 'calc(100vh - 160px)' }}>

                {/* Header coluna */}
                <div className="flex items-center gap-2 px-4 pt-4 pb-3 flex-shrink-0">
                  <div className={`w-2 h-2 rounded-full ${coluna.cor} flex-shrink-0`}/>

                  {isEditing ? (
                    <input autoFocus type="text" value={editandoNome}
                      onChange={e => setEditandoNome(e.target.value)}
                      onKeyDown={e => { if (e.key === 'Enter') confirmarEdicao(); if (e.key === 'Escape') setEditandoColuna(null) }}
                      onBlur={confirmarEdicao}
                      className="flex-1 px-2 py-1 rounded-lg text-sm bg-white border border-primary/40 focus:outline-none font-semibold"/>
                  ) : (
                    <h2 className="text-sm font-bold text-gray-700 flex-1 truncate">{coluna.label}</h2>
                  )}

                  <span className="w-5 h-5 rounded-full bg-gray-200 text-gray-500 text-[10px] font-bold flex items-center justify-center flex-shrink-0">
                    {cards.length}
                  </span>

                  {!isEditing && (
                    <div className="flex items-center gap-0.5">
                      <button onClick={() => { setEditandoColuna(coluna.id); setEditandoNome(coluna.label) }}
                        className="w-6 h-6 rounded-lg text-gray-400 hover:text-primary hover:bg-white transition-all flex items-center justify-center" title="Renomear">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                        </svg>
                      </button>
                      <button onClick={() => setConfirmDeleteColuna(coluna.id)}
                        className="w-6 h-6 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all flex items-center justify-center" title="Excluir">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                        </svg>
                      </button>
                    </div>
                  )}
                </div>

                {/* Separador colorido */}
                <div className={`mx-4 h-0.5 ${coluna.cor} opacity-30 rounded-full mb-3 flex-shrink-0`}/>

                {/* Cards com scroll */}
                <div className="flex-1 overflow-y-auto px-4 pb-4 flex flex-col gap-2.5 scrollbar-thin">
                  {cards.map(tarefa => (
                    <TarefaCard key={tarefa.id} tarefa={tarefa}/>
                  ))}

                  {/* Botão add card */}
                  <button className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-dashed border-gray-200 text-xs font-medium text-gray-400 hover:border-primary/30 hover:text-primary/60 hover:bg-white/70 transition-all mt-1">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/>
                    </svg>
                    Adicionar card
                  </button>
                </div>
              </div>
            )
          })}

          {/* Nova coluna */}
          <div className="flex-shrink-0 w-80 kanban-col">
            {adicionandoColuna ? (
              <div className="bg-gray-100/70 rounded-2xl p-4">
                <input autoFocus type="text" value={novaColunaNome}
                  onChange={e => setNovaColunaNome(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') handleAdicionarColuna(); if (e.key === 'Escape') { setAdicionandoColuna(false); setNovaColunaNome('') } }}
                  placeholder="Nome da coluna..."
                  className="input-base mb-3 bg-white"/>
                <div className="flex gap-2">
                  <button onClick={handleAdicionarColuna} className="btn-primary flex-1 justify-center py-2">
                    Adicionar
                  </button>
                  <button onClick={() => { setAdicionandoColuna(false); setNovaColunaNome('') }}
                    className="w-9 h-9 rounded-xl bg-gray-200 hover:bg-gray-300 flex items-center justify-center text-gray-500 transition-colors flex-shrink-0">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
                    </svg>
                  </button>
                </div>
              </div>
            ) : (
              <button onClick={() => setAdicionandoColuna(true)}
                className="w-full flex items-center gap-2.5 px-4 py-3.5 rounded-2xl text-sm font-medium text-gray-500 hover:bg-gray-200/70 hover:text-gray-800 border-2 border-dashed border-gray-200 transition-all">
                <div className="w-6 h-6 rounded-lg bg-gray-200 flex items-center justify-center flex-shrink-0">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/>
                  </svg>
                </div>
                Nova coluna
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Modal excluir coluna */}
      {confirmDeleteColuna && (() => {
        const col = colunas.find(c => c.id === confirmDeleteColuna)
        const qtd = (tarefasData[confirmDeleteColuna] || []).length
        return (
          <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl animate-scale-in">
              <div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                </svg>
              </div>
              <h3 className="text-base font-bold text-gray-900 text-center mb-1">Excluir "{col?.label}"?</h3>
              {qtd > 0 && <p className="text-sm text-red-500 text-center mb-1 font-medium">{qtd} card{qtd !== 1 ? 's' : ''} serão perdidos.</p>}
              <p className="text-sm text-gray-400 text-center mb-5">Esta ação não pode ser desfeita.</p>
              <div className="flex gap-3">
                <button onClick={() => setConfirmDeleteColuna(null)} className="btn-ghost flex-1 justify-center">Cancelar</button>
                <button onClick={confirmarExclusao} className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white bg-red-500 hover:bg-red-600 transition-colors">Excluir</button>
              </div>
            </div>
          </div>
        )
      })()}
    </div>
  )
}
