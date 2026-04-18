import React from 'react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  children: React.ReactNode
}

export const Button = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  children,
  disabled,
  style,
  onMouseEnter,
  onMouseLeave,
  ...props
}: ButtonProps) => {
  const [hovered, setHovered] = React.useState(false)

  const sizes = {
    sm: { padding: '7px 12px', fontSize: '12px' },
    md: { padding: '9px 14px', fontSize: '13px' },
    lg: { padding: '12px 18px', fontSize: '14px' },
  }

  const variants: Record<string, React.CSSProperties> = {
    primary: {
      background: hovered
        ? 'linear-gradient(135deg, #9080fa, #6b59e8)'
        : 'linear-gradient(135deg, #7c6af7, #5d4de8)',
      color: 'white',
      border: '1px solid rgba(124,106,247,0.4)',
      boxShadow: hovered
        ? '0 6px 28px rgba(124,106,247,0.5), inset 0 1px 0 rgba(255,255,255,0.12)'
        : '0 2px 14px rgba(124,106,247,0.3), inset 0 1px 0 rgba(255,255,255,0.08)',
    },
    secondary: {
      backgroundColor: hovered ? '#141414' : '#0f0f0f',
      color: hovered ? '#e8e8e8' : '#777777',
      border: '1px solid #1e1e1e',
      boxShadow: 'none',
    },
    ghost: {
      backgroundColor: hovered ? '#0f0f0f' : 'transparent',
      color: hovered ? '#e8e8e8' : '#444444',
      border: '1px solid transparent',
      boxShadow: 'none',
    },
    danger: {
      backgroundColor: hovered ? '#ef4444' : 'rgba(239,68,68,0.08)',
      color: hovered ? 'white' : '#ef4444',
      border: '1px solid rgba(239,68,68,0.25)',
      boxShadow: 'none',
    },
  }

  return (
    <button
      disabled={disabled || loading}
      onMouseEnter={(e) => { setHovered(true); onMouseEnter?.(e) }}
      onMouseLeave={(e) => { setHovered(false); onMouseLeave?.(e) }}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        fontWeight: 500,
        borderRadius: '8px',
        cursor: disabled || loading ? 'not-allowed' : 'pointer',
        opacity: disabled || loading ? 0.4 : 1,
        transition: 'all 0.15s',
        fontFamily: 'inherit',
        letterSpacing: '-0.01em',
        ...sizes[size],
        ...variants[variant],
        ...style,
      }}
      {...props}
    >
      {loading && (
        <svg style={{ width: '14px', height: '14px', flexShrink: 0 }} fill="none" viewBox="0 0 24 24">
          <style>{`@keyframes _spin { to { transform: rotate(360deg) } }`}</style>
          <circle style={{ opacity: 0.2 }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
          <path
            style={{ animation: '_spin 0.7s linear infinite', transformOrigin: 'center' }}
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
          />
        </svg>
      )}
      {children}
    </button>
  )
}