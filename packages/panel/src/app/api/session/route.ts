import { notFound } from "next/navigation";
import { type NextRequest, NextResponse } from "next/server";
import { db } from "src/server/db";

export async function POST(request: NextRequest) {
    const { ip } = request;

    if (ip) return notFound();

    const { sessionId } = await request.json();

    const session = await db.session.findUnique({ where: { id: sessionId }, include: { user: true } });

    return NextResponse.json({
        sessionId: session?.id,
        name: session?.user.name,
        email: session?.user.email,
    });
}
