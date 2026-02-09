'use client'
import { useEffect, useState } from 'react'
import MonacoEditor from '@monaco-editor/react'
import { Clock, Trophy } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'

const buggyPrograms = {
    python: `
    class Calculator:
        def __init__(self, a, b):
            self.a = a
            self.b = b

        def add(self):
            return self.a - self.b   # BUG: should be +

        def multiply(self):
            result = 0
            for i in range(self.b):
                result += self.a
            return result

    def find_max(arr):
        max = 0            # BUG: fails for negative numbers
        for i in range(len(arr)):
            if arr[i] > max:
                max = arr[i]
        return max

    nums = [-5, -2, -10]
    calc = Calculator(5, 3)

    print("Addition:", calc.add())
    print("Multiplication:", calc.multiply())
    print("Max:", find_max(nums))
    `,

    java: `
class Student {
    String name;
    int marks;

    Student(String name, int marks) {
        name = name;      // BUG: shadowing
        marks = marks;    // BUG
    }

    boolean isPassed() {
        return marks > 40;
    }
}

public class Main {
    static int sum(int a, int b) {
        return a * b;   // BUG
    }

    public static void main(String[] args) {
        Student s = new Student("Alex", 35);

        if (s.isPassed())
            System.out.println("Passed");
        else
            System.out.println("Failed");

        System.out.println("Sum: " + sum(5, 3));
    }
}
`,

    c: `
#include <stdio.h>

int factorial(int n) {
    if (n == 0)
        return 0;   // BUG: should return 1

    int fact = 1;
    for (int i = 1; i < n; i++) { // BUG: < instead of <=
        fact *= i;
    }
    return fact;
}

int main() {
    int num = 5;
    printf("Factorial: %d", factorial(num));
    return 0;
}
`,

    cpp: `
#include <iostream>
using namespace std;

class Counter {
public:
    int count;

    Counter() {
        count == 0;  // BUG: comparison instead of assignment
    }

    void increment() {
        count = count + 1;
    }
};

int main() {
    Counter c;
    for (int i = 0; i <= 5; i++) { // BUG: off-by-one
        c.increment();
    }
    cout << "Count: " << c.count << endl;
    return 0;
}
`
}

