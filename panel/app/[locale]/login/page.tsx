"use client";

import { mdiEmailOutline } from "@mdi/js";
import Icon from "@mdi/react";
import { getCurrentYear } from "@set/utils/dist/datetime";
import { Button } from "components/button";
import { PoorInput } from "components/poor-input";
import { Form, FormInput } from "form";
import { type Login, loginSchema } from "modules/user/models";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { trpc } from "trpc-core";

export default function SignIn() {
    const t = useTranslations();
    const loginMutation = trpc.user.login.useMutation();

    const initialForm = {
        email: "",
        password: "",
    };

    const onResolve = async (data: Login) => {
        const result = await loginMutation.mutateAsync({ ...data });
        alert(JSON.stringify(result));
    };

    return (
        <div className="grid h-full w-full grid-cols-2">
            <section className="flex h-full flex-col items-center justify-center">
                <div className="flex w-full max-w-sm flex-grow flex-col items-center justify-center">
                    <div className="flex w-full flex-col space-y-8 p-6">
                        <h1 className="text-3xl font-semibold leading-tight tracking-tight text-gray-900">{t("auth.login.header")}</h1>
                        <Form<Login> initialValues={initialForm} validationSchema={loginSchema} onSubmit={onResolve}>
                            <div className="flex flex-col">
                                <FormInput<Login, "email">
                                    label={t("auth.login.form.email.label")}
                                    render={({ value, onChange }) => (
                                        <PoorInput placeholder={t("auth.login.form.email.placeholder")} value={value} onChange={onChange} />
                                    )}
                                    name="email"
                                />
                                <div className="p-1"></div>
                                <FormInput<Login, "password">
                                    label={t("auth.login.form.password.label")}
                                    render={({ value, onChange }) => (
                                        <PoorInput
                                            placeholder={t("auth.login.form.password.placeholder")}
                                            value={value}
                                            onChange={onChange}
                                            password
                                        />
                                    )}
                                    name="password"
                                />

                                <Button className="mt-4 w-full" loading={loginMutation.isLoading} type="submit">
                                    {t("auth.login.form.submit")}
                                </Button>
                            </div>
                        </Form>
                        <div className="self-center text-sm">
                            <span>{t("auth.login.registration.question")}</span>{" "}
                            <Link className="font-bold transition-colors hover:text-blue-500" href="#">
                                {t("auth.login.registration.signup")}
                            </Link>
                        </div>
                    </div>
                </div>
                <div className="mb-4 flex w-full items-center justify-between px-4 text-xs text-gray-500">
                    <span>
                        © {getCurrentYear()} {t("auth.rights")}
                    </span>
                    <span className="flex items-center">
                        <Icon path={mdiEmailOutline} size={0.6} />
                        <span className="ml-1">help@example.com</span>
                    </span>
                </div>
            </section>
            <section className="p-2">
                <div className="relative flex h-full items-end justify-end overflow-hidden rounded-xl bg-blue-900">
                    <img
                        className="absolute top-0 h-full w-full object-cover"
                        src="https://ps-wed.azurewebsites.net/rura/meta-2023/big/PF7B9152.jpg"
                    ></img>
                    <div className="absolute top-0 h-full w-full bg-gradient-to-t from-black to-transparent"></div>
                    <div className="relative">
                        <img className="m-4" src="/assets/logo_ravelo.png" />
                    </div>
                </div>
            </section>
        </div>
    );
}
