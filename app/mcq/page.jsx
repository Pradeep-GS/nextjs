// app/questions/page.js
'use client'

import { useEffect, useState } from "react"
import { motion } from 'framer-motion'
import { Loader2, Trophy, XCircle, ChevronRight, Home } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function QuestionsPage() {
    const router = useRouter()
    const [questions, setQuestions] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [currentQuestion, setCurrentQuestion] = useState(0)
    const [answers, setAnswers] = useState({})
    const [showResult, setShowResult] = useState(false)
    const [timeLeft, setTimeLeft] = useState(1800) // 30 mins
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [submitStatus, setSubmitStatus] = useState(null)
    const [isFullScreen, setIsFullScreen] = useState(false)
    const [isDisqualified, setIsDisqualified] = useState(false)

    useEffect(() => {
        // Anti-cheating: Disable Copy/Paste/Right-click
        const preventDefaults = (e) => {
            e.preventDefault()
            alert('Security Alert: This action is disabled.')
        }

        const handleVisibilityChange = () => {
            if (document.visibilityState === 'hidden' && !showResult && !isDisqualified) {
                handleDisqualification()
            }
        }

        const handleWindowBlur = () => {
            if (!showResult && !isDisqualified) {
                handleDisqualification()
            }
        }

        if (!loading && questions.length > 0 && !showResult) {
            document.addEventListener('copy', preventDefaults)
            document.addEventListener('paste', preventDefaults)
            document.addEventListener('contextmenu', preventDefaults)
            document.addEventListener('visibilitychange', handleVisibilityChange)
            window.addEventListener('blur', handleWindowBlur)
        }

        return () => {
            document.removeEventListener('copy', preventDefaults)
            document.removeEventListener('paste', preventDefaults)
            document.removeEventListener('contextmenu', preventDefaults)
            document.removeEventListener('visibilitychange', handleVisibilityChange)
            window.removeEventListener('blur', handleWindowBlur)
        }
    }, [loading, questions, showResult, isDisqualified])

    const handleDisqualification = async () => {
        setIsDisqualified(true)
        // Optionally submit a 0 score
        const userId = localStorage.getItem('user_id')
        const kanalId = localStorage.getItem('kanal_id')
        await fetch('/api/submit-results', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                user_id: userId,
                kanal_id: kanalId,
                score: 0,
                time_spent: 1800 - timeLeft
            })
        })

        if (document.fullscreenElement) {
            document.exitFullscreen().catch(() => { })
        }

        alert('DISQUALIFIED: Tab switching or leaving the window is not allowed.')
        router.push('/')
    }

    const enterFullScreen = () => {
        const elem = document.documentElement
        if (elem.requestFullscreen) {
            elem.requestFullscreen()
        } else if (elem.webkitRequestFullscreen) {
            elem.webkitRequestFullscreen()
        } else if (elem.msRequestFullscreen) {
            elem.msRequestFullscreen()
        }
        setIsFullScreen(true)
    }

    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                setLoading(true)
                setError(null)

                const response = await fetch('/api/questions')

                if (!response.ok) {
                    throw new Error(`Failed to fetch questions: ${response.status}`)
                }

                const data = await response.json()
                console.log('Fetched questions:', data)

                if (Array.isArray(data)) {
                    setQuestions(data)
                } else if (data.questions && Array.isArray(data.questions)) {
                    setQuestions(data.questions)
                } else if (data.question_text) {
                    // Single question
                    setQuestions([data])
                } else {
                    throw new Error('Invalid response format')
                }
            } catch (err) {
                console.error('Error fetching questions:', err)
                setError(err.message || 'Failed to load questions')
            } finally {
                setLoading(false)
            }
        }

        fetchQuestions()
    }, [])

    // Timer effect
    useEffect(() => {
        if (timeLeft <= 0 || showResult) {
            if (timeLeft <= 0 && !showResult) {
                handleSubmitResults().then(() => {
                    setShowResult(true)
                })
            }
            return
        }

        const timer = setInterval(() => {
            setTimeLeft(prev => prev - 1)
        }, 1000)

        return () => clearInterval(timer)
    }, [timeLeft, showResult])

    // Format time
    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }

    const handleOptionSelect = (option) => {
        setAnswers(prev => ({
            ...prev,
            [questions[currentQuestion].id]: option
        }))
    }

    const handleNext = async () => {
        if (currentQuestion < questions.length - 1) {
            setCurrentQuestion(currentQuestion + 1)
        } else {
            await handleSubmitResults()
            setShowResult(true)
        }
    }

    const handleSubmitResults = async () => {
        setIsSubmitting(true)
        const calculatedScore = questions.reduce((acc, q) => {
            return acc + (answers[q.id] === q.correct_option ? 1 : 0)
        }, 0)

        const userId = localStorage.getItem('user_id')
        const kanalId = localStorage.getItem('kanal_id')
        const timeSpent = 1800 - timeLeft

        try {
            const response = await fetch('/api/submit-results', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    user_id: userId,
                    kanal_id: kanalId,
                    score: calculatedScore,
                    time_spent: timeSpent
                })
            })

            if (!response.ok) {
                const data = await response.json()
                throw new Error(data.error || 'Failed to submit results')
            }

            setSubmitStatus('success')
        } catch (err) {
            console.error('Submission error:', err)
            setSubmitStatus('failed')
        } finally {
            setIsSubmitting(false)
        }
    }

    const handlePrevious = () => {
        if (currentQuestion > 0) {
            setCurrentQuestion(currentQuestion - 1)
        }
    }


    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-950 to-gray-900 flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 text-cyan-500 animate-spin mx-auto mb-4" />
                    <p className="text-gray-300 text-lg">Loading questions...</p>
                </div>
            </div>
        )
    }

    if (error && questions.length === 0) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-950 to-gray-900 flex items-center justify-center p-4">
                <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-red-700/30 p-6 max-w-md">
                    <h2 className="text-xl font-bold text-red-400 mb-2">Error Loading Questions</h2>
                    <p className="text-gray-300 mb-4">{error}</p>
                    <p className="text-gray-400 text-sm">Using sample questions instead.</p>
                </div>
            </div>
        )
    }

    if (questions.length === 0) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-950 to-gray-900 flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-300 mb-2">No Questions Available</h2>
                    <p className="text-gray-400">Please check if the API is returning questions.</p>
                </div>
            </div>
        )
    }

    if (showResult) {
        const calculatedScore = questions.reduce((acc, q) => {
            return acc + (answers[q.id] === q.correct_option ? 1 : 0)
        }, 0)

        const isPassed = calculatedScore >= 17

        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-950 to-gray-900 p-6 flex items-center justify-center">
                <div className="max-w-2xl w-full">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-gray-900/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-8 shadow-2xl"
                    >
                        <div className="text-center mb-8">
                            {isPassed ? (
                                <div className="inline-block p-4 rounded-full bg-green-500/10 mb-4">
                                    <Trophy className="w-16 h-16 text-green-500" />
                                </div>
                            ) : (
                                <div className="inline-block p-4 rounded-full bg-red-500/10 mb-4">
                                    <XCircle className="w-16 h-16 text-red-500" />
                                </div>
                            )}

                            <h1 className="text-3xl font-bold mb-2 text-white">
                                {isPassed ? "Qualification Successful!" : "Assessment Incomplete"}
                            </h1>
                            <p className="text-gray-400 mb-6">
                                {isPassed
                                    ? "Excellent work! You've qualified for the next stage. Please use the credentials below to continue."
                                    : "Unfortunately, you didn't reach the required score of 25 to proceed."}
                            </p>

                            {isPassed && (
                                <div className="bg-gray-800/80 p-6 rounded-xl border border-cyan-500/30 mb-8 max-w-sm mx-auto">
                                    <div className="flex flex-col gap-3 text-left">
                                        <div className="flex justify-between items-center border-b border-gray-700 pb-2">
                                            <span className="text-gray-400 text-sm uppercase tracking-wider">Name</span>
                                            <span className="text-cyan-400 font-mono font-bold">kanal</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-400 text-sm uppercase tracking-wider">Password</span>
                                            <span className="text-cyan-400 font-mono font-bold">codefaultarena</span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {submitStatus === 'failed' && (
                                <p className="text-red-400 mt-2 text-sm">
                                    Warning: Results failed to save to server. Please notify the coordinator.
                                </p>
                            )}
                            {isSubmitting && (
                                <div className="flex items-center justify-center gap-2 text-cyan-400 mt-2 text-sm">
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Saving results...
                                </div>
                            )}
                        </div>

                        <div className="flex justify-center gap-8 mb-10">
                            <div className="text-center">
                                <div className="text-5xl font-bold text-white mb-1">{calculatedScore}</div>
                                <div className="text-gray-500 uppercase text-xs tracking-widest">Your Score</div>
                            </div>
                            <div className="w-px bg-gray-800 self-stretch"></div>
                            <div className="text-center">
                                <div className="text-5xl font-bold text-gray-500 mb-1">25</div>
                                <div className="text-gray-500 uppercase text-xs tracking-widest">Passing Score</div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {isPassed ? (
                                <button
                                    onClick={() => router.push('/final-login')}
                                    className="col-span-1 md:col-span-2 flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 rounded-xl font-bold text-lg text-white transition-all hover:scale-[1.02] shadow-lg shadow-cyan-900/30"
                                >
                                    Proceed to Coding Login
                                    <ChevronRight className="w-6 h-6" />
                                </button>
                            ) : (
                                <>
                                    <button
                                        onClick={() => router.push('/')}
                                        className="flex items-center justify-center gap-2 px-6 py-4 bg-gray-900 hover:bg-gray-800 rounded-xl font-semibold text-gray-300 transition-all border border-gray-800"
                                    >
                                        <Home className="w-5 h-5" />
                                        Back to Home
                                    </button>
                                </>
                            )}
                        </div>
                    </motion.div>
                </div>
            </div>
        )
    }

    if (!isFullScreen && !loading && questions.length > 0) {
        return (
            <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="max-w-md w-full bg-gray-900/50 backdrop-blur-xl border border-cyan-500/30 p-8 rounded-3xl text-center shadow-2xl"
                >
                    <Trophy className="w-16 h-16 text-cyan-500 mx-auto mb-6" />
                    <h2 className="text-2xl font-bold text-white mb-4">Ready to Begin?</h2>
                    <p className="text-gray-400 mb-8">
                        The assessment will open in full-screen mode. Switching tabs or leaving the window will result in automatic disqualification.
                    </p>
                    <button
                        onClick={enterFullScreen}
                        className="w-full py-4 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-xl font-bold text-lg text-white hover:from-cyan-500 hover:to-blue-500 transition-all shadow-lg shadow-cyan-900/40"
                    >
                        Enter Full Screen & Start
                    </button>
                </motion.div>
            </div>
        )
    }

    const currentQ = questions[currentQuestion]

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-950 to-gray-900 p-4 md:p-6 select-none">
            <div className="max-w-4xl mx-auto">
                {/* Header with Timer */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                        Assessment
                    </h1>
                    <div className="flex items-center gap-3 px-4 py-2 bg-gray-900/50 rounded-xl border border-gray-700/50">
                        <span className="text-gray-400 text-sm font-medium">Time Remaining</span>
                        <span className={`font-mono text-xl font-bold ${timeLeft < 300 ? 'text-red-500 animate-pulse' : 'text-cyan-400'}`}>
                            {formatTime(timeLeft)}
                        </span>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-8">
                    <div className="flex justify-between text-gray-400 text-sm mb-2">
                        <span>Question {currentQuestion + 1} of {questions.length}</span>
                    </div>
                    <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                            transition={{ duration: 0.5 }}
                            className="h-full bg-gradient-to-r from-cyan-500 to-blue-500"
                        />
                    </div>
                </div>

                {/* Question Card */}
                <motion.div
                    key={currentQuestion}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6 md:p-8 mb-8"
                >
                    <pre className="text-xl md:text-2xl font-medium text-gray-100 mb-8 leading-relaxed">
                        {currentQ.question_text}
                    </pre>

                    {/* Options */}
                    <div className="space-y-4 text-white">
                        {['A', 'B', 'C', 'D'].map((option) => (
                            <button
                                key={option}
                                onClick={() => handleOptionSelect(option)}
                                className={`w-full p-4 text-left rounded-xl border-2 transition-all duration-300 ${answers[currentQ.id] === option
                                    ? 'bg-blue-900/20 border-blue-500 text-blue-100 shadow-lg shadow-blue-900/20'
                                    : 'bg-gray-800/30 border-gray-700/50 hover:border-gray-600 hover:bg-gray-700/30'
                                    }`}
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-lg ${answers[currentQ.id] === option
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-700/50 text-gray-400'
                                        }`}>
                                        {option}
                                    </div>
                                    <span className="text-lg">{currentQ[`option_${option.toLowerCase()}`]}</span>
                                </div>
                            </button>
                        ))}
                    </div>
                </motion.div>

                <div className="flex justify-between">
                    <button
                        onClick={handlePrevious}
                        disabled={currentQuestion === 0}
                        className={`px-6 py-3 rounded-lg font-medium transition-all ${currentQuestion === 0
                            ? 'bg-gray-800/30 text-gray-500 cursor-not-allowed'
                            : 'bg-gray-800/50 hover:bg-gray-700/50 text-gray-300'
                            }`}
                    >
                        Previous
                    </button>

                    <button
                        onClick={handleNext}
                        disabled={!answers[currentQ.id]}
                        className={`px-8 py-3 rounded-lg font-semibold text-lg transition-all ${!answers[currentQ.id]
                            ? 'bg-gray-800/30 text-gray-500 cursor-not-allowed'
                            : 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 hover:scale-105 active:scale-95 shadow-lg shadow-cyan-900/30'
                            }`}
                    >
                        {currentQuestion === questions.length - 1 ? 'Finish' : 'Next'}
                    </button>
                </div>


                <div className="mt-8 flex flex-wrap gap-2 justify-center text-white">
                    {questions.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => {
                                setCurrentQuestion(index)
                            }}
                            className={`w-10 h-10 rounded-lg flex items-center justify-center font-medium transition-all ${index === currentQuestion
                                ? 'bg-gradient-to-br from-cyan-600 to-blue-600 text-white shadow-lg'
                                : answers[questions[index].id]
                                    ? 'bg-green-900/30 text-green-300 border border-green-700/30'
                                    : 'bg-gray-800/50 text-gray-400 border border-gray-700/50'
                                }`}
                        >
                            {index + 1}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    )
}