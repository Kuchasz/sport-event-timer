import { Hono } from "hono";
import { Page } from "./components/page";
import { html } from "hono/html";
import { Layout } from "./components/layout";
const app = new Hono();

const messages = Array.from(Array(1000).keys()).map(i => `Good Morning ${i}`);

app.get("/text", c => c.text("Hono!"));
app.get("/json", c => c.json({ name: "Hono!", age: 12, from: 222 }));
app.get("/html", c => {
    return c.html(`<h1>${messages.map(m => html`<li>${m}</li>`)}</h1>`);
});
app.get("/react", c => {
    return c.html(
        <Layout>
            <Page title="awdawd" id={234} />
        </Layout>,
    );
});

export default app;
