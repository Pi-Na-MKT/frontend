import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios'

const api = axios.create({ baseURL: 'http://localhost:8080/api/' })

// ─── Dados estáticos ──────────────────────────────────────────────────────
const EQUIPES = ['Estratégia', 'Performance', 'Conteúdo', 'Design', 'SEO', 'Social Media', 'CRM', 'Dados & Analytics']

const CANAIS = ['Instagram', 'Facebook', 'Google Ads', 'LinkedIn', 'TikTok', 'E-mail Marketing', 'YouTube', 'Pinterest']

const SENIORIDADE = [
  { value: 'junior', label: 'Júnior', years: '0–2 anos' },
  { value: 'pleno', label: 'Pleno', years: '2–5 anos' },
  { value: 'senior', label: 'Sênior', years: '5–10 anos' },
  { value: 'lead', label: 'Lead', years: '10+ anos' },
]

// ─── Helpers ──────────────────────────────────────────────────────────────
const inputStyle = (focused, error) => ({
  background: error ? 'rgba(239,68,68,0.06)' : focused ? 'rgba(91,79,232,0.07)' : 'rgba(255,255,255,0.04)',
  border: `1.5px solid ${error ? 'rgba(239,68,68,0.5)' : focused ? '#5B4FE8' : 'rgba(255,255,255,0.08)'}`,
  color: '#fff',
  outline: 'none',
  transition: 'all 0.2s',
})

const baseInput = 'w-full px-4 py-3 rounded-xl text-sm placeholder-gray-600'

function Field({ label, error, hint, children }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#9ca3af' }}>{label}</label>
        {hint && <span className="text-xs" style={{ color: '#4b5563' }}>{hint}</span>}
      </div>
      {children}
      {error && (
        <p className="mt-1 text-xs flex items-center gap-1" style={{ color: '#f87171' }}>
          <svg className="w-3 h-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {error}
        </p>
      )}
    </div>
  )
}

function PasswordStrength({ senha }) {
  const checks = [
    senha.length >= 8,
    /[A-Z]/.test(senha),
    /[0-9]/.test(senha),
    /[^A-Za-z0-9]/.test(senha),
  ]
  const score = checks.filter(Boolean).length
  const colors = ['#374151', '#ef4444', '#f59e0b', '#10b981', '#5B4FE8']
  const labels = ['', 'Fraca', 'Razoável', 'Boa', 'Forte']
  return senha ? (
    <div className="mt-2">
      <div className="flex gap-1 mb-1">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="h-1 flex-1 rounded-full transition-all duration-300"
            style={{ background: i <= score ? colors[score] : 'rgba(255,255,255,0.07)' }} />
        ))}
      </div>
      <p className="text-xs" style={{ color: colors[score] }}>{labels[score]}</p>
    </div>
  ) : null
}

