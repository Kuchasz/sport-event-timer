import { Label } from "components/label";
import React, { ReactNode, createContext } from "react";
import { ZodObject, ZodType } from "zod";

type FormValues = { [k: string]: string | number | Date };
type FormErrors = { [k: string]: string[] | undefined };

type FormStateProps<TItem extends FormValues> = {
    initialValues: TItem;
    onSubmit: (values: TItem) => void;
    validationSchema: ZodObject<Record<string, ZodType<any, any>>>;
};

type FormContextType = {
    formValues: FormValues;
    formErrors: FormErrors;
    handleChange: (name: string, value: string | number | Date) => void;
};

const FormContext = createContext<FormContextType>({
    formValues: {},
    formErrors: {},
    handleChange: () => {},
});

const useForm = <TItem extends FormValues>({ initialValues, onSubmit, validationSchema }: FormStateProps<TItem>) => {
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

type InputProps = {
    name: string;
    onChange: (e: { target: { value: string | number | Date } }) => void;
    value: string | number | Date;
};

type FormInputProps = {
    label: string;
    name: string;
    render: ({ ...agrs }: InputProps) => React.ReactNode;
};

export const FormInput = ({ label, name, render }: FormInputProps) => {
    return (
        <FormContext.Consumer>
            {({ formValues, formErrors, handleChange }) => (
                <div className="flex flex-col">
                    <Label>{label}</Label>
                    {render({ name, onChange: e => handleChange(name, e.target.value), value: formValues[name] })}
                    <div className="text-xs text-right font-medium opacity-75 text-red-600">{formErrors[name]}&nbsp;</div>
                </div>
            )}
        </FormContext.Consumer>
    );
};

export function Form<TItem extends FormValues>({
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
