"use client";

import type { ComponentType } from "react";
import { Fragment } from "react";
import { Demodal, useModal } from "demodal";
import { Dialog, Transition } from "@headlessui/react";

type ResolvableComponentProps<P> = { onResolve: (value: P) => void; onReject: () => void };
type ResolvableComponent<P> = ComponentType<ResolvableComponentProps<P>>;
type ResolvableModalProps<P> = {
    title: string;
    description?: string;
    component: ResolvableComponent<P>;
    props: ResolvableComponentProps<P>;
};

export const NiceModal = Demodal.create(<P,>({ title, description, component: Content, props }: ResolvableModalProps<P>) => {
    const modal = useModal();

    const reject = () => {
        modal.resolve(undefined);
        modal.close();
    };

    const resolve = (value: P) => {
        modal.resolve(value);
        modal.close();
    };

    return (
        <>
            <Transition appear show={modal.isOpen} as={Fragment}>
                <Dialog as="div" className="relative z-10" onClose={reject}>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
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
                                leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel className="w-full max-w-3xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                                    <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                                        {title}
                                    </Dialog.Title>
                                    <Dialog.Description>{description}</Dialog.Description>
                                    <div className="mt-2">
                                        <Content {...props} onResolve={resolve} onReject={reject} />
                                        {/* <p className="text-sm text-gray-500">
                                            Your payment has been successfully submitted. We’ve sent you an email with
                                            all of the details of your order.
                                        </p> */}
                                    </div>
                                    {/* 
                                    <div className="mt-4">
                                        <button
                                            type="button"
                                            className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                                            onClick={resolve}
                                        >
                                            Got it, thanks!
                                        </button>
                                    </div> */}
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </>
    );
});
