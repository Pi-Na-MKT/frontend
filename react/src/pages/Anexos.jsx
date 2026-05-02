import React, { useState, useRef } from 'react'
import { empresas } from '../data/mockData'

const TIPOS = {
  pdf:   { label: 'PDF',    bg: 'bg-red-50',     text: 'text-red-600',     border: 'border-red-100',     icon: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
  )},
  image: { label: 'Imagem', bg: 'bg-blue-50',    text: 'text-blue-600',    border: 'border-blue-100',    icon: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
  )},
  doc:   { label: 'DOC',    bg: 'bg-indigo-50',  text: 'text-indigo-600',  border: 'border-indigo-100',  icon: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
  )},
  xls:   { label: 'XLSX',   bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-100', icon: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
  )},
  other: { label: 'Arquivo', bg: 'bg-gray-50',   text: 'text-gray-500',   border: 'border-gray-100',    icon: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"/></svg>
  )},
}

function tipoArquivo(nome) {
  const ext = nome.split('.').pop().toLowerCase()
  if (ext === 'pdf') return 'pdf'
  if (['jpg','jpeg','png','gif','webp','svg'].includes(ext)) return 'image'
  if (['doc','docx'].includes(ext)) return 'doc'
  if (['xls','xlsx','csv'].includes(ext)) return 'xls'
  return 'other'
}

function formatBytes(bytes) {
  if (!bytes) return '—'
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / 1048576).toFixed(1) + ' MB'
}

function formatDate(d) {
  if (!d) return '—'
  const [y, m, day] = d.split('-')
  return `${day}/${m}/${y}`
}

const anexosMock = {
  1: [
    { id: 1, nome: 'Contrato_Aurora_2026.pdf',  tamanho: 204800,  data: '2026-03-10', autor: 'Ana Lima' },
    { id: 2, nome: 'Logo_Aurora.png',            tamanho: 512000,  data: '2026-02-15', autor: 'Carlos Souza' },
    { id: 3, nome: 'Briefing_Q2.docx',           tamanho: 92160,   data: '2026-04-01', autor: 'Mariana Costa' },
  ],
  2: [
    { id: 4, nome: 'Relatorio_Clinica.xlsx',     tamanho: 358400,  data: '2026-04-20', autor: 'Pedro Alves' },
    { id: 5, nome: 'Foto_Clinica.jpg',           tamanho: 1048576, data: '2026-03-28', autor: 'Ana Lima' },
  ],
  3: [
    { id: 6, nome: 'TechNova_Planejamento.pdf',  tamanho: 819200,  data: '2026-04-15', autor: 'Carlos Souza' },
  ],
  4: [], 5: [], 6: [],
}

