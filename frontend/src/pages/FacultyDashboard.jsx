import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const FacultyDashboard = () => {
  const [user, setUser] = useState(null);
  const [notices, setNotices] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("Academic");
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showNoticeModal, setShowNoticeModal] = useState(false);
  const [viewingNotice, setViewingNotice] = useState(null);
  
  const [file, setFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  
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
    if (parsedUser.role !== "faculty") {
      navigate(`/${parsedUser.role}`);
      return;
    }
    
    setUser(parsedUser);
    fetchNotices();
  }, [navigate]);

  const fetchNotices = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/notices");
      const data = await response.json();
      setNotices(data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      if (selectedFile.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = () => setFilePreview(reader.result);
        reader.readAsDataURL(selectedFile);
      } else {
        setFilePreview(null);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const token = localStorage.getItem("token");
      const url = editingId 
        ? `http://localhost:8080/api/notices/${editingId}`
        : "http://localhost:8080/api/notices";
      
      const method = editingId ? "PUT" : "POST";

      const formData = new FormData();
      formData.append('title', title);
      formData.append('content', content);
      formData.append('category', category);
      formData.append('author', JSON.stringify({ 
        id: user?.id, 
        name: user?.name, 
        role: user?.role 
      }));
      
      if (file) {
        formData.append('file', file);
      }

      let response;
      if (editingId) {
        response = await fetch(url, {
          method,
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify({
            title,
            content,
            category,
            author: { id: user?.id, name: user?.name, role: user?.role }
          })
        });
      } else {
        response = await fetch(url, {
          method,
          headers: {
            "Authorization": `Bearer ${token}`
          },
          body: formData
        });
      }
      
      if (response.ok) {
        setTitle("");
        setContent("");
        setCategory("Academic");
        setFile(null);
        setFilePreview(null);
        setShowForm(false);
        setEditingId(null);
        fetchNotices();
        alert(editingId ? " Notice updated successfully!" : " Notice created successfully!");
      }
    } catch (error) {
      console.error("Error:", error);
      alert(" Error saving notice");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (notice) => {
    setTitle(notice.title);
    setContent(notice.content);
    setCategory(notice.category || "Academic");
    setEditingId(notice._id);
    setFile(null);
    setFilePreview(null);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("⚠️ Are you sure you want to delete this notice?")) {
      await fetch(`http://localhost:8080/api/notices/${id}`, { method: "DELETE" });
      fetchNotices();
      alert(" Notice deleted successfully!");
    }
  };

  const viewNotice = (notice) => {
    setViewingNotice(notice);
    setShowNoticeModal(true);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const filteredNotices = notices.filter(notice =>
    notice.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    notice.content?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const categories = ["Academic", "Event", "Announcement", "Exam"];
  const isImage = (fileType) => fileType?.startsWith('image/');

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-200 via-blue-100 to-indigo-200 p-6 pt-24">
      
      {/* ── MAIN CONTAINER ── */}
      <div className="w-full max-w-7xl mx-auto bg-white/70 backdrop-blur-lg rounded-2xl shadow-2xl p-6 border border-white/30">
        
        {/* ── GOLD HEADER (NO BLUE NAVBAR) ── */}
        <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200/50">
          <div>
            <h1 className="text-3xl font-extrabold tracking-wide 
              bg-gradient-to-r from-yellow-500 via-yellow-600 to-amber-600 
              bg-clip-text text-transparent
              drop-shadow-[0_0_15px_rgba(255,215,0,0.2)]">
               Faculty Dashboard
            </h1>
            <p className="text-gray-700 text-sm mt-1 flex items-center gap-2">
              <span className="text-lg">🌟</span> 
              Welcome back, <span className="font-bold text-amber-600 drop-shadow-[0_0_8px_rgba(255,215,0,0.2)]">Prof. {user?.name}</span>!
              <span className="text-lg">🌟</span>
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="px-5 py-2.5 rounded-full font-semibold text-sm
              bg-gradient-to-r from-red-500 to-red-600 
              hover:from-red-600 hover:to-red-700 
              text-white shadow-lg hover:shadow-red-500/30 
              transition-all duration-300 hover:scale-105"
          >
             Logout
          </button>
        </div>

        {/* ── STATS CARDS with Gold Accents ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white/60 backdrop-blur rounded-xl p-4 text-center shadow-lg hover:shadow-yellow-400/30 border border-white/50 hover:border-yellow-400/50 transition-all duration-300 hover:scale-105">
            <div className="flex justify-center text-3xl mb-2">
              <i className="fas fa-file-alt text-yellow-400"></i>
            </div>
            <div className="text-2xl font-bold text-amber-600 drop-shadow-[0_0_10px_rgba(255,215,0,0.15)]">{notices.length}</div>
            <div className="text-gray-600 text-sm">Total Notices</div>
          </div>
          <div className="bg-white/60 backdrop-blur rounded-xl p-4 text-center shadow-lg hover:shadow-green-400/30 border border-white/50 hover:border-green-400/50 transition-all duration-300 hover:scale-105">
            <div className="flex justify-center text-3xl mb-2">
              <i className="fas fa-user-edit text-green-500"></i>
            </div>
            <div className="text-2xl font-bold text-green-600 drop-shadow-[0_0_10px_rgba(34,197,94,0.15)]">{notices.filter(n => n.author?.name === user?.name).length}</div>
            <div className="text-gray-600 text-sm">My Notices</div>
          </div>
          <div className="bg-white/60 backdrop-blur rounded-xl p-4 text-center shadow-lg hover:shadow-purple-400/30 border border-white/50 hover:border-purple-400/50 transition-all duration-300 hover:scale-105">
            <div className="flex justify-center text-3xl mb-2">
              <i className="fas fa-calendar-day text-purple-500"></i>
            </div>
            <div className="text-2xl font-bold text-purple-600 drop-shadow-[0_0_10px_rgba(168,85,247,0.15)]">{new Date().toLocaleDateString()}</div>
            <div className="text-gray-600 text-sm">Today's Date</div>
          </div>
        </div>

        {/* ── CREATE NOTICE BUTTON ── */}
        <div className="mb-6">
          <button
            onClick={() => { 
              setShowForm(!showForm); 
              setEditingId(null); 
              setTitle(""); 
              setContent("");
              setFile(null);
              setFilePreview(null);
            }}
            className="px-6 py-2.5 rounded-full font-semibold text-sm
              bg-gradient-to-r from-yellow-400 to-amber-500 
              hover:from-yellow-500 hover:to-amber-600 
              text-white shadow-md hover:shadow-yellow-400/30
              transition-all duration-300 hover:scale-105"
          >
            {showForm ? " Cancel" : " Create New Notice"}
          </button>
        </div>

        {/* ── CREATE/EDIT FORM ── */}
        {showForm && (
          <div className="bg-white/60 backdrop-blur rounded-xl p-6 mb-6 shadow-lg border border-white/50">
            <h3 className="text-lg font-bold text-amber-700 mb-4 flex items-center gap-2">
              <span className="text-xl"></span>
              {editingId ? " Edit Notice" : "Create New Notice"}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder=" Notice Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-3 rounded-xl bg-white/70 border border-gray-200 
                  focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent
                  text-gray-700 placeholder-gray-400 transition-all duration-300"
                required
              />
              <textarea
                placeholder=" Notice Content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full p-3 rounded-xl bg-white/70 border border-gray-200 
                  focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent
                  text-gray-700 placeholder-gray-400 transition-all duration-300"
                rows="4"
                required
              />
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full p-3 rounded-xl bg-white/70 border border-gray-200 
                  focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent
                  text-gray-700 transition-all duration-300"
              >
                {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>

              {/* ── FILE UPLOAD ── */}
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 hover:border-yellow-400 transition-all duration-300">
                {!file ? (
                  <label className="cursor-pointer block text-center text-gray-500">
                    <span className="text-3xl block"></span>
                    <span>Click to attach file (PDF, JPEG, PNG, GIF)</span>
                    <input 
                      type="file" 
                      accept=".pdf,.jpg,.jpeg,.png,.gif" 
                      onChange={handleFileChange} 
                      className="hidden" 
                    />
                  </label>
                ) : (
                  <div className="space-y-2">
                    <div className="flex justify-between items-center bg-white/70 p-2 rounded-lg">
                      <span className="text-sm"> {file.name}</span>
                      <button 
                        type="button"
                        onClick={() => {
                          setFile(null);
                          setFilePreview(null);
                        }} 
                        className="text-red-500 hover:text-red-700"
                      >
                        ✕
                      </button>
                    </div>
                    {filePreview && (
                      <img src={filePreview} className="max-h-32 rounded-lg border" alt="preview" />
                    )}
                  </div>
                )}
              </div>

              <button 
                type="submit" 
                disabled={submitting}
                className="w-full px-6 py-2.5 rounded-full font-semibold text-sm
                  bg-gradient-to-r from-yellow-400 to-amber-500 
                  hover:from-yellow-500 hover:to-amber-600 
                  text-white shadow-md hover:shadow-yellow-400/30
                  transition-all duration-300 hover:scale-105 disabled:opacity-50"
              >
                {submitting ? " Saving..." : (editingId ? " Update Notice" : " Publish Notice")}
              </button>
            </form>
          </div>
        )}

        {/* ── SEARCH ── */}
        <div className="mb-6">
          <input
            type="text"
            placeholder=" Search notices..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl bg-white/70 border border-gray-200 
              focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent
              text-gray-700 placeholder-gray-400 transition-all duration-300"
          />
        </div>

        {/* ── NOTICES TABLE ── */}
        <h2 className="text-lg font-bold text-amber-700 mb-4 flex items-center gap-2 drop-shadow-[0_0_10px_rgba(255,215,0,0.1)]">
          <span> </span> All Notices
        </h2>
        
        <div className="overflow-x-auto rounded-xl border border-gray-200/50">
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
                  className={`border-b border-gray-100 hover:bg-yellow-50/50 transition-all duration-300 ${
                    index % 2 === 0 ? 'bg-white/40' : 'bg-white/20'
                  }`}
                >
                  <td className="py-3 px-4 font-medium text-amber-700">{notice.title}</td>
                  <td className="py-3 px-4 text-gray-600">{notice.content.substring(0, 40)}...</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      notice.category === "Academic" ? "bg-blue-100 text-blue-700" :
                      notice.category === "Event" ? "bg-purple-100 text-purple-700" :
                      notice.category === "Exam" ? "bg-orange-100 text-orange-700" :
                      "bg-gray-100 text-gray-700"
                    }`}>{notice.category || "General"}</span>
                  </td>
                  <td className="py-3 px-4">
                    {notice.fileUrl ? (
                      <a 
                        href={`http://localhost:8080${notice.fileUrl}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:text-blue-700 hover:underline text-xs transition-colors"
                      >
                        {isImage(notice.fileType) ? 'Image' : ' PDF'}
                      </a>
                    ) : (
                      <span className="text-gray-400 text-xs">—</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-gray-600">{notice.author?.name || "Admin"}</td>
                  <td className="py-3 px-4 text-gray-500">{new Date(notice.createdAt).toLocaleDateString()}</td>
                  <td className="py-3 px-4 text-center">
                    <button onClick={() => viewNotice(notice)} className="px-3 py-1 rounded-full text-xs font-medium
                      bg-gradient-to-r from-blue-400 to-blue-500 
                      hover:from-blue-500 hover:to-blue-600 
                      text-white shadow-md hover:shadow-blue-400/30 
                      transition-all duration-300 hover:scale-105 mr-1">
                      👁️ View
                    </button>
                    {notice.author?.name === user?.name && (
                      <>
                        <button onClick={() => handleEdit(notice)} className="px-3 py-1 rounded-full text-xs font-medium
                          bg-gradient-to-r from-yellow-400 to-amber-500 
                          hover:from-yellow-500 hover:to-amber-600 
                          text-white shadow-md hover:shadow-yellow-400/30 
                          transition-all duration-300 hover:scale-105 mr-1">
                          ✏️ Edit
                        </button>
                        <button onClick={() => handleDelete(notice._id)} className="px-3 py-1 rounded-full text-xs font-medium
                          bg-gradient-to-r from-red-400 to-red-500 
                          hover:from-red-500 hover:to-red-600 
                          text-white shadow-md hover:shadow-red-400/30 
                          transition-all duration-300 hover:scale-105">
                          🗑️ Delete
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredNotices.length === 0 && (
            <div className="text-center py-8 text-gray-500"> No notices found.</div>
          )}
        </div>
      </div>

      {/* ── NOTICE VIEW MODAL ── */}
      {showNoticeModal && viewingNotice && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
          <div className="bg-white rounded-2xl p-6 w-[500px] max-w-[90%] max-h-[80vh] overflow-y-auto shadow-2xl border border-yellow-200">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl"></span>
              <h2 className="text-xl font-bold text-amber-700 drop-shadow-[0_0_10px_rgba(255,215,0,0.1)]">
                {viewingNotice.title}
              </h2>
            </div>
            <div className="flex gap-2 mb-4 flex-wrap">
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                viewingNotice.category === "Academic" ? "bg-blue-100 text-blue-700" :
                viewingNotice.category === "Event" ? "bg-purple-100 text-purple-700" :
                viewingNotice.category === "Exam" ? "bg-orange-100 text-orange-700" :
                "bg-gray-100 text-gray-700"
              }`}>{viewingNotice.category || "General"}</span>
              <span className="text-xs text-gray-500 flex items-center gap-1">
                 {new Date(viewingNotice.createdAt).toLocaleString()}
              </span>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 mb-4 border border-gray-200">
              <p className="text-gray-700 leading-relaxed">{viewingNotice.content}</p>
            </div>
            
            {viewingNotice.fileUrl && (
              <div className="mb-4 p-3 bg-gray-50 rounded-xl border border-gray-200">
                <p className="text-sm text-gray-500 mb-2">📎 Attachment:</p>
                {isImage(viewingNotice.fileType) ? (
                  <img 
                    src={`http://localhost:8080${viewingNotice.fileUrl}`} 
                    alt={viewingNotice.fileName}
                    className="max-w-full max-h-64 rounded-lg border border-gray-200"
                  />
                ) : (
                  <a 
                    href={`http://localhost:8080${viewingNotice.fileUrl}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:text-blue-700 hover:underline flex items-center gap-2"
                  >
                     {viewingNotice.fileName}
                  </a>
                )}
              </div>
            )}
            
            <div className="text-sm text-gray-500 mb-4 flex items-center gap-2">
              👤 Posted by: <span className="text-amber-600">{viewingNotice.author?.name || "Admin"}</span>
            </div>
            <button 
              onClick={() => setShowNoticeModal(false)} 
              className="w-full px-4 py-2.5 rounded-full font-semibold
                bg-gradient-to-r from-yellow-400 to-amber-500 
                hover:from-yellow-500 hover:to-amber-600 
                text-white shadow-md hover:shadow-yellow-400/30 
                transition-all duration-300 hover:scale-105"
            >
              ✨ Close
            </button>
          </div>
        </div>
      )}

      {/* ── ANIMATION STYLES ── */}
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.95) translateY(20px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default FacultyDashboard;