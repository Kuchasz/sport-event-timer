import type { FC } from "hono/jsx";
import { Layout } from "./layout";

export const Page: FC<{ messages: string[] }> = (props: { messages: string[] }) => {
    return (
        <Layout>
            <h1 className="font-semibold">hono.js react rendering tests</h1>
            <ul>
                {props.messages.map(message => {
                    return <li className="text-sm">{message}!!</li>;
                })}
            </ul>
        </Layout>
    );
};
