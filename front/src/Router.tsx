import { Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'
import { ProtectedRoute } from './components/ProtectedRoute'
import { PublicRoute } from './components/PublicRoute'
import { Dashboard, Plans, History, Subscription, Login } from './pages'

export function Router() {
  return (
    <Routes>
      {/* Public routes - Login page without layout */}
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />

      {/* Protected routes - Wrapped with Layout */}
      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <Layout>
              <Routes>
                <Route index element={<Dashboard />} />
                <Route path="planos" element={<Plans />} />
                <Route path="historico" element={<History />} />
                <Route path="assinatura" element={<Subscription />} />
              </Routes>
            </Layout>
          </ProtectedRoute>
        }
      />
    </Routes>
  )
}
