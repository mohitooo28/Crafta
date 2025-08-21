import { GenAiCode } from "@/configs/AiModel";
import { NextResponse } from "next/server";

export async function POST(req) {
  const { prompt } = await req.json();

  try {
    const result = await GenAiCode.generateContent(prompt);
    const resp = result.response.text();
    return NextResponse.json(JSON.parse(resp));
  } catch (e) {
    console.error("AI Code Generation Error:", e);
    return NextResponse.json(
      {
        error: e.message || "Something went wrong",
      },
      { status: 500 }
    );
  }
}
