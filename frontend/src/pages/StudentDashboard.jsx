import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// ── DYNAMIC API URL ──
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

const StudentDashboard = () => {
  const [user, setUser] = useState(null);
  const [notices, setNotices] = useState([]);
  const [filteredNotices, setFilteredNotices] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [loading, setLoading] = useState(true);
  const [showNoticeModal, setShowNoticeModal] = useState(false);
  const [viewingNotice, setViewingNotice] = useState(null);
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");
    
    if (!token || !userData) {
      navigate("/login");
      return;
    }
    
    const parsedUser = JSON.parse(userData);
    if (parsedUser.role !== "student") {
      navigate(`/${parsedUser.role}`);
      return;
    }
    
    setUser(parsedUser);
    fetchNotices();
  }, [navigate]);

  const fetchNotices = async () => {
    try {
      const response = await fetch(`${API_URL}/api/notices`);
      const data = await response.json();
      setNotices(data);
      setFilteredNotices(data);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let filtered = notices;
    
    if (searchTerm) {
      filtered = filtered.filter(notice => 
        notice.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        notice.content?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (selectedCategory !== "all") {
      filtered = filtered.filter(notice => notice.category === selectedCategory);
    }
    
    setFilteredNotices(filtered);
  }, [searchTerm, selectedCategory, notices]);

  const viewNotice = (notice) => {
    setViewingNotice(notice);
    setShowNoticeModal(true);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isImage = (fileType) => fileType?.startsWith('image/');
  const categories = ["all", "Academic", "Event", "Announcement", "Exam"];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-200 via-blue-100 to-indigo-200 p-6 pt-24 perspective-1000">
    
      {/* ── MAIN CONTAINER with 3D Hover Effect ── */}
      <div className="w-full max-w-7xl mx-auto bg-white/70 backdrop-blur-lg rounded-2xl shadow-2xl p-6 border border-white/30 
        transition-all duration-500 ease-out hover:shadow-2xl hover:shadow-yellow-500/20 
        transform hover:scale-[1.01] hover:rotate-x-2 hover:rotate-y-1"
        style={{ transformStyle: 'preserve-3d' }}>
        
        {/* ── HEADER with Gold Theme ── */}
        <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200/50">
          <div>
            <h1 className="text-3xl font-extrabold tracking-wide 
              bg-gradient-to-r from-yellow-500 via-yellow-600 to-amber-600 
              bg-clip-text text-transparent
              drop-shadow-[0_0_15px_rgba(255,215,0,0.2)]
              transform transition-all duration-300 hover:scale-105 hover:rotate-y-1">
              👑 Student Dashboard
            </h1>
            <p className="text-gray-700 text-sm mt-1 flex items-center gap-2">
              <span className="text-lg animate-bounce">🌟</span> 
              Welcome back, <span className="font-bold text-amber-600 drop-shadow-[0_0_8px_rgba(255,215,0,0.2)]">{user?.name}</span>!
              <span className="text-lg animate-bounce delay-75">🌟</span>
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="px-5 py-2.5 rounded-full font-semibold text-sm
              bg-gradient-to-r from-red-500 to-red-600 
              hover:from-red-600 hover:to-red-700 
              text-white shadow-lg hover:shadow-red-500/30 
              transition-all duration-300 hover:scale-110 hover:rotate-y-2
              active:scale-95"
          >
            🚪 Logout
          </button>
        </div>

        {/* ── STATS CARDS with 3D Hover ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white/60 backdrop-blur rounded-xl p-4 text-center shadow-lg hover:shadow-yellow-400/30 border border-white/50 hover:border-yellow-400/50 
            transition-all duration-500 ease-out hover:scale-105 hover:rotate-y-1 hover:translate-z-10
            transform perspective-500 cursor-pointer">
            <div className="text-3xl mb-2 transform transition-all duration-500 hover:scale-110 hover:rotate-12">📋</div>
            <div className="text-2xl font-bold text-amber-600 drop-shadow-[0_0_10px_rgba(255,215,0,0.15)]">{notices.length}</div>
            <div className="text-gray-600 text-sm">Total Notices</div>
          </div>
          <div className="bg-white/60 backdrop-blur rounded-xl p-4 text-center shadow-lg hover:shadow-blue-400/30 border border-white/50 hover:border-blue-400/50 
            transition-all duration-500 ease-out hover:scale-105 hover:-rotate-y-1 hover:translate-z-10
            transform perspective-500 cursor-pointer">
            <div className="text-3xl mb-2 transform transition-all duration-500 hover:scale-110 hover:-rotate-12">📖</div>
            <div className="text-2xl font-bold text-blue-600 drop-shadow-[0_0_10px_rgba(59,130,246,0.15)]">{notices.filter(n => n.category === "Academic").length}</div>
            <div className="text-gray-600 text-sm">Academic</div>
          </div>
          <div className="bg-white/60 backdrop-blur rounded-xl p-4 text-center shadow-lg hover:shadow-purple-400/30 border border-white/50 hover:border-purple-400/50 
            transition-all duration-500 ease-out hover:scale-105 hover:rotate-y-1 hover:translate-z-10
            transform perspective-500 cursor-pointer">
            <div className="text-3xl mb-2 transform transition-all duration-500 hover:scale-110 hover:rotate-12">🎉</div>
            <div className="text-2xl font-bold text-purple-600 drop-shadow-[0_0_10px_rgba(168,85,247,0.15)]">{notices.filter(n => n.category === "Event").length}</div>
            <div className="text-gray-600 text-sm">Events</div>
          </div>
          <div className="bg-white/60 backdrop-blur rounded-xl p-4 text-center shadow-lg hover:shadow-orange-400/30 border border-white/50 hover:border-orange-400/50 
            transition-all duration-500 ease-out hover:scale-105 hover:-rotate-y-1 hover:translate-z-10
            transform perspective-500 cursor-pointer">
            <div className="text-3xl mb-2 transform transition-all duration-500 hover:scale-110 hover:-rotate-12">📅</div>
            <div className="text-2xl font-bold text-orange-600 drop-shadow-[0_0_10px_rgba(251,146,60,0.15)]">{notices.filter(n => n.category === "Exam").length}</div>
            <div className="text-gray-600 text-sm">Exams</div>
          </div>
        </div>

        {/* ── SEARCH & FILTER with 3D Hover ── */}
        <div className="bg-white/60 backdrop-blur rounded-xl p-4 mb-6 shadow-lg border border-white/50
          transition-all duration-500 hover:shadow-xl hover:shadow-yellow-500/10
          transform hover:scale-[1.005] hover:translate-z-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="🔍 Search notices..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-white/70 border border-gray-200 
                focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent
                text-gray-700 placeholder-gray-400 transition-all duration-300
                focus:scale-[1.02] focus:shadow-lg"
            />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-white/70 border border-gray-200 
                focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent
                text-gray-700 transition-all duration-300
                focus:scale-[1.02] focus:shadow-lg"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat.toUpperCase()}</option>
              ))}
            </select>
          </div>
        </div>

        {/* ── NOTICES TABLE with 3D Row Effects ── */}
        <h2 className="text-lg font-bold text-amber-700 mb-4 flex items-center gap-2 drop-shadow-[0_0_10px_rgba(255,215,0,0.1)]
          transition-all duration-300 hover:scale-105 hover:translate-x-2">
          <span>📋</span> Latest Notices
        </h2>
        
        {loading ? (
          <div className="text-center py-10 text-gray-500 animate-pulse">Loading notices...</div>
        ) : filteredNotices.length === 0 ? (
          <div className="bg-white/60 backdrop-blur rounded-xl p-8 text-center text-gray-500 border border-white/50
            transition-all duration-500 hover:scale-[1.01] hover:shadow-xl">
            📭 No notices found.
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-gray-200/50
            transition-all duration-500 hover:shadow-xl">
            <table className="w-full text-sm text-left">
              <thead className="bg-gradient-to-r from-yellow-100/80 to-amber-100/80 text-gray-700 border-b border-gray-200">
                <tr>
                  <th className="py-3 px-4 font-semibold">Title</th>
                  <th className="py-3 px-4 font-semibold">Content</th>
                  <th className="py-3 px-4 font-semibold">Category</th>
                  <th className="py-3 px-4 font-semibold">Attachment</th>
                  <th className="py-3 px-4 font-semibold">Posted By</th>
                  <th className="py-3 px-4 font-semibold">Date</th>
                  <th className="py-3 px-4 font-semibold text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredNotices.map((notice, index) => (
                  <tr 
                    key={notice._id} 
                    className={`border-b border-gray-100 transition-all duration-500 ease-out
                      ${index % 2 === 0 ? 'bg-white/40' : 'bg-white/20'}
                      hover:bg-yellow-50/70 hover:scale-[1.01] hover:shadow-md hover:translate-x-1
                      transform perspective-500`}
                    style={{ transitionDelay: `${index * 50}ms` }}
                  >
                    <td className="py-3 px-4 font-medium text-amber-700 drop-shadow-[0_0_8px_rgba(255,215,0,0.05)]
                      transition-all duration-300 hover:scale-105 hover:translate-x-1">
                      {notice.title}
                    </td>
                    <td className="py-3 px-4 text-gray-600">{notice.content?.substring(0, 40)}...</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium 
                        transition-all duration-300 hover:scale-110 hover:shadow-md inline-block ${
                        notice.category === "Academic" ? "bg-blue-100 text-blue-700" :
                        notice.category === "Event" ? "bg-purple-100 text-purple-700" :
                        notice.category === "Exam" ? "bg-orange-100 text-orange-700" :
                        "bg-gray-100 text-gray-700"
                      }`}>{notice.category || "General"}</span>
                    </td>
                    <td className="py-3 px-4">
                      {notice.fileUrl ? (
                        <a 
                          href={`${API_URL}${notice.fileUrl}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:text-blue-700 hover:underline text-xs transition-all duration-300 hover:scale-110 inline-block"
                        >
                          {isImage(notice.fileType) ? '🖼️ Image' : '📄 PDF'}
                        </a>
                      ) : (
                        <span className="text-gray-400 text-xs">—</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-gray-600">{notice.author?.name || "Admin"}</td>
                    <td className="py-3 px-4 text-gray-500">{new Date(notice.createdAt).toLocaleDateString()}</td>
                    <td className="py-3 px-4 text-center">
                      <button 
                        onClick={() => viewNotice(notice)} 
                        className="px-4 py-1.5 rounded-full text-xs font-medium
                          bg-gradient-to-r from-yellow-400 to-amber-500 
                          hover:from-yellow-500 hover:to-amber-600 
                          text-white shadow-md hover:shadow-yellow-400/30 
                          transition-all duration-300 hover:scale-110 hover:rotate-y-2
                          active:scale-95 inline-block"
                      >
                        👁️ View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── NOTICE VIEW MODAL with 3D Effect ── */}
      {showNoticeModal && viewingNotice && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
          <div className="bg-white rounded-2xl p-6 w-[500px] max-w-[90%] max-h-[80vh] overflow-y-auto shadow-2xl border border-yellow-200
            transition-all duration-500 hover:shadow-2xl hover:shadow-yellow-500/20
            transform hover:scale-[1.02] hover:rotate-y-1 perspective-500">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl transition-all duration-500 hover:scale-125 hover:rotate-12 inline-block">📜</span>
              <h2 className="text-xl font-bold text-amber-700 drop-shadow-[0_0_10px_rgba(255,215,0,0.1)]
                transition-all duration-300 hover:scale-105 hover:translate-x-1">
                {viewingNotice.title}
              </h2>
            </div>
            <div className="flex gap-2 mb-4 flex-wrap">
              <span className={`px-3 py-1 rounded-full text-xs font-medium transition-all duration-300 hover:scale-110 ${
                viewingNotice.category === "Academic" ? "bg-blue-100 text-blue-700" :
                viewingNotice.category === "Event" ? "bg-purple-100 text-purple-700" :
                viewingNotice.category === "Exam" ? "bg-orange-100 text-orange-700" :
                "bg-gray-100 text-gray-700"
              }`}>{viewingNotice.category || "General"}</span>
              <span className="text-xs text-gray-500 flex items-center gap-1">
                📅 {new Date(viewingNotice.createdAt).toLocaleString()}
              </span>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 mb-4 border border-gray-200
              transition-all duration-300 hover:shadow-lg hover:scale-[1.005]">
              <p className="text-gray-700 leading-relaxed">{viewingNotice.content}</p>
            </div>
            
            {viewingNotice.fileUrl && (
              <div className="mb-4 p-3 bg-gray-50 rounded-xl border border-gray-200
                transition-all duration-300 hover:shadow-lg hover:scale-[1.005]">
                <p className="text-sm text-gray-500 mb-2">📎 Attachment:</p>
                {isImage(viewingNotice.fileType) ? (
                  <img 
                    src={`${API_URL}${viewingNotice.fileUrl}`} 
                    alt={viewingNotice.fileName}
                    className="max-w-full max-h-64 rounded-lg border border-gray-200
                      transition-all duration-500 hover:scale-105 hover:shadow-xl"
                  />
                ) : (
                  <a 
                    href={`${API_URL}${viewingNotice.fileUrl}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:text-blue-700 hover:underline flex items-center gap-2
                      transition-all duration-300 hover:scale-105 hover:translate-x-1 inline-block"
                  >
                    📄 {viewingNotice.fileName}
                  </a>
                )}
              </div>
            )}
            
            <div className="text-sm text-gray-500 mb-4 flex items-center gap-2">
              👤 Posted by: <span className="text-amber-600 transition-all duration-300 hover:scale-105 hover:translate-x-1 inline-block">{viewingNotice.author?.name || "Admin"}</span>
            </div>
            <button 
              onClick={() => setShowNoticeModal(false)} 
              className="w-full px-4 py-2.5 rounded-full font-semibold
                bg-gradient-to-r from-yellow-400 to-amber-500 
                hover:from-yellow-500 hover:to-amber-600 
                text-white shadow-md hover:shadow-yellow-400/30 
                transition-all duration-300 hover:scale-105 hover:rotate-y-1
                active:scale-95"
            >
              ✨ Close
            </button>
          </div>
        </div>
      )}

      {/* ── 3D & ANIMATION STYLES ── */}
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.95) translateY(20px) rotateX(-5deg);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0) rotateX(0deg);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
        
        .perspective-1000 {
          perspective: 1000px;
        }
        .perspective-500 {
          perspective: 500px;
        }
        
        .animate-bounce {
          animation: bounce 2s infinite;
        }
        .delay-75 {
          animation-delay: 0.75s;
        }
        
        @keyframes bounce {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.3) rotate(10deg); }
        }
        
        /* 3D Card Hover */
        .hover\\:rotate-x-2:hover {
          transform: rotateX(2deg) scale(1.01);
        }
        .hover\\:rotate-y-1:hover {
          transform: rotateY(1deg) scale(1.01);
        }
        .hover\\:rotate-y-2:hover {
          transform: rotateY(2deg) scale(1.1);
        }
        .hover\\:translate-z-10:hover {
          transform: translateZ(10px);
        }
        .hover\\:translate-z-5:hover {
          transform: translateZ(5px);
        }
        
        /* Smooth transitions */
        .transition-all {
          transition-property: all;
          transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
        }
        .duration-500 {
          transition-duration: 500ms;
        }
        .duration-300 {
          transition-duration: 300ms;
        }
        .ease-out {
          transition-timing-function: cubic-bezier(0, 0, 0.2, 1);
        }
      `}</style>
    </div>
  );
};

export default StudentDashboard;