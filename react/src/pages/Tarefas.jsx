import React, { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import TarefaCard from '../components/TarefaCard'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'

const COL_CORES = ['bg-gray-400', 'bg-blue-500', 'bg-emerald-500', 'bg-violet-400', 'bg-amber-400', 'bg-pink-400']
const PRIORITY_MAP = { HIGH: 'high', MEDIUM: 'medium', LOW: 'low', CRITICAL: 'high' }

const PRIORITY_OPTIONS = [
  { value: 'HIGH',   label: 'Alta'  },
  { value: 'MEDIUM', label: 'Média' },
  { value: 'LOW',    label: 'Baixa' },
]

const mapCard = (card) => ({
  id:          card.id,
  titulo:      card.title       || 'Sem título',
  descricao:   card.description || '',
  prioridade:  PRIORITY_MAP[card.priority] || 'low',
  rawPriority: card.priority    || 'MEDIUM',
  rawDueDate:  card.dueDate     || null,
  position:    card.position    ?? 0,
  completed:   card.completed   ?? false,
  horas:       card.dueDate
    ? new Date(card.dueDate).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })
    : '—',
  avatar: card.assignedUsers?.[0]?.avatarUrl || null,
})

// ── Modal criar / editar card ─────────────────────────────────────────────────
function ModalCard({ colunaId, cardInicial, posicao, onFechar, onSalvo }) {
  const isEdit = !!cardInicial
  const [form, setForm] = useState({
    titulo:     cardInicial?.titulo     || '',
    descricao:  cardInicial?.descricao  || '',
    prioridade: cardInicial?.rawPriority || 'MEDIUM',
    dueDate:    cardInicial?.rawDueDate
      ? new Date(cardInicial.rawDueDate).toISOString().slice(0, 10)
      : '',
  })
  const [loading, setLoading] = useState(false)
  const [erro,    setErro]    = useState('')

  const handleSubmit = async () => {
    if (!form.titulo.trim()) { setErro('Título é obrigatório.'); return }
    setLoading(true); setErro('')
    try {
      const payload = {
        title:           form.titulo.trim(),
        description:     form.descricao.trim() || null,
        priority:        form.prioridade,
        position:        posicao,
        dueDate:         form.dueDate ? form.dueDate + 'T00:00:00' : null,
        isActive:        true,
        assignedUserIds: [],
      }
      const { data } = isEdit
        ? await api.put(`/cards/${cardInicial.id}`, payload)
        : await api.post(`/cards/column/${colunaId}`, payload)
      onSalvo(data)
    } catch (err) {
      setErro(err.response?.data?.detail || err.response?.data?.message || 'Erro ao salvar card.')
    } finally {
      setLoading(false)
    }
  }

  return createPortal(
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h3 className="text-base font-bold text-gray-900">{isEdit ? 'Editar card' : 'Novo card'}</h3>
          <button onClick={onFechar} className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <div className="px-6 py-5 flex flex-col gap-4">
          <div>
            <label className="section-title block mb-1.5">Título <span className="text-red-400">*</span></label>
            <input
              autoFocus
              value={form.titulo}
              onChange={e => { setForm(p => ({ ...p, titulo: e.target.value })); setErro('') }}
              placeholder="Ex.: Criar post para o Instagram"
              className="input-base"
            />
          </div>

          <div>
            <label className="section-title block mb-1.5">Descrição</label>
            <textarea
              value={form.descricao}
              onChange={e => setForm(p => ({ ...p, descricao: e.target.value }))}
              placeholder="Detalhes sobre a tarefa..."
              rows={2}
              className="input-base resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="section-title block mb-1.5">Prioridade</label>
              <select
                value={form.prioridade}
                onChange={e => setForm(p => ({ ...p, prioridade: e.target.value }))}
                className="input-base appearance-none"
              >
                {PRIORITY_OPTIONS.map(o => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="section-title block mb-1.5">Prazo</label>
              <input
                type="date"
                value={form.dueDate}
                onChange={e => setForm(p => ({ ...p, dueDate: e.target.value }))}
                className="input-base"
              />
            </div>
          </div>

          {erro && (
            <div className="flex items-center gap-2 px-3 py-2.5 bg-red-50 border border-red-100 rounded-xl text-sm text-red-600">
              <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              {erro}
            </div>
          )}
        </div>

        <div className="flex gap-3 px-6 py-4 border-t border-gray-100">
          <button onClick={onFechar} className="btn-ghost flex-1 justify-center">Cancelar</button>
          <button onClick={handleSubmit} disabled={loading} className="btn-primary flex-1 justify-center disabled:opacity-50">
            {loading ? (
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7"/>
              </svg>
            )}
            {loading ? 'Salvando...' : (isEdit ? 'Salvar' : 'Criar card')}
          </button>
        </div>
      </div>
    </div>,
    document.body
  )
}

// ── Componente principal ──────────────────────────────────────────────────────
export default function Tarefas({ empresa, onBack, onDashboard }) {
  const { user } = useAuth()
  const canManage = ['ADMIN', 'MANAGER'].includes(user?.role?.toUpperCase())

  const [board,       setBoard]       = useState(null)
  const [colunas,     setColunas]     = useState([])
  const [tarefasData, setTarefasData] = useState({})
  const [loading,     setLoading]     = useState(true)
  const [criandoBoard, setCriandoBoard] = useState(false)

  // ── coluna inline ────────────────────────────────────────────────────────────
  const [adicionandoColuna, setAdicionandoColuna] = useState(false)
  const [novaColunaNome,    setNovaColunaNome]    = useState('')
  const [salvandoColuna,    setSalvandoColuna]    = useState(false)

  // ── edição inline de nome ────────────────────────────────────────────────────
  const [editandoColuna, setEditandoColuna] = useState(null)
  const [editandoNome,   setEditandoNome]   = useState('')

  // ── exclusão de coluna ───────────────────────────────────────────────────────
  const [confirmDeleteColuna, setConfirmDeleteColuna] = useState(null)

  // ── card: criar / editar ────────────────────────────────────────────────────
  const [modalCard, setModalCard] = useState(null) // { colunaId, card, posicao }

  // ── card: excluir ────────────────────────────────────────────────────────────
  const [confirmDeleteCard, setConfirmDeleteCard] = useState(null) // { card, colunaId }
  const [excluindoCard,     setExcluindoCard]     = useState(false)

  useEffect(() => {
    if (!empresa?.id) return
    loadBoardData()
  }, [empresa?.id])

  // ── carrega board → colunas → cards ──────────────────────────────────────────
  const loadBoardData = async () => {
    setLoading(true)
    try {
      const { data: boards } = await api.get('/boards')
      const boardDaEmpresa = boards.find(b => b.companyId === empresa.id)

      if (!boardDaEmpresa) {
        setBoard(null); setColunas([]); setTarefasData({})
        return
      }
      setBoard(boardDaEmpresa)

      const { data: cols } = await api.get(`/columns/board/${boardDaEmpresa.id}`)
      const ordenadas = [...cols].sort((a, b) => (a.position ?? 0) - (b.position ?? 0))

      const cardsMap = {}
      await Promise.all(
        ordenadas.map(async (col) => {
          const { data: cards } = await api.get(`/cards/column/${col.id}`)
          cardsMap[col.id] = cards
            .filter(c => c.isActive !== false)
            .sort((a, b) => (a.position ?? 0) - (b.position ?? 0))
            .map(mapCard)
        })
      )
      setColunas(ordenadas.map((col, i) => ({ id: col.id, label: col.name, cor: COL_CORES[i % COL_CORES.length] })))
      setTarefasData(cardsMap)
    } catch (err) {
      console.error('Erro ao carregar board:', err)
    } finally {
      setLoading(false)
    }
  }

  // ── criar board + 3 colunas padrão ───────────────────────────────────────────
  const handleCriarBoard = async () => {
    setCriandoBoard(true)
    try {
      const { data: newBoard } = await api.post(`/boards/company/${empresa.id}`, {
        name:    empresa.nome || empresa.name,
        userIds: [],
      })
      await Promise.all([
        api.post(`/columns/board/${newBoard.id}`, { name: 'A Fazer',      position: 0 }),
        api.post(`/columns/board/${newBoard.id}`, { name: 'Em Progresso', position: 1 }),
        api.post(`/columns/board/${newBoard.id}`, { name: 'Concluído',    position: 2 }),
      ])
      await loadBoardData()
    } catch (err) {
      console.error('Erro ao criar board:', err)
    } finally {
      setCriandoBoard(false)
    }
  }

  // ── criar coluna ─────────────────────────────────────────────────────────────
  const handleAdicionarColuna = async () => {
    const nome = novaColunaNome.trim()
    if (!nome || !board) return
    setSalvandoColuna(true)
    try {
      const { data } = await api.post(`/columns/board/${board.id}`, {
        name:     nome,
        position: colunas.length,
      })
      const cor = COL_CORES[colunas.length % COL_CORES.length]
      setColunas(prev => [...prev, { id: data.id, label: data.name, cor }])
      setTarefasData(prev => ({ ...prev, [data.id]: [] }))
      setNovaColunaNome('')
      setAdicionandoColuna(false)
    } catch (err) {
      console.error('Erro ao criar coluna:', err)
    } finally {
      setSalvandoColuna(false)
    }
  }

  // ── renomear coluna ───────────────────────────────────────────────────────────
  const confirmarEdicao = async () => {
    const nome = editandoNome.trim()
    if (!nome) { setEditandoColuna(null); return }
    try {
      await api.put(`/columns/${editandoColuna}`, { name: nome })
      setColunas(prev => prev.map(c => c.id === editandoColuna ? { ...c, label: nome } : c))
    } catch (err) {
      console.error('Erro ao renomear coluna:', err)
    }
    setEditandoColuna(null)
  }

  // ── excluir coluna ────────────────────────────────────────────────────────────
  const confirmarExclusao = async () => {
    const id = confirmDeleteColuna
    try {
      await api.delete(`/columns/${id}`)
      setColunas(prev => prev.filter(c => c.id !== id))
      setTarefasData(prev => { const n = { ...prev }; delete n[id]; return n })
    } catch (err) {
      console.error('Erro ao deletar coluna:', err)
    }
    setConfirmDeleteColuna(null)
  }

  // ── salvar card (criar ou editar) ─────────────────────────────────────────────
  const handleCardSalvo = (data) => {
    if (!modalCard) return
    const { colunaId } = modalCard
    const mapped = mapCard(data)
    setTarefasData(prev => {
      const lista = prev[colunaId] || []
      const idx   = lista.findIndex(c => c.id === mapped.id)
      if (idx >= 0) {
        const atualizado = [...lista]
        atualizado[idx]  = mapped
        return { ...prev, [colunaId]: atualizado }
      }
      return { ...prev, [colunaId]: [...lista, mapped] }
    })
    setModalCard(null)
  }

  // ── toggle completed ─────────────────────────────────────────────────────────
  const handleToggleComplete = async (cardId, completed) => {
    const atualizar = (val) =>
      setTarefasData(prev => {
        const updated = {}
        Object.keys(prev).forEach(colId => {
          updated[colId] = prev[colId].map(c => c.id === cardId ? { ...c, completed: val } : c)
        })
        return updated
      })

    atualizar(completed) // otimista
    try {
      await api.put(`/cards/${cardId}`, { completed })
    } catch (err) {
      console.error('Erro ao atualizar card:', err)
      atualizar(!completed) // reverte se falhar
    }
  }

  // ── excluir card ──────────────────────────────────────────────────────────────
  const handleConfirmarDeleteCard = async () => {
    if (!confirmDeleteCard) return
    const { card, colunaId } = confirmDeleteCard
    setExcluindoCard(true)
    try {
      await api.delete(`/cards/${card.id}`)
      setTarefasData(prev => ({
        ...prev,
        [colunaId]: (prev[colunaId] || []).filter(c => c.id !== card.id),
      }))
      setConfirmDeleteCard(null)
    } catch (err) {
      console.error('Erro ao excluir card:', err)
    } finally {
      setExcluindoCard(false)
    }
  }

  const totalTarefas  = Object.values(tarefasData).reduce((s, arr) => s + arr.length, 0)
  const finalizadasId = colunas.find(c => c.label.toLowerCase().includes('conclu') || c.label.toLowerCase().includes('finaliz'))?.id
  const finalizadas   = finalizadasId ? (tarefasData[finalizadasId] || []).length : 0

  return (
    <div className="h-full flex flex-col animate-fade-up">

      {/* ── Header ── */}
      <div className="flex-shrink-0 bg-white border-b border-gray-100 px-6 py-4">
        <nav className="flex items-center gap-2 text-xs text-gray-400 mb-3">
          <button onClick={onBack} className="hover:text-primary transition-colors font-medium">Empresas</button>
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
                {totalTarefas} tarefa{totalTarefas !== 1 ? 's' : ''} ·{' '}
                <span className="text-emerald-600 font-semibold">{finalizadas} concluída{finalizadas !== 1 ? 's' : ''}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
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

      {/* ── Loading ── */}
      {loading && (
        <div className="flex-1 flex items-center justify-center">
          <svg className="w-6 h-6 text-primary animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
          </svg>
        </div>
      )}

      {/* ── Sem board ── */}
      {!loading && !board && (
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
                <button onClick={handleCriarBoard} disabled={criandoBoard} className="btn-primary disabled:opacity-50">
                  {criandoBoard ? (
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4"/>
                    </svg>
                  )}
                  {criandoBoard ? 'Criando...' : 'Criar board'}
                </button>
              </>
            ) : (
              <p className="text-gray-400 text-xs">Aguarde um administrador criar o board desta empresa.</p>
            )}
          </div>
        </div>
      )}

      {/* ── Kanban board ── */}
      {!loading && board && (
        <div className="flex-1 overflow-x-auto overflow-y-hidden">
          <div className="flex gap-5 p-6 h-full" style={{ alignItems: 'flex-start', minWidth: 'max-content' }}>

            {colunas.map((coluna) => {
              const cards     = tarefasData[coluna.id] || []
              const isEditing = editandoColuna === coluna.id

              return (
                <div key={coluna.id}
                  className="flex flex-col bg-gray-100/70 rounded-2xl flex-shrink-0 w-80"
                  style={{ maxHeight: 'calc(100vh - 160px)' }}>

                  {/* Header da coluna */}
                  <div className="flex items-center gap-2 px-4 pt-4 pb-3 flex-shrink-0">
                    <div className={`w-2 h-2 rounded-full ${coluna.cor} flex-shrink-0`}/>

                    {isEditing ? (
                      <input
                        autoFocus type="text" value={editandoNome}
                        onChange={e => setEditandoNome(e.target.value)}
                        onKeyDown={e => {
                          if (e.key === 'Enter')  confirmarEdicao()
                          if (e.key === 'Escape') setEditandoColuna(null)
                        }}
                        onBlur={confirmarEdicao}
                        className="flex-1 px-2 py-1 rounded-lg text-sm bg-white border border-primary/40 focus:outline-none font-semibold"
                      />
                    ) : (
                      <h2 className="text-sm font-bold text-gray-700 flex-1 truncate">{coluna.label}</h2>
                    )}

                    <span className="w-5 h-5 rounded-full bg-gray-200 text-gray-500 text-[10px] font-bold flex items-center justify-center flex-shrink-0">
                      {cards.length}
                    </span>

                    {!isEditing && canManage && (
                      <div className="flex items-center gap-0.5">
                        <button
                          onClick={() => { setEditandoColuna(coluna.id); setEditandoNome(coluna.label) }}
                          className="w-6 h-6 rounded-lg text-gray-400 hover:text-primary hover:bg-white transition-all flex items-center justify-center"
                          title="Renomear coluna">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                          </svg>
                        </button>
                        <button
                          onClick={() => setConfirmDeleteColuna(coluna.id)}
                          className="w-6 h-6 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all flex items-center justify-center"
                          title="Excluir coluna">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                          </svg>
                        </button>
                      </div>
                    )}
                  </div>

                  <div className={`mx-4 h-0.5 ${coluna.cor} opacity-30 rounded-full mb-3 flex-shrink-0`}/>

                  {/* Cards */}
                  <div className="flex-1 overflow-y-auto px-4 pb-4 flex flex-col gap-2.5 scrollbar-thin">
                    {cards.map(tarefa => (
                      <TarefaCard
                        key={tarefa.id}
                        tarefa={tarefa}
                        onEdit={(t) => setModalCard({ colunaId: coluna.id, card: t, posicao: t.position })}
                        onDelete={(t) => setConfirmDeleteCard({ card: t, colunaId: coluna.id })}
                        onToggleComplete={handleToggleComplete}
                      />
                    ))}

                    <button
                      onClick={() => setModalCard({ colunaId: coluna.id, card: null, posicao: cards.length })}
                      className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-dashed border-gray-200 text-xs font-medium text-gray-400 hover:border-primary/30 hover:text-primary/60 hover:bg-white/70 transition-all mt-1">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/>
                      </svg>
                      Adicionar card
                    </button>
                  </div>
                </div>
              )
            })}

            {/* ── Nova coluna — só para ADMIN/MANAGER ── */}
            {canManage && (
              <div className="flex-shrink-0 w-80">
                {adicionandoColuna ? (
                  <div className="bg-gray-100/70 rounded-2xl p-4">
                    <input
                      autoFocus
                      type="text"
                      value={novaColunaNome}
                      onChange={e => setNovaColunaNome(e.target.value)}
                      onKeyDown={e => {
                        if (e.key === 'Enter')  handleAdicionarColuna()
                        if (e.key === 'Escape') { setAdicionandoColuna(false); setNovaColunaNome('') }
                      }}
                      placeholder="Nome da coluna..."
                      className="input-base mb-3 bg-white"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={handleAdicionarColuna}
                        disabled={salvandoColuna || !novaColunaNome.trim()}
                        className="btn-primary flex-1 justify-center py-2 disabled:opacity-50">
                        {salvandoColuna ? (
                          <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                          </svg>
                        ) : 'Adicionar'}
                      </button>
                      <button
                        onClick={() => { setAdicionandoColuna(false); setNovaColunaNome('') }}
                        className="w-9 h-9 rounded-xl bg-gray-200 hover:bg-gray-300 flex items-center justify-center text-gray-500 transition-colors flex-shrink-0">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setAdicionandoColuna(true)}
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

      {/* ── Modal criar / editar card ── */}
      {modalCard && (
        <ModalCard
          colunaId={modalCard.colunaId}
          cardInicial={modalCard.card}
          posicao={modalCard.posicao}
          onFechar={() => setModalCard(null)}
          onSalvo={handleCardSalvo}
        />
      )}

      {/* ── Modal confirmar exclusão de card ── */}
      {confirmDeleteCard && createPortal(
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl animate-scale-in">
            <div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
              </svg>
            </div>
            <h3 className="text-base font-bold text-gray-900 text-center mb-1">Excluir card?</h3>
            <p className="text-sm text-gray-500 text-center mb-5">
              "<span className="font-semibold">{confirmDeleteCard.card.titulo}</span>" será removido permanentemente.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setConfirmDeleteCard(null)} disabled={excluindoCard}
                className="btn-ghost flex-1 justify-center">Cancelar</button>
              <button onClick={handleConfirmarDeleteCard} disabled={excluindoCard}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white bg-red-500 hover:bg-red-600 transition-colors disabled:opacity-60">
                {excluindoCard ? 'Excluindo...' : 'Excluir'}
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* ── Modal confirmar exclusão de coluna ── */}
      {confirmDeleteColuna && (() => {
        const col = colunas.find(c => c.id === confirmDeleteColuna)
        const qtd = (tarefasData[confirmDeleteColuna] || []).length
        return createPortal(
          <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl animate-scale-in">
              <div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                </svg>
              </div>
              <h3 className="text-base font-bold text-gray-900 text-center mb-1">Excluir "{col?.label}"?</h3>
              {qtd > 0 && (
                <p className="text-sm text-red-500 text-center mb-1 font-medium">{qtd} card{qtd !== 1 ? 's' : ''} serão perdidos.</p>
              )}
              <p className="text-sm text-gray-400 text-center mb-5">Esta ação não pode ser desfeita.</p>
              <div className="flex gap-3">
                <button onClick={() => setConfirmDeleteColuna(null)} className="btn-ghost flex-1 justify-center">Cancelar</button>
                <button onClick={confirmarExclusao} className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white bg-red-500 hover:bg-red-600 transition-colors">
                  Excluir
                </button>
              </div>
            </div>
          </div>,
          document.body
        )
      })()}
    </div>
  )
}
