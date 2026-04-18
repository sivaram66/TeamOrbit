import { useState } from 'react'
import { Link, useLocation, useParams, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../stores/auth.store'
import { useOrgStore } from '../../stores/org.store'

interface AppShellProps {
  children: React.ReactNode
}

export const AppShell = ({ children }: AppShellProps) => {
  const location = useLocation()
  const { slug } = useParams()
  const navigate = useNavigate()
  const { user, clearAuth } = useAuthStore()
  const { currentOrg, clearOrg } = useOrgStore()
  const [userMenuOpen, setUserMenuOpen] = useState(false)

  const orgSlug = slug || currentOrg?.slug

  const navItems = [
    {
      label: 'Overview',
      path: `/org/${orgSlug}/dashboard`,
      icon: (active: boolean) => (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <rect x="1.5" y="1.5" width="5.5" height="5.5" rx="1.5"
            stroke={active ? '#a395f9' : '#3a3a3a'} strokeWidth="1.3" />
          <rect x="9" y="1.5" width="5.5" height="5.5" rx="1.5"
            stroke={active ? '#a395f9' : '#3a3a3a'} strokeWidth="1.3" />
          <rect x="1.5" y="9" width="5.5" height="5.5" rx="1.5"
            stroke={active ? '#a395f9' : '#3a3a3a'} strokeWidth="1.3" />
          <rect x="9" y="9" width="5.5" height="5.5" rx="1.5"
            stroke={active ? '#a395f9' : '#3a3a3a'} strokeWidth="1.3" />
        </svg>
      ),
    },
    {
      label: 'Projects',
      path: `/org/${orgSlug}/projects`,
      icon: (active: boolean) => (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M8 1.5L14.5 5V11L8 14.5L1.5 11V5L8 1.5Z"
            stroke={active ? '#a395f9' : '#3a3a3a'} strokeWidth="1.3" strokeLinejoin="round" />
          <path d="M8 1.5V14.5M1.5 5L14.5 5"
            stroke={active ? '#a395f9' : '#3a3a3a'} strokeWidth="1.3" strokeLinecap="round" />
        </svg>
      ),
    },
    {
      label: 'Members',
      path: `/org/${orgSlug}/members`,
      icon: (active: boolean) => (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <circle cx="6" cy="5" r="2.5"
            stroke={active ? '#a395f9' : '#3a3a3a'} strokeWidth="1.3" />
          <path d="M1.5 14c0-2.485 2.015-4.5 4.5-4.5s4.5 2.015 4.5 4.5"
            stroke={active ? '#a395f9' : '#3a3a3a'} strokeWidth="1.3" strokeLinecap="round" />
          <circle cx="12" cy="5" r="2"
            stroke={active ? '#a395f9' : '#3a3a3a'} strokeWidth="1.3" />
          <path d="M14.5 14c0-1.933-1.343-3.5-3-3.5"
            stroke={active ? '#a395f9' : '#3a3a3a'} strokeWidth="1.3" strokeLinecap="round" />
        </svg>
      ),
    },
    {
      label: 'Settings',
      path: `/org/${orgSlug}/settings`,
      icon: (active: boolean) => (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <circle cx="8" cy="8" r="2.5"
            stroke={active ? '#a395f9' : '#3a3a3a'} strokeWidth="1.3" />
          <path d="M8 1.5V3M8 13v1.5M1.5 8H3M13 8h1.5M3.4 3.4l1.06 1.06M11.54 11.54l1.06 1.06M3.4 12.6l1.06-1.06M11.54 4.46l1.06-1.06"
            stroke={active ? '#a395f9' : '#3a3a3a'} strokeWidth="1.3" strokeLinecap="round" />
        </svg>
      ),
    },
  ]

  const handleLogout = () => {
    clearAuth()
    clearOrg()
    navigate('/login')
  }

  const isActive = (path: string) => location.pathname === path
  const activeItem = navItems.find(n => isActive(n.path))

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#0d0d0d',
      display: 'flex',
      fontFamily: "'Inter', system-ui, sans-serif",
    }}>

      {/* ── Sidebar ── */}
      <aside style={{
        width: '240px',
        flexShrink: 0,
        position: 'fixed',
        top: 0, left: 0, bottom: 0,
        zIndex: 100,
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#0a0a0a',
        borderRight: '1px solid rgba(255,255,255,0.05)',
        backgroundImage: 'radial-gradient(ellipse 200% 60% at 50% -10%, rgba(124,106,247,0.07) 0%, transparent 60%)',
      }}>

        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '16px 10px' }}>

          {/* Org selector */}
          <div
            style={{
              display: 'flex', alignItems: 'center', gap: '10px',
              padding: '10px 12px',
              borderRadius: '10px',
              cursor: 'pointer',
              marginBottom: '6px',
              border: '1px solid transparent',
              transition: 'all 0.15s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.04)'
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent'
              e.currentTarget.style.borderColor = 'transparent'
            }}
          >
            <div style={{
              width: '32px', height: '32px', borderRadius: '9px',
              background: 'linear-gradient(135deg, #7c6af7 0%, #5d4de8 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '13px', fontWeight: 700, color: '#fff',
              flexShrink: 0,
              boxShadow: '0 2px 8px rgba(124,106,247,0.4)',
            }}>
              {(currentOrg?.name || 'O')[0].toUpperCase()}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{
                fontSize: '13px', fontWeight: 600,
                color: '#e8e8e8', letterSpacing: '-0.02em',
                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
              }}>
                {currentOrg?.name || 'My Org'}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginTop: '2px' }}>
                <div style={{
                  width: '5px', height: '5px', borderRadius: '50%',
                  backgroundColor: '#22c55e',
                  boxShadow: '0 0 5px rgba(34,197,94,0.6)',
                }} />
                <span style={{ fontSize: '10px', color: '#3a3a3a', textTransform: 'capitalize', letterSpacing: '0.01em' }}>
                  {currentOrg?.plan || 'free'} plan
                </span>
              </div>
            </div>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ color: '#2a2a2a', flexShrink: 0 }}>
              <path d="M3.5 5.5L7 9L10.5 5.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>

          {/* Divider */}
          <div style={{ height: '1px', backgroundColor: 'rgba(255,255,255,0.04)', margin: '8px 4px 16px' }} />

          {/* Nav label */}
          <div style={{ padding: '0 12px', marginBottom: '6px' }}>
            <span style={{ fontSize: '10px', fontWeight: 600, color: '#252525', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              Workspace
            </span>
          </div>

          {/* Nav items */}
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '2px', flex: 1 }}>
            {navItems.map((item) => {
              const active = isActive(item.path)
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '10px',
                    padding: '9px 12px',
                    borderRadius: '9px',
                    textDecoration: 'none',
                    fontSize: '13px',
                    fontWeight: active ? 500 : 400,
                    color: active ? '#e8e8e8' : '#3a3a3a',
                    backgroundColor: active ? 'rgba(255,255,255,0.05)' : 'transparent',
                    border: `1px solid ${active ? 'rgba(255,255,255,0.07)' : 'transparent'}`,
                    transition: 'all 0.15s',
                    letterSpacing: '-0.01em',
                    position: 'relative',
                  }}
                  onMouseEnter={(e) => {
                    if (!active) {
                      e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.03)'
                      e.currentTarget.style.color = '#888888'
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!active) {
                      e.currentTarget.style.backgroundColor = 'transparent'
                      e.currentTarget.style.color = '#3a3a3a'
                    }
                  }}
                >
                  {/* Active indicator */}
                  {active && (
                    <div style={{
                      position: 'absolute', left: '-10px', top: '50%',
                      transform: 'translateY(-50%)',
                      width: '3px', height: '18px',
                      background: 'linear-gradient(180deg, #a395f9, #7c6af7)',
                      borderRadius: '0 3px 3px 0',
                      boxShadow: '2px 0 12px rgba(124,106,247,0.5)',
                    }} />
                  )}

                  {item.icon(active)}
                  <span style={{ flex: 1 }}>{item.label}</span>
                </Link>
              )
            })}
          </nav>

          {/* Divider */}
          <div style={{ height: '1px', backgroundColor: 'rgba(255,255,255,0.04)', margin: '12px 4px' }} />

          {/* User */}
          <div style={{ position: 'relative' }}>
            <div
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              style={{
                display: 'flex', alignItems: 'center', gap: '10px',
                padding: '9px 12px', borderRadius: '9px',
                cursor: 'pointer',
                border: `1px solid ${userMenuOpen ? 'rgba(255,255,255,0.07)' : 'transparent'}`,
                backgroundColor: userMenuOpen ? 'rgba(255,255,255,0.05)' : 'transparent',
                transition: 'all 0.15s',
              }}
              onMouseEnter={(e) => {
                if (!userMenuOpen) {
                  e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.03)'
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)'
                }
              }}
              onMouseLeave={(e) => {
                if (!userMenuOpen) {
                  e.currentTarget.style.backgroundColor = 'transparent'
                  e.currentTarget.style.borderColor = 'transparent'
                }
              }}
            >
              <div style={{
                width: '28px', height: '28px', borderRadius: '50%',
                background: 'linear-gradient(135deg, rgba(124,106,247,0.25), rgba(124,106,247,0.1))',
                border: '1px solid rgba(124,106,247,0.25)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '11px', fontWeight: 600, color: '#a395f9',
                flexShrink: 0,
              }}>
                {(user?.name || 'U')[0].toUpperCase()}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                  fontSize: '12px', fontWeight: 500, color: '#666666',
                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                  letterSpacing: '-0.01em',
                }}>
                  {user?.name}
                </div>
              </div>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ color: '#252525', flexShrink: 0 }}>
                <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>

            {userMenuOpen && (
              <div style={{
                position: 'absolute', bottom: '100%', left: 0, right: 0,
                marginBottom: '6px',
                backgroundColor: '#111111',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '12px',
                overflow: 'hidden',
                boxShadow: '0 -16px 48px rgba(0,0,0,0.8)',
              }}>
                <div style={{ padding: '14px 16px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <div style={{ fontSize: '12px', fontWeight: 600, color: '#888888', marginBottom: '3px' }}>
                    {user?.name}
                  </div>
                  <div style={{ fontSize: '11px', color: '#333333' }}>{user?.email}</div>
                </div>
                <button
                  onClick={handleLogout}
                  style={{
                    width: '100%', padding: '11px 16px',
                    display: 'flex', alignItems: 'center', gap: '10px',
                    backgroundColor: 'transparent', border: 'none',
                    cursor: 'pointer', fontSize: '12px', color: '#ef4444',
                    fontFamily: 'inherit', textAlign: 'left', transition: 'background 0.15s',
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(239,68,68,0.06)'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                    <path d="M5 11H2.5A1.5 1.5 0 011 9.5v-6A1.5 1.5 0 012.5 2H5M9 9.5l3-3-3-3M12 6.5H5"
                      stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  Sign out
                </button>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* ── Main ── */}
      <div style={{ flex: 1, marginLeft: '240px', display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>

        {/* Topbar */}
        <header style={{
          height: '52px',
          backgroundColor: '#0d0d0d',
          borderBottom: '1px solid rgba(255,255,255,0.05)',
          display: 'flex', alignItems: 'center',
          padding: '0 32px',
          position: 'sticky', top: 0, zIndex: 50,
          gap: '12px',
        }}>

          {/* Breadcrumb */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1 }}>
            <span style={{ fontSize: '12px', color: '#2e2e2e' }}>{currentOrg?.name}</span>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M4.5 2.5L7.5 6L4.5 9.5" stroke="#1e1e1e" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span style={{ fontSize: '12px', fontWeight: 500, color: '#666666', letterSpacing: '-0.01em' }}>
              {activeItem?.label || 'Dashboard'}
            </span>
          </div>

          {/* Search */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            padding: '7px 14px',
            backgroundColor: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: '8px', cursor: 'pointer',
            transition: 'all 0.15s',
          }}
            onMouseEnter={(e) => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'}
            onMouseLeave={(e) => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'}
          >
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
              <circle cx="5.5" cy="5.5" r="4" stroke="#2e2e2e" strokeWidth="1.2" />
              <path d="M9 9L12 12" stroke="#2e2e2e" strokeWidth="1.2" strokeLinecap="round" />
            </svg>
            <span style={{ fontSize: '12px', color: '#282828' }}>Search</span>
            <div style={{
              padding: '1px 6px',
              backgroundColor: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: '4px',
              fontSize: '10px', color: '#252525',
            }}>
              ⌘K
            </div>
          </div>

          {/* New button */}
          <button style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            padding: '7px 14px',
            background: 'linear-gradient(135deg, #7c6af7 0%, #5d4de8 100%)',
            border: '1px solid rgba(124,106,247,0.4)',
            borderRadius: '8px',
            color: '#fff', fontSize: '12px', fontWeight: 500,
            cursor: 'pointer', fontFamily: 'inherit',
            boxShadow: '0 1px 2px rgba(0,0,0,0.3), 0 0 0 1px rgba(124,106,247,0.2), inset 0 1px 0 rgba(255,255,255,0.1)',
            transition: 'all 0.15s',
          }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = '0 4px 16px rgba(124,106,247,0.4), inset 0 1px 0 rgba(255,255,255,0.1)'
              e.currentTarget.style.transform = 'translateY(-1px)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = '0 1px 2px rgba(0,0,0,0.3), 0 0 0 1px rgba(124,106,247,0.2), inset 0 1px 0 rgba(255,255,255,0.1)'
              e.currentTarget.style.transform = 'translateY(0)'
            }}
          >
            <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
              <path d="M5.5 1v9M1 5.5h9" stroke="white" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
            New
          </button>
        </header>

        {/* Content */}
        <main style={{ flex: 1, padding: '36px 40px' }}>
          {children}
        </main>
      </div>
    </div>
  )
}