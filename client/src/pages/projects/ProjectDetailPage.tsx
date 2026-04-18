import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '../../lib/axios'

interface Task {
  id: string
  title: string
  status: string
  priority: number
  createdAt: string
  assignee?: {
    id: string
    name: string
    email: string
  } | null
}

interface Project {
  id: string
  name: string
  description?: string
  createdAt: string
  tasks: Task[]
}

const COLUMNS = [
  {
    id: 'todo',
    label: 'Todo',
    color: '#444444',
    dotColor: '#555555',
  },
  {
    id: 'in_progress',
    label: 'In Progress',
    color: '#7c6af7',
    dotColor: '#7c6af7',
  },
  {
    id: 'in_review',
    label: 'In Review',
    color: '#f59e0b',
    dotColor: '#f59e0b',
  },
  {
    id: 'done',
    label: 'Done',
    color: '#22c55e',
    dotColor: '#22c55e',
  },
]

const PRIORITY_LABELS: Record<number, { label: string; color: string }> = {
  0: { label: 'None', color: '#333333' },
  1: { label: 'Low', color: '#3b82f6' },
  2: { label: 'Medium', color: '#f59e0b' },
  3: { label: 'High', color: '#ef4444' },
}

const CreateTaskModal = ({
  onClose,
  orgSlug,
  projectId,
  defaultStatus,
}: {
  onClose: () => void
  orgSlug: string
  projectId: string
  defaultStatus: string
}) => {
  const queryClient = useQueryClient()
  const [title, setTitle] = useState('')
  const [priority, setPriority] = useState(0)
  const [focused, setFocused] = useState(false)
  const [error, setError] = useState('')

  const mutation = useMutation({
    mutationFn: async () => {
      const res = await api.post(`/orgs/${orgSlug}/projects/${projectId}/tasks`, {
        title,
        status: defaultStatus,
        priority,
      })
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project', projectId] })
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
        width: '100%', maxWidth: '460px',
        backgroundColor: '#111111',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '16px', padding: '32px',
        boxShadow: '0 48px 120px rgba(0,0,0,0.9), inset 0 1px 0 rgba(255,255,255,0.04)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '28px' }}>
          <div>
            <h2 style={{ fontSize: '17px', fontWeight: 600, color: '#ffffff', letterSpacing: '-0.03em', marginBottom: '5px' }}>
              Create task
            </h2>
            <p style={{ fontSize: '13px', color: '#444444' }}>
              Add a new task to{' '}
              <span style={{ color: '#666666', fontWeight: 500 }}>
                {COLUMNS.find(c => c.id === defaultStatus)?.label}
              </span>
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
            <label style={{ fontSize: '12px', fontWeight: 500, color: '#444444' }}>Task title</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              onKeyDown={(e) => { if (e.key === 'Enter' && title.trim()) mutation.mutate() }}
              placeholder="e.g. Implement user authentication"
              autoFocus
              style={{
                width: '100%', padding: '11px 14px',
                fontSize: '14px', color: '#f0f0f0',
                backgroundColor: focused ? '#161616' : '#0d0d0d',
                border: `1px solid ${focused ? 'rgba(124,106,247,0.5)' : 'rgba(255,255,255,0.07)'}`,
                borderRadius: '10px', outline: 'none',
                fontFamily: 'inherit', letterSpacing: '-0.01em',
                caretColor: '#7c6af7', transition: 'all 0.15s',
                boxShadow: focused ? '0 0 0 3px rgba(124,106,247,0.08)' : 'none',
              }}
            />
          </div>

          {/* Priority */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '12px', fontWeight: 500, color: '#444444' }}>Priority</label>
            <div style={{ display: 'flex', gap: '8px' }}>
              {Object.entries(PRIORITY_LABELS).map(([val, { label, color }]) => (
                <button
                  key={val}
                  onClick={() => setPriority(Number(val))}
                  style={{
                    flex: 1, padding: '8px',
                    backgroundColor: priority === Number(val) ? 'rgba(255,255,255,0.06)' : 'transparent',
                    border: `1px solid ${priority === Number(val) ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.06)'}`,
                    borderRadius: '8px',
                    cursor: 'pointer', fontFamily: 'inherit',
                    fontSize: '12px', fontWeight: 500,
                    color: priority === Number(val) ? color : '#333333',
                    transition: 'all 0.15s',
                  }}
                >
                  {label}
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
              onClick={() => { if (!title.trim()) { setError('Title is required'); return } mutation.mutate() }}
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
              {mutation.isPending ? 'Creating...' : 'Create task'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

const TaskCard = ({ task }: { task: Task }) => {
  const [hovered, setHovered] = useState(false)
  const priority = PRIORITY_LABELS[task.priority] || PRIORITY_LABELS[0]

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        padding: '14px 16px',
        backgroundColor: hovered ? '#161616' : '#111111',
        border: `1px solid ${hovered ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.06)'}`,
        borderRadius: '10px',
        cursor: 'pointer',
        transition: 'all 0.15s',
        boxShadow: hovered
          ? '0 8px 24px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.04)'
          : 'inset 0 1px 0 rgba(255,255,255,0.02)',
        transform: hovered ? 'translateY(-1px)' : 'translateY(0)',
      }}
    >
      {/* Priority indicator */}
      {task.priority > 0 && (
        <div style={{ marginBottom: '10px' }}>
          <span style={{
            fontSize: '10px', fontWeight: 600,
            color: priority.color,
            letterSpacing: '0.06em', textTransform: 'uppercase',
          }}>
            {priority.label}
          </span>
        </div>
      )}

      {/* Title */}
      <p style={{
        fontSize: '13px', fontWeight: 500,
        color: hovered ? '#f0f0f0' : '#d0d0d0',
        letterSpacing: '-0.02em', lineHeight: 1.45,
        marginBottom: '12px',
        transition: 'color 0.15s',
      }}>
        {task.title}
      </p>

      {/* Footer */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {/* Assignee */}
        {task.assignee ? (
          <div style={{
            width: '22px', height: '22px', borderRadius: '50%',
            background: 'linear-gradient(135deg, rgba(124,106,247,0.4), rgba(124,106,247,0.2))',
            border: '1px solid rgba(124,106,247,0.3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '9px', fontWeight: 700, color: '#a395f9',
          }}>
            {task.assignee.name[0].toUpperCase()}
          </div>
        ) : (
          <div style={{
            width: '22px', height: '22px', borderRadius: '50%',
            backgroundColor: 'rgba(255,255,255,0.04)',
            border: '1px dashed rgba(255,255,255,0.08)',
          }} />
        )}

        {/* Date */}
        <span style={{ fontSize: '10px', color: '#333333' }}>
          {new Date(task.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
        </span>
      </div>
    </div>
  )
}

const KanbanColumn = ({
  column,
  tasks,
  onAddTask,
}: {
  column: typeof COLUMNS[0]
  tasks: Task[]
  onAddTask: (status: string) => void
}) => {
  const [addHovered, setAddHovered] = useState(false)

  return (
    <div style={{
      display: 'flex', flexDirection: 'column',
      backgroundColor: 'rgba(255,255,255,0.015)',
      border: '1px solid rgba(255,255,255,0.05)',
      borderRadius: '12px',
      minHeight: '500px',
      overflow: 'hidden',
    }}>
      {/* Column header */}
      <div style={{
        padding: '14px 16px',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            width: '7px', height: '7px', borderRadius: '50%',
            backgroundColor: column.dotColor,
            boxShadow: `0 0 6px ${column.dotColor}80`,
          }} />
          <span style={{
            fontSize: '12px', fontWeight: 600,
            color: '#888888', letterSpacing: '-0.01em',
          }}>
            {column.label}
          </span>
          <span style={{
            fontSize: '11px', fontWeight: 600,
            color: '#333333',
            backgroundColor: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: '4px',
            padding: '1px 6px',
          }}>
            {tasks.length}
          </span>
        </div>

        <button
          onClick={() => onAddTask(column.id)}
          onMouseEnter={() => setAddHovered(true)}
          onMouseLeave={() => setAddHovered(false)}
          style={{
            width: '24px', height: '24px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            backgroundColor: addHovered ? 'rgba(255,255,255,0.06)' : 'transparent',
            border: '1px solid transparent',
            borderRadius: '6px',
            cursor: 'pointer', color: addHovered ? '#888888' : '#333333',
            transition: 'all 0.15s',
          }}
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M6 1v10M1 6h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      {/* Tasks */}
      <div style={{ padding: '12px', display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
        {tasks.map(task => (
          <TaskCard key={task.id} task={task} />
        ))}

        {/* Empty column state */}
        {tasks.length === 0 && (
          <div
            onClick={() => onAddTask(column.id)}
            style={{
              flex: 1, display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              gap: '8px', padding: '24px',
              cursor: 'pointer', opacity: 0.4,
              transition: 'opacity 0.15s',
            }}
            onMouseEnter={(e) => e.currentTarget.style.opacity = '0.7'}
            onMouseLeave={(e) => e.currentTarget.style.opacity = '0.4'}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M10 2v16M2 10h16" stroke="#555555" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <span style={{ fontSize: '11px', color: '#444444', textAlign: 'center' }}>
              Add task
            </span>
          </div>
        )}
      </div>
    </div>
  )
}

export const ProjectDetailPage = () => {
  const { slug, projectId } = useParams<{ slug: string; projectId: string }>()
  const [showModal, setShowModal] = useState(false)
  const [activeStatus, setActiveStatus] = useState('todo')

  const { data: project, isLoading } = useQuery({
    queryKey: ['project', projectId],
    queryFn: async () => {
      const res = await api.get(`/orgs/${slug}/projects/${projectId}`)
      return res.data.data as Project
    },
    enabled: !!slug && !!projectId,
  })

  const handleAddTask = (status: string) => {
    setActiveStatus(status)
    setShowModal(true)
  }

  const tasksByStatus = (status: string) =>
    project?.tasks.filter(t => t.status === status) || []

  if (isLoading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '400px' }}>
        <div style={{ fontSize: '13px', color: '#333333' }}>Loading...</div>
      </div>
    )
  }

  if (!project) return null

  return (
    <div style={{ maxWidth: '1400px' }}>

      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '8px' }}>
          <div>
            <h1 style={{
              fontSize: '26px', fontWeight: 700,
              color: '#ffffff', letterSpacing: '-0.05em',
              marginBottom: '6px', lineHeight: 1,
            }}>
              {project.name}
            </h1>
            {project.description && (
              <p style={{ fontSize: '13px', color: '#555555', letterSpacing: '-0.01em' }}>
                {project.description}
              </p>
            )}
          </div>

          <button
            onClick={() => handleAddTask('todo')}
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
            New task
          </button>
        </div>

        {/* Task count stats */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '16px' }}>
          {COLUMNS.map(col => (
            <div key={col.id} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{
                width: '6px', height: '6px', borderRadius: '50%',
                backgroundColor: col.dotColor,
                opacity: 0.7,
              }} />
              <span style={{ fontSize: '12px', color: '#444444' }}>
                {tasksByStatus(col.id).length} {col.label}
              </span>
            </div>
          ))}
          <span style={{ fontSize: '12px', color: '#2a2a2a' }}>·</span>
          <span style={{ fontSize: '12px', color: '#444444' }}>
            {project.tasks.length} total
          </span>
        </div>
      </div>

      {/* Kanban board */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '14px',
        alignItems: 'start',
      }}>
        {COLUMNS.map(column => (
          <KanbanColumn
            key={column.id}
            column={column}
            tasks={tasksByStatus(column.id)}
            onAddTask={handleAddTask}
          />
        ))}
      </div>

      {showModal && (
        <CreateTaskModal
          onClose={() => setShowModal(false)}
          orgSlug={slug!}
          projectId={projectId!}
          defaultStatus={activeStatus}
        />
      )}
    </div>
  )
}