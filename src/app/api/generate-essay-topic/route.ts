import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY!);

export async function POST(request: NextRequest) {
  try {
    const { type = "argumentative", difficulty = "medium" } =
      await request.json();

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

    const prompt = `
    Generate an essay topic for English writing practice.
    
    Requirements:
    - Essay type: ${type} (argumentative, descriptive, narrative, expository)
    - Difficulty: ${difficulty}
    - Should be engaging and relevant to current issues
    - Allow for 200-300 word response
    - Clear and specific prompt
    - Should encourage critical thinking
    
    Format your response as:
    Topic: [Clear topic statement]
    Instructions: [Specific writing instructions]
    Key Points: [3-4 suggested points to consider]
    `;

    const result = await model.generateContent(prompt);
    const response = result.response.text().trim();

    return NextResponse.json({
      success: true,
      content: response,
      type: type,
      difficulty: difficulty,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error generating essay topic:", error);
    return NextResponse.json(
      { error: "Failed to generate essay topic" },
      { status: 500 }
    );
  }
}
