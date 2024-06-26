"use client";

import { PoorButton } from "src/components/poor-button";
import { PoorInput } from "src/components/poor-input";
import { Form, SmallFormInput } from "src/components/form";
import { loginSchema, type UserLogin } from "src/modules/user/models";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useContext } from "react";
import { trpc } from "src/trpc-core";
import { RegistrationStateContext } from "../registration-state-provider";

export default function ({ searchParams }: { searchParams: { email?: string } }) {
    const t = useTranslations();
    const loginMutation = trpc.user.login.useMutation();
    const router = useRouter();

    const initialForm = {
        email: searchParams?.email ?? "",
        password: "",
    };

    const registrationEnabled = useContext(RegistrationStateContext);

    const onResolve = async (data: UserLogin) => {
        const result = await loginMutation.mutateAsync({ ...data });
        if (result.status === "Success") router.push("/");
    };

    return (
        <div className="flex w-full flex-col space-y-8 p-6">
            <h1 className="text-3xl font-semibold leading-tight tracking-tight text-gray-900">{t("auth.login.header")}</h1>
            <Form<UserLogin> initialValues={initialForm} validationSchema={loginSchema} onSubmit={onResolve}>
                <div className="flex flex-col">
                    <SmallFormInput<UserLogin, "email">
                        label={t("auth.login.form.email.label")}
                        render={({ value, onChange }) => (
                            <PoorInput placeholder={t("auth.login.form.email.placeholder")} value={value} onChange={onChange} />
                        )}
                        name="email"
                    />
                    <SmallFormInput<UserLogin, "password">
                        label={t("auth.login.form.password.label")}
                        render={({ value, onChange }) => (
                            <PoorInput placeholder={t("auth.login.form.password.placeholder")} value={value} onChange={onChange} password />
                        )}
                        name="password"
                    />
                    <PoorButton className="mt-4 w-full" loading={loginMutation.isPending} type="submit">
                        {t("auth.login.form.submit")}
                    </PoorButton>
                </div>
            </Form>
            {registrationEnabled && (
                <div className="self-center text-sm">
                    <span>{t("auth.login.registration.question")}</span>{" "}
                    <Link className="font-bold transition-colors hover:text-blue-500" href="/id/register">
                        {t("auth.login.registration.button")}
                    </Link>
                </div>
            )}
        </div>
    );
}
