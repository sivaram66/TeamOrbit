export interface CreateInviteInput {
  email: string
  role: string
}

export interface AcceptInviteInput {
  token: string
}