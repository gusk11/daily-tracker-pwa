import React from 'react'

interface CardProps {
  children: React.ReactNode
  className?: string
  onClick?: () => void
}

export default function Card({ children, className = '', onClick }: CardProps) {
  return (
    <div
      className={`bg-[#0d1f35] rounded-2xl border border-[#1e3a52] p-5 ${onClick ? 'cursor-pointer hover:border-[#38bdf8]/40 transition-colors' : ''} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  )
}