// ── Painel de arquivos de uma empresa (accordion body) ──────────────────────
function EmpresaPanel({ empresa, anexos, onUpload, uploading, uploadingId, dragOverId, setDragOverId, onDelete, fileInputRef, isUploading }) {
  const lista = anexos[empresa.id] || []
  const isActive = uploading && uploadingId === empresa.id
  const isDrag = dragOverId === empresa.id

  return (
    <div className="px-5 pb-5 pt-2">
      {/* Drop zone compacta */}
      <div
        onDragOver={e => { e.preventDefault(); setDragOverId(empresa.id) }}
        onDragLeave={() => setDragOverId(null)}
        onDrop={e => { e.preventDefault(); setDragOverId(null); onUpload(empresa.id, e.dataTransfer.files) }}
        onClick={() => { fileInputRef.current.dataset.empresa = empresa.id; fileInputRef.current.click() }}
        className={`flex items-center gap-3 px-4 py-3 rounded-xl border-2 border-dashed cursor-pointer transition-all mb-4 ${
          isDrag ? 'drag-active' : 'border-gray-200 hover:border-primary/40 hover:bg-primary/[0.02]'
        }`}
      >
        {isActive ? (
          <>
            <svg className="w-4 h-4 text-primary animate-spin flex-shrink-0" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
            </svg>
            <span className="text-sm text-primary font-medium">Enviando arquivos...</span>
          </>
        ) : (
          <>
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${isDrag ? 'bg-primary text-white' : 'bg-gray-100 text-gray-400'}`}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/>
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-600">
                Arraste ou <span className="text-primary">clique para anexar</span>
              </p>
              <p className="text-xs text-gray-400">PDF, imagens, DOC, XLSX</p>
            </div>
          </>
        )}
      </div>

      {/* Lista de arquivos */}
      {lista.length === 0 ? (
        <div className="text-center py-8">
          <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-2">
            <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"/>
            </svg>
          </div>
          <p className="text-xs text-gray-400 font-medium">Nenhum arquivo anexado ainda</p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {lista.map((a, i) => {
            const t = tipoArquivo(a.nome)
            const cfg = TIPOS[t]
            return (
              <div key={a.id}
                className={`flex items-center gap-3 p-3 rounded-xl border transition-all group hover:shadow-sm animate-fade-up ${cfg.bg} ${cfg.border}`}
                style={{ animationDelay: `${i * 30}ms` }}>
                {/* Ícone tipo */}
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 bg-white border ${cfg.border} ${cfg.text}`}>
                  {cfg.icon}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-semibold truncate ${cfg.text}`}>{a.nome}</p>
                  <p className="text-[11px] text-gray-400 mt-0.5">
                    {formatBytes(a.tamanho)} · {formatDate(a.data)} · {a.autor}
                  </p>
                </div>

                {/* Ações */}
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className={`p-1.5 rounded-lg hover:bg-white/80 transition-colors ${cfg.text}`} title="Baixar">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
                    </svg>
                  </button>
                  <button onClick={() => onDelete(empresa.id, a.id)}
                    className="p-1.5 rounded-lg text-red-400 hover:bg-red-50 hover:text-red-600 transition-colors" title="Excluir">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                    </svg>
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

// ── Componente principal ─────────────────────────────────────────────────────
export default function Anexos() {
  const [anexos, setAnexos]         = useState(anexosMock)
  const [abertos, setAbertos]       = useState({ 1: true })   // só a 1ª empresa aberta por padrão
  const [uploading, setUploading]   = useState(false)
  const [uploadingId, setUploadingId] = useState(null)
  const [dragOverId, setDragOverId] = useState(null)
  const [confirmDel, setConfirmDel] = useState(null)
  const fileInputRef = useRef(null)

  const toggleEmpresa = (id) =>
    setAbertos(prev => ({ ...prev, [id]: !prev[id] }))

  const handleUpload = (empresaId, files) => {
    if (!files || files.length === 0) return
    setUploading(true)
    setUploadingId(empresaId)
    // Garante accordion aberto ao fazer upload
    setAbertos(prev => ({ ...prev, [empresaId]: true }))
    setTimeout(() => {
      const novos = Array.from(files).map((f, i) => ({
        id: Date.now() + i,
        nome: f.name,
        tamanho: f.size,
        data: new Date().toISOString().slice(0, 10),
        autor: 'Você',
      }))
      setAnexos(prev => ({ ...prev, [empresaId]: [...(prev[empresaId] || []), ...novos] }))
      setUploading(false)
      setUploadingId(null)
    }, 900)
  }

  const handleDelete = (empresaId, anexoId) => {
    setAnexos(prev => ({ ...prev, [empresaId]: prev[empresaId].filter(a => a.id !== anexoId) }))
    setConfirmDel(null)
  }

  const totalAnexos = Object.values(anexos).reduce((s, arr) => s + arr.length, 0)
  const empresasComAnexos = empresas.filter(e => (anexos[e.id] || []).length > 0).length

  return (
    <div className="p-6 lg:p-8 max-w-5xl mx-auto animate-fade-up">

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <p className="section-title mb-1">Documentos</p>
          <h1 className="page-header">Anexos</h1>
          <p className="page-sub">Arquivos e documentos organizados por empresa</p>
        </div>
        <div className="flex gap-3">
          <div className="bg-violet-50 border border-violet-100 rounded-xl px-4 py-2.5 text-center">
            <p className="text-lg font-bold text-violet-600 leading-none">{totalAnexos}</p>
            <p className="text-[10px] font-semibold text-violet-400 mt-0.5 uppercase tracking-wide">Arquivos</p>
          </div>
          <div className="bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-2.5 text-center">
            <p className="text-lg font-bold text-emerald-600 leading-none">{empresasComAnexos}</p>
            <p className="text-[10px] font-semibold text-emerald-400 mt-0.5 uppercase tracking-wide">Empresas</p>
          </div>
        </div>
      </div>

      {/* ── Acordeão de empresas ── */}
      <div className="flex flex-col gap-3">
        {empresas.map((emp, idx) => {
          const count  = (anexos[emp.id] || []).length
          const isOpen = !!abertos[emp.id]

          return (
            <div
              key={emp.id}
              className={`bg-white rounded-2xl border transition-all duration-200 overflow-hidden animate-fade-up ${
                isOpen ? 'border-primary/20 shadow-sm' : 'border-gray-100'
              }`}
              style={{ animationDelay: `${idx * 50}ms` }}
            >
              {/* Cabeçalho da empresa — clique para expandir */}
              <button
                onClick={() => toggleEmpresa(emp.id)}
                className="w-full flex items-center gap-4 px-5 py-4 text-left group hover:bg-gray-50/50 transition-colors"
              >
                {/* Avatar empresa */}
                <div className={`w-10 h-10 rounded-xl ${emp.cor} flex items-center justify-center text-white text-sm font-bold flex-shrink-0 shadow-sm`}>
                  {emp.inicial}
                </div>

                {/* Nome + contagem */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-gray-900 truncate">{emp.nome}</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {count === 0 ? 'Nenhum arquivo' : `${count} arquivo${count !== 1 ? 's' : ''}`}
                  </p>
                </div>

                {/* Badge count */}
                {count > 0 && (
                  <span className={`badge mr-2 ${isOpen ? 'bg-primary/10 text-primary ring-1 ring-primary/20' : 'bg-gray-100 text-gray-500 ring-1 ring-gray-200/60'}`}>
                    {count}
                  </span>
                )}

                {/* Upload rápido (sem abrir accordion) */}
                <div
                  onClick={e => {
                    e.stopPropagation()
                    fileInputRef.current.dataset.empresa = emp.id
                    fileInputRef.current.click()
                    setAbertos(prev => ({ ...prev, [emp.id]: true }))
                  }}
                  className="w-7 h-7 rounded-lg border border-gray-200 flex items-center justify-center text-gray-400 hover:border-primary/40 hover:text-primary hover:bg-primary/5 transition-all mr-1"
                  title="Anexar arquivo"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/>
                  </svg>
                </div>

                {/* Chevron */}
                <div className={`w-5 h-5 text-gray-400 flex-shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/>
                  </svg>
                </div>
              </button>

              {/* Conteúdo expandível */}
              {isOpen && (
                <div className="border-t border-gray-100">
                  <EmpresaPanel
                    empresa={emp}
                    anexos={anexos}
                    onUpload={handleUpload}
                    uploading={uploading}
                    uploadingId={uploadingId}
                    dragOverId={dragOverId}
                    setDragOverId={setDragOverId}
                    onDelete={(eId, aId) => setConfirmDel({ empresaId: eId, anexoId: aId })}
                    fileInputRef={fileInputRef}
                  />
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Input file oculto compartilhado */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        className="hidden"
        onChange={e => {
          const empId = Number(fileInputRef.current.dataset.empresa)
          handleUpload(empId, e.target.files)
          e.target.value = ''
        }}
      />

      {/* Modal confirmar exclusão */}
      {confirmDel && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl animate-scale-in">
            <div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
              </svg>
            </div>
            <h3 className="text-base font-bold text-gray-900 text-center mb-1">Excluir anexo?</h3>
            <p className="text-sm text-gray-500 text-center mb-5">Esta ação não pode ser desfeita.</p>
            <div className="flex gap-3">
              <button onClick={() => setConfirmDel(null)} className="btn-ghost flex-1 justify-center">Cancelar</button>
              <button onClick={() => handleDelete(confirmDel.empresaId, confirmDel.anexoId)}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white bg-red-500 hover:bg-red-600 transition-colors">
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
