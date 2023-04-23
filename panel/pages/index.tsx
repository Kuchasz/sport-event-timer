import { getSession } from "next-auth/react";

export default () => <></>;

export function getServerSideProps() {
    const session = getSession();

    if (!session)
        return {
            redirect: {
                destination: "/auth/signin",
                permanent: false,
            },
        };

    return {
        redirect: {
            destination: "/panel",
            permanent: false,
        },
    };
}
