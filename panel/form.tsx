import { Label } from "components/label";
import React, { ReactNode, createContext } from "react";
import { ZodObject, ZodType } from "zod";

type FormValues = { [k: string]: string | number | Date };
type FormErrors = { [k: string]: string[] | undefined };

type FormStateProps = {
    initialValues: FormValues;
    onSubmit: (values: FormValues) => void;
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

const useForm = ({ initialValues, onSubmit, validationSchema }: FormStateProps) => {
    const [formValues, setFormValues] = React.useState<FormValues>(initialValues);
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

// function applyFormPropsToFormInputs(
//     values: FormValues,
//     errors: FormErrors,
//     handleChange: (name: string, value: string) => void,
//     children: ReactNode
// ): ReactNode {
//     return React.Children.map(children, (child, key) => {
//         if (React.isValidElement(child)) {
//             const { type } = child;
//             const { originalComponentType, name, children, ...props } = child.props;
//             console.log(originalComponentType, originalComponentType == FormInput, type == FormInput, type);
//             if (originalComponentType == FormInput || type == FormInput) {
//                 return React.cloneElement(child, {
//                     ...props,
//                     key,
//                     value: values[name],
//                     error: errors[name],
//                     // onChange: (e: { target: { value: string } }) => handleChange(child.props.name, e.target.value),
//                     handleChange,
//                     children: applyFormPropsToFormInputs(values, errors, handleChange, children),
//                     originalComponentType: FormInput,
//                 } as any);
//             } else {
//                 return React.cloneElement(child, {
//                     children: applyFormPropsToFormInputs(values, errors, handleChange, child.props.children),
//                 } as any);
//             }
//         } else {
//             return child;
//         }
//     });
// }

export function Form({ children, initialValues, onSubmit, validationSchema }: { children: ReactNode } & FormStateProps) {
    const { formValues, formErrors, handleSubmit, handleChange } = useForm({ initialValues, onSubmit, validationSchema });

    // const formAppliedChildren = applyFormPropsToFormInputs(formValues, formErrors, handleChange, children);
    return (
        <form onSubmit={handleSubmit}>
            <FormContext.Provider value={{ formValues, formErrors, handleChange }}>{children}</FormContext.Provider>
            <div>
                <button type="submit">SEND</button>
            </div>

            <div className="text-2xs opacity-50">{JSON.stringify(formValues)}</div>
        </form>
    );
}
