import React, { createContext, useContext, useState } from 'react'

const UsersContext = createContext(null)

// Usuários iniciais de demonstração
const INITIAL_USERS = [
  {
    id: 1,
    nome: 'Ana Souza',
    email: 'admin@pina.com',
    cargo: 'Gerente de Marketing',
    nivelAcesso: 'gestor',
    equipe: 'Estratégia',
    avatar: 'https://i.pravatar.cc/40?img=5',
    status: 'ativo',
    dataCadastro: '2024-01-10',
  },
  {
    id: 2,
    nome: 'Carlos Lima',
    email: 'user@pina.com',
    cargo: 'Analista de Campanhas',
    nivelAcesso: 'colaborador',
    equipe: 'Performance',
    avatar: 'https://i.pravatar.cc/40?img=8',
    status: 'ativo',
    dataCadastro: '2024-02-15',
  },
]

export function UsersProvider({ children }) {
  const [users, setUsers] = useState(INITIAL_USERS)

  const addUser = (userData) => {
    const novo = {
      ...userData,
      id: Date.now(),
      avatar: `https://i.pravatar.cc/40?img=${Math.floor(Math.random() * 70) + 1}`,
      status: 'ativo',
      dataCadastro: new Date().toISOString().split('T')[0],
    }
    setUsers(prev => [...prev, novo])
    return novo
  }

  const updateUser = (id, dados) => {
    setUsers(prev => prev.map(u => (u.id === id ? { ...u, ...dados } : u)))
  }

  const removeUser = (id) => {
    setUsers(prev => prev.filter(u => u.id !== id))
  }

  const emailJaExiste = (email, excludeId = null) =>
    users.some(u => u.email === email && u.id !== excludeId)

  return (
    <UsersContext.Provider value={{ users, addUser, updateUser, removeUser, emailJaExiste }}>
      {children}
    </UsersContext.Provider>
  )
}

export function useUsers() {
  const ctx = useContext(UsersContext)
  if (!ctx) throw new Error('useUsers deve ser usado dentro de UsersProvider')
  return ctx
}
