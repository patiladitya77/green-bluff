// pages/api/teams.js (or app/api/teams/route.js in App Router)
import { prisma } from "../../../../lib/prisma";


export async function POST(req) {
    try {
        const body = await req.json();
        const { teamName, roomId } = body;

        if (!teamName || !roomId) {
            return new Response(JSON.stringify({ error: "Missing fields" }), { status: 400 });
        }

        // Check if team already exists
        let team = await prisma.team.findFirst({
            where: { name: teamName, roomId: parseInt(roomId) },
        });

        if (!team) {
            // Create new team
            team = await prisma.team.create({
                data: { name: teamName, roomId: parseInt(roomId) },
            });
        }

        return new Response(JSON.stringify(team), { status: 200 });
    } catch (err) {
        console.error(err);
        return new Response(JSON.stringify({ error: err.message }), { status: 500 });
    }
}

