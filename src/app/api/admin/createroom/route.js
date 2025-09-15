import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// POST /api/createroom
export async function POST(req) {
    try {
        const body = await req.json();

        const room = await prisma.room.create({
            data: {
                currentQuestionIndex: body.currentQuestionIndex ?? 0,
            },
            include: {
                questions: true,
                feedbacks: true,
            },
        });

        return NextResponse.json(room, { status: 201 });
    } catch (err) {
        console.error("Create Room Error:", err);
        return NextResponse.json(
            { error: err.message || "Something went wrong" },
            { status: 500 }
        );
    }
}
