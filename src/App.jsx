import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Calendario from './components/Calendario'
import Login from './components/Login'
import PrivateRoute from './components/PrivateRoute'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Calendario />
            </PrivateRoute>
          }
        />
        <Route path="/" element={<Login />} />
        {/* Podés agregar más rutas protegidas así */}
      </Routes>
    </Router>
  )
}
export default App