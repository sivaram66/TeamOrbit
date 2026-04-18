import { useState } from 'react'
import { Link, useLocation, useParams, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../stores/auth.store'
import { useOrgStore } from '../../stores/org.store'

interface NavItem {
  label: string
  path: string
  icon: React.ReactNode
}

const IconGrid = () => (
  <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
    <rect x="1" y="1" width="5.5" height="5.5" rx="1" stroke="currentColor" strokeWidth="1.2" />
    <rect x="8.5" y="1" width="5.5" height="5.5" rx="1" stroke="currentColor" strokeWidth="1.2" />
    <rect x="1" y="8.5" width="5.5" height="5.5" rx="1" stroke="currentColor" strokeWidth="1.2" />
    <rect x="8.5" y="8.5" width="5.5" height="5.5" rx="1" stroke="currentColor" strokeWidth="1.2" />
  </svg>
)

const IconLayers = () => (
  <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
    <path d="M7.5 1L13.5 4.5L7.5 8L1.5 4.5L7.5 1Z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
    <path d="M1.5 7.5L7.5 11L13.5 7.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M1.5 10.5L7.5 14L13.5 10.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const IconUsers = () => (
  <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
    <circle cx="5.5" cy="5" r="2.5" stroke="currentColor" strokeWidth="1.2" />
    <path d="M1 13c0-2.485 2.015-4.5 4.5-4.5S10 10.515 10 13" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    <circle cx="11" cy="5" r="2" stroke="currentColor" strokeWidth="1.2" />
    <path d="M13 13c0-1.933-1.567-3.5-3.5-3.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
  </svg>
)

const IconSettings = () => (
  <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
    <circle cx="7.5" cy="7.5" r="2" stroke="currentColor" strokeWidth="1.2" />
    <path d="M7.5 1v2M7.5 12v2M1 7.5h2M12 7.5h2M2.93 2.93l1.41 1.41M10.66 10.66l1.41 1.41M2.93 12.07l1.41-1.41M10.66 4.34l1.41-1.41" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
  </svg>
)

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

  const navItems: NavItem[] = [
    {
      label: 'Overview',
      path: `/org/${orgSlug}/dashboard`,
      icon: <IconGrid />,
    },
    {
      label: 'Projects',
      path: `/org/${orgSlug}/projects`,
      icon: <IconLayers />,
    },
    {
      label: 'Members',
      path: `/org/${orgSlug}/members`,
      icon: <IconUsers />,
    },
    {
      label: 'Settings',
      path: `/org/${orgSlug}/settings`,
      icon: <IconSettings />,
    },
  ]

  const handleLogout = () => {
    clearAuth()
    clearOrg()
    navigate('/login')
  }

  const isActive = (path: string) => location.pathname === path

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#060606',
      display: 'flex',
      fontFamily: "'Inter', system-ui, sans-serif",
    }}>

      {/* Sidebar */}
      <div style={{
        width: '220px',
        flexShrink: 0,
        backgroundColor: '#080808',
        borderRight: '1px solid #111111',
        display: 'flex',
        flexDirection: 'column',
        padding: '16px 12px',
        position: 'fixed',
        top: 0, left: 0, bottom: 0,
        zIndex: 100,
      }}>

        {/* Org selector */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '10px',
          padding: '8px 10px',
          borderRadius: '8px',
          cursor: 'pointer',
          marginBottom: '8px',
          transition: 'background 0.15s',
          border: '1px solid transparent',
        }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#111111'
            e.currentTarget.style.borderColor = '#181818'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent'
            e.currentTarget.style.borderColor = 'transparent'
          }}
        >
          {/* Org avatar */}
          <div style={{
            width: '26px', height: '26px', borderRadius: '7px',
            background: 'linear-gradient(135deg, #7c6af7, #5d4de8)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '11px', fontWeight: 700, color: 'white',
            flexShrink: 0,
          }}>
            {(currentOrg?.name || 'O')[0].toUpperCase()}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{
              fontSize: '13px', fontWeight: 600, color: '#d8d8d8',
              letterSpacing: '-0.02em',
              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            }}>
              {currentOrg?.name || 'My Org'}
            </div>
            <div style={{ fontSize: '10px', color: '#333333', marginTop: '1px' }}>
              {currentOrg?.plan || 'free'} plan
            </div>
          </div>
          {/* Chevron */}
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ flexShrink: 0, color: '#333333' }}>
            <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        {/* Divider */}
        <div style={{ height: '1px', backgroundColor: '#111111', margin: '4px 0 12px' }} />

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
                  padding: '7px 10px',
                  borderRadius: '7px',
                  textDecoration: 'none',
                  fontSize: '13px', fontWeight: active ? 500 : 400,
                  color: active ? '#e8e8e8' : '#444444',
                  backgroundColor: active ? '#111111' : 'transparent',
                  border: `1px solid ${active ? '#1c1c1c' : 'transparent'}`,
                  transition: 'all 0.15s',
                }}
                onMouseEnter={(e) => {
                  if (!active) {
                    e.currentTarget.style.backgroundColor = '#0e0e0e'
                    e.currentTarget.style.color = '#888888'
                  }
                }}
                onMouseLeave={(e) => {
                  if (!active) {
                    e.currentTarget.style.backgroundColor = 'transparent'
                    e.currentTarget.style.color = '#444444'
                  }
                }}
              >
                <span style={{ color: active ? '#7c6af7' : 'currentColor', flexShrink: 0 }}>
                  {item.icon}
                </span>
                {item.label}
                {active && (
                  <div style={{
                    marginLeft: 'auto',
                    width: '4px', height: '4px', borderRadius: '50%',
                    backgroundColor: '#7c6af7',
                  }} />
                )}
              </Link>
            )
          })}
        </nav>

        {/* Bottom section */}
        <div>
          <div style={{ height: '1px', backgroundColor: '#111111', marginBottom: '12px' }} />

          {/* User menu */}
          <div style={{ position: 'relative' }}>
            <div
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              style={{
                display: 'flex', alignItems: 'center', gap: '10px',
                padding: '8px 10px',
                borderRadius: '8px',
                cursor: 'pointer',
                border: '1px solid transparent',
                transition: 'all 0.15s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#111111'
                e.currentTarget.style.borderColor = '#181818'
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
                backgroundColor: '#1a1a1a',
                border: '1px solid #222222',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '11px', fontWeight: 600, color: '#7c6af7',
                flexShrink: 0,
              }}>
                {(user?.name || 'U')[0].toUpperCase()}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                  fontSize: '12px', fontWeight: 500, color: '#888888',
                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                  letterSpacing: '-0.01em',
                }}>
                  {user?.name || 'User'}
                </div>
              </div>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ flexShrink: 0, color: '#2a2a2a' }}>
                <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>

            {/* User dropdown */}
            {userMenuOpen && (
              <div style={{
                position: 'absolute', bottom: '100%', left: 0, right: 0,
                marginBottom: '6px',
                backgroundColor: '#0f0f0f',
                border: '1px solid #1c1c1c',
                borderRadius: '8px',
                overflow: 'hidden',
                boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
              }}>
                <div style={{ padding: '10px 12px', borderBottom: '1px solid #141414' }}>
                  <div style={{ fontSize: '12px', fontWeight: 500, color: '#888888' }}>
                    {user?.name}
                  </div>
                  <div style={{ fontSize: '11px', color: '#333333', marginTop: '2px' }}>
                    {user?.email}
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  style={{
                    width: '100%', padding: '9px 12px',
                    display: 'flex', alignItems: 'center', gap: '8px',
                    backgroundColor: 'transparent',
                    border: 'none', cursor: 'pointer',
                    fontSize: '12px', color: '#ef4444',
                    fontFamily: 'inherit',
                    textAlign: 'left',
                    transition: 'background 0.15s',
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#141414'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                    <path d="M5 11H2.5A1.5 1.5 0 011 9.5v-6A1.5 1.5 0 012.5 2H5M9 9l3-3-3-3M12 6.5H5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  Sign out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main content */}
      <div style={{
        flex: 1,
        marginLeft: '220px',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
      }}>
        {/* Top bar */}
        <div style={{
          height: '52px',
          borderBottom: '1px solid #0f0f0f',
          display: 'flex', alignItems: 'center',
          padding: '0 24px',
          position: 'sticky', top: 0,
          backgroundColor: '#060606',
          zIndex: 50,
        }}>
          {/* Breadcrumb */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '13px', color: '#2e2e2e' }}>
              {currentOrg?.name || 'Organization'}
            </span>
            <span style={{ fontSize: '13px', color: '#1e1e1e' }}>/</span>
            <span style={{ fontSize: '13px', color: '#666666', fontWeight: 500 }}>
              {navItems.find(n => isActive(n.path))?.label || 'Dashboard'}
            </span>
          </div>

          {/* Right side */}
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{
              padding: '5px 10px',
              backgroundColor: '#0e0e0e',
              border: '1px solid #161616',
              borderRadius: '6px',
              display: 'flex', alignItems: 'center', gap: '6px',
              cursor: 'pointer',
            }}>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <circle cx="5.5" cy="5.5" r="3.5" stroke="#333333" strokeWidth="1.2" />
                <path d="M8.5 8.5L11 11" stroke="#333333" strokeWidth="1.2" strokeLinecap="round" />
              </svg>
              <span style={{ fontSize: '12px', color: '#2e2e2e' }}>Search</span>
              <span style={{
                fontSize: '10px', color: '#222222',
                padding: '1px 4px',
                backgroundColor: '#141414',
                borderRadius: '3px',
              }}>⌘K</span>
            </div>
          </div>
        </div>

        {/* Page content */}
        <div style={{ flex: 1, padding: '32px' }}>
          {children}
        </div>
      </div>
    </div>
  )
}