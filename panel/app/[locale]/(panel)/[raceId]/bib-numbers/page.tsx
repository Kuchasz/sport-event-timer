import { authenticate } from "auth";
import { BibNumbers } from "./bib-numbers";

export default async function () {
    await authenticate();
    return <BibNumbers />;
}
