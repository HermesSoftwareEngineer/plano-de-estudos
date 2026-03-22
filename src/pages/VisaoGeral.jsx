import { useEffect, useMemo, useState } from 'react'
import {
  Area,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ComposedChart,
  Legend,
  Line,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { supabase } from '../lib/supabaseClient'

const PHASES = ['Fase 1', 'Fase 2', 'Fase 3', 'Imobiliário']
const PHASE_COLORS = {
  'Fase 1': '#10b981',
  'Fase 2': '#3b82f6',
  'Fase 3': '#f59e0b',
  Imobiliário: '#14b8a6',
}
const PIE_COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#14b8a6', '#8b5cf6', '#ec4899', '#06b6d4']

function formatHours(value) {
  return `${Number(value || 0).toFixed(1)}h`
}

function isMetaActiveInMonth(meta, year, month) {
  const start = new Date(meta.data_inicio)
  const end = new Date(meta.data_fim)
  const monthStart = new Date(year, month, 1)
  const monthEnd = new Date(year, month + 1, 0)
  return start <= monthEnd && end >= monthStart
}

function overlaps(startA, endA, startB, endB) {
  return startA <= endB && endA >= startB
}

function buildMonthWeekBuckets(year, month) {
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  return Array.from({ length: 4 }, (_, idx) => {
    const startDay = Math.floor((idx * daysInMonth) / 4) + 1
    const endDay = idx === 3 ? daysInMonth : Math.floor(((idx + 1) * daysInMonth) / 4)
    return {
      semana: `Sem ${idx + 1}`,
      start: new Date(year, month, startDay),
      end: new Date(year, month, endDay),
      startDay,
      endDay,
    }
  })
}

export function VisaoGeral() {
  const today = new Date()
  const [month, setMonth] = useState(today.getMonth())
  const [year, setYear] = useState(today.getFullYear())
  const [phase, setPhase] = useState('Todas')
  const [selectedArea, setSelectedArea] = useState('')

  const [records, setRecords] = useState([])
  const [metas, setMetas] = useState([])
  const [fasesMap, setFasesMap] = useState({})
  const [areasMap, setAreasMap] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadData() {
      setLoading(true)
      setError('')

      const [registrosRes, metasRes, fasesRes, areasRes] = await Promise.all([
        supabase.from('registros').select('id, data, fase_id, area_id, horas, observacao').order('data', { ascending: true }),
        supabase.from('metas').select('id, fase_id, area_id, horas_meta_semana, data_inicio, data_fim'),
        supabase.from('fases').select('id, nome'),
        supabase.from('areas').select('id, nome'),
      ])

      if (registrosRes.error || metasRes.error || fasesRes.error || areasRes.error) {
        setError(
          registrosRes.error?.message || metasRes.error?.message || fasesRes.error?.message || areasRes.error?.message || 'Erro ao carregar dados do dashboard',
        )
        setLoading(false)
        return
      }

      const fasesLookup = Object.fromEntries((fasesRes.data || []).map((item) => [item.id, item.nome]))
      const areasLookup = Object.fromEntries((areasRes.data || []).map((item) => [item.id, item.nome]))

      setFasesMap(fasesLookup)
      setAreasMap(areasLookup)

      const normalizedRecords = (registrosRes.data || []).map((item) => ({
        ...item,
        fase: fasesLookup[item.fase_id] || '-',
        area: areasLookup[item.area_id] || '-',
      }))

      const normalizedMetas = (metasRes.data || []).map((item) => ({
        ...item,
        fase: fasesLookup[item.fase_id] || '-',
        area: areasLookup[item.area_id] || '-',
      }))

      setRecords(normalizedRecords)
      setMetas(normalizedMetas)
      setLoading(false)
    }

    loadData()
  }, [])

  const years = useMemo(() => {
    const values = new Set()

    records.forEach((item) => values.add(new Date(item.data).getFullYear()))
    metas.forEach((item) => {
      values.add(new Date(item.data_inicio).getFullYear())
      values.add(new Date(item.data_fim).getFullYear())
    })

    values.add(today.getFullYear())
    return [...values].sort((a, b) => a - b)
  }, [records, metas, today])

  const monthRecords = useMemo(() => {
    return records.filter((item) => {
      const d = new Date(item.data)
      const inMonth = d.getFullYear() === year && d.getMonth() === month
      const inPhase = phase === 'Todas' || item.fase === phase
      return inMonth && inPhase
    })
  }, [records, year, month, phase])

  const activeMetas = useMemo(() => {
    return metas.filter((meta) => {
      const inPhase = phase === 'Todas' || meta.fase === phase
      return inPhase && isMetaActiveInMonth(meta, year, month)
    })
  }, [metas, phase, year, month])

  const hasAnyData = records.length > 0 || metas.length > 0
  const daysInMonth = useMemo(() => new Date(year, month + 1, 0).getDate(), [year, month])
  const weekBuckets = useMemo(() => buildMonthWeekBuckets(year, month), [year, month])
  const totalHours = Number(monthRecords.reduce((sum, item) => sum + Number(item.horas || 0), 0).toFixed(1))
  const daysStudied = new Set(monthRecords.map((item) => item.data)).size

  const weeklyChartData = useMemo(() => {
    const base = weekBuckets.map((bucket) => ({ ...bucket, meta: 0, realizado: 0 }))

    monthRecords.forEach((item) => {
      const d = new Date(item.data)
      const idx = base.findIndex((bucket) => d >= bucket.start && d <= bucket.end)
      if (idx < 0) return
      base[idx].realizado += Number(item.horas || 0)
    })

    activeMetas.forEach((meta) => {
      const metaStart = new Date(meta.data_inicio)
      const metaEnd = new Date(meta.data_fim)

      base.forEach((bucket) => {
        if (overlaps(metaStart, metaEnd, bucket.start, bucket.end)) {
          bucket.meta += Number(meta.horas_meta_semana || 0)
        }
      })
    })

    return base.map((item) => ({
      semana: item.semana,
      startDay: item.startDay,
      endDay: item.endDay,
      meta: Number(item.meta.toFixed(1)),
      realizado: Number(item.realizado.toFixed(1)),
      gap: Number((item.realizado - item.meta).toFixed(1)),
    }))
  }, [monthRecords, activeMetas, weekBuckets])

  const monthMetaTotal = useMemo(
    () => Number(weeklyChartData.reduce((sum, row) => sum + row.meta, 0).toFixed(1)),
    [weeklyChartData],
  )
  const achievement = monthMetaTotal > 0 ? (totalHours / monthMetaTotal) * 100 : 0

  const percentColorClass =
    achievement >= 100
      ? 'text-emerald-600 dark:text-emerald-400'
      : achievement >= 75
        ? 'text-amber-600 dark:text-amber-400'
        : 'text-red-600 dark:text-red-400'

  const areaPerformance = useMemo(() => {
    const realizedByArea = {}
    monthRecords.forEach((item) => {
      if (!item.area || item.area === '-') return
      realizedByArea[item.area] = (realizedByArea[item.area] || 0) + Number(item.horas || 0)
    })

    const metaByArea = {}
    activeMetas.forEach((meta) => {
      if (!meta.area || meta.area === '-') return
      const metaStart = new Date(meta.data_inicio)
      const metaEnd = new Date(meta.data_fim)

      weekBuckets.forEach((bucket) => {
        if (overlaps(metaStart, metaEnd, bucket.start, bucket.end)) {
          metaByArea[meta.area] = (metaByArea[meta.area] || 0) + Number(meta.horas_meta_semana || 0)
        }
      })
    })

    const allAreas = new Set([...Object.keys(realizedByArea), ...Object.keys(metaByArea)])

    return [...allAreas]
      .map((area) => {
        const realizado = Number((realizedByArea[area] || 0).toFixed(1))
        const meta = Number((metaByArea[area] || 0).toFixed(1))
        const gap = Number((realizado - meta).toFixed(1))
        const percentual = meta > 0 ? (realizado / meta) * 100 : 0
        return { area, realizado, meta, gap, percentual }
      })
      .sort((a, b) => a.gap - b.gap)
  }, [monthRecords, activeMetas, weekBuckets])

  const areaChartData = useMemo(() => {
    if (!selectedArea) return areaPerformance
    return areaPerformance.filter((item) => item.area === selectedArea)
  }, [areaPerformance, selectedArea])

  const pieData = useMemo(() => {
    const total = areaPerformance.reduce((sum, item) => sum + item.realizado, 0)
    return areaPerformance.map((item) => ({
      ...item,
      percentual: total > 0 ? (item.realizado / total) * 100 : 0,
    }))
  }, [areaPerformance])

  const cumulativeYearData = useMemo(() => {
    const monthLabels = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']
    let accMeta = 0
    let accReal = 0
    const phaseMetas = metas.filter((meta) => phase === 'Todas' || meta.fase === phase)

    return monthLabels.map((label, idx) => {
      const monthReal = records
        .filter((item) => {
          const d = new Date(item.data)
          return d.getFullYear() === year && d.getMonth() === idx && (phase === 'Todas' || item.fase === phase)
        })
        .reduce((sum, item) => sum + Number(item.horas || 0), 0)

      const monthMeta = phaseMetas
        .filter((meta) => isMetaActiveInMonth(meta, year, idx))
        .reduce((sum, meta) => {
          const metaStart = new Date(meta.data_inicio)
          const metaEnd = new Date(meta.data_fim)
          const monthBuckets = buildMonthWeekBuckets(year, idx)
          const monthMetaValue = monthBuckets.reduce(
            (inner, bucket) =>
              overlaps(metaStart, metaEnd, bucket.start, bucket.end)
                ? inner + Number(meta.horas_meta_semana || 0)
                : inner,
            0,
          )
          return sum + monthMetaValue
        }, 0)

      accMeta += monthMeta

      const isFutureOfCurrentDate = year === today.getFullYear() && idx > today.getMonth()
      if (!isFutureOfCurrentDate) {
        accReal += monthReal
      }

      return {
        mes: label,
        meta: Number(accMeta.toFixed(1)),
        realizado: isFutureOfCurrentDate ? null : Number(accReal.toFixed(1)),
        saldo: isFutureOfCurrentDate ? null : Number((accReal - accMeta).toFixed(1)),
      }
    })
  }, [records, metas, year, phase, today])

  const phaseProgress = useMemo(() => {
    const elapsedRatio =
      year < today.getFullYear() || (year === today.getFullYear() && month < today.getMonth())
        ? 1
        : year > today.getFullYear() || (year === today.getFullYear() && month > today.getMonth())
          ? 0
          : today.getDate() / daysInMonth

    return PHASES.map((currentPhase) => {
      const planned = activeMetas
        .filter((meta) => meta.fase === currentPhase)
        .reduce((sum, meta) => {
          const metaStart = new Date(meta.data_inicio)
          const metaEnd = new Date(meta.data_fim)
          const inMonthMeta = weekBuckets.reduce(
            (inner, bucket) =>
              overlaps(metaStart, metaEnd, bucket.start, bucket.end)
                ? inner + Number(meta.horas_meta_semana || 0)
                : inner,
            0,
          )
          return sum + inMonthMeta
        }, 0)
      const completed = monthRecords
        .filter((item) => item.fase === currentPhase)
        .reduce((sum, item) => sum + Number(item.horas || 0), 0)

      const totalPrevisto = Number(planned.toFixed(1))
      const concluidoRaw = Number(completed.toFixed(1))
      const concluido = Math.min(concluidoRaw, totalPrevisto)
      const projectedFinal = elapsedRatio > 0 ? concluidoRaw / elapsedRatio : 0
      const projectedCapped = Math.min(totalPrevisto, Math.max(concluido, projectedFinal))
      const projetado = Number(Math.max(0, projectedCapped - concluido).toFixed(1))
      const restante = Number(Math.max(0, totalPrevisto - concluido - projetado).toFixed(1))
      const percentual = totalPrevisto > 0 ? (concluidoRaw / totalPrevisto) * 100 : 0

      return {
        fase: currentPhase,
        totalPrevisto,
        concluido: Number(concluido.toFixed(1)),
        projetado,
        restante,
        percentual,
      }
    })
  }, [activeMetas, monthRecords, daysInMonth, month, year, today, weekBuckets])

  const monthlyTitle = new Date(year, month, 1).toLocaleString('pt-BR', { month: 'long', year: 'numeric' })

  if (loading) {
    return (
      <div className="p-8">
        <p className="text-gray-600 dark:text-gray-400">Carregando dashboard...</p>
      </div>
    )
  }

  return (
    <div className="p-6 md:p-8 space-y-6">
      <div>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">Visão Geral</h1>
        <p className="text-gray-600 dark:text-gray-400">Dashboard mensal consolidado em {monthlyTitle}</p>
      </div>

      {error && (
        <p className="rounded-lg bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-900 px-3 py-2 text-red-700 dark:text-red-300">
          {error}
        </p>
      )}

      {!hasAnyData && (
        <p className="rounded-lg bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-900 px-3 py-2 text-amber-700 dark:text-amber-300">
          Não há registros nem metas cadastrados ainda. O dashboard mostrará gráficos reais assim que você adicionar dados nas páginas de Metas e Registros.
        </p>
      )}

      <section className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4 md:p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <select
            value={month}
            onChange={(event) => {
              setMonth(Number(event.target.value))
              setSelectedArea('')
            }}
            className="rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 px-3 py-2 text-gray-900 dark:text-white"
          >
            {Array.from({ length: 12 }).map((_, idx) => (
              <option key={idx} value={idx}>
                {new Date(2000, idx, 1).toLocaleString('pt-BR', { month: 'long' })}
              </option>
            ))}
          </select>

          <select
            value={year}
            onChange={(event) => {
              setYear(Number(event.target.value))
              setSelectedArea('')
            }}
            className="rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 px-3 py-2 text-gray-900 dark:text-white"
          >
            {years.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>

          <select
            value={phase}
            onChange={(event) => {
              setPhase(event.target.value)
              setSelectedArea('')
            }}
            className="rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 px-3 py-2 text-gray-900 dark:text-white"
          >
            <option value="Todas">Todas as fases</option>
            {PHASES.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <article className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-5">
          <p className="text-sm text-gray-500 dark:text-gray-400">Total de horas no mês</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{formatHours(totalHours)}</p>
        </article>

        <article className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-5">
          <p className="text-sm text-gray-500 dark:text-gray-400">Meta total do mês</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{formatHours(monthMetaTotal)}</p>
        </article>

        <article className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-5">
          <p className="text-sm text-gray-500 dark:text-gray-400">Atingimento da meta</p>
          <p className={`text-3xl font-bold mt-2 ${percentColorClass}`}>{achievement.toFixed(1)}%</p>
        </article>

        <article className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-5">
          <p className="text-sm text-gray-500 dark:text-gray-400">Dias estudados no mês</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{daysStudied}</p>
        </article>
      </section>

      <section className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <article className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4 md:p-6">
          <h2 className="font-semibold text-gray-900 dark:text-white mb-4">Horas reais vs meta por semana</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#94a3b833" />
                <XAxis dataKey="semana" />
                <YAxis />
                <Tooltip
                  formatter={(value) => [formatHours(value), '']}
                  labelFormatter={(label, payload) => {
                    const row = payload?.[0]?.payload
                    if (!row) return label
                    return `${label} | Diferença: ${row.gap >= 0 ? '+' : ''}${formatHours(row.gap)}`
                  }}
                />
                <Legend />
                <Bar dataKey="meta" name="Meta" fill="#94a3b8" radius={[4, 4, 0, 0]} />
                <Bar dataKey="realizado" name="Realizado" radius={[4, 4, 0, 0]}>
                  {weeklyChartData.map((item) => (
                    <Cell key={item.semana} fill={item.realizado >= item.meta ? '#10b981' : '#f59e0b'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </article>

        <article className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4 md:p-6">
          <div className="flex items-center justify-between gap-3 mb-4">
            <h2 className="font-semibold text-gray-900 dark:text-white">Realizado vs meta por área</h2>
            {selectedArea && (
              <button
                type="button"
                onClick={() => setSelectedArea('')}
                className="text-sm px-3 py-1 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
              >
                Limpar área
              </button>
            )}
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={areaChartData} layout="vertical" margin={{ left: 24 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#94a3b833" />
                <XAxis type="number" />
                <YAxis type="category" dataKey="area" width={150} />
                <Tooltip
                  formatter={(value) => [formatHours(value), '']}
                  labelFormatter={(label, payload) => {
                    const row = payload?.[0]?.payload
                    if (!row) return label
                    return `${label} | ${row.percentual.toFixed(1)}% da meta`
                  }}
                />
                <Legend />
                <Bar dataKey="meta" name="Meta" fill="#cbd5e1" radius={[0, 4, 4, 0]} />
                <Bar dataKey="realizado" name="Realizado" radius={[0, 4, 4, 0]}>
                  {areaChartData.map((item) => (
                    <Cell key={item.area} fill={item.realizado >= item.meta ? '#10b981' : '#f59e0b'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </article>
      </section>

      <section className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <article className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4 md:p-6">
          <h2 className="font-semibold text-gray-900 dark:text-white mb-4">Distribuição percentual do tempo</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="realizado"
                  nameKey="area"
                  innerRadius={70}
                  outerRadius={110}
                  onClick={(item) => setSelectedArea((prev) => (prev === item.area ? '' : item.area))}
                >
                  {pieData.map((item, index) => (
                    <Cell
                      key={item.area}
                      fill={PIE_COLORS[index % PIE_COLORS.length]}
                      stroke={selectedArea === item.area ? '#111827' : '#ffffff'}
                      strokeWidth={selectedArea === item.area ? 3 : 1}
                    />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [formatHours(value), 'Horas']} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
            {pieData.map((item, index) => (
              <button
                key={item.area}
                type="button"
                onClick={() => setSelectedArea((prev) => (prev === item.area ? '' : item.area))}
                className={`text-left rounded-lg px-3 py-2 border ${
                  selectedArea === item.area
                    ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30'
                    : 'border-gray-200 dark:border-gray-800'
                }`}
              >
                <span className="inline-flex items-center gap-2 text-gray-700 dark:text-gray-300">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ background: PIE_COLORS[index % PIE_COLORS.length] }} />
                  {item.area}
                </span>
                <span className="block text-gray-500 dark:text-gray-400">
                  {formatHours(item.realizado)} ({item.percentual.toFixed(1)}%)
                </span>
              </button>
            ))}
          </div>
        </article>

        <article className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4 md:p-6">
          <h2 className="font-semibold text-gray-900 dark:text-white mb-4">Horas acumuladas no ano</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={cumulativeYearData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#94a3b833" />
                <XAxis dataKey="mes" />
                <YAxis />
                <Tooltip
                  formatter={(value) => [value == null ? '-' : formatHours(value), '']}
                  labelFormatter={(label, payload) => {
                    const row = payload?.[0]?.payload
                    if (!row || row.saldo == null) return label
                    const signal = row.saldo >= 0 ? '+' : ''
                    return `${label} | Saldo: ${signal}${formatHours(row.saldo)}`
                  }}
                />
                <Legend />
                <Area type="monotone" dataKey="realizado" name="Realizado acumulado" fill="#3b82f633" stroke="#3b82f6" strokeWidth={2} />
                <Line type="monotone" dataKey="meta" name="Meta acumulada" stroke="#94a3b8" strokeDasharray="6 4" strokeWidth={2} dot={false} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </article>
      </section>

      <section className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4 md:p-6">
        <h2 className="font-semibold text-gray-900 dark:text-white mb-4">Progresso por fase</h2>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={phaseProgress}>
              <CartesianGrid strokeDasharray="3 3" stroke="#94a3b833" />
              <XAxis dataKey="fase" />
              <YAxis />
              <Tooltip
                formatter={(value) => [formatHours(value), '']}
                labelFormatter={(label, payload) => {
                  const row = payload?.[0]?.payload
                  if (!row) return label
                  return `${label} | ${row.percentual.toFixed(1)}% concluído`
                }}
              />
              <Legend />
              <Bar stackId="phase" dataKey="concluido" name="Concluído">
                {phaseProgress.map((row) => (
                  <Cell key={`${row.fase}-c`} fill={PHASE_COLORS[row.fase]} />
                ))}
              </Bar>
              <Bar stackId="phase" dataKey="projetado" name="Projetado">
                {phaseProgress.map((row) => (
                  <Cell key={`${row.fase}-p`} fill={`${PHASE_COLORS[row.fase]}88`} />
                ))}
              </Bar>
              <Bar stackId="phase" dataKey="restante" name="Restante" fill="#cbd5e1" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>
    </div>
  )
}
