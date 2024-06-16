"use client";

import { useTranslations } from "next-intl";
import React, { useState } from "react";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { DialogOverlay } from "@radix-ui/react-dialog";

type PoorConfirmationProps = {
    title: string;
    description?: string;
    isLoading: boolean;
    message: string;
    onAccept: () => Promise<void>;
    children: React.ReactElement;
    destructive?: boolean;
};

export const PoorConfirmation = ({ onAccept, title, description, destructive, message, children }: PoorConfirmationProps) => {
    const [dialogOpen, setDialogOpen] = useState<boolean>(false);
    const t = useTranslations();

    return (
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>{description}</DialogDescription>
                </DialogHeader>
                <div className="flex items-center space-x-2">
                    <div className="grid flex-1 gap-2">{message}</div>
                </div>
                <DialogFooter className="sm:justify-start">
                    <Button
                        onClick={() => {
                            setDialogOpen(false);
                        }}>
                        {t("shared.cancel")}
                    </Button>
                    <Button
                        variant={destructive ? "destructive" : "default"}
                        // loading={isLoading}
                        onClick={async () => {
                            await onAccept();
                            setDialogOpen(false);
                        }}>
                        {t("shared.ok")}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

type ResolvableModalComponentProps<P> = { onResolve: (value: P) => void };
type ResolvableModalComponent<T, P> = React.FunctionComponent<T & ResolvableModalComponentProps<P>>;

type PoorModalProps<T, P> = {
    title: string;
    description?: string;
    onResolve: (data: P) => void;
    children: React.ReactElement;
    component: ResolvableModalComponent<T, P>;
    componentProps: T;
};

export const PoorModal = <T, P>({ onResolve, title, description, children, component: Content, componentProps }: PoorModalProps<T, P>) => {
    const [dialogOpen, setDialogOpen] = useState<boolean>(false);

    const resolveInternal = (data: P) => {
        setDialogOpen(false);
        onResolve(data);
    };

    const rejectInternal = () => {
        setDialogOpen(false);
    };

    return (
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogOverlay>
                <DialogContent className="flex max-h-full flex-col sm:max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>{title}</DialogTitle>
                        <DialogDescription>{description}</DialogDescription>
                    </DialogHeader>

                    <Content {...componentProps} onResolve={resolveInternal} onReject={rejectInternal} />

                    {/* <DialogFooter className="sm:justify-start">
                    <DialogClose asChild>
                        <Button type="button" variant="secondary">
                            Close
                        </Button>
                    </DialogClose>
                </DialogFooter> */}
                </DialogContent>
            </DialogOverlay>
        </Dialog>
    );
};
