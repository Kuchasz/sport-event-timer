import React from "react";
import { type ZodEffects, type ZodObject, type ZodType } from "zod";

export type FormErrors<TItem> = { [k in keyof TItem]: string[] | undefined };

export type FormStateProps<TItem> = {
    initialValues: TItem;
    onSubmit: (values: TItem) => void;
    validationSchema: ZodObject<Record<string, ZodType<any, any>>> | ZodEffects<ZodObject<Record<string, ZodType<any, any>>>>;
};

export const useForm = <TItem,>({ initialValues, onSubmit, validationSchema }: FormStateProps<TItem>) => {
    const [formValues, setFormValues] = React.useState<TItem>(initialValues);
    const [formErrors, setFormErrors] = React.useState<FormErrors<TItem>>({} as FormErrors<TItem>);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const validationResult = validationSchema.safeParse(formValues);
        if (!validationResult.success) {
            setFormErrors(validationResult.error.flatten().fieldErrors as FormErrors<TItem>);
        } else {
            if (!validationResult.error) setFormErrors({} as FormErrors<TItem>);
            onSubmit(formValues);
        }
    };

    const handleChange = (name: string, value: string | number | Date) => {
        setFormValues(prevValues => ({ ...prevValues, [name]: value }));
    };

    return {
        formValues,
        formErrors,
        handleSubmit,
        handleChange,
    };
};
