"use client";

import { Dialog, Transition } from "@headlessui/react";
import { useTranslations } from "next-intl";
import React, { Fragment, useState } from "react";
import { Button } from "./button";

type ConfirmationProps = {
    title: string;
    description?: string;
    message: string;
    onAccept: () => void;
    children: React.ReactElement;
};

export const ConfirmationModal = ({ onAccept, title, description, message, children }: ConfirmationProps) => {
    const [modalOpen, setModalOpen] = useState<boolean>(false);
    const t = useTranslations();

    return (
        <>
            <span onClick={() => setModalOpen(!modalOpen)}>{children}</span>
            <Transition appear show={modalOpen} as={Fragment}>
                <Dialog as="div" className="relative z-20" onClose={() => setModalOpen(false)}>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0">
                        <div className="fixed inset-0 bg-black bg-opacity-25" />
                    </Transition.Child>
                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4 text-center">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95">
                                <Dialog.Panel className="w-full max-w-3xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                                    <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                                        {title}
                                    </Dialog.Title>
                                    <Dialog.Description>{description}</Dialog.Description>
                                    <div className="mt-2">
                                        <div className="flex flex-col">
                                            <div className="flex">
                                                <span>{message}</span>
                                            </div>
                                            <div className="mt-4 flex justify-between">
                                                <Button onClick={() => setModalOpen(false)} outline>
                                                    {t("shared.cancel")}
                                                </Button>
                                                <Button
                                                    onClick={() => {
                                                        onAccept();
                                                        setModalOpen(false);
                                                    }}>
                                                    {t("shared.ok")}
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </>
    );
};

type ResolvableModalComponentProps<P> = { onResolve: (value: P) => void };
type ResolvableModalComponent<T, P> = React.FunctionComponent<T & ResolvableModalComponentProps<P>>;

type ModalProps<T, P> = {
    title: string;
    description?: string;
    onResolve: (data: P) => void;
    children: React.ReactElement;
    component: ResolvableModalComponent<T, P>;
    componentProps: T;
};

export const ModalModal = <T, P>({ onResolve, title, description, children, component: Content, componentProps }: ModalProps<T, P>) => {
    const [modalOpen, setModalOpen] = useState<boolean>(false);

    const resolveInternal = (data: P) => {
        setModalOpen(false);
        onResolve(data);
    };

    const rejectInternal = () => {
        setModalOpen(false);
    };

    return (
        <>
            <span onClick={() => setModalOpen(!modalOpen)}>{children}</span>
            <Transition appear show={modalOpen} as={Fragment}>
                <Dialog as="div" className="relative z-10" onClose={() => setModalOpen(false)}>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0">
                        <div className="fixed inset-0 bg-black bg-opacity-25" />
                    </Transition.Child>
                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4 text-center">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95">
                                <Dialog.Panel className="w-full max-w-3xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                                    <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                                        {title}
                                    </Dialog.Title>
                                    <Dialog.Description>{description}</Dialog.Description>
                                    <div className="mt-2">
                                        <Content {...componentProps} onResolve={resolveInternal} onReject={rejectInternal} />
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </>
    );
};
