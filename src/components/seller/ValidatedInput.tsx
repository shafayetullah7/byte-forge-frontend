import { Input } from "~/components/ui";

interface ValidatedInputProps {
    label: string;
    type: string;
    value: string;
    onInput: (e: Event) => void;
    placeholder?: string;
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    error?: string;
    hint?: string;
}

/**
 * ValidatedInput - A reusable input component with error display
 *
 * Wraps the base Input component and displays validation errors and hints.
 * Error messages take precedence over hints when present.
 */
export const ValidatedInput = (props: ValidatedInputProps) => {
    return (
        <div>
            <Input
                label={props.label}
                type={props.type}
                required={props.required}
                minLength={props.minLength}
                maxLength={props.maxLength}
                value={props.value}
                onInput={props.onInput}
                placeholder={props.placeholder}
                error={props.error}
            />
            {props.error ? (
                <p class="mt-1 text-sm text-red-600 dark:text-red-400">{props.error}</p>
            ) : props.hint ? (
                <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">{props.hint}</p>
            ) : null}
        </div>
    );
};
