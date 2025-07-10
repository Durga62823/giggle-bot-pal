import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { message } = await req.json();

    const geminiApiKey ="AIzaSyBRIdZnJyxYcLzSYHNFaF90hK_A7rsd2cY";
    if (!geminiApiKey) {
      throw new Error("Gemini API key not configured");
    }

    const geminiUrl =
      `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${geminiApiKey}`;

    const response = await fetch(geminiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: message,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 500,
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();

    const aiMessage =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "I'm sorry, I couldn't generate a response.";

    return new Response(
      JSON.stringify({ message: aiMessage }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({
        error: error.message,
        message:
          "I'm sorry, I'm having trouble connecting right now. Please try again in a moment! 😔",
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
