import type { NextApiRequest, NextApiResponse } from "next";

export const withExceptionHandling =
    (next: (req: NextApiRequest, res: NextApiResponse) => void) => async (req: NextApiRequest, res: NextApiResponse) => {
        try {
            await next(req, res);
        } catch {
            res.status(500).send("An error occured during processing your request!");
        }
    };
