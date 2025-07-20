import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY!);

export async function POST(request: NextRequest) {
  try {
    const { question, expectedAnswers, userResponse, responseTime } =
      await request.json();

    if (!question || !expectedAnswers || !userResponse) {
      return NextResponse.json(
        { error: "Question, expected answers, and user response are required" },
        { status: 400 }
      );
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

    const prompt = `
    Evaluate this listening & speaking response:
    
    Question: "${question}"
    Expected Answers: ${JSON.stringify(expectedAnswers)}
    User's Response: "${userResponse}"
    Response Time: ${responseTime} seconds
    
    Evaluate based on:
    1. Correctness (60%) - Is the answer correct or acceptable?
    2. Pronunciation (25%) - Was the response clear and understandable?
    3. Speed (15%) - Did they respond quickly (within 5 seconds is ideal)?
    
    Consider:
    - Synonyms and alternative correct answers
    - Minor pronunciation variations
    - Context and reasonableness of answer
    - Response time (0-3 sec = excellent, 3-5 sec = good, 5+ sec = needs improvement)
    
    Respond with JSON only:
    {
      "overallScore": [1-100],
      "scores": {
        "correctness": [1-100],
        "pronunciation": [1-100],
        "speed": [1-100]
      },
      "isCorrect": [boolean],
      "feedback": {
        "correctness": "[feedback on answer accuracy]",
        "pronunciation": "[feedback on speech clarity]",
        "speed": "[feedback on response time]",
        "overall": "[general performance feedback]"
      },
      "correctAnswer": "[the most appropriate answer from expected answers]",
      "suggestions": "[improvement tips]",
      "responseTimeCategory": "[excellent/good/needs improvement]"
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

      // Simple fallback evaluation
      const isCorrect = expectedAnswers.some((answer: string) =>
        userResponse.toLowerCase().includes(answer.toLowerCase())
      );

      evaluationData = {
        overallScore: isCorrect ? 85 : 40,
        scores: {
          correctness: isCorrect ? 90 : 30,
          pronunciation: 75,
          speed: responseTime <= 5 ? 90 : 60,
        },
        isCorrect: isCorrect,
        feedback: {
          correctness: isCorrect ? "Correct answer!" : "Not quite right.",
          pronunciation: "Response was clear.",
          speed:
            responseTime <= 5
              ? "Good response time!"
              : "Try to respond more quickly.",
          overall: isCorrect ? "Well done!" : "Keep practicing!",
        },
        correctAnswer: expectedAnswers[0],
        suggestions: "Practice more quick responses to improve speed.",
        responseTimeCategory:
          responseTime <= 3
            ? "excellent"
            : responseTime <= 5
            ? "good"
            : "needs improvement",
      };
    }

    return NextResponse.json({
      success: true,
      ...evaluationData,
    });
  } catch (error) {
    console.error("Error evaluating listening response:", error);
    return NextResponse.json(
      { error: "Failed to evaluate listening response" },
      { status: 500 }
    );
  }
}
