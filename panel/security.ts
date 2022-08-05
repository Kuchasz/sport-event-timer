export const isLoggedIn = (expireDate?: number) => {
    if (expireDate === null) return false;
    return Date.now() < Number(expireDate);
};
