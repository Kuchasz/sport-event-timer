import { hubUrl } from "./connection";

export const getCurrentTimeOffset = (): Promise<number> => {
    return new Promise<number>(async (res) => {
        const clientSendTime = Date.now();
        const { diff, serverTime } = await fetch(`${hubUrl}/current-time/${clientSendTime}`).then((x) => x.json());
        const clientResponseTime = Date.now();
        const serverClientResponseDiffTime = clientResponseTime - serverTime;

        res((diff - clientResponseTime + clientSendTime - serverClientResponseDiffTime) / 2);
    });
};
