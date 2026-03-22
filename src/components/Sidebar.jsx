import { Link, useLocation } from 'react-router-dom'
import {
  Menu,
  X,
  Sun,
  Moon,
  LogOut,
  LayoutDashboard,
  Target,
  ClipboardList,
  Database,
} from 'lucide-react'
import { useTheme } from '../contexts/ThemeContext'

export function Sidebar({ isOpen, onToggle }) {
  const location = useLocation()
  const { isDark, toggleTheme } = useTheme()

  const menuItems = [
    { path: '/visao-geral', label: 'Visão Geral', icon: LayoutDashboard },
    { path: '/metas', label: 'Metas', icon: Target },
    { path: '/registros', label: 'Registros', icon: ClipboardList },
    { path: '/tabelas-auxiliares', label: 'Tabelas Auxiliares', icon: Database },
  ]

  const isActive = (path) => location.pathname === path

  return (
    <aside
      className={`${
        isOpen ? 'w-64' : 'w-20'
      } bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transition-all duration-300 ease-in-out flex flex-col h-screen fixed left-0 top-0 z-40`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
        {isOpen && (
          <h1 className="text-xl font-bold text-indigo-600 dark:text-indigo-400">
            Plano
          </h1>
        )}
        <button
          onClick={onToggle}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition"
          title={isOpen ? 'Recolher' : 'Expandir'}
        >
          {isOpen ? (
            <X size={20} className="text-gray-600 dark:text-gray-300" />
          ) : (
            <Menu size={20} className="text-gray-600 dark:text-gray-300" />
          )}
        </button>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg transition ${
              isActive(item.path)
                ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
            title={!isOpen ? item.label : ''}
          >
            <item.icon size={20} className="shrink-0" />
            {isOpen && <span className="font-medium">{item.label}</span>}
          </Link>
        ))}
      </nav>

      {/* Footer */}
      <div className="border-t border-gray-200 dark:border-gray-800 p-4 space-y-2">
        <button
          onClick={toggleTheme}
          className="w-full flex items-center gap-3 px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition"
          title={isDark ? 'Modo Claro' : 'Modo Escuro'}
        >
          {isDark ? (
            <Sun size={20} className="text-yellow-500" />
          ) : (
            <Moon size={20} className="text-gray-600" />
          )}
          {isOpen && (
            <span className="font-medium">
              {isDark ? 'Claro' : 'Escuro'}
            </span>
          )}
        </button>

        <button
          onClick={() => {}}
          className="w-full flex items-center gap-3 px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition"
        >
          <LogOut size={20} />
          {isOpen && <span className="font-medium">Sair</span>}
        </button>
      </div>
    </aside>
  )
}
