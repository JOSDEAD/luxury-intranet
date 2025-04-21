import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Calendario from './components/Calendario'
import Login from './components/Login'
import PrivateRoute from './components/PrivateRoute'
import Layout from './components/Layout'
import Projects from './screens/Projects/Projects'
import Tasks from './screens/Projects/Tasks'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        {/* Protected routes with sidebar layout */}
        <Route element={
            <PrivateRoute>
              <Layout />
            </PrivateRoute>
          }
        >
          <Route path="/dashboard" element={<Calendario />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/tasks" element={<Tasks />} />
        </Route>
        {/* Redirect root to login */}
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  )
}
export default App