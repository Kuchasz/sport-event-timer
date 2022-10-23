import type { GetInferenceHelpers } from "@trpc/server";
import type { AppRouter } from "./server/routers/app";

export type AppRouterTypes = GetInferenceHelpers<AppRouter>;
