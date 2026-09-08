import { useState, useEffect } from 'react'
import api from '../services/api'

export function useBoard(companyId) {
  const [boards, setBoards] = useState([])
  const [currentBoard, setCurrentBoard] = useState(null)
  const [columns, setColumns] = useState([])
  const [cardsByColumn, setCardsByColumn] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadBoards()
  }, [companyId])

  const loadBoards = async () => {
    try {
      setLoading(true)
      const { data: boardsData } = await api.get('/boards')
      setBoards(boardsData)

      if (boardsData.length > 0) {
        await loadBoard(boardsData[0].id)
      }
    } catch (err) {
      setError(err)
    } finally {
      setLoading(false)
    }
  }

  const loadBoard = async (boardId) => {
    try {
      setLoading(true)
      const { data: cols } = await api.get(`/columns/board/${boardId}`)
      setColumns(cols)

      const cardsData = {}
      for (const col of cols) {
        const { data: cards } = await api.get(`/cards/column/${col.id}`)
        cardsData[col.id] = cards
      }
      setCardsByColumn(cardsData)
      setCurrentBoard(boards.find((b) => b.id === boardId))
    } catch (err) {
      setError(err)
    } finally {
      setLoading(false)
    }
  }

  const createBoard = async (data) => {
    const { data: newBoard } = await api.post(
      `/boards/company/${companyId}`,
      data
    )
    await Promise.all([
      api.post(`/columns/board/${newBoard.id}`, { name: 'A Fazer', position: 0 }),
      api.post(`/columns/board/${newBoard.id}`, {
        name: 'Em Progresso',
        position: 1,
      }),
      api.post(`/columns/board/${newBoard.id}`, { name: 'Concluído', position: 2 }),
    ])
    await loadBoards()
    return newBoard
  }

  const createCard = async (columnId, data) => {
    await api.post(`/cards/column/${columnId}`, data)
    await loadBoard(currentBoard.id)
  }

  const updateCard = async (cardId, data) => {
    await api.put(`/cards/${cardId}`, data)
    await loadBoard(currentBoard.id)
  }

  const deleteCard = async (cardId) => {
    await api.delete(`/cards/${cardId}`)
    await loadBoard(currentBoard.id)
  }

  const createColumn = async (data) => {
    await api.post(`/columns/board/${currentBoard.id}`, data)
    await loadBoard(currentBoard.id)
  }

  const deleteColumn = async (columnId) => {
    await api.delete(`/columns/${columnId}`)
    await loadBoard(currentBoard.id)
  }

  return {
    boards,
    currentBoard,
    columns,
    cardsByColumn,
    loading,
    error,
    loadBoard,
    createBoard,
    createCard,
    updateCard,
    deleteCard,
    createColumn,
    deleteColumn,
  }
}