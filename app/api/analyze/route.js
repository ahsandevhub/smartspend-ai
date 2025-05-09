import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(request) {
  const { note } = await request.json();

  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
    });

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: note }] }],
    });

    const response = await result.response;
    const textResponse = response.text();

    // Clean up the response and parse as JSON
    const cleanedResponse = textResponse
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const analysis = JSON.parse(cleanedResponse);

    return new Response(
      JSON.stringify({
        success: true,
        analysis,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error analyzing note:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
        details: "Failed to analyze note",
      }),
      { status: 500 }
    );
  }
}
