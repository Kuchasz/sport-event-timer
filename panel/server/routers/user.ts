// import * as trpc from "@trpc/server";
// import { EventEmitter } from "events";
// import { z } from "zod";

// // app.post("/log-in", async (req: TypedRequestBody<UserCredentials>, res: Response) => {
// //     try {
// //         const tokens = await login(req.body);
// //         const result = {
// //             authToken: tokens.encodedToken,
// //             issuedAt: tokens.iat,
// //             expireDate: tokens.exp
// //         };

// //         res.cookie(config.auth.cookieName, result.authToken, {
// //             httpOnly: true,
// //             maxAge: config.auth.maxAge * 1000
// //         });

// //         res.json(result);
// //         return;
// //     } catch (err) {
// //         console.log(err);
// //     }

// //     res.sendStatus(401);
// // });

// export const actionRouter = trpc
//     .router()
//     .mutation("dispatch", {
//         input: z.object({
//             action: z.any()
//         }),
//         resolve({ input }) {
//             console.log(input.action);
//             ee.emit("dispatch", input.action);
//             return "OK";
//         }
//     })
//     .subscription("onDispatched", {
//         resolve() {
//             return new trpc.Subscription<Action>(emit => {
//                 const onDispatched = (action: Action) => {
//                     emit.data(action);
//                 };

//                 ee.on("dispatch", onDispatched);

//                 return () => {
//                     ee.off("dispatch", onDispatched);
//                 };
//             });
//         }
//     });

// export type ActionRouter = typeof actionRouter;
