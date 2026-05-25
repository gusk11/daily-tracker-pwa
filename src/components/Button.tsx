import React from 'react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'success'
  size?: 'sm' | 'md' | 'lg'
  children: React.ReactNode
}

export default function Button({
  variant = 'primary',
  size = 'md',
  className = '',
  ...props
}: ButtonProps) {
  const baseClasses = 'font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95'

  const variantClasses = {
    primary: 'bg-gradient-to-br from-accent to-cyan-600 text-bg-primary hover:from-cyan-500 hover:to-cyan-700',
    secondary: 'bg-gradient-to-br from-bg-secondary to-bg-primary text-text-primary hover:bg-bg-tertiary border border-border-subtle',
    danger: 'bg-gradient-to-br from-accent-danger to-red-600 text-white hover:from-red-500 hover:to-red-700',
    success: 'bg-gradient-to-br from-success to-green-600 text-bg-primary hover:from-green-500 hover:to-green-700',
  }

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  }

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      {...props}
    />
  )
}
