// app/api/admin/getroomdata/route.js
import { prisma } from "../../../../lib/prisma";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const roomId = parseInt(searchParams.get("roomId"));

    if (!roomId) {
      return new Response(JSON.stringify({ error: "Missing roomId" }), {
        status: 400,
      });
    }

    // Fetch questions along with team responses
    const questions = await prisma.question.findMany({
      where: { roomId },
      orderBy: { createdAt: "asc" },
      include: {
        feedbacks: {
          include: {
            team: { select: { name: true } },
          },
        },
      },
    });

    // Format data for easier rendering
    const formatted = questions.map((q) => ({
      id: q.id,
      question: q.question,
      responses: q.feedbacks.map((f) => ({
        teamName: f.team.name,
        answerGiven: f.answerGiven,
      })),
    }));

    return new Response(JSON.stringify(formatted), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
    });
  }
}
