import { withRaceApiKey } from "auth";
import { NextApiRequest, NextApiResponse } from "next";
import { withExceptionHandling } from "exceptions";

const getHealthCheck = async (_: NextApiRequest, res: NextApiResponse) => {

    const healthCheckResult = { status: 'ok' };
    res.json(healthCheckResult);
}

export default withRaceApiKey(withExceptionHandling(getHealthCheck));