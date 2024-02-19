import { Hono } from "hono";
import { PageDotnet } from "./components/page-dotnet";
import { PageTrpc } from "./components/page-trpc";
import { html } from "hono/html";
import { Layout } from "./components/layout";
const app = new Hono();

const messages = Array.from(Array(1000).keys()).map(i => `Good Morning ${i}`);

app.get("/text", c => c.text("Hono!"));
app.get("/json", c => c.json({ name: "Hono!", age: 12, from: 222 }));
app.get("/html", c => {
    return c.html(`<h1>${messages.map(m => html`<li>${m}</li>`)}</h1>`);
});
app.get("/results/15/31/new", c => {
    return c.html(
        <Layout>
            <PageDotnet title="awdawd" id={234} />
        </Layout>,
    );
});
app.get("/results/15/31", c => {
    return c.html(
        <Layout>
            <PageTrpc title="awdawd" id={234} />
        </Layout>,
    );
});

export default {
    port: 3003,
    fetch: app.fetch,
};
