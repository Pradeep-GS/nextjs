'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowRight, Cpu, Cctv, CircuitBoard } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function HomePage() {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);

  const handleStart = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    router.push('/login');
  }

  return (
    <div className='w-full min-h-screen bg-gray-950 overflow-hidden'>
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.03)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,black,transparent)]"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/5 via-transparent to-blue-900/5"></div>
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent animate-pulse"></div>
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/20 to-transparent animate-pulse"></div>
        <div className="absolute top-1/4 left-10 text-cyan-500/10">
          <Cpu className="w-16 h-16" />
        </div>
        <div className="absolute bottom-1/3 right-10 text-cyan-500/10">
          <CircuitBoard className="w-20 h-20" />
        </div>
        <div className="absolute top-10 right-1/3 text-cyan-500/10">
          <Cctv className="w-12 h-12" />
        </div>
        <div className="absolute top-1/3 left-1/4 w-32 h-32 rounded-full bg-cyan-500/5 blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/3 w-40 h-40 rounded-full bg-blue-500/5 blur-3xl"></div>
      </div>

      {/* Header Section */}
      <header className="relative z-10 py-6 px-6">
        <nav className='flex items-center justify-between'>
          {/* Left - VSB Logo */}
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center p-1 mx-auto relative group">
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 blur-lg opacity-50 group-hover:opacity-70 transition-opacity"></div>
              <div className="absolute inset-0 rounded-full border-2 border-cyan-400/30 animate-pulse"></div>
              <div className="w-full h-full rounded-full bg-gray-900 flex items-center justify-center overflow-hidden relative z-10 border border-gray-800">
                <img src="/vsb.jpg" alt="VSB" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>

          {/* Center - College Name and Autonomous */}
          <div className="text-center flex-1 mx-4">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
                VSB ENGINEERING COLLEGE
              </span>
            </h1>
            <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-gradient-to-r from-cyan-900/30 to-blue-900/30 border border-cyan-700/40 backdrop-blur-sm">
              <span className="text-sm font-bold text-cyan-300 tracking-widest">
                AN AUTONOMOUS INSTITUTION
              </span>
            </div>
          </div>

          {/* Right - Image */}
          <div className="relative rounded-xl overflow-hidden w-32 h-32 md:w-40 md:h-40">
            <img src="/Kanal-Photoroom.png" alt="AI Pattern" className="w-full h-full object-cover" />
          </div>
        </nav>
      </header>

      <main className="relative z-10 flex flex-col items-center justify-center flex-1 py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-xl bg-gradient-to-r from-gray-900/80 to-gray-800/80 border border-gray-700/50 backdrop-blur-lg shadow-2xl shadow-cyan-900/20">
            <div className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse"></div>
            <span className="text-xl md:text-2xl font-bold bg-gradient-to-r from-cyan-300 via-white to-blue-300 bg-clip-text text-transparent tracking-wide">
              DEPARTMENT OF ARTIFICIAL INTELLIGENCE & DATA SCIENCE
            </span>
            <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="w-full max-w-3xl mb-8 px-4"
        >
          <div className="relative group flex items-center justify-center">
            <div className="relative  overflow-hidden   h-70 md:h-80 w-full">
              <img
                src="/CFA-Photoroom.png"
                alt="Department of AI & DS"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="relative group"
        >
          <button
            onClick={handleStart}
            disabled={isLoading}
            className={`relative px-16 py-5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-bold text-xl transition-all overflow-hidden shadow-2xl shadow-cyan-500/20 ${isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:from-cyan-500 hover:to-blue-500 hover:scale-105 active:scale-95'}`}
          >
            <div className="relative z-20 flex items-center justify-center gap-4">
              <span className="drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)] tracking-wider">
                {isLoading ? 'LOADING...' : 'START EXPERIENCE'}
              </span>
              {!isLoading && <ArrowRight className="w-6 h-6 group-hover:translate-x-3 transition-transform drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]" />}
            </div>

            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 opacity-0 group-hover:opacity-30 blur-xl transition-opacity -z-10"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-xl -z-20"></div>
            <div className="absolute inset-0 rounded-xl p-[2px] -z-30">
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse"></div>
              <div className="absolute inset-[2px] rounded-xl bg-gray-950"></div>
            </div>
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-white to-transparent animate-scan -z-10"></div>
          </button>
          <div className="absolute -inset-6 rounded-3xl bg-gradient-to-r from-cyan-600/30 via-blue-600/30 to-cyan-600/30 blur-xl opacity-0 group-hover:opacity-70 transition-opacity duration-700 -z-40 animate-pulse"></div>
        </motion.div>

        <style jsx global>{`
          @keyframes scan {
            0% {
              transform: translateX(-100%);
              opacity: 0;
            }
            50% {
              opacity: 1;
            }
            100% {
              transform: translateX(100%);
              opacity: 0;
            }
          }
          .animate-scan {
            animation: scan 2s ease-in-out infinite;
          }
        `}</style>
      </main>
    </div>
  )
}