import React from 'react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  children: React.ReactNode
}

export default function Button({
  variant = 'primary',
  size = 'md',
  className = '',
  ...props
}: ButtonProps) {
  const base = 'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-150 active:scale-95 disabled:opacity-40'

  const variants = {
    primary:   'bg-accent text-bg-base hover:brightness-110',
    secondary: 'bg-bg-elevated text-text-primary border border-border hover:bg-bg-card hover:border-accent/50',
    danger:    'bg-danger/10 text-danger border border-danger/30 hover:bg-danger/20',
    success:   'bg-success/10 text-success border border-success/30 hover:bg-success/20',
    ghost:     'text-text-muted hover:text-text-primary hover:bg-bg-elevated',
  }

  const sizes = {
    sm: 'px-3 py-1.5 text-sm gap-1.5',
    md: 'px-4 py-2 text-sm gap-2',
    lg: 'px-5 py-2.5 text-base gap-2',
  }

  return (
    <button
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    />
  )
}
