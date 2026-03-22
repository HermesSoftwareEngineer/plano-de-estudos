import { useState } from 'react'
import { seedDatabase } from '../services/seedDatabase'

export function AdminSeed() {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [isSuccess, setIsSuccess] = useState(false)

  const handleSeed = async () => {
    setLoading(true)
    setMessage('Populando banco de dados...')
    setIsSuccess(false)
    
    try {
      await seedDatabase()
      setMessage('✅ Banco de dados populado com sucesso!')
      setIsSuccess(true)
    } catch (error) {
      setMessage(`❌ Erro: ${error.message}`)
      setIsSuccess(false)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
          Admin - Seed Database
        </h1>
        
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6 mb-6">
          <p className="text-blue-800 dark:text-blue-200 text-sm">
            Este script irá popular o banco de dados com todas as tabelas auxiliares (Fases, Áreas, Conteúdos e Tópicos).
          </p>
        </div>

        <button
          onClick={handleSeed}
          disabled={loading}
          className={`w-full py-3 px-6 rounded-lg font-medium transition ${
            loading
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-green-600 hover:bg-green-700 dark:bg-green-600 dark:hover:bg-green-700 text-white'
          }`}
        >
          {loading ? 'Processando...' : 'Executar Seed'}
        </button>

        {message && (
          <div
            className={`mt-6 p-4 rounded-lg ${
              isSuccess
                ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'
                : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
            }`}
          >
            <p
              className={`${
                isSuccess
                  ? 'text-green-800 dark:text-green-200'
                  : 'text-red-800 dark:text-red-200'
              } font-medium`}
            >
              {message}
            </p>
          </div>
        )}

        <div className="mt-8 bg-gray-50 dark:bg-gray-900 rounded-lg p-6 border border-gray-200 dark:border-gray-800">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Informações sobre o Seed
          </h2>
          <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
            <li>✓ Cria tabelas: fases, áreas, conteúdos, tópicos</li>
            <li>✓ Cria tabelas principais: metas, registros</li>
            <li>✓ Popula dados pré-configurados</li>
            <li>✓ Cria índices para melhor performance</li>
            <li>✓ Requer variáveis de ambiente (.env)</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
