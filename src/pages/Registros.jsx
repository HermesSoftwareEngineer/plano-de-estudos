import { useEffect, useMemo, useState } from 'react'
import { ClipboardList, Filter, Pencil, Plus, Save, Trash2, X } from 'lucide-react'
import { supabase } from '../lib/supabaseClient'

const emptyForm = {
  data: '',
  fase_id: '',
  area_id: '',
  conteudo_id: '',
  topico_id: '',
  horas: '',
  observacao: '',
}

function openNativeDatePicker(event) {
  if (typeof event.target.showPicker === 'function') {
    event.target.showPicker()
  }
}

export function Registros() {
  const [registros, setRegistros] = useState([])
  const [fases, setFases] = useState([])
  const [areas, setAreas] = useState([])
  const [conteudos, setConteudos] = useState([])
  const [topicos, setTopicos] = useState([])
  const [form, setForm] = useState(emptyForm)
  const [filters, setFilters] = useState({
    fase_id: '',
    area_id: '',
    conteudo_id: '',
    topico_id: '',
    data_inicio: '',
    data_fim: '',
    texto: '',
  })
  const [editingId, setEditingId] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const fasesMap = useMemo(() => Object.fromEntries(fases.map((item) => [item.id, item.nome])), [fases])
  const areasMap = useMemo(() => Object.fromEntries(areas.map((item) => [item.id, item.nome])), [areas])
  const conteudosMap = useMemo(() => Object.fromEntries(conteudos.map((item) => [item.id, item.nome])), [conteudos])
  const topicosMap = useMemo(() => Object.fromEntries(topicos.map((item) => [item.id, item.nome])), [topicos])

  const filteredConteudos = useMemo(() => {
    if (!form.area_id) return conteudos
    return conteudos.filter((item) => item.area_id === Number(form.area_id))
  }, [conteudos, form.area_id])

  const filteredTopicos = useMemo(() => {
    if (!form.conteudo_id) return topicos
    return topicos.filter((item) => item.conteudo_id === Number(form.conteudo_id))
  }, [topicos, form.conteudo_id])
  const filteredFilterConteudos = useMemo(() => {
    if (!filters.area_id) return conteudos
    return conteudos.filter((item) => item.area_id === Number(filters.area_id))
  }, [conteudos, filters.area_id])
  const filteredFilterTopicos = useMemo(() => {
    if (!filters.conteudo_id) return topicos
    return topicos.filter((item) => item.conteudo_id === Number(filters.conteudo_id))
  }, [topicos, filters.conteudo_id])
  const filteredRegistros = useMemo(() => {
    return registros.filter((registro) => {
      const byFase = !filters.fase_id || registro.fase_id === Number(filters.fase_id)
      const byArea = !filters.area_id || registro.area_id === Number(filters.area_id)
      const byConteudo = !filters.conteudo_id || registro.conteudo_id === Number(filters.conteudo_id)
      const byTopico = !filters.topico_id || registro.topico_id === Number(filters.topico_id)
      const byDataInicio = !filters.data_inicio || registro.data >= filters.data_inicio
      const byDataFim = !filters.data_fim || registro.data <= filters.data_fim
      const text = filters.texto.trim().toLowerCase()
      const byTexto =
        !text ||
        (registro.observacao || '').toLowerCase().includes(text) ||
        (fasesMap[registro.fase_id] || '').toLowerCase().includes(text) ||
        (areasMap[registro.area_id] || '').toLowerCase().includes(text) ||
        (conteudosMap[registro.conteudo_id] || '').toLowerCase().includes(text) ||
        (topicosMap[registro.topico_id] || '').toLowerCase().includes(text)

      return byFase && byArea && byConteudo && byTopico && byDataInicio && byDataFim && byTexto
    })
  }, [registros, filters, fasesMap, areasMap, conteudosMap, topicosMap])

  async function loadData() {
    setLoading(true)
    setError('')

    const [fasesRes, areasRes, conteudosRes, topicosRes, registrosRes] = await Promise.all([
      supabase.from('fases').select('id, nome').order('nome'),
      supabase.from('areas').select('id, nome').order('nome'),
      supabase.from('conteudos').select('id, area_id, nome').order('nome'),
      supabase.from('topicos').select('id, conteudo_id, nome').order('nome'),
      supabase
        .from('registros')
        .select('id, data, fase_id, area_id, conteudo_id, topico_id, horas, observacao')
        .order('data', { ascending: false }),
    ])

    if (fasesRes.error || areasRes.error || conteudosRes.error || topicosRes.error || registrosRes.error) {
      setError(
        fasesRes.error?.message ||
          areasRes.error?.message ||
          conteudosRes.error?.message ||
          topicosRes.error?.message ||
          registrosRes.error?.message ||
          'Erro ao carregar dados',
      )
      setLoading(false)
      return
    }

    setFases(fasesRes.data || [])
    setAreas(areasRes.data || [])
    setConteudos(conteudosRes.data || [])
    setTopicos(topicosRes.data || [])
    setRegistros(registrosRes.data || [])
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

    if (name === 'area_id') {
      setForm((prev) => ({ ...prev, area_id: value, conteudo_id: '', topico_id: '' }))
      return
    }

    if (name === 'conteudo_id') {
      setForm((prev) => ({ ...prev, conteudo_id: value, topico_id: '' }))
      return
    }

    setForm((prev) => ({ ...prev, [name]: value }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setSaving(true)
    setError('')

    const payload = {
      data: form.data,
      fase_id: form.fase_id ? Number(form.fase_id) : null,
      area_id: form.area_id ? Number(form.area_id) : null,
      conteudo_id: form.conteudo_id ? Number(form.conteudo_id) : null,
      topico_id: form.topico_id ? Number(form.topico_id) : null,
      horas: Number(form.horas),
      observacao: form.observacao || null,
    }

    const response = editingId
      ? await supabase.from('registros').update(payload).eq('id', editingId)
      : await supabase.from('registros').insert(payload)

    if (response.error) {
      setError(response.error.message)
      setSaving(false)
      return
    }

    await loadData()
    closeModal()
    setSaving(false)
  }

  function startEdit(registro) {
    setEditingId(registro.id)
    setForm({
      data: registro.data || '',
      fase_id: String(registro.fase_id || ''),
      area_id: String(registro.area_id || ''),
      conteudo_id: String(registro.conteudo_id || ''),
      topico_id: String(registro.topico_id || ''),
      horas: String(registro.horas || ''),
      observacao: registro.observacao || '',
    })
    setIsModalOpen(true)
  }

  async function handleDelete(id) {
    const confirmed = window.confirm('Deseja excluir este registro?')
    if (!confirmed) return

    const { error: deleteError } = await supabase.from('registros').delete().eq('id', id)
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
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">Registros</h1>
          <p className="text-gray-600 dark:text-gray-400">CRUD completo para os registros de estudo</p>
        </div>
        <button
          type="button"
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-4 py-2 rounded-lg transition"
        >
          <Plus size={16} />
          Novo Registro
        </button>
      </div>

      <section className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <Filter size={18} className="text-indigo-500" />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Filtros</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <input
            type="text"
            value={filters.texto}
            onChange={(event) => setFilters((prev) => ({ ...prev, texto: event.target.value }))}
            placeholder="Buscar por texto"
            className="rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 px-3 py-2 text-gray-900 dark:text-white"
          />

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
            onChange={(event) =>
              setFilters((prev) => ({
                ...prev,
                area_id: event.target.value,
                conteudo_id: '',
                topico_id: '',
              }))
            }
            className="rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 px-3 py-2 text-gray-900 dark:text-white"
          >
            <option value="">Todas as áreas</option>
            {areas.map((area) => (
              <option key={area.id} value={area.id}>
                {area.nome}
              </option>
            ))}
          </select>

          <select
            value={filters.conteudo_id}
            onChange={(event) =>
              setFilters((prev) => ({
                ...prev,
                conteudo_id: event.target.value,
                topico_id: '',
              }))
            }
            className="rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 px-3 py-2 text-gray-900 dark:text-white"
          >
            <option value="">Todos os conteúdos</option>
            {filteredFilterConteudos.map((conteudo) => (
              <option key={conteudo.id} value={conteudo.id}>
                {conteudo.nome}
              </option>
            ))}
          </select>

          <select
            value={filters.topico_id}
            onChange={(event) => setFilters((prev) => ({ ...prev, topico_id: event.target.value }))}
            className="rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 px-3 py-2 text-gray-900 dark:text-white"
          >
            <option value="">Todos os tópicos</option>
            {filteredFilterTopicos.map((topico) => (
              <option key={topico.id} value={topico.id}>
                {topico.nome}
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
                  conteudo_id: '',
                  topico_id: '',
                  data_inicio: '',
                  data_fim: '',
                  texto: '',
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
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Lista de Registros</h2>

        {error && (
          <p className="mb-4 rounded-lg bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-900 px-3 py-2 text-red-700 dark:text-red-300">
            {error}
          </p>
        )}

        {loading ? (
          <p className="text-gray-600 dark:text-gray-400">Carregando...</p>
        ) : filteredRegistros.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-400">Nenhum registro cadastrado.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400">
                  <th className="py-2 pr-3">Data</th>
                  <th className="py-2 pr-3">Fase</th>
                  <th className="py-2 pr-3">Área</th>
                  <th className="py-2 pr-3">Conteúdo</th>
                  <th className="py-2 pr-3">Tópico</th>
                  <th className="py-2 pr-3">Horas</th>
                  <th className="py-2 pr-3">Observação</th>
                  <th className="py-2">Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredRegistros.map((registro) => (
                  <tr key={registro.id} className="border-b border-gray-100 dark:border-gray-800/60 text-gray-900 dark:text-gray-100 align-top">
                    <td className="py-2 pr-3">{registro.data}</td>
                    <td className="py-2 pr-3">{fasesMap[registro.fase_id] || '-'}</td>
                    <td className="py-2 pr-3">{areasMap[registro.area_id] || '-'}</td>
                    <td className="py-2 pr-3">{conteudosMap[registro.conteudo_id] || '-'}</td>
                    <td className="py-2 pr-3">{topicosMap[registro.topico_id] || '-'}</td>
                    <td className="py-2 pr-3">{registro.horas}</td>
                    <td className="py-2 pr-3 max-w-xs truncate" title={registro.observacao || ''}>
                      {registro.observacao || '-'}
                    </td>
                    <td className="py-2">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => startEdit(registro)}
                          className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300"
                        >
                          <Pencil size={14} />
                          Editar
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(registro.id)}
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
          <section className="relative w-full max-w-4xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <ClipboardList size={20} className="text-indigo-500" />
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {editingId ? 'Editar Registro' : 'Novo Registro'}
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
              <input
                type="date"
                name="data"
                value={form.data}
                onChange={handleChange}
                onClick={openNativeDatePicker}
                onFocus={openNativeDatePicker}
                required
                className="rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 px-3 py-2 text-gray-900 dark:text-white"
              />

              <select
                name="fase_id"
                value={form.fase_id}
                onChange={handleChange}
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
                className="rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 px-3 py-2 text-gray-900 dark:text-white"
              >
                <option value="">Selecione a área</option>
                {areas.map((area) => (
                  <option key={area.id} value={area.id}>
                    {area.nome}
                  </option>
                ))}
              </select>

              <select
                name="conteudo_id"
                value={form.conteudo_id}
                onChange={handleChange}
                className="rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 px-3 py-2 text-gray-900 dark:text-white"
              >
                <option value="">Selecione o conteúdo</option>
                {filteredConteudos.map((conteudo) => (
                  <option key={conteudo.id} value={conteudo.id}>
                    {conteudo.nome}
                  </option>
                ))}
              </select>

              <select
                name="topico_id"
                value={form.topico_id}
                onChange={handleChange}
                className="rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 px-3 py-2 text-gray-900 dark:text-white"
              >
                <option value="">Selecione o tópico</option>
                {filteredTopicos.map((topico) => (
                  <option key={topico.id} value={topico.id}>
                    {topico.nome}
                  </option>
                ))}
              </select>

              <input
                type="number"
                step="0.5"
                min="0"
                name="horas"
                value={form.horas}
                onChange={handleChange}
                required
                placeholder="Horas"
                className="rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 px-3 py-2 text-gray-900 dark:text-white"
              />

              <textarea
                name="observacao"
                value={form.observacao}
                onChange={handleChange}
                rows={2}
                placeholder="Observação"
                className="md:col-span-2 lg:col-span-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 px-3 py-2 text-gray-900 dark:text-white"
              />

              <div className="flex gap-2 md:col-span-2 lg:col-span-3">
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
