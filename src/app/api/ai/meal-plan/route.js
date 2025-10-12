import OpenAI from "openai";
import { NextResponse } from "next/server";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request) {
  try {
    const { days, preferences } = await request.json();

    if (!days) {
      return NextResponse.json(
        { error: "days is required" },
        { status: 400 }
      );
    }

    const prompt = `
      Create a ${days}-day meal plan.
      Preferences: ${preferences || "none"}.
      Format each day with:
      - Breakfast
      - Lunch
      - Dinner
      - Short snack suggestion
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 700,
    });

    const mealPlan = response.choices[0].message.content;

    return NextResponse.json({ mealPlan }, { status: 200 });
  } catch (error) {
    console.error("AI error:", error);
    return NextResponse.json(
      { error: "Failed to generate meal plan" },
      { status: 500 }
    );
  }
}
