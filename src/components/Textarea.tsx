import React from 'react'

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
}

export default function Textarea({ label, error, className = '', ...props }: TextareaProps) {
  return (
    <div className="w-full">
      {label && <label className="block text-sm font-medium text-text-muted mb-2">{label}</label>}
      <textarea
        className={`w-full px-4 py-2 bg-bg-secondary border border-border-subtle rounded-lg text-text-primary placeholder-text-muted focus:outline-none focus:border-accent-primary focus:ring-2 focus:ring-accent-primary/20 transition ${className}`}
        {...props}
      />
      {error && <p className="text-accent-danger text-sm mt-1">{error}</p>}
    </div>
  )
}
