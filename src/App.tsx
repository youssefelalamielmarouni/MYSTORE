import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Home from "@/pages/home"
import Login from "@/pages/login"
import Registration from "@/pages/registration"
import AdminDashboard from "@/pages/admin-dashboard"
import Navbar from "@/components/navbar"
import "./App.css"

function App() {
  return (
    <Router>
      <Navbar />
      <div className="app-container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registration" element={<Registration />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App