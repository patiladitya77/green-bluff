import { prisma } from "../../../../lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        const { roomId, questionId, teamName, answerGiven } = await req.json();

        if (!roomId || !questionId || !teamName || !answerGiven) {
            return NextResponse.json({ error: "Missing fields" }, { status: 400 });
        }

        // Find or create team
        let team = await prisma.team.findFirst({
            where: { name: teamName, roomId: parseInt(roomId) },
        });

        if (!team) {
            team = await prisma.team.create({
                data: { name: teamName, roomId: parseInt(roomId) },
            });
        }

        // Create feedback — only pass fields that exist in Feedback
        const feedback = await prisma.feedback.create({
            data: {
                roomId: parseInt(roomId),
                questionId: parseInt(questionId),
                teamId: team.id,
                answerGiven,
            },
        });

        return NextResponse.json(feedback, { status: 201 });
    } catch (err) {
        console.error("SubmitAnswer API Error:", err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
