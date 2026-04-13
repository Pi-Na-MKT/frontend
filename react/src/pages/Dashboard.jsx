import React from 'react'
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts'
import { dashboardData } from '../data/mockData'

const metricaIcons = {
  campaign: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
    </svg>
  ),
  leads: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
  conversion: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  ),
  roi: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
    </svg>
  ),
}

const MetricaCard = ({ metrica }) => (
  <div className="bg-white rounded-2xl p-5 border border-gray-100">
    <div className="flex items-start justify-between mb-3">
      <div className="p-2 bg-primary-light rounded-xl text-primary">
        {metricaIcons[metrica.icon]}
      </div>
      <span className={`text-xs font-semibold flex items-center gap-1 ${metrica.positivo ? 'text-green-500' : 'text-red-500'}`}>
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d={metrica.positivo ? "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" : "M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"} />
        </svg>
        {metrica.variacao}
      </span>
    </div>
    <p className="text-2xl font-bold text-gray-900">{metrica.valor}</p>
    <p className="text-xs text-gray-500 mt-1">{metrica.label}</p>
  </div>
)

const Dashboard = ({ empresa, onBack }) => {
  return (
    <div className="p-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-4">
        <button onClick={onBack} className="hover:text-primary transition-colors">Tarefas</button>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
        <span className="font-semibold text-gray-900">Dashboard</span>
      </nav>

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-gray-900">Dashboard de Marketing — {empresa?.nome || 'Loja Aurora'}</h1>
        <button
          onClick={onBack}
          className="flex items-center gap-2 bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-xl font-semibold text-sm hover:bg-gray-50 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Voltar para Tarefas
        </button>
      </div>

      {/* Metricas */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {dashboardData.metricas.map((m, i) => (
          <MetricaCard key={i} metrica={m} />
        ))}
      </div>

      {/* Charts row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
        <div className="lg:col-span-2 bg-white rounded-2xl p-5 border border-gray-100">
          <h3 className="font-semibold text-gray-800 mb-4">Desempenho de Campanhas</h3>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={dashboardData.desempenho} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
              <XAxis dataKey="mes" tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '12px', paddingTop: '12px' }}
                formatter={(value) => value === 'impressoes' ? 'Impressões' : 'Cliques'} />
              <Line type="monotone" dataKey="impressoes" name="impressoes" stroke="#5B4FE8" strokeWidth={2} dot={{ r: 3, fill: '#5B4FE8' }} />
              <Line type="monotone" dataKey="cliques" name="cliques" stroke="#38B2AC" strokeWidth={2} dot={{ r: 3, fill: '#38B2AC' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-gray-100">
          <h3 className="font-semibold text-gray-800 mb-4">Leads por Canal</h3>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={dashboardData.leadsPorCanal} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={2} dataKey="value">
                {dashboardData.leadsPorCanal.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} formatter={(value, name) => [`${value}%`, name]} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap gap-x-3 gap-y-1 mt-2">
            {dashboardData.leadsPorCanal.map((item, i) => (
              <div key={i} className="flex items-center gap-1.5 text-xs text-gray-600">
                <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }}></span>
                {item.name} {item.value}%
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Charts row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-white rounded-2xl p-5 border border-gray-100">
          <h3 className="font-semibold text-gray-800 mb-4">ROI por Campanha (%)</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={dashboardData.roiPorCampanha} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
              <XAxis dataKey="campanha" tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} formatter={(value) => [`${value}%`, 'ROI']} />
              <Bar dataKey="roi" fill="#5B4FE8" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-gray-100">
          <h3 className="font-semibold text-gray-800 mb-4">Atividades Recentes</h3>
          <div className="flex flex-col gap-4">
            {dashboardData.atividades.map((atividade, i) => (
              <div key={i} className="flex gap-3">
                <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${atividade.cor}`}></div>
                <div>
                  <p className="text-sm text-gray-700 leading-snug">{atividade.descricao}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{atividade.tempo}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
