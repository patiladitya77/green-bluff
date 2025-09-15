// app/api/admin/getroomresponses/route.js
import { prisma } from "../../../../lib/prisma";

export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const roomId = parseInt(searchParams.get("roomId"));

        if (!roomId) return new Response(JSON.stringify({ error: "Missing roomId" }), { status: 400 });

        const responses = await prisma.feedback.findMany({
            where: { roomId },
            select: {
                id: true,
                team: { select: { name: true } },
                answerGiven: true,
                questionId: true,
            },
        });

        // Map team object to teamName for easier rendering
        const formatted = responses.map(r => ({
            id: r.id,
            teamName: r.team.name,
            answerGiven: r.answerGiven,
            questionId: r.questionId,
        }));

        return new Response(JSON.stringify(formatted), { status: 200 });
    } catch (err) {
        console.error(err);
        return new Response(JSON.stringify({ error: err.message }), { status: 500 });
    }
}
