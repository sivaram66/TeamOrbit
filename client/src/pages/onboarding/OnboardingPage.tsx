import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { useAuthStore } from '../../stores/auth.store'
import { useOrgStore } from '../../stores/org.store'
import api from '../../lib/axios'

const generateSlug = (name: string) =>
  name.toLowerCase().trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 48)

export const OnboardingPage = () => {
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const { setCurrentOrg } = useOrgStore()

  const [orgName, setOrgName] = useState('')
  const [slug, setSlug] = useState('')
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false)
  const [errors, setErrors] = useState<{ name?: string; slug?: string }>({})

  const handleNameChange = (value: string) => {
    setOrgName(value)
    if (!slugManuallyEdited) {
      setSlug(generateSlug(value))
    }
  }

  const handleSlugChange = (value: string) => {
    setSlugManuallyEdited(true)
    setSlug(value.toLowerCase().replace(/[^a-z0-9-]/g, ''))
  }

  const createOrgMutation = useMutation({
    mutationFn: async () => {
      const res = await api.post('/orgs', { name: orgName, slug })
      return res.data
    },
    onSuccess: (data) => {
      setCurrentOrg(data.data)
      navigate(`/org/${slug}/projects`)
    },
    onError: (error: any) => {
      setErrors({ slug: error.response?.data?.message || 'Something went wrong' })
    },
  })

  const validate = () => {
    const e: { name?: string; slug?: string } = {}
    if (!orgName || orgName.length < 2) e.name = 'At least 2 characters'
    if (!slug || slug.length < 2) e.slug = 'At least 2 characters'
    else if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) e.slug = 'Only lowercase letters, numbers and hyphens'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#060606',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: "'Inter', system-ui, sans-serif",
      padding: '24px',
      position: 'relative',
    }}>
      {/* Background */}
      <div style={{
        position: 'fixed', inset: 0,
        backgroundImage: `
          linear-gradient(rgba(255,255,255,0.018) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,0.018) 1px, transparent 1px)
        `,
        backgroundSize: '44px 44px',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'fixed', top: '30%', left: '50%', transform: 'translateX(-50%)',
        width: '600px', height: '400px',
        background: 'radial-gradient(ellipse, rgba(124,106,247,0.07) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div style={{ width: '100%', maxWidth: '480px', position: 'relative' }}>

        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '52px' }}>
          <div style={{
            width: '30px', height: '30px', borderRadius: '8px',
            background: 'linear-gradient(135deg, #8b7cf8, #6b59e8)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 0 1px rgba(124,106,247,0.3), 0 4px 16px rgba(124,106,247,0.35)',
          }}>
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <circle cx="8" cy="8" r="3" fill="white" />
              <circle cx="8" cy="8" r="6.5" stroke="white" strokeWidth="1" strokeDasharray="3 2" strokeOpacity="0.6" />
            </svg>
          </div>
          <span style={{ fontSize: '14px', fontWeight: 600, color: '#ececec', letterSpacing: '-0.025em' }}>
            TeamOrbit
          </span>
        </div>

        {/* Step indicator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '32px' }}>
          {[1, 2, 3].map((step) => (
            <div key={step} style={{
              height: '3px',
              width: step === 1 ? '28px' : '16px',
              borderRadius: '2px',
              backgroundColor: step === 1 ? '#7c6af7' : '#1a1a1a',
              transition: 'all 0.3s',
            }} />
          ))}
          <span style={{ fontSize: '11px', color: '#2e2e2e', marginLeft: '4px' }}>Step 1 of 3</span>
        </div>

        {/* Heading */}
        <div style={{ marginBottom: '40px' }}>
          <h1 style={{
            fontSize: '30px', fontWeight: 700, letterSpacing: '-0.05em',
            color: '#f0f0f0', lineHeight: 1.1, marginBottom: '10px',
          }}>
            Create your workspace
          </h1>
          <p style={{ fontSize: '14px', color: '#333333', lineHeight: 1.6 }}>
            {user?.name ? `Hey ${user.name.split(' ')[0]}, let's` : "Let's"} set up your organization. You can invite your team after.
          </p>
        </div>

        {/* Form */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

          <Input
            label="Organization name"
            type="text"
            placeholder="Acme Corp"
            value={orgName}
            onChange={(e) => handleNameChange(e.target.value)}
            error={errors.name}
            hint="This is your company or team name"
            autoFocus
          />

          <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
            <label style={{ fontSize: '12px', fontWeight: 500, color: '#3e3e3e' }}>
              URL slug
            </label>
            <div style={{
              display: 'flex', alignItems: 'center',
              backgroundColor: '#090909',
              border: `1px solid ${errors.slug ? '#ef4444' : '#181818'}`,
              borderRadius: '8px',
              overflow: 'hidden',
              transition: 'border-color 0.15s',
            }}>
              <span style={{
                padding: '11px 12px',
                fontSize: '13px',
                color: '#2e2e2e',
                borderRight: '1px solid #141414',
                whiteSpace: 'nowrap',
                flexShrink: 0,
              }}>
                teamorbit.app/
              </span>
              <input
                value={slug}
                onChange={(e) => handleSlugChange(e.target.value)}
                placeholder="acme-corp"
                style={{
                  flex: 1,
                  padding: '11px 14px',
                  fontSize: '14px',
                  color: '#e0e0e0',
                  backgroundColor: 'transparent',
                  border: 'none',
                  outline: 'none',
                  fontFamily: 'inherit',
                  letterSpacing: '-0.01em',
                  caretColor: '#7c6af7',
                }}
              />
            </div>
            {errors.slug && (
              <span style={{ fontSize: '12px', color: '#ef4444' }}>{errors.slug}</span>
            )}
            {!errors.slug && (
              <span style={{ fontSize: '12px', color: '#2a2a2a' }}>
                Only lowercase letters, numbers, and hyphens
              </span>
            )}
          </div>

          {/* Plan selection */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <label style={{ fontSize: '12px', fontWeight: 500, color: '#3e3e3e' }}>
              Plan
            </label>
            <div style={{ display: 'flex', gap: '10px' }}>
              {[
                { name: 'Free', desc: 'Up to 3 projects', price: '$0' },
                { name: 'Pro', desc: 'Unlimited everything', price: '$12/mo' },
              ].map((plan) => (
                <div
                  key={plan.name}
                  style={{
                    flex: 1, padding: '14px 16px',
                    backgroundColor: plan.name === 'Free' ? '#0e0e0e' : 'rgba(124,106,247,0.06)',
                    border: `1px solid ${plan.name === 'Free' ? '#181818' : 'rgba(124,106,247,0.2)'}`,
                    borderRadius: '8px',
                    cursor: 'pointer',
                    position: 'relative',
                  }}
                >
                  {plan.name === 'Pro' && (
                    <div style={{
                      position: 'absolute', top: '-8px', right: '10px',
                      padding: '2px 8px',
                      backgroundColor: '#7c6af7',
                      borderRadius: '4px',
                      fontSize: '10px', color: 'white', fontWeight: 600,
                    }}>
                      Popular
                    </div>
                  )}
                  <div style={{ fontSize: '13px', fontWeight: 600, color: plan.name === 'Free' ? '#888888' : '#c0b8ff', marginBottom: '4px' }}>
                    {plan.name}
                  </div>
                  <div style={{ fontSize: '11px', color: '#2e2e2e', marginBottom: '8px' }}>
                    {plan.desc}
                  </div>
                  <div style={{ fontSize: '16px', fontWeight: 700, color: plan.name === 'Free' ? '#555555' : '#7c6af7', letterSpacing: '-0.03em' }}>
                    {plan.price}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ marginTop: '8px' }}>
            <Button
              size="lg"
              loading={createOrgMutation.isPending}
              onClick={() => { if (validate()) createOrgMutation.mutate() }}
              style={{ width: '100%' }}
            >
              Create workspace →
            </Button>
          </div>

          <p style={{ fontSize: '12px', color: '#222222', textAlign: 'center', lineHeight: 1.6 }}>
            You can always change these settings later
          </p>
        </div>
      </div>
    </div>
  )
}