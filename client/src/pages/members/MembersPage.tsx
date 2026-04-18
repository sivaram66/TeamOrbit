import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '../../lib/axios'
import { useAuthStore } from '../../stores/auth.store'

interface Member {
  id: string
  role: string
  createdAt: string
  userId: string
  orgId: string
  user: {
    id: string
    name: string
    email: string
  }
}

const ROLE_COLORS: Record<string, { color: string; bg: string; border: string }> = {
  owner: { color: '#a395f9', bg: 'rgba(124,106,247,0.08)', border: 'rgba(124,106,247,0.2)' },
  admin: { color: '#60a5fa', bg: 'rgba(96,165,250,0.08)', border: 'rgba(96,165,250,0.2)' },
  member: { color: '#555555', bg: 'rgba(255,255,255,0.04)', border: 'rgba(255,255,255,0.07)' },
}

const InviteModal = ({ onClose, orgSlug }: { onClose: () => void; orgSlug: string }) => {
  const queryClient = useQueryClient()
  const [email, setEmail] = useState('')
  const [role, setRole] = useState<'member' | 'admin'>('member')
  const [emailFocused, setEmailFocused] = useState(false)
  const [error, setError] = useState('')

  const mutation = useMutation({
    mutationFn: async () => {
      const res = await api.post(`/orgs/${orgSlug}/invites`, { email, role })
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['members', orgSlug] })
      onClose()
    },
    onError: (err: any) => setError(err.response?.data?.message || 'Something went wrong'),
  })

  return (
    <div
      onClick={(e) => e.target === e.currentTarget && onClose()}
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        backgroundColor: 'rgba(0,0,0,0.85)',
        backdropFilter: 'blur(8px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '24px',
      }}
    >
      <div style={{
        width: '100%', maxWidth: '440px',
        backgroundColor: '#111111',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '16px', padding: '32px',
        boxShadow: '0 48px 120px rgba(0,0,0,0.9), inset 0 1px 0 rgba(255,255,255,0.04)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '28px' }}>
          <div>
            <h2 style={{ fontSize: '17px', fontWeight: 600, color: '#ffffff', letterSpacing: '-0.03em', marginBottom: '5px' }}>
              Invite member
            </h2>
            <p style={{ fontSize: '13px', color: '#444444' }}>
              Send an invite link to their email address.
            </p>
          </div>
          <button onClick={onClose} style={{
            width: '30px', height: '30px', borderRadius: '8px',
            backgroundColor: 'transparent', border: '1px solid rgba(255,255,255,0.07)',
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#333333', transition: 'all 0.15s',
          }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = '#888' }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#333333' }}
          >
            <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
              <path d="M1.5 1.5l8 8M9.5 1.5l-8 8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '12px', fontWeight: 500, color: '#444444' }}>Email address</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onFocus={() => setEmailFocused(true)}
              onBlur={() => setEmailFocused(false)}
              onKeyDown={(e) => { if (e.key === 'Enter' && email.trim()) mutation.mutate() }}
              placeholder="colleague@company.com"
              autoFocus
              style={{
                width: '100%', padding: '11px 14px',
                fontSize: '14px', color: '#f0f0f0',
                backgroundColor: emailFocused ? '#161616' : '#0d0d0d',
                border: `1px solid ${emailFocused ? 'rgba(124,106,247,0.5)' : 'rgba(255,255,255,0.07)'}`,
                borderRadius: '10px', outline: 'none',
                fontFamily: 'inherit', letterSpacing: '-0.01em',
                caretColor: '#7c6af7', transition: 'all 0.15s',
                boxShadow: emailFocused ? '0 0 0 3px rgba(124,106,247,0.08)' : 'none',
              }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '12px', fontWeight: 500, color: '#444444' }}>Role</label>
            <div style={{ display: 'flex', gap: '8px' }}>
              {(['member', 'admin'] as const).map((r) => (
                <button
                  key={r}
                  onClick={() => setRole(r)}
                  style={{
                    flex: 1, padding: '10px 14px',
                    backgroundColor: role === r ? 'rgba(255,255,255,0.05)' : 'transparent',
                    border: `1px solid ${role === r ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.06)'}`,
                    borderRadius: '9px',
                    cursor: 'pointer', fontFamily: 'inherit',
                    transition: 'all 0.15s', textAlign: 'left',
                  }}
                >
                  <div style={{ fontSize: '13px', fontWeight: 500, color: role === r ? '#e8e8e8' : '#444444', marginBottom: '3px', textTransform: 'capitalize' }}>
                    {r}
                  </div>
                  <div style={{ fontSize: '11px', color: '#2e2e2e' }}>
                    {r === 'member' ? 'Can view and create tasks' : 'Can manage members and settings'}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {error && <span style={{ fontSize: '12px', color: '#ef4444' }}>{error}</span>}

          <div style={{ display: 'flex', gap: '10px', paddingTop: '8px' }}>
            <button onClick={onClose} style={{
              flex: 1, padding: '11px',
              backgroundColor: 'transparent',
              border: '1px solid rgba(255,255,255,0.07)', borderRadius: '10px',
              color: '#444444', fontSize: '13px', fontWeight: 500,
              cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s',
            }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'; e.currentTarget.style.color = '#888888' }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'; e.currentTarget.style.color = '#444444' }}
            >
              Cancel
            </button>
            <button
              onClick={() => { if (!email.trim()) { setError('Email is required'); return } mutation.mutate() }}
              disabled={mutation.isPending}
              style={{
                flex: 1, padding: '11px',
                background: 'linear-gradient(135deg, #7c6af7, #5d4de8)',
                border: '1px solid rgba(124,106,247,0.4)', borderRadius: '10px',
                color: 'white', fontSize: '13px', fontWeight: 500,
                cursor: mutation.isPending ? 'not-allowed' : 'pointer',
                fontFamily: 'inherit', opacity: mutation.isPending ? 0.6 : 1,
                boxShadow: '0 2px 16px rgba(124,106,247,0.3), inset 0 1px 0 rgba(255,255,255,0.1)',
                transition: 'all 0.15s',
              }}
            >
              {mutation.isPending ? 'Sending...' : 'Send invite'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

const MemberRow = ({
  member,
  currentUserId,
  currentUserRole,
  orgSlug,
}: {
  member: Member
  currentUserId: string
  currentUserRole: string
  orgSlug: string
}) => {
  const queryClient = useQueryClient()
  const [menuOpen, setMenuOpen] = useState(false)
  const roleStyle = ROLE_COLORS[member.role] || ROLE_COLORS.member
  const isCurrentUser = member.user.id === currentUserId
  const canManage = (currentUserRole === 'owner' || currentUserRole === 'admin') && !isCurrentUser && member.role !== 'owner'

  const removeMutation = useMutation({
    mutationFn: async () => {
      await api.delete(`/orgs/${orgSlug}/members/${member.user.id}`)
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['members', orgSlug] }),
  })

  const changeRoleMutation = useMutation({
    mutationFn: async (newRole: string) => {
      await api.patch(`/orgs/${orgSlug}/members/${member.user.id}/role`, { role: newRole })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['members', orgSlug] })
      setMenuOpen(false)
    },
  })

  const joinedDaysAgo = Math.floor(
    (Date.now() - new Date(member.createdAt).getTime()) / 86400000
  )

  return (
    <div style={{
      display: 'flex', alignItems: 'center',
      padding: '16px 20px',
      borderBottom: '1px solid rgba(255,255,255,0.04)',
      transition: 'background 0.15s',
    }}
      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.01)'}
      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
    >
      {/* Avatar */}
      <div style={{
        width: '36px', height: '36px', borderRadius: '50%',
        background: 'linear-gradient(135deg, rgba(124,106,247,0.3), rgba(124,106,247,0.1))',
        border: '1px solid rgba(124,106,247,0.2)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '13px', fontWeight: 600, color: '#a395f9',
        flexShrink: 0, marginRight: '14px',
      }}>
        {member.user.name[0].toUpperCase()}
      </div>

      {/* Name + email */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '3px' }}>
          <span style={{ fontSize: '14px', fontWeight: 500, color: '#e8e8e8', letterSpacing: '-0.02em' }}>
            {member.user.name}
          </span>
          {isCurrentUser && (
            <span style={{
              fontSize: '10px', fontWeight: 600, color: '#555555',
              backgroundColor: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: '4px', padding: '1px 6px',
            }}>
              You
            </span>
          )}
        </div>
        <span style={{ fontSize: '12px', color: '#3a3a3a' }}>
          {member.user.email}
        </span>
      </div>

      {/* Joined */}
      <div style={{ marginRight: '24px', textAlign: 'right' }}>
        <span style={{ fontSize: '12px', color: '#2e2e2e' }}>
          {joinedDaysAgo === 0 ? 'Today' : joinedDaysAgo === 1 ? 'Yesterday' : `${joinedDaysAgo}d ago`}
        </span>
      </div>

      {/* Role badge */}
      <div style={{ marginRight: '16px' }}>
        <span style={{
          fontSize: '11px', fontWeight: 600,
          color: roleStyle.color,
          backgroundColor: roleStyle.bg,
          border: `1px solid ${roleStyle.border}`,
          borderRadius: '5px', padding: '3px 9px',
          textTransform: 'capitalize', letterSpacing: '0.01em',
        }}>
          {member.role}
        </span>
      </div>

      {/* Actions */}
      {canManage && (
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            style={{
              width: '30px', height: '30px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              backgroundColor: menuOpen ? 'rgba(255,255,255,0.06)' : 'transparent',
              border: `1px solid ${menuOpen ? 'rgba(255,255,255,0.1)' : 'transparent'}`,
              borderRadius: '7px', cursor: 'pointer',
              color: '#444444', transition: 'all 0.15s',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = '#888888' }}
            onMouseLeave={(e) => {
              if (!menuOpen) {
                e.currentTarget.style.backgroundColor = 'transparent'
                e.currentTarget.style.color = '#444444'
              }
            }}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <circle cx="7" cy="3" r="1" fill="currentColor" />
              <circle cx="7" cy="7" r="1" fill="currentColor" />
              <circle cx="7" cy="11" r="1" fill="currentColor" />
            </svg>
          </button>

          {menuOpen && (
            <div
              style={{
                position: 'absolute', right: 0, top: '100%',
                marginTop: '6px', zIndex: 100,
                backgroundColor: '#111111',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '10px', overflow: 'hidden',
                boxShadow: '0 16px 48px rgba(0,0,0,0.8)',
                minWidth: '180px',
              }}
              onMouseLeave={() => setMenuOpen(false)}
            >
              <div style={{ padding: '6px' }}>
                <div style={{ padding: '6px 10px', marginBottom: '4px' }}>
                  <span style={{ fontSize: '10px', color: '#333333', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                    Change role
                  </span>
                </div>
                {(['member', 'admin'] as const).filter(r => r !== member.role).map((r) => (
                  <button
                    key={r}
                    onClick={() => changeRoleMutation.mutate(r)}
                    style={{
                      width: '100%', padding: '8px 10px',
                      display: 'flex', alignItems: 'center', gap: '8px',
                      backgroundColor: 'transparent', border: 'none',
                      cursor: 'pointer', fontSize: '13px', color: '#888888',
                      fontFamily: 'inherit', textAlign: 'left',
                      borderRadius: '7px', transition: 'all 0.15s',
                      textTransform: 'capitalize',
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = '#e8e8e8' }}
                    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#888888' }}
                  >
                    Make {r}
                  </button>
                ))}
                <div style={{ height: '1px', backgroundColor: 'rgba(255,255,255,0.05)', margin: '6px 0' }} />
                <button
                  onClick={() => { if (confirm(`Remove ${member.user.name} from the organization?`)) removeMutation.mutate() }}
                  style={{
                    width: '100%', padding: '8px 10px',
                    display: 'flex', alignItems: 'center', gap: '8px',
                    backgroundColor: 'transparent', border: 'none',
                    cursor: 'pointer', fontSize: '13px', color: '#ef4444',
                    fontFamily: 'inherit', textAlign: 'left',
                    borderRadius: '7px', transition: 'all 0.15s',
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(239,68,68,0.06)'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                    <path d="M2 3.5h9M4.5 3.5V2.5a.5.5 0 01.5-.5h3a.5.5 0 01.5.5v1M10.5 3.5l-.5 7a1 1 0 01-1 .9H4a1 1 0 01-1-.9l-.5-7" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  Remove member
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {!canManage && <div style={{ width: '30px' }} />}
    </div>
  )
}

export const MembersPage = () => {
  const { slug } = useParams<{ slug: string }>()
  const { user } = useAuthStore()
  const [showInvite, setShowInvite] = useState(false)

  const { data: members, isLoading } = useQuery({
    queryKey: ['members', slug],
    queryFn: async () => {
      const res = await api.get(`/orgs/${slug}/members`)
      return res.data.data as Member[]
    },
    enabled: !!slug,
  })

  const currentMember = members?.find(m => m.user.id === user?.id)
  const currentUserRole = currentMember?.role || 'member'
  const canInvite = currentUserRole === 'owner' || currentUserRole === 'admin'

  return (
    <div style={{ maxWidth: '900px' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '32px' }}>
        <div>
          <h1 style={{
            fontSize: '26px', fontWeight: 700,
            color: '#ffffff', letterSpacing: '-0.05em',
            marginBottom: '6px', lineHeight: 1,
          }}>
            Members
          </h1>
          <p style={{ fontSize: '13px', color: '#555555', letterSpacing: '-0.01em' }}>
            {members?.length || 0} {members?.length === 1 ? 'member' : 'members'} in this workspace
          </p>
        </div>

        {canInvite && (
          <button
            onClick={() => setShowInvite(true)}
            style={{
              display: 'flex', alignItems: 'center', gap: '7px',
              padding: '9px 16px',
              background: 'linear-gradient(135deg, #7c6af7, #5d4de8)',
              border: '1px solid rgba(124,106,247,0.4)', borderRadius: '9px',
              color: 'white', fontSize: '13px', fontWeight: 500,
              cursor: 'pointer', fontFamily: 'inherit',
              boxShadow: '0 2px 12px rgba(124,106,247,0.25), inset 0 1px 0 rgba(255,255,255,0.1)',
              transition: 'all 0.15s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = '0 4px 20px rgba(124,106,247,0.45), inset 0 1px 0 rgba(255,255,255,0.1)'
              e.currentTarget.style.transform = 'translateY(-1px)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = '0 2px 12px rgba(124,106,247,0.25), inset 0 1px 0 rgba(255,255,255,0.1)'
              e.currentTarget.style.transform = 'translateY(0)'
            }}
          >
            <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
              <path d="M5.5 1v9M1 5.5h9" stroke="white" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
            Invite member
          </button>
        )}
      </div>

      {/* Members table */}
      <div style={{
        backgroundColor: 'rgba(255,255,255,0.015)',
        border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: '14px',
        overflow: 'hidden',
      }}>
        {/* Table header */}
        <div style={{
          display: 'flex', alignItems: 'center',
          padding: '12px 20px',
          borderBottom: '1px solid rgba(255,255,255,0.05)',
          backgroundColor: 'rgba(255,255,255,0.02)',
        }}>
          <div style={{ flex: 1, fontSize: '11px', fontWeight: 600, color: '#333333', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Member
          </div>
          <div style={{ marginRight: '24px', fontSize: '11px', fontWeight: 600, color: '#333333', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Joined
          </div>
          <div style={{ marginRight: '16px', fontSize: '11px', fontWeight: 600, color: '#333333', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Role
          </div>
          <div style={{ width: '30px' }} />
        </div>

        {/* Loading */}
        {isLoading && (
          <div style={{ padding: '40px', textAlign: 'center' }}>
            <span style={{ fontSize: '13px', color: '#333333' }}>Loading members...</span>
          </div>
        )}

        {/* Members list */}
        {!isLoading && members?.map((member) => (
          <MemberRow
            key={member.id}
            member={member}
            currentUserId={user?.id || ''}
            currentUserRole={currentUserRole}
            orgSlug={slug!}
          />
        ))}
      </div>

      {/* Pending invites link */}
      {canInvite && (
        <div style={{ marginTop: '16px', padding: '14px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '10px' }}>
          <div>
            <span style={{ fontSize: '13px', color: '#555555' }}>
              Manage pending invitations
            </span>
          </div>
          <button
            onClick={async () => {
              const res = await api.get(`/orgs/${slug}/invites`)
              alert(`${res.data.data.length} pending invite(s)`)
            }}
            style={{
              fontSize: '12px', color: '#7c6af7',
              backgroundColor: 'transparent', border: 'none',
              cursor: 'pointer', fontFamily: 'inherit',
              transition: 'color 0.15s',
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#a395f9'}
            onMouseLeave={(e) => e.currentTarget.style.color = '#7c6af7'}
          >
            View invites →
          </button>
        </div>
      )}

      {showInvite && <InviteModal onClose={() => setShowInvite(false)} orgSlug={slug!} />}
    </div>
  )
}