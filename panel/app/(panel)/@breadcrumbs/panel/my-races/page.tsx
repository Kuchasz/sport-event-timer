import { Breadcrumbs } from "components/breadcrumbs";
import { Route } from "next";

export default () => (
    <Breadcrumbs>
        <Breadcrumbs.Item href={`/panel/my-races` as Route} text="my races"></Breadcrumbs.Item>
    </Breadcrumbs>
);