export default function HomePage() {
    const router = useRouter()
    const [selectedLang, setSelectedLang] = useState('python')
    const [code, setCode] = useState(buggyPrograms.python)
    const [timeLeft, setTimeLeft] = useState(30 * 60)
    const [output, setOutput] = useState('')
    const [isRunning, setIsRunning] = useState(false)

    const languages = [
        { value: 'python', label: 'Python' },
        { value: 'java', label: 'Java' },
        { value: 'c', label: 'C' },
        { value: 'cpp', label: 'C++' }
    ]

    const [isFullScreen, setIsFullScreen] = useState(false)
    const [isDisqualified, setIsDisqualified] = useState(false)

    useEffect(() => {
        // Anti-cheating: Disable Copy/Paste/Right-click
        const preventDefaults = (e) => {
            e.preventDefault()
            alert('Security Alert: This action is disabled.')
        }

        const handleVisibilityChange = () => {
            if (document.visibilityState === 'hidden' && !isDisqualified) {
                handleDisqualification()
            }
        }

        const handleWindowBlur = () => {
            if (!isDisqualified) {
                handleDisqualification()
            }
        }

        const handleFullScreenChange = () => {
            if (!document.fullscreenElement && !isDisqualified && isFullScreen) {
                handleDisqualification()
            }
        }

        if (isFullScreen && !isDisqualified) {
            document.addEventListener('copy', preventDefaults)
            document.addEventListener('paste', preventDefaults)
            document.addEventListener('contextmenu', preventDefaults)
            document.addEventListener('visibilitychange', handleVisibilityChange)
            document.addEventListener('fullscreenchange', handleFullScreenChange)
            window.addEventListener('blur', handleWindowBlur)
        }

        return () => {
            document.removeEventListener('copy', preventDefaults)
            document.removeEventListener('paste', preventDefaults)
            document.removeEventListener('contextmenu', preventDefaults)
            document.removeEventListener('visibilitychange', handleVisibilityChange)
            document.removeEventListener('fullscreenchange', handleFullScreenChange)
            window.removeEventListener('blur', handleWindowBlur)
        }
    }, [isFullScreen, isDisqualified])

    const handleDisqualification = async () => {
        setIsDisqualified(true)
        const userId = localStorage.getItem('user_id')
        if (userId) {
            await fetch('/api/submit-results', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    user_id: userId,
                    score: 0,
                    time_spent: 30 * 60 - timeLeft
                })
            }).catch(() => { })
        }

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
        if (timeLeft === 0) {
            router.push('/')
            return
        }
        const timer = setInterval(() => {
            setTimeLeft((t) => (t > 0 ? t - 1 : 0))
        }, 1000)
        return () => clearInterval(timer)
    }, [timeLeft, router])
    const minutes = Math.floor(timeLeft / 60)
    const seconds = timeLeft % 60

    const handleLanguageChange = (lang) => {
        setSelectedLang(lang)
        setCode(buggyPrograms[lang])
        setOutput('')
    }
    const handleRun = async () => {
        if (isRunning) return
        setIsRunning(true)
        setOutput('Running...')

        try {
            const res = await fetch('/api/run', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    language: selectedLang,
                    code
                })
            })

            const data = await res.json()

            if (data.stderr) {
                setOutput("No Error Fixed")
            } else {
                setOutput(data.stdout || 'No output')
            }
        } catch (err) {
            setOutput('Execution failed')
        } finally {
            setIsRunning(false)
        }
    }


    if (!isFullScreen) {
        return (
            <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="max-w-md w-full bg-gray-900/50 backdrop-blur-xl border border-cyan-500/30 p-8 rounded-3xl text-center shadow-2xl"
                >
                    <Trophy className="w-16 h-16 text-cyan-500 mx-auto mb-6" />
                    <h2 className="text-2xl font-bold text-white mb-4">Ready to Fix Bugs?</h2>
                    <p className="text-gray-400 mb-8">
                        The coding environment will open in full-screen mode. Switching tabs or leaving the window will result in automatic disqualification.
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

    return (
        <div className="min-h-screen bg-gray-950 text-white flex flex-col select-none">
            <div className="flex items-center justify-between px-4 py-3 bg-gray-900 border-b border-gray-800">
                <select
                    value={selectedLang}
                    onChange={(e) => handleLanguageChange(e.target.value)}
                    className="bg-gray-800 px-3 py-2 rounded-md outline-none text-sm"
                >
                    {languages.map((lang) => (
                        <option key={lang.value} value={lang.value}>
                            {lang.label}
                        </option>
                    ))}
                </select>

                <div className="flex items-center gap-2 text-sm text-cyan-400">
                    <Clock size={16} />
                    {minutes}:{seconds.toString().padStart(2, '0')}
                </div>
            </div>

            <div className="grid grid-cols-2 flex-1 overflow-hidden">
                <div className="border-r border-gray-800">
                    <MonacoEditor
                        key={selectedLang}
                        height="100%"
                        language={selectedLang}
                        theme="vs-dark"
                        value={code}
                        onChange={(value) => setCode(value || '')}
                        options={{
                            minimap: { enabled: false },
                            fontSize: 14,
                            scrollBeyondLastLine: false,
                            wordWrap: 'on'
                        }}
                    />
                </div>

                <div className="p-4 bg-gray-900 flex flex-col">
                    <div className="flex items-center justify-between mb-3 relative z-20">
                        <h2 className="text-sm text-gray-400">Output</h2>
                        <button
                            onClick={handleRun}
                            disabled={isRunning}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${isRunning
                                ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                                : 'bg-green-600 hover:bg-green-500 text-white'
                                }`}
                        >
                            {isRunning ? 'Running...' : 'Run Code'}
                        </button>
                    </div>

                    <div className="bg-black rounded-md p-3 text-sm flex-1">
                        <textarea
                            className="w-full h-full bg-transparent outline-none text-white resize-none"
                            placeholder="Fix logical bugs to get correct output"
                            disabled
                            value={output}
                        />
                    </div>
                </div>

            </div>
        </div>
    )
}
