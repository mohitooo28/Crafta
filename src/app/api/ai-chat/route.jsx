import { chatSession } from "@/configs/AiModel";
import { NextResponse } from "next/server";

export async function POST(req) {
  const { prompt } = await req.json();

  try {
    const AiResp = await chatSession.sendMessage(prompt);

    return NextResponse.json({
      result: AiResp,
    });
  } catch (e) {
    return NextResponse.json({
      error: e.message || "Something went wrong",
    });
  }
}
