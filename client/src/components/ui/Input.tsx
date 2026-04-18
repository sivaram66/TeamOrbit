import React from 'react'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, style, onFocus, onBlur, ...props }, ref) => {
    const [focused, setFocused] = React.useState(false)

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
        {label && (
          <label style={{
            fontSize: '12px', fontWeight: 500,
            color: '#3e3e3e', letterSpacing: '0.01em',
          }}>
            {label}
          </label>
        )}
        <input
          ref={ref}
          style={{
            width: '100%',
            padding: '11px 14px',
            fontSize: '14px',
            color: '#e0e0e0',
            backgroundColor: focused ? '#0e0e0e' : '#090909',
            border: `1px solid ${
              error ? '#ef4444' :
              focused ? 'rgba(124,106,247,0.45)' :
              '#181818'
            }`,
            borderRadius: '8px',
            outline: 'none',
            transition: 'all 0.15s',
            boxShadow: focused && !error
              ? '0 0 0 3px rgba(124,106,247,0.07), inset 0 1px 3px rgba(0,0,0,0.4)'
              : 'inset 0 1px 3px rgba(0,0,0,0.3)',
            fontFamily: 'inherit',
            letterSpacing: '-0.01em',
            caretColor: '#7c6af7',
            ...style,
          }}
          onFocus={(e) => { setFocused(true); onFocus?.(e) }}
          onBlur={(e) => { setFocused(false); onBlur?.(e) }}
          {...props}
        />
        {error && (
          <span style={{ fontSize: '12px', color: '#ef4444', letterSpacing: '-0.01em' }}>
            {error}
          </span>
        )}
        {hint && !error && (
          <span style={{ fontSize: '12px', color: '#2a2a2a' }}>
            {hint}
          </span>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'