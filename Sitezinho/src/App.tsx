import { Routes, Route } from 'react-router'
import Inicio from './pages/inicio'
import ProfileWizard from './pages/profileWizard'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Inicio />} />
      <Route path="/profile-wizard" element={<ProfileWizard />} />
    </Routes>
  )
}

export default App
