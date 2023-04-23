import { getServerSession } from "next-auth";

export default () => <></>;

export function getServerSideProps() {
    const session = getServerSession();

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
