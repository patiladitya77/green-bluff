import { prisma } from "../../../../lib/prisma";
import { NextResponse } from "next/server";

export async function DELETE(req) {
    try {
        const { searchParams } = new URL(req.url);
        const roomId = parseInt(searchParams.get("roomId"));

        if (isNaN(roomId)) {
            return NextResponse.json({ message: "Invalid roomId" }, { status: 400 });
        }

        await prisma.room.delete({
            where: { id: roomId },
        });

        return NextResponse.json({ message: "Room deleted successfully" });
    } catch (err) {
        console.error("DeleteRoom API Error:", err);
        return NextResponse.json({ message: err.message }, { status: 500 });
    }
}
