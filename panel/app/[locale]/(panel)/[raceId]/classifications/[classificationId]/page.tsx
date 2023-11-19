import { authenticate } from "auth";
import { ClassificationCategories } from "./classification-categories";

export default async function () {
    await authenticate();
    return <ClassificationCategories />;
}
