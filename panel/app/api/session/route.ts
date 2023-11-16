import { getServerSession } from "../../../auth/index";
import { NextResponse } from "next/server";

export async function GET(_request: Request) {
    const session = await getServerSession();

    if (!session) {
        return new NextResponse(JSON.stringify({ status: "fail", message: "You are not logged in" }), { status: 401 });
    }

    return NextResponse.json({
        authenticated: !!session,
        session,
    });
}
