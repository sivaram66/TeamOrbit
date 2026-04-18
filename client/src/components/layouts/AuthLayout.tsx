interface AuthLayoutProps {
  children: React.ReactNode
}

export const AuthLayout = ({ children }: AuthLayoutProps) => {
  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#060606',
      display: 'flex',
      fontFamily: "'Inter', system-ui, sans-serif",
    }}>

      {/* ── Left panel ── */}
      <div style={{
        width: '48%',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        padding: '44px 48px',
        borderRight: '1px solid #111111',
        overflow: 'hidden',
      }}>

        {/* Background layers */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse 80% 60% at 20% 60%, rgba(124,106,247,0.11) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse 50% 40% at 70% 20%, rgba(124,106,247,0.05) 0%, transparent 60%)',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.018) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.018) 1px, transparent 1px)
          `,
          backgroundSize: '44px 44px',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: '180px',
          background: 'linear-gradient(to top, #060606, transparent)',
          pointerEvents: 'none',
        }} />

        {/* Logo */}
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '32px', height: '32px', borderRadius: '9px',
            background: 'linear-gradient(135deg, #8b7cf8, #6b59e8)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 0 1px rgba(124,106,247,0.3), 0 4px 20px rgba(124,106,247,0.4)',
          }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <circle cx="8" cy="8" r="3" fill="white" />
              <circle cx="8" cy="8" r="6.5" stroke="white" strokeWidth="1" strokeDasharray="3 2" strokeOpacity="0.6" />
            </svg>
          </div>
          <span style={{ fontSize: '15px', fontWeight: 600, color: '#ececec', letterSpacing: '-0.025em' }}>
            TeamOrbit
          </span>
        </div>

        {/* Main content */}
        <div style={{
          flex: 1, display: 'flex', flexDirection: 'column',
          justifyContent: 'center', position: 'relative', gap: '44px',
        }}>

          {/* Headline */}
          <div>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '7px',
              padding: '5px 10px',
              backgroundColor: 'rgba(124,106,247,0.1)',
              border: '1px solid rgba(124,106,247,0.2)',
              borderRadius: '20px',
              marginBottom: '22px',
            }}>
              <div style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: '#7c6af7' }} />
              <span style={{ fontSize: '11px', color: '#9d8ff5', fontWeight: 500, letterSpacing: '0.02em' }}>
                Now in public beta
              </span>
            </div>
            <h2 style={{
              fontSize: '38px', fontWeight: 700, lineHeight: 1.08,
              letterSpacing: '-0.05em', color: '#f0f0f0',
              marginBottom: '18px',
            }}>
              Where great<br />
              teams{' '}
              <span style={{
                backgroundImage: 'linear-gradient(135deg, #a395f9, #7c6af7)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}>
                orbit
              </span>
              <br />
              their work.
            </h2>
            <p style={{ fontSize: '14px', color: '#3a3a3a', lineHeight: 1.7, maxWidth: '300px' }}>
              Projects, tasks, and team collaboration — unified in one precision-built workspace.
            </p>
          </div>

          {/* UI Preview cards */}
          <div style={{ position: 'relative', height: '230px' }}>

            {/* Notification pill */}
            <div style={{
              position: 'absolute', top: '-10px', right: '10px',
              display: 'flex', alignItems: 'center', gap: '8px',
              padding: '7px 13px',
              backgroundColor: '#0e0e0e',
              border: '1px solid #1e1e1e',
              borderRadius: '20px',
              boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
              zIndex: 10,
            }}>
              <div style={{
                width: '6px', height: '6px', borderRadius: '50%',
                backgroundColor: '#22c55e',
                boxShadow: '0 0 6px rgba(34,197,94,0.7)',
              }} />
              <span style={{ fontSize: '11px', color: '#777777', fontWeight: 500 }}>
                Alex completed a task
              </span>
            </div>

            {/* Main task card */}
            <div style={{
              position: 'absolute', top: '20px', left: 0, width: '310px',
              backgroundColor: '#0e0e0e',
              border: '1px solid #1c1c1c',
              borderRadius: '12px',
              padding: '18px 20px',
              boxShadow: '0 24px 48px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.015)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
                  <div style={{
                    width: '6px', height: '6px', borderRadius: '50%',
                    backgroundColor: '#7c6af7',
                    boxShadow: '0 0 6px rgba(124,106,247,0.6)',
                  }} />
                  <span style={{ fontSize: '11px', color: '#444444', fontWeight: 600, letterSpacing: '0.06em' }}>
                    SPRINT 24
                  </span>
                </div>
                <div style={{
                  padding: '3px 8px', borderRadius: '4px',
                  backgroundColor: 'rgba(34,197,94,0.08)',
                  border: '1px solid rgba(34,197,94,0.15)',
                }}>
                  <span style={{ fontSize: '10px', color: '#22c55e', fontWeight: 600 }}>Active</span>
                </div>
              </div>

              <div style={{ fontSize: '13px', fontWeight: 600, color: '#e0e0e0', marginBottom: '16px', letterSpacing: '-0.015em' }}>
                Redesign dashboard layout
              </div>

              <div style={{ marginBottom: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '7px' }}>
                  <span style={{ fontSize: '11px', color: '#333333' }}>Progress</span>
                  <span style={{ fontSize: '11px', color: '#7c6af7', fontWeight: 600 }}>68%</span>
                </div>
                <div style={{ height: '3px', backgroundColor: '#1a1a1a', borderRadius: '2px', overflow: 'hidden' }}>
                  <div style={{
                    width: '68%', height: '100%',
                    background: 'linear-gradient(90deg, #5d4de8, #9d8ff5)',
                    borderRadius: '2px',
                  }} />
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex' }}>
                  {['#7c6af7', '#22c55e', '#f59e0b', '#ef4444'].map((color, i) => (
                    <div key={i} style={{
                      width: '24px', height: '24px', borderRadius: '50%',
                      backgroundColor: color,
                      border: '2px solid #0e0e0e',
                      marginLeft: i > 0 ? '-7px' : 0,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '9px', color: 'white', fontWeight: 700,
                    }}>
                      {['S', 'J', 'M', 'A'][i]}
                    </div>
                  ))}
                  <span style={{ fontSize: '11px', color: '#333333', marginLeft: '10px', alignSelf: 'center' }}>
                    4 assigned
                  </span>
                </div>
              </div>
            </div>

            {/* Stats card */}
            <div style={{
              position: 'absolute', bottom: 0, right: 0, width: '200px',
              backgroundColor: '#0b0b0b',
              border: '1px solid #181818',
              borderRadius: '12px',
              padding: '16px 18px',
              boxShadow: '0 16px 32px rgba(0,0,0,0.5)',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                <span style={{ fontSize: '11px', color: '#363636', fontWeight: 500 }}>Tasks this week</span>
                <div style={{ padding: '2px 6px', borderRadius: '4px', backgroundColor: 'rgba(34,197,94,0.08)' }}>
                  <span style={{ fontSize: '10px', color: '#22c55e', fontWeight: 600 }}>↑ 12%</span>
                </div>
              </div>
              <div style={{ fontSize: '26px', fontWeight: 700, color: '#f0f0f0', letterSpacing: '-0.05em', marginBottom: '12px' }}>
                84
                <span style={{ fontSize: '13px', color: '#2a2a2a', fontWeight: 400 }}> / 97</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: '3px', height: '30px' }}>
                {[40, 65, 45, 80, 55, 90, 70].map((h, i) => (
                  <div key={i} style={{
                    flex: 1,
                    height: `${h}%`,
                    borderRadius: '2px',
                    backgroundColor: i === 5 ? '#7c6af7' : '#1a1a1a',
                    boxShadow: i === 5 ? '0 0 8px rgba(124,106,247,0.5)' : 'none',
                    transition: 'background-color 0.2s',
                  }} />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Testimonial */}
        <div style={{ position: 'relative' }}>
          <div style={{
            padding: '18px 20px',
            backgroundColor: '#0b0b0b',
            border: '1px solid #161616',
            borderRadius: '12px',
          }}>
            <div style={{ display: 'flex', gap: '3px', marginBottom: '12px' }}>
              {[...Array(5)].map((_, i) => (
                <svg key={i} width="11" height="11" viewBox="0 0 10 10" fill="#7c6af7">
                  <path d="M5 0l1.12 3.38H9.51L6.82 5.47l1.12 3.38L5 6.76 2.06 8.85l1.12-3.38L.49 3.38h3.39z" />
                </svg>
              ))}
            </div>
            <p style={{ fontSize: '13px', color: '#484848', lineHeight: 1.65, marginBottom: '14px', fontStyle: 'italic' }}>
              "TeamOrbit transformed how we ship. Our team went from chaotic Notion docs to a focused, fast workflow in one week."
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: '30px', height: '30px', borderRadius: '50%',
                background: 'linear-gradient(135deg, #7c6af7, #22c55e)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '12px', color: 'white', fontWeight: 700,
              }}>
                S
              </div>
              <div>
                <div style={{ fontSize: '12px', color: '#aaaaaa', fontWeight: 600 }}>Sarah Chen</div>
                <div style={{ fontSize: '11px', color: '#2e2e2e' }}>Engineering Lead · Veritas Inc.</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Right panel ── */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '60px 64px',
        backgroundColor: '#060606',
        position: 'relative',
      }}>
        {/* Corner glows */}
        <div style={{
          position: 'absolute', top: 0, right: 0,
          width: '350px', height: '350px',
          background: 'radial-gradient(ellipse at top right, rgba(124,106,247,0.05) 0%, transparent 65%)',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', bottom: 0, left: 0,
          width: '250px', height: '250px',
          background: 'radial-gradient(ellipse at bottom left, rgba(124,106,247,0.03) 0%, transparent 65%)',
          pointerEvents: 'none',
        }} />

        {/* Form — no card, no box */}
        <div style={{ width: '100%', maxWidth: '360px', position: 'relative' }}>
          {children}
        </div>

        {/* Trust badges */}
        <div style={{
          position: 'absolute', bottom: '28px',
          display: 'flex', alignItems: 'center', gap: '20px',
        }}>
          {['SOC 2 Type II', '256-bit encryption', 'GDPR compliant'].map((badge, i) => (
            <div key={badge} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              {i > 0 && (
                <div style={{ width: '3px', height: '3px', borderRadius: '50%', backgroundColor: '#1e1e1e', marginRight: '14px' }} />
              )}
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                <path d="M5 1L6.5 4H9L6.75 5.75 7.5 9 5 7.25 2.5 9l.75-3.25L1 4h2.5z" fill="#252525" />
              </svg>
              <span style={{ fontSize: '11px', color: '#252525', letterSpacing: '0.01em' }}>
                {badge}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}