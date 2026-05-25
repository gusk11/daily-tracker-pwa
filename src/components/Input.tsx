import React from 'react'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export default function Input({ label, error, className = '', ...props }: InputProps) {
  return (
    <div className="w-full">
      {label && <label className="block text-sm font-semibold text-text-primary mb-3">{label}</label>}
      <input
        className={`w-full px-4 py-3 bg-gradient-to-r from-bg-secondary to-bg-primary border-2 border-border-subtle rounded-xl text-text-primary placeholder-text-muted focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/30 transition-all duration-300 shadow-sm hover:shadow-md ${className}`}
        {...props}
      />
      {error && <p className="text-accent-danger text-sm mt-1">{error}</p>}
    </div>
  )
}
