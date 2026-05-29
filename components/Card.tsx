import { ReactNode } from 'react'

export default function Card({
  children,
  className = '',
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div
      className={`bg-[#09090b] border border-[#1f1f23] rounded-xl ${className}`}
    >
      {children}
    </div>
  )
}
