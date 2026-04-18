export interface CreateTaskInput {
  title: string
  status?: string
  priority?: number
  assigneeId?: string
}

export interface UpdateTaskInput {
  title?: string
  status?: string
  priority?: number
  assigneeId?: string
}