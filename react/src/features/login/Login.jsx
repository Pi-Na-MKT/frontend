import React, { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'

export default function Login({ onGoToRegister }) {
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPass, setShowPass] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [focused, setFocused] = useState(null)

  useEffect(() => {
    setTimeout(() => setMounted(true), 80)
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErro('')
    if (!email || !senha) {
      setErro('Preencha e-mail e senha.')
      return
    }
    setLoading(true)
    try {
      await login(email, senha)
    } catch (err) {
      const msg =
        err.response?.data?.detail ||
        err.response?.data?.message ||
        'Credenciais inválidas.'
      setErro(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full flex items-center justify-center relative overflow-hidden font-sans bg-slate-900 min-h-screen">
      {/* Fundo: orbs sutis */}
      <div
        className="absolute inset-0 pointer-events-none bg-gradient-to-br from-blue-900/35 via-blue-900/20 to-yellow-500/6"
      />
      
      {/* Grade de pontos */}
      <svg className="absolute inset-0 w-full h-full opacity-6 pointer-events-none">
        <defs>
          <pattern id="dots" width="28" height="28" patternUnits="userSpaceOnUse">
            <circle cx="1.5" cy="1.5" r="1.5" fill="#FBBF24" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#dots)" />
      </svg>

      {/* Linha decorativa superior */}
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-blue-800 via-yellow-500 to-transparent" />

      {/* Logo + rodapé topo */}
      <div className="absolute top-8 left-1/2 -translate-x-1/2 flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-xl bg-yellow-400 flex items-center justify-center shadow-sm">
          <svg
            width="16"
            height="16"
            fill="none"
            stroke="#0F172A"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            viewBox="0 0 24 24"
          >
            <path d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <span className="text-white font-bold text-lg tracking-tight">PINA</span>
      </div>

      {/* Card central */}
      <div
        className={`relative z-10 w-full max-w-md mx-auto p-10 bg-slate-900/70 border border-blue-800/45 rounded-2xl backdrop-blur-xl shadow-2xl opacity-0 translate-y-5 transition-all duration-500 ${
          mounted ? 'opacity-100 translate-y-0' : ''
        }`}
      >
        {/* Cabeçalho */}
        <div className="mb-8 text-center">
          <p className="text-xs font-semibold tracking-widest uppercase text-yellow-400 mb-2.5">
            Gestão de Tarefas
          </p>
          <h1 className="text-2xl font-bold text-white tracking-tight leading-tight">
            Acesse sua conta
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Entre com suas credenciais para continuar
          </p>
        </div>

        {/* Divisor */}
        <div className="h-px bg-blue-900/40 mb-7" />

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* E-mail */}
          <div>
            <label className="block text-xs font-semibold tracking-wider uppercase text-slate-500 mb-2">
              E-mail
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onFocus={() => setFocused('email')}
              onBlur={() => setFocused(null)}
              placeholder="seu@email.com"
              autoComplete="email"
              aria-label="Endereço de e-mail"
              className={`w-full p-3 rounded-xl text-sm text-white transition-all font-sans outline-none
                ${focused === 'email' 
                  ? 'bg-blue-900/20 border-2 border-blue-800/90' 
                  : 'bg-blue-900/8 border-2 border-blue-900/35'
                }`}
            />
          </div>

          {/* Senha */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-semibold tracking-wider uppercase text-slate-500">
                Senha
              </label>
              <button
                type="button"
                className="text-xs text-yellow-400 bg-transparent border-0 cursor-pointer p-0 font-sans"
              >
                Esqueceu a senha?
              </button>
            </div>
            <div className="relative">
              <input
                type={showPass ? 'text' : 'password'}
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                onFocus={() => setFocused('senha')}
                onBlur={() => setFocused(null)}
                placeholder="••••••••"
                autoComplete="current-password"
                aria-label="Senha"
                className={`w-full p-3 pr-11 rounded-xl text-sm text-white transition-all font-sans outline-none
                  ${focused === 'senha' 
                    ? 'bg-blue-900/20 border-2 border-blue-800/90' 
                    : 'bg-blue-900/8 border-2 border-blue-900/35'
                  }`}
              />
              <button
                type="button"
                onClick={() => setShowPass((v) => !v)}
                aria-label={showPass ? 'Ocultar senha' : 'Mostrar senha'}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 bg-transparent border-0 cursor-pointer text-slate-500 p-0 flex"
              >
                {showPass ? (
                  <svg
                    width="16"
                    height="16"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    viewBox="0 0 24 24"
                  >
                    <path d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                ) : (
                  <svg
                    width="16"
                    height="16"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    viewBox="0 0 24 24"
                  >
                    <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Erro */}
          {erro && (
            <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-red-500/7 border border-red-500/18 text-red-400 text-sm">
              <svg
                width="15"
                height="15"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
                className="flex-shrink-0"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              {erro}
            </div>
          )}

          {/* Botão */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full p-3 rounded-xl text-sm font-bold text-slate-900 border-0 flex items-center justify-center gap-2 transition-all font-sans mt-1
              ${loading 
                ? 'bg-blue-900 cursor-not-allowed opacity-70' 
                : 'bg-yellow-400 cursor-pointer shadow-lg shadow-yellow-400/25'
              }`}
          >
            {loading ? (
              <>
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#fff"
                  strokeWidth="3"
                  className="animate-spin"
                >
                  <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
                  <path d="M4 12a8 8 0 018-8" stroke="#fff" />
                </svg>
                <span className="text-slate-400">Entrando...</span>
              </>
            ) : (
              'Entrar'
            )}
          </button>
        </form>

        {onGoToRegister && (
          <p className="mt-6 text-center text-sm text-slate-600">
            Não tem uma conta?{' '}
            <button
              type="button"
              onClick={onGoToRegister}
              className="text-yellow-400 font-semibold bg-transparent border-0 cursor-pointer p-0 font-sans text-sm"
            >
              Criar conta
            </button>
          </p>
        )}
      </div>

      {/* Rodapé */}
      <p className="absolute bottom-6 left-1/2 -translate-x-1/2 text-xs text-blue-900 whitespace-nowrap">
        © {new Date().getFullYear()} PiNa · Todos os direitos reservados
      </p>
    </div>
  )
}
