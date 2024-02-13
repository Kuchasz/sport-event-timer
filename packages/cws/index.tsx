import { Hono } from "hono";
import { Page } from "./components/page";
const app = new Hono();

app.get("/text", c => c.text("Hono!"));
app.get("/json", c => c.json({ name: "Hono!", age: 12, from: 222 }));
app.get("/html", c => c.html("<h1>Hono!</h1>"));
app.get("/react", c => {
    const messages = ["Good Morning", "Good Evening", "Good Night"];
    return c.html(<Page messages={messages} />);
});

export default app;
