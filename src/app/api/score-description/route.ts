import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY!);

// Helper function to extract JSON from AI response
function extractJSON(text: string) {
  try {
    // First, try to parse directly
    return JSON.parse(text);
  } catch {
    // If that fails, try to extract JSON from markdown code blocks
    const jsonMatch = text.match(/```(?:json)?\s*(\{[\s\S]*\})\s*```/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[1]);
    }

    // Try to find JSON object within the text
    const jsonObjectMatch = text.match(/\{[\s\S]*\}/);
    if (jsonObjectMatch) {
      return JSON.parse(jsonObjectMatch[0]);
    }

    throw new Error("No valid JSON found in response");
  }
}

export async function POST(request: NextRequest) {
  try {
    const { aiDescription, userDescription } = await request.json();

    if (!aiDescription || !userDescription) {
      return NextResponse.json(
        { error: "Both descriptions are required" },
        { status: 400 }
      );
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = `
    You are an English language examiner for a PTE-style test. 
    
    AI Description: "${aiDescription}"
    User Description: "${userDescription}"
    
    Compare these two descriptions and provide a score from 1-100 based on:
    - Content accuracy (40%): How well does the user description match the image content?
    - Language fluency (30%): Grammar, vocabulary, sentence structure
    - Detail coverage (20%): How many relevant details were mentioned?
    - Clarity (10%): How clear and coherent is the description?
    
    Respond with ONLY valid JSON in this exact format (no markdown, no extra text):
    {
      "score": [number 1-100],
      "feedback": {
        "content": "[feedback on content accuracy]",
        "fluency": "[feedback on language fluency]", 
        "details": "[feedback on detail coverage]",
        "clarity": "[feedback on clarity]"
      },
      "suggestions": "[specific suggestions for improvement]"
    }
    `;

    const result = await model.generateContent(prompt);
    const response = result.response.text();

    console.log("Raw Gemini response:", response);

    // Parse JSON response with improved error handling
    const scoreData = extractJSON(response);

    // Validate required fields
    if (!scoreData.score || !scoreData.feedback || !scoreData.suggestions) {
      throw new Error("Invalid response format from AI");
    }

    return NextResponse.json({
      success: true,
      ...scoreData,
    });
  } catch (error) {
    console.error("Error scoring description:", error);
    console.error(
      "Error details:",
      error instanceof Error ? error.message : "Unknown error"
    );
    return NextResponse.json(
      { error: "Failed to score description" },
      { status: 500 }
    );
  }
}
