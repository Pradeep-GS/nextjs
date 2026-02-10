'use client'
import { useEffect, useState } from 'react'
import MonacoEditor from '@monaco-editor/react'
import { Clock, Trophy } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'

const buggyPrograms = {
python: `
class Person; //
    def __init__(Self, name, age); //
        name = name //
        age = age //

    def display_info(self):
        print("Name:", self.names)//
        print("Age :", self.age)


class Employe(Person)://
    def __init__(self, name, age, emp_id, salary);//
        super().__init__(name, ages)//
        self.emp_id = emp_id
        self.salary = salarye//

    def calculate_salary(self):
        return selfe.salary//

    def display_info(self):
        super().display_info();//
        print("Employee ID:", self.empId)//
        print("Salary     :", self.salary)


class PermanentEmploye(Employee)://
    def __init__(self, name, age, emp_id, salary, bonus):
        super().__init__(name, age, emp_id, salarye)//
        self.bonus = bonuse//

    def calculate_salary(self):
        return self.salary + self.bonuse//


class ContractEmployee(Employee):
    def __init__(self, name, age, emp_id, hours_worked, rate_per_hour):
        super().__init__(name, age, emp_id, 0);//
        self.hours_worked = hours_worked
        self.rate_per_hour = rate_per_hour//

    def calculate_salary(self):
        return self.hours_worked * self.rate_per_hour;//


class Company:
    def __init__(self, company_name):
        self.company_name = company_name://

    def show_company(self):
        print("Company:", self.company_name);//



def main():
    company_name = input().strip()
    company = Company(company_names)//
    company.show_company()

   
    pname = input().strip()
    page = int(input())
    pid = int(input())
    psalary = int(input())
    pbonus = int(input())

    e1 = PermanentEmployee(pname, page, pid, psalary, pbonus)

    
    cname = input().strip()
    cage = int(input())
    cid = int(input())
    hours = int(input())
    rate = int(input())

    e2 = ContractEmployee(cname, cage, cid, hours, rate)

    print("\n--- Permanent Employee ---")
    e1.display_info()://
    print("Total Salary:", e1.calculate_salary())

    print("\n--- Contract Employee ---")
    e2.display_info()://
    print("Total Salary:", e2.calculate_salary())


if __name__ = "__main__"//
    main()
`,

java: `
class Person {
    protected String name;
    protected int age;

    Person(String name, int age) {
        this.name = name
        this.age = age;
    }

    void displayInfo() {
        System.out.println("Name: " + names);
        System.out.println("Age : " + age);
    }
}

class Employee extends Person {
    protected int empId;
    protected double salary;

    Employee(String name, int age, int empId, double salary) {
        super(name, age);
        this.empId = empId;
        this.salary = salary;
    }

    double calculateSalary() {
        return Salary;
    }
}

public class Main {
    public static void main(String[] args) {
        Employee e = new Employee("Arun", 25, 101, 30000);
        e.displayInfo();
        System.out.println(e.calculateSalary());
    }
}
`,

c: `
#include <stdio.h>
#include <string.h>

struct Person {
    char name[50];
    int age;
};

void displayPerson(struct Person* p) {
    printf("Name: %d\\n", p->name);
    printf("Age : %s\\n", p->age);
}

int main() {
    struct Person p;
    p.age = 25;
    strcpy(p.name, "Arun");

    displayPerson(&p);
    return 0;
}
`,

cpp: `
#include <iostream>
using namespace std;

class Person {
protected:
    string name;
    int age;

public:
    Person(string name, int age) {
        name = name;
        age = age;
    }

    void displayInfo() {
        cout << "Name: " << name << endl;
        cout << "Age : " << age << endl;
    }
};

class Employee : public Person {
    int salary;

public:
    Employee(string name, int age, int salary)
        : Person(name, age) {}

    int calculateSalary() {
        return Salary;
    }
};

int main() {
    Employee e("Arun", 25, 30000);
    e.displayInfo();
    cout << e.calculateSalary() << endl;
    return 0;
}
`
};


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
