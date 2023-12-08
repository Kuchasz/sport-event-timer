"use client";

import { MutationCache, QueryCache, QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { trpc } from "trpc-core";
import { useState } from "react";
import { connectionConfig } from "connection";
import { toast } from "components/use-toast";
import { type TRPCClientError } from "@trpc/client";
import { type AppRouter } from "server/routers/app";

export const TrpcProvider: React.FC<{ children: React.ReactNode; enableSubscriptions: boolean }> = p => {
    const [queryClient] = useState(
        () =>
            new QueryClient({
                mutationCache: new MutationCache({
                    onError: _e => {
                        const e = _e as TRPCClientError<AppRouter>;
                        toast({ title: "Error occured", description: e.message, variant: "destructive" });
                    },
                }),
                queryCache: new QueryCache({ onError: console.log }),
            }),
    );
    const [trpcClient] = useState(() => trpc.createClient(connectionConfig(p.enableSubscriptions)));

    return (
        <trpc.Provider client={trpcClient} queryClient={queryClient}>
            <QueryClientProvider client={queryClient}>{p.children}</QueryClientProvider>
        </trpc.Provider>
    );
};
