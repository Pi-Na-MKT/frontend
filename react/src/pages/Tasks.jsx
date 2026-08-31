import React from 'react'
import CardModal from '../components/CardModal'
import KanbanColumn from '../components/KanbanColumn'
import ConfirmDialog from '../components/ConfirmDialog'
import Spinner from '../components/Spinner'
import { useAuth } from '../context/AuthContext'
import { useBoard } from '../hooks/useBoard'
import { useDragDrop } from '../hooks/useDragDrop'

export default function Tarefas({ empresa, onBack, onDashboard }) {
  const { user, registeredUsers } = useAuth()
  const canManage = ['ADMIN', 'MANAGER'].includes(user?.role?.toUpperCase())

  // hook que gerencia toda a lógica do board
  const boardHook = useBoard(empresa)
  
  // hook que gerencia drag & drop
  const dragDropHook = useDragDrop({
    onCardsChange: boardHook.setCardsByColumn,
    onColumnsChange: boardHook.setColumns,
    onLoadBoard: boardHook.loadBoard,
  })

  // ─────────────────────────────────────────────────────────────────────────

  const totalCards   = Object.values(boardHook.cardsByColumn).reduce((s, arr) => s + arr.length, 0)
  const doneColumnId = boardHook.columns.find(c => c.label.toLowerCase().includes('conclu') || c.label.toLowerCase().includes('finaliz'))?.id
  const doneCount    = doneColumnId ? (boardHook.cardsByColumn[doneColumnId] || []).length : 0
  const donePercent  = totalCards > 0 ? Math.round((doneCount / totalCards) * 100) : 0

  return (
    <div className="h-full flex flex-col animate-fade-up">

      <div className="flex-shrink-0 bg-white border-b border-gray-100 px-6 py-4">
        <nav className="flex items-center gap-2 text-xs text-gray-400 mb-3">
          <button onClick={onBack} className="hover:text-primary transition-colors font-medium">Companies</button>
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/>
          </svg>
          <span className="text-gray-600 font-semibold">{empresa?.nome || empresa?.name}</span>
        </nav>

        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {empresa && (
              <div className={`w-9 h-9 rounded-xl ${empresa.cor} flex items-center justify-center text-white text-sm font-bold shadow-sm`}>
                {empresa.inicial}
              </div>
            )}
            <div>
              <h1 className="text-lg font-bold text-gray-900">{empresa?.nome || empresa?.name}</h1>
              <p className="text-xs text-gray-400">
                {totalCards} tarefa{totalCards !== 1 ? 's' : ''} ·{' '}
                <span className="text-emerald-600 font-semibold">{doneCount} concluída{doneCount !== 1 ? 's' : ''}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {totalCards > 0 && (
              <div className="hidden sm:flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2">
                <div className="w-20 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full transition-all duration-500" style={{ width: `${donePercent}%` }}/>
                </div>
                <span className="text-xs font-semibold text-gray-600">{donePercent}%</span>
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

      {boardHook.loading && (
        <div className="flex-1 flex items-center justify-center">
          <Spinner/>
        </div>
      )}

      {!boardHook.loading && !boardHook.board && (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center max-w-xs">
            <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-7 h-7 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
              </svg>
            </div>
            <p className="text-gray-700 font-semibold text-sm mb-1">Nenhum board encontrado</p>
            {canManage ? (
              <>
                <p className="text-gray-400 text-xs mb-5">Crie o board desta empresa para começar a organizar as tarefas.</p>
                <button onClick={boardHook.handleCreateBoard} disabled={boardHook.creatingBoard} className="btn-primary disabled:opacity-50">
                  {boardHook.creatingBoard ? <Spinner size="sm" className="text-white"/> : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4"/>
                    </svg>
                  )}
                  {boardHook.creatingBoard ? 'Criando...' : 'Criar board'}
                </button>
              </>
            ) : (
              <p className="text-gray-400 text-xs">Aguarde um administrador criar o board desta empresa.</p>
            )}
          </div>
        </div>
      )}

      {!boardHook.loading && boardHook.board && (
        <div className="flex-1 overflow-x-auto overflow-y-hidden">
          <div className="flex gap-5 p-6 h-full" style={{ alignItems: 'flex-start', minWidth: 'max-content' }}>

            {boardHook.columns.map((col) => {
              const cards     = boardHook.cardsByColumn[col.id] || []
              const isEditing = boardHook.editingColumnId === col.id

              return (
                <KanbanColumn
                  key={col.id}
                  col={col}
                  cards={cards}
                  isEditing={isEditing}
                  canManage={canManage}
                  boardHook={boardHook}
                  dragDropHook={dragDropHook}
                />
              )
            })}

            {canManage && (
              <div className="flex-shrink-0 w-80">
                {boardHook.addingColumn ? (
                  <div className="bg-gray-100/70 rounded-2xl p-4">
                    <input
                      autoFocus type="text" value={boardHook.newColumnName}
                      onChange={e => boardHook.setNewColumnName(e.target.value)}
                      onKeyDown={e => {
                        if (e.key === 'Enter')  boardHook.handleAddColumn()
                        if (e.key === 'Escape') { boardHook.setAddingColumnState(false); }
                      }}
                      placeholder="Nome da coluna..."
                      className="input-base mb-3 bg-white"
                    />
                    <div className="flex gap-2">
                      <button onClick={boardHook.handleAddColumn} disabled={boardHook.savingColumn || !boardHook.newColumnName.trim()}
                        className="btn-primary flex-1 justify-center py-2 disabled:opacity-50">
                        {boardHook.savingColumn ? <Spinner size="sm" className="text-white"/> : 'Adicionar'}
                      </button>
                      <button onClick={() => { boardHook.setAddingColumnState(false); }}
                        className="w-9 h-9 rounded-xl bg-gray-200 hover:bg-gray-300 flex items-center justify-center text-gray-500 transition-colors flex-shrink-0">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                ) : (
                  <button onClick={() => boardHook.setAddingColumnState(true)}
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
            )}
          </div>
        </div>
      )}

      {boardHook.cardModal && (
        <CardModal
          columnId={boardHook.cardModal.columnId}
          initialCard={boardHook.cardModal.card}
          position={boardHook.cardModal.position}
          registeredUsers={registeredUsers.filter(u => boardHook.boardMemberIds.has(Number(u.id)))}
          onClose={() => boardHook.setCardModal(null)}
          onSaved={boardHook.handleCardSaved}
        />
      )}

      {boardHook.deleteCardTarget && (
        <ConfirmDialog
          title="Excluir card?"
          description={<p className="text-sm text-gray-500">"{boardHook.deleteCardTarget.card.titulo}" será removido permanentemente.</p>}
          onConfirm={boardHook.handleDeleteCard}
          onCancel={() => boardHook.setDeleteCardTarget(null)}
          loading={boardHook.deletingCard}
        />
      )}

      {boardHook.deleteColumnTarget && (() => {
        const col = boardHook.columns.find(c => c.id === boardHook.deleteColumnTarget)
        const qty = (boardHook.cardsByColumn[boardHook.deleteColumnTarget] || []).length
        return (
          <ConfirmDialog
            title={`Excluir "${col?.label}"?`}
            description={
              <div className="flex flex-col gap-1">
                {qty > 0 && <p className="text-sm text-red-500 font-medium">{qty} card{qty !== 1 ? 's' : ''} serão perdidos.</p>}
                <p className="text-sm text-gray-400">Esta ação não pode ser desfeita.</p>
              </div>
            }
            onConfirm={boardHook.deleteColumn}
            onCancel={() => boardHook.setDeleteColumnTarget(null)}
          />
        )
      })()}
    </div>
  )
}
