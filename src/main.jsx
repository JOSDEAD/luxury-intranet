import React from 'react'
import ReactDOM from 'react-dom/client'
// Core styles
import 'bootstrap/dist/css/bootstrap.min.css'
import 'icofont/dist/icofont.min.css'
import 'react-nestable/dist/styles/index.css'
import './assets/scss/main.scss'
import App from './App'
import { AuthProvider } from './auth/authContext' // o authContext.jsx, según como esté

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
)