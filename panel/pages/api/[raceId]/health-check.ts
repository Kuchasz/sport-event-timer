import { withRaceApiKey } from "auth";
import type { NextApiRequest, NextApiResponse } from "next";
import { withExceptionHandling } from "exceptions";

//eslint-disable-next-line @typescript-eslint/require-await
const getHealthCheck = async (_: NextApiRequest, res: NextApiResponse): Promise<void> => {
    const healthCheckResult = { status: "ok" };
    res.json(healthCheckResult);
};

export default withRaceApiKey(withExceptionHandling(getHealthCheck));
