import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY!);

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const audioFile = formData.get("audio") as File;
    const originalText = formData.get("originalText") as string;
    const expectedAnswersStr = formData.get("expectedAnswers") as string;
    const responseTimeStr = formData.get("responseTime") as string;

    if (!audioFile || !originalText || !expectedAnswersStr) {
      return NextResponse.json(
        {
          error: "Audio file, original text, and expected answers are required",
        },
        { status: 400 }
      );
    }

    const expectedAnswers = JSON.parse(expectedAnswersStr);
    const responseTime = parseInt(responseTimeStr) || 0;

    // Convert audio file to base64 for Gemini
    const audioBytes = await audioFile.arrayBuffer();
    const audioBase64 = Buffer.from(audioBytes).toString("base64");

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

    const prompt = `
    Evaluate this listening & speaking response based on the audio recording:
    
    Original Question: "${originalText}"
    Expected Answers: ${JSON.stringify(expectedAnswers)}
    Response Time: ${responseTime} seconds
    
    The user has recorded their audio response to the question. Please analyze the audio and evaluate based on:
    
    1. Correctness (60%) - Is the spoken answer correct or acceptable?
    2. Pronunciation (25%) - Was the response clear and understandable?
    3. Speed (15%) - Did they respond quickly (within 5 seconds is ideal)?
    
    Consider:
    - Synonyms and alternative correct answers
    - Minor pronunciation variations
    - Context and reasonableness of answer
    - Response time (0-3 sec = excellent, 3-5 sec = good, 5+ sec = needs improvement)
    - Audio quality and clarity
    
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
      "responseTimeCategory": "[excellent/good/needs improvement]",
      "transcript": "[what was heard in the audio]"
    }
    `;

    const result = await model.generateContent([
      {
        text: prompt,
      },
      {
        inlineData: {
          mimeType: audioFile.type,
          data: audioBase64,
        },
      },
    ]);

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
      evaluationData = {
        overallScore: 70,
        scores: {
          correctness: 75,
          pronunciation: 70,
          speed: responseTime <= 5 ? 90 : 60,
        },
        isCorrect: true,
        feedback: {
          correctness: "Response received but couldn't analyze content.",
          pronunciation: "Audio quality was acceptable.",
          speed:
            responseTime <= 5
              ? "Good response time!"
              : "Try to respond more quickly.",
          overall: "Keep practicing to improve clarity!",
        },
        correctAnswer: expectedAnswers[0],
        suggestions: "Practice speaking clearly and responding quickly.",
        responseTimeCategory:
          responseTime <= 3
            ? "excellent"
            : responseTime <= 5
            ? "good"
            : "needs improvement",
        transcript: "[Could not transcribe audio]",
      };
    }

    return NextResponse.json({
      success: true,
      ...evaluationData,
    });
  } catch (error) {
    console.error("Error evaluating listening response audio:", error);
    return NextResponse.json(
      { error: "Failed to evaluate listening response audio" },
      { status: 500 }
    );
  }
}
