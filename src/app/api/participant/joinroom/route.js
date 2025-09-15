import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";

export async function POST(req) {
    try {
        const body = await req.json();
        const { roomId, password, teamName } = body;

        if (!roomId || !password || !teamName) {
            return NextResponse.json(
                { error: "roomId, password, and teamName are required" },
                { status: 400 }
            );
        }

        // 1. Find room
        const room = await prisma.room.findUnique({
            where: { id: roomId },
        });

        if (!room) {
            return NextResponse.json({ error: "Room not found" }, { status: 404 });
        }

        // 2. Check password
        if (room.password !== password) {
            return NextResponse.json({ error: "Invalid password" }, { status: 401 });
        }

        // 3. Register team (optional: only if teams are stored)
        let team = await prisma.team.findFirst({
            where: {
                name: teamName,
                roomId: room.id,
            },
        });

        if (!team) {
            team = await prisma.team.create({
                data: {
                    name: teamName,
                    roomId: room.id,
                },
            });
        }

        return NextResponse.json(
            { message: "Joined successfully", room, team },
            { status: 200 }
        );
    } catch (err) {
        console.error("Join Room Error:", err);
        return NextResponse.json(
            { error: err.message || "Something went wrong" },
            { status: 500 }
        );
    }
}
