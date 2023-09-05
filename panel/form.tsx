import { Label } from "components/label";
import React, { ReactNode, createContext } from "react";
import { ZodObject, ZodType } from "zod";

// type FormValues = { [k: string]: any };
type FormErrors = { [k: string]: string[] | undefined };

type FormStateProps<TItem> = {
    initialValues: TItem;
    onSubmit: (values: TItem) => void;
    validationSchema: ZodObject<Record<string, ZodType<any, any>>>;
};

type FormContextType<TItem, TKey extends keyof TItem> = {
    formValues: TItem;
    formErrors: FormErrors;
    handleChange: (name: TKey, value: TItem[TKey]) => void;
};

const FormContext = createContext<FormContextType<any, any>>({
    formValues: {},
    formErrors: {},
    handleChange: () => {},
});

const useForm = <TItem extends {}>({ initialValues, onSubmit, validationSchema }: FormStateProps<TItem>) => {
    const [formValues, setFormValues] = React.useState<TItem>(initialValues);
    const [formErrors, setFormErrors] = React.useState<FormErrors>({});

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const validationResult = validationSchema.safeParse(formValues);
        if (!validationResult.success) {
            setFormErrors(validationResult.error.flatten().fieldErrors);
        } else {
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

type InputProps<TItem, TKey extends keyof TItem> = {
    name: TKey;
    onChange: (e: { target: { value: TItem[TKey] } }) => void;
    value: TItem[TKey];
};

// type FormInputProps<TItem, TKey extends keyof TItem> = {
//     label: string;
//     name: TKey;
//     render: ({ ...agrs }: InputProps<TItem, TKey>) => React.ReactNode;
// };

export const FormInput = <TItem, TKey extends keyof TItem>({
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
    return (
        <FormContext.Consumer>
            {({ formValues, formErrors, handleChange }) => (
                <div className={`flex flex-col ${className ?? ''}`}>
                    <Label>{label}</Label>
                    {render({ name, onChange: e => handleChange(name, e.target.value), value: formValues[name] })}
                    <div className="text-xs text-right font-medium opacity-75 text-red-600">{formErrors[name]}&nbsp;</div>
                </div>
            )}
        </FormContext.Consumer>
    );
};

export function Form<TItem extends {}>({
    children,
    initialValues,
    onSubmit,
    validationSchema,
}: { children: ReactNode } & FormStateProps<TItem>) {
    const { formValues, formErrors, handleSubmit, handleChange } = useForm({ initialValues, onSubmit, validationSchema });

    return (
        <form onSubmit={handleSubmit}>
            <FormContext.Provider value={{ formValues, formErrors, handleChange }}>{children}</FormContext.Provider>
        </form>
    );
}
