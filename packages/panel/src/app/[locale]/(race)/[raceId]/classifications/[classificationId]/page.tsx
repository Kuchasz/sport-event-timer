import { authenticate } from "src/auth";
import { ClassificationCategories } from "./classification-categories";
import { StandardPage } from "src/components/pages";

export default async function () {
    await authenticate();
    return (
        <StandardPage>
            <ClassificationCategories />
        </StandardPage>
    );
}
