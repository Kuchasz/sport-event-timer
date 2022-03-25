import * as jwt from "./jwt";
import { config } from "./config";
import { NextFunction, Request, Response } from "express";
import { UserCredentials } from "@set/shared";

const admin_username = "admin"; //process.env.ADMIN_USER;
const admin_password = "admin"; //process.env.ADMIN_PASSWORD;

const validateCredentials = (login: string, password: string) =>
    login === admin_username && password === admin_password;

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