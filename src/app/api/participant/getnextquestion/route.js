import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";

export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const roomId = parseInt(searchParams.get("roomId"));
        const teamId = parseInt(searchParams.get("teamId")); // 👈 identify team

        if (isNaN(roomId) || isNaN(teamId)) {
            return NextResponse.json(
                { error: "Missing or invalid roomId/teamId" },
                { status: 400 }
            );
        }

        // Get all questions for this room in order
        const questions = await prisma.question.findMany({
            where: { roomId },
            orderBy: { id: "asc" },
        });

        if (questions.length === 0) {
            return NextResponse.json({ error: "No questions in this room" }, { status: 404 });
        }

        // Get all questions this team has already answered
        const answered = await prisma.feedback.findMany({
            where: { roomId, teamId },
            select: { questionId: true },
        });

        const answeredIds = new Set(answered.map(f => f.questionId));

        // Find the first unanswered question
        const nextQuestion = questions.find(q => !answeredIds.has(q.id));

        if (!nextQuestion) {
            return NextResponse.json({ message: "No more questions" }, { status: 404 });
        }

        return NextResponse.json(nextQuestion, { status: 200 });
    } catch (err) {
        console.error("GetNextQuestion API Error:", err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
