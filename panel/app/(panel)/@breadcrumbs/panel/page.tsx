import { Breadcrumbs } from "components/breadcrumbs";
import { Route } from "next";

export default () => (
    <Breadcrumbs>
        <Breadcrumbs.Item href={`/panel` as Route} text="dashboard"></Breadcrumbs.Item>
    </Breadcrumbs>
);
