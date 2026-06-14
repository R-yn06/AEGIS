import React from 'react'

type CardProps = React.HTMLAttributes<HTMLElement> & {
  interactive?: boolean
}

export function Card({ className = '', interactive = false, ...props }: CardProps) {
  return <section className={`surface-card ${interactive ? 'surface-card-interactive' : ''} ${className}`} {...props} />
}
