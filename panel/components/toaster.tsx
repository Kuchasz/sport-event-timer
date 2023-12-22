"use client";

import { mdiAlertCircleOutline, mdiAlertOutline, mdiCheckCircleOutline, mdiInformationSlabCircleOutline } from "@mdi/js";
import Icon from "@mdi/react";
import { Toast, ToastClose, ToastDescription, ToastProvider, ToastTitle, ToastViewport, getColorFromVariant } from "./toast";
import { useToast } from "./use-toast";
import classNames from "classnames";

const getIconFromVariant = (variant: "default" | "destructive" | "dangerous" | "positive") => {
    if (variant === "default") return mdiInformationSlabCircleOutline;
    if (variant === "destructive") return mdiAlertCircleOutline;
    if (variant === "dangerous") return mdiAlertOutline;
    return mdiCheckCircleOutline;
};

export function Toaster() {
    const { toasts } = useToast();

    return (
        <ToastProvider duration={4000}>
            {toasts.map(function ({ id, title, description, action, ...props }) {
                return (
                    <Toast key={id} {...props}>
                        <div className="grid gap-1" style={{ gridTemplateColumns: "auto minmax(0, 1fr)" }}>
                            <span className="row-span-2 mr-4 flex items-center">
                                <span className={classNames("rounded-md p-1", getColorFromVariant(props.variant ?? "default"))}>
                                    <Icon
                                        className="box-border text-white"
                                        path={getIconFromVariant(props.variant ?? "default")}
                                        size={1}></Icon>
                                </span>
                            </span>
                            <span className="col-start-2 row-start-1">{title && <ToastTitle>{title}</ToastTitle>}</span>
                            <span className="col-start-2 row-start-2">
                                {description && <ToastDescription>{description}</ToastDescription>}
                            </span>
                        </div>
                        {action}
                        <ToastClose />
                    </Toast>
                );
            })}
            <ToastViewport />
        </ToastProvider>
    );
}
