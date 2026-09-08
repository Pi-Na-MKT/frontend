import React, { useState } from 'react'
import Modal from './Modal'
import Spinner from './Spinner'
import UserAvatar from './UserAvatar'
import api from '../services/api'

// opções de prioridade - talvez mover pra constants depois
const PRIORITY_OPTIONS = [
  { value: 'HIGH', label: 'Alta' },
  { value: 'MEDIUM', label: 'Média' },
  { value: 'LOW', label: 'Baixa' },
]

function CardModal({
  columnId,
  initialCard,
  position,
  registeredUsers,
  onClose,
  onSaved,
}) {
  // se tem initialCard é edição, senão é criação
  const isEdit = !!initialCard

  // estado do formulário - começa com valores vazios ou do card existente
  const [form, setForm] = useState({
    title: initialCard?.titulo || '',
    desc: initialCard?.descricao || '',
    priority: initialCard?.rawPriority || 'MEDIUM',
    dueDate: initialCard?.rawDueDate
      ? new Date(initialCard.rawDueDate).toISOString().slice(0, 10)
      : '',
  })

  // usuários selecionados - uso Set pra facilitar adicionar/remover
  const [assignedIds, setAssignedIds] = useState(
    () => new Set((initialCard?.assignedUserIds || []).map(Number))
  )

  // estados de UI
  const [userSearch, setUserSearch] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // helper pra atualizar o form de forma mais simples
  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }))

  // toggle de usuário selecionado
  const toggleUser = (id) =>
    setAssignedIds((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })

  // filtra usuários baseado na busca
  const filteredUsers = registeredUsers.filter(
    (u) =>
      !userSearch ||
      (u.nome || u.name || '').toLowerCase().includes(userSearch.toLowerCase())
  )

  // salva o card (cria ou edita)
  const handleSubmit = async () => {
    // validação básica
    if (!form.title.trim()) {
      setError('Título é obrigatório.')
      return
    }

    setLoading(true)
    setError('')

    try {
      const payload = {
        title: form.title.trim(),
        description: form.desc.trim() || null,
        priority: form.priority,
        position,
        dueDate: form.dueDate ? form.dueDate + 'T00:00:00' : null,
        isActive: true,
        assignedUserIds: [...assignedIds],
      }

      // decide se é PUT ou POST baseado no isEdit
      const { data } = isEdit
        ? await api.put(`/cards/${initialCard.id}`, payload)
        : await api.post(`/cards/column/${columnId}`, payload)

      onSaved(data)
    } catch (err) {
      // tenta pegar mensagem de erro do response, senão usa genérico
      setError(
        err.response?.data?.detail ||
          err.response?.data?.message ||
          'Erro ao salvar card.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal onClose={onClose}>
      <Modal.Header
        title={isEdit ? 'Editar card' : 'Novo card'}
        onClose={onClose}
      />
      <Modal.Body>
        {/* campo título - obrigatório */}
        <div>
          <label className="section-title block mb-1.5">
            Título <span className="text-red-400">*</span>
          </label>
          <input
            autoFocus
            value={form.title}
            onChange={(e) => {
              set('title', e.target.value)
              setError('')
            }}
            placeholder="Ex.: Criar post para o Instagram"
            className="input-base"
          />
        </div>

        {/* campo descrição - opcional */}
        <div>
          <label className="section-title block mb-1.5">Descrição</label>
          <textarea
            value={form.desc}
            onChange={(e) => set('desc', e.target.value)}
            placeholder="Detalhes sobre a tarefa..."
            rows={2}
            className="input-base resize-none"
          />
        </div>

        {/* prioridade e prazo - lado a lado */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="section-title block mb-1.5">Prioridade</label>
            <select
              value={form.priority}
              onChange={(e) => set('priority', e.target.value)}
              className="input-base appearance-none"
            >
              {PRIORITY_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="section-title block mb-1.5">Prazo</label>
            <input
              type="date"
              value={form.dueDate}
              onChange={(e) => set('dueDate', e.target.value)}
              className="input-base"
            />
          </div>
        </div>

        {/* seleção de responsáveis */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="section-title">Responsáveis</label>
            {assignedIds.size > 0 && (
              <span className="text-[11px] text-primary font-medium">
                {assignedIds.size} selecionado
                {assignedIds.size !== 1 ? 's' : ''}
              </span>
            )}
          </div>

          {/* se não tem usuários cadastrados no board */}
          {registeredUsers.length === 0 ? (
            <div className="flex items-center gap-2.5 px-3 py-3 bg-gray-50 border border-gray-100 rounded-xl">
              <svg
                className="w-4 h-4 text-gray-300 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <p className="text-xs text-gray-400">
                Adicione membros ao board para atribuir responsáveis.
              </p>
            </div>
          ) : (
            <>
              {/* campo de busca só aparece se tiver muitos usuários */}
              {registeredUsers.length > 5 && (
                <div className="relative mb-2">
                  <svg
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                  <input
                    type="text"
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                    placeholder="Buscar usuário..."
                    className="input-base pl-9 py-1.5 text-xs"
                  />
                </div>
              )}

              {/* lista de usuários com checkboxes */}
              <div className="border border-gray-100 rounded-xl overflow-hidden max-h-40 overflow-y-auto">
                {filteredUsers.length === 0 ? (
                  <p className="text-xs text-gray-400 text-center py-3">
                    Nenhum usuário encontrado
                  </p>
                ) : (
                  filteredUsers.map((u) => {
                    const id = Number(u.id)
                    const selected = assignedIds.has(id)
                    return (
                      <button
                        key={id}
                        type="button"
                        onClick={() => toggleUser(id)}
                        className={`w-full flex items-center gap-2.5 px-3 py-2 text-left transition-colors hover:bg-gray-50 ${selected ? 'bg-primary/5' : ''}`}
                      >
                        <div
                          className={`w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 transition-all ${selected ? 'bg-primary border-primary' : 'border-gray-300'}`}
                        >
                          {selected && (
                            <svg
                              className="w-2.5 h-2.5 text-white"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={3}
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          )}
                        </div>
                        <UserAvatar user={u} size="w-6 h-6" />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-gray-800 truncate">
                            {u.nome || u.name}
                          </p>
                          {(u.cargo || u.jobTitle) && (
                            <p className="text-[10px] text-gray-400 truncate">
                              {u.cargo || u.jobTitle}
                            </p>
                          )}
                        </div>
                      </button>
                    )
                  })
                )}
              </div>
            </>
          )}
        </div>

        {/* mostra erro se tiver */}
        {error && (
          <div className="flex items-center gap-2 px-3 py-2.5 bg-red-50 border border-red-100 rounded-xl text-sm text-red-600">
            <svg
              className="w-4 h-4 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            {error}
          </div>
        )}
      </Modal.Body>
      <Modal.Footer>
        <button onClick={onClose} className="btn-ghost flex-1 justify-center">
          Cancelar
        </button>
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="btn-primary flex-1 justify-center disabled:opacity-50"
        >
          {loading ? (
            <Spinner size="sm" className="text-white" />
          ) : (
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M5 13l4 4L19 7"
              />
            </svg>
          )}
          {loading ? 'Salvando...' : isEdit ? 'Salvar' : 'Criar card'}
        </button>
      </Modal.Footer>
    </Modal>
  )
}

export default CardModal
