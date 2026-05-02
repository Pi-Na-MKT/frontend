import React, { useState, useMemo } from 'react'
import {
  LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts'

const PERIODOS = ['7 dias', '30 dias', '3 meses', 'Este ano']
const MEMBROS  = ['Todos', 'Ana Lima', 'Carlos Souza', 'Mariana Costa', 'Pedro Alves']
const EQUIPES  = ['Todas', 'Design', 'Performance', 'Conteúdo', 'SEO']

const desempenhoBase = [
  { sem: 'S1', concluidas: 12, abertas: 5 },
  { sem: 'S2', concluidas: 18, abertas: 3 },
  { sem: 'S3', concluidas: 14, abertas: 7 },
  { sem: 'S4', concluidas: 22, abertas: 2 },
  { sem: 'S5', concluidas: 19, abertas: 4 },
  { sem: 'S6', concluidas: 25, abertas: 1 },
]

const todosMembros = [
  { nome: 'Ana Lima',       cargo: 'Designer',              equipe: 'Design',      concluidas: 34, andamento: 3, atrasadas: 1, taxa: 94,  horas: 128 },
  { nome: 'Carlos Souza',   cargo: 'Analista de Performance', equipe: 'Performance', concluidas: 28, andamento: 5, atrasadas: 2, taxa: 87,  horas: 112 },
  { nome: 'Mariana Costa',  cargo: 'Redatora de Conteúdo',  equipe: 'Conteúdo',    concluidas: 41, andamento: 2, atrasadas: 0, taxa: 98,  horas: 145 },
  { nome: 'Pedro Alves',    cargo: 'Especialista SEO',       equipe: 'SEO',         concluidas: 22, andamento: 6, atrasadas: 3, taxa: 79,  horas: 98  },
]

const categorias = [
  { nome: 'Design',      total: 18, cor: '#5B4FE8' },
  { nome: 'Performance', total: 14, cor: '#38B2AC' },
  { nome: 'Conteúdo',    total: 22, cor: '#68D391' },
  { nome: 'SEO',         total: 10, cor: '#F6AD55' },
]

function KPI({ label, valor, delta, positivo, icon }) {
  return (
    <div className="bg-white rounded-xl p-4 border border-gray-100 flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <div className="p-1.5 bg-primary/10 rounded-lg text-primary">{icon}</div>
        {delta && (
          <span className={`text-xs font-semibold ${positivo ? 'text-green-500' : 'text-red-500'}`}>{delta}</span>
        )}
      </div>
      <p className="text-2xl font-bold text-gray-900 leading-none">{valor}</p>
      <p className="text-xs text-gray-500">{label}</p>
    </div>
  )
}

function Filtro({ label, value, onChange, options }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="text-xs text-gray-400 whitespace-nowrap">{label}:</span>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className="text-xs py-1.5 pl-2 pr-6 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all appearance-none cursor-pointer text-gray-700"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%239ca3af'%3E%3Cpath strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'right 4px center',
          backgroundSize: '12px',
        }}
      >
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  )
}

