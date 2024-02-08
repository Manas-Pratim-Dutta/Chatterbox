import './App.css'
import { BrowserRouter, Routes, Route } from "react-router-dom"
import PrivateRoutes from './components/PrivateRoutes'
import { AuthProvider } from './utils/AuthContext'

import Room from './pages/Room'
import LoginPage from './pages/LoginPage'

function App() {

  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path='/login' element={<LoginPage />} />

        // So protecting the route, It will only pass it to child routes if user is authenticated
          <Route element={<PrivateRoutes />}>
            <Route path='/' element={<Room />} />
          </Route>

        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
