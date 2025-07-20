import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY!);

export async function POST(request: NextRequest) {
  try {
    const { topic = "general", difficulty = "medium" } = await request.json();

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

    const prompt = `
    Generate a reading passage for English comprehension test.
    
    Requirements:
    - Topic: ${topic}
    - Difficulty: ${difficulty}
    - Word count: 250-300 words
    - Should contain clear main ideas and supporting details
    - Use academic but accessible language
    - Include specific examples or explanations
    - Structure: Introduction, 2-3 body paragraphs, conclusion
    - Make it suitable for summarization practice
    
    Topics can include: technology, environment, education, health, business, science, culture, travel, etc.
    
    Return ONLY the text passage, no title, no additional formatting.
    `;

    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();

    // Count words
    const wordCount = text.split(/\s+/).length;

    return NextResponse.json({
      success: true,
      text: text,
      wordCount: wordCount,
      topic: topic,
      difficulty: difficulty,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error generating reading text:", error);
    return NextResponse.json(
      { error: "Failed to generate reading text" },
      { status: 500 }
    );
  }
}
