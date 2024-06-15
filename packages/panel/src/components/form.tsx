import classNames from "classnames";
import { useTranslations } from "next-intl";
import type { HTMLProps } from "react";
import React, { createContext } from "react";
import { type FormStateProps, type FormErrors, useForm } from "../form-hook";
import { SectionHeader } from "src/components/page-headers";

type FormContextType<TItem, TKey extends keyof TItem> = {
    formValues: TItem;
    formErrors: FormErrors<TItem>;
    handleChange: (name: TKey, value: TItem[TKey]) => void;
};

const FormContext = createContext<FormContextType<any, any>>({
    formValues: {},
    formErrors: {},
    handleChange: () => {},
});

type InputProps<TItem, TKey extends keyof TItem> = {
    name: TKey;
    onChange: (e: { target: { value: TItem[TKey] } }) => void;
    value: TItem[TKey];
};

type LabelProps = HTMLProps<HTMLLabelElement>;

export const Label = ({ children, className, ...props }: LabelProps) => {
    return (
        <label {...props} className={classNames("block w-full flex-1 text-xs leading-loose", className)}>
            {children}
        </label>
    );
};

export const FormInput = <TItem, TKey extends keyof TItem>({
    label,
    description,
    name,
    render,
    className,
}: {
    label: string;
    description: string;
    name: TKey;
    className?: string;
    render: ({ ...agrs }: InputProps<TItem, TKey>) => React.ReactNode;
}) => {
    const t = useTranslations();
    return (
        <FormContext.Consumer>
            {({ formValues, formErrors, handleChange }) => (
                <div className={`flex items-center ${className ?? ""}`}>
                    <Label>
                        <div className="mb-0.5 font-semibold">{label}</div>
                        {render({ name, onChange: e => handleChange(name, e.target.value), value: formValues[name] })}
                        <div className="text-right text-xs font-medium text-red-600 opacity-75">
                            {formErrors[name]?.map(err => t(err as any, { path: label }))}&nbsp;
                        </div>
                    </Label>
                    <p className="mx-4 flex-1 text-xs font-medium text-zinc-400">{description}</p>
                </div>
            )}
        </FormContext.Consumer>
    );
};

export const SmallFormInput = <TItem, TKey extends keyof TItem>({
    label,
    name,
    render,
    className,
}: {
    label: string;
    name: TKey;
    className?: string;
    render: ({ ...agrs }: InputProps<TItem, TKey>) => React.ReactNode;
}) => {
    const t = useTranslations();
    return (
        <FormContext.Consumer>
            {({ formValues, formErrors, handleChange }) => (
                <div className={`flex flex-col ${className ?? ""}`}>
                    <Label>
                        {label}
                        {render({ name, onChange: e => handleChange(name, e.target.value), value: formValues[name] })}
                    </Label>
                    <div className="text-right text-xs font-medium text-red-600 opacity-75">
                        {formErrors[name]?.map(err => t(err as any, { path: label }))}&nbsp;
                    </div>
                </div>
            )}
        </FormContext.Consumer>
    );
};

export const FormCard = ({ children, title }: { children: React.ReactNode; title: string }) => (
    <div className="flex flex-col rounded-md border border-zinc-100 bg-white px-6 py-4 shadow-sm">
        <SectionHeader title={title}></SectionHeader>
        {children}
    </div>
);

export function Form<TItem extends object>({
    children,
    initialValues,
    onSubmit,
    validationSchema,
}: { children: React.ReactNode } & FormStateProps<TItem>) {
    const { formValues, formErrors, handleSubmit, handleChange } = useForm({ initialValues, onSubmit, validationSchema });

    return (
        <form className="w-full" onSubmit={handleSubmit}>
            <FormContext.Provider value={{ formValues, formErrors, handleChange }}>{children}</FormContext.Provider>
        </form>
    );
}
