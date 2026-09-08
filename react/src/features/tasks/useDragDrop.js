import { useState } from 'react'
import api from '../../shared/api/api'

export function useDragDrop(columns, cardsByColumn, onDragEnd) {
  const [draggedCard, setDraggedCard] = useState(null)
  const [draggedColumn, setDraggedColumn] = useState(null)

  const handleCardDragStart = (card, columnId) => {
    setDraggedCard(card)
  }

  const handleCardDragOver = (e, columnId) => {
    e.preventDefault()
  }

  const handleCardDrop = async (e, toColumnId) => {
    e.preventDefault()
    if (!draggedCard) return

    const fromColumnId = Object.keys(cardsByColumn).find((colId) =>
      cardsByColumn[colId].some((card) => card.id === draggedCard.id)
    )

    if (fromColumnId === toColumnId) return

    try {
      await api.put(`/cards/${draggedCard.id}`, {
        columnId: toColumnId,
        position: cardsByColumn[toColumnId]?.length || 0,
      })
      onDragEnd()
    } catch (error) {
      console.error('Erro ao mover card:', error)
    }

    setDraggedCard(null)
  }

  const handleColumnDragStart = (column) => {
    setDraggedColumn(column)
  }

  const handleColumnDragOver = (e) => {
    e.preventDefault()
  }

  const handleColumnDrop = async (e, targetColumnId) => {
    e.preventDefault()
    if (!draggedColumn) return

    const newOrder = [...columns]
    const draggedIndex = newOrder.findIndex((col) => col.id === draggedColumn.id)
    const targetIndex = newOrder.findIndex((col) => col.id === targetColumnId)

    if (draggedIndex === targetIndex) return

    newOrder.splice(draggedIndex, 1)
    newOrder.splice(targetIndex, 0, draggedColumn)

    try {
      await Promise.all(
        newOrder.map((col, i) => api.put(`/columns/${col.id}`, { position: i }))
      )
      onDragEnd()
    } catch (error) {
      console.error('Erro ao reordenar colunas:', error)
    }

    setDraggedColumn(null)
  }

  return {
    draggedCard,
    draggedColumn,
    handleCardDragStart,
    handleCardDragOver,
    handleCardDrop,
    handleColumnDragStart,
    handleColumnDragOver,
    handleColumnDrop,
  }
}