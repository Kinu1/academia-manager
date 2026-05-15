import { Dumbbell, LayoutDashboard, LogOut, Receipt, Route, Users, WalletCards } from 'lucide-react'
import { useEffect } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'

import { Badge } from '../../shared/ui/badge'
import { useAuth } from '../../features/auth/hooks/use-auth'
import { SESSION_EXPIRED_EVENT } from '../../features/auth/model/auth-events'
import {
  canManageStudents,
  canManageTrainings,
  canViewOwnPayments,
  canViewPayments,
  getRoleLabel,
} from '../../shared/lib/permissions'
import { useToast } from '../../shared/ui/toast-context'

const navItems = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/students', label: 'Alunos', icon: Users },
  { to: '/plans', label: 'Planos', icon: WalletCards },
  { to: '/trainings', label: 'Treinos', icon: Route },
  { to: '/payments', label: 'Pagamentos', icon: Receipt },
]

export function ProtectedLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const { showToast } = useToast()
  const visibleNavItems = navItems.filter((item) => {
    if (item.to === '/') return user?.role !== 'Student'
    if (item.to === '/students') return canManageStudents(user?.role)
    if (item.to === '/trainings') return canManageTrainings(user?.role)
    if (item.to === '/payments') return canViewPayments(user?.role) || canViewOwnPayments(user?.role)
    return true
  })

  useEffect(() => {
    function handleSessionExpired() {
      logout()
      showToast({
        title: 'Sessão expirada.',
        description: 'Entre novamente para continuar.',
        tone: 'danger',
      })
      navigate('/login')
    }

    window.addEventListener(SESSION_EXPIRED_EVENT, handleSessionExpired)

    return () => window.removeEventListener(SESSION_EXPIRED_EVENT, handleSessionExpired)
  }, [logout, navigate, showToast])

  return (
    <div className="min-h-screen bg-slate-100">
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-slate-800 bg-slate-950 px-4 py-5 lg:block">
        <div className="flex items-center gap-2 text-white">
          <span className="flex h-9 w-9 items-center justify-center rounded-md bg-red-600 text-white">
            <Dumbbell size={19} />
          </span>
          <div>
            <p className="text-sm font-semibold">Academia Manager</p>
            <p className="text-xs text-slate-400">Painel operacional</p>
          </div>
        </div>

        <nav className="mt-8 space-y-1" aria-label="Navegação principal">
          {visibleNavItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium ${
                  isActive ? 'bg-red-600 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`
              }
            >
              <item.icon size={18} />
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-10 flex min-h-16 items-center justify-between border-b border-slate-200 bg-white px-4 lg:px-8">
          <div>
            <p className="text-sm font-semibold text-slate-950">{user?.name}</p>
            <p className="text-xs text-slate-500">{user?.email}</p>
          </div>
          <div className="flex items-center gap-3">
            <Badge tone="success">{getRoleLabel(user?.role)}</Badge>
            <button
              className="inline-flex h-9 w-9 items-center justify-center rounded-md text-slate-500 hover:bg-slate-100 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-200"
              onClick={() => {
                logout()
                navigate('/login')
              }}
              type="button"
              aria-label="Sair"
            >
              <LogOut size={18} />
            </button>
          </div>
        </header>

        <nav
          className="sticky top-16 z-10 border-b border-slate-200 bg-white px-4 py-2 lg:hidden"
          aria-label="Navegação principal mobile"
        >
          <div className="flex gap-2 overflow-x-auto pb-1">
            {visibleNavItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) =>
                  `inline-flex h-10 shrink-0 items-center gap-2 rounded-md px-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-red-200 ${
                    isActive ? 'bg-red-50 text-red-700' : 'text-slate-600 hover:bg-slate-100'
                  }`
                }
              >
                <item.icon size={17} />
                {item.label}
              </NavLink>
            ))}
          </div>
        </nav>

        <main className="px-4 py-6 lg:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
