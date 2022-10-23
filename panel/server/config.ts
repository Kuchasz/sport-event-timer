import { config as readEnvConfig } from "dotenv";
import { resolve } from "path";

readEnvConfig({ path: resolve("../.env") });

type Config = {
    auth: {
        cookieName: string;
        maxAge: number;
        secretKey: string;
        password: string;
    };
};

// const exampleConfig: Config = {
//     auth: {
//         cookieName: "sessionID",
//         maxAge: 600,
//         secretKey: "8c29adc2865a3633b4d5101399759b0172641de91f3b11b63249c9d70fe1ab35"
//     }
// };

const envConfig: Config = {
    auth: {
        cookieName: process.env.AUTH_COOKIE_NAME || "",
        maxAge: Number(process.env.AUTH_MAX_AGE || "0"),
        secretKey: process.env.AUTH_SECRET_KEY || "",
        password: process.env.AUTH_PASSWORD || ""
    }
};

export const config = envConfig;
