import { config as readEnvConfig } from "dotenv";

readEnvConfig();

type Config = {
    auth: {
        cookieName: string;
        maxAge: number;
        secretKey: string;
    };
};

const exampleConfig: Config = {
    auth: {
        cookieName: "sessionID",
        maxAge: 600,
        secretKey: "8c29adc2865a3633b4d5101399759b0172641de91f3b11b63249c9d70fe1ab35"
    }
};

const envConfig: Config = {
    auth: {
        cookieName: process.env.AUTH_COOKIE_NAME,
        maxAge: Number(process.env.AUTH_MAX_AGE),
        secretKey: process.env.AUTH_SECRET_KEY
    }
};

export const config = process.env.NODE_ENV === "development" ? exampleConfig : envConfig;
