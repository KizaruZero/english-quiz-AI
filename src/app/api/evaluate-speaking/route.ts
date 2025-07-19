import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY!);

// Helper function to extract JSON from AI response (same as score-description)
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
    const formData = await request.formData();
    const audioFile = formData.get("audio") as File;
    const originalText = formData.get("originalText") as string;

    if (!audioFile || !originalText) {
      return NextResponse.json(
        { error: "Audio file and original text are required" },
        { status: 400 }
      );
    }

    // Convert audio to base64 for Gemini processing
    const bytes = await audioFile.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64Audio = buffer.toString("base64");

    console.log("Processing audio file:", {
      size: buffer.length,
      type: audioFile.type,
      name: audioFile.name,
    });

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

    // First, transcribe the audio using Gemini
    const transcriptionPrompt = `
    Please transcribe this audio recording exactly as spoken. 
    Return only the transcribed text, nothing else.
    If no clear speech is detected, return "[No speech detected]".
    If the speech is in a language other than English, transcribe it in that language.
    `;

    const audioPart = {
      inlineData: {
        data: base64Audio,
        mimeType: audioFile.type,
      },
    };

    // Get transcription from Gemini
    const transcriptionResult = await model.generateContent([
      transcriptionPrompt,
      audioPart,
    ]);
    const actualTranscript = transcriptionResult.response.text().trim();

    console.log("Transcription result:", actualTranscript);

    // Now evaluate the transcription against the original text
    const evaluationPrompt = `
    Evaluate this English speaking performance for a PTE-style reading aloud task.
    
    Original Text: "${originalText}"
    User's Spoken Text (transcribed): "${actualTranscript}"
    
    Provide scoring (1-100) for:
    1. Content (40%) - Word accuracy, how many words were read correctly
    2. Oral Fluency (35%) - Natural pace, smooth delivery, appropriate pausing
    3. Pronunciation (25%) - Clear articulation, correct sound production
    
    Consider:
    - Missing words, substitutions, insertions
    - Speaking rhythm and natural flow
    - Clear pronunciation of individual sounds
    - If the transcription shows non-English text or no speech detected, give very low scores (10-20)
    - If user spoke in different language (like Indonesian), content score should be very low
    
    Respond with ONLY valid JSON in this exact format (no markdown, no extra text):
    {
      "overallScore": [number 1-100],
      "scores": {
        "content": [number 1-100],
        "fluency": [number 1-100], 
        "pronunciation": [number 1-100]
      },
      "feedback": {
        "content": "[specific feedback on word accuracy and language used]",
        "fluency": "[feedback on speaking rhythm and flow]",
        "pronunciation": "[feedback on sound clarity]",
        "overall": "[general feedback - mention if wrong language was used]"
      },
      "suggestions": "[specific tips for improvement]",
      "mistakesFound": [array of missed or mispronounced words],
      "strengths": [array of positive aspects, if any]
    }
    `;

    const evaluationResult = await model.generateContent(evaluationPrompt);
    const response = evaluationResult.response.text();

    console.log("Raw Gemini evaluation response:", response);

    // Parse JSON response with improved error handling
    const evaluationData = extractJSON(response);

    // Validate required fields
    if (
      !evaluationData.overallScore ||
      !evaluationData.scores ||
      !evaluationData.feedback
    ) {
      throw new Error("Invalid response format from AI");
    }

    return NextResponse.json({
      success: true,
      ...evaluationData,
      audioProcessed: true,
      transcript: actualTranscript,
    });
  } catch (error) {
    console.error("Error evaluating speaking:", error);
    console.error(
      "Error details:",
      error instanceof Error ? error.message : "Unknown error"
    );
    return NextResponse.json(
      { error: "Failed to evaluate speaking" },
      { status: 500 }
    );
  }
}
