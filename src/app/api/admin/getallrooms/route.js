// /app/api/admin/rooms/route.js
import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";

export async function GET() {
    try {
        const rooms = await prisma.room.findMany({
            select: {
                id: true,
                name: true,
                password: true, // ⚠️ don’t expose in real apps
                createdAt: true,
            },
        });

        return NextResponse.json(rooms, { status: 200 });
    } catch (err) {
        console.error("Fetch Rooms Error:", err);
        return NextResponse.json({ error: "Failed to fetch rooms" }, { status: 500 });
    }
}
