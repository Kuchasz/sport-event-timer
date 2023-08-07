import { Breadcrumbs } from "components/breadcrumbs";
import { Route } from "next";

export default () => (
    <Breadcrumbs>
        <Breadcrumbs.Item href={`/panel/admin` as Route} text="admin"></Breadcrumbs.Item>
        <Breadcrumbs.Item href={`/panel/admin/accounts` as Route} text="accounts"></Breadcrumbs.Item>
    </Breadcrumbs>
);
