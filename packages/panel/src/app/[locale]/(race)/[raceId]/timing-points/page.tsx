import { authenticate } from "src/auth";
import { TimingPoints } from "./timing-points";
import { StandardPage } from "src/components/pages";

export default async function () {
    await authenticate();

    return (
        <StandardPage>
            <TimingPoints />
        </StandardPage>
    );
}
