import { useEffect, useState, useRef } from "react";
import logo from "../assets/bitec.png";

// ── DYNAMIC API URL ──
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';
const UPLOADS_URL = API_URL.replace('/api', ''); // For images/uploads

const PublicDisplay = () => {
  const [notices, setNotices] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(true);
  const [rotationInterval] = useState(10000);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    fetchNotices();
    const refreshInterval = setInterval(fetchNotices, 30000);
    return () => clearInterval(refreshInterval);
  }, []);

  useEffect(() => {
    if (notices.length > 1) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % notices.length);
      }, rotationInterval);
      return () => clearInterval(interval);
    }
  }, [notices.length, rotationInterval]);

  const fetchNotices = async () => {
    try {
      const response = await fetch(`${API_URL}/notices`);
      const data = await response.json();
      setNotices(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching notices:", error);
      setLoading(false);
    }
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % notices.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + notices.length) % notices.length);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const isImage = (fileType) => fileType?.startsWith('image/');
  const isPDF = (fileType) => fileType === 'application/pdf';

  const currentNotice = notices[currentSlide];

  return (
    <div ref={containerRef} className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      
      <div className="fixed inset-0 flex flex-col">
        
        <div className="bg-black/50 backdrop-blur-md p-4 z-20">
          <div className="container mx-auto flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full p-[2px] 
                bg-gradient-to-br from-yellow-300 via-yellow-400 to-amber-500
                shadow-[0_0_12px_rgba(255,215,0,0.6)]">
                <div className="w-full h-full rounded-full bg-white overflow-hidden">
                  <img
                    src={logo}
                    alt="BiTec Logo"
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white tracking-wide">Digital Notice Board</h1>
                <p className="text-sm text-gray-300">Official Announcements & Updates</p>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-right">
                <div className="text-3xl font-mono font-bold text-white" id="clock">
                  {new Date().toLocaleTimeString()}
                </div>
                <div className="text-sm text-gray-300">
                  {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </div>
              </div>
              <button
                onClick={toggleFullscreen}
                className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition flex items-center gap-2 text-white"
              >
                <span className="text-xl">{isFullscreen ? '🗗' : '🗖'}</span>
                <span className="text-sm hidden sm:inline">{isFullscreen ? 'Exit Full Screen' : 'Full Screen'}</span>
              </button>
            </div>
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center p-8 overflow-auto">
          {loading ? (
            <div className="text-center">
              <div className="w-24 h-24 rounded-full p-[3px] 
                bg-gradient-to-br from-yellow-300 via-yellow-400 to-amber-500
                shadow-[0_0_20px_rgba(255,215,0,0.6)] mx-auto mb-6">
                <div className="w-full h-full rounded-full bg-white overflow-hidden">
                  <img src={logo} alt="BiTec Logo" className="w-full h-full object-cover rounded-full" />
                </div>
              </div>
              <h2 className="text-3xl font-bold text-white mb-2 tracking-wide">Loading Notices...</h2>
              <p className="text-xl text-gray-300">Please wait while we fetch the latest updates</p>
            </div>
          ) : notices.length === 0 ? (
            <div className="text-center">
              <div className="w-24 h-24 rounded-full p-[3px] 
                bg-gradient-to-br from-yellow-300 via-yellow-400 to-amber-500
                shadow-[0_0_20px_rgba(255,215,0,0.6)] mx-auto mb-6">
                <div className="w-full h-full rounded-full bg-white overflow-hidden">
                  <img src={logo} alt="BiTec Logo" className="w-full h-full object-cover rounded-full" />
                </div>
              </div>
              <h2 className="text-4xl font-bold text-white mb-4 tracking-wide">No Notices Available</h2>
              <p className="text-xl text-gray-300">Check back later for updates and announcements</p>
            </div>
          ) : (
            <div className="max-w-6xl w-full">
              
              <div className="mb-8">
                <div className="h-1.5 bg-white/20 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-green-400 to-blue-500 rounded-full"
                    style={{ 
                      width: '100%',
                      animation: `shrink ${rotationInterval}ms linear forwards`,
                      animationPlayState: 'running'
                    }}
                    key={currentSlide}
                  />
                </div>
              </div>

              {notices.length > 1 && (
                <>
                  <button 
                    onClick={prevSlide}
                    className="absolute left-6 top-1/2 transform -translate-y-1/2 w-14 h-14 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center text-3xl text-white transition z-10"
                  >
                    ◀
                  </button>
                  <button 
                    onClick={nextSlide}
                    className="absolute right-6 top-1/2 transform -translate-y-1/2 w-14 h-14 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center text-3xl text-white transition z-10"
                  >
                    ▶
                  </button>
                </>
              )}

              <div className="flex justify-center gap-3 mb-8">
                {notices.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentSlide(idx)}
                    className={`transition-all cursor-pointer ${
                      idx === currentSlide 
                        ? "w-10 h-2 bg-yellow-400 rounded-full" 
                        : "w-2 h-2 bg-white/40 hover:bg-white/60 rounded-full"
                    }`}
                  />
                ))}
              </div>

              <div className="bg-white/10 backdrop-blur-md rounded-3xl p-12 shadow-2xl border border-white/20 min-h-[500px] flex flex-col justify-between">
                
                <div className="mb-6">
                  <span className={`px-4 py-2 rounded-full text-sm font-semibold tracking-wide ${
                    currentNotice?.category === "Academic" ? "bg-blue-500" :
                    currentNotice?.category === "Event" ? "bg-purple-500" :
                    currentNotice?.category === "Exam" ? "bg-orange-500" :
                    "bg-gray-500"
                  }`}>
                    {currentNotice?.category || "General Announcement"}
                  </span>
                </div>

                <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight tracking-tight font-['Playfair_Display','Georgia',serif]">
                  {currentNotice?.title}
                </h1>

                <p className="text-xl md:text-2xl text-gray-200 leading-relaxed mb-8 font-['Open_Sans','Arial',sans-serif]">
                  {currentNotice?.content}
                </p>

                {currentNotice?.fileUrl && (
                  <div className="mb-6 p-4 bg-white/10 rounded-xl border border-white/10">
                    {isImage(currentNotice.fileType) ? (
                      <div className="text-center">
                        <img 
                          src={`${UPLOADS_URL}${currentNotice.fileUrl}`} 
                          alt={currentNotice.fileName}
                          className="max-w-full max-h-96 rounded-lg mx-auto shadow-lg"
                          onError={(e) => {
                            console.error('Image failed to load:', e.target.src);
                          }}
                        />
                        <p className="text-sm text-gray-300 mt-2">📷 {currentNotice.fileName}</p>
                      </div>
                    ) : isPDF(currentNotice.fileType) ? (
                      <div className="flex items-center justify-center gap-4 flex-wrap">
                        <span className="text-red-400 text-6xl">📄</span>
                        <div>
                          <p className="text-white text-lg font-medium">{currentNotice.fileName}</p>
                          <a 
                            href={`${UPLOADS_URL}${currentNotice.fileUrl}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-400 hover:text-blue-300 underline text-sm"
                          >
                            Click to view PDF ↗
                          </a>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center gap-4 flex-wrap">
                        <span className="text-gray-400 text-6xl">📎</span>
                        <div>
                          <p className="text-white text-lg font-medium">{currentNotice.fileName}</p>
                          <a 
                            href={`${UPLOADS_URL}${currentNotice.fileUrl}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-400 hover:text-blue-300 underline text-sm"
                          >
                            Click to download ↗
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                <div className="flex flex-wrap justify-between items-center text-sm text-gray-400 border-t border-white/20 pt-6 gap-4">
                  <div className="flex flex-wrap gap-6">
                    <span className="flex items-center gap-1">📅 {new Date(currentNotice?.createdAt).toLocaleDateString()}</span>
                    <span className="flex items-center gap-1">👤 Posted by: {currentNotice?.author?.name || "Administrator"}</span>
                    {currentNotice?.fileUrl && (
                      <span className="flex items-center gap-1 text-green-400">📎 Has attachment</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full p-[1px] bg-gradient-to-br from-yellow-300 via-yellow-400 to-amber-500">
                      <div className="w-full h-full rounded-full bg-white overflow-hidden">
                        <img src={logo} alt="Logo" className="w-full h-full object-cover" />
                      </div>
                    </div>
                    <span className="px-3 py-1 bg-white/10 rounded-full text-xs">
                      Notice {currentSlide + 1} of {notices.length}
                    </span>
                  </div>
                </div>
              </div>

              <div className="text-center mt-6 text-sm text-gray-400">
                🔄 Auto-rotating every {rotationInterval / 1000} seconds • Next notice in {rotationInterval / 1000} seconds
              </div>
            </div>
          )}
        </div>

        <div className="bg-black/50 backdrop-blur-md py-3 overflow-hidden">
          <div className="whitespace-nowrap animate-marquee text-sm text-gray-300 flex items-center justify-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full p-[1px] bg-gradient-to-br from-yellow-300 via-yellow-400 to-amber-500">
                <div className="w-full h-full rounded-full bg-white overflow-hidden">
                  <img src={logo} alt="Logo" className="w-full h-full object-cover" />
                </div>
              </div>
              <span>BiTec</span>
            </div>
            <span>📢 DIGITAL NOTICE BOARD | Stay updated with latest announcements |</span>
            <span>For urgent notices, please contact the administration |</span>
            <span>Current time: <span id="marqueeTime">{new Date().toLocaleTimeString()}</span> |</span>
            <span>Total Notices: {notices.length} |</span>
          </div>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700;800;900&family=Open+Sans:wght@300;400;500;600;700;800&display=swap');
        
        @keyframes shrink {
          from {
            width: 100%;
          }
          to {
            width: 0%;
          }
        }
        @keyframes marquee {
          0% {
            transform: translateX(100%);
          }
          100% {
            transform: translateX(-100%);
          }
        }
        .animate-marquee {
          animation: marquee 25s linear infinite;
          display: inline-flex;
          gap: 2rem;
        }
        
        .font-serif {
          font-family: 'Playfair Display', Georgia, serif;
        }
        .font-sans {
          font-family: 'Open Sans', Arial, sans-serif;
        }
      `}</style>

      <script dangerouslySetInnerHTML={{
        __html: `
          function updateClock() {
            const now = new Date();
            const clockElement = document.getElementById('clock');
            const marqueeTime = document.getElementById('marqueeTime');
            if (clockElement) {
              clockElement.textContent = now.toLocaleTimeString();
            }
            if (marqueeTime) {
              marqueeTime.textContent = now.toLocaleTimeString();
            }
          }
          setInterval(updateClock, 1000);
        `
      }} />
    </div>
  );
};

export default PublicDisplay;