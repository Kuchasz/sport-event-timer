import { LoginResult, UserCredentials } from "@set/shared/dist";

export const logIn = (_: UserCredentials): Promise<LoginResult> =>
    Promise.resolve({ authToken: "awwdawd", expireDate: 999999999999999999999, issuedAt: 99999999999999999 });
