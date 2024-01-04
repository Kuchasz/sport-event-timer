"use client";

import { MutationCache, QueryCache, QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { trpc } from "trpc-core";
import { useState } from "react";
import { connectionConfig } from "connection";
import { toast } from "components/use-toast";
import { type TRPCClientError } from "@trpc/client";
import { type AppRouter } from "server/routers/app";
import { useTranslations } from "next-intl";

export const TrpcProvider: React.FC<{ children: React.ReactNode; enableSubscriptions: boolean; toastConfirmations: boolean }> = p => {
    const t = useTranslations();
    const [queryClient] = useState(
        () =>
            new QueryClient({
                mutationCache: new MutationCache({
                    onError: _e => {
                        const e = _e as TRPCClientError<AppRouter>;

                        if (e.data?.domainErrorKey)
                            toast({
                                title: t("shared.errorOccured"),
                                description: t(e.data.domainErrorKey as any),
                                variant: "destructive",
                            });
                        else
                            toast({
                                title: t("shared.errorOccured"),
                                description: t("shared.generalError"),
                                variant: "destructive",
                            });
                    },
                    onSuccess: (_, __, ___, mutation) => {
                        if (!p.toastConfirmations || mutation.options.mutationKey?.length !== 1) return;
                        const key = mutation.options.mutationKey[0] as string[];
                        const mutationKey = key.join(".");

                        toast({
                            title: t(`mutations.${mutationKey}.title` as any),
                            description: t(`mutations.${mutationKey}.description` as any),
                            variant: "positive",
                        });
                    },
                }),
                queryCache: new QueryCache({
                    onError: _e => {
                        const e = _e as TRPCClientError<AppRouter>;

                        if (e.data?.domainErrorKey)
                            toast({
                                title: t("shared.errorOccured"),
                                description: t(e.data.domainErrorKey as any),
                                variant: "destructive",
                            });
                        else
                            toast({
                                title: t("shared.errorOccured"),
                                description: t("shared.generalError"),
                                variant: "destructive",
                            });
                    },
                }),
            }),
    );
    const [trpcClient] = useState(() => trpc.createClient(connectionConfig(p.enableSubscriptions)));

    return (
        <trpc.Provider client={trpcClient} queryClient={queryClient}>
            <QueryClientProvider client={queryClient}>{p.children}</QueryClientProvider>
        </trpc.Provider>
    );
};
