"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { trpc } from "trpc-core";
import { useState } from "react";
import { connectionConfig } from "connection";

export const TrpcProvider: React.FC<{ children: React.ReactNode; enableSubscriptions: boolean }> = p => {
    const [queryClient] = useState(() => new QueryClient());
    const [trpcClient] = useState(() => trpc.createClient(connectionConfig(queryClient, p.enableSubscriptions)));

    return (
        <trpc.Provider client={trpcClient} queryClient={queryClient}>
            <QueryClientProvider client={queryClient}>{p.children}</QueryClientProvider>
        </trpc.Provider>
    );
};
