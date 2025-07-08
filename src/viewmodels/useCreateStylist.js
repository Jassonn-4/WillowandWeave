import  supabase  from "../lib/supabaseClient";

export async function createStylist({ id, name, bio, created_at, stylists_number, skills, profile_url, QR_url}) {
    try {
    console.log("Inserting stylist into database...");
    const { error: insertError } = await supabase.from("stylists").insert([
        {
        id,
        name,
        bio,
        created_at,
        stylists_number,
        skills,
        profile_url,
        QR_url,
        },
    ]);

    if (insertError) {
        console.error("Insert error:", insertError.message, insertError);
        throw insertError;
    }
    
    console.log("Stylist inserted succesfully");
    return true;
} catch (error) {
    console.error("createStylist() failed:", error.message, error);
    throw error;
    }
}