import { authenticate } from "src/auth";
import { PlayerRegistrations } from "./player-registrations";
import { StandardPage } from "src/components/pages";

export default async function () {
    await authenticate();
    return (
        <StandardPage>
            <PlayerRegistrations />
        </StandardPage>
    );
}
