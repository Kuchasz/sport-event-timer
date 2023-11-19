import { type NextRequest, NextResponse } from "next/server";
import { db } from "server/db";

export async function POST(request: NextRequest) {
    // const session = await getServerSession();

    const { sessionId } = await request.json();
    console.log("SESSSION_ID!!", sessionId);
    // if (!session) {
    //     return new NextResponse(JSON.stringify({ status: "fail", message: "You are not logged in" }), { status: 401 });
    // }

    const session = await db.session.findUnique({ where: { id: sessionId }, include: { user: true } }); //sessions[sessionId];

    // return session?.valid ? session : null;

    return NextResponse.json(session);
}
