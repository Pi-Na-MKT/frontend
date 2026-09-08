import React from 'react'
import TaskCard from './TaskCard'
import UserAvatar from '../users/UserAvatar'

export default function KanbanColumn({
  col,
  cards,
  isEditing,
  canManage,
  boardHook,
  dragDropHook,
}) {
  return (
    <div
      className={`flex flex-col bg-gray-100/70 rounded-2xl flex-shrink-0 w-80 transition-all ${
        dragDropHook.dragColOverId === col.id &&
        dragDropHook.draggingColId !== col.id
          ? 'ring-2 ring-primary/40'
          : ''
      }`}
      style={{ maxHeight: 'calc(100vh - 160px)' }}
      onDragOver={(e) => {
        if (!dragDropHook.dragColRef?.current) return
        e.preventDefault()
        dragDropHook.setDragColOverId(col.id)
      }}
      onDragLeave={(e) => {
        if (
          dragDropHook.dragColRef?.current &&
          !e.currentTarget.contains(e.relatedTarget)
        )
          dragDropHook.setDragColOverId(null)
      }}
      onDrop={(e) => {
        if (!dragDropHook.dragColRef?.current) return
        e.preventDefault()
        dragDropHook.handleColDrop(col.id)
      }}
    >
      {/* header da coluna com título e ações */}
      <div className="flex items-center gap-2 px-4 pt-4 pb-3 flex-shrink-0">
        {canManage && (
          <div
            draggable
            onDragStart={(e) => {
              e.stopPropagation()
              dragDropHook.handleColDragStart(col.id)
            }}
            onDragEnd={dragDropHook.handleColDragEnd}
            className={`cursor-grab active:cursor-grabbing flex-shrink-0 transition-colors ${
              dragDropHook.draggingColId === col.id
                ? 'text-primary'
                : 'text-gray-300 hover:text-gray-500'
            }`}
            title="Arrastar coluna"
          >
            <svg
              className="w-3.5 h-3.5"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M7 2a2 2 0 10.001 4.001A2 2 0 007 2zm0 6a2 2 0 10.001 4.001A2 2 0 007 6zm0 6a2 2 0 10.001 4.001A2 2 0 007 12zm6-8a2 2 0 10-.001-4.001A2 2 0 0013 4zm0 2a2 2 0 10.001 4.001A2 2 0 0013 6zm0 6a2 2 0 10.001 4.001A2 2 0 0013 12z" />
            </svg>
          </div>
        )}

        <div className={`w-2 h-2 rounded-full ${col.cor} flex-shrink-0`} />

        {/* campo de edição ou título normal */}
        {isEditing ? (
          <input
            autoFocus
            type="text"
            value={boardHook.editingName}
            onChange={(e) => boardHook.setEditingName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') boardHook.confirmRename()
              if (e.key === 'Escape') boardHook.setEditingColumn(null)
            }}
            onBlur={boardHook.confirmRename}
            className="flex-1 px-2 py-1 rounded-lg text-sm bg-white border border-primary/40 focus:outline-none font-semibold"
          />
        ) : (
          <h2 className="text-sm font-bold text-gray-700 flex-1 truncate">
            {col.label}
          </h2>
        )}

        {/* contador de cards */}
        <span className="w-5 h-5 rounded-full bg-gray-200 text-gray-500 text-[10px] font-bold flex items-center justify-center flex-shrink-0">
          {cards.length}
        </span>

        {/* botões de editar/excluir coluna (só se não estiver editando) */}
        {!isEditing && canManage && (
          <div className="flex items-center gap-0.5">
            <button
              onClick={() => {
                boardHook.setEditingColumn(col.id, col.label)
              }}
              className="w-6 h-6 rounded-lg text-gray-400 hover:text-primary hover:bg-white transition-all flex items-center justify-center"
              title="Renomear coluna"
            >
              <svg
                className="w-3 h-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
            </button>
            <button
              onClick={() => boardHook.setDeleteColumnTarget(col.id)}
              className="w-6 h-6 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all flex items-center justify-center"
              title="Excluir coluna"
            >
              <svg
                className="w-3 h-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </button>
          </div>
        )}
      </div>

      {/* linha decorativa com a cor da coluna */}
      <div
        className={`mx-4 h-0.5 ${col.cor} opacity-30 rounded-full mb-3 flex-shrink-0`}
      />

      {/* área de cards da coluna */}
      <div
        className={`flex-1 overflow-y-auto px-4 pb-4 flex flex-col gap-2.5 scrollbar-thin rounded-b-2xl transition-colors ${
          dragDropHook.dragOverColId === col.id ? 'bg-primary/5' : ''
        }`}
        onDragOver={(e) => {
          if (!dragDropHook.dragCardRef?.current) return
          e.preventDefault()
          e.stopPropagation()
          dragDropHook.setDragOverColId(col.id)
          dragDropHook.setDragOverCardId(null)
        }}
        onDrop={(e) => {
          if (!dragDropHook.dragCardRef?.current) return
          e.preventDefault()
          e.stopPropagation()
          dragDropHook.handleCardDrop(col.id)
        }}
        onDragLeave={(e) => {
          if (!dragDropHook.dragCardRef?.current) return
          if (!e.currentTarget.contains(e.relatedTarget)) {
            dragDropHook.setDragOverColId(null)
            dragDropHook.setDragOverCardId(null)
          }
        }}
      >
        {/* renderiza os cards */}
        {cards.map((tarefa) => (
          <div
            key={tarefa.id}
            draggable
            onDragStart={() =>
              dragDropHook.handleCardDragStart(tarefa.id, col.id)
            }
            onDragEnd={dragDropHook.handleCardDragEnd}
            onDragOver={(e) => {
              if (!dragDropHook.dragCardRef?.current) return
              e.preventDefault()
              e.stopPropagation()
              dragDropHook.setDragOverCardId(tarefa.id)
              dragDropHook.setDragOverColId(col.id)
            }}
            className={`transition-opacity ${dragDropHook.draggingCardId === tarefa.id ? 'opacity-40' : ''}`}
          >
            {/* indicador visual de onde vai dropar */}
            {dragDropHook.dragOverCardId === tarefa.id &&
              dragDropHook.draggingCardId !== tarefa.id && (
                <div className="h-0.5 bg-primary rounded-full mb-1.5 mx-1" />
              )}

            <TaskCard
              tarefa={tarefa}
              onEdit={(t) =>
                boardHook.setCardModal({
                  columnId: col.id,
                  card: t,
                  position: t.position,
                })
              }
              onDelete={(t) =>
                boardHook.setDeleteCardTarget({ card: t, columnId: col.id })
              }
              onToggleComplete={boardHook.handleToggleComplete}
              onCalendarEvent={boardHook.handleCalendarEvent}
            />
          </div>
        ))}

        {/* botão pra adicionar novo card */}
        <button
          onClick={() =>
            boardHook.setCardModal({
              columnId: col.id,
              card: null,
              position: cards.length,
            })
          }
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-dashed border-gray-200 text-xs font-medium text-gray-400 hover:border-primary/30 hover:text-primary/60 hover:bg-white/70 transition-all mt-1"
        >
          <svg
            className="w-3.5 h-3.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          Adicionar card
        </button>
      </div>
    </div>
  )
}
