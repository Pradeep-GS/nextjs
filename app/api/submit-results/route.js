// app/api/submit-results/route.js
import { supabaseServer } from "@/lib/supabase-server";

export async function POST(req) {
    try {
        const { user_id, kanal_id, score, time_spent } = await req.json();

        if (!user_id || score === undefined || !time_spent) {
            return new Response(
                JSON.stringify({ error: "Missing required fields: user_id, score, or time_spent" }),
                { status: 400 }
            );
        }

        // Check if user has already submitted mcq
        const { data: existingResponse, error: checkError } = await supabaseServer
            .from("user_responses")
            .select("id")
            .eq("user_id", user_id)
            .maybeSingle();

        if (checkError) {
            console.error("Check error:", checkError);
        }

        if (existingResponse) {
            return new Response(
                JSON.stringify({ error: "MCQ results already submitted" }),
                { status: 400 }
            );
        }

        // Insert into user_responses. 
        // The username will be auto-filled by the database trigger we created.
        const { data, error } = await supabaseServer
            .from("user_responses")
            .insert([
                {
                    user_id,
                    kanal_id,
                    score,
                    time_from_frontend: `${time_spent} seconds`, // Postgres interval format
                },
            ])
            .select()
            .single();

        if (error) {
            console.error("Supabase error:", error);
            return new Response(JSON.stringify({ error: error.message }), { status: 500 });
        }

        return new Response(JSON.stringify({ success: true, data }), { status: 200 });
    } catch (error) {
        console.error("Submission error:", error);
        return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 });
    }
}
