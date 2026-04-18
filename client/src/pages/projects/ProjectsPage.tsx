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

const Modal = ({ onClose, orgSlug }: { onClose: () => void; orgSlug: string }) => {
  const queryClient = useQueryClient()
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [focused, setFocused] = useState<string | null>(null)
  const [error, setError] = useState('')

  const mutation = useMutation({
    mutationFn: async () => {
      const res = await api.post(`/orgs/${orgSlug}/projects`, { name, description })
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects', orgSlug] })
      onClose()
    },
    onError: (err: any) => setError(err.response?.data?.message || 'Something went wrong'),
  })

  const inputStyle = (field: string) => ({
    width: '100%',
    padding: '11px 14px',
    fontSize: '14px',
    color: '#f0f0f0',
    backgroundColor: focused === field ? '#161616' : '#0d0d0d',
    border: `1px solid ${focused === field ? 'rgba(124,106,247,0.5)' : 'rgba(255,255,255,0.07)'}`,
    borderRadius: '10px',
    outline: 'none',
    fontFamily: 'inherit',
    letterSpacing: '-0.01em',
    caretColor: '#7c6af7',
    transition: 'all 0.15s',
    boxShadow: focused === field ? '0 0 0 3px rgba(124,106,247,0.08)' : 'none',
  })

  return (
    <div
      onClick={(e) => e.target === e.currentTarget && onClose()}
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        backgroundColor: 'rgba(0,0,0,0.85)',
        backdropFilter: 'blur(8px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px',
      }}
    >
      <div style={{
        width: '100%', maxWidth: '460px',
        backgroundColor: '#111111',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '16px', padding: '32px',
        boxShadow: '0 48px 120px rgba(0,0,0,0.9), inset 0 1px 0 rgba(255,255,255,0.04)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '28px' }}>
          <div>
            <h2 style={{ fontSize: '17px', fontWeight: 600, color: '#ffffff', letterSpacing: '-0.03em', marginBottom: '5px' }}>
              Create project
            </h2>
            <p style={{ fontSize: '13px', color: '#3a3a3a' }}>Add a new project to your workspace</p>
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
            <label style={{ fontSize: '12px', fontWeight: 500, color: '#444444' }}>Project name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              onFocus={() => setFocused('name')}
              onBlur={() => setFocused(null)}
              onKeyDown={(e) => { if (e.key === 'Enter' && name.trim()) mutation.mutate() }}
              placeholder="e.g. Website redesign"
              autoFocus
              style={inputStyle('name') as React.CSSProperties}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '12px', fontWeight: 500, color: '#444444' }}>
              Description <span style={{ color: '#252525' }}>(optional)</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              onFocus={() => setFocused('desc')}
              onBlur={() => setFocused(null)}
              placeholder="What is this project about?"
              rows={3}
              style={{ ...inputStyle('desc'), resize: 'none', lineHeight: 1.6, fontSize: '13px' } as React.CSSProperties}
            />
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
              onClick={() => { if (!name.trim()) { setError('Name is required'); return } mutation.mutate() }}
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
              {mutation.isPending ? 'Creating...' : 'Create project'}
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

  const initials = project.name.split(/[\s-]/).map((w: string) => w[0]).join('').slice(0, 2).toUpperCase()
  const daysAgo = Math.floor((Date.now() - new Date(project.createdAt).getTime()) / 86400000)
  const progress = project._count.tasks > 0 ? 45 : 0

  return (
    <div
      onClick={() => navigate(`/org/${orgSlug}/projects/${project.id}`)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        padding: '22px 24px',
        backgroundColor: hovered ? '#111111' : '#0d0d0d',
        border: `1px solid ${hovered ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.06)'}`,
        borderRadius: '14px',
        cursor: 'pointer',
        transition: 'all 0.18s',
        boxShadow: hovered
          ? '0 20px 48px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.05)'
          : '0 1px 3px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.02)',
        transform: hovered ? 'translateY(-3px)' : 'translateY(0)',
        position: 'relative', overflow: 'hidden',
      }}
    >
      {/* Shimmer line on hover */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: '1px',
        background: 'linear-gradient(90deg, transparent 0%, rgba(124,106,247,0.8) 50%, transparent 100%)',
        opacity: hovered ? 1 : 0,
        transition: 'opacity 0.2s',
      }} />

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
        <div style={{
          width: '38px', height: '38px', borderRadius: '10px',
          backgroundColor: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.08)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '12px', fontWeight: 700, color: '#c0c0c0',
          letterSpacing: '0.02em',
        }}>
          {initials}
        </div>

        <div style={{
          display: 'flex', alignItems: 'center', gap: '5px',
          padding: '4px 10px',
          backgroundColor: 'rgba(34,197,94,0.06)',
          border: '1px solid rgba(34,197,94,0.12)',
          borderRadius: '20px',
        }}>
          <div style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: '#22c55e', boxShadow: '0 0 5px rgba(34,197,94,0.5)' }} />
          <span style={{ fontSize: '10px', color: '#4ade80', fontWeight: 500 }}>Active</span>
        </div>
      </div>

      {/* Name */}
      <h3 style={{
        fontSize: '15px', fontWeight: 600,
        color: hovered ? '#ffffff' : '#e8e8e8',
        letterSpacing: '-0.03em', marginBottom: '8px',
        transition: 'color 0.15s', lineHeight: 1.3,
      }}>
        {project.name}
      </h3>

      {/* Description */}
      <p style={{
        fontSize: '12px',
        color: '#555555',
        lineHeight: 1.7, marginBottom: '20px',
        minHeight: '38px',
        overflow: 'hidden',
        display: '-webkit-box',
        WebkitLineClamp: 2,
        WebkitBoxOrient: 'vertical',
        fontStyle: project.description ? 'normal' : 'italic',
      }}>
        {project.description || 'No description'}
      </p>

      {/* Progress */}
      <div style={{ marginBottom: '18px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
          <span style={{ fontSize: '11px', color: '#444444', fontWeight: 500 }}>Completion</span>
          <span style={{ fontSize: '11px', color: '#666666', fontWeight: 600 }}>{progress}%</span>
        </div>
        <div style={{ height: '2px', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '2px', overflow: 'hidden' }}>
          <div style={{
            width: `${progress}%`, height: '100%',
            background: 'linear-gradient(90deg, #7c6af7, #a395f9)',
            borderRadius: '2px', transition: 'width 0.6s ease',
            boxShadow: progress > 0 ? '0 0 8px rgba(124,106,247,0.6)' : 'none',
          }} />
        </div>
      </div>

      {/* Footer */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        paddingTop: '16px',
        borderTop: '1px solid rgba(255,255,255,0.04)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M1.5 8L4 5.5L6 7L9.5 3.5" stroke="#2a2a2a" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span style={{ fontSize: '11px', color: '#444444' }}>
            {project._count.tasks} {project._count.tasks === 1 ? 'task' : 'tasks'}
          </span>
        </div>
        <span style={{ fontSize: '11px', color: '#444444' }}>
          {daysAgo === 0 ? 'Today' : daysAgo === 1 ? 'Yesterday' : `${daysAgo}d ago`}
        </span>
      </div>
    </div>
  )
}

const EmptyState = ({ onCreateClick }: { onCreateClick: () => void }) => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '440px', gap: '28px' }}>
    <div style={{
      width: '68px', height: '68px', borderRadius: '20px',
      backgroundColor: '#0d0d0d',
      border: '1px solid rgba(255,255,255,0.07)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      boxShadow: '0 0 0 8px rgba(124,106,247,0.04), 0 0 0 16px rgba(124,106,247,0.02)',
    }}>
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <path d="M14 2L25 8.5V19.5L14 26L3 19.5V8.5L14 2Z" stroke="#7c6af7" strokeWidth="1.2" strokeLinejoin="round" />
        <path d="M14 2V26M3 8.5L25 8.5" stroke="#7c6af7" strokeWidth="1.2" strokeLinecap="round" />
      </svg>
    </div>
    <div style={{ textAlign: 'center', maxWidth: '280px' }}>
      <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#ffffff', letterSpacing: '-0.04em', marginBottom: '10px' }}>
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
        border: '1px solid rgba(124,106,247,0.3)', borderRadius: '10px',
        color: 'white', fontSize: '13px', fontWeight: 500,
        cursor: 'pointer', fontFamily: 'inherit',
        boxShadow: '0 4px 20px rgba(124,106,247,0.3), inset 0 1px 0 rgba(255,255,255,0.1)',
        transition: 'all 0.2s',
      }}
      onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 8px 32px rgba(124,106,247,0.5), inset 0 1px 0 rgba(255,255,255,0.1)'; e.currentTarget.style.transform = 'translateY(-2px)' }}
      onMouseLeave={(e) => { e.currentTarget.style.boxShadow = '0 4px 20px rgba(124,106,247,0.3), inset 0 1px 0 rgba(255,255,255,0.1)'; e.currentTarget.style.transform = 'translateY(0)' }}
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
    <div style={{ maxWidth: '1100px' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#ffffff', letterSpacing: '-0.05em', marginBottom: '6px', lineHeight: 1 }}>
            Projects
          </h1>
          <p style={{ fontSize: '13px', color: '#555555', letterSpacing: '-0.01em' }}>
            {projects.length > 0
              ? `${projects.length} ${projects.length === 1 ? 'project' : 'projects'} · ${totalTasks} tasks total`
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
              border: '1px solid rgba(124,106,247,0.4)', borderRadius: '9px',
              color: 'white', fontSize: '13px', fontWeight: 500,
              cursor: 'pointer', fontFamily: 'inherit',
              boxShadow: '0 2px 12px rgba(124,106,247,0.25), inset 0 1px 0 rgba(255,255,255,0.1)',
              transition: 'all 0.15s', letterSpacing: '-0.01em',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 4px 20px rgba(124,106,247,0.45), inset 0 1px 0 rgba(255,255,255,0.1)'; e.currentTarget.style.transform = 'translateY(-1px)' }}
            onMouseLeave={(e) => { e.currentTarget.style.boxShadow = '0 2px 12px rgba(124,106,247,0.25), inset 0 1px 0 rgba(255,255,255,0.1)'; e.currentTarget.style.transform = 'translateY(0)' }}
          >
            <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
              <path d="M5.5 1v9M1 5.5h9" stroke="white" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
            New project
          </button>
        )}
      </div>

      {/* Stats */}
      {projects.length > 0 && (
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
          marginBottom: '28px',
          backgroundColor: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: '12px', overflow: 'hidden',
        }}>
          {[
            { label: 'Projects', value: projects.length },
            { label: 'Tasks', value: totalTasks },
            { label: 'Active', value: projects.length },
            { label: 'Done', value: 0 },
          ].map((stat, i) => (
            <div key={stat.label} style={{
              padding: '20px 24px',
              borderLeft: i > 0 ? '1px solid rgba(255,255,255,0.04)' : 'none',
            }}>
              <div style={{ fontSize: '26px', fontWeight: 700, color: '#ffffff', letterSpacing: '-0.05em', lineHeight: 1, marginBottom: '6px' }}>
                {stat.value}
              </div>
              <div style={{ fontSize: '11px', color: '#555555', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
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
            <div key={i} style={{ height: '210px', backgroundColor: '#0d0d0d', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '14px', opacity: 0.4 }} />
          ))}
        </div>
      )}

      {/* Empty */}
      {!isLoading && projects.length === 0 && <EmptyState onCreateClick={() => setShowModal(true)} />}

      {/* Grid */}
      {!isLoading && projects.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '14px' }}>
          {projects.map((project, i) => (
            <ProjectCard key={project.id} project={project} orgSlug={slug!} index={i} />
          ))}
        </div>
      )}

      {showModal && <Modal onClose={() => setShowModal(false)} orgSlug={slug!} />}
    </div>
  )
}