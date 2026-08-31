import { useState, useEffect } from 'react'
import api from '../services/api'

// cores das colunas - talvez mover pra constants depois
const COL_CORES = ['bg-gray-400', 'bg-blue-500', 'bg-emerald-500', 'bg-violet-400', 'bg-amber-400', 'bg-pink-400']

// função pra mapear card da API pro formato interno
const mapCard = (card) => ({
  id:                    card.id,
  titulo:                card.title       || 'Sem título',
  descricao:             card.description || '',
  prioridade:            card.priority?.toLowerCase() || 'low',
  rawPriority:           card.priority    || 'MEDIUM',
  rawDueDate:            card.dueDate     || null,
  dueDate:               card.dueDate     || null,
  position:              card.position    ?? 0,
  completed:             card.completed   ?? false,
  googleCalendarEventId: card.googleCalendarEventId || null,
  horas:                 card.dueDate
    ? new Date(card.dueDate).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })
    : '—',
  assignedUserIds: (card.assignedUsers || []).map(u => u.id),
  assignedUsers:   (card.assignedUsers || []).map(u => ({ id: u.id, avatarUrl: u.avatarUrl || null, name: u.name || '' })),
})

export function useBoard(empresa) {
  // estados principais do board
  const [board,              setBoard]              = useState(null)
  const [columns,            setColumns]            = useState([])
  const [cardsByColumn,      setCardsByColumn]      = useState({})
  const [boardMemberIds,     setBoardMemberIds]     = useState(new Set())
  const [loading,            setLoading]            = useState(true)
  
  // estados de UI para colunas
  const [creatingBoard,      setCreatingBoard]      = useState(false)
  const [addingColumn,       setAddingColumn]       = useState(false)
  const [newColumnName,      setNewColumnName]      = useState('')
  const [savingColumn,       setSavingColumn]       = useState(false)
  const [editingColumnId,    setEditingColumnId]    = useState(null)
  const [editingName,        setEditingName]        = useState('')
  const [deleteColumnTarget, setDeleteColumnTarget] = useState(null)
  
  // estados de UI para cards
  const [cardModal,          setCardModal]          = useState(null)
  const [deleteCardTarget,   setDeleteCardTarget]   = useState(null)
  const [deletingCard,       setDeletingCard]       = useState(false)

  // carrega o board quando a empresa muda
  useEffect(() => {
    if (empresa?.id) loadBoard()
  }, [empresa?.id])

  // carrega dados do board, colunas e cards
  const loadBoard = async () => {
    setLoading(true)
    try {
      // busca todos os boards e encontra o da empresa
      const { data: boards } = await api.get('/boards')
      const found = boards.find(b => b.companyId === empresa.id)
      
      // se não encontrou board, limpa tudo e sai
      if (!found) { 
        setBoard(null)
        setColumns([])
        setCardsByColumn({})
        setBoardMemberIds(new Set())
        return 
      }
      
      setBoard(found)
      setBoardMemberIds(new Set((found.members || []).map(m => Number(m.id))))

      // busca colunas do board
      const { data: cols } = await api.get(`/columns/board/${found.id}`)
      const sorted = [...cols].sort((a, b) => (a.position ?? 0) - (b.position ?? 0))

      // busca cards de cada coluna em paralelo
      const map = {}
      await Promise.all(sorted.map(async (col) => {
        const { data: cards } = await api.get(`/cards/column/${col.id}`)
        map[col.id] = cards
          .filter(c => c.isActive !== false)
          .sort((a, b) => (a.position ?? 0) - (b.position ?? 0))
          .map(mapCard)
      }))

      // mapeia colunas com cores
      setColumns(sorted.map((col, i) => ({ id: col.id, label: col.name, cor: COL_CORES[i % COL_CORES.length] })))
      setCardsByColumn(map)
    } catch (err) {
      console.error('Erro ao carregar board:', err)
    } finally {
      setLoading(false)
    }
  }

  // cria um novo board pra empresa com colunas padrão
  const handleCreateBoard = async () => {
    setCreatingBoard(true)
    try {
      const { data: newBoard } = await api.post(`/boards/company/${empresa.id}`, {
        name: empresa.nome || empresa.name, 
        userIds: [],
      })
      
      // cria as 3 colunas padrão
      await Promise.all([
        api.post(`/columns/board/${newBoard.id}`, { name: 'A Fazer',      position: 0 }),
        api.post(`/columns/board/${newBoard.id}`, { name: 'Em Progresso', position: 1 }),
        api.post(`/columns/board/${newBoard.id}`, { name: 'Concluído',    position: 2 }),
      ])
      
      await loadBoard()
    } catch (err) {
      console.error('Erro ao criar board:', err)
    } finally {
      setCreatingBoard(false)
    }
  }

  // adiciona nova coluna ao board
  const handleAddColumn = async () => {
    const name = newColumnName.trim()
    if (!name || !board) return
    
    setSavingColumn(true)
    try {
      const { data } = await api.post(`/columns/board/${board.id}`, { name, position: columns.length })
      const cor = COL_CORES[columns.length % COL_CORES.length]
      
      setColumns(prev => [...prev, { id: data.id, label: data.name, cor }])
      setCardsByColumn(prev => ({ ...prev, [data.id]: [] }))
      
      setNewColumnName('')
      setAddingColumn(false)
    } catch (err) {
      console.error('Erro ao criar coluna:', err)
    } finally {
      setSavingColumn(false)
    }
  }

  // renomeia uma coluna
  const confirmRename = async () => {
    const name = editingName.trim()
    if (!name) { 
      setEditingColumnId(null)
      return 
    }
    
    try {
      await api.put(`/columns/${editingColumnId}`, { name })
      setColumns(prev => prev.map(c => c.id === editingColumnId ? { ...c, label: name } : c))
    } catch (err) {
      console.error('Erro ao renomear coluna:', err)
    }
    setEditingColumnId(null)
  }

  // deleta uma coluna
  const deleteColumn = async () => {
    const id = deleteColumnTarget
    try {
      await api.delete(`/columns/${id}`)
      setColumns(prev => prev.filter(c => c.id !== id))
      setCardsByColumn(prev => { 
        const n = { ...prev }
        delete n[id]
        return n 
      })
    } catch (err) {
      console.error('Erro ao deletar coluna:', err)
    }
    setDeleteColumnTarget(null)
  }

  // chamado quando um card é salvo (criado ou editado)
  const handleCardSaved = (data) => {
    if (!cardModal) return
    const { columnId } = cardModal
    const mapped = mapCard(data)
    
    setCardsByColumn(prev => {
      const list = prev[columnId] || []
      const idx  = list.findIndex(c => c.id === mapped.id)
      
      // se já existe, atualiza; senão, adiciona
      if (idx >= 0) {
        const updated = [...list]
        updated[idx]  = mapped
        return { ...prev, [columnId]: updated }
      }
      return { ...prev, [columnId]: [...list, mapped] }
    })
    setCardModal(null)
  }

  // toggle de completo/incompleto do card
  const handleToggleComplete = async (cardId, completed) => {
    // atualiza localmente primeiro (otimistic update)
    const update = (val) =>
      setCardsByColumn(prev => {
        const next = {}
        Object.keys(prev).forEach(colId => {
          next[colId] = prev[colId].map(c => c.id === cardId ? { ...c, completed: val } : c)
        })
        return next
      })

    update(completed)
    
    try {
      await api.put(`/cards/${cardId}`, { completed })
    } catch (err) {
      console.error('Erro ao atualizar card:', err)
      // reverte se der erro
      update(!completed)
    }
  }

  // deleta um card
  const handleDeleteCard = async () => {
    if (!deleteCardTarget) return
    const { card, columnId } = deleteCardTarget
    
    setDeletingCard(true)
    try {
      await api.delete(`/cards/${card.id}`)
      setCardsByColumn(prev => ({ 
        ...prev, 
        [columnId]: (prev[columnId] || []).filter(c => c.id !== card.id) 
      }))
      setDeleteCardTarget(null)
    } catch (err) {
      console.error('Erro ao excluir card:', err)
    } finally {
      setDeletingCard(false)
    }
  }

  // cria evento no Google Calendar
  const handleCalendarEvent = async (tarefa) => {
    try {
      const { data } = await api.post(`/cards/${tarefa.id}/calendar-event`)
      const mapped = mapCard(data)
      
      setCardsByColumn(prev => {
        const next = {}
        Object.keys(prev).forEach(colId => {
          next[colId] = prev[colId].map(c => c.id === mapped.id ? mapped : c)
        })
        return next
      })
    } catch (err) {
      alert(err.response?.data?.message || 'Erro ao criar evento no Google Calendar.')
    }
  }

  // helpers pra setar estados de UI
  const setEditingColumn = (colId, name) => {
    setEditingColumnId(colId)
    setEditingName(name)
  }

  const setAddingColumnState = (adding) => {
    setAddingColumn(adding)
    if (!adding) setNewColumnName('')
  }

  return {
    // estado
    board,
    setBoard,
    columns,
    setColumns,
    cardsByColumn,
    setCardsByColumn,
    boardMemberIds,
    loading,
    creatingBoard,
    addingColumn,
    newColumnName,
    setNewColumnName,
    savingColumn,
    editingColumnId,
    editingName,
    setEditingName,
    deleteColumnTarget,
    setDeleteColumnTarget,
    cardModal,
    setCardModal,
    deleteCardTarget,
    setDeleteCardTarget,
    deletingCard,
    
    // funções
    loadBoard,
    handleCreateBoard,
    handleAddColumn,
    confirmRename,
    deleteColumn,
    handleCardSaved,
    handleToggleComplete,
    handleDeleteCard,
    handleCalendarEvent,
    setEditingColumn,
    setAddingColumnState,
  }
}