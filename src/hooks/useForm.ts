import { useState, useCallback } from 'react';
import { z } from 'zod';

interface UseFormProps<T> {
    initialValues: T;
    validationSchema: z.ZodType<T>;
    onSubmit: (values: T) => void | Promise<void>;
}

interface FormState<T> {
    values: T;
    errors: Partial<Record<keyof T, string>>;
    touched: Partial<Record<keyof T, boolean>>;
    isSubmitting: boolean;
}

export function useForm<T extends Record<string, any>>({
    initialValues,
    validationSchema,
    onSubmit,
}: UseFormProps<T>) {
    const [state, setState] = useState<FormState<T>>({
        values: initialValues,
        errors: {},
        touched: {},
        isSubmitting: false,
    });

    const validateField = useCallback(
        (name: keyof T, value: any) => {
            try {
                validationSchema.parse({ ...state.values, [name]: value });
                return '';
            } catch (error) {
                if (error instanceof z.ZodError) {
                    const fieldError = error.errors.find((err: z.ZodIssue) => err.path[0] === name);
                    return fieldError?.message || '';
                }
                return '';
            }
        },
        [state.values, validationSchema]
    );

    const handleChange = useCallback(
        (name: keyof T, value: any) => {
            const error = validateField(name, value);
            setState((prev) => ({
                ...prev,
                values: { ...prev.values, [name]: value },
                errors: { ...prev.errors, [name]: error },
                touched: { ...prev.touched, [name]: true },
            }));
        },
        [validateField]
    );

    const handleBlur = useCallback(
        (name: keyof T) => {
            const error = validateField(name, state.values[name]);
            setState((prev) => ({
                ...prev,
                errors: { ...prev.errors, [name]: error },
                touched: { ...prev.touched, [name]: true },
            }));
        },
        [validateField, state.values]
    );

    const handleSubmit = useCallback(
        async (e?: React.FormEvent) => {
            if (e) {
                e.preventDefault();
            }

            // Validate all fields
            try {
                validationSchema.parse(state.values);
                setState((prev) => ({ ...prev, isSubmitting: true }));
                await onSubmit(state.values);
            } catch (error) {
                if (error instanceof z.ZodError) {
                    const newErrors: Partial<Record<keyof T, string>> = {};
                    error.errors.forEach((err: z.ZodIssue) => {
                        const field = err.path[0] as keyof T;
                        newErrors[field] = err.message;
                    });
                    setState((prev) => ({
                        ...prev,
                        errors: newErrors,
                        touched: Object.keys(state.values).reduce(
                            (acc, key) => ({ ...acc, [key]: true }),
                            {}
                        ),
                    }));
                }
            } finally {
                setState((prev) => ({ ...prev, isSubmitting: false }));
            }
        },
        [state.values, validationSchema, onSubmit]
    );

    const reset = useCallback(() => {
        setState({
            values: initialValues,
            errors: {},
            touched: {},
            isSubmitting: false,
        });
    }, [initialValues]);

    return {
        values: state.values,
        errors: state.errors,
        touched: state.touched,
        isSubmitting: state.isSubmitting,
        handleChange,
        handleBlur,
        handleSubmit,
        reset,
    };
} 