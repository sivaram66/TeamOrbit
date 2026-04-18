export interface CreateOrgInput {
  name: string
  slug: string
}

export interface OrgResponse {
  id: string
  name: string
  slug: string
  plan: string
  createdAt: Date
}