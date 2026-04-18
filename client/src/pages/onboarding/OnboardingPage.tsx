import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { Button } from '../../components/ui/Button'
import { useAuthStore } from '../../stores/auth.store'
import { useOrgStore } from '../../stores/org.store'
import api from '../../lib/axios'

const generateSlug = (name: string) =>
  name.toLowerCase().trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 48)

type Plan = 'free' | 'pro'

export const OnboardingPage = () => {
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const { setCurrentOrg } = useOrgStore()

  const [orgName, setOrgName] = useState('')
  const [slug, setSlug] = useState('')
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<Plan>('free')
  const [errors, setErrors] = useState<{ name?: string; slug?: string }>({})
  const [orgNameFocused, setOrgNameFocused] = useState(false)
  const [slugFocused, setSlugFocused] = useState(false)

  const handleNameChange = (value: string) => {
    setOrgName(value)
    if (!slugManuallyEdited) setSlug(generateSlug(value))
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

  const firstName = user?.name?.split(' ')[0] || 'there'

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#060606',
      display: 'flex',
      fontFamily: "'Inter', system-ui, sans-serif",
      position: 'relative',
      overflow: 'hidden',
    }}>

      {/* Background grid */}
      <div style={{
        position: 'fixed', inset: 0,
        backgroundImage: `
          linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)
        `,
        backgroundSize: '40px 40px',
        pointerEvents: 'none',
      }} />

      {/* Ambient glows */}
      <div style={{
        position: 'fixed', top: '-100px', left: '-100px',
        width: '500px', height: '500px',
        background: 'radial-gradient(circle, rgba(124,106,247,0.08) 0%, transparent 65%)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'fixed', bottom: '-100px', right: '-100px',
        width: '400px', height: '400px',
        background: 'radial-gradient(circle, rgba(124,106,247,0.05) 0%, transparent 65%)',
        pointerEvents: 'none',
      }} />

      {/* Left panel — decorative */}
      <div style={{
        width: '380px',
        flexShrink: 0,
        borderRight: '1px solid #0f0f0f',
        display: 'flex',
        flexDirection: 'column',
        padding: '40px 36px',
        position: 'relative',
      }}>

        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '9px', marginBottom: 'auto' }}>
          <div style={{
            width: '28px', height: '28px', borderRadius: '8px',
            background: 'linear-gradient(135deg, #8b7cf8, #6b59e8)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 0 1px rgba(124,106,247,0.3), 0 4px 16px rgba(124,106,247,0.3)',
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

        {/* Center content */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '32px' }}>

          {/* Welcome message */}
          <div>
            <div style={{
              fontSize: '11px', fontWeight: 600, letterSpacing: '0.1em',
              color: '#7c6af7', textTransform: 'uppercase', marginBottom: '16px',
              display: 'flex', alignItems: 'center', gap: '8px',
            }}>
              <span style={{ display: 'inline-block', width: '16px', height: '1px', backgroundColor: '#7c6af7' }} />
              Setup
            </div>
            <h2 style={{
              fontSize: '32px', fontWeight: 700,
              letterSpacing: '-0.05em', lineHeight: 1.1,
              color: '#f0f0f0', marginBottom: '14px',
            }}>
              Hey {firstName},<br />
              let's build<br />
              <span style={{
                backgroundImage: 'linear-gradient(135deg, #a395f9, #7c6af7)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}>
                something great.
              </span>
            </h2>
            <p style={{ fontSize: '13px', color: '#333333', lineHeight: 1.7 }}>
              Create your workspace in 60 seconds. Invite your team, spin up projects, and start shipping.
            </p>
          </div>

          {/* Steps list */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {[
              { num: '01', label: 'Name your workspace', done: orgName.length > 1 },
              { num: '02', label: 'Invite your team', done: false, upcoming: true },
              { num: '03', label: 'Create first project', done: false, upcoming: true },
            ].map((step) => (
              <div key={step.num} style={{
                display: 'flex', alignItems: 'center', gap: '12px',
                opacity: step.upcoming ? 0.35 : 1,
              }}>
                <div style={{
                  width: '28px', height: '28px', borderRadius: '8px',
                  backgroundColor: step.done ? 'rgba(34,197,94,0.1)' : '#0e0e0e',
                  border: `1px solid ${step.done ? 'rgba(34,197,94,0.3)' : '#181818'}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                  transition: 'all 0.3s',
                }}>
                  {step.done ? (
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path d="M2 6l3 3 5-5" stroke="#22c55e" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  ) : (
                    <span style={{ fontSize: '10px', fontWeight: 600, color: '#2e2e2e', fontVariantNumeric: 'tabular-nums' }}>
                      {step.num}
                    </span>
                  )}
                </div>
                <span style={{
                  fontSize: '13px',
                  color: step.done ? '#888888' : '#3a3a3a',
                  fontWeight: step.done ? 400 : 500,
                  letterSpacing: '-0.01em',
                  textDecoration: step.done ? 'line-through' : 'none',
                }}>
                  {step.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom note */}
        <div style={{ marginTop: 'auto', paddingTop: '24px' }}>
          <p style={{ fontSize: '11px', color: '#1e1e1e', lineHeight: 1.6 }}>
            By continuing you agree to our Terms of Service and Privacy Policy. Your workspace is private by default.
          </p>
        </div>
      </div>

      {/* Right panel — form */}
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '60px 80px',
        position: 'relative',
      }}>
        <div style={{ width: '100%', maxWidth: '420px' }}>

          {/* Form header */}
          <div style={{ marginBottom: '36px' }}>
            <h3 style={{
              fontSize: '20px', fontWeight: 700,
              letterSpacing: '-0.04em', color: '#f0f0f0',
              marginBottom: '6px',
            }}>
              Workspace details
            </h3>
            <p style={{ fontSize: '13px', color: '#333333' }}>
              This is how your team will find and identify your workspace.
            </p>
          </div>

          {/* Form fields */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>

            {/* Org name */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '12px', fontWeight: 500, color: '#3e3e3e' }}>
                Workspace name
              </label>
              <input
                value={orgName}
                onChange={(e) => handleNameChange(e.target.value)}
                onFocus={() => setOrgNameFocused(true)}
                onBlur={() => setOrgNameFocused(false)}
                placeholder="Acme Corporation"
                autoFocus
                style={{
                  width: '100%', padding: '12px 14px',
                  fontSize: '15px', fontWeight: 500,
                  color: '#f0f0f0',
                  backgroundColor: orgNameFocused ? '#0e0e0e' : '#090909',
                  border: `1px solid ${errors.name ? '#ef4444' : orgNameFocused ? 'rgba(124,106,247,0.45)' : '#161616'}`,
                  borderRadius: '9px',
                  outline: 'none',
                  fontFamily: 'inherit',
                  letterSpacing: '-0.02em',
                  caretColor: '#7c6af7',
                  transition: 'all 0.15s',
                  boxShadow: orgNameFocused ? '0 0 0 3px rgba(124,106,247,0.07)' : 'none',
                }}
              />
              {errors.name && <span style={{ fontSize: '12px', color: '#ef4444' }}>{errors.name}</span>}
            </div>

            {/* URL slug */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '12px', fontWeight: 500, color: '#3e3e3e' }}>
                Workspace URL
              </label>
              <div style={{
                display: 'flex', alignItems: 'center',
                backgroundColor: slugFocused ? '#0e0e0e' : '#090909',
                border: `1px solid ${errors.slug ? '#ef4444' : slugFocused ? 'rgba(124,106,247,0.45)' : '#161616'}`,
                borderRadius: '9px',
                overflow: 'hidden',
                transition: 'all 0.15s',
                boxShadow: slugFocused ? '0 0 0 3px rgba(124,106,247,0.07)' : 'none',
              }}>
                <span style={{
                  padding: '12px 12px 12px 14px',
                  fontSize: '13px', color: '#2a2a2a',
                  whiteSpace: 'nowrap', flexShrink: 0,
                  borderRight: '1px solid #131313',
                  userSelect: 'none',
                }}>
                  teamorbit.app/
                </span>
                <input
                  value={slug}
                  onChange={(e) => handleSlugChange(e.target.value)}
                  onFocus={() => setSlugFocused(true)}
                  onBlur={() => setSlugFocused(false)}
                  placeholder="acme-corp"
                  style={{
                    flex: 1, padding: '12px 14px',
                    fontSize: '14px', fontWeight: 500,
                    color: '#e0e0e0',
                    backgroundColor: 'transparent',
                    border: 'none', outline: 'none',
                    fontFamily: 'inherit',
                    letterSpacing: '-0.01em',
                    caretColor: '#7c6af7',
                  }}
                />
                {slug && (
                  <div style={{
                    padding: '0 12px',
                    display: 'flex', alignItems: 'center',
                  }}>
                    <div style={{
                      width: '6px', height: '6px', borderRadius: '50%',
                      backgroundColor: /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) ? '#22c55e' : '#ef4444',
                      boxShadow: /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)
                        ? '0 0 6px rgba(34,197,94,0.6)'
                        : '0 0 6px rgba(239,68,68,0.6)',
                    }} />
                  </div>
                )}
              </div>
              {errors.slug
                ? <span style={{ fontSize: '12px', color: '#ef4444' }}>{errors.slug}</span>
                : <span style={{ fontSize: '11px', color: '#1e1e1e' }}>Lowercase letters, numbers, and hyphens only</span>
              }
            </div>

            {/* Plan selection */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <label style={{ fontSize: '12px', fontWeight: 500, color: '#3e3e3e' }}>
                Choose a plan
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                {([
                  {
                    id: 'free' as Plan,
                    name: 'Free',
                    price: '$0',
                    period: 'forever',
                    features: ['3 projects', '5 members', 'Basic analytics'],
                  },
                  {
                    id: 'pro' as Plan,
                    name: 'Pro',
                    price: '$12',
                    period: 'per month',
                    features: ['Unlimited projects', 'Unlimited members', 'Advanced analytics'],
                    badge: 'Popular',
                  },
                ] as const).map((plan) => {
                  const active = selectedPlan === plan.id
                  return (
                    <div
                      key={plan.id}
                      onClick={() => setSelectedPlan(plan.id)}
                      style={{
                        padding: '16px',
                        backgroundColor: active
                          ? plan.id === 'pro' ? 'rgba(124,106,247,0.08)' : '#0f0f0f'
                          : '#090909',
                        border: `1px solid ${active
                          ? plan.id === 'pro' ? 'rgba(124,106,247,0.35)' : '#252525'
                          : '#141414'
                        }`,
                        borderRadius: '10px',
                        cursor: 'pointer',
                        position: 'relative',
                        transition: 'all 0.15s',
                        boxShadow: active && plan.id === 'pro'
                          ? '0 0 24px rgba(124,106,247,0.1)'
                          : 'none',
                      }}
                    >
                      {'badge' in plan && (
                        <div style={{
                          position: 'absolute', top: '-8px', right: '10px',
                          padding: '2px 8px',
                          background: 'linear-gradient(135deg, #7c6af7, #5d4de8)',
                          borderRadius: '4px',
                          fontSize: '9px', color: 'white', fontWeight: 700,
                          letterSpacing: '0.04em',
                        }}>
                          POPULAR
                        </div>
                      )}

                      {/* Plan header */}
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                        <span style={{
                          fontSize: '12px', fontWeight: 600,
                          color: plan.id === 'pro' ? '#9d8ff5' : '#555555',
                          letterSpacing: '0.02em',
                        }}>
                          {plan.name}
                        </span>
                        {active && (
                          <div style={{
                            width: '16px', height: '16px', borderRadius: '50%',
                            backgroundColor: plan.id === 'pro' ? '#7c6af7' : '#333333',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                          }}>
                            <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                              <path d="M1.5 4l2 2 3-3" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          </div>
                        )}
                      </div>

                      {/* Price */}
                      <div style={{ marginBottom: '12px' }}>
                        <span style={{
                          fontSize: '22px', fontWeight: 700,
                          color: plan.id === 'pro' ? '#7c6af7' : '#444444',
                          letterSpacing: '-0.04em',
                        }}>
                          {plan.price}
                        </span>
                        <span style={{ fontSize: '11px', color: '#242424', marginLeft: '4px' }}>
                          {plan.period}
                        </span>
                      </div>

                      {/* Features */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                        {plan.features.map((f) => (
                          <div key={f} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <div style={{
                              width: '4px', height: '4px', borderRadius: '50%',
                              backgroundColor: plan.id === 'pro' ? '#7c6af7' : '#252525',
                              flexShrink: 0,
                            }} />
                            <span style={{ fontSize: '11px', color: '#2e2e2e' }}>{f}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Submit */}
            <div style={{ marginTop: '4px' }}>
              <Button
                size="lg"
                loading={createOrgMutation.isPending}
                onClick={() => { if (validate()) createOrgMutation.mutate() }}
                style={{ width: '100%' }}
              >
                Create workspace →
              </Button>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}