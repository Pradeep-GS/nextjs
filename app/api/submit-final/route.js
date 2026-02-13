import { supabaseServer } from "@/lib/supabase-server";

export async function POST(req) {
    try {
        const { user_id, time_taken, language, output_status, code_output } = await req.json();

        if (!user_id || !time_taken || !language || !output_status) {
            return new Response(
                JSON.stringify({ error: "Missing required fields" }),
                { status: 400 }
            );
        }

        // Check if user has already submitted for final round
        const { data: existingResponse, error: checkError } = await supabaseServer
            .from("final_round_response")
            .select("id")
            .eq("user_id", user_id)
            .maybeSingle();

        if (existingResponse) {
            return new Response(
                JSON.stringify({ error: "Final round results already submitted" }),
                { status: 400 }
            );
        }

        // Fetch user details (name and kanal_id) from users table
        const { data: userData, error: userError } = await supabaseServer
            .from("users")
            .select("name, kanal_id")
            .eq("id", user_id)
            .single();

        if (userError || !userData) {
            console.error("User fetch error:", userError);
            return new Response(
                JSON.stringify({ error: "User not found" }),
                { status: 404 }
            );
        }

        // Insert into final_round_response
        const { data, error } = await supabaseServer
            .from("final_round_response")
            .insert([
                {
                    user_id,
                    name: userData.name,
                    kanal_id: userData.kanal_id,
                    time_taken,
                    language,
                    output_status,
                    code_output,
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
