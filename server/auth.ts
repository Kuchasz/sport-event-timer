import * as jwt from "./jwt";
import { config } from "./config";
import { NextFunction, Request, Response } from "express";
import { UserCredentials } from "@set/shared/dist";

const admin_password = config.auth.password;

const validateCredentials = (login: string, password: string) => login.length >= 3 && password === admin_password;

export const login = async ({ login, password }: UserCredentials) => {
    if (validateCredentials(login, password)) {
        const encodedToken = await jwt.sign({ login }, config.auth.secretKey, {
            expiresIn: config.auth.maxAge
        });
        const decoded = jwt.decode(encodedToken, { json: true });
        return { encodedToken, iat: Number(decoded!.iat), exp: Number(decoded!.exp) };
    } else {
        return Promise.reject("Invalid credentials");
    }
};

export const verify = async (req: Request, res: Response, next: NextFunction) => {
    let accessToken: string = req.cookies[config.auth.cookieName];

    if (!accessToken) {
        return res.status(403).send();
    }

    let payload;

    try {
        payload = await jwt.verify(accessToken, config.auth.secretKey);
        next();
    } catch (e) {
        //if an error occured return request unauthorized error
        console.log(e);
        return res.status(401).send();
    }
};
