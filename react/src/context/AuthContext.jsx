import React, { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'

const AuthContext = createContext(null)

// Instância base do Axios — token JWT injetado automaticamente em toda requisição
const api = axios.create({ baseURL: 'http://localhost:8080/api' })

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

export function AuthProvider({ children }) {
  const [user, setUser]                     = useState(null)
  const [loading, setLoading]               = useState(true)
  const [registeredUsers, setRegisteredUsers] = useState([])

  // Restaura sessão ao recarregar a página
  useEffect(() => {
    const token  = localStorage.getItem('token')
    const nome   = localStorage.getItem('name')
    const userId = localStorage.getItem('userId')

    if (token && nome) {
      setUser({ id: userId, nome, token })
      // Já busca a lista de usuários com o token salvo
      fetchUsers()
    }
    setLoading(false)
  }, [])

  // Busca lista de usuários do backend (rota protegida — precisa de token)
  const fetchUsers = async () => {
    try {
      const { data } = await api.get('/users')
      // O backend retorna "name", "jobTitle", "department" — normaliza para os campos usados no frontend
      const normalizado = data.map(u => ({
        ...u,
        nome:   u.name       ?? u.nome,
        cargo:  u.jobTitle   ?? u.cargo,
        equipe: u.department ?? u.equipe,
      }))
      setRegisteredUsers(normalizado)
    } catch (err) {
      console.error('Erro ao buscar usuários:', err)
    }
  }

  // ── LOGIN ────────────────────────────────────────────────────────────────
  const login = async (email, senha) => {
    const { data } = await api.post('/users/login', { email, password: senha })

    // Persiste token e dados básicos no localStorage
    localStorage.setItem('token',  data.token)
    localStorage.setItem('userId', String(data.userId))
    localStorage.setItem('name',   data.name)

    const loggedUser = { id: data.userId, nome: data.name, token: data.token }
    setUser(loggedUser)

    // Carrega a lista de usuários logo após o login
    await fetchUsers()

    return loggedUser
  }

  // ── LOGOUT ───────────────────────────────────────────────────────────────
  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('userId')
    localStorage.removeItem('name')
    setUser(null)
    setRegisteredUsers([])
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, registeredUsers, fetchUsers }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth deve ser usado dentro de AuthProvider')
  return ctx
}