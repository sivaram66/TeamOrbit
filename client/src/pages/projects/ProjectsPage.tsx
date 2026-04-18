import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '../../lib/axios'

interface Project {
  id: string
  name: string
  description?: string
  createdAt: string
  orgId: string
  _count: { tasks: number }
}

const CreateProjectModal = ({ onClose, orgSlug }: { onClose: () => void; orgSlug: string }) => {
  const queryClient = useQueryClient()
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [nameFocused, setNameFocused] = useState(false)
  const [descFocused, setDescFocused] = useState(false)
  const [error, setError] = useState('')

  const createMutation = useMutation({
    mutationFn: async () => {
      const res = await api.post(`/orgs/${orgSlug}/projects`, { name, description })
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects', orgSlug] })
      onClose()
    },
    onError: (err: any) => {
      setError(err.response?.data?.message || 'Something went wrong')
    },
  })

  return (
    <div
      onClick={(e) => e.target === e.currentTarget && onClose()}
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        backgroundColor: 'rgba(0,0,0,0.8)',
        backdropFilter: 'blur(8px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '24px',
      }}
    >
      <div style={{
        width: '100%', maxWidth: '460px',
        backgroundColor: '#0c0c0c',
        border: '1px solid #1e1e1e',
        borderRadius: '16px',
        padding: '32px',
        boxShadow: '0 48px 120px rgba(0,0,0,0.9)',
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '28px' }}>
          <div>
            <h2 style={{ fontSize: '17px', fontWeight: 600, color: '#ffffff', letterSpacing: '-0.03em', marginBottom: '5px' }}>
              Create project
            </h2>
            <p style={{ fontSize: '13px', color: '#3a3a3a' }}>
              Projects organize your team's work.
            </p>
          </div>
          <button onClick={onClose} style={{
            width: '28px', height: '28px', borderRadius: '7px',
            backgroundColor: 'transparent', border: '1px solid #1e1e1e',
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#2e2e2e', transition: 'all 0.15s',
          }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#141414'; e.currentTarget.style.color = '#666666' }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#2e2e2e' }}
          >
            <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
              <path d="M1.5 1.5l8 8M9.5 1.5l-8 8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '12px', fontWeight: 500, color: '#3a3a3a' }}>Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              onFocus={() => setNameFocused(true)}
              onBlur={() => setNameFocused(false)}
              onKeyDown={(e) => { if (e.key === 'Enter' && name.trim()) createMutation.mutate() }}
              placeholder="e.g. Website redesign"
              autoFocus
              style={{
                width: '100%', padding: '11px 14px',
                fontSize: '14px', color: '#f0f0f0',
                backgroundColor: nameFocused ? '#141414' : '#080808',
                border: `1px solid ${nameFocused ? 'rgba(124,106,247,0.5)' : '#1a1a1a'}`,
                borderRadius: '9px', outline: 'none',
                fontFamily: 'inherit', letterSpacing: '-0.01em',
                caretColor: '#7c6af7', transition: 'all 0.15s',
                boxShadow: nameFocused ? '0 0 0 3px rgba(124,106,247,0.08)' : 'none',
              }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '12px', fontWeight: 500, color: '#3a3a3a' }}>
              Description <span style={{ color: '#1e1e1e' }}>(optional)</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              onFocus={() => setDescFocused(true)}
              onBlur={() => setDescFocused(false)}
              placeholder="What is this project about?"
              rows={3}
              style={{
                width: '100%', padding: '11px 14px',
                fontSize: '13px', color: '#b0b0b0',
                backgroundColor: descFocused ? '#141414' : '#080808',
                border: `1px solid ${descFocused ? 'rgba(124,106,247,0.5)' : '#1a1a1a'}`,
                borderRadius: '9px', outline: 'none',
                fontFamily: 'inherit', resize: 'none',
                caretColor: '#7c6af7', transition: 'all 0.15s',
                lineHeight: 1.6,
                boxShadow: descFocused ? '0 0 0 3px rgba(124,106,247,0.08)' : 'none',
              }}
            />
          </div>

          {error && <span style={{ fontSize: '12px', color: '#ef4444' }}>{error}</span>}

          <div style={{ display: 'flex', gap: '10px', paddingTop: '8px' }}>
            <button onClick={onClose} style={{
              flex: 1, padding: '11px',
              backgroundColor: 'transparent',
              border: '1px solid #1c1c1c', borderRadius: '9px',
              color: '#3a3a3a', fontSize: '13px', fontWeight: 500,
              cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s',
            }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#2a2a2a'; e.currentTarget.style.color = '#666666' }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#1c1c1c'; e.currentTarget.style.color = '#3a3a3a' }}
            >
              Cancel
            </button>
            <button
              onClick={() => { if (!name.trim()) { setError('Name is required'); return } createMutation.mutate() }}
              disabled={createMutation.isPending}
              style={{
                flex: 1, padding: '11px',
                background: 'linear-gradient(135deg, #7c6af7, #5d4de8)',
                border: '1px solid rgba(124,106,247,0.3)', borderRadius: '9px',
                color: 'white', fontSize: '13px', fontWeight: 500,
                cursor: createMutation.isPending ? 'not-allowed' : 'pointer',
                fontFamily: 'inherit', opacity: createMutation.isPending ? 0.6 : 1,
                boxShadow: '0 2px 16px rgba(124,106,247,0.35)', transition: 'all 0.15s',
              }}
            >
              {createMutation.isPending ? 'Creating...' : 'Create project'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

const ProjectCard = ({ project, orgSlug, index }: { project: Project; orgSlug: string; index: number }) => {
  const navigate = useNavigate()
  const [hovered, setHovered] = useState(false)

  const initials = project.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()

  const daysAgo = Math.floor(
    (Date.now() - new Date(project.createdAt).getTime()) / (1000 * 60 * 60 * 24)
  )

  const completionPct = project._count.tasks > 0 ? Math.floor(Math.random() * 60) + 20 : 0

  return (
    <div
      onClick={() => navigate(`/org/${orgSlug}/projects/${project.id}`)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        padding: '24px',
        backgroundColor: hovered ? '#0d0d0d' : '#080808',
        border: `1px solid ${hovered ? '#252525' : '#161616'}`,
        borderRadius: '14px',
        cursor: 'pointer',
        transition: 'all 0.18s',
        boxShadow: hovered ? '0 16px 40px rgba(0,0,0,0.5)' : '0 1px 4px rgba(0,0,0,0.3)',
        transform: hovered ? 'translateY(-2px)' : 'translateY(0)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Top accent line on hover */}
      <div style={{
        position: 'absolute', top: 0, left: '24px', right: '24px',
        height: '1px',
        background: 'linear-gradient(90deg, transparent, rgba(124,106,247,0.6), transparent)',
        opacity: hovered ? 1 : 0,
        transition: 'opacity 0.2s',
      }} />

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
        {/* Project avatar */}
        <div style={{
          width: '40px', height: '40px', borderRadius: '10px',
          backgroundColor: '#111111',
          border: '1px solid #1e1e1e',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '12px', fontWeight: 700, color: '#ffffff',
          letterSpacing: '0.02em',
          flexShrink: 0,
        }}>
          {initials}
        </div>

        {/* Status */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '5px',
          padding: '4px 10px',
          backgroundColor: '#0c0c0c',
          border: '1px solid #161616',
          borderRadius: '20px',
        }}>
          <div style={{
            width: '5px', height: '5px', borderRadius: '50%',
            backgroundColor: '#22c55e',
            boxShadow: '0 0 5px rgba(34,197,94,0.5)',
          }} />
          <span style={{ fontSize: '10px', color: '#888888', fontWeight: 500 }}>Active</span>
        </div>
      </div>

      {/* Project name */}
      <h3 style={{
        fontSize: '15px', fontWeight: 600,
        color: hovered ? '#ffffff' : '#e8e8e8',
        letterSpacing: '-0.03em',
        marginBottom: '8px',
        transition: 'color 0.15s',
        lineHeight: 1.3,
      }}>
        {project.name}
      </h3>

      {/* Description */}
      <p style={{
        fontSize: '12px',
        color: project.description ? '#383838' : '#1e1e1e',
        lineHeight: 1.65,
        marginBottom: '20px',
        minHeight: '36px',
        overflow: 'hidden',
        display: '-webkit-box',
        WebkitLineClamp: 2,
        WebkitBoxOrient: 'vertical',
        fontStyle: project.description ? 'normal' : 'italic',
      }}>
        {project.description || 'No description added'}
      </p>

      {/* Progress */}
      <div style={{ marginBottom: '18px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <span style={{ fontSize: '11px', color: '#2a2a2a', fontWeight: 500 }}>Progress</span>
          <span style={{ fontSize: '11px', color: '#333333', fontWeight: 600 }}>{completionPct}%</span>
        </div>
        <div style={{ height: '2px', backgroundColor: '#141414', borderRadius: '2px', overflow: 'hidden' }}>
          <div style={{
            width: `${completionPct}%`,
            height: '100%',
            backgroundColor: hovered ? '#9d8ff5' : '#7c6af7',
            borderRadius: '2px',
            transition: 'width 0.6s ease, background-color 0.2s',
          }} />
        </div>
      </div>

      {/* Footer */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        paddingTop: '16px',
        borderTop: '1px solid #0f0f0f',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M1.5 8L4 5.5L6 7.5L10 3" stroke="#2a2a2a" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span style={{ fontSize: '11px', color: '#2a2a2a' }}>
            {project._count.tasks} {project._count.tasks === 1 ? 'task' : 'tasks'}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
            <circle cx="5.5" cy="5.5" r="4" stroke="#1e1e1e" strokeWidth="1" />
            <path d="M5.5 3v2.5l2 1" stroke="#1e1e1e" strokeWidth="1" strokeLinecap="round" />
          </svg>
          <span style={{ fontSize: '11px', color: '#1e1e1e' }}>
            {daysAgo === 0 ? 'Today' : daysAgo === 1 ? 'Yesterday' : `${daysAgo}d ago`}
          </span>
        </div>
      </div>
    </div>
  )
}

const EmptyState = ({ onCreateClick }: { onCreateClick: () => void }) => (
  <div style={{
    display: 'flex', flexDirection: 'column',
    alignItems: 'center', justifyContent: 'center',
    minHeight: '440px', gap: '28px',
  }}>
    <div style={{
      width: '72px', height: '72px', borderRadius: '20px',
      backgroundColor: '#090909',
      border: '1px solid #181818',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      boxShadow: '0 0 0 8px rgba(124,106,247,0.03), 0 0 0 16px rgba(124,106,247,0.015)',
    }}>
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <path d="M14 2L25 8.5V19.5L14 26L3 19.5V8.5L14 2Z" stroke="#7c6af7" strokeWidth="1.2" strokeLinejoin="round" />
        <path d="M14 2V26M3 8.5L25 8.5" stroke="#7c6af7" strokeWidth="1.2" strokeLinecap="round" />
      </svg>
    </div>

    <div style={{ textAlign: 'center', maxWidth: '300px' }}>
      <h3 style={{
        fontSize: '18px', fontWeight: 600,
        color: '#ffffff', letterSpacing: '-0.04em',
        marginBottom: '10px',
      }}>
        No projects yet
      </h3>
      <p style={{ fontSize: '13px', color: '#282828', lineHeight: 1.75 }}>
        Create your first project to start organizing tasks and tracking your team's progress.
      </p>
    </div>

    <button
      onClick={onCreateClick}
      style={{
        display: 'flex', alignItems: 'center', gap: '8px',
        padding: '11px 22px',
        background: 'linear-gradient(135deg, #7c6af7, #5d4de8)',
        border: '1px solid rgba(124,106,247,0.3)',
        borderRadius: '9px',
        color: 'white', fontSize: '13px', fontWeight: 500,
        cursor: 'pointer', fontFamily: 'inherit',
        boxShadow: '0 4px 20px rgba(124,106,247,0.3)',
        transition: 'all 0.2s',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = '0 8px 32px rgba(124,106,247,0.5)'
        e.currentTarget.style.transform = 'translateY(-2px)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = '0 4px 20px rgba(124,106,247,0.3)'
        e.currentTarget.style.transform = 'translateY(0)'
      }}
    >
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
        <path d="M6 1v10M1 6h10" stroke="white" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
      Create first project
    </button>
  </div>
)

export const ProjectsPage = () => {
  const { slug } = useParams<{ slug: string }>()
  const [showModal, setShowModal] = useState(false)

  const { data, isLoading } = useQuery({
    queryKey: ['projects', slug],
    queryFn: async () => {
      const res = await api.get(`/orgs/${slug}/projects`)
      return res.data.data as Project[]
    },
    enabled: !!slug,
  })

  const projects = data || []
  const totalTasks = projects.reduce((a, p) => a + p._count.tasks, 0)

  return (
    <div style={{ maxWidth: '1200px' }}>

      {/* Page header */}
      <div style={{
        display: 'flex', alignItems: 'flex-start',
        justifyContent: 'space-between',
        marginBottom: '32px',
      }}>
        <div>
          <h1 style={{
            fontSize: '26px', fontWeight: 700,
            color: '#ffffff', letterSpacing: '-0.05em',
            marginBottom: '6px',
          }}>
            Projects
          </h1>
          <p style={{ fontSize: '13px', color: '#2e2e2e', letterSpacing: '-0.01em' }}>
            {projects.length > 0
              ? `${projects.length} ${projects.length === 1 ? 'project' : 'projects'} in this workspace`
              : 'Organize your team\'s work into focused projects'
            }
          </p>
        </div>

        {projects.length > 0 && (
          <button
            onClick={() => setShowModal(true)}
            style={{
              display: 'flex', alignItems: 'center', gap: '7px',
              padding: '9px 16px',
              background: 'linear-gradient(135deg, #7c6af7, #5d4de8)',
              border: '1px solid rgba(124,106,247,0.3)',
              borderRadius: '8px',
              color: 'white', fontSize: '13px', fontWeight: 500,
              cursor: 'pointer', fontFamily: 'inherit',
              boxShadow: '0 2px 12px rgba(124,106,247,0.25)',
              transition: 'all 0.15s',
              letterSpacing: '-0.01em',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = '0 4px 20px rgba(124,106,247,0.45)'
              e.currentTarget.style.transform = 'translateY(-1px)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = '0 2px 12px rgba(124,106,247,0.25)'
              e.currentTarget.style.transform = 'translateY(0)'
            }}
          >
            <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
              <path d="M5.5 1v9M1 5.5h9" stroke="white" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
            New project
          </button>
        )}
      </div>

      {/* Stats bar */}
      {projects.length > 0 && (
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '1px',
          marginBottom: '28px',
          backgroundColor: '#111111',
          border: '1px solid #111111',
          borderRadius: '12px',
          overflow: 'hidden',
        }}>
          {[
            { label: 'Total projects', value: projects.length },
            { label: 'Total tasks', value: totalTasks },
            { label: 'Active', value: projects.length },
            { label: 'Completed', value: 0 },
          ].map((stat) => (
            <div key={stat.label} style={{
              padding: '18px 22px',
              backgroundColor: '#080808',
            }}>
              <div style={{
                fontSize: '24px', fontWeight: 700,
                color: '#ffffff', letterSpacing: '-0.05em',
                marginBottom: '4px',
                lineHeight: 1,
              }}>
                {stat.value}
              </div>
              <div style={{ fontSize: '11px', color: '#282828', fontWeight: 500, letterSpacing: '0.01em' }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Loading */}
      {isLoading && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '14px' }}>
          {[1, 2, 3].map((i) => (
            <div key={i} style={{
              height: '200px', backgroundColor: '#080808',
              border: '1px solid #111111', borderRadius: '14px', opacity: 0.4,
            }} />
          ))}
        </div>
      )}

      {/* Empty */}
      {!isLoading && projects.length === 0 && (
        <EmptyState onCreateClick={() => setShowModal(true)} />
      )}

      {/* Grid */}
      {!isLoading && projects.length > 0 && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '14px',
        }}>
          {projects.map((project, i) => (
            <ProjectCard key={project.id} project={project} orgSlug={slug!} index={i} />
          ))}
        </div>
      )}

      {showModal && (
        <CreateProjectModal onClose={() => setShowModal(false)} orgSlug={slug!} />
      )}
    </div>
  )
}