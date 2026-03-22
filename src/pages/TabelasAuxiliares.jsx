import { useEffect, useState } from 'react'
import { BookOpen, Layers, Network, Pencil, Plus, Save, Trash2, X } from 'lucide-react'
import { supabase } from '../lib/supabaseClient'

const emptyFase = { nome: '' }
const emptyArea = { nome: '', fase_id: '' }
const emptyConteudo = { nome: '', area_id: '' }
const emptyTopico = { nome: '', conteudo_id: '' }

function toNullableInt(value) {
  return value === '' ? null : Number(value)
}

export function TabelasAuxiliares() {
  const [fases, setFases] = useState([])
  const [areas, setAreas] = useState([])
  const [conteudos, setConteudos] = useState([])
  const [topicos, setTopicos] = useState([])

  const [faseForm, setFaseForm] = useState(emptyFase)
  const [areaForm, setAreaForm] = useState(emptyArea)
  const [conteudoForm, setConteudoForm] = useState(emptyConteudo)
  const [topicoForm, setTopicoForm] = useState(emptyTopico)

  const [editingFaseId, setEditingFaseId] = useState(null)
  const [editingAreaId, setEditingAreaId] = useState(null)
  const [editingConteudoId, setEditingConteudoId] = useState(null)
  const [editingTopicoId, setEditingTopicoId] = useState(null)

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  async function loadData() {
    setLoading(true)
    setError('')

    const [fasesRes, areasRes, conteudosRes, topicosRes] = await Promise.all([
      supabase.from('fases').select('id, nome').order('nome'),
      supabase.from('areas').select('id, nome, fase_id').order('nome'),
      supabase.from('conteudos').select('id, nome, area_id').order('nome'),
      supabase.from('topicos').select('id, nome, conteudo_id').order('nome'),
    ])

    if (fasesRes.error || areasRes.error || conteudosRes.error || topicosRes.error) {
      setError(
        fasesRes.error?.message ||
          areasRes.error?.message ||
          conteudosRes.error?.message ||
          topicosRes.error?.message ||
          'Erro ao carregar tabelas auxiliares',
      )
      setLoading(false)
      return
    }

    setFases(fasesRes.data || [])
    setAreas(areasRes.data || [])
    setConteudos(conteudosRes.data || [])
    setTopicos(topicosRes.data || [])
    setLoading(false)
  }

  useEffect(() => {
    loadData()
  }, [])

  function faseNomeById(id) {
    return fases.find((item) => item.id === id)?.nome || '-'
  }

  function areaNomeById(id) {
    return areas.find((item) => item.id === id)?.nome || '-'
  }

  function conteudoNomeById(id) {
    return conteudos.find((item) => item.id === id)?.nome || '-'
  }

  async function handleSaveFase(event) {
    event.preventDefault()
    setSaving(true)
    setError('')

    const payload = { nome: faseForm.nome.trim() }

    const res = editingFaseId
      ? await supabase.from('fases').update(payload).eq('id', editingFaseId)
      : await supabase.from('fases').insert(payload)

    if (res.error) {
      setError(res.error.message)
      setSaving(false)
      return
    }

    setFaseForm(emptyFase)
    setEditingFaseId(null)
    await loadData()
    setSaving(false)
  }

  async function handleDeleteFase(id) {
    if (!window.confirm('Excluir esta fase?')) return
    const { error: deleteError } = await supabase.from('fases').delete().eq('id', id)
    if (deleteError) {
      setError(deleteError.message)
      return
    }
    await loadData()
  }

  async function handleSaveArea(event) {
    event.preventDefault()
    setSaving(true)
    setError('')

    const payload = {
      nome: areaForm.nome.trim(),
      fase_id: toNullableInt(areaForm.fase_id),
    }

    const res = editingAreaId
      ? await supabase.from('areas').update(payload).eq('id', editingAreaId)
      : await supabase.from('areas').insert(payload)

    if (res.error) {
      setError(res.error.message)
      setSaving(false)
      return
    }

    setAreaForm(emptyArea)
    setEditingAreaId(null)
    await loadData()
    setSaving(false)
  }

  async function handleDeleteArea(id) {
    if (!window.confirm('Excluir esta área?')) return
    const { error: deleteError } = await supabase.from('areas').delete().eq('id', id)
    if (deleteError) {
      setError(deleteError.message)
      return
    }
    await loadData()
  }

  async function handleSaveConteudo(event) {
    event.preventDefault()
    setSaving(true)
    setError('')

    const payload = {
      nome: conteudoForm.nome.trim(),
      area_id: toNullableInt(conteudoForm.area_id),
    }

    const res = editingConteudoId
      ? await supabase.from('conteudos').update(payload).eq('id', editingConteudoId)
      : await supabase.from('conteudos').insert(payload)

    if (res.error) {
      setError(res.error.message)
      setSaving(false)
      return
    }

    setConteudoForm(emptyConteudo)
    setEditingConteudoId(null)
    await loadData()
    setSaving(false)
  }

  async function handleDeleteConteudo(id) {
    if (!window.confirm('Excluir este conteúdo?')) return
    const { error: deleteError } = await supabase.from('conteudos').delete().eq('id', id)
    if (deleteError) {
      setError(deleteError.message)
      return
    }
    await loadData()
  }

  async function handleSaveTopico(event) {
    event.preventDefault()
    setSaving(true)
    setError('')

    const payload = {
      nome: topicoForm.nome.trim(),
      conteudo_id: toNullableInt(topicoForm.conteudo_id),
    }

    const res = editingTopicoId
      ? await supabase.from('topicos').update(payload).eq('id', editingTopicoId)
      : await supabase.from('topicos').insert(payload)

    if (res.error) {
      setError(res.error.message)
      setSaving(false)
      return
    }

    setTopicoForm(emptyTopico)
    setEditingTopicoId(null)
    await loadData()
    setSaving(false)
  }

  async function handleDeleteTopico(id) {
    if (!window.confirm('Excluir este tópico?')) return
    const { error: deleteError } = await supabase.from('topicos').delete().eq('id', id)
    if (deleteError) {
      setError(deleteError.message)
      return
    }
    await loadData()
  }

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">Tabelas Auxiliares</h1>
        <p className="text-gray-600 dark:text-gray-400">CRUD completo de fases, áreas, conteúdos e tópicos</p>
      </div>

      {error && (
        <p className="rounded-lg bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-900 px-3 py-2 text-red-700 dark:text-red-300">
          {error}
        </p>
      )}

      {loading ? (
        <p className="text-gray-600 dark:text-gray-400">Carregando...</p>
      ) : (
        <>
          <section className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6 space-y-4">
            <div className="flex items-center gap-2">
              <Layers size={20} className="text-indigo-500" />
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Fases</h2>
            </div>

            <form className="flex flex-col md:flex-row gap-3" onSubmit={handleSaveFase}>
              <input
                type="text"
                value={faseForm.nome}
                onChange={(event) => setFaseForm({ nome: event.target.value })}
                required
                placeholder="Nome da fase"
                className="flex-1 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 px-3 py-2 text-gray-900 dark:text-white"
              />
              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white px-4 py-2 rounded-lg"
                >
                  {editingFaseId ? <Save size={16} /> : <Plus size={16} />}
                  {editingFaseId ? 'Salvar' : 'Criar'}
                </button>
                {editingFaseId && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingFaseId(null)
                      setFaseForm(emptyFase)
                    }}
                    className="inline-flex items-center gap-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-900 dark:text-white px-4 py-2 rounded-lg"
                  >
                    <X size={16} />
                    Cancelar
                  </button>
                )}
              </div>
            </form>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400">
                    <th className="py-2 pr-3">Nome</th>
                    <th className="py-2">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {fases.map((fase) => (
                    <tr key={fase.id} className="border-b border-gray-100 dark:border-gray-800/60">
                      <td className="py-2 pr-3 text-gray-900 dark:text-gray-100">{fase.nome}</td>
                      <td className="py-2">
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              setEditingFaseId(fase.id)
                              setFaseForm({ nome: fase.nome })
                            }}
                            className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300"
                          >
                            <Pencil size={14} />
                            Editar
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteFase(fase.id)}
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
          </section>

          <section className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6 space-y-4">
            <div className="flex items-center gap-2">
              <BookOpen size={20} className="text-indigo-500" />
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Áreas</h2>
            </div>

            <form className="grid grid-cols-1 md:grid-cols-3 gap-3" onSubmit={handleSaveArea}>
              <input
                type="text"
                value={areaForm.nome}
                onChange={(event) => setAreaForm((prev) => ({ ...prev, nome: event.target.value }))}
                required
                placeholder="Nome da área"
                className="rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 px-3 py-2 text-gray-900 dark:text-white"
              />
              <select
                value={areaForm.fase_id}
                onChange={(event) => setAreaForm((prev) => ({ ...prev, fase_id: event.target.value }))}
                className="rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 px-3 py-2 text-gray-900 dark:text-white"
              >
                <option value="">Sem fase</option>
                {fases.map((fase) => (
                  <option key={fase.id} value={fase.id}>
                    {fase.nome}
                  </option>
                ))}
              </select>
              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white px-4 py-2 rounded-lg"
                >
                  {editingAreaId ? <Save size={16} /> : <Plus size={16} />}
                  {editingAreaId ? 'Salvar' : 'Criar'}
                </button>
                {editingAreaId && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingAreaId(null)
                      setAreaForm(emptyArea)
                    }}
                    className="inline-flex items-center gap-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-900 dark:text-white px-4 py-2 rounded-lg"
                  >
                    <X size={16} />
                    Cancelar
                  </button>
                )}
              </div>
            </form>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400">
                    <th className="py-2 pr-3">Nome</th>
                    <th className="py-2 pr-3">Fase</th>
                    <th className="py-2">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {areas.map((area) => (
                    <tr key={area.id} className="border-b border-gray-100 dark:border-gray-800/60">
                      <td className="py-2 pr-3 text-gray-900 dark:text-gray-100">{area.nome}</td>
                      <td className="py-2 pr-3 text-gray-900 dark:text-gray-100">{faseNomeById(area.fase_id)}</td>
                      <td className="py-2">
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              setEditingAreaId(area.id)
                              setAreaForm({
                                nome: area.nome,
                                fase_id: area.fase_id ? String(area.fase_id) : '',
                              })
                            }}
                            className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300"
                          >
                            <Pencil size={14} />
                            Editar
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteArea(area.id)}
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
          </section>

          <section className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6 space-y-4">
            <div className="flex items-center gap-2">
              <Network size={20} className="text-indigo-500" />
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Conteúdos</h2>
            </div>

            <form className="grid grid-cols-1 md:grid-cols-3 gap-3" onSubmit={handleSaveConteudo}>
              <input
                type="text"
                value={conteudoForm.nome}
                onChange={(event) => setConteudoForm((prev) => ({ ...prev, nome: event.target.value }))}
                required
                placeholder="Nome do conteúdo"
                className="rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 px-3 py-2 text-gray-900 dark:text-white"
              />
              <select
                value={conteudoForm.area_id}
                onChange={(event) => setConteudoForm((prev) => ({ ...prev, area_id: event.target.value }))}
                className="rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 px-3 py-2 text-gray-900 dark:text-white"
              >
                <option value="">Sem área</option>
                {areas.map((area) => (
                  <option key={area.id} value={area.id}>
                    {area.nome}
                  </option>
                ))}
              </select>
              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white px-4 py-2 rounded-lg"
                >
                  {editingConteudoId ? <Save size={16} /> : <Plus size={16} />}
                  {editingConteudoId ? 'Salvar' : 'Criar'}
                </button>
                {editingConteudoId && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingConteudoId(null)
                      setConteudoForm(emptyConteudo)
                    }}
                    className="inline-flex items-center gap-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-900 dark:text-white px-4 py-2 rounded-lg"
                  >
                    <X size={16} />
                    Cancelar
                  </button>
                )}
              </div>
            </form>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400">
                    <th className="py-2 pr-3">Nome</th>
                    <th className="py-2 pr-3">Área</th>
                    <th className="py-2">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {conteudos.map((conteudo) => (
                    <tr key={conteudo.id} className="border-b border-gray-100 dark:border-gray-800/60">
                      <td className="py-2 pr-3 text-gray-900 dark:text-gray-100">{conteudo.nome}</td>
                      <td className="py-2 pr-3 text-gray-900 dark:text-gray-100">{areaNomeById(conteudo.area_id)}</td>
                      <td className="py-2">
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              setEditingConteudoId(conteudo.id)
                              setConteudoForm({
                                nome: conteudo.nome,
                                area_id: conteudo.area_id ? String(conteudo.area_id) : '',
                              })
                            }}
                            className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300"
                          >
                            <Pencil size={14} />
                            Editar
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteConteudo(conteudo.id)}
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
          </section>

          <section className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6 space-y-4">
            <div className="flex items-center gap-2">
              <Network size={20} className="text-indigo-500" />
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Tópicos</h2>
            </div>

            <form className="grid grid-cols-1 md:grid-cols-3 gap-3" onSubmit={handleSaveTopico}>
              <input
                type="text"
                value={topicoForm.nome}
                onChange={(event) => setTopicoForm((prev) => ({ ...prev, nome: event.target.value }))}
                required
                placeholder="Nome do tópico"
                className="rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 px-3 py-2 text-gray-900 dark:text-white"
              />
              <select
                value={topicoForm.conteudo_id}
                onChange={(event) => setTopicoForm((prev) => ({ ...prev, conteudo_id: event.target.value }))}
                className="rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 px-3 py-2 text-gray-900 dark:text-white"
              >
                <option value="">Sem conteúdo</option>
                {conteudos.map((conteudo) => (
                  <option key={conteudo.id} value={conteudo.id}>
                    {conteudo.nome}
                  </option>
                ))}
              </select>
              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white px-4 py-2 rounded-lg"
                >
                  {editingTopicoId ? <Save size={16} /> : <Plus size={16} />}
                  {editingTopicoId ? 'Salvar' : 'Criar'}
                </button>
                {editingTopicoId && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingTopicoId(null)
                      setTopicoForm(emptyTopico)
                    }}
                    className="inline-flex items-center gap-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-900 dark:text-white px-4 py-2 rounded-lg"
                  >
                    <X size={16} />
                    Cancelar
                  </button>
                )}
              </div>
            </form>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400">
                    <th className="py-2 pr-3">Nome</th>
                    <th className="py-2 pr-3">Conteúdo</th>
                    <th className="py-2">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {topicos.map((topico) => (
                    <tr key={topico.id} className="border-b border-gray-100 dark:border-gray-800/60">
                      <td className="py-2 pr-3 text-gray-900 dark:text-gray-100">{topico.nome}</td>
                      <td className="py-2 pr-3 text-gray-900 dark:text-gray-100">{conteudoNomeById(topico.conteudo_id)}</td>
                      <td className="py-2">
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              setEditingTopicoId(topico.id)
                              setTopicoForm({
                                nome: topico.nome,
                                conteudo_id: topico.conteudo_id ? String(topico.conteudo_id) : '',
                              })
                            }}
                            className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300"
                          >
                            <Pencil size={14} />
                            Editar
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteTopico(topico.id)}
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
          </section>
        </>
      )}
    </div>
  )
}
