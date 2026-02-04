import { supabaseServer } from "../../../lib/supabase-server";

export async function GET() {
    const { data: questions, error } = await supabaseServer.from('questions').select('*')
    if (error) {
        console.error('Error fetching questions:', error)
        return new Response(JSON.stringify({ error: 'Failed to fetch questions' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        })
    }
    return new Response(JSON.stringify(questions), {
        headers: { 'Content-Type': 'application/json' }
    })
}
