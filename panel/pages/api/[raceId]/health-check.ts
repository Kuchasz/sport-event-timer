import { withRaceApiKey } from "auth";
import type { NextApiRequest, NextApiResponse } from "next";
import { withExceptionHandling } from "exceptions";

const getHealthCheck = (_: NextApiRequest, res: NextApiResponse) => {
    const healthCheckResult = { status: "ok" };
    res.json(healthCheckResult);
};

export default withRaceApiKey(withExceptionHandling(getHealthCheck));
