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
  const baseClasses = 'font-medium rounded-lg transition-colors duration-200'

  const variantClasses = {
    primary: 'bg-accent-primary text-bg-primary hover:bg-cyan-600',
    secondary: 'bg-bg-secondary text-text-primary hover:bg-bg-tertiary border border-border-subtle',
    danger: 'bg-accent-danger text-white hover:bg-red-600',
    success: 'bg-accent-success text-bg-primary hover:bg-green-600',
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
