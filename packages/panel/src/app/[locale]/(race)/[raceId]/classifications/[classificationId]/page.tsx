import { authenticate } from "src/auth";
import { ClassificationCategories } from "./classification-categories";

export default async function () {
    await authenticate();
    return <ClassificationCategories />;
}
