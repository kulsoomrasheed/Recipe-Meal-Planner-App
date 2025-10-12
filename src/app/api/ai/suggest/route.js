import OpenAI from "openai";
import { NextResponse } from "next/server";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request) {
  try {
    const { ingredients } = await request.json();

    if (!ingredients || !Array.isArray(ingredients)) {
      return NextResponse.json(
        { error: "ingredients[] is required" },
        { status: 400 }
      );
    }

    const prompt = `
      You are a recipe assistant. Suggest 3 meal ideas using these ingredients:
      ${ingredients.join(", ")}.
      For each recipe, return:
      - title
      - short description
      - list of ingredients
      - estimated cooking time
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini", 
      messages: [{ role: "user", content: prompt }],
      max_tokens: 500,
    });

    const aiText = response.choices[0].message.content;

    return NextResponse.json({ suggestions: aiText }, { status: 200 });
  } catch (error) {
    console.error("AI error:", error);
    return NextResponse.json(
      { error: "Failed to generate suggestions" },
      { status: 500 }
    );
  }
}
