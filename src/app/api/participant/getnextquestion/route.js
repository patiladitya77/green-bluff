import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";

export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const roomId = parseInt(searchParams.get("roomId"));
        const index = parseInt(searchParams.get("index"));

        if (isNaN(roomId) || isNaN(index)) {
            return NextResponse.json({ error: "Invalid roomId or index" }, { status: 400 });
        }

        const room = await prisma.room.findUnique({
            where: { id: roomId },
            include: { questions: true },
        });

        if (!room) {
            return NextResponse.json({ error: "Room not found" }, { status: 404 });
        }

        const nextQuestion = room.questions[index];

        if (!nextQuestion) {
            return NextResponse.json({ error: "No question at this index" }, { status: 404 });
        }

        return NextResponse.json(nextQuestion);
    } catch (err) {
        console.error("GetNextQuestion API Error:", err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
