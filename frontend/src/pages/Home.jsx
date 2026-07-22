import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import bgImage from "../assets/background.jpg";
import CountUp from "../components/CountUp";
import { FaPaperPlane, FaLocationDot, FaEnvelope, FaPhone, FaUser, FaRocket } from 'react-icons/fa6';
import emailjs from '@emailjs/browser';

// ── API URL FOR PRODUCTION ──
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

// EmailJS Configuration
const EMAILJS_SERVICE_ID = 'service_3jo7xbf';
const EMAILJS_TEMPLATE_ID = 'template_kfeebjt';
const EMAILJS_PUBLIC_KEY = '_jfoc4TueTsv239P0';

const services = [
  {
    id: 1,
    number: "01",
    title: "Real-time Updates",
    description: "Instant notifications for academic announcements, exam schedules, and campus events delivered directly to students and faculty.",
    icon: "🔔",
    iconBg: "from-blue-100 to-blue-200",
    iconColor: "text-blue-600",
    backContent: "Never miss important deadlines with our real-time notification system",
    backGradient: "from-[#C4B0F9] via-[#B294F5] to-[#A15AF9]"
  },
  {
    id: 2,
    number: "02",
    title: "Event Promotion",
    description: "Promote workshops, seminars, and cultural events to the entire campus community with our integrated event management system.",
    icon: "🎉",
    iconBg: "from-purple-100 to-purple-200",
    iconColor: "text-purple-600",
    backContent: "Increase event participation with targeted announcements",
    backGradient: "from-[#F6D27A] via-[#F2B94B] to-[#E48A00]"
  },
  {
    id: 3,
    number: "03",
    title: "Information Display",
    description: "Centralized dashboard for important dates, deadlines, and campus announcements accessible from any device.",
    icon: "📡",
    iconBg: "from-green-100 to-green-200",
    iconColor: "text-green-600",
    backContent: "Access all campus information from one central hub",
    backGradient: "from-[#B9A7E8] via-[#A78BDA] to-[#8B5CF6]"
  },
];

