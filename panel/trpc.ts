import type { inferRouterInputs, inferRouterOutputs } from '@trpc/server';
import type { AppRouter } from "./server/routers/app";

export type AppRouterOutputs = inferRouterOutputs<AppRouter>;
export type AppRouterInputs = inferRouterInputs<AppRouter>;