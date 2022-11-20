import { LoginResult, UserCredentials } from "@set/utils/dist";

export const logIn = (_: Omit<UserCredentials, "password">): Promise<LoginResult> =>
    Promise.resolve({ authToken: "##############", expireDate: 999999999999999999999, issuedAt: 99999999999999999 });
