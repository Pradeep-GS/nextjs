'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Lock, User, ArrowRight, ShieldCheck } from 'lucide-react';

export default function FinalLoginPage() {
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (name === 'kanal' && password === 'codefaultarena') {
            router.push('/code');
        } else {
            setError('Invalid credentials. Please try again.');
        }
    };

    return (
        <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4 overflow-hidden relative">
            {/* Background Animations */}
            <div className="absolute inset-0">
                <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.03)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,black,transparent)]"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-cyan-500/10 blur-[120px] rounded-full animate-pulse"></div>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="w-full max-w-md relative z-10"
            >
                <div className="bg-gray-900/40 backdrop-blur-xl border border-gray-700/50 rounded-3xl p-8 shadow-2xl">
                    <div className="text-center mb-10">
                        <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-500/30 mb-6 group">
                            <ShieldCheck className="w-10 h-10 text-cyan-500 group-hover:scale-110 transition-transform" />
                        </div>
                        <h1 className="text-3xl font-bold text-white mb-2">Final Validation</h1>
                        <p className="text-gray-400">Enter your credentials to unlock the coding challenge</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div className="space-y-4">
                            <div className="group relative">
                                <label className="text-sm font-medium text-gray-400 mb-1 block ml-1">Name</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <User className="h-5 w-5 text-gray-500 group-focus-within:text-cyan-500 transition-colors" />
                                    </div>
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="block w-full pl-11 pr-4 py-3.5 bg-gray-950/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all"
                                        placeholder="Enter name"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="group relative">
                                <label className="text-sm font-medium text-gray-400 mb-1 block ml-1">Password</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Lock className="h-5 w-5 text-gray-500 group-focus-within:text-cyan-500 transition-colors" />
                                    </div>
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="block w-full pl-11 pr-4 py-3.5 bg-gray-950/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all"
                                        placeholder="Enter password"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        {error && (
                            <motion.div
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="text-red-400 text-sm font-medium bg-red-400/10 py-2 px-3 rounded-lg border border-red-400/20 text-center"
                            >
                                {error}
                            </motion.div>
                        )}

                        <button
                            type="submit"
                            className="w-full relative group overflow-hidden py-4 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-bold text-lg hover:from-cyan-500 hover:to-blue-500 transition-all shadow-lg shadow-cyan-900/20"
                        >
                            <span className="relative z-10 flex items-center justify-center gap-2">
                                UNLOCK ACCESS <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </span>
                            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        </button>
                    </form>
                </div>
            </motion.div>
        </div>
    );
}
