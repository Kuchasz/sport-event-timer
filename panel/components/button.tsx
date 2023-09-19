import { ButtonHTMLAttributes, DetailedHTMLProps } from "react";

type ButtonProps = DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> & { loading?: boolean, outline?: boolean };

export const Button = ({ outline, children, loading, className, ...props }: ButtonProps) => {
    const visuals = outline
        ? "bg-blue-100 text-blue-900 hover:bg-blue-200"
        : "bg-blue-500 text-white focus-visible:ring-blue-500 hover:bg-blue-600";

    const pointerEvents = loading ? "pointer-events-none" : "";

    const loadingVisuals = loading ? "opacity-0 pointer-events-none" : "";

    return (
        <button
            disabled={loading}
            type="button"
            {...props}
            className={`flex relative items-center justify-center rounded-full border border-transparent px-4 py-2 text-sm font-medium focus:outline-none focus-visible:ring-2  focus-visible:ring-offset-2 ${visuals} ${pointerEvents} ${className}`}
        >
            {loading && <LoadingSpin className="absolute h-6 w-full opacity-50" />}
            <div className={`flex items-center ${loadingVisuals}`}>{children}</div>
        </button>
    );
};

const LoadingSpin = ({ className }: { className: string }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32" fill="#1e3a8a">
        <path opacity=".25" d="M16 0 A16 16 0 0 0 16 32 A16 16 0 0 0 16 0 M16 4 A12 12 0 0 1 16 28 A12 12 0 0 1 16 4" />
        <path d="M16 0 A16 16 0 0 1 32 16 L28 16 A12 12 0 0 0 16 4z">
            <animateTransform attributeName="transform" type="rotate" from="0 16 16" to="360 16 16" dur="0.8s" repeatCount="indefinite" />
        </path>
    </svg>
);
