import { Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'
import { Dashboard, Plans, History, Subscription } from './pages'

export function Router() {
  return (
    <Layout>
      <Routes>
        <Route index path="/" element={<Dashboard />} />
        <Route path="/planos" element={<Plans />} />
        <Route path="/historico" element={<History />} />
        <Route path="/assinatura" element={<Subscription />} />
      </Routes>
    </Layout>
  )
}