export default function Home() {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [startIndex, setStartIndex] = useState(0);
  const [selectedNotice, setSelectedNotice] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalNotices: 0,
    satisfactionRate: 98,
    activeUsers: 0
  });

  // Contact form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  // Loading state for send button
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const response = await fetch(`${API_URL}/api/notices`);
        const data = await response.json();
        setNotices(data.slice(0, 3));
        setLoading(false);
      } catch (error) {
        console.error("Error fetching notices:", error);
        setLoading(false);
      }
    };

    const fetchStats = async () => {
      try {
        const noticesRes = await fetch(`${API_URL}/api/notices`);
        const noticesData = await noticesRes.json();
        
        const usersRes = await fetch(`${API_URL}/api/users`);
        const usersData = await usersRes.json();
        
        setStats({
          totalNotices: noticesData.length,
          totalUsers: usersData.length,
          activeUsers: usersData.filter(u => u.role === "student").length || usersData.length,
          satisfactionRate: Math.min(98, 85 + Math.floor(Math.random() * 10))
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };

    fetchNotices();
    fetchStats();

    const interval = setInterval(() => {
      setStartIndex((prev) => (prev + 1) % 3);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Contact form handlers
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    setIsSending(true);

    const templateParams = {
      name: formData.name,
      email: formData.email,
      subject: formData.subject,
      message: formData.message,
      to_email: 'rihandessalew444@gmail.com'
    };

    console.log('📧 Sending email with:', {
      service: EMAILJS_SERVICE_ID,
      template: EMAILJS_TEMPLATE_ID,
      params: templateParams
    });

    emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams, EMAILJS_PUBLIC_KEY)
      .then((response) => {
        console.log('SUCCESS!', response.status, response.text);
        alert('✅ Message sent successfully! We\'ll get back to you soon.');
        setFormData({ name: '', email: '', subject: '', message: '' });
      })
      .catch((error) => {
        console.error('FAILED...', error);
        alert('❌ Failed to send message. Please try again later.');
      })
      .finally(() => {
        setIsSending(false);
      });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'long', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const isImage = (fileType) => fileType?.startsWith('image/');

  const scrollToNotices = () => {
    document.getElementById("notices")?.scrollIntoView({
      behavior: "smooth"
    });
  };

  const allFeatures = [
    {
      title: "User-Friendly Interface",
      description: "Intuitive design makes it easy for students, faculty, and administrators to access and manage notices without technical training.",
      triangleGradient: "linear-gradient(135deg, #94E5D4 0%, #7DD3C4 50%, #5FB8A8 100%)",
      numberColor: "text-white",
      textColor: "text-[#1a1a2e]"
    },
    {
      title: "Customizable Platforms",
      description: "Tailor the platform to your university's specific needs with customizable categories, themes, and notification preferences.",
      triangleGradient: "linear-gradient(135deg, #F6D27A 0%, #F2B94B 50%, #E48A00 100%)",
      numberColor: "text-white",
      textColor: "text-[#1a1a2e]"
    },
    {
      title: "Reliable Communication",
      description: "Ensure important messages reach everyone with our reliable notification system that works across web and mobile devices.",
      triangleGradient: "linear-gradient(135deg, #B9A7E8 0%, #A78BDA 50%, #8B5CF6 100%)",
      numberColor: "text-white",
      textColor: "text-[#1a1a2e]"
    },
    {
      title: "Advanced Security",
      description: "Protect sensitive academic information with our robust security features, including user authentication, role-based access control, and encrypted data transmission.",
      triangleGradient: "linear-gradient(135deg, #800020 0%, #A52A2A 50%, #6B1A1A 100%)",
      numberColor: "text-[#F5D6A8]",
      textColor: "text-[#1a1a2e]"
    },
    {
      title: "Smart Analytics",
      description: "Gain valuable insights with our analytics dashboard, tracking notice views, user engagement, and communication effectiveness across your campus.",
      triangleGradient: "linear-gradient(135deg, #FFB74D 0%, #FFA726 50%, #FF9800 100%)",
      numberColor: "text-white",
      textColor: "text-[#1a1a2e]"
    }
  ];

  const cardShadow = {
    boxShadow: "rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px, rgba(10, 37, 64, 0.35) 0px -2px 6px 0px inset"
  };

  const getVisibleFeatures = () => {
    const total = allFeatures.length;
    const visible = [];
    for (let i = 0; i < 3; i++) {
      const index = (startIndex + i) % total;
      visible.push({ ...allFeatures[index], realIndex: index });
    }
    return visible;
  };

  const visibleFeatures = getVisibleFeatures();

  return (
    <div className="m-0 p-0 w-full font-['Poppins',sans-serif] bg-white">
      
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800;900&family=Playfair+Display:ital,wght@0,400;0,700;1,400;1,700&family=Dancing+Script:wght@400;700&display=swap');
          
          @keyframes bounce {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(10px); }
          }
          
          @keyframes spin-slow {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          .animate-spin-slow {
            animation: spin-slow 4s linear infinite;
          }

          .flip-card-container {
            perspective: 1000px;
          }

          .flip-card-inner {
            transition: all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
            transform-style: preserve-3d;
          }

          .flip-card-container:hover .flip-card-inner {
            transform: rotateY(180deg) translateZ(10px);
          }

          .flip-card-container:hover {
            z-index: 10;
          }

          .backface-hidden {
            backface-visibility: hidden;
            -webkit-backface-visibility: hidden;
          }

          .rotate-y-180 {
            transform: rotateY(180deg);
          }

          .ball-loader {
            width: 1.6rem;
            height: 1.6rem;
            border-radius: 50%;
            box-shadow: 
              rgba(0, 0, 0, 0.17) 0px -10px 10px 0px inset,
              rgba(0, 0, 0, 0.15) 0px -15px 15px 0px inset,
              rgba(0, 0, 0, 0.1) 0px -40px 20px 0px inset,
              rgba(0, 0, 0, 0.06) 0px 2px 1px,
              rgba(0, 0, 0, 0.09) 0px 4px 2px,
              rgba(0, 0, 0, 0.09) 0px 8px 4px,
              rgba(0, 0, 0, 0.09) 0px 16px 8px,
              rgba(0, 0, 0, 0.09) 0px 32px 16px,
              0px -1px 15px -8px rgba(0, 0, 0, 0.09);
            animation: moveBall 3.63s ease-in-out infinite;
            background: radial-gradient(circle at 30% 30%, #ffffff, #d4d4d4);
          }

          .ball-loader:nth-child(1) { animation-delay: 0s; }
          .ball-loader:nth-child(2) { animation-delay: 0.2s; }
          .ball-loader:nth-child(3) { animation-delay: 0.4s; }
          .ball-loader:nth-child(4) { animation-delay: 0.6s; }
          .ball-loader:nth-child(5) { animation-delay: 0.8s; }
          .ball-loader:nth-child(6) { animation-delay: 1s; }
          .ball-loader:nth-child(7) { animation-delay: 1.2s; }
          .ball-loader:nth-child(8) { animation-delay: 1.4s; }
          .ball-loader:nth-child(9) { animation-delay: 1.6s; }

          @keyframes moveBall {
            0% { transform: translateY(0em) scale(1); }
            50% { transform: translateY(10em) scale(0.9); }
            100% { transform: translateY(0em) scale(1); }
          }

          .loader-rotate {
            position: absolute;
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .loader-rotate:nth-child(2) { transform: rotate(20deg); }
          .loader-rotate:nth-child(3) { transform: rotate(40deg); }
          .loader-rotate:nth-child(4) { transform: rotate(60deg); }
          .loader-rotate:nth-child(5) { transform: rotate(80deg); }
          .loader-rotate:nth-child(6) { transform: rotate(100deg); }
          .loader-rotate:nth-child(7) { transform: rotate(120deg); }
          .loader-rotate:nth-child(8) { transform: rotate(140deg); }
          .loader-rotate:nth-child(9) { transform: rotate(160deg); }

          .card-shadow-effect {
            transition: all 0.4s ease;
          }
          .card-shadow-effect:hover {
            box-shadow: rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px, rgba(10, 37, 64, 0.35) 0px -2px 6px 0px inset !important;
          }

          @keyframes slideInFromLeft {
            0% {
              transform: perspective(800px) rotateY(40deg) rotateX(5deg) scale(0.7);
              opacity: 0;
            }
            60% {
              transform: perspective(800px) rotateY(-3deg) scale(1.03);
              opacity: 0.9;
            }
            100% {
              transform: perspective(800px) rotateY(0deg) scale(1);
              opacity: 1;
            }
          }

          .slide-in {
            animation: slideInFromLeft 0.7s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
          }

          .card-3d-tilt {
            transition: all 0.4s ease;
            transform-style: preserve-3d;
          }
          .card-3d-tilt:hover {
            transform: perspective(800px) rotateX(3deg) rotateY(8deg) scale(1.02);
            box-shadow: 25px 25px 70px #bebebe, -25px -25px 70px #ffffff;
          }

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

          /* Contact Animations */
          .contact-icon-hover {
            transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
          }
          
          .group:hover .contact-icon-hover {
            transform: scale(1.1) rotate(-5deg);
          }

          .contact-input-animate {
            transition: all 0.3s ease;
          }
          
          .contact-input-animate:focus {
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(81, 88, 187, 0.15);
          }

          .contact-btn-hover {
            transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
          }
          
          .contact-btn-hover:hover {
            transform: translateY(-3px) scale(1.02);
            box-shadow: 0 20px 40px -10px rgba(81, 88, 187, 0.4);
          }

          .contact-card-hover {
            transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);
          }
          
          .contact-card-hover:hover {
            transform: translateY(-8px);
            box-shadow: 0 20px 40px rgba(0,0,0,0.08);
          }

          .contact-form-hover {
            transition: all 0.5s cubic-bezier(0.23, 1, 0.32, 1);
          }
          
          .contact-form-hover:hover {
            transform: translateY(-4px);
            box-shadow: 0 25px 50px -12px rgba(0,0,0,0.15);
          }
        `}
      </style>

      {/* ── HERO SECTION ── */}
      <div 
        className="relative w-screen left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] bg-cover bg-center py-[60px] -mt-[42px]"
        style={{ backgroundImage: `url(${bgImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-black/85 via-[#5158bb]/70 to-black/80"></div>
        
        <div className="relative z-10 max-w-[1200px] mx-auto px-5 text-center pt-24">
          <h2 
            className="font-['Times_New_Roman','Georgia',serif] text-5xl font-black italic tracking-[6px] uppercase mb-4 bg-gradient-to-r from-yellow-300 via-yellow-400 to-amber-500 bg-clip-text text-transparent"
            style={{ textShadow: "2px 2px 0px #000, 0 0 10px rgba(0,0,0,0.5)" }}
          >
            DIGITAL NOTICE BOARD
          </h2>
          
          <p 
            className="font-['Times_New_Roman','Georgia',serif] text-lg italic tracking-[2px] text-white max-w-[600px] mx-auto mb-6"
            style={{ textShadow: "2px 2px 4px #000000" }}
          >
            Stay updated with the latest announcements, events, and academic notices.
          </p>
          
          <button 
            onClick={scrollToNotices}
            className="bg-white text-[#5158bb] px-6 py-3 rounded-full font-semibold border-none cursor-pointer hover:shadow-lg transition-all hover:scale-105 duration-300"
          >
            View Notices
          </button>

          <div className="flex justify-center mt-5">
            <div
              onClick={scrollToNotices}
              className="text-4xl text-yellow-400 cursor-pointer animate-bounce inline-block"
              style={{ textShadow: "0 0 10px gold, 0 0 20px gold" }}
            >
              ↓
            </div>
          </div>
        </div>
      </div>

      {/* ── SERVICES SECTION - WHITE BACKGROUND ── */}
      <div className="relative w-screen left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] bg-white py-20">
        <div className="max-w-[1200px] mx-auto px-5">
          <div className="text-center mb-12">
            <span className="text-sm text-[#5158bb] uppercase tracking-[3px] font-semibold">
              What We Offer
            </span>
            <h2 className="text-4xl font-bold mt-4 font-['Times_New_Roman','Georgia',serif] bg-gradient-to-r from-yellow-300 via-yellow-400 to-amber-500 bg-clip-text text-transparent">
              Our Core Services
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map((service) => (
              <div
                key={service.id}
                className="group flip-card-container relative w-[280px] h-[280px] mx-auto cursor-pointer"
                style={{ perspective: "1000px" }}
              >
                <div className="flip-card-inner relative w-full h-full transition-all duration-800 ease-[cubic-bezier(0.34,1.56,0.64,1)] transform-style-preserve-3d group-hover:rotate-y-180">
                  
                  <div className={`absolute w-full h-full backface-hidden overflow-hidden bg-gradient-to-br ${service.backGradient} rounded-full`}>
                    <div className="relative w-full h-full flex flex-col items-center justify-center p-6">
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="w-[92%] h-[92%] rounded-full border-2 border-white/20"></div>
                      </div>
                      
                      <div className="relative w-28 h-28">
                        {[...Array(9)].map((_, i) => (
                          <div key={i} className="loader-rotate">
                            <div className="ball-loader"></div>
                          </div>
                        ))}
                        
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-3xl bg-white/20 backdrop-blur-sm rounded-full p-2 border border-white/20">
                            {service.icon}
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-3 text-center">
                        <p className="text-white text-xs font-medium opacity-90">
                          {service.backContent}
                        </p>
                        <button 
                          className="mt-2 text-white font-bold text-xs px-4 py-1.5 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                          style={{
                            background: "linear-gradient(135deg, #FFD1C4 0%, #FFC0AE 45%, #FFAF98 75%, #FF9C82 100%)",
                          }}
                        >
                          Learn More →
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="absolute w-full h-full backface-hidden overflow-hidden rotate-y-180 rounded-full">
                    <div className="relative w-full h-full bg-white rounded-full shadow-2xl p-6 flex flex-col justify-between items-center card-shadow-effect"
                      style={cardShadow}
                    >
                      <div className="absolute inset-0 overflow-hidden rounded-full">
                        <div className="absolute w-32 h-32 rounded-full bg-yellow-400/10 blur-2xl -top-10 -right-10"></div>
                        <div className="absolute w-40 h-40 rounded-full bg-orange-400/10 blur-2xl -bottom-10 -left-10"></div>
                      </div>
                      
                      <div className="relative z-10 flex-1 flex flex-col justify-center items-center text-center">
                        <div className="mb-3">
                          <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${service.iconBg} flex items-center justify-center mx-auto shadow-lg transform transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 group-hover:shadow-xl`}>
                            <span className={`text-3xl ${service.iconColor}`}>
                              {service.icon}
                            </span>
                          </div>
                        </div>
                        <div className="text-2xl font-bold bg-gradient-to-r from-yellow-300 via-yellow-400 to-amber-500 bg-clip-text text-transparent mb-1">
                          {service.number}
                        </div>
                        <h3 className="text-lg font-bold text-[#1a1a2e] mb-1">
                          {service.title}
                        </h3>
                        <p className="text-gray-600 text-xs leading-relaxed">
                          {service.description}
                        </p>
                      </div>
                      
                      <div className="relative z-10 mt-1 text-right">
                        <span className="text-xs text-gray-400">Hover to flip →</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── WHY CHOOSE US SECTION - WHITE BACKGROUND ── */}
      <div className="relative w-screen left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] bg-white py-20">
        <div className="max-w-[1200px] mx-auto px-5">
          <div className="text-center mb-12">
            <span className="text-sm text-[#A15AF9] uppercase tracking-[3px] font-semibold">
              WHY CHOOSE OUR DIGITAL
            </span>
            <h2 className="text-4xl font-bold mt-4 font-['Times_New_Roman','Georgia',serif] bg-gradient-to-r from-yellow-300 via-yellow-400 to-amber-500 bg-clip-text text-transparent">
              Why Choose Our Digital Solutions
            </h2>
            <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
              Discover the benefits of our digital notice board platform
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {visibleFeatures.map((feature, index) => (
              <div key={`${startIndex}-${index}`} className="flex justify-center">
                <div 
                  className="group card-3d-tilt flex flex-col items-center justify-center text-center p-6 slide-in"
                  style={{
                    width: "280px",
                    height: "280px",
                    borderRadius: "50%",
                    background: "#e0e0e0",
                    boxShadow: "20px 20px 60px #bebebe, -20px -20px 60px #ffffff",
                    transformStyle: "preserve-3d",
                    animationDelay: `${index * 0.15}s`
                  }}
                >
                  <div className="relative w-20 h-20 mb-3">
                    <div
                      className="absolute inset-0"
                      style={{
                        background: feature.triangleGradient,
                        clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)",
                        boxShadow: "0 4px 15px rgba(0,0,0,0.15)",
                        transform: "perspective(300px) rotateX(3deg)",
                        transformStyle: "preserve-3d"
                      }}
                    ></div>
                    <div className="absolute inset-0 flex items-center justify-center pb-2">
                      <span className={`text-lg font-bold ${feature.numberColor} relative z-10`}
                        style={{ textShadow: "0 1px 4px rgba(0,0,0,0.15)" }}>
                        {String(feature.realIndex + 1).padStart(2, '0')}
                      </span>
                    </div>
                  </div>
                  
                  <h3 className={`text-base font-bold ${feature.textColor} mb-2`}>{feature.title}</h3>
                  <p className={`${feature.textColor} text-xs leading-relaxed opacity-80 max-w-[200px]`}>
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-center mt-8 gap-3">
            {[0, 1, 2].map((dot) => (
              <button
                key={dot}
                onClick={() => setStartIndex(dot)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  startIndex === dot ? 'w-10 bg-[#A15AF9]' : 'bg-gray-400 hover:bg-gray-500'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* ── LATEST UPDATES - WHITE BACKGROUND ── */}
      <div id="notices" className="relative w-screen left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] bg-white py-20">
        <div className="max-w-[1200px] mx-auto px-5">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-bold font-['Times_New_Roman','Georgia',serif] bg-gradient-to-r from-yellow-300 via-yellow-400 to-amber-500 bg-clip-text text-transparent">
              Latest Updates
            </h2>
          </div>

          {loading ? (
            <div className="text-center py-10 text-gray-400">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#5158bb]"></div>
              <p className="mt-2">Loading notices...</p>
            </div>
          ) : notices.length === 0 ? (
            <div className="text-center py-10 text-gray-400">
              <p className="text-2xl">📭</p>
              <p>No notices found. Create your first notice!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {notices.map((notice) => (
                <div
                  key={notice._id}
                  className="group relative bg-white border border-gray-200 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
                >
                  <div className="flex justify-between items-center mb-4">
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
                      notice.category === "Academic" ? "bg-blue-100 text-blue-700" :
                      notice.category === "Event" ? "bg-purple-100 text-purple-700" :
                      notice.category === "Exam" ? "bg-orange-100 text-orange-700" :
                      notice.category === "Announcement" ? "bg-green-100 text-green-700" :
                      "bg-gray-100 text-gray-700"
                    }`}>
                      {notice.category || "General"}
                    </span>
                    <span className="text-xs text-gray-400">
                      {formatDate(notice.createdAt)}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-[#1a1a2e] group-hover:text-[#5158bb] transition-colors">
                    {notice.title}
                  </h3>

                  <p className="text-gray-600 mt-3 leading-relaxed text-sm">
                    {notice.content?.substring(0, 80)}...
                  </p>

                  {notice.fileUrl && (
                    <div className="mt-3 p-2 bg-gray-50 rounded-lg border border-gray-200">
                      {isImage(notice.fileType) ? (
                        <img 
                          src={`http://localhost:8080${notice.fileUrl}`} 
                          alt={notice.fileName}
                          className="w-full max-h-48 object-cover rounded-lg"
                        />
                      ) : (
                        <a 
                          href={`http://localhost:8080${notice.fileUrl}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:underline flex items-center gap-2 text-sm"
                        >
                          📄 {notice.fileName}
                        </a>
                      )}
                    </div>
                  )}

                  <div className="mt-4 flex justify-between items-center">
                    <span className="text-xs text-gray-400">
                      👤 {notice.author?.name || "Admin"}
                    </span>
                    <button 
                      onClick={() => {
                        setSelectedNotice(notice);
                        setShowModal(true);
                      }}
                      className="text-sm font-semibold text-[#5158bb] hover:text-[#667eea] transition-colors"
                    >
                      Read More →
                    </button>
                  </div>

                  <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-300 bg-gradient-to-br from-[#5158bb]/5 to-[#667eea]/5 pointer-events-none"></div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── NOTICE VIEW MODAL ── */}
      {showModal && selectedNotice && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn p-4">
          <div className="bg-white rounded-2xl p-6 w-[500px] max-w-[90%] max-h-[80vh] overflow-y-auto shadow-2xl border border-yellow-200">
            
            <div className="flex justify-between items-center mb-4">
              <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
                selectedNotice.category === "Academic" ? "bg-blue-100 text-blue-700" :
                selectedNotice.category === "Event" ? "bg-purple-100 text-purple-700" :
                selectedNotice.category === "Exam" ? "bg-orange-100 text-orange-700" :
                selectedNotice.category === "Announcement" ? "bg-green-100 text-green-700" :
                "bg-gray-100 text-gray-700"
              }`}>
                {selectedNotice.category || "General"}
              </span>
              <span className="text-xs text-gray-400">
                {formatDate(selectedNotice.createdAt)}
              </span>
            </div>

            <h2 className="text-2xl font-bold text-[#1a1a2e] mb-4">
              {selectedNotice.title}
            </h2>

            <div className="bg-gray-50 rounded-xl p-4 mb-4 border border-gray-200">
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {selectedNotice.content}
              </p>
            </div>

            {selectedNotice.fileUrl && (
              <div className="mb-4 p-3 bg-gray-50 rounded-xl border border-gray-200">
                <p className="text-sm text-gray-500 mb-2">📎 Attachment:</p>
                {isImage(selectedNotice.fileType) ? (
                  <img 
                    src={`http://localhost:8080${selectedNotice.fileUrl}`} 
                    alt={selectedNotice.fileName}
                    className="w-full max-h-64 object-contain rounded-lg"
                  />
                ) : (
                  <a 
                    href={`http://localhost:8080${selectedNotice.fileUrl}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline flex items-center gap-2"
                  >
                    📄 {selectedNotice.fileName}
                  </a>
                )}
              </div>
            )}

            <div className="text-sm text-gray-500 mb-4 flex items-center gap-2">
              👤 Posted by: <span className="text-gray-700">{selectedNotice.author?.name || "Admin"}</span>
            </div>

            <button 
              onClick={() => {
                setShowModal(false);
                setSelectedNotice(null);
              }}
              className="w-full px-4 py-2.5 rounded-full font-semibold text-white bg-gradient-to-r from-[#5158bb] to-[#667eea] hover:from-[#667eea] hover:to-[#5158bb] transition-all duration-300 hover:scale-105"
            >
              ✨ Close
            </button>
          </div>
        </div>
      )}

      {/* ── TESTIMONIAL SECTION - WHITE BACKGROUND ── */}
      <div className="relative w-screen left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] bg-white py-20 overflow-hidden">
        <div className="max-w-[1000px] mx-auto px-5 relative z-10">
          <div className="text-center mb-12">
            <span className="text-sm text-[#A15AF9] uppercase tracking-[3px] font-semibold bg-white/50 px-4 py-1 rounded-full backdrop-blur-sm">
              Testimonials
            </span>
            <h2 className="text-4xl font-bold mt-4 font-['Times_New_Roman','Georgia',serif] bg-gradient-to-r from-yellow-300 via-yellow-400 to-amber-500 bg-clip-text text-transparent">
              What People Say
            </h2>
            <p className="text-gray-500 mt-2 text-sm">Real feedback from our campus community</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="group relative bg-white/80 backdrop-blur-md rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 border border-white/50">
              <div className="absolute -top-3 -left-3 text-4xl text-purple-400 opacity-30 group-hover:opacity-100 transition-opacity duration-300">"</div>
              <div className="flex items-center gap-1 mb-3">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                  </svg>
                ))}
              </div>
              <p className="text-gray-700 text-sm leading-relaxed italic">
                "The Digital Notice Board has transformed how we communicate with our students. Important announcements reach everyone instantly."
              </p>
              <div className="mt-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-indigo-500 flex items-center justify-center text-white font-bold text-sm">
                  SJ
                </div>
                <div>
                  <h4 className="font-bold text-[#1a1a2e] text-sm">Dr. Sarah Johnson</h4>
                  <p className="text-gray-500 text-xs">Vice Chancellor, Tech University</p>
                </div>
              </div>
            </div>

            <div className="group relative bg-white/80 backdrop-blur-md rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 border border-white/50">
              <div className="absolute -top-3 -left-3 text-4xl text-purple-400 opacity-30 group-hover:opacity-100 transition-opacity duration-300">"</div>
              <div className="flex items-center gap-1 mb-3">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                  </svg>
                ))}
              </div>
              <p className="text-gray-700 text-sm leading-relaxed italic">
                "As a faculty member, I love how easy it is to post updates. Students actually read them because everything is in one place."
              </p>
              <div className="mt-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-cyan-500 flex items-center justify-center text-white font-bold text-sm">
                  MR
                </div>
                <div>
                  <h4 className="font-bold text-[#1a1a2e] text-sm">Prof. Michael R.</h4>
                  <p className="text-gray-500 text-xs">Faculty, Computer Science</p>
                </div>
              </div>
            </div>

            <div className="group relative bg-white/80 backdrop-blur-md rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 border border-white/50">
              <div className="absolute -top-3 -left-3 text-4xl text-purple-400 opacity-30 group-hover:opacity-100 transition-opacity duration-300">"</div>
              <div className="flex items-center gap-1 mb-3">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                  </svg>
                ))}
              </div>
              <p className="text-gray-700 text-sm leading-relaxed italic">
                "The public display screen mode is a game-changer. We use it in the main hall and everyone stays updated in real-time."
              </p>
              <div className="mt-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center text-white font-bold text-sm">
                  AD
                </div>
                <div>
                  <h4 className="font-bold text-[#1a1a2e] text-sm">Amanuel D.</h4>
                  <p className="text-gray-500 text-xs">Student, Information Systems</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-white/30 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <div className="text-2xl font-bold text-[#5158bb]">
                <CountUp end={stats.totalUsers} suffix="+" duration={2500} />
              </div>
              <div className="text-xs text-gray-500">Total Users</div>
            </div>
            <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-white/30 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <div className="text-2xl font-bold text-[#5158bb]">
                <CountUp end={stats.totalNotices} suffix="+" duration={2500} />
              </div>
              <div className="text-xs text-gray-500">Notices Posted</div>
            </div>
            <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-white/30 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <div className="text-2xl font-bold text-[#5158bb]">
                <CountUp end={stats.satisfactionRate} suffix="%" duration={2500} />
              </div>
              <div className="text-xs text-gray-500">Satisfaction Rate</div>
            </div>
            <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-white/30 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <div className="text-2xl font-bold text-[#5158bb]">24/7</div>
              <div className="text-xs text-gray-500">Always Available</div>
            </div>
          </div>
        </div>
      </div>

      {/* ── CTA SECTION WITH GOLD TITLE ── */}
<div className="relative w-screen left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] bg-white py-20">
  <div className="max-w-[800px] mx-auto px-5 text-center">
    <h3 className="text-3xl md:text-4xl font-bold mb-4 font-['Times_New_Roman','Georgia',serif] bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 bg-clip-text text-transparent">
      Start Engaging Now
    </h3>
    <p className="text-gray-600 text-lg mb-8 max-w-xl mx-auto">
      Thousands of students and faculty already using our platform for campus communication
    </p>
    <div className="flex flex-col sm:flex-row gap-4 justify-center">
      <Link to="/register">
        <button className="px-8 py-3 rounded-full font-semibold text-white bg-gradient-to-r from-[#5158bb] to-[#667eea] hover:from-[#667eea] hover:to-[#5158bb] shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
           Get Started
        </button>
      </Link>
      <a 
        href="https://bdu.edu.et" 
        target="_blank" 
        rel="noopener noreferrer"
      >
        <button className="px-8 py-3 rounded-full font-semibold text-[#5158bb] bg-white border-2 border-[#5158bb] hover:bg-[#5158bb] hover:text-white transition-all duration-300 hover:scale-105">
          Learn More
        </button>
      </a>
    </div>
  </div>
</div>

      {/* ── CONTACT SECTION - WHITE BACKGROUND ── */}
      <div id="contact" className="relative w-screen left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] bg-white py-20">
        <section className="max-w-7xl mx-auto px-6 sm:px-8 md:px-12 lg:px-16 xl:px-20">
          
          {/* Section Header */}
          <div className="text-center mb-12">
            <span className="text-sm text-[#5158bb] uppercase tracking-[3px] font-semibold">
              Contact Us
            </span>
            <h2 className="text-4xl font-bold mt-2 font-['Times_New_Roman','Georgia',serif] bg-gradient-to-r from-yellow-300 via-yellow-400 to-amber-500 bg-clip-text text-transparent">
              Get In Touch
            </h2>
            <p className="text-gray-500 mt-2 text-sm">We'd love to hear from you!</p>
          </div>

          {/* Google Map */}
          <div className="w-full mb-16 rounded-2xl overflow-hidden shadow-lg">
            <iframe
              title="Our Location"
              src="https://www.google.com/maps/embed?pb=!1m21!1m12!1m3!1d2516144.596534938!2d38.84725579646288!3d11.138653578554917!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m6!3e6!4m3!3m2!1d11.0955765!2d39.6041557!4m0!5e0!3m2!1sen!2set!4v1784471358944!5m2!1sen!2set"
              className="w-full h-[350px] sm:h-[400px]"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="strict-origin-when-cross-origin"
            />
          </div>

          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
            {/* Contact Information */}
            <div>
              <div className="space-y-8">
                <div className="group flex gap-5">
                  <div className="contact-icon-hover bg-indigo-100 p-4 rounded-full">
                    <FaLocationDot className="text-[#5158bb] text-xl" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-[#1a1a2e]">Address</h3>
                    <p className="text-gray-500">Dessie, Amhara Region, Ethiopia</p>
                  </div>
                </div>

                <div className="group flex gap-5">
                  <div className="contact-icon-hover bg-indigo-100 p-4 rounded-full">
                    <FaPhone className="text-[#5158bb] text-xl" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-[#1a1a2e]">Phone</h3>
                    <p className="text-gray-500">+251 935 459 227</p>
                  </div>
                </div>

                <div className="group flex gap-5">
                  <div className="contact-icon-hover bg-indigo-100 p-4 rounded-full">
                    <FaEnvelope className="text-[#5158bb] text-xl" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-[#1a1a2e]">Email</h3>
                    <p className="text-gray-500">rihandessalew444@gmail.com</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="contact-form-hover bg-white rounded-2xl shadow-lg p-6 sm:p-8 border border-gray-100">
              <h3 className="text-2xl font-bold mb-6 text-[#1a1a2e]">Send us a Message</h3>

              <form onSubmit={handleSubmit} className="space-y-5">
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your Name"
                  className="contact-input-animate w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#5158bb] focus:border-transparent transition duration-300"
                  required
                />

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email Address"
                  className="contact-input-animate w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#5158bb] focus:border-transparent transition duration-300"
                  required
                />

                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="Subject"
                  className="contact-input-animate w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#5158bb] focus:border-transparent transition duration-300"
                  required
                />

                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={6}
                  placeholder="Write your message..."
                  className="contact-input-animate w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#5158bb] focus:border-transparent transition duration-300 resize-none"
                  required
                />

                <button
                  type="submit"
                  disabled={isSending}
                  className={`contact-btn-hover w-full bg-gradient-to-r from-[#5158bb] to-[#667eea] hover:from-[#667eea] hover:to-[#5158bb] text-white font-semibold py-3 rounded-lg transition duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl ${
                    isSending ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
                >
                  {isSending ? (
                    <>
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Sending...
                    </>
                  ) : (
                    <>
                      <FaPaperPlane /> Send Message
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </section>
      </div>

      {/* ── FOOTER SECTION ── */}
      <div className="relative w-screen left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] bg-[#0a0a15] py-16 pb-8">
        <div className="max-w-[1200px] mx-auto px-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-12 mb-12">
            <div>
              <h4 className="text-white text-lg mb-5 font-bold">For Students</h4>
              <ul className="space-y-3">
                <li><Link to="/notices" className="text-gray-400 text-sm hover:text-white transition-colors">View Notices</Link></li>
                <li><Link to="/exams" className="text-gray-400 text-sm hover:text-white transition-colors">Exam Schedule</Link></li>
                <li><Link to="/results" className="text-gray-400 text-sm hover:text-white transition-colors">Results</Link></li>
                <li><Link to="/calendar" className="text-gray-400 text-sm hover:text-white transition-colors">Academic Calendar</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white text-lg mb-5 font-bold">For Faculty</h4>
              <ul className="space-y-3">
                <li><Link to="/admin" className="text-gray-400 text-sm hover:text-white transition-colors">Post Notices</Link></li>
                <li><Link to="/events" className="text-gray-400 text-sm hover:text-white transition-colors">Manage Events</Link></li>
                <li><Link to="/results/upload" className="text-gray-400 text-sm hover:text-white transition-colors">Upload Results</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white text-lg mb-5 font-bold">Quick Links</h4>
              <ul className="space-y-3">
                <li><Link to="/" className="text-gray-400 text-sm hover:text-white transition-colors">Home</Link></li>
                <li><Link to="/about" className="text-gray-400 text-sm hover:text-white transition-colors">About Us</Link></li>
                <li><Link to="/contact" className="text-gray-400 text-sm hover:text-white transition-colors">Contact</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white text-lg mb-5 font-bold">Follow Us</h4>
              <ul className="space-y-3">
                <li><a href="#" className="text-gray-400 text-sm hover:text-white transition-colors">Facebook</a></li>
                <li><a href="#" className="text-gray-400 text-sm hover:text-white transition-colors">Twitter</a></li>
                <li><a href="#" className="text-gray-400 text-sm hover:text-white transition-colors">Instagram</a></li>
                <li><a href="#" className="text-gray-400 text-sm hover:text-white transition-colors">LinkedIn</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mb-8"></div>

          <div className="flex flex-wrap justify-between items-center text-xs gap-4">
            <p className="text-gray-400 m-0">© 2026 Digital Notice Board System. All rights reserved.</p>
            <div className="flex gap-5 flex-wrap">
              <Link to="/privacy" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</Link>
              <Link to="/terms" className="text-gray-400 hover:text-white transition-colors">Terms of Use</Link>
              <Link to="/faq" className="text-gray-400 hover:text-white transition-colors">FAQ</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}