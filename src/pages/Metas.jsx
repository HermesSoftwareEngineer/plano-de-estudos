import { useEffect, useMemo, useState } from 'react'
import { Filter, Pencil, Plus, Save, Target, Trash2, X } from 'lucide-react'
import { supabase } from '../lib/supabaseClient'

const emptyForm = {
  fase_id: '',
  area_id: '',
  horas_meta_semana: '',
  data_inicio: '',
  data_fim: '',
}

function openNativeDatePicker(event) {
  if (typeof event.target.showPicker === 'function') {
    event.target.showPicker()
  }
}

export function Metas() {
  const [metas, setMetas] = useState([])
  const [fases, setFases] = useState([])
  const [areas, setAreas] = useState([])
  const [form, setForm] = useState(emptyForm)
  const [filters, setFilters] = useState({
    fase_id: '',
    area_id: '',
    data_inicio: '',
    data_fim: '',
  })
  const [editingId, setEditingId] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const fasesMap = useMemo(
    () => Object.fromEntries(fases.map((fase) => [fase.id, fase.nome])),
    [fases],
  )
  const areasMap = useMemo(
    () => Object.fromEntries(areas.map((area) => [area.id, area.nome])),
    [areas],
  )
  const filteredMetas = useMemo(() => {
    return metas.filter((meta) => {
      const byFase = !filters.fase_id || meta.fase_id === Number(filters.fase_id)
      const byArea = !filters.area_id || meta.area_id === Number(filters.area_id)
      const byDataInicio = !filters.data_inicio || meta.data_inicio >= filters.data_inicio
      const byDataFim = !filters.data_fim || meta.data_fim <= filters.data_fim
      return byFase && byArea && byDataInicio && byDataFim
    })
  }, [metas, filters])

  async function loadData() {
    setLoading(true)
    setError('')

    const [fasesRes, areasRes, metasRes] = await Promise.all([
      supabase.from('fases').select('id, nome').order('nome'),
      supabase.from('areas').select('id, nome').order('nome'),
      supabase
        .from('metas')
        .select('id, fase_id, area_id, horas_meta_semana, data_inicio, data_fim')
        .order('data_inicio', { ascending: false }),
    ])

    if (fasesRes.error || areasRes.error || metasRes.error) {
      setError(
        fasesRes.error?.message || areasRes.error?.message || metasRes.error?.message || 'Erro ao carregar dados',
      )
      setLoading(false)
      return
    }

    setFases(fasesRes.data || [])
    setAreas(areasRes.data || [])
    setMetas(metasRes.data || [])
    setLoading(false)
  }

  useEffect(() => {
    loadData()
  }, [])

  function resetForm() {
    setForm(emptyForm)
    setEditingId(null)
  }

  function closeModal() {
    resetForm()
    setIsModalOpen(false)
  }

  function openCreateModal() {
    resetForm()
    setIsModalOpen(true)
  }

  function handleChange(event) {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setSaving(true)
    setError('')

    const payload = {
      fase_id: Number(form.fase_id),
      area_id: Number(form.area_id),
      horas_meta_semana: Number(form.horas_meta_semana),
      data_inicio: form.data_inicio,
      data_fim: form.data_fim,
    }

    const response = editingId
      ? await supabase.from('metas').update(payload).eq('id', editingId)
      : await supabase.from('metas').insert(payload)

    if (response.error) {
      setError(response.error.message)
      setSaving(false)
      return
    }

    await loadData()
    closeModal()
    setSaving(false)
  }

  function startEdit(meta) {
    setEditingId(meta.id)
    setForm({
      fase_id: String(meta.fase_id || ''),
      area_id: String(meta.area_id || ''),
      horas_meta_semana: String(meta.horas_meta_semana || ''),
      data_inicio: meta.data_inicio || '',
      data_fim: meta.data_fim || '',
    })
    setIsModalOpen(true)
  }

  async function handleDelete(id) {
    const confirmed = window.confirm('Deseja excluir esta meta?')
    if (!confirmed) return

    const { error: deleteError } = await supabase.from('metas').delete().eq('id', id)
    if (deleteError) {
      setError(deleteError.message)
      return
    }
    await loadData()
  }

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">Metas</h1>
          <p className="text-gray-600 dark:text-gray-400">CRUD completo para metas semanais de estudo</p>
        </div>
        <button
          type="button"
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-4 py-2 rounded-lg transition"
        >
          <Plus size={16} />
          Nova Meta
        </button>
      </div>

      <section className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <Filter size={18} className="text-indigo-500" />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Filtros</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <select
            value={filters.fase_id}
            onChange={(event) => setFilters((prev) => ({ ...prev, fase_id: event.target.value }))}
            className="rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 px-3 py-2 text-gray-900 dark:text-white"
          >
            <option value="">Todas as fases</option>
            {fases.map((fase) => (
              <option key={fase.id} value={fase.id}>
                {fase.nome}
              </option>
            ))}
          </select>

          <select
            value={filters.area_id}
            onChange={(event) => setFilters((prev) => ({ ...prev, area_id: event.target.value }))}
            className="rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 px-3 py-2 text-gray-900 dark:text-white"
          >
            <option value="">Todas as áreas</option>
            {areas.map((area) => (
              <option key={area.id} value={area.id}>
                {area.nome}
              </option>
            ))}
          </select>

          <input
            type="date"
            value={filters.data_inicio}
            onChange={(event) => setFilters((prev) => ({ ...prev, data_inicio: event.target.value }))}
            className="rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 px-3 py-2 text-gray-900 dark:text-white"
          />

          <input
            type="date"
            value={filters.data_fim}
            onChange={(event) => setFilters((prev) => ({ ...prev, data_fim: event.target.value }))}
            className="rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 px-3 py-2 text-gray-900 dark:text-white"
          />

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() =>
                setFilters({
                  fase_id: '',
                  area_id: '',
                  data_inicio: '',
                  data_fim: '',
                })
              }
              className="inline-flex items-center gap-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-900 dark:text-white font-medium px-4 py-2 rounded-lg transition"
            >
              Limpar
            </button>
          </div>
        </div>
      </section>

      <section className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Lista de Metas</h2>

        {error && (
          <p className="mb-4 rounded-lg bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-900 px-3 py-2 text-red-700 dark:text-red-300">
            {error}
          </p>
        )}

        {loading ? (
          <p className="text-gray-600 dark:text-gray-400">Carregando...</p>
        ) : filteredMetas.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-400">Nenhuma meta cadastrada.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400">
                  <th className="py-2 pr-3">Fase</th>
                  <th className="py-2 pr-3">Área</th>
                  <th className="py-2 pr-3">Horas/Semana</th>
                  <th className="py-2 pr-3">Início</th>
                  <th className="py-2 pr-3">Fim</th>
                  <th className="py-2">Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredMetas.map((meta) => (
                  <tr key={meta.id} className="border-b border-gray-100 dark:border-gray-800/60 text-gray-900 dark:text-gray-100">
                    <td className="py-2 pr-3">{fasesMap[meta.fase_id] || '-'}</td>
                    <td className="py-2 pr-3">{areasMap[meta.area_id] || '-'}</td>
                    <td className="py-2 pr-3">{meta.horas_meta_semana}</td>
                    <td className="py-2 pr-3">{meta.data_inicio}</td>
                    <td className="py-2 pr-3">{meta.data_fim}</td>
                    <td className="py-2">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => startEdit(meta)}
                          className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300"
                        >
                          <Pencil size={14} />
                          Editar
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(meta.id)}
                          className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300"
                        >
                          <Trash2 size={14} />
                          Excluir
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={closeModal} />
          <section className="relative w-full max-w-3xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Target size={20} className="text-indigo-500" />
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {editingId ? 'Editar Meta' : 'Nova Meta'}
                </h2>
              </div>
              <button
                type="button"
                onClick={closeModal}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <X size={16} className="text-gray-700 dark:text-gray-300" />
              </button>
            </div>

            <form className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" onSubmit={handleSubmit}>
              <select
                name="fase_id"
                value={form.fase_id}
                onChange={handleChange}
                required
                className="rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 px-3 py-2 text-gray-900 dark:text-white"
              >
                <option value="">Selecione a fase</option>
                {fases.map((fase) => (
                  <option key={fase.id} value={fase.id}>
                    {fase.nome}
                  </option>
                ))}
              </select>

              <select
                name="area_id"
                value={form.area_id}
                onChange={handleChange}
                required
                className="rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 px-3 py-2 text-gray-900 dark:text-white"
              >
                <option value="">Selecione a área</option>
                {areas.map((area) => (
                  <option key={area.id} value={area.id}>
                    {area.nome}
                  </option>
                ))}
              </select>

              <input
                type="number"
                step="0.5"
                min="0"
                name="horas_meta_semana"
                value={form.horas_meta_semana}
                onChange={handleChange}
                required
                placeholder="Horas meta/semana"
                className="rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 px-3 py-2 text-gray-900 dark:text-white"
              />

              <input
                type="date"
                name="data_inicio"
                value={form.data_inicio}
                onChange={handleChange}
                onClick={openNativeDatePicker}
                onFocus={openNativeDatePicker}
                required
                className="rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 px-3 py-2 text-gray-900 dark:text-white"
              />

              <input
                type="date"
                name="data_fim"
                value={form.data_fim}
                onChange={handleChange}
                onClick={openNativeDatePicker}
                onFocus={openNativeDatePicker}
                required
                className="rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 px-3 py-2 text-gray-900 dark:text-white"
              />

              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-medium px-4 py-2 rounded-lg transition"
                >
                  {editingId ? <Save size={16} /> : <Plus size={16} />}
                  {editingId ? 'Salvar' : 'Criar'}
                </button>
                <button
                  type="button"
                  onClick={closeModal}
                  className="inline-flex items-center gap-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-900 dark:text-white font-medium px-4 py-2 rounded-lg transition"
                >
                  <X size={16} />
                  Cancelar
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </div>
  )
}
