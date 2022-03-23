const localStorageExpiryDateKey = "session.id.expire.date";

export const isLoggedIn = () => {
    const expireDate = localStorage.getItem(localStorageExpiryDateKey);
    if (expireDate === null) return false;
    return Date.now() < Number(expireDate);
};

export const setLogIn = (expiryDate: number) => {
    localStorage.setItem(localStorageExpiryDateKey, expiryDate.toString());
};

export const setLogOut = () => localStorage.removeItem(localStorageExpiryDateKey);
