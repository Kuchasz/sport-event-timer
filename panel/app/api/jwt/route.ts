import { parseCookies } from "@set/utils/dist/cookie";

export function GET(request: Request) {
    return Response.json({ cookie: parseCookies(request.headers.get("cookie")!) });
}
