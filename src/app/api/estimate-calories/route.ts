import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY ?? "");

export async function POST(req: Request) {
  let body: { description?: string } = {};
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const description = String(body.description ?? "").trim();
  if (!description) {
    return NextResponse.json({ error: "Description is required" }, { status: 400 });
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `Estimate the total calories for this food description. Return ONLY a JSON object with the following structure:
{
  "calories": number,
  "breakdown": [{"item": string, "calories": number}],
  "confidence": "high" | "medium" | "low"
}

Food description: "${description}"`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    let parsed: { calories: number; breakdown: Array<{ item: string; calories: number }>; confidence: string };
    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsed = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("No JSON found in response");
      }
    } catch {
      return NextResponse.json({ error: "Failed to parse LLM response" }, { status: 500 });
    }

    if (!Number.isFinite(parsed.calories) || parsed.calories < 0) {
      return NextResponse.json({ error: "Invalid calories estimate" }, { status: 500 });
    }

    return NextResponse.json({
      calories: Math.round(parsed.calories),
      breakdown: parsed.breakdown ?? [],
      confidence: parsed.confidence ?? "medium",
    });
  } catch (err) {
    console.error("Gemini error:", err);
    return NextResponse.json({ error: "Failed to estimate calories" }, { status: 500 });
  }
}