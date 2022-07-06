import { createReactQueryHooks } from "@trpc/react";
import type { AppRouter } from "@set/server/router";

export const trpc = createReactQueryHooks<AppRouter>();
