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
      icon: (
        <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
          <rect x="1.5" y="1.5" width="5" height="5" rx="1.2" stroke="currentColor" strokeWidth="1.2" />
          <rect x="8.5" y="1.5" width="5" height="5" rx="1.2" stroke="currentColor" strokeWidth="1.2" />
          <rect x="1.5" y="8.5" width="5" height="5" rx="1.2" stroke="currentColor" strokeWidth="1.2" />
          <rect x="8.5" y="8.5" width="5" height="5" rx="1.2" stroke="currentColor" strokeWidth="1.2" />
        </svg>
      ),
    },
    {
      label: 'Projects',
      path: `/org/${orgSlug}/projects`,
      icon: (
        <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
          <path d="M7.5 1.5L13 4.5V10.5L7.5 13.5L2 10.5V4.5L7.5 1.5Z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
          <path d="M7.5 1.5V13.5M2 4.5L13 4.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
        </svg>
      ),
    },
    {
      label: 'Members',
      path: `/org/${orgSlug}/members`,
      icon: (
        <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
          <circle cx="5.5" cy="4.5" r="2.5" stroke="currentColor" strokeWidth="1.2" />
          <path d="M1 13c0-2.485 2.015-4.5 4.5-4.5S10 10.515 10 13" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
          <circle cx="11.5" cy="4.5" r="2" stroke="currentColor" strokeWidth="1.2" />
          <path d="M13.5 13c0-1.933-1.343-3.5-3-3.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
        </svg>
      ),
    },
    {
      label: 'Settings',
      path: `/org/${orgSlug}/settings`,
      icon: (
        <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
          <circle cx="7.5" cy="7.5" r="2" stroke="currentColor" strokeWidth="1.2" />
          <path d="M7.5 1v1.5M7.5 12.5V14M1 7.5h1.5M12.5 7.5H14M3.05 3.05l1.06 1.06M10.89 10.89l1.06 1.06M3.05 11.95l1.06-1.06M10.89 4.11l1.06-1.06" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
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
      backgroundColor: '#060606',
      display: 'flex',
      fontFamily: "'Inter', system-ui, sans-serif",
    }}>

      {/* ── Sidebar ── */}
      <div style={{
        width: '232px',
        flexShrink: 0,
        position: 'fixed',
        top: 0, left: 0, bottom: 0,
        zIndex: 100,
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#080808',
        borderRight: '1px solid #0f0f0f',
      }}>

        {/* Subtle sidebar gradient */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse 120% 40% at 50% 0%, rgba(124,106,247,0.04) 0%, transparent 60%)',
          pointerEvents: 'none',
        }} />

        {/* Content wrapper */}
        <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', height: '100%', padding: '12px' }}>

          {/* Org selector */}
          <div
            style={{
              display: 'flex', alignItems: 'center', gap: '10px',
              padding: '10px 10px',
              borderRadius: '9px',
              cursor: 'pointer',
              marginBottom: '4px',
              border: '1px solid transparent',
              transition: 'all 0.15s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#0f0f0f'
              e.currentTarget.style.borderColor = '#161616'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent'
              e.currentTarget.style.borderColor = 'transparent'
            }}
          >
            {/* Org avatar */}
            <div style={{
              width: '30px', height: '30px', borderRadius: '8px',
              background: 'linear-gradient(135deg, #7c6af7, #5d4de8)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '13px', fontWeight: 700, color: 'white',
              flexShrink: 0,
              boxShadow: '0 0 0 1px rgba(124,106,247,0.2)',
            }}>
              {(currentOrg?.name || 'O')[0].toUpperCase()}
            </div>

            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{
                fontSize: '13px', fontWeight: 600, color: '#d0d0d0',
                letterSpacing: '-0.02em',
                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
              }}>
                {currentOrg?.name || 'My Org'}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '1px' }}>
                <div style={{
                  width: '4px', height: '4px', borderRadius: '50%',
                  backgroundColor: '#22c55e',
                  boxShadow: '0 0 4px rgba(34,197,94,0.6)',
                }} />
                <span style={{ fontSize: '10px', color: '#2e2e2e', textTransform: 'capitalize' }}>
                  {currentOrg?.plan || 'free'} plan
                </span>
              </div>
            </div>

            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ flexShrink: 0, color: '#2a2a2a' }}>
              <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>

          {/* Divider */}
          <div style={{ height: '1px', backgroundColor: '#0f0f0f', margin: '8px 0' }} />

          {/* Nav section label */}
          <div style={{ padding: '0 10px', marginBottom: '6px' }}>
            <span style={{ fontSize: '10px', fontWeight: 600, color: '#1e1e1e', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              Workspace
            </span>
          </div>

          {/* Nav items */}
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '1px', flex: 1 }}>
            {navItems.map((item) => {
              const active = isActive(item.path)
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '9px',
                    padding: '8px 10px',
                    borderRadius: '8px',
                    textDecoration: 'none',
                    fontSize: '13px',
                    fontWeight: active ? 500 : 400,
                    color: active ? '#e0e0e0' : '#3a3a3a',
                    backgroundColor: active ? '#111111' : 'transparent',
                    border: `1px solid ${active ? '#1a1a1a' : 'transparent'}`,
                    transition: 'all 0.15s',
                    letterSpacing: '-0.01em',
                    position: 'relative',
                  }}
                  onMouseEnter={(e) => {
                    if (!active) {
                      e.currentTarget.style.backgroundColor = '#0d0d0d'
                      e.currentTarget.style.color = '#777777'
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!active) {
                      e.currentTarget.style.backgroundColor = 'transparent'
                      e.currentTarget.style.color = '#3a3a3a'
                    }
                  }}
                >
                  {/* Active left bar */}
                  {active && (
                    <div style={{
                      position: 'absolute', left: 0, top: '50%',
                      transform: 'translateY(-50%)',
                      width: '2px', height: '16px',
                      backgroundColor: '#7c6af7',
                      borderRadius: '0 2px 2px 0',
                      boxShadow: '0 0 8px rgba(124,106,247,0.6)',
                    }} />
                  )}

                  <span style={{
                    color: active ? '#7c6af7' : 'inherit',
                    flexShrink: 0,
                    marginLeft: active ? '2px' : '0',
                  }}>
                    {item.icon}
                  </span>

                  <span style={{ flex: 1 }}>{item.label}</span>

                  {active && (
                    <div style={{
                      width: '5px', height: '5px', borderRadius: '50%',
                      backgroundColor: '#7c6af7',
                      opacity: 0.6,
                      flexShrink: 0,
                    }} />
                  )}
                </Link>
              )
            })}
          </nav>

          {/* Bottom section */}
          <div>
            <div style={{ height: '1px', backgroundColor: '#0f0f0f', margin: '8px 0 12px' }} />

            {/* User profile */}
            <div style={{ position: 'relative' }}>
              <div
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '9px',
                  padding: '8px 10px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  border: `1px solid ${userMenuOpen ? '#1a1a1a' : 'transparent'}`,
                  backgroundColor: userMenuOpen ? '#111111' : 'transparent',
                  transition: 'all 0.15s',
                }}
                onMouseEnter={(e) => {
                  if (!userMenuOpen) {
                    e.currentTarget.style.backgroundColor = '#0d0d0d'
                    e.currentTarget.style.borderColor = '#141414'
                  }
                }}
                onMouseLeave={(e) => {
                  if (!userMenuOpen) {
                    e.currentTarget.style.backgroundColor = 'transparent'
                    e.currentTarget.style.borderColor = 'transparent'
                  }
                }}
              >
                {/* Avatar */}
                <div style={{
                  width: '26px', height: '26px', borderRadius: '50%',
                  background: 'linear-gradient(135deg, rgba(124,106,247,0.3), rgba(124,106,247,0.1))',
                  border: '1px solid rgba(124,106,247,0.2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '11px', fontWeight: 600, color: '#9d8ff5',
                  flexShrink: 0,
                }}>
                  {(user?.name || 'U')[0].toUpperCase()}
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontSize: '12px', fontWeight: 500, color: '#555555',
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                    letterSpacing: '-0.01em',
                  }}>
                    {user?.name || 'User'}
                  </div>
                </div>

                <svg width="11" height="11" viewBox="0 0 12 12" fill="none" style={{ flexShrink: 0, color: '#222222' }}>
                  <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>

              {/* Dropdown */}
              {userMenuOpen && (
                <div style={{
                  position: 'absolute', bottom: '100%', left: 0, right: 0,
                  marginBottom: '6px',
                  backgroundColor: '#0e0e0e',
                  border: '1px solid #1a1a1a',
                  borderRadius: '10px',
                  overflow: 'hidden',
                  boxShadow: '0 -8px 32px rgba(0,0,0,0.6)',
                }}>
                  {/* User info */}
                  <div style={{ padding: '12px 14px', borderBottom: '1px solid #141414' }}>
                    <div style={{ fontSize: '12px', fontWeight: 600, color: '#777777', marginBottom: '2px' }}>
                      {user?.name}
                    </div>
                    <div style={{ fontSize: '11px', color: '#2e2e2e' }}>
                      {user?.email}
                    </div>
                  </div>

                  {/* Menu items */}
                  {[
                    { label: 'Profile settings', icon: '○' },
                    { label: 'Keyboard shortcuts', icon: '⌘' },
                  ].map((item) => (
                    <button
                      key={item.label}
                      style={{
                        width: '100%', padding: '9px 14px',
                        display: 'flex', alignItems: 'center', gap: '9px',
                        backgroundColor: 'transparent',
                        border: 'none', cursor: 'pointer',
                        fontSize: '12px', color: '#444444',
                        fontFamily: 'inherit', textAlign: 'left',
                        transition: 'all 0.15s',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#141414'
                        e.currentTarget.style.color = '#888888'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent'
                        e.currentTarget.style.color = '#444444'
                      }}
                    >
                      <span style={{ fontSize: '13px' }}>{item.icon}</span>
                      {item.label}
                    </button>
                  ))}

                  <div style={{ height: '1px', backgroundColor: '#141414' }} />

                  <button
                    onClick={handleLogout}
                    style={{
                      width: '100%', padding: '9px 14px',
                      display: 'flex', alignItems: 'center', gap: '9px',
                      backgroundColor: 'transparent',
                      border: 'none', cursor: 'pointer',
                      fontSize: '12px', color: '#ef4444',
                      fontFamily: 'inherit', textAlign: 'left',
                      transition: 'all 0.15s',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(239,68,68,0.05)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent'
                    }}
                  >
                    <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                      <path d="M5 11H2.5A1.5 1.5 0 011 9.5v-6A1.5 1.5 0 012.5 2H5M9 9.5l3-3-3-3M12 6.5H5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    Sign out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Main area ── */}
      <div style={{
        flex: 1,
        marginLeft: '232px',
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
      }}>

        {/* Top bar */}
        <div style={{
          height: '48px',
          backgroundColor: '#060606',
          borderBottom: '1px solid #0c0c0c',
          display: 'flex', alignItems: 'center',
          padding: '0 28px',
          position: 'sticky', top: 0, zIndex: 50,
          gap: '8px',
        }}>

          {/* Breadcrumb */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '7px', flex: 1 }}>
            <span style={{ fontSize: '12px', color: '#222222', letterSpacing: '-0.01em' }}>
              {currentOrg?.name}
            </span>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M4.5 2.5L7.5 6L4.5 9.5" stroke="#1a1a1a" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span style={{
              fontSize: '12px', fontWeight: 500,
              color: '#555555', letterSpacing: '-0.01em',
            }}>
              {activeItem?.label || 'Dashboard'}
            </span>
          </div>

          {/* Search */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            padding: '6px 12px',
            backgroundColor: '#0a0a0a',
            border: '1px solid #141414',
            borderRadius: '7px',
            cursor: 'pointer',
            transition: 'all 0.15s',
          }}
            onMouseEnter={(e) => e.currentTarget.style.borderColor = '#1e1e1e'}
            onMouseLeave={(e) => e.currentTarget.style.borderColor = '#141414'}
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <circle cx="5.5" cy="5.5" r="3.5" stroke="#2a2a2a" strokeWidth="1.2" />
              <path d="M8.5 8.5L11 11" stroke="#2a2a2a" strokeWidth="1.2" strokeLinecap="round" />
            </svg>
            <span style={{ fontSize: '12px', color: '#222222' }}>Search</span>
            <div style={{
              padding: '1px 5px',
              backgroundColor: '#111111',
              border: '1px solid #1a1a1a',
              borderRadius: '4px',
              fontSize: '10px', color: '#2a2a2a',
              letterSpacing: '0.02em',
            }}>
              ⌘K
            </div>
          </div>

          {/* New button */}
          <button style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            padding: '6px 12px',
            background: 'linear-gradient(135deg, #7c6af7, #5d4de8)',
            border: '1px solid rgba(124,106,247,0.3)',
            borderRadius: '7px',
            cursor: 'pointer',
            fontSize: '12px', fontWeight: 500, color: 'white',
            fontFamily: 'inherit',
            boxShadow: '0 2px 10px rgba(124,106,247,0.25)',
            transition: 'all 0.15s',
          }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = '0 4px 16px rgba(124,106,247,0.4)'
              e.currentTarget.style.transform = 'translateY(-1px)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = '0 2px 10px rgba(124,106,247,0.25)'
              e.currentTarget.style.transform = 'translateY(0)'
            }}
          >
            <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
              <path d="M5.5 1v9M1 5.5h9" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            New
          </button>
        </div>

        {/* Page content */}
        <div style={{ flex: 1, padding: '28px 32px' }}>
          {children}
        </div>
      </div>
    </div>
  )
}