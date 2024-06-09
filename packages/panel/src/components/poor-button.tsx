"use client";

import { cva, type VariantProps } from "cva";
import type { ButtonHTMLAttributes, DetailedHTMLProps } from "react";
import React from "react";
import { useDeferredValue } from "src/hooks";
import { Button } from "./ui/button";
import { PoorLoadingSpinner } from "./poor-loading-spinner";

const buttonStyles = cva(
    [
        "relative",
        "flex",
        "items-center",
        "justify-center",
        "rounded-full",
        "border",
        "border-transparent",
        "font-medium",
        "transition-all",
        "focus:outline-none",
        "focus-visible:ring-2",
        "focus-visible:ring-offset-2",
    ],
    {
        variants: {
            kind: {
                default: "",
                delete: "",
            },
            outline: {
                true: "",
                false: "",
            },
            small: {
                true: "text-xs px-2 py-1",
                false: "text-sm px-4 py-2",
            },
            isLoading: {
                true: "pointer-events-none",
                false: "",
            },
        },
        compoundVariants: [
            {
                outline: false,
                kind: "delete",
                className: ["bg-red-500 text-white focus-visible:ring-red-500 hover:bg-red-600"],
            },
            {
                outline: true,
                kind: "delete",
                className: ["bg-red-100 text-red-900 hover:bg-red-200"],
            },
            {
                outline: false,
                kind: "default",
                className: ["bg-blue-500 text-white focus-visible:ring-blue-500 hover:bg-blue-600"],
            },
            {
                outline: true,
                kind: "default",
                className: ["bg-blue-100 text-blue-900 hover:bg-blue-200"],
            },
        ],
        defaultVariants: {
            isLoading: false,
            kind: "default",
            outline: false,
            small: false,
        },
    },
);

type ButtonProps = DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> &
    VariantProps<typeof buttonStyles> & {
        loading?: boolean;
    };

export const PoorButton = ({ outline, small, children, loading, className, kind, ref: _ref, ...props }: ButtonProps) => {
    const isLoading = useDeferredValue(loading);

    const loadingVisuals = isLoading ? "opacity-0 pointer-events-none" : "";

    return (
        <Button
            disabled={loading}
            onClick={loading ? () => null : props.onClick}
            type="button"
            {...props}
            className={`${buttonStyles({ kind, outline, small, isLoading })} ${className}`}>
            {isLoading && <PoorLoadingSpinner fill={outline ? "#1e3a8a" : "white"} className="absolute h-6 w-full opacity-50" />}
            <div className={`flex items-center transition-all ${loadingVisuals}`}>{children}</div>
        </Button>
    );
};
