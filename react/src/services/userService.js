import api from './api'

export const userService = {
  getAll: () => api.get('/users'),
  getById: (id) => api.get(`/users/${id}`),
  create: (data) => api.post('/users/register', data),
  update: (id, data) => api.put(`/users/${id}`, data),
  delete: (id) => api.delete(`/users/${id}`),
  assignToBoard: (boardId, userIds) =>
    api.put(`/boards/${boardId}`, { userIds }),
}
