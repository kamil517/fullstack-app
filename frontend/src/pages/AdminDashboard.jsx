import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const AdminDashboard = () => {
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [notices, setNotices] = useState([]);
  const [archivedNotices, setArchivedNotices] = useState([]);
  const [activeTab, setActiveTab] = useState("notices");
  const [showArchived, setShowArchived] = useState(false);
  const [showNoticeForm, setShowNoticeForm] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("Academic");
  const [editingNoticeId, setEditingNoticeId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showProfileEdit, setShowProfileEdit] = useState(false);
  const [profileName, setProfileName] = useState("");
  const [profileEmail, setProfileEmail] = useState("");
  const [profilePassword, setProfilePassword] = useState("");
  const [showUserEditModal, setShowUserEditModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [editUserName, setEditUserName] = useState("");
  const [editUserEmail, setEditUserEmail] = useState("");
  const [editUserRole, setEditUserRole] = useState("");
  const [showNoticeModal, setShowNoticeModal] = useState(false);
  const [viewingNotice, setViewingNotice] = useState(null);
  
  // ── NEW: File upload states ──
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
    if (parsedUser.role !== "admin") {
      navigate(`/${parsedUser.role}`);
      return;
    }
    
    setUser(parsedUser);
    setProfileName(parsedUser.name);
    setProfileEmail(parsedUser.email);
    fetchUsers();
    fetchNotices();
  }, [navigate]);

  const fetchUsers = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/users");
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const fetchNotices = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/notices");
      const data = await response.json();
      const active = data.filter(n => !n.isArchived);
      const archived = data.filter(n => n.isArchived);
      setNotices(active);
      setArchivedNotices(archived);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // ── NEW: Handle file selection ──
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

  // ── UPDATED: Handle create/update with file ──
  const handleCreateNotice = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('content', content);
      formData.append('category', category);
      formData.append('author', JSON.stringify({ name: user?.name, role: user?.role }));
      
      if (file) {
        formData.append('file', file);
      }

      const response = await fetch("http://localhost:8080/api/notices", {
        method: "POST",
        body: formData
        // No Content-Type header - browser sets it with boundary for FormData
      });
      
      if (response.ok) {
        setTitle("");
        setContent("");
        setCategory("Academic");
        setFile(null);
        setFilePreview(null);
        setShowNoticeForm(false);
        fetchNotices();
        alert("✅ Notice created successfully!");
      } else {
        const error = await response.json();
        alert(`❌ Error: ${error.message || 'Something went wrong'}`);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("❌ Error creating notice");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditNotice = (notice) => {
    setTitle(notice.title);
    setContent(notice.content);
    setCategory(notice.category || "Academic");
    setEditingNoticeId(notice._id);
    setFile(null);
    setFilePreview(null);
    setShowNoticeForm(true);
  };

  // ── UPDATED: Handle update (edit) ──
  const handleUpdateNotice = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      // For edit, we'll use JSON (file upload on edit is more complex)
      // But we'll keep it simple - edit just text, not file
      const response = await fetch(`http://localhost:8080/api/notices/${editingNoticeId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content, category })
      });
      
      if (response.ok) {
        setTitle("");
        setContent("");
        setCategory("Academic");
        setFile(null);
        setFilePreview(null);
        setShowNoticeForm(false);
        setEditingNoticeId(null);
        fetchNotices();
        alert("✅ Notice updated successfully!");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("❌ Error updating notice");
    } finally {
      setSubmitting(false);
    }
  };

  const archiveNotice = async (id) => {
    if (window.confirm("Archive this notice?")) {
      try {
        await fetch(`http://localhost:8080/api/notices/archive/${id}`, { method: "PUT" });
        fetchNotices();
        alert("✅ Notice archived!");
      } catch (error) {
        alert("❌ Error archiving notice");
      }
    }
  };

  const restoreNotice = async (id) => {
    if (window.confirm("Restore this notice?")) {
      try {
        await fetch(`http://localhost:8080/api/notices/restore/${id}`, { method: "PUT" });
        fetchNotices();
        alert("✅ Notice restored!");
      } catch (error) {
        alert("❌ Error restoring notice");
      }
    }
  };

  const permanentDeleteNotice = async (id) => {
    if (window.confirm("⚠️ Permanently delete this notice?")) {
      try {
        await fetch(`http://localhost:8080/api/notices/${id}`, { method: "DELETE" });
        fetchNotices();
        alert("✅ Notice permanently deleted!");
      } catch (error) {
        alert("❌ Error deleting notice");
      }
    }
  };

  const viewNotice = (notice) => {
    setViewingNotice(notice);
    setShowNoticeModal(true);
  };

  const handleEditUser = (userToEdit) => {
    setEditingUser(userToEdit);
    setEditUserName(userToEdit.name);
    setEditUserEmail(userToEdit.email);
    setEditUserRole(userToEdit.role);
    setShowUserEditModal(true);
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:8080/api/users/${editingUser._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: editUserName,
          email: editUserEmail,
          role: editUserRole
        })
      });
      
      if (response.ok) {
        setShowUserEditModal(false);
        setEditingUser(null);
        fetchUsers();
        alert("✅ User updated!");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("❌ Error updating user");
    }
  };

  const deleteUser = async (id) => {
    if (window.confirm("Delete this user?")) {
      try {
        await fetch(`http://localhost:8080/api/users/${id}`, { method: "DELETE" });
        fetchUsers();
        alert("✅ User deleted!");
      } catch (error) {
        alert("❌ Error deleting user");
      }
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:8080/api/users/${user._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: profileName,
          email: profileEmail,
          password: profilePassword || undefined
        })
      });
      
      if (response.ok) {
        const updatedUser = { ...user, name: profileName, email: profileEmail };
        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));
        setShowProfileEdit(false);
        alert("✅ Profile updated!");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("❌ Error updating profile");
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // ── Helper to check if file is image ──
  const isImage = (fileType) => fileType?.startsWith('image/');

  const stats = {
    totalUsers: users.length,
    totalNotices: notices.length + archivedNotices.length,
    activeNotices: notices.length,
    archivedNotices: archivedNotices.length,
    students: users.filter(u => u.role === "student").length,
    faculty: users.filter(u => u.role === "faculty").length,
    admins: users.filter(u => u.role === "admin").length,
  };

  const filteredNotices = notices.filter(n =>
    n.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    n.content?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredUsers = users.filter(u =>
    u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredArchived = archivedNotices.filter(n =>
    n.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    n.content?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-200 via-blue-100 to-indigo-200 p-6">
      <div className="w-full max-w-7xl mx-auto bg-white/60 backdrop-blur-lg rounded-xl shadow-lg p-6">
        
        <div className="flex justify-between items-center mb-6 pb-4 border-b">
          <div>
            <h1 className="text-2xl font-semibold text-gray-700">🔧 Admin Dashboard</h1>
            <p className="text-sm text-gray-500 mt-1">Welcome, {user?.name}</p>
          </div>
          <div className="flex gap-3">
            <button onClick={() => setShowProfileEdit(true)} className="px-4 py-2 bg-cyan-500 text-white rounded-md hover:bg-cyan-600 transition">Edit Profile</button>
            <button onClick={handleLogout} className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition">Logout</button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-8">
          <div className="bg-white/80 rounded-lg p-4 text-center"><div className="text-2xl font-bold text-blue-600">{stats.totalUsers}</div><div className="text-gray-500 text-sm">Total Users</div></div>
          <div className="bg-white/80 rounded-lg p-4 text-center"><div className="text-2xl font-bold text-green-600">{stats.activeNotices}</div><div className="text-gray-500 text-sm">Active</div></div>
          <div className="bg-white/80 rounded-lg p-4 text-center"><div className="text-2xl font-bold text-yellow-600">{stats.archivedNotices}</div><div className="text-gray-500 text-sm">Archived</div></div>
          <div className="bg-white/80 rounded-lg p-4 text-center"><div className="text-2xl font-bold text-green-600">{stats.students}</div><div className="text-gray-500 text-sm">Students</div></div>
          <div className="bg-white/80 rounded-lg p-4 text-center"><div className="text-2xl font-bold text-purple-600">{stats.faculty}</div><div className="text-gray-500 text-sm">Faculty</div></div>
          <div className="bg-white/80 rounded-lg p-4 text-center"><div className="text-2xl font-bold text-red-600">{stats.admins}</div><div className="text-gray-500 text-sm">Admins</div></div>
        </div>

        <div className="flex gap-2 mb-6 border-b pb-2 flex-wrap">
          <button onClick={() => { setActiveTab("notices"); setShowArchived(false); }} className="px-4 py-2 rounded-md bg-cyan-500 text-white hover:bg-cyan-600 transition">Active Notices</button>
          <button onClick={() => { setActiveTab("notices"); setShowArchived(true); }} className="px-4 py-2 rounded-md bg-yellow-500 text-white hover:bg-yellow-600 transition">Archived</button>
          <button onClick={() => setActiveTab("users")} className="px-4 py-2 rounded-md bg-gray-300 hover:bg-gray-400 transition">Manage Users</button>
          <button onClick={() => setActiveTab("stats")} className="px-4 py-2 rounded-md bg-gray-300 hover:bg-gray-400 transition">Statistics</button>
        </div>

        <div className="mb-6">
          <input type="text" placeholder="🔍 Search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full px-4 py-2 border rounded-lg bg-white/70 focus:outline-none focus:ring-2 focus:ring-cyan-500" />
        </div>

        {activeTab === "notices" && !showArchived && (
          <div>
            <button onClick={() => { 
              setShowNoticeForm(!showNoticeForm); 
              if (!showNoticeForm) {
                setEditingNoticeId(null);
                setTitle("");
                setContent("");
                setCategory("Academic");
                setFile(null);
                setFilePreview(null);
              }
            }} className="mb-4 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition">
              {showNoticeForm ? "✖️ Cancel" : "+ Create Notice"}
            </button>
            
            {showNoticeForm && (
              <div className="bg-white/80 rounded-lg p-6 mb-6 shadow-md">
                <h3 className="text-lg font-semibold text-gray-700 mb-4">
                  {editingNoticeId ? "✏️ Edit Notice" : "📝 Create New Notice"}
                </h3>
                <form onSubmit={editingNoticeId ? handleUpdateNotice : handleCreateNotice}>
                  <input
                    type="text"
                    placeholder="📌 Notice Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full p-2 border rounded mb-3 bg-white"
                    required
                  />
                  <textarea
                    placeholder="📝 Notice Content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="w-full p-2 border rounded mb-3 bg-white"
                    rows="4"
                    required
                  />
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full p-2 border rounded mb-3 bg-white"
                  >
                    <option value="Academic">Academic</option>
                    <option value="Event">Event</option>
                    <option value="Announcement">Announcement</option>
                    <option value="Exam">Exam</option>
                  </select>

                  {/* ── FILE UPLOAD ── */}
                  {!editingNoticeId && (
                    <div className="mb-3 border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-blue-400 transition">
                      {!file ? (
                        <label className="cursor-pointer block text-center text-gray-500">
                          <span className="text-2xl block">📎</span>
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
                          <div className="flex justify-between items-center bg-gray-50 p-2 rounded">
                            <span className="text-sm">📄 {file.name}</span>
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
                            <img src={filePreview} className="max-h-32 rounded border" alt="preview" />
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  <button 
                    type="submit" 
                    disabled={submitting}
                    className="px-4 py-2 bg-cyan-500 text-white rounded-md hover:bg-cyan-600 transition disabled:opacity-50"
                  >
                    {submitting ? "⏳ Saving..." : (editingNoticeId ? "Update Notice" : "Publish Notice")}
                  </button>
                </form>
              </div>
            )}
            
            <table className="w-full text-sm text-left">
              <thead className="border-b">
                <tr>
                  <th className="py-3">Title</th>
                  <th className="py-3">Content</th>
                  <th className="py-3">Category</th>
                  <th className="py-3">Attachment</th>
                  <th className="py-3">Author</th>
                  <th className="py-3">Date</th>
                  <th className="py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredNotices.map((notice) => (
                  <tr key={notice._id} className="border-b hover:bg-white/40 transition">
                    <td className="py-3 font-medium">{notice.title}</td>
                    <td className="py-3 text-gray-600">{notice.content.substring(0, 40)}...</td>
                    <td className="py-3">
                      <span className={`px-2 py-1 rounded text-xs ${
                        notice.category === "Academic" ? "bg-blue-100 text-blue-700" :
                        notice.category === "Event" ? "bg-purple-100 text-purple-700" :
                        notice.category === "Exam" ? "bg-orange-100 text-orange-700" :
                        "bg-gray-100 text-gray-700"
                      }`}>{notice.category || "General"}</span>
                    </td>
                    <td className="py-3">
                      {notice.fileUrl ? (
                        <a 
                          href={`http://localhost:8080${notice.fileUrl}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline text-xs"
                        >
                          {isImage(notice.fileType) ? '🖼️ Image' : '📄 PDF'}
                        </a>
                      ) : (
                        <span className="text-gray-400 text-xs">—</span>
                      )}
                    </td>
                    <td className="py-3">{notice.author?.name}</td>
                    <td className="py-3 text-gray-500">{new Date(notice.createdAt).toLocaleDateString()}</td>
                    <td className="py-3">
                      <button onClick={() => viewNotice(notice)} className="px-2 py-1 bg-blue-500 text-white rounded text-xs mr-1 hover:bg-blue-600 transition">View</button>
                      <button onClick={() => handleEditNotice(notice)} className="px-2 py-1 bg-cyan-500 text-white rounded text-xs mr-1 hover:bg-cyan-600 transition">Edit</button>
                      <button onClick={() => archiveNotice(notice._id)} className="px-2 py-1 bg-yellow-500 text-white rounded text-xs hover:bg-yellow-600 transition">Archive</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredNotices.length === 0 && <div className="text-center py-8 text-gray-500">No notices found.</div>}
          </div>
        )}

        {activeTab === "notices" && showArchived && (
          <div>
            <table className="w-full text-sm text-left">
              <thead className="border-b">
                <tr>
                  <th className="py-3">Title</th>
                  <th className="py-3">Content</th>
                  <th className="py-3">Category</th>
                  <th className="py-3">Attachment</th>
                  <th className="py-3">Author</th>
                  <th className="py-3">Date</th>
                  <th className="py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredArchived.map((notice) => (
                  <tr key={notice._id} className="border-b hover:bg-white/40 transition">
                    <td className="py-3 font-medium">{notice.title}</td>
                    <td className="py-3 text-gray-600">{notice.content.substring(0, 40)}...</td>
                    <td className="py-3">
                      <span className={`px-2 py-1 rounded text-xs ${
                        notice.category === "Academic" ? "bg-blue-100 text-blue-700" :
                        notice.category === "Event" ? "bg-purple-100 text-purple-700" :
                        notice.category === "Exam" ? "bg-orange-100 text-orange-700" :
                        "bg-gray-100 text-gray-700"
                      }`}>{notice.category || "General"}</span>
                    </td>
                    <td className="py-3">
                      {notice.fileUrl ? (
                        <a 
                          href={`http://localhost:8080${notice.fileUrl}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline text-xs"
                        >
                          {isImage(notice.fileType) ? '🖼️ Image' : '📄 PDF'}
                        </a>
                      ) : (
                        <span className="text-gray-400 text-xs">—</span>
                      )}
                    </td>
                    <td className="py-3">{notice.author?.name}</td>
                    <td className="py-3 text-gray-500">{new Date(notice.createdAt).toLocaleDateString()}</td>
                    <td className="py-3">
                      <button onClick={() => viewNotice(notice)} className="px-2 py-1 bg-blue-500 text-white rounded text-xs mr-1 hover:bg-blue-600 transition">View</button>
                      <button onClick={() => restoreNotice(notice._id)} className="px-2 py-1 bg-green-500 text-white rounded text-xs mr-1 hover:bg-green-600 transition">Restore</button>
                      <button onClick={() => permanentDeleteNotice(notice._id)} className="px-2 py-1 bg-red-500 text-white rounded text-xs hover:bg-red-600 transition">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredArchived.length === 0 && <div className="text-center py-8 text-gray-500">No archived notices.</div>}
          </div>
        )}

        {activeTab === "users" && (
          <table className="w-full text-sm text-left">
            <thead className="border-b">
              <tr>
                <th className="py-3">Name</th>
                <th className="py-3">Email</th>
                <th className="py-3">Role</th>
                <th className="py-3">Joined</th>
                <th className="py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((u) => (
                <tr key={u._id} className="border-b hover:bg-white/40 transition">
                  <td className="py-3 font-medium">{u.name}</td>
                  <td className="py-3">{u.email}</td>
                  <td className="py-3">
                    <span className={`px-2 py-1 rounded text-xs ${
                      u.role === "admin" ? "bg-red-100 text-red-700" :
                      u.role === "faculty" ? "bg-purple-100 text-purple-700" :
                      "bg-green-100 text-green-700"
                    }`}>{u.role}</span>
                  </td>
                  <td className="py-3 text-gray-500">{new Date(u.createdAt).toLocaleDateString()}</td>
                  <td className="py-3">
                    <button onClick={() => handleEditUser(u)} className="px-2 py-1 bg-cyan-500 text-white rounded text-xs mr-1 hover:bg-cyan-600 transition">Edit</button>
                    <button onClick={() => deleteUser(u._id)} className="px-2 py-1 bg-red-500 text-white rounded text-xs hover:bg-red-600 transition">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {activeTab === "stats" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white/80 rounded-lg p-6 shadow-md">
              <h3 className="font-bold mb-4 text-gray-700">👥 User Distribution</h3>
              <div className="space-y-2">
                <div className="flex justify-between"><span>Students</span><span className="font-bold text-green-600">{stats.students}</span></div>
                <div className="flex justify-between"><span>Faculty</span><span className="font-bold text-purple-600">{stats.faculty}</span></div>
                <div className="flex justify-between"><span>Admins</span><span className="font-bold text-red-600">{stats.admins}</span></div>
              </div>
            </div>
            <div className="bg-white/80 rounded-lg p-6 shadow-md">
              <h3 className="font-bold mb-4 text-gray-700">📋 Notice Summary</h3>
              <div className="space-y-2">
                <div className="flex justify-between"><span>Active</span><span className="font-bold text-green-600">{stats.activeNotices}</span></div>
                <div className="flex justify-between"><span>Archived</span><span className="font-bold text-yellow-600">{stats.archivedNotices}</span></div>
                <div className="flex justify-between"><span>Total</span><span className="font-bold text-blue-600">{stats.totalNotices}</span></div>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* ── NOTICE VIEW MODAL ── */}
      {showNoticeModal && viewingNotice && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-[500px] max-w-[90%] max-h-[80vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-2 text-gray-800">{viewingNotice.title}</h2>
            <div className="flex gap-2 mb-4 flex-wrap">
              <span className={`px-2 py-1 rounded text-xs ${
                viewingNotice.category === "Academic" ? "bg-blue-100 text-blue-700" :
                viewingNotice.category === "Event" ? "bg-purple-100 text-purple-700" :
                viewingNotice.category === "Exam" ? "bg-orange-100 text-orange-700" :
                "bg-gray-100 text-gray-700"
              }`}>{viewingNotice.category || "General"}</span>
              <span className="text-xs text-gray-400">Posted: {new Date(viewingNotice.createdAt).toLocaleString()}</span>
            </div>
            <p className="text-gray-600 mb-4 whitespace-pre-wrap">{viewingNotice.content}</p>
            
            {/* ── FILE ATTACHMENT IN MODAL ── */}
            {viewingNotice.fileUrl && (
              <div className="mb-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-sm text-gray-500 mb-2">📎 Attachment:</p>
                {isImage(viewingNotice.fileType) ? (
                  <img 
                    src={`http://localhost:8080${viewingNotice.fileUrl}`} 
                    alt={viewingNotice.fileName}
                    className="max-w-full max-h-64 rounded-lg"
                  />
                ) : (
                  <a 
                    href={`http://localhost:8080${viewingNotice.fileUrl}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline flex items-center gap-2"
                  >
                    📄 {viewingNotice.fileName}
                  </a>
                )}
              </div>
            )}
            
            <div className="text-sm text-gray-500 mb-4">Posted by: {viewingNotice.author?.name || "Admin"}</div>
            <button onClick={() => setShowNoticeModal(false)} className="w-full px-4 py-2 bg-cyan-500 text-white rounded-md hover:bg-cyan-600 transition">
              Close
            </button>
          </div>
        </div>
      )}

      {/* ── USER EDIT MODAL ── */}
      {showUserEditModal && editingUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 max-w-[90%]">
            <h2 className="text-xl font-bold mb-4 text-gray-800">✏️ Edit User</h2>
            <form onSubmit={handleUpdateUser}>
              <input
                type="text"
                placeholder="Name"
                value={editUserName}
                onChange={(e) => setEditUserName(e.target.value)}
                className="w-full p-2 border rounded mb-3 bg-white"
                required
              />
              <input
                type="email"
                placeholder="Email"
                value={editUserEmail}
                onChange={(e) => setEditUserEmail(e.target.value)}
                className="w-full p-2 border rounded mb-3 bg-white"
                required
              />
              <select
                value={editUserRole}
                onChange={(e) => setEditUserRole(e.target.value)}
                className="w-full p-2 border rounded mb-3 bg-white"
              >
                <option value="student">Student</option>
                <option value="faculty">Faculty</option>
                <option value="admin">Admin</option>
              </select>
              <button type="submit" className="w-full px-4 py-2 bg-cyan-500 text-white rounded-md hover:bg-cyan-600 transition">
                Save Changes
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ── PROFILE EDIT MODAL ── */}
      {showProfileEdit && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 max-w-[90%]">
            <h2 className="text-xl font-bold mb-4 text-gray-800">✏️ Edit Profile</h2>
            <form onSubmit={handleUpdateProfile}>
              <input
                type="text"
                placeholder="Name"
                value={profileName}
                onChange={(e) => setProfileName(e.target.value)}
                className="w-full p-2 border rounded mb-3 bg-white"
                required
              />
              <input
                type="email"
                placeholder="Email"
                value={profileEmail}
                onChange={(e) => setProfileEmail(e.target.value)}
                className="w-full p-2 border rounded mb-3 bg-white"
                required
              />
              <input
                type="password"
                placeholder="New Password (leave blank to keep current)"
                value={profilePassword}
                onChange={(e) => setProfilePassword(e.target.value)}
                className="w-full p-2 border rounded mb-3 bg-white"
              />
              <button type="submit" className="w-full px-4 py-2 bg-cyan-500 text-white rounded-md hover:bg-cyan-600 transition">
                Save Profile
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminDashboard;