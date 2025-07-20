import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY!);

export async function POST(request: NextRequest) {
  try {
    const { difficulty = "medium", category = "general" } =
      await request.json();

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

    // Add randomness factors
    const timestamp = Date.now();
    const randomSeed = Math.floor(Math.random() * 10000);
    const sessionId = Math.random().toString(36).substring(7);

    // Create more varied question types based on category
    const categoryExamples = {
      general: [
        "What is the opposite of hot?",
        "Name something you wear on your head.",
        "What do you use to write?",
        "Where do fish live?",
        "What comes after Wednesday?",
      ],
      opposites: [
        "What is the opposite of big?",
        "What is the opposite of fast?",
        "What is the opposite of happy?",
        "What is the opposite of light?",
        "What is the opposite of old?",
      ],
      colors: [
        "What color do you get when you mix red and blue?",
        "What color is the sun?",
        "Name a color that starts with G.",
        "What color is grass?",
        "What color are most clouds?",
      ],
      animals: [
        "What animal says 'moo'?",
        "Name an animal with stripes.",
        "What animal is known as man's best friend?",
        "Name a bird that can't fly.",
        "What animal has a trunk?",
      ],
      numbers: [
        "How many days are in a week?",
        "What comes after nine?",
        "How many fingers do you have?",
        "What is five plus three?",
        "How many legs does a spider have?",
      ],
      food: [
        "Name a red fruit.",
        "What do you drink in the morning?",
        "Name something sweet.",
        "What do bees make?",
        "Name a vegetable that is orange.",
      ],
      time: [
        "What comes after Monday?",
        "How many hours are in a day?",
        "What season comes after winter?",
        "What do you say in the morning?",
        "Name a month with 31 days.",
      ],
      weather: [
        "What falls from the sky when it's cold?",
        "What do you see during a storm?",
        "What makes things wet outside?",
        "What is very hot and bright in the sky?",
        "What do you use when it rains?",
      ],
      synonyms: [
        "What is another word for happy?",
        "What is another word for big?",
        "What is another word for fast?",
        "What is another word for smart?",
        "What is another word for pretty?",
      ],
    };

    const exampleQuestions =
      categoryExamples[category as keyof typeof categoryExamples] ||
      categoryExamples.general;

    const prompt = `
    Generate a NEW and UNIQUE listening & speaking question for PTE-Styled English practice.
    
    IMPORTANT: Create a DIFFERENT question each time. Do NOT repeat previous questions.
    
    Requirements:
    - Difficulty: ${difficulty}
    - Category: ${category}
    - Question should be SHORT and CLEAR (max 15 words)
    - Should be answerable in 1-3 words
    - Focus on: vocabulary, opposites, basic knowledge, quick thinking
    - Make it suitable for text-to-speech
    - BE CREATIVE and VARY the question structure
    
    Random seed: ${randomSeed}
    Session: ${sessionId}
    Timestamp: ${timestamp}
    
    Example patterns (but create something NEW):
    ${exampleQuestions
      .slice(0, 3)
      .map((q) => `- "${q}"`)
      .join("\n")}
    
    Question types to vary:
    - "What is the opposite of [word]?"
    - "Name a [category] that is [adjective]."
    - "What comes after [item]?"
    - "How many [things] does a [noun] have?"
    - "What do you [action] with [object]?"
    - "Where do [things] [verb]?"
    - "What [verb] when [condition]?"
    
    Respond with JSON only:
    {
      "question": "[NEW, creative, short question - DIFFERENT from examples]",
      "expectedAnswers": [array of possible correct answers],
      "category": "${category}",
      "difficulty": "${difficulty}",
      "hint": "[optional hint for user]"
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

    let questionData;
    try {
      questionData = JSON.parse(jsonString);
    } catch (parseError) {
      console.error("JSON Parse Error:", parseError);

      // Create a more random fallback question
      const fallbackQuestions = [
        {
          question: "What is the opposite of cold?",
          expectedAnswers: ["hot", "warm"],
          hint: "Think of temperature",
        },
        {
          question: "Name something you eat for breakfast.",
          expectedAnswers: ["cereal", "toast", "eggs", "pancakes"],
          hint: "Morning meal",
        },
        {
          question: "What color is an apple?",
          expectedAnswers: ["red", "green", "yellow"],
          hint: "Common fruit colors",
        },
        {
          question: "How many wheels does a car have?",
          expectedAnswers: ["four", "4"],
          hint: "Count them",
        },
        {
          question: "What do you use to cut paper?",
          expectedAnswers: ["scissors", "knife"],
          hint: "Sharp tool",
        },
      ];

      const randomFallback =
        fallbackQuestions[randomSeed % fallbackQuestions.length];

      questionData = {
        ...randomFallback,
        category: category,
        difficulty: difficulty,
      };
    }

    return NextResponse.json({
      success: true,
      ...questionData,
      timestamp: new Date().toISOString(),
      sessionId: sessionId,
    });
  } catch (error) {
    console.error("Error generating listening question:", error);
    return NextResponse.json(
      { error: "Failed to generate listening question" },
      { status: 500 }
    );
  }
}
