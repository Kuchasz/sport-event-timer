// src/pages/api/examples.ts
import type { NextApiRequest, NextApiResponse } from "next";

const results = async (req: NextApiRequest, res: NextApiResponse) => {
    // const resp = await fetch(`http://localhost:3000/posts/1`);
    // const data = await res.json();

    res.status(200).json(resp);
};

export default results;
