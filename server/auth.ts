import * as jwt from "../core/jwt";
import { auth } from "../config";
import { NextFunction, Request, Response } from "express";

const admin_username = "admin"; //process.env.ADMIN_USER;
const admin_password = "admin"; //process.env.ADMIN_PASSWORD;

type UserCredentials = { username: string; password: string };

const validateCredentials = (username: string, password: string) =>
    username === admin_username && password === admin_password;

export const login = async ({ username, password }: UserCredentials) => {
    if (validateCredentials(username, password)) {
        const encodedToken = await jwt.sign({ username }, auth.secretKey, {
            expiresIn: auth.maxAge
        });
        const decoded = jwt.decode(encodedToken, { json: true });
        return { encodedToken, iat: Number(decoded!.iat), exp: Number(decoded!.exp) };
    } else {
        return Promise.reject("Invalid credentials");
    }
};

export const verify = async (req: Request, res: Response, next: NextFunction) => {
    let accessToken: string = req.cookies[auth.cookieName];

    if (!accessToken) {
        return res.status(403).send();
    }

    let payload;

    try {
        payload = await jwt.verify(accessToken, auth.secretKey);
        next();
    } catch (e) {
        //if an error occured return request unauthorized error
        console.log(e);
        return res.status(401).send();
    }
};
