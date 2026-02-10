'use client'
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowRight, Cpu, Cctv, CircuitBoard } from 'lucide-react';
import { useState } from 'react';

const EventForm = () => {
  const router = useRouter();
  const [form, setForm] = useState({ name: '', email: '', year: '', department: '', college: '', phone: '', kanal_id: '' })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const res = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    })
    const data = await res.json()
    if (res.ok) {
      // Store user ID, name and kanal_id for later use in responses
      localStorage.setItem('user_id', data.user.id);
      localStorage.setItem('user_name', data.user.name);
      localStorage.setItem('kanal_id', data.user.kanal_id);
      router.push('/mcq')
    }
    else {
      alert(data.error || 'Registration failed')
    }
  }
  return (
    <div className="w-full min-h-screen bg-gray-950 overflow-y-auto">
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

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 py-6"
      >
        <div className="w-full max-w-4xl mx-auto px-4">
          <div className="bg-gray-900/40 backdrop-blur-lg border border-gray-700/50 rounded-3xl overflow-hidden shadow-2xl shadow-cyan-900/20">
            <div className="p-6 md:p-8 bg-gradient-to-b from-gray-900/80 to-gray-800/40 border-b border-gray-700/50">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 p-1 flex items-center justify-center relative group">
                    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 blur-lg opacity-50 group-hover:opacity-70 transition-opacity"></div>
                    <div className="absolute inset-0 rounded-full border-2 border-cyan-400/30 animate-pulse"></div>
                    <div className="w-full h-full rounded-full bg-gray-900 flex items-center justify-center overflow-hidden relative z-10 border border-gray-800">
                      <img src="/vsb.jpg" alt="VSB" className="w-full h-full object-cover" />
                    </div>
                  </div>
                  <div className="text-center">
                    <h1 className="text-2xl md:text-3xl font-bold">
                      <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
                        VSB ENGINEERING COLLEGE
                      </span>
                    </h1>
                    <div className="mt-1 text-center">
                      <span className="text-sm font-bold text-cyan-300 tracking-widest">
                        AN AUTONOMOUS INSTITUTION
                      </span>
                    </div>
                    <div className="mt-2">
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-800/70 border border-gray-700/50">
                        <div className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse"></div>
                        <span className="text-sm font-medium text-cyan-200">
                          Department of Artificial Intelligence & Data Science
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Pattern Image */}
                <div className="relative rounded-xl overflow-hidden w-28 h-28 md:w-36 md:h-36 border border-cyan-700/30">
                  <img src="/Kanal-Photoroom.png" alt="AI Pattern" className="w-full h-full object-cover" />
                </div>
              </div>
            </div>

            <div className="p-6 md:p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="group">
                    <label htmlFor="name" className="block text-lg font-medium text-cyan-300 mb-2 group-focus-within:text-cyan-200 transition-colors">
                      Name *
                    </label>
                    <input type="text" placeholder="Enter your name" name='name' id='name' autoComplete='off' required className="w-full px-4 py-3 rounded-xl bg-gray-900/70 border border-gray-700/50 text-white placeholder-gray-500 backdrop-blur-sm focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20  hover:border-gray-600 transition-all duration-300"
                      value={form.name}
                      onChange={handleChange}
                    />
                  </div>

                  {/* Email */}
                  <div className="group">
                    <label htmlFor="email" className="block text-lg font-medium text-cyan-300 mb-2 group-focus-within:text-cyan-200 transition-colors">
                      Email *
                    </label>
                    <input
                      type="email"
                      placeholder="Enter your email"
                      name='email'
                      id='email'
                      autoComplete='off'
                      required
                      className="w-full px-4 py-3 rounded-xl bg-gray-900/70 border border-gray-700/50 text-white placeholder-gray-500 backdrop-blur-sm
                                 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 
                                 hover:border-gray-600 transition-all duration-300"
                      value={form.email}
                      onChange={handleChange}
                    />
                  </div>

                  {/* Year */}
                  <div className="group">
                    <label htmlFor="year" className="block text-lg font-medium text-cyan-300 mb-2 group-focus-within:text-cyan-200 transition-colors">
                      Year *
                    </label>
                    <select
                      name='year'
                      id='year'
                      required
                      className="w-full px-4 py-3 rounded-xl bg-gray-900/70 border border-gray-700/50 text-white backdrop-blur-sm
                                 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 
                                 hover:border-gray-600 transition-all duration-300"
                      value={form.year}
                      onChange={handleChange}
                    >
                      <option value="">Select Year</option>
                      <option value="1">First Year</option>
                      <option value="2">Second Year</option>
                      <option value="3">Third Year</option>
                      <option value="4">Fourth Year</option>
                    </select>
                  </div>

                  {/* Department */}
                  <div className="group">
                    <label htmlFor="department" className="block text-lg font-medium text-cyan-300 mb-2 group-focus-within:text-cyan-200 transition-colors">
                      Department *
                    </label>
                    <input type="text" placeholder="Enter your department" name='department' id='department' autoComplete='off' required className="w-full px-4 py-3 rounded-xl bg-gray-900/70 border border-gray-700/50 text-white placeholder-gray-500 backdrop-blur-sm focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20  hover:border-gray-600 transition-all duration-300"
                      value={form.department}
                      onChange={handleChange}
                    />
                  </div>

                  {/* College */}
                  <div className="group">
                    <label htmlFor="college" className="block text-lg font-medium text-cyan-300 mb-2 group-focus-within:text-cyan-200 transition-colors">
                      College *
                    </label>
                    <input type="text" placeholder="Enter your college" name='college' id='college' autoComplete='off' required className="w-full px-4 py-3 rounded-xl bg-gray-900/70 border border-gray-700/50 text-white placeholder-gray-500 backdrop-blur-sm focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20  hover:border-gray-600 transition-all duration-300"
                      value={form.college}
                      onChange={handleChange}
                    />
                  </div>

                  {/* Phone Number */}
                  <div className="group">
                    <label htmlFor="phone" className="block text-lg font-medium text-cyan-300 mb-2 group-focus-within:text-cyan-200 transition-colors">
                      Phone Number *
                    </label>
                    <input type="tel" placeholder="Enter your phone number" name='phone' id='phone' autoComplete='off' required className="w-full px-4 py-3 rounded-xl bg-gray-900/70 border border-gray-700/50 text-white placeholder-gray-500 backdrop-blur-sm focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20  hover:border-gray-600 transition-all duration-300"
                      value={form.phone}
                      onChange={handleChange}
                    />
                  </div>

                  {/* Kanal ID */}
                  <div className="group">
                    <label htmlFor="kanal_id" className="block text-lg font-medium text-cyan-300 mb-2 group-focus-within:text-cyan-200 transition-colors">
                      Kanal ID *
                    </label>
                    <input
                      type="text"
                      placeholder="Enter your Kanal ID"
                      name='kanal_id'
                      id='kanal_id'
                      autoComplete='off'
                      required
                      className="w-full px-4 py-3 rounded-xl bg-gray-900/70 border border-gray-700/50 text-white placeholder-gray-500 backdrop-blur-sm focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20  hover:border-gray-600 transition-all duration-300"
                      value={form.kanal_id}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  className="relative group mt-10 pt-6 border-t border-gray-700/50"
                >
                  <button
                    type="submit"
                    className="relative px-16 py-5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-bold text-xl hover:from-cyan-500 hover:to-blue-500 transition-all overflow-hidden shadow-2xl shadow-cyan-500/20 w-full max-w-md mx-auto block"
                  >
                    <div className="relative z-20 flex items-center justify-center gap-4">
                      <span>START EXPERIENCE</span>
                      <ArrowRight className="w-6 h-6 group-hover:translate-x-3 transition-transform drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]" />
                    </div>

                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 opacity-0 group-hover:opacity-30 blur-xl transition-opacity -z-10"></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-xl -z-20"></div>
                    <div className="absolute inset-0 rounded-xl p-[2px] -z-30">
                      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse"></div>
                      <div className="absolute inset-[2px] rounded-xl bg-gray-950"></div>
                    </div>
                    <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-white to-transparent animate-scan -z-10"></div>
                  </button>
                  <div className="absolute -inset-6 rounded-3xl bg-gradient-to-r from-cyan-600/30 via-blue-600/30 to-cyan-600/30 blur-xl opacity-0 group-hover:opacity-70 transition-opacity duration-700 -z-40 animate-pulse pointer-events-none"></div>
                </motion.div>
              </form>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default EventForm