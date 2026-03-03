import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { PageLoader } from '@/components/ui'

export function ProtectedRoute({ children, requiredRole }) {
  const { user, profile, loading } = useAuth()
  const location = useLocation()

  if (loading) return <PageLoader />

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (requiredRole && profile?.user_type !== requiredRole) {
    return <Navigate to="/" replace />
  }

  return children
}

export function PublicOnlyRoute({ children }) {
  const { user, loading } = useAuth()

  if (loading) return <PageLoader />
  if (user) return <Navigate to="/" replace />

  return children
}
