import { env } from "src/env";
import { RegisterPage } from "./register";
import { redirect } from "next/navigation";
import { loginPageUrl } from "src/auth";

export default function () {
    if (!env.USER_REGISTRATION_ENABLED) redirect(loginPageUrl);

    return <RegisterPage />;
}
