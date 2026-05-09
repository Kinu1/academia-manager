import { Navigate } from 'react-router-dom'

import { useAuth } from '../../features/auth/hooks/use-auth'
import { ProtectedLayout } from '../layouts/protected-layout'

export function ProtectedRoute() {
  const { isAuthenticated } = useAuth()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return <ProtectedLayout />
}
