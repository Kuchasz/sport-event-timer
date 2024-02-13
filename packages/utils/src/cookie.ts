export const parseCookies = (cookieString: string): Record<string, string> =>
    Object.fromEntries(cookieString.split(";").map(cookie => cookie.trim().split("="))) as Record<string, string>;
