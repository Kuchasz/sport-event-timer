import { authenticate } from "src/auth";
import { BibNumbers } from "./bib-numbers";

export default async function () {
    await authenticate();
    return <BibNumbers />;
}
