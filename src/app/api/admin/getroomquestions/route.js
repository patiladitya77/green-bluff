// app/api/admin/getroomquestions/route.js
import { prisma } from "../../../../lib/prisma";

export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const roomId = parseInt(searchParams.get("roomId"));

        if (!roomId) return new Response(JSON.stringify({ error: "Missing roomId" }), { status: 400 });

        const questions = await prisma.question.findMany({
            where: { roomId },
            orderBy: { createdAt: "asc" },
        });

        return new Response(JSON.stringify(questions), { status: 200 });
    } catch (err) {
        console.error(err);
        return new Response(JSON.stringify({ error: err.message }), { status: 500 });
    }
}
