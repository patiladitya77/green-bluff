import { prisma } from "../../../../lib/prisma";

import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        const body = await req.json();
        const { roomId, questionId, teamName, answerGiven } = body;

        if (!roomId || !questionId || !teamName || !answerGiven) {
            return NextResponse.json({ error: "Missing fields" }, { status: 400 });
        }

        const feedback = await prisma.feedback.create({
            data: {
                roomId,
                questionId,
                teamName,
                answerGiven,
            },
        });

        return NextResponse.json(feedback, { status: 201 });
    } catch (err) {
        console.error("SubmitAnswer API Error:", err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
