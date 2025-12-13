import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Home from "@/pages/home"
import Login from "@/pages/login"
import Registration from "@/pages/registration"
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
        </Routes>
      </div>
    </Router>
  )
}

export default App