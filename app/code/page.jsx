'use client'
import { useEffect, useState } from 'react'
import MonacoEditor from '@monaco-editor/react'
import { Clock } from 'lucide-react'
import { useRouter } from 'next/navigation'

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
    const [timeLeft, setTimeLeft] = useState(30* 60)
    const [output, setOutput] = useState('')
    const [isRunning, setIsRunning] = useState(false)

    const languages = [
        { value: 'python', label: 'Python' },
        { value: 'java', label: 'Java' },
        { value: 'c', label: 'C' },
        { value: 'cpp', label: 'C++' }
    ]

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


    return (
        <div className="min-h-screen bg-gray-950 text-white flex flex-col">
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
