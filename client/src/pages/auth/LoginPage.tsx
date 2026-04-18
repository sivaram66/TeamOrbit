import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { AuthLayout } from '../../components/layouts/AuthLayout'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { useAuthStore } from '../../stores/auth.store'
import api from '../../lib/axios'

interface LoginForm {
  email: string
  password: string
}

export const LoginPage = () => {
  const navigate = useNavigate()
  const { setAuth } = useAuthStore()
  const [form, setForm] = useState<LoginForm>({ email: '', password: '' })
  const [errors, setErrors] = useState<Partial<LoginForm>>({})

  const loginMutation = useMutation({
    mutationFn: async (data: LoginForm) => {
      const res = await api.post('/auth/login', data)
      return res.data
    },
    onSuccess: (data) => {
      const { user, accessToken, refreshToken } = data.data
      setAuth(user, accessToken, refreshToken)
      navigate('/dashboard')
    },
    onError: (error: any) => {
      setErrors({ email: error.response?.data?.message || 'Invalid credentials' })
    },
  })

  const validate = () => {
    const e: Partial<LoginForm> = {}
    if (!form.email) e.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Invalid email'
    if (!form.password) e.password = 'Password is required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  return (
    <AuthLayout>
      {/* Eyebrow + heading */}
      <div style={{ marginBottom: '40px' }}>
        <p style={{
          fontSize: '11px', fontWeight: 600, letterSpacing: '0.12em',
          color: '#7c6af7', textTransform: 'uppercase', marginBottom: '14px',
          display: 'flex', alignItems: 'center', gap: '8px',
        }}>
          <span style={{ display: 'inline-block', width: '18px', height: '1px', backgroundColor: '#7c6af7' }} />
          Sign in
        </p>
        <h1 style={{
          fontSize: '28px', fontWeight: 700, letterSpacing: '-0.05em',
          color: '#f0f0f0', lineHeight: 1.1, marginBottom: '10px',
        }}>
          Welcome back
        </h1>
        <p style={{ fontSize: '14px', color: '#333333', lineHeight: 1.6 }}>
          Good to see you again. Let's get to work.
        </p>
      </div>

      {/* Form */}
      <form
        onSubmit={(e) => { e.preventDefault(); if (validate()) loginMutation.mutate(form) }}
        style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}
      >
        <Input
          label="Email address"
          type="email"
          placeholder="you@company.com"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          error={errors.email}
          autoFocus
        />

        <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <label style={{ fontSize: '12px', fontWeight: 500, color: '#3e3e3e' }}>
              Password
            </label>
            <Link
              to="/forgot-password"
              style={{ fontSize: '12px', color: '#2e2e2e', textDecoration: 'none', transition: 'color 0.15s' }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#7c6af7'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#2e2e2e'}
            >
              Forgot password?
            </Link>
          </div>
          <Input
            type="password"
            placeholder="••••••••"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            error={errors.password}
          />
        </div>

        <div style={{ marginTop: '8px' }}>
          <Button
            type="submit"
            size="lg"
            loading={loginMutation.isPending}
            style={{ width: '100%' }}
          >
            Continue →
          </Button>
        </div>
      </form>

      {/* Divider */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', margin: '28px 0 20px' }}>
        <div style={{ flex: 1, height: '1px', backgroundColor: '#111111' }} />
        <span style={{ fontSize: '11px', color: '#222222', letterSpacing: '0.08em' }}>OR</span>
        <div style={{ flex: 1, height: '1px', backgroundColor: '#111111' }} />
      </div>

      {/* Secondary CTA */}
      <Link to="/register" style={{ textDecoration: 'none', display: 'block' }}>
        <div
          style={{
            width: '100%', padding: '11px 16px',
            backgroundColor: 'transparent',
            border: '1px solid #141414',
            borderRadius: '8px',
            color: '#444444',
            fontSize: '13px', fontWeight: 500,
            cursor: 'pointer',
            textAlign: 'center',
            letterSpacing: '-0.01em',
            transition: 'all 0.15s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = '#222222'
            e.currentTarget.style.color = '#aaaaaa'
            e.currentTarget.style.backgroundColor = '#0e0e0e'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = '#141414'
            e.currentTarget.style.color = '#444444'
            e.currentTarget.style.backgroundColor = 'transparent'
          }}
        >
          New to TeamOrbit? Create account
        </div>
      </Link>
    </AuthLayout>
  )
}