import { fetchRequestHandler } from '@trpc/server/adapters/fetch';
import { appRouter } from 'server/routers/app';
import { createContext } from '../../../../server/trpc';

const handler = (request: Request, _response: Response) => {
    return fetchRequestHandler({
        endpoint: '/api/trpc',
        req: request,
        router: appRouter,
        batching: {
            enabled: true
        },
        createContext: createContext(false)
    });
}

export const GET = handler;
export const POST = handler;