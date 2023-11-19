"use client";

import { Button } from "components/button";
import { PoorInput } from "components/poor-input";
import { Form, FormInput } from "form";
import { useTranslations } from "next-intl";
import { z } from "zod";

const loginSchema = z.object({
    email: z.string().email().nonempty(),
    password: z.string().nonempty(),
});

type Login = z.infer<typeof loginSchema>;

export default function SignIn() {
    const t = useTranslations();

    const initialForm = {
        email: "",
        password: "",
    };

    const isLoading = false;

    const onResolve = () => {};

    return (
        <div className="grid h-full w-full grid-cols-2">
            <section className="flex h-full flex-col items-center justify-center">
                <div className="w-full max-w-sm space-y-4 p-6">
                    <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl">Welcome!</h1>
                    <div className="space-y-4 md:space-y-6">
                        <Form<Login> initialValues={initialForm} validationSchema={loginSchema} onSubmit={onResolve}>
                            <div className="flex flex-col">
                                <FormInput<Login, "email">
                                    label={t("pages.races.form.name.label")}
                                    className="flex-1"
                                    render={({ value, onChange }) => (
                                        <PoorInput placeholder={t("pages.races.form.name.placeholder")} value={value} onChange={onChange} />
                                    )}
                                    name="email"
                                />
                                <div className="p-2"></div>
                                <FormInput<Login, "password">
                                    label={t("pages.races.form.date.label")}
                                    className="flex-1"
                                    render={({ value, onChange }) => (
                                        <PoorInput placeholder={t("pages.races.form.name.placeholder")} value={value} onChange={onChange} />
                                    )}
                                    name="password"
                                />

                                <Button className="mt-4 w-full" loading={isLoading} type="submit">
                                    {t("shared.save")}
                                </Button>
                            </div>
                        </Form>
                    </div>
                </div>
            </section>
            <section className="p-2">
                <div className="relative flex h-full items-end overflow-hidden rounded-xl bg-blue-900">
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
