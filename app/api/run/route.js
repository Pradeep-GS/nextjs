import { NextResponse } from 'next/server'

const PAIZA_API_KEY = 'guest'

export async function POST(req) {
    const { language, code } = await req.json()

    const langMap = {
        python: 'python3',
        java: 'java',
        c: 'c',
        cpp: 'cpp'
    }

    // Create runner
    const createRes = await fetch('https://api.paiza.io/runners/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            api_key: PAIZA_API_KEY,
            language: langMap[language],
            source_code: code
        })
    })

    const { id } = await createRes.json()

    // Poll result
    let result
    while (true) {
        const res = await fetch(
            `https://api.paiza.io/runners/get_details?id=${id}&api_key=${PAIZA_API_KEY}`
        )
        result = await res.json()

        if (result.status === 'completed') break
        await new Promise(r => setTimeout(r, 1000))
    }

    return NextResponse.json({
        stdout: result.stdout,
        stderr: result.stderr,
        time: result.time,
        memory: result.memory
    })
}
