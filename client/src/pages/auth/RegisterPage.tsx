import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { AuthLayout } from '../../components/layouts/AuthLayout'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { useAuthStore } from '../../stores/auth.store'
import api from '../../lib/axios'

interface RegisterForm {
  name: string
  email: string
  password: string
}

export const RegisterPage = () => {
  const navigate = useNavigate()
  const { setAuth } = useAuthStore()
  const [form, setForm] = useState<RegisterForm>({ name: '', email: '', password: '' })
  const [errors, setErrors] = useState<Partial<RegisterForm>>({})

  const registerMutation = useMutation({
    mutationFn: async (data: RegisterForm) => {
      await api.post('/auth/register', data)
      const res = await api.post('/auth/login', { email: data.email, password: data.password })
      return res.data
    },
    onSuccess: (data) => {
      const { user, accessToken, refreshToken } = data.data
      setAuth(user, accessToken, refreshToken)
      navigate('/onboarding')
    },
    onError: (error: any) => {
      setErrors({ email: error.response?.data?.message || 'Something went wrong' })
    },
  })

  const validate = () => {
    const e: Partial<RegisterForm> = {}
    if (!form.name || form.name.length < 2) e.name = 'At least 2 characters'
    if (!form.email) e.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Invalid email'
    if (!form.password || form.password.length < 8) e.password = 'At least 8 characters'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  return (
    <AuthLayout>
      <div style={{ marginBottom: '40px' }}>
        <p style={{
          fontSize: '11px', fontWeight: 600, letterSpacing: '0.12em',
          color: '#7c6af7', textTransform: 'uppercase', marginBottom: '14px',
          display: 'flex', alignItems: 'center', gap: '8px',
        }}>
          <span style={{ display: 'inline-block', width: '18px', height: '1px', backgroundColor: '#7c6af7' }} />
          Get started — it's free
        </p>
        <h1 style={{
          fontSize: '28px', fontWeight: 700, letterSpacing: '-0.05em',
          color: '#f0f0f0', lineHeight: 1.1, marginBottom: '10px',
        }}>
          Create your account
        </h1>
        <p style={{ fontSize: '14px', color: '#333333', lineHeight: 1.6 }}>
          Join thousands of teams shipping with clarity.
        </p>
      </div>

      <form
        onSubmit={(e) => { e.preventDefault(); if (validate()) registerMutation.mutate(form) }}
        style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}
      >
        <Input
          label="Full name"
          type="text"
          placeholder="John Smith"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          error={errors.name}
          autoFocus
        />

        <Input
          label="Work email"
          type="email"
          placeholder="you@company.com"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          error={errors.email}
        />

        <Input
          label="Password"
          type="password"
          placeholder="Min. 8 characters"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          error={errors.password}
        />

        <p style={{ fontSize: '11px', color: '#242424', lineHeight: 1.6, marginTop: '2px' }}>
          By continuing, you agree to our{' '}
          <span
            style={{ color: '#383838', cursor: 'pointer', transition: 'color 0.15s' }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#7c6af7'}
            onMouseLeave={(e) => e.currentTarget.style.color = '#383838'}
          >
            Terms of Service
          </span>
          {' '}and{' '}
          <span
            style={{ color: '#383838', cursor: 'pointer', transition: 'color 0.15s' }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#7c6af7'}
            onMouseLeave={(e) => e.currentTarget.style.color = '#383838'}
          >
            Privacy Policy
          </span>
        </p>

        <div style={{ marginTop: '6px' }}>
          <Button
            type="submit"
            size="lg"
            loading={registerMutation.isPending}
            style={{ width: '100%' }}
          >
            Create account →
          </Button>
        </div>
      </form>

      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', margin: '28px 0 20px' }}>
        <div style={{ flex: 1, height: '1px', backgroundColor: '#111111' }} />
        <span style={{ fontSize: '11px', color: '#222222', letterSpacing: '0.08em' }}>OR</span>
        <div style={{ flex: 1, height: '1px', backgroundColor: '#111111' }} />
      </div>

      <Link to="/login" style={{ textDecoration: 'none', display: 'block' }}>
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
          Already have an account? Sign in
        </div>
      </Link>
    </AuthLayout>
  )
}