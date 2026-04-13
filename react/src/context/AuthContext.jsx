import React, { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

// Mock users — simula um backend
const MOCK_USERS = [
  { id: 1, email: 'admin@pina.com', senha: '123456', nome: 'Ana Souza', avatar: 'https://i.pravatar.cc/40?img=5', cargo: 'Gerente de Marketing' },
  { id: 2, email: 'user@pina.com',  senha: '123456', nome: 'Carlos Lima',  avatar: 'https://i.pravatar.cc/40?img=8', cargo: 'Analista de Campanhas' },
]

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true) // para verificar sessão salva

  // Ao montar, verifica se há sessão salva
  useEffect(() => {
    try {
      const saved = localStorage.getItem('pina_user')
      if (saved) setUser(JSON.parse(saved))
    } catch {
      localStorage.removeItem('pina_user')
    } finally {
      setLoading(false)
    }
  }, [])

  const login = async (email, senha) => {
    // Simula latência de rede
    await new Promise(r => setTimeout(r, 900))

    const found = MOCK_USERS.find(u => u.email === email && u.senha === senha)
    if (!found) throw new Error('E-mail ou senha inválidos.')

    const { senha: _, ...safeUser } = found
    setUser(safeUser)
    localStorage.setItem('pina_user', JSON.stringify(safeUser))
    return safeUser
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('pina_user')
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth deve ser usado dentro de AuthProvider')
  return ctx
}
