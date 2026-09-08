import api from './api'

export const taskService = {
  getAll: (columnId) => api.get(`/cards/column/${columnId}`),
  create: (columnId, data) => api.post(`/cards/column/${columnId}`, data),
  update: (id, data) => api.put(`/cards/${id}`, data),
  delete: (id) => api.delete(`/cards/${id}`),
  move: (id, columnId, position) =>
    api.put(`/cards/${id}`, { columnId, position }),
  toggleComplete: (id, completed) => api.put(`/cards/${id}`, { completed }),
  updateColumn: (id, data) => api.put(`/columns/${id}`, data),
  reorderColumns: (columns) =>
    Promise.all(
      columns.map((col, i) => api.put(`/columns/${col.id}`, { position: i }))
    ),
  getBoards: () => api.get('/boards'),
  getBoardColumns: (boardId) => api.get(`/columns/board/${boardId}`),
  createBoard: (companyId, data) =>
    api.post(`/boards/company/${companyId}`, data),
  createDefaultColumns: (boardId) =>
    Promise.all([
      api.post(`/columns/board/${boardId}`, { name: 'A Fazer', position: 0 }),
      api.post(`/columns/board/${boardId}`, {
        name: 'Em Progresso',
        position: 1,
      }),
      api.post(`/columns/board/${boardId}`, { name: 'Concluído', position: 2 }),
    ]),
}
