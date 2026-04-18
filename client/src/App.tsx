import { Routes, Route, Navigate } from 'react-router-dom'
import { useEffect } from 'react'
import { useAuthStore } from './stores/auth.store'
import { useOrgStore } from './stores/org.store'
import { LoginPage } from './pages/auth/LoginPage'
import { RegisterPage } from './pages/auth/RegisterPage'
import { OnboardingPage } from './pages/onboarding/OnboardingPage'
import { AppShell } from './components/layouts/AppShell'
import { ProjectsPage } from './pages/projects/ProjectsPage'
import api from './lib/axios'
import { ProjectDetailPage } from './pages/projects/ProjectDetailPage'
import { MembersPage } from './pages/members/MembersPage'


const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuthStore()
  if (!isAuthenticated) return <Navigate to="/login" replace />
  return <>{children}</>
}

const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuthStore()
  if (isAuthenticated) return <Navigate to="/dashboard" replace />
  return <>{children}</>
}

const AppRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuthStore()
  const { currentOrg, setCurrentOrg } = useOrgStore()

  useEffect(() => {
    if (isAuthenticated && !currentOrg) {
      api.get('/orgs/mine').then((res) => {
        if (res.data?.data?.length > 0) {
          setCurrentOrg(res.data.data[0])
        }
      }).catch(() => {})
    }
  }, [isAuthenticated, currentOrg])

  if (!isAuthenticated) return <Navigate to="/login" replace />
  if (!currentOrg) return <Navigate to="/onboarding" replace />
  return <AppShell>{children}</AppShell>
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />

      <Route path="/login" element={
        <PublicRoute><LoginPage /></PublicRoute>
      } />

      <Route path="/register" element={
        <PublicRoute><RegisterPage /></PublicRoute>
      } />

      <Route path="/onboarding" element={
        <ProtectedRoute><OnboardingPage /></ProtectedRoute>
      } />

      <Route path="/dashboard" element={
        <AppRoute>
          <div style={{ color: '#888888', fontSize: '14px' }}>Dashboard coming soon</div>
        </AppRoute>
      } />

      <Route path="/org/:slug/dashboard" element={
        <AppRoute>
          <div style={{ color: '#888888', fontSize: '14px' }}>Dashboard coming soon</div>
        </AppRoute>
      } />

      <Route path="/org/:slug/projects" element={
        <AppRoute><ProjectsPage /></AppRoute>
      } />

      <Route path="/org/:slug/projects/:projectId" element={
        <AppRoute><ProjectDetailPage /></AppRoute>
      } />
      <Route path="/org/:slug/members" element={
        <AppRoute><MembersPage /></AppRoute>
      } />

      <Route path="/org/:slug/settings" element={
        <AppRoute>
          <div style={{ color: '#888888', fontSize: '14px' }}>Settings coming soon</div>
        </AppRoute>
      } />
    </Routes>
  )
}

export default App