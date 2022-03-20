import { Footer } from "./footer";
import { Header } from "./header";
import { Meta } from "./meta";

type Props = {
    preview?: boolean;
    children: React.ReactNode;
};

const Layout = ({ children }: Props) => {
    return (
        <>
            <Meta />
            <Header />
            <main className="flex-grow text-zinc-900">{children}</main>
            <Footer />
        </>
    );
};

export default Layout;
