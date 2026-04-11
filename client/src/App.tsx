import { Routes, Route } from 'react-router-dom'
import Layout from './components/layout/Layout'
import LandingPage from './pages/LandingPage'
import UserDashboard from './pages/UserDashboard'
import HardwareRegistryPage from './pages/HardwareRegistryPage'
import SkillsProfilePage from './pages/SkillsProfilePage'

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/dashboard" element={<UserDashboard />} />
        <Route path="/hardware" element={<HardwareRegistryPage />} />
        <Route path="/skills" element={<SkillsProfilePage />} />
      </Route>
    </Routes>
  )
}

export default App
