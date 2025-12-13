import { Link } from "react-router-dom"

export default function navbar() {
    return (
        <div>
            <nav className="flex gap-4 p-4 bg-gray-200 items-center justify-center">
                <h1 className="">MyStore</h1>
                <Link to="/">Home</Link>
                <Link to="/login">Login</Link>
                <Link to="/registration">Registration</Link>
            </nav>
        </div>
        
    )
}