import { ReactNode, CSSProperties } from 'react'

interface CardProps {
  title?: string
  children: ReactNode
  style?: CSSProperties
}

export default function Card({ title, children, style }: CardProps) {
  return (
    <div style={{
      background: 'white',
      borderRadius: '8px',
      padding: '24px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      ...style
    }}>
      {title && (
        <h3 style={{
          fontSize: '18px',
          fontWeight: '600',
          marginBottom: '16px',
          color: '#333'
        }}>
          {title}
        </h3>
      )}
      {children}
    </div>
  )
}
