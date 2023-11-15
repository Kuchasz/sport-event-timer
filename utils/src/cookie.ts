export const parseCookies = (cookieString: string): Record<string, string> => {
    return Object.fromEntries(cookieString.split(";").map(cookie => cookie.trim().split("=")));
};
