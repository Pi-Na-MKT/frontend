import { useState, useRef } from 'react'
import api from '../services/api'

export function useDragDrop({ onCardsChange, onColumnsChange, onLoadBoard }) {
  // refs pra guardar o estado do drag atual
  const dragCardRef = useRef(null) // { cardId, fromColId }
  const dragColRef  = useRef(null) // colId
  
  // estados de UI pra drag & drop
  const [draggingCardId, setDraggingCardId] = useState(null)
  const [draggingColId,  setDraggingColId]  = useState(null)
  const [dragOverColId,  setDragOverColId]  = useState(null)
  const [dragOverCardId, setDragOverCardId] = useState(null)
  const [dragColOverId,  setDragColOverId]  = useState(null)

  // ── Card drag handlers ────────────────────────────────────────────────────

  const handleCardDragStart = (cardId, fromColId) => {
    dragCardRef.current = { cardId, fromColId }
    dragColRef.current  = null
    setDraggingCardId(cardId)
  }

  const handleCardDragEnd = () => {
    dragCardRef.current = null
    setDraggingCardId(null)
    setDragOverColId(null)
    setDragOverCardId(null)
  }

  const handleCardDrop = (toColId) => {
    const drag = dragCardRef.current
    if (!drag) return
    
    const insertBeforeId = dragOverColId === toColId ? dragOverCardId : null
    dragCardRef.current = null
    setDraggingCardId(null)
    setDragOverColId(null)
    setDragOverCardId(null)
    
    const { cardId, fromColId } = drag
    
    // usa o callback recebido pra atualizar os cards
    onCardsChange(prev => {
      const card = (prev[fromColId] || []).find(c => c.id === cardId)
      if (!card) return prev
      
      const fromList   = (prev[fromColId] || []).filter(c => c.id !== cardId)
      const baseToList = toColId === fromColId ? fromList : [...(prev[toColId] || [])]
      let insertIdx    = insertBeforeId ? baseToList.findIndex(c => c.id === insertBeforeId) : -1
      if (insertIdx === -1) insertIdx = baseToList.length
      
      const newToList  = [...baseToList]
      newToList.splice(insertIdx, 0, card)
      
      // atualiza no servidor
      moveCardOnServer(cardId, toColId, insertIdx)
      
      if (toColId === fromColId) {
        return { ...prev, [toColId]: newToList.map((c, i) => ({ ...c, position: i })) }
      }
      return {
        ...prev,
        [fromColId]: fromList.map((c, i) => ({ ...c, position: i })),
        [toColId]:   newToList.map((c, i) => ({ ...c, position: i })),
      }
    })
  }

  const moveCardOnServer = async (cardId, toColId, position) => {
    try {
      await api.put(`/cards/${cardId}`, { columnId: toColId, position })
    } catch (err) {
      console.error('Erro ao mover card:', err)
      // recarrega o board se der erro
      onLoadBoard?.()
    }
  }

  // ── Column drag handlers ──────────────────────────────────────────────────

  const handleColDragStart = (colId) => {
    dragColRef.current  = colId
    dragCardRef.current = null
    setDraggingColId(colId)
  }

  const handleColDragEnd = () => {
    dragColRef.current = null
    setDraggingColId(null)
    setDragColOverId(null)
  }

  const handleColDrop = (toColId) => {
    const fromColId = dragColRef.current
    dragColRef.current = null
    setDraggingColId(null)
    setDragColOverId(null)
    
    if (!fromColId || fromColId === toColId) return
    
    // usa o callback recebido pra atualizar as colunas
    onColumnsChange(prev => {
      const fromIdx = prev.findIndex(c => c.id === fromColId)
      const toIdx   = prev.findIndex(c => c.id === toColId)
      if (fromIdx === -1 || toIdx === -1) return prev
      
      const next    = [...prev]
      const [moved] = next.splice(fromIdx, 1)
      next.splice(toIdx, 0, moved)
      
      // atualiza no servidor
      reorderColumnsOnServer(next)
      
      return next
    })
  }

  const reorderColumnsOnServer = async (newOrder) => {
    try {
      await Promise.all(newOrder.map((col, i) => api.put(`/columns/${col.id}`, { position: i })))
    } catch (err) {
      console.error('Erro ao reordenar colunas:', err)
      // recarrega o board se der erro
      onLoadBoard?.()
    }
  }

  return {
    // estado
    draggingCardId,
    draggingColId,
    dragOverColId,
    dragOverCardId,
    dragColOverId,
    
    // refs (preciso pra checar no dragOver)
    dragCardRef,
    dragColRef,
    
    // setters
    setDragOverColId,
    setDragOverCardId,
    setDragColOverId,
    
    // handlers
    handleCardDragStart,
    handleCardDragEnd,
    handleCardDrop,
    handleColDragStart,
    handleColDragEnd,
    handleColDrop,
  }
}