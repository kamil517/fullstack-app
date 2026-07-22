import { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/bitec.png";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    
    try {
      const response = await fetch('http://localhost:8080/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role }),
      });
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        setSuccess("Registration successful! Redirecting...");
        setTimeout(() => navigate("/login"), 2000);
      } else {
        setError(data.message || "Registration failed");
      }
    } catch (err) {
      setError("Cannot connect to server. Make sure backend is running on port 8080");
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-200 via-blue-100 to-indigo-200 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">
        
        <div className="h-1 bg-gradient-to-r from-[#1e2a6b] to-[#603dc1]"></div>
        
        <div className="p-6">
          
          {/* Logo with Inner Shadow */}
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-full p-[2px] 
              bg-gradient-to-br from-[#1e2a6b] via-[#3b4a9e] to-[#603dc1]
              shadow-[0_0_10px_rgba(96,61,193,0.3)]
              hover:scale-105 transition duration-300">
              <div className="w-full h-full rounded-full bg-white overflow-hidden shadow-inner">
                <img 
                  src={logo} 
                  alt="BiTec Logo" 
                  className="w-full h-full object-cover rounded-full" 
                  style={{ boxShadow: "inset 0 2px 5px rgba(0,0,0,0.15)" }}
                />
              </div>
            </div>
          </div>

          <h1 className="text-2xl font-extrabold text-center mb-1
            bg-gradient-to-r from-[#1e2a6b] via-[#3b4a9e] to-[#603dc1] 
            bg-clip-text text-transparent">
            Create Account
          </h1>
          <p className="text-center text-gray-500 text-xs mb-4">Join BiTec Notice Board</p>

          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-2 rounded-lg mb-4 text-xs">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-50 border-l-4 border-green-500 text-green-700 p-2 rounded-lg mb-4 text-xs">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="block text-gray-700 text-xs font-semibold mb-1">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#603dc1] focus:border-transparent transition"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 text-xs font-semibold mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#603dc1] focus:border-transparent transition"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 text-xs font-semibold mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a password"
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#603dc1] focus:border-transparent transition"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 text-xs font-semibold mb-1">Register as</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#603dc1] focus:border-transparent transition"
              >
                <option value="student">Student</option>
                <option value="faculty">Faculty</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-[#1e2a6b] to-[#603dc1] hover:from-[#2a3a8a] hover:to-[#704dd1] transition shadow-md disabled:opacity-50 mt-2"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Registering...
                </span>
              ) : (
                "Register"
              )}
            </button>
          </form>

          <div className="mt-4 text-center">
            <p className="text-gray-500 text-xs">
              Already have an account?{' '}
              <a href="/login" className="text-[#603dc1] font-semibold hover:text-[#1e2a6b] transition">
                Login here
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;