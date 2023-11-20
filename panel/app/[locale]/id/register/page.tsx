"use client";

import { Button } from "components/button";
import { PoorInput } from "components/poor-input";
import { Form, FormInput } from "form";
import { registrationSchema, type UserRegistration } from "modules/user/models";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { trpc } from "trpc-core";

export default function () {
    const t = useTranslations();
    const loginMutation = trpc.user.login.useMutation();
    const router = useRouter();

    const initialForm = {
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    };

    const onResolve = async (data: UserRegistration) => {
        const result = await loginMutation.mutateAsync({ ...data });
        if (result.status === "Success") router.push("/");
    };

    return (
        <div className="flex w-full flex-col space-y-8 p-6">
            <h1 className="text-3xl font-semibold leading-tight tracking-tight text-gray-900">{t("auth.register.header")}</h1>
            <Form<UserRegistration> initialValues={initialForm} validationSchema={registrationSchema} onSubmit={onResolve}>
                <div className="flex flex-col">
                    <FormInput<UserRegistration, "name">
                        label={t("auth.registration.form.email.label")}
                        render={({ value, onChange }) => (
                            <PoorInput placeholder={t("auth.registration.form.email.placeholder")} value={value} onChange={onChange} />
                        )}
                        name="name"
                    />
                    <div className="p-1"></div>
                    <FormInput<UserRegistration, "email">
                        label={t("auth.registration.form.email.label")}
                        render={({ value, onChange }) => (
                            <PoorInput placeholder={t("auth.registration.form.email.placeholder")} value={value} onChange={onChange} />
                        )}
                        name="email"
                    />
                    <div className="p-1"></div>
                    <FormInput<UserRegistration, "password">
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
                    <div className="p-1"></div>
                    <FormInput<UserRegistration, "confirmPassword">
                        label={t("auth.registration.form.password.label")}
                        render={({ value, onChange }) => (
                            <PoorInput
                                placeholder={t("auth.registration.form.password.placeholder")}
                                value={value}
                                onChange={onChange}
                                password
                            />
                        )}
                        name="confirmPassword"
                    />

                    <Button className="mt-4 w-full" loading={loginMutation.isLoading} type="submit">
                        {t("auth.registration.form.submit")}
                    </Button>
                </div>
            </Form>
            <div className="self-center text-sm">
                <span>{t("auth.registration.login.question")}</span>{" "}
                <Link className="font-bold transition-colors hover:text-blue-500" href="#">
                    {t("auth.registration.login.button")}
                </Link>
            </div>
        </div>
    );
}
