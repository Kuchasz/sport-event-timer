import { authenticate } from "src/auth";
import { BibNumbers } from "./bib-numbers";
import { StandardPage } from "src/components/pages";

export default async function () {
    await authenticate();
    return (
        <StandardPage>
            <BibNumbers />
        </StandardPage>
    );
}
