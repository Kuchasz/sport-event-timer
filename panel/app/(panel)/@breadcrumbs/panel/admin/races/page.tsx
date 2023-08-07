import { Breadcrumbs } from "components/breadcrumbs";

export default () => (
    <Breadcrumbs>
        <Breadcrumbs.Item href={`/panel/admin`} text="admin"></Breadcrumbs.Item>
        <Breadcrumbs.Item href={`/panel/admin/races`} text="races"></Breadcrumbs.Item>
    </Breadcrumbs>
);
