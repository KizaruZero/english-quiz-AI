import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY!);

export async function POST(request: NextRequest) {
  try {
    const { originalText, userSummary, timeSpent } = await request.json();

    if (!originalText || !userSummary) {
      return NextResponse.json(
        { error: "Original text and summary are required" },
        { status: 400 }
      );
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

    const prompt = `
    Evaluate this reading comprehension and summarization performance.
    
    Original Text: "${originalText}"
    User's Summary: "${userSummary}"
    Time Spent: ${timeSpent} seconds (max 600 seconds)
    
    Evaluate based on:
    1. Content (50%) - Does the summary capture the main idea and key points?
    2. Conciseness (25%) - Is it appropriately brief (5-75 words) while being complete?
    3. Language Quality (25%) - Grammar, vocabulary, sentence structure
    
    Additional considerations:
    - Word count should be 5-75 words
    - Should identify the main idea accurately
    - Should include most important supporting details
    - Time management (completed within 10 minutes)
    
    Respond with JSON only:
    {
      "overallScore": [1-100],
      "scores": {
        "content": [1-100],
        "conciseness": [1-100],
        "languageQuality": [1-100]
      },
      "feedback": {
        "content": "[feedback on main idea identification and completeness]",
        "conciseness": "[feedback on brevity and word count]",
        "languageQuality": "[feedback on grammar and vocabulary]",
        "overall": "[general performance feedback]"
      },
      "suggestions": "[specific improvement tips]",
      "mainIdeasMissed": [array of important points not included],
      "strengths": [array of positive aspects],
      "wordCount": [actual word count of summary],
      "timeManagement": "[feedback on time usage]"
    }
    `;

    const result = await model.generateContent(prompt);
    let response = result.response.text().trim();

    // Clean response
    response = response
      .replace(/```json\s*/gi, "")
      .replace(/```\s*$/gi, "")
      .trim();
    const jsonStart = response.indexOf("{");
    const jsonEnd = response.lastIndexOf("}") + 1;

    if (jsonStart === -1 || jsonEnd === 0) {
      throw new Error("No JSON found in response");
    }

    const jsonString = response.substring(jsonStart, jsonEnd);

    let evaluationData;
    try {
      evaluationData = JSON.parse(jsonString);
    } catch (parseError) {
      console.error("JSON Parse Error:", parseError);

      // Fallback evaluation
      const wordCount = userSummary.trim().split(/\s+/).length;
      evaluationData = {
        overallScore: 70,
        scores: {
          content: 65,
          conciseness: wordCount >= 5 && wordCount <= 75 ? 80 : 50,
          languageQuality: 70,
        },
        feedback: {
          content: "Summary captures some main points.",
          conciseness:
            wordCount >= 5 && wordCount <= 75
              ? "Good length"
              : "Check word count (5-75 words)",
          languageQuality: "Generally clear writing.",
          overall: "Good effort on summarization task.",
        },
        suggestions:
          "Focus on identifying the main idea and key supporting details.",
        mainIdeasMissed: [],
        strengths: ["Completed the task"],
        wordCount: wordCount,
        timeManagement:
          timeSpent <= 600
            ? "Good time management"
            : "Took longer than recommended",
      };
    }

    return NextResponse.json({
      success: true,
      ...evaluationData,
    });
  } catch (error) {
    console.error("Error evaluating summary:", error);
    return NextResponse.json(
      { error: "Failed to evaluate summary" },
      { status: 500 }
    );
  }
}
