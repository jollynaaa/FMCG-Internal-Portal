import type { ReactNode } from 'react'
import type { UserRole } from '@/lib/types'

export default function RoleGate({
  allow,
  role,
  children,
  fallback,
}: {
  allow: UserRole[]
  role: UserRole
  children: ReactNode
  fallback?: ReactNode
}) {
  if (!allow.includes(role)) return fallback ? <>{fallback}</> : null
  return <>{children}</>
}
