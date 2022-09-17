import { LoginResult, UserCredentials } from "@set/utils/dist";

export const logIn = (_: UserCredentials): Promise<LoginResult> =>
    Promise.resolve({ authToken: "awwdawd", expireDate: 999999999999999999999, issuedAt: 99999999999999999 });