export default function Dashboard({ empresa, onBack }) {
  const [periodo,  setPeriodo]  = useState('30 dias')
  const [membro,   setMembro]   = useState('Todos')
  const [equipe,   setEquipe]   = useState('Todas')

  const membros = useMemo(() => {
    let lista = todosMembros
    if (membro  !== 'Todos') lista = lista.filter(m => m.nome  === membro)
    if (equipe  !== 'Todas') lista = lista.filter(m => m.equipe === equipe)
    return lista
  }, [membro, equipe])

  const kpis = useMemo(() => {
    const concluidas = membros.reduce((a, m) => a + m.concluidas, 0)
    const andamento  = membros.reduce((a, m) => a + m.andamento,  0)
    const atrasadas  = membros.reduce((a, m) => a + m.atrasadas,  0)
    const taxa = membros.length ? Math.round(membros.reduce((a, m) => a + m.taxa, 0) / membros.length) : 0
    return { concluidas, andamento, atrasadas, taxa }
  }, [membros])

  const maxCat = Math.max(...categorias.map(c => c.total))

  return (
    <div className="h-full flex flex-col overflow-hidden bg-[#F4F5F7]">
      {/* ── Header fixo ── */}
      <div className="flex-shrink-0 bg-white border-b border-gray-100 px-6 py-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          {empresa && (
            <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-bold flex-shrink-0 ${empresa.cor || 'bg-primary'}`}>
              {empresa.inicial || empresa.nome?.[0]}
            </span>
          )}
          <div className="min-w-0">
            <div className="flex items-center gap-1 text-xs text-gray-400">
              <button onClick={onBack} className="hover:text-primary transition-colors truncate">Tarefas</button>
              <svg className="w-3 h-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/>
              </svg>
              <span className="font-semibold text-gray-700 truncate">{empresa?.nome || 'Empresa'}</span>
            </div>
            <h1 className="text-base font-bold text-gray-900">Dashboard de Desempenho</h1>
          </div>
        </div>

        {/* Filtros inline no header */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <Filtro label="Período" value={periodo} onChange={setPeriodo} options={PERIODOS} />
          <Filtro label="Membro"  value={membro}  onChange={v => { setMembro(v); if (v !== 'Todos') setEquipe('Todas') }} options={MEMBROS} />
          <Filtro label="Equipe"  value={equipe}  onChange={v => { setEquipe(v); if (v !== 'Todas') setMembro('Todos') }} options={EQUIPES} />
          <button
            onClick={() => { setPeriodo('30 dias'); setMembro('Todos'); setEquipe('Todas') }}
            className="text-xs text-gray-400 hover:text-gray-600 px-2 py-1 rounded-lg hover:bg-gray-100 transition-colors"
          >
            Limpar
          </button>
          <button onClick={onBack} className="flex items-center gap-1.5 bg-gray-100 text-gray-600 px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-gray-200 transition-colors">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
            </svg>
            Voltar
          </button>
        </div>
      </div>

      {/* ── Corpo fixo, sem scroll ── */}
      <div className="flex-1 overflow-hidden p-4 flex flex-col gap-4 min-h-0">
        {/* KPIs */}
        <div className="grid grid-cols-4 gap-3 flex-shrink-0">
          <KPI label="Concluídas"       valor={kpis.concluidas} delta="+12%" positivo
            icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>}
          />
          <KPI label="Em andamento" valor={kpis.andamento}
            icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>}
          />
          <KPI label="Atrasadas" valor={kpis.atrasadas} delta={kpis.atrasadas > 0 ? '⚠ Atenção' : null} positivo={false}
            icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>}
          />
          <KPI label="Taxa de conclusão" valor={`${kpis.taxa}%`} delta="+3%" positivo
            icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>}
          />
        </div>

        {/* Gráfico + Categorias */}
        <div className="flex gap-3 flex-shrink-0" style={{ height: '180px' }}>
          <div className="flex-1 bg-white rounded-xl border border-gray-100 p-4 min-w-0">
            <p className="text-xs font-semibold text-gray-700 mb-2">Evolução semanal de tarefas</p>
            <ResponsiveContainer width="100%" height={130}>
              <LineChart data={desempenhoBase} margin={{ top: 0, right: 10, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                <XAxis dataKey="sem" tick={{ fontSize: 10, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: '10px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', fontSize: '11px' }} />
                <Legend iconType="circle" iconSize={7} wrapperStyle={{ fontSize: '10px' }}
                  formatter={v => v === 'concluidas' ? 'Concluídas' : 'Abertas'} />
                <Line type="monotone" dataKey="concluidas" stroke="#5B4FE8" strokeWidth={2} dot={{ r: 2 }} />
                <Line type="monotone" dataKey="abertas"    stroke="#f87171" strokeWidth={2} dot={{ r: 2 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="w-52 bg-white rounded-xl border border-gray-100 p-4 flex-shrink-0">
            <p className="text-xs font-semibold text-gray-700 mb-3">Por categoria</p>
            <div className="flex flex-col gap-2.5">
              {categorias.map(c => (
                <div key={c.nome}>
                  <div className="flex justify-between text-[10px] mb-0.5">
                    <span className="text-gray-600">{c.nome}</span>
                    <span className="text-gray-400">{c.total}</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-gray-100">
                    <div className="h-full rounded-full" style={{ width: `${(c.total / maxCat) * 100}%`, background: c.cor }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tabela de membros — ocupa o restante sem scroll externo */}
        <div className="flex-1 bg-white rounded-xl border border-gray-100 overflow-hidden flex flex-col min-h-0">
          <div className="px-5 py-3 border-b border-gray-100 flex-shrink-0">
            <p className="text-xs font-semibold text-gray-700">Desempenho individual</p>
          </div>
          <div className="flex-1 overflow-y-auto">
            {membros.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-8">Nenhum membro com esses filtros.</p>
            ) : (
              <table className="w-full text-sm">
                <thead className="sticky top-0 bg-white">
                  <tr className="border-b border-gray-100">
                    {['Membro', 'Cargo', 'Concluídas', 'Andamento', 'Atrasadas', 'Taxa', 'Horas'].map(h => (
                      <th key={h} className="text-left py-2.5 px-4 text-[10px] font-semibold text-gray-400 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {membros.map((m, i) => (
                    <tr key={i} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors">
                      <td className="py-3 px-4 font-semibold text-gray-900 text-xs">{m.nome}</td>
                      <td className="py-3 px-4 text-gray-500 text-xs">{m.cargo}</td>
                      <td className="py-3 px-4 text-green-600 font-semibold text-xs">{m.concluidas}</td>
                      <td className="py-3 px-4 text-blue-600 text-xs">{m.andamento}</td>
                      <td className="py-3 px-4 text-xs">
                        <span className={m.atrasadas > 0 ? 'text-red-500 font-semibold' : 'text-gray-400'}>{m.atrasadas}</span>
                      </td>
                      <td className="py-3 px-4 text-xs">
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-1.5 rounded-full bg-gray-100">
                            <div className="h-full rounded-full" style={{ width: `${m.taxa}%`, background: m.taxa >= 90 ? '#10b981' : m.taxa >= 75 ? '#f59e0b' : '#ef4444' }} />
                          </div>
                          <span className="text-gray-600">{m.taxa}%</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-gray-500 text-xs">{m.horas}h</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
