import { authenticate } from "src/auth";
import { Players } from "./players";
import { StandardPage } from "src/components/pages";

export default async function () {
    await authenticate();
    return (
        <StandardPage>
            <Players />
        </StandardPage>
    );
}
