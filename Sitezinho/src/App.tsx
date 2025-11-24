import { Routes, Route } from 'react-router'
import Inicio from './pages/inicio'
import ProfileWizard from './pages/profileWizard'
import Dashboard from './pages/dashBoard'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Inicio />} />
      <Route path="/profile-wizard" element={<ProfileWizard />} />
      <Route path="/dashboard" element={<Dashboard />} />
    </Routes>
  )
}

export default App
