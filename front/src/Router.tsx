import { Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'
import { Home } from './pages/Home'

export function Router() {
  return (
    <Layout>
      <Routes>
        <Route index path="/" element={<Home />} />
      </Routes>
    </Layout>
  )
}
