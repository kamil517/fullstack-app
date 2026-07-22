import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/bitec.png";

function Navbar() {
  const location = useLocation();
  const { user, logout, isAuthenticated, isAdmin, isFaculty, isStudent } = useAuth();

  const navLink = (path) =>
    `relative px-1 transition duration-300 ${
      location.pathname === path
        ? "text-yellow-400 after:absolute after:left-0 after:-bottom-1 after:w-full after:h-[2px] after:bg-yellow-400"
        : "text-gray-200 hover:text-yellow-300"
    }`;

  return (
    <nav
      className="fixed top-0 left-0 w-full z-50 backdrop-blur-md shadow-lg border-b border-white/20"
      style={{
        background: "linear-gradient(135deg, #1e2a6b 0%, #3b4a9e 50%, #603dc1 100%)"
      }}
    >
      <div className="flex justify-between items-center px-8 py-1">

        {/* LOGO */}
        <Link to="/" className="flex items-center gap-3 cursor-pointer">

          {/* GOLD LOGO */}
          <div className="w-12 h-12 rounded-full p-[2px] 
            bg-gradient-to-br from-yellow-300 via-yellow-400 to-amber-500
            shadow-[0_0_12px_rgba(255,215,0,0.6)]
            hover:scale-110 hover:shadow-[0_0_20px_rgba(255,215,0,0.9)]
            transition duration-300">

            <div className="w-full h-full rounded-full bg-white overflow-hidden">
              <img
                src={logo}
                alt="BiTec Logo"
                className="w-full h-full object-cover rounded-full"
              />
            </div>
          </div>

          {/* BRAND NAME */}
          <h1 className="text-2xl font-extrabold tracking-wide 
            bg-gradient-to-r from-yellow-300 via-yellow-400 to-amber-500 
            bg-clip-text text-transparent">
            BiTec
          </h1>
        </Link>

        {/* NAV LINKS */}
        <div className="flex items-center gap-8 text-sm font-medium">

          <Link to="/" className={navLink("/")}>Home</Link>

          {isAuthenticated && (
            <>
              {isAdmin && <Link to="/admin" className={navLink("/admin")}>Admin</Link>}
              {isFaculty && <Link to="/faculty" className={navLink("/faculty")}>Faculty</Link>}
              {isStudent && <Link to="/student" className={navLink("/student")}>Dashboard</Link>}
            </>
          )}

          {/* AUTH AREA */}
          {isAuthenticated ? (
            <div className="flex items-center gap-4">

              {/* USER NAME */}
              <span className="text-gray-200 text-sm">
                👋 {user?.name}
              </span>

              {/* LOGOUT BUTTON */}
              <button
                onClick={logout}
                className="px-5 py-2 rounded-full text-sm font-semibold 
                bg-gradient-to-r from-red-500 to-red-600 
                hover:from-red-600 hover:to-red-700 
                text-white shadow-md transition"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="px-5 py-2 rounded-full font-semibold 
              bg-gradient-to-r from-yellow-400 to-amber-500 
              hover:from-yellow-500 hover:to-amber-600 
              text-black shadow-md transition"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;