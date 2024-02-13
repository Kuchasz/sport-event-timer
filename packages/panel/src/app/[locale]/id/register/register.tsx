"use client";

import { Button } from "src/components/button";
import { PoorInput } from "src/components/poor-input";
import { Form, SmallFormInput } from "src/form";
import { registrationSchema, type UserRegistration } from "src/modules/user/models";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { trpc } from "src/trpc-core";

export function RegisterPage() {
    const t = useTranslations();
    const registerMutation = trpc.user.register.useMutation();
    const router = useRouter();

    const initialForm = {
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    };

    const onResolve = async (data: UserRegistration) => {
        const result = await registerMutation.mutateAsync({ ...data });
        if (result.status === "Success") {
            const searchParams = new URLSearchParams({ email: data.email });
            router.push(`/id/login?${searchParams.toString()}`);
        }
    };

    return (
        <div className="flex w-full flex-col space-y-8 p-6">
            <h1 className="text-3xl font-semibold leading-tight tracking-tight text-gray-900">{t("auth.register.header")}</h1>
            <Form<UserRegistration> initialValues={initialForm} validationSchema={registrationSchema} onSubmit={onResolve}>
                <div className="flex flex-col">
                    <SmallFormInput<UserRegistration, "name">
                        label={t("auth.registration.form.name.label")}
                        render={({ value, onChange }) => (
                            <PoorInput placeholder={t("auth.registration.form.name.placeholder")} value={value} onChange={onChange} />
                        )}
                        name="name"
                    />
                    <SmallFormInput<UserRegistration, "email">
                        label={t("auth.registration.form.email.label")}
                        render={({ value, onChange }) => (
                            <PoorInput placeholder={t("auth.registration.form.email.placeholder")} value={value} onChange={onChange} />
                        )}
                        name="email"
                    />
                    <SmallFormInput<UserRegistration, "password">
                        label={t("auth.registration.form.password.label")}
                        render={({ value, onChange }) => (
                            <PoorInput
                                placeholder={t("auth.registration.form.password.placeholder")}
                                value={value}
                                onChange={onChange}
                                password
                            />
                        )}
                        name="password"
                    />
                    <SmallFormInput<UserRegistration, "confirmPassword">
                        label={t("auth.registration.form.confirmPassword.label")}
                        render={({ value, onChange }) => (
                            <PoorInput
                                placeholder={t("auth.registration.form.confirmPassword.placeholder")}
                                value={value}
                                onChange={onChange}
                                password
                            />
                        )}
                        name="confirmPassword"
                    />
                    <Button className="mt-4 w-full" loading={registerMutation.isLoading} type="submit">
                        {t("auth.registration.form.submit")}
                    </Button>
                </div>
            </Form>
            <div className="self-center text-sm">
                <span>{t("auth.registration.login.question")}</span>{" "}
                <Link className="font-bold transition-colors hover:text-blue-500" href="/id/login">
                    {t("auth.registration.login.button")}
                </Link>
            </div>
        </div>
    );
}