// ─── Avatar Upload ────────────────────────────────────────────────────────
function AvatarUpload({ preview, onFile }) {
  const inputRef = useRef(null)
  return (
    <div className="flex flex-col items-center gap-3 mb-2">
      <div
        className="relative w-20 h-20 rounded-full cursor-pointer group"
        onClick={() => inputRef.current?.click()}
        style={{ border: '2px dashed rgba(91,79,232,0.5)' }}
      >
        {preview ? (
          <img src={preview} alt="avatar" className="w-full h-full rounded-full object-cover" />
        ) : (
          <div className="w-full h-full rounded-full flex flex-col items-center justify-center"
            style={{ background: 'rgba(91,79,232,0.08)' }}>
            <svg className="w-6 h-6 mb-1" style={{ color: '#5B4FE8' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span className="text-[9px]" style={{ color: '#5B4FE8' }}>Foto</span>
          </div>
        )}
        <div className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
      </div>
      <p className="text-xs" style={{ color: '#6b7280' }}>Clique para enviar sua foto</p>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={e => {
          const file = e.target.files?.[0]
          if (file) onFile(file)
        }}
      />
    </div>
  )
}

// ─── Componente principal ─────────────────────────────────────────────────
export default function Cadastro({ onGoToLogin, isInternalAccess = false }) {
  const [step, setStep] = useState(0)
  const [dir, setDir] = useState(1)
  const [anim, setAnim] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [sucesso, setSucesso] = useState(false)
  const [erroGlobal, setErroGlobal] = useState('')
  const [focused, setFocused] = useState(null)
  const [erros, setErros] = useState({})
  const [showSenha, setShowSenha] = useState(false)
  const [showConfirmar, setShowConfirmar] = useState(false)
  const [usuarioCriado, setUsuarioCriado] = useState(null)
  const [avatarPreview, setAvatarPreview] = useState(null)
  const [avatarFile, setAvatarFile] = useState(null)

  const [form, setForm] = useState({
    nome: '', email: '', telefone: '',
    senha: '', confirmarSenha: '',
    cargo: '', senioridade: '',
    equipe: '', responsabilidade: '',
    canais: [], bio: '', linkedin: '',
  })

  useEffect(() => { setTimeout(() => setMounted(true), 50) }, [])

  const set = (k, v) => {
    setForm(p => ({ ...p, [k]: v }))
    setErros(p => ({ ...p, [k]: '' }))
    setErroGlobal('')
  }

  const toggleCanal = (c) => {
    setForm(p => ({
      ...p,
      canais: p.canais.includes(c) ? p.canais.filter(x => x !== c) : [...p.canais, c]
    }))
  }

  const handleAvatarFile = (file) => {
    setAvatarFile(file)
    const reader = new FileReader()
    reader.onload = e => setAvatarPreview(e.target.result)
    reader.readAsDataURL(file)
  }

  const validarEtapa = (s) => {
    const e = {}
    if (s === 0) {
      if (!form.nome.trim()) e.nome = 'Nome é obrigatório.'
      else if (form.nome.trim().split(' ').length < 2) e.nome = 'Informe nome e sobrenome.'
      if (!form.email.trim()) e.email = 'E-mail é obrigatório.'
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'E-mail inválido.'
      if (!form.senha) e.senha = 'Senha é obrigatória.'
      else if (form.senha.length < 6) e.senha = 'Mínimo 6 caracteres.'
      if (!form.confirmarSenha) e.confirmarSenha = 'Confirme a senha.'
      else if (form.senha !== form.confirmarSenha) e.confirmarSenha = 'Senhas não coincidem.'
    }
    if (s === 1) {
      if (!form.cargo.trim()) e.cargo = 'Cargo é obrigatório.'
      if (!form.equipe) e.equipe = 'Selecione uma equipe.'
    }
    return e
  }

  const goNext = () => {
    const e = validarEtapa(step)
    if (Object.keys(e).length > 0) { setErros(e); return }
    setDir(1); setAnim(true)
    setTimeout(() => { setStep(s => s + 1); setAnim(false) }, 220)
  }

  const goBack = () => {
    setDir(-1); setAnim(true)
    setTimeout(() => { setStep(s => s - 1); setAnim(false) }, 220)
  }

  const handleSubmit = async () => {
    setErroGlobal('')
    setLoading(true)
    try {
      const payload = {
        name: form.nome,
        email: form.email,
        password: form.senha,
        phone: form.telefone,
        jobTitle: form.cargo,
        department: form.equipe,
        seniority: form.senioridade,
        responsibility: form.responsabilidade,
        bio: form.bio,
        linkedin: form.linkedin,
      }

      const { data } = await api.post('/users/register', payload)

      const criado = {
        ...data,
        nome: data.name ?? form.nome,
        email: data.email ?? form.email,
        cargo: data.position ?? form.cargo,
        equipe: data.team ?? form.equipe,
        avatar: avatarPreview,
      }

      setUsuarioCriado(criado)
      setSucesso(true)
    } catch (err) {
      const msg = err.response?.data?.message
        || err.response?.data
        || 'Erro ao cadastrar. Tente novamente.'
      setErroGlobal(typeof msg === 'string' ? msg : 'Erro ao cadastrar.')
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setSucesso(false)
    setStep(0)
    setAvatarPreview(null)
    setAvatarFile(null)
    setForm({
      nome: '', email: '', telefone: '', senha: '', confirmarSenha: '',
      cargo: '', senioridade: '', equipe: '',
      responsabilidade: '', canais: [], bio: '', linkedin: '',
    })
  }

  const STEPS = ['Conta', 'Perfil', 'Detalhes']

  // ── Tela de sucesso ──────────────────────────────────────────────────────
  if (sucesso) {
    return (
      <div style={{ fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif", background: '#0A0A0F' }}
        className="min-h-screen w-full flex items-center justify-center p-8">
        <div className="text-center max-w-sm">
          <div className="relative mx-auto w-20 h-20 mb-6">
            <div className="absolute inset-0 rounded-full animate-ping opacity-20"
              style={{ background: 'linear-gradient(135deg, #5B4FE8, #a78bfa)' }} />
            {usuarioCriado?.avatar ? (
              <img src={usuarioCriado.avatar} className="relative w-20 h-20 rounded-full object-cover border-2 border-purple-500" alt="avatar" />
            ) : (
              <div className="relative w-20 h-20 rounded-full flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #5B4FE8, #a78bfa)' }}>
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            )}
          </div>

          <h2 className="text-2xl font-bold text-white mb-2">Usuário criado!</h2>
          <p className="text-sm mb-8" style={{ color: '#6b7280' }}>
            <span className="text-white font-semibold">{usuarioCriado?.nome}</span> foi adicionado(a) com sucesso.
          </p>

          <div className="rounded-2xl p-4 mb-6 text-left"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
            {[
              ['E-mail', usuarioCriado?.email],
              ['Cargo', usuarioCriado?.cargo],
              ['Equipe', usuarioCriado?.equipe],
            ].map(([k, v]) => v && (
              <div key={k} className="flex justify-between py-1.5 border-b last:border-0"
                style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
                <span className="text-xs" style={{ color: '#6b7280' }}>{k}</span>
                <span className="text-xs font-medium text-white">{v}</span>
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-2.5">
            <button onClick={resetForm}
              className="w-full py-3 rounded-xl text-sm font-semibold text-white transition-all"
              style={{ background: 'linear-gradient(135deg, #5B4FE8, #7c6ff7)', boxShadow: '0 0 25px rgba(91,79,232,0.3)' }}>
              Cadastrar outro
            </button>
            <button onClick={onGoToLogin}
              className="w-full py-3 rounded-xl text-sm font-semibold transition-all"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#9ca3af' }}>
              {isInternalAccess ? 'Voltar para Usuários' : 'Ir para o login'}
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ── Layout base ──────────────────────────────────────────────────────────
  return (
    <div style={{ fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif", background: '#0A0A0F' }}
      className="min-h-screen w-full flex overflow-hidden">

      {/* ── Painel esquerdo (clean) ── */}
      <div className="hidden lg:flex lg:w-[42%] relative overflow-hidden flex-col">
        <div className="absolute inset-0"
          style={{ background: 'linear-gradient(160deg, #0f0c29 0%, #302b63 60%, #1a1040 100%)' }} />
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute w-[500px] h-[500px] rounded-full opacity-20"
            style={{ background: 'radial-gradient(circle, #5B4FE8 0%, transparent 70%)', top: '-80px', left: '-80px' }} />
          <div className="absolute w-[400px] h-[400px] rounded-full opacity-10"
            style={{ background: 'radial-gradient(circle, #a78bfa 0%, transparent 70%)', bottom: '0', right: '-60px' }} />
          <svg className="absolute inset-0 w-full h-full opacity-[0.04]">
            <defs>
              <pattern id="grid2" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid2)" />
          </svg>
        </div>

        <div className="relative z-10 flex flex-col h-full p-12 justify-between">
          <div className={`transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #5B4FE8, #a78bfa)' }}>
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <span className="text-2xl font-bold text-white">PiNa</span>
            </div>
          </div>

          <div className="flex-1 flex flex-col justify-center">
            <div className={`transition-all duration-500 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
              <div className="inline-flex items-center gap-2 mb-5">
                <div className="w-5 h-px" style={{ background: 'linear-gradient(90deg, #5B4FE8, transparent)' }} />
                <span className="text-xs font-semibold tracking-widest uppercase" style={{ color: '#a78bfa' }}>
                  Novo usuário
                </span>
              </div>

              <h1 className="text-4xl font-bold text-white leading-tight mb-4">
                Crie seu<br />
                <span style={{ background: 'linear-gradient(135deg,#a78bfa,#38bdf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  perfil
                </span>
              </h1>
              <p className="text-sm leading-relaxed" style={{ color: '#6b7280' }}>
                Preencha seus dados para acessar a plataforma e começar a colaborar com a equipe.
              </p>
            </div>

            <div className="mt-12 flex flex-col gap-3">
              {STEPS.map((s, i) => (
                <div key={s} className="flex items-center gap-3 transition-all duration-300"
                  style={{ opacity: i <= step ? 1 : 0.3 }}>
                  <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 transition-all duration-300"
                    style={{
                      background: i < step ? '#10b981' : i === step ? 'linear-gradient(135deg,#5B4FE8,#a78bfa)' : 'rgba(255,255,255,0.08)',
                      color: i <= step ? '#fff' : '#6b7280',
                    }}>
                    {i < step
                      ? <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                      : i + 1
                    }
                  </div>
                  <div>
                    <p className="text-sm font-semibold" style={{ color: i === step ? '#fff' : '#6b7280' }}>{s}</p>
                    <p className="text-xs" style={{ color: '#374151' }}>
                      {['Dados pessoais e foto', 'Cargo e equipe', 'Canais e bio'][i]}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <p className="text-xs" style={{ color: '#1f2937' }}>© {new Date().getFullYear()} PiNa · Todos os direitos reservados</p>
        </div>
      </div>

      {/* ── Painel direito: formulário ── */}
      <div className="flex-1 flex items-center justify-center p-8 relative overflow-hidden">
        <div className="absolute pointer-events-none"
          style={{ width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(91,79,232,0.06) 0%, transparent 70%)', top: '50%', left: '50%', transform: 'translate(-50%,-50%)' }} />

        <div className={`relative z-10 w-full max-w-[420px] transition-all duration-700 delay-100 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>

          {/* Header mobile */}
          <div className="lg:hidden flex items-center justify-between mb-8">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg,#5B4FE8,#a78bfa)' }}>
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <span className="font-bold text-white">PiNa</span>
            </div>
            <span className="text-xs" style={{ color: '#6b7280' }}>{step + 1}/{STEPS.length}</span>
          </div>

          {/* Barra de progresso */}
          <div className="mb-7">
            <div className="h-1 rounded-full mb-4 overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
              <div className="h-full rounded-full transition-all duration-500"
                style={{ width: `${((step + 1) / STEPS.length) * 100}%`, background: 'linear-gradient(90deg, #5B4FE8, #a78bfa)' }} />
            </div>
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">{STEPS[step]}</h2>
              <span className="text-xs" style={{ color: '#6b7280' }}>Etapa {step + 1} de {STEPS.length}</span>
            </div>
          </div>

          {/* Conteúdo animado */}
          <div style={{
            transition: 'opacity 0.22s, transform 0.22s',
            opacity: anim ? 0 : 1,
            transform: anim ? `translateX(${dir * 30}px)` : 'translateX(0)',
          }}>
            {/* ── ETAPA 0 ── */}
            {step === 0 && (
              <div className="flex flex-col gap-4">
                {/* Upload de foto */}
                <AvatarUpload preview={avatarPreview} onFile={handleAvatarFile} />

                <Field label="Nome completo" error={erros.nome}>
                  <input type="text" value={form.nome}
                    onChange={e => set('nome', e.target.value)}
                    onFocus={() => setFocused('nome')} onBlur={() => setFocused(null)}
                    placeholder="Ex.: Lucas Ferreira" autoComplete="name"
                    className={baseInput} style={inputStyle(focused === 'nome', erros.nome)} />
                </Field>

                <Field label="E-mail" error={erros.email}>
                  <input type="email" value={form.email}
                    onChange={e => set('email', e.target.value)}
                    onFocus={() => setFocused('email')} onBlur={() => setFocused(null)}
                    placeholder="lucas@empresa.com" autoComplete="email"
                    className={baseInput} style={inputStyle(focused === 'email', erros.email)} />
                </Field>

                <Field label="Telefone" hint="opcional">
                  <input type="tel" value={form.telefone}
                    onChange={e => set('telefone', e.target.value)}
                    onFocus={() => setFocused('tel')} onBlur={() => setFocused(null)}
                    placeholder="(11) 99999-9999"
                    className={baseInput} style={inputStyle(focused === 'tel', false)} />
                </Field>

                <div className="grid grid-cols-2 gap-3">
                  <Field label="Senha" error={erros.senha}>
                    <div className="relative">
                      <input type={showSenha ? 'text' : 'password'}
                        value={form.senha}
                        onChange={e => set('senha', e.target.value)}
                        onFocus={() => setFocused('senha')} onBlur={() => setFocused(null)}
                        placeholder="••••••" autoComplete="new-password"
                        className={`${baseInput} pr-10`} style={inputStyle(focused === 'senha', erros.senha)} />
                      <button type="button" onClick={() => setShowSenha(v => !v)}
                        className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: '#4b5563' }}>
                        {showSenha
                          ? <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                          : <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                        }
                      </button>
                    </div>
                    <PasswordStrength senha={form.senha} />
                  </Field>

                  <Field label="Confirmar" error={erros.confirmarSenha}>
                    <div className="relative">
                      <input type={showConfirmar ? 'text' : 'password'}
                        value={form.confirmarSenha}
                        onChange={e => set('confirmarSenha', e.target.value)}
                        onFocus={() => setFocused('conf')} onBlur={() => setFocused(null)}
                        placeholder="••••••" autoComplete="new-password"
                        className={`${baseInput} pr-10`} style={inputStyle(focused === 'conf', erros.confirmarSenha)} />
                      <button type="button" onClick={() => setShowConfirmar(v => !v)}
                        className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: '#4b5563' }}>
                        {showConfirmar
                          ? <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                          : <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                        }
                      </button>
                    </div>
                  </Field>
                </div>
              </div>
            )}

            {/* ── ETAPA 1 ── */}
            {step === 1 && (
              <div className="flex flex-col gap-4">
                <Field label="Cargo / Função" error={erros.cargo}>
                  <input type="text" value={form.cargo}
                    onChange={e => set('cargo', e.target.value)}
                    onFocus={() => setFocused('cargo')} onBlur={() => setFocused(null)}
                    placeholder="Ex.: Analista de Marketing Digital"
                    className={baseInput} style={inputStyle(focused === 'cargo', erros.cargo)} />
                </Field>

                <Field label="Senioridade">
                  <div className="grid grid-cols-4 gap-1.5">
                    {SENIORIDADE.map(s => (
                      <button key={s.value} type="button" onClick={() => set('senioridade', s.value)}
                        className="flex flex-col items-center py-2.5 px-1 rounded-xl text-center transition-all duration-200"
                        style={{
                          background: form.senioridade === s.value ? 'rgba(91,79,232,0.15)' : 'rgba(255,255,255,0.04)',
                          border: `1.5px solid ${form.senioridade === s.value ? '#5B4FE8' : 'rgba(255,255,255,0.08)'}`,
                        }}>
                        <span className="text-[11px] font-semibold" style={{ color: form.senioridade === s.value ? '#a78bfa' : '#9ca3af' }}>{s.label}</span>
                        <span className="text-[9px] mt-0.5" style={{ color: '#374151' }}>{s.years}</span>
                      </button>
                    ))}
                  </div>
                </Field>

                <Field label="Equipe / Departamento" error={erros.equipe}>
                  <div className="flex flex-wrap gap-1.5">
                    {EQUIPES.map(eq => (
                      <button key={eq} type="button" onClick={() => set('equipe', eq)}
                        className="px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200"
                        style={{
                          background: form.equipe === eq ? 'rgba(91,79,232,0.2)' : 'rgba(255,255,255,0.04)',
                          border: `1px solid ${form.equipe === eq ? '#5B4FE8' : 'rgba(255,255,255,0.08)'}`,
                          color: form.equipe === eq ? '#a78bfa' : '#6b7280',
                        }}>
                        {eq}
                      </button>
                    ))}
                  </div>
                </Field>
              </div>
            )}

            {/* ── ETAPA 2 ── */}
            {step === 2 && (
              <div className="flex flex-col gap-4">
                <Field label="Canais de especialidade" hint="Selecione os que domina">
                  <div className="flex flex-wrap gap-1.5">
                    {CANAIS.map(c => {
                      const sel = form.canais.includes(c)
                      return (
                        <button key={c} type="button" onClick={() => toggleCanal(c)}
                          className="px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200"
                          style={{
                            background: sel ? 'rgba(91,79,232,0.2)' : 'rgba(255,255,255,0.04)',
                            border: `1px solid ${sel ? '#5B4FE8' : 'rgba(255,255,255,0.08)'}`,
                            color: sel ? '#a78bfa' : '#6b7280',
                          }}>
                          {c}
                        </button>
                      )
                    })}
                  </div>
                </Field>

                <Field label="Responsabilidades principais" hint="opcional">
                  <textarea value={form.responsabilidade}
                    onChange={e => set('responsabilidade', e.target.value)}
                    onFocus={() => setFocused('resp')} onBlur={() => setFocused(null)}
                    placeholder="Ex.: Gerenciar campanhas de tráfego pago e relatórios semanais..."
                    rows={2} className="w-full px-4 py-3 rounded-xl text-sm placeholder-gray-600 resize-none"
                    style={inputStyle(focused === 'resp', false)} />
                </Field>

                <Field label="Bio curta" hint="opcional">
                  <textarea value={form.bio}
                    onChange={e => set('bio', e.target.value)}
                    onFocus={() => setFocused('bio')} onBlur={() => setFocused(null)}
                    placeholder="Conte um pouco sobre sua trajetória profissional..."
                    rows={2} className="w-full px-4 py-3 rounded-xl text-sm placeholder-gray-600 resize-none"
                    style={inputStyle(focused === 'bio', false)} />
                </Field>

                <Field label="LinkedIn" hint="opcional">
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-medium" style={{ color: '#4b5563' }}>
                      linkedin.com/in/
                    </span>
                    <input type="text" value={form.linkedin}
                      onChange={e => set('linkedin', e.target.value)}
                      onFocus={() => setFocused('li')} onBlur={() => setFocused(null)}
                      placeholder="seu-perfil"
                      className="w-full pl-[120px] pr-4 py-3 rounded-xl text-sm placeholder-gray-600"
                      style={inputStyle(focused === 'li', false)} />
                  </div>
                </Field>

                {erroGlobal && (
                  <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl text-sm"
                    style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171' }}>
                    <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {erroGlobal}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* ── Ações ── */}
          <div className="flex gap-3 mt-6">
            {step > 0 && (
              <button type="button" onClick={goBack}
                className="flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold transition-all"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#9ca3af' }}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Voltar
              </button>
            )}

            {step < 2 ? (
              <button type="button" onClick={goNext}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold text-white transition-all"
                style={{ background: 'linear-gradient(135deg,#5B4FE8,#7c6ff7)', boxShadow: '0 0 25px rgba(91,79,232,0.3)' }}>
                Continuar
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            ) : (
              <button type="button" onClick={handleSubmit} disabled={loading}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold text-white transition-all disabled:opacity-50"
                style={{ background: loading ? '#3d33c0' : 'linear-gradient(135deg,#5B4FE8,#7c6ff7)', boxShadow: loading ? 'none' : '0 0 25px rgba(91,79,232,0.3)' }}>
                {loading ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Cadastrando...
                  </>
                ) : (
                  <>
                    Criar conta
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </>
                )}
              </button>
            )}
          </div>

          {step === 0 && (
            <p className="text-center text-sm mt-5" style={{ color: '#374151' }}>
              Já tem uma conta?{' '}
              <button type="button" onClick={onGoToLogin}
                className="font-semibold transition-colors hover:text-white"
                style={{ color: '#7c6ff7' }}>
                {isInternalAccess ? 'Voltar para Usuários' : 'Fazer login'}
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
