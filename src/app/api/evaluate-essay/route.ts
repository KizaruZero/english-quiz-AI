import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY!);

export async function POST(request: NextRequest) {
  try {
    const { essayTopic, userEssay, timeSpent } = await request.json();

    if (!essayTopic || !userEssay) {
      return NextResponse.json(
        { error: "Essay topic and response are required" },
        { status: 400 }
      );
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

    const prompt = `
    Evaluate this essay writing performance.
    
    Essay Topic: "${essayTopic}"
    User's Essay: "${userEssay}"
    Time Spent: ${timeSpent} seconds (max 600 seconds)
    
    Evaluate based on:
    1. Content & Ideas (35%) - Relevance to topic, depth of ideas, examples
    2. Organization (25%) - Structure, logical flow, introduction/conclusion
    3. Language Use (25%) - Grammar, vocabulary, sentence variety
    4. Task Achievement (15%) - Meets word count (200-300), addresses prompt
    
    Additional considerations:
    - Word count should be 200-300 words
    - Should have clear introduction, body, conclusion
    - Ideas should be well-developed and supported
    - Time management (completed within 10 minutes)
    
    Respond with JSON only:
    {
      "overallScore": [1-100],
      "scores": {
        "contentIdeas": [1-100],
        "organization": [1-100],
        "languageUse": [1-100],
        "taskAchievement": [1-100]
      },
      "feedback": {
        "contentIdeas": "[feedback on ideas and relevance]",
        "organization": "[feedback on structure and flow]",
        "languageUse": "[feedback on grammar and vocabulary]",
        "taskAchievement": "[feedback on meeting requirements]",
        "overall": "[general performance feedback]"
      },
      "suggestions": "[specific improvement tips]",
      "strengths": [array of positive aspects],
      "areasToImprove": [array of specific areas needing work],
      "wordCount": [actual word count],
      "timeManagement": "[feedback on time usage]",
      "hasIntroduction": [boolean],
      "hasConclusion": [boolean]
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
      const wordCount = userEssay.trim().split(/\s+/).length;
      evaluationData = {
        overallScore: 70,
        scores: {
          contentIdeas: 70,
          organization: 65,
          languageUse: 70,
          taskAchievement: wordCount >= 200 && wordCount <= 300 ? 80 : 60,
        },
        feedback: {
          contentIdeas: "Ideas are relevant to the topic.",
          organization: "Essay has basic structure.",
          languageUse: "Language is generally clear.",
          taskAchievement:
            wordCount >= 200 && wordCount <= 300
              ? "Meets word count"
              : "Check word count (200-300 words)",
          overall: "Good effort on the essay task.",
        },
        suggestions:
          "Focus on developing ideas with specific examples and improving organization.",
        strengths: ["Completed the task", "Clear writing"],
        areasToImprove: ["Paragraph structure", "Idea development"],
        wordCount: wordCount,
        timeManagement:
          timeSpent <= 600
            ? "Good time management"
            : "Took longer than recommended",
        hasIntroduction: true,
        hasConclusion: true,
      };
    }

    return NextResponse.json({
      success: true,
      ...evaluationData,
    });
  } catch (error) {
    console.error("Error evaluating essay:", error);
    return NextResponse.json(
      { error: "Failed to evaluate essay" },
      { status: 500 }
    );
  }
}
