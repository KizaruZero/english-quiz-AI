import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY!);

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("image") as File;

    if (!file) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 });
    }

    // Convert file to base64
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64Data = buffer.toString("base64");

    // Use Gemini Vision model
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = `Describe this image in detail for an English language test. 
    Focus on: objects, people, actions, colors, setting, and atmosphere. 
    Keep it concise but comprehensive (2-3 sentences).`;

    const imagePart = {
      inlineData: {
        data: base64Data,
        mimeType: file.type,
      },
    };

    const result = await model.generateContent([prompt, imagePart]);
    const aiDescription = result.response.text();

    return NextResponse.json({
      success: true,
      aiDescription: aiDescription.trim(),
    });
  } catch (error) {
    console.error("Error analyzing image:", error);
    return NextResponse.json(
      { error: "Failed to analyze image" },
      { status: 500 }
    );
  }
}
