import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/bitec.png";

// ── DYNAMIC API URL ──
// ✅ FIXED: Now includes /api
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const rememberedEmail = localStorage.getItem('rememberedEmail');
    if (rememberedEmail) {
      setEmail(rememberedEmail);
      setRememberMe(true);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    
    try {
      // ✅ FIXED: Removed /api from the path (since it's already in API_URL)
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        if (rememberMe) {
          localStorage.setItem('rememberedEmail', email);
        } else {
          localStorage.removeItem('rememberedEmail');
        }
        
        if (data.user.role === "admin") {
          window.location.href = "/admin";
        } else if (data.user.role === "faculty") {
          window.location.href = "/faculty";
        } else {
          window.location.href = "/student";
        }
      } else {
        setError(data.message || "Login failed");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Cannot connect to server. Please try again.");
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-200 via-blue-100 to-indigo-200 p-6">
      {/* White Card */}
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">
        
        {/* Decorative Top Bar - Navbar Color (Blue/Purple) */}
        <div className="h-1.5 bg-gradient-to-r from-[#1e2a6b] to-[#603dc1]"></div>
        
        <div className="p-8">
          
          {/* Logo with Navbar Color Border */}
          <div className="flex justify-center mb-6">
            <div className="w-24 h-24 rounded-full p-[3px] 
              bg-gradient-to-br from-[#1e2a6b] via-[#3b4a9e] to-[#603dc1]
              shadow-[0_0_15px_rgba(96,61,193,0.3)]
              hover:scale-105 hover:shadow-[0_0_25px_rgba(96,61,193,0.5)]
              transition duration-300 cursor-pointer">
              <div className="w-full h-full rounded-full bg-white overflow-hidden">
                <img
                  src={logo}
                  alt="BiTec Logo"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-3 rounded-lg mb-6 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-gray-700 text-sm font-semibold mb-2">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#603dc1] focus:border-transparent transition"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-semibold mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#603dc1] focus:border-transparent transition"
                required
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 text-[#603dc1] focus:ring-[#603dc1]"
                />
                <span className="text-gray-600 text-sm">Remember me</span>
              </label>
              <a href="#" className="text-[#603dc1] text-sm font-medium hover:text-[#1e2a6b] transition">
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl font-bold text-white bg-gradient-to-r from-[#1e2a6b] to-[#603dc1] hover:from-[#2a3a8a] hover:to-[#704dd1] transition shadow-md disabled:opacity-50"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Logging in...
                </span>
              ) : (
                "Login"
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600 text-sm">
              Don't have an account?{' '}
              <a href="/register" className="text-[#603dc1] font-semibold hover:text-[#1e2a6b] transition">
                Sign Up Now
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;