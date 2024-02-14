import type { FC } from "hono/jsx";

export const Page: FC<{ messages: string[] }> = (props: { messages: string[] }) => {
    return (
        <>
            <h1>hono.js react rendering tests</h1>
            <ul>
                {props.messages.map(message => {
                    return <li>{message}!!</li>;
                })}
            </ul>
        </>
    );
};
