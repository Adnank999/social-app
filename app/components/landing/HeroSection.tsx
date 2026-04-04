'use client'
import { motion } from "motion/react";
import { ArrowRight, Heart, MessageCircle, Share2, Sparkles, Users, Play } from "lucide-react";
import Image from "next/image";

export default function HeroSection() {
  return (
    <div className="relative min-h-screen bg-[#030014] overflow-hidden flex items-center justify-center font-sans">
      {/* Background Effects */}
      <div className="absolute inset-0 w-full h-full">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-purple-600/20 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-600/20 blur-[120px]" />
        <div className="absolute top-[40%] left-[60%] w-[30%] h-[30%] rounded-full bg-pink-600/20 blur-[120px]" />
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 flex flex-col lg:flex-row items-center gap-16">
        
        {/* Left Content */}
        <div className="flex-1 flex flex-col items-center lg:items-start text-center lg:text-left">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-8"
          >
            <Sparkles className="w-4 h-4 text-purple-400 " />
            <span className="text-sm font-medium text-purple-200">The next generation of social</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-start text-white mb-6 leading-tight"
          >
            Connect with your <br className="hidden lg:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
              Friends instantly.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg sm:text-xl text-gray-400 mb-10 max-w-2xl mx-auto lg:mx-0"
          >
            Experience a new way to share moments, discover communities, and build meaningful relationships in a space designed for authentic connection.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4"
          >
            <button
              className="group cursor-pointer"
              style={{
                padding: "1rem 2rem",
                borderRadius: "9999px",
                backgroundColor: "#ffffff",
                color: "#000000",
                fontWeight: 600,
                fontSize: "1.125rem",
                lineHeight: 1.5,
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.5rem",
                border: "none",
                whiteSpace: "nowrap",
                transition: "background-color 0.2s",
              }}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = "#f3f4f6")}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = "#ffffff")}
            >
              Get Started Free
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              className="cursor-pointer"
              style={{
                padding: "1rem 2rem",
                borderRadius: "9999px",
                backgroundColor: "rgba(255,255,255,0.05)",
                color: "#ffffff",
                fontWeight: 600,
                fontSize: "1.125rem",
                lineHeight: 1.5,
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.5rem",
                border: "1px solid rgba(255,255,255,0.1)",
                whiteSpace: "nowrap",
                transition: "background-color 0.2s",
              }}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.1)")}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.05)")}
            >
              <Play className="w-5 h-5" />
              Watch Demo
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-12 flex items-center justify-center lg:justify-start gap-6"
          >
            <div className="flex -space-x-4">
              {[1, 2, 3, 4].map((i) => (
                <Image
                  key={i}
                  src={`https://i.pravatar.cc/100?img=${i + 10}`}
                  alt={`User ${i}`}
                  className="w-12 h-12 rounded-full border-2 border-[#030014] object-cover"
                  width={48}
                  height={48}
                />
              ))}
            </div>
            <div className="text-left">
              <div className="flex items-center gap-1 text-yellow-400">
                {[1, 2, 3, 4, 5].map((i) => (
                  <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-sm text-gray-400 mt-1">
                <span className="text-white font-semibold">100k+</span> active users
              </p>
            </div>
          </motion.div>
        </div>

        {/* Right Content - Floating UI Elements */}
        <div className="flex-1 relative w-full h-[600px] hidden lg:block">
          {/* Main Post Card */}
          <motion.div
            initial={{ opacity: 0, y: 50, rotate: -5 }}
            animate={{ opacity: 1, y: 0, rotate: -2 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-5 shadow-2xl z-20"
          >
            <div className="flex items-center gap-3 mb-4">
              <img src="https://i.pravatar.cc/150?img=32" alt="User" className="w-10 h-10 rounded-full object-cover" />
              <div>
                <h4 className="text-white font-semibold text-sm">Elena Rodriguez</h4>
                <p className="text-gray-400 text-xs">2 hours ago • Paris, France</p>
              </div>
            </div>
            <p className="text-gray-200 text-sm mb-4">
              Just witnessed the most beautiful sunset by the Eiffel Tower! ✨ The colors were absolutely unreal.
            </p>
            <div className="rounded-2xl overflow-hidden mb-4 h-[200px]">
              <img src="https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=600&q=80" alt="Post content" className="w-full h-full object-cover" />
            </div>
            <div className="flex items-center justify-between text-gray-400">
              <div className="flex items-center gap-4">
                <button className="flex items-center gap-1.5 hover:text-pink-500 transition-colors cursor-pointer">
                  <Heart className="w-5 h-5 fill-pink-500 text-pink-500" />
                  <span className="text-sm font-medium text-white">1.2k</span>
                </button>
                <button className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer">
                  <MessageCircle className="w-5 h-5" />
                  <span className="text-sm font-medium">342</span>
                </button>
              </div>
              <button className="hover:text-white transition-colors cursor-pointer">
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          </motion.div>

          {/* Floating Notification 1 */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ 
              opacity: 1, 
              x: 0,
              y: [0, -10, 0]
            }}
            transition={{ 
              opacity: { duration: 0.6, delay: 0.6 },
              x: { duration: 0.6, delay: 0.6 },
              y: { repeat: Infinity, duration: 4, ease: "easeInOut" }
            }}
            className="absolute top-[15%] right-[5%] w-[240px] bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-4 shadow-xl z-30"
          >
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 flex items-center justify-center shrink-0">
                <Users className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-white text-sm font-medium">New Follower</p>
                <p className="text-gray-400 text-xs mt-0.5">Alex joined your community</p>
              </div>
            </div>
          </motion.div>

          {/* Floating Notification 2 */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ 
              opacity: 1, 
              x: 0,
              y: [0, 10, 0]
            }}
            transition={{ 
              opacity: { duration: 0.6, delay: 0.8 },
              x: { duration: 0.6, delay: 0.8 },
              y: { repeat: Infinity, duration: 5, ease: "easeInOut", delay: 1 }
            }}
            className="absolute bottom-[20%] left-[5%] w-[220px] bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-4 shadow-xl z-30"
          >
            <div className="flex items-center gap-3">
              <img src="https://i.pravatar.cc/150?img=12" alt="User" className="w-10 h-10 rounded-full border-2 border-green-500 object-cover" />
              <div>
                <p className="text-white text-sm font-medium">Sarah is live</p>
                <p className="text-green-400 text-xs font-medium mt-0.5 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                  Watch now
                </p>
              </div>
            </div>
          </motion.div>

          {/* Floating Image 3 */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ 
              opacity: 1, 
              scale: 1,
              y: [0, -15, 0]
            }}
            transition={{ 
              opacity: { duration: 0.6, delay: 1 },
              scale: { duration: 0.6, delay: 1 },
              y: { repeat: Infinity, duration: 6, ease: "easeInOut", delay: 0.5 }
            }}
            className="absolute top-[10%] left-[15%] w-24 h-24 rounded-2xl overflow-hidden border-2 border-white/20 shadow-xl z-10 rotate-12"
          >
            <img src="https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80" alt="Gallery" className="w-full h-full object-cover" />
          </motion.div>
          
          {/* Floating Image 4 */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ 
              opacity: 1, 
              scale: 1,
              y: [0, 15, 0]
            }}
            transition={{ 
              opacity: { duration: 0.6, delay: 1.2 },
              scale: { duration: 0.6, delay: 1.2 },
              y: { repeat: Infinity, duration: 5.5, ease: "easeInOut", delay: 1.5 }
            }}
            className="absolute bottom-[15%] right-[15%] w-20 h-20 rounded-2xl overflow-hidden border-2 border-white/20 shadow-xl z-10 -rotate-6"
          >
            <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80" alt="Gallery" className="w-full h-full object-cover" />
          </motion.div>
        </div>
      </div>
    </div>
  );
}

