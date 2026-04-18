import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface Org {
  id: string
  name: string
  slug: string
  plan: string
}

interface OrgState {
  currentOrg: Org | null
  setCurrentOrg: (org: Org) => void
  clearOrg: () => void
}

export const useOrgStore = create<OrgState>()(
  persist(
    (set) => ({
      currentOrg: null,
      setCurrentOrg: (org) => set({ currentOrg: org }),
      clearOrg: () => set({ currentOrg: null }),
    }),
    {
      name: 'org-storage',
    }
  )
)