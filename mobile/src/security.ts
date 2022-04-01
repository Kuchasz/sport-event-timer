const localStorageExpiryDateKey = "session.id.expire.date";
const localStorageUserKey = "session.id.user";

export const isLoggedIn = () => {
    const expireDate = localStorage.getItem(localStorageExpiryDateKey);
    if (expireDate === null) return false;
    return Date.now() < Number(expireDate);
};

export const getUser = () => localStorage.getItem(localStorageUserKey) || "";

export const setLogIn = (expiryDate: number, user: string) => {
    localStorage.setItem(localStorageExpiryDateKey, expiryDate.toString());
    localStorage.setItem(localStorageUserKey, user);
};

export const setLogOut = () => localStorage.removeItem(localStorageExpiryDateKey);
