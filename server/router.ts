import * as trpc from "@trpc/server";
import superjson from "superjson";
import { classificationRouter } from "./routers/classification";
import { playerRouter } from "./routers/player";
import { z } from "zod";

export const appRouter = trpc
    .router()
    .transformer(superjson)
    .merge("classification.", classificationRouter)
    .merge("player.", playerRouter);
// .query("getUser", {
//     input: z.string(),
//     async resolve(req) {
//         req.input; // string
//         return { id: req.input, name: "Bilbo" };
//     }
// })
// .query("getUsers", {
//     resolve() {
//         return users;
//     }
// })
// .mutation("createUser", {
//     // validate input with Zod
//     input: z.object({ name: z.string().min(5) }),
//     async resolve(req) {
//         return users.push(req.input.name);
//         // use your ORM of choice
//         // return await UserModel.create({
//         //     data: req.input
//         // });
//     }
// });

// export type definition of API
export type AppRouter = typeof appRouter;
