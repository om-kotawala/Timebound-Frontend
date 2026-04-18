import React from 'react'
import { Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null

  return (
    <div className="px-3 py-2 rounded-xl text-xs" style={{ background: 'rgb(var(--surface-card))', border: '1px solid rgb(var(--volt-300) / 0.15)' }}>
      <div className="text-ink-400 mb-1">{label}</div>
      <div className="text-volt-300 font-semibold">{payload[0].value}%</div>
    </div>
  )
}

const EmptyChartState = ({ message }) => (
  <div className="h-[200px] flex items-center justify-center text-sm text-ink-500">
    {message}
  </div>
)

const ProgressCharts = ({ weeklyData, monthlyData }) => (
  <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
    <div className="card">
      <h3 className="text-sm font-display font-bold text-ink-200 uppercase tracking-widest mb-6">
        Weekly Overview
      </h3>
      {weeklyData.length === 0 ? (
        <EmptyChartState message="No live weekly progress yet." />
      ) : (
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={weeklyData} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="weekGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="rgb(var(--volt-300))" stopOpacity={0.25} />
                <stop offset="95%" stopColor="rgb(var(--volt-300))" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgb(var(--volt-300) / 0.05)" />
            <XAxis dataKey="name" tick={{ fill: 'rgb(var(--ink-400))', fontSize: 11, fontFamily: 'Inter, sans-serif' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: 'rgb(var(--ink-400))', fontSize: 11 }} axisLine={false} tickLine={false} domain={[0, 100]} tickFormatter={(value) => `${value}%`} />
            <Tooltip content={<CustomTooltip />} />
            <Area type="linear" dataKey="pct" stroke="rgb(var(--volt-300))" strokeWidth={2} fill="url(#weekGrad)" dot={{ fill: 'rgb(var(--volt-300))', r: 3, strokeWidth: 0 }} activeDot={{ r: 5, fill: 'rgb(var(--volt-300))' }} />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </div>

    <div className="card">
      <h3 className="text-sm font-display font-bold text-ink-200 uppercase tracking-widest mb-6">
        Monthly Breakdown
      </h3>
      {monthlyData.length === 0 ? (
        <EmptyChartState message="No live monthly progress yet." />
      ) : (
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={monthlyData} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgb(var(--volt-300) / 0.05)" vertical={false} />
            <XAxis dataKey="name" tick={{ fill: 'rgb(var(--ink-400))', fontSize: 11, fontFamily: 'Inter, sans-serif' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: 'rgb(var(--ink-400))', fontSize: 11 }} axisLine={false} tickLine={false} domain={[0, 100]} tickFormatter={(value) => `${value}%`} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="pct" fill="rgb(var(--volt-300) / 0.7)" radius={[6, 6, 0, 0]} maxBarSize={32} style={{ filter: 'drop-shadow(0 0 6px rgb(var(--volt-300) / 0.3))' }} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  </div>
)

export default ProgressCharts
