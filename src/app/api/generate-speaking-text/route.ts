import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY!);

export async function POST(request: NextRequest) {
  try {
    const { difficulty = "medium" } = await request.json();

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = `
    Generate a reading passage for PTE-style English speaking practice test. 
    
    Requirements:
    - Maximum 60 words
    - Difficulty level: ${difficulty}
    - Topic should be interesting and varied (daily life, nature, technology, travel, etc.)
    - Use clear, natural English
    - Include a mix of sentence lengths
    - Avoid complex technical terms
    - Make it suitable for pronunciation practice
    
    Return ONLY the text passage, no additional formatting or explanations.
    `;

    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();

    // Count words to ensure it's under 60
    const wordCount = text.split(/\s+/).length;

    return NextResponse.json({
      success: true,
      text: text,
      wordCount: wordCount,
      difficulty: difficulty,
    });
  } catch (error) {
    console.error("Error generating speaking text:", error);
    return NextResponse.json(
      { error: "Failed to generate speaking text" },
      { status: 500 }
    );
  }
}
