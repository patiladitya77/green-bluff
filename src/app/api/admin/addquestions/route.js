import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";

export async function POST(req) {
    try {
        const body = await req.json();
        const { roomId, question, options, correctAnswer } = body;


        if (!roomId || !question || !options || !correctAnswer) {
            return NextResponse.json({ error: "Missing fields" }, { status: 400 });
        }

        const newQuestion = await prisma.question.create({
            data: {
                question,
                options,
                correctAnswer,
                room: {
                    connect: { id: roomId },
                },
            },
        });

        return NextResponse.json(newQuestion, { status: 201 });
    } catch (err) {
        console.error("AddQuestion API Error:", err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
