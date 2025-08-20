import {Routes, Route,} from 'react-router-dom'
import UIShowcase from './pages/UIShowcase'
import Home from './pages/Home'
import Login from './pages/auth/Login'
import Signup from './pages/auth/Signup'

function App() {
  
  return (
    <div className="min-h-screen bg-black text-white">

      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/sample" element={<UIShowcase />} />
          <Route path="/auth/login" element={<Login />} />
          <Route path="/auth/signup" element={<Signup />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
