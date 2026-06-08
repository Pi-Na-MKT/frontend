import React, { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'

export default function Login({ onGoToRegister }) {
  const { login } = useAuth()
  const [email, setEmail]       = useState('')
  const [senha, setSenha]       = useState('')
  const [erro, setErro]         = useState('')
  const [loading, setLoading]   = useState(false)
  const [showPass, setShowPass] = useState(false)
  const [mounted, setMounted]   = useState(false)
  const [focused, setFocused]   = useState(null)

  useEffect(() => { setTimeout(() => setMounted(true), 50) }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErro('')
    if (!email || !senha) { setErro('Preencha e-mail e senha.'); return }
    setLoading(true)
    try {
      // Chama login() do contexto que faz a requisição e atualiza estado global
      await login(email, senha)
    } catch (err) {
      const msg = err.response?.data?.detail || err.response?.data?.message || 'Credenciais inválidas.'
      setErro(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" }}
      className="min-h-screen w-full flex overflow-hidden bg-[#0A0A0F]">

      {/* ── Painel esquerdo: visual ── */}
      <div className="hidden lg:flex lg:w-[54%] relative overflow-hidden flex-col">
        <div className="absolute inset-0"
          style={{ background: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)' }} />

        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute w-[600px] h-[600px] rounded-full opacity-20"
            style={{ background: 'radial-gradient(circle, #5B4FE8 0%, transparent 70%)', top: '-100px', left: '-100px' }} />
          <div className="absolute w-[500px] h-[500px] rounded-full opacity-15"
            style={{ background: 'radial-gradient(circle, #a78bfa 0%, transparent 70%)', bottom: '-50px', right: '-80px' }} />
          <div className="absolute w-[300px] h-[300px] rounded-full opacity-10"
            style={{ background: 'radial-gradient(circle, #38bdf8 0%, transparent 70%)', top: '40%', left: '60%' }} />

          <svg className="absolute inset-0 w-full h-full opacity-[0.04]">
            <defs>
              <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
                <path d="M 60 0 L 0 0 0 60" fill="none" stroke="white" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>

          {[...Array(6)].map((_, i) => (
            <div key={i} className="absolute rounded-full"
              style={{
                width:  `${[4,6,3,5,4,7][i]}px`,
                height: `${[4,6,3,5,4,7][i]}px`,
                background: ['#5B4FE8','#a78bfa','#38bdf8','#5B4FE8','#c4b5fd','#7dd3fc'][i],
                top:  `${[15,40,65,25,80,55][i]}%`,
                left: `${[20,70,30,55,80,15][i]}%`,
                opacity: 0.6,
                animation: `float ${[4,6,5,7,4,6][i]}s ease-in-out infinite`,
                animationDelay: `${[0,1,2,0.5,1.5,3][i]}s`,
              }}
            />
          ))}
        </div>

        <div className="relative z-10 flex flex-col h-full p-14 justify-between">
          <div className={`transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #5B4FE8, #a78bfa)' }}>
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z"/>
                </svg>
              </div>
              <span className="text-2xl font-bold text-white tracking-tight">PiNa</span>
              <span className="text-white/30 text-xs font-medium border border-white/10 px-2 py-0.5 rounded-full">
                Gestão de Tarefas
              </span>
            </div>
          </div>

          <div className={`flex-1 flex flex-col justify-center transition-all duration-700 delay-100 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
            <div className="inline-flex items-center gap-2 mb-6">
              <div className="w-6 h-px" style={{ background: 'linear-gradient(90deg, #5B4FE8, transparent)' }}/>
              <span className="text-xs font-semibold tracking-widest uppercase" style={{ color: '#a78bfa' }}>
                Gerenciador de Tarefas
              </span>
            </div>
            <h1 className="text-5xl font-bold text-white leading-[1.1] mb-5">
              Bem-vindo<br/>
              <span style={{ background: 'linear-gradient(135deg, #a78bfa, #38bdf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                de volta
              </span>
            </h1>
            <p className="text-white/50 text-base leading-relaxed max-w-sm">
              Acesse seu gerenciador de tarefas e continue de onde parou.
            </p>
          </div>

          <p className="text-white/20 text-xs">© {new Date().getFullYear()} PiNa · Todos os direitos reservados</p>
        </div>
      </div>

      {/* ── Painel direito: formulário ── */}
      <div className="flex-1 flex items-center justify-center p-8 relative overflow-hidden"
        style={{ background: '#0A0A0F' }}>

        <div className="absolute pointer-events-none"
          style={{
            width: '500px', height: '500px',
            background: 'radial-gradient(circle, rgba(91,79,232,0.08) 0%, transparent 70%)',
            top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
          }}
        />

        <div className={`relative z-10 w-full max-w-[400px] transition-all duration-700 delay-200 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>

          {/* Logo mobile */}
          <div className="lg:hidden flex items-center gap-2 mb-10">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #5B4FE8, #a78bfa)' }}>
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z"/>
              </svg>
            </div>
            <span className="text-xl font-bold text-white">PiNa</span>
          </div>

          <div className="mb-8">
            <h2 className="text-3xl font-bold text-white mb-1.5">Bem-vindo</h2>
            <p className="text-sm" style={{ color: '#6b7280' }}>Entre com suas credenciais para continuar</p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">

            {/* E-mail */}
            <div>
              <label className="block text-xs font-semibold mb-2 uppercase tracking-wider" style={{ color: '#9ca3af' }}>
                E-mail
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                onFocus={() => setFocused('email')}
                onBlur={() => setFocused(null)}
                placeholder="seu@email.com"
                autoComplete="email"
                className="w-full px-4 py-3.5 rounded-xl text-sm text-white placeholder-gray-600 outline-none transition-all duration-200"
                style={{
                  background: focused === 'email' ? 'rgba(91,79,232,0.08)' : 'rgba(255,255,255,0.04)',
                  border: `1.5px solid ${focused === 'email' ? '#5B4FE8' : 'rgba(255,255,255,0.08)'}`,
                }}
              />
            </div>

            {/* Senha */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-semibold uppercase tracking-wider" style={{ color: '#9ca3af' }}>
                  Senha
                </label>
                <button type="button" className="text-xs font-medium transition-colors hover:text-white" style={{ color: '#5B4FE8' }}>
                  Esqueceu?
                </button>
              </div>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  value={senha}
                  onChange={e => setSenha(e.target.value)}
                  onFocus={() => setFocused('senha')}
                  onBlur={() => setFocused(null)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className="w-full px-4 py-3.5 pr-12 rounded-xl text-sm text-white placeholder-gray-600 outline-none transition-all duration-200"
                  style={{
                    background: focused === 'senha' ? 'rgba(91,79,232,0.08)' : 'rgba(255,255,255,0.04)',
                    border: `1.5px solid ${focused === 'senha' ? '#5B4FE8' : 'rgba(255,255,255,0.08)'}`,
                  }}
                />
                <button type="button" onClick={() => setShowPass(v => !v)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 transition-colors"
                  style={{ color: '#6b7280' }}>
                  {showPass
                    ? <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                    : <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                  }
                </button>
              </div>
            </div>

            {/* Erro */}
            {erro && (
              <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl text-sm"
                style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171' }}>
                <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {erro}
              </div>
            )}

            {/* Botão */}
            <button type="submit" disabled={loading}
              className="w-full py-3.5 rounded-xl font-semibold text-sm text-white transition-all duration-200 mt-1 flex items-center justify-center gap-2 disabled:opacity-50"
              style={{ background: loading ? '#3d33c0' : 'linear-gradient(135deg, #5B4FE8, #7c6ff7)', boxShadow: loading ? 'none' : '0 0 30px rgba(91,79,232,0.35)' }}>
              {loading ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                  </svg>
                  Entrando...
                </>
              ) : 'Entrar na plataforma'}
            </button>
          </form>

          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.06)' }}/>
            <span className="text-xs" style={{ color: '#374151' }}>ou</span>
            <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.06)' }}/>
          </div>


          {onGoToRegister && (
            <p className="text-center text-sm" style={{ color: '#4b5563' }}>
              Novo por aqui?{' '}
              <button type="button" onClick={onGoToRegister}
                className="font-semibold transition-colors hover:text-white"
                style={{ color: '#7c6ff7' }}>
                Criar conta
              </button>
            </p>
          )}
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-12px); }
        }
      `}</style>
    </div>
  )
}