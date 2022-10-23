import { createNextApiHandler } from "@trpc/server/adapters/next";
import { appRouter } from "server/routers/app";
import { createContext } from "server/trpc";
// import { appRouter } from "../../../server/trpc/router/_app";
// import { createContext } from "../../../server/trpc/context";
// import { env } from "../../../env/server.mjs";

// export API handler
export default createNextApiHandler({
  router: appRouter,
  createContext,
  onError:({ path, error }) => {
    console.error(`❌ tRPC failed on ${path}: ${error}`);
  }
    // env.NODE_ENV === "development"
    //   ? ({ path, error }) => {
    //       console.error(`❌ tRPC failed on ${path}: ${error}`);
    //     }
    //   : undefined,
});
